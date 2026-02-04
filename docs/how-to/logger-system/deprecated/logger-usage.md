# Logger Usage Guide

## Quick Start

```typescript
// 1. Create module logger (once per file, top level)
import { getLogger } from "@/stores/loggerStore";
const logger = getLogger("my-module");

// 2. Scope logger to function (once per function)
const log = logger.main("myFunction");  // or logger.helper("helperFunction")

// 3. Log at milestones + decision points (keep sparse!)
log.info("starting", { input: { date, id } }, "start-001");           // Function entry
log.debug("validated", { checks: { isValid: true } }, undefined, "valid-002");  // Decision point
log.trace("iteration", { index, value }, "loop", "iter-003");         // Hotspot/loop (rare)
log.info("completed", { output: { count: 5 } }, "done-004");          // Function exit
```

## Signature

```typescript
// INFO, WARN, ERROR, FATAL
log.info(message: string, data?: Record<string, any>, id: string, tags?: string[]);

// DEBUG (with optional subfunction)
log.debug(message: string, data?: Record<string, any>, subfunction?: string, id: string, tags?: string[]);

// TRACE (with optional subfunction)
log.trace(message: string, data?: Record<string, any>, subfunction?: string, id: string, tags?: string[]);
```

## Rules

- **INFO**: 1-3 per main function (start, done, major outcome)
- **DEBUG**: sparse, only tricky decisions/calcs (0-N)
- **TRACE**: only hotspots/loops, gated behind scope + level
- Keep message short, data small
- If INFO+DEBUG doesn't explain it, enable TRACE for that scope temporarily

## Log Levels (when to use)

| Level | Use Case | Default Visibility |
|-------|----------|-------------------|
| `trace` | Very detailed, high-frequency logs (loop iterations, calculations) | Hidden (below default threshold) |
| `debug` | Detailed diagnostic info (validation, helper calls, substeps) | Visible by default |
| `info` | General informational messages (function entry/exit, milestones) | Visible |
| `warn` | Warning conditions that don't stop execution | Visible |
| `error` | Error conditions that affect functionality | Visible |
| `fatal` | Critical errors that stop execution | Visible |

## Integration Pattern

```typescript
// 1. Import and create logger (once per file, top level)
import { getLogger } from "@/stores/loggerStore";
const logger = getLogger("my-feature");

// 2. Log in main functions (entry/exit)
export function processData(items: Item[]) {
  const log = logger.main("processData");
  
  log.info("starting", {
    input: { itemCount: items.length }
  }, "proc-start", ["processing"]);
  
  // ... function logic ...
  
  log.info("completed", {
    output: { processedCount: results.length }
  }, "proc-done", ["processing"]);
  
  return results;
}

// 3. Log validation/substeps with subfunction name
function validateItem(item: Item) {
  const log = logger.helper("validateItem");
  
  log.debug("checking", {
    item: { id: item.id, type: item.type }
  }, "validate", "check-001");
  
  if (!item.valid) {
    log.warn("invalid item", {
      item: { id: item.id },
      reason: "missing required field"
    }, "invalid-001");
    return false;
  }
  
  return true;
}

// 4. Log errors with context
try {
  await riskyOperation();
} catch (err) {
  log.error("operation failed", {
    error: { message: err.message, stack: err.stack },
    context: { operationId, timestamp: Date.now() }
  }, "error-001");
}
```

## Data Attachment Best Practices

- Use descriptive keys: `input`, `output`, `config`, `result`, `error`, `context`
- Keep data small: Don't attach huge arrays (summarize instead)
- Include relevant IDs: date, userId, itemId, etc.
- Sanitize sensitive data: No passwords, tokens, etc.

```typescript
// Good
log.info("processed batch", {
  input: { batchSize: items.length, batchId },
  output: { successCount: 50, failCount: 2 }
}, "batch-001");

// Bad (too much data)
log.info("processed batch", {
  allItems: items,  // Could be huge!
  allResults: results
}, "batch-001");
```

## UI Access

1. Click the "📋 Logs" button in the bottom-right corner
2. Enable the module you want to see (e.g., "my-module")
3. Use filters to narrow down:
   - **Levels**: Toggle which levels to show
   - **Search**: Filter by message/module/function
   - **Time**: Show only recent logs
   - **Tags**: Include/exclude by tag
4. Click on expandable data attachments (📎) to inspect JSON payloads

## Tags

Tags help categorize logs for filtering:

```typescript
// Add tags to categorize logs
log.info("user action", { action: "click" }, "action-001", ["user-action", "ui"]);
log.info("API call", { endpoint: "/api/data" }, "api-001", ["api", "network"]);
log.warn("slow response", { ms: 2000 }, "slow-001", ["performance", "api"]);
```

Common tag patterns:
- `lifecycle` - Component mount/unmount
- `user-action` - User interactions
- `api` - API calls
- `performance` - Performance-related logs
- `demo` - Test/demo logs
