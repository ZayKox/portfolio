export async function checkLink(
  url,
  {
    request = fetch,
    pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    timeout = 15_000,
  } = {},
) {
  const attempts = [];
  let finalReason = "Network requests failed; manual review required";
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
      finalReason = `HTTP ${status}; manual review required`;
      if (status < 500 || status > 599)
        return {
          url,
          status: "inconclusive",
          reason: finalReason,
          attempts,
        };
    } catch (error) {
      attempts.push({ error: error instanceof Error ? error.message : "Network error" });
      finalReason = "Network requests failed; manual review required";
    }
    if (attempt === 0) await pause(1000);
  }
  return { url, status: "inconclusive", reason: finalReason, attempts };
}
