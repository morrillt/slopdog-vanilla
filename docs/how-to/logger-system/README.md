# @slopdog-vanilla/logger

A modular, Valtio-powered logger for React applications.

## Features
- **Module & Function Scoping**: Trace exactly where a log came from.
- **Valtio State**: Reactive logs that don't trigger unnecessary re-renders.
- **UI Drawer**: Built-in slide-out drawer with filtering and JSON inspection.
- **Catppuccin Mocha Styling**: Ships with Catppuccin color scheme integration.

## Installation

The logger is included as a workspace package. It's already set up in `packages/logger`.

```bash
# Build the logger package
npm run logger:build
```

## Usage

### 1. Initialize the Store

The store is already set up in `src/stores/loggerStore.ts`:

```typescript
import { createValtioStore, createLogger } from "@slopdog-vanilla/logger";

const { state, actions, ...store } = createValtioStore({
  storageKey: "slopdog-logger-configs"
});

export const loggerState = state;
export const loggerActions = actions;

export function getLogger(module: string) {
  return createLogger(module, store);
}
```

### 2. Create a Logger

```typescript
import { getLogger } from "@/stores/loggerStore";

const logger = getLogger("my-module");

function myFunction() {
  const log = logger.main("myFunction");
  log.info("Hello world", { data: 123 }, "unique-id-123");
}
```

### 3. Add the UI Drawer

The drawer is already integrated in `src/components/LayoutWrapper.tsx`:

```tsx
import { LogDrawer } from "@slopdog-vanilla/logger";
import { loggerState, loggerActions } from "@/stores/loggerStore";

export function LayoutWrapper({ children }) {
  return (
    <div>
      {children}
      <LogDrawer state={loggerState} actions={loggerActions} />
    </div>
  );
}
```

## Log Levels

| Level | When to Use |
|-------|-------------|
| `trace` | Very detailed, high-frequency logs (loop iterations, calculations) |
| `debug` | Detailed diagnostic info (validation, helper calls, substeps) |
| `info` | General informational messages (function entry/exit, milestones) |
| `warn` | Warning conditions that don't stop execution |
| `error` | Error conditions that affect functionality |
| `fatal` | Critical errors that stop execution |

## API Reference

### `createLogger(module, store)`

Creates a module-scoped logger.

```typescript
const logger = createLogger("backtest", store);
```

### `logger.main(functionName)`

Creates a function logger for main business logic.

```typescript
const log = logger.main("generateTrades");
log.info("Starting", { count: 10 }, "start-001");
```

### `logger.helper(functionName)`

Creates a function logger for helper/utility functions.

```typescript
const log = logger.helper("calculatePrice");
log.trace("Computing", { input: 100 }, undefined, "calc-001");
```

### Log Methods

```typescript
log.trace(message, data?, subfunction?, id, tags?)
log.debug(message, data?, subfunction?, id, tags?)
log.info(message, data?, id, tags?)
log.warn(message, data?, id, tags?)
log.error(message, data?, id, tags?)
log.fatal(message, data?, id, tags?)
```

## File Map

| Path | Purpose |
|------|---------|
| `packages/logger/src/core/types.ts` | Type definitions |
| `packages/logger/src/core/factory.ts` | Logger factory |
| `packages/logger/src/valtio/store.ts` | Valtio state store |
| `packages/logger/src/react/useLogger.ts` | React hook and filters |
| `packages/logger/src/react/LogDrawer.tsx` | UI drawer component |
| `packages/logger/src/react/JsonViewer.tsx` | JSON data viewer |
| `src/stores/loggerStore.ts` | App-level logger store |
| `src/components/LayoutWrapper.tsx` | LogDrawer integration |
