# Lisible

Application web (PWA) d'aide à la candidature, en français d'abord : CV conforme aux ATS, adaptation à une offre, lettres, entretiens simulés, suivi des candidatures. Deux objectifs au choix de l'utilisateur : **Emploi** et **Études** (formations, Campus France, Parcoursup, bourses). Public principal : Cameroun et Afrique francophone, puis France et international.

Production : https://lisible-one.vercel.app. Chaque push sur `main` (GitHub `NOX-Theteenager/Lisible`) déclenche un déploiement Vercel.

## Commandes

```bash
npm run dev          # serveur Express + Vite (http://localhost:3000)
npm run build        # copie des bibliothèques vendor puis build Vite dans dist/
npm start            # build puis serveur de production local
npm run eval -- --provider=claude --tasks=study --only=<id>   # évaluation de l'IA (coûte des appels, voir plus bas)
```

Pour tester la version de production en local : `npm run build && PORT=3123 NODE_ENV=production node server/index.js`.

## Architecture

- **Serveur** (`server/`, Express, ESM, Node 24) : `index.js` déclare les routes ; sur Vercel, `api/index.js` exporte l'app.
  - `gemini.js` : `genJSON` (Gemini si `GEMINI_PAID_TIER=true`, sinon Claude directement), `contextPrompt` (marché, langue, profil, mode Études), schémas `S`, `cvForPrompt`.
  - `claude.js` : lettres (Claude, flux NDJSON `/api/letter/stream`), `claudeJSON`. Documents d'études : `DOCS` (lettre, projet, sop, ps).
  - `tasks.js` : toutes les tâches `/api/ai/:task`. `analyzeOffer` envoie un plan numéroté (`slotMap`) et vérifie la place des ajouts (`placeRewrites`).
  - `context.js` : objectif `track` (job | study) de la requête via AsyncLocalStorage, lu par `isStudy()` dans les consignes. Il vient du champ `track` du corps, ajouté par `src/services/api.js` (`setContext`).
  - `live.js` (Gemini Live, jeton éphémère), `research.js` (fiche entreprise ou établissement, recherche web), `jobs.js` (France Travail et Adzuna, sans IA), `programs.js` (Parcoursup, Mon Master, ONISEP, sans IA), `pdf.js` (Chromium, polices de `server/pdf-fonts/`), `security.js` (CSP, en-têtes).
- **Client** (`src/`, React 18 + Vite) :
  - `App.jsx` est un gros composant de classe : tout l'état, la persistance (`persist`, `saveLocal`, Supabase via `services/store.js`) et `renderVals()`, qui construit l'objet `v` passé à tous les écrans.
  - Écrans `src/screens/*.jsx`, fenêtres `src/overlays/`, mise en page `src/layout/` : à l'origine générés depuis le design Claude Design (props `{ v }`, `v.a?.b`, styles en ligne, `ps()` pour les pseudo-classes). Garder ce style dans ces fichiers.
  - Composants récents (plus lisibles) : `src/components/`, `src/screens/interview/`, `src/screens/apps/`, `Jobs.jsx`, `Programs.jsx`.
  - Logique pure : `src/lib/` (cv, ats, templates, oral, jobmatch, markets, scholarships…).
  - Services `src/services/` : modules IIFE qui posent des globales (`window.LisibleAPI`, `CVAI`, `CVAuth`, `CVStore`, `CVExtract`, `NoTics`, `I18N`). Les importer pour leurs effets, comme dans `main.jsx`.
- **Supabase** (eu-central-1) : authentification e-mail et Google, tables avec RLS dans `supabase/*.sql`. Les migrations s'exécutent à la main dans le SQL Editor.
- **PWA** : `public/sw.js` (incrémenter `VERSION` si la stratégie de cache change), `public/manifest.webmanifest`.

## Règles du projet

- **Économiser les crédits d'IA.** Ne lancer des appels Gemini ou Claude en test que s'ils sont indispensables (nouvelle consigne à valider), un ou deux au plus. Préférer :
  - des tests sans IA (logique pure, interface avec état injecté dans `localStorage` sous la clé `cvatspro-state-v3`) ;
  - `--only` et `--tasks` pour l'évaluation. `--tasks=oral` ne fait aucun appel.
  - Signaler dans le compte rendu combien d'appels ont été faits.
- **Pas de tiret cadratin (—) ni demi-cadratin (–)** dans ce que produisent le CV, la lettre et l'IA. Utiliser `noDash` et `dashFree` (`src/lib/cv.js`) et les consignes `STYLE`. Éviter aussi ces tirets dans les textes de l'interface.
- **Rien d'inventé** : les consignes d'IA interdisent les chiffres et faits absents des données ; un manque devient un repère entre crochets `[à compléter]`. Toute nouvelle consigne doit garder cette règle.
- **Traductions** (`src/services/i18n.js`) : la traduction remplace des **nœuds de texte entiers**. Écrire des chaînes complètes dans le JSX (`{study ? 'Phrase A' : 'Phrase B'}`), jamais `'Se renseigner sur l’' + mot`, puis ajouter l'entrée anglaise.
- **Mode Études** : penser aux deux objectifs à chaque fonction (libellés, consignes via `isStudy()`). Le format du CV suit l'objectif (`withTrack`, `reorderFor`).
- **Données personnelles (RGPD)** : rien de tiers dans le navigateur (polices et bibliothèques auto-hébergées, CSP `script-src 'self'`). Une nouvelle source externe implique de mettre à jour la CSP (`server/security.js` **et** `vercel.json`) et `public/confidentialite.html`. Ne jamais envoyer le CV à un service qui n'en a pas besoin (recherche d'offres et de formations : mots-clés seulement).
- **Secrets** : ne jamais afficher, committer ni recopier les valeurs de `.env`. Pour Vercel, envoyer depuis le fichier sans les afficher (`vercel env add NOM production`, valeur sur l'entrée standard).
- **Compatibilité Safari / iPhone** : beaucoup d'utilisateurs sont sur mobile. pdf.js est en version *legacy* avec `src/services/compat.js`, chargé aussi dans `pdf-worker.js`. Toute nouvelle API récente du navigateur se vérifie avant usage.
- **Commits** : messages en français, descriptifs ; pousser sur `main` déploie en production.

## Vérifier un changement

- `npm run build` doit passer.
- Tests navigateur avec `playwright-core` et Chrome installé (`/usr/bin/google-chrome`), scripts dans le dossier temporaire de session, jamais dans le dépôt. L'écran de connexion peut apparaître en retard : cliquer « Continuer sans compte » quand il est visible.
- Export PDF : vérifier les polices (`pdffonts`) et le rendu (`pdftoppm`).
- Après déploiement, refaire les vérifications sans IA sur l'URL de production.
- Réseau local instable vers les API : ajouter `--no-network-family-autoselection --dns-result-order=ipv4first` à `node`.

## Variables d'environnement

`.env` local, mêmes noms sur Vercel : `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_PAID_TIER`, `GEMINI_LIVE`, `GEMINI_LIVE_MODEL`, `ANTHROPIC_API_KEY`, `CLAUDE_MODEL`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `FRANCE_TRAVAIL_CLIENT_ID`, `FRANCE_TRAVAIL_CLIENT_SECRET`, `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `RATE_LIMIT_GUEST`, `RATE_LIMIT_USER`. En local uniquement : `FRANCE_TRAVAIL_MOCK` (réponse enregistrée).

## En suspens (côté propriétaire)

SMTP Resend et URL de redirection dans Supabase, modèles d'e-mail au format `token_hash`, publication de l'écran de consentement Google, migrations `002_rgpd.sql` et `003_interviews.sql`, facturation Gemini (`GEMINI_PAID_TIER=true`, qui active l'entretien vocal), abonnement France Travail « Offres d'emploi », clés Adzuna.
