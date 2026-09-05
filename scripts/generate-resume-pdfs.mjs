import { createServer } from "node:http";
import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const distDirectory = path.join(root, "dist");
const outputDirectory = path.join(root, "public", "cv");
const jobs = [
  { route: "/cv/", filename: "ethan-brosselard-cv-fr.pdf" },
  { route: "/en/resume/", filename: "ethan-brosselard-resume-en.pdf" },
];

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".woff2", "font/woff2"],
]);

function requestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://127.0.0.1").pathname);
  const relativePath = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const resolved = path.resolve(distDirectory, `.${relativePath}`);
  return resolved.startsWith(`${distDirectory}${path.sep}`) ? resolved : undefined;
}

const server = createServer(async (request, response) => {
  const filePath = requestPath(request.url ?? "/");
  if (!filePath) {
    response.writeHead(400).end();
    return;
  }

  try {
    if (!(await stat(filePath)).isFile()) throw new Error("Not a file");
    const contents = await readFile(filePath);
    response.writeHead(200, {
      "content-type": contentTypes.get(path.extname(filePath)) ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    response.end(contents);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
if (!address || typeof address === "string") throw new Error("Could not start the PDF server.");

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const job of jobs) {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${address.port}${job.route}`, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: path.join(outputDirectory, job.filename),
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true,
    });
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

console.log(`Generated ${jobs.length} resume PDFs in ${path.relative(root, outputDirectory)}.`);
