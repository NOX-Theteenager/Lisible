/* Moteur de détection des tics d'écriture IA (français), basé sur des règles.
   Expose window.NoTics = { analyze, autoFix, segments, CATS }.
   Fonctionne sans IA ; la réécriture "humaine" fine passe par window.CVAI.humanize (ai-adapter.js). */
(function () {
  const CATS = {
    creux: { label: 'Formule creuse', color: '#cc3127', bg: 'rgba(204,49,39,.12)' },
    cliche: { label: 'Cliché / jargon', color: '#b06a00', bg: 'rgba(176,106,0,.13)' },
    bequille: { label: 'Mot-béquille', color: '#8a7a00', bg: 'rgba(170,150,0,.16)' },
    structure: { label: 'Structure formatée', color: '#6a4cff', bg: 'rgba(106,76,255,.12)' },
    passif: { label: 'Voix passive', color: '#1f6fd1', bg: 'rgba(31,111,209,.12)' },
    extreme: { label: 'Généralisation', color: '#c23a12', bg: 'rgba(232,72,28,.12)' },
    rythme: { label: 'Rythme', color: '#0f7a5a', bg: 'rgba(15,122,90,.12)' },
  };
  const W = "[\\wÀ-ÿ'’-]";
  const P = [
    { cat: 'creux', re: /\b(il est (?:important|essentiel|crucial|primordial) de (?:noter|souligner|rappeler|préciser) que)\s*/gi, label: 'Préambule creux', fix: '', tip: 'Énoncez directement le fait.' },
    { cat: 'creux', re: /\b((?:dans|à) (?:le|un) monde (?:d['’]aujourd['’]hui|en (?:constante|perpétuelle|pleine) (?:évolution|mutation))|à l['’]ère (?:du|de la|des) [\wÀ-ÿ-]+|de nos jours|aujourd['’]hui plus que jamais)\s*,?\s*/gi, label: 'Accroche générique', fix: '', tip: "Commencez par votre sujet, pas par l'époque." },
    { cat: 'creux', re: /\b(il convient de (?:noter|souligner) que|force est de constater que|il va sans dire que|n['’]hésitez pas à|comme (?:chacun|vous) le sai(?:t|s)(?:,)?)\s*/gi, label: 'Formule de remplissage', fix: '', tip: 'Supprimez : la phrase tient seule.' },
    { cat: 'creux', re: /\b(je me permets de vous (?:adresser|soumettre|proposer)|c['’]est avec (?:un |une )?(?:grand|réel|vif|immense|profond) (?:plaisir|enthousiasme|intérêt) que je|dans l['’]attente de votre (?:réponse|retour))\b/gi, label: 'Formule de lettre toute faite', fix: null, tip: 'Entrez dans le vif : le poste et ce que vous apportez.', alt: 'Je candidate au poste de … : [ce que vous apportez en une phrase].' },
    { cat: 'cliche', re: /\b(passionnée?s?|dynamique|motivée?s?|rigoureu(?:x|se)|force de proposition|esprit d['’]équipe|sens du (?:relationnel|travail en équipe)|polyvalente?|orientée? (?:résultats?|client)|curieu(?:x|se) de nature)\b/gi, label: 'Qualité auto-proclamée', fix: null, tip: 'Remplacez par un fait qui la prouve.', alt: 'Un fait vérifiable : « J’ai livré… », « J’ai formé… »' },
    { cat: 'cliche', re: /\b(valeur ajoutée|synergies?|leviers?|au cœur de|véritable|incontournable|clé en main|de pointe|un large éventail de|une multitude de|joue(?:nt)? un rôle (?:clé|crucial|essentiel|central|majeur)|relever (?:de nouveaux|les|des) défis|mettre à profit|apporter ma pierre à l['’]édifice|leader (?:dans|de) son (?:domaine|secteur)|sortir de (?:ma|sa) zone de confort)\b/gi, label: 'Jargon vide', fix: null, tip: 'Nommez la chose précise.' },
    { cat: 'bequille', re: /\b(clairement|évidemment|véritablement|réellement|totalement|extrêmement|incroyablement|absolument|parfaitement|vraiment|profondément)\s+/gi, label: 'Adverbe-béquille', fix: '', tip: 'Supprimez : le fait suffit.' },
    { cat: 'bequille', re: /(^|[.!?]\s+)(En effet|Par ailleurs|En outre|De plus|Ainsi|En somme|En définitive|Au final|Globalement|Concrètement),\s*/g, label: 'Connecteur de remplissage', fix: '$1', tip: 'Liez les idées par le sens.' },
    { cat: 'structure', re: /\b((?:ce n['’]est|il ne s['’]agit) pas(?: seulement| simplement| juste| uniquement)? [^.;:!?]{2,70}?,? (?:c['’]est|mais|il s['’]agit))\b/gi, label: 'Contraste « pas X, mais Y »', fix: null, tip: 'Dites simplement Y.' },
    { cat: 'structure', re: /\b(non seulement\b[^.]{2,80}?\bmais (?:aussi|également))\b/gi, label: '« Non seulement… mais aussi »', fix: null, tip: 'Deux phrases simples font mieux.' },
    { cat: 'structure', re: /((?:^|(?<=[.!]\s))[^.?!\n]{3,60}\?\s+[A-ZÀ-Ý][^.?!\n]{0,90}[.!])/g, label: 'Question rhétorique + réponse', fix: null, tip: 'Affirmez directement.' },
    { cat: 'passif', re: /\b((?:a|ont|avait|avaient|aura|auront) été [\wÀ-ÿ]+(?:é|ée|és|ées|i|ie|is|u|ue|us|t|te|ts))\b/gi, label: 'Voix passive', fix: null, tip: 'Donnez un sujet qui agit : « J’ai… », « L’équipe a… ».' },
    { cat: 'passif', re: /\b((?:est|sont|sera|seront|était|étaient|fut) [\wÀ-ÿ]+(?:é|ée|és|ées) par)\b/gi, label: 'Voix passive', fix: null, tip: 'Mettez l’acteur en sujet.' },
    { cat: 'extreme', re: /\b(toujours|jamais|tout le monde|personne ne|sans exception|en permanence)\b/gi, label: 'Généralisation extrême', fix: null, tip: 'Précisez : quand, qui, combien.' },
  ];
  const TERNARY = new RegExp(`\\b${W}+, ${W}+ et ${W}+\\b`, 'g');

  function sentences(t) { return (t || '').split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.split(/\s+/).length > 1); }

  function analyze(text) {
    const t = text || '';
    const hits = [];
    P.forEach((p, pi) => {
      p.re.lastIndex = 0; let m;
      while ((m = p.re.exec(t))) {
        const g = m[1] && p.fix !== '$1' ? m[1] : m[0];
        const start = p.fix === '$1' ? m.index + (m[1] || '').length : m.index + m[0].indexOf(g);
        const len = p.fix === '$1' ? m[0].length - (m[1] || '').length : g.length;
        if (len > 0) hits.push({ pi, cat: p.cat, label: p.label, tip: p.tip, alt: p.alt || null, fixable: p.fix !== null, start, end: start + len, match: t.slice(start, start + len).trim() });
        if (m[0].length === 0) p.re.lastIndex++;
      }
    });
    // em dash
    const dashes = (t.match(/\s—\s/g) || []).length;
    if (dashes >= 2) { let i = -1; while ((i = t.indexOf(' — ', i + 1)) >= 0) hits.push({ cat: 'rythme', label: 'Tiret cadratin répété', tip: 'Une virgule ou un point suffit.', fixable: true, start: i, end: i + 3, match: '—', dash: true }); }
    // ternary
    const tern = t.match(TERNARY) || [];
    if (tern.length >= 2) { TERNARY.lastIndex = 0; let m; while ((m = TERNARY.exec(t))) hits.push({ cat: 'rythme', label: 'Énumération par trois', tip: 'Gardez les deux éléments les plus forts.', fixable: false, start: m.index, end: m.index + m[0].length, match: m[0] }); }
    // rhythm
    const ss = sentences(t), lens = ss.map(s => s.split(/\s+/).length);
    let cv = 1;
    if (lens.length >= 4) { const mean = lens.reduce((a, b) => a + b, 0) / lens.length; const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length); cv = sd / mean; }
    const metronome = lens.length >= 4 && cv < 0.25;
    hits.sort((a, b) => a.start - b.start || b.end - a.end);
    const n = c => hits.filter(h => h.cat === c).length;
    const words = (t.match(/\S+/g) || []).length || 1;
    const filler = hits.filter(h => h.fixable).reduce((a, h) => a + h.match.split(/\s+/).length, 0);
    const cl = v => Math.max(1, Math.min(10, Math.round(v)));
    const scores = {
      direction: cl(10 - 2 * n('creux') - 1.5 * n('structure')),
      rythme: cl((lens.length < 4 ? 8 : cv >= .45 ? 10 : cv >= .35 ? 8 : cv >= .25 ? 6 : 4) - (tern.length >= 2 ? tern.length - 1 : 0) - (dashes >= 2 ? 1 : 0)),
      confiance: cl(10 - 1.5 * n('bequille') - 1.5 * n('extreme')),
      authenticite: cl(10 - 1.5 * n('cliche') - n('creux') - n('passif')),
      densite: cl(10 - (filler / words) * 60),
    };
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    return { hits, scores, total, verdict: total >= 42 ? 'Sonne humain' : total >= 35 ? 'Correct, à affiner' : 'À réviser', metronome, sentences: lens.length, words };
  }

  function tidy(s) {
    return s.replace(/[ \t]{2,}/g, ' ').replace(/[ \t]+([,.])/g, '$1').replace(/(\S)[ \t]*([;:!?])(?=\s|$)/g, '$1 $2').replace(/,\s*,/g, ',').replace(/(^|[.!?]\s+|\n\s*)([a-zà-ÿ])/g, (m, a, b) => a + b.toUpperCase()).replace(/^\s+/, '');
  }

  function autoFix(text) {
    let t = text || ''; const changes = [];
    P.forEach(p => { if (p.fix === null) return; p.re.lastIndex = 0; t = t.replace(p.re, (...a) => { changes.push(p.label + ' : « ' + a[0].trim() + ' »'); return p.fix === '$1' ? a[1] : p.fix; }); });
    if ((t.match(/\s—\s/g) || []).length >= 2) { t = t.replace(/\s—\s/g, ', '); changes.push('Tirets cadratins remplacés par des virgules'); }
    return { text: tidy(t), changes };
  }

  function fixOne(text, hit) {
    const before = text.slice(0, hit.start), after = text.slice(hit.end);
    if (hit.dash) return tidy(before + ', ' + after);
    const p = P[hit.pi]; if (!p || p.fix === null) return text;
    return tidy(before + (p.fix === '$1' ? '' : p.fix) + after);
  }

  function segments(text, hits) {
    const out = []; let pos = 0; const t = text || '';
    hits.filter(h => h.end > h.start).forEach((h, i) => {
      if (h.start < pos) return;
      if (h.start > pos) out.push({ text: t.slice(pos, h.start), hit: false });
      out.push({ text: t.slice(h.start, h.end), hit: true, cat: h.cat, label: h.label, i });
      pos = h.end;
    });
    if (pos < t.length) out.push({ text: t.slice(pos), hit: false });
    return out;
  }

  window.NoTics = { analyze, autoFix, fixOne, segments, CATS };
})();
