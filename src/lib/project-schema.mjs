import { z } from "astro/zod";

const text = z.string().trim().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const date = z.iso.date();
const disposition = z
  .object({
    status: z.enum(["included", "not-applicable", "withheld"]),
    note: text,
  })
  .strict();
export const projectSchema = z
  .object({
    title: text,
    slug,
    locale: z.enum(["fr", "en"]),
    order: z.number().int().positive(),
    featured: z.boolean().default(false),
    publication: z.enum(["draft", "teaser", "published"]),
    eyebrow: text,
    kind: text,
    summary: text,
    shortSummary: text,
    stack: z.array(text).min(1),
    visual: z.enum(["cultural-library", "game-tiles", "typographic"]),
    visualItems: z.array(text).min(1).max(4).optional(),
    socialImage: z.string().regex(/^\/[a-z0-9-]+\.png$/),
    socialImageAlt: text,
    review: z
      .object({
        reviewedOn: date,
        approvedBy: z.literal("Ethan Brosselard"),
        factsApproved: z.literal(true),
        translationApproved: z.literal(true),
        media: disposition,
        evidence: disposition,
      })
      .strict()
      .optional(),
    metrics: z
      .array(
        z
          .object({
            id: slug,
            value: text,
            label: text,
            kind: z.enum(["local", "production", "user"]),
            measuredOn: date,
            context: text,
            source: text,
            approved: z.literal(true),
          })
          .strict(),
      )
      .min(1)
      .optional(),
  })
  .strict()
  .superRefine((project, ctx) => {
    if (project.publication === "published" && !project.review) {
      ctx.addIssue({
        code: "custom",
        path: ["review"],
        message:
          "Published case studies need explicit factual, translation, media and evidence review",
      });
    }
    if (project.visual === "game-tiles" && !project.visualItems) {
      ctx.addIssue({
        code: "custom",
        path: ["visualItems"],
        message: "Game tiles require their own approved labels",
      });
    }
    const ids = project.metrics?.map((metric) => metric.id) ?? [];
    if (new Set(ids).size !== ids.length)
      ctx.addIssue({
        code: "custom",
        path: ["metrics"],
        message: "Metric identifiers must be unique",
      });
  });
