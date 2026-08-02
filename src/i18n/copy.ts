export type Locale = "fr" | "en";

export const routes = {
  fr: {
    home: "/",
    projects: "/projets/",
    about: "/a-propos/",
    contact: "/contact/",
  },
  en: {
    home: "/en/",
    projects: "/en/projects/",
    about: "/en/about/",
    contact: "/en/contact/",
  },
} as const;

export const copy = {
  fr: {
    localeName: "Français",
    alternateLocale: "EN",
    skipLink: "Aller au contenu",
    themeLabel: "Changer de thème",
    themeLight: "Activer le thème clair",
    themeDark: "Activer le thème sombre",
    nav: {
      home: "Accueil",
      projects: "Projets",
      about: "À propos",
      contact: "Contact",
    },
    meta: {
      title: "Ethan Brosselard — Développeur logiciel & créateur numérique",
      description:
        "Portfolio d’Ethan Brosselard. Projets logiciels, expériences web et Android, architecture et explorations autour de l’IA.",
      socialImageAlt:
        "Carte de partage Violet Field du portfolio d’Ethan Brosselard, avec son monogramme EB.",
    },
    home: {
      eyebrow: "Paris, France · FR / EN",
      title: "Je transforme des idées en produits numériques.",
      intro:
        "Mon terrain de jeu ne tient pas dans une seule stack. Je conçois, construis et fais évoluer des expériences numériques, du web au mobile, avec une curiosité grandissante pour l’IA.",
      projectsCta: "Explorer mes projets",
      githubCta: "Voir mon GitHub",
      signalLabel: "Terrain d’exploration",
      fieldsTitle: "Un terrain de jeu volontairement large.",
      fieldsIntro:
        "Je pars du problème, puis je travaille sur ce qu’il demande : interface, backend, mobile, données, architecture, qualité ou automatisation.",
      fields: [
        { index: "01", title: "Web", text: "Interfaces, APIs et systèmes de données." },
        {
          index: "02",
          title: "Mobile",
          text: "Applications natives pensées pour leur plateforme.",
        },
        { index: "03", title: "Ingénierie", text: "Architecture, tests, sécurité et performance." },
        { index: "04", title: "IA", text: "Exploration et apprentissage continu." },
      ],
      selectedProjects: "Projets sélectionnés",
      selectedProjectsIntro:
        "Deux premiers produits, deux contextes très différents, une même attention portée aux décisions derrière le code.",
      aboutEyebrow: "À propos",
      aboutTitle: "Construire, comprendre, recommencer.",
      aboutText:
        "Je m’appelle Ethan Brosselard. Ce site documente ce que je construis, pourquoi je le construis et les compromis techniques que je prends.",
      interestsLabel: "Hors du code",
      interests: "Jeux vidéo · Films & séries · Manga · Lecture",
      aboutCta: "En savoir plus",
      contactTitle: "Une idée, une question, ou simplement envie de parler tech ?",
      contactText: "Écrivez-moi directement. Je réponds dès que possible.",
      contactCta: "M’écrire",
    },
    projects: {
      eyebrow: "Projets",
      title: "Des produits, pas seulement des stacks.",
      intro:
        "Chaque aperçu présente le problème traité, le socle technique, les décisions d’architecture et les limites actuellement vérifiables.",
      viewProject: "Voir le projet",
      teaser: "Aperçu technique",
    },
    about: {
      eyebrow: "À propos",
      title: "Je préfère garder le champ des possibles ouvert.",
      lead: "Je suis Ethan Brosselard, développeur logiciel basé à Paris.",
      paragraphs: [
        "Je développe aujourd’hui des produits web et Android, sans vouloir limiter la suite à ces deux domaines. Je choisis les outils en fonction du problème et j’élargis progressivement mon terrain de jeu vers l’intelligence artificielle.",
        "Ce portfolio est un journal de construction : il montre les produits, mais aussi les décisions, contraintes, tests et apprentissages qui se trouvent derrière.",
        "En dehors de l’informatique, je m’intéresse aux jeux vidéo, au cinéma, aux séries, aux mangas et à la lecture — des univers qui nourrissent naturellement certains de mes projets.",
      ],
      nowLabel: "Maintenant",
      nowText:
        "Faire évoluer MyVerse, préparer FiltreAppels à une publication plus large et explorer de nouveaux usages autour de l’IA.",
      proofLabel: "Ce que montre ce portfolio",
      proofText:
        "Des produits documentés par leurs choix d’architecture, leurs validations techniques et leurs limites actuelles.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Parlons produits, code ou idées.",
      intro:
        "Ce portfolio vise d’abord à partager ce que je construis. Pour une question, un retour ou une discussion technique, le plus simple reste l’email.",
      emailLabel: "Email",
      socialLabel: "Ailleurs",
      locationLabel: "Localisation",
      note: "Aucun formulaire, aucun suivi et aucune donnée de contact stockée par ce site.",
    },
    project: {
      back: "Tous les projets",
      stack: "Socle technique",
      evidence: "Validation technique documentée",
      evidenceNote: "Mesures locales, distinctes de résultats utilisateurs ou de production.",
    },
    footer: {
      note: "Projets, choix d’architecture et validations techniques.",
      noTracking: "Sans analytics ni cookies de suivi.",
    },
    notFound: {
      title: "Cette page n’existe pas.",
      text: "Vérifiez l’adresse ou choisissez un point de départ.",
      cta: "Retour à l’accueil",
    },
  },
  en: {
    localeName: "English",
    alternateLocale: "FR",
    skipLink: "Skip to content",
    themeLabel: "Change theme",
    themeLight: "Use light theme",
    themeDark: "Use dark theme",
    nav: {
      home: "Home",
      projects: "Projects",
      about: "About",
      contact: "Contact",
    },
    meta: {
      title: "Ethan Brosselard — Software developer & digital maker",
      description:
        "Portfolio of Ethan Brosselard. Software projects, web and Android experiences, architecture, and AI explorations.",
      socialImageAlt:
        "Violet Field sharing card for Ethan Brosselard’s portfolio, featuring his EB monogram.",
    },
    home: {
      eyebrow: "Paris, France · FR / EN",
      title: "I turn ideas into digital products.",
      intro:
        "My playground does not fit into a single stack. I design, build, and evolve digital experiences across web and mobile, with a growing curiosity for AI.",
      projectsCta: "Explore my projects",
      githubCta: "View my GitHub",
      signalLabel: "Exploration field",
      fieldsTitle: "A deliberately broad playground.",
      fieldsIntro:
        "I start with the problem, then work across whatever it requires: interface, backend, mobile, data, architecture, quality, or automation.",
      fields: [
        { index: "01", title: "Web", text: "Interfaces, APIs, and data systems." },
        { index: "02", title: "Mobile", text: "Native apps designed for their platform." },
        {
          index: "03",
          title: "Engineering",
          text: "Architecture, testing, security, and performance.",
        },
        { index: "04", title: "AI", text: "Ongoing exploration and learning." },
      ],
      selectedProjects: "Selected projects",
      selectedProjectsIntro:
        "Two initial products, two very different contexts, and the same attention to the decisions behind the code.",
      aboutEyebrow: "About",
      aboutTitle: "Build, understand, start again.",
      aboutText:
        "I’m Ethan Brosselard. This site documents what I build, why I build it, and the technical trade-offs behind it.",
      interestsLabel: "Beyond code",
      interests: "Video games · Movies & TV · Manga · Books",
      aboutCta: "Learn more",
      contactTitle: "Have an idea, a question, or just want to talk tech?",
      contactText: "Email me directly. I’ll get back to you as soon as I can.",
      contactCta: "Get in touch",
    },
    projects: {
      eyebrow: "Projects",
      title: "Products, not just stacks.",
      intro:
        "Each overview covers the problem being addressed, its technical foundation, architecture decisions, and currently verifiable limits.",
      viewProject: "View project",
      teaser: "Technical overview",
    },
    about: {
      eyebrow: "About",
      title: "I prefer to keep the field wide open.",
      lead: "I’m Ethan Brosselard, a software developer based in Paris.",
      paragraphs: [
        "I currently build web and Android products without limiting what comes next to those two fields. I choose tools around the problem and am gradually expanding my playground toward artificial intelligence.",
        "This portfolio is a building journal: it shows the products, but also the decisions, constraints, tests, and lessons behind them.",
        "Outside software, I’m interested in video games, movies, TV series, manga, and books — worlds that naturally feed into some of my projects.",
      ],
      nowLabel: "Now",
      nowText:
        "Evolving MyVerse, preparing FiltreAppels for a wider release, and exploring new uses for AI.",
      proofLabel: "What this portfolio shows",
      proofText:
        "Products documented through their architecture decisions, technical validation, and current limitations.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let’s talk products, code, or ideas.",
      intro:
        "This portfolio primarily exists to share what I build. For a question, feedback, or a technical discussion, email is the simplest option.",
      emailLabel: "Email",
      socialLabel: "Elsewhere",
      locationLabel: "Location",
      note: "No form, tracking, or contact data is stored by this website.",
    },
    project: {
      back: "All projects",
      stack: "Technical foundation",
      evidence: "Documented technical validation",
      evidenceNote: "Local measurements, separate from user or production outcomes.",
    },
    footer: {
      note: "Projects, architecture decisions, and technical validation.",
      noTracking: "No analytics or tracking cookies.",
    },
    notFound: {
      title: "This page does not exist.",
      text: "Check the address or choose a starting point.",
      cta: "Back home",
    },
  },
} as const;

export function getCopy(locale: Locale) {
  return copy[locale];
}
