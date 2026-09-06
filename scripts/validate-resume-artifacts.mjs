import { validateResumeArtifacts } from "./resume-artifacts.mjs";
try {
  await validateResumeArtifacts(process.cwd());
  console.log("Resume PDFs match their sources and recorded output hashes.");
} catch (error) {
  console.error(`Resume validation failed: ${error.message}`);
  process.exitCode = 1;
}
