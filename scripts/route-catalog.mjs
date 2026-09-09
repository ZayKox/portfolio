import { readFileSync } from "node:fs";
import path from "node:path";
import { loadProjects } from "./project-content.mjs";

const contentRoot = process.env.PORTFOLIO_CONTENT_ROOT || process.cwd();
const routes = JSON.parse(readFileSync(path.join(contentRoot, "src/data/routes.json"), "utf8"));
export function createRouteCatalog(projects) {
  const types = {
    home: "ProfilePage",
    about: "ProfilePage",
    contact: "ContactPage",
    projects: "CollectionPage",
  };
  const publicRoutes = Object.entries(routes).flatMap(([locale, pages]) =>
    Object.entries(pages).map(([key, path]) => ({
      path,
      locale,
      schemaType: types[key] ?? "WebPage",
    })),
  );
  const languagePairs = Object.keys(routes.fr).map((key) => ({
    fr: routes.fr[key],
    en: routes.en[key],
  }));
  for (const { data } of projects.filter(({ data }) => data.publication !== "draft")) {
    publicRoutes.push({
      path: `${routes[data.locale].projects}${data.slug}/`,
      locale: data.locale,
      schemaType: "WebPage",
      socialImage: data.socialImage,
    });
    if (data.locale === "fr")
      languagePairs.push({
        fr: `${routes.fr.projects}${data.slug}/`,
        en: `${routes.en.projects}${data.slug}/`,
      });
  }
  return {
    publicRoutes,
    languagePairs,
    expectedSchemaTypes: new Map(publicRoutes.map((entry) => [entry.path, entry.schemaType])),
  };
}
export const { publicRoutes, languagePairs, expectedSchemaTypes } = createRouteCatalog(
  loadProjects(contentRoot),
);
