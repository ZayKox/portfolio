import { preview } from "astro";

// Keep the server in Playwright's process group. The Astro CLI can otherwise
// auto-detach in an agent environment, preventing deterministic test cleanup.
const requestedPort = Number(process.env.PORTFOLIO_PREVIEW_PORT ?? "4322");
if (!Number.isSafeInteger(requestedPort) || requestedPort <= 0 || requestedPort > 65_535) {
  throw new Error("PORTFOLIO_PREVIEW_PORT must be a valid TCP port.");
}
const server = await preview({ server: { host: "127.0.0.1", port: requestedPort } });
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await server.stop();
    process.exit(0);
  });
}
