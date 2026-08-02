# DESIGN.md

System design and architecture reference for **Student Opportunity Hub**. This complements `README.md` (features, routes, mock accounts) and `CLAUDE.md`/`AGENTS.md` (agent operating instructions) with the *why* behind the structure. Deeper product requirements and the original design-concept source live in `docs/` (`requirements-summary.md`, `implementation-plan.md`, `design-system.md`, `screen-inventory.md`, and the BRD/PRD `.docx`).

## Product scope

A public opportunity board (internships, startup jobs, competitions, hackathons, scholarships, investment funds, incubation programs) for students, plus four role-based workspaces built on top of the same catalog:

| Role | Can do |
| --- | --- |
| Guest / Student | Discover, search/filter/sort, save, get reminders/notifications, apply in-app with a CV upload |
| Partner | Create/edit opportunity posts, submit for moderation, track views/applications, review and shortlist/reject student applications |
| Moderator | Review queue, approve/request revision/reject partner posts, handle content reports, review history |
| Administrator | Manage users/roles, categories, audit log, content reports |

This is explicitly an **MVP frontend**: there is no backend, database, payment, or file-storage service. Every workflow above is fully interactive and stateful, but backed by mock services and browser storage rather than a server. See "Path to a real backend" below for what changes when one is added.

## Why frontend-only, and how that shapes the code

Building the full role-based workflow (student discovery → partner authoring → moderation → publication → application → review) without a backend means the app has to simulate three things a server would normally own: **latency**, **persistence**, and **cross-role data sharing**. The architecture is deliberately organized around those three concerns:

1. **Latency** — `src/mocks/services/*.ts` are `async` functions that `await delay(ms)` before resolving, so `@tanstack/react-query` still has real loading/error states to manage, exactly as it would against a real API.
2. **Persistence** — `src/stores/*.ts` (Zustand + `persist` middleware) write to `localStorage` under versioned keys (`soh-auth-v1`, `soh-student-v1`, `soh-operations-v1`), so refreshing the browser doesn't lose demo state.
3. **Cross-role data sharing** — because there's no per-user server session, all three stores are global singletons in the same browser tab regardless of which mock account is "logged in." This is what makes end-to-end workflows possible without a backend: a partner can approve a post and a student can immediately see it, because both are reading/writing the same in-memory + localStorage state. `opportunityService.ts` (student-facing reads) and `ApplicationsListDialog.tsx` (partner-facing application review) both reach across store boundaries on purpose — see `CLAUDE.md` for the specific pattern to follow when extending this.

## Layered architecture

```
src/app/            router, providers (TanStack Query client), route config
src/features/       route-level pages, grouped by domain (opportunities, authentication,
                     partner, moderation, administration, notifications, saved-opportunities,
                     student-profile)
src/components/      common/  cross-feature UI (opportunity cards, modals, route guards)
                     ui/      presentational primitives (Button, ...)
                     workspace/ shared chrome for Partner/Moderator/Admin (status badges, metrics)
                     layout/  per-role page shells (PublicLayout, StudentLayout, WorkspaceLayout)
src/mocks/          data/    seeded catalogs (opportunities)
                     services/ mock "API" functions with simulated latency
src/stores/          Zustand stores, persisted to localStorage
src/shared/          cross-cutting types (opportunity, operations, user) and constants
src/styles/           Tailwind CSS 4 tokens (@theme in global.css) + hand-written component
                     classes per surface, imported once in main.tsx
```

Data flows one direction per read: **page → TanStack Query → mock service → (mock data module and/or another store's `getState()`) → Zustand store update → re-render**. There is no separate "API client" layer to swap later beyond the mock service functions themselves — see below.

## Access control model

Route access is layered rather than flagged per-route:

- `ProtectedRoute` — redirects to `/login?redirect=...` if `authStore.isAuthenticated` is false.
- `RoleGuard` — redirects to `/403` if the authenticated user's role isn't in the route's allowed list.
- Each role gets its own layout shell (`StudentLayout`, `WorkspaceLayout` parameterized by role) wrapping its entire route subtree, so nav/chrome is role-appropriate automatically.

This is a **frontend-only** guard for UX purposes (hiding/redirecting) — it is not a security boundary. A real backend integration must re-implement RBAC server-side; the frontend guard would remain purely cosmetic.

## Data model notes

- `OpportunityStatus` (`DRAFT → PENDING_REVIEW → REVISION_REQUIRED → OPEN/HIDDEN → EXPIRED/CLOSED/ARCHIVED`) is shared between `Opportunity` (public catalog) and `PartnerPost` (partner's authoring record) — they represent the same lifecycle viewed from two sides of moderation, not two different concepts.
- `OpportunityApplication` (student's submission: contact info + CV metadata) carries its own `ApplicationStatus` (`PENDING/SHORTLISTED/REJECTED`), independent of the opportunity's own status, since an opportunity can stay `OPEN` while individual applications move through review.
- CVs are validated client-side (PDF/DOCX, size cap) and only their filename/size are persisted — there is no real file storage, since there's no backend to store the file on.

## Design system

Source concepts: `docs/design/*.png`. Full token list: `docs/design-system.md`. Summary: primary `#0B5CFF` on white surfaces, navy/ink/muted text scale, 4px spacing base, 10–24px radius scale, Inter/system sans, Lucide outline icons (filled only for the "saved" bookmark state), 180–220ms fade-slide for drawers/modals respecting `prefers-reduced-motion`. Tokens are defined once via Tailwind 4's `@theme` block in `src/styles/global.css`; most component-level styling is hand-written CSS per surface (`opportunity.css`, `workspace.css`, `detail.css`, etc.) rather than long Tailwind utility chains, to keep repeated patterns (cards, dialogs, status badges) consistent and easy to reuse.

## Known limitations (by design, at this stage)

- No backend/database/real auth/email/push notifications — everything is mock + localStorage.
- Persisted stores declare a `version` but have no `migrate` function: a shape change to persisted state is shallow-merged over defaults, not migrated. Fine for a demo; would need real migrations before shipping with real user data.
- Search/filter/sort run client-side over the full mock catalog; not representative of backend search performance or ranking.
- Frontend RBAC is UX-only, not a security boundary (see "Access control model").

## Path to a real backend

Keep the current service function signatures (`src/mocks/services/*.ts`) as the contract and swap their implementations for real HTTP calls — pages and TanStack Query usage shouldn't need to change. The backend needs to additionally provide: pagination/filter query contract, secure sessions, server-side RBAC, idempotency for save/submit actions, unambiguous ISO-timezone timestamps, and a consistent error envelope. Zustand would then narrow to genuinely client-only state (UI preferences, draft form state) rather than being the source of truth it is today.
