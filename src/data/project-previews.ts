import palimia from "@/assets/projects/palimia/library.webp";
import ludosaic from "@/assets/projects/ludosaic/catalog.webp";

export const projectPreviews = {
  palimia: {
    image: palimia,
    alt: {
      fr: "Bibliothèque Palimia en mode sombre, avec des films de démonstration et leurs affiches.",
      en: "Palimia library in dark mode, with demonstration movies and their posters.",
    },
  },
  ludosaic: {
    image: ludosaic,
    alt: {
      fr: "Catalogue Ludosaic présentant Grid Duel, Merge Forge et Reflex Rush.",
      en: "Ludosaic catalog showing Grid Duel, Merge Forge, and Reflex Rush.",
    },
  },
} as const;
