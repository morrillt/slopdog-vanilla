"use client";

import { useSnapshot } from "valtio";

import { appStore } from "@/stores/appStore";

export function AppShell() {
  const snap = useSnapshot(appStore);

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">slopdogrpg</h1>
          <p className="text-sm opacity-80">{snap.subtitle}</p>
        </header>

        <section className="rounded-xl border border-[color:var(--ctp-mocha-surface1)] bg-[color:var(--ctp-mocha-mantle)] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-lg bg-[color:var(--ctp-mocha-blue)] px-3 py-2 text-sm font-medium text-[color:var(--ctp-mocha-base)]"
              onClick={() => {
                appStore.counter += 1;
              }}
              type="button"
            >
              Increment
            </button>

            <button
              className="rounded-lg border border-[color:var(--ctp-mocha-surface2)] px-3 py-2 text-sm"
              onClick={() => {
                appStore.counter = 0;
              }}
              type="button"
            >
              Reset
            </button>

            <div className="text-sm opacity-90">counter: {snap.counter}</div>
          </div>
        </section>

        <section className="text-xs opacity-70">
          Health check:{" "}
          <a className="underline" href="/api/health">
            /api/health
          </a>
        </section>
      </div>
    </main>
  );
}

