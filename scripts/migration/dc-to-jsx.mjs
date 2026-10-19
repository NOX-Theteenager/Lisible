/* Conversion unique du gabarit Claude Design (<x-dc>) en composants React (JSX).
   Usage : node scripts/dc-to-jsx.mjs <fichier.dc.html> <dossier src>
   Les liaisons {{ a.b }} deviennent v.a?.b (ou variable de boucle), sc-if/sc-for des conditions
   et des .map(), style="" des objets, style-hover/style-focus des classes générées par ps(). */
import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from 'htmlparser2';

const [, , SRC, OUT] = process.argv;
const html = fs.readFileSync(SRC, 'utf8');
const inner = html.slice(html.indexOf('<x-dc>') + 6, html.indexOf('</x-dc>'));
const doc = parseDocument(inner, { lowerCaseAttributeNames: false, lowerCaseTags: true, recognizeSelfClosing: true, decodeEntities: true });

const VOID = new Set(['input', 'img', 'br', 'hr', 'meta', 'link']);
const NO_WS = new Set(['select', 'ul', 'ol', 'table', 'tbody', 'thead', 'tr']);
const ATTR = { class: 'className', for: 'htmlFor', autofocus: 'autoFocus', autocomplete: 'autoComplete', rows: 'rows', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength' };
const camel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

let loopN = 0;
function expr(src, locals) {
  let e = src.trim(), neg = '';
  while (e.startsWith('!')) { neg += '!'; e = e.slice(1).trim(); }
  if (/^(true|false|null|undefined|-?\d+(\.\d+)?)$/.test(e)) return neg + e;
  const parts = e.split('.');
  const head = parts[0];
  const base = locals.has(head) ? head : 'v.' + head;
  const rest = parts.slice(1).map(p => '?.' + p).join('');
  return neg + (locals.has(head) ? head + rest : (parts.length > 1 ? 'v.' + head + rest : base));
}
const interp = (raw, locals) => {
  const whole = /^\s*\{\{([\s\S]+?)\}\}\s*$/.exec(raw);
  if (whole) return { code: expr(whole[1], locals), dyn: true };
  if (!raw.includes('{{')) return { code: JSON.stringify(raw), dyn: false };
  const segs = raw.split(/\{\{([\s\S]+?)\}\}/g).map((s, i) => (i & 1 ? '${' + expr(s, locals) + " ?? ''}" : s.replace(/[`\\]/g, '\\$&').replace(/\$\{/g, '\\${')));
  return { code: '`' + segs.join('') + '`', dyn: true };
};
function styleObj(raw, locals) {
  const decls = [];
  let depth = 0, cur = '';
  for (const ch of raw) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ';' && depth === 0) { decls.push(cur); cur = ''; } else cur += ch; }
  decls.push(cur);
  const props = [];
  for (const d of decls) {
    const i = d.indexOf(':'); if (i < 0) continue;
    const k = d.slice(0, i).trim(); if (!k) continue;
    const val = d.slice(i + 1).trim();
    const key = k.startsWith('--') ? JSON.stringify(k) : camel(k);
    const at = props.findIndex(x => x.startsWith(key + ': '));
    if (at >= 0) props.splice(at, 1); // même propriété déclarée deux fois : la dernière l'emporte, comme en CSS
    props.push(key + ': ' + interp(val, locals).code);
  }
  return '{ ' + props.join(', ') + ' }';
}

/* Composants à extraire : prédicat → [fichier, nom]. */
const RULES = [
  [(n, p) => n.name === 'aside' && p.parentName === 'div' && p.depth === 1, 'layout/Sidebar', 'Sidebar'],
  [n => n.name === 'header', 'layout/Header', 'Header'],
  ...[['isHome', 'Home'], ['isEditor', 'Editor'], ['isImport', 'Import'], ['isAdapt', 'Adapt'], ['isLetter', 'Letter'], ['isInterview', 'Interview'], ['isApps', 'Applications'], ['isSettings', 'Settings'], ['isVersions', 'Versions']]
    .map(([k, name]) => [n => n.name === 'sc-if' && (n.attribs.value || '').includes(k + ' '), 'screens/' + name, name]),
  [(n, p) => n.name === 'section' && p.inEditor && /\{\{ ed\.form \}\}/.test(n.attribs.style || ''), 'screens/editor/EditorForm', 'EditorForm'],
  [(n, p) => n.name === 'section' && p.inEditor && /\{\{ ed\.pv \}\}/.test(n.attribs.style || ''), 'screens/editor/Preview', 'Preview'],
  [(n, p) => n.name === 'aside' && p.inEditor, 'screens/editor/ScorePanel', 'ScorePanel'],
  ...[['galleryOpen', 'TemplateGallery'], ['sh.open', 'ShareDialog'], ['exp.open', 'ExportDialog'], ['navOpen', 'NavDrawer'], ['au.show', 'AuthScreen'], ['hasToast', 'Toast']]
    .map(([k, name]) => [(n, p) => p.top && n.name === 'sc-if' && (n.attribs.value || '').includes(k + ' '), 'overlays/' + name, name]),
  [(n, p) => p.top && n.name === 'sc-if' && (n.attribs.value || '').includes('lay.mobile '), 'layout/MobileNav', 'MobileNav'],
];
const files = [];

function children(nodes, locals, ind, ctx) {
  const out = [];
  for (const c of nodes) { const j = node(c, locals, ind, ctx); if (j) out.push(j); }
  return out;
}
function node(n, locals, ind, ctx) {
  const pad = '  '.repeat(ind);
  if (n.type === 'text') {
    const t = n.data;
    if (!t.trim()) return (t.includes(' ') && !NO_WS.has(ctx.parentName)) ? pad + '{" "}' : null;
    if (!t.includes('{{')) return pad + '{' + JSON.stringify(t.replace(/\s+/g, ' ')) + '}';
    return t.split(/\{\{([\s\S]+?)\}\}/g).map((s, i) => (i & 1 ? '{' + expr(s, locals) + '}' : s ? '{' + JSON.stringify(s.replace(/\s+/g, ' ')) + '}' : '')).filter(Boolean).map(x => pad + x).join('\n');
  }
  if (n.type !== 'tag' && n.type !== 'script' && n.type !== 'style') return null;
  if (n.name === 'helmet' || n.name === 'script' || n.name === 'style') return null;

  if (!ctx.skipRules) for (const [pred, file, name] of RULES) {
    if (pred(n, ctx)) {
      if (locals.size) throw new Error('extraction avec variables locales : ' + name);
      const body = node(n, locals, 2, { ...ctx, extracting: true, parentName: ctx.parentName, inEditor: ctx.inEditor || name === 'Editor', top: false, skipRules: true });
      files.push({ file, name, body });
      return pad + `<${name} v={v} />`;
    }
  }
  const sub = { ...ctx, parentName: n.name, depth: (ctx.depth || 0) + 1, top: false, inEditor: ctx.inEditor };
  if (ctx.skipRules) delete sub.skipRules; // les règles s'appliquent à nouveau aux descendants

  if (n.name === 'sc-if') {
    const cond = expr(/\{\{([\s\S]+?)\}\}/.exec(n.attribs.value)[1], locals);
    const kids = children(n.children, locals, ind + 2, sub);
    return `${pad}{${cond} ? (\n${pad}  <>\n${kids.join('\n')}\n${pad}  </>\n${pad}) : null}`;
  }
  if (n.name === 'sc-for') {
    const list = expr(/\{\{([\s\S]+?)\}\}/.exec(n.attribs.list)[1], locals);
    const as = n.attribs.as || 'item';
    const idx = 'i' + (loopN++);
    const loc = new Set(locals); loc.add(as);
    const kids = children(n.children, loc, ind + 2, sub);
    return `${pad}{(${list} || []).map((${as}, ${idx}) => (\n${pad}  <React.Fragment key={${idx}}>\n${kids.join('\n')}\n${pad}  </React.Fragment>\n${pad}))}`;
  }

  const props = [], pseudo = [];
  for (const [k0, raw] of Object.entries(n.attribs)) {
    if (k0.startsWith('hint-')) continue;
    if (k0 === 'style-hover' || k0 === 'style-focus') { pseudo.push(`ps(${JSON.stringify(k0.slice(6))}, ${interp(raw, locals).code})`); continue; }
    if (k0 === 'style') { props.push(`style={${styleObj(raw, locals)}}`); continue; }
    const k = ATTR[k0] || k0;
    const { code, dyn } = interp(raw, locals);
    if (k === 'value' || k === 'checked') { props.push(`${k}={${dyn ? code + " ?? ''" : code}}`); continue; }
    if (k === 'autoFocus') { props.push('autoFocus'); continue; }
    props.push(dyn ? `${k}={${code}}` : `${k}=${code.startsWith('"') ? code : '{' + code + '}'}`);
  }
  if (pseudo.length) props.push(`className={${pseudo.join(" + ' ' + ")}}`);
  const open = `${pad}<${n.name}${props.length ? ' ' + props.join(' ') : ''}`;
  if (VOID.has(n.name)) return open + ' />';
  if (n.name === 'textarea') return open + ' />';
  const kids = children(n.children, locals, ind + 1, sub);
  if (!kids.length) return open + `></${n.name}>`;
  return `${open}>\n${kids.join('\n')}\n${pad}</${n.name}>`;
}

const rootKids = children(doc.children, new Set(), 2, { top: true, depth: 0, parentName: 'x-dc' });
files.push({ file: 'AppView', name: 'AppView', body: '    <>\n' + rootKids.join('\n') + '\n    </>' });

for (const f of files) {
  const used = files.filter(o => o !== f && f.body.includes(`<${o.name} v={v} />`));
  const rel = p => { let r = path.relative(path.dirname(path.join(OUT, f.file)), path.join(OUT, p)); return r.startsWith('.') ? r : './' + r; };
  const imports = [`import React from 'react';`];
  if (f.body.includes('ps(')) imports.push(`import { ps } from '${rel('lib/pseudo.js')}';`);
  for (const o of used) imports.push(`import ${o.name} from '${rel(o.file + '.jsx')}';`);
  const body = f.body.trimStart().startsWith('<') ? f.body : '    <>\n' + f.body + '\n    </>';
  const code = `${imports.join('\n')}\n\n/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */\nexport default function ${f.name}({ v }) {\n  return (\n${body}\n  );\n}\n`;
  const dest = path.join(OUT, f.file + '.jsx');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, code);
  console.log('→', path.relative(process.cwd(), dest), code.split('\n').length, 'lignes');
}
