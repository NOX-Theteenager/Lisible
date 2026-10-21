/* ───────────────────────────────────────────────────────────────
   AUTHENTIFICATION — window.CVAuth (Supabase Auth)
   Chaque fonction renvoie { user:{ id, email, name, provider } } ou lève
   une Error au message affichable.
   ─────────────────────────────────────────────────────────────── */
(function () {
  const sb = async () => {
    const c = await window.LisibleAPI.supabase();
    if (!c) throw new Error('Les comptes ne sont pas configurés sur ce serveur (Supabase).');
    return c;
  };
  const nameOf = (email) =>
    (email || '')
      .split('@')[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  const toUser = (u) =>
    u && {
      id: u.id,
      email: u.email,
      name: (u.user_metadata && (u.user_metadata.name || u.user_metadata.full_name)) || nameOf(u.email),
      provider: (u.app_metadata && u.app_metadata.provider) === 'google' ? 'google' : 'email',
    };
  const MSG = {
    'Invalid login credentials': 'E-mail ou mot de passe incorrect.',
    'Email not confirmed': 'Confirmez d’abord votre adresse : un e-mail de validation vous a été envoyé.',
    'User already registered': 'Un compte existe déjà avec cette adresse.',
    'Password should be at least 6 characters': 'Le mot de passe doit faire au moins 8 caractères, dont un chiffre.',
    'New password should be different from the old password.': 'Le nouveau mot de passe doit être différent de l’ancien.',
    'Error sending confirmation email': 'L’e-mail de confirmation n’a pas pu être envoyé. Réessayez dans quelques minutes.',
    'Error sending recovery email': 'L’e-mail de réinitialisation n’a pas pu être envoyé. Réessayez dans quelques minutes.',
    'Signups not allowed for this instance': 'Les inscriptions sont fermées pour le moment.',
    'Unsupported provider: provider is not enabled': 'La connexion avec Google n’est pas encore disponible : utilisez votre e-mail.',
    'Email link is invalid or has expired': 'Ce lien a expiré ou a déjà servi. Connectez-vous, ou demandez un nouveau lien.',
    'Token has expired or is invalid': 'Ce lien a expiré ou a déjà servi. Connectez-vous, ou demandez un nouveau lien.',
  };
  const err = (e) =>
    new Error(
      MSG[e.message] ||
        (/email rate limit/i.test(e.message)
          ? 'Trop d’e-mails envoyés en peu de temps : réessayez dans une heure.'
          : /rate limit/i.test(e.message)
            ? 'Trop de tentatives : patientez quelques minutes.'
            : /code verifier|flow state|both auth code/i.test(e.message)
              ? 'Votre adresse est confirmée, mais le lien a été ouvert dans un autre navigateur : connectez-vous avec votre e-mail et votre mot de passe.'
              : e.message),
    );
  const back = () => location.origin + location.pathname;

  /* Paramètres d'un lien reçu par e-mail ou d'un retour de Google, dans la requête ou après le #. */
  function urlParams() {
    const q = new URLSearchParams(location.search), h = new URLSearchParams(location.hash.replace(/^#/, ''));
    const get = (k) => q.get(k) || h.get(k);
    return { get, has: (k) => q.has(k) || h.has(k) };
  }
  /* Retire de l'adresse les paramètres de connexion, une fois traités. */
  function cleanUrl() {
    const q = new URLSearchParams(location.search);
    ['code', 'token_hash', 'type', 'error', 'error_code', 'error_description', 'next'].forEach((k) => q.delete(k));
    const rest = q.toString();
    history.replaceState(null, '', location.pathname + (rest ? '?' + rest : ''));
  }

  window.CVAuth = {
    /* À appeler au chargement : traite le lien de confirmation, de réinitialisation ou le retour de Google.
       Renvoie { info } ou { error } à afficher, { recovery: true } pour choisir un nouveau mot de passe, ou null. */
    async handleRedirect() {
      const c = await window.LisibleAPI.supabase();
      if (!c) return null;
      const P = urlParams();
      if (P.has('error') || P.has('error_description')) {
        const d = (P.get('error_description') || P.get('error') || '').replace(/\+/g, ' ');
        cleanUrl();
        return { error: err({ message: d }).message };
      }
      // Lien au format « token_hash » (modèles d'e-mail recommandés) : fonctionne quel que soit le navigateur.
      if (P.has('token_hash')) {
        const type = P.get('type') || 'email';
        const { error } = await c.auth.verifyOtp({ token_hash: P.get('token_hash'), type });
        cleanUrl();
        if (error) return { error: err(error).message };
        return type === 'recovery' ? { recovery: true } : { info: 'Adresse confirmée : bienvenue sur Lisible.' };
      }
      // Lien au format « code » (par défaut) : Supabase ouvre la session si le lien est ouvert dans le
      // même navigateur que l'inscription. Sinon l'adresse est quand même confirmée.
      if (P.has('code')) {
        const { data } = await c.auth.getSession();
        if (data.session) { cleanUrl(); return null; }
        const { error } = await c.auth.exchangeCodeForSession(P.get('code'));
        cleanUrl();
        if (error) return { error: err(error).message };
      }
      return null;
    },
    /* Modes de connexion activés sur le projet Supabase (pour n'afficher que ceux qui marchent). */
    async providers() {
      try {
        const cfg = await window.LisibleAPI.config();
        const r = await fetch(cfg.supabaseUrl + '/auth/v1/settings', { headers: { apikey: cfg.supabaseAnonKey } });
        const j = await r.json();
        return { google: !!(j.external && j.external.google), email: !(j.external && j.external.email === false), signup: !j.disable_signup };
      } catch (e) {
        return { google: true, email: true, signup: true };
      }
    },
    async resendConfirmation(email) {
      const { error } = await (await sb()).auth.resend({ type: 'signup', email, options: { emailRedirectTo: back() } });
      if (error) throw err(error);
      return { ok: true };
    },
    async current() {
      const c = await window.LisibleAPI.supabase();
      if (!c) return null;
      const { data } = await c.auth.getSession();
      return data.session ? toUser(data.session.user) : null;
    },
    /* cb(event, user) — event : SIGNED_IN, SIGNED_OUT, PASSWORD_RECOVERY, USER_UPDATED… */
    async onChange(cb) {
      const c = await window.LisibleAPI.supabase();
      if (!c) return () => {};
      const { data } = c.auth.onAuthStateChange((ev, session) => cb(ev, session ? toUser(session.user) : null));
      return () => data.subscription.unsubscribe();
    },
    async signIn(email, password) {
      const { data, error } = await (await sb()).auth.signInWithPassword({ email, password });
      if (error) throw err(error);
      return { user: toUser(data.user) };
    },
    async signUp(email, password, name) {
      const { data, error } = await (
        await sb()
      ).auth.signUp({ email, password, options: { data: { name: name || nameOf(email) }, emailRedirectTo: back() } });
      if (error) throw err(error);
      if (data.user && Array.isArray(data.user.identities) && !data.user.identities.length)
        throw new Error('Un compte existe déjà avec cette adresse.');
      if (!data.session) return { user: null, pending: true }; // confirmation par e-mail requise
      return { user: toUser(data.user) };
    },
    async signInGoogle() {
      const { error } = await (await sb()).auth.signInWithOAuth({ provider: 'google', options: { redirectTo: back() } });
      if (error) throw err(error);
      return { redirecting: true };
    },
    async resetPassword(email) {
      const { error } = await (await sb()).auth.resetPasswordForEmail(email, { redirectTo: back() });
      if (error) throw err(error);
      return { ok: true };
    },
    async updatePassword(password) {
      const { data, error } = await (await sb()).auth.updateUser({ password });
      if (error) throw err(error);
      return { user: toUser(data.user) };
    },
    async signOut() {
      const c = await window.LisibleAPI.supabase();
      if (c) await c.auth.signOut();
      return { ok: true };
    },
  };
})();
