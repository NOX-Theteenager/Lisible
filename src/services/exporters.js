/* Exports : DOCX réel (bibliothèque docx) et pack candidature (JSZip), chargés à la demande.
   window.CVExport = { ensure(), docxBlob(model), letterDocxBlob(text), zip(files), save(name, blob) } */
(function () {
  const LIBS = [
    ['docx', '/vendor/docx.js'],
    ['JSZip', '/vendor/jszip.min.js'],
  ];
  let loading = null;
  function load(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = res;
      s.onerror = () => rej(new Error('Chargement impossible : ' + src));
      document.head.appendChild(s);
    });
  }
  function ensure() {
    if (window.docx && window.JSZip) return Promise.resolve();
    if (!loading)
      loading = Promise.all(LIBS.filter(([g]) => !window[g]).map(([, src]) => load(src))).catch((e) => {
        loading = null;
        throw e;
      });
    return loading;
  }
  async function docxBlob(m) {
    await ensure();
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } = window.docx;
    const font = m.font || 'Arial';
    const kids = [
      new Paragraph({ children: [new TextRun({ text: m.name || '', bold: true, size: 36, font })] }),
      new Paragraph({ children: [new TextRun({ text: m.title || '', size: 24, font })] }),
      new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: m.contactLine || '', size: 20, font })] }),
    ];
    m.sections.forEach((s) => {
      kids.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 80 },
          border: { bottom: { color: '222222', space: 1, style: BorderStyle.SINGLE, size: 6 } },
          children: [new TextRun({ text: s.label.toUpperCase(), bold: true, size: 22, font, color: '111111' })],
        }),
      );
      s.items.forEach((it) => {
        if (it.type === 'bullet')
          kids.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text: it.text, size: Math.round((m.size || 10.5) * 2), font })],
            }),
          );
        else
          kids.push(
            new Paragraph({
              spacing: { before: it.type === 'bold' ? 100 : 0 },
              children: [new TextRun({ text: it.text, bold: it.type === 'bold', size: Math.round((m.size || 10.5) * 2), font })],
            }),
          );
      });
    });
    const doc = new Document({
      creator: 'Lisible',
      title: m.name,
      styles: { default: { document: { run: { font } } } },
      sections: [{ properties: { page: { margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } }, children: kids }],
    });
    return Packer.toBlob(doc);
  }
  async function letterDocxBlob(input, opt) {
    const LF = (opt && opt.font) || 'Arial',
      LS = Math.round(((opt && opt.size) || 11) * 2);
    await ensure();
    const { Document, Packer, Paragraph, TextRun, AlignmentType } = window.docx;
    const P = (t, o = {}) =>
      new Paragraph({
        spacing: { after: 60 },
        alignment: o.right ? AlignmentType.RIGHT : AlignmentType.LEFT,
        children: [new TextRun({ text: t, size: LS, font: LF, bold: !!o.bold })],
      });
    let kids;
    if (typeof input === 'string') kids = input.split('\n').map((l) => P(l));
    else
      kids = [
        ...input.sender.map((l, i) => P(l, { bold: i === 0 })),
        P(''),
        ...input.recipient.map((l, i) => P(l, { right: true, bold: i === 0 })),
        P(''),
        ...input.body.split('\n').map((l) => P(l)),
      ];
    const doc = new Document({ sections: [{ children: kids }] });
    return Packer.toBlob(doc);
  }
  async function zip(files) {
    await ensure();
    const z = new window.JSZip();
    for (const f of files) z.file(f.name, f.data);
    return z.generateAsync({ type: 'blob' });
  }
  function save(name, blob) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }
  window.CVExport = { ensure, docxBlob, letterDocxBlob, zip, save };
})();
