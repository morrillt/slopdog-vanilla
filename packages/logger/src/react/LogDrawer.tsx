"use client";

import { useState, useEffect, useRef } from "react";
import { LogEntry, LogLevel, ModuleConfig } from "../core/types";
import { JsonAttachments } from "./JsonViewer";
import { useLogger, filterBySearch, filterByTimeRange, getUniqueModules, getUniqueTags } from "./useLogger";
import { ValtioLoggerActions, ValtioLoggerState } from "../valtio/store";

/**
 * Local storage key for log drawer preferences
 */
const LOG_DRAWER_PREFS_KEY = "slopdog-logDrawerPreferences";

/**
 * Interface for log drawer preferences stored in localStorage
 */
interface LogDrawerPreferences {
  selectedLevels: LogLevel[];
  searchText: string;
  timeRange: number;
  autoScroll: boolean;
  sortOldestFirst: boolean;
  includedTags: string[];
  excludedTags: string[];
  settingsExpanded: boolean;
  modulesExpanded: boolean;
  levelsExpanded: boolean;
  timeExpanded: boolean;
  searchExpanded: boolean;
  tagsExpanded: boolean;
}

/**
 * Default preferences
 */
const DEFAULT_PREFS: LogDrawerPreferences = {
  selectedLevels: ["trace", "debug", "info", "warn", "error", "fatal"],
  searchText: "",
  timeRange: 0,
  autoScroll: true,
  sortOldestFirst: false,
  includedTags: [],
  excludedTags: [],
  settingsExpanded: true,
  modulesExpanded: true,
  levelsExpanded: true,
  timeExpanded: false,
  searchExpanded: true,
  tagsExpanded: false,
};

/**
 * Load preferences from localStorage
 */
function loadPreferences(): LogDrawerPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const stored = localStorage.getItem(LOG_DRAWER_PREFS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<LogDrawerPreferences>;
      return { ...DEFAULT_PREFS, ...parsed };
    }
  } catch {
    // Ignore errors
  }
  return DEFAULT_PREFS;
}

/**
 * Save preferences to localStorage
 */
function savePreferences(prefs: LogDrawerPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOG_DRAWER_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore errors
  }
}

interface LogDrawerProps {
  state: ValtioLoggerState;
  actions: ValtioLoggerActions;
}

/**
 * Log level badge with color coding (Catppuccin Mocha colors).
 */
function LogLevelBadge({ level }: { level: LogLevel }) {
  const colors: Record<LogLevel, string> = {
    trace: "bg-mocha-overlay0 text-mocha-subtext1",
    debug: "bg-mocha-blue text-mocha-crust",
    info: "bg-mocha-green text-mocha-crust",
    warn: "bg-mocha-yellow text-mocha-crust",
    error: "bg-mocha-red text-mocha-crust",
    fatal: "bg-mocha-maroon text-mocha-crust",
  };

  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${colors[level]}`} data-testid={`log-level-${level}`}>
      {level.toUpperCase()}
    </span>
  );
}

/**
 * Format timestamp as HH:MM:SS.mmm
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ms = date.getMilliseconds().toString().padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${ms}`;
}

/**
 * Single log entry display.
 */
function LogEntryDisplay({ entry }: { entry: LogEntry }) {
  const parts = entry.id.split('-');
  const displayId = parts.length >= 3 && /^\d{13,}$/.test(parts[parts.length - 2])
    ? parts.slice(0, -2).join('-')
    : (entry.id.length > 8 ? entry.id.slice(-8) : entry.id);
  
  return (
    <div className="border-b border-mocha-surface0 p-2 hover:bg-mocha-surface0/50" data-testid="log-entry">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-mocha-overlay0 font-mono text-[10px]" title={`ID: ${entry.id}`}>
          {displayId}
        </span>
        <span className="text-mocha-subtext0 font-mono">{formatTimestamp(entry.timestamp)}</span>
        <LogLevelBadge level={entry.level} />
        <span className="text-mocha-blue" data-testid="log-module">{entry.module}</span>
      </div>
      <div className="mt-1 text-sm">
        <span className="text-mocha-subtext0">
          {entry.functionType}.{entry.functionName}
        </span>
        {entry.subfunctionName && (
          <span className="text-mocha-overlay0"> → {entry.subfunctionName}</span>
        )}
      </div>
      <div className="mt-1 flex items-start gap-2 flex-wrap">
        <span className="text-sm text-mocha-text" data-testid="log-message">{entry.message}</span>
        {entry.tags && Array.isArray(entry.tags) && entry.tags.length > 0 && (
          <span className="text-xs flex flex-wrap gap-1 items-center">
            {entry.tags.map((tag, idx) => {
              if (!tag) return null;
              let tagColor = "text-mocha-mauve";
              if (tag === "trade") tagColor = "text-mocha-green";
              else if (tag === "no-trade") tagColor = "text-mocha-red";
              return (
                <span key={idx} className={`whitespace-nowrap ${tagColor}`}>#{tag}</span>
              );
            })}
          </span>
        )}
      </div>
      <JsonAttachments data={entry.data} />
    </div>
  );
}

/**
 * Module toggle chip.
 */
function ModuleToggle({ 
  module, 
  enabled, 
  onToggle 
}: { 
  module: string; 
  enabled: boolean; 
  onToggle: (module: string, enabled: boolean) => void;
}) {
  return (
    <button
      onClick={() => onToggle(module, !enabled)}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
        enabled
          ? "bg-mocha-blue text-mocha-crust hover:bg-mocha-sapphire"
          : "bg-mocha-surface0 text-mocha-subtext0 hover:bg-mocha-surface1"
      }`}
    >
      {module} {enabled && "✓"}
    </button>
  );
}

/**
 * Main log drawer component.
 */
export function LogDrawer({ state, actions }: LogDrawerProps) {
  const { entries, moduleConfigs, drawerOpen } = useLogger(state) as ValtioLoggerState;
  
  // Load preferences
  const [selectedLevels, setSelectedLevels] = useState<Set<LogLevel>>(
    () => new Set(loadPreferences().selectedLevels)
  );
  const [searchText, setSearchText] = useState(() => loadPreferences().searchText);
  const [timeRange, setTimeRange] = useState(() => loadPreferences().timeRange);
  const [autoScroll, setAutoScroll] = useState(() => loadPreferences().autoScroll);
  const [sortOldestFirst, setSortOldestFirst] = useState(() => loadPreferences().sortOldestFirst);
  const [includedTags, setIncludedTags] = useState<string[]>(() => loadPreferences().includedTags);
  const [excludedTags, setExcludedTags] = useState<string[]>(() => loadPreferences().excludedTags);
  const [settingsExpanded, setSettingsExpanded] = useState(() => loadPreferences().settingsExpanded);
  const [modulesExpanded, setModulesExpanded] = useState(() => loadPreferences().modulesExpanded);
  const [levelsExpanded, setLevelsExpanded] = useState(() => loadPreferences().levelsExpanded);
  const [timeExpanded, setTimeExpanded] = useState(() => loadPreferences().timeExpanded);
  const [searchExpanded, setSearchExpanded] = useState(() => loadPreferences().searchExpanded);
  const [tagsExpanded, setTagsExpanded] = useState(() => loadPreferences().tagsExpanded);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Save preferences whenever they change
  useEffect(() => {
    savePreferences({
      selectedLevels: Array.from(selectedLevels),
      searchText,
      timeRange,
      autoScroll,
      sortOldestFirst,
      includedTags,
      excludedTags,
      settingsExpanded,
      modulesExpanded,
      levelsExpanded,
      timeExpanded,
      searchExpanded,
      tagsExpanded,
    });
  }, [selectedLevels, searchText, timeRange, autoScroll, sortOldestFirst, includedTags, excludedTags, settingsExpanded, modulesExpanded, levelsExpanded, timeExpanded, searchExpanded, tagsExpanded]);

  // Get all modules
  const configuredModules = Object.keys(moduleConfigs);
  const activeModules = getUniqueModules(entries);
  const allModules = Array.from(new Set([...configuredModules, ...activeModules])).sort();

  // Get all tags
  const allTags = getUniqueTags(entries);

  // Toggle a log level
  const toggleLevel = (level: LogLevel) => {
    const newLevels = new Set(selectedLevels);
    if (newLevels.has(level)) {
      newLevels.delete(level);
    } else {
      newLevels.add(level);
    }
    setSelectedLevels(newLevels);
  };

  // Apply filters
  let filteredEntries = entries.filter(entry => selectedLevels.has(entry.level));
  
  // Filter by enabled modules
  const disabledModules = Object.entries(moduleConfigs)
    .filter(([_, config]) => config.enabled === false)
    .map(([module]) => module);
  if (disabledModules.length > 0) {
    filteredEntries = filteredEntries.filter(entry => !disabledModules.includes(entry.module));
  }
  
  filteredEntries = filterBySearch(filteredEntries, searchText);
  if (timeRange > 0) {
    filteredEntries = filterByTimeRange(filteredEntries, timeRange);
  }

  // Filter by tags
  if (includedTags.length > 0 || excludedTags.length > 0) {
    filteredEntries = filteredEntries.filter(entry => {
      const entryTags = entry.tags || [];
      const hasNoTags = entryTags.length === 0;
      
      const excludeNoTag = excludedTags.includes("no-tag");
      if (excludeNoTag && hasNoTags) return false;
      
      if (includedTags.length > 0) {
        if (hasNoTags && !excludeNoTag) return true;
        const hasIncludedTag = includedTags.some(tag => entryTags.includes(tag));
        if (!hasIncludedTag) return false;
      }
      
      if (excludedTags.length > 0) {
        if (hasNoTags && !excludeNoTag) return true;
        const hasExcludedTag = excludedTags.some(tag => tag !== "no-tag" && entryTags.includes(tag));
        if (hasExcludedTag) return false;
      }
      
      return true;
    });
  }

  // Sort entries
  filteredEntries = [...filteredEntries].sort((a, b) => {
    return sortOldestFirst ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
  });

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      if (sortOldestFirst) {
        scrollRef.current.scrollTop = 0;
      } else {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [entries.length, autoScroll, sortOldestFirst]);

  if (!drawerOpen) {
    return (
      <button
        onClick={() => actions.toggleDrawer(true)}
        className="fixed bottom-4 right-4 w-8 h-8 rounded-full shadow-lg z-50 border border-mocha-surface2 hover:border-mocha-blue hover:scale-110 transition-all bg-mocha-surface0 overflow-visible"
        data-testid="log-drawer-toggle"
        title={`Logs (${entries.length})`}
      >
        <img 
          src="/image.png" 
          alt="Logs" 
          className="w-full h-full object-cover rounded-full"
        />
        {entries.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-mocha-blue text-mocha-crust text-[8px] font-bold rounded-full flex items-center justify-center">
            {entries.length > 99 ? "99+" : entries.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div 
      className="fixed top-0 right-0 h-full w-[600px] max-w-full bg-mocha-mantle border-l border-mocha-surface1 shadow-2xl z-50 flex flex-col font-sans"
      data-testid="log-drawer"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-mocha-surface1 bg-mocha-crust">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-mocha-text">Logs</h2>
          <button
            onClick={() => setSortOldestFirst(!sortOldestFirst)}
            className="text-mocha-subtext0 hover:text-mocha-text p-1 rounded hover:bg-mocha-surface0 transition-colors"
            title={sortOldestFirst ? "Show newest first" : "Show oldest first"}
          >
            {sortOldestFirst ? "↑" : "↓"}
          </button>
        </div>
        <button 
          onClick={() => actions.toggleDrawer(false)} 
          className="text-mocha-subtext0 hover:text-mocha-text text-xl w-8 h-8 flex items-center justify-center rounded hover:bg-mocha-surface0"
          data-testid="log-drawer-close"
        >
          ×
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-mocha-surface1 space-y-3 overflow-y-auto max-h-[50vh]">
        {/* Settings Section */}
        <div>
          <button
            onClick={() => setSettingsExpanded(!settingsExpanded)}
            className="text-xs text-mocha-subtext0 hover:text-mocha-text flex items-center gap-1"
          >
            <span>Settings:</span>
            <span>{settingsExpanded ? "▼" : "▶"}</span>
          </button>
          
          {settingsExpanded && (
            <div className="mt-2 space-y-3">
              {/* Modules */}
              <div>
                <button
                  onClick={() => setModulesExpanded(!modulesExpanded)}
                  className="text-xs text-mocha-overlay0 hover:text-mocha-subtext0 flex items-center gap-1 mb-1"
                >
                  <span>Modules:</span>
                  <span>{modulesExpanded ? "▼" : "▶"}</span>
                </button>
                {modulesExpanded && (
                  <div className="flex flex-wrap gap-2">
                    {allModules.length > 0 ? (
                      allModules.map(module => (
                        <ModuleToggle
                          key={module}
                          module={module}
                          enabled={moduleConfigs[module]?.enabled ?? true}
                          onToggle={actions.toggleModule}
                        />
                      ))
                    ) : (
                      <span className="text-xs text-mocha-overlay0">No modules yet</span>
                    )}
                  </div>
                )}
              </div>

              {/* Levels */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <button
                    onClick={() => setLevelsExpanded(!levelsExpanded)}
                    className="text-xs text-mocha-overlay0 hover:text-mocha-subtext0 flex items-center gap-1"
                  >
                    <span>Levels:</span>
                    <span>{levelsExpanded ? "▼" : "▶"}</span>
                  </button>
                  {levelsExpanded && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedLevels(new Set(["trace", "debug", "info", "warn", "error", "fatal"]))}
                        className="text-xs text-mocha-blue hover:text-mocha-sapphire"
                      >
                        All
                      </button>
                      <span className="text-mocha-overlay0">|</span>
                      <button
                        onClick={() => setSelectedLevels(new Set())}
                        className="text-xs text-mocha-blue hover:text-mocha-sapphire"
                      >
                        None
                      </button>
                    </div>
                  )}
                </div>
                {levelsExpanded && (
                  <div className="flex flex-wrap gap-2">
                    {(["trace", "debug", "info", "warn", "error", "fatal"] as LogLevel[]).map(level => {
                      const colors: Record<LogLevel, string> = {
                        trace: "border-mocha-overlay0 text-mocha-subtext0",
                        debug: "border-mocha-blue text-mocha-blue",
                        info: "border-mocha-green text-mocha-green",
                        warn: "border-mocha-yellow text-mocha-yellow",
                        error: "border-mocha-red text-mocha-red",
                        fatal: "border-mocha-maroon text-mocha-maroon",
                      };
                      const isSelected = selectedLevels.has(level);
                      return (
                        <label
                          key={level}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors border ${
                            isSelected
                              ? `${colors[level]} bg-mocha-surface0`
                              : "border-mocha-surface1 text-mocha-overlay0 bg-mocha-surface0/50 hover:bg-mocha-surface0"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleLevel(level)}
                            className="w-3 h-3 accent-mocha-blue"
                          />
                          <span>{level.toUpperCase()}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Time */}
              <div>
                <button
                  onClick={() => setTimeExpanded(!timeExpanded)}
                  className="text-xs text-mocha-overlay0 hover:text-mocha-subtext0 flex items-center gap-1 mb-1"
                >
                  <span>Time:</span>
                  <span>{timeExpanded ? "▼" : "▶"}</span>
                </button>
                {timeExpanded && (
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(Number(e.target.value))}
                    className="w-full bg-mocha-surface0 text-mocha-text text-sm rounded px-2 py-1 border border-mocha-surface1"
                  >
                    <option value={0}>All time</option>
                    <option value={1}>Last 1 min</option>
                    <option value={5}>Last 5 min</option>
                    <option value={15}>Last 15 min</option>
                    <option value={60}>Last 1 hour</option>
                  </select>
                )}
              </div>

              {/* Search */}
              <div>
                <button
                  onClick={() => setSearchExpanded(!searchExpanded)}
                  className="text-xs text-mocha-overlay0 hover:text-mocha-subtext0 flex items-center gap-1 mb-1"
                >
                  <span>Search:</span>
                  <span>{searchExpanded ? "▼" : "▶"}</span>
                </button>
                {searchExpanded && (
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Filter by message, module, or function..."
                    className="w-full bg-mocha-surface0 text-mocha-text text-sm rounded px-3 py-2 border border-mocha-surface1 placeholder:text-mocha-overlay0 focus:outline-none focus:border-mocha-blue"
                    data-testid="log-search"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tags Section */}
        {allTags.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <button
                onClick={() => setTagsExpanded(!tagsExpanded)}
                className="text-xs text-mocha-subtext0 hover:text-mocha-text flex items-center gap-1"
              >
                <span>Tags:</span>
                <span>{tagsExpanded ? "▼" : "▶"}</span>
              </button>
              {(includedTags.length > 0 || excludedTags.length > 0) && (
                <button
                  onClick={() => { setIncludedTags([]); setExcludedTags([]); }}
                  className="text-xs text-mocha-blue hover:text-mocha-sapphire"
                >
                  Clear
                </button>
              )}
            </div>
            {tagsExpanded && (
              <div className="space-y-2">
                {/* Include Tags */}
                <div>
                  <div className="text-xs text-mocha-overlay0 mb-1">Include (any):</div>
                  <div className="flex flex-wrap gap-1">
                    {allTags.map(tag => {
                      const isIncluded = includedTags.includes(tag);
                      return (
                        <button
                          key={`include-${tag}`}
                          onClick={() => {
                            if (isIncluded) {
                              setIncludedTags(includedTags.filter(t => t !== tag));
                            } else {
                              setIncludedTags([...includedTags, tag]);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-xs transition-colors ${
                            isIncluded
                              ? "bg-mocha-mauve text-mocha-crust hover:bg-mocha-pink"
                              : "bg-mocha-surface0 text-mocha-subtext0 hover:bg-mocha-surface1"
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Exclude Tags */}
                <div>
                  <div className="text-xs text-mocha-overlay0 mb-1">Exclude:</div>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => {
                        const isExcluded = excludedTags.includes("no-tag");
                        if (isExcluded) {
                          setExcludedTags(excludedTags.filter(t => t !== "no-tag"));
                        } else {
                          setExcludedTags([...excludedTags, "no-tag"]);
                        }
                      }}
                      className={`px-2 py-0.5 rounded text-xs transition-colors ${
                        excludedTags.includes("no-tag")
                          ? "bg-mocha-red text-mocha-crust hover:bg-mocha-maroon"
                          : "bg-mocha-surface0 text-mocha-subtext0 hover:bg-mocha-surface1"
                      }`}
                    >
                      (no tag)
                    </button>
                    {allTags.map(tag => {
                      const isExcluded = excludedTags.includes(tag);
                      return (
                        <button
                          key={`exclude-${tag}`}
                          onClick={() => {
                            if (isExcluded) {
                              setExcludedTags(excludedTags.filter(t => t !== tag));
                            } else {
                              setExcludedTags([...excludedTags, tag]);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-xs transition-colors ${
                            isExcluded
                              ? "bg-mocha-red text-mocha-crust hover:bg-mocha-maroon"
                              : "bg-mocha-surface0 text-mocha-subtext0 hover:bg-mocha-surface1"
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => actions.clearLogs()} 
            className="px-3 py-1.5 bg-mocha-surface0 hover:bg-mocha-surface1 text-mocha-text text-sm rounded border border-mocha-surface1"
            data-testid="log-clear"
          >
            Clear
          </button>
          <button 
            onClick={() => setAutoScroll(!autoScroll)} 
            className={`px-3 py-1.5 text-sm rounded border ${autoScroll ? "bg-mocha-blue text-mocha-crust border-mocha-blue" : "bg-mocha-surface0 text-mocha-subtext0 border-mocha-surface1"}`}
          >
            Auto-scroll {autoScroll && "✓"}
          </button>
          <div className="flex-1 text-right text-xs text-mocha-subtext0">
            {filteredEntries.length} / {entries.length} entries
          </div>
        </div>
      </div>

      {/* Log entries */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto" data-testid="log-entries-container">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-mocha-subtext0 text-sm p-4">
            {entries.length === 0 ? (
              <>
                <div className="mb-2">No logs yet</div>
                <div className="text-xs text-mocha-overlay0 space-y-1 text-center">
                  <div>1. Enable a module above</div>
                  <div>2. Trigger an action</div>
                  <div>3. Logs will appear here</div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">No logs match current filters</div>
                <div className="text-xs text-mocha-overlay0">
                  {selectedLevels.size === 0 && "Select at least one log level"}
                  {selectedLevels.size > 0 && `${entries.length} logs hidden by filters`}
                </div>
              </>
            )}
          </div>
        ) : (
          filteredEntries.map((entry: LogEntry, index: number) => (
            <LogEntryDisplay key={`${entry.id}-${index}`} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
