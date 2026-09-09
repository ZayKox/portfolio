import { z } from "astro/zod";

const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const localized = z.object({ fr: text, en: text }).strict();
const date = z.string().regex(/^\d{4}(?:-(?:0[1-9]|1[0-2]))?$/);
const timelineEntry = z
  .object({
    organization: localized,
    location: localized.optional(),
    start: date,
    end: date.nullable(),
  })
  .strict()
  .refine(
    (entry) =>
      entry.end === null || (entry.start.length === entry.end.length && entry.start <= entry.end),
    "Timeline dates must have matching precision and chronological order",
  );
const entry = z
  .object({
    id,
    title: text,
    summary: text.optional(),
    highlights: z.array(text).min(1).optional(),
    technologies: text.optional(),
  })
  .strict();
const language = z
  .object({
    role: text,
    summary: text,
    experience: z.array(entry).min(1),
    education: z.array(entry).min(1),
    skillGroups: z.array(z.object({ id, category: text, items: text }).strict()),
    languages: z.array(z.object({ id: z.enum(["fr", "en"]), name: text, level: text }).strict()),
    projectGroups: z.array(
      z
        .object({
          id,
          title: text,
          items: z
            .array(z.object({ id, title: text, description: text, slug: id.optional() }).strict())
            .min(1),
        })
        .strict(),
    ),
  })
  .strict();

export const resumeSchema = z
  .object({
    timeline: z.record(id, timelineEntry),
    fr: language,
    en: language,
  })
  .strict()
  .superRefine((resume, ctx) => {
    const issue = (message) => ctx.addIssue({ code: "custom", message });
    const used = new Set();
    for (const section of [
      "experience",
      "education",
      "skillGroups",
      "languages",
      "projectGroups",
    ]) {
      const fr = resume.fr[section],
        en = resume.en[section];
      const ids = fr.map((entry) => entry.id);
      if (
        new Set(ids).size !== ids.length ||
        JSON.stringify(ids) !== JSON.stringify(en.map((entry) => entry.id))
      )
        issue(`${section}: unique matching FR/EN identifiers required`);
      if (["experience", "education"].includes(section)) {
        for (const entry of [...fr, ...en]) {
          if (!resume.timeline[entry.id]) issue(`${section}: missing timeline fact ${entry.id}`);
          used.add(entry.id);
        }
      }
    }
    for (const key of Object.keys(resume.timeline))
      if (!used.has(key)) issue(`Unused timeline fact ${key}`);
    for (const group of resume.fr.projectGroups) {
      const equivalent = resume.en.projectGroups.find((item) => item.id === group.id);
      const facts = (items) => items.map(({ id, slug }) => [id, slug ?? null]);
      if (
        new Set(group.items.map((item) => item.id)).size !== group.items.length ||
        JSON.stringify(facts(group.items)) !== JSON.stringify(facts(equivalent?.items ?? []))
      )
        issue(`Project identifiers or links differ for ${group.id}`);
    }
  });
