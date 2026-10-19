/* ───────────────────────────────────────────────────────────────
   INTELLIGENCE ARTIFICIELLE — window.CVAI
   Gemini (via /api/ai/*) pour l'analyse, les réécritures, l'entretien,
   la traduction et l'import ; Claude (via /api/letter) pour la lettre
   de motivation. Chaque fonction renvoie une Promise et lève une Error
   au message affichable.
   ─────────────────────────────────────────────────────────────── */
(function () {
  const api = () => window.LisibleAPI;
  const uid = () => Math.random().toString(36).slice(2, 9);
  const ORDER = ['summary', 'experience', 'education', 'skills', 'languages', 'projects', 'certifications'];
  // Pas de tiret cadratin dans les CV renvoyés par l'IA (même règle que noDash dans lib/cv.js).
  const s = (v) =>
    v == null
      ? ''
      : String(v)
          .replace(/(\d)\s*[—–]\s*(?=\d|aujourd|présent|present|now|today)/gi, '$1 - ')
          .replace(/^\s*[—–]\s*/gm, '')
          .replace(/\s+[—–]\s+/g, ', ')
          .replace(/\s*—\s*/g, ', ');

  /* Remet un CV renvoyé par l'IA dans la forme exacte attendue par l'éditeur. */
  function normalizeCv(raw, base) {
    const c = raw || {},
      ct = c.contact || {};
    const out = {
      order: (base && base.order) || [...ORDER],
      ...(base && base.kind ? { kind: base.kind } : {}),
      contact: {
        name: s(ct.name),
        title: s(ct.title),
        email: s(ct.email),
        phone: s(ct.phone),
        city: s(ct.city),
        linkedin: s(ct.linkedin),
        github: s(ct.github),
        photo: (base && base.contact && base.contact.photo) || '',
      },
      summary: s(c.summary),
      experiences: (c.experiences || []).map((e) => ({
        id: uid(),
        role: s(e.role),
        company: s(e.company),
        sector: s(e.sector),
        city: s(e.city),
        start: s(e.start),
        end: s(e.end),
        bullets: (e.bullets || []).map(s).filter((b) => b.trim()),
      })),
      education: (c.education || []).map((e) => ({
        id: uid(),
        degree: s(e.degree),
        school: s(e.school),
        city: s(e.city),
        start: s(e.start),
        end: s(e.end),
        details: s(e.details),
      })),
      skills: [...new Set((c.skills || []).map((x) => s(x).trim()).filter(Boolean))],
      languages: (c.languages || []).map((l) => ({ id: uid(), name: s(l.name), level: s(l.level) })),
      projects: (c.projects || []).map((p) => ({ id: uid(), name: s(p.name), link: s(p.link), desc: s(p.desc) })),
      certifications: (c.certifications || []).map((x) => ({ id: uid(), name: s(x.name), issuer: s(x.issuer), date: s(x.date) })),
    };
    if (!out.experiences.length)
      out.experiences.push({ id: uid(), role: '', company: '', sector: '', city: '', start: '', end: '', bullets: [''] });
    out.experiences.forEach((e) => {
      if (!e.bullets.length) e.bullets.push('');
    });
    if (!out.education.length) out.education.push({ id: uid(), degree: '', school: '', city: '', start: '', end: '', details: '' });
    return out;
  }

  window.CVAI = {
    normalizeCv,
    /* Réécrit un texte sans tics IA. Retour : { text, notes[] } */
    humanize: (text, opts = {}) => api().ai('humanize', { text, context: opts.context, lang: opts.lang }),

    /* Question posée quand une réalisation n'a pas de chiffre (règles locales, instantané). */
    metricQuestion(bullet) {
      const l = (bullet || '').toLowerCase();
      if (/migr/.test(l))
        return 'Combien de services ou d’utilisateurs étaient concernés, et quel gain avez-vous mesuré (coût, temps, incidents) ?';
      if (/test/.test(l)) return 'Combien de tests avez-vous mis en place, et quel effet sur les bugs en production ?';
      if (/accessib/.test(l)) return 'Combien de sites, et quel niveau de conformité (RGAA, score Lighthouse) avez-vous atteint ?';
      if (/form|encadr|mentor/.test(l)) return 'Combien de personnes avez-vous accompagnées, et sur quelle durée ?';
      if (/vente|chiffre|client/.test(l)) return 'Quel montant ou combien de clients, sur quelle période ?';
      return 'Quel résultat mesurable : combien, en combien de temps, quel gain ?';
    },
    /* Intègre la réponse chiffrée de l'utilisateur à la réalisation, sans inventer. */
    integrateMetric: (bullet, answer) =>
      api()
        .ai('integrateMetric', { bullet, answer })
        .then((r) => r.text),
    /* Deux reformulations d'une réalisation. Retour : string[] */
    suggestBullet: (bullet, ctx = {}) =>
      api()
        .ai('suggestBullet', { bullet, ...ctx })
        .then((r) => r.alts || []),
    suggestSummary: (cv, offer) =>
      api()
        .ai('suggestSummary', { cv, offer })
        .then((r) => r.text),
    suggestSkills: (title, skills, summary) =>
      api()
        .ai('suggestSkills', { title, skills, summary })
        .then((r) => r.skills || []),

    /* Import d'un CV : { cv, issues[], mapping[], score, headline, rawText, visualZones } */
    parseCv: async (payload) => {
      const r = await api().ai('parseCv', payload);
      r.cv = normalizeCv(r.cv);
      return r;
    },

    /* Offres d'emploi */
    offerFromUrl: (url) => api().fetchOffer(url),
    offerFromImage: (mimeType, data) => api().ai('extractOffer', { image: { mimeType, data } }),
    offerFromPdf: (data) => api().ai('extractOffer', { pdf: { data } }),
    offerFromText: (text) => api().ai('extractOffer', { text }),
    analyzeOffer: (cv, offer) => api().ai('analyzeOffer', { cv, offer }),

    /* Lettre de motivation (Claude). Retour : texte complet avec en-tête. */
    letterStream: (payload, onDelta) => api().letterStream(payload, (ev) => { if (ev.type === 'delta') onDelta(ev.text); }).then((ev) => ev.text),
    /* Simulation d'entretien : { feedback, nextQuestion, done, summary } */
    mockInterview: (body) => api().ai('mockInterview', body),
    /* Bilan d'un entretien vocal : { items: [{ question, answer, feedback }], summary } */
    reviewInterview: (body) => api().ai('reviewInterview', body),
    /* Raccourcit un texte sous une limite de caractères : { text } */
    shorten: (body) => api().ai('shorten', body),
    letter: (payload) =>
      api()
        .letter(payload)
        .then((r) => r.text),

    /* Lecture d'une image ou d'un PDF scanné. */
    ocrImage: (mimeType, data) =>
      api()
        .ai('ocr', { image: { mimeType, data } })
        .then((r) => r.text),
    ocrPdf: (data) =>
      api()
        .ai('ocr', { pdf: { data } })
        .then((r) => r.text),

    /* Entretien : { questions[], pitch, linkedin:{headline, about} } */
    interview: (cv, offer, extra) => api().ai('interview', { cv, offer, ...(extra || {}) }),
    /* Fiche entreprise (recherche web) : { found, name, summary, sector, activities, values, recent, interviewAngles, questionsToAsk, sources } */
    companyBrief: (body) => api().ai('companyBrief', body),

    /* Traduction du CV (même structure, cv.lang = lang). */
    async translateCv(cv, lang) {
      const r = await api().ai('translateCv', { cv, lang });
      const c = normalizeCv(r.cv, cv);
      c.lang = lang;
      return c;
    },
  };
})();
