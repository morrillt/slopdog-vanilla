"use client";

import { createValtioStore, createLogger } from "@slopdog-vanilla/logger";
import type { ModuleLogger } from "@slopdog-vanilla/logger";

// Create the global logger store
// Changed storage key to reset old module configs
const { state, actions, ...store } = createValtioStore({
  storageKey: "slopdog-vanilla-logger-v2",
});

// Export the state and actions for the LogDrawer
export const loggerState = state;
export const loggerActions = actions;

// Factory to create module-scoped loggers
export function getLogger(module: string): ModuleLogger {
  return createLogger(module, store);
}
