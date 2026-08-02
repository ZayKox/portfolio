const publicRoutes = [
  { path: "/", locale: "fr" },
  { path: "/a-propos/", locale: "fr" },
  { path: "/contact/", locale: "fr" },
  { path: "/projets/", locale: "fr" },
  {
    path: "/projets/filtre-appels/",
    locale: "fr",
    socialImage: "/filtre-appels-social-card.png",
  },
  { path: "/projets/myverse/", locale: "fr", socialImage: "/myverse-social-card.png" },
  { path: "/en/", locale: "en" },
  { path: "/en/about/", locale: "en" },
  { path: "/en/contact/", locale: "en" },
  { path: "/en/projects/", locale: "en" },
  {
    path: "/en/projects/filtre-appels/",
    locale: "en",
    socialImage: "/filtre-appels-social-card.png",
  },
  { path: "/en/projects/myverse/", locale: "en", socialImage: "/myverse-social-card.png" },
];

const languagePairs = [
  { fr: "/", en: "/en/" },
  { fr: "/a-propos/", en: "/en/about/" },
  { fr: "/contact/", en: "/en/contact/" },
  { fr: "/projets/", en: "/en/projects/" },
  { fr: "/projets/filtre-appels/", en: "/en/projects/filtre-appels/" },
  { fr: "/projets/myverse/", en: "/en/projects/myverse/" },
];
const expectedSchemaTypes = new Map([
  ["/", "ProfilePage"],
  ["/a-propos/", "ProfilePage"],
  ["/contact/", "ContactPage"],
  ["/projets/", "CollectionPage"],
  ["/projets/filtre-appels/", "WebPage"],
  ["/projets/myverse/", "WebPage"],
  ["/en/", "ProfilePage"],
  ["/en/about/", "ProfilePage"],
  ["/en/contact/", "ContactPage"],
  ["/en/projects/", "CollectionPage"],
  ["/en/projects/filtre-appels/", "WebPage"],
  ["/en/projects/myverse/", "WebPage"],
]);
const expectedPerson = {
  "@type": "Person",
  name: "Ethan Brosselard",
  homeLocation: { "@type": "Place", name: "Paris, France" },
  sameAs: ["https://github.com/ZayKox", "https://www.linkedin.com/in/ethan-brosselard-507334237/"],
};

const forbiddenPlaceholders = ["TODO", "TBD", "À REMPLIR", "coming soon"];

function socialImageForRoute(pathname) {
  return publicRoutes.find(({ path }) => path === pathname)?.socialImage ?? "/social-card.png";
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function origin(value, label, { requireHttps = false } = {}) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid URL origin.`);
  }
  if (
    (requireHttps && parsed.protocol !== "https:") ||
    (!requireHttps && !["http:", "https:"].includes(parsed.protocol)) ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash ||
    parsed.username ||
    parsed.password
  ) {
    throw new Error(
      `${label} must be ${requireHttps ? "an HTTPS" : "an HTTP(S)"} origin without a path, query, fragment, or credentials.`,
    );
  }
  return parsed;
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=(['"])(.*?)\\1`, "i"))?.[2];
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(([tag]) => tag);
}

function decodeHtml(value) {
  return value
    ?.replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function assertExactKeys(value, expectedKeys, label) {
  assert(value && typeof value === "object" && !Array.isArray(value), `${label} is not an object`);
  const actualKeys = Object.keys(value).sort();
  assert(
    JSON.stringify(actualKeys) === JSON.stringify([...expectedKeys].sort()),
    `${label} properties are invalid: ${actualKeys.join(", ")}`,
  );
}

function meta(html, attributeName, value) {
  return tags(html, "meta").find(
    (tag) => attribute(tag, attributeName)?.toLowerCase() === value.toLowerCase(),
  );
}

function link(html, rel, hreflang) {
  return tags(html, "link").find(
    (tag) =>
      attribute(tag, "rel")?.toLowerCase() === rel.toLowerCase() &&
      (!hreflang || attribute(tag, "hreflang")?.toLowerCase() === hreflang.toLowerCase()),
  );
}

function validateSecurityHeaders(response, pathname) {
  const required = {
    "content-security-policy": ["base-uri 'self'", "frame-ancestors 'none'", "object-src 'none'"],
    "permissions-policy": ["camera=()", "microphone=()", "geolocation=()"],
    "referrer-policy": ["strict-origin-when-cross-origin"],
    "strict-transport-security": ["max-age=31536000"],
    "x-content-type-options": ["nosniff"],
    "x-frame-options": ["DENY"],
  };
  for (const [name, fragments] of Object.entries(required)) {
    const value = response.headers.get(name) ?? "";
    for (const fragment of fragments) {
      assert(value.includes(fragment), `${pathname}: ${name} is missing ${fragment}`);
    }
    if (name === "content-security-policy") {
      assert(
        !/(?:^|[;\s])(?:https?:|\/\/|\*)/i.test(value),
        `${pathname}: content-security-policy allows an external source`,
      );
    }
  }

  const server = response.headers.get("server") ?? "";
  assert(
    !/\b(?:apache|nginx)\/[\d.]+/i.test(server),
    `${pathname}: server header exposes a software version`,
  );
}

function validateHtmlCache(response, pathname) {
  const cacheControl = response.headers.get("cache-control") ?? "";
  assert(
    /(?:^|,)\s*no-cache(?:\s*(?:,|$))/i.test(cacheControl),
    `${pathname}: HTML must be revalidated after a deployment`,
  );
}

function validateIcons(html, pathname) {
  const favicon = link(html, "icon");
  assert(attribute(favicon ?? "", "href") === "/favicon.png", `${pathname}: favicon is missing`);
  assert(attribute(favicon ?? "", "sizes") === "64x64", `${pathname}: favicon size is invalid`);
  const appleTouchIcon = link(html, "apple-touch-icon");
  assert(
    attribute(appleTouchIcon ?? "", "href") === "/apple-touch-icon.png",
    `${pathname}: Apple touch icon is missing`,
  );
  assert(
    attribute(appleTouchIcon ?? "", "sizes") === "180x180",
    `${pathname}: Apple touch icon size is invalid`,
  );
}

function validateLanguageMetadata(html, pathname, expectedSiteOrigin) {
  const pair = languagePairs.find(({ fr, en }) => fr === pathname || en === pathname);
  assert(pair, `${pathname}: route has no language pair`);
  for (const [language, route] of [
    ["fr", pair.fr],
    ["en", pair.en],
    ["x-default", pair.fr],
  ]) {
    const alternate = link(html, "alternate", language);
    const expected = new URL(route, expectedSiteOrigin).href;
    assert(
      attribute(alternate ?? "", "href") === expected,
      `${pathname}: ${language} alternate does not match ${expected}`,
    );
  }
}

function validateJsonLd(html, pathname, locale, expectedSiteOrigin) {
  const blocks = [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((match) => match[1]);
  assert(blocks.length === 1, `${pathname}: expected one JSON-LD block, found ${blocks.length}`);

  let data;
  try {
    data = JSON.parse(blocks[0]);
  } catch {
    throw new Error(`${pathname}: JSON-LD is invalid`);
  }
  const expectedPageUrl = new URL(pathname, expectedSiteOrigin).href;
  const expectedPersonUrl = new URL(locale === "fr" ? "/" : "/en/", expectedSiteOrigin).href;
  const expectedType = expectedSchemaTypes.get(pathname);
  const personProperty = expectedType === "ProfilePage" ? "mainEntity" : "author";
  const person = data[personProperty];
  const title = decodeHtml(html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim());
  const description = decodeHtml(attribute(meta(html, "name", "description") ?? "", "content"));
  assertExactKeys(
    data,
    ["@context", "@type", "name", "description", "inLanguage", personProperty, "url"],
    `${pathname}: JSON-LD page`,
  );
  assertExactKeys(
    person,
    ["@type", "name", "homeLocation", "sameAs", "url"],
    `${pathname}: JSON-LD Person`,
  );
  assert(data["@context"] === "https://schema.org", `${pathname}: JSON-LD context is invalid`);
  assert(data["@type"] === expectedType, `${pathname}: JSON-LD type is invalid`);
  assert(data.name === title, `${pathname}: JSON-LD name does not match the page title`);
  assert(
    data.description === description,
    `${pathname}: JSON-LD description does not match the page description`,
  );
  assert(data.inLanguage === locale, `${pathname}: JSON-LD language is invalid`);
  assert(
    data.url === expectedPageUrl,
    `${pathname}: JSON-LD URL does not match ${expectedPageUrl}`,
  );
  assert(person?.name === "Ethan Brosselard", `${pathname}: JSON-LD person name is invalid`);
  assert(
    JSON.stringify({
      "@type": person?.["@type"],
      name: person?.name,
      homeLocation: person?.homeLocation,
      sameAs: person?.sameAs,
    }) === JSON.stringify(expectedPerson),
    `${pathname}: JSON-LD Person facts are invalid`,
  );
  assert(person?.url === expectedPersonUrl, `${pathname}: JSON-LD person URL is invalid`);
  assert(
    !/mailto:|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(blocks[0]),
    `${pathname}: JSON-LD exposes the public email`,
  );
}

function validateProductionMetadata(html, pathname, locale, expectedSiteOrigin) {
  const expectedUrl = new URL(pathname, expectedSiteOrigin).href;
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = attribute(meta(html, "name", "description") ?? "", "content")?.trim();
  for (const [attributeName, name, expected] of [
    ["property", "og:type", "website"],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["property", "og:site_name", "Ethan Brosselard"],
    ["property", "og:locale", locale === "fr" ? "fr_FR" : "en_US"],
    ["property", "og:locale:alternate", locale === "fr" ? "en_US" : "fr_FR"],
    ["name", "twitter:title", title],
    ["name", "twitter:description", description],
  ]) {
    assert(
      attribute(meta(html, attributeName, name) ?? "", "content") === expected,
      `${pathname}: ${name} does not match ${expected}`,
    );
  }
  assert(
    attribute(link(html, "canonical") ?? "", "href") === expectedUrl,
    `${pathname}: canonical does not match ${expectedUrl}`,
  );
  assert(
    attribute(meta(html, "property", "og:url") ?? "", "content") === expectedUrl,
    `${pathname}: og:url does not match ${expectedUrl}`,
  );
  const expectedSocialImage = new URL(socialImageForRoute(pathname).slice(1), expectedSiteOrigin)
    .href;
  for (const [attributeName, name, expected] of [
    ["property", "og:image", expectedSocialImage],
    ["property", "og:image:width", "1200"],
    ["property", "og:image:height", "630"],
    ["property", "og:image:type", "image/png"],
    ["name", "twitter:image", expectedSocialImage],
    ["name", "twitter:card", "summary_large_image"],
  ]) {
    assert(
      attribute(meta(html, attributeName, name) ?? "", "content") === expected,
      `${pathname}: ${name} does not match ${expected}`,
    );
  }
  for (const [attributeName, name] of [
    ["property", "og:image:alt"],
    ["name", "twitter:image:alt"],
  ]) {
    assert(
      attribute(meta(html, attributeName, name) ?? "", "content")?.trim(),
      `${pathname}: ${name} is missing alt text`,
    );
  }
  const robots = meta(html, "name", "robots");
  assert(
    !attribute(robots ?? "", "content")?.includes("noindex"),
    `${pathname}: production route is noindex`,
  );
  validateLanguageMetadata(html, pathname, expectedSiteOrigin);
  validateJsonLd(html, pathname, locale, expectedSiteOrigin);
}

function validatePreviewMetadata(html, pathname) {
  const robots = meta(html, "name", "robots");
  assert(
    attribute(robots ?? "", "content") === "noindex, nofollow",
    `${pathname}: preview is missing noindex, nofollow`,
  );
  const socialMetadata = tags(html, "meta").some(
    (tag) =>
      attribute(tag, "property")?.toLowerCase().startsWith("og:") ||
      attribute(tag, "name")?.toLowerCase().startsWith("twitter:"),
  );
  const forbidden = [link(html, "canonical"), link(html, "alternate"), link(html, "sitemap")];
  assert(
    forbidden.every((tag) => !tag) && !socialMetadata,
    `${pathname}: preview exposes indexable metadata`,
  );
  assert(!html.includes('type="application/ld+json"'), `${pathname}: preview exposes JSON-LD`);
  assert(!html.includes("social-card.png"), `${pathname}: preview exposes the social image`);
}

function validateDocument(html, pathname, locale, mode, expectedSiteOrigin) {
  assert(html.includes(`<html lang="${locale}"`), `${pathname}: html language is not ${locale}`);
  assert(/<h1\b/i.test(html), `${pathname}: h1 is missing`);
  assert(html.includes("Ethan Brosselard"), `${pathname}: public name is missing`);
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  assert(title, `${pathname}: title is missing`);
  assert(
    attribute(meta(html, "name", "description") ?? "", "content")?.trim(),
    `${pathname}: description is missing`,
  );
  const csp = attribute(meta(html, "http-equiv", "content-security-policy") ?? "", "content");
  assert(csp?.includes("default-src 'self'"), `${pathname}: document CSP is missing default-src`);
  assert(!csp?.includes("'unsafe-inline'"), `${pathname}: document CSP allows unsafe-inline`);
  assert(
    !/(?:^|[;\s])(?:https?:|\/\/|\*)/i.test(csp ?? ""),
    `${pathname}: document CSP allows an external source`,
  );
  for (const script of tags(html, "script")) {
    const source = attribute(script, "src");
    assert(
      !source?.startsWith("http") && !source?.startsWith("//"),
      `${pathname}: external script is loaded from ${source}`,
    );
  }
  for (const placeholder of forbiddenPlaceholders) {
    assert(!html.includes(placeholder), `${pathname}: visible placeholder ${placeholder}`);
  }
  validateIcons(html, pathname);
  if (mode === "preview") {
    validatePreviewMetadata(html, pathname);
  } else {
    validateProductionMetadata(html, pathname, locale, expectedSiteOrigin);
  }
}

function validatePng(contents, pathname, width, height) {
  const bytes = new Uint8Array(contents);
  const signature = "89504e470d0a1a0a";
  assert(
    bytes.length >= 24 && Buffer.from(bytes.subarray(0, 8)).toString("hex") === signature,
    `${pathname}: response is not a PNG`,
  );
  const view = new DataView(contents);
  assert(view.getUint32(16) === width, `${pathname}: width is not ${width}`);
  assert(view.getUint32(20) === height, `${pathname}: height is not ${height}`);
}

function xmlLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

export async function validateDeployment({
  requestOrigin,
  expectedSiteOrigin = requestOrigin,
  mode,
  authorization,
  checkHttpRedirect = false,
}) {
  assert(["production", "preview"].includes(mode), "mode must be production or preview");
  assert(
    !checkHttpRedirect || mode === "production",
    "HTTP redirect check is only valid in production mode",
  );
  const requestBase = origin(requestOrigin, "requestOrigin");
  const expectedBase = origin(expectedSiteOrigin, "expectedSiteOrigin", { requireHttps: true });
  const headers = authorization ? { authorization } : undefined;
  const checks = [];
  let hashedAssetPath;

  async function request(pathname, expectedStatus = 200) {
    const response = await fetch(new URL(pathname, requestBase), {
      headers,
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    assert(
      response.status === expectedStatus,
      `${pathname}: returned ${response.status}, expected ${expectedStatus}`,
    );
    assert(!response.headers.has("set-cookie"), `${pathname}: response unexpectedly sets a cookie`);
    return response;
  }

  for (const route of publicRoutes) {
    const response = await request(route.path);
    validateSecurityHeaders(response, route.path);
    validateHtmlCache(response, route.path);
    assert(
      response.headers.get("content-type")?.startsWith("text/html"),
      `${route.path}: content type is not HTML`,
    );
    const html = await response.text();
    validateDocument(html, route.path, route.locale, mode, expectedBase);
    hashedAssetPath ??= html.match(/(?:href|src)=["'](\/_astro\/[^"']+)["']/)?.[1];
  }
  checks.push(`${publicRoutes.length} bilingual routes`);

  assert(hashedAssetPath, "no hashed Astro asset was referenced by the public pages");
  const hashedAsset = await request(hashedAssetPath);
  validateSecurityHeaders(hashedAsset, hashedAssetPath);
  const assetCacheControl = hashedAsset.headers.get("cache-control") ?? "";
  assert(
    /(?:^|,)\s*max-age=31536000(?:\s*(?:,|$))/i.test(assetCacheControl),
    `${hashedAssetPath}: hashed asset is missing its one-year cache policy`,
  );
  checks.push("HTML revalidation and long-lived hashed assets");

  const notFound = await request("/remote-smoke-missing-route/", 404);
  validateSecurityHeaders(notFound, "/remote-smoke-missing-route/");
  validateHtmlCache(notFound, "/remote-smoke-missing-route/");
  const notFoundHtml = await notFound.text();
  assert(notFoundHtml.includes("Cette page n’existe pas."), "404 page is missing French copy");
  assert(notFoundHtml.includes("This page does not exist."), "404 page is missing English copy");
  const notFoundRobots = meta(notFoundHtml, "name", "robots");
  assert(
    attribute(notFoundRobots ?? "", "content") ===
      (mode === "preview" ? "noindex, nofollow" : "noindex, follow"),
    "404 page has an invalid robots directive",
  );
  checks.push("real 404 response");

  for (const [pathname, width, height] of [
    ["/favicon.png", 64, 64],
    ["/apple-touch-icon.png", 180, 180],
  ]) {
    const response = await request(pathname);
    assert(
      response.headers.get("content-type")?.startsWith("image/png"),
      `${pathname}: content type is not image/png`,
    );
    validatePng(await response.arrayBuffer(), pathname, width, height);
  }
  checks.push("favicon and Apple touch icon");

  const robotsResponse = await request("/robots.txt");
  const robots = await robotsResponse.text();
  if (mode === "preview") {
    assert(robots.includes("Disallow: /"), "preview robots.txt does not disallow crawling");
    assert(!robots.includes("Sitemap:"), "preview robots.txt exposes a sitemap");
    await request("/sitemap-index.xml", 404);
    checks.push("preview noindex and crawl blocking");
  } else {
    const expectedSitemapUrl = new URL("sitemap-index.xml", expectedBase).href;
    assert(robots.includes("Allow: /"), "production robots.txt does not allow crawling");
    assert(
      robots.includes(`Sitemap: ${expectedSitemapUrl}`),
      `production robots.txt does not reference ${expectedSitemapUrl}`,
    );

    const sitemapIndex = await (await request("/sitemap-index.xml")).text();
    const sitemapLocations = xmlLocations(sitemapIndex);
    assert(sitemapLocations.length > 0, "sitemap index does not reference a child sitemap");
    const indexedPages = [];
    for (const location of sitemapLocations) {
      const sitemapUrl = new URL(location);
      assert(
        sitemapUrl.origin === expectedBase.origin,
        `sitemap uses unexpected origin ${location}`,
      );
      const sitemap = await (await request(sitemapUrl.pathname)).text();
      indexedPages.push(...xmlLocations(sitemap));
    }
    const expectedPages = publicRoutes.map(({ path }) => new URL(path, expectedBase).href).sort();
    assert(
      JSON.stringify([...new Set(indexedPages)].sort()) === JSON.stringify(expectedPages),
      "sitemap routes do not exactly match the public route set",
    );

    const socialImages = new Set(publicRoutes.map(({ path }) => socialImageForRoute(path)));
    for (const socialImagePath of socialImages) {
      const socialCard = await request(socialImagePath);
      assert(
        socialCard.headers.get("content-type")?.startsWith("image/png"),
        `${socialImagePath}: content type is not image/png`,
      );
      validatePng(await socialCard.arrayBuffer(), socialImagePath, 1200, 630);
    }
    checks.push("canonical, JSON-LD, sitemap, and sharing images");
  }
  checks.push("no response cookies");

  if (checkHttpRedirect) {
    assert(requestBase.protocol === "https:", "HTTP redirect check requires an HTTPS request URL");
    const httpUrl = new URL(requestBase);
    httpUrl.protocol = "http:";
    const response = await fetch(httpUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    assert(
      [301, 302, 307, 308].includes(response.status),
      `HTTP origin returned ${response.status}`,
    );
    const location = response.headers.get("location");
    const redirectUrl = location ? new URL(location, httpUrl) : undefined;
    assert(
      redirectUrl?.origin === requestBase.origin && redirectUrl.pathname === "/",
      "HTTP origin does not redirect to the HTTPS origin",
    );
    checks.push("HTTP to HTTPS redirect");
  }

  return {
    checkedAt: new Date().toISOString(),
    mode,
    requestOrigin: requestBase.origin,
    expectedSiteOrigin: expectedBase.origin,
    routeCount: publicRoutes.length,
    routes: publicRoutes.map(({ path }) => path),
    authorizationUsed: Boolean(authorization),
    httpRedirectChecked: checkHttpRedirect,
    checks,
  };
}
