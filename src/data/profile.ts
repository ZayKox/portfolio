export const profile = {
  name: "Ethan Brosselard",
  brand: "ZayKo",
  monogram: "ZK",
  email: "ethan.brosselard@gmail.com",
  location: "Paris, France",
  languages: ["fr", "en"],
  socials: {
    github: "https://github.com/ZayKox",
    linkedin: "https://www.linkedin.com/in/ethan-brosselard-507334237/",
  },
  resume: {
    fr: "/cv/ethan-brosselard-cv-fr.pdf",
    en: "/cv/ethan-brosselard-resume-en.pdf",
  },
  portrait: null,
} as const;

export type Profile = typeof profile;
