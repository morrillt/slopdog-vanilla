# Guide to Logger System

This guide orients developers and AI to the Slopdog Vanilla logging system, which provides real-time, filtered, and interactive visibility into application behavior.

---

## 1. System Overview & Logic

The logger is a tiered, module-scoped system designed for sparse but high-signal tracing during complex operations.

### Core Logic: `packages/logger/src/core/factory.ts`
- **Module Loggers**: Created once per file using `getLogger(moduleName)`.
- **Function Loggers**: Created within functions using `logger.main(fnName)` or `logger.helper(fnName)`. This creates a scoped logger that automatically tags every entry with the function name and type.
- **Unique Traceability**: Every log call requires a **custom ID** (e.g., `"done123"`). The system appends a timestamp and random suffix to this ID, making it:
  1. **Grepable**: You can find the exact line of code that produced a log by searching for the custom ID.
  2. **React-Stable**: Ensures unique keys for rendering lists without collisions.

### Log Levels
1. **TRACE**: High-volume, hotspot/loop data (gated behind module + level settings).
2. **DEBUG**: Sparse, decision points or complex calculation results.
3. **INFO**: Major milestones (function start, function end, major outcome).
4. **WARN/ERROR/FATAL**: Issues and exceptions.

---

## 2. State Management

The logger uses **Valtio** for high-performance reactive state that survives across different parts of the Next.js app without prop-drilling.

### State Store: `packages/logger/src/valtio/store.ts`
- **Ring Buffer**: Stores a maximum of **1000 entries** (`MAX_ENTRIES`). When the limit is reached, the oldest entries are shifted out.
- **Persistence**: Module configurations (enabled/disabled state and minimum log levels) are persisted to `localStorage`.
- **Auto-Registration**: Any module that logs for the first time is automatically registered in the state and becomes visible in the UI.

### Hook: `packages/logger/src/react/useLogger.ts`
- Provides the `useLogger()` hook, which returns a reactive snapshot of the current logs and configs.
- Includes pure filter utilities: `filterByLevel`, `filterByModules`, `filterBySearch`, `filterByTimeRange`, `getUniqueModules`, `getUniqueTags`.

---

## 3. UX & UI Components

The logger is primarily interacted with through a global slide-out drawer.

### Log Drawer: `packages/logger/src/react/LogDrawer.tsx`
- **Slide-out UI**: A `fixed` position drawer that can be toggled via a floating button or programmatic state change.
- **Interactive Filters**:
  - **Module Toggles**: Enable/disable specific subsystems.
  - **Level Filters**: Multi-select levels to show (TRACE, DEBUG, INFO, WARN, ERROR, FATAL).
  - **Search**: Full-text search across messages, modules, and function names.
  - **Tags**: Include/Exclude tag filtering (e.g., `#trade`, `#no-trade`).
  - **Time Range**: Filter by last N minutes.
- **Log Entry Display**:
  - Shows timestamp (HH:MM:SS.mmm), module, function scope, and custom ID.
  - **JSON Attachments**: Uses `JsonAttachments` (from `JsonViewer.tsx`) to display the optional `data` payload in a collapsible, structured view.
- **Persistence**: UI preferences (sort order, auto-scroll, expanded sections) are saved to `localStorage`.

---

## 4. Quick Start (Cheat Sheet)

If you are an AI or developer adding logging to a component:

```typescript
import { getLogger } from "@/stores/loggerStore";

// 1. Module-level (Top of file)
const logger = getLogger("my-component");

export function MyComponent() {
  // 2. Function-level
  const log = logger.main("MyComponent");

  // 3. Log with custom ID (grepable!)
  log.info("Component mounted", { prop: "value" }, "mount-001", ["lifecycle"]);
  
  const handleClick = () => {
    const clickLog = logger.main("handleClick");
    clickLog.info("Button clicked", { timestamp: Date.now() }, "click-001", ["user-action"]);
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

---

## 5. File Map

| Path | Purpose |
|------|---------|
| `packages/logger/src/core/types.ts` | Type definitions (LogEntry, LogLevel, etc.) |
| `packages/logger/src/core/factory.ts` | Logger factory for creating module/function loggers |
| `packages/logger/src/valtio/store.ts` | Valtio proxy store, ring buffer, and persistence |
| `packages/logger/src/react/useLogger.ts` | React hook and filtering utilities |
| `packages/logger/src/react/LogDrawer.tsx` | Slide-out UI with filters and display logic |
| `packages/logger/src/react/JsonViewer.tsx` | Helper for rendering deep JSON data objects |
| `src/stores/loggerStore.ts` | App-level logger store singleton |
| `src/components/LayoutWrapper.tsx` | LogDrawer integration point |
| `tests/e2e/logger.e2e.spec.ts` | E2E tests for the logger workflow |
