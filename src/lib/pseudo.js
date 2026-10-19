/* Styles :hover / :focus du design : chaque règle devient une classe CSS générée une seule fois. */
const cache = new Map();
let sheet = null,
  n = 0;

const important = (css) =>
  css
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => (/!\s*important$/i.test(d) ? d : d + ' !important'))
    .join(';');

export function ps(pseudo, css) {
  const key = pseudo + '|' + css;
  let cls = cache.get(key);
  if (cls) return cls;
  if (!sheet) {
    const el = document.createElement('style');
    el.setAttribute('data-pseudo', '');
    document.head.appendChild(el);
    sheet = el.sheet;
  }
  cls = 'ps' + (n++).toString(36);
  sheet.insertRule('.' + cls + ':' + pseudo + '{' + important(css) + '}', sheet.cssRules.length);
  cache.set(key, cls);
  return cls;
}
