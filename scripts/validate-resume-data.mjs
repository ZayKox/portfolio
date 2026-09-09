import { readFile } from "node:fs/promises";
import { resumeSchema } from "../src/data/resume-schema.mjs";
import { loadProjects } from "./project-content.mjs";

const resume = resumeSchema.parse(JSON.parse(await readFile("src/data/resume.json", "utf8")));
const projects = loadProjects();
for (const locale of ["fr", "en"]) {
  for (const group of resume[locale].projectGroups) {
    for (const item of group.items) {
      if (
        item.slug &&
        !projects.some(
          ({ data }) =>
            data.locale === locale && data.slug === item.slug && data.publication !== "draft",
        )
      )
        throw new Error(`Resume links to a missing or draft ${locale} project: ${item.slug}`);
    }
  }
}
console.log(
  "Validated structured resume, shared timeline, bilingual identifiers, and public project links.",
);
