export const profile = {
  name: "Ethan Brosselard",
  brand: "ZayKo",
  siteUrl: "https://ethanbrosselard.com",
  email: "ethan.brosselard@gmail.com",
  location: "Paris, France",
  jobSearch: {
    workingLanguage: {
      fr: "Équipe travaillant en français",
      en: "French-speaking team",
    },
    attendance: {
      fr: "En télétravail intégral, des déplacements ponctuels sont possibles pour l’intégration, les réunions ou les séminaires.",
      en: "For fully remote roles, I can attend onboarding, meetings or team events in person occasionally.",
    },
    companyPreference: {
      fr: "Sans préférence",
      en: "No preference",
    },
  },
  languages: ["fr", "en"],
  socials: {
    github: "https://github.com/ZayKox",
    linkedin: "https://www.linkedin.com/in/ethan-brosselard/",
  },
  resume: {
    fr: "/cv/ethan-brosselard-cv-fr.pdf",
    en: "/cv/ethan-brosselard-resume-en.pdf",
  },
  portrait: {
    src: "/images/ethan-brosselard-640.webp",
    smallSrc: "/images/ethan-brosselard-320.webp",
    width: 640,
    height: 640,
    alt: {
      fr: "Portrait d’Ethan Brosselard",
      en: "Portrait of Ethan Brosselard",
    },
  },
} as const;

export type Profile = typeof profile;
