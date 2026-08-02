import { access, readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outputDirectory = path.join(root, "dist");
const errors = [];
const previewMode = process.env.SITE_NOINDEX === "true";
const internalReferences = new Set();
const allowedGitHubProfileUrl = "https://github.com/ZayKox";
const privateUsername = new URL(allowedGitHubProfileUrl).pathname.slice(1).replace(/x$/i, "");

const expectedRoutes = [
  "/",
  "/a-propos/",
  "/contact/",
  "/projets/",
  "/projets/filtre-appels/",
  "/projets/myverse/",
  "/en/",
  "/en/about/",
  "/en/contact/",
  "/en/projects/",
  "/en/projects/filtre-appels/",
  "/en/projects/myverse/",
  "/404.html",
];
const expectedRouteSet = new Set(expectedRoutes);
const languagePairs = [
  { fr: "/", en: "/en/" },
  { fr: "/a-propos/", en: "/en/about/" },
  { fr: "/contact/", en: "/en/contact/" },
  { fr: "/projets/", en: "/en/projects/" },
  { fr: "/projets/filtre-appels/", en: "/en/projects/filtre-appels/" },
  { fr: "/projets/myverse/", en: "/en/projects/myverse/" },
];

const forbiddenPlaceholders = [
  "À REMPLIR",
  "À CONFIRMER",
  "TODO",
  "TBD",
  "coming soon",
  "Cette page évoluera",
  "This page will evolve",
  "Étude en construction",
  "Case study in progress",
  "L’étude de cas finale ajoutera",
  "The final case study will add",
];
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /gh[pousr]_[A-Za-z0-9]{36,}/,
  /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /AIza[0-9A-Za-z_-]{35}/,
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(entryPath) : [entryPath];
    }),
  );

  return files.flat();
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=(["'])(.*?)\\1`, "i"));
  return match?.[2];
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(([tag]) => tag);
}

function pngDimensions(contents) {
  const signature = "89504e470d0a1a0a";
  if (contents.length < 24 || contents.subarray(0, 8).toString("hex") !== signature) {
    return undefined;
  }
  return { width: contents.readUInt32BE(16), height: contents.readUInt32BE(20) };
}

function pathname(reference) {
  if (typeof reference !== "string") return undefined;

  try {
    return decodeURIComponent(new URL(reference, "https://portfolio.local").pathname);
  } catch {
    return undefined;
  }
}

function routeFromFile(file) {
  const relativePath = path.relative(outputDirectory, file).split(path.sep).join("/");
  if (relativePath === "index.html") return "/";
  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.slice(0, -"index.html".length)}`;
  }
  return `/${relativePath}`;
}

function routeCandidates(reference) {
  const cleanPath = pathname(reference);
  if (!cleanPath) return [];

  const relativePath = cleanPath.replace(/^\/+/, "");
  if (cleanPath === "/") {
    return [path.join(outputDirectory, "index.html")];
  }
  if (cleanPath.endsWith("/")) {
    return [path.join(outputDirectory, relativePath, "index.html")];
  }
  return [
    path.join(outputDirectory, relativePath),
    path.join(outputDirectory, `${relativePath}.html`),
    path.join(outputDirectory, relativePath, "index.html"),
  ];
}

function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const normalized =
      hex.length === 4
        ? `#${hex
            .slice(1)
            .split("")
            .map((character) => character.repeat(2))
            .join("")}`
        : hex;
    const channels = normalized
      .slice(1)
      .match(/../g)
      .map((channel) => Number.parseInt(channel, 16) / 255)
      .map((channel) =>
        channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
      );
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };

  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function validateReference(reference, source) {
  if (reference.startsWith("javascript:")) {
    errors.push(`${source}: unsafe javascript link found`);
    return;
  }
  if (reference.startsWith("http://")) {
    errors.push(`${source}: insecure external reference: ${reference}`);
    return;
  }
  if (reference.startsWith("https://")) {
    try {
      new URL(reference);
    } catch {
      errors.push(`${source}: malformed external reference: ${reference}`);
    }
    return;
  }
  if (!reference.startsWith("/") || reference.startsWith("//")) return;

  internalReferences.add(reference);
  const candidates = routeCandidates(reference);
  if (!(await Promise.all(candidates.map(exists))).some(Boolean)) {
    errors.push(`${source}: internal reference does not resolve: ${reference}`);
  }
}

function validateLanguageLinks(html, relativePath, route) {
  const alternateLinks = tags(html, "link").filter(
    (tag) => attribute(tag, "rel")?.toLowerCase() === "alternate",
  );
  const alternateByLocale = new Map(
    alternateLinks.map((tag) => [attribute(tag, "hreflang"), attribute(tag, "href")]),
  );

  for (const language of ["fr", "en", "x-default"]) {
    if (!alternateByLocale.has(language)) {
      errors.push(`${relativePath}: missing ${language} alternate link`);
    }
  }

  const pair = languagePairs.find((candidate) => candidate.fr === route || candidate.en === route);
  if (!pair) return;

  for (const [language, expectedPath] of [
    ["fr", pair.fr],
    ["en", pair.en],
    ["x-default", pair.fr],
  ]) {
    const actualPath = pathname(alternateByLocale.get(language));
    if (actualPath !== expectedPath) {
      errors.push(
        `${relativePath}: ${language} alternate points to ${actualPath ?? "nothing"}, expected ${expectedPath}`,
      );
    }
  }

  const otherLanguage = route === pair.fr ? "en" : "fr";
  const expectedSwitchPath = pair[otherLanguage];
  const languageSwitch = tags(html, "a").find(
    (tag) => attribute(tag, "hreflang") === otherLanguage,
  );
  const actualSwitchPath = pathname(languageSwitch && attribute(languageSwitch, "href"));
  if (actualSwitchPath !== expectedSwitchPath) {
    errors.push(
      `${relativePath}: language switch points to ${actualSwitchPath ?? "nothing"}, expected ${expectedSwitchPath}`,
    );
  }
  if (attribute(languageSwitch ?? "", "lang") !== otherLanguage) {
    errors.push(`${relativePath}: language switch is missing lang=${otherLanguage}`);
  }
  if (!attribute(languageSwitch ?? "", "aria-label")?.trim()) {
    errors.push(`${relativePath}: language switch has no accessible name`);
  }
}

function validateDocument(html, relativePath, route) {
  const htmlTag = tags(html, "html")[0];
  const locale = htmlTag && attribute(htmlTag, "lang");
  const expectedLocale = route.startsWith("/en/") ? "en" : "fr";
  if (!locale || !["fr", "en"].includes(locale)) {
    errors.push(`${relativePath}: missing or unsupported html lang`);
  } else if (locale !== expectedLocale) {
    errors.push(`${relativePath}: html lang=${locale}, expected ${expectedLocale}`);
  }

  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  if (!title) errors.push(`${relativePath}: missing title`);

  const descriptionTag = tags(html, "meta").find(
    (tag) => attribute(tag, "name")?.toLowerCase() === "description",
  );
  const description = descriptionTag && attribute(descriptionTag, "content")?.trim();
  if (!description) errors.push(`${relativePath}: missing meta description`);

  const favicon = tags(html, "link").find((tag) => attribute(tag, "rel")?.toLowerCase() === "icon");
  if (
    attribute(favicon ?? "", "href") !== "/favicon.png" ||
    attribute(favicon ?? "", "type") !== "image/png" ||
    attribute(favicon ?? "", "sizes") !== "64x64"
  ) {
    errors.push(`${relativePath}: favicon metadata is incomplete`);
  }
  const appleTouchIcon = tags(html, "link").find(
    (tag) => attribute(tag, "rel")?.toLowerCase() === "apple-touch-icon",
  );
  if (
    attribute(appleTouchIcon ?? "", "href") !== "/apple-touch-icon.png" ||
    attribute(appleTouchIcon ?? "", "sizes") !== "180x180"
  ) {
    errors.push(`${relativePath}: Apple touch icon metadata is incomplete`);
  }

  const robotsTag = tags(html, "meta").find(
    (tag) => attribute(tag, "name")?.toLowerCase() === "robots",
  );
  const noindex = attribute(robotsTag ?? "", "content")?.includes("noindex") ?? false;
  if (previewMode && !noindex) {
    errors.push(`${relativePath}: preview page is missing noindex`);
  }
  if (!previewMode && relativePath !== "404.html" && noindex) {
    errors.push(`${relativePath}: public page unexpectedly has noindex`);
  }
  if (previewMode && attribute(robotsTag ?? "", "content") !== "noindex, nofollow") {
    errors.push(`${relativePath}: preview page must use noindex, nofollow`);
  }

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) errors.push(`${relativePath}: expected one h1, found ${h1Count}`);
  const headingLevels = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
  for (let index = 1; index < headingLevels.length; index += 1) {
    if (headingLevels[index] > headingLevels[index - 1] + 1) {
      errors.push(
        `${relativePath}: heading level jumps from h${headingLevels[index - 1]} to h${headingLevels[index]}`,
      );
    }
  }

  const mainTags = tags(html, "main");
  if (mainTags.length !== 1) {
    errors.push(`${relativePath}: expected one main, found ${mainTags.length}`);
  } else if (attribute(mainTags[0], "id") !== "main-content") {
    errors.push(`${relativePath}: main landmark is not the skip-link target`);
  }
  const siteHeaderCount = tags(html, "header").filter((tag) =>
    /\bdata-site-header(?:\s|>|=)/i.test(tag),
  ).length;
  if (siteHeaderCount !== 1) {
    errors.push(`${relativePath}: expected one site header, found ${siteHeaderCount}`);
  }
  const navigationTags = tags(html, "nav");
  if (navigationTags.length !== 1) {
    errors.push(
      `${relativePath}: expected one navigation landmark, found ${navigationTags.length}`,
    );
  } else if (!attribute(navigationTags[0], "aria-label")?.trim()) {
    errors.push(`${relativePath}: navigation landmark has no accessible name`);
  }
  const footerCount = tags(html, "footer").length;
  if (footerCount !== 1) {
    errors.push(`${relativePath}: expected one footer landmark, found ${footerCount}`);
  }
  if (relativePath !== "404.html") {
    const currentPageCount = tags(html, "a").filter(
      (tag) => attribute(tag, "aria-current") === "page",
    ).length;
    if (currentPageCount !== 1) {
      errors.push(
        `${relativePath}: expected one current navigation link, found ${currentPageCount}`,
      );
    }
  }
  const viewportTag = tags(html, "meta").find(
    (tag) => attribute(tag, "name")?.toLowerCase() === "viewport",
  );
  const viewport = attribute(viewportTag ?? "", "content");
  if (!viewport) {
    errors.push(`${relativePath}: viewport meta is missing`);
  } else if (/user-scalable\s*=\s*no|maximum-scale\s*=/i.test(viewport)) {
    errors.push(`${relativePath}: viewport meta restricts browser zoom`);
  }
  if (!html.includes('name="color-scheme"')) {
    errors.push(`${relativePath}: color-scheme meta is missing`);
  }
  if (Buffer.byteLength(html) > 100 * 1024) {
    errors.push(`${relativePath}: HTML exceeds the 100 KiB budget`);
  }

  const cspMeta = tags(html, "meta").find(
    (tag) => attribute(tag, "http-equiv")?.toLowerCase() === "content-security-policy",
  );
  const csp = cspMeta && attribute(cspMeta, "content");
  for (const directive of [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'none'",
    "script-src",
    "style-src",
  ]) {
    if (!csp?.includes(directive)) errors.push(`${relativePath}: CSP is missing ${directive}`);
  }
  if (!csp?.includes("sha256-")) errors.push(`${relativePath}: CSP has no generated hashes`);
  if (csp?.includes("'unsafe-inline'")) errors.push(`${relativePath}: CSP allows unsafe-inline`);

  const cspPosition = cspMeta ? html.indexOf(cspMeta) : -1;
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const openingTag = `<script${match[1]}>`;
    if ((match.index ?? -1) < cspPosition) {
      errors.push(`${relativePath}: script appears before the CSP meta element`);
    }
    if (attribute(openingTag, "src")) continue;

    const hash = `sha256-${createHash("sha256").update(match[2]).digest("base64")}`;
    if (!csp?.includes(`'${hash}'`)) {
      errors.push(`${relativePath}: CSP is missing inline script hash ${hash}`);
    }
  }

  for (const match of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    if ((match.index ?? -1) < cspPosition) {
      errors.push(`${relativePath}: style appears before the CSP meta element`);
    }
    const hash = `sha256-${createHash("sha256").update(match[1]).digest("base64")}`;
    if (!csp?.includes(`'${hash}'`)) {
      errors.push(`${relativePath}: CSP is missing inline style hash ${hash}`);
    }
  }

  for (const stylesheet of tags(html, "link").filter(
    (tag) => attribute(tag, "rel")?.toLowerCase() === "stylesheet",
  )) {
    if (html.indexOf(stylesheet) < cspPosition) {
      errors.push(`${relativePath}: stylesheet appears before the CSP meta element`);
    }
  }

  if (noindex) {
    const canonical = tags(html, "link").some(
      (tag) => attribute(tag, "rel")?.toLowerCase() === "canonical",
    );
    const alternates = tags(html, "link").some(
      (tag) => attribute(tag, "rel")?.toLowerCase() === "alternate",
    );
    const sitemap = tags(html, "link").some(
      (tag) => attribute(tag, "rel")?.toLowerCase() === "sitemap",
    );
    const socialMetadata = tags(html, "meta").some(
      (tag) =>
        attribute(tag, "property")?.toLowerCase().startsWith("og:") ||
        attribute(tag, "name")?.toLowerCase().startsWith("twitter:"),
    );
    if (canonical || alternates || sitemap || socialMetadata) {
      errors.push(`${relativePath}: noindex page exposes indexable or social metadata`);
    }
  } else {
    validateLanguageLinks(html, relativePath, route);
  }

  const canonicalTag = tags(html, "link").find(
    (tag) => attribute(tag, "rel")?.toLowerCase() === "canonical",
  );
  const sitemapTag = tags(html, "link").find(
    (tag) => attribute(tag, "rel")?.toLowerCase() === "sitemap",
  );
  const openGraphUrlTag = tags(html, "meta").find(
    (tag) => attribute(tag, "property")?.toLowerCase() === "og:url",
  );
  const socialMeta = (attributeName, value) =>
    tags(html, "meta").find(
      (tag) => attribute(tag, attributeName)?.toLowerCase() === value.toLowerCase(),
    );
  const openGraphImageTag = socialMeta("property", "og:image");
  const twitterImageTag = socialMeta("name", "twitter:image");
  const twitterCardTag = socialMeta("name", "twitter:card");
  if (!noindex && process.env.SITE_URL) {
    const expectedUrl = new URL(route, process.env.SITE_URL).href;
    if (attribute(canonicalTag ?? "", "href") !== expectedUrl) {
      errors.push(`${relativePath}: canonical does not match ${expectedUrl}`);
    }
    if (attribute(openGraphUrlTag ?? "", "content") !== expectedUrl) {
      errors.push(`${relativePath}: og:url does not match ${expectedUrl}`);
    }
    const expectedSitemapUrl = new URL("sitemap-index.xml", process.env.SITE_URL).href;
    if (attribute(sitemapTag ?? "", "href") !== expectedSitemapUrl) {
      errors.push(`${relativePath}: sitemap link does not match ${expectedSitemapUrl}`);
    }
    const expectedSocialImageUrl = new URL("social-card.png", process.env.SITE_URL).href;
    for (const [attributeName, name, expectedContent] of [
      ["property", "og:image", expectedSocialImageUrl],
      ["property", "og:image:width", "1200"],
      ["property", "og:image:height", "630"],
      ["property", "og:image:type", "image/png"],
      ["name", "twitter:image", expectedSocialImageUrl],
      ["name", "twitter:card", "summary_large_image"],
    ]) {
      const tag = socialMeta(attributeName, name);
      if (attribute(tag ?? "", "content") !== expectedContent) {
        errors.push(`${relativePath}: ${name} does not match ${expectedContent}`);
      }
    }
    for (const [attributeName, name] of [
      ["property", "og:image:alt"],
      ["name", "twitter:image:alt"],
    ]) {
      const tag = socialMeta(attributeName, name);
      if (!attribute(tag ?? "", "content")?.trim()) {
        errors.push(`${relativePath}: ${name} is missing alt text`);
      }
    }
  } else if (!noindex && (canonicalTag || openGraphUrlTag || sitemapTag)) {
    errors.push(`${relativePath}: absolute metadata exists without SITE_URL`);
  } else if (!noindex) {
    if (openGraphImageTag || twitterImageTag) {
      errors.push(`${relativePath}: absolute social image metadata exists without SITE_URL`);
    }
    if (attribute(twitterCardTag ?? "", "content") !== "summary") {
      errors.push(`${relativePath}: no-site build must use the summary Twitter card`);
    }
  }

  const jsonLdBlocks = [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((match) => match[1]);
  if (noindex && jsonLdBlocks.length > 0) {
    errors.push(`${relativePath}: noindex page exposes JSON-LD`);
  }
  if (!noindex && jsonLdBlocks.length === 0) errors.push(`${relativePath}: missing JSON-LD`);
  for (const jsonLd of jsonLdBlocks) {
    try {
      const data = JSON.parse(jsonLd);
      if (process.env.SITE_URL && !noindex) {
        const expectedPageUrl = new URL(route, process.env.SITE_URL).href;
        const expectedPersonUrl = new URL(locale === "fr" ? "/" : "/en/", process.env.SITE_URL)
          .href;
        const person = data.mainEntity ?? data.author;
        if (data.url !== expectedPageUrl) {
          errors.push(`${relativePath}: JSON-LD page URL does not match ${expectedPageUrl}`);
        }
        if (person?.url !== expectedPersonUrl) {
          errors.push(`${relativePath}: JSON-LD person URL does not match ${expectedPersonUrl}`);
        }
      }
    } catch {
      errors.push(`${relativePath}: invalid JSON-LD`);
    }
    if (jsonLd.includes("mailto:")) {
      errors.push(`${relativePath}: public email leaked in JSON-LD`);
    }
  }

  const ids = [...html.matchAll(/\bid=(["'])(.*?)\1/gi)].map((match) => match[2]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`${relativePath}: duplicate id(s): ${[...new Set(duplicateIds)].join(", ")}`);
  }
  if (!html.includes('href="#main-content"') || !html.includes('id="main-content"')) {
    errors.push(`${relativePath}: skip link or target is missing`);
  }

  for (const image of tags(html, "img")) {
    if (attribute(image, "alt") === undefined) {
      errors.push(`${relativePath}: image is missing alt text`);
    }
  }

  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const openingTag = `<button${match[1]}>`;
    const textContent = match[2].replace(/<[^>]+>/g, "").trim();
    if (!attribute(openingTag, "aria-label") && !textContent) {
      errors.push(`${relativePath}: button has no accessible name`);
    }
  }
  const themeToggle = tags(html, "button").find((tag) => /\bdata-theme-toggle\b/i.test(tag));
  for (const attributeName of ["aria-label", "data-light-label", "data-dark-label"]) {
    if (!attribute(themeToggle ?? "", attributeName)?.trim()) {
      errors.push(`${relativePath}: theme toggle is missing ${attributeName}`);
    }
  }

  for (const script of tags(html, "script")) {
    const source = attribute(script, "src");
    if (source?.startsWith("http://") || source?.startsWith("https://")) {
      errors.push(`${relativePath}: unexpected external script: ${source}`);
    }
  }

  if (/<form\b/i.test(html)) {
    errors.push(`${relativePath}: form found while CSP form-action is disabled`);
  }

  for (const placeholder of forbiddenPlaceholders) {
    if (html.includes(placeholder)) {
      errors.push(`${relativePath}: visible placeholder: ${placeholder}`);
    }
  }

  for (const match of html.matchAll(new RegExp(privateUsername, "gi"))) {
    const urlStart = match.index - "https://github.com/".length;
    const urlEnd = urlStart + allowedGitHubProfileUrl.length;
    const nextCharacter = html[urlEnd];
    const isExactApprovedLink =
      html.slice(urlStart, urlEnd) === allowedGitHubProfileUrl &&
      (nextCharacter === undefined || /["'<\s]/.test(nextCharacter));

    if (!isExactApprovedLink) {
      errors.push(`${relativePath}: private username is exposed outside the approved GitHub link`);
      break;
    }
  }

  if (relativePath === "404.html" && !noindex) {
    errors.push(`${relativePath}: missing noindex directive`);
  }

  return { description, locale, noindex, title };
}

const allFiles = await walk(outputDirectory);
const htmlFiles = allFiles.filter((file) => file.endsWith(".html"));
const documents = new Map();

for (const [filename, expectedWidth, expectedHeight, maximumBytes] of [
  ["favicon.png", 64, 64, 32 * 1024],
  ["apple-touch-icon.png", 180, 180, 64 * 1024],
  ["social-card.png", 1200, 630, 300 * 1024],
]) {
  const assetPath = path.join(outputDirectory, filename);
  const contents = await readFile(assetPath).catch(() => undefined);
  if (!contents) {
    errors.push(`dist/${filename}: required brand asset is missing`);
    continue;
  }
  const dimensions = pngDimensions(contents);
  if (dimensions?.width !== expectedWidth || dimensions?.height !== expectedHeight) {
    errors.push(`dist/${filename}: expected ${expectedWidth}x${expectedHeight} PNG`);
  }
  if (contents.length > maximumBytes) {
    errors.push(`dist/${filename}: exceeds the ${Math.round(maximumBytes / 1024)} KiB budget`);
  }
}

for (const route of expectedRoutes) {
  const candidates = routeCandidates(route);
  if (!(await Promise.all(candidates.map(exists))).some(Boolean)) {
    errors.push(`missing expected route: ${route}`);
  }
}

for (const file of htmlFiles) {
  const relativePath = path.relative(outputDirectory, file);
  const html = await readFile(file, "utf8");
  const route = routeFromFile(file);
  const metadata = validateDocument(html, relativePath, route);
  const anchors = tags(html, "a")
    .map((tag) => attribute(tag, "href"))
    .filter(Boolean);
  documents.set(route, { anchors, metadata });

  const references = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map(
    (match) => match[1],
  );
  await Promise.all(references.map((reference) => validateReference(reference, relativePath)));
}

const metadataOwners = new Map();
for (const [route, document] of documents) {
  for (const [kind, value] of [
    ["title", document.metadata.title],
    ["description", document.metadata.description],
  ]) {
    if (!value) continue;
    const key = `${document.metadata.locale}:${kind}:${value}`;
    const previousRoute = metadataOwners.get(key);
    if (previousRoute) {
      errors.push(`${route}: duplicate ${kind} also used by ${previousRoute}`);
    } else {
      metadataOwners.set(key, route);
    }
  }
}

const visitedRoutes = new Set(["/"]);
const routesToVisit = ["/"];
while (routesToVisit.length > 0) {
  const route = routesToVisit.shift();
  const document = documents.get(route);
  if (!document) continue;

  for (const reference of document.anchors) {
    const linkedRoute =
      reference.startsWith("/") && !reference.startsWith("//") ? pathname(reference) : undefined;
    if (
      linkedRoute &&
      expectedRouteSet.has(linkedRoute) &&
      linkedRoute !== "/404.html" &&
      !visitedRoutes.has(linkedRoute)
    ) {
      visitedRoutes.add(linkedRoute);
      routesToVisit.push(linkedRoute);
    }
  }
}

for (const route of expectedRoutes) {
  if (route !== "/404.html" && !visitedRoutes.has(route)) {
    errors.push(`${route}: page is not reachable through HTML links from /`);
  }
}

const scannableFiles = allFiles.filter((file) => /\.(?:css|html|js|json|map|txt|xml)$/.test(file));
for (const file of scannableFiles) {
  const contents = await readFile(file, "utf8");
  const extension = path.extname(file);
  if ([".css", ".js"].includes(extension) && Buffer.byteLength(contents) > 100 * 1024) {
    errors.push(`${path.relative(outputDirectory, file)}: asset exceeds the 100 KiB budget`);
  }
  for (const pattern of secretPatterns) {
    if (pattern.test(contents)) {
      errors.push(`${path.relative(outputDirectory, file)}: output matches a secret pattern`);
    }
  }
}

const bundledCss = (
  await Promise.all(
    allFiles.filter((file) => file.endsWith(".css")).map((file) => readFile(file, "utf8")),
  )
).join("\n");
for (const accessibilityRule of [":focus-visible", "prefers-reduced-motion", "data-theme=dark"]) {
  if (!bundledCss.includes(accessibilityRule)) {
    errors.push(`bundled CSS: missing ${accessibilityRule}`);
  }
}

const requiredThemeTokens = [
  "bg",
  "surface",
  "surface-subtle",
  "text",
  "text-muted",
  "border",
  "accent",
  "accent-hover",
  "accent-soft",
  "accent-contrast",
  "info",
  "danger",
  "selection",
  "shadow",
  "grid-line",
  "header-bg",
];
const requiredSharedTokens = [
  "font-display",
  "font-body",
  "font-mono",
  "display",
  "h1",
  "h2",
  "h3",
  "body-large",
  "radius-control",
  "radius-card",
  "container",
  "gutter",
  "duration-fast",
  "duration-base",
  "duration-reveal",
  "ease-out",
];
const lightThemeBlock = bundledCss.match(/:root\{(--bg:[^}]*)\}/)?.[1];
const darkThemeBlock = bundledCss.match(/:root\[data-theme=dark\]\{([^}]*)\}/)?.[1];
const systemDarkThemeBlock = bundledCss.match(/:root:not\(\[data-theme\]\)\{([^}]*)\}/)?.[1];
const declaration = (block, name) =>
  block?.match(new RegExp(`--${name}:([^;}]+)`, "i"))?.[1].trim();
const themeBlocks = [
  ["light", lightThemeBlock],
  ["dark", darkThemeBlock],
];
for (const [theme, block] of themeBlocks) {
  if (!block) {
    errors.push(`bundled CSS: missing ${theme} theme tokens`);
    continue;
  }
  for (const token of requiredThemeTokens) {
    if (!declaration(block, token)) {
      errors.push(`bundled CSS: missing ${theme} --${token} token`);
    }
  }
  const color = (name) => declaration(block, name)?.match(/^#[0-9a-f]{3,6}$/i)?.[0];
  for (const [foregroundName, backgroundName] of [
    ["text", "bg"],
    ["text-muted", "bg"],
    ["accent", "bg"],
    ["accent-contrast", "accent"],
  ]) {
    const foreground = color(foregroundName);
    const background = color(backgroundName);
    if (!foreground || !background) {
      errors.push(`bundled CSS: missing ${theme} ${foregroundName}/${backgroundName} colors`);
      continue;
    }
    const ratio = contrastRatio(foreground, background);
    if (ratio < 4.5) {
      errors.push(
        `bundled CSS: ${theme} ${foregroundName}/${backgroundName} contrast is ${ratio.toFixed(2)}:1`,
      );
    }
  }
}

for (const token of requiredSharedTokens) {
  if (!declaration(lightThemeBlock, token)) {
    errors.push(`bundled CSS: missing shared --${token} token`);
  }
}

if (!systemDarkThemeBlock) {
  errors.push("bundled CSS: missing system dark theme tokens");
} else {
  for (const token of requiredThemeTokens) {
    const explicitValue = declaration(darkThemeBlock, token);
    const systemValue = declaration(systemDarkThemeBlock, token);
    if (!systemValue) {
      errors.push(`bundled CSS: missing system dark --${token} token`);
    } else if (explicitValue && systemValue !== explicitValue) {
      errors.push(`bundled CSS: system dark --${token} differs from explicit dark theme`);
    }
  }
}

const sourceCss = await readFile(path.join(root, "src/styles/global.css"), "utf8");
const designSystem = await readFile(path.join(root, "docs/design-system.md"), "utf8");
const sourceLightThemeBlock = sourceCss.match(/^:root\s*\{([^}]*)\}/m)?.[1];
const sourceDarkThemeBlock = sourceCss.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/)?.[1];
for (const token of requiredThemeTokens) {
  const row = designSystem
    .split("\n")
    .find((line) => line.trimStart().startsWith(`| \`--${token}\``));
  if (!row) {
    errors.push(`design system: missing --${token} color row`);
    continue;
  }
  for (const [theme, block] of [
    ["light", sourceLightThemeBlock],
    ["dark", sourceDarkThemeBlock],
  ]) {
    const value = declaration(block, token);
    if (!value || !row.includes(`\`${value}\``)) {
      errors.push(`design system: --${token} ${theme} value differs from source CSS`);
    }
  }
}
for (const token of requiredSharedTokens) {
  if (!designSystem.includes(`\`--${token}\``)) {
    errors.push(`design system: missing shared --${token} reference`);
  }
}

const headers = await readFile(path.join(outputDirectory, "_headers"), "utf8").catch(() => "");
for (const header of [
  "Content-Security-Policy: base-uri 'self'; form-action 'none'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests",
  "Permissions-Policy:",
  "Referrer-Policy:",
  "X-Content-Type-Options: nosniff",
  "X-Frame-Options: DENY",
]) {
  if (!headers.includes(header)) errors.push(`dist/_headers: missing ${header}`);
}

const robots = await readFile(path.join(outputDirectory, "robots.txt"), "utf8").catch(() => "");
if (!robots.includes("User-agent: *")) {
  errors.push("dist/robots.txt: user-agent policy is missing");
}

if (previewMode) {
  if (
    !robots.includes("Disallow: /") ||
    robots.includes("Allow: /") ||
    robots.includes("Sitemap:")
  ) {
    errors.push("dist/robots.txt: preview crawler policy is not fully restrictive");
  }
  if (allFiles.some((file) => path.basename(file).startsWith("sitemap"))) {
    errors.push("dist: sitemap generated for a noindex preview");
  }
} else if (!robots.includes("Allow: /")) {
  errors.push("dist/robots.txt: expected public crawler policy is missing");
} else if (process.env.SITE_URL) {
  const expectedSitemapUrl = new URL("sitemap-index.xml", process.env.SITE_URL).href;
  if (!robots.includes(`Sitemap: ${expectedSitemapUrl}`)) {
    errors.push(`dist/robots.txt: missing ${expectedSitemapUrl}`);
  }

  const sitemapIndex = await readFile(
    path.join(outputDirectory, "sitemap-index.xml"),
    "utf8",
  ).catch(() => "");
  const sitemap = await readFile(path.join(outputDirectory, "sitemap-0.xml"), "utf8").catch(
    () => "",
  );
  if (!sitemapIndex.includes(new URL("sitemap-0.xml", process.env.SITE_URL).href)) {
    errors.push("dist/sitemap-index.xml: sitemap child is missing");
  }
  for (const route of expectedRoutes.filter((candidate) => candidate !== "/404.html")) {
    const expectedUrl = new URL(route, process.env.SITE_URL).href;
    if (!sitemap.includes(`<loc>${expectedUrl}</loc>`)) {
      errors.push(`dist/sitemap-0.xml: missing ${expectedUrl}`);
    }
  }
  if (sitemap.includes("/404")) {
    errors.push("dist/sitemap-0.xml: 404 page must be excluded");
  }
} else {
  if (robots.includes("Sitemap:")) {
    errors.push("dist/robots.txt: sitemap advertised without SITE_URL");
  }
  if (allFiles.some((file) => path.basename(file).startsWith("sitemap"))) {
    errors.push("dist: sitemap generated without SITE_URL");
  }
}

if (errors.length > 0) {
  console.error(`Build validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${htmlFiles.length} HTML documents, ${visitedRoutes.size} reachable routes, and ${internalReferences.size} internal references.`,
  );
}
