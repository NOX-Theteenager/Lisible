/* Marchés de l'emploi pris en charge : sites d'offres cités, formats de coordonnées et conseils propres. */
export const MARKETS = {
  fr: {
    label: 'France',
    desc: 'France Travail, APEC, Welcome to the Jungle',
    sites: 'LinkedIn, Welcome to the Jungle, Indeed, France Travail, APEC ou site carrière d’entreprise.',
    phone: '06 00 00 00 00',
    city: 'Lyon, France',
    tips: {},
  },
  cm: {
    label: 'Cameroun',
    desc: 'Minajobs, Emploi.cm, offres bilingues',
    sites: 'Minajobs, Emploi.cm, LinkedIn, Jobartis, sites des entreprises, ONG et administrations.',
    phone: '+237 6 00 00 00 00',
    city: 'Douala, Cameroun',
    tips: {
      contact: 'Indiquez votre numéro au format +237 et votre ville ; précisez votre mobilité (Douala, Yaoundé…) si vous êtes prêt·e à bouger.',
      languages: 'Le bilinguisme français-anglais est un vrai atout au Cameroun : indiquez vos deux niveaux (CECRL, TOEIC, TCF ou GCE).',
      summary: 'Placez vos 3 compétences clés dès la première phrase et, si vous êtes bilingue, dites-le dès le résumé.',
      education: 'Précisez l’établissement et la ville ; pour un diplôme obtenu à l’étranger, indiquez le pays.',
    },
  },
  afr: {
    label: 'Afrique francophone',
    desc: 'Côte d’Ivoire, Sénégal, Maroc, Gabon…',
    sites: 'ReKrute, Emploi.ma, Educarriere, Emploi Sénégal, LinkedIn ou site carrière d’entreprise.',
    phone: '+225 07 00 00 00 00',
    city: 'Abidjan, Côte d’Ivoire',
    tips: {
      contact: 'Indiquez l’indicatif international de votre numéro et votre ville ; précisez votre mobilité régionale si elle est réelle.',
      languages: 'Mentionnez toutes vos langues de travail, y compris l’anglais et les langues locales utiles au poste.',
    },
  },
  intl: {
    label: 'International',
    desc: 'Anglophone, sans photo, format « resume »',
    sites: 'LinkedIn, Indeed, Glassdoor or the company careers page.',
    phone: '+44 7700 900000',
    city: 'London, United Kingdom',
    tips: {
      contact: 'Pour un CV international, pas de photo, d’âge ni de situation familiale : nom, ville, e-mail, téléphone et LinkedIn suffisent.',
    },
  },
};

export const marketOf = k => MARKETS[k] || MARKETS.fr;
