import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const projectsRoot = path.join(root, "src", "content", "projects");
const locales = ["fr", "en"];
const sharedFields = ["slug", "order", "featured", "publication", "stack", "visual", "socialImage"];
const requiredFields = [
  "title",
  "slug",
  "locale",
  "order",
  "featured",
  "publication",
  "eyebrow",
  "kind",
  "summary",
  "stack",
  "visual",
  "socialImage",
  "socialImageAlt",
];
const errors = [];

function parseScalar(rawValue, context) {
  const value = rawValue.trim();
  if (!value) return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+$/.test(value)) return Number(value);
  if (value.startsWith('"') || value.startsWith("'")) {
    const quote = value[0];
    if (!value.endsWith(quote)) throw new Error(`${context}: unterminated quoted value`);
    if (quote === '"') return JSON.parse(value);
    return value.slice(1, -1).replaceAll("''", "'");
  }
  return value;
}

function extractDocument(source, relativePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${relativePath}: expected one YAML frontmatter block`);
  return { frontmatter: match[1], body: match[2].trim() };
}

function parseFrontmatter(source, relativePath) {
  const lines = source.split(/\r?\n/);
  const data = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (/^\s/.test(line)) {
      throw new Error(`${relativePath}:${index + 2}: unexpected indentation`);
    }

    const field = line.match(/^([a-z][a-zA-Z0-9]*):(?:\s*(.*))?$/);
    if (!field) throw new Error(`${relativePath}:${index + 2}: unsupported frontmatter syntax`);
    const [, key, rawValue = ""] = field;
    if (Object.hasOwn(data, key)) {
      throw new Error(`${relativePath}:${index + 2}: duplicate field ${key}`);
    }

    if (rawValue.trim()) {
      data[key] = parseScalar(rawValue, `${relativePath}:${index + 2}`);
      continue;
    }

    const nested = [];
    while (index + 1 < lines.length && /^\s/.test(lines[index + 1])) {
      nested.push({ line: lines[index + 1], number: index + 3 });
      index += 1;
    }

    if (key === "stack") {
      data.stack = nested.map(({ line: item, number }) => {
        const listItem = item.match(/^\s{2}-\s+(.+)$/);
        if (!listItem) throw new Error(`${relativePath}:${number}: invalid stack item`);
        return parseScalar(listItem[1], `${relativePath}:${number}`);
      });
      continue;
    }

    if (key === "metrics") {
      const metrics = [];
      for (const { line: item, number } of nested) {
        const firstProperty = item.match(/^\s{2}-\s+(value|label):\s*(.+)$/);
        const nextProperty = item.match(/^\s{4}(value|label):\s*(.+)$/);
        if (firstProperty) {
          metrics.push({
            [firstProperty[1]]: parseScalar(firstProperty[2], `${relativePath}:${number}`),
          });
        } else if (nextProperty && metrics.length > 0) {
          const metric = metrics.at(-1);
          if (Object.hasOwn(metric, nextProperty[1])) {
            throw new Error(`${relativePath}:${number}: duplicate metric ${nextProperty[1]}`);
          }
          metric[nextProperty[1]] = parseScalar(nextProperty[2], `${relativePath}:${number}`);
        } else {
          throw new Error(`${relativePath}:${number}: invalid metric item`);
        }
      }
      data.metrics = metrics;
      continue;
    }

    throw new Error(`${relativePath}:${index + 2}: nested field ${key} is not supported`);
  }

  return data;
}

async function loadLocale(locale) {
  const localeRoot = path.join(projectsRoot, locale);
  const filenames = (await readdir(localeRoot)).filter((name) => /\.mdx?$/.test(name)).sort();
  const projects = new Map();

  for (const filename of filenames) {
    const absolutePath = path.join(localeRoot, filename);
    const relativePath = path.relative(root, absolutePath).split(path.sep).join("/");
    try {
      const source = await readFile(absolutePath, "utf8");
      const document = extractDocument(source, relativePath);
      const data = parseFrontmatter(document.frontmatter, relativePath);
      const fileSlug = filename.replace(/\.mdx?$/, "");

      for (const field of requiredFields) {
        if (!Object.hasOwn(data, field) || data[field] === "") {
          errors.push(`${relativePath}: required field ${field} is missing`);
        }
      }
      if (data.locale !== locale) {
        errors.push(`${relativePath}: locale must be ${locale}, received ${String(data.locale)}`);
      }
      if (data.slug !== fileSlug) {
        errors.push(`${relativePath}: slug must match the filename ${fileSlug}`);
      }
      if (!document.body) errors.push(`${relativePath}: project narrative is empty`);
      if (!Array.isArray(data.stack) || data.stack.length === 0) {
        errors.push(`${relativePath}: stack must contain at least one technology`);
      }
      if (Array.isArray(data.metrics)) {
        data.metrics.forEach((metric, metricIndex) => {
          if (!String(metric.value ?? "").trim() || !String(metric.label ?? "").trim()) {
            errors.push(`${relativePath}: metric ${metricIndex + 1} needs a value and a label`);
          }
        });
      }
      if (projects.has(data.slug)) errors.push(`${relativePath}: duplicate slug ${data.slug}`);
      projects.set(data.slug, {
        data,
        headingCount: document.body.match(/^##\s+\S.+$/gm)?.length ?? 0,
        relativePath,
      });
    } catch (error) {
      errors.push(error.message);
    }
  }

  const orders = new Map();
  for (const project of projects.values()) {
    const order = project.data.order;
    if (orders.has(order)) {
      errors.push(
        `${project.relativePath}: order ${String(order)} is already used by ${orders.get(order)}`,
      );
    } else {
      orders.set(order, project.relativePath);
    }
  }
  return projects;
}

const projectsByLocale = Object.fromEntries(
  await Promise.all(locales.map(async (locale) => [locale, await loadLocale(locale)])),
);
const allSlugs = new Set(locales.flatMap((locale) => [...projectsByLocale[locale].keys()]));

for (const slug of [...allSlugs].sort()) {
  const fr = projectsByLocale.fr.get(slug);
  const en = projectsByLocale.en.get(slug);
  if (!fr || !en) {
    errors.push(`${slug}: missing ${fr ? "English" : "French"} project entry`);
    continue;
  }

  for (const field of sharedFields) {
    if (JSON.stringify(fr.data[field]) !== JSON.stringify(en.data[field])) {
      errors.push(`${slug}: ${field} differs between ${fr.relativePath} and ${en.relativePath}`);
    }
  }

  const frMetrics = fr.data.metrics;
  const enMetrics = en.data.metrics;
  if (Boolean(frMetrics) !== Boolean(enMetrics)) {
    errors.push(`${slug}: metrics must be present in both languages or neither`);
  } else if (frMetrics && enMetrics) {
    if (frMetrics.length !== enMetrics.length) {
      errors.push(`${slug}: metric count differs between French and English`);
    } else {
      frMetrics.forEach((metric, index) => {
        if (metric.value !== enMetrics[index].value) {
          errors.push(`${slug}: metric ${index + 1} value differs between French and English`);
        }
      });
    }
  }

  if (fr.headingCount !== en.headingCount) {
    errors.push(`${slug}: level-two heading count differs between French and English`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${allSlugs.size} bilingual project pairs: factual frontmatter and narrative structure match.`,
  );
}
