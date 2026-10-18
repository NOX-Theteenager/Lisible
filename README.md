# Lisible

CV conformes aux ATS, adaptés à chaque offre et écrits dans une langue naturelle.

Ce dépôt reprend tel quel le design « CV ATS Pro v3 » de Claude Design (`public/index.html`) et remplace toutes les simulations par de vrais services :

| Fonction | Service |
|---|---|
| Import de CV (PDF, DOCX, image, profil LinkedIn) : extraction, rapport de conformité, conversion | pdf.js / mammoth.js dans le navigateur, puis **Gemini** (lecture du document et de sa mise en page) |
| Analyse d'offre (texte, lien, capture, PDF) : mots-clés, exigences, réécritures ciblées | **Gemini** (+ lecture de la page côté serveur) |
| Suggestions de réalisations, de résumé et de compétences, intégration d'un chiffre, réécriture sans tics | **Gemini** |
| Préparation d'entretien, pitch, profil LinkedIn, traduction anglaise du CV | **Gemini** |
| **Lettre de motivation** (nouvelle ou améliorée) | **Claude** (`claude-opus-5-5`) |
| Comptes (e-mail + mot de passe, Google, mot de passe oublié) | **Supabase Auth** |
| Versions de CV, historique, candidatures, préférences, synchronisation entre appareils | **Supabase** (Postgres + RLS) |
| Liens de relecture et commentaires des relecteurs (sans compte) | **Supabase** + page `/r/<jeton>` |
| Exports Word, PDF, TXT, pack ZIP | docx, impression navigateur, JSZip |
| Score ATS, détection des tics d'écriture, anonymisation, cohérence du parcours | Règles locales (navigateur) |

Les clés API restent sur le serveur : le navigateur n'appelle que `/api/*`.

## Installation

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
cp .env.example .env   # puis renseignez les clés
npm start              # http://localhost:3000
```

### 1. Clés d'IA

- **Gemini** : créez une clé sur https://aistudio.google.com/apikey et mettez-la dans `GEMINI_API_KEY`. Le modèle se règle avec `GEMINI_MODEL` (par défaut `gemini-2.5-flash`).
- **Claude** : créez une clé sur https://console.anthropic.com/settings/keys et mettez-la dans `ANTHROPIC_API_KEY`.

### 2. Supabase

1. Créez un projet sur https://supabase.com.
2. **SQL Editor** → collez le contenu de `supabase/schema.sql` → *Run*.
3. **Settings → API** : copiez *Project URL* dans `SUPABASE_URL` et la clé *anon public* dans `SUPABASE_ANON_KEY`.
4. **Authentication → URL Configuration** : *Site URL* = l'adresse de l'application (`http://localhost:3000` en local), et ajoutez la même adresse dans *Redirect URLs*.
5. Connexion Google (facultatif) : **Authentication → Providers → Google**, renseignez l'identifiant et le secret OAuth créés dans Google Cloud Console. L'URI de redirection autorisée à déclarer chez Google est `https://<votre-projet>.supabase.co/auth/v1/callback`.
6. En production, configurez un serveur SMTP (**Authentication → Emails**) : l'expéditeur par défaut de Supabase est limité à quelques e-mails par heure.

Sans Supabase, l'application fonctionne en mode invité : tout reste dans le navigateur, et le partage pour relecture est indisponible.

## Organisation

```
server/
  index.js        serveur Express : fichiers statiques, /api/config, /api/ai/:tâche, /api/letter, /api/offer/fetch
  tasks.js        tâches Gemini (import, offre, réécritures, entretien, traduction, OCR)
  claude.js       rédaction de la lettre de motivation avec Claude
  gemini.js       client Gemini, schéma JSON du CV, consignes d'écriture
  fetch-offer.js  lecture d'une page d'offre (JSON-LD JobPosting, protection SSRF)
public/
  index.html      l'application (design Claude Design, logique branchée sur les services)
  api.js          configuration, client Supabase, appels au serveur
  ai-adapter.js   window.CVAI : fonctions IA appelées par l'interface
  auth-adapter.js window.CVAuth : Supabase Auth
  store.js        window.CVStore : synchronisation des données, partage, commentaires
  extract.js      window.CVExtract : extraction PDF/DOCX dans le navigateur
  review.html     page publique de relecture (/r/<jeton>)
  no-tics.js, i18n.js, exporters.js, support.js : modules du design d'origine
supabase/schema.sql   tables, règles de sécurité (RLS), fonctions de partage
```

## Notes

- Les appels IA sont limités par minute (`RATE_LIMIT_GUEST`, `RATE_LIMIT_USER`) ; les utilisateurs connectés sont identifiés par leur jeton Supabase.
- Les consignes envoyées aux modèles interdisent d'inventer des chiffres : quand une donnée manque, un repère `[X %]` est inséré, et l'export du CV reste bloqué tant qu'il en reste.
- Le bouton « Essayer avec un CV d'exemple » envoie un CV fictif (Camille Moreau) dans le vrai circuit d'import, pour essayer sans fichier.
- Pour la mise en ligne, n'importe quel hébergeur Node convient (Render, Railway, Fly.io, VPS…) : définissez les mêmes variables d'environnement et ajoutez l'URL publique dans Supabase (étape 4).
