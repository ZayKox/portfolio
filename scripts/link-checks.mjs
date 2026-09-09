export async function checkLink(
  url,
  {
    request = fetch,
    pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    timeout = 15_000,
  } = {},
) {
  const attempts = [];
  const send = (method) =>
    request(url, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(timeout),
      headers: {
        "user-agent": "Ethan-Brosselard-Portfolio-Link-Check/1.0",
        ...(method === "GET" && { range: "bytes=0-0" }),
      },
    });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      let response = await send("HEAD");
      if ([405, 501].includes(response.status)) {
        await response.body?.cancel();
        response = await send("GET");
      }
      const status = response.status;
      await response.body?.cancel();
      attempts.push({ status });
      if (response.ok) return { url, status: "verified", attempts };
      if ([404, 410].includes(status))
        return { url, status: "broken", reason: `HTTP ${status}`, attempts };
      if (status < 500 || status > 599 || attempt === 1)
        return {
          url,
          status: "inconclusive",
          reason: `HTTP ${status}; manual review required`,
          attempts,
        };
    } catch (error) {
      attempts.push({ error: error instanceof Error ? error.message : "Network error" });
      if (attempt === 1)
        return {
          url,
          status: "inconclusive",
          reason: "Network requests failed; manual review required",
          attempts,
        };
    }
    await pause(1000);
  }
}
