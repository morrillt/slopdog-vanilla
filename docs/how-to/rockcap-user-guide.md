---
title: "RockCap Reference: Documentation System User Guide"
updated: "2026-02-04"
facets:
  type: note
  status: active
  repo:
    path: docs/how-to/rockcap-user-guide.md
description: >-
  Copied from RockCap project. User-friendly guide to navigating and using
  the documentation system.
tags:
  - doc/howto
  - audience/user
---
# Documentation System User Guide (RockCap Reference)

> **Source**: Copied from RockCap `docs/user/docs-system-guide.md` on 2026-02-04 for reference.

## What Is This?

The RockCap Documentation System is your central hub for accessing all project documentation, planning materials, and technical guides. It's a searchable, organized library that makes it easy to find what you need.

## How to Access

Simply navigate to **Docs** in the main navigation bar at the top of any page. You'll see a comprehensive list of all available documents, organized by type.

## Document Types

Documents are organized into four main categories:

### 1. Strategies
Technical documentation about trading strategies, including how they work, their parameters, and implementation details.

### 2. Plans
Planning documents including:
- **Epics** - Large-scale project initiatives
- **Tickets** - Individual work items (numbered like 3.1, 3.2, etc.)
- **Tasks** - One-off work items

### 3. Changelogs
Historical records of changes and updates to the system.

### 4. Notes
General documentation, guides, and reference materials.

## Finding Documents

### Using Filters

At the top of the Docs page, you'll find several filter options:

**Type Filter:**
- Filter by document type (Plan, Strategy, Note, Changelog)
- Select "All Types" to see everything

**Status Filter:**
- **Active** - Current, up-to-date documents
- **Draft** - Work in progress
- **Deprecated** - Outdated documents (kept for reference)

**Tag Filters:**
Documents are tagged with multiple categories to help you find related content:
- **Plan tags** - epic, ticket, task
- **Domain tags** - Related to specific trading concepts or strategies
- **Tech tags** - Technical implementation details
- **Ops tags** - Operations, bugs, migrations, refactoring
- **Meta tags** - Indexes, templates, glossaries

You can select multiple tag filters to narrow down your search. Documents must match ALL selected tag filters.

### Document Cards

Each document is displayed as a card showing:
- **Title** - The document name
- **Description** - A brief summary (if available)
- **Type and Status** - Quick metadata
- **Tags** - Up to 5 tags (with "+X more" if there are additional tags)
- **Last Updated** - When the document was last modified

Click any card to open the full document.

## Reading Documents

### Document Page Features

When you open a document, you'll see:

**Left Sidebar (Table of Contents):**
- Lists all major headings (H1 and H2) in the document
- Click any heading to jump to that section
- The active heading is highlighted as you scroll
- Only visible on larger screens

**Main Content:**
- Full document content with proper formatting
- Code examples with syntax highlighting
- Tables, lists, and other formatted content
- Links to other documents

**Document Metadata:**
- Last updated date
- File path in the repository
- All tags associated with the document

### Navigation

- **← Back to Docs** - Returns to the main documentation index
- **Header Navigation** - Access other parts of the application
- **Table of Contents** - Quick navigation within long documents

## Document Statuses

Understanding document statuses helps you know what to trust:

- **Active** ✅ - Current and accurate. Use these as your primary reference.
- **Draft** 📝 - Still being written or reviewed. May be incomplete.
- **Deprecated** ⚠️ - Outdated information. Kept for historical reference only.

## Tips for Finding Information

1. **Start Broad:** Use the Type filter to narrow to your area of interest
2. **Use Tags:** Tags help you find related documents across different types
3. **Check Status:** Prefer "Active" documents for current information
4. **Read Descriptions:** Document descriptions give you a quick overview before opening
5. **Use Table of Contents:** For long documents, use the sidebar to jump to relevant sections

## Document Organization

### Plans Structure

Plans are organized hierarchically:
- **Epics** - Large initiatives (e.g., "EPIC-003: Bulletproof Backtest")
- **Tickets** - Numbered work items within epics (e.g., "3.1", "3.2")
- Each ticket follows a consistent format with User Stories, Acceptance Criteria, and Tasks

### Strategies

Strategy documents explain:
- How the strategy works
- What parameters it uses
- Implementation details
- Testing information

### Notes

General documentation covering:
- How-to guides
- Architecture explanations
- User guides
- Reference materials

## Getting Help

If you can't find what you're looking for:

1. **Try Different Filters** - Sometimes documents are tagged differently than expected
2. **Search by Type** - If you know it's a plan, filter to plans only
3. **Check Related Tags** - Documents with similar tags are often related
4. **Look at Recent Updates** - Recently updated documents may have the latest information

## What Makes This System Special

- **Always Up-to-Date** - Documents are automatically indexed from the source files
- **Rich Formatting** - Properly formatted code, tables, and lists
- **Easy Navigation** - Table of contents and clear organization
- **Comprehensive Filtering** - Find exactly what you need quickly
- **Consistent Structure** - All documents follow the same organizational patterns

## Quick Reference

**Main Page:** `/docs`

**Filter by Type:** Use the "Type" dropdown

**Filter by Status:** Use the "Status" dropdown  

**Filter by Tags:** Use the tag dropdowns below the main filters

**Open a Document:** Click any document card

**Navigate Within Document:** Use the left sidebar table of contents

**Go Back:** Click "← Back to Docs" or use browser back button

**Share a Document:** Copy the URL from your browser address bar
