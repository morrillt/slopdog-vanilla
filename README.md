## slopdogrpg

Next.js RPG playground scaffold (App Router) using the Rockcap baseline.

### Setup

```bash
npm install
cd src && npm install
```

### Environment variables

- Copy `.env.example` to `.env` and fill in anything you use.

### Run

```bash
cd src && npm run dev -- --hostname 0.0.0.0 --port 3001
```

### Test

```bash
npm run test
```

### Notes

- `packages/logger` is a reusable internal package built with `tsup`.
- E2E tests use Playwright and will auto-start the dev server via `playwright.config.ts`.
- Prod smoke test requires `E2E_PROD_BASE_URL`.
