# CLAUDE.md

This file provides guidance to Claude Code when working with code in this
repository.

---

## Repository Purpose

This repository contains a personal CV published as a full-stack web
application.
The resume is stored as a markdown file, this markdown file is hosted on the
full-stack web application, and can be exported to a PDF format using a
markdown to PDF exporter. The exporter runs only when a build occurs, with the
PDF cached into the build.
The stack is:

- **Framework**: TanStack Start (full-stack, file-based routing)
- **Database ORM**: Drizzle ORM
- **Database**: Postgres (hosted using Neon)
- **Deployment**: Serverless (Vercel)
- **Development Tools**: Bun, Tailwind, Biome, and Vite
- **Language**: TypeScript throughout (strict mode), no js files allowed.

The app is intentionally minimal — it is a public-facing CV, not a
product. Optimise for readability and load performance over engineering
complexity.

---

## Project Structure

```
.
├── app/
│   ├── routes/              # TanStack Start file-based routes
│   │   ├── __root.tsx       # Root layout (fonts, global meta, providers)
│   │   ├── index.tsx        # CV landing page
│   │   └── api/             # Server functions / API routes
│   ├── components/          # Shared UI components
│   │   ├── ui/              # Primitive/generic components (Button, Card…)
│   │   └── cv/              # CV-specific components (ExperienceItem…)
│   ├── db/
│   │   ├── schema.ts        # Drizzle table definitions (single source of truth)
│   │   ├── index.ts         # DB client instantiation
│   │   └── migrations/      # Drizzle-generated migration files (do not edit)
│   ├── lib/
│   │   ├── queries.ts       # Typed DB query functions (no raw SQL outside here)
│   │   └── utils.ts         # Pure utility functions (no side effects)
│   ├── styles/
│   │   └── global.css       # Global styles and CSS custom properties
│   └── types/               # Shared TypeScript types and Zod schemas
├── drizzle.config.ts
├── app.config.ts            # TanStack Start / Vite config
└── package.json
```

Rules:
- Route files own **only** routing logic and data loading (`loader`/`action`).
  Business logic belongs in `lib/`, UI in `components/`.
- Never import from `app/routes/` in any other module.
- Do not create barrel `index.ts` files unless the directory has ≥4 exports
  that are always imported together.

---

## Coding Standards

### TypeScript
- `strict: true` in `tsconfig.json` — no exceptions.
- Prefer `type` over `interface` for object shapes. Use `interface` only for
  declaration merging or class contracts.
- No `any`. Use `unknown` and narrow explicitly. If a third-party type gap
  forces it, suppress with a comment explaining why.
- Avoid type assertions (`as Foo`) except at library/API boundaries. Highly
  prioritize runtime validation with Zod.
- Export types from `app/types/`. Do not co-locate type-only files with
  implementation files.

### General
- Soft 80-column limit. Exceptions: import paths, URLs, generated code.
- Use the formatter's canonical style — Prettier with project defaults.
- No `console.log` in committed code. Use a logger abstraction or
  `console.error` for caught exceptions only.
- Prefer early returns over nested conditionals.
- Name booleans with `is`, `has`, or `can` prefixes (`isLoading`, `hasError`).

---

## Data Layer (Drizzle + Postgres)

### Schema (`app/db/schema.ts`)
- All table definitions live here — nowhere else.
- Use `pgTable` from `drizzle-orm/pg-core`.
- Every table must have a `createdAt` and `updatedAt` column with DB-level
  defaults:
  ```ts
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  ```
- Prefer `text` over `varchar` for variable-length strings unless you need
  a DB-enforced length constraint.
- Use `uuid` primary keys (`gen_random_uuid()`) for all tables, not serial
  integers.
- Every column must be `.notNull()` unless null is a meaningful business state.

### Queries (`app/lib/queries.ts`)
- All DB access goes through typed functions in this file. Route loaders call
  these functions, they do not build queries inline.
- Queries must return fully typed results — infer return types from Drizzle's
  `InferSelectModel`/`InferInsertModel` or explicit `select()` shapes.
- No raw SQL (`sql` template tag) unless a Drizzle builder cannot express the
  query. If raw SQL is necessary, add a comment explaining why.
- Avoid N+1 queries. Use `with` (CTEs) or joined selects instead of loops.

### Migrations
- Generate migrations with `drizzle-kit generate`. Never edit generated files.
- Run `drizzle-kit migrate` (not `push`) against all environments, including
  local.
- Migration files are committed to source control.

### Connection
- Instantiate the DB client once in `app/db/index.ts`.
- On serverless, use a connection-pooling-compatible driver (e.g.
  `@neondatabase/serverless` or `postgres` with `?pgbouncer=true`).
- The connection string comes from `process.env.DATABASE_URL` only — never
  hardcoded, never in client-side code.

---

## API / Server Functions

- Use TanStack Start server functions (`createServerFn`) for all data
  mutations and authenticated reads.
- Validate every server function input with a Zod schema before touching the
  DB. Never trust client-supplied data.
- Return typed response objects — no untyped `Response` / plain objects.
- HTTP status semantics: `400` for validation errors, `401`/`403` for auth,
  `404` for missing resources, `500` for unexpected failures.
- Server functions must not import any component or client-only code.

---

## UI Components

### File conventions
- One component per file. Filename matches the exported component name in
  PascalCase.
- Co-locate a `ComponentName.test.tsx` file when the component has non-trivial
  logic.
- Props interfaces are defined in the same file, directly above the component.

### Patterns
- Prefer functional components. No class components.
- Use `React.memo` only with a measurable performance justification — not
  pre-emptively.
- Avoid prop drilling beyond 2 levels. Lift state or use context/TanStack
  Store.
- Client-side state: use TanStack Store or React `useState`/`useReducer`.
  Do not reach for an external state library without discussion.
- Async UI: use TanStack Router's built-in `loader` + `Suspense`. Do not
  fetch inside `useEffect` for data that belongs in the route loader.

### Styling
- CSS Modules (`.module.css`) for component-scoped styles, imported as
  `styles`.
- Global design tokens (colours, spacing, typography scale) in
  `app/styles/global.css` as CSS custom properties.
- No inline `style={{}}` props except for truly dynamic values (e.g. a width
  derived from a measurement).
- No third-party CSS frameworks (Tailwind, Bootstrap, etc.) unless explicitly
  agreed.
- Dark mode support via `prefers-color-scheme` media query on the `:root`
  token definitions. Do not use JS-toggled class-based dark mode.

### Accessibility
- All interactive elements must be keyboard-navigable and have accessible
  names.
- Images require meaningful `alt` text; decorative images use `alt=""`.
- Use semantic HTML first (`<nav>`, `<main>`, `<article>`, `<section>`,
  `<time>`, etc.) before reaching for ARIA.
- Colour contrast must meet WCAG AA (4.5:1 for body text, 3:1 for large text).

---

## Routing (TanStack Start / TanStack Router)

- Use file-based routing in `app/routes/`.
- Route files export a `Route` created with `createFileRoute`.
- Data loading uses `loader` on the route — not `useEffect` or component-level
  fetching.
- Mutations use server functions called from route `action` or event handlers.
- Layouts live in `__root.tsx` and layout route files (`_layout.tsx`).
  Do not nest layout logic inside page components.
- Keep routes thin: import components and query functions, wire them together,
  done.

---

## Testing

### Philosophy
Test behaviour, not implementation. A test should answer: "does this do what
the user/caller needs?" not "does this call this internal function?"

### Unit tests (`*.test.ts` / `*.test.tsx`)
- Framework: Vitest.
- Cover: all functions in `app/lib/`, all non-trivial utilities, Zod schemas.
- Do not test Drizzle schema definitions directly.
- Use `vi.mock` sparingly — prefer dependency injection over module mocking.

### Component tests (`*.test.tsx`)
- Framework: Vitest + Testing Library (`@testing-library/react`).
- Cover: components with conditional rendering, form validation, user
  interaction logic.
- Query by accessible role/label, not by CSS class or test ID. Use
  `data-testid` only as a last resort.

### Integration / route tests
- Test DB query functions against a real Postgres instance (use a separate
  `test` database or Vitest's setup/teardown hooks to seed and clean data).
- Do not mock the DB in integration tests.

### Coverage
- Aim for ≥80% line coverage on `app/lib/`. Do not chase 100% — untested
  trivial getters are not a problem.

### Commands
```bash
bun test          # run unit + component tests (watch mode)
bun test:run      # single run (CI)
bun test:coverage # coverage report
```

---

## Environment & Configuration

- All environment variables are documented in `.env.example` with placeholder
  values and a one-line comment.
- `.env` is gitignored. Never commit secrets.
- Runtime config is read from `process.env` in server code only. Client code
  must never reference `process.env`.
- Prefix public (client-safe) vars with `VITE_` if any are ever needed
  client-side, and document the exposure explicitly.

Required variables:
```
DATABASE_URL=        # Postgres connection string (with pooler on serverless)
```

---

## Serverless Deployment Constraints

- No file system writes — the deployment environment has no persistent disk.
- Keep cold-start weight low: avoid heavy server-side dependencies.
- DB connections must use a serverless-compatible pooler — see Data Layer.
- No long-running processes or background jobs. Anything async must complete
  within the function timeout (default: 10 s on Vercel, 26 s on Netlify).
- Environment variables are set in the platform dashboard and injected at
  build time / runtime as appropriate.

---

## Commit Style

Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`,
`test:`, `perf:`). Atomic commits scoped to a single logical change.

Examples:
```
feat: add experience section with DB-backed entries
fix: correct null handling in getExperience query
chore: run drizzle-kit generate after schema change
test: add unit tests for formatDateRange utility
```

Do not bundle schema changes, query changes, component changes, and tests into
a single commit.

---

## What Not To Do

- Do not add dependencies without checking bundle impact first.
- Do not use `useEffect` for data fetching — use route loaders.
- Do not store secrets in code, comments, or commit messages.
- Do not `console.log` debugging output in committed code.
- Do not bypass Zod validation on server function inputs.
- Do not write migrations by hand — always use `drizzle-kit generate`.
- Do not use `any` as a shortcut.
