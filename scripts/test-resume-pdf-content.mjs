import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { jobs } from "./resume-artifacts.mjs";

const expectations = {
  "ethan-brosselard-cv-fr.pdf": {
    language: "fr",
    title: "CV — Ethan Brosselard",
    role: "Développeur logiciel junior",
    objective: "CDI ou CDD · Télétravail",
    headings: [
      "Profil",
      "Expériences professionnelles",
      "Compétences",
      "Formation",
      "Projets",
      "Langues",
    ],
    localLinks: [
      "https://ethanbrosselard.com/",
      "https://ethanbrosselard.com/projets/ludosaic/",
      "https://ethanbrosselard.com/projets/palimia/",
    ],
  },
  "ethan-brosselard-resume-en.pdf": {
    language: "en",
    title: "Resume — Ethan Brosselard",
    role: "Junior Software Developer",
    objective: "Permanent or fixed-term employment · Remote",
    headings: ["Profile", "Work experience", "Skills", "Education", "Projects", "Languages"],
    localLinks: [
      "https://ethanbrosselard.com/en/",
      "https://ethanbrosselard.com/en/projects/ludosaic/",
      "https://ethanbrosselard.com/en/projects/palimia/",
    ],
  },
};

const expectedLinks = [
  "mailto:ethan.brosselard@gmail.com",
  "https://github.com/ZayKox",
  "https://www.linkedin.com/in/ethan-brosselard/",
];

for (const job of jobs) {
  test(`${job.filename} contains readable, tagged, localized resume content`, async () => {
    const loadingTask = getDocument({
      url: pathToFileURL(path.resolve("public/cv", job.filename)).href,
    });
    const document = await loadingTask.promise;
    try {
      const expected = expectations[job.filename];
      assert(expected, `Missing expectations for ${job.filename}`);
      assert.equal(document.numPages, 1, "The complete resume must fit on one readable page");
      const { info, hasStructTree } = await document.getMetadata();
      assert.equal(info.Language, expected.language);
      assert.equal(info.Title, expected.title);
      assert.equal(info.IsAcroFormPresent, false);
      assert.equal(info.IsXFAPresent, false);
      assert.equal(info.IsSignaturesPresent, false);
      assert.equal(hasStructTree, true);

      const text = [];
      const links = new Set();
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        text.push(content.items.map((item) => item.str).join(" "));
        for (const annotation of await page.getAnnotations()) {
          if (annotation.url) links.add(annotation.url);
        }
        const structure = await page.getStructTree();
        assert(structure?.children?.length, `Page ${pageNumber} has no structure tree`);
      }

      const normalizedText = text.join(" ").replace(/\s+/g, " ");
      assert.match(normalizedText, /Ethan Brosselard/);
      assert(normalizedText.includes(expected.role));
      assert(normalizedText.includes(expected.objective));
      let previousHeading = -1;
      for (const heading of expected.headings) {
        // Preserve word boundaries: stripping every space masked letter-spaced headings.
        const position = normalizedText.indexOf(heading);
        assert(position > previousHeading, `${heading} must extract intact and in reading order`);
        previousHeading = position;
      }
      assert(!/\b(?:TODO|TBD|coming soon)\b/i.test(normalizedText));
      assert.deepEqual([...links].sort(), [...expectedLinks, ...expected.localLinks].sort());
    } finally {
      await loadingTask.destroy();
    }
  });
}
