// T-487 AC-1: expectLog resolves when the milestone fires and rejects when it is missing or its
// payload differs. Runs against the built logger package (dist/, from `npm run logger:build`),
// the same build the app imports, so the real createLogger and Valtio store are under test.
//
//   npm run logger:build && node --test tests/unit/expect-log.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dist = (f) => pathToFileURL(path.join(root, "packages/logger/dist", f)).href;
const { createLogger, createValtioStore } = await import(dist("index.js"));
const { expectLog, LOG_HOOK_KEY, logIdMatches } = await import(dist("testing.js"));

function freshLogger() {
  const { state, actions, ...store } = createValtioStore({ storageKey: `t487-${Math.random()}`, exposeForTests: true });
  const log = createLogger("drafts", store).main("approveDraft");
  return { state, log, read: () => state.entries };
}

test("resolves with the entry when the milestone fires with matching data", async () => {
  const { log, read } = freshLogger();
  log.info("draft sent", { draftId: "draft-1", threadId: "thread-1", extra: 1 }, "draft.send.ok");
  const entry = await expectLog(read, "draft.send.ok", { draftId: "draft-1", threadId: "thread-1" });
  assert.equal(entry.module, "drafts");
  assert.equal(entry.data.extra, 1);
});

test("waits for a milestone that fires after the call", async () => {
  const { log, read } = freshLogger();
  setTimeout(() => log.info("late", { n: 2 }, "late.event"), 100);
  const entry = await expectLog(read, "late.event", { n: 2 }, { timeout: 2000 });
  assert.equal(entry.message, "late");
});

test("rejects when the milestone never fires, naming what did", async () => {
  const { log, read } = freshLogger();
  log.info("something else", {}, "draft.claimed");
  await assert.rejects(expectLog(read, "draft.send.ok", {}, { timeout: 200 }), /never fired; last ids seen: draft\.claimed/);
});

test("rejects when the milestone fires with a different payload", async () => {
  const { log, read } = freshLogger();
  log.info("draft sent", { draftId: "draft-2" }, "draft.send.ok");
  await assert.rejects(
    expectLog(read, "draft.send.ok", { draftId: "draft-1" }, { timeout: 200 }),
    /fired with other data: \{"draftId":"draft-2"\}/,
  );
});

test("an id does not match a longer id that starts with it", () => {
  assert.equal(logIdMatches("draft.send-1760200000000-ab1z", "draft.send"), true);
  assert.equal(logIdMatches("draft.send-ok-1760200000000-ab1z", "draft.send"), false);
});

test("the store's test hook exposes entries on globalThis for a Playwright page to read", async () => {
  const { log } = freshLogger();
  log.warn("hooked", { via: "hook" }, "hook.event");
  const hook = globalThis[LOG_HOOK_KEY];
  assert.ok(hook, "hook installed");
  const page = { evaluate: async (fn, arg) => fn(arg) }; // stands in for a Playwright Page
  const entry = await expectLog(page, "hook.event", { via: "hook" });
  assert.equal(entry.level, "warn");
});

test("a page with no hook rejects with a clear message", async () => {
  const page = { evaluate: async () => null };
  await assert.rejects(expectLog(page, "x", {}, { timeout: 100 }), /no log hook on __SLOPDOG_LOGS__/);
});
