---
title: "How-to: Understanding the Docs System"
updated: "2026-02-04"
facets:
  type: note
  status: active
  repo:
    path: docs/how-to/docs-system-guide.md
description: >-
  A guide explaining how the /docs route system works, including architecture,
  API endpoints, and integration patterns.
tags:
  - doc/howto
  - tech/frontend/architecture
  - tech/backend/api
  - audience/dev
---
# Understanding the Docs System

## Overview

This guide explains how the `/docs` route works in the application. It covers the architecture, API endpoints, and how to interact with the documentation system.

## What the /docs Route Does

The `/docs` route provides a custom documentation explorer that:

- Indexes all Markdown files from `docs/` and `plans/` directories
- Provides a searchable, filterable interface with taxonomy-based categorization
- Renders individual documents with markdown rendering, table of contents, and navigation
- Supports YAML front matter for metadata (title, tags, facets, status)

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    /docs Route System                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend Pages:                                            │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   /docs      │      │ /docs/[...slug]│                  │
│  │  (Index)     │      │  (Viewer)     │                    │
│  └──────┬───────┘      └──────┬───────┘                    │
│         │                      │                            │
│         └──────────┬───────────┘                            │
│                    │                                        │
│                    ▼                                        │
│         ┌──────────────────────┐                           │
│         │   API Routes         │                           │
│         ├──────────────────────┤                           │
│         │ /api/docs/manifest   │                           │
│         │ /api/docs/content    │                           │
│         └──────────┬───────────┘                           │
│                    │                                        │
│                    ▼                                        │
│         ┌──────────────────────┐                           │
│         │   File System        │                           │
│         │  (docs/ + plans/)    │                           │
│         └──────────────────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### GET `/api/docs/manifest`

**Purpose**: Generates a complete manifest of all Markdown documents.

**Response Structure**:
```typescript
{
  taxonomy: {
    facets: { type: string[]; status: string[]; };
    tags: Record<string, any>;
  };
  docs: DocMetadata[];
  count: number;
}
```

### GET `/api/docs/content?path={filePath}`

**Purpose**: Serves the raw content of a specific Markdown file.

**Query Parameters**:
- `path` (required): Relative path from repo root

**Response**:
```typescript
{
  content: string;  // Raw markdown content
  path: string;     // Normalized path
}
```

## Front Matter Schema

All Markdown files should include YAML front matter:

```yaml
---
title: "Document Title"
updated: "2026-02-04"
description: "Optional description"
facets:
  type: plan | note | guide | changelog
  status: draft | active | deprecated
  repo:
    path: string
tags:
  - doc/howto
  - tech/testing
---
```

## Taxonomy System

The taxonomy defines the controlled vocabulary for document metadata. It powers the filter dropdowns in the docs UI and ensures consistency across all documentation.

### Location

The taxonomy file **must** be located at:

```
docs/taxonomy.yaml
```

This path is configured in `src/app/api/docs/manifest/route.ts`. If the file is missing or in the wrong location, the Type and Status filter dropdowns will only show "All" with no individual options.

### File Structure

```yaml
meta:
  title: "Slopdog Vanilla Taxonomy"
  updated: "2026-02-04"
  description: >
    Taxonomy definition for the docs system.

facets:
  type: [plan, note, guide, changelog]
  status: [draft, active, deprecated, done]
  epic:
    number: string
    name: string
  repo:
    path: string

tags:
  plan:
    - epic
    - ticket
    - task
  doc:
    - howto
    - reference
    - guide
    - beware
  tech:
    frontend:
      - ui
      - components
      - architecture
    backend:
      - api
      - lib
    testing: []
  ops:
    - bug
    - perf
    - refactor
  meta:
    - index
    - template
  audience:
    - dev
    - user
```

### Facets vs Tags

| Aspect | Facets | Tags |
|--------|--------|------|
| Selection | Single value per facet | Multiple tags allowed |
| Structure | Flat or object values | Hierarchical (`category/subcategory`) |
| UI | Dropdown filters | Tag filter dropdowns by category |
| Purpose | Core document classification | Flexible categorization |

### Facets

Facets are structured, single-select metadata fields:

1. **`type`** - Document type (required):
   - `plan` - Planning documents, tickets, epics
   - `note` - General notes and documentation
   - `guide` - How-to guides and tutorials
   - `changelog` - Change logs and release notes

2. **`status`** - Document lifecycle status:
   - `draft` - Work in progress
   - `active` - Current and maintained
   - `deprecated` - Outdated, kept for reference
   - `done` - Completed (typically for tickets)

3. **`epic`** - Epic reference (for tickets):
   - `number` - Epic identifier
   - `name` - Epic name

4. **`repo`** - Repository path reference:
   - `path` - Path to the document in the repo

### Tags

Tags use a hierarchical format: `category/subcategory` or `category/subcategory/item`.

| Category | Tags | Purpose |
|----------|------|---------|
| `plan/` | epic, ticket, task | Planning and project management |
| `doc/` | howto, reference, guide, beware | Documentation types |
| `tech/` | frontend/ui, frontend/components, backend/api, etc. | Technical domains |
| `ops/` | bug, perf, refactor | Operational concerns |
| `meta/` | index, template | Meta-documentation |
| `audience/` | dev, user | Target audience |

### How Taxonomy Powers the UI

1. **Manifest Generation**: The `/api/docs/manifest` endpoint reads `taxonomy.yaml` and includes it in the response
2. **Filter Dropdowns**: The DocsExplorer component reads `manifest.taxonomy.facets.type` and `manifest.taxonomy.facets.status` to populate the Type and Status dropdowns
3. **Tag Filters**: Tag categories from `manifest.taxonomy.tags` create additional filter dropdowns

### Modifying the Taxonomy

To add new types, statuses, or tags:

1. Edit `docs/taxonomy.yaml`
2. Add the new value to the appropriate section
3. Refresh the docs page - changes take effect immediately

**Example - Adding a new type:**

```yaml
facets:
  type: [plan, note, guide, changelog, tutorial]  # Added 'tutorial'
```

**Example - Adding a new tag category:**

```yaml
tags:
  # ... existing tags ...
  project:
    - internal
    - external
    - client
```

## URL Routing

### Index Page
- Route: `/docs`
- Query parameters: `?type=plan&status=active&tag:plan=ticket`

### Document Pages
- Route: `/docs/[...slug]`
- Examples:
  - `/docs/styleguide`
  - `/docs/how-to/docs-system-guide`

## Security

The docs system includes security measures to prevent unauthorized file access:

1. **Path Validation**: Only paths starting with `docs/` or `plans/` are allowed
2. **Directory Traversal Prevention**: Paths containing `..` are blocked
3. **Server-Side Only**: File system access happens only on the server via API routes

## Vercel Deployment

When deploying to Vercel, the `docs/` and `plans/` directories need to be accessible from the build output. The `@rockcap/docs-router` package handles content root resolution automatically, but if issues arise:

**Copy files during build** (add to `package.json`):

```json
{
  "scripts": {
    "prepare-deploy": "cp -r docs/* src/docs/ 2>/dev/null || true && cp -r plans/* src/plans/ 2>/dev/null || true"
  }
}
```

The router's `resolveContentRoot()` function handles the case where the working directory might be `src/` by checking the parent directory for `docs/`.

## Summary

The `/docs` route is a documentation system that:
- Reads markdown files from `docs/` and `plans/` directories
- Provides a searchable, filterable interface
- Renders documents with markdown support and table of contents
- Uses YAML front matter for metadata
- Uses `docs/taxonomy.yaml` to power filter dropdowns
