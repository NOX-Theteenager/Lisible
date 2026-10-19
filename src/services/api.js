/* ───────────────────────────────────────────────────────────────
   Client des services Lisible — window.LisibleAPI
   - charge la configuration publique (/api/config)
   - initialise Supabase (authentification + base de données)
   - appelle le serveur pour l'IA (Gemini) et la lettre (Claude)
   ─────────────────────────────────────────────────────────────── */
(function () {
  let cfgP = null,
    sbP = null;

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = res;
      s.onerror = () => rej(new Error('Chargement impossible : ' + src));
      document.head.appendChild(s);
    });
  }
  function config() {
    if (!cfgP)
      cfgP = fetch('/api/config')
        .then((r) => {
          if (!r.ok) throw new Error('Serveur injoignable');
          return r.json();
        })
        .catch((e) => {
          cfgP = null;
          throw e;
        });
    return cfgP;
  }
  /* Renvoie le client Supabase, ou null si le projet n'est pas configuré. */
  function supabase() {
    if (!sbP)
      sbP = config()
        .then(async (c) => {
          if (!c.supabaseUrl || !c.supabaseAnonKey) return null;
          if (!window.supabase) await loadScript('/vendor/supabase.js');
          return window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
          });
        })
        .catch((e) => {
          sbP = null;
          throw e;
        });
    return sbP;
  }
  async function token() {
    try {
      const sb = await supabase();
      if (!sb) return '';
      const { data } = await sb.auth.getSession();
      return data.session ? data.session.access_token : '';
    } catch (e) {
      return '';
    }
  }
  /* Contexte ajouté à chaque demande d'IA : marché visé, langue du contenu, mémoire du profil. */
  let ctx = {};
  const withCtx = (body) => ({ ...ctx, ...(body || {}) });

  async function send(url, body) {
    const t = await token();
    try {
      return await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(t ? { authorization: 'Bearer ' + t } : {}) },
        body: JSON.stringify(body || {}),
      });
    } catch (e) {
      throw new Error('Connexion au serveur impossible. Vérifiez votre réseau.');
    }
  }
  async function failed(r) {
    let j = null;
    try { j = await r.json(); } catch (e) {}
    return new Error((j && j.error) || (r.status === 429 ? 'Trop de requêtes. Réessayez dans une minute.' : 'Erreur ' + r.status));
  }
  async function post(url, body) {
    const r = await send(url, body);
    if (!r.ok) throw await failed(r);
    return r.json();
  }
  /* Lecture d'une réponse en lignes JSON (lettre rédigée au fil de l'eau). */
  async function stream(url, body, onEvent) {
    const r = await send(url, body);
    if (!r.ok) throw await failed(r);
    const reader = r.body.getReader(), dec = new TextDecoder();
    let buf = '', last = null;
    for (;;) {
      const { value, done } = await reader.read();
      if (value) buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!line) continue;
        const ev = JSON.parse(line);
        if (ev.type === 'error') throw new Error(ev.error);
        last = ev; onEvent(ev);
      }
      if (done) break;
    }
    if (!last || last.type !== 'done') throw new Error('La rédaction a été interrompue. Réessayez.');
    return last;
  }
  async function pdf(html, name) {
    const r = await send('/api/pdf', { html, name });
    if (!r.ok) throw await failed(r);
    return r.blob();
  }
  window.LisibleAPI = {
    config,
    supabase,
    token,
    setContext: (c) => { ctx = c || {}; },
    ai: (task, body) => post('/api/ai/' + task, withCtx(body)),
    letter: (body) => post('/api/letter', withCtx(body)),
    letterStream: (body, onEvent) => stream('/api/letter/stream', withCtx(body), onEvent),
    fetchOffer: (url) => post('/api/offer/fetch', { url }),
    pdf,
  };
})();
