export type LogLevel = "debug" | "info" | "warn" | "error";

export type Logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => void;
  info: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
};

function emit(level: LogLevel, msg: string, meta?: Record<string, unknown>) {
  const line = meta ? { level, msg, ...meta } : { level, msg };
  // eslint-disable-next-line no-console
  console[level === "debug" ? "log" : level](line);
}

export function createLogger(): Logger {
  return {
    debug: (msg, meta) => emit("debug", msg, meta),
    info: (msg, meta) => emit("info", msg, meta),
    warn: (msg, meta) => emit("warn", msg, meta),
    error: (msg, meta) => emit("error", msg, meta),
  };
}

