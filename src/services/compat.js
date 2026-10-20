/* Compatibilités nécessaires à pdf.js sur les navigateurs moins récents, chargées dans la page et
   dans le worker de pdf.js. Sans effet si le navigateur sait déjà le faire.
   - Itération asynchrone des ReadableStream (for await … of stream), absente de Safari avant la
     version 26 : pdf.js s'en sert pour lire le texte des PDF (getTextContent). Sans elle, l'import
     échoue sur iPhone et Mac (« undefined is not a function (near '...i of e...') »).
   - Promise.withResolvers, absent de Safari avant la version 17.4 (iOS 17.4). */
(function () {
  const g = typeof globalThis !== 'undefined' ? globalThis : self;
  if (typeof g.Promise.withResolvers !== 'function') {
    Object.defineProperty(g.Promise, 'withResolvers', {
      value: function withResolvers() {
        let resolve, reject;
        const promise = new this((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return { promise, resolve, reject };
      },
      writable: true,
      configurable: true,
    });
  }
  const RS = g.ReadableStream;
  if (!RS || RS.prototype[Symbol.asyncIterator]) return;

  function values(options) {
    const preventCancel = !!(options && options.preventCancel);
    const reader = this.getReader();
    return {
      async next() {
        try {
          const r = await reader.read();
          if (r.done) reader.releaseLock();
          return r;
        } catch (e) {
          reader.releaseLock();
          throw e;
        }
      },
      async return(value) {
        if (!preventCancel) {
          const c = reader.cancel(value);
          reader.releaseLock();
          await c;
        } else reader.releaseLock();
        return { done: true, value };
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  if (!RS.prototype.values) Object.defineProperty(RS.prototype, 'values', { value: values, writable: true, configurable: true });
  Object.defineProperty(RS.prototype, Symbol.asyncIterator, { value: RS.prototype.values, writable: true, configurable: true });
})();
