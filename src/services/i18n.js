/* Traduction de l'interface FR → EN, appliquée au DOM rendu.
   Les zones marquées data-no-i18n (aperçu du CV, lettre, textes saisis) ne sont jamais traduites.
   window.CVI18N.setLang('fr' | 'en') */
(function () {
  const D = {
    'Lu par les robots, choisi par les humains': 'Read by robots, chosen by humans',
    'Version active': 'Active version',
    Partager: 'Share',
    Anonymiser: 'Anonymize',
    Exporter: 'Export',
    'Conformité ATS garantie': 'ATS compliance guaranteed',
    'Un CV lisible par les robots, et qui donne envie aux humains.': 'A resume robots can read and humans want to read.',
    'Créez, importez ou adaptez votre CV à une offre. Le score ATS se met à jour à chaque frappe.':
      'Create, import or tailor your resume to a job. The ATS score updates as you type.',
    'Créer mon CV': 'Create my resume',
    'Importer un CV existant': 'Import an existing resume',
    'Votre version active': 'Your active version',
    "Ouvrir dans l'éditeur": 'Open in editor',
    'Ouvrir dans l’éditeur': 'Open in editor',
    IA: 'AI',
    'Créer depuis zéro': 'Start from scratch',
    'Un parcours guidé en 8 étapes, avec des suggestions de formulation et un score en direct.':
      'A guided 8-step flow with wording suggestions and a live score.',
    'Commencer →': 'Start →',
    'Importer et optimiser': 'Import and optimize',
    'PDF, DOCX ou photo de votre CV : extraction, rapport de conformité puis conversion.':
      'PDF, DOCX or a photo of your resume: extraction, compliance report, then conversion.',
    'Importer un fichier →': 'Import a file →',
    'Adapter à une offre': 'Tailor to a job',
    'Texte, lien ou capture d’annonce : mots-clés, réécritures ciblées, score avant/après.':
      'Job text, link or screenshot: keywords, targeted rewrites, before/after score.',
    'Analyser une offre →': 'Analyze a job →',
    'Rendre conforme, sans plus': 'Just make it compliant',
    'Structure, titres, police et dates corrigés. Vos formulations restent intactes.':
      'Structure, headings, font and dates fixed. Your wording stays intact.',
    'Convertir mon CV →': 'Convert my resume →',
    'Versions récentes': 'Recent versions',
    'Tout voir': 'See all',
    'Ce que nous garantissons à l’export ATS': 'What we guarantee in ATS exports',
    'Une seule colonne': 'Single column',
    'Titres de sections standards': 'Standard section headings',
    'Aucun tableau ni zone de texte': 'No tables or text boxes',
    'Aucune image ni icône': 'No images or icons',
    'Pas d’en-tête ni de pied de page': 'No header or footer',
    'Dates MM/AAAA': 'MM/YYYY dates',
    'Coordonnées en haut': 'Contact details at the top',
    'Les modèles « Design » (photo, couleurs, colonnes) servent aux envois directs. Le DOCX et le TXT sont toujours générés en version ATS stricte.':
      '“Design” templates (photo, colors, columns) are for direct sending. DOCX and TXT are always generated in strict ATS format.',
    Photo: 'Photo',
    'Photo de profil': 'Profile photo',
    '· optionnelle': '· optional',
    'Affichée uniquement dans les modèles Design. Retirée automatiquement des exports ATS.':
      'Shown only in Design templates. Automatically removed from ATS exports.',
    Retirer: 'Remove',
    Ajouter: 'Add',
    Changer: 'Change',
    'Suggérer une reformulation': 'Suggest a rewrite',
    Proposition: 'Suggestion',
    Remplacer: 'Replace',
    Ignorer: 'Dismiss',
    Supprimer: 'Delete',
    'Intitulé du poste': 'Job title',
    Entreprise: 'Company',
    Ville: 'City',
    'Début (MM/AAAA)': 'Start (MM/YYYY)',
    'Fin (MM/AAAA ou Présent)': 'End (MM/YYYY or Present)',
    'Format de date non standard : utilisez MM/AAAA (ex. 09/2019).': 'Non-standard date format: use MM/YYYY (e.g. 09/2019).',
    Réalisations: 'Achievements',
    "verbe d'action + action + résultat chiffré": 'action verb + action + measurable result',
    Suggérer: 'Suggest',
    "Verbe d'action faible": 'Weak action verb',
    'Résultat non chiffré': 'No measurable result',
    Intégrer: 'Insert',
    'Aucun chiffre n’est inventé : l’IA reformule avec votre réponse.': 'No number is invented: the AI rewrites using your answer.',
    Utiliser: 'Use',
    "Formulation déjà conforme : verbe d'action et résultat chiffré.": 'Already good: action verb and measurable result.',
    'Vérifiez chaque chiffre : il doit refléter un résultat réel. Les crochets [X] sont à compléter.':
      'Check every number: it must reflect a real result. Fill in the [X] brackets.',
    '+ Ajouter une réalisation': '+ Add an achievement',
    '+ Ajouter une expérience': '+ Add an experience',
    'Bibliothèque de formulations': 'Phrase library',
    'Masquer la bibliothèque': 'Hide library',
    Insérer: 'Insert',
    "Verbes d'action — cliquer pour copier": 'Action verbs (click to copy)',
    Diplôme: 'Degree',
    Établissement: 'School',
    Début: 'Start',
    Fin: 'End',
    'Précisions (optionnel)': 'Details (optional)',
    'Supprimer cette formation': 'Delete this entry',
    '+ Ajouter une formation': '+ Add education',
    'Fréquentes pour votre poste :': 'Common for your role:',
    'Langue maternelle': 'Native',
    'Bilingue (C2)': 'Bilingual (C2)',
    'Courant (C1)': 'Fluent (C1)',
    'Avancé (B2)': 'Advanced (B2)',
    'Intermédiaire (B1)': 'Intermediate (B1)',
    'Notions (A2)': 'Basic (A2)',
    '+ Ajouter une langue': '+ Add a language',
    'Nom du projet': 'Project name',
    'Lien (texte brut)': 'Link (plain text)',
    Description: 'Description',
    'Supprimer ce projet': 'Delete this project',
    '+ Ajouter un projet': '+ Add a project',
    '+ Ajouter une certification': '+ Add a certification',
    '← Précédent': '← Back',
    'Terminer et exporter': 'Finish and export',
    Densité: 'Density',
    Aérée: 'Airy',
    'Compacte (1 page)': 'Compact (1 page)',
    Police: 'Font',
    Taille: 'Size',
    Coordonnées: 'Contact',
    'Résumé professionnel': 'Professional summary',
    Résumé: 'Summary',
    'Expérience professionnelle': 'Professional experience',
    Expérience: 'Experience',
    Formation: 'Education',
    Compétences: 'Skills',
    Langues: 'Languages',
    Projets: 'Projects',
    Certifications: 'Certifications',
    "Ce qu'un ATS extrait de votre CV (version stricte). Si l'ordre ou un libellé paraît étrange ici, il le sera aussi pour le recruteur.":
      'What an ATS extracts from your resume (strict version). If the order or a label looks odd here, it will to the recruiter too.',
    'Score ATS': 'ATS score',
    'EN DIRECT': 'LIVE',
    Voir: 'View',
    Résolu: 'Resolved',
    Rouvrir: 'Reopen',
    'Cohérence du parcours': 'Career consistency',
    'À corriger en priorité': 'Fix first',
    'Toutes les règles (12)': 'All rules (12)',
    'Mode conformité seule.': 'Compliance-only mode.',
    'Seuls la structure, les titres, la police et les dates sont corrigés ; vos formulations restent inchangées.':
      'Only structure, headings, font and dates are fixed; your wording is unchanged.',
    'PDF · DOCX · PNG · JPG — 10 Mo max': 'PDF · DOCX · PNG · JPG, 10 MB max',
    'Déposez votre CV ici': 'Drop your resume here',
    'ou cliquez pour choisir un fichier': 'or click to choose a file',
    'Ce qui se passe ensuite': 'What happens next',
    'Extraction du texte (pdf.js pour les PDF, mammoth.js pour les DOCX, OCR pour les images).':
      'Text extraction (pdf.js for PDFs, mammoth.js for DOCX, OCR for images).',
    'Détection des sections, même mal nommées, et des éléments bloquants.':
      'Section detection, even when badly named, and blocking elements.',
    'Rapport de conformité avec score sur 100 et liste des problèmes.': 'Compliance report with a score out of 100 and a list of issues.',
    'Conversion en version ATS, enregistrée comme nouvelle version.': 'Conversion to an ATS version, saved as a new version.',
    'Importer mon profil LinkedIn (PDF)': 'Import my LinkedIn profile (PDF)',
    'Sur LinkedIn : votre profil → « Plus » → « Enregistrer au format PDF ».': 'On LinkedIn: your profile → “More” → “Save to PDF”.',
    "Essayer avec un CV d'exemple": 'Try a sample resume',
    'Changer de fichier': 'Change file',
    'Générer la version conforme': 'Generate the compliant version',
    'Contenu extrait': 'Extracted content',
    'Texte brut tel que lu par un ATS': 'Plain text as an ATS reads it',
    Avant: 'Before',
    'Après conversion': 'After conversion',
    'Informations préservées : 2 expériences, 2 formations, 10 compétences, 2 langues, 1 projet, 1 certification.':
      'Preserved: 2 experiences, 2 degrees, 10 skills, 2 languages, 1 project, 1 certification.',
    'Exporter directement': 'Export now',
    'Importer un autre fichier': 'Import another file',
    'Ce CV risque d’être mal lu par les ATS': 'ATS may misread this resume',
    'Profil LinkedIn lisible, mais pas encore un CV ATS': 'Readable LinkedIn profile, but not an ATS resume yet',
    'D’où vient l’offre ?': 'Where is the job posting from?',
    'Collez le texte, un lien, une capture ou le PDF : l’IA en extrait le contenu.':
      'Paste the text, a link, a screenshot or the PDF: the AI extracts the content.',
    'Analyser la page': 'Analyze page',
    'LinkedIn, Welcome to the Jungle, Indeed, France Travail, APEC ou site carrière d’entreprise.':
      'LinkedIn, Welcome to the Jungle, Indeed, France Travail, APEC or a company careers page.',
    'Déposez une capture d’écran ou une photo de l’annonce': 'Drop a screenshot or a photo of the job ad',
    'L’IA lit l’image (vision + OCR), même une affiche ou une photo prise au téléphone.':
      'The AI reads the image (vision + OCR), even a poster or a phone photo.',
    'Choisir le PDF ou DOCX de l’annonce': 'Choose the job PDF or DOCX',
    'Texte extrait avec pdf.js / mammoth.js, OCR en complément.': 'Text extracted with pdf.js / mammoth.js, OCR as fallback.',
    Texte: 'Text',
    Lien: 'Link',
    Image: 'Image',
    'Offre analysée': 'Analyzed job',
    'Texte de l’offre': 'Job text',
    'Texte extrait par l’IA — vérifiez avant l’analyse': 'Text extracted by the AI: check before analyzing',
    'Version de départ': 'Starting version',
    'Correspondance actuelle': 'Current match',
    Extraction: 'Extraction',
    'des compétences, mots-clés et exigences.': 'of skills, keywords and requirements.',
    Comparaison: 'Comparison',
    'avec votre CV, pondérée par importance.': 'with your resume, weighted by importance.',
    'Réécritures ciblées': 'Targeted rewrites',
    ', à accepter une par une.': ', to accept one by one.',
    'Aucune compétence n’est ajoutée sans votre accord.': 'No skill is added without your approval.',
    "Analyser l'offre": 'Analyze job',
    'Analyse en cours…': 'Analyzing…',
    'Correspondance avant': 'Match before',
    'Après adaptation': 'After tailoring',
    "Modifier l'offre": 'Edit job',
    'Mots-clés extraits': 'Extracted keywords',
    '✓ présent': '✓ present',
    '+ ajouté': '+ added',
    '✕ manquant': '✕ missing',
    'Compétences techniques': 'Technical skills',
    'Compétences transverses': 'Soft skills',
    Domaine: 'Domain',
    'Exigences du poste': 'Job requirements',
    'Compétences manquantes': 'Missing skills',
    'Cochez uniquement celles que vous maîtrisez réellement : elles seront ajoutées à la section Compétences.':
      'Only tick the ones you really master: they will be added to the Skills section.',
    'Réécritures proposées': 'Suggested rewrites',
    'Score ATS après adaptation :': 'ATS score after tailoring:',
    '· la structure reste conforme.': '· the structure stays compliant.',
    'Appliquer à la version actuelle': 'Apply to current version',
    'Créer la version ciblée': 'Create targeted version',
    Accepter: 'Accept',
    '✓ Acceptée': '✓ Accepted',
    'Nouvelle lettre': 'New letter',
    'Améliorer ma lettre': 'Improve my letter',
    'Votre lettre actuelle': 'Your current letter',
    'Importez-la ou collez-la : l’IA la diagnostique et propose une version améliorée.':
      'Import or paste it: the AI reviews it and suggests an improved version.',
    'Importer une lettre existante': 'Import an existing letter',
    'DOCX, PDF, TXT ou photo': 'DOCX, PDF, TXT or photo',
    'Offre visée': 'Target job',
    'La lettre s’appuie sur l’annonce : texte déjà analysé, lien ou image.':
      'The letter builds on the job ad: analyzed text, link or image.',
    'Poste visé': 'Target role',
    Ton: 'Tone',
    Sobre: 'Neutral',
    Enthousiaste: 'Enthusiastic',
    Direct: 'Direct',
    'Basée sur': 'Based on',
    'Générer la lettre': 'Generate letter',
    Régénérer: 'Regenerate',
    'Rédaction…': 'Writing…',
    'Analyser et améliorer': 'Analyze and improve',
    'Ré-analyser': 'Re-analyze',
    'Lettre d’origine': 'Original letter',
    'Version améliorée': 'Improved version',
    'Score d’impact : précision, lien avec l’offre, preuves chiffrées, concision.':
      'Impact score: precision, link to the job, measurable proof, concision.',
    Copier: 'Copy',
    'Exporter .txt': 'Export .txt',
    'Exporter Word': 'Export Word',
    'Votre lettre apparaîtra ici': 'Your letter will appear here',
    'Importez votre lettre': 'Import your letter',
    'Rédaction en cours…': 'Writing…',
    'Choisissez l’offre visée et le ton, puis générez. Vous pourrez tout modifier ensuite.':
      'Choose the target job and tone, then generate. You can edit everything afterwards.',
    'Déposez un fichier ou collez le texte : diagnostic, score d’impact et version réécrite.':
      'Drop a file or paste the text: review, impact score and rewritten version.',
    'L’IA croise votre CV et l’offre.': 'The AI matches your resume with the job.',
    'Préparation pour': 'Preparing for',
    'Questions, pitch et profil LinkedIn': 'Questions, pitch and LinkedIn profile',
    'L’IA croise votre CV et l’offre pour préparer les questions les plus probables, avec une trame STAR pour chaque réponse.':
      'The AI matches your resume with the job to prepare the most likely questions, with a STAR outline for each answer.',
    'Préparer l’entretien': 'Prepare interview',
    'Préparation…': 'Preparing…',
    'Situation · Tâche · Action · Résultat': 'Situation · Task · Action · Result',
    'Pitch de 30 secondes': '30-second pitch',
    'Profil LinkedIn assorti': 'Matching LinkedIn profile',
    'Titre (220 caractères max)': 'Headline (220 characters max)',
    'À propos': 'About',
    Motivation: 'Motivation',
    Technique: 'Technical',
    Comportement: 'Behavioral',
    'Retirer les tics →': 'Remove tics →',
    'Écriture naturelle ✓': 'Natural writing ✓',
    '+ Nouvelle candidature': '+ New application',
    Poste: 'Role',
    'Lien de l’offre (optionnel)': 'Job link (optional)',
    Annuler: 'Cancel',
    'Copier l’e-mail de relance': 'Copy follow-up email',
    'C’est fait': 'Done',
    'À envoyer': 'To send',
    Envoyée: 'Sent',
    Entretien: 'Interview',
    Offre: 'Offer',
    Refusée: 'Rejected',
    'Mots-clés pondérés de chaque annonce': 'Weighted keywords from each posting',
    'Créer une version ciblée': 'Create targeted version',
    candidatures: 'applications',
    envoyées: 'sent',
    'en entretien ou offre': 'in interview or offer',
    'Pas encore envoyée': 'Not sent yet',
    'Adapter le CV': 'Tailor resume',
    'Relancer dans 10 jours': 'Follow up in 10 days',
    'Préparer l’entretien ': 'Prepare interview',
    'Négocier et répondre': 'Negotiate and reply',
    'Demander un retour': 'Ask for feedback',
    Compte: 'Account',
    'Connectez-vous pour retrouver vos CV sur tous vos appareils. Sans compte, tout reste dans ce navigateur.':
      'Sign in to access your resumes on every device. Without an account, everything stays in this browser.',
    'Recevoir un lien de connexion': 'Get a sign-in link',
    'Envoi du lien…': 'Sending link…',
    Déconnexion: 'Sign out',
    Langue: 'Language',
    Accessibilité: 'Accessibility',
    'Raccourcis clavier': 'Keyboard shortcuts',
    'Toute l’interface passe en anglais. Pour candidater à l’international, créez aussi une version anglaise de votre CV : titres de sections, dates et contenu traduits.':
      'The whole interface switches to English. To apply abroad, also create an English version of your resume: section titles, dates and content translated.',
    'Créer la version anglaise du CV': 'Create English resume version',
    'Traduction…': 'Translating…',
    'Étape suivante / précédente (éditeur)': 'Next / previous step (editor)',
    'Annuler / rétablir': 'Undo / redo',
    'Ctrl / ⌘ + Z · Maj + Z': 'Ctrl / ⌘ + Z · Shift + Z',
    'Créer un instantané': 'Create a snapshot',
    'Vos données (RGPD)': 'Your data (GDPR)',
    'Vos CV vous appartiennent. Ils ne servent jamais à entraîner un modèle et vous pouvez tout récupérer ou tout effacer à tout moment.':
      'Your resumes belong to you. They are never used to train a model, and you can download or delete everything at any time.',
    'Télécharger mes données (JSON)': 'Download my data (JSON)',
    'Tout supprimer': 'Delete everything',
    'Confirmer : tout effacer': 'Confirm: erase everything',
    'Où sont traitées vos données ?': 'Where is your data processed?',
    'Extraction de texte, anonymisation, score ATS et détection des tics d’écriture : dans votre navigateur.':
      'Text extraction, anonymization, ATS score and writing-tic detection: in your browser.',
    'Réécritures et analyses d’offres : envoyées au modèle d’IA au moment de la demande, sans conservation.':
      'Rewrites and job analysis: sent to the AI model on request, not stored.',
    'Sauvegarde : ce navigateur, ou votre compte si vous êtes connecté·e (hébergement UE).':
      'Storage: this browser, or your account if signed in (EU hosting).',
    'Nettoyer automatiquement les tics d’écriture': 'Automatically remove writing tics',
    'Retire formules creuses, adverbes-béquilles et connecteurs de remplissage quand vous quittez un champ.':
      'Removes empty phrases, filler adverbs and padding connectors when you leave a field.',
    'Réduire les animations': 'Reduce motion',
    'Supprime transitions et effets de mouvement.': 'Removes transitions and motion effects.',
    'Contraste renforcé': 'Higher contrast',
    'Textes secondaires et bordures plus marqués.': 'Stronger secondary text and borders.',
    'Taille du texte de l’interface': 'Interface text size',
    'Rappels de relance': 'Follow-up reminders',
    'Notification du navigateur quand une candidature envoyée attend une relance depuis 7 jours.':
      'Browser notification when a sent application has waited 7 days for a follow-up.',
    'Ne jamais utiliser mes CV pour entraîner un modèle': 'Never use my resumes to train a model',
    'Toujours actif, non désactivable.': 'Always on, cannot be disabled.',
    'Anonymiser les exports par défaut': 'Anonymize exports by default',
    'Nom, coordonnées, entreprises et photo masqués à chaque export.': 'Name, contact details, companies and photo hidden in every export.',
    'Nouveau CV': 'New resume',
    '+ Nouvelle version vierge': '+ New blank version',
    Ouvrir: 'Open',
    Renommer: 'Rename',
    Dupliquer: 'Duplicate',
    Historique: 'History',
    Restaurer: 'Restore',
    'Choisir une version…': 'Choose a version…',
    'Choisissez une version pour voir les lignes ajoutées, retirées et inchangées.':
      'Choose a version to see added, removed and unchanged lines.',
    Général: 'General',
    Ciblé: 'Targeted',
    Importé: 'Imported',
    'Choisir un modèle': 'Choose a template',
    'Le contenu est conservé à l’identique : seule la mise en forme change.': 'Content stays the same: only the layout changes.',
    'ATS strict': 'Strict ATS',
    'Une colonne, sans photo : idéal pour les candidatures en ligne.': 'Single column, no photo: ideal for online applications.',
    'Design · avec photo': 'Design · with photo',
    'Pour les envois directs, salons et réseaux. Version ATS générée en parallèle à l’export.':
      'For direct sending, fairs and networking. An ATS version is generated alongside on export.',
    'Sobre et universel, titres soulignés': 'Plain and universal, underlined headings',
    'Moderne, avec une touche de couleur': 'Modern, with a touch of color',
    'Classique centré, petites capitales': 'Centered classic, small caps',
    'Bandeau couleur et photo ronde': 'Color banner and round photo',
    'Colonne latérale, photo et compétences en pastilles': 'Sidebar, photo and skill chips',
    'Éditorial, frise des dates en marge': 'Editorial, dates in the margin',
    'ATS 100 %': 'ATS 100%',
    'ATS partiel': 'Partial ATS',
    'Non ATS': 'Not ATS',
    Classique: 'Classic',
    Épure: 'Clean',
    Académique: 'Academic',
    'Partager pour relecture': 'Share for review',
    'Droits du relecteur': 'Reviewer rights',
    'Lecture seule': 'Read only',
    Commentaires: 'Comments',
    'Expiration du lien': 'Link expiry',
    '7 jours': '7 days',
    '30 jours': '30 days',
    'Masquer mes coordonnées et mes employeurs': 'Hide my contact details and employers',
    'Créer le lien': 'Create link',
    'Révoquer le lien': 'Revoke link',
    'Exporter le CV': 'Export resume',
    'Recommandé ATS': 'ATS recommended',
    'Nom du fichier': 'File name',
    'Anonymiser (nom, coordonnées, entreprises et établissements masqués)':
      'Anonymize (name, contact details, companies and schools hidden)',
    'Ces repères doivent être remplacés par vos vrais chiffres avant l’envoi.':
      'Replace these markers with your real numbers before sending.',
    'Pack candidature (.zip)': 'Application pack (.zip)',
    Télécharger: 'Download',
    'Word (.docx)': 'Word (.docx)',
    'PDF texte': 'Text PDF',
    'Texte brut (.txt)': 'Plain text (.txt)',
    'Format le mieux lu par les ATS. Texte réel, styles de titres, aucune zone de texte.':
      'The format ATS read best. Real text, heading styles, no text boxes.',
    'Texte sélectionnable (pas d’image). À utiliser si l’offre demande un PDF.':
      'Selectable text (not an image). Use it if the job asks for a PDF.',
    'Pour les formulaires en ligne qui demandent un copier-coller.': 'For online forms that ask you to paste text.',
    'Aucune règle bloquante': 'No blocking rule',
    'Anonymisation active': 'Anonymization on',
    'Coordonnées dans le corps du document': 'Contact details in the document body',
    Plus: 'More',
    'Ouvrir le menu': 'Open menu',
    'Fermer le menu': 'Close menu',
    Fermer: 'Close',
    'Navigation principale': 'Main navigation',
    Rétablir: 'Redo',
    'Annuler (Ctrl/⌘ + Z)': 'Undo (Ctrl/⌘ + Z)',
    'Rétablir (Ctrl/⌘ + Maj + Z)': 'Redo (Ctrl/⌘ + Shift + Z)',
    'Supprimer la ligne': 'Delete line',
    'Ajouter une compétence puis Entrée': 'Add a skill then press Enter',
    'Intitulé exact': 'Exact title',
    Organisme: 'Issuer',
    'MM/AAAA': 'MM/YYYY',
    "Collez ici le texte complet de l'annonce…": 'Paste the full job ad here…',
    '…ou collez le texte de votre lettre ici': '…or paste your letter text here',
    "Capture de l'offre": 'Job screenshot',
    Accueil: 'Home',
    Éditeur: 'Editor',
    'Importer un CV': 'Import a resume',
    'Lettre de motivation': 'Cover letter',
    Candidatures: 'Applications',
    Versions: 'Versions',
    Paramètres: 'Settings',
    Lettre: 'Letter',
    'Créez, importez ou adaptez un CV conforme aux ATS': 'Create, import or tailor an ATS-compliant resume',
    'Parcours guidé, aperçu et score de conformité en direct': 'Guided flow, live preview and compliance score',
    'Extraction, rapport de conformité et conversion': 'Extraction, compliance report and conversion',
    'Mise en conformité': 'Make compliant',
    'Texte, lien, image ou PDF : l’IA compare l’annonce à votre CV': 'Text, link, image or PDF: the AI compares the job to your resume',
    'Rédigez-en une nouvelle ou améliorez la vôtre, à partir de l’offre visée': 'Write a new one or improve yours, based on the target job',
    'Sauvegarde, duplication, renommage et historique': 'Saving, duplicating, renaming and history',
    'Questions probables, réponses STAR, pitch de 30 secondes et profil LinkedIn':
      'Likely questions, STAR answers, 30-second pitch and LinkedIn profile',
    'Suivez chaque candidature et comparez votre CV à plusieurs offres':
      'Track every application and compare your resume against several jobs',
    'Compte, langue, données personnelles et accessibilité': 'Account, language, personal data and accessibility',
    Rédiger: 'Write',
    Aperçu: 'Preview',
    'Côte à côte': 'Side by side',
    'Vue ATS': 'ATS view',
    Excellent: 'Excellent',
    Bon: 'Good',
    'À améliorer': 'Needs work',
    'Risque élevé': 'High risk',
    'Passer en mode sombre': 'Switch to dark mode',
    'Passer en mode clair': 'Switch to light mode',
    Anonymisé: 'Anonymized',
    'Coordonnées complètes en haut': 'Complete contact details at the top',
    'Intitulé de poste visé': 'Target job title',
    'Résumé de 35 à 90 mots': 'Summary of 35 to 90 words',
    'Style impersonnel (sans « je »)': 'Impersonal style (no “I”)',
    "Réalisations introduites par un verbe d'action": 'Achievements start with an action verb',
    'Résultats chiffrés': 'Measurable results',
    'Dates au format MM/AAAA': 'Dates in MM/YYYY format',
    'Au moins 8 compétences': 'At least 8 skills',
    'Longueur adaptée (250 à 800 mots)': 'Right length (250 to 800 words)',
    'Une colonne, sans tableau, image ni icône': 'Single column, no tables, images or icons',
    'Police standard': 'Standard font',
    'Nom, e-mail, téléphone et ville présents': 'Name, email, phone and city present',
    'Ajoutez un titre clair sous votre nom': 'Add a clear title under your name',
    'Commencez vos phrases par un nom ou un verbe': 'Start sentences with a noun or a verb',
    'Aucun pronom personnel détecté': 'No personal pronoun found',
    'Format cohérent partout': 'Consistent format everywhere',
    'Libellés reconnus par les ATS': 'Labels recognized by ATS',
    'Garanti par le modèle': 'Guaranteed by the template',
    'Une colonne, aucun élément graphique': 'Single column, no graphics',
    'Une colonne, couleur sur le texte uniquement': 'Single column, color on text only',
    'Une colonne, police serif standard': 'Single column, standard serif font',
    'Bandeau et photo : la photo est ignorée par les ATS': 'Banner and photo: ATS ignore the photo',
    'Deux colonnes : ordre de lecture incertain pour un ATS': 'Two columns: uncertain reading order for ATS',
    'Dates en marge et photo : à réserver aux envois directs': 'Margin dates and photo: keep for direct sending',
    'Toujours dans le corps du document, jamais dans un en-tête.': 'Always in the document body, never in a header.',
    '3 à 4 phrases, sans « je », avec les mots-clés de votre métier.': '3 to 4 sentences, no “I”, with your field’s keywords.',
    "Ordre antichronologique. Une réalisation = verbe d'action + action + résultat chiffré.":
      'Reverse chronological order. One achievement = action verb + action + measurable result.',
    'Diplôme, établissement, dates au format MM/AAAA.': 'Degree, school, dates in MM/YYYY format.',
    'Outils et compétences techniques ; ils apparaîtront séparés par des virgules.':
      'Tools and technical skills; they will appear comma-separated.',
    "Indiquez un niveau CECRL (A1 à C2) quand c'est possible.": 'Give a CEFR level (A1 to C2) when possible.',
    'Projets personnels ou open source pertinents pour le poste visé.': 'Personal or open-source projects relevant to the target job.',
    "Intitulé exact, organisme et date d'obtention.": 'Exact title, issuer and date obtained.',
    'Reprenez l’intitulé exact du poste visé : c’est le premier mot-clé comparé par les ATS.':
      'Reuse the exact target job title: it is the first keyword ATS compare.',
    'Placez vos 3 compétences clés dès la première phrase : c’est souvent la seule lue.':
      'Put your 3 key skills in the first sentence: it is often the only one read.',
    'Visez 3 à 5 réalisations par poste, dont au moins la moitié chiffrées.':
      'Aim for 3 to 5 achievements per role, at least half with numbers.',
    'Inutile de détailler le lycée au-delà de 3 ans d’expérience.': 'No need to detail high school after 3 years of experience.',
    'Utilisez l’orthographe des offres (« Next.js », pas « NextJS ») pour maximiser la correspondance.':
      'Use the spelling from job ads (“Next.js”, not “NextJS”) to maximize matching.',
    'Un niveau CECRL (B2, C1…) est mieux interprété qu’un adjectif comme « bon ».':
      'A CEFR level (B2, C1…) is better understood than an adjective like “good”.',
    'Un projet open source avec un chiffre (étoiles, utilisateurs) vaut une expérience.':
      'An open-source project with a number (stars, users) counts as experience.',
    'Indiquez l’intitulé officiel : les ATS recherchent souvent la certification mot pour mot.':
      'Use the official title: ATS often search for the certification word for word.',
    Bloquant: 'Blocking',
    Important: 'Major',
    Mineur: 'Minor',
    'Lecture du fichier': 'Reading file',
    'Extraction du texte': 'Extracting text',
    'OCR des zones image': 'OCR on image areas',
    'Détection des sections': 'Detecting sections',
    'Analyse de conformité ATS': 'ATS compliance analysis',
    'Période sans activité': 'Employment gap',
    'Postes qui se chevauchent': 'Overlapping roles',
    'Dates inversées': 'Reversed dates',
    'Intitulé différent de l’offre': 'Title differs from the job',
    "5 ans d'expérience minimum": '5 years of experience minimum',
    'Anglais professionnel': 'Professional English',
    'Basé à Lyon (hybride)': 'Based in Lyon (hybrid)',
    '6 ans détectés': '6 years found',
    'Une section à la fois': 'One section at a time',
    'Modifié à l’instant': 'Updated just now',
    'Aperçu en direct': 'Live preview',
    'Section en cours': 'Current section',
    Étape: 'Step',
    'Lu par les robots, choisi par les humains.': 'Read by robots, chosen by humans.',
    'Des CV conformes aux ATS, adaptés à chaque offre et écrits dans une langue naturelle.':
      'ATS-compliant resumes, tailored to each job and written in natural language.',
    'Score ATS en direct': 'Live ATS score',
    'Adaptation à une offre': 'Job tailoring',
    'Export Word, PDF, TXT': 'Word, PDF, TXT export',
    'Bon retour': 'Welcome back',
    'Créer votre compte': 'Create your account',
    'Connexion avec Google': 'Sign in with Google',
    'Mot de passe oublié': 'Forgot password',
    'Connectez-vous pour retrouver vos CV.': 'Sign in to get your resumes back.',
    'Gratuit. Vos CV restent privés.': 'Free. Your resumes stay private.',
    'Choisissez le compte à utiliser.': 'Choose the account to use.',
    'Recevez un lien pour en choisir un nouveau.': 'Get a link to choose a new one.',
    'Continuer avec Google': 'Continue with Google',
    'ou avec votre e-mail': 'or with your email',
    'Prénom et nom': 'Full name',
    'Adresse e-mail': 'Email address',
    'Mot de passe': 'Password',
    'Mot de passe oublié ?': 'Forgot password?',
    Afficher: 'Show',
    Masquer: 'Hide',
    'Se connecter': 'Sign in',
    'Créer mon compte': 'Create my account',
    'Créer un compte': 'Create an account',
    'Un instant…': 'One moment…',
    'Pas encore de compte ?': 'No account yet?',
    'Déjà inscrit·e ?': 'Already registered?',
    Suivant: 'Next',
    '← Retour': '← Back',
    '← Retour à la connexion': '← Back to sign in',
    'Adresse e-mail du compte': 'Account email address',
    'Envoyer le lien': 'Send link',
    'Envoi…': 'Sending…',
    'Continuer sans compte': 'Continue without an account',
    'Choisissez un compte Google pour continuer vers': 'Choose a Google account to continue to',
    'Utiliser un autre compte': 'Use another account',
    'Sans compte, vos CV restent dans ce navigateur. En vous inscrivant, vous acceptez les conditions d’utilisation et la politique de confidentialité.':
      'Without an account, your resumes stay in this browser. By signing up, you accept the terms of use and privacy policy.',
    'Adresse e-mail invalide.': 'Invalid email address.',
    'Saisissez votre mot de passe.': 'Enter your password.',
    'Le mot de passe doit faire au moins 8 caractères, dont un chiffre.': 'Password must be at least 8 characters, including a number.',
    'Mot de passe incorrect.': 'Incorrect password.',
    'Aucun compte avec cette adresse. Créez-en un.': 'No account with this email. Create one.',
    'Un compte existe déjà avec cette adresse.': 'An account already exists with this email.',
    '8 caractères minimum, dont un chiffre': '8 characters minimum, including a number',
    'Connecté·e avec Google': 'Signed in with Google',
    'Connecté·e par e-mail': 'Signed in with email',
    'Changer de mot de passe': 'Change password',
    'Comme le CV': 'Same as resume',
    'Intitulé du poste visé': 'Target job title',
    'Nom complet': 'Full name',
    'E-mail': 'Email',
    Téléphone: 'Phone',
    'GitHub / Portfolio': 'GitHub / Portfolio',
    LinkedIn: 'LinkedIn',
    sur: 'of',
    'Modèle :': 'Template:',
    '/12 règles respectées': '/12 rules met',
    'Correspondance de «': 'How “',
    '» avec chaque offre': '” matches each job',
    'À partir de': 'From',
    'et de l’offre analysée': 'and the analyzed job',
    'English (bêta)': 'English',
    'Commentaires de relecture (': 'Review comments (',
    'Problèmes détectés (': 'Issues found (',
    'Mes versions (': 'My versions (',
    'Questions probables (': 'Likely questions (',
    'Score humain': 'Human score',
    'Comparer «': 'Compare “',
    '» avec': '” with',
    'Synchronisé ·': 'Synced ·',
    'versions,': 'versions,',
    candidatures: 'applications',
    'Version active · score': 'Active version · score',
    '· modifiée': '· edited',
    modifiée: 'edited',
    instantanés: 'snapshots',
    'Insertion dans :': 'Inserting into:',
    'Manque :': 'Missing:',
    ajoutées: 'added',
    retirées: 'removed',
    identiques: 'unchanged',
    'Un proche ou un mentor lit «': 'A friend or mentor reads “',
    '» sans créer de compte.': '” without creating an account.',
    'Score ATS après adaptation :': 'ATS score after tailoring:',
    '· score': '· score',
    '— le DOCX et le TXT seront générés en version ATS stricte.': '— DOCX and TXT will be generated in strict ATS format.',
    'Modèle Design «': 'Design template “',
    '» : le PDF reprend le design et la photo ; le Word et le TXT sont générés en version ATS stricte.':
      '”: the PDF keeps the design and photo; Word and TXT are generated in strict ATS format.',
    'Basée sur': 'Based on',
    'Correspondance actuelle': 'Current match',
    'Score ATS': 'ATS score',
    'Enregistré ·': 'Saved ·',
  };
  const R = [
    [/^Étape (\d+) sur (\d+)$/, 'Step $1 of $2'],
    [/^(\d+)\/12 règles respectées$/, '$1/12 rules met'],
    [/^(\d+)\/(\d+) sections complétées$/, '$1/$2 sections complete'],
    [/^Suivant : (.+) →$/, (m, a) => 'Next: ' + (D[a] || a) + ' →'],
    [/^Enregistré · (.+)$/, (m, a) => 'Saved · ' + rel(a)],
    [/^(.+) · modifiée (.+)$/, (m, a, b) => (D[a] || a) + ' · edited ' + rel(b)],
    [/^modifiée (.+) · (\d+) instantanés$/, (m, a, b) => 'edited ' + rel(a) + ' · ' + b + ' snapshots'],
    [/^Modèle : (.+)$/, (m, a) => 'Template: ' + (D[a] || a)],
    [/^Score (\d+)$/, 'Score $1'],
    [/^(\d+) relances? dues?$/, (m, n) => n + ' follow-up' + (n > 1 ? 's' : '') + ' due'],
    [/^Relance due · envoyée il y a (\d+) jours$/, 'Follow-up due · sent $1 days ago'],
    [/^Envoyée le (.+) · (.+)$/, 'Sent on $1 · $2'],
    [/^Pas encore envoyée · (.+)$/, 'Not sent yet · $1'],
    [/^1 page A4 ✓$/, '1 A4 page ✓'],
    [/^(\d+) pages A4( · essayez Compacte)?$/, (m, n, c) => n + ' A4 pages' + (c ? ' · try Compact' : '')],
    [/^Page (\d+)$/, 'Page $1'],
    [/^(\d+) repère\(s\) à compléter : export bloqué$/, '$1 marker(s) to fill in: export blocked'],
    [/^(\d+) repère\(s\) à compléter$/, '$1 marker(s) to fill in'],
    [/^Commentaires de relecture \((\d+)\)$/, 'Review comments ($1)'],
    [/^Problèmes détectés \((\d+)\)$/, 'Issues found ($1)'],
    [/^Mes versions \((\d+)\)$/, 'My versions ($1)'],
    [/^Questions probables \((\d+)\)$/, 'Likely questions ($1)'],
    [/^Score humain (\d+)\/50$/, 'Human score $1/50'],
    [/^(\d+) mots · ≈ (\d+) s à l’oral$/, '$1 words · ≈ $2 s spoken'],
    [/^(\d+) mots · idéal 35–90( · contient « je »)?$/, (m, n, j) => n + ' words · ideal 35–90' + (j ? ' · contains “je”' : '')],
    [/^(\d+) compétences · 8 minimum recommandées$/, '$1 skills · 8 minimum recommended'],
    [/^(\d+) mots$/, '$1 words'],
    [/^(\d+) poste\(s\)$/, '$1 role(s)'],
    [/^(\d+) compétences$/, '$1 skills'],
    [/^(\d+) tics? d’écriture · corriger$/, (m, n) => n + ' writing tic' + (n > 1 ? 's' : '') + ' · fix'],
    [/^« (.+) » · corriger$/, '“$1” · fix'],
    [/^Manque : (.+)$/, (m, a) => 'Missing: ' + (a === 'rien' ? 'nothing' : a)],
    [/^Synchronisé · (\d+) versions, (\d+) candidatures$/, 'Synced · $1 versions, $2 applications'],
    [/^Version active · score (\d+)$/, 'Active version · score $1'],
    [/^Comparer « (.+) » avec$/, 'Compare “$1” with'],
    [/^Correspondance de « (.+) » avec chaque offre$/, 'How “$1” matches each job'],
    [/^À partir de (.+) et de l’offre analysée$/, 'From $1 and the analyzed job'],
    [/^Un proche ou un mentor lit « (.+) » sans créer de compte\.$/, 'A friend or mentor reads “$1” without creating an account.'],
    [/^\+ (\d+) ajoutées$/, '+ $1 added'],
    [/^− (\d+) retirées$/, '− $1 removed'],
    [/^(\d+) identiques$/, '$1 unchanged'],
    [/^(\d+) → (\d+) mots-clés couverts sur (\d+)$/, '$1 → $2 keywords covered out of $3'],
    [/^(\d+)\/(\d+) acceptées$/, '$1/$2 accepted'],
    [/^Insertion dans : (.+)$/, 'Inserting into: $1'],
    [/^Période sans activité de (\d+) mois$/, '$1-month employment gap'],
    [/^(\d+) mots · (\d+) caractères$/, '$1 words · $2 characters'],
    [/^Score ATS : (\d+)\/100$/, 'ATS score: $1/100'],
    [/^(\d+) règle\(s\) non respectée\(s\)$/, '$1 rule(s) not met'],
    [/^Une colonne · police (.+) · sans en-tête ni pied de page$/, 'Single column · $1 font · no header or footer'],
    [/^(\d+) lignes contiennent un chiffre$/, '$1 lines contain a number'],
    [/^(\d+\/\d+) lignes contiennent un chiffre$/, '$1 lines contain a number'],
    [/^(\d+\/\d+) lignes$/, '$1 lines'],
    [/^(\d+) mots$/, '$1 words'],
    [/^Aujourd’hui|^aujourd'hui, (.+)$/, (m, a) => 'today, ' + a],
    [/^il y a (\d+) min$/, '$1 min ago'],
    [/^à l'instant$/, 'just now'],
    [
      /^(Trop faible|Faible|Correct|Solide|Très solide) · 8 caractères min\., dont un chiffre$/,
      (m, a) =>
        ({ 'Trop faible': 'Too weak', Faible: 'Weak', Correct: 'Fair', Solide: 'Strong', 'Très solide': 'Very strong' })[a] +
        ' · 8 characters min., including a number',
    ],
    [/^synchronisé · (\d+) versions$/, 'synced · $1 versions'],
    [/^aujourd'hui, (.+)$/, 'today, $1'],
  ];
  function rel(s) {
    if (s === "à l'instant") return 'just now';
    if (/^\d{2}\/\d{2}\/\d{4}, /.test(s)) return s;
    let m = /^il y a (\d+) min$/.exec(s);
    if (m) return m[1] + ' min ago';
    m = /^aujourd'hui, (.+)$/.exec(s);
    if (m) return 'today, ' + m[1];
    return s;
  }
  function tr(s) {
    const k = s.trim();
    if (!k) return null;
    if (D[k]) return s.replace(k, D[k]);
    for (const [re, to] of R) {
      if (re.test(k)) return s.replace(k, k.replace(re, to));
    }
    return null;
  }
  let lang = 'fr',
    obs = null,
    busy = false;
  const orig = new WeakMap(),
    done = new WeakMap(),
    ATTRS = ['placeholder', 'title', 'aria-label'];
  const skip = (n) => {
    const el = n.nodeType === 1 ? n : n.parentElement;
    return !el || !!el.closest('[data-no-i18n],textarea,script,style');
  };
  function doText(n) {
    if (skip(n)) return;
    const cur = n.nodeValue;
    if (done.get(n) === cur) return;
    orig.set(n, cur);
    const t = tr(cur);
    if (t != null && t !== cur) {
      done.set(n, t);
      n.nodeValue = t;
    } else done.set(n, cur);
  }
  function doAttrs(el) {
    if (skip(el)) return;
    ATTRS.forEach((a) => {
      const v = el.getAttribute(a);
      if (!v) return;
      const key = 'i18n-' + a;
      if (el.dataset[key.replace(/-(\w)/g, (m, c) => c.toUpperCase())] === v) return;
      const t = tr(v);
      if (t && t !== v) {
        el.setAttribute('data-i18n-o' + a, v);
        el.dataset[key.replace(/-(\w)/g, (m, c) => c.toUpperCase())] = t;
        el.setAttribute(a, t);
      }
    });
  }
  function walk(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n = root;
    while (n) {
      if (n.nodeType === 3) doText(n);
      else if (n.nodeType === 1) doAttrs(n);
      n = w.nextNode();
    }
  }
  function restore(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n = w.nextNode();
    while (n) {
      if (n.nodeType === 3) {
        const o = orig.get(n);
        if (o != null && done.get(n) === n.nodeValue && o !== n.nodeValue) n.nodeValue = o;
        done.delete(n);
      } else
        ATTRS.forEach((a) => {
          const o = n.getAttribute('data-i18n-o' + a);
          if (o != null) {
            n.setAttribute(a, o);
            n.removeAttribute('data-i18n-o' + a);
          }
        });
      n = w.nextNode();
    }
  }
  function onMut(ms) {
    if (busy || lang !== 'en') return;
    busy = true;
    try {
      for (const m of ms) {
        if (m.type === 'characterData') doText(m.target);
        else if (m.type === 'attributes') doAttrs(m.target);
        else
          m.addedNodes.forEach((n) => {
            if (n.nodeType === 3) doText(n);
            else if (n.nodeType === 1) walk(n);
          });
      }
    } finally {
      busy = false;
    }
  }
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'fr';
    document.documentElement.lang = lang;
    if (lang === 'en') {
      if (!obs) {
        obs = new MutationObserver(onMut);
        obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
      }
      busy = true;
      try {
        walk(document.body);
      } finally {
        busy = false;
      }
    } else {
      if (obs) {
        obs.disconnect();
        obs = null;
      }
      restore(document.body);
    }
  }
  window.CVI18N = { setLang, t: (s) => (lang === 'en' ? tr(s) || s : s) };
})();
