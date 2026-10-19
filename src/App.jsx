/* Logique de l'application : état, actions et valeurs affichées par les écrans. */
import React from 'react';
import AppView from './AppView.jsx';
import { marketOf } from './lib/markets.js';
import { daysLeft, dueOf } from './lib/applications.js';
import { DATE_RE, analyze, applyAdapt, hasNum, isWeak, matchKw } from './lib/ats.js';
import { APP_COLS, HINTS, IMPORT_STEPS, LEVELS_EN, LEVELS_FR, LIB, TIPS, UI_EN, UI_FR, VERBS } from './lib/content.js';
import {
  LABELS,
  LABELS_EN,
  LABELS_AC,
  anonCv,
  blankVersion,
  contactLine,
  dashFree,
  cvText,
  dates,
  docHtml,
  docModel,
  emptyCv,
  findPh,
  labOf,
  secText,
} from './lib/cv.js';
import { letterDiag, relanceMail, splitLetter } from './lib/letters.js';
import { KEY, LS_ACCT, settingsOf } from './lib/storage.js';
import { ACCENTS, FONTS, TPLS, applyFont, resolveTpl } from './lib/templates.js';
import { NT, clone, errMsg, esc, lineDiff, rel, scoreColor, slug, toMonths, uid, wc, whenReady } from './lib/utils.js';

const briefKey = (c) => String(c || '').trim().toLowerCase().replace(/\s+/g, ' ');

export default class App extends React.Component {
  state = this.init();
  init() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    } catch (e) {}
    const now = Date.now(),
      day = 86400000;
    const first = blankVersion('Mon CV');
    const W = (saved && saved.work) || {};
    return {
      versions: saved && saved.versions && saved.versions.length ? saved.versions : [first],
      currentId: (saved && saved.currentId) || first.id,
      theme: 'light',
      screen: (() => {
        try {
          const q = new URLSearchParams(location.search).get('screen');
          return ['import', 'adapt', 'jobs', 'letter', 'editor', 'apps', 'interview'].includes(q) ? q : 'home';
        } catch (e) {
          return 'home';
        }
      })(),
      step: 0,
      paperH: 0,
      letFont: (saved && saved.letFont) || 'Arial',
      letSize: (saved && saved.letSize) || 11,
      auth: (() => {
        let a = null;
        try {
          a = JSON.parse(localStorage.getItem(LS_ACCT) || 'null');
        } catch (e) {}
        return {
          user: (a && a.user) || null,
          guest: !!(a && a.guest),
          ready: false,
          mode: 'in',
          email: '',
          pw: '',
          name: '',
          showPw: false,
          busy: false,
          err: '',
          info: '',
          gEmail: '',
          open: false,
        };
      })(),
      font: (saved && saved.font) || '',
      fsize: (saved && saved.fsize) || null,
      wide: typeof window !== 'undefined' && window.innerWidth >= 820,
      comments: [],
      share: { open: false, link: '', perm: 'comment', expiry: '7', anon: false, created: 0 },
      mobile: typeof window !== 'undefined' && window.innerWidth < 820,
      navOpen: false,
      mTab: 'form',
      pvW: 0,
      lang: (saved && saved.lang) || 'fr',
      apps: (saved && saved.apps) || [],
      ivHist: (saved && saved.ivHist) || [],
      newApp: null,
      diffWith: null,
      dense: false,
      iv: W.iv || { phase: 'idle', qs: [], open: 0, pitch: '', li: null },
      sync: 'local',
      sugAlts: {},
      sugBusy: null,
      sumBusy: false,
      skillAI: null,
      ivBusy: false,
      acct: { email: '', status: 'out' },
      prefs: (saved && saved.prefs) || { motion: false, contrast: false, anonDefault: false, autoClean: true, notif: false, ui: 'md' },
      confirmDel: false,
      mq: {},
      open: {},
      tpl: (saved && saved.tpl) || 'classique',
      accent: (saved && saved.accent) || '#e8481c',
      galleryOpen: false,
      rulesOpen: false,
      anon: false,
      pv: 'visuel',
      sug: null,
      sumSug: false,
      libOpen: false,
      libSector: 'Tech',
      libExp: null,
      skillDraft: '',
      imp: { phase: 'idle', mode: 'full', file: null, step: 0, drag: false, steps: [], res: null },
      ad: {
        phase: W.ad && W.ad.result && W.ad.analysis ? 'result' : 'input',
        src: 'text',
        url: '',
        img: null,
        srcPhase: 'idle',
        busyPct: 0,
        info: null,
        offer: (W.ad && W.ad.offer) || '',
        analysis: (W.ad && W.ad.analysis) || null,
        acc: (W.ad && W.ad.acc) || {},
        sk: (W.ad && W.ad.sk) || {},
      },
      letter: {
        mode: (W.letter && W.letter.mode) || 'new',
        company: (W.letter && W.letter.company) || '',
        role: (W.letter && W.letter.role) || '',
        tone: (W.letter && W.letter.tone) || 'Sobre',
        phase: W.letter && W.letter.text ? 'done' : 'idle',
        text: (W.letter && W.letter.text) || '',
        offerText: (W.letter && W.letter.offerText) || '',
        src: 'offer',
        url: '',
        img: null,
        srcPhase: 'idle',
        busyPct: 0,
        info: null,
        old: (W.letter && W.letter.old) || '',
        oldName: '',
        diag: null,
        lang: (W.letter && W.letter.lang) || '',
        multi: !!(W.letter && W.letter.multi),
        variants: (W.letter && W.letter.variants) || [],
        vi: (W.letter && W.letter.vi) || 0,
      },
      market: (saved && saved.market) || 'fr',
      track: (saved && saved.track) || 'job',
      savedSearches: (saved && saved.savedSearches) || [],
      schoolApps: (saved && saved.schoolApps) || [],
      profile: (saved && saved.profile) || { motivation: '', achievements: '', constraints: '', values: '', use: true },
      brief: (saved && saved.brief) || null,
      briefBusy: false,
      exp: { open: false, fmt: 'docx', name: '' },
      toast: '',
      exporting: null,
      renaming: null,
      renameText: '',
      hRen: null,
      hRenText: '',
      hDel: null,
      histSel: null,
    };
  }
  componentDidMount() {
    this._flush = () => { if (this._st) this.saveLocal(); };
    window.addEventListener('pagehide', this._flush);
    document.addEventListener('visibilitychange', this._flush);
    document.documentElement.setAttribute('data-theme', this.state.theme);
    document.documentElement.setAttribute('data-ui', this.state.prefs.ui || 'md');
    {
      let k = 0;
      const go = () => {
        if (window.CVI18N) {
          if (this.state.lang === 'en') window.CVI18N.setLang('en');
        } else if (++k < 40) setTimeout(go, 150);
      };
      go();
    }
    let tries = 0;
    this._nt = setInterval(() => {
      if (window.NoTics && window.CVAI) {
        clearInterval(this._nt);
        this.forceUpdate();
      } else if (++tries > 40) clearInterval(this._nt);
    }, 150);
    whenReady(
      () => window.CVAuth && window.CVStore && window.LisibleAPI,
      () => this.initAuth(),
    );
    this._kd = (e) => {
      const s = this.state,
        mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) this.redo();
        else this.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        this.redo();
        return;
      }
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.snapshot('Instantané (raccourci)');
        this.toast('Instantané enregistré');
      } else if (mod && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        this.setState((st) => ({ exp: { ...st.exp, open: true, name: slug(this.cur().name) } }));
      } else if (e.altKey && s.screen === 'editor' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        e.preventDefault();
        this.setState((st) => ({ step: Math.max(0, Math.min(7, st.step + (e.key === 'ArrowRight' ? 1 : -1))) }));
      }
    };
    window.addEventListener('keydown', this._kd);
    this._rs = () => {
      const m = window.innerWidth < 820;
      if (m !== this.state.mobile) this.setState({ mobile: m, navOpen: false });
    };
    this.scrollPv();
    window.addEventListener('resize', this._rs);
    setTimeout(() => this.notifyDue(), 1500);
    this.watchPv();
    this._start = {};
    this._tick = setInterval(() => {
      this.forceUpdate();
      if (this.state.auth.user) this.loadComments();
    }, 60000);
  }
  componentWillUnmount() {
    window.removeEventListener('pagehide', this._flush);
    document.removeEventListener('visibilitychange', this._flush);
    window.removeEventListener('resize', this._rs);
    if (this._ro) this._ro.disconnect();
    window.removeEventListener('keydown', this._kd);
    clearInterval(this._nt);
    clearInterval(this._tick);
    clearInterval(this._sad);
    clearInterval(this._sletter);
    clearInterval(this._ii);
    clearTimeout(this._tt);
    clearTimeout(this._st);
  }
  componentDidUpdate(pp, ps0) {
    const ps = this._prev || ps0 || this.state;
    this.syncContext();
    {
      const Lp = ps.letter, Ln = this.state.letter, cur = Ln.variants && Ln.variants[Ln.vi];
      if (Ln !== Lp && cur && Ln.phase === 'done' && Lp.vi === Ln.vi && cur.text !== Ln.text)
        this.setState((st) => ({ letter: { ...st.letter, variants: st.letter.variants.map((x, j) => (j === st.letter.vi ? { ...x, text: st.letter.text } : x)) } }));
    }
    this.watchPv();
    {
      const pn = this.paperRef.current;
      if (pn && pn.offsetWidth) {
        const h = Math.round((pn.offsetHeight * 760) / pn.offsetWidth);
        if (Math.abs(h - this.state.paperH) > 6) this.setState({ paperH: h });
      }
    }
    const s = this.state;
    if (ps.lang !== s.lang) {
      let k = 0;
      const go = () => {
        if (window.CVI18N) window.CVI18N.setLang(this.state.lang);
        else if (++k < 40) setTimeout(go, 150);
      };
      go();
    }
    if (ps.screen !== s.screen || ps.step !== s.step || ps.mTab !== s.mTab) this.scrollPv();
    if (ps.auth !== s.auth && (ps.auth.user !== s.auth.user || ps.auth.guest !== s.auth.guest)) {
      try {
        localStorage.setItem(LS_ACCT, JSON.stringify({ user: s.auth.user, guest: s.auth.guest }));
      } catch (e) {}
    }
    if (ps.prefs !== s.prefs) {
      document.documentElement.setAttribute('data-ui', s.prefs.ui || 'md');
      document.documentElement.setAttribute('data-motion', s.prefs.motion ? 'reduce' : '');
      document.documentElement.setAttribute('data-contrast', s.prefs.contrast ? 'high' : '');
    }
    if (ps.theme !== s.theme) document.documentElement.setAttribute('data-theme', s.theme);
    this.persist(ps, s);
    if (ps.currentId !== s.currentId && s.auth.user) this.loadComments();
    this.maybeSkillSugs();
    this._prev = { ...this.state };
  }
  /* Écriture sur l'appareil. Appelée après un court délai, et tout de suite si la page se ferme. */
  saveLocal() {
    clearTimeout(this._st);
    this._st = null;
    const st = this.state,
      set = settingsOf(st);
    try {
      localStorage.setItem(KEY, JSON.stringify({ versions: st.versions, apps: st.apps, ivHist: st.ivHist, ...set }));
    } catch (e) {}
  }
  persist(ps, s) {
    const keys = [
      'versions',
      'currentId',
      'theme',
      'tpl',
      'accent',
      'font',
      'fsize',
      'letFont',
      'letSize',
      'apps',
      'ivHist',
      'lang',
      'prefs',
      'ad',
      'letter',
      'iv',
      'market',
      'track',
      'savedSearches',
      'schoolApps',
      'profile',
      'brief',
    ];
    if (!keys.some((k) => ps[k] !== s[k])) return;
    clearTimeout(this._st);
    this._st = setTimeout(() => this.saveLocal(), 400);
    const u = s.auth.user;
    if (!u || !this._pulled || !window.CVStore) return;
    clearTimeout(this._sy);
    this._sy = setTimeout(() => {
      const st = this.state;
      if (!st.auth.user) return;
      this.setState({ sync: 'saving' });
      window.CVStore.push(st.auth.user.id, { versions: st.versions, apps: st.apps, interviews: st.ivHist, settings: settingsOf(st) })
        .then(() => this.setState({ sync: 'ok' }))
        .catch((e) => {
          console.error(e);
          this.setState({ sync: 'error' });
          if (!this._syncWarned) {
            this._syncWarned = 1;
            this.toast('Synchronisation impossible : vos modifications restent sur cet appareil');
          }
        });
    }, 1200);
  }
  applySettings(set) {
    const W = set.work || {},
      o = {};
    ['tpl', 'accent', 'font', 'fsize', 'letFont', 'letSize', 'lang', 'prefs', 'market', 'track', 'savedSearches', 'schoolApps', 'profile', 'brief'].forEach((k) => {
      if (set[k] != null) o[k] = set[k];
    });
    this.setState((st) => ({
      ...o,
      ad: W.ad
        ? {
            ...st.ad,
            offer: W.ad.offer || '',
            analysis: W.ad.analysis || null,
            acc: W.ad.acc || {},
            sk: W.ad.sk || {},
            phase: W.ad.result && W.ad.analysis ? 'result' : 'input',
          }
        : st.ad,
      letter: W.letter
        ? {
            ...st.letter,
            company: W.letter.company || '',
            role: W.letter.role || '',
            tone: W.letter.tone || 'Sobre',
            mode: W.letter.mode || 'new',
            text: W.letter.text || '',
            offerText: W.letter.offerText || '',
            old: W.letter.old || '',
            lang: W.letter.lang || '',
            multi: !!W.letter.multi,
            variants: W.letter.variants || [],
            vi: W.letter.vi || 0,
            phase: W.letter.text ? 'done' : 'idle',
          }
        : st.letter,
      iv: W.iv || st.iv,
    }));
  }
  initAuth() {
    window.LisibleAPI.config()
      .then((c) => {
        if (!c.supabaseUrl || !c.supabaseAnonKey) {
          this.setState((st) => ({ auth: { ...st.auth, ready: true, guest: true, user: null, disabled: true } }));
          return;
        }
        this.initAuth2();
      })
      .catch(() => this.setState((st) => ({ auth: { ...st.auth, ready: true, guest: true } })));
  }
  initAuth2() {
    window.CVAuth.current()
      .then((u) => this.onUser(u))
      .catch(() => this.onUser(null));
    window.CVAuth.onChange((ev, u) => {
      if (ev === 'PASSWORD_RECOVERY') {
        this.setState((st) => ({
          auth: { ...st.auth, ready: true, user: u || st.auth.user, open: true, mode: 'newpw', pw: '', err: '', info: '' },
        }));
        return;
      }
      if (ev === 'SIGNED_IN' && u && (!this.state.auth.user || this.state.auth.user.id !== u.id || !this._pulled)) this.onUser(u);
      if (ev === 'SIGNED_OUT' && this.state.auth.user) this.onUser(null);
    }).catch(() => {});
  }
  async onUser(u) {
    this._pulled = false;
    if (!u) {
      this.setState((st) => ({ auth: { ...st.auth, user: null, ready: true } }));
      return;
    }
    this.setState(
      (st) => ({
        auth: { ...st.auth, user: u, guest: false, ready: true, busy: false, open: st.auth.mode === 'newpw' ? st.auth.open : false },
      }),
      () => {},
    );
    this.setState({ sync: 'saving' });
    try {
      const r = await window.CVStore.pull(u.id);
      this._pulled = true;
      if (r.versions.length) {
        const cid = r.settings && r.versions.some((v) => v.id === r.settings.currentId) ? r.settings.currentId : r.versions[0].id;
        this._hist = {};
        // Historique des entretiens : celui du compte, complété par les séances faites sur cet appareil avant connexion.
        const ivHist = r.interviews ? [...r.interviews, ...this.state.ivHist.filter((x) => !r.interviews.some((y) => y.id === x.id))].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 100) : this.state.ivHist;
        this.setState({ versions: r.versions, apps: r.apps, ivHist, currentId: cid, sync: 'ok' });
        this.applySettings(r.settings || {});
      } else {
        const st = this.state;
        const hasWork = st.versions.some((v) => cvText(v.cv).replace(/\s|\|/g, '').length > 10);
        const versions = hasWork ? st.versions : st.versions;
        await window.CVStore.push(u.id, { versions, apps: st.apps, interviews: st.ivHist, settings: settingsOf(st) });
        this.setState({ sync: 'ok' });
        if (hasWork) this.toast('Vos CV de ce navigateur ont été enregistrés dans votre compte');
      }
      this.loadComments();
    } catch (e) {
      console.error(e);
      this.setState({ sync: 'error' });
      this.toast('Impossible de charger vos données : ' + errMsg(e));
    }
  }
  clearLocal() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
    const v = blankVersion('Mon CV');
    this._hist = {};
    this._pulled = false;
    window.CVStore && window.CVStore.reset();
    this.setState((st) => ({
      versions: [v],
      currentId: v.id,
      apps: [],
      ivHist: [],
      comments: [],
      sync: 'local',
      share: { ...st.share, open: false, link: '', token: '' },
      ad: { ...st.ad, phase: 'input', offer: '', analysis: null, acc: {}, sk: {}, info: null, srcPhase: 'idle' },
      letter: { ...st.letter, company: '', role: '', text: '', offerText: '', old: '', phase: 'idle', diag: null },
      iv: { phase: 'idle', qs: [], open: 0, pitch: '', li: null },
    }));
  }
  loadComments() {
    const u = this.state.auth.user;
    if (!u || !window.CVStore) return;
    const vid = this.state.currentId;
    window.CVStore.comments(vid)
      .then((c) => {
        if (this.state.currentId === vid) this.setState({ comments: c });
      })
      .catch((e) => console.warn('commentaires', e));
  }
  maybeSkillSugs() {
    const s = this.state;
    if (s.screen !== 'editor' || !window.CVAI) return;
    const v = this.cur(),
      steps = ['contact', ...v.cv.order];
    if (steps[s.step] !== 'skills') return;
    const t = (v.cv.contact.title || '').trim();
    if (!t || (s.skillAI && s.skillAI.title === t) || this._skBusy === t) return;
    this._skBusy = t;
    window.CVAI.suggestSkills(t, v.cv.skills, v.cv.summary)
      .then((list) => this.setState({ skillAI: { title: t, list } }))
      .catch(() => this.setState({ skillAI: { title: t, list: [] } }))
      .finally(() => {
        this._skBusy = null;
      });
  }
  async loadSuggestions(key, b, e) {
    if (this.state.sugAlts[key] || this.state.sugBusy === key) return;
    this.setState({ sugBusy: key });
    try {
      const alts = await window.CVAI.suggestBullet(b, {
        role: e.role,
        company: e.company,
        title: this.cur().cv.contact.title,
        lang: this.cur().cv.lang,
      });
      this.setState((st) => ({ sugAlts: { ...st.sugAlts, [key]: alts }, sugBusy: null }));
    } catch (err) {
      this.setState({ sugBusy: null, sug: null });
      this.toast(errMsg(err));
    }
  }
  /* Contexte envoyé avec chaque demande d'IA : marché, langue du contenu, mémoire du profil. */
  /* Fiche entreprise : recherche web sur la structure (activité, actualité, valeurs), réutilisée par l'entretien. */
  briefGen() {
    const s = this.state, L = s.letter;
    if (!window.CVAI || s.briefBusy) return;
    if (!String(L.company || '').trim()) {
      this.toast(s.track === 'study' ? 'Renseignez d’abord l’établissement (onglet « Lettre »)' : 'Renseignez d’abord l’entreprise (onglet « Adapter » ou « Lettre »)');
      return;
    }
    this.setState({ briefBusy: true });
    window.CVAI.companyBrief({ company: L.company, role: L.role, offerText: s.ad.offer || L.offerText || '' })
      .then((d) => {
        this.setState({ briefBusy: false, brief: { key: briefKey(L.company), data: d } });
        this.toast(d.found ? (d.kind === 'school' ? 'Fiche établissement prête' : 'Fiche entreprise prête') : 'Peu d’informations publiques trouvées');
      })
      .catch((e) => {
        this.setState({ briefBusy: false });
        this.toast(errMsg(e));
      });
  }
  syncContext() {
    const s = this.state, cv = this.cur().cv;
    const ctx = { market: s.market, track: s.track, lang: cv.lang === 'en' || s.lang === 'en' ? 'en' : 'fr', profile: s.profile };
    const key = JSON.stringify(ctx);
    if (key !== this._ctxKey && window.LisibleAPI) { this._ctxKey = key; window.LisibleAPI.setContext(ctx); }
  }
  /* Télécharge un PDF texte généré par le serveur ; renvoie false si le service est indisponible. */
  /* Exporte en affichant une barre de progression. La durée réelle étant inconnue, la barre avance
     de plus en plus lentement vers 90 %, puis passe à 100 % à la fin. fn renvoie true si le fichier est prêt. */
  async runExport(label, file, fn) {
    clearInterval(this._expI);
    clearTimeout(this._expT);
    this.setState({ exporting: { label, detail: file, pct: 4, state: 'run' } });
    this._expI = setInterval(() => {
      this.setState((st) => (st.exporting && st.exporting.state === 'run' ? { exporting: { ...st.exporting, pct: st.exporting.pct + (90 - st.exporting.pct) * 0.07 } } : null));
    }, 200);
    let ok = false;
    try {
      ok = await fn();
    } catch (e) {
      console.warn(e);
    }
    clearInterval(this._expI);
    this.setState({ exporting: ok ? { label: 'Export terminé', detail: file, pct: 100, state: 'done' } : { label: 'Export impossible', detail: 'Une autre méthode prend le relais', pct: 100, state: 'error' } });
    this._expT = setTimeout(() => this.setState({ exporting: null }), ok ? 2800 : 4000);
    return ok;
  }
  async pdfDownload(html, name) {
    try {
      const blob = await window.LisibleAPI.pdf(html, name);
      this.download(name + '.pdf', blob, 'application/pdf');
      return true;
    } catch (e) {
      console.warn('PDF serveur indisponible', e);
      return false;
    }
  }
  printHtml(html) {
    try {
      const f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;width:0;height:0;border:0';
      document.body.appendChild(f);
      f.contentDocument.open();
      f.contentDocument.write(html);
      f.contentDocument.close();
      setTimeout(() => {
        f.contentWindow.print();
        setTimeout(() => f.remove(), 1000);
      }, 250);
    } catch (e) {}
  }
  letterHtml() {
    const s = this.state, sp = splitLetter(s.letter.text), font = FONTS[s.letFont] || FONTS.Arial;
    const lines = (a, right) => a.map((t, i) => `<div style="${i === 0 ? 'font-weight:700;' : ''}${right ? 'text-align:right;' : ''}">${esc(t)}</div>`).join('');
    const body = (sp.sender.length ? sp.body : s.letter.text).split(/\n\s*\n/).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:2.2cm 2.4cm}body{font-family:${font};font-size:${s.letSize}pt;line-height:1.5;color:#111}p{margin:0 0 .9em}.head{display:flex;flex-direction:column;gap:1.6em;margin-bottom:2em}</style></head><body>${sp.sender.length ? `<div class="head"><div>${lines(sp.sender)}</div><div style="align-self:flex-end">${lines(sp.recipient, true)}</div></div>` : ''}${body}</body></html>`;
  }
  cur() {
    return this.state.versions.find((v) => v.id === this.state.currentId) || this.state.versions[0];
  }
  hist(id) {
    this._hist = this._hist || {};
    return this._hist[id] || (this._hist[id] = { u: [], r: [] });
  }
  undo() {
    const v = this.cur(),
      h = this.hist(v.id);
    if (!h.u.length) {
      this.toast('Rien à annuler');
      return;
    }
    h.r.push(clone(v.cv));
    const prev = h.u.pop();
    this._lastMut = 0;
    this.setState((s) => ({ versions: s.versions.map((x) => (x.id === v.id ? { ...x, cv: prev, updated: Date.now() } : x)) }));
    this.toast('Modification annulée');
  }
  redo() {
    const v = this.cur(),
      h = this.hist(v.id);
    if (!h.r.length) {
      this.toast('Rien à rétablir');
      return;
    }
    h.u.push(clone(v.cv));
    const nx = h.r.pop();
    this._lastMut = 0;
    this.setState((s) => ({ versions: s.versions.map((x) => (x.id === v.id ? { ...x, cv: nx, updated: Date.now() } : x)) }));
    this.toast('Modification rétablie');
  }
  notifyDue() {
    try {
      const n = this.state.apps.filter((a) => dueOf(a)).length;
      if (this.state.prefs.notif && n && window.Notification && Notification.permission === 'granted')
        new Notification('Lisible', { body: n + ' candidature(s) à relancer aujourd’hui' });
    } catch (e) {}
  }
  mut(fn) {
    const now = Date.now(),
      v0 = this.cur(),
      h = this.hist(v0.id);
    if (!this._lastMut || now - this._lastMut > 900 || this._lastMutV !== v0.id) {
      h.u.push(clone(v0.cv));
      if (h.u.length > 60) h.u.shift();
    }
    h.r = [];
    this._lastMut = now;
    this._lastMutV = v0.id;
    this._edit = now;
    clearTimeout(this._et);
    this._et = setTimeout(() => this.forceUpdate(), 1300);
    this.setState((s) => ({
      versions: s.versions.map((v) => {
        if (v.id !== s.currentId) return v;
        const cv = clone(v.cv);
        fn(cv);
        return { ...v, cv, updated: Date.now() };
      }),
    }));
  }
  toast(m) {
    if (window.CVI18N) m = window.CVI18N.t(m);
    this.setState({ toast: m });
    clearTimeout(this._tt);
    this._tt = setTimeout(() => this.setState({ toast: '' }), 2600);
  }
  go(screen, extra) {
    this.setState({ screen, navOpen: false, ...(extra || {}) });
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
  }
  addVersion(name, tag, cv, label) {
    const id = uid(),
      t = Date.now();
    const v = { id, name, tag, updated: t, cv, history: [{ id: uid(), t, label, cv: clone(cv) }] };
    this.setState((s) => ({ versions: [v, ...s.versions], currentId: id }));
    return id;
  }
  snapshot(label) {
    this.setState((s) => ({
      versions: s.versions.map((v) =>
        v.id === s.currentId ? { ...v, history: [{ id: uid(), t: Date.now(), label, cv: clone(v.cv) }, ...v.history] } : v,
      ),
    }));
  }
  async startImport(file, source) {
    if (!file) return;
    const ip0 = this.state.imp,
      mode = ip0.mode;
    const steps = IMPORT_STEPS.map((l) => ({ l, d: '' })),
      set = (i, d, o) => {
        if (d != null) steps[i].d = d;
        this.setState((st) => ({ imp: { ...st.imp, step: i + 1, steps: [...steps], ...(o || {}) } }));
      };
    this.setState((st) => ({
      imp: { ...st.imp, source: source || 'cv', phase: 'parsing', file: this.fileInfo(file), step: 0, steps: [...steps], res: null },
    }));
    try {
      const f = await window.CVExtract.prepare(file);
      set(0, f.pages ? f.pages + ' page' + (f.pages > 1 ? 's' : '') : Math.max(1, Math.round(f.size / 1024)) + ' Ko');
      const chars = (f.text || '').length;
      set(1, f.kind === 'image' ? 'image : lecture par l’IA' : chars.toLocaleString('fr-FR') + ' caractères');
      const r = await window.CVAI.parseCv({
        fileName: f.fileName,
        mimeType: f.mimeType,
        data: f.data,
        text: f.text,
        html: f.html,
        mode,
        source: source || 'cv',
      });
      set(2, r.visualZones ? r.visualZones + ' zone' + (r.visualZones > 1 ? 's' : '') : 'aucune');
      set(3, (r.mapping || []).length + ' sections');
      const raw = f.kind === 'image' ? r.rawText : f.text || r.rawText || '';
      set(4, '12 règles · ' + (r.issues || []).length + ' problème(s)', {
        phase: 'report',
        res: { ...r, rawText: raw, words: wc(raw), kind: f.kind },
      });
    } catch (e) {
      console.error(e);
      this.setState((st) => ({ imp: { ...st.imp, phase: 'idle', step: 0, steps: [] } }));
      this.toast('Import impossible : ' + errMsg(e));
    }
  }
  fileInfo(f) {
    const ext = (f.name.split('.').pop() || '').toUpperCase();
    return { name: f.name, meta: ext + ' · ' + Math.max(1, Math.round(f.size / 1024)) + ' Ko' };
  }
  download(name, content, type) {
    try {
      const blob = new Blob([content], { type });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } catch (e) {}
  }
  exportNow() {
    const s = this.state,
      v = this.cur(),
      cv = dashFree(s.anon ? anonCv(v.cv) : v.cv),
      tpl = applyFont(resolveTpl(s.tpl, s.accent), s.font);
    {
      const p = findPh(v.cv);
      if (p.length) {
        this.toast(p.length + ' repère(s) à compléter avant l’export');
        return;
      }
    }
    const base = s.exp.name || slug(v.name) || 'CV';
    if (s.exp.fmt === 'txt') {
      this.download(base + '.txt', cvText(cv), 'text/plain;charset=utf-8');
    } else if (s.exp.fmt === 'docx') {
      if (window.CVExport) {
        this.runExport('Création du fichier Word…', base + '.docx', () =>
          window.CVExport.docxBlob(docModel(cv, tpl.isDesign && !s.font ? 'Arial' : tpl.fontName, s.fsize)).then((b) => {
            window.CVExport.save(base + '.docx', b);
            return true;
          }),
        ).then((ok) => {
          if (!ok) this.download(base + '.doc', '\ufeff' + docHtml(cv, tpl), 'application/msword');
        });
      } else this.download(base + '.doc', '\ufeff' + docHtml(cv, tpl), 'application/msword');
    } else {
      const node = this.paperRef.current;
      let html;
      if (node && tpl.isDesign) {
        const c = node.cloneNode(true);
        c.querySelectorAll('[style*="dashed"]').forEach((e) => { if (/position:\s*absolute/.test(e.getAttribute('style') || '')) e.remove(); });
        c.querySelectorAll('label').forEach((e) => { if (e.querySelector('input[type=file]')) e.remove(); });
        // La feuille d'aperçu fait 760 px de large (1075 px par page) ; une page A4 en fait 793,7 × 1122,5
        // à 96 ppp. On agrandit donc la copie à la largeur exacte du A4 et on l'étire sur un nombre
        // entier de pages, pour que fonds et colonnes colorées couvrent toute la feuille.
        const h760 = node.offsetWidth ? (node.offsetHeight * 760) / node.offsetWidth : 1075;
        const pages = Math.max(1, Math.ceil((h760 - 4) / 1075));
        c.style.zoom = String(793.7 / 760);
        c.style.width = '760px';
        // 1074,8 px et non 1075 : une fois agrandie, chaque page tient dans les 1122,5 px du A4 sans créer de page vide.
        c.style.minHeight = pages * 1074.8 + 'px';
        c.style.height = pages * 1074.8 + 'px';
        // Le corps (une ou deux colonnes) s'étire jusqu'en bas de la dernière page : la colonne colorée descend jusqu'au bord.
        c.style.display = 'flex';
        c.style.flexDirection = 'column';
        const grid = c.querySelector(':scope > div[style*="grid-template-columns"]');
        if (grid) grid.style.flex = '1 0 auto';
        c.style.border = '0';
        c.style.borderRadius = '0';
        c.style.boxShadow = 'none';
        html = '<html><head><meta charset="utf-8"><style>@page{size:A4;margin:0}body{margin:0}</style></head><body>' + c.outerHTML.replace(/rgba\(232, 72, 28, 0\.07\)/g, 'transparent') + '</body></html>';
      } else html = docHtml(cv, tpl).replace('margin:2cm', 'margin:0').replace('</head>', '<style>@page{size:A4;margin:2cm}</style></head>');
      this.setState((st) => ({ exp: { ...st.exp, open: false } }));
      this.runExport('Création du PDF…', base + '.pdf' + (s.anon ? ' (anonymisé)' : ''), () => this.pdfDownload(html, base)).then((ok) => {
        if (!ok) { this.printHtml(html); this.toast('Service PDF indisponible : choisissez « Enregistrer au format PDF » dans la fenêtre d’impression'); }
      });
      return;
    }
    this.setState((st) => ({ exp: { ...st.exp, open: false } }));
    if (s.exp.fmt === 'txt' || !window.CVExport) this.toast('Fichier ' + (s.exp.fmt === 'txt' ? 'TXT' : 'Word') + ' téléchargé' + (s.anon ? ' (anonymisé)' : ''));
  }

  pvBoxRef = React.createRef();
  pvScrollRef = React.createRef();
  scrollPv() {
    setTimeout(() => {
      const c = this.pvScrollRef.current;
      if (!c || c.scrollHeight <= c.clientHeight + 4) return;
      const steps = ['contact', ...this.cur().cv.order],
        key = steps[this.state.step] || 'contact';
      const el = key === 'contact' ? null : c.querySelector('[data-sec="' + key + '"]');
      const top = el ? el.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 60 : 0;
      const from = c.scrollTop,
        to = Math.max(0, Math.min(top, c.scrollHeight - c.clientHeight)),
        t0 = performance.now(),
        d = 280;
      cancelAnimationFrame(this._raf);
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / d),
          e = 1 - Math.pow(1 - p, 3);
        c.scrollTop = from + (to - from) * e;
        if (p < 1) this._raf = requestAnimationFrame(tick);
      };
      if (document.documentElement.getAttribute('data-motion') === 'reduce') c.scrollTop = to;
      else this._raf = requestAnimationFrame(tick);
    }, 60);
  }
  watchPv() {
    const n = this.pvBoxRef.current;
    if (n === this._pvNode) return;
    if (this._ro) this._ro.disconnect();
    this._pvNode = n;
    if (!n || !window.ResizeObserver) return;
    this._ro = new ResizeObserver((es) => {
      const w = Math.round(es[0].contentRect.width);
      if (w && Math.abs(w - this.state.pvW) > 2) this.setState({ pvW: w });
    });
    this._ro.observe(n);
  }
  paperRef = React.createRef();
  async exportPack() {
    const s = this.state,
      v = this.cur(),
      cv = s.anon ? anonCv(v.cv) : v.cv,
      tpl = applyFont(resolveTpl(s.tpl, s.accent), s.font);
    const base = slug(v.name) || 'CV';
    {
      const p = findPh(v.cv);
      if (p.length) {
        this.toast(p.length + ' repère(s) à compléter avant l’export');
        return;
      }
    }
    if (!window.CVExport) {
      this.toast('Module d’export indisponible');
      return;
    }
    this.toast('Préparation du pack…');
    try {
      const L = s.letter;
      const letter = L.text;
      const cvB = await window.CVExport.docxBlob(docModel(cv, tpl.isDesign && !s.font ? 'Arial' : tpl.fontName, s.fsize));
      const lB = letter
        ? await window.CVExport.letterDocxBlob(splitLetter(letter).sender.length ? splitLetter(letter) : letter, {
            font: s.letFont,
            size: s.letSize,
          })
        : null;
      const iv = s.iv;
      const fiche = [
        'FICHE ENTRETIEN : ' + L.company + ' · ' + L.role,
        '',
        'PITCH (30 s)',
        iv.pitch || '(à générer dans l’onglet Entretien)',
        '',
        'QUESTIONS PROBABLES',
        ...(iv.qs || []).map(
          (q, i) => i + 1 + '. ' + q.q + (q.star.a ? '\n   Action : ' + q.star.a : '') + (q.star.r ? '\n   Résultat : ' + q.star.r : ''),
        ),
      ].join('\n');
      const z = await window.CVExport.zip([
        { name: base + '_ATS.docx', data: cvB },
        { name: base + '.txt', data: cvText(cv) },
        ...(lB ? [{ name: 'Lettre_' + slug(L.company || 'candidature') + '.docx', data: lB }] : []),
        { name: 'Fiche_entretien.txt', data: fiche },
      ]);
      window.CVExport.save('Pack_candidature_' + (slug(L.company || '') || slug(v.name) || 'CV') + '.zip', z);
      this.setState((st) => ({ exp: { ...st.exp, open: false } }));
      this.toast(
        lB
          ? 'Pack candidature téléchargé : CV, lettre, fiche entretien'
          : 'Pack téléchargé (sans lettre : rédigez-la dans l’onglet Lettre)',
      );
    } catch (e) {
      this.toast('Export impossible : ' + e.message);
    }
  }
  readImg(file, max, cb) {
    try {
      const r = new FileReader();
      r.onload = () => {
        const img = new Image();
        img.onload = () => {
          const k = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * k);
          c.height = Math.round(img.height * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          cb(c.toDataURL('image/jpeg', 0.85));
        };
        img.src = r.result;
      };
      r.readAsDataURL(file);
    } catch (e) {}
  }
  loadSrcImg(key, file) {
    this.readImg(file, 2000, (url) => {
      this.setState((st) => ({ [key]: { ...st[key], img: url } }));
      this.runSrc(key, 'image', { name: file.name, data: url.split(',')[1] });
    });
  }
  async runSrc(key, kind, payload) {
    const M = {
      link: 'Récupération et lecture de la page…',
      image: 'Lecture de l’image (vision + OCR)…',
      pdf: 'Extraction du texte de l’annonce…',
    }[kind];
    const upd = (o) => this.setState((st) => ({ [key]: { ...st[key], ...o } }));
    upd({ srcPhase: 'busy', busyText: M, busyPct: 35, info: null });
    try {
      let o, from;
      if (kind === 'link') {
        o = await window.CVAI.offerFromUrl(payload);
        from = o.host;
      } else if (kind === 'image') {
        o = await window.CVAI.offerFromImage('image/jpeg', payload.data);
        from = payload.name + ' · vision + OCR';
      } else {
        const f = await window.CVExtract.prepare(payload);
        upd({ busyText: 'Structuration de l’offre…', busyPct: 70 });
        o =
          f.kind === 'pdf' && (f.text || '').length < 200
            ? await window.CVAI.offerFromPdf(f.data)
            : f.kind === 'image'
              ? await window.CVAI.offerFromImage(f.mimeType, f.data)
              : await window.CVAI.offerFromText(f.text || '');
        from = payload.name + (f.pages ? ' · ' + f.pages + ' page' + (f.pages > 1 ? 's' : '') : '');
      }
      const info = {
        title: [o.role, o.company].filter(Boolean).join(', ') || 'Annonce extraite',
        detail:
          from +
          ' · ' +
          o.wordCount +
          ' mots' +
          (o.sections && o.sections.length ? ' · ' + o.sections.slice(0, 4).join(', ') + ' détectés' : ''),
      };
      const extra =
        key === 'ad'
          ? { offer: o.text, meta: o, fetchedUrl: kind === 'link' ? payload : '' }
          : { company: o.company || this.state.letter.company, role: o.role || this.state.letter.role, offerText: o.text };
      upd({ srcPhase: 'done', busyPct: 100, info, ...extra });
      this.toast('Offre analysée par l’IA');
      return true;
    } catch (e) {
      upd({ srcPhase: 'idle', busyPct: 0 });
      this.toast(errMsg(e));
      return false;
    }
  }
  async letterAction() {
    const s = this.state,
      L = s.letter;
    if (L.phase === 'busy' || L.phase === 'stream') return;
    if (L.mode === 'improve' && !L.old.trim()) {
      this.toast('Importez ou collez d’abord votre lettre');
      return;
    }
    if (!L.company.trim() || !L.role.trim()) {
      this.toast(s.track === 'study' ? 'Indiquez l’établissement et la formation visée' : 'Indiquez l’entreprise et le poste visé');
      return;
    }
    const cv = s.anon ? anonCv(this.cur().cv) : this.cur().cv;
    const offerText = (L.src === 'offer' ? s.ad.offer || L.offerText : L.offerText || s.ad.offer) || '';
    const lang = L.lang || (cv.lang === 'en' ? 'en' : s.lang === 'en' ? 'en' : 'fr');
    const brief = s.brief && s.brief.data && s.brief.data.found && s.brief.key === briefKey(L.company) ? s.brief.data : null;
    const study = s.track === 'study';
    const base = { cv, offer: { company: L.company, role: L.role, text: offerText }, tone: L.tone, mode: L.mode, oldLetter: L.old, lang, brief, ...(study ? { doc: L.doc || 'lettre', limit: Number(L.limit) || 0 } : {}) };
    const tidy = (t) => (lang === 'en' ? t : NT().autoFix(t).text);
    const diag = (st) => (st.letter.mode === 'improve' ? letterDiag(st.letter.old, st.letter.company) : null);

    if (!L.multi) {
      // Une seule lettre, affichée mot à mot pendant la rédaction.
      this.setState((st) => ({ letter: { ...st.letter, phase: 'busy', text: '', variants: [], vi: 0, diag: null } }));
      let acc = '';
      try {
        const final = await window.CVAI.letterStream(base, (d) => {
          acc += d;
          this.setState((st) => ({ letter: { ...st.letter, phase: 'stream', text: acc } }));
        });
        this.setState((st) => ({ letter: { ...st.letter, phase: 'done', text: tidy(final), diag: diag(st) } }));
        this.toast('Lettre rédigée');
      } catch (e) {
        this.setState((st) => ({ letter: { ...st.letter, phase: st.letter.text ? 'done' : 'idle' } }));
        this.toast(errMsg(e));
      }
      return;
    }

    // Trois variantes rédigées en parallèle, chacune avec un angle différent.
    const ANGLES =
      s.track === 'study'
        ? [['realisation', 'Travail marquant'], ['motivation', 'Choix de la formation'], ['parcours', 'Parcours et projet']]
        : [['realisation', 'Réalisation phare'], ['motivation', 'Motivation pour l’entreprise'], ['parcours', 'Parcours et progression']];
    this.setState((st) => ({ letter: { ...st.letter, phase: 'busy', text: '', vi: 0, diag: null, variants: ANGLES.map(([angle, label]) => ({ angle, label, text: '', status: 'busy' })) } }));
    const upd = (i, o) =>
      this.setState((st) => {
        const vs = st.letter.variants.map((x, j) => (j === i ? { ...x, ...o } : x));
        const shown = vs[st.letter.vi] || vs[0];
        const finished = vs.every((x) => x.status !== 'busy');
        return { letter: { ...st.letter, variants: vs, text: shown.text, phase: finished ? (vs.some((x) => x.text) ? 'done' : 'idle') : shown.text ? 'stream' : 'busy', diag: finished ? diag(st) : null } };
      });
    await Promise.all(
      ANGLES.map(async ([angle], i) => {
        let acc = '';
        try {
          const final = await window.CVAI.letterStream({ ...base, angle }, (d) => {
            acc += d;
            upd(i, { text: acc });
          });
          upd(i, { text: tidy(final), status: 'done' });
        } catch (e) {
          upd(i, { status: 'error', error: errMsg(e) });
        }
      }),
    );
    const n = this.state.letter.variants.filter((x) => x.status === 'done').length;
    this.toast(n ? n + ' variante' + (n > 1 ? 's' : '') + ' rédigée' + (n > 1 ? 's' : '') + ' : choisissez la vôtre' : 'La rédaction a échoué. Réessayez.');
  }
  authSet(o) {
    this.setState((st) => ({ auth: { ...st.auth, ...o } }));
  }
  async authRun(fn, okMsg) {
    if (!window.CVAuth) {
      this.authSet({ err: 'Service de connexion indisponible' });
      return;
    }
    this.authSet({ busy: true, err: '', info: '' });
    try {
      const r = await fn();
      if (r.redirecting) return;
      if (r.pending) {
        this.authSet({
          busy: false,
          pw: '',
          info: 'Compte créé : confirmez votre adresse grâce au lien reçu par e-mail, puis connectez-vous.',
          mode: 'in',
        });
        return;
      }
      this.authSet({ busy: false, pw: '', err: '' });
      await this.onUser(r.user);
      this.toast(okMsg + ' ' + (r.user.name || r.user.email));
    } catch (e) {
      this.authSet({ busy: false, err: e.message });
    }
  }
  renderVals() {
    const MK = marketOf(this.state.market);
    const briefOk = !!(this.state.brief && this.state.brief.data && this.state.brief.key === briefKey(this.state.letter.company));
    const s = this.state,
      v = this.cur(),
      cv = v.cv,
      tpl = applyFont(resolveTpl(s.tpl, s.accent), s.font),
      view = dashFree(s.anon ? anonCv(cv) : cv);
    const clean = (t) => NT().autoFix(t || '').text,
      auto = s.prefs.autoClean !== false;
    const blurClean = (val, set) => {
      if (!auto || !val) return;
      const r = NT().autoFix(val);
      if (r.changes.length && r.text !== val) {
        set(r.text);
        this.toast(
          'Nettoyé automatiquement : ' +
            r.changes[0].split(' : ')[0].toLowerCase() +
            (r.changes.length > 1 ? ' (+' + (r.changes.length - 1) + ')' : ''),
        );
      }
    };
    const an = analyze(cv, tpl);
    if (this._start && this._start[v.id] == null) this._start[v.id] = an.score;
    const start = this._start && this._start[v.id] != null ? this._start[v.id] : an.score,
      dl = an.score - start;
    const steps = ['contact', ...cv.order],
      stepIdx = Number.isFinite(s.step) ? Math.max(0, Math.min(s.step, steps.length - 1)) : 0,
      guided = true;
    const mut = (f) => this.mut(f);
    const lf = (list, i, k) => (ev) => {
      const val = ev.target.value;
      mut((c) => {
        c[list][i][k] = val;
      });
    };
    const filled = {
      contact: !!(cv.contact.name && cv.contact.email),
      summary: !!cv.summary.trim(),
      experience: cv.experiences.some((e) => e.role),
      education: cv.education.some((e) => e.degree),
      skills: cv.skills.length > 0,
      languages: cv.languages.length > 0,
      projects: cv.projects.length > 0,
      certifications: cv.certifications.length > 0,
    };
    const meta = {
      contact: '',
      summary: wc(cv.summary) + ' mots',
      experience: cv.experiences.length + ' poste(s)',
      education: cv.education.length + ' diplôme(s)',
      skills: cv.skills.length + ' compétences',
      languages: cv.languages.length + ' langue(s)',
      projects: cv.projects.length + ' projet(s)',
      certifications: cv.certifications.length + ' certification(s)',
    };
    const T = s.lang === 'en' ? UI_EN : UI_FR;
    const titles = {
      interview: [T.interview, 'Questions probables, réponses STAR, pitch de 30 secondes et profil LinkedIn'],
      apps: [T.apps, 'Suivez chaque candidature et comparez votre CV à plusieurs offres'],
      settings: [T.settings, 'Compte, langue, données personnelles et accessibilité'],
      home: ['Accueil', 'Créez, importez ou adaptez un CV conforme aux ATS'],
      editor: ['Éditeur', 'Parcours guidé, aperçu et score de conformité en direct'],
      import: [s.imp.mode === 'simple' ? 'Mise en conformité' : 'Importer un CV', 'Extraction, rapport de conformité et conversion'],
      adapt: ['Adapter à une offre', 'Texte, lien, image ou PDF : l’IA compare l’annonce à votre CV'],
      jobs: [T.jobs, 'Offres France Travail classées selon votre CV, recherches enregistrées'],
      letter: ['Lettre de motivation', 'Rédigez-en une nouvelle ou améliorez la vôtre, à partir de l’offre visée'],
      versions: ['Versions', 'Sauvegarde, duplication, renommage et historique'],
    };
    const navDef = [
      ['home', T.home, ''],
      ['editor', T.editor, an.score + ''],
      ['import', T.import, ''],
      ['adapt', T.adapt, ''],
      ...(s.track === 'study' ? [] : [['jobs', T.jobs, '']]),
      ['letter', T.letter, ''],
      ['interview', T.interview, ''],
      ['apps', T.apps, s.apps.length + ''],
      ['versions', T.versions, s.versions.length + ''],
      ['settings', T.settings, ''],
    ];
    const nav = navDef.map(([k, label, m]) => {
      const on = s.screen === k;
      return {
        label,
        meta: m,
        bg: on ? 'rgba(255,255,255,.1)' : 'transparent',
        op: on ? 1 : 0.72,
        dot: on ? 'var(--ac)' : 'transparent',
        fw: on ? 600 : 500,
        go: () => this.go(k),
      };
    });
    const seg = (on) => ({ bg: on ? 'var(--btn)' : 'transparent', fg: on ? 'var(--btnfg)' : 'var(--mu)' });
    // editor sections
    const keys = guided ? [steps[stepIdx]] : steps;
    const editorSections = keys.map((k) => {
      const i = cv.order.indexOf(k),
        open = guided || !!s.open[k];
      return {
        label: (cv.kind === 'academic' ? LABELS_AC : LABELS)[k],
        meta: meta[k],
        guided,
        blocks: !guided,
        showBody: open,
        chev: open ? '−' : '+',
        stepNum: steps.indexOf(k) + 1,
        stepTotal: steps.length,
        hint: HINTS[k],
        tip: MK.tips[k] || TIPS[k],
        movable: !guided && k !== 'contact',
        upOp: i > 0 ? 1 : 0.35,
        downOp: i >= 0 && i < cv.order.length - 1 ? 1 : 0.35,
        toggle: () => this.setState((st) => ({ open: { ...st.open, [k]: !st.open[k] } })),
        up: () => {
          if (i > 0)
            mut((c) => {
              const o = c.order;
              [o[i - 1], o[i]] = [o[i], o[i - 1]];
            });
        },
        down: () => {
          if (i >= 0 && i < cv.order.length - 1)
            mut((c) => {
              const o = c.order;
              [o[i + 1], o[i]] = [o[i], o[i + 1]];
            });
        },
        isContact: k === 'contact',
        isSummary: k === 'summary',
        isExperience: k === 'experience',
        isEducation: k === 'education',
        isSkills: k === 'skills',
        isLanguages: k === 'languages',
        isProjects: k === 'projects',
        isCertifications: k === 'certifications',
      };
    });
    const stepper = steps.map((k, i) => {
      const on = i === stepIdx,
        done = filled[k];
      return {
        label: (cv.kind === 'academic' ? LABELS_AC : LABELS)[k].replace(/ professionnel(le)?/, ''),
        num: done && !on ? '✓' : String(i + 1),
        bg: on ? 'var(--btn)' : 'var(--panel)',
        bd: on ? 'var(--btn)' : 'var(--line)',
        fg: on ? 'var(--btnfg)' : 'var(--tx)',
        numBg: on ? 'var(--ac)' : done ? 'var(--oks)' : 'var(--sub)',
        numFg: on ? '#ffffff' : done ? 'var(--ok)' : 'var(--mu)',
        go: () => this.setState({ step: i }),
      };
    });
    const filledN = steps.filter((k) => filled[k]).length;
    const contactFields = [
      ['name', 'Nom complet', 'Camille Moreau'],
      ['title', 'Intitulé du poste visé', 'Développeuse Full-Stack'],
      ['email', 'E-mail', 'prenom.nom@email.fr'],
      ['phone', 'Téléphone', MK.phone],
      ['city', 'Ville', MK.city],
      ['linkedin', 'LinkedIn', 'linkedin.com/in/…'],
      ['github', 'GitHub / Portfolio', 'github.com/…'],
    ].map(([k, label, ph]) => ({
      label,
      ph,
      value: cv.contact[k],
      onChange: (ev) => {
        const val = ev.target.value;
        mut((c) => {
          c.contact[k] = val;
        });
      },
    }));
    const sumW = wc(cv.summary),
      je = /(^|[\s(])(je\s|j['’])/i.test(cv.summary);
    const sumInfo = {
      text: sumW + ' mots · idéal 35–90' + (je ? ' · contient « je »' : ''),
      color: sumW >= 35 && sumW <= 90 && !je ? 'var(--ok)' : 'var(--wa)',
    };
    const exps = cv.experiences.map((e, ei) => {
      const sb = e.start && !DATE_RE.test(e.start.trim()),
        eb = e.end && !DATE_RE.test(e.end.trim());
      return {
        heading: e.role || e.company ? (e.role || 'Poste') + (e.company ? ' · ' + e.company : '') : 'Expérience ' + (ei + 1),
        role: e.role,
        company: e.company,
        city: e.city,
        start: e.start,
        end: e.end,
        startBd: sb ? 'var(--wa)' : 'var(--line2)',
        endBd: eb ? 'var(--wa)' : 'var(--line2)',
        dateWarn: !!(sb || eb),
        onRole: lf('experiences', ei, 'role'),
        onCompany: lf('experiences', ei, 'company'),
        onCity: lf('experiences', ei, 'city'),
        onStart: lf('experiences', ei, 'start'),
        onEnd: lf('experiences', ei, 'end'),
        remove: () =>
          mut((c) => {
            c.experiences.splice(ei, 1);
          }),
        addBullet: () =>
          mut((c) => {
            c.experiences[ei].bullets.push('');
          }),
        bullets: e.bullets.map((b, bi) => {
          const key = e.id + ':' + bi,
            alts = s.sug === key ? (s.sugAlts[key] || []).map(clean) : [],
            sugLoading = s.sug === key && !s.sugAlts[key];
          return {
            text: b,
            onChange: (ev) => {
              const val = ev.target.value;
              mut((c) => {
                c.experiences[ei].bullets[bi] = val;
              });
            },
            onFocus: () => {
              if (s.libExp !== e.id) this.setState({ libExp: e.id });
            },
            remove: () => {
              mut((c) => {
                c.experiences[ei].bullets.splice(bi, 1);
              });
              this.setState({ sug: null });
            },
            toggleSug: () => {
              const open = s.sug !== key;
              this.setState({ sug: open ? key : null });
              if (open && b.trim() && !(!isWeak(b) && hasNum(b))) this.loadSuggestions(key, b, e);
            },
            sugOpen: s.sug === key,
            weak: !!b.trim() && isWeak(b),
            ...(() => {
              const h = b.trim() ? NT().analyze(b).hits[0] : null;
              return { hasTic: !!h, tic: h ? h.match : '' };
            })(),
            fixTic: () => {
              const r = clean(b);
              if (r !== b) {
                mut((c) => {
                  c.experiences[ei].bullets[bi] = r;
                });
                this.toast('Tic supprimé');
              } else this.setState({ sug: key });
            },
            onBlur: (ev) => {
              const val = ev.target.value;
              blurClean(val, (t) =>
                mut((c) => {
                  c.experiences[ei].bullets[bi] = t;
                }),
              );
            },
            question: window.CVAI ? window.CVAI.metricQuestion(b) : 'Quel résultat mesurable ?',
            mqVal: s.mq[key] || '',
            onMq: (ev) => {
              const val = ev.target.value;
              this.setState((st) => ({ mq: { ...st.mq, [key]: val } }));
            },
            useMq: () => {
              const a = (s.mq[key] || '').trim();
              if (!a) {
                this.toast('Indiquez d’abord le chiffre réel');
                return;
              }
              const p = window.CVAI ? window.CVAI.integrateMetric(b, a) : Promise.resolve(b.replace(/\.$/, '') + ' (' + a + ').');
              this.toast('Intégration en cours…');
              p.then((nb) => {
                mut((c) => {
                  c.experiences[ei].bullets[bi] = nb;
                });
                this.setState((st) => ({ sug: null, mq: { ...st.mq, [key]: '' } }));
                this.toast('Chiffre intégré à la réalisation');
              }).catch((e) => this.toast(errMsg(e)));
            },
            noNum: !!b.trim() && !hasNum(b),
            noAlts: s.sug === key && !sugLoading && alts.length === 0 && !isWeak(b) && hasNum(b),
            sugLoading,
            alts: alts.map((a) => ({
              text: a,
              use: () => {
                mut((c) => {
                  c.experiences[ei].bullets[bi] = a;
                });
                this.setState({ sug: null });
                this.toast('Formulation remplacée');
              },
            })),
          };
        }),
      };
    });
    const libE = cv.experiences.find((e) => e.id === s.libExp) || cv.experiences[0];
    const edus = cv.education.map((d, i) => ({
      ...d,
      onDegree: lf('education', i, 'degree'),
      onSchool: lf('education', i, 'school'),
      onCity: lf('education', i, 'city'),
      onStart: lf('education', i, 'start'),
      onEnd: lf('education', i, 'end'),
      onDetails: lf('education', i, 'details'),
      remove: () =>
        mut((c) => {
          c.education.splice(i, 1);
        }),
    }));
    const addSkill = () => {
      const t = s.skillDraft.trim();
      if (!t) return;
      if (!cv.skills.some((x) => x.toLowerCase() === t.toLowerCase()))
        mut((c) => {
          c.skills.push(t);
        });
      this.setState({ skillDraft: '' });
    };
    const skillSugs = (s.skillAI && s.skillAI.title === (cv.contact.title || '').trim() ? s.skillAI.list : [])
      .filter((k) => !cv.skills.some((x) => x.toLowerCase() === k.toLowerCase()))
      .slice(0, 6)
      .map((k) => ({
        label: k,
        add: () =>
          mut((c) => {
            c.skills.push(k);
          }),
      }));
    const levelOpts = cv.lang === 'en' ? LEVELS_EN : LEVELS_FR;
    const langs = cv.languages.map((l, i) => ({
      ...l,
      onName: lf('languages', i, 'name'),
      onLevel: lf('languages', i, 'level'),
      remove: () =>
        mut((c) => {
          c.languages.splice(i, 1);
        }),
    }));
    const projs = cv.projects.map((p, i) => ({
      ...p,
      onName: lf('projects', i, 'name'),
      onLink: lf('projects', i, 'link'),
      onDesc: lf('projects', i, 'desc'),
      remove: () =>
        mut((c) => {
          c.projects.splice(i, 1);
        }),
    }));
    const certs = cv.certifications.map((p, i) => ({
      ...p,
      onName: lf('certifications', i, 'name'),
      onIssuer: lf('certifications', i, 'issuer'),
      onDate: lf('certifications', i, 'date'),
      remove: () =>
        mut((c) => {
          c.certifications.splice(i, 1);
        }),
    }));
    // preview
    const pv = {
      name: view.contact.name || 'Votre nom',
      title: view.contact.title,
      contactLine: contactLine(view),
      summary: view.summary,
      exps: view.experiences
        .filter((e) => e.role || e.company || (e.bullets || []).some((b) => b.trim()))
        .map((e) => ({
          head: e.role + (e.company ? ', ' + e.company : ''),
          meta: [e.city, dates(e)].filter(Boolean).join(' | '),
          bullets: e.bullets.filter((b) => b.trim()).map((t) => ({ text: t })),
        })),
      edus: view.education
        .filter((e) => e.degree)
        .map((e) => ({
          head: e.degree,
          meta: [e.school, e.city, dates(e)].filter(Boolean).join(' | '),
          details: e.details,
          hasDetails: !!e.details,
        })),
      skills: view.skills.join(', '),
      langs: view.languages
        .filter((l) => l.name)
        .map((l) => l.name + ' : ' + l.level)
        .join(' ; '),
      projs: view.projects.filter((p) => p.name).map((p) => ({ name: p.name, desc: p.desc, link: p.link ? '(' + p.link + ')' : '' })),
      certs: view.certifications.filter((c) => c.name).map((c) => ({ line: [c.name, c.issuer, c.date].filter(Boolean).join(', ') })),
    };
    pv.exps = view.experiences
      .filter((e) => e.role || e.company || (e.bullets || []).some((b) => b.trim()))
      .map((e) => ({
        head: e.role + (e.company ? ', ' + e.company : ''),
        meta: [e.city, dates(e)].filter(Boolean).join(' | '),
        role: e.role,
        sub: [e.company, e.city].filter(Boolean).join(', '),
        dates: dates(e),
        bullets: e.bullets.filter((b) => b.trim()).map((t) => ({ text: t })),
      }));
    Object.assign(pv, {
      photoBg: view.contact.photo ? 'url("' + view.contact.photo + '")' : 'none',
      photo: view.contact.photo || '',
      hasPhoto: !!view.contact.photo,
      noPhoto: !view.contact.photo,
      photoLabel: s.anon ? 'Photo masquée' : '+ Ajouter une photo',
      contactItems: [view.contact.city, view.contact.phone, view.contact.email, view.contact.linkedin, view.contact.github]
        .filter((x) => x && x.trim())
        .map((t) => ({ text: t })),
      skillItems: view.skills.map((t) => ({ text: t })),
      hasSkills: view.skills.length > 0,
      langItems: view.languages.filter((l) => l.name),
      hasLangs: view.languages.some((l) => l.name),
    });
    const pvSections = view.order
      .filter((k) => secText(view, k).length && !(tpl.twoCol && (k === 'skills' || k === 'languages')))
      .map((k) => ({
        key: k,
        hl: k === steps[stepIdx] && s.screen === 'editor' ? 'rgba(232,72,28,.07)' : 'rgba(0,0,0,0)',
        label: labOf(view, k),
        isSummary: k === 'summary',
        isExperience: k === 'experience',
        isEducation: k === 'education',
        isSkills: k === 'skills',
        isLanguages: k === 'languages',
        isProjects: k === 'projects',
        isCertifications: k === 'certifications',
      }));
    const gauge = {
      color: scoreColor(an.score),
      deg: Math.round(an.score * 3.6),
      label: an.score >= 90 ? 'Excellent' : an.score >= 75 ? 'Bon' : an.score >= 60 ? 'À améliorer' : 'Risque élevé',
    };
    const rules = an.rules
      .map((r) => ({
        label: r.label,
        detail: r.d,
        mark: { ok: '✓', warn: '!', fail: '✕' }[r.s],
        color: { ok: 'var(--ok)', warn: 'var(--wa)', fail: 'var(--er)' }[r.s],
        bg: { ok: 'var(--oks)', warn: 'var(--was)', fail: 'var(--ers)' }[r.s],
        pts: (r.s === 'ok' ? r.w : r.s === 'warn' ? r.w / 2 : 0) + '/' + r.w,
        cursor: r.fix ? 'pointer' : 'default',
        go: () => {
          if (!r.fix) return;
          if (r.fix === 'template') {
            this.setState({ galleryOpen: true });
            return;
          }
          const i = steps.indexOf(r.fix);
          this.setState((st) => ({ screen: 'editor', mTab: 'form', step: i < 0 ? 0 : i, open: { ...st.open, [r.fix]: true } }));
        },
      }))
      .sort((a, b) => ({ '✕': 0, '!': 1, '✓': 2 })[a.mark] - { '✕': 0, '!': 1, '✓': 2 }[b.mark]);
    const priorities = an.rules
      .filter((r) => r.s !== 'ok')
      .sort((a, b) => (a.s === 'fail' ? 0 : 1) - (b.s === 'fail' ? 0 : 1) || b.w - a.w)
      .slice(0, 3)
      .map((r) => ({
        label: r.label,
        detail: r.d,
        gain: '+' + (r.s === 'fail' ? r.w : r.w / 2) + ' pts',
        color: r.s === 'fail' ? 'var(--er)' : 'var(--wa)',
        bg: r.s === 'fail' ? 'var(--ers)' : 'var(--was)',
        go: () => {
          if (r.fix === 'template') {
            this.setState({ screen: 'editor', galleryOpen: true });
            return;
          }
          const i = steps.indexOf(r.fix);
          this.setState({ screen: 'editor', step: i < 0 ? 0 : i, mTab: 'form' });
        },
      }));
    // import
    const ip = s.imp,
      isLI = ip.source === 'linkedin',
      IR = ip.res;
    const impSteps = (ip.steps || []).map((x, i) => ({
      label: x.l,
      detail: i < ip.step ? x.d : '',
      mark: i < ip.step ? '✓' : i === ip.step ? '›' : '·',
      color: i < ip.step ? 'var(--ok)' : i === ip.step ? 'var(--ac)' : 'var(--fa)',
      fg: i <= ip.step ? 'var(--tx)' : 'var(--fa)',
    }));
    const sevC = { Bloquant: ['var(--ers)', 'var(--er)'], Important: ['var(--was)', 'var(--wa)'], Mineur: ['var(--sub)', 'var(--mu)'] };
    // adapt
    const A = s.ad,
      AN = A.analysis,
      KW = AN ? AN.keywords : [],
      RW = AN ? AN.rewrites : [],
      mB = matchKw(cv, KW),
      applied = applyAdapt(cv, A.acc, A.sk, RW),
      mA = matchKw(applied, KW);
    const grpT = { tech: 'Compétences techniques', soft: 'Compétences transverses', domain: 'Domaine' };
    const kwGroups = ['tech', 'soft', 'domain'].map((g) => ({
      title: grpT[g],
      items: mB.list
        .filter((k) => k.g === g)
        .map((k, i) => {
          const after = (mA.list.find((x) => x.k === k.k) || {}).found;
          const st = k.found ? 'ok' : after ? 'add' : 'miss';
          return {
            label: k.k,
            mark: { ok: '✓', add: '+', miss: '✕' }[st],
            bg: { ok: 'var(--oks)', add: 'var(--acs)', miss: 'transparent' }[st],
            fg: { ok: 'var(--ok)', add: 'var(--ac)', miss: 'var(--er)' }[st],
            bd: { ok: 'transparent', add: 'var(--ac)', miss: 'var(--er)' }[st],
          };
        }),
    }));
    const reqs = (AN ? AN.requirements : [])
      .map((r) => [r.label, r.met, r.detail])
      .map(([label, ok, detail]) => ({ label, detail, mark: ok ? '✓' : '✕', color: ok ? 'var(--ok)' : 'var(--er)' }));
    const skillAdds = Object.keys(A.sk)
      .filter((k) => !cv.skills.includes(k))
      .map((k) => {
        const on = A.sk[k];
        return {
          label: k,
          box: on ? '✓' : '',
          bg: on ? 'var(--ac)' : 'var(--panel)',
          bd: on ? 'var(--ac)' : 'var(--line2)',
          toggle: () => this.setState((st) => ({ ad: { ...st.ad, sk: { ...st.ad.sk, [k]: !st.ad.sk[k] } } })),
        };
      });
    const adaptSugs = RW.map((x) => {
      const on = !!A.acc[x.id],
        e = cv.experiences[x.exp];
      const before =
        x.kind === 'summary' ? cv.summary : x.kind === 'add' ? '(nouvelle ligne)' : (e && e.bullets[x.b]) || '(nouvelle ligne)';
      return {
        where: x.where,
        before,
        after: x.after,
        adds: (x.adds || []).join(' · '),
        note: x.check,
        hasNote: !!x.check,
        btn: on ? '✓ Acceptée' : 'Accepter',
        bg: on ? 'var(--ac)' : 'var(--panel)',
        fg: on ? 'var(--acfg)' : 'var(--tx)',
        bd: on ? 'var(--ac)' : 'var(--line2)',
        rowBg: on ? 'transparent' : 'var(--sub)',
        toggle: () => this.setState((st) => ({ ad: { ...st.ad, acc: { ...st.ad.acc, [x.id]: !st.ad.acc[x.id] } } })),
      };
    });
    const accN = Object.values(A.acc).filter(Boolean).length;
    // letter
    const L = s.letter;
    const tones = ['Sobre', 'Enthousiaste', 'Direct'].map((t) => ({
      label: t,
      ...seg(L.tone === t),
      go: () => this.setState((st) => ({ letter: { ...st.letter, tone: t } })),
    }));
    // versions
    const sel = s.versions.find((x) => x.id === s.histSel) || v;
    const vers = s.versions.map((x) => {
      const sc = analyze(x.cv, tpl).score,
        active = x.id === s.currentId,
        isSel = x.id === sel.id;
      return {
        name: x.name,
        tag: x.tag,
        updated: rel(x.updated),
        histCount: x.history.length,
        score: sc,
        color: scoreColor(sc),
        bg: isSel ? 'var(--sub)' : 'transparent',
        mark: active ? 'var(--ac)' : 'transparent',
        tagBg: x.tag === 'Ciblé' ? 'var(--acs)' : 'var(--sub)',
        tagFg: x.tag === 'Ciblé' ? 'var(--ac)' : 'var(--mu)',
        renaming: s.renaming === x.id,
        notRenaming: s.renaming !== x.id,
        select: () => this.setState({ histSel: x.id }),
        open: (ev) => {
          ev.stopPropagation();
          this.go('editor', { currentId: x.id });
        },
        rename: (ev) => {
          ev.stopPropagation();
          this.setState({ renaming: x.id, renameText: x.name });
        },
        dup: (ev) => {
          ev.stopPropagation();
          const id = uid(),
            t = Date.now();
          this.setState((st) => ({
            versions: [
              {
                ...clone(x),
                id,
                name: x.name + ' (copie)',
                updated: t,
                history: [{ id: uid(), t, label: 'Dupliquée depuis « ' + x.name + ' »', cv: clone(x.cv) }],
              },
              ...st.versions,
            ],
          }));
          this.toast('Version dupliquée');
        },
        del: (ev) => {
          ev.stopPropagation();
          if (s.versions.length < 2) {
            this.toast('Conservez au moins une version');
            return;
          }
          this.setState((st) => {
            const rest = st.versions.filter((y) => y.id !== x.id);
            return { versions: rest, currentId: st.currentId === x.id ? rest[0].id : st.currentId, histSel: null };
          });
          this.toast('Version supprimée');
        },
      };
    });
    const commitRename = () => {
      const t = s.renameText.trim();
      if (s.renaming && t)
        this.setState((st) => ({ versions: st.versions.map((y) => (y.id === st.renaming ? { ...y, name: t } : y)), renaming: null }));
      else this.setState({ renaming: null });
    };
    // Instantanés : renommer ou supprimer (la suppression demande un second clic pour confirmer).
    const hKey = (h) => h.id || String(h.t);
    const setHist = (fn) =>
      this.setState((st) => ({ versions: st.versions.map((y) => (y.id === sel.id ? { ...y, history: fn(y.history) } : y)) }));
    const commitHRen = () => {
      const t = this.state.hRenText.trim(),
        k = this.state.hRen;
      if (k && t) setHist((H) => H.map((x) => (hKey(x) === k ? { ...x, label: t } : x)));
      this.setState({ hRen: null });
    };
    const hist = sel.history.map((h) => ({
      key: hKey(h),
      renaming: s.hRen === hKey(h),
      renameText: s.hRenText,
      onRenameText: (ev) => this.setState({ hRenText: ev.target.value }),
      onRenameKey: (ev) => {
        if (ev.key === 'Enter') commitHRen();
        if (ev.key === 'Escape') this.setState({ hRen: null });
      },
      commitRename: commitHRen,
      rename: () => this.setState({ hRen: hKey(h), hRenText: h.label, hDel: null }),
      confirmDel: s.hDel === hKey(h),
      del: () => {
        if (s.hDel !== hKey(h)) {
          this.setState({ hDel: hKey(h) });
          clearTimeout(this._hDelT);
          this._hDelT = setTimeout(() => this.setState({ hDel: null }), 4000);
          return;
        }
        setHist((H) => H.filter((x) => hKey(x) !== hKey(h)));
        this.setState({ hDel: null });
        this.toast('Instantané supprimé');
      },
      label: h.label,
      when: rel(h.t),
      score: analyze(h.cv, tpl).score,
      restore: () => {
        this.setState((st) => ({
          currentId: sel.id,
          versions: st.versions.map((y) =>
            y.id === sel.id
              ? {
                  ...y,
                  cv: clone(h.cv),
                  updated: Date.now(),
                  history: [{ id: uid(), t: Date.now(), label: 'Restauration : ' + h.label, cv: clone(h.cv) }, ...y.history],
                }
              : y,
          ),
        }));
        this.toast('Instantané restauré');
      },
    }));
    // export
    const E = s.exp,
      fmtDef = [
        ['docx', 'Word (.docx)', 'Format le mieux lu par les ATS. Texte réel, styles de titres, aucune zone de texte.', true],
        ['pdf', 'PDF texte', 'Texte sélectionnable (pas d’image). À utiliser si l’offre demande un PDF.', false],
        ['txt', 'Texte brut (.txt)', 'Pour les formulaires en ligne qui demandent un copier-coller.', false],
      ];
    const fmts = fmtDef.map(([k, name, desc, rec]) => {
      const on = E.fmt === k;
      return {
        name,
        desc,
        rec,
        bd: on ? 'var(--ac)' : 'var(--line)',
        bg: on ? 'var(--acs)' : 'var(--panel)',
        dot: on ? 'var(--ac)' : 'var(--panel)',
        pick: () => this.setState((st) => ({ exp: { ...st.exp, fmt: k } })),
      };
    });
    const gallery = Object.keys(TPLS).map((k) => {
      const t = resolveTpl(k, s.accent);
      return {
        fam: t.fam,
        label: t.label,
        tag: t.tag,
        isText: t.isText,
        isBand: t.isBand,
        isTwo: t.twoCol,
        isSig: t.isSig,
        accent: t.accent,
        tint: t.tint,
        alignItems: t.align === 'center' ? 'center' : 'flex-start',
        titleC: t.titleColor === '#333333' ? '#9a9285' : t.titleColor,
        headC: t.headColor === '#111111' ? '#1c1915' : t.headColor,
        atsLabel: t.atsLabel,
        atsBg: t.atsBg,
        atsFg: t.atsFg,
        bd: s.tpl === k ? 'var(--ac)' : 'transparent',
        pick: () => {
          this.setState({ tpl: k, galleryOpen: false, pv: 'visuel' });
          this.toast('Modèle « ' + t.label + ' » appliqué');
        },
      };
    });
    const srcVals = (key, def) => {
      const S = s[key];
      return {
        tabs: def.map(([k, l]) => {
          const on = S.src === k;
          return {
            label: l,
            bg: on ? 'var(--panel)' : 'transparent',
            fg: on ? 'var(--tx)' : 'var(--mu)',
            sh: on ? '0 1px 3px rgba(0,0,0,.12)' : 'none',
            go: () => this.setState((st) => ({ [key]: { ...st[key], src: k, srcPhase: 'idle', info: null } })),
          };
        }),
        isLink: S.src === 'link',
        isImage: S.src === 'image',
        isPdf: S.src === 'pdf',
        url: S.url,
        img: S.img || '',
        imgBg: S.img ? 'url("' + S.img + '")' : 'none',
        hasImg: !!S.img,
        noImg: !S.img,
        busy: S.srcPhase === 'busy',
        done: S.srcPhase === 'done',
        busyText: S.busyText || '',
        busyPct: S.busyPct || 0,
        infoTitle: S.info ? S.info.title : '',
        infoDetail: S.info ? S.info.detail : '',
      };
    };
    const srcH = (key) => ({
      onUrl: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ [key]: { ...st[key], url: val } }));
      },
      runLink: () => {
        const u = (s[key].url || '').trim();
        if (!u) {
          this.toast('Collez d’abord un lien');
          return;
        }
        this.runSrc(key, 'link', u);
      },
      over: (ev) => ev.preventDefault(),
      dropImg: (ev) => {
        ev.preventDefault();
        const fl = ev.dataTransfer.files && ev.dataTransfer.files[0];
        if (fl) this.loadSrcImg(key, fl);
      },
      onImg: (ev) => {
        const fl = ev.target.files && ev.target.files[0];
        ev.target.value = '';
        if (fl) this.loadSrcImg(key, fl);
      },
      onPdf: (ev) => {
        const fl = ev.target.files && ev.target.files[0];
        ev.target.value = '';
        if (fl) this.runSrc(key, 'pdf', fl);
      },
    });
    // ---- relecture humaine
    const NTx = NT(),
      ticBadge = (t) => {
        const a = NTx.analyze(t || ''),
          n = a.hits.length;
        return {
          a,
          label: n ? n + ' tic' + (n > 1 ? 's' : '') + ' d’écriture · corriger' : 'Écriture naturelle ✓',
          bg: n ? 'var(--ais)' : 'var(--oks)',
          fg: n ? 'var(--ai)' : 'var(--ok)',
        };
      };
    const sumTics = ticBadge(cv.summary),
      letTics = ticBadge(s.letter.text);
    // ---- cohérence
    const cohItems = [];
    const ex = cv.experiences
      .map((e) => ({ e, s: toMonths(e.start), en: toMonths(e.end) }))
      .filter((x) => x.s != null)
      .sort((a, b) => b.s - a.s);
    ex.forEach((x) => {
      if (x.en != null && x.en < x.s)
        cohItems.push({ title: 'Dates inversées', detail: (x.e.role || 'Poste') + ' : la fin précède le début.', color: 'var(--er)' });
    });
    for (let k = 0; k < ex.length - 1; k++) {
      const nw = ex[k],
        od = ex[k + 1];
      if (od.en == null) continue;
      const gap = nw.s - od.en;
      if (gap > 3)
        cohItems.push({
          title: 'Période sans activité de ' + gap + ' mois',
          detail: od.e.end + ' → ' + nw.e.start + ' : ajoutez une formation, un projet ou une mention (congé, mobilité).',
          color: 'var(--wa)',
        });
      if (gap < 0)
        cohItems.push({
          title: 'Postes qui se chevauchent',
          detail: (od.e.company || '') + ' et ' + (nw.e.company || '') + ' : précisez s’il s’agissait d’un temps partiel ou d’une mission.',
          color: 'var(--wa)',
        });
    }
    {
      const ar = (s.ad.analysis && s.ad.analysis.role) || '',
        ct = (cv.contact.title || '').toLowerCase().trim();
      if (s.ad.phase === 'result' && ar && ct && !ar.toLowerCase().includes(ct) && !ct.includes(ar.toLowerCase()))
        cohItems.push({
          title: 'Intitulé différent de l’offre',
          detail: 'L’annonce vise « ' + ar + ' ». Alignez votre titre si votre expérience le justifie.',
          color: 'var(--ai)',
          step: 0,
        });
    }
    const phItems = findPh(cv);
    if (phItems.length)
      cohItems.unshift({
        title: phItems.length + ' repère(s) à compléter',
        detail:
          phItems
            .slice(0, 2)
            .map((p) => p.text)
            .join(', ') + ' : remplacez-les par vos vrais chiffres.',
        color: 'var(--er)',
        step: steps.indexOf(phItems[0].key),
      });
    const coh = {
      has: cohItems.length > 0,
      items: cohItems.map((c) => ({ ...c, go: () => this.setState({ step: c.step != null ? c.step : 2 }) })),
    };
    // ---- diff
    const other = s.versions.find((x) => x.id === s.diffWith && x.id !== v.id);
    let diff = { has: false, none: true };
    if (other) {
      const d = lineDiff(cvText(other.cv).split('\n'), cvText(cv).split('\n'));
      diff = {
        has: true,
        none: false,
        add: d.filter((x) => x.t === '+').length,
        del: d.filter((x) => x.t === '-').length,
        same: d.filter((x) => x.t === '=').length,
        lines: d.map((x) => ({
          text: x.s || ' ',
          mark: x.t === '=' ? '' : x.t,
          bg: x.t === '+' ? 'var(--oks)' : x.t === '-' ? 'var(--ers)' : 'transparent',
          fg: x.t === '+' ? 'var(--ok)' : x.t === '-' ? 'var(--er)' : 'var(--mu)',
          deco: x.t === '-' ? 'line-through' : 'none',
        })),
      };
    }
    // ---- candidatures
    const ctext = cvText(cv).toLowerCase(),
      matchApp = (a) => {
        const kw = a.kw || [];
        const found = kw.filter((k) => ctext.includes(k));
        return {
          pct: kw.length ? Math.round((found.length / kw.length) * 100) : 0,
          missing: kw.length ? kw.filter((k) => !ctext.includes(k)) : ['offre non analysée'],
        };
      };
    const verName = (id) => (s.versions.find((x) => x.id === id) || {}).name || '—';
    const setApp = (id, o) => this.setState((st) => ({ apps: st.apps.map((a) => (a.id === id ? { ...a, ...o } : a)) }));
    const colDot = { todo: 'var(--fa)', sent: 'var(--ai)', interview: 'var(--ac)', offer: 'var(--ok)', rejected: 'var(--er)' };
    const appCols = APP_COLS.map(([k, l]) => {
      const cards = s.apps
        .filter((a) => a.status === k)
        .map((a) => {
          const m = matchApp(a);
          const dd = dueOf(a);
          return {
            due: !!dd,
            notDue: !dd,
            dueLabel: 'Relance due · envoyée il y a ' + dd + ' jours',
            copyRelance: () => {
              try {
                navigator.clipboard.writeText(NT().autoFix(relanceMail(a, cv.contact.name)).text);
              } catch (e) {}
              this.toast('E-mail de relance copié : complétez le passage entre crochets');
            },
            markRelanced: () => {
              setApp(a.id, { relanced: true, next: 'Relancée le ' + new Date().toLocaleDateString('fr-FR') });
              this.toast('Relance enregistrée');
            },
            company: a.company,
            role: a.role,
            next: a.next,
            status: a.status,
            match: m.pct,
            mBg: m.pct >= 75 ? 'var(--oks)' : m.pct >= 50 ? 'var(--was)' : 'var(--ers)',
            mFg: m.pct >= 75 ? 'var(--ok)' : m.pct >= 50 ? 'var(--wa)' : 'var(--er)',
            meta: (a.date ? 'Envoyée le ' + a.date : 'Pas encore envoyée') + ' · ' + verName(a.version),
            onStatus: (ev) => {
              const st = ev.target.value;
              setApp(a.id, {
                status: st,
                date: a.date || (st !== 'todo' ? new Date().toLocaleDateString('fr-FR') : ''),
                next: {
                  todo: 'Adapter le CV',
                  sent: 'Relancer dans 10 jours',
                  interview: 'Préparer l’entretien',
                  offer: 'Négocier et répondre',
                  rejected: 'Demander un retour',
                }[st],
              });
            },
            del: () => {
              this.setState((st) => ({ apps: st.apps.filter((x) => x.id !== a.id) }));
              this.toast('Candidature supprimée');
            },
          };
        });
      return { label: l, dot: colDot[k], count: cards.length, cards };
    });
    const appMatch = s.apps
      .filter((a) => a.status !== 'rejected')
      .map((a) => {
        const m = matchApp(a);
        return {
          company: a.company,
          role: a.role,
          match: m.pct,
          color: m.pct >= 75 ? 'var(--ok)' : m.pct >= 50 ? 'var(--wa)' : 'var(--er)',
          missing: m.missing.slice(0, 4).join(', ') || 'rien',
          adapt: () => {
            if (a.offer) {
              this.go('adapt', {
                ad: { ...s.ad, phase: 'input', src: 'text', offer: a.offer, analysis: null, acc: {}, sk: {}, info: null, srcPhase: 'idle' },
              });
              this.toast('Offre de ' + a.company + ' chargée : lancez l’analyse');
            } else if (a.url) {
              this.go('adapt', { ad: { ...s.ad, phase: 'input', src: 'link', url: a.url, analysis: null, info: null, srcPhase: 'idle' } });
              this.toast('Lien de l’offre chargé : cliquez sur « Analyser l’offre »');
            } else {
              this.go('adapt', { ad: { ...s.ad, phase: 'input', src: 'text', offer: '', analysis: null, info: null, srcPhase: 'idle' } });
              this.toast('Collez l’offre de ' + a.company + ' pour l’analyser');
            }
          },
        };
      })
      .sort((x, y) => y.match - x.match);
    const NA = s.newApp;
    // ---- entretien
    const IV = s.iv,
      pw = wc(IV.pitch);
    const ivQs = (IV.qs || []).map((q, i) => {
      const open = IV.open === i;
      const upd = (k, val) =>
        this.setState((st) => ({ iv: { ...st.iv, qs: st.iv.qs.map((x, j) => (j === i ? { ...x, star: { ...x.star, [k]: val } } : x)) } }));
      return {
        group: q.group,
        q: q.q,
        hint: q.hint,
        open,
        chev: open ? '−' : '+',
        bg: open ? 'var(--sub)' : 'transparent',
        gBg: { Motivation: 'var(--t1)', Technique: 'var(--t2)', Comportement: 'var(--t3)' }[q.group] || 'var(--sub)',
        toggle: () => this.setState((st) => ({ iv: { ...st.iv, open: st.iv.open === i ? -1 : i } })),
        fields: [
          ['S', 's', 'Situation : le contexte, en une phrase'],
          ['T', 't', 'Tâche : ce qu’on attendait de vous'],
          ['A', 'a', 'Action : ce que vous avez fait, vous'],
          ['R', 'r', 'Résultat : chiffré si possible'],
        ].map(([K, k, ph]) => ({ k: K, v: q.star[k], ph, on: (ev) => upd(k, ev.target.value) })),
      };
    });
    // ---- paramètres
    const A2 = s.acct,
      P = s.prefs,
      tg = (on, locked) => ({
        track: on ? 'var(--ac)' : 'var(--line2)',
        knob: on ? '17px' : '3px',
        cursor: locked ? 'default' : 'pointer',
      });
    const expChecks = [
      [an.score >= 75, 'Score ATS : ' + an.score + '/100'],
      [an.fails === 0, an.fails ? an.fails + ' règle(s) non respectée(s)' : 'Aucune règle bloquante'],
      [true, 'Une colonne · police ' + tpl.fontName + ' · sans en-tête ni pied de page'],
      [s.anon || !!cv.contact.email, s.anon ? 'Anonymisation active' : 'Coordonnées dans le corps du document'],
    ].map(([ok, label]) => ({ label, mark: ok ? '✓' : '!', color: ok ? 'var(--ok)' : 'var(--wa)' }));
    const ANGLE_STATUS = { busy: 'Rédaction…', done: 'Prête', error: 'Échec : réessayez' };
    return {
      jobSites: MK.sites,
      market: s.market,
      setMarket: (k) => {
        this.setState({ market: k });
        this.toast('Marché : ' + marketOf(k).label + '. Conseils et rédaction adaptés');
      },
      study: s.track === 'study',
      track: s.track,
      schoolApps: {
        list: s.schoolApps,
        add: (x) => {
          this.setState((st) => ({ schoolApps: [{ id: uid(), status: 'prepare', docs: {}, note: '', ...x }, ...st.schoolApps].slice(0, 60) }));
          this.toast('Candidature ajoutée');
        },
        set: (id, o) => this.setState((st) => ({ schoolApps: st.schoolApps.map((a) => (a.id === id ? { ...a, ...o } : a)) })),
        remove: (id) => this.setState((st) => ({ schoolApps: st.schoolApps.filter((a) => a.id !== id) })),
        fromLetter:
          s.letter.company && !s.schoolApps.some((a) => a.school === s.letter.company && a.program === s.letter.role)
            ? [s.letter.role, s.letter.company].filter(Boolean).join(' · ')
            : '',
        addFromLetter: () => {
          this.setState((st) => ({ schoolApps: [{ id: uid(), status: 'prepare', docs: {}, note: '', school: st.letter.company, program: st.letter.role, platform: st.market === 'fr' ? 'monmaster' : 'campus', deadline: '' }, ...st.schoolApps] }));
          this.toast('Candidature ajoutée depuis la lettre');
        },
        toLetter: (a) => this.go('letter', { letter: { ...s.letter, company: a.school, role: a.program } }),
        toInterview: (a) => {
          this.setState((st) => ({ letter: { ...st.letter, company: a.school, role: a.program } }));
          this.go('interview');
        },
      },
      jobs: {
        cv,
        market: s.market,
        sites: MK.sites,
        defaults: { q: cv.contact.title || (cv.experiences[0] && cv.experiences[0].role) || '', place: s.market === 'fr' ? String(cv.contact.city || '').split(',')[0] : '' },
        saved: s.savedSearches,
        saveSearch: (x) => {
          if (!x.q.trim()) return;
          if (s.savedSearches.some((y) => y.q === x.q && y.place === x.place && (y.contract || '') === (x.contract || '') && (y.source || 'france') === (x.source || 'france') && (y.country || '') === (x.country || ''))) {
            this.toast('Recherche déjà enregistrée');
            return;
          }
          this.setState((st) => ({ savedSearches: [{ id: uid(), q: x.q.trim(), place: x.place.trim(), contract: x.contract || '', source: x.source || 'france', country: x.country || '', seen: new Date().toISOString() }, ...st.savedSearches].slice(0, 8) }));
          this.toast('Recherche enregistrée : les nouvelles offres seront signalées ici');
        },
        removeSearch: (id) => this.setState((st) => ({ savedSearches: st.savedSearches.filter((y) => y.id !== id) })),
        markSeen: (id) => this.setState((st) => ({ savedSearches: st.savedSearches.map((y) => (y.id === id ? { ...y, seen: new Date().toISOString() } : y)) })),
        // L'annonce part vers les autres écrans ; l'analyse par l'IA ne se lance que sur demande.
        toAdapt: (o) => {
          this.go('adapt', { ad: { ...s.ad, phase: 'input', src: 'text', offer: o.title + (o.company ? ' · ' + o.company : '') + '\n\n' + o.description, analysis: null, acc: {}, sk: {}, info: null, srcPhase: 'idle' } });
          this.toast('Annonce chargée : lancez « Analyser l’offre »');
        },
        toLetter: (o) => {
          this.go('letter', { letter: { ...s.letter, company: o.company || s.letter.company, role: o.title, offerText: o.description } });
          this.toast('Entreprise, poste et annonce repris dans la lettre');
        },
        follow: (o) => {
          if (s.apps.some((a) => a.offerId === o.id)) {
            this.toast('Offre déjà suivie dans Candidatures');
            return;
          }
          this.setState((st) => ({ apps: [{ id: uid(), company: o.company || 'Entreprise', role: o.title, status: 'todo', date: '', next: 'Envoyer la candidature', version: st.currentId, kw: [], offer: o.description, offerId: o.id, link: o.url }, ...st.apps] }));
          this.toast('Offre ajoutée à vos candidatures');
        },
      },
      setTrack: (k) => {
        this.setState({ track: k });
        this.toast(k === 'study' ? 'Mode Études : lettres, entretiens et conseils pour candidater à une formation' : 'Mode Emploi : candidatures à des postes');
      },
      academicCv: cv.kind === 'academic',
      setAcademicCv: (on) => {
        const ORDER_AC = ['summary', 'education', 'projects', 'experience', 'skills', 'languages', 'certifications'];
        const ORDER_JOB = ['summary', 'experience', 'education', 'skills', 'languages', 'projects', 'certifications'];
        this.mut((c) => {
          c.kind = on ? 'academic' : '';
          const want = on ? ORDER_AC : ORDER_JOB;
          c.order = [...want.filter((k) => c.order.includes(k)), ...c.order.filter((k) => !want.includes(k))];
        });
        this.toast(on ? 'CV au format académique : formation en tête, projets et travaux académiques, distinctions' : 'CV au format professionnel');
      },
      profile: s.profile,
      setProfile: (o) => this.setState((st) => ({ profile: { ...st.profile, ...o } })),
      letterOpts: {
        lang: s.letter.lang || (cv.lang === 'en' || s.lang === 'en' ? 'en' : 'fr'),
        setLang: (k) => this.setState((st) => ({ letter: { ...st.letter, lang: k } })),
        multi: !!s.letter.multi,
        setMulti: (on) => this.setState((st) => ({ letter: { ...st.letter, multi: on } })),
        doc: s.letter.doc || 'lettre',
        setDoc: (k) =>
          this.setState((st) => ({
            // Statement of purpose et personal statement s'écrivent en anglais ; la limite suit l'usage de chaque document.
            letter: { ...st.letter, doc: k, lang: k === 'sop' || k === 'ps' ? 'en' : st.letter.lang, limit: k === 'ps' ? 4000 : k === 'projet' ? 1500 : 0 },
          })),
        limit: Number(s.letter.limit) || 0,
        setLimit: (n) => this.setState((st) => ({ letter: { ...st.letter, limit: Math.max(0, Math.min(20000, Number(n) || 0)) } })),
        chars: (s.letter.text || '').length,
        shortening: !!s.letter.shortening,
        shorten: () => {
          const L = this.state.letter, max = Number(L.limit) || 0;
          if (!max || L.shortening || !L.text.trim()) return;
          this.setState((st) => ({ letter: { ...st.letter, shortening: true } }));
          window.CVAI.shorten({ text: L.text, limit: max, lang: L.lang })
            .then((r) => {
              this.setState((st) => ({ letter: { ...st.letter, text: r.text, shortening: false } }));
              this.toast(r.text.length <= max ? 'Texte raccourci : ' + r.text.length + ' caractères' : 'Encore ' + (r.text.length - max) + ' caractères de trop : relancez ou coupez à la main');
            })
            .catch((e) => {
              this.setState((st) => ({ letter: { ...st.letter, shortening: false } }));
              this.toast(errMsg(e));
            });
        },
      },
      letterVariants: (s.letter.variants || []).map((x, i) => ({
        angle: x.angle,
        label: x.label,
        on: i === s.letter.vi,
        error: x.status === 'error',
        status: x.status === 'done' ? wc(x.text) + ' mots' : ANGLE_STATUS[x.status] || '',
        pick: () => this.setState((st) => ({ letter: { ...st.letter, vi: i, text: st.letter.variants[i].text } })),
      })),
      letPdfLabel: s.pdfBusy ? 'PDF…' : 'Exporter PDF',
      exportLetterPdf: () => {
        if (!s.letter.text.trim() || s.pdfBusy) return;
        const html = this.letterHtml(), name = 'Lettre_' + (slug(s.letter.company) || 'motivation');
        this.setState({ pdfBusy: true });
        this.runExport('Création du PDF de la lettre…', name + '.pdf', () => this.pdfDownload(html, name)).then((ok) => {
          this.setState({ pdfBusy: false });
          if (!ok) { this.printHtml(html); this.toast('Service PDF indisponible : utilisez « Enregistrer au format PDF »'); }
        });
      },
      brief: {
        company: s.letter.company,
        data: briefOk ? s.brief.data : null,
        busy: s.briefBusy,
        gen: () => this.briefGen(),
      },
      ivHist: {
        list: s.ivHist,
        add: (x) => this.setState((st) => ({ ivHist: [x, ...st.ivHist.filter((y) => y.id !== x.id)].slice(0, 100) })),
        remove: (id) => this.setState((st) => ({ ivHist: st.ivHist.filter((y) => y.id !== id) })),
      },
      mock: {
        cv,
        analysis: s.ad.analysis || null,
        brief: briefOk ? s.brief.data : null,
        profile: s.profile,
        lang: cv.lang === 'en' || s.lang === 'en' ? 'en' : 'fr',
        offer: { company: s.letter.company, role: s.letter.role, text: s.ad.offer || s.letter.offerText || '' },
        study: s.track === 'study',
        target:
          s.letter.company || s.letter.role
            ? 'Pour ' + [s.letter.role, s.letter.company].filter(Boolean).join(s.track === 'study' ? ' à ' : ' chez ')
            : s.track === 'study'
              ? 'À partir de votre CV (renseignez la formation et l’établissement dans l’onglet Lettre pour un entretien ciblé)'
              : 'À partir de votre CV (analysez une offre pour un entretien ciblé)',
      },
      impRes: s.imp.res,
      impShowCompare: s.imp.phase === 'report' || s.imp.phase === 'done',
      nav,
      versionName: v.name,
      score: an.score,
      gauge,
      okCount: an.okCount,
      rules,
      delta: {
        text: dl === 0 ? 'stable depuis l’ouverture' : (dl > 0 ? '+' : '') + dl + ' depuis l’ouverture',
        color: dl > 0 ? 'var(--ok)' : dl < 0 ? 'var(--er)' : 'var(--fa)',
      },
      themeLabel: s.theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre',
      toggleTheme: () => this.setState((st) => ({ theme: st.theme === 'dark' ? 'light' : 'dark' })),
      screenTitle: titles[s.screen][0],
      screenSub: titles[s.screen][1],
      savedLabel:
        (s.auth.user
          ? { saving: 'Synchronisation…', error: 'Hors ligne · ', ok: 'Synchronisé · ', local: 'Synchronisé · ' }[s.sync] ||
            'Synchronisé · '
          : 'Enregistré · ') + (s.auth.user && s.sync === 'saving' ? '' : rel(v.updated)),
      currentId: v.id,
      verOptions: s.versions.map((x) => ({ id: x.id, name: x.name })),
      pickVersion: (ev) => this.setState({ currentId: ev.target.value, sug: null }),
      anon: {
        track: s.anon ? 'var(--ac)' : 'var(--line2)',
        knob: s.anon ? '14px' : '2px',
        label: s.anon ? 'Anonymisé' : 'Anonymiser',
        bg: s.anon ? 'var(--tx)' : 'var(--panel)',
        fg: s.anon ? 'var(--panel)' : 'var(--tx)',
        bd: s.anon ? 'var(--tx)' : 'var(--line2)',
        dot: s.anon ? 'var(--ok)' : 'var(--line2)',
        box: s.anon ? 'var(--ac)' : 'var(--panel)',
        check: s.anon ? '✓' : '',
      },
      toggleAnon: () => {
        this.setState((st) => ({ anon: !st.anon }));
        this.toast(s.anon ? 'Anonymisation désactivée' : 'Anonymisation activée : nom, coordonnées et entreprises masqués');
      },
      openExport: () => this.setState((st) => ({ exp: { ...st.exp, open: true, name: slug(this.cur().name) } })),
      isHome: s.screen === 'home',
      isEditor: s.screen === 'editor',
      isImport: s.screen === 'import',
      isAdapt: s.screen === 'adapt',
      isLetter: s.screen === 'letter',
      isVersions: s.screen === 'versions',
      goCreate: () => {
        this.addVersion('Nouveau CV ' + new Date().toLocaleDateString('fr-FR'), 'Général', emptyCv(), 'Création depuis zéro');
        this.go('editor', { step: 0 });
        this.toast('Nouvelle version créée');
      },
      goImport: () => this.go('import', { imp: { phase: 'idle', mode: 'full', file: null, step: 0, drag: false } }),
      goSimple: () => this.go('import', { imp: { phase: 'idle', mode: 'simple', file: null, step: 0, drag: false } }),
      goAdapt: () => this.go('adapt'),
      goVersions: () => this.go('versions'),
      recent: [...s.versions]
        .sort((a, b) => b.updated - a.updated)
        .slice(0, 4)
        .map((x) => {
          const sc = analyze(x.cv, tpl).score;
          return {
            name: x.name,
            tag: x.tag,
            updated: rel(x.updated),
            score: sc,
            color: scoreColor(sc),
            bg: sc >= 85 ? 'var(--oks)' : sc >= 65 ? 'var(--was)' : 'var(--ers)',
            open: () => this.go('editor', { currentId: x.id }),
          };
        }),
      modes: [
        ['guided', 'Guidé'],
        ['blocks', 'Blocs'],
      ].map(([k, l]) => ({ label: l, ...seg(s.mode === k), go: () => this.setState({ mode: k }) })),
      modeHint: guided ? 'Une section à la fois' : 'Toutes les sections · réordonnables',
      guided,
      stepper,
      editorSections,
      prevStep: () => this.setState({ step: Math.max(0, stepIdx - 1) }),
      prevOp: stepIdx > 0 ? 1 : 0.4,
      nextStep: () => {
        if (stepIdx < steps.length - 1) this.setState({ step: stepIdx + 1 });
        else this.setState((st) => ({ exp: { ...st.exp, open: true, name: slug(v.name) } }));
      },
      nextLabel: stepIdx < steps.length - 1 ? 'Suivant : ' + (cv.kind === 'academic' ? LABELS_AC : LABELS)[steps[stepIdx + 1]] + ' →' : 'Terminer et exporter',
      contactFields,
      summary: cv.summary,
      onSummary: (ev) => {
        const val = ev.target.value;
        mut((c) => {
          c.summary = val;
        });
      },
      sumInfo,
      sumSugOpen: s.sumSug,
      sumSugText: s.sumBusy ? 'Rédaction de la proposition…' : s.sumAlt || '',
      onSummaryBlur: (ev) => {
        const val = ev.target.value;
        blurClean(val, (t) =>
          mut((c) => {
            c.summary = t;
          }),
        );
      },
      onLetBlur: (ev) => {
        const val = ev.target.value;
        blurClean(val, (t) => this.setState((st) => ({ letter: { ...st.letter, text: splitLetter(st.letter.text).head + t } })));
      },
      toggleSumSug: () => {
        if (s.sumSug) {
          this.setState({ sumSug: false, sumAlt: null });
          return;
        }
        this.setState({ sumSug: true, sumAlt: null, sumBusy: true });
        window.CVAI.suggestSummary(cv, s.ad.analysis ? s.ad.offer : '')
          .then((t) => this.setState({ sumAlt: clean(t), sumBusy: false }))
          .catch((e) => {
            this.setState({ sumSug: false, sumBusy: false });
            this.toast(errMsg(e));
          });
      },
      useSumSug: () => {
        const t = s.sumAlt;
        if (!t) return;
        mut((c) => {
          c.summary = t;
        });
        this.setState({ sumSug: false, sumAlt: null });
        this.toast('Résumé remplacé');
      },
      exps,
      addExp: () =>
        mut((c) => {
          c.experiences.push({ id: uid(), role: '', company: '', sector: '', city: '', start: '', end: '', bullets: [''] });
        }),
      libOpen: s.libOpen,
      libLabel: s.libOpen ? 'Masquer la bibliothèque' : 'Bibliothèque de formulations',
      toggleLib: () => this.setState((st) => ({ libOpen: !st.libOpen })),
      libTarget: libE ? (libE.role || 'Expérience') + (libE.company ? ' · ' + libE.company : '') : '—',
      sectors: Object.keys(LIB).map((k) => {
        const on = s.libSector === k;
        return {
          label: k,
          bg: on ? 'var(--tx)' : 'var(--panel)',
          fg: on ? 'var(--panel)' : 'var(--tx)',
          bd: on ? 'var(--tx)' : 'var(--line2)',
          go: () => this.setState({ libSector: k }),
        };
      }),
      phrases: LIB[s.libSector].map((t) => ({
        text: t,
        insert: () => {
          if (!libE) return;
          const id = libE.id;
          mut((c) => {
            const e = c.experiences.find((x) => x.id === id);
            if (!e) return;
            const ei = e.bullets.findIndex((b) => !b.trim());
            if (ei >= 0) e.bullets[ei] = t;
            else e.bullets.push(t);
          });
          this.toast('Formulation insérée — adaptez les chiffres');
        },
      })),
      verbs: VERBS.map((w) => ({
        label: w,
        copy: () => {
          try {
            navigator.clipboard.writeText(w + ' ');
          } catch (e) {}
          this.toast('« ' + w + ' » copié');
        },
      })),
      edus,
      addEdu: () =>
        mut((c) => {
          c.education.push({ id: uid(), degree: '', school: '', city: '', start: '', end: '', details: '' });
        }),
      skillChips: cv.skills.map((k, i) => ({
        label: k,
        remove: () =>
          mut((c) => {
            c.skills.splice(i, 1);
          }),
      })),
      skillDraft: s.skillDraft,
      onSkillDraft: (ev) => this.setState({ skillDraft: ev.target.value }),
      onSkillKey: (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          addSkill();
        }
      },
      addSkill,
      skillInfo: {
        text: cv.skills.length + ' compétences · 8 minimum recommandées',
        color: cv.skills.length >= 8 ? 'var(--ok)' : 'var(--wa)',
      },
      skillSugs,
      hasSkillSugs: skillSugs.length > 0,
      langs,
      levelOpts,
      addLang: () =>
        mut((c) => {
          c.languages.push({ id: uid(), name: '', level: 'Intermédiaire (B1)' });
        }),
      projs,
      addProj: () =>
        mut((c) => {
          c.projects.push({ id: uid(), name: '', link: '', desc: '' });
        }),
      certs,
      addCert: () =>
        mut((c) => {
          c.certifications.push({ id: uid(), name: '', issuer: '', date: '' });
        }),
      tpls: Object.keys(TPLS).map((k) => ({
        label: TPLS[k].label,
        desc: TPLS[k].desc,
        ...seg(s.tpl === k),
        go: () => this.setState({ tpl: k }),
      })),
      tplDesc: tpl.desc + (s.anon ? ' · version anonymisée' : ''),
      tpl,
      pvModes: [
        ['visuel', 'Aperçu'],
        ['cote', 'Côte à côte'],
        ['texte', 'Vue ATS'],
      ].map(([k, l]) => ({ label: l, ...seg(s.pv === k), go: () => this.setState({ pv: k }) })),
      pvVisual: s.pv !== 'texte',
      pvText: s.pv !== 'visuel',
      pvGrid: s.pv === 'cote' ? 'minmax(0,1.25fr) minmax(0,1fr)' : 'minmax(0,1fr)',
      dens: { fs: ((s.fsize || (s.dense ? 8.5 : 9.5)) * 1.3).toFixed(1) + 'px', lh: s.dense ? '1.32' : '1.45' },
      densTabs: [
        [false, 'Aérée'],
        [true, 'Compacte (1 page)'],
      ].map(([k, l]) => ({ label: l, ...seg(s.dense === k), go: () => this.setState({ dense: k }) })),
      pv,
      pvSections,
      plainText: cvText(view),
      impSimple: ip.mode === 'simple',
      imp: {
        score: IR ? IR.score : 0,
        deg: Math.round((IR ? IR.score : 0) * 3.6),
        color: IR ? scoreColor(IR.score) : 'var(--line)',
        headline: IR ? IR.headline : '',
        sevLine: IR
          ? ['Bloquant', 'Important', 'Mineur']
              .map((k) => {
                const n = IR.issues.filter((i) => i.sev === k).length;
                return n ? n + ' ' + { Bloquant: 'bloquant', Important: 'important', Mineur: 'mineur' }[k] + (n > 1 ? 's' : '') : '';
              })
              .filter(Boolean)
              .join(', ') || 'aucun problème détecté'
          : '',
        issueCount: IR ? IR.issues.length : 0,
        extractMeta: IR
          ? IR.mapping.length +
            ' sections · ' +
            IR.words +
            ' mots · ' +
            (IR.kind === 'image'
              ? 'lecture visuelle'
              : IR.visualZones
                ? 'texte natif + ' + IR.visualZones + ' zone(s) visuelle(s)'
                : 'texte natif')
          : '',
        idle: ip.phase === 'idle',
        parsing: ip.phase === 'parsing',
        report: ip.phase === 'report',
        done: ip.phase === 'done',
        fileName: ip.file ? ip.file.name : '',
        fileMeta: ip.file ? ip.file.meta : '',
        pct: Math.round((ip.step / IMPORT_STEPS.length) * 100),
      },
      impKept: IR
        ? (() => {
            const c = IR.cv,
              n = (x, a, b) => x + ' ' + (x > 1 ? b : a);
            return (
              'Informations préservées : ' +
              [
                n(c.experiences.filter((e) => e.role || e.company || (e.bullets || []).some((b) => b.trim())).length, 'expérience', 'expériences'),
                n(c.education.filter((e) => e.degree).length, 'formation', 'formations'),
                n(c.skills.length, 'compétence', 'compétences'),
                n(c.languages.length, 'langue', 'langues'),
                n(c.projects.length, 'projet', 'projets'),
                n(c.certifications.length, 'certification', 'certifications'),
              ].join(', ') +
              '.'
            );
          })()
        : '',
      drop: { bd: ip.drag ? 'var(--ac)' : 'var(--line2)', bg: ip.drag ? 'var(--acs)' : 'var(--panel)' },
      onDragOver: (ev) => {
        ev.preventDefault();
        if (!ip.drag) this.setState((st) => ({ imp: { ...st.imp, drag: true } }));
      },
      onDragLeave: () => this.setState((st) => ({ imp: { ...st.imp, drag: false } })),
      onDrop: (ev) => {
        ev.preventDefault();
        const f = ev.dataTransfer.files && ev.dataTransfer.files[0];
        this.setState((st) => ({ imp: { ...st.imp, drag: false } }));
        if (f) this.startImport(f);
      },
      onImpFile: (ev) => {
        const f = ev.target.files && ev.target.files[0];
        if (f) this.startImport(f);
        ev.target.value = '';
      },
      impSteps,
      issues: (IR ? IR.issues : []).map((i) => ({ ...i, bg: (sevC[i.sev] || sevC.Mineur)[0], fg: (sevC[i.sev] || sevC.Mineur)[1] })),
      mapping: IR ? IR.mapping : [],
      rawExtract: IR ? IR.rawText : '',
      onLinkedin: (ev) => {
        const fl = ev.target.files && ev.target.files[0];
        ev.target.value = '';
        if (fl) this.startImport(fl, 'linkedin');
      },
      resetImport: () => this.setState((st) => ({ imp: { ...st.imp, phase: 'idle', step: 0, file: null } })),
      convertImport: () => this.setState((st) => ({ imp: { ...st.imp, phase: 'done' } })),
      impAfter: IR ? analyze(IR.cv, tpl).score : 0,
      openImported: () => {
        if (!IR) return;
        this.addVersion(
          ip.mode === 'simple' ? 'CV conforme ATS' : 'CV importé : ' + (IR.cv.contact.name || 'conforme'),
          'Importé',
          clone(IR.cv),
          'Import de ' + (ip.file ? ip.file.name : 'fichier') + ' et conversion',
        );
        this.go('editor', { step: 0, imp: { ...ip, phase: 'idle' } });
        this.toast('Version conforme créée');
      },
      exportImported: () => {
        if (!IR) return;
        this.addVersion('CV importé : ' + (IR.cv.contact.name || 'conforme'), 'Importé', clone(IR.cv), 'Import et conversion');
        this.setState((st) => ({ exp: { ...st.exp, open: true, name: 'CV_importe_conforme' } }));
      },
      offer: A.offer,
      onOffer: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ ad: { ...st.ad, offer: val } }));
      },
      offerMeta: wc(A.offer) + ' mots · ' + A.offer.length + ' caractères',
      onOfferFile: (ev) => {
        const f = ev.target.files && ev.target.files[0];
        ev.target.value = '';
        if (f) this.runSrc('ad', 'pdf', f);
      },
      analyzeOffer: async () => {
        if (A.phase === 'busy' || A.srcPhase === 'busy') return;
        // Avec un lien : un seul bouton, qui lit d'abord la page (si ce lien n'a pas encore été lu), puis analyse l'offre.
        const url = (A.url || '').trim();
        if (A.src === 'link' && url && (A.fetchedUrl !== url || !A.offer.trim())) {
          if (!(await this.runSrc('ad', 'link', url))) return;
        }
        const offer = this.state.ad.offer;
        if (!offer.trim()) {
          this.toast(A.src === 'link' ? 'Collez d’abord un lien' : "Collez d'abord le texte de l'offre");
          return;
        }
        this.setState((st) => ({ ad: { ...st.ad, phase: 'busy' } }));
        window.CVAI.analyzeOffer(cv, offer)
          .then((an) => {
            const acc = {},
              sk = {};
            an.rewrites.forEach((r) => {
              acc[r.id] = !r.check;
            });
            an.missingSkills.forEach((k) => {
              if (!cv.skills.some((x) => x.toLowerCase() === k.toLowerCase())) sk[k] = false;
            });
            this.setState((st) => ({
              ad: { ...st.ad, phase: 'result', analysis: an, acc, sk },
              letter: { ...st.letter, company: an.company || st.letter.company, role: an.role || st.letter.role, offerText: st.ad.offer },
              iv: st.letter.company === an.company ? st.iv : { ...st.iv, phase: 'idle' },
            }));
            this.toast('Offre analysée : ' + an.keywords.length + ' mots-clés');
          })
          .catch((e) => {
            this.setState((st) => ({ ad: { ...st.ad, phase: 'input' } }));
            this.toast(errMsg(e));
          });
      },
      editOffer: () => this.setState((st) => ({ ad: { ...st.ad, phase: 'input' } })),
      ad: {
        input: A.phase !== 'result',
        result: A.phase === 'result',
        btn: A.srcPhase === 'busy' ? 'Lecture de la page…' : A.phase === 'busy' ? 'Analyse en cours…' : "Analyser l'offre",
        before: AN ? mB.score : '—',
        after: mA.score,
        ats: analyze(applied, tpl).score,
        kwLine: mB.found + ' → ' + mA.found + ' mots-clés couverts sur ' + KW.length,
        accLine: accN + '/' + RW.length + ' acceptées',
      },
      kwGroups,
      reqs,
      skillAdds,
      adaptSugs,
      applyNew: () => {
        if (!AN) return;
        const co = AN.company || 'offre ciblée';
        const nid = this.addVersion(
          'CV ' + co + (AN.role ? ' (' + AN.role + ')' : ''),
          'Ciblé',
          applyAdapt(cv, A.acc, A.sk, RW),
          'Adaptation à l’offre ' + co,
        );
        this.setState((st) =>
          st.apps.some((a) => a.company === AN.company && a.role === AN.role)
            ? {}
            : {
                apps: [
                  {
                    id: uid(),
                    company: AN.company || 'Entreprise',
                    role: AN.role || 'Poste',
                    status: 'todo',
                    date: '',
                    next: 'Envoyer la candidature',
                    version: nid,
                    kw: KW.map((k) => k.k.toLowerCase()),
                    offer: A.offer,
                  },
                  ...st.apps,
                ],
              },
        );
        this.go('editor', { step: 2 });
        this.toast('Version ciblée créée : correspondance ' + mA.score + ' %');
      },
      applyCurrent: () => {
        if (!AN) return;
        this.snapshot('Avant adaptation ' + (AN.company || 'à l’offre'));
        const ac = A.acc,
          sk = A.sk;
        mut((c) => {
          Object.assign(c, applyAdapt(c, ac, sk, RW));
        });
        this.go('editor', { step: 2 });
        this.toast('Modifications appliquées — instantané enregistré');
      },
      letter: {
        ...(() => {
          const sp = splitLetter(L.text);
          return {
            hasHead: sp.sender.length > 0,
            body: sp.body,
            sender: sp.sender.map((t, k) => ({ text: t, fw: k === 0 ? 700 : 400 })),
            recipient: sp.recipient.map((t, k) => ({ text: t, fw: k === 0 ? 700 : 400 })),
          };
        })(),
        company: L.company,
        role: L.role,
        text: L.text,
        old: L.old,
        isImprove: L.mode === 'improve',
        oldLabel: L.oldName ? 'Fichier : ' + L.oldName : 'Importer une lettre existante',
        done: L.phase === 'done' || L.phase === 'stream',
        notDone: L.phase !== 'done' && L.phase !== 'stream',
        btn:
          L.phase === 'busy' || L.phase === 'stream'
            ? 'Rédaction…'
            : L.mode === 'improve'
              ? L.phase === 'done'
                ? 'Ré-analyser'
                : 'Analyser et améliorer'
              : L.phase === 'done'
                ? 'Régénérer'
                : 'Générer la lettre',
        showDiag: L.mode === 'improve' && L.phase === 'done' && !!L.diag,
        scoreBefore: L.diag ? L.diag.score : 0,
        scoreAfter: letterDiag(L.text, L.company).score,
        diag: (L.diag ? L.diag.d : []).map((d) => ({
          title: d.title,
          fix: d.fix,
          mark: d.ok ? '✓' : '!',
          bg: d.ok ? 'var(--oks)' : 'var(--was)',
          fg: d.ok ? 'var(--ok)' : 'var(--wa)',
        })),
        emptyTitle:
          L.phase === 'busy' ? 'Rédaction en cours…' : L.mode === 'improve' ? 'Importez votre lettre' : 'Votre lettre apparaîtra ici',
        empty:
          L.phase === 'busy'
            ? L.multi
              ? 'Trois versions avec des angles différents sont en cours de rédaction.'
              : 'L’IA croise votre CV, l’offre et votre profil.'
            : L.mode === 'improve'
              ? 'Déposez un fichier ou collez le texte : diagnostic, score d’impact et version réécrite.'
              : 'Choisissez l’offre visée et le ton, puis générez. Vous pourrez tout modifier ensuite.',
        meta: (L.phase === 'stream' ? 'Rédaction en cours… · ' : '') + wc(L.text) + ' mots · ' + s.letFont + ' ' + String(s.letSize).replace('.', ',') + ' pt',
      },
      onLetCompany: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ letter: { ...st.letter, company: val } }));
      },
      onLetRole: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ letter: { ...st.letter, role: val } }));
      },
      onLetText: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ letter: { ...st.letter, text: val } }));
      },
      onLetBody: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ letter: { ...st.letter, text: splitLetter(st.letter.text).head + val } }));
      },
      tones,
      letterAction: () => this.letterAction(),
      letModes: [
        ['new', 'Nouvelle lettre'],
        ['improve', 'Améliorer ma lettre'],
      ].map(([k, l]) => ({
        label: l,
        ...seg(L.mode === k),
        go: () => this.setState((st) => ({ letter: { ...st.letter, mode: k, phase: 'idle', diag: null } })),
      })),
      onOldText: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ letter: { ...st.letter, old: val } }));
      },
      onOldLetter: (ev) => {
        const fl = ev.target.files && ev.target.files[0];
        ev.target.value = '';
        if (!fl) return;
        const set = (t) => {
          this.setState((st) => ({ letter: { ...st.letter, old: t, oldName: fl.name } }));
          this.toast('Lettre importée : ' + fl.name);
        };
        this.toast('Lecture de ' + fl.name + '…');
        window.CVExtract.prepare(fl)
          .then((f) =>
            f.kind === 'image'
              ? window.CVAI.ocrImage(f.mimeType, f.data)
              : f.kind === 'pdf' && (f.text || '').trim().length < 80
                ? window.CVAI.ocrPdf(f.data)
                : f.text || '',
          )
          .then((t) => {
            if (!t.trim()) throw new Error('Aucun texte trouvé dans ce fichier');
            set(t.trim());
          })
          .catch((e) => this.toast(errMsg(e)));
      },
      exportLetterDoc: () => {
        const sp = splitLetter(L.text);
        if (sp.sender.length && window.CVExport) {
          window.CVExport.letterDocxBlob(sp, { font: s.letFont, size: s.letSize })
            .then((b) => {
              window.CVExport.save('Lettre_' + slug(L.company) + '.docx', b);
              this.toast('Lettre exportée (Word)');
            })
            .catch(() => this.toast('Export Word indisponible'));
          return;
        }
        this.download(
          'Lettre_' + slug(L.company) + '.doc',
          '\ufeff<html><head><meta charset="utf-8"></head><body style="font-family:Arial;font-size:11pt;line-height:1.5">' +
            esc(L.text).replace(/\n/g, '<br>') +
            '</body></html>',
          'application/msword',
        );
        this.toast('Lettre exportée (Word)');
      },
      copyLetter: () => {
        try {
          navigator.clipboard.writeText(L.text);
        } catch (e) {}
        this.toast('Lettre copiée');
      },
      exportLetter: () => {
        this.download('Lettre_' + slug(L.company) + '.txt', L.text, 'text/plain;charset=utf-8');
        this.toast('Lettre exportée');
      },
      verCount: s.versions.length,
      vers,
      renameText: s.renameText,
      onRenameText: (ev) => this.setState({ renameText: ev.target.value }),
      onRenameKey: (ev) => {
        if (ev.key === 'Enter') commitRename();
        if (ev.key === 'Escape') this.setState({ renaming: null });
      },
      commitRename,
      histName: sel.name,
      hist,
      takeSnapshot: () => {
        this.setState({ currentId: sel.id }, () => {
          this.snapshot('Instantané manuel');
          this.toast('Instantané enregistré');
        });
      },
      exp: { open: E.open, name: E.name, ext: '.' + E.fmt },
      fmts,
      expChecks,
      onExpName: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ exp: { ...st.exp, name: val } }));
      },
      closeExport: () => this.setState((st) => ({ exp: { ...st.exp, open: false } })),
      stop: (ev) => ev.stopPropagation(),
      doExport: () => this.exportNow(),
      isInterview: s.screen === 'interview',
      isApps: s.screen === 'apps',
      isJobs: s.screen === 'jobs',
      isSettings: s.screen === 'settings',
      sumTics,
      letTics,
      reviewSummary: () => {
        if (!sumTics.a.hits.length) {
          this.toast('Aucun tic détecté dans le résumé');
          return;
        }
        if (!window.CVAI) return;
        this.toast('Réécriture en cours…');
        window.CVAI.humanize(cv.summary, { context: 'summary', lang: cv.lang })
          .then((p) => this.setState({ sumAlt: clean(p.text), sumSug: true }))
          .catch((e) => this.toast(errMsg(e)));
      },
      reviewLetter: () => {
        if (!letTics.a.hits.length) {
          this.toast('Lettre déjà propre');
          return;
        }
        if (!window.CVAI) return;
        const n = letTics.a.hits.length;
        this.toast('Réécriture en cours…');
        window.CVAI.humanize(s.letter.text, { context: 'letter' })
          .then((p) => {
            this.setState((st) => ({ letter: { ...st.letter, text: clean(p.text) } }));
            this.toast(n + ' tic(s) retiré(s) de la lettre');
          })
          .catch((e) => this.toast(errMsg(e)));
      },
      reviewPitch: () => {
        const n = NTx.analyze(s.iv.pitch).hits.length;
        if (!n) {
          this.toast('Pitch déjà propre');
          return;
        }
        window.CVAI &&
          window.CVAI.humanize(s.iv.pitch, { context: 'pitch' })
            .then((p) => {
              this.setState((st) => ({ iv: { ...st.iv, pitch: clean(p.text) } }));
              this.toast(n + ' tic(s) retiré(s)');
            })
            .catch((e) => this.toast(errMsg(e)));
      },
      coh,
      diffWith: s.diffWith || '',
      pickDiff: (ev) => this.setState({ diffWith: ev.target.value || null }),
      diffOptions: s.versions.filter((x) => x.id !== v.id).map((x) => ({ id: x.id, name: x.name })),
      diff,
      exportPack: () => this.exportPack(),
      appStats: [
        [s.apps.length, 'candidatures'],
        [s.apps.filter((a) => a.status !== 'todo').length, 'envoyées'],
        [s.apps.filter((a) => a.status === 'interview' || a.status === 'offer').length, 'en entretien ou offre'],
      ].map(([n, label]) => ({ n, label })),
      appCols,
      appMatch,
      appCount: s.apps.length,
      openNewApp: () => this.setState({ newApp: { company: '', role: '', url: '' } }),
      newApp: {
        open: !!NA,
        company: NA ? NA.company : '',
        role: NA ? NA.role : '',
        url: NA ? NA.url : '',
        onCompany: (ev) => {
          const val = ev.target.value;
          this.setState((st) => ({ newApp: { ...st.newApp, company: val } }));
        },
        onRole: (ev) => {
          const val = ev.target.value;
          this.setState((st) => ({ newApp: { ...st.newApp, role: val } }));
        },
        onUrl: (ev) => {
          const val = ev.target.value;
          this.setState((st) => ({ newApp: { ...st.newApp, url: val } }));
        },
        cancel: () => this.setState({ newApp: null }),
        add: () => {
          if (!NA || !NA.company.trim()) {
            this.toast('Indiquez au moins l’entreprise');
            return;
          }
          const id = uid(),
            url = NA.url.trim();
          this.setState((st) => ({
            apps: [
              {
                id,
                company: NA.company.trim(),
                role: NA.role.trim() || 'Poste à préciser',
                status: 'todo',
                date: '',
                next: url ? 'Analyse de l’offre en cours…' : 'Ajouter le texte de l’offre',
                version: v.id,
                kw: [],
                url,
              },
              ...st.apps,
            ],
            newApp: null,
          }));
          this.toast('Candidature ajoutée');
          if (url)
            window.CVAI.offerFromUrl(url)
              .then((o) => {
                setApp(id, {
                  kw: (o.keywords || []).map((k) => k.toLowerCase()),
                  offer: o.text,
                  role: NA.role.trim() || o.role || 'Poste à préciser',
                  next: 'Adapter le CV',
                });
                this.toast('Offre de ' + NA.company.trim() + ' analysée');
              })
              .catch((e) => {
                setApp(id, { next: 'Lien illisible : collez l’offre dans « Adapter »' });
                this.toast(errMsg(e));
              });
        },
      },
      iv: {
        target:
          s.letter.company || s.letter.role ? [s.letter.company, s.letter.role].filter(Boolean).join(' · ') : 'Aucune offre sélectionnée',
        btn: IV.phase === 'busy' ? 'Préparation…' : IV.phase === 'ready' ? 'Régénérer' : 'Préparer l’entretien',
        idle: IV.phase !== 'ready',
        ready: IV.phase === 'ready',
        count: (IV.qs || []).length,
        pitch: IV.pitch,
        pitchMeta: pw + ' mots · ≈ ' + Math.round(pw / 2.4) + ' s à l’oral',
        pitchColor: pw >= 55 && pw <= 85 ? 'var(--ok)' : 'var(--wa)',
        pitchScore: NTx.analyze(IV.pitch).total,
        pitchFix: NTx.analyze(IV.pitch).hits.length ? 'Retirer les tics →' : 'Écriture naturelle ✓',
        headline: IV.li ? IV.li.headline : '',
        about: IV.li ? IV.li.about : '',
        liScore: IV.li ? NTx.analyze(IV.li.about).total : 0,
      },
      ivGen: () => {
        if (!window.CVAI || IV.phase === 'busy') return;
        const L = s.letter;
        if (!L.company && !L.role) {
          this.toast('Analysez d’abord une offre (onglet « Adapter ») ou renseignez l’entreprise dans l’onglet Lettre');
          return;
        }
        const prev = IV;
        this.setState((st) => ({ iv: { ...st.iv, phase: 'busy' } }));
        window.CVAI.interview(cv, { company: L.company, role: L.role, text: s.ad.offer || L.offerText || '' }, { analysis: s.ad.analysis || null, brief: briefOk ? s.brief.data : null })
          .then((r) => {
            const qs = r.questions || [];
            this.setState({
              iv: {
                phase: 'ready',
                qs,
                open: qs.length > 2 ? 2 : 0,
                pitch: NT().autoFix(r.pitch || '').text,
                li: { headline: (r.linkedin || {}).headline || '', about: NT().autoFix((r.linkedin || {}).about || '').text },
              },
            });
            this.toast(qs.length + ' questions préparées');
          })
          .catch((e) => {
            this.setState({ iv: { ...prev, phase: prev.phase === 'busy' ? 'idle' : prev.phase } });
            this.toast(errMsg(e));
          });
      },
      ivQs,
      onPitch: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ iv: { ...st.iv, pitch: val } }));
      },
      onHeadline: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ iv: { ...st.iv, li: { ...st.iv.li, headline: val } } }));
      },
      onAbout: (ev) => {
        const val = ev.target.value;
        this.setState((st) => ({ iv: { ...st.iv, li: { ...st.iv.li, about: val } } }));
      },
      copyLinkedin: () => {
        try {
          navigator.clipboard.writeText(IV.li ? IV.li.headline + '\n\n' + IV.li.about : '');
        } catch (e) {}
        this.toast('Profil LinkedIn copié');
      },
      langTabs: [
        ['fr', 'Français'],
        ['en', 'English'],
      ].map(([k, l]) => ({ label: l, ...seg(s.lang === k), go: () => this.setState({ lang: k }) })),
      translateLabel: s.trBusy ? 'Traduction…' : 'Créer la version anglaise du CV',
      translateCv: () => {
        if (!window.CVAI) return;
        this.setState({ trBusy: true });
        if (s.trBusy) return;
        window.CVAI.translateCv(cv, 'en')
          .then((c) => {
            this.addVersion(v.name + ' (English)', 'Ciblé', c, 'Traduction anglaise');
            this.setState({ trBusy: false });
            this.go('editor', { step: 0 });
            this.toast('Version anglaise créée');
          })
          .catch((e) => {
            this.setState({ trBusy: false });
            this.toast(errMsg(e));
          });
      },
      a11yPrefs: [
        [
          'autoClean',
          'Nettoyer automatiquement les tics d’écriture',
          'Retire formules creuses, adverbes-béquilles et connecteurs de remplissage quand vous quittez un champ.',
        ],
        ['motion', 'Réduire les animations', 'Supprime transitions et effets de mouvement.'],
        ['contrast', 'Contraste renforcé', 'Textes secondaires et bordures plus marqués.'],
      ]
        .map(([k, label, desc]) => ({
          label,
          desc,
          ...tg(k === 'autoClean' ? P[k] !== false : !!P[k]),
          toggle: () => this.setState((st) => ({ prefs: { ...st.prefs, [k]: k === 'autoClean' ? st.prefs[k] === false : !st.prefs[k] } })),
        }))
        .concat([
          {
            label: 'Rappels de relance',
            desc: 'Notification du navigateur quand une candidature envoyée attend une relance depuis 7 jours.',
            ...tg(!!P.notif),
            toggle: () => {
              const on = !P.notif;
              const set = () =>
                this.setState(
                  (st) => ({ prefs: { ...st.prefs, notif: on } }),
                  () => {
                    if (on) this.notifyDue();
                  },
                );
              if (on && window.Notification && Notification.permission === 'default')
                Notification.requestPermission().then((r) => {
                  if (r === 'granted') set();
                  else this.toast('Notifications refusées par le navigateur');
                });
              else set();
            },
          },
        ]),
      privacyPrefs: [
        {
          label: 'Ne jamais utiliser mes CV pour entraîner un modèle',
          desc: 'Engagement permanent de Lisible et de ses fournisseurs d’IA.',
          ...tg(true, true),
          toggle: () => {},
        },
        {
          label: 'Anonymiser les exports par défaut',
          desc: 'Nom, coordonnées, entreprises et photo masqués à chaque export.',
          ...tg(P.anonDefault),
          toggle: () =>
            this.setState((st) => ({ prefs: { ...st.prefs, anonDefault: !st.prefs.anonDefault }, anon: !st.prefs.anonDefault })),
        },
      ],
      exportData: () => {
        const u = s.auth.user;
        this.download(
          'lisible-mes-donnees.json',
          JSON.stringify(
            {
              exportedAt: new Date().toISOString(),
              account: u ? { id: u.id, email: u.email, name: u.name, provider: u.provider } : null,
              versions: s.versions,
              applications: s.apps,
              interviews: s.ivHist,
              settings: settingsOf(s),
              reviewComments: s.comments,
            },
            null,
            2,
          ),
          'application/json',
        );
        this.toast('Données exportées');
      },
      del: {
        label: s.confirmDel
          ? s.auth.user
            ? 'Confirmer : supprimer définitivement'
            : 'Confirmer : tout effacer'
          : s.auth.user
            ? 'Supprimer mon compte et mes données'
            : 'Tout supprimer',
        bg: s.confirmDel ? 'var(--er)' : 'var(--panel)',
        fg: s.confirmDel ? '#ffffff' : 'var(--er)',
      },
      deleteAll: () => {
        if (!s.confirmDel) {
          this.setState({ confirmDel: true });
          this.toast(
            s.auth.user
              ? 'Cliquez à nouveau : votre compte, vos CV, candidatures et liens de relecture seront supprimés définitivement'
              : 'Cliquez à nouveau pour confirmer la suppression définitive',
          );
          return;
        }
        this.setState({ confirmDel: false });
        const u = s.auth.user,
          done = () => {
            this.clearLocal();
            if (u) {
              this._pulled = true;
            }
            this.toast('Toutes vos données ont été supprimées' + (u ? ' (appareil et compte)' : ''));
          };
        if (u)
          window.CVStore.deleteAccount()
            .then(() => {
              this._pulled = false;
              this.setState((st) => ({ auth: { ...st.auth, user: null, guest: false, mode: 'in', pw: '' } }));
              this.clearLocal();
              this.toast('Votre compte et toutes vos données ont été supprimés');
            })
            .catch((e) => this.toast('Suppression impossible : ' + errMsg(e)));
        else done();
      },
      lay: {
        pvPos: s.mobile ? 'static' : 'sticky',
        pvMax: s.mobile ? 'none' : 'calc(100vh - 94px)',
        pvOv: s.mobile ? 'visible' : 'auto',
        hBg: s.theme === 'dark' ? '#12110f' : '#f3efe7',
        mobile: s.mobile,
        side: s.mobile ? 'none' : 'flex',
        desk: s.mobile ? 'none' : 'flex',
        deskBlock: s.mobile ? 'none' : 'block',
        deskIn: s.mobile ? 'none' : 'inline',
        hPad: s.mobile ? '10px 12px' : '14px 24px',
        h1: s.mobile ? '18px' : '21px',
        btnH: s.mobile ? '40px' : '34px',
        anonPad: s.mobile ? '0 8px' : '0 13px 0 7px',
        mainPb: s.mobile ? 'calc(72px + env(safe-area-inset-bottom))' : '0px',
        toastB: s.mobile ? 'calc(84px + env(safe-area-inset-bottom))' : '24px',
        stickyB: s.mobile ? 'calc(74px + env(safe-area-inset-bottom))' : '12px',
      },
      ed: {
        form: !s.mobile || s.mTab === 'form' ? 'flex' : 'none',
        pv: !s.mobile || s.mTab === 'pv' ? 'flex' : 'none',
        score: !s.mobile || s.mTab === 'score' ? 'flex' : 'none',
      },
      mTabs: [
        ['form', 'Rédiger'],
        ['pv', 'Aperçu'],
        ['score', 'Score ' + an.score],
      ].map(([k, l]) => ({
        label: l,
        ...seg(s.mTab === k),
        go: () => {
          this.setState({ mTab: k });
          try {
            window.scrollTo(0, 0);
          } catch (e) {}
        },
      })),
      pvBoxRef: this.pvBoxRef,
      pvZoom: s.pvW ? Math.min(1, s.pvW / 760) : 1,
      navOpen: s.navOpen,
      openNav: () => this.setState({ navOpen: true }),
      closeNav: () => this.setState({ navOpen: false }),
      bottomNav: [
        ['home', 'Accueil'],
        ['editor', 'Éditeur'],
        ['adapt', 'Offre'],
        ['letter', 'Lettre'],
      ].map(([k, l]) => {
        const on = s.screen === k;
        return {
          label: l,
          fg: on ? 'var(--act)' : 'var(--mu)',
          dot: on ? 'var(--ac)' : 'transparent',
          fw: on ? 700 : 500,
          go: () => this.go(k),
        };
      }),
      more: (() => {
        const on = !['home', 'editor', 'adapt', 'letter'].includes(s.screen);
        return { fg: on ? 'var(--act)' : 'var(--mu)', dot: on ? 'var(--ac)' : 'transparent', fw: on ? 700 : 500 };
      })(),
      langQuick: [
        ['fr', 'FR', 'Français'],
        ['en', 'EN', 'English'],
      ].map(([k, l, long]) => ({
        label: l,
        long,
        ...seg(s.lang === k),
        dbg: s.lang === k ? 'var(--inkfg)' : 'transparent',
        dfg: s.lang === k ? 'var(--ink)' : 'var(--inkfg)',
        go: () => this.setState({ lang: k }),
      })),
      uiSizes: [
        ['sm', 'A−'],
        ['md', 'A'],
        ['lg', 'A+'],
        ['xl', 'A++'],
      ].map(([k, l]) => ({
        label: l,
        ...seg((s.prefs.ui || 'md') === k),
        go: () => this.setState((st) => ({ prefs: { ...st.prefs, ui: k } })),
      })),
      pvScrollRef: this.pvScrollRef,
      fontSel: s.font || '',
      fontOpts: [
        { v: '', l: (s.lang === 'en' ? 'Template' : 'Modèle') + ' (' + resolveTpl(s.tpl, s.accent).fontName + ')' },
        ...Object.keys(FONTS).map((k) => ({ v: k, l: k })),
      ],
      onFont: (ev) => {
        this.setState({ font: ev.target.value });
      },
      ...(() => {
        const cur = s.fsize || (s.dense ? 8.5 : 9.5),
          fmt = (n) => (s.lang === 'en' ? String(n) : String(n).replace('.', ',')) + ' pt';
        return {
          size: { label: fmt(cur), downOp: cur > 8 ? 1 : 0.35, upOp: cur < 13 ? 1 : 0.35 },
          sizeDown: () => {
            if (cur > 8) this.setState({ fsize: Math.round((cur - 0.5) * 2) / 2 });
          },
          sizeUp: () => {
            if (cur < 13) this.setState({ fsize: Math.round((cur + 0.5) * 2) / 2 });
          },
        };
      })(),
      live: (() => {
        const fresh = this._edit && Date.now() - this._edit < 1200;
        return {
          label: fresh ? (s.lang === 'en' ? 'Updated' : 'Mis à jour') : s.lang === 'en' ? 'Live' : 'En direct',
          fg: fresh ? 'var(--act)' : 'var(--ok)',
          dot: fresh ? 'var(--ac)' : 'var(--ok)',
          ring: fresh ? '5px' : '0px',
          halo: fresh ? 'rgba(232,72,28,.18)' : 'rgba(0,0,0,0)',
        };
      })(),
      mini: (() => {
        const k = steps[stepIdx];
        const lines =
          k === 'contact'
            ? [
                { text: view.contact.name || '—', fw: 700 },
                { text: view.contact.title || '', fw: 600 },
                { text: contactLine(view), fw: 400 },
              ]
            : secText(view, k).map((t, i) => ({
                text: t,
                fw: k === 'experience' && !t.startsWith('- ') && !t.includes(' | ') ? 700 : 400,
              }));
        return {
          show: s.mobile && s.mTab === 'form',
          title: (s.lang === 'en' ? 'Live preview · ' : 'Aperçu en direct · ') + (s.lang === 'en' ? LABELS_EN[k] : LABELS[k]),
          lines: lines.length
            ? lines
            : [{ text: s.lang === 'en' ? 'Nothing yet: start typing.' : 'Rien pour l’instant : commencez à écrire.', fw: 400 }],
        };
      })(),
      ...(() => {
        const A = s.auth,
          mode = A.mode,
          isUp = mode === 'up',
          isIn = mode === 'in',
          en = s.lang === 'en';
        const pw = A.pw || '',
          score = [
            pw.length >= 8,
            /[0-9]/.test(pw),
            /[A-Z]/.test(pw) && /[a-z]/.test(pw),
            /[^A-Za-z0-9]/.test(pw) || pw.length >= 12,
          ].filter(Boolean).length;
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(A.email || '');
        const submit = () => {
          if (A.busy) return;
          if (!emailOk) {
            this.authSet({ err: 'Adresse e-mail invalide.' });
            return;
          }
          if (isIn) {
            if (!pw) {
              this.authSet({ err: 'Saisissez votre mot de passe.' });
              return;
            }
            this.authRun(() => window.CVAuth.signIn(A.email, pw), 'Bienvenue,');
          } else {
            if (pw.length < 8 || !/[0-9]/.test(pw)) {
              this.authSet({ err: 'Le mot de passe doit faire au moins 8 caractères, dont un chiffre.' });
              return;
            }
            this.authRun(() => window.CVAuth.signUp(A.email, pw, A.name.trim()), 'Compte créé. Bienvenue,');
          }
        };
        const u = A.user,
          pal = ['#e8481c', '#3b3bd6', '#0f7a5a'];
        return {
          au: {
            show: A.ready && ((!u && !A.guest) || A.open),
            side: s.mobile ? 'none' : 'flex',
            sideH: s.mobile ? '0' : '100vh',
            monoTop: s.mobile ? 'flex' : 'none',
            isForm: mode === 'in' || mode === 'up',
            isIn,
            isUp,
            isNewPw: mode === 'newpw',
            isForgot: mode === 'forgot',
            needPw: true,
            title: { in: 'Bon retour', up: 'Créer votre compte', newpw: 'Nouveau mot de passe', forgot: 'Mot de passe oublié' }[mode],
            sub: {
              in: 'Connectez-vous pour retrouver vos CV.',
              up: 'Gratuit. Vos CV restent privés.',
              newpw: 'Choisissez votre nouveau mot de passe.',
              forgot: 'Recevez un lien pour en choisir un nouveau.',
            }[mode],
            name: A.name,
            email: A.email,
            pw,
            pwType: A.showPw ? 'text' : 'password',
            pwAc: isUp ? 'new-password' : 'current-password',
            pwBtn: A.showPw ? 'Masquer' : 'Afficher',
            bd: A.err ? 'var(--er)' : 'var(--line2)',
            onName: (ev) => this.authSet({ name: ev.target.value, err: '' }),
            onEmail: (ev) => this.authSet({ email: ev.target.value, err: '', info: '' }),
            onPw: (ev) => this.authSet({ pw: ev.target.value, err: '' }),
            togglePw: (ev) => {
              ev.preventDefault();
              this.authSet({ showPw: !A.showPw });
            },
            bars: [0, 1, 2, 3].map((i) => ({
              bg: i < score ? (score <= 1 ? 'var(--er)' : score === 2 ? 'var(--wa)' : 'var(--ok)') : 'var(--line)',
            })),
            strLabel: pw
              ? ['Trop faible', 'Faible', 'Correct', 'Solide', 'Très solide'][score] + ' · 8 caractères min., dont un chiffre'
              : '8 caractères minimum, dont un chiffre',
            strColor: !pw ? 'var(--fa)' : score <= 1 ? 'var(--er)' : score === 2 ? 'var(--wa)' : 'var(--ok)',
            hasErr: !!A.err,
            err: A.err,
            hasInfo: !!A.info,
            info: A.info,
            btnOp: A.busy ? 0.6 : 1,
            btn: A.busy ? 'Un instant…' : isIn ? 'Se connecter' : 'Créer mon compte',
            submit,
            switchTxt: isIn ? 'Pas encore de compte ?' : 'Déjà inscrit·e ?',
            switchBtn: isIn ? 'Créer un compte' : 'Se connecter',
            switchGo: () => this.authSet({ mode: isIn ? 'up' : 'in', err: '', info: '' }),
            toForgot: (ev) => {
              ev.preventDefault();
              this.authSet({ mode: 'forgot', err: '', info: '' });
            },
            back: () => this.authSet({ mode: 'in', err: '', info: '' }),
            resetBtn: A.busy ? 'Envoi…' : 'Envoyer le lien',
            sendReset: () => {
              if (!emailOk) {
                this.authSet({ err: 'Adresse e-mail invalide.' });
                return;
              }
              this.authSet({ busy: true, err: '' });
              window.CVAuth.resetPassword(A.email)
                .then(() => this.authSet({ busy: false, info: 'Si un compte existe, un lien vient d’être envoyé à ' + A.email + '.' }))
                .catch((e) => this.authSet({ busy: false, err: e.message }));
            },
            savePwBtn: A.busy ? 'Enregistrement…' : 'Enregistrer le mot de passe',
            savePw: () => {
              if (A.busy) return;
              if (pw.length < 8 || !/[0-9]/.test(pw)) {
                this.authSet({ err: 'Le mot de passe doit faire au moins 8 caractères, dont un chiffre.' });
                return;
              }
              this.authSet({ busy: true, err: '' });
              window.CVAuth.updatePassword(pw)
                .then(() => {
                  this.authSet({ busy: false, pw: '', open: false, mode: 'in', info: '' });
                  this.toast('Mot de passe mis à jour');
                })
                .catch((e) => this.authSet({ busy: false, err: e.message }));
            },
            google: () => {
              this.authSet({ busy: true, err: '' });
              window.CVAuth.signInGoogle().catch((e) => this.authSet({ busy: false, err: e.message }));
            },
            guest: () => {
              this.setState((st) => ({
                auth: { ...st.auth, guest: true, open: false, err: '', mode: st.auth.mode === 'newpw' ? 'in' : st.auth.mode },
              }));
            },
          },
          avatar: {
            initial: u ? (u.name || u.email).charAt(0).toUpperCase() : '→',
            title: u ? u.name + ' · ' + u.email : 'Se connecter',
            bg: u ? 'var(--ac)' : 'var(--panel)',
            fg: u ? '#ffffff' : 'var(--tx)',
            go: () => {
              if (u || s.auth.disabled) this.go('settings');
              else this.setState((st) => ({ auth: { ...st.auth, open: true, mode: 'in' } }));
            },
          },
          openAuthIn: () => {
            if (s.auth.disabled) {
              this.toast('Les comptes ne sont pas configurés sur ce serveur (Supabase)');
              return;
            }
            this.setState((st) => ({ auth: { ...st.auth, open: true, mode: 'in', err: '', info: '' } }));
          },
          openAuthUp: () => {
            if (s.auth.disabled) {
              this.toast('Les comptes ne sont pas configurés sur ce serveur (Supabase)');
              return;
            }
            this.setState((st) => ({ auth: { ...st.auth, open: true, mode: 'up', err: '', info: '' } }));
          },
          acct: {
            out: !u,
            in: !!u,
            name: u ? u.name : '',
            email: u ? u.email : '',
            initial: u ? (u.name || u.email).charAt(0).toUpperCase() : '',
            isEmail: !!u && u.provider === 'email',
            providerLabel: u && u.provider === 'google' ? 'Connecté·e avec Google' : 'Connecté·e par e-mail',
            sync:
              ({
                ok: 'synchronisé',
                saving: 'synchronisation…',
                error: 'hors ligne, nouvel essai à la prochaine modification',
                local: 'synchronisé',
              }[s.sync] || 'synchronisé') +
              ' · ' +
              s.versions.length +
              ' versions',
            logout: () => {
              const p = window.CVAuth ? window.CVAuth.signOut() : Promise.resolve();
              p.catch(() => {}).then(() => {
                this._pulled = false;
                this.setState((st) => ({ auth: { ...st.auth, user: null, guest: false, mode: 'in', pw: '' } }));
                this.clearLocal();
                this.toast('Vous êtes déconnecté·e');
              });
            },
            reset: () => {
              window.CVAuth &&
                window.CVAuth.resetPassword(u.email)
                  .then(() => this.toast('Lien de changement de mot de passe envoyé à ' + u.email))
                  .catch((e) => this.toast(errMsg(e)));
            },
          },
        };
      })(),
      letFontSel: s.letFont,
      letFontOpts: Object.keys(FONTS).map((k) => ({ v: k, l: k })),
      onLetFont: (ev) => this.setState({ letFont: ev.target.value }),
      letStyle: { font: FONTS[s.letFont] || FONTS.Arial, fs: (s.letSize * 1.2).toFixed(1) + 'px' },
      letSize: {
        label: (s.lang === 'en' ? String(s.letSize) : String(s.letSize).replace('.', ',')) + ' pt',
        downOp: s.letSize > 9 ? 1 : 0.35,
        upOp: s.letSize < 14 ? 1 : 0.35,
        down: () => {
          if (s.letSize > 9) this.setState({ letSize: s.letSize - 0.5 });
        },
        up: () => {
          if (s.letSize < 14) this.setState({ letSize: s.letSize + 0.5 });
        },
      },
      letSameAsCv: () => {
        this.setState({ letFont: tpl.fontName in FONTS ? tpl.fontName : 'Arial', letSize: s.fsize ? Math.max(9, s.fsize + 1) : 11 });
        this.toast('Lettre alignée sur la police du CV : ' + (tpl.fontName in FONTS ? tpl.fontName : 'Arial'));
      },
      undo: () => this.undo(),
      redo: () => this.redo(),
      undoOp: this.hist(v.id).u.length ? 1 : 0.35,
      redoOp: this.hist(v.id).r.length ? 1 : 0.35,
      ...(() => {
        const ph = s.paperH || 1075,
          n = Math.max(1, Math.ceil(ph / 1075 - 0.02));
        return {
          pages: {
            label: n === 1 ? '1 page A4 ✓' : n + ' pages A4' + (s.dense ? '' : ' · essayez Compacte'),
            bg: n === 1 ? 'var(--oks)' : n === 2 ? 'var(--was)' : 'var(--ers)',
            fg: n === 1 ? 'var(--ok)' : n === 2 ? 'var(--wa)' : 'var(--er)',
          },
          pageBreaks: Array.from({ length: n - 1 }, (_, i) => ({
            top: (i + 1) * 1075,
            label: 'Page ' + (i + 2),
            color: i === 0 ? '#e8481c' : '#cc3127',
          })),
        };
      })(),
      ph: (() => {
        const it = findPh(cv);
        return {
          has: it.length > 0,
          title: it.length + ' repère(s) à compléter : export bloqué',
          items: it.map((p) => ({
            where: p.where,
            text: p.text,
            go: () => {
              const i = steps.indexOf(p.key);
              this.setState((st) => ({ exp: { ...st.exp, open: false }, screen: 'editor', mTab: 'form', step: i < 0 ? 0 : i }));
            },
          })),
        };
      })(),
      rem: (() => {
        const n = s.apps.filter((a) => dueOf(a)).length;
        // Mode Études : dossiers non envoyés dont la date limite tombe dans les 7 jours.
        const d = s.schoolApps.filter((a) => a.status === 'prepare' && a.deadline && daysLeft(a.deadline) >= 0 && daysLeft(a.deadline) <= 7).length;
        const parts = [n ? n + ' relance' + (n > 1 ? 's' : '') + ' due' + (n > 1 ? 's' : '') : '', d ? d + ' date' + (d > 1 ? 's' : '') + ' limite' + (d > 1 ? 's' : '') + ' proche' + (d > 1 ? 's' : '') : ''].filter(Boolean);
        return { has: n + d > 0, label: parts.join(' · '), go: () => this.go('apps') };
      })(),
      cm: (() => {
        const it = s.comments;
        return {
          has: it.length > 0,
          count: it.filter((c) => !c.done).length,
          items: it.map((c) => ({
            author: c.author,
            where: LABELS[c.key],
            text: c.text,
            op: c.done ? 0.55 : 1,
            deco: c.done ? 'line-through' : 'none',
            btn: c.done ? 'Rouvrir' : 'Résolu',
            go: () => {
              const i = steps.indexOf(c.key);
              this.setState({ screen: 'editor', mTab: 'form', step: i < 0 ? 0 : i });
            },
            toggle: () => {
              this.setState((st) => ({ comments: st.comments.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x)) }));
              window.CVStore.setCommentDone(c.id, !c.done).catch((e) => this.toast(errMsg(e)));
            },
          })),
        };
      })(),
      openShare: () => {
        this.setState((st) => ({ navOpen: false, share: { ...st.share, open: true, link: '', token: '' } }));
        const u = s.auth.user;
        if (!u) return;
        window.CVStore.activeShare(v.id)
          .then((a) => {
            if (a) this.setState((st) => ({ share: { ...st.share, link: a.link, token: a.token, perm: a.perm, expiresAt: a.expiresAt } }));
          })
          .catch(() => {});
        this.loadComments();
      },
      closeShare: () => this.setState((st) => ({ share: { ...st.share, open: false } })),
      sh: (() => {
        const S = s.share,
          set = (o) => this.setState((st) => ({ share: { ...st.share, ...o } }));
        return {
          open: S.open,
          hasLink: !!S.link,
          noLink: !S.link,
          link: S.link,
          perms: [
            ['read', 'Lecture seule'],
            ['comment', 'Commentaires'],
          ].map(([k, l]) => ({ label: l, ...seg(S.perm === k), go: () => set({ perm: k }) })),
          exps: [
            ['7', '7 jours'],
            ['30', '30 jours'],
          ].map(([k, l]) => ({ label: l, ...seg(S.expiry === k), go: () => set({ expiry: k }) })),
          anonBg: S.anon ? 'var(--ac)' : 'var(--panel)',
          anonBd: S.anon ? 'var(--ac)' : 'var(--line2)',
          anonCheck: S.anon ? '✓' : '',
          toggleAnon: () => set({ anon: !S.anon }),
          meta:
            (S.perm === 'comment' ? 'Commentaires autorisés' : 'Lecture seule') +
            ' · expire dans ' +
            (S.expiresAt ? Math.max(1, Math.ceil((new Date(S.expiresAt) - Date.now()) / 86400000)) : S.expiry) +
            ' jours' +
            (S.anon ? ' · version anonymisée' : ''),
          create: () => {
            const u = s.auth.user;
            if (!u) {
              this.setState((st) => ({
                share: { ...st.share, open: false },
                auth: { ...st.auth, open: true, mode: 'in', err: '', info: 'Connectez-vous pour créer un lien de relecture.' },
              }));
              return;
            }
            if (S.busy) return;
            set({ busy: true });
            const snap = clone(S.anon ? anonCv(cv) : cv);
            if (snap.contact) delete snap.contact.photo;
            window.CVStore.createShare(u.id, { versionId: v.id, versionName: v.name, snapshot: snap, perm: S.perm, days: +S.expiry })
              .then((r) => {
                set({ busy: false, link: r.link, token: r.token, expiresAt: r.expiresAt, created: Date.now() });
                this.toast('Lien de relecture créé');
              })
              .catch((e) => {
                set({ busy: false });
                this.toast('Création du lien impossible : ' + errMsg(e));
              });
          },
          copy: () => {
            try {
              navigator.clipboard.writeText(S.link);
            } catch (e) {}
            this.toast('Lien copié');
          },
          revoke: () => {
            const t = S.token;
            if (!t) {
              set({ link: '' });
              return;
            }
            window.CVStore.revokeShare(t)
              .then(() => {
                set({ link: '', token: '', expiresAt: null });
                this.toast('Lien révoqué : il ne fonctionne plus');
              })
              .catch((e) => this.toast(errMsg(e)));
          },
        };
      })(),
      exporting: s.exporting,
      hasToast: !!s.toast,
      toast: s.toast,
      stepNum: stepIdx + 1,
      stepTotal: steps.length,
      progress: { pct: Math.round((filledN / steps.length) * 100), label: filledN + '/' + steps.length + ' sections complétées' },
      hasStepNav: true,
      photo: {
        bg: cv.contact.photo ? 'url("' + cv.contact.photo + '")' : 'none',
        has: !!cv.contact.photo,
        none: !cv.contact.photo,
        src: cv.contact.photo || '',
        btn: cv.contact.photo ? 'Changer' : 'Ajouter',
      },
      onPhoto: (ev) => {
        const fl = ev.target.files && ev.target.files[0];
        ev.target.value = '';
        if (!fl) return;
        this.readImg(fl, 320, (url) => {
          mut((c) => {
            c.contact.photo = url;
          });
          this.toast(tpl.isDesign ? 'Photo ajoutée' : 'Photo ajoutée : visible dans les modèles Design');
        });
      },
      removePhoto: () =>
        mut((c) => {
          c.contact.photo = '';
        }),
      priorities,
      hasPriorities: priorities.length > 0,
      goEditor: () => this.go('editor'),
      rulesOpen: s.rulesOpen,
      rulesChev: s.rulesOpen ? '−' : '+',
      toggleRules: () => this.setState((st) => ({ rulesOpen: !st.rulesOpen })),
      galleryOpen: s.galleryOpen,
      openGallery: () => this.setState({ galleryOpen: true }),
      closeGallery: () => this.setState({ galleryOpen: false }),
      galleryAts: gallery.filter((g) => g.fam === 'ats'),
      galleryDesign: gallery.filter((g) => g.fam === 'design'),
      swatches: ACCENTS.map(([name, hex]) => ({
        name,
        hex,
        ring: s.accent === hex ? 'var(--tx)' : 'transparent',
        go: () => this.setState({ accent: hex }),
      })),
      paperRef: this.paperRef,
      adSrc: {
        ...srcVals('ad', [
          ['text', 'Texte'],
          ['link', 'Lien'],
          ['image', 'Image'],
          ['pdf', 'PDF'],
        ]),
        showText: A.src === 'text' || A.srcPhase === 'done',
        textLabel: A.src === 'text' ? 'Texte de l’offre' : 'Texte extrait par l’IA : vérifiez-le avant l’analyse',
      },
      adH: srcH('ad'),
      letSrc: srcVals('letter', [
        ['offer', 'Offre analysée'],
        ['link', 'Lien'],
        ['image', 'Image'],
      ]),
      letH: srcH('letter'),
    };
  }
  render() {
    return <AppView v={this.renderVals()} />;
  }
}
