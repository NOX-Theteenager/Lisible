/* ───────────────────────────────────────────────────────────────
   EXTRACTION DE TEXTE DANS LE NAVIGATEUR — window.CVExtract
   pdf.js pour les PDF, mammoth.js pour les DOCX. Le fichier ne quitte le
   navigateur que lorsqu'il est envoyé au modèle d'IA pour analyse.
   ─────────────────────────────────────────────────────────────── */
(function () {
  let pdfjsP = null, mammothP = null;
  const MAX = 10 * 1024 * 1024;
  const MAX_UPLOAD = 3 * 1024 * 1024;   // limite de requête de l'hébergement (Vercel : 4,5 Mo après encodage)

  /* Réduit une image à 2000 px de côté maximum (JPEG), pour l'envoyer à l'IA sans dépasser la limite. */
  function shrink(file) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => { const k = Math.min(1, 2000 / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.85).split(',')[1]); };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Image illisible')); };
      img.src = url;
    });
  }

  function pdfjs() {
    if (!pdfjsP) pdfjsP = import('/vendor/pdf.min.mjs').then(m => { m.GlobalWorkerOptions.workerSrc = '/vendor/pdf.worker.min.mjs'; return m; }).catch(e => { pdfjsP = null; throw e; });
    return pdfjsP;
  }
  function mammoth() {
    if (window.mammoth) return Promise.resolve(window.mammoth);
    if (!mammothP) mammothP = new Promise((res, rej) => { const s = document.createElement('script'); s.src = '/vendor/mammoth.browser.min.js'; s.onload = () => res(window.mammoth); s.onerror = () => { mammothP = null; rej(new Error('mammoth.js indisponible')); }; document.head.appendChild(s); });
    return mammothP;
  }
  const base64 = file => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] || ''); r.onerror = () => rej(new Error('Lecture du fichier impossible')); r.readAsDataURL(file); });
  const kind = f => { const n = (f.name || '').toLowerCase(); if (/\.pdf$/.test(n) || f.type === 'application/pdf') return 'pdf'; if (/\.docx$/.test(n)) return 'docx'; if (/\.txt$/.test(n) || f.type === 'text/plain') return 'txt'; if (/^image\//.test(f.type) || /\.(png|jpe?g|webp)$/.test(n)) return 'image'; if (/\.doc$/.test(n)) return 'doc'; return 'other'; };

  /* Texte d'un PDF dans l'ordre de lecture (ce que lit un ATS), page par page. */
  async function pdf(file) {
    const lib = await pdfjs();
    const doc = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = [];
    let images = 0;
    for (let i = 1; i <= doc.numPages; i++) {
      const p = await doc.getPage(i);
      const tc = await p.getTextContent();
      let line = '', out = [], lastY = null;
      for (const it of tc.items) {
        if (!('str' in it)) continue;
        const y = Math.round(it.transform[5]);
        if (lastY !== null && Math.abs(y - lastY) > 2) { out.push(line); line = ''; }
        line += (line && !line.endsWith(' ') && !it.str.startsWith(' ') ? ' ' : '') + it.str;
        lastY = y;
        if (it.hasEOL) { out.push(line); line = ''; lastY = null; }
      }
      if (line) out.push(line);
      pages.push(out.map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n'));
      try { const ops = await p.getOperatorList(); images += ops.fnArray.filter(f => f === lib.OPS.paintImageXObject || f === lib.OPS.paintInlineImageXObject).length; } catch (e) {}
    }
    return { text: pages.join('\n\n'), pages: doc.numPages, images };
  }

  async function docx(file) {
    const m = await mammoth();
    const buf = await file.arrayBuffer();
    const [raw, html] = await Promise.all([m.extractRawText({ arrayBuffer: buf }), m.convertToHtml({ arrayBuffer: buf })]);
    const h = html.value || '';
    return { text: (raw.value || '').replace(/\n{3,}/g, '\n\n').trim(), html: h, tables: (h.match(/<table/g) || []).length, images: (h.match(/<img/g) || []).length };
  }

  /* Prépare un fichier de CV ou d'annonce pour l'analyse IA. */
  async function prepare(file) {
    if (!file) throw new Error('Aucun fichier');
    if (file.size > MAX) throw new Error('Fichier trop volumineux (10 Mo maximum).');
    const k = kind(file);
    if (k === 'doc') throw new Error('Format .doc non pris en charge : enregistrez le fichier en .docx ou en PDF.');
    if (k === 'other') throw new Error('Format non pris en charge : PDF, DOCX, TXT, PNG ou JPG.');
    const out = { kind: k, fileName: file.name, size: file.size, mimeType: k === 'pdf' ? 'application/pdf' : k === 'image' ? (file.type || 'image/jpeg') : k === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain' };
    if (k === 'pdf') {
      Object.assign(out, await pdf(file));
      if (file.size <= MAX_UPLOAD) out.data = await base64(file);
      else if ((out.text || '').trim().length < 200) throw new Error('PDF scanné trop lourd (3 Mo maximum) : réduisez-le ou envoyez une photo.');
    }
    else if (k === 'docx') Object.assign(out, await docx(file));
    else if (k === 'txt') out.text = await file.text();
    else { out.data = await shrink(file); out.mimeType = 'image/jpeg'; }
    return out;
  }

  window.CVExtract = { prepare, pdf, docx, base64, kind };
})();
