/* Worker de pdf.js : les compatibilités de compat.js (itération des flux, Promise.withResolvers)
   sont chargées avant pdf.js. La version « legacy » de pdf.js apporte les autres (base64,
   itérateurs…) nécessaires aux navigateurs moins récents, dont Safari sur iPhone. */
import './compat.js';
import 'pdfjs-dist/legacy/build/pdf.worker.min.mjs';
