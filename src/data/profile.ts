export const profile = {
  name: "Ethan Brosselard",
  handle: "ZayKo",
  email: "ethan.brosselard@gmail.com",
  location: "Paris, France",
  languages: ["fr", "en"],
  socials: {
    github: "https://github.com/ZayKox",
    linkedin: "https://www.linkedin.com/in/ethan-brosselard-507334237/",
  },
  resume: null,
  portrait: null,
} as const;

export type Profile = typeof profile;
