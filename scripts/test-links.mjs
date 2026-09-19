import assert from "node:assert/strict";
import test from "node:test";
import { checkLink } from "./link-checks.mjs";

for (const [statuses, expected, attempts] of [
  [[200], "verified", 1],
  [[404], "broken", 1],
  [[410], "broken", 1],
  [[403], "inconclusive", 1],
  [[999], "inconclusive", 1],
  [[500, 200], "verified", 2],
  [[503, 503], "inconclusive", 2],
]) {
  test(`classifies ${statuses.join(",")} without calling uncertainty success`, async () => {
    let calls = 0;
    const result = await checkLink("https://example.com/", {
      request: async () => {
        const status = statuses[calls++];
        return { status, ok: status === 200 };
      },
      pause: async () => {},
    });
    assert.equal(result.status, expected);
    assert.equal(calls, attempts);
  });
}
test("a rejected HEAD falls back to GET", async () => {
  const methods = [];
  let cancellations = 0;
  const result = await checkLink("https://example.com/", {
    request: async (_, { method }) => {
      methods.push(method);
      return {
        status: method === "HEAD" ? 501 : 206,
        ok: method === "GET",
        body: { cancel: async () => cancellations++ },
      };
    },
  });
  assert.equal(result.status, "verified");
  assert.deepEqual(methods, ["HEAD", "GET"]);
  assert.equal(cancellations, 2);
});
test("network failures are bounded and retained for review", async () => {
  let calls = 0;
  const result = await checkLink("https://example.com/", {
    request: async () => {
      calls++;
      throw new Error("offline");
    },
    pause: async () => {},
  });
  assert.equal(calls, 2);
  assert.equal(result.status, "inconclusive");
  assert.equal(result.attempts[0].error, "offline");
});

test("non-Error network failures use a stable diagnostic", async () => {
  const result = await checkLink("https://example.com/", {
    request: async () => {
      throw "offline";
    },
    pause: async () => {},
  });
  assert.equal(result.attempts[0].error, "Network error");
  assert.equal(result.attempts.length, 2);
});

test("the default retry delay and options remain usable", async () => {
  let calls = 0;
  const result = await checkLink("https://example.com/", {
    request: async () => {
      calls += 1;
      return { status: calls === 1 ? 500 : 200, ok: calls === 2 };
    },
    timeout: 1,
  });
  assert.equal(result.status, "verified");
  assert.equal(calls, 2);
});

test("HTTP 405 also falls back from HEAD to GET", async () => {
  const methods = [];
  const result = await checkLink("https://example.com/", {
    request: async (_, { method }) => {
      methods.push(method);
      return { status: method === "HEAD" ? 405 : 200, ok: method === "GET" };
    },
  });
  assert.equal(result.status, "verified");
  assert.deepEqual(methods, ["HEAD", "GET"]);
});
