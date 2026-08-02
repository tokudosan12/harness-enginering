# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, or any other agent) working in this repository. Tool-specific guidance for Claude Code lives in `CLAUDE.md`; this file is the tool-agnostic baseline every agent should follow.

## Project

**Student Opportunity Hub** — a frontend-only React 19 + TypeScript SPA (Vite) for a student opportunity board (internships, hackathons, scholarships, etc.), with role-based workspaces for Student, Partner, Moderator, and Administrator. There is **no backend**: data lives in seeded mock modules and Zustand stores persisted to `localStorage`. See `README.md` for the full feature list and mock account credentials, and `DESIGN.md` for architecture/design decisions.

## Setup

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

Node.js 20+ and npm 11+ are required.

## Before committing / finishing a task

Run these and fix anything they report — there is no test suite, so these three are the entire quality gate:

```bash
npx tsc --noEmit -p tsconfig.app.json   # type-check app source
npm run lint                             # eslint .
npm run build                            # full build (tsc -b + vite build)
```

`npm run format` / `npm run format:check` (Prettier, with `prettier-plugin-tailwindcss` for class sorting) should also pass.

## Conventions

- Import via the `@/` alias (maps to `src/`), never deep relative paths (`../../..`).
- This app has no server: a bug report like "X doesn't show for role Y" is almost always a client-side data-flow issue (wrong mock service, a Zustand store not being read, or a filter condition) — read `src/mocks/services/` and `src/stores/` before assuming a "backend" fix is needed.
- Zustand stores are global singletons shared across all simulated roles in the same browser session (see `CLAUDE.md` for why). It is normal and expected for a Partner-facing component to read `useStudentStore` directly, or for a mock service function to call `useOperationsStore.getState()`.
- Reuse existing UI patterns instead of inventing new ones: `.dialog-wrap`/`.dialog-backdrop`/`.dialog-card` for modals, `.field-control`/`.field-label`/`.field-error` for form fields, `StatusBadge`/`workspace-status-*` for status pills. Check `src/styles/*.css` and `src/components/common/`, `src/components/ui/`, `src/components/workspace/` before writing new CSS.
- No `any`, `@ts-ignore`, or blanket `eslint-disable` to silence errors — fix the underlying type/lint issue.
- Persisted Zustand stores declare a `version` but have no `migrate` function; when adding a field to persisted state, add it to the store's initial state object so it's present for both fresh and pre-existing `localStorage` data.
- Verify UI changes by actually running the dev server and exercising the flow (the repo has no automated UI tests to fall back on).
