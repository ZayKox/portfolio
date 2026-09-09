import data from "./resume.json";
import { resumeSchema } from "./resume-schema.mjs";
import { getCopy, type Locale } from "@/i18n/copy";

const resume = resumeSchema.parse(data);
export function getResume(locale: Locale) {
  const formatDate = (value: string) => {
    if (value.length === 4) return value;
    const result = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${value}-01T12:00:00Z`));
    return result.charAt(0).toUpperCase() + result.slice(1);
  };
  const localize = (entry: (typeof resume.fr.experience)[number]) => {
    const fact = resume.timeline[entry.id];
    if (!fact) throw new Error(`Missing resume timeline: ${entry.id}`);
    return {
      ...entry,
      organization: fact.organization[locale],
      location: fact.location?.[locale],
      period: `${formatDate(fact.start)} — ${fact.end ? formatDate(fact.end) : getCopy(locale).resume.present}`,
    };
  };
  return {
    ...resume[locale],
    experience: resume[locale].experience.map(localize),
    education: resume[locale].education.map(localize),
  };
}
