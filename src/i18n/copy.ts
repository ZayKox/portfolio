export type Locale = "fr" | "en";

export const routes = {
  fr: {
    home: "/",
    projects: "/projets/",
    about: "/a-propos/",
    resume: "/cv/",
    contact: "/contact/",
    legal: "/mentions-legales/",
    privacy: "/confidentialite/",
  },
  en: {
    home: "/en/",
    projects: "/en/projects/",
    about: "/en/about/",
    resume: "/en/resume/",
    contact: "/en/contact/",
    legal: "/en/legal-notice/",
    privacy: "/en/privacy/",
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
        "Portfolio d’Ethan Brosselard. Projets logiciels, plateformes web, architecture et explorations autour de l’IA.",
      socialImageAlt:
        "Carte de partage Violet Field du portfolio d’Ethan Brosselard, avec sa signature ZayKo.",
    },
    home: {
      eyebrow: "Développement logiciel · Produits numériques",
      title: "Je transforme des idées en produits numériques fiables.",
      intro:
        "Développeur web chez Studio Beyowi, je conçois, construis et fais évoluer des produits numériques. J’aime comprendre un système de bout en bout, choisir les outils adaptés et apprendre ce que le projet demande.",
      projectsCta: "Explorer mes projets",
      githubCta: "Voir mon GitHub",
      signalLabel: "Méthode",
      fieldsTitle: "Un produit forme un tout.",
      fieldsIntro:
        "Je ne sépare pas le produit de sa technique : chaque couche répond au même besoin, de l’interface jusqu’à la fiabilité du système.",
      fields: [
        {
          index: "01",
          title: "Interface",
          text: "Des parcours clairs, accessibles et adaptés à l’usage.",
        },
        {
          index: "02",
          title: "Services",
          text: "APIs, logique applicative et données structurées.",
        },
        {
          index: "03",
          title: "Fiabilité",
          text: "Architecture, tests, sécurité et performance.",
        },
        {
          index: "04",
          title: "Exploration",
          text: "IA et automatisation étudiées lorsqu’elles servent réellement le projet.",
        },
      ],
      selectedProjects: "Ce que je construis.",
      selectedProjectsIntro:
        "Une sélection de projets personnels présentés à travers leur usage, leur conception et les choix techniques qui les font évoluer.",
      heroProjectDescriptions: {
        palimia: "Films, séries, jeux, anime et manga réunis dans un seul profil.",
        ludosaic: "Des mini-jeux sur le web, en solo, contre un bot ou à plusieurs.",
      },
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
      title: "Construire, comprendre, recommencer.",
      lead: "Je suis Ethan Brosselard, développeur logiciel basé à Paris et développeur web chez Studio Beyowi.",
      paragraphs: [
        "J’ai commencé par vouloir comprendre comment fonctionnent les jeux vidéo : ce qui se passe derrière l’écran, comment les systèmes s’assemblent et comment une idée devient un produit concret. Cette curiosité m’a naturellement conduit vers le développement.",
        "Je construis des applications et des outils qui répondent à un besoin précis, avec une architecture claire et une interface agréable à utiliser. Je préfère comprendre un problème avant de choisir une technologie, puis découper le travail pour avancer progressivement et durablement.",
        "En équipe comme en autonomie, j’accorde de l’importance à la communication, aux tests, à l’accessibilité, à la sécurité et à la performance. Mon master en ingénierie de l’intelligence artificielle nourrit aussi une pratique réfléchie de l’IA : un outil qui aide à transformer de bonnes idées en réalisations, lorsqu’il est utilisé avec compréhension.",
        "En dehors de l’informatique, je m’intéresse aux jeux vidéo, au cinéma, aux séries, aux mangas et à la lecture. Ces univers nourrissent mes projets : Palimia est né de l’envie de réunir au même endroit le suivi de plusieurs cultures, dans l’esprit de ce que Letterboxd propose au cinéma.",
      ],
      nowLabel: "Maintenant",
      nowText:
        "Faire évoluer mes projets personnels et approfondir la sécurité appliquée au développement logiciel.",
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
    legal: {
      eyebrow: "Informations légales",
      title: "Mentions légales",
      intro: "Informations relatives à l’édition, à l’hébergement et aux contenus de ce portfolio.",
      publisherTitle: "Édition",
      publisherText:
        "Ce portfolio est un site personnel édité par Ethan Brosselard. Il présente un parcours, des projets et des réalisations ; il ne propose ni vente, ni service en ligne, ni espace utilisateur.",
      publisherLabel: "Directeur de la publication",
      contactLabel: "Contact",
      hostingTitle: "Hébergement",
      hostingText:
        "La publication de production est prévue sur une infrastructure VPS OVHcloud. Le site est exécuté dans un conteneur Nginx et Caddy assure le proxy HTTPS ; l’hébergeur de l’infrastructure est OVH SAS.",
      intellectualPropertyTitle: "Propriété intellectuelle",
      intellectualPropertyText:
        "Sauf mention contraire, les textes, le code source et les éléments graphiques de ce site sont protégés par le droit de la propriété intellectuelle. Leur reproduction, représentation ou adaptation, totale ou partielle, nécessite l’accord préalable de leur titulaire. Les éléments de tiers ne sont utilisés que lorsqu’ils sont autorisés et restent soumis à leurs droits respectifs.",
      externalLinksTitle: "Liens externes",
      externalLinksText:
        "Les liens vers des sites tiers sont fournis pour information. Leur contenu, leur disponibilité et leurs pratiques de confidentialité relèvent de la responsabilité de leurs éditeurs respectifs.",
      updatedLabel: "Dernière mise à jour",
      updatedValue: "20 août 2026",
    },
    privacy: {
      eyebrow: "Données personnelles",
      title: "Politique de confidentialité",
      intro:
        "Ce site est conçu pour limiter au maximum la collecte et l’utilisation de données personnelles.",
      controllerTitle: "Responsable",
      controllerText:
        "Ethan Brosselard est responsable des traitements décrits sur cette page. Pour toute question ou demande concernant vos données, vous pouvez écrire à l’adresse ci-dessous.",
      contactLabel: "Contact",
      collectionTitle: "Données traitées",
      collectionText:
        "Le site ne comporte ni formulaire, ni compte, ni newsletter, ni mesure d’audience, ni contenu tiers embarqué. Il n’utilise pas de cookie de suivi. La préférence de thème, si vous la modifiez, est conservée uniquement dans le stockage local de votre navigateur sous la clé « portfolio-theme » ; elle ne quitte pas votre appareil.",
      emailTitle: "Messages envoyés par email",
      emailText:
        "Si vous choisissez d’écrire à l’adresse affichée, votre adresse email et le contenu de votre message sont utilisés uniquement pour lire votre demande et vous répondre. Le message est transmis directement par votre service de messagerie et celui du destinataire ; il ne transite pas par le site.",
      technicalTitle: "Journaux techniques",
      technicalText:
        "Pour la sécurité et le bon fonctionnement du service, le serveur web du site produit des journaux techniques minimisés : date et heure, méthode HTTP, chemin normalisé sans paramètres, statut de la réponse, volume transféré et durée de traitement. La configuration du site n’y enregistre ni adresse IP transmise, ni référent, ni agent utilisateur. L’infrastructure d’hébergement et son proxy peuvent toutefois appliquer leurs propres journaux techniques, selon leur configuration et leurs politiques.",
      purposeTitle: "Finalités et base juridique",
      purposeText:
        "Les messages reçus sont traités pour répondre à leur expéditeur. Les journaux techniques servent à assurer la sécurité, diagnostiquer un incident et maintenir le service. Ces traitements reposent sur l’intérêt légitime de l’éditeur à répondre aux sollicitations reçues et à protéger le site.",
      recipientsTitle: "Destinataires et conservation",
      recipientsText:
        "Seul Ethan Brosselard accède aux messages reçus. Les prestataires de messagerie et d’hébergement peuvent traiter les données strictement nécessaires à leurs services. Les messages sont conservés le temps nécessaire au suivi de l’échange ; les journaux techniques suivent la durée de conservation configurée par l’infrastructure d’hébergement.",
      rightsTitle: "Vos droits",
      rightsText:
        "Selon la réglementation applicable, vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou l’opposition au traitement de vos données. Vous pouvez également introduire une réclamation auprès de la CNIL. Pour exercer vos droits concernant ce site, contactez Ethan Brosselard par email.",
      changesTitle: "Évolution de cette politique",
      changesText:
        "Cette politique décrit la configuration actuelle du site. Elle sera mise à jour avant tout ajout de formulaire, d’outil de mesure d’audience, de cookie de suivi ou de contenu tiers embarqué.",
      updatedLabel: "Dernière mise à jour",
      updatedValue: "20 août 2026",
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
      legal: "Mentions légales",
      privacy: "Confidentialité",
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
        "Portfolio of Ethan Brosselard. Software projects, web platforms, architecture, and AI explorations.",
      socialImageAlt:
        "Violet Field sharing card for Ethan Brosselard’s portfolio, featuring his ZayKo signature.",
    },
    home: {
      eyebrow: "Software development · Digital products",
      title: "I turn ideas into reliable digital products.",
      intro:
        "As a web developer at Studio Beyowi, I design, build, and evolve digital products. I like understanding a system end to end, choosing fitting tools, and learning what each project calls for.",
      projectsCta: "Explore my projects",
      githubCta: "View my GitHub",
      signalLabel: "Method",
      fieldsTitle: "A product works as a whole.",
      fieldsIntro:
        "I don’t separate the product from its technology: every layer serves the same need, from the interface to the reliability of the system.",
      fields: [
        {
          index: "01",
          title: "Interface",
          text: "Clear, accessible flows shaped around actual use.",
        },
        {
          index: "02",
          title: "Services",
          text: "APIs, application logic, and structured data.",
        },
        {
          index: "03",
          title: "Reliability",
          text: "Architecture, testing, security, and performance.",
        },
        {
          index: "04",
          title: "Exploration",
          text: "AI and automation considered when they genuinely serve the project.",
        },
      ],
      selectedProjects: "What I build.",
      selectedProjectsIntro:
        "A selection of personal projects presented through their use, their design, and the technical choices shaping them.",
      heroProjectDescriptions: {
        palimia: "Films, series, games, anime, and manga brought together in one profile.",
        ludosaic: "Web mini-games for solo play, against a bot, or with other players.",
      },
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
      title: "Build, understand, start again.",
      lead: "I’m Ethan Brosselard, a software developer based in Paris and a web developer at Studio Beyowi.",
      paragraphs: [
        "I first got into software by wanting to understand how video games work: what happens behind the screen, how systems fit together, and how an idea becomes a working product. That curiosity naturally led me to development.",
        "I build applications and tools that answer a specific need, with clear architecture and pleasant interfaces. I prefer understanding a problem before choosing a technology, then breaking work into smaller pieces to move forward steadily and sustainably.",
        "Whether I work with a team or independently, I care about communication, testing, accessibility, security, and performance. My master’s degree in AI engineering also supports a thoughtful approach to AI: a tool that can help turn good ideas into real work when used with understanding.",
        "Outside software, I’m interested in video games, movies, TV series, manga, and books. These worlds feed into my projects: Palimia started from the wish to track several cultural domains in one place, in the spirit of what Letterboxd offers for film.",
      ],
      nowLabel: "Now",
      nowText:
        "Evolving my personal projects and deepening my knowledge of applied software security.",
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
    legal: {
      eyebrow: "Legal information",
      title: "Legal notice",
      intro: "Information about the publication, hosting, and content of this portfolio.",
      publisherTitle: "Publisher",
      publisherText:
        "This portfolio is a personal website published by Ethan Brosselard. It presents a professional background, projects, and work; it does not offer sales, online services, or user accounts.",
      publisherLabel: "Publication director",
      contactLabel: "Contact",
      hostingTitle: "Hosting",
      hostingText:
        "The production deployment is planned on OVHcloud VPS infrastructure. The site runs in an Nginx container, with Caddy handling the HTTPS proxy; OVH SAS is the infrastructure hosting provider.",
      intellectualPropertyTitle: "Intellectual property",
      intellectualPropertyText:
        "Unless otherwise stated, this website’s text, source code, and visual elements are protected by intellectual-property law. Their full or partial reproduction, representation, or adaptation requires the prior permission of the rightsholder. Third-party material is used only when authorized and remains subject to its respective rights.",
      externalLinksTitle: "External links",
      externalLinksText:
        "Links to third-party sites are provided for information only. Their content, availability, and privacy practices remain the responsibility of their respective publishers.",
      updatedLabel: "Last updated",
      updatedValue: "20 August 2026",
    },
    privacy: {
      eyebrow: "Personal data",
      title: "Privacy policy",
      intro: "This website is designed to minimise the collection and use of personal data.",
      controllerTitle: "Controller",
      controllerText:
        "Ethan Brosselard is responsible for the processing described on this page. For a question or request about your data, you can write to the address below.",
      contactLabel: "Contact",
      collectionTitle: "Data processed",
      collectionText:
        "The site has no form, account, newsletter, analytics, or embedded third-party content. It uses no tracking cookies. If you change it, your theme preference is kept solely in your browser’s local storage under the key “portfolio-theme”; it never leaves your device.",
      emailTitle: "Messages sent by email",
      emailText:
        "If you choose to write to the displayed email address, your email address and the content of your message are used solely to read and reply to your request. The message is sent directly through your email provider and the recipient’s; it does not pass through the website.",
      technicalTitle: "Technical logs",
      technicalText:
        "For security and service-operation purposes, the site’s web server produces minimised technical logs: date and time, HTTP method, normalised path without parameters, response status, transferred volume, and processing time. The site configuration does not record a forwarded IP address, referrer, or user agent in these logs. The hosting infrastructure and its proxy may nevertheless apply their own technical logging, according to their configuration and policies.",
      purposeTitle: "Purposes and legal basis",
      purposeText:
        "Received messages are processed to reply to their sender. Technical logs support security, incident diagnosis, and service maintenance. This processing relies on the publisher’s legitimate interest in responding to messages received and protecting the website.",
      recipientsTitle: "Recipients and retention",
      recipientsText:
        "Only Ethan Brosselard accesses received messages. Email and hosting providers may process the data strictly necessary to provide their services. Messages are kept for the time needed to follow up an exchange; technical logs follow the retention period configured by the hosting infrastructure.",
      rightsTitle: "Your rights",
      rightsText:
        "Depending on applicable law, you may request access to, rectification or erasure of, restriction of, or objection to the processing of your data. You may also lodge a complaint with the CNIL. To exercise your rights in relation to this website, contact Ethan Brosselard by email.",
      changesTitle: "Changes to this policy",
      changesText:
        "This policy describes the website’s current configuration. It will be updated before adding a form, analytics tool, tracking cookie, or embedded third-party content.",
      updatedLabel: "Last updated",
      updatedValue: "20 August 2026",
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
      legal: "Legal notice",
      privacy: "Privacy",
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
