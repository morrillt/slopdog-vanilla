---
title: "Logger System Guide"
updated: "2026-02-04"
facets:
  type: guide
  status: active
  repo:
    path: docs/how-to/logger-system/logger-system-guide.md
description: >-
  Comprehensive guide to the Slopdog logger: creating log events, understanding
  the UI, and configuration reference.
tags:
  - doc/howto
  - tech/frontend/ui
  - audience/dev
---

# Logger System Guide

A modular, Valtio-powered logging system for React applications with a built-in UI drawer for filtering and inspecting logs.

---

## Part 1: Creating Logs (For Developers)

### Quick Start

```typescript
import { getLogger } from "@/stores/loggerStore";

// 1. Module logger (top of file, once per file)
const logger = getLogger("my-module");

export function MyComponent() {
  // 2. Function logger (inside each function)
  const log = logger.main("MyComponent");

  // 3. Log at milestones with a custom ID (grepable!)
  log.info("mounted", { props: { userId } }, "mount-001", ["lifecycle"]);
  
  const handleClick = () => {
    const clickLog = logger.main("handleClick");
    clickLog.info("clicked", { button: "submit" }, "click-001", ["user-action"]);
  };

  return <button onClick={handleClick}>Click</button>;
}
```

### Creating Loggers

| Factory | Returns | Use Case |
|---------|---------|----------|
| `getLogger(module)` | `ModuleLogger` | Create once per file at top level |
| `logger.main(fnName)` | `FunctionLogger` | Main business logic functions |
| `logger.helper(fnName)` | `FunctionLogger` | Helper/utility functions |

### Log Methods

| Method | Signature | Use Case |
|--------|-----------|----------|
| `log.trace()` | `(message, data?, subfunction?, id, tags?)` | Hotspots/loops (high-volume) |
| `log.debug()` | `(message, data?, subfunction?, id, tags?)` | Decision points, validation |
| `log.info()` | `(message, data?, id, tags?)` | Milestones (start/end/outcome) |
| `log.warn()` | `(message, data?, id, tags?)` | Non-blocking issues |
| `log.error()` | `(message, data?, id, tags?)` | Errors affecting functionality |
| `log.fatal()` | `(message, data?, id, tags?)` | Critical failures |

**Note**: `trace` and `debug` accept an optional `subfunction` parameter (3rd arg); the others do not.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | `string` | Yes | Short description of what happened |
| `data` | `Record<string, unknown>` | No | Named JSON objects (input, output, error) |
| `subfunction` | `string` | No | Nested operation name (trace/debug only) |
| `id` | `string` | Yes | Custom grepable ID (e.g., "start-001") |
| `tags` | `string[]` | No | Categories for filtering (e.g., ["api"]) |

### When to Use Each Level

| Level | Frequency | When to Use |
|-------|-----------|-------------|
| `trace` | Rare | Loop iterations, calculations (enable temporarily) |
| `debug` | Sparse | Decision points, validation results |
| `info` | 1-3 per function | Function start/end, major milestones |
| `warn` | As needed | Non-fatal issues |
| `error` | As needed | Errors that affect functionality |
| `fatal` | Rare | Critical failures that stop execution |

### Data Attachment Best Practices

Use descriptive, consistent key names and keep data small:

```typescript
// Good: Named, small data objects
log.info("processed batch", {
  input: { batchSize: items.length, batchId },
  output: { successCount: 50, failCount: 2 }
}, "batch-001");

// Bad: Huge data dumps
log.info("processed batch", {
  allItems: items,      // Could be thousands!
  allResults: results   // Summarize instead
}, "batch-001");
```

**Common key patterns:**
- `input` — Function inputs/parameters
- `output` — Function results
- `config` — Configuration state
- `error` — Error details (message, stack)
- `context` — IDs, timestamps, metadata

### Full Integration Example

```typescript
import { getLogger } from "@/stores/loggerStore";

const logger = getLogger("data-processor");

export function processData(items: Item[]) {
  const log = logger.main("processData");
  
  log.info("starting", {
    input: { itemCount: items.length }
  }, "proc-start", ["processing"]);
  
  for (const item of items) {
    if (!validateItem(item)) {
      log.warn("skipping invalid", {
        item: { id: item.id }
      }, "skip-001");
      continue;
    }
  }
  
  log.info("completed", {
    output: { processedCount: results.length }
  }, "proc-done", ["processing"]);
  
  return results;
}

function validateItem(item: Item) {
  const log = logger.helper("validateItem");
  
  log.debug("checking", {
    item: { id: item.id, type: item.type }
  }, "validate", "check-001");
  
  return item.valid;
}
```

---

## Part 2: Understanding the UI

### Accessing the Log Drawer

1. Click the floating **📋 Logs** button (bottom-right corner)
2. The drawer slides in from the right side

### UI Controls

| Control | Location | Purpose |
|---------|----------|---------|
| Module toggles | Settings section | Enable/disable logging per module |
| Level checkboxes | Levels section | Filter which levels to show |
| Search box | Search section | Text search across message, module, function |
| Time range | Time section | Show only logs from last N minutes |
| Tag filters | Tags section | Include/exclude specific tags |
| Auto-scroll | Header | Auto-scroll to newest entries |
| Sort order | Header | Newest first or oldest first |

### Reading Log Entries

Each log entry displays:

```
[HH:MM:SS.mmm] [LEVEL] module → functionType.functionName → subfunctionName
message
📎 data attachments (click to expand)
#tags
```

| Element | Source | Description |
|---------|--------|-------------|
| Timestamp | `timestamp` field | Time in HH:MM:SS.mmm format |
| Level badge | `level` field | Color-coded severity |
| Module | `module` field | Blue text, from `getLogger("module")` |
| Function scope | `functionType` + `functionName` | From `.main("name")` or `.helper("name")` |
| Subfunction | `subfunctionName` | Arrow notation (→) when provided |
| Message | `message` field | Main log text |
| 📎 Data | `data` field | Click paperclip to expand JSON viewer |
| #tags | `tags` field | Colored hashtag pills |

### Level Badge Colors

| Level | Color | Badge |
|-------|-------|-------|
| `trace` | Gray | Muted, for high-volume logs |
| `debug` | Blue | Diagnostic information |
| `info` | Green | Normal milestones |
| `warn` | Yellow | Warnings |
| `error` | Red | Errors |
| `fatal` | Maroon | Critical failures |

### Tag Colors

| Tag | Color | Meaning |
|-----|-------|---------|
| `#trade` | Green | Trade executed |
| `#no-trade` | Red | Trade skipped |
| All others | Purple | Generic category |

### Filtering Workflow

1. **Too many logs?** Disable modules you don't care about
2. **Looking for errors?** Uncheck TRACE, DEBUG, INFO levels
3. **Finding specific logs?** Use search with message keywords
4. **Recent only?** Set time range to last 5 or 15 minutes
5. **Specific category?** Use tag include/exclude filters

---

## Part 3: Schema & Configuration Reference

### LogEntry Schema

```typescript
interface LogEntry {
  id: string;              // Unique ID (your prefix + timestamp suffix)
  timestamp: number;       // Unix timestamp in milliseconds
  module: string;          // Module name from getLogger()
  functionType: "main" | "helper";
  functionName: string;    // Function name from .main() or .helper()
  subfunctionName?: string; // Optional subfunction (trace/debug only)
  level: LogLevel;         // trace | debug | info | warn | error | fatal
  message: string;         // Log message text
  data?: Record<string, unknown>; // Optional JSON attachments
  tags?: string[];         // Optional category tags
}
```

### Log Levels

| Level | Priority | Default Visibility |
|-------|----------|-------------------|
| `trace` | 0 | Hidden (below default threshold) |
| `debug` | 1 | Visible |
| `info` | 2 | Visible |
| `warn` | 3 | Visible |
| `error` | 4 | Visible |
| `fatal` | 5 | Visible |

### Module Configuration

Each module has its own config stored in localStorage:

```typescript
interface ModuleConfig {
  enabled: boolean;        // Show logs from this module
  minLevel: LogLevel;      // Minimum level to display (default: "debug")
}
```

### Store Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `MAX_ENTRIES` | 1000 | Ring buffer size (oldest removed when full) |
| `storageKey` | `"slopdog-logger-configs"` | localStorage key for persistence |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Logger System                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Your Code:                                             │
│  ┌──────────────────────────────────────────────┐      │
│  │ getLogger("module") → logger.main("fn")      │      │
│  │ → log.info("message", data, id, tags)        │      │
│  └──────────────────┬───────────────────────────┘      │
│                     │                                   │
│                     ▼                                   │
│  ┌──────────────────────────────────────────────┐      │
│  │ Valtio Store (ring buffer, 1000 entries)     │      │
│  │ + localStorage persistence for module configs │      │
│  └──────────────────┬───────────────────────────┘      │
│                     │                                   │
│                     ▼                                   │
│  ┌──────────────────────────────────────────────┐      │
│  │ LogDrawer UI (filters, JSON viewer)          │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### File Map

| Path | Purpose |
|------|---------|
| `packages/logger/src/core/types.ts` | Type definitions (LogEntry, LogLevel) |
| `packages/logger/src/core/factory.ts` | Logger factory (createLogger) |
| `packages/logger/src/valtio/store.ts` | Valtio store with ring buffer |
| `packages/logger/src/react/useLogger.ts` | React hook and filter utilities |
| `packages/logger/src/react/LogDrawer.tsx` | Main UI drawer component |
| `packages/logger/src/react/JsonViewer.tsx` | Expandable JSON data viewer |
| `src/stores/loggerStore.ts` | App-level singleton (import from here) |
| `src/components/LayoutWrapper.tsx` | LogDrawer integration point |
