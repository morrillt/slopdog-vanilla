"use client";

import { useSnapshot } from "valtio";
import { useEffect } from "react";

import { appStore } from "@/stores/appStore";
import { getLogger } from "@/stores/loggerStore";

// Create a module-scoped logger
const logger = getLogger("vanilla");

export function AppShell() {
  const snap = useSnapshot(appStore);

  // Log on mount
  useEffect(() => {
    const log = logger.main("AppShell");
    log.info("Component mounted", { counter: appStore.counter }, "mount", ["lifecycle"]);
  }, []);

  const handleIncrement = () => {
    const log = logger.main("handleIncrement");
    const oldValue = appStore.counter;
    appStore.counter += 1;
    log.info("Counter incremented", { oldValue, newValue: appStore.counter }, "increment", ["user-action"]);
  };

  const handleReset = () => {
    const log = logger.main("handleReset");
    const oldValue = appStore.counter;
    appStore.counter = 0;
    log.warn("Counter reset", { oldValue, newValue: 0 }, "reset", ["user-action"]);
  };

  const handleTestLogs = () => {
    const log = logger.main("handleTestLogs");
    
    // Generate different log levels for testing
    log.trace("This is a trace log", { detail: "very verbose" }, "trace-test", "trace-demo", ["demo"]);
    log.debug("This is a debug log", { debugInfo: { nested: true } }, "debug-test", "debug-demo", ["demo"]);
    log.info("This is an info log", { status: "ok" }, "info-demo", ["demo"]);
    log.warn("This is a warning log", { warning: "something might be wrong" }, "warn-demo", ["demo"]);
    log.error("This is an error log", { error: "simulated error", code: 500 }, "error-demo", ["demo"]);
    log.fatal("This is a fatal log", { fatal: "critical failure simulation" }, "fatal-demo", ["demo"]);
  };

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">slopdog-vanilla</h1>
          <p className="text-sm opacity-80">{snap.subtitle}</p>
        </header>

        <section className="rounded-xl border border-[color:var(--ctp-mocha-surface1)] bg-[color:var(--ctp-mocha-mantle)] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-lg bg-[color:var(--ctp-mocha-blue)] px-3 py-2 text-sm font-medium text-[color:var(--ctp-mocha-base)]"
              onClick={handleIncrement}
              type="button"
              data-testid="increment-button"
            >
              Increment
            </button>

            <button
              className="rounded-lg border border-[color:var(--ctp-mocha-surface2)] px-3 py-2 text-sm"
              onClick={handleReset}
              type="button"
              data-testid="reset-button"
            >
              Reset
            </button>

            <div className="text-sm opacity-90">counter: {snap.counter}</div>
          </div>
        </section>

        <section className="rounded-xl border border-[color:var(--ctp-mocha-surface1)] bg-[color:var(--ctp-mocha-mantle)] p-4">
          <h2 className="text-sm font-medium mb-3 text-mocha-subtext1">Logger Demo</h2>
          <button
            className="rounded-lg bg-[color:var(--ctp-mocha-mauve)] px-3 py-2 text-sm font-medium text-[color:var(--ctp-mocha-base)]"
            onClick={handleTestLogs}
            type="button"
            data-testid="test-logs-button"
          >
            Generate Test Logs
          </button>
          <p className="text-xs text-mocha-subtext0 mt-2">
            Click to generate logs of all levels (trace, debug, info, warn, error, fatal)
          </p>
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

