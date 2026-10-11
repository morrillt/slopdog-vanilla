import { proxy, subscribe } from "valtio";
import { LogEntry, LogLevel, ModuleConfig, LoggerStore } from "../core/types";
import { LOG_HOOK_KEY } from "../testing/expect-log";

export interface ValtioLoggerState {
  entries: LogEntry[];
  moduleConfigs: Record<string, ModuleConfig>;
  drawerOpen: boolean;
}

const MAX_ENTRIES = 1000;
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

function isProductionBuild(): boolean {
  try {
    // Bundlers (Next included) replace process.env.NODE_ENV inline; the try covers a bare browser.
    return process.env.NODE_ENV === "production";
  } catch {
    return false;
  }
}

interface LogTestHook {
  stores: Map<string, ValtioLoggerState>;
  entries(): LogEntry[];
  clear(): void;
}

/**
 * The test hook expectLog reads (testing/expect-log.ts): every exposed store's entries, oldest
 * first, as plain JSON. Keyed by storage key so a hot reload replaces its store instead of adding one.
 */
function exposeLogStore(key: string, state: ValtioLoggerState): void {
  const g = globalThis as unknown as Record<string, LogTestHook | undefined>;
  const hook: LogTestHook = g[LOG_HOOK_KEY] ?? {
    stores: new Map(),
    entries() {
      const all = [...this.stores.values()].flatMap((s) => s.entries);
      return JSON.parse(JSON.stringify(all.sort((a, b) => a.timestamp - b.timestamp)));
    },
    clear() {
      this.stores.forEach((s) => { s.entries.length = 0; });
    },
  };
  hook.stores.set(key, state);
  g[LOG_HOOK_KEY] = hook;
}

export interface ValtioLoggerActions {
  toggleDrawer: (open?: boolean) => void;
  toggleModule: (module: string, enabled: boolean) => void;
  setModuleLevel: (module: string, level: LogLevel) => void;
  clearLogs: () => void;
  resetModuleConfigs: () => void;
}

/**
 * Creates a Valtio-based LoggerStore.
 */
export function createValtioStore(options: { 
  storageKey?: string,
  initialConfigs?: Record<string, ModuleConfig>,
  /** Put the entries on globalThis.__SLOPDOG_LOGS__ for expectLog. Default: in the browser, outside production builds. */
  exposeForTests?: boolean,
} = {}): LoggerStore & { state: ValtioLoggerState; actions: ValtioLoggerActions } {
  
  const state = proxy<ValtioLoggerState>({
    entries: [],
    moduleConfigs: options.initialConfigs || {},
    drawerOpen: false,
  });

  // Persistence logic
  if (typeof window !== "undefined" && options.storageKey) {
    const stored = localStorage.getItem(options.storageKey);
    if (stored) {
      try {
        state.moduleConfigs = JSON.parse(stored);
      } catch (e) {
        console.warn("Failed to load logger configs", e);
      }
    }

    subscribe(state.moduleConfigs, () => {
      localStorage.setItem(options.storageKey!, JSON.stringify(state.moduleConfigs));
    });
  }

  if (options.exposeForTests ?? (typeof window !== "undefined" && !isProductionBuild())) {
    exposeLogStore(options.storageKey ?? "default", state);
  }

  const actions: ValtioLoggerActions = {
    toggleDrawer(open?: boolean) {
      state.drawerOpen = open ?? !state.drawerOpen;
    },
    toggleModule(module: string, enabled: boolean) {
      if (state.moduleConfigs[module]) {
        state.moduleConfigs[module].enabled = enabled;
      }
    },
    setModuleLevel(module: string, level: LogLevel) {
      if (state.moduleConfigs[module]) {
        state.moduleConfigs[module].level = level;
      }
    },
    clearLogs() {
      state.entries.length = 0;
    },
    resetModuleConfigs() {
      // Clear all module configs and localStorage
      Object.keys(state.moduleConfigs).forEach(key => {
        delete state.moduleConfigs[key];
      });
      if (typeof window !== "undefined" && options.storageKey) {
        localStorage.removeItem(options.storageKey);
      }
    },
  };

  return {
    state,
    actions,
    addEntry(entry: LogEntry) {
      // Auto-register
      if (!state.moduleConfigs[entry.module]) {
        state.moduleConfigs[entry.module] = { enabled: true, level: "debug" };
      }

      const config = state.moduleConfigs[entry.module];
      if (!config.enabled) return;
      if (LOG_LEVEL_PRIORITY[entry.level] < LOG_LEVEL_PRIORITY[config.level]) return;

      if (state.entries.length >= MAX_ENTRIES) {
        state.entries.shift();
      }
      state.entries.push(entry);
    },
    isModuleEnabled(module: string) {
      return state.moduleConfigs[module]?.enabled ?? true;
    },
    getModuleConfig(module: string) {
      return state.moduleConfigs[module];
    }
  };
}
