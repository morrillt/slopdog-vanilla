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

The taxonomy is defined in `docs/taxonomy.yaml` and provides:

1. **Facets** - Structured metadata (single-select):
   - `type`: Document type
   - `status`: Document status
   - `repo`: Repository path reference

2. **Tags** - Multi-select categorical labels:
   - `plan/` - Planning-related tags (epic, ticket, task)
   - `doc/` - Documentation tags (howto, reference, guide)
   - `tech/` - Technical tags (frontend, backend, testing)
   - `ops/` - Operations tags (bug, perf, refactor)
   - `meta/` - Meta tags (index, template)
   - `audience/` - Audience tags (dev, user)

## URL Routing

### Index Page
- Route: `/docs`
- Query parameters: `?type=plan&status=active&tag:plan=ticket`

### Document Pages
- Route: `/docs/[...slug]`
- Examples:
  - `/docs/styleguide`
  - `/docs/how-to/docs-system-guide`

## Summary

The `/docs` route is a documentation system that:
- Reads markdown files from `docs/` and `plans/` directories
- Provides a searchable, filterable interface
- Renders documents with markdown support and table of contents
- Uses YAML front matter for metadata
