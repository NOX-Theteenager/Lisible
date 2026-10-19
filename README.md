# Lisible

CV conformes aux ATS, adaptés à chaque offre et écrits dans une langue naturelle.


| Fonction | Service |
|---|---|
| Import de CV (PDF, DOCX, image, profil LinkedIn) : extraction, rapport de conformité, conversion | pdf.js / mammoth.js dans le navigateur, puis **Gemini** (lecture du document et de sa mise en page) |
| Analyse d'offre (texte, lien, capture, PDF) : mots-clés, exigences, réécritures ciblées | **Gemini** (+ lecture de la page côté serveur) |
| Suggestions de réalisations, de résumé et de compétences, intégration d'un chiffre, réécriture sans tics | **Gemini** |
| Préparation d'entretien, pitch, profil LinkedIn, traduction anglaise du CV | **Gemini** |
| **Lettre de motivation** (nouvelle ou améliorée, affichée au fil de la rédaction, 1 ou 3 variantes) | **Claude** (`claude-sonnet-5-5`) |
| Simulation d'entretien (questions du recruteur, retour STAR sur chaque réponse, bilan) | **Gemini** (repli Claude) |
| Mémoire du profil (motivations, réussites, contraintes, valeurs) réutilisée dans les lettres et l'entretien | Préférences synchronisées |
| Marché visé : France, Cameroun, Afrique francophone, international (conseils, sites d'offres, rédaction) | Préférences + consignes IA |
| Comptes (e-mail + mot de passe, Google, mot de passe oublié) | **Supabase Auth** |
| Versions de CV, historique, candidatures, préférences, synchronisation entre appareils | **Supabase** (Postgres + RLS) |
| Liens de relecture et commentaires des relecteurs (sans compte) | **Supabase** + page `/r/<jeton>` |
| Exports Word, PDF texte (CV et lettre), TXT, pack ZIP | docx, Chromium (serveur), JSZip |
| Score ATS, détection des tics d'écriture, anonymisation, cohérence du parcours | Règles locales (navigateur) |

Les clés API restent sur le serveur : le navigateur n'appelle que `/api/*`.

**Repli automatique :** si Gemini échoue (quota, saturation, délai de `GEMINI_TIMEOUT_MS` dépassé, réponse illisible), la même demande part aussitôt vers Claude, avec les mêmes consignes, fichiers et schéma de réponse.

**Application installable (PWA) :** manifeste, icônes, raccourcis et service worker. L'interface s'ouvre hors ligne ; les fonctions d'IA et la synchronisation demandent une connexion.

## Installation

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
cp .env.example .env   # puis renseignez les clés
npm start              # http://localhost:3000 (copie aussi les bibliothèques dans public/vendor)
```

### 1. Clés d'IA

- **Gemini** : créez une clé sur https://aistudio.google.com/apikey et mettez-la dans `GEMINI_API_KEY`. Le modèle se règle avec `GEMINI_MODEL` (par défaut `gemini-3.6-flash`).
- **Claude** : créez une clé sur https://console.anthropic.com/settings/keys et mettez-la dans `ANTHROPIC_API_KEY`.

### 2. Supabase

1. Créez un projet sur https://supabase.com.
2. **SQL Editor** → collez le contenu de `supabase/schema.sql` → *Run*, puis celui de `supabase/002_rgpd.sql` (suppression de compte et purges automatiques) → *Run*, puis `supabase/003_interviews.sql` (historique des simulations d'entretien) → *Run*. Sans cette dernière, l'historique reste sur l'appareil.
3. **Project Settings → Data API** : copiez *Project URL* dans `SUPABASE_URL`. **Project Settings → API Keys** : copiez la *Publishable key* (`sb_publishable_…`) dans `SUPABASE_PUBLISHABLE_KEY` (la clé *anon public* de l’onglet *Legacy API keys* fonctionne aussi).
4. **Authentication → URL Configuration** : *Site URL* = l'adresse de l'application (`http://localhost:3000` en local), et ajoutez la même adresse dans *Redirect URLs*.
5. Connexion Google (facultatif) : **Authentication → Providers → Google**, renseignez l'identifiant et le secret OAuth créés dans Google Cloud Console. L'URI de redirection autorisée à déclarer chez Google est `https://<votre-projet>.supabase.co/auth/v1/callback`.
6. En production, configurez un serveur SMTP (**Authentication → Emails**) : l'expéditeur par défaut de Supabase est limité à quelques e-mails par heure.

Sans Supabase, l'application fonctionne en mode invité : tout reste dans le navigateur, et le partage pour relecture est indisponible.

## Organisation

```
index.html            point d'entrée Vite
src/
  main.jsx            démarrage de l'application, enregistrement du service worker
  App.jsx             état, actions et valeurs affichées (logique héritée du design, découpage progressif)
  AppView.jsx         assemblage des écrans
  screens/            un fichier par écran (Home, Editor, Import, Adapt, Letter, Interview, Applications, Settings, Versions)
    editor/           formulaire, aperçu, panneau de score
    interview/        MockInterview : simulation d'entretien
    import/           BeforeAfter : comparaison avant / après
  overlays/           fenêtres (connexion, export, partage, modèles, menu mobile, notifications)
  layout/             barre latérale, en-tête, navigation mobile
  components/         composants partagés (ui, mémoire du profil, options et variantes de lettre, marché)
  lib/                logique pure : cv, ats, templates, content, letters, applications, storage, markets, facts
  services/           API serveur, Supabase, IA, extraction PDF/DOCX, exports, traduction de l'interface
server/
  index.js            Express : API, Vite en développement, dist/ en production
  tasks.js            tâches d'IA (Gemini, repli Claude) dont la simulation d'entretien
  claude.js           lettres de motivation (réponse progressive, variantes) et repli JSON
  gemini.js           client Gemini, contexte (marché, langue, profil), schéma du CV
  pdf.js              PDF texte avec Chromium sans interface ; polices libres dans pdf-fonts/
  fetch-offer.js      lecture des pages d'offres (protection SSRF)
  security.js         en-têtes de sécurité
public/               fichiers statiques (icônes, polices, pages légales, relecture, service worker)
evals/                jeu d'évaluation (10 cas) et référence
design/               fichiers d'origine Claude Design (référence, non déployés)
scripts/              copie des bibliothèques ; migration/ : conversion unique du design en React
```

## Développement

```bash
npm run dev     # http://localhost:3000, rechargement à chaud
npm run build   # construit dist/
npm start       # construit puis sert dist/ comme en production
```

Le PDF est généré par Chromium : en local, Chrome installé est utilisé (ou `CHROME_PATH`) ; sur Vercel, `@sparticuz/chromium`.

## Évaluation de la qualité

`evals/cases.json` contient 10 CV et offres fictifs (France, Cameroun francophone et anglophone, Côte d'Ivoire, Sénégal, Maroc, international). Chaque passage vérifie l'import (faits perdus ou inventés), l'analyse d'offre, les suggestions la lettre (longueur, langue, entreprise citée, chiffres inventés, clichés, repères à compléter), la simulation d'entretien (première question dans la bonne langue ; bilan d'un entretien avec une réponse STAR solide et une réponse creuse : la solide doit être nettement mieux notée, le résultat repéré, aucun chiffre inventé) et l'analyse de l'oral (sans IA), puis compare à `evals/baseline.json`.

```bash
npm run eval -- --provider=claude            # ou gemini, ou sans option (fournisseur actuel)
npm run eval -- --only=cm-comptable-douala   # un ou plusieurs cas
npm run eval -- --tasks=interview,oral       # seulement certaines tâches
npm run eval -- --save-baseline              # enregistre la référence (fusion par cas et par tâche)
```

Lancez-le après chaque changement de consigne ou de modèle (par exemple un nouveau `GEMINI_MODEL`) : une régression fait échouer la commande. Chaque cas coûte 6 appels d'API (lecture du CV, analyse, suggestion, lettre, question et bilan d'entretien). Sur une connexion lente, si Node échoue à joindre les API (« Connection error »), ajoutez `--no-network-family-autoselection --dns-result-order=ipv4first`. Vous pouvez ajouter vos propres CV anonymisés dans `cases.json`.

## Notes

- Les appels IA sont limités par minute (`RATE_LIMIT_GUEST`, `RATE_LIMIT_USER`) ; les utilisateurs connectés sont identifiés par leur jeton Supabase.
- Les consignes envoyées aux modèles interdisent d'inventer des chiffres : quand une donnée manque, un repère `[X %]` est inséré, et l'export du CV reste bloqué tant qu'il en reste.
- Pour la mise en ligne hors Vercel, n'importe quel hébergeur Node convient (Render, Railway, Fly.io, VPS…) : définissez les mêmes variables d'environnement et ajoutez l'URL publique dans Supabase (étape 4).
## Données personnelles et sécurité

- Pages légales : `/confidentialite`, `/conditions`, `/mentions-legales`. Éditeur : NGUETSA STEPHANE (Cameroun) ; données stockées à Francfort (Supabase eu-central-1).
- `GEMINI_PAID_TIER=true` uniquement si la facturation est activée sur la clé Gemini : sur le palier gratuit, Google peut utiliser les contenus pour entraîner ses modèles. Tant que la valeur n'est pas `true`, toutes les demandes d'IA passent par Claude.
- Entretien vocal (Gemini Live, modèle `GEMINI_LIVE_MODEL`, par défaut `gemini-3.8-live`) : proposé automatiquement quand `GEMINI_PAID_TIER=true`. `GEMINI_LIVE=true` l'active sans facturation (la voix et le CV passent alors par l'offre gratuite de Google), `GEMINI_LIVE=false` le coupe. Le navigateur se connecte à Gemini avec un jeton éphémère verrouillé créé par `/api/live/session` : la clé ne quitte jamais le serveur.
- Offres d'emploi (« Offres pour vous ») : `FRANCE_TRAVAIL_CLIENT_ID` et `FRANCE_TRAVAIL_CLIENT_SECRET`, obtenus en créant une application sur [francetravail.io](https://francetravail.io) abonnée à l'API « Offres d'emploi v2 ». Sans ces variables, l'écran affiche les sites d'offres du marché choisi. En local, `FRANCE_TRAVAIL_MOCK=chemin/vers/reponse.json` sert une réponse enregistrée au format de l'API (ignoré sur Vercel).
- Offres internationales (Adzuna, 19 pays : Royaume-Uni, États-Unis, Canada, Belgique, Suisse, Allemagne…) : `ADZUNA_APP_ID` et `ADZUNA_APP_KEY`, obtenus gratuitement sur [developer.adzuna.com](https://developer.adzuna.com). L'API ne renvoie qu'un extrait de chaque annonce ; les réponses sont gardées 10 minutes en mémoire pour ménager le quota.
- Fiche entreprise : recherche web (Google Search via Gemini, sinon recherche web de Claude). Seuls le nom de l'entreprise, le poste et l'offre sont envoyés, donc Gemini est utilisé même sans facturation.
- Aucun service tiers n'est contacté au chargement : polices et bibliothèques (React, pdf.js, mammoth, docx, JSZip, Supabase) sont servies par le site.
- En-têtes de sécurité (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) définis dans `vercel.json` et `server/security.js`.
- Droit à l'effacement : Paramètres → « Supprimer mon compte et mes données » (fonction SQL `delete_my_account`). Portabilité : export JSON complet.
- Conservation : comptes inactifs supprimés après 3 ans, liens de relecture 30 jours après expiration (tâches `pg_cron` quotidiennes).
- `npm audit` signale une vulnérabilité modérée dans `sprintf-js` (dépendance de l'outil en ligne de commande de mammoth) : elle n'est pas présente dans le module navigateur utilisé par Lisible.
