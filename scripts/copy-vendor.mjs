/* Copie les bibliothèques navigateur dans public/vendor (servies en statique, en local comme sur Vercel). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'vendor');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const files = {
  'mammoth.browser.min.js': 'mammoth/mammoth.browser.min.js',
  'docx.js': 'docx/dist/index.iife.js',
  'jszip.min.js': 'jszip/dist/jszip.min.js',
  'supabase.js': '@supabase/supabase-js/dist/umd/supabase.js',
};
for (const [name, src] of Object.entries(files)) fs.copyFileSync(path.join(root, 'node_modules', src), path.join(out, name));
console.log('vendor : ' + Object.keys(files).length + ' fichiers copiés dans public/vendor');
