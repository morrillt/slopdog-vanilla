/**
 * expectLog: wait for a logger milestone to fire, matched by its id and a partial payload.
 *
 * The logger stores every entry with an id of `<milestone id>-<ms timestamp>-<random>`
 * (core/factory.ts), so `expectLog(source, "draft.send.ok", { draftId: "draft-1" })` waits for an
 * entry logged with the id "draft.send.ok" whose `data` contains at least those fields.
 *
 * The source is either a Playwright `Page` (the entries are read from the test hook the Valtio
 * store puts on `window.__SLOPDOG_LOGS__` in dev and test builds), or any function returning the
 * entries, which is how a unit test drives it without a browser.
 *
 * This file has no imports and uses only erasable TypeScript, so `node --test` on Node 22.18+
 * can import it straight from source (Node strips the types); Playwright transpiles it as usual.
 */

export const LOG_HOOK_KEY = "__SLOPDOG_LOGS__";

export interface LoggedEntry {
  id: string;
  level?: string;
  module?: string;
  functionName?: string;
  message?: string;
  data?: Record<string, unknown>;
  timestamp?: number;
}

/** The slice of a Playwright Page that expectLog needs. */
export interface PageLike {
  evaluate<R, A>(fn: (arg: A) => R, arg: A): Promise<R>;
}

export type EntryReader = () => readonly LoggedEntry[] | null | Promise<readonly LoggedEntry[] | null>;
export type LogSource = PageLike | EntryReader;

export interface ExpectLogOptions {
  /** How long to wait for the entry, in ms. Default 5000. */
  timeout?: number;
  /** How often to re-read the entries, in ms. Default 50. */
  interval?: number;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** True when a stored entry id was logged with the given milestone id. */
export function logIdMatches(entryId: string, id: string): boolean {
  if (entryId === id) return true;
  return new RegExp(`^${escapeRegExp(id)}-\\d+-[a-z0-9]*$`).test(entryId);
}

/** Deep partial match: every key in `expected` must match in `actual`; arrays match element by element. */
export function partialMatch(actual: unknown, expected: unknown): boolean {
  if (expected === null || typeof expected !== "object") return Object.is(actual, expected);
  if (actual === null || typeof actual !== "object") return false;
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || actual.length !== expected.length) return false;
    return expected.every((e, i) => partialMatch(actual[i], e));
  }
  const a = actual as Record<string, unknown>;
  return Object.entries(expected as Record<string, unknown>).every(([k, v]) => partialMatch(a[k], v));
}

function isPage(source: LogSource): source is PageLike {
  return typeof source === "object" && source !== null && typeof (source as PageLike).evaluate === "function";
}

async function readEntries(source: LogSource): Promise<readonly LoggedEntry[] | null> {
  if (isPage(source)) {
    return source.evaluate((key: string) => {
      const hook = (globalThis as Record<string, unknown>)[key] as { entries(): LoggedEntry[] } | undefined;
      return hook ? hook.entries() : null;
    }, LOG_HOOK_KEY);
  }
  return source();
}

/**
 * Resolves with the first entry logged as `id` whose data contains `partialData`.
 * Rejects after the timeout, naming what was seen instead.
 */
export async function expectLog(
  source: LogSource,
  id: string,
  partialData: Record<string, unknown> = {},
  options: ExpectLogOptions = {},
): Promise<LoggedEntry> {
  const timeout = options.timeout ?? 5000;
  const interval = options.interval ?? 50;
  const deadline = Date.now() + timeout;
  let entries: readonly LoggedEntry[] | null = null;

  for (;;) {
    entries = await readEntries(source);
    const hit = entries?.find((e) => logIdMatches(e.id, id) && partialMatch(e.data ?? {}, partialData));
    if (hit) return hit;
    if (Date.now() >= deadline) break;
    await new Promise((r) => setTimeout(r, interval));
  }

  if (entries === null) {
    throw new Error(
      `expectLog: no log hook on ${LOG_HOOK_KEY} after ${timeout}ms; the page's logger store is not exposed (dev/test builds only).`,
    );
  }
  const sameId = entries.filter((e) => logIdMatches(e.id, id));
  const detail = sameId.length
    ? `${sameId.length} "${id}" entr${sameId.length === 1 ? "y" : "ies"} fired with other data: ${sameId
        .slice(-3)
        .map((e) => JSON.stringify(e.data ?? {}))
        .join(", ")}`
    : `it never fired; last ids seen: ${entries
        .slice(-8)
        .map((e) => {
          const bare = e.id.replace(/-\d+-[a-z0-9]*$/, "");
          return bare === "undefined" ? `(no id: "${e.message ?? ""}")` : bare;
        })
        .join(", ") || "(none)"}`;
  throw new Error(`expectLog: no "${id}" entry matching ${JSON.stringify(partialData)} within ${timeout}ms; ${detail}.`);
}
