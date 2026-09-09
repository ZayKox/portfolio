import { preview } from "astro";

// Keep the server in Playwright's process group. The Astro CLI can otherwise
// auto-detach in an agent environment, preventing deterministic test cleanup.
const server = await preview({ server: { host: "127.0.0.1", port: 4322 } });
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await server.stop();
    process.exit(0);
  });
}
