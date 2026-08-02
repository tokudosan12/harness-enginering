# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install              # install dependencies
npm run dev               # start Vite dev server at http://127.0.0.1:5173
npm run build              # type-check (tsc -b) then production build to dist/
npm run preview             # serve the production build locally
npm run lint                # eslint . (flat config, ts/tsx only)
npm run format               # prettier --write .
npm run format:check          # prettier --check .
```

There is no test suite and no test script in `package.json` — do not assume `npm test` exists.

To type-check without emitting/building, run `npx tsc -b --noEmit` or `npx tsc --noEmit -p tsconfig.app.json` for just the app source (excludes the Node-only `vite.config.ts` project).

## Architecture

This is a **frontend-only** React 19 + TypeScript (strict) SPA — there is no backend, database, or real API. Everything is simulated client-side with mock data/services and Zustand stores persisted to `localStorage`. Keep this in mind when asked to "fix" something: the fix is almost always in a mock service or a Zustand store, not a server.

### Path alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`). Always import via `@/...`, not relative `../../` paths.

### Mock data layer

- `src/mocks/data/opportunities.ts` — the seeded catalog of public opportunities (`Opportunity[]`), procedurally generated with deterministic categories/statuses/deadlines.
- `src/mocks/services/*.ts` — async functions that stand in for API calls (they `await delay(...)` to simulate latency). `opportunityService.ts` is the single source student-facing pages read from; it merges the static seed catalog with approved (`status === 'OPEN'`) partner-created posts pulled live from `useOperationsStore.getState()` — a service function reading another feature's Zustand store directly, not via a React hook. Follow this pattern (`store.getState()` inside plain async functions) rather than introducing a new data-fetching mechanism.

### Zustand stores (`src/stores/`)

Each store uses `persist` to `localStorage` under its own key (`soh-auth-v1`, `soh-student-v1`, `soh-operations-v1`) and declares `version` but has **no `migrate` function** — shape changes to persisted state are not migrated, only shallow-merged over the initial state on rehydrate. When adding a field to a persisted store, seed it in the store's initial state so existing localStorage without that key still works, but be aware arrays/objects in old persisted state fully replace (not deep-merge with) the new initial state.

- `authStore.ts` — current `AuthUser` + `MOCK_ACCOUNTS` (one seeded account per role: STUDENT/PARTNER/MODERATOR/ADMINISTRATOR, see README for credentials). `roleHome(role)` returns the post-login landing route.
- `studentStore.ts` — saved/reminder opportunity ids, notifications, profile, settings, and `applications: OpportunityApplication[]` (student's submitted job/opportunity applications, keyed by `opportunityId`).
- `operationsStore.ts` — partner posts (`PartnerPost[]`), organization profile, moderation reports, managed users, categories, audit log. This is the backing store for the Partner, Moderator, and Admin workspaces.

**Important**: because this app has no real multi-tenant backend, all Zustand stores are global singletons shared across the whole browser session regardless of which role is currently "logged in." A component rendered under the Partner workspace can — and does — read `useStudentStore` directly (e.g. to show submitted applications for a post) the same way `opportunityService.ts` reads `useOperationsStore.getState()`. This is intentional, not a bug: don't add artificial boundaries between role stores.

### Routing (`src/app/router.tsx`, `routeConfig.ts`)

`createBrowserRouter` with per-route `lazy()` imports (code-split by page) and a shared `hydrateFallbackElement`. Access control is layered, not per-route flags:
- `ProtectedRoute` (`src/components/common/RouteGuards.tsx`) redirects to `/login?redirect=...` when `authStore.isAuthenticated` is false.
- `RoleGuard` wraps that and redirects to `/403` when `authStore.user.role` isn't in the allowed list.
- Each role has its own layout shell (`StudentLayout`, `WorkspaceLayout` parameterized by `role`) wrapping its route subtree.

`routeConfig.ts` is a flat constant map of path strings — prefer it over hardcoding route strings when linking across features.

### Feature organization

`src/features/<domain>/pages/*.tsx` holds route-level page components (opportunities, authentication, partner, moderation, administration, notifications, saved-opportunities, student-profile). Shared, cross-feature UI (opportunity cards, modals/dialogs, route guards) lives in `src/components/common/`; presentational primitives (Button, etc.) in `src/components/ui/`; workspace-specific chrome (status badges, metric cards) shared by Partner/Moderator/Admin in `src/components/workspace/`.

### Forms

Two patterns coexist — match whichever the surrounding page already uses rather than mixing:
- **react-hook-form + zod** (`authentication/pages/*`, `common/ApplyOpportunityDialog.tsx`): `useForm({ resolver: zodResolver(schema) })`, loading state from `formState.isSubmitting`, a `success-panel`/similar view swapped in after submit.
- **Plain `useState` + manual validation** (`partner/pages/PartnerPostEditorPage.tsx`): used for the longer workspace content forms.

### Styling

Tailwind CSS 4 (via `@import 'tailwindcss'` + `@theme` tokens in `global.css`, no `tailwind.config.js`) is used for utility classes, mixed with a large set of hand-written component classes (`.field-control`, `.dialog-card`, `.workspace-*`, `.btn`/`.btn-primary`, etc.) defined across the per-surface stylesheets in `src/styles/` and imported once in `main.tsx`. When building a new dialog/modal, reuse the existing `.dialog-wrap` / `.dialog-backdrop` / `.dialog-card` classes from `detail.css` rather than inventing a new modal pattern. `cn()` in `src/lib/cn.ts` is a minimal classnames joiner (no dependency).

### Shared types (`src/shared/types/`)

`opportunity.ts`, `operations.ts`, `user.ts` are the canonical domain types. `OpportunityStatus` (opportunity lifecycle: DRAFT → PENDING_REVIEW → OPEN/HIDDEN/etc.) is reused as the status type for `PartnerPost` in `operations.ts` — the two are the same lifecycle viewed from different sides (partner draft vs. public listing).
