/* ───────────────────────────────────────────────────────────────
   SYNCHRONISATION SUPABASE — window.CVStore
   Versions de CV, candidatures, historique des entretiens, préférences, liens de relecture et
   commentaires. N'envoie que les lignes modifiées depuis la dernière
   synchronisation.
   ─────────────────────────────────────────────────────────────── */
(function () {
  const sb = async () => {
    const c = await window.LisibleAPI.supabase();
    if (!c) throw new Error('Supabase non configuré');
    return c;
  };
  const seen = { v: new Map(), a: new Map(), i: new Map(), s: '' };
  /* Table absente (migration 003 non appliquée) : l'historique reste sur l'appareil. */
  let noIv = false;
  const missingTable = (e) => e && (e.code === '42P01' || e.code === 'PGRST205' || /does not exist|schema cache/i.test(e.message || ''));
  let chain = Promise.resolve();
  const chk = ({ error }) => {
    if (error) throw new Error(error.message);
  };

  function reset() {
    seen.v.clear();
    seen.a.clear();
    seen.i.clear();
    seen.s = '';
  }

  /* Charge tout le compte. Retour : { versions, apps, interviews, settings } (listes vides pour un nouveau compte). */
  async function pull(userId) {
    const c = await sb();
    const [v, a, p, iv] = await Promise.all([
      c.from('cv_versions').select('id,name,tag,cv,history,updated_at').eq('user_id', userId).order('updated_at', { ascending: false }),
      c.from('applications').select('id,data').eq('user_id', userId).order('updated_at', { ascending: false }),
      c.from('profiles').select('settings').eq('id', userId).maybeSingle(),
      c.from('interview_sessions').select('id,data').eq('user_id', userId).order('created_at', { ascending: false }).limit(100),
    ]);
    noIv = missingTable(iv.error);
    if (!noIv) chk(iv);
    [v, a, p].forEach(chk);
    reset();
    const versions = v.data.map((r) => ({
      id: r.id,
      name: r.name,
      tag: r.tag,
      cv: r.cv,
      history: r.history || [],
      updated: Number(r.updated_at),
    }));
    versions.forEach((x) => seen.v.set(x.id, JSON.stringify(x)));
    const apps = a.data.map((r) => r.data);
    apps.forEach((x) => seen.a.set(x.id, JSON.stringify(x)));
    const interviews = noIv ? null : iv.data.map((r) => r.data);
    (interviews || []).forEach((x) => seen.i.set(x.id, JSON.stringify(x)));
    const settings = (p.data && p.data.settings) || {};
    seen.s = JSON.stringify(settings);
    return { versions, apps, interviews, settings };
  }

  /* Envoie les différences. Les appels sont mis en file pour rester ordonnés. */
  function push(userId, { versions, apps, interviews, settings }) {
    chain = chain.then(async () => {
      const c = await sb();
      const vUp = [],
        vIds = new Set();
      versions.forEach((x) => {
        vIds.add(x.id);
        const j = JSON.stringify(x);
        if (seen.v.get(x.id) !== j) vUp.push([x, j]);
      });
      const vDel = [...seen.v.keys()].filter((id) => !vIds.has(id));
      const aUp = [],
        aIds = new Set();
      apps.forEach((x) => {
        aIds.add(x.id);
        const j = JSON.stringify(x);
        if (seen.a.get(x.id) !== j) aUp.push([x, j]);
      });
      const aDel = [...seen.a.keys()].filter((id) => !aIds.has(id));
      const iUp = [],
        iIds = new Set();
      (interviews || []).forEach((x) => {
        iIds.add(x.id);
        const j = JSON.stringify(x);
        if (seen.i.get(x.id) !== j) iUp.push([x, j]);
      });
      const iDel = interviews ? [...seen.i.keys()].filter((id) => !iIds.has(id)) : [];
      const sJ = JSON.stringify(settings);
      if (vUp.length) {
        chk(
          await c
            .from('cv_versions')
            .upsert(
              vUp.map(([x]) => ({
                user_id: userId,
                id: x.id,
                name: x.name,
                tag: x.tag,
                cv: x.cv,
                history: x.history,
                updated_at: x.updated,
              })),
            ),
        );
        vUp.forEach(([x, j]) => seen.v.set(x.id, j));
      }
      if (vDel.length) {
        chk(await c.from('cv_versions').delete().eq('user_id', userId).in('id', vDel));
        vDel.forEach((id) => seen.v.delete(id));
      }
      if (aUp.length) {
        chk(
          await c
            .from('applications')
            .upsert(aUp.map(([x]) => ({ user_id: userId, id: x.id, data: x, updated_at: new Date().toISOString() }))),
        );
        aUp.forEach(([x, j]) => seen.a.set(x.id, j));
      }
      if (aDel.length) {
        chk(await c.from('applications').delete().eq('user_id', userId).in('id', aDel));
        aDel.forEach((id) => seen.a.delete(id));
      }
      if (!noIv && (iUp.length || iDel.length)) {
        try {
          if (iUp.length) {
            chk(await c.from('interview_sessions').upsert(iUp.map(([x]) => ({ user_id: userId, id: x.id, data: x, created_at: x.date }))));
            iUp.forEach(([x, j]) => seen.i.set(x.id, j));
          }
          if (iDel.length) {
            chk(await c.from('interview_sessions').delete().eq('user_id', userId).in('id', iDel));
            iDel.forEach((id) => seen.i.delete(id));
          }
        } catch (e) {
          if (!/does not exist|schema cache/i.test(e.message)) throw e;
          noIv = true;
        }
      }
      if (sJ !== seen.s) {
        chk(await c.from('profiles').upsert({ id: userId, settings, updated_at: new Date().toISOString() }));
        seen.s = sJ;
      }
    });
    const p = chain;
    chain = chain.catch(() => {});
    return p;
  }

  /* ─── Partage pour relecture ─── */
  const token = () => {
    const a = new Uint8Array(18);
    crypto.getRandomValues(a);
    return Array.from(a, (b) => 'abcdefghijkmnopqrstuvwxyz23456789'[b % 33]).join('');
  };
  async function createShare(userId, { versionId, versionName, snapshot, perm, days }) {
    const c = await sb(),
      t = token();
    const expires = new Date(Date.now() + days * 86400000).toISOString();
    chk(
      await c
        .from('share_links')
        .insert({ token: t, user_id: userId, version_id: versionId, version_name: versionName, snapshot, perm, expires_at: expires }),
    );
    return { token: t, link: location.origin + '/r/' + t, expiresAt: expires };
  }
  async function revokeShare(t) {
    const c = await sb();
    chk(await c.from('share_links').update({ revoked: true }).eq('token', t));
  }
  async function activeShare(versionId) {
    const c = await sb();
    const { data, error } = await c
      .from('share_links')
      .select('token,perm,expires_at,snapshot')
      .eq('version_id', versionId)
      .eq('revoked', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) throw new Error(error.message);
    return data[0]
      ? { token: data[0].token, link: location.origin + '/r/' + data[0].token, perm: data[0].perm, expiresAt: data[0].expires_at }
      : null;
  }
  /* Commentaires reçus sur les liens de la version. */
  async function comments(versionId) {
    const c = await sb();
    const { data, error } = await c
      .from('share_comments')
      .select('id,author,section,body,done,created_at,share_links!inner(version_id)')
      .eq('share_links.version_id', versionId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data.map((r) => ({ id: r.id, author: r.author, key: r.section, text: r.body, done: r.done, at: r.created_at }));
  }
  async function setCommentDone(id, done) {
    const c = await sb();
    chk(await c.from('share_comments').update({ done }).eq('id', id));
  }

  async function deleteAll(userId) {
    const c = await sb();
    chk(await c.from('share_links').delete().eq('user_id', userId));
    chk(await c.from('cv_versions').delete().eq('user_id', userId));
    chk(await c.from('applications').delete().eq('user_id', userId));
    if (!noIv) {
      const r = await c.from('interview_sessions').delete().eq('user_id', userId);
      if (!missingTable(r.error)) chk(r);
    }
    chk(await c.from('profiles').update({ settings: {} }).eq('id', userId));
    reset();
  }

  /* Droit à l'effacement : supprime le compte Supabase ; toutes les données liées partent en cascade. */
  async function deleteAccount() {
    const c = await sb();
    chk(await c.rpc('delete_my_account'));
    reset();
    try {
      await c.auth.signOut({ scope: 'local' });
    } catch (e) {}
  }

  window.CVStore = { pull, push, reset, createShare, revokeShare, activeShare, comments, setCommentDone, deleteAll, deleteAccount };
})();
