import { loadProjects } from "./project-content.mjs";
try {
  const projects = loadProjects();
  console.log(
    `Validated ${projects.length / 2} bilingual project pairs: shared schema, publication review, metric facts and narrative structure. Translation meaning still requires review.`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
