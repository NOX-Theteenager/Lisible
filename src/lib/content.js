/* Contenus éditoriaux : conseils par section, bibliothèque de formulations, libellés. */
import { dates } from './cv.js';

export const HINTS = {
  contact: 'Toujours dans le corps du document, jamais dans un en-tête.',
  summary: '3 à 4 phrases, sans « je », avec les mots-clés de votre métier.',
  experience: "Ordre antichronologique. Une réalisation = verbe d'action + action + résultat chiffré.",
  education: 'Diplôme, établissement, dates au format MM/AAAA.',
  skills: 'Outils et compétences techniques ; ils apparaîtront séparés par des virgules.',
  languages: "Indiquez un niveau CECRL (A1 à C2) quand c'est possible.",
  projects: 'Projets personnels ou open source pertinents pour le poste visé.',
  certifications: "Intitulé exact, organisme et date d'obtention.",
};
export const TIPS = {
  contact: 'Reprenez l’intitulé exact du poste visé : c’est le premier mot-clé comparé par les ATS.',
  summary: 'Placez vos 3 compétences clés dès la première phrase : c’est souvent la seule lue.',
  experience: 'Visez 3 à 5 réalisations par poste, dont au moins la moitié chiffrées.',
  education: 'Inutile de détailler le lycée au-delà de 3 ans d’expérience.',
  skills: 'Utilisez l’orthographe des offres (« Next.js », pas « NextJS ») pour maximiser la correspondance.',
  languages: 'Un niveau CECRL (B2, C1…) est mieux interprété qu’un adjectif comme « bon ».',
  projects: 'Un projet open source avec un chiffre (étoiles, utilisateurs) vaut une expérience.',
  certifications: 'Indiquez l’intitulé officiel : les ATS recherchent souvent la certification mot pour mot.',
};
export const LIB = {
  Tech: [
    "Réduit le temps de réponse de l'API de 45 % grâce à une stratégie de cache Redis.",
    'Automatisé le déploiement continu (GitHub Actions), passant de 2 à 15 mises en production par semaine.',
    'Conçu une architecture événementielle traitant 2 millions de messages par jour.',
  ],
  Marketing: [
    'Augmenté le trafic organique de 120 % en 12 mois grâce à une stratégie SEO éditoriale.',
    "Piloté un budget d'acquisition de 250 k€ avec un ROAS moyen de 4,2.",
    'Lancé 3 campagnes multicanal générant 1 800 leads qualifiés.',
  ],
  Finance: [
    'Réduit le délai de clôture mensuelle de 8 à 4 jours ouvrés.',
    "Analysé un portefeuille de 120 M€ et identifié 1,5 M€ d'économies.",
    'Mis en place un reporting automatisé pour 6 entités.',
  ],
  Santé: [
    'Coordonné la prise en charge de 25 patients par jour en service de médecine.',
    'Formé 12 soignants au nouveau dossier patient informatisé.',
    "Réduit le temps d'attente aux urgences de 20 % grâce à un nouveau circuit de tri.",
  ],
  Commerce: [
    "Dépassé l'objectif de chiffre d'affaires annuel de 18 % (1,2 M€).",
    'Développé un portefeuille de 45 comptes B2B, dont 12 nouveaux clients.',
    'Négocié des contrats-cadres avec 6 distributeurs nationaux.',
  ],
};
export const VERBS = [
  'Conçu',
  'Développé',
  'Piloté',
  'Optimisé',
  'Réduit',
  'Automatisé',
  'Migré',
  'Encadré',
  'Lancé',
  'Déployé',
  'Amélioré',
  'Industrialisé',
  'Négocié',
  'Coordonné',
];
export const IMPORT_STEPS = [
  'Lecture du fichier',
  'Extraction du texte',
  'Lecture visuelle (images, OCR)',
  'Détection des sections',
  'Analyse de conformité ATS',
];
export const LEVELS_FR = ['Langue maternelle', 'Bilingue (C2)', 'Courant (C1)', 'Avancé (B2)', 'Intermédiaire (B1)', 'Notions (A2)'],
  LEVELS_EN = ['Native', 'Bilingual (C2)', 'Fluent (C1)', 'Advanced (B2)', 'Intermediate (B1)', 'Basic (A2)'];
export const UI_FR = {
  home: 'Accueil',
  editor: 'Éditeur',
  import: 'Importer un CV',
  adapt: 'Adapter à une offre',
  letter: 'Lettre de motivation',
  interview: 'Entretien',
  apps: 'Candidatures',
  versions: 'Versions',
  settings: 'Paramètres',
};
export const UI_EN = {
  home: 'Home',
  editor: 'Editor',
  import: 'Import a resume',
  adapt: 'Tailor to a job',
  letter: 'Cover letter',
  interview: 'Interview prep',
  apps: 'Applications',
  versions: 'Versions',
  settings: 'Settings',
};
export const APP_COLS = [
  ['todo', 'À envoyer'],
  ['sent', 'Envoyée'],
  ['interview', 'Entretien'],
  ['offer', 'Offre'],
  ['rejected', 'Refusée'],
];
