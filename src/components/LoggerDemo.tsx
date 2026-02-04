"use client";

import { useState, useEffect } from "react";
import { getLogger } from "@/stores/loggerStore";

// Create a module-scoped logger
const logger = getLogger("vanilla");

export function LoggerDemo() {
  const [counter, setCounter] = useState(0);

  // Log on mount
  useEffect(() => {
    const log = logger.main("LoggerDemo");
    log.info("Logger demo mounted", { initialCounter: counter }, "demo-mount", ["lifecycle"]);
  }, []);

  const handleIncrement = () => {
    const log = logger.main("handleIncrement");
    const oldValue = counter;
    const newValue = counter + 1;
    setCounter(newValue);
    log.info("Counter incremented", { oldValue, newValue }, "increment", ["user-action"]);
  };

  const handleReset = () => {
    const log = logger.main("handleReset");
    const oldValue = counter;
    setCounter(0);
    log.warn("Counter reset", { oldValue, newValue: 0 }, "reset", ["user-action"]);
  };

  const handleTestLogs = () => {
    const log = logger.main("handleTestLogs");
    
    // Generate different log levels for testing
    log.trace("This is a trace log", { detail: "very verbose info" }, "trace-test", "trace-demo", ["demo"]);
    log.debug("This is a debug log", { debugInfo: { nested: true, data: [1, 2, 3] } }, "debug-test", "debug-demo", ["demo"]);
    log.info("This is an info log", { status: "ok", timestamp: Date.now() }, "info-demo", ["demo"]);
    log.warn("This is a warning log", { warning: "something might be wrong", severity: "medium" }, "warn-demo", ["demo"]);
    log.error("This is an error log", { error: "simulated error", code: 500, stack: "Error: simulated" }, "error-demo", ["demo"]);
    log.fatal("This is a fatal log", { fatal: "critical failure simulation", recovery: false }, "fatal-demo", ["demo"]);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <div className="max-w-2xl mx-auto rounded-xl border border-mocha-surface1 bg-mocha-mantle/95 backdrop-blur p-4 shadow-xl">
        <h2 className="text-sm font-semibold text-mocha-subtext1 mb-3 uppercase tracking-wide">Logger Demo</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-lg bg-mocha-blue px-3 py-2 text-sm font-medium text-mocha-crust hover:bg-mocha-sapphire transition-colors"
            onClick={handleIncrement}
            type="button"
            data-testid="increment-button"
          >
            Increment
          </button>

          <button
            className="rounded-lg border border-mocha-surface2 px-3 py-2 text-sm hover:bg-mocha-surface0 transition-colors"
            onClick={handleReset}
            type="button"
            data-testid="reset-button"
          >
            Reset
          </button>

          <div className="text-sm text-mocha-subtext1">counter: {counter}</div>

          <div className="ml-auto">
            <button
              className="rounded-lg bg-mocha-mauve px-3 py-2 text-sm font-medium text-mocha-crust hover:bg-mocha-pink transition-colors"
              onClick={handleTestLogs}
              type="button"
              data-testid="test-logs-button"
            >
              Generate All Log Levels
            </button>
          </div>
        </div>
        <p className="text-xs text-mocha-subtext0 mt-2 italic">
          Click the &quot;Logs&quot; button in the bottom-right to view log entries.
        </p>
      </div>
    </div>
  );
}
