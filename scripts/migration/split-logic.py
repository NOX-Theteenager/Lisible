"""Conversion unique : extrait la logique du design (<script type="text/x-dc">) en modules ES.
Usage : python3 scripts/split-logic.py public/index.html src"""
import re, sys, os

SRC, OUT = sys.argv[1], sys.argv[2]
html = open(SRC, encoding='utf-8').read()
js = re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>', html, re.S).group(1)
cls_at = js.index('class Component extends DCLogic')
top, cls = js[:cls_at], js[cls_at:]

MODULES = {
    'lib/utils.js': 'uid clone wc rel scoreColor slug esc lineDiff toMonths whenReady errMsg NT',
    'lib/cv.js': 'LABELS LABELS_EN labOf ORDER baseCv emptyCv anonCv contactLine dates secText cvText docModel docHtml findPh blankVersion',
    'lib/ats.js': 'STRONG DATE_RE firstWord isWeak hasNum analyze matchKw applyAdapt',
    'lib/templates.js': 'ACCENTS TPLS ATSB FONTS applyFont resolveTpl',
    'lib/content.js': 'HINTS TIPS LIB VERBS IMPORT_STEPS LEVELS_FR UI_FR UI_EN APP_COLS',
    'lib/letters.js': 'letterDiag splitLetter relanceMail',
    'lib/applications.js': 'parseFr dueOf',
    'lib/storage.js': 'KEY LS_ACCT settingsOf',
}
DOCS = {
    'lib/utils.js': 'Utilitaires génériques : identifiants, copies, dates relatives, texte.',
    'lib/cv.js': 'Modèle de CV : structure vide, anonymisation, texte ATS, export Word.',
    'lib/ats.js': 'Règles de conformité ATS, score, correspondance avec une offre.',
    'lib/templates.js': 'Modèles de mise en page du CV, couleurs et polices.',
    'lib/content.js': 'Contenus éditoriaux : conseils par section, bibliothèque de formulations, libellés.',
    'lib/letters.js': 'Lettres de motivation : diagnostic, découpage en-tête / corps, e-mail de relance.',
    'lib/applications.js': 'Suivi des candidatures : dates et relances.',
    'lib/storage.js': 'Persistance : clés de stockage local et préférences synchronisées.',
}
owner = {}
for mod, names in MODULES.items():
    for n in names.split():
        owner[n] = mod
owner['LEVELS_EN'] = 'lib/content.js'

# Découpe des déclarations de premier niveau (chacune commence en colonne 0).
starts = [m.start() for m in re.finditer(r'^(?:const|function|let) ', top, re.M)]
stmts = [top[a:b].rstrip() + '\n' for a, b in zip(starts, starts[1:] + [len(top)])]
def declared(st):
    m = re.match(r'(?:const|function|let)\s+([A-Za-z_$][\w$]*)', st)
    names = [m.group(1)]
    m2 = re.match(r'const [A-Za-z_$][\w$]*=\[[^\n]*?\],([A-Za-z_$][\w$]*)=', st)
    if m2: names.append(m2.group(1))
    return names

per_mod = {m: [] for m in MODULES}
for st in stmts:
    names = declared(st)
    mod = owner.get(names[0])
    if not mod:
        sys.exit('déclaration sans module : ' + names[0])
    per_mod[mod].append((names, st))

all_names = sorted(owner, key=len, reverse=True)
def uses(code, exclude=()):
    found = set()
    for n in all_names:
        if n in exclude: continue
        if re.search(r'(?<![\w$.])' + re.escape(n) + r'(?![\w$])', code):
            found.add(n)
    return found

def import_lines(used, from_mod):
    by = {}
    for n in sorted(used):
        by.setdefault(owner[n], []).append(n)
    lines = []
    for mod, ns in sorted(by.items()):
        if mod == from_mod: continue
        rel = os.path.relpath(os.path.join(OUT, mod), os.path.dirname(os.path.join(OUT, from_mod)))
        if not rel.startswith('.'): rel = './' + rel
        lines.append(f"import {{ {', '.join(ns)} }} from '{rel}';")
    return lines

for mod, items in per_mod.items():
    own = {n for names, _ in items for n in names}
    body = ''.join(('export ' + st) for _, st in items)
    imp = import_lines(uses(body, own), mod)
    path = os.path.join(OUT, mod)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(f"/* {DOCS[mod]} */\n" + ('\n'.join(imp) + '\n\n' if imp else '\n') + body)
    print('→', path, len(items), 'déclarations')

# Classe principale → composant React.
cls = cls.replace('class Component extends DCLogic {', 'export default class App extends React.Component {', 1)
cls = cls.rstrip()
assert cls.endswith('}')
cls = cls[:-1].rstrip() + '\n  render() {\n    return <AppView v={this.renderVals()} />;\n  }\n}\n'
imp = import_lines(uses(cls), 'App.jsx')
head = "/* Logique de l'application : état, actions et valeurs affichées par les écrans. */\nimport React from 'react';\nimport AppView from './AppView.jsx';\n"
open(os.path.join(OUT, 'App.jsx'), 'w', encoding='utf-8').write(head + '\n'.join(imp) + '\n\n' + cls)
print('→', os.path.join(OUT, 'App.jsx'))
