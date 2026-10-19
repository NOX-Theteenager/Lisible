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
  async function post(url, body) {
    const t = await token();
    let r;
    try {
      r = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(t ? { authorization: 'Bearer ' + t } : {}) },
        body: JSON.stringify(body || {}),
      });
    } catch (e) {
      throw new Error('Connexion au serveur impossible. Vérifiez votre réseau.');
    }
    let j = null;
    try {
      j = await r.json();
    } catch (e) {}
    if (!r.ok) throw new Error((j && j.error) || 'Erreur ' + r.status);
    return j;
  }
  window.LisibleAPI = {
    config,
    supabase,
    token,
    ai: (task, body) => post('/api/ai/' + task, body),
    letter: (body) => post('/api/letter', body),
    fetchOffer: (url) => post('/api/offer/fetch', { url }),
  };
})();
