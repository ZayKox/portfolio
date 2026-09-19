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
    headings: ["EXPÉRIENCES", "FORMATION", "COMPÉTENCES", "LANGUES", "PROJETS"],
    localLinks: [
      "https://ethanbrosselard.com/",
      "https://ethanbrosselard.com/projets/ludosaic/",
      "https://ethanbrosselard.com/projets/palimia/",
    ],
  },
  "ethan-brosselard-resume-en.pdf": {
    language: "en",
    title: "Resume — Ethan Brosselard",
    headings: ["EXPERIENCE", "EDUCATION", "SKILLS", "LANGUAGES", "PROJECTS"],
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
  "https://www.linkedin.com/in/ethan-brosselard-507334237/",
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
      assert.equal(document.numPages, 2);
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
      const compactText = normalizedText.replace(/\s+/g, "");
      assert.match(normalizedText, /Ethan Brosselard/);
      for (const heading of expected.headings)
        assert(compactText.includes(heading.replace(/\s+/g, "")), heading);
      assert(!/\b(?:TODO|TBD|coming soon)\b/i.test(normalizedText));
      assert.deepEqual([...links].sort(), [...expectedLinks, ...expected.localLinks].sort());
    } finally {
      await loadingTask.destroy();
    }
  });
}
