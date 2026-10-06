export type Locale = "fr" | "en";

export { default as routes } from "../data/routes.json";

export const copy = {
  fr: {
    localeName: "Français",
    alternateLocale: "EN",
    skipLink: "Aller au contenu",
    themeLabel: "Thème",
    themeSystem: "Système",
    languageSwitchLabel: "View this page in English",
    themeLight: "Clair",
    themeDark: "Sombre",
    nav: {
      label: "Navigation principale",
      home: "Accueil",
      projects: "Projets",
      about: "À propos",
      resume: "CV",
      contact: "Contact",
    },
    meta: {
      title: "Ethan Brosselard — Développeur backend",
      description:
        "Développeur backend à Paris : API, données, IA appliquée et cloud. Expérience principale en Python, ouvert à d’autres langages. CDI ou CDD en télétravail.",
      socialImageAlt:
        "Carte de partage Violet Field du portfolio d’Ethan Brosselard, avec sa signature ZayKo.",
    },
    home: {
      eyebrow: "Ethan Brosselard · ZayKo",
      title: "Développeur backend.",
      titleEmphasis: "Développeur backend.",
      intro:
        "API, logique métier et données. Expérience en alternance depuis 2022, principalement en Python, complétée par le C++ et des projets TypeScript. Master en ingénierie de l’IA ; ouvert à différents langages backend.",
      exploreLabel: "Pour aller plus loin",
      exploreTitle: "Du parcours aux projets.",
      allProjectsCta: "Découvrir tous les projets",
      homelabCta: "Aperçu du homelab",
      resumeOnlineCta: "Lire mon CV en ligne",
      educationLabel: "Formation",
      experienceCta: "Voir mon expérience",
      resumePdfCta: "Télécharger mon CV (PDF)",
      projectsCta: "Projets",
      quickLinksLabel: "Liens directs",
      experienceEyebrow: "Parcours professionnel",
      experienceTitle: "Une expérience concrète, en équipe.",
      experienceIntro:
        "Des API aux pipelines de données et à l’IA appliquée, avec une pratique des algorithmes et des tests en C++.",
      experienceMore: "Voir le CV complet",
      signalLabel: "Compétences",
      fieldsTitle: "Construire et fiabiliser le backend.",
      fieldsIntro:
        "Chaque domaine s’appuie sur une expérience professionnelle ou un projet détaillé.",
      fields: [
        {
          index: "01",
          title: "Backend & API",
          text: "API REST en Python chez Studio Beyowi ; logique serveur en TypeScript dans mes projets personnels.",
          linkLabel: "Expérience backend",
          href: "#experience-beyowi",
        },
        {
          index: "02",
          title: "IA appliquée",
          text: "RAG et recherche vectorielle avec PGVector et Qdrant chez Studio Beyowi, complétés par un master en ingénierie de l’IA.",
          linkLabel: "Intégration de l’IA",
          href: "#experience-beyowi",
        },
        {
          index: "03",
          title: "Données & SQL",
          text: "ETL et migrations SQL en entreprise ; catalogue normalisé et données personnelles séparées dans Palimia.",
          linkLabel: "Modélisation dans Palimia",
          href: "/projets/palimia/",
        },
        {
          index: "04",
          title: "Cloud & automatisation",
          text: "Maîtrise de plusieurs services AWS et de n8n. Pratique des tests, de Docker et de la CI/CD en entreprise.",
          linkLabel: "Compétences et expérience",
          href: "/cv/",
        },
      ],
      selectedProjects: "Le backend à travers mes projets.",
      selectedProjectsIntro:
        "Deux applications développées en autonomie, avec leurs choix de logique serveur, de modèles de données et de validation.",
      aboutEyebrow: "À propos",
      aboutTitle: "Un socle backend, plusieurs langages.",
      aboutText:
        "API, règles métier, données et tests structurent mon travail. Mon expérience en Python et C++ et mes projets TypeScript nourrissent une approche du backend ouverte à différents langages, complétée par un master en ingénierie de l’IA.",
      aboutCta: "En savoir plus",
      contactTitle: "Échangeons sur votre équipe ou votre projet.",
      contactText:
        "Je recherche un poste en développement backend, avec un intérêt pour l’IA appliquée, les données et le cloud, et une ouverture à différents langages. Vous pouvez m’écrire directement.",
      contactCta: "M’écrire",
    },
    jobSearch: {
      title: "Ce que je recherche",
      missionLabel: "Missions",
      mission: "Développement backend : API, données, IA appliquée et cloud",
      contractLabel: "Contrat et organisation",
      companyLabel: "Type d’entreprise",
      locationLabel: "Basé à",
    },
    projects: {
      eyebrow: "Projets",
      title: "De l’idée aux choix techniques.",
      intro:
        "Deux applications développées en autonomie et un homelab en préparation : logique serveur, données, tests et automatisation, avec leurs limites actuelles.",
      viewProject: "Lire l’étude de projet",
      teaser: "Aperçu technique",
    },
    about: {
      description:
        "Parcours backend d’Ethan Brosselard : API Python, données et RAG chez Studio Beyowi, C++ chez Intento Design, projets TypeScript et master en IA.",
      eyebrow: "À propos",
      title: "Mon parcours et ma façon de travailler.",
      lead: "Je suis Ethan Brosselard, développeur backend basé à Paris.",
      paragraphs: [
        "Mon parcours en alternance depuis 2022 associe des API Python, des traitements SQL et des services AWS chez Studio Beyowi à une première expérience en C++ chez Intento Design. Chez Studio Beyowi, j’ai aussi contribué à l’intégration de RAG et de recherche vectorielle. J’ai obtenu mon master informatique en ingénierie de l’intelligence artificielle en 2026.",
        "Je recherche un poste backend, avec Python comme expérience principale et une ouverture à d’autres langages et environnements. Je préfère comprendre le besoin avant de choisir une technologie, puis avancer par étapes vérifiables. En équipe comme en autonomie, j’accorde de l’importance à la communication, aux tests, à l’accessibilité, à la sécurité et à la performance.",
        "Avec Palimia et Ludosaic, j’explore les modèles de données, la validation côté serveur, les règles métier et les contraintes de déploiement. Mon homelab en préparation complète cette pratique avec des configurations versionnées, de l’automatisation et des validations locales.",
      ],
      nowLabel: "Maintenant",
      nowText:
        "Je recherche un poste en développement backend, avec un intérêt pour l’IA appliquée, les données et le cloud. Je reste ouvert à différents langages et environnements.",
      resumeCta: "Découvrir mon parcours et mon CV",
      projectsCta: "Voir les projets et leurs choix techniques",
      proofLabel: "Ce que montre ce portfolio",
      proofText:
        "Des projets, un parcours et des choix techniques expliqués avec leurs validations et leurs limites connues.",
    },
    resume: {
      description:
        "CV d’Ethan Brosselard, développeur backend junior : API Python, données, RAG, AWS, C++ et projets TypeScript. Recherche CDI ou CDD en télétravail.",
      eyebrow: "Parcours",
      title: "CV et expériences",
      intro:
        "Un aperçu structuré de mon parcours, de mes compétences et des projets qui l’accompagnent.",
      download: "Télécharger le PDF",
      portfolio: "Portfolio",
      present: "Aujourd’hui",
      contact: "Contact et liens",
      profile: "Profil",
      experience: "Expériences professionnelles",
      education: "Formation",
      skills: "Compétences",
      languages: "Langues",
      projects: "Projets",
    },
    contact: {
      description:
        "Contacter Ethan Brosselard pour un poste backend : API, IA appliquée, données et cloud, avec une ouverture à différents langages. CDI ou CDD en télétravail.",
      eyebrow: "Contact",
      title: "Parlons de votre équipe.",
      intro:
        "Vous recrutez en développement backend ? Je recherche un CDI ou CDD en télétravail, avec Python comme expérience principale et une ouverture à d’autres langages, ainsi qu’aux sujets IA, données et cloud.",
      searchLabel: "Recherche actuelle",
      emailLabel: "Email",
      copyEmail: "Copier l’adresse",
      copiedEmail: "Adresse copiée",
      copyEmailError:
        "La copie a échoué. Vous pouvez sélectionner l’adresse ou ouvrir votre messagerie.",
      openEmail: "Ouvrir la messagerie",
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
        "L’hébergement de production est assuré par Cloudflare Workers Static Assets. Les fichiers du site sont générés statiquement puis distribués depuis le réseau mondial de Cloudflare. Cloudflare assure également le certificat TLS, la redirection de HTTP vers HTTPS et celle de www vers le domaine canonique ; aucune fonction applicative, base de données ou autre runtime n’est exécuté pour les pages publiques.",
      intellectualPropertyTitle: "Propriété intellectuelle",
      intellectualPropertyText:
        "Le code source original est mis à disposition selon les conditions et le périmètre définis dans le fichier LICENSE du dépôt. Les textes, données biographiques, récits de projets, éléments d’identité visuelle et médias ne sont pas couverts par cette licence et restent protégés par le droit de la propriété intellectuelle. Leur reproduction, représentation ou adaptation, totale ou partielle, nécessite l’accord préalable de leur titulaire. Les éléments de tiers restent soumis à leurs droits respectifs.",
      externalLinksTitle: "Liens externes",
      externalLinksText:
        "Les liens vers des sites tiers sont fournis pour information. Leur contenu, leur disponibilité et leurs pratiques de confidentialité relèvent de la responsabilité de leurs éditeurs respectifs.",
      updatedLabel: "Dernière mise à jour",
      updatedValue: "9 septembre 2026",
    },
    privacy: {
      eyebrow: "Données personnelles",
      title: "Politique de confidentialité",
      intro:
        "Ce site est conçu pour limiter au maximum la collecte et l’utilisation de données personnelles.",
      controllerTitle: "Responsable",
      controllerText:
        "Ethan Brosselard est responsable des traitements qu’il détermine pour ce site. Cloudflare traite certaines données techniques pour fournir l’infrastructure, selon son accord de traitement des données et, lorsqu’elle en détermine elle-même les finalités, sa propre politique de confidentialité. Pour toute question ou demande concernant vos données, vous pouvez écrire à l’adresse ci-dessous.",
      contactLabel: "Contact",
      collectionTitle: "Données traitées",
      collectionText:
        "Le site ne comporte ni formulaire, ni compte, ni newsletter, ni contenu tiers embarqué. Il n’active aucun outil de mesure d’audience côté navigateur et ne dépose aucun cookie publicitaire ou de mesure d’audience ; une navigation ordinaire ne reçoit pas de cookie de réponse du site. Cloudflare peut toutefois déposer un cookie strictement nécessaire lorsqu’un mécanisme de sécurité est déclenché. La préférence de thème, si vous la modifiez, est conservée uniquement dans le stockage local de votre navigateur sous la clé « portfolio-theme » ; elle ne quitte pas votre appareil.",
      emailTitle: "Messages envoyés par email",
      emailText:
        "Si vous choisissez d’écrire à l’adresse affichée, votre adresse email et le contenu de votre message sont utilisés uniquement pour lire votre demande et vous répondre. Le message est transmis directement par votre service de messagerie et celui du destinataire ; il ne transite pas par le site.",
      technicalTitle: "Journaux techniques",
      technicalText:
        "La configuration versionnée du portfolio désactive Workers Logs, les exports de journaux, l’instrumentation des dépendances, la télémétrie Wrangler et tout outil de mesure d’audience côté navigateur. Pour distribuer les fichiers statiques, terminer TLS, mettre les ressources en cache, appliquer les redirections et sécuriser le site, Cloudflare traite toutefois des données techniques de connexion susceptibles d’inclure l’adresse IP, des informations de routage, la configuration du système et des informations sur le trafic. Cloudflare produit également des métriques techniques agrégées.",
      purposeTitle: "Finalités et base juridique",
      purposeText:
        "Les messages reçus sont traités pour répondre à leur expéditeur. L’infrastructure est utilisée pour distribuer le contenu, mettre les ressources en cache, assurer la disponibilité du service et protéger le site. Les traitements déterminés par l’éditeur reposent sur son intérêt légitime à répondre aux sollicitations reçues et à fournir un site fiable et sécurisé. Cloudflare décrit dans sa propre politique les finalités et bases qu’elle applique aux traitements qu’elle détermine elle-même.",
      recipientsTitle: "Destinataires et conservation",
      recipientsText:
        "Seul Ethan Brosselard accède aux messages reçus. Les prestataires de messagerie et Cloudflare peuvent traiter les données strictement nécessaires à leurs services. Les messages sont conservés le temps nécessaire au suivi de l’échange ; la conservation des données techniques par Cloudflare dépend de leur nature, de la configuration du service et de ses obligations applicables.",
      transfersTitle: "Transferts internationaux",
      transfersText:
        "Cloudflare est un fournisseur mondial. Des données techniques peuvent être traitées hors de l’Espace économique européen, notamment aux États-Unis. Cloudflare indique encadrer ces transferts au moyen du cadre de protection des données UE–États-Unis et, selon les cas, des clauses contractuelles types de la Commission européenne.",
      cloudflarePrivacyLabel: "Politique de confidentialité de Cloudflare",
      cloudflareDpaLabel: "Accord de traitement des données de Cloudflare",
      rightsTitle: "Vos droits",
      rightsText:
        "Selon la réglementation applicable, vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou l’opposition au traitement de vos données. Vous pouvez également introduire une réclamation auprès de la CNIL. Pour exercer vos droits concernant ce site, contactez Ethan Brosselard par email.",
      changesTitle: "Évolution de cette politique",
      changesText:
        "Cette politique a été revue après le premier déploiement de production du 8 septembre 2026. Elle sera mise à jour avant tout ajout de formulaire, d’outil de mesure d’audience, de cookie de suivi, de contenu tiers embarqué ou de mécanisme Cloudflare modifiant les traitements décrits.",
      updatedLabel: "Dernière mise à jour",
      updatedValue: "8 septembre 2026",
    },
    visual: {
      infrastructure: {
        heading: "ARCHITECTURE CIBLE",
        host: "Proxmox VE",
        hostDetail: "Virtualisation · serveur unique",
        nodes: [
          { name: "Socle", detail: "DNS · identité · accès" },
          { name: "Applications", detail: "Fichiers · médias · outils" },
          { name: "Projets publics", detail: "Ludosaic · Palimia" },
          { name: "Domotique", detail: "Home Assistant OS" },
          { name: "Récupération", detail: "Proxmox Backup Server" },
        ],
        backup: "Restic · sauvegarde indépendante",
        footer: "PRÉVU · AUCUN SERVICE DÉPLOYÉ",
      },
      library: {
        profile: "UN SEUL PROFIL",
        library: "BIBLIOTHÈQUE CULTURELLE",
        worlds: "TOUS VOS UNIVERS",
        media: ["FILM", "SÉRIES", "JEU"],
        actions: ["SUIVRE", "NOTER", "ORGANISER"],
      },
    },
    project: {
      authorship: "Projet personnel",
      next: "Poursuivre la découverte",
      contact: "Échanger sur ce projet",
      back: "Tous les projets",
      stack: "Socle technique",
      evidence: "Validation technique documentée",
      evidenceNote: "Chaque mesure précise sa nature, son contexte et sa source.",
      metricKinds: {
        local: "Validation locale",
        production: "Mesure en production",
        user: "Résultat utilisateur",
      },
      source: "Source",
      decision: "Choix technique",
      flow: "Comment ça fonctionne",
      contents: "Dans cette étude",
      enlargeCapture: "Agrandir la capture",
      captureDetail: "Voir un détail de l’interface",
    },
    footer: {
      navigationLabel: "Liens de navigation",
      note: "Projets, choix d’architecture et validations techniques.",
      noTracking: "Sans mesure d’audience côté navigateur ni cookies de suivi.",
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
    themeLabel: "Theme",
    themeSystem: "System",
    languageSwitchLabel: "Voir cette page en français",
    themeLight: "Light",
    themeDark: "Dark",
    nav: {
      label: "Main navigation",
      home: "Home",
      projects: "Projects",
      about: "About",
      resume: "Resume",
      contact: "Contact",
    },
    meta: {
      title: "Ethan Brosselard — Backend developer",
      description:
        "Backend developer in Paris: APIs, data, applied AI and cloud. Experience primarily in Python, open to other languages. Seeking permanent or fixed-term remote work.",
      socialImageAlt:
        "Violet Field sharing card for Ethan Brosselard’s portfolio, featuring his ZayKo signature.",
    },
    home: {
      eyebrow: "Ethan Brosselard · ZayKo",
      title: "Backend developer.",
      titleEmphasis: "Backend developer.",
      intro:
        "APIs, business logic and data. Apprenticeship experience since 2022, primarily in Python, complemented by C++ and personal TypeScript projects. Master’s in AI engineering; open to different backend languages.",
      exploreLabel: "Explore my work",
      exploreTitle: "From experience to projects.",
      allProjectsCta: "Explore all projects",
      homelabCta: "Homelab overview",
      resumeOnlineCta: "Read my resume online",
      educationLabel: "Education",
      experienceCta: "View my experience",
      resumePdfCta: "Download my resume (PDF)",
      projectsCta: "Projects",
      quickLinksLabel: "Quick links",
      experienceEyebrow: "Professional experience",
      experienceTitle: "Hands-on experience with teams.",
      experienceIntro:
        "From APIs to data pipelines and applied AI, alongside experience with C++ algorithms and testing.",
      experienceMore: "View full resume",
      signalLabel: "Skills",
      fieldsTitle: "Building reliable backend systems.",
      fieldsIntro:
        "Each area is backed by professional experience or a detailed project case study.",
      fields: [
        {
          index: "01",
          title: "Backend & APIs",
          text: "Python REST APIs at Studio Beyowi; server-side logic in my personal TypeScript projects.",
          linkLabel: "Backend experience",
          href: "#experience-beyowi",
        },
        {
          index: "02",
          title: "Applied AI",
          text: "RAG and vector search with PGVector and Qdrant at Studio Beyowi, complemented by a master’s in AI engineering.",
          linkLabel: "AI integration",
          href: "#experience-beyowi",
        },
        {
          index: "03",
          title: "Data & SQL",
          text: "ETL and SQL migrations at work; a normalized catalog and separate personal data in Palimia.",
          linkLabel: "Palimia data modeling",
          href: "/en/projects/palimia/",
        },
        {
          index: "04",
          title: "Cloud & automation",
          text: "Proficient with multiple AWS services and n8n. Testing, Docker and CI/CD experience at work.",
          linkLabel: "Skills and experience",
          href: "/en/resume/",
        },
      ],
      selectedProjects: "Backend development in my projects.",
      selectedProjectsIntro:
        "Two applications I develop independently, with decisions around server-side logic, data models and validation.",
      aboutEyebrow: "About",
      aboutTitle: "Backend foundations, several languages.",
      aboutText:
        "APIs, business rules, data and testing shape my work. My Python and C++ experience and TypeScript projects support an approach to backend development that is open to different languages, complemented by a master’s in AI engineering.",
      aboutCta: "Learn more",
      contactTitle: "Let’s talk about your team or project.",
      contactText:
        "I’m looking for a backend development role, with an interest in applied AI, data and cloud, and openness to different languages. You can email me directly.",
      contactCta: "Get in touch",
    },
    jobSearch: {
      title: "What I’m looking for",
      missionLabel: "Work",
      mission: "Backend development: APIs, data, applied AI and cloud",
      contractLabel: "Employment and work setup",
      companyLabel: "Company type",
      locationLabel: "Based in",
    },
    projects: {
      eyebrow: "Projects",
      title: "From ideas to technical decisions.",
      intro:
        "Two applications I develop independently and a homelab in preparation: server-side logic, data, testing and automation, with their current limitations.",
      viewProject: "Read the case study",
      teaser: "Technical overview",
    },
    about: {
      description:
        "Ethan Brosselard’s backend experience: Python APIs, data and RAG at Studio Beyowi, C++ at Intento Design, TypeScript projects and a master’s in AI.",
      eyebrow: "About",
      title: "My background and how I work.",
      lead: "I’m Ethan Brosselard, a backend developer based in Paris.",
      paragraphs: [
        "My apprenticeships since 2022 combine Python APIs, SQL workflows and AWS services at Studio Beyowi with earlier C++ experience at Intento Design. At Studio Beyowi, I also contributed to RAG and vector search integration. I completed my computer science master’s degree in AI engineering in 2026.",
        "I’m looking for a backend role, with experience primarily in Python and openness to other languages and environments. I prefer understanding the need before choosing a technology, then progressing through steps I can verify. Whether I work with a team or independently, I care about communication, testing, accessibility, security and performance.",
        "With Palimia and Ludosaic, I explore data models, server-side validation, business rules and deployment constraints. My homelab in preparation complements this work with versioned configurations, automation and local validation.",
      ],
      nowLabel: "Now",
      nowText:
        "I’m looking for a backend development role, with an interest in applied AI, data and cloud. I’m open to different languages and environments.",
      resumeCta: "Explore my experience and resume",
      projectsCta: "Explore the projects and their technical choices",
      proofLabel: "What this portfolio shows",
      proofText:
        "Projects, a professional path, and technical choices explained with their validation and known limitations.",
    },
    resume: {
      description:
        "Ethan Brosselard’s resume: junior backend developer, Python APIs, data, RAG, AWS, C++ and TypeScript projects. Seeking permanent or fixed-term remote work.",
      eyebrow: "Background",
      title: "Resume and experience",
      intro: "A structured overview of my background, skills, and the projects that support them.",
      download: "Download PDF",
      portfolio: "Portfolio",
      present: "Present",
      contact: "Contact and links",
      profile: "Profile",
      experience: "Work experience",
      education: "Education",
      skills: "Skills",
      languages: "Languages",
      projects: "Projects",
    },
    contact: {
      description:
        "Contact Ethan Brosselard about a backend role: APIs, applied AI, data and cloud, with openness to different languages. Seeking permanent or fixed-term remote work.",
      eyebrow: "Contact",
      title: "Let’s talk about your team.",
      intro:
        "Hiring a backend developer? I’m seeking permanent or fixed-term remote work, with experience primarily in Python and openness to other languages, as well as AI, data and cloud work.",
      searchLabel: "Current job search",
      emailLabel: "Email",
      copyEmail: "Copy address",
      copiedEmail: "Address copied",
      copyEmailError: "The address could not be copied. You can select it or open your email app.",
      openEmail: "Open email app",
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
        "Cloudflare Workers Static Assets provides production hosting. The website’s files are generated statically and delivered through Cloudflare’s global network. Cloudflare also provides the TLS certificate, redirects HTTP to HTTPS, and redirects www to the canonical domain; no application function, database, or other runtime runs for public pages.",
      intellectualPropertyTitle: "Intellectual property",
      intellectualPropertyText:
        "Original source code is made available under the terms and scope defined in the repository’s LICENSE file. Portfolio copy, biographical data, project narratives, visual-identity elements, and media are not covered by that license and remain protected by intellectual-property law. Their full or partial reproduction, representation, or adaptation requires the prior permission of the rightsholder. Third-party material remains subject to its respective rights.",
      externalLinksTitle: "External links",
      externalLinksText:
        "Links to third-party sites are provided for information only. Their content, availability, and privacy practices remain the responsibility of their respective publishers.",
      updatedLabel: "Last updated",
      updatedValue: "9 September 2026",
    },
    privacy: {
      eyebrow: "Personal data",
      title: "Privacy policy",
      intro: "This website is designed to minimize the collection and use of personal data.",
      controllerTitle: "Controller",
      controllerText:
        "Ethan Brosselard is responsible for the processing activities he determines for this website. Cloudflare processes certain technical data to provide the infrastructure under its Data Processing Addendum and, where it determines its own purposes, under its Privacy Policy. For a question or request about your data, you can write to the address below.",
      contactLabel: "Contact",
      collectionTitle: "Data processed",
      collectionText:
        "The site has no form, account, newsletter, or embedded third-party content. It enables no browser-side visitor analytics and sets no advertising or analytics cookies; an ordinary visit receives no response cookie from the site. Cloudflare may nevertheless set a strictly necessary cookie when a security mechanism is triggered. If you change it, your theme preference is kept solely in your browser’s local storage under the key “portfolio-theme”; it never leaves your device.",
      emailTitle: "Messages sent by email",
      emailText:
        "If you choose to write to the displayed email address, your email address and the content of your message are used solely to read and reply to your request. The message is sent directly through your email provider and the recipient’s; it does not pass through the website.",
      technicalTitle: "Technical logs",
      technicalText:
        "The portfolio’s versioned configuration disables Workers Logs, log exports, dependency instrumentation, Wrangler telemetry, and browser-side visitor analytics. To deliver static files, terminate TLS, cache resources, apply redirects, and secure the site, Cloudflare nevertheless processes technical connection data that may include IP addresses, routing information, system configuration, and traffic information. Cloudflare also produces aggregate technical metrics.",
      purposeTitle: "Purposes and legal basis",
      purposeText:
        "Received messages are processed to reply to their sender. The infrastructure is used to deliver content, cache resources, keep the service available, and protect the website. Processing determined by the publisher relies on his legitimate interest in responding to messages and providing a reliable and secure website. Cloudflare’s Privacy Policy describes the purposes and legal bases it applies to processing it determines itself.",
      recipientsTitle: "Recipients and retention",
      recipientsText:
        "Only Ethan Brosselard accesses received messages. Email providers and Cloudflare may process the data strictly necessary to provide their services. Messages are kept for the time needed to follow up an exchange; Cloudflare’s retention of technical data depends on its nature, the service configuration, and applicable obligations.",
      transfersTitle: "International transfers",
      transfersText:
        "Cloudflare is a global provider. Technical data may be processed outside the European Economic Area, including in the United States. Cloudflare states that it safeguards these transfers through the EU–US Data Privacy Framework and, where applicable, the European Commission’s Standard Contractual Clauses.",
      cloudflarePrivacyLabel: "Cloudflare Privacy Policy",
      cloudflareDpaLabel: "Cloudflare Data Processing Addendum",
      rightsTitle: "Your rights",
      rightsText:
        "Depending on applicable law, you may request access to, rectification or erasure of, restriction of, or objection to the processing of your data. You may also lodge a complaint with the CNIL. To exercise your rights in relation to this website, contact Ethan Brosselard by email.",
      changesTitle: "Changes to this policy",
      changesText:
        "This policy was reviewed after the first production deployment on 8 September 2026. It will be updated before adding a form, analytics tool, tracking cookie, embedded third-party content, or Cloudflare mechanism that changes the processing described here.",
      updatedLabel: "Last updated",
      updatedValue: "8 September 2026",
    },
    visual: {
      infrastructure: {
        heading: "TARGET ARCHITECTURE",
        host: "Proxmox VE",
        hostDetail: "Virtualisation · single server",
        nodes: [
          { name: "Foundation", detail: "DNS · identity · access" },
          { name: "Applications", detail: "Files · media · tools" },
          { name: "Public projects", detail: "Ludosaic · Palimia" },
          { name: "Home automation", detail: "Home Assistant OS" },
          { name: "Recovery", detail: "Proxmox Backup Server" },
        ],
        backup: "Restic · independent backup",
        footer: "PLANNED · NO SERVICES DEPLOYED",
      },
      library: {
        profile: "ONE PROFILE",
        library: "CULTURAL LIBRARY",
        worlds: "ALL YOUR WORLDS",
        media: ["FILM", "SERIES", "GAME"],
        actions: ["TRACK", "RATE", "ORGANIZE"],
      },
    },
    project: {
      authorship: "Personal project",
      next: "Continue exploring",
      contact: "Discuss this project",
      back: "All projects",
      stack: "Technical foundation",
      evidence: "Documented technical validation",
      evidenceNote: "Each measurement identifies its type, context, and source.",
      metricKinds: {
        local: "Local validation",
        production: "Production measurement",
        user: "User outcome",
      },
      source: "Source",
      decision: "Technical decision",
      flow: "How it works",
      contents: "In this case study",
      enlargeCapture: "Enlarge screenshot",
      captureDetail: "View an interface detail",
    },
    footer: {
      navigationLabel: "Navigation links",
      note: "Projects, architecture decisions, and technical validation.",
      noTracking: "No browser-side visitor analytics or tracking cookies.",
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
