import { 
  LogEntry, 
  LogLevel, 
  LoggerStore, 
  FunctionLogger, 
  ModuleLogger 
} from "./types";

/**
 * Internal log method that creates and adds a log entry.
 */
function log(
  store: LoggerStore,
  module: string,
  functionType: "main" | "helper",
  functionName: string,
  level: LogLevel,
  message: string,
  data: Record<string, unknown> | undefined,
  subfunctionName: string | undefined,
  customId: string,
  tags?: string[]
): void {
  // Ensure ID is unique by appending timestamp if custom ID is provided
  const uniqueId = `${customId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  
  store.addEntry({
    id: uniqueId,
    timestamp: Date.now(),
    module,
    functionType,
    functionName,
    subfunctionName,
    level,
    message,
    data,
    tags: tags,
  });
}

/**
 * Create a function-scoped logger.
 */
function createFunctionLogger(
  store: LoggerStore,
  module: string,
  functionType: "main" | "helper",
  functionName: string
): FunctionLogger {
  return {
    trace(message, data, subfunction, id, tags) {
      log(store, module, functionType, functionName, "trace", message, data, subfunction, id, tags);
    },
    debug(message, data, subfunction, id, tags) {
      log(store, module, functionType, functionName, "debug", message, data, subfunction, id, tags);
    },
    info(message, data, id, tags) {
      log(store, module, functionType, functionName, "info", message, data, undefined, id, tags);
    },
    warn(message, data, id, tags) {
      log(store, module, functionType, functionName, "warn", message, data, undefined, id, tags);
    },
    error(message, data, id, tags) {
      log(store, module, functionType, functionName, "error", message, data, undefined, id, tags);
    },
    fatal(message, data, id, tags) {
      log(store, module, functionType, functionName, "fatal", message, data, undefined, id, tags);
    },
  };
}

/**
 * Factory to create a module-scoped logger.
 * Requires a LoggerStore implementation.
 */
export function createLogger(module: string, store: LoggerStore): ModuleLogger {
  return {
    main(functionName: string): FunctionLogger {
      return createFunctionLogger(store, module, "main", functionName);
    },
    helper(functionName: string): FunctionLogger {
      return createFunctionLogger(store, module, "helper", functionName);
    },
  };
}
