# Slopdog RPG Theme

A vanilla getting started theme for **Slopdog OSS**, built on the **broz framework**. This scaffold provides a clean, opinionated baseline for building RPGs and interactive web applications using the latest web technologies.

## Overview

`slopdog-vanilla` is designed as a playground for Slopdog-native applications. It leverages the **Rockcap baseline** with a focus on high-performance state management, a beautiful default aesthetic (Catppuccin), and a robust developer experience.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: Tailwind CSS 4 with [Catppuccin](https://catppuccin.com/) color palette
- **State Management**: [Valtio](https://valtio.pmnd.rs/) (Proxy-based, ultra-fast)
- **Icons**: Lucide React
- **Logging**: Internal `@slopdog-vanilla/logger` package (built with `tsup`)
- **Testing**: 
  - **Unit**: Vitest
  - **E2E**: Playwright
- **Runtime**: Node.js 20+

## Project Structure

```text
.
├── packages/           # Shared internal packages
│   └── logger/         # Structured logging utility
├── scripts/            # Helper scripts
├── src/                # The main Next.js web application
│   ├── app/            # App Router pages and layouts
│   ├── components/     # React components (UI and Shell)
│   ├── lib/            # Shared utilities and assertions
│   └── stores/         # Valtio state stores
└── tests/              # E2E and Unit test suites
```

## Getting Started

### Prerequisites

This theme is designed to be used with **Slopdog OSS** and the **broz framework**. For advanced configuration and framework-level insights, refer to the framework definitions located in your environment (e.g., `~/.cursor`).

### Installation

1.  **Install root dependencies**:
    ```bash
    npm install
    ```

2.  **Install web app dependencies**:
    ```bash
    cd src && npm install
    ```

3.  **Environment Setup**:
    Copy `.env.example` to `.env` in the root (if applicable) or `src/` directory.

### Development

Run the development server from the root:

```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

### Testing

Run all tests:
```bash
npm run test
```

Or run them individually:
```bash
npm run test:unit  # Vitest
npm run test:e2e   # Playwright
```

## Features Included

- **AppShell**: A pre-configured layout with a sidebar/settings panel structure.
- **Dark Mode**: Catppuccin "Mocha" theme applied globally.
- **Health Check**: Built-in `/api/health` endpoint.
- **E2E Smoke Tests**: Ready-to-go Playwright tests for local and production verification.

---

Built with 🐕 and slop by the Slopdog crew.

![Slopdog Crew](src/public/data/slopdog-crew-new-output%20(Current).png)
