---
title: Slopdog Vanilla Theme
facets:
  type: note
  status: active
  summary:
    human: >-
      A vanilla starting theme for Slopdog OS providing a modern web application
      foundation with Next.js, Tailwind CSS, and Valtio state management.
    vector: >-
      Slopdog Vanilla Theme is a Next.js 16-based project scaffold for Slopdog
      OS featuring Tailwind CSS 4 with Catppuccin color palette, Valtio state
      management, Lucide React icons, TypeScript, Vitest unit testing,
      Playwright E2E testing, and Node.js 20+ runtime. Provides clean
      opinionated baseline for interactive web applications with
      developer-friendly logging utilities and monorepo structure. Ideal for
      modern frontend development with high-performance state management and
      beautiful defaults.
tags:
  - Slopdog OS
  - Next.js
  - Tailwind CSS
  - Catppuccin
  - Valtio
  - Web Scaffolding
  - TypeScript
---
# Slopdog Vanilla Theme

A vanilla getting started theme for **Slopdog OS**. This scaffold provides a clean, opinionated baseline for building interactive web applications using the latest web technologies.

**Live Demo**: [https://slopdog-vanilla-3lqgnsp2n-morrillts-projects.vercel.app/](https://slopdog-vanilla-3lqgnsp2n-morrillts-projects.vercel.app/)

## Overview

`slopdog-vanilla` is the reference implementation and starting point for projects built with **Slopdog OS**. While Slopdog OS provides the high-level commands and prompts for development, this theme provides the foundational tech stack for anyone who wants a modern web UI out of the box.

It focuses on high-performance state management, a beautiful default aesthetic (Catppuccin), and a robust developer experience.

## Create a New Project

The easiest way to start a new project using this theme as a baseline is to use `degit`. This will download the code without the git history, giving you a fresh start.

```bash
# Create a new project folder and pull in the vanilla theme
npx degit morrillt/slopdog-vanilla my-new-project

# Navigate into your project
cd my-new-project

# Install everything
npm install && cd src && npm install

# Start development
cd .. && npm run dev
```

Alternatively, you can just **Fork** this repository on GitHub or use the **Deploy** button below.

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

This theme is the vanilla starting point for **Slopdog OS**—a set of commands and prompts used to build technology with a web UI. For advanced configuration and system-level insights, refer to the definitions located in your environment (e.g., `~/.cursor`).

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

## Deployment

### Vercel CLI (For Quick Deployment)

If you prefer using the terminal, you can deploy instantly using the Vercel CLI:

1.  **Install Vercel CLI**:
    ```bash
    npm install -g vercel
    ```

2.  **Deploy**:
    From the root of this project, simply run:
    ```bash
    vercel
    ```
    *(Follow the prompts to link the project and deploy. The `vercel.json` will ensure the correct commands are used).*

3.  **Deploy to Production**:
    ```bash
    vercel --prod
    ```

### Vercel Dashboard (Recommended for CI/CD)

1.  **Push to GitHub**: Push your repository to GitHub.
2.  **Connect to Vercel**: Import the project in Vercel.
3.  **Automatic Detection**: Vercel will detect the `vercel.json` and automatically configure the following:
    - **Build Command**: `npm run build`
    - **Install Command**: `npm install`
    - **Framework**: `Next.js`
4.  **Public Access**: By default, this configuration ensures the site is public. Vercel Authentication (Deployment Protection) is disabled for production branch deploys unless manually enabled in your Vercel project settings.
5.  **Environment Variables**: Ensure you add any required environment variables (like `E2E_PROD_BASE_URL` for tests) in the Vercel dashboard.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fslopdog-vanilla)

*(Note: Replace the repository URL with your actual repo link for the one-click deploy to work).*

## Features Included

- **AppShell**: A pre-configured layout with a sidebar/settings panel structure.
- **Dark Mode**: Catppuccin "Mocha" theme applied globally.
- **Health Check**: Built-in `/api/health` endpoint.
- **E2E Smoke Tests**: Ready-to-go Playwright tests for local and production verification.

---

Built with 🐕 and slop by the Slopdog crew.

![Slopdog Crew](src/public/data/slopdog-crew-new-output%20(Current).png)
