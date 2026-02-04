---
title: "RockCap Reference: How the /docs Route Works"
updated: "2026-02-04"
facets:
  type: note
  status: deprecated
  repo:
    path: docs/how-to/deprecated/rockcap-how-the-docs-route-works.md
description: >-
  Copied from RockCap project. Comprehensive guide explaining the /docs route
  architecture, API endpoints, file system access, and Vercel deployment.
tags:
  - doc/howto
  - tech/frontend/architecture
  - tech/backend/api
  - audience/dev
---
# How the /docs Route Works (RockCap Reference)

> **Source**: Copied from RockCap `docs/how-to/how-the-docs-route-works.md` on 2026-02-04 for reference.

## Overview

This guide explains how the `/docs` route works in the RockCap Next.js application. It covers the architecture, API endpoints, file system access patterns, Vercel deployment considerations, and how both humans and AI agents should interact with this system. This documentation is intended to support future extraction into a reusable module.

## What the /docs Route Does

The `/docs` route provides a custom documentation explorer that:
- Indexes all Markdown files from `docs/` and `plans/` directories
- Provides a searchable, filterable interface with taxonomy-based categorization
- Renders individual documents with markdown rendering, table of contents, and navigation
- Supports YAML front matter for metadata (title, tags, facets, status)
- Works in both local development and Vercel production deployments

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

### Directory Structure

```
rockcap/
├── docs/                          # Source documentation files (repo root)
│   ├── taxonomy.yaml              # Taxonomy definition (facets + tags)
│   ├── templates/                 # Document templates
│   └── [various .md files]
├── plans/                         # Planning documents (repo root)
│   └── epics/                     # Epic and ticket files
│       └── EPIC-XXX-*/            # Epic directories
│           └── [ticket files].md
└── src/                           # Next.js application
    ├── docs/                      # Copied during build (for Vercel)
    ├── plans/                     # Copied during build (for Vercel)
    └── app/
        ├── docs/
        │   ├── page.tsx           # Index/explorer page
        │   └── [...slug]/
        │       └── page.tsx        # Individual doc viewer
        └── api/
            └── docs/
                ├── manifest/
                │   └── route.ts    # Manifest generation API
                └── content/
                    └── route.ts    # Content serving API
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

**DocMetadata Type**:
```typescript
{
  path: string;                    // e.g., "plans/epics/EPIC-003/3.1.md"
  title: string;                   // From front matter or H1
  updated: string;                 // ISO date string
  description?: string;             // From front matter or first paragraph
  ticketStatus?: string;            // For plan/ticket docs (Pending/Ready/In Progress/Review/Done)
  facets: {
    type: string;                   // "plan" | "strategy" | "note" | "changelog"
    status: string;                 // "draft" | "active" | "deprecated"
    strategy?: { slug: string; version: string; };
    repo?: { path: string; };
    epic?: { number: string; name: string; };
  };
  tags: string[];                   // Array of tag strings
}
```

**Implementation Details**:
- Recursively scans `docs/` and `plans/` directories using `fs.readdirSync`
- Parses YAML front matter from each `.md` file using `js-yaml`
- Extracts title from front matter or first H1 heading
- Extracts description from front matter or first paragraph
- Loads taxonomy from `docs/taxonomy.yaml`
- Normalizes file paths to use forward slashes
- Skips hidden directories (`.git`, `node_modules`, `data`)
- Extracts ticket workflow status from body for `plan/ticket` documents

**File Location**: `src/app/api/docs/manifest/route.ts`

### GET `/api/docs/content?path={filePath}`

**Purpose**: Serves the raw content of a specific Markdown file.

**Query Parameters**:
- `path` (required): Relative path from repo root (e.g., `plans/epics/EPIC-003/3.1.md`)

**Response**:
```typescript
{
  content: string;                 // Raw markdown content
  path: string;                    // Normalized path
}
```

**Security**:
- Validates path starts with `docs/` or `plans/`
- Prevents directory traversal (`..`)
- Returns 404 if file doesn't exist
- Restricts resolution to `docs/` or `plans/` roots to keep file tracing narrow in Vercel/Turbopack

**File Location**: `src/app/api/docs/content/route.ts`

## Frontend Pages

### `/docs` - Index Page

**File**: `src/app/docs/page.tsx`

**Purpose**: Document explorer with filtering and search capabilities.

**Features**:
- Document listing grouped by type (Strategies → Plans → Changelogs → Notes)
- Multi-faceted filtering:
  - Type filter (plan, strategy, note, changelog)
  - Status filter (draft, active, deprecated)
  - Tag filters (plan, domain, doc, tech, ops, meta, audience)
  - Ticket status filters (for plan/ticket documents)
- URL parameter persistence for filters
- Search by title
- Star/favorite functionality
- Responsive grid layout

**State Management**:
- Uses React hooks (`useState`, `useEffect`)
- Syncs filter state with URL query parameters
- Fetches manifest on mount

**Filter Logic**:
- Documents must match selected type (if not "all")
- Documents must match selected status (if not "all")
- Documents must match ALL selected tag categories (AND logic)
- Ticket status filters apply only to `plan/ticket` documents
- Search query overrides tag filters when searching for "BUG"

**URL Format**:
```
/docs?type=plan&status=active&tag:plan=ticket&tag:tech=testing&search=bug
```

### `/docs/[...slug]` - Document Viewer

**File**: `src/app/docs/[...slug]/page.tsx`

**Purpose**: Renders individual Markdown documents with navigation.

**Features**:
- Dynamic routing for any document path
- Markdown rendering with `react-markdown` and `remark-gfm`
- GitHub Flavored Markdown support (tables, task lists, etc.)
- Sticky table of contents sidebar (H1 and H2 headings)
- Active heading highlighting based on scroll position
- Custom styling for code blocks, tables, lists, etc.
- Front matter editing (for authenticated users)

**URL Decoding**:
- Automatically decodes URL-encoded characters (e.g., `%20` → space)
- Handles paths with spaces and special characters

**Document Matching Logic**:
1. Decodes URL slug segments
2. Joins segments with `/` to form document path
3. Matches against manifest using multiple strategies:
   - Exact path match
   - Path with `.md` extension
   - Path without `docs/` or `plans/` prefix
   - Path without extension and prefix

**Content Processing**:
1. Strips YAML front matter from markdown content
2. Removes HTML comments (`<!-- ... -->`)
3. Removes first H1 if it matches front matter title (prevents duplicates)
4. Extracts headings for table of contents
5. Renders with custom React components

## File System Access Pattern

### Content Root Resolution

Both API routes use a `resolveContentRoot()` function to find the repository root:

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

**Why This Matters**:
- In local development: `process.cwd()` points to repo root → finds `docs/` directly
- In Vercel: `process.cwd()` points to `src/` → needs to check parent directory OR use copied files in `src/docs/`

### File Reading

The system uses Node.js `fs` module to read files:
- `fs.readFileSync()` - Reads file content synchronously
- `fs.existsSync()` - Checks if file/directory exists
- `fs.readdirSync()` - Lists directory contents recursively

**Important**: These operations work on the server-side filesystem, not the client browser.

## Vercel Deployment Considerations

### The Problem

Vercel only deploys files from the `src/` directory (the Next.js app). The repository root `docs/` and `plans/` directories are **not included** in the deployment by default. This causes the `/api/docs/manifest` endpoint to fail because it can't find the files.

### The Solution

**Build-time file copying**: Copy `docs/` and `plans/` to `src/docs/` and `src/plans/` during the Vercel build process.

**Implementation**:

1. **Root `package.json` script**:
```json
{
  "scripts": {
    "prepare-deploy": "cp -r docs/* src/docs/ 2>/dev/null || true && cp -r plans/* src/plans/ 2>/dev/null || true"
  }
}
```

2. **Vercel build command** (in `vercel.json`):
```json
{
  "buildCommand": "npm run prepare-deploy && cd src && npm run build"
}
```

## Front Matter Schema

All Markdown files should include YAML front matter:

```yaml
---
title: "Document Title"
updated: "2025-12-15"
description: "Optional description"
facets:
  type: plan | strategy | note | changelog
  status: draft | active | deprecated
  strategy:                    # Optional, for strategy docs
    slug: string
    version: string
  repo:                        # Optional, for tracking
    path: string
tags:
  - plan/ticket
  - tech/testing
  - domain/strategy/orb-retest-breakout
---
```

**Required Fields**:
- `title` - Document title
- `updated` - Last update date (ISO format: YYYY-MM-DD)
- `facets.type` - Document type
- `facets.status` - Document status

**Optional Fields**:
- `description` - Short description (used in index)
- `facets.strategy` - Strategy metadata
- `facets.repo.path` - Repository path reference
- `tags` - Array of tag strings

See `docs/docfrontmatterrules.md` for complete front matter rules.

## Taxonomy System

The taxonomy is defined in `docs/taxonomy.yaml` and provides:

1. **Facets** - Structured metadata (single-select):
   - `type`: Document type
   - `status`: Document status
   - `strategy`: Strategy-specific metadata
   - `repo`: Repository path reference

2. **Tags** - Multi-select categorical labels:
   - `plan/` - Planning-related tags (epic, ticket, task)
   - `domain/` - Domain-specific tags (indicator, strategy, tag)
   - `doc/` - Documentation tags (howto, beware)
   - `tech/` - Technical tags (frontend, backend, scripts, testing)
   - `ops/` - Operations tags (bug, perf, security, migration, refactor)
   - `meta/` - Meta tags (index, template, glossary, onboarding)
   - `audience/` - Audience tags (dev, stakeholder)

**Tag Format**:
- Lowercase with hyphens
- Hierarchical structure with `/` separator
- Maximum depth: 4 levels

## URL Routing

### Index Page
- Route: `/docs`
- Query parameters: `?type=plan&status=active&tag:plan=ticket`

### Document Pages
- Route: `/docs/[...slug]`
- Examples:
  - `/docs/Strategies/basic`
  - `/docs/epics/EPIC-003-bulletproof-backtest/3.1`
  - `/docs/DEPRECATED%20-%20sprintplanning/epic1-stories/story1-env-cli`

**URL Construction**:
1. Remove `.md` extension from file path
2. Remove `docs/` or `plans/` prefix
3. URL-encode special characters (handled automatically by Next.js Link)
4. Join path segments with `/`

**URL Decoding**:
- Next.js automatically decodes URL segments
- Additional `decodeURIComponent` applied for safety
- Handles spaces, special characters, and Unicode

## Markdown Processing Pipeline

```
Raw Markdown File
    ↓
Parse YAML Front Matter (js-yaml)
    ↓
Extract Metadata (title, tags, facets)
    ↓
Strip Front Matter from Content
    ↓
Remove HTML Comments
    ↓
Remove Duplicate H1 (if matches title)
    ↓
Extract Headings (for TOC)
    ↓
Render with react-markdown
    ↓
Apply Custom Components
    ↓
Styled HTML Output
```

## Known Issues and Workarounds

### Issue: Vercel Deployment Missing Files

**Symptom**: `/docs` page shows "Error: Failed to generate docs manifest" on Vercel.

**Root Cause**: `docs/` and `plans/` directories aren't included in Vercel deployment.

**Solution**: Copy files during build (see "Vercel Deployment Considerations" above).

### Issue: Authentication Blocking API Routes

**Symptom**: API calls to `/api/docs/manifest` or `/api/docs/content` are blocked by authentication middleware.

**Solution**: Add `/api/docs/*` to allowed routes in `src/middleware.ts` if docs should be publicly accessible.

## For AI Agents

### Key Patterns to Recognize

1. **File System Access**: The system uses `fs.readFileSync` to read markdown files from `docs/` and `plans/` directories. This is **server-side only** and works in both dev and production (Vercel) as long as files are included in the deployment.

2. **Content Root Resolution**: The `resolveContentRoot()` function handles different working directory contexts (local dev vs Vercel).

3. **Path Normalization**: All paths are normalized to use forward slashes (`/`) for web compatibility, regardless of OS.

4. **Security**: Path validation ensures files can only be read from `docs/` or `plans/` directories, preventing directory traversal attacks.

5. **Front Matter Parsing**: YAML front matter is parsed using `js-yaml`, and the body content is separated from metadata.

### When Modifying This System

- **Adding new API endpoints**: Follow the pattern in `src/app/api/docs/manifest/route.ts` and `src/app/api/docs/content/route.ts`
- **Changing file locations**: Update `resolveContentRoot()` and ensure Vercel build copies files correctly
- **Adding new metadata fields**: Update `DocMetadata` type, front matter parsing, and taxonomy schema
- **Changing routing**: Update both `src/app/docs/page.tsx` and `src/app/docs/[...slug]/page.tsx`

### Testing Considerations

- Test file system access in both local dev and simulated Vercel environment
- Verify path normalization works across different OS (Windows, Linux, macOS)
- Test with files that have special characters in names
- Verify authentication middleware doesn't block API routes unintentionally

## Future Extraction to Module

This system is designed to be extracted into a reusable module. Key considerations:

1. **Configuration**: Make content root, allowed directories, and taxonomy path configurable
2. **Dependencies**: Document required dependencies (`js-yaml`, `react-markdown`, `remark-gfm`)
3. **API Contracts**: Define clear interfaces for manifest and content APIs
4. **Build Integration**: Provide clear instructions for Vercel/build-time file copying
5. **Authentication**: Make authentication optional/configurable
6. **Styling**: Extract Tailwind classes into a themeable system

## Summary

The `/docs` route is a custom documentation system that:
- Reads markdown files from `docs/` and `plans/` directories using Node.js filesystem APIs
- Provides a searchable, filterable interface with taxonomy-based categorization
- Renders documents with markdown support, table of contents, and navigation
- Requires build-time file copying for Vercel deployments
- Uses YAML front matter for metadata and follows a strict taxonomy system

Understanding these patterns is essential for maintaining, debugging, and eventually extracting this system into a reusable module.
