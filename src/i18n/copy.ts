export type Locale = "fr" | "en";

export const routes = {
  fr: {
    home: "/",
    projects: "/projets/",
    about: "/a-propos/",
    resume: "/cv/",
    contact: "/contact/",
  },
  en: {
    home: "/en/",
    projects: "/en/projects/",
    about: "/en/about/",
    resume: "/en/resume/",
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
      resume: "CV",
      contact: "Contact",
    },
    meta: {
      title: "Ethan Brosselard — Développeur logiciel & créateur numérique",
      description:
        "Portfolio d’Ethan Brosselard. Projets logiciels, expériences web et Android, architecture et explorations autour de l’IA.",
      socialImageAlt:
        "Carte de partage Violet Field du portfolio d’Ethan Brosselard, avec sa signature ZK.",
    },
    home: {
      eyebrow: "Paris, France · FR / EN",
      title: "Je transforme des idées en produits numériques fiables.",
      intro:
        "Développeur web chez Beyowi, je conçois, construis et fais évoluer des produits numériques. J’aime comprendre un système de bout en bout, choisir les outils adaptés et apprendre ce que le projet demande.",
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
        "Je m’appelle Ethan Brosselard, aussi connu sous le nom de ZayKo. Ce site présente les projets que je construis, les problèmes qu’ils cherchent à résoudre et les choix qui les façonnent.",
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
      lead: "Je suis Ethan Brosselard, développeur logiciel basé à Paris et développeur web chez Beyowi.",
      paragraphs: [
        "J’ai commencé par vouloir comprendre comment fonctionnent les jeux vidéo : ce qui se passe derrière l’écran, comment les systèmes s’assemblent et comment une idée devient un produit concret. Cette curiosité m’a naturellement conduit vers le développement.",
        "Je construis des applications et des outils qui répondent à un besoin précis, avec une architecture claire et une interface agréable à utiliser. Je préfère comprendre un problème avant de choisir une technologie, puis découper le travail pour avancer progressivement et durablement.",
        "En équipe comme en autonomie, j’accorde de l’importance à la communication, aux tests, à l’accessibilité, à la sécurité et à la performance. Mon master en ingénierie de l’intelligence artificielle nourrit aussi une pratique réfléchie de l’IA : un outil qui aide à transformer de bonnes idées en réalisations, lorsqu’il est utilisé avec compréhension.",
        "En dehors de l’informatique, je m’intéresse aux jeux vidéo, au cinéma, aux séries, aux mangas et à la lecture. Ces univers nourrissent mes projets : MyVerse est né de l’envie de réunir au même endroit le suivi de plusieurs cultures, dans l’esprit de ce que Letterboxd propose au cinéma.",
      ],
      nowLabel: "Maintenant",
      nowText:
        "Faire évoluer MyVerse, poursuivre mon alternance chez Beyowi et approfondir la sécurité appliquée au développement logiciel.",
      proofLabel: "Ce que montre ce portfolio",
      proofText:
        "Des projets, un parcours et des choix techniques expliqués avec leurs validations et leurs limites connues.",
    },
    resume: {
      eyebrow: "Parcours",
      title: "CV et expériences",
      intro:
        "Un aperçu structuré de mon parcours, de mes compétences et des projets qui l’accompagnent.",
      download: "Télécharger le PDF",
      contact: "Contact et liens",
      experience: "Expériences",
      education: "Formation",
      skills: "Compétences",
      projects: "Projets et hackathons",
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
      resume: "Resume",
      contact: "Contact",
    },
    meta: {
      title: "Ethan Brosselard — Software developer & digital maker",
      description:
        "Portfolio of Ethan Brosselard. Software projects, web and Android experiences, architecture, and AI explorations.",
      socialImageAlt:
        "Violet Field sharing card for Ethan Brosselard’s portfolio, featuring his ZK signature.",
    },
    home: {
      eyebrow: "Paris, France · FR / EN",
      title: "I turn ideas into reliable digital products.",
      intro:
        "As a web developer at Beyowi, I design, build, and evolve digital products. I like understanding a system end to end, choosing fitting tools, and learning what each project calls for.",
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
        "I’m Ethan Brosselard, also known as ZayKo. This site presents the projects I build, the problems they address, and the choices that shape them.",
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
      lead: "I’m Ethan Brosselard, a software developer based in Paris and a web developer at Beyowi.",
      paragraphs: [
        "I first got into software by wanting to understand how video games work: what happens behind the screen, how systems fit together, and how an idea becomes a working product. That curiosity naturally led me to development.",
        "I build applications and tools that answer a specific need, with clear architecture and pleasant interfaces. I prefer understanding a problem before choosing a technology, then breaking work into smaller pieces to move forward steadily and sustainably.",
        "Whether I work with a team or independently, I care about communication, testing, accessibility, security, and performance. My master’s degree in AI engineering also supports a thoughtful approach to AI: a tool that can help turn good ideas into real work when used with understanding.",
        "Outside software, I’m interested in video games, movies, TV series, manga, and books. These worlds feed into my projects: MyVerse started from the wish to track several cultural domains in one place, in the spirit of what Letterboxd offers for film.",
      ],
      nowLabel: "Now",
      nowText:
        "Evolving MyVerse, continuing my apprenticeship at Beyowi, and deepening my knowledge of software security.",
      proofLabel: "What this portfolio shows",
      proofText:
        "Projects, a professional path, and technical choices explained with their validation and known limitations.",
    },
    resume: {
      eyebrow: "Background",
      title: "Resume and experience",
      intro: "A structured overview of my background, skills, and the projects that support them.",
      download: "Download PDF",
      contact: "Contact and links",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects and hackathons",
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
