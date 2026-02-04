---
title: "Docs System Analysis: Reconciliation & Current State"
updated: "2026-02-04"
facets:
  type: note
  status: active
  repo:
    path: docs/how-to/DOCS-SYSTEM-ANALYSIS.md
description: >-
  Master analysis document that reconciles all RockCap docs-system documentation,
  identifies inconsistencies, and establishes the canonical current state.
tags:
  - doc/reference
  - meta/index
  - audience/dev
---
# Docs System Analysis: Reconciliation & Current State

## Purpose

This document analyzes all docs-system documentation copied from RockCap, identifies inconsistencies and outdated information, and establishes what the canonical current state should be for Slopdog Vanilla.

## Source Documents Analyzed

| Document | Source | Last Updated | Focus |
|----------|--------|--------------|-------|
| `rockcap-docfrontmatterrules.md` | `docs/docfrontmatterrules.md` | 2025-12-15 | Front-matter validation rules |
| `rockcap-how-the-docs-route-works.md` | `docs/how-to/how-the-docs-route-works.md` | 2025-12-31 | Comprehensive architecture guide |
| `rockcap-docs-system-architecture.md` | `docs/dev/docs-system-architecture.md` | 2025-12-15 | Technical reference |
| `rockcap-front-matter-schema.md` | `docs/templates/front-matter-schema.md` | Undated | Schema template & examples |
| `rockcap-user-guide.md` | `docs/user/docs-system-guide.md` | 2025-12-15 | End-user guide |

## Analysis Summary

### Consistency Check

#### ✅ Areas of Agreement (Consistent Across All Docs)

1. **Core Architecture**: All documents agree on the fundamental architecture:
   - Two API routes: `/api/docs/manifest` and `/api/docs/content`
   - Two frontend pages: `/docs` (index) and `/docs/[...slug]` (viewer)
   - File-based system scanning `docs/` and `plans/` directories

2. **Front Matter Required Fields**: All agree on:
   - `title` (string, required)
   - `updated` (YYYY-MM-DD format, required)
   - `facets.type` (required)
   - `facets.status` (required)
   - `tags` (required, can be empty for drafts)

3. **Taxonomy Structure**: All reference `docs/taxonomy.yaml` as source of truth for:
   - Facet allowed values
   - Tag hierarchies and naming

4. **Security Patterns**: All agree on:
   - Path validation (must start with `docs/` or `plans/`)
   - Directory traversal prevention (block `..`)
   - Server-side-only file access

#### ⚠️ Areas of Inconsistency

1. **`facets.type` Allowed Values**
   - Most docs say: `plan | strategy | note | changelog`
   - Slopdog Vanilla taxonomy.yaml says: `plan | note | guide | changelog`
   - **Issue**: RockCap has `strategy`, Slopdog has `guide` - these are different!
   - **Resolution**: Slopdog doesn't have trading strategies, so `guide` makes sense as a replacement.

2. **`facets.repo.path` Requirement**
   - `docfrontmatterrules.md` says: **Required** (in Global Schema section)
   - `docs-system-architecture.md` says: **Optional**
   - `front-matter-schema.md` says: **Optional**
   - **Resolution**: Should be **optional but recommended**. Required only for docs mode published docs.

3. **Front Matter Schema Completeness**
   - `docfrontmatterrules.md` has extensive Plan Mode requirements (questions, validation, review metadata)
   - Other docs don't mention these complex nested structures
   - **Resolution**: The complex Plan Mode structures are RockCap-specific for their ticket workflow. For Slopdog Vanilla, a simplified version is appropriate unless full BMAD workflow is implemented.

4. **Vercel Deployment**
   - `how-the-docs-route-works.md` documents the `resolveContentRoot()` fix for BUG-20260113
   - `docs-system-architecture.md` has an older version without this fix
   - **Resolution**: Use the updated version with parent directory priority check.

5. **`ticketStatus` Field**
   - Only mentioned in `how-the-docs-route-works.md` manifest response
   - Not in other docs' DocMetadata definitions
   - **Resolution**: This is a RockCap-specific field for their plan/ticket workflow.

### Outdated Information Identified

1. **`resolveContentRoot()` Function**
   - **Old version** (in `docs-system-architecture.md`):
     ```typescript
     function resolveContentRoot(): string {
       const cwd = process.cwd();
       const localDocs = path.join(cwd, "docs");
       if (fs.existsSync(localDocs)) return cwd;
       // ...
     }
     ```
   - **Current/Fixed version** (in `how-the-docs-route-works.md`):
     ```typescript
     function resolveContentRoot(): string {
       const cwd = process.cwd();
       
       // If we're in src/, prioritize the parent's docs/ directory
       if (cwd.endsWith("/src") || cwd.endsWith("\\src")) {
         const parent = path.resolve(cwd, "..");
         const parentDocs = path.join(parent, "docs");
         if (fs.existsSync(parentDocs)) return parent;
       }
       // ...
     }
     ```
   - **Status**: The fix was documented in BUG-20260113 and should be the canonical version.

2. **Package Versions**
   - Docs reference: Next.js 16.0.7, React 19.2.1
   - These may differ from Slopdog Vanilla's actual versions
   - **Resolution**: Should be verified against actual `package.json`

3. **Authentication Middleware**
   - Docs mention middleware issues and needing to allow `/api/docs/*`
   - Slopdog Vanilla may have different auth requirements
   - **Resolution**: Document actual middleware configuration when implementing

### RockCap-Specific Features (May Not Apply to Slopdog Vanilla)

These features are documented but are specific to RockCap's workflow:

1. **Strategy Facets** (`facets.strategy.slug`, `facets.strategy.version`)
   - Only needed for trading strategy documentation
   - Slopdog Vanilla should remove or repurpose

2. **Epic Facets** (`facets.epic.number`, `facets.epic.name`)
   - Part of BMAD ticket workflow
   - Only needed if implementing full BMAD planning system

3. **Questions/Validation/Review Metadata**
   - Complex ticket workflow automation
   - Only needed for full BMAD implementation

4. **Ticket Status Extraction**
   - Parsing `Status:` from markdown body
   - RockCap-specific for their ticket lifecycle

5. **Domain Tags** (e.g., `domain/strategy/orb-retest-breakout`)
   - Trading-specific categorization
   - Should be replaced with Slopdog-relevant domain tags

## Canonical Current State for Slopdog Vanilla

Based on this analysis, here's what the Slopdog Vanilla docs system should implement:

### Front Matter Schema (Simplified)

```yaml
---
title: "Document Title"           # Required
updated: "YYYY-MM-DD"             # Required
description: "Brief description"  # Optional but recommended
facets:
  type: plan | note | guide | changelog  # Required
  status: draft | active | deprecated | done  # Required
  repo:
    path: "docs/path/to/file.md"  # Optional but recommended
tags:                             # Required (can be empty for drafts)
  - doc/howto
  - tech/frontend/ui
---
```

### Taxonomy (Already Correct)

Slopdog Vanilla's `docs/taxonomy.yaml` is appropriately simplified:
- Uses `guide` instead of `strategy`
- Removes domain/indicator/strategy tags
- Keeps essential planning, doc, tech, ops, meta, and audience tags

### API Endpoints

Same as RockCap:
- `GET /api/docs/manifest` - Returns taxonomy + docs array
- `GET /api/docs/content?path=...` - Returns raw markdown

### File System Access

Use the **fixed** `resolveContentRoot()` that prioritizes parent directory when running from `src/`:

```typescript
function resolveContentRoot(): string {
  const cwd = process.cwd();
  
  // If we're in src/, prioritize the parent's docs/ directory
  if (cwd.endsWith("/src") || cwd.endsWith("\\src")) {
    const parent = path.resolve(cwd, "..");
    const parentDocs = path.join(parent, "docs");
    if (fs.existsSync(parentDocs)) return parent;
  }
  
  const localDocs = path.join(cwd, "docs");
  if (fs.existsSync(localDocs)) return cwd;

  const parent = path.resolve(cwd, "..");
  const parentDocs = path.join(parent, "docs");
  if (fs.existsSync(parentDocs)) return parent;

  return cwd;
}
```

### Vercel Deployment

Copy files during build:
```json
{
  "scripts": {
    "prepare-deploy": "cp -r docs/* src/docs/ 2>/dev/null || true && cp -r plans/* src/plans/ 2>/dev/null || true"
  }
}
```

## Recommendations

### Immediate Actions

1. **Keep existing `docs-system-guide.md`** - It's already simplified for Slopdog Vanilla
2. **Use reference files as implementation guides** - When building the actual API routes
3. **Verify taxonomy.yaml alignment** - Already looks good

### When Implementing

1. **Use the fixed `resolveContentRoot()`** - Don't copy the old buggy version
2. **Skip RockCap-specific features** - No need for strategy facets, ticket status extraction, etc.
3. **Test Vercel deployment** - Ensure file copying works in build

### Documentation Maintenance

1. **Reference files are historical** - Prefixed with `rockcap-` to indicate they're reference copies
2. **Update `docs-system-guide.md`** - As the canonical Slopdog Vanilla documentation
3. **This analysis document** - Should be updated if implementation diverges

## Files in this How-To Folder

| File | Purpose |
|------|---------|
| `docs-system-guide.md` | **Canonical** - Slopdog Vanilla docs system guide |
| `DOCS-SYSTEM-ANALYSIS.md` | **This file** - Analysis and reconciliation |

### Deprecated Reference Files (`deprecated/`)

These are historical reference copies from RockCap, preserved for context but not authoritative for Slopdog Vanilla:

| File | Purpose |
|------|---------|
| `deprecated/rockcap-docfrontmatterrules.md` | Reference - Front-matter validation rules |
| `deprecated/rockcap-how-the-docs-route-works.md` | Reference - Comprehensive architecture (most current) |
| `deprecated/rockcap-docs-system-architecture.md` | Reference - Technical architecture |
| `deprecated/rockcap-front-matter-schema.md` | Reference - Schema template & examples |
| `deprecated/rockcap-user-guide.md` | Reference - End-user guide |

## Conclusion

The RockCap documentation system is well-designed and documented, with one critical bug fix (BUG-20260113) that updated the `resolveContentRoot()` function. The main inconsistencies are:

1. **Minor**: Some docs say `facets.repo.path` is required, others say optional
2. **Expected**: RockCap has strategy-specific features not needed in Slopdog Vanilla
3. **Resolved**: The most recent doc (`how-the-docs-route-works.md`) contains the fixed code

For Slopdog Vanilla implementation, use:
- `rockcap-how-the-docs-route-works.md` as primary reference (most complete and current)
- `docs-system-guide.md` as the simplified canonical guide
- This analysis document for understanding what to include/exclude
