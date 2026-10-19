/* En-têtes de sécurité, identiques à vercel.json (utilisés en local et sur tout hébergeur Node). */
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co wss://*.supabase.co; worker-src 'self' blob:; frame-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; manifest-src 'self'; upgrade-insecure-requests";
const DEV = !process.env.VERCEL && process.env.NODE_ENV !== 'production';
export function securityHeaders(req, res, next) {
  // En développement, Vite injecte des scripts en ligne (rechargement à chaud) : pas de CSP.
  if (DEV) { res.setHeader('X-Content-Type-Options', 'nosniff'); return next(); }
  res.setHeader("Content-Security-Policy", req.secure ? CSP : CSP.replace("; upgrade-insecure-requests", ""));
  if (req.secure) res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  if (req.path.startsWith('/api/')) res.setHeader('Cache-Control', 'no-store');
  next();
}
