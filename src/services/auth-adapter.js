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
  };
  const err = (e) =>
    new Error(MSG[e.message] || (/rate limit/i.test(e.message) ? 'Trop de tentatives : patientez quelques minutes.' : e.message));
  const back = () => location.origin + location.pathname;

  window.CVAuth = {
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
