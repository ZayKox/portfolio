import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/projects",
    generateId: ({ data }) => `${String(data.locale)}/${String(data.slug)}`,
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    locale: z.enum(["fr", "en"]),
    order: z.number().int().positive(),
    featured: z.boolean().default(false),
    publication: z.enum(["draft", "teaser", "published"]),
    eyebrow: z.string(),
    kind: z.string(),
    summary: z.string(),
    stack: z.array(z.string()).min(1),
    visual: z.enum(["myverse", "calls"]),
    socialImage: z.string().regex(/^\/[a-z0-9-]+\.png$/),
    socialImageAlt: z.string().min(1),
    metrics: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .optional(),
  }),
});

export const collections = { projects };
