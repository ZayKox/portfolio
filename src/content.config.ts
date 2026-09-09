import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { projectSchema } from "./lib/project-schema.mjs";

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/projects",
    generateId: ({ data }) => `${String(data.locale)}/${String(data.slug)}`,
  }),
  schema: projectSchema,
});

export const collections = { projects };
