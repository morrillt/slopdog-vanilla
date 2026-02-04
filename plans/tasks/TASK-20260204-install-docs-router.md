# TASK-20260204-install-docs-router

- **Date:** 2026-02-04
- **Status:** Completed
- **Approach:** TDD
- **Complexity:** Large

## Description
Install the `docs-router` package into `slopdog-vanilla`, set up the necessary API routes and pages, and verify functionality using Playwright.

## Requirements
- [x] Copy `@rockcap/docs-router` from `slopdog-ticket-runner` to `packages/docs-router`.
- [x] Install dependencies in `packages/docs-router`.
- [x] Add `@rockcap/docs-router` as a dependency to the main app.
- [x] Implement API routes: `/api/docs/manifest` and `/api/docs/content`.
- [x] Implement Docs pages: `/docs` and `/docs/[...slug]`.
- [x] Verify with Playwright:
    - [x] Page `/docs` loads without console errors.
    - [x] Docs can be navigated.
    - [x] No console log errors.

## Log
- 2026-02-04: Initialized task.
- 2026-02-04: Created failing test (Red).
- 2026-02-04: Copied `docs-router` package and installed dependencies.
- 2026-02-04: Implemented API routes and Docs pages.
- 2026-02-04: Verified with Playwright (Green).
