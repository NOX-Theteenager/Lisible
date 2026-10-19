/* Entretien vocal avec Gemini Live : le serveur fournit un jeton éphémère verrouillé (modèle, consigne,
   configuration), le navigateur se connecte directement à Gemini et échange l'audio en temps réel.
   Rien n'est enregistré : l'audio n'est ni stocké ni conservé après la session, seule la transcription
   reste en mémoire pour le bilan.

   Événements (onEvent) :
     { type: 'state', state: 'connecting' | 'listening' | 'speaking' | 'ending' | 'closed' }
     { type: 'transcript', entries: [{ role: 'recruiter' | 'candidate', text }] }
     { type: 'level', level }          niveau du micro (0 à 1)
     { type: 'end', entries, turns, reason }  fin de l'entretien ('done' | 'stopped' | 'lost') ;
                                      turns : temps de parole de chaque réponse, pour l'analyse de l'oral
     { type: 'error', message } */

export const liveSupported = () =>
  typeof window !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && typeof AudioWorkletNode !== 'undefined' && window.isSecureContext;

function toB64(buf) {
  const u = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return btoa(s);
}
function fromB64(b64) {
  const s = atob(b64), u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return u.buffer;
}

export class LiveInterview {
  constructor(onEvent) {
    this.on = onEvent;
    this.entries = [];
    this.sources = new Set();
    this.playAt = 0;
    this.state = 'closed';
    this.handle = null;
    this.retries = 0;
    this.ending = false;
    this.stopped = false;
    this.muted = false;
    this.turns = [];
    this.turn = null;
  }

  set(state) {
    if (this.state === state) return;
    // Mesure du temps de parole : une « réponse » va du premier au dernier son capté pendant que c'est à la personne.
    if (this.state === 'listening' && this.turn) {
      if (this.turn.first) this.turns.push({ speechMs: this.turn.speech, durMs: this.turn.last - this.turn.first + 100 });
      this.turn = null;
    }
    if (state === 'listening') this.turn = { speech: 0, first: 0, last: 0 };
    this.state = state;
    this.on({ type: 'state', state });
  }
  add(role, text) {
    if (!text) return;
    const last = this.entries[this.entries.length - 1];
    if (last && last.role === role) last.text += text;
    else this.entries.push({ role, text: text.replace(/^\s+/, '') });
    this.on({ type: 'transcript', entries: this.entries.map(e => ({ ...e })) });
  }

  async start(body) {
    this.set('connecting');
    try {
      // Micro d'abord : si l'accès est refusé, aucun jeton n'est consommé.
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    } catch (e) {
      this.set('closed');
      throw new Error(e && e.name === 'NotAllowedError' ? 'Accès au micro refusé. Autorisez le micro pour ce site, puis réessayez.' : 'Aucun micro utilisable n’a été trouvé.');
    }
    try {
      this.ctx = new AudioContext();
      await this.ctx.audioWorklet.addModule('/live-worklet.js');
      const src = this.ctx.createMediaStreamSource(this.stream);
      this.node = new AudioWorkletNode(this.ctx, 'live-capture');
      this.node.port.onmessage = e => this.onMic(e.data);
      src.connect(this.node);
      // Le nœud doit être relié à la sortie pour être exécuté ; le gain nul évite tout retour du micro.
      const mute = this.ctx.createGain();
      mute.gain.value = 0;
      this.node.connect(mute).connect(this.ctx.destination);

      const s = await window.LisibleAPI.liveSession(body);
      this.session = s;
      const { GoogleGenAI } = await import('@google/genai');
      this.ai = new GoogleGenAI({ apiKey: s.token, httpOptions: { apiVersion: 'v1alpha' } });
      await this.connect();
      // Le recruteur ouvre l'entretien.
      this.ws.sendRealtimeInput({ text: body.lang === 'en' ? 'Hello, I am ready.' : 'Bonjour, je suis prêt·e.' });
    } catch (e) {
      this.cleanup();
      this.set('closed');
      throw e;
    }
  }

  connect() {
    const s = this.session;
    return this.ai.live.connect({
      model: s.model,
      config: { ...s.config, sessionResumption: this.handle ? { handle: this.handle } : {} },
      callbacks: {
        onopen: () => {},
        onmessage: m => this.onMessage(m),
        onerror: () => {},
        onclose: e => this.onClose(e),
      },
    }).then(ws => { this.ws = ws; this.set('speaking'); });
  }

  onMic({ pcm, level }) {
    this.on({ type: 'level', level: this.muted || this.state !== 'listening' ? 0 : level });
    if (this.turn && !this.muted && level > 0.02) {
      const now = Date.now();
      if (!this.turn.first) this.turn.first = now;
      this.turn.last = now;
      this.turn.speech += 100;
    }
    // Semi-duplex : le micro n'est pas transmis pendant que le recruteur parle (évite l'écho).
    if (!this.ws || this.muted || this.state !== 'listening') return;
    try { this.ws.sendRealtimeInput({ audio: { data: toB64(pcm), mimeType: 'audio/pcm;rate=16000' } }); } catch { /* connexion en cours de reprise */ }
  }

  onMessage(m) {
    if (m.sessionResumptionUpdate && m.sessionResumptionUpdate.resumable && m.sessionResumptionUpdate.newHandle) this.handle = m.sessionResumptionUpdate.newHandle;
    if (m.goAway) this.resume();
    if (m.toolCall) {
      const calls = m.toolCall.functionCalls || [];
      this.ws.sendToolResponse({ functionResponses: calls.map(f => ({ id: f.id, name: f.name, response: { ok: true } })) });
      if (calls.some(f => f.name === 'end_interview')) { this.ending = true; this.finishWhenSilent(); }
    }
    const sc = m.serverContent;
    if (!sc) return;
    if (sc.inputTranscription && sc.inputTranscription.text) this.add('candidate', sc.inputTranscription.text);
    if (sc.outputTranscription && sc.outputTranscription.text) this.add('recruiter', sc.outputTranscription.text);
    if (sc.interrupted) this.stopAudio();
    for (const p of (sc.modelTurn && sc.modelTurn.parts) || []) {
      if (p.inlineData && /^audio\/pcm/.test(p.inlineData.mimeType || '')) this.play(p.inlineData.data, Number((p.inlineData.mimeType.match(/rate=(\d+)/) || [])[1]) || 24000);
    }
    if (sc.turnComplete) { this.turnDone = true; this.afterPlayback(); }
  }

  play(b64, rate) {
    this.turnDone = false;
    this.set('speaking');
    const pcm = new Int16Array(fromB64(b64));
    const buf = this.ctx.createBuffer(1, pcm.length, rate), ch = buf.getChannelData(0);
    for (let i = 0; i < pcm.length; i++) ch[i] = pcm[i] / 0x8000;
    const node = this.ctx.createBufferSource();
    node.buffer = buf;
    node.connect(this.ctx.destination);
    const at = Math.max(this.ctx.currentTime + 0.05, this.playAt);
    node.start(at);
    this.playAt = at + buf.duration;
    this.sources.add(node);
    node.onended = () => { this.sources.delete(node); this.afterPlayback(); };
  }
  stopAudio() {
    for (const n of this.sources) { try { n.stop(); } catch { /* déjà arrêté */ } }
    this.sources.clear();
    this.playAt = 0;
  }
  /* Le recruteur a fini de parler : on rend la parole, ou on termine si l'entretien est clos. */
  afterPlayback() {
    if (!this.turnDone || this.sources.size) return;
    if (this.ending) return this.finish('done');
    if (this.state === 'speaking') this.set('listening');
  }
  finishWhenSilent() {
    if (this.turnDone && !this.sources.size) this.finish('done');
  }
  /* Couper la parole au recruteur et répondre tout de suite. */
  interrupt() {
    this.stopAudio();
    this.turnDone = true;
    if (!this.ending) this.set('listening');
  }
  setMuted(v) { this.muted = !!v; }

  resume() {
    if (this.resuming || !this.handle || this.retries >= 3) return;
    this.resuming = true;
    this.retries++;
    const old = this.ws;
    this.ws = null;
    try { old && old.close(); } catch { /* déjà fermé */ }
    this.connect().catch(() => this.finish('lost')).finally(() => { this.resuming = false; if (this.state === 'speaking' && !this.sources.size) this.set('listening'); });
  }
  onClose(e) {
    if (this.stopped || this.resuming) return;
    if (this.ending) return this.finish('done');
    // Fermeture inattendue (limite de durée, réseau) : reprise de la conversation là où elle en était.
    if (this.handle && this.retries < 3) return this.resume();
    this.finish('lost', e && e.reason);
  }

  stop() { this.finish('stopped'); }
  finish(reason, detail) {
    if (this.stopped) return;
    this.stopped = true;
    this.cleanup();
    this.set('closed');
    this.on({ type: 'end', reason, detail, turns: this.turns.slice(), entries: this.entries.map(e => ({ ...e, text: e.text.trim() })).filter(e => e.text) });
  }
  cleanup() {
    this.stopAudio();
    try { this.ws && this.ws.close(); } catch { /* déjà fermé */ }
    this.ws = null;
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    try { this.node && this.node.disconnect(); } catch { /* déjà déconnecté */ }
    try { this.ctx && this.ctx.close(); } catch { /* déjà fermé */ }
  }
}
