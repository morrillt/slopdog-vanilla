---
title: "RockCap Reference: Docs System Architecture"
updated: "2026-02-04"
facets:
  type: note
  status: deprecated
  repo:
    path: docs/how-to/deprecated/rockcap-docs-system-architecture.md
description: >-
  Copied from RockCap project. Technical documentation of the documentation
  system architecture, implementation, and APIs.
tags:
  - doc/reference
  - tech/frontend/architecture
  - tech/backend/api
  - audience/dev
---
# Docs System Architecture (RockCap Reference)

> **Source**: Copied from RockCap `docs/dev/docs-system-architecture.md` on 2026-02-04 for reference.

## Overview

The RockCap documentation system is a custom-built, React-based documentation explorer that indexes and serves Markdown files from the `docs/` and `plans/` directories. It provides a searchable, filterable interface with dynamic routing, markdown rendering, and a taxonomy-based categorization system.

## Tech Stack

### Frontend
- **Next.js 16.0.7** - React framework with App Router
- **React 19.2.1** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling with `@tailwindcss/typography` plugin
- **react-markdown 10.1.0** - Markdown to React component rendering
- **remark-gfm 4.0.1** - GitHub Flavored Markdown support (tables, task lists, etc.)

### Backend
- **Next.js API Routes** - Server-side endpoints
- **Node.js File System (fs)** - File scanning and reading
- **js-yaml 4.1.1** - YAML front matter parsing

### Key Dependencies
```json
{
  "react-markdown": "^10.1.0",
  "remark-gfm": "^4.0.1",
  "js-yaml": "^4.1.1",
  "@tailwindcss/typography": "^4"
}
```

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Docs Explorer System                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │   Index Page │─────▶│  API Routes  │─────▶│  File    │ │
│  │  (page.tsx)  │      │  (manifest/  │      │  System  │ │
│  │              │      │   content)   │      │          │ │
│  └──────────────┘      └──────────────┘      └──────────┘ │
│         │                       │                          │
│         │                       │                          │
│         ▼                       ▼                          │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │  Doc Viewer  │      │  Taxonomy    │                   │
│  │ ([...slug])  │      │  (YAML)      │                   │
│  └──────────────┘      └──────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
rockcap/
├── docs/                          # Documentation files
│   ├── taxonomy.yaml              # Taxonomy definition
│   ├── templates/                 # Document templates
│   └── [various .md files]
├── plans/                         # Planning documents
│   └── epics/                     # Epic and ticket files
│       └── EPIC-003-*/            # Epic directories
│           └── [ticket files].md
└── src/
    └── app/
        ├── docs/
        │   ├── page.tsx           # Index/explorer page
        │   └── [...slug]/
        │       └── page.tsx       # Individual doc viewer
        └── api/
            └── docs/
                ├── manifest/
                │   └── route.ts   # Manifest generation API
                └── content/
                    └── route.ts   # Content serving API
```

## API Endpoints

### GET `/api/docs/manifest`

Generates a complete manifest of all Markdown documents in `docs/` and `plans/` directories.

**Response Structure:**
```typescript
{
  taxonomy: {
    facets: {
      type: string[];
      status: string[];
    };
    tags: Record<string, any>;
  };
  docs: DocMetadata[];
  count: number;
}
```

**DocMetadata Type:**
```typescript
{
  path: string;                    // e.g., "plans/epics/EPIC-003/3.1.md"
  title: string;                   // From front matter or H1
  updated: string;                  // ISO date string
  description?: string;              // From front matter or first paragraph
  facets: {
    type: string;                  // "plan" | "strategy" | "note" | "changelog"
    status: string;                // "draft" | "active" | "deprecated"
    strategy?: {
      slug: string;
      version: string;
    };
    repo?: {
      path: string;
    };
  };
  tags: string[];                  // Array of tag strings
}
```

**Implementation Details:**
- Recursively scans `docs/` and `plans/` directories
- Parses YAML front matter from each `.md` file
- Extracts title from front matter or first H1 heading
- Extracts description from front matter or first paragraph
- Loads taxonomy from `docs/taxonomy.yaml`
- Normalizes file paths to use forward slashes
- Skips hidden directories (`.git`, `node_modules`, `data`)

### GET `/api/docs/content?path={filePath}`

Serves the raw content of a specific Markdown file.

**Query Parameters:**
- `path` (required): Relative path from repo root (e.g., `plans/epics/EPIC-003/3.1.md`)

**Response:**
```typescript
{
  content: string;                 // Raw markdown content
  path: string;                    // Normalized path
}
```

**Security:**
- Validates path starts with `docs/` or `plans/`
- Prevents directory traversal (`..`)
- Returns 404 if file doesn't exist

## Frontend Components

### `/docs` - Index Page (`src/app/docs/page.tsx`)

**Purpose:** Document explorer with filtering and search capabilities.

**Features:**
- Document listing grouped by type (Strategies → Plans → Changelogs → Notes)
- Multi-faceted filtering:
  - Type filter (plan, strategy, note, changelog)
  - Status filter (draft, active, deprecated)
  - Tag filters (plan, domain, doc, tech, ops, meta, audience)
- URL parameter persistence for filters
- Responsive grid layout

**State Management:**
- Uses React hooks (`useState`, `useEffect`)
- Syncs filter state with URL query parameters
- Fetches manifest on mount

**Filter Logic:**
- Documents must match selected type (if not "all")
- Documents must match selected status (if not "all")
- Documents must match ALL selected tag categories (AND logic)

**URL Format:**
```
/docs?type=plan&status=active&tag:plan=ticket&tag:tech=testing
```

### `/docs/[...slug]` - Document Viewer (`src/app/docs/[...slug]/page.tsx`)

**Purpose:** Renders individual Markdown documents with navigation.

**Features:**
- Dynamic routing for any document path
- Markdown rendering with `react-markdown`
- GitHub Flavored Markdown support (tables, task lists, etc.)
- Sticky table of contents sidebar (H1 and H2 headings)
- Active heading highlighting based on scroll position
- Custom styling for code blocks, tables, lists, etc.

**URL Decoding:**
- Automatically decodes URL-encoded characters (e.g., `%20` → space)
- Handles paths with spaces and special characters

**Document Matching Logic:**
1. Decodes URL slug segments
2. Joins segments with `/` to form document path
3. Matches against manifest using multiple strategies:
   - Exact path match
   - Path with `.md` extension
   - Path without `docs/` or `plans/` prefix
   - Path without extension and prefix

**Content Processing:**
1. Strips YAML front matter from markdown content
2. Removes HTML comments (`<!-- ... -->`)
3. Removes first H1 if it matches front matter title (prevents duplicates)
4. Extracts headings for table of contents
5. Renders with custom React components

**Custom Markdown Components:**
- `h1`, `h2`, `h3` - Styled headings with anchor IDs
- `code` - Inline code with background
- `pre` - Code blocks with syntax highlighting container
- `ul`, `ol`, `li` - Nested list support with proper indentation
- `table`, `th`, `td` - Styled tables
- `a` - Internal links to other docs
- `blockquote` - Styled quotes
- `hr` - Horizontal rules

**Table of Contents:**
- Extracted from H1 and H2 headings
- Sticky sidebar on large screens
- Clickable anchor links
- Active heading highlighting via scroll tracking

## Styling

### Tailwind CSS Configuration
- Uses `prose` classes from `@tailwindcss/typography`
- Custom prose variants for nested lists
- Dark theme (`prose-invert`, `prose-slate`)
- Custom code block styling
- Responsive design (mobile-first)

### Custom Styles
- Nested list indentation via arbitrary variants
- Code block background and padding
- Table borders and spacing
- Link hover states
- Active heading highlighting

## Performance Considerations

1. **Manifest Caching:** Manifest is generated on-demand (could be cached)
2. **Content Loading:** Content fetched separately after manifest lookup
3. **Client-Side Rendering:** All rendering happens client-side
4. **Scroll Tracking:** Uses `IntersectionObserver` for active heading detection

## Security

1. **Path Validation:** API routes validate paths are within `docs/` or `plans/`
2. **Directory Traversal Prevention:** Blocks `..` in paths
3. **File Type Restriction:** Only serves `.md` files
4. **Content Sanitization:** `react-markdown` with `skipHtml` option

## Future Enhancements

Potential improvements:
- Server-side rendering for better SEO
- Full-text search
- Document versioning
- Edit links to source files
- Export to PDF
- Print-friendly styles
- Document relationships graph
- Recent documents tracking

## Related Files

- `src/app/docs/page.tsx` - Index page component
- `src/app/docs/[...slug]/page.tsx` - Document viewer component
- `src/app/api/docs/manifest/route.ts` - Manifest API
- `src/app/api/docs/content/route.ts` - Content API
- `docs/taxonomy.yaml` - Taxonomy definition
- `docs/templates/front-matter-schema.md` - Front matter template
