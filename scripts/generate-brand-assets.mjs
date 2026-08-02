import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { chromium } from "@playwright/test";

const outputDirectory = path.join(process.cwd(), "public");
const globalStyles = await readFile(
  path.join(process.cwd(), "src", "styles", "global.css"),
  "utf8",
);
const lightTokenBlock = globalStyles.match(/:root\s*\{([\s\S]*?)\}/)?.[1];
const darkTokenBlock = globalStyles.match(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\}/)?.[1];

function token(block, name) {
  const value = block?.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!value) throw new Error(`Could not resolve --${name} from the Violet Field tokens.`);
  return value;
}

const brandVariables = `
  --brand-bg: ${token(darkTokenBlock, "bg")};
  --brand-surface: ${token(darkTokenBlock, "surface")};
  --brand-soft: ${token(darkTokenBlock, "accent-soft")};
  --brand-text: ${token(darkTokenBlock, "text")};
  --brand-muted: ${token(darkTokenBlock, "text-muted")};
  --brand-border: ${token(darkTokenBlock, "border")};
  --brand-accent: ${token(darkTokenBlock, "accent")};
  --brand-grid: ${token(darkTokenBlock, "grid-line")};
  --brand-accent-strong: ${token(lightTokenBlock, "accent")};
`;

function document(content, styles) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; }
      html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; }
      body { ${styles} }
    </style>
  </head>
  <body>${content}</body>
</html>`;
}

function iconMarkup() {
  return `<div class="mark"><span class="dot"></span><strong>EB</strong></div>`;
}

const iconStyles = `
  ${brandVariables}
  display: grid;
  place-items: center;
  background: var(--brand-bg);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  .mark {
    position: relative;
    display: grid;
    place-items: center;
    width: 76%;
    aspect-ratio: 1;
    border: max(1px, 1.5vw) solid color-mix(in srgb, var(--brand-accent) 55%, transparent);
    border-radius: 24%;
    color: var(--brand-text);
    background: linear-gradient(145deg, var(--brand-soft), var(--brand-surface) 68%);
  }
  .mark::before {
    position: absolute;
    inset: 12%;
    border: max(1px, 0.9vw) solid color-mix(in srgb, var(--brand-accent) 20%, transparent);
    border-radius: 20%;
    content: "";
  }
  .dot {
    position: absolute;
    top: 11%;
    right: 11%;
    width: 11%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--brand-accent);
  }
  strong {
    position: relative;
    font-size: 27vw;
    font-weight: 750;
    letter-spacing: -0.09em;
    line-height: 1;
    transform: translateX(-0.04em);
  }
`;

const socialMarkup = `
  <div class="grid"></div>
  <div class="glow glow-one"></div>
  <div class="glow glow-two"></div>
  <main>
    <div class="identity">
      <p class="kicker">PORTFOLIO / 2026</p>
      <h1>ETHAN<br>BROSSELARD</h1>
      <p class="fields">WEB <span>·</span> MOBILE <span>·</span> SYSTEMS <span>·</span> AI / NEXT</p>
    </div>
    <div class="field" aria-hidden="true">
      <div class="orbit orbit-outer"></div>
      <div class="orbit orbit-inner"></div>
      <div class="core">EB</div>
      <span class="node node-one">BUILD</span>
      <span class="node node-two">LEARN</span>
      <span class="node node-three">EVOLVE</span>
    </div>
  </main>`;

const socialStyles = `
  ${brandVariables}
  position: relative;
  color: var(--brand-text);
  background: var(--brand-bg);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  .grid {
    position: absolute;
    inset: 0;
    opacity: 0.5;
    background-image:
      linear-gradient(var(--brand-grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--brand-grid) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
  }
  .glow-one {
    top: -260px;
    right: -140px;
    width: 720px;
    height: 720px;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--brand-accent-strong) 42%, transparent),
      transparent 68%
    );
  }
  .glow-two {
    bottom: -360px;
    left: -180px;
    width: 760px;
    height: 760px;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--brand-accent) 18%, transparent),
      transparent 70%
    );
  }
  main {
    position: relative;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 72px 82px;
  }
  .kicker, .fields, .node {
    font-family: "SFMono-Regular", Consolas, monospace;
    letter-spacing: 0.13em;
  }
  .kicker {
    margin: 0 0 28px;
    color: var(--brand-accent);
    font-size: 18px;
    font-weight: 700;
  }
  h1 {
    margin: 0;
    font-size: 82px;
    font-weight: 720;
    letter-spacing: -0.07em;
    line-height: 0.88;
  }
  .fields {
    margin: 38px 0 0;
    color: var(--brand-muted);
    font-size: 15px;
    font-weight: 650;
  }
  .fields span { color: var(--brand-accent); }
  .field {
    position: relative;
    display: grid;
    place-items: center;
    justify-self: end;
    width: 420px;
    aspect-ratio: 1;
  }
  .orbit {
    position: absolute;
    border: 2px solid color-mix(in srgb, var(--brand-accent) 34%, transparent);
    border-radius: 50%;
  }
  .orbit-outer { width: 94%; aspect-ratio: 1; }
  .orbit-inner { width: 58%; aspect-ratio: 1; }
  .core {
    position: relative;
    display: grid;
    place-items: center;
    width: 142px;
    aspect-ratio: 1;
    border: 2px solid color-mix(in srgb, var(--brand-accent) 72%, transparent);
    border-radius: 50%;
    color: var(--brand-accent);
    background: var(--brand-surface);
    font-size: 48px;
    font-weight: 760;
    letter-spacing: -0.07em;
    box-shadow: 0 28px 72px rgba(0, 0, 0, 0.35);
  }
  .node {
    position: absolute;
    padding: 9px 13px;
    border: 1px solid var(--brand-border);
    border-radius: 8px;
    color: var(--brand-muted);
    background: var(--brand-surface);
    font-size: 11px;
    font-weight: 700;
  }
  .node-one { top: 38px; left: 178px; }
  .node-two { right: -5px; bottom: 110px; }
  .node-three { bottom: 22px; left: 70px; }
`;

const projectSocialCards = [
  {
    filename: "myverse-social-card.png",
    index: "01",
    title: "MYVERSE",
    stack: "NEXT.JS · TYPESCRIPT · POSTGRESQL",
    visual: "myverse",
  },
  {
    filename: "filtre-appels-social-card.png",
    index: "02",
    title: "FILTREAPPELS",
    stack: "KOTLIN · JETPACK COMPOSE · LOCAL RULES",
    visual: "calls",
  },
];

function projectSocialMarkup({ index, title, stack, visual }) {
  const visualMarkup =
    visual === "myverse"
      ? `<div class="orbit orbit-outer"></div>
         <div class="orbit orbit-inner"></div>
         <div class="project-core">MV</div>
         <span class="media-node node-one">FILM</span>
         <span class="media-node node-two">GAME</span>
         <span class="media-node node-three">BOOK</span>
         <span class="media-node node-four">ANIME</span>
         <span class="media-node node-five">MANGA</span>
         <span class="media-node node-six">SERIES</span>`
      : `<div class="call-number">+33 •• •• •• 42</div>
         <div class="call-path path-one"><span>ALLOW</span></div>
         <div class="call-path path-two"><span>SILENCE</span></div>
         <div class="call-path path-three"><span>BLOCK</span></div>
         <div class="call-result">RULE / 04</div>`;

  return `<div class="grid"></div>
    <div class="glow"></div>
    <main>
      <div class="project-copy">
        <p class="kicker">PROJECT / ${index}</p>
        <h1>${title}</h1>
        <p class="stack">${stack}</p>
        <p class="signature">ETHAN BROSSELARD / PORTFOLIO</p>
      </div>
      <div class="project-field project-field--${visual}" aria-hidden="true">${visualMarkup}</div>
    </main>`;
}

const projectSocialStyles = `
  ${brandVariables}
  position: relative;
  color: var(--brand-text);
  background: var(--brand-bg);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  .grid {
    position: absolute;
    inset: 0;
    opacity: 0.52;
    background-image:
      linear-gradient(var(--brand-grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--brand-grid) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .glow {
    position: absolute;
    top: -300px;
    right: -170px;
    width: 820px;
    height: 820px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--brand-accent-strong) 42%, transparent),
      transparent 69%
    );
  }
  main {
    position: relative;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 68px 78px;
  }
  .project-copy { align-self: stretch; display: flex; flex-direction: column; }
  .kicker, .stack, .signature, .media-node, .call-number, .call-path span, .call-result {
    font-family: "SFMono-Regular", Consolas, monospace;
    letter-spacing: 0.12em;
  }
  .kicker {
    margin: 4px 0 42px;
    color: var(--brand-accent);
    font-size: 18px;
    font-weight: 750;
  }
  h1 {
    max-width: 620px;
    margin: 0;
    font-size: 68px;
    font-weight: 760;
    letter-spacing: -0.065em;
    line-height: 0.94;
  }
  .stack {
    max-width: 560px;
    margin: 35px 0 0;
    color: var(--brand-muted);
    font-size: 14px;
    font-weight: 650;
    line-height: 1.7;
  }
  .signature {
    margin: auto 0 2px;
    color: var(--brand-muted);
    font-size: 11px;
    font-weight: 700;
  }
  .project-field {
    position: relative;
    display: grid;
    place-items: center;
    justify-self: end;
    width: 460px;
    aspect-ratio: 1;
    border: 1px solid var(--brand-border);
    border-radius: 28px;
    background:
      radial-gradient(
        circle,
        color-mix(in srgb, var(--brand-accent) 20%, transparent),
        transparent 55%
      ),
      linear-gradient(145deg, var(--brand-surface), var(--brand-bg));
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.34);
  }
  .orbit {
    position: absolute;
    border: 2px solid color-mix(in srgb, var(--brand-accent) 38%, transparent);
    border-radius: 50%;
  }
  .orbit-outer { width: 74%; aspect-ratio: 1; }
  .orbit-inner { width: 44%; aspect-ratio: 1; }
  .project-core {
    position: relative;
    display: grid;
    place-items: center;
    width: 112px;
    aspect-ratio: 1;
    border: 2px solid color-mix(in srgb, var(--brand-accent) 68%, var(--brand-border));
    border-radius: 50%;
    color: var(--brand-accent);
    background: var(--brand-surface);
    font-size: 38px;
    font-weight: 760;
  }
  .media-node {
    position: absolute;
    padding: 8px 11px;
    border: 1px solid var(--brand-border);
    border-radius: 7px;
    color: var(--brand-muted);
    background: var(--brand-surface);
    font-size: 9px;
    font-weight: 700;
  }
  .node-one { top: 13%; left: 43%; }
  .node-two { top: 28%; right: 7%; }
  .node-three { right: 12%; bottom: 17%; }
  .node-four { bottom: 10%; left: 39%; }
  .node-five { bottom: 23%; left: 7%; }
  .node-six { top: 23%; left: 9%; }
  .project-field--calls { align-content: center; gap: 24px; padding: 58px 70px; }
  .call-number {
    width: 100%;
    margin-bottom: 18px;
    padding: 20px 16px;
    border: 1px solid var(--brand-border);
    border-radius: 12px;
    color: var(--brand-text);
    background: var(--brand-surface);
    font-size: 13px;
    text-align: center;
  }
  .call-path {
    position: relative;
    width: 100%;
    height: 8px;
    border-radius: 999px;
    background: var(--brand-border);
  }
  .call-path::before {
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--path-width);
    border-radius: inherit;
    background: var(--brand-accent);
    content: "";
  }
  .path-one { --path-width: 88%; }
  .path-two { --path-width: 61%; }
  .path-three { --path-width: 37%; }
  .call-path span {
    position: absolute;
    top: -6px;
    right: calc(100% + 16px);
    color: var(--brand-muted);
    font-size: 9px;
    font-weight: 700;
  }
  .call-result {
    margin-top: 17px;
    padding: 10px 14px;
    border-radius: 8px;
    color: var(--brand-accent);
    background: var(--brand-soft);
    font-size: 10px;
    font-weight: 750;
  }
`;

async function capture(page, { width, height, content, styles, filename }) {
  await page.setViewportSize({ width, height });
  await page.setContent(document(content, styles), { waitUntil: "load" });
  await page.screenshot({ path: path.join(outputDirectory, filename), type: "png" });
}

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await capture(page, {
    width: 64,
    height: 64,
    content: iconMarkup(),
    styles: iconStyles,
    filename: "favicon.png",
  });
  await capture(page, {
    width: 180,
    height: 180,
    content: iconMarkup(),
    styles: iconStyles,
    filename: "apple-touch-icon.png",
  });
  await capture(page, {
    width: 1200,
    height: 630,
    content: socialMarkup,
    styles: socialStyles,
    filename: "social-card.png",
  });
  for (const card of projectSocialCards) {
    await capture(page, {
      width: 1200,
      height: 630,
      content: projectSocialMarkup(card),
      styles: projectSocialStyles,
      filename: card.filename,
    });
  }
} finally {
  await browser.close();
}

console.log(
  "Generated favicon.png, apple-touch-icon.png, social-card.png, and two project social cards.",
);
