import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { load, JSON_SCHEMA } from "js-yaml";
import { projectSchema } from "../src/lib/project-schema.mjs";

export function parseProject(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${filename}: expected YAML frontmatter`);
  const data = projectSchema.parse(load(match[1], { schema: JSON_SCHEMA, filename }));
  const body = match[2].trim();
  if (!body) throw new Error(`${filename}: missing narrative`);
  return { data, body, filename };
}

export function loadProjects(root = process.cwd()) {
  const projects = [];
  for (const locale of ["fr", "en"]) {
    const directory = path.join(root, "src/content/projects", locale);
    for (const filename of readdirSync(directory)
      .filter((name) => /\.mdx?$/.test(name))
      .sort()) {
      const project = parseProject(
        readFileSync(path.join(directory, filename), "utf8"),
        `${locale}/${filename}`,
      );
      if (project.data.locale !== locale || project.data.slug !== filename.replace(/\.mdx?$/, ""))
        throw new Error(`${project.filename}: locale and slug must match its path`);
      projects.push(project);
    }
  }
  assertProjectParity(projects);
  return projects;
}

export function assertProjectParity(projects) {
  const lookup = new Map();
  const orders = new Set();
  for (const entry of projects) {
    const { locale, slug, order } = entry.data;
    const key = `${locale}/${slug}`;
    if (lookup.has(key) || orders.has(`${locale}/${order}`))
      throw new Error(`${key}: duplicate slug or order`);
    lookup.set(key, entry);
    orders.add(`${locale}/${order}`);
  }
  for (const slug of new Set(projects.map(({ data }) => data.slug))) {
    const fr = lookup.get(`fr/${slug}`),
      en = lookup.get(`en/${slug}`);
    if (!fr || !en) throw new Error(`${slug}: missing translation`);
    for (const field of [
      "slug",
      "order",
      "featured",
      "publication",
      "stack",
      "visual",
      "visualItems",
      "socialImage",
    ]) {
      if (JSON.stringify(fr.data[field]) !== JSON.stringify(en.data[field]))
        throw new Error(`${slug}: ${field} differs between languages`);
    }
    const facts = (data) => ({
      review: data.review && {
        date: data.review.reviewedOn,
        by: data.review.approvedBy,
        facts: data.review.factsApproved,
        translation: data.review.translationApproved,
        media: data.review.media.status,
        evidence: data.review.evidence.status,
      },
      metrics: data.metrics?.map(({ id, value, kind, measuredOn, approved }) => ({
        id,
        value,
        kind,
        measuredOn,
        approved,
      })),
    });
    if (JSON.stringify(facts(fr.data)) !== JSON.stringify(facts(en.data)))
      throw new Error(`${slug}: review or metric facts differ between languages`);
    if ((fr.body.match(/^##\s+/gm)?.length ?? 0) !== (en.body.match(/^##\s+/gm)?.length ?? 0))
      throw new Error(
        `${slug}: narrative structure differs; translation still requires human review`,
      );
  }
}
