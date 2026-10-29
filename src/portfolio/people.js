// Contenu des 3 portfolios de l'équipe. Même forme que demo/src/lib/data.ts.
// Tout ce qui est marqué [À REMPLIR] est un placeholder à remplacer par les vraies infos.
// Les images (/portfolio/...) sont celles du template de démo, à remplacer aussi.

const img = p => '/portfolio/' + p;
const TODO = '[À REMPLIR]';

const socials = [
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: img('social/linkedin.svg') },
  { label: 'Instagram', href: 'https://instagram.com', icon: img('social/instagram.svg') },
  { label: 'X (Twitter)', href: 'https://x.com', icon: img('social/twitter.svg') },
  { label: 'Facebook', href: 'https://facebook.com', icon: img('social/facebook.svg') },
];

const clients = [1, 2, 3, 4, 5, 6].map(i => ({ name: `Client ${i} ${TODO}`, image: img(`clients/client-${i}.webp`) }));

const testimonials = [1, 5, 3, 4, 2].map((a, i) => ({
  name: `Prénom Nom ${i + 1}`,
  role: `Poste, Entreprise ${TODO}`,
  quote: `${TODO} Témoignage d'un client : le contexte du projet, ce qui a été livré et le résultat obtenu, en deux ou trois phrases.`,
  avatar: img(`avatars/avatar-0${a}.webp`),
}));

const awards = [
  { title: `Certification ou distinction ${TODO}`, meta: '2026 — ORGANISME' },
  { title: `Hackathon / concours ${TODO}`, meta: '2025 — ÉVÉNEMENT' },
  { title: `Publication ou conférence ${TODO}`, meta: '2025 — LIEU' },
  { title: `Projet remarqué ${TODO}`, meta: '2024 — CONTEXTE' },
];

function person({ id, tone, first, role, headline, meta, services, statement, cards, projects, personality }) {
  return {
    id, tone, personality,
    site: {
      name: `${first} ${TODO}`,
      first,
      role,
      email: `${id}@atlasflow.ma`,
      phone: '+212 6 00 00 00 00',
      location: 'Settat · Casablanca, Maroc',
      heroHeadline: headline,
      heroMeta: meta,
      ctaLabel: 'Me contacter',
    },
    projects: projects.map(([title, tags], i) => ({ id: `${id}-p${i}`, title: `${title} ${TODO}`, tags, image: img(`work/work-0${i + 1}.webp`) })),
    workHeading: 'Projets sélectionnés',
    workWithMe: { heading: 'Pourquoi travailler avec moi ?', sub: `${role} — au sein d'Atlas Flow`, cards },
    services,
    servicesHeading: 'Ce que je construis\npour vos équipes',
    servicesStatement: `${TODO} ${statement}`,
    awardsHeading: 'Distinctions et\nreconnaissance',
    awards,
    clientsHeading: 'Ils nous ont fait confiance, au Maroc et à l\'international.',
    clients,
    testimonialsHeading: 'Ne nous croyez pas sur parole, écoutez nos clients',
    testimonials,
    faqHeading: 'Questions fréquentes',
    faqs: [
      { q: `Qui est ${first} et sur quels projets intervient-il ?`, a: `${TODO} Courte bio : parcours, spécialités, ce qui le distingue. ${first} fait partie de l'équipe Atlas Flow (${role}).` },
      { q: 'En combien de temps un projet peut-il être livré ?', a: `${TODO} Délais types : un premier livrable en quelques jours, un projet complet en quelques semaines selon le périmètre.` },
      { q: 'Travaillez-vous avec nos outils existants ?', a: `${TODO} Oui : intégration avec vos outils, vos données et vos processus actuels plutôt qu'une refonte complète.` },
      { q: 'Comment se déroule la collaboration ?', a: 'Comme tous les projets Atlas Flow : écouter, concevoir, construire par étapes avec des démonstrations régulières, puis accompagner après le lancement.' },
      { q: 'Comment vous contacter ?', a: `${TODO} Par e-mail, WhatsApp ou via le formulaire de contact de cette page.` },
    ],
    footerHeadline: 'Prêt à donner vie à votre projet ?',
    socials,
  };
}

export const PEOPLE = {
  aziz: person({
    id: 'aziz', tone: 'noir', first: 'Aziz', role: 'Chatbots & agents IA',
    headline: 'Des agents IA qui travaillent pour vous',
    meta: [{ lines: ['Chatbots & agents IA'] }, { lines: ['Atlas Flow', 'Maroc'] }],
    statement: 'Des assistants qui répondent jour et nuit sur WhatsApp, le web et les réseaux sociaux, en darija, arabe, français et anglais, connectés aux documents de l\'entreprise.',
    services: [
      { title: 'Chatbots sur mesure', items: ['WhatsApp', 'Site web', 'Messenger', 'Instagram'] },
      { title: 'Agents IA', items: ['LangGraph', 'CrewAI', 'Outils & API', 'Multi-agents'] },
      { title: 'RAG & connaissance', items: ['Documents internes', 'Vector DB', 'Recherche', 'Sources citées'] },
      { title: 'Automatisation', items: ['Qualification de leads', 'Support client', 'Relances', 'CRM'] },
      { title: 'Intégration', items: ['OpenAI', 'Claude', 'Rasa', 'Botpress'] },
    ],
    cards: [
      { icon: 'rocket', title: 'Mise en ligne rapide', body: `${TODO} Un premier assistant opérationnel en quelques jours, testé sur vos vraies questions.` },
      { icon: 'sparkles', title: 'Multilingue', body: 'Darija, arabe, français et anglais : vos clients sont servis dans la langue qu\'ils utilisent.' },
      { icon: 'zap', title: 'Connecté à vos outils', body: 'CRM, Google Sheets, e-mail, API : l\'agent agit, il ne se contente pas de répondre.' },
    ],
    // Éditorial / luxe : serif géant, révélations lentes, grain, projecteur au curseur.
    personality: { key: 'editorial', shape: 'bust', tag: 'Lead — Atlas Flow', reveal: { duration: 1.7, stagger: 0.12, ease: 'expo.out', from: 120 } },
    projects: [['Agent support WhatsApp', ['Chatbot', 'WhatsApp']], ['Assistant RAG documentaire', ['RAG', 'Documents']], ['Qualification de leads', ['Agents IA', 'CRM']], ['Traitement de documents', ['Multi-agents', 'Extraction']]],
  }),
  ammar: person({
    id: 'ammar', tone: 'lemon', first: 'Ammar', role: 'Plateformes & sites web',
    headline: 'Des produits web construits pour durer',
    meta: [{ lines: ['Plateformes & sites web'] }, { lines: ['Atlas Flow', 'Maroc'] }],
    statement: 'Sites, boutiques en ligne, plateformes métier et SaaS : rapides, évolutifs et simples à faire grandir.',
    services: [
      { title: 'Sites web', items: ['Sites vitrines', 'Landing pages', 'SEO', 'Performance'] },
      { title: 'E-commerce', items: ['Boutiques en ligne', 'Paiement', 'Livraison', 'Catalogue'] },
      { title: 'Plateformes métier', items: ['Gestion', 'Portails clients', 'Back-office', 'Rôles & accès'] },
      { title: 'SaaS', items: ['React', 'Node.js', 'PostgreSQL', 'API'] },
      { title: 'UI & animation', items: ['Design system', 'Three.js', 'GSAP', 'Accessibilité'] },
    ],
    cards: [
      { icon: 'rocket', title: 'Livraison par étapes', body: `${TODO} Des versions testables à chaque étape, pas un effet tunnel.` },
      { icon: 'sparkles', title: 'Soin du détail', body: 'Typographie, animations et accessibilité soignées sur chaque écran.' },
      { icon: 'zap', title: 'Évolutif', body: 'Une base technique solide, simple à faire grandir avec votre activité.' },
    ],
    // Ludique / produit : formes arrondies, boutons magnétiques, ressorts, galerie à glisser.
    personality: { key: 'product', shape: 'cube', tag: 'React · Node · Three.js', reveal: { duration: 1.1, stagger: 0.06, ease: 'back.out(2.2)', from: 110 }, gallery: true },
    projects: [['Suivi des livraisons', ['E-commerce', 'Logistique']], ['Plateforme de formation', ['Plateforme', 'Formation']], ['Site vitrine animé', ['Site web', 'Animation']], ['Portail client SaaS', ['SaaS', 'Full-stack']]],
  }),
  aymen: person({
    id: 'aymen', tone: 'bleu', first: 'Aymen', role: 'Data analyse, science & engineering',
    headline: 'Vos données, enfin exploitables',
    meta: [{ lines: ['Data analyse · science', 'Data engineering'] }, { lines: ['Atlas Flow', 'Maroc'] }],
    statement: 'Collecte, nettoyage, automatisation et tableaux de bord : des fichiers dispersés deviennent des décisions claires.',
    services: [
      { title: 'Data engineering', items: ['Pipelines ETL', 'Web scraping', 'Bases de données', 'Python & SQL'] },
      { title: 'Automatisation', items: ['n8n', 'Workflows', 'Intégrations', 'API'] },
      { title: 'Data analyse & dashboards', items: ['Power BI', 'Suivi des KPI', 'Rapports', 'Alertes'] },
      { title: 'Data science & ML', items: ['Prévisions', 'Classification', 'scikit-learn', 'Analyse'] },
      { title: 'Qualité des données', items: ['Nettoyage', 'Dédoublonnage', 'Référentiels', 'Gouvernance'] },
    ],
    cards: [
      { icon: 'rocket', title: 'Des résultats rapides', body: `${TODO} Un premier tableau de bord utile en quelques jours, puis des itérations.` },
      { icon: 'sparkles', title: 'Des données fiables', body: 'Nettoyées, documentées et à jour automatiquement, sans saisie manuelle.' },
      { icon: 'zap', title: 'Des décisions claires', body: 'Les bons indicateurs, au bon endroit, pour les bonnes personnes.' },
    ],
    // Technique / énergique : mono, KPI animés, grille & scanlines, ticker, texte brouillé.
    personality: {
      key: 'data', shape: 'bars', tag: '// data.pipeline :: live', reveal: { duration: 0.6, stagger: 0.03, ease: 'power4.out', from: 100 },
      kpis: [[98, '%', `Données fiabilisées ${TODO}`], [40, 'h', `Gagnées / mois ${TODO}`], [12, '', `Sources connectées ${TODO}`], [3, 'x', `Rapports plus rapides ${TODO}`]],
      ticker: ['ETL', 'n8n', 'Power BI', 'Python', 'SQL', 'Scraping', 'KPI', 'Prévisions', 'scikit-learn', 'API'],
    },
    projects: [['Pipeline de données e-commerce', ['ETL', 'Automatisation']], ['Tableau de bord commercial', ['Power BI', 'KPI']], ['Scraping & veille marché', ['Python', 'Web scraping']], ['Modèle de prévision', ['Machine learning', 'Prévisions']]],
  }),
};

export const TEAM = ['aziz', 'ammar', 'aymen'];
