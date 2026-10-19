/* Capture du micro pour l'entretien vocal : rééchantillonne en 16 kHz mono, convertit en PCM 16 bits
   et envoie des blocs de 100 ms au fil de l'eau, avec le niveau sonore pour l'indicateur. */
class LiveCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.ratio = sampleRate / 16000;
    this.pos = 0;
    this.buf = new Int16Array(1600);
    this.n = 0;
    this.sum = 0;
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    // Moyenne des échantillons de chaque intervalle : sous-échantillonnage simple, sans repliement marqué.
    while (this.pos < ch.length) {
      const a = Math.floor(this.pos), b = Math.min(ch.length, Math.max(a + 1, Math.floor(this.pos + this.ratio)));
      let s = 0;
      for (let i = a; i < b; i++) s += ch[i];
      const v = Math.max(-1, Math.min(1, s / (b - a)));
      this.sum += v * v;
      this.buf[this.n++] = v < 0 ? v * 0x8000 : v * 0x7fff;
      if (this.n === this.buf.length) {
        this.port.postMessage({ pcm: this.buf.buffer, level: Math.sqrt(this.sum / this.n) }, [this.buf.buffer]);
        this.buf = new Int16Array(1600);
        this.n = 0;
        this.sum = 0;
      }
      this.pos += this.ratio;
    }
    this.pos -= ch.length;
    return true;
  }
}
registerProcessor('live-capture', LiveCapture);
