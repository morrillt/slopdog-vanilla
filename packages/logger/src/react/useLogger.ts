import { useSnapshot } from "valtio";
import { LogEntry, LogLevel } from "../core/types";

/**
 * Hook to use a Valtio-based logger state.
 */
export function useLogger(state: unknown) {
  return useSnapshot(state as object);
}

/**
 * Filter entries by minimum log level.
 */
export function filterByLevel(entries: LogEntry[], minLevel: LogLevel): LogEntry[] {
  const levelPriority: Record<LogLevel, number> = {
    trace: 0, debug: 1, info: 2, warn: 3, error: 4, fatal: 5,
  };
  const minPriority = levelPriority[minLevel];
  return entries.filter(entry => levelPriority[entry.level] >= minPriority);
}

/**
 * Filter entries by modules.
 */
export function filterByModules(entries: readonly LogEntry[], modules: string[]): LogEntry[] {
  if (modules.length === 0) return [...entries];
  const moduleSet = new Set(modules);
  return entries.filter(entry => moduleSet.has(entry.module));
}

/**
 * Filter entries by search text (checks message, module, functionName, subfunctionName).
 */
export function filterBySearch(entries: readonly LogEntry[], search: string): LogEntry[] {
  if (!search.trim()) return [...entries];
  const searchLower = search.toLowerCase();
  return entries.filter(entry => (
    entry.message.toLowerCase().includes(searchLower) ||
    entry.module.toLowerCase().includes(searchLower) ||
    entry.functionName.toLowerCase().includes(searchLower) ||
    (entry.subfunctionName?.toLowerCase().includes(searchLower) ?? false)
  ));
}

/**
 * Filter entries by time range (in minutes from now).
 */
export function filterByTimeRange(entries: readonly LogEntry[], minutes: number): LogEntry[] {
  if (minutes <= 0) return [...entries];
  const cutoff = Date.now() - minutes * 60 * 1000;
  return entries.filter(entry => entry.timestamp >= cutoff);
}

/**
 * Get unique modules from entries.
 */
export function getUniqueModules(entries: readonly LogEntry[]): string[] {
  const modules = new Set<string>();
  for (const entry of entries) {
    modules.add(entry.module);
  }
  return Array.from(modules).sort();
}

/**
 * Get unique tags from entries.
 */
export function getUniqueTags(entries: readonly LogEntry[]): string[] {
  const tags = new Set<string>();
  for (const entry of entries) {
    if (entry.tags) {
      for (const tag of entry.tags) {
        if (tag) tags.add(tag);
      }
    }
  }
  return Array.from(tags).sort();
}
