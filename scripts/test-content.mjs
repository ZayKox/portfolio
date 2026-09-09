import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { projectSchema } from "../src/lib/project-schema.mjs";
import { resumeSchema } from "../src/data/resume-schema.mjs";
import { loadProjects, assertProjectParity, parseProject } from "./project-content.mjs";
import { createRouteCatalog } from "./route-catalog.mjs";

const projects = loadProjects();
const seed = projects.find(({ data }) => data.locale === "fr").data;
const review = {
  reviewedOn: "2026-09-09",
  approvedBy: "Ethan Brosselard",
  factsApproved: true,
  translationApproved: true,
  media: { status: "withheld", note: "Fixture only" },
  evidence: { status: "included", note: "Fixture only" },
};
test("published entries require an explicit complete review", () => {
  assert.equal(
    projectSchema.safeParse({ ...seed, publication: "published", review: undefined }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({ ...seed, publication: "published", review }).success,
    true,
  );
  assert.equal(
    projectSchema.safeParse({
      ...seed,
      publication: "published",
      review: { ...review, translationApproved: false },
    }).success,
    false,
  );
});
test("measurements without provenance, context, or a valid date are rejected", () => {
  assert.equal(
    projectSchema.safeParse({ ...seed, metrics: [{ value: "10", label: "Tests" }] }).success,
    false,
  );
  const metric = {
    id: "tests",
    value: "10",
    label: "Tests",
    kind: "local",
    measuredOn: "2026-09-09",
    context: "Fixture environment",
    source: "Fixture test run",
    approved: true,
  };
  assert.equal(projectSchema.safeParse({ ...seed, metrics: [metric] }).success, true);
  for (const field of ["context", "source", "measuredOn", "approved"]) {
    const invalid = { ...metric };
    delete invalid[field];
    assert.equal(projectSchema.safeParse({ ...seed, metrics: [invalid] }).success, false, field);
  }
  assert.equal(
    projectSchema.safeParse({ ...seed, metrics: [{ ...metric, measuredOn: "2026-02-30" }] })
      .success,
    false,
  );
});
test("missing translations and differing metric facts fail parity", () => {
  assert.throws(() => assertProjectParity(projects.slice(1)), /missing translation/);
  const changed = structuredClone(projects);
  changed[0].data.publication = "draft";
  assert.throws(() => assertProjectParity(changed), /publication differs/);
  const measured = structuredClone(projects);
  measured[0].data.metrics = [
    { id: "fixture", value: "10", kind: "local", measuredOn: "2026-09-09", approved: true },
  ];
  assert.throws(() => assertProjectParity(measured), /metric facts differ/);
});
test("a third project gets routes and alternates without a manual list change", () => {
  const additions = ["fr", "en"].map((locale) => ({
    data: projectSchema.parse({
      ...seed,
      slug: "fixture-third",
      locale,
      order: 99,
      visual: "typographic",
    }),
    body: "## Fixture\nTest",
    filename: `${locale}/fixture-third.mdx`,
  }));
  assertProjectParity([...projects, ...additions]);
  const catalog = createRouteCatalog([...projects, ...additions]);
  assert(catalog.publicRoutes.some(({ path }) => path === "/projets/fixture-third/"));
  assert(catalog.languagePairs.some(({ en }) => en === "/en/projects/fixture-third/"));
  additions.forEach(({ data }) => (data.publication = "draft"));
  assert(
    !createRouteCatalog([...projects, ...additions]).publicRoutes.some(({ path }) =>
      path.includes("fixture-third"),
    ),
  );
});
test("YAML duplicate keys fail instead of silently changing a publication decision", () => {
  const source = readFileSync("src/content/projects/fr/palimia.mdx", "utf8");
  assert.throws(
    () =>
      parseProject(
        source.replace(/publication: \w+/, "publication: teaser\npublication: published"),
        "fixture",
      ),
    /duplicated mapping key/,
  );
});
test("resume rejects unknown contacts, missing timeline facts, invalid chronology and unpaired items", () => {
  const resume = JSON.parse(readFileSync("src/data/resume.json", "utf8"));
  assert.equal(resumeSchema.safeParse(resume).success, true);
  for (const change of [
    (value) => (value.fr.contact = [{ href: "https://example.com" }]),
    (value) => delete value.timeline.beyowi,
    (value) => (value.timeline.beyowi.end = "2022-01"),
    (value) => value.en.experience.pop(),
    (value) => (value.en.projectGroups[0].items[0].slug = "different-project"),
    (value) => delete value.timeline.beyowi.organization.en,
  ]) {
    const invalid = structuredClone(resume);
    change(invalid);
    assert.equal(resumeSchema.safeParse(invalid).success, false);
  }
});
