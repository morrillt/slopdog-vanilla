/**
 * Log level type definition.
 * Ordered from most verbose (trace) to most critical (fatal).
 */
export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

/**
 * A single log entry in the ring buffer.
 */
export interface LogEntry {
  id: string;                      // Unique ID for React keys (prevents re-render issues)
  timestamp: number;               // Unix timestamp (ms) when log was created
  module: string;                  // Module name from createLogger() (e.g., "backtest", "strategies")
  functionType: "main" | "helper"; // Category: main business logic or helper utility
  functionName: string;            // Function name from logger.main() or logger.helper()
  subfunctionName?: string;        // Optional: nested operation name (only for TRACE/rare DEBUG)
  level: LogLevel;                 // Log level: "trace" | "debug" | "info" | "warn" | "error" | "fatal"
  message: string;                 // Short human-readable description of what happened
  data?: Record<string, unknown>;  // Optional: named JSON objects with context (input, output, config, error, etc.)
  tags?: readonly string[];        // Optional: tags for filtering (e.g., ["candle-check", "trade-found"])
}

/**
 * Configuration for a single module.
 */
export interface ModuleConfig {
  enabled: boolean;  // Whether this module logs at all
  level: LogLevel;   // Minimum level to log
}

/**
 * Interface for a logger store that handles adding entries and module registration.
 */
export interface LoggerStore {
  addEntry(entry: LogEntry): void;
  isModuleEnabled(module: string): boolean;
  getModuleConfig(module: string): ModuleConfig | undefined;
}

/**
 * Function-scoped logger with level methods.
 */
export interface FunctionLogger {
  trace(message: string, data: Record<string, unknown> | undefined, subfunction: string | undefined, id: string, tags?: string[]): void;
  debug(message: string, data: Record<string, unknown> | undefined, subfunction: string | undefined, id: string, tags?: string[]): void;
  info(message: string, data: Record<string, unknown> | undefined, id: string, tags?: string[]): void;
  warn(message: string, data: Record<string, unknown> | undefined, id: string, tags?: string[]): void;
  error(message: string, data: Record<string, unknown> | undefined, id: string, tags?: string[]): void;
  fatal(message: string, data: Record<string, unknown> | undefined, id: string, tags?: string[]): void;
}

/**
 * Module-scoped logger.
 */
export interface ModuleLogger {
  main(functionName: string): FunctionLogger;
  helper(functionName: string): FunctionLogger;
}
