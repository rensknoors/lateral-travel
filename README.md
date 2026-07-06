# Lateral Travel

A small Booking.com-style app for **curated remote-work stays**. Browse
stays, check details and reviews, see availability and pricing, and book.

**Live demo:** https://lateral-travel.vercel.app

![Homepage — search stays and browse featured properties](docs/screenshots/homepage.png)

Built with Next.js (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui,
TanStack Query, React Hook Form + Zod, and a mocked API (MSW).

## Getting Started

Use any package manager. With npm:

```bash
npm install
npm run dev
```

Or pnpm / yarn / bun:

```bash
pnpm install && pnpm dev
yarn install && yarn dev
bun install && bun dev
```

Open [http://localhost:3000](http://localhost:3000). There's no separate
backend or database to set up — a mock service worker (MSW) intercepts
`/api/*` calls and starts automatically.

## Scripts

| Script       | What it does               |
| ------------ | -------------------------- |
| `dev`        | Start the dev server       |
| `lint`       | Lint with oxlint           |
| `typecheck`  | TypeScript check           |
| `test`       | Run the test suite         |
| `test:watch` | Tests in watch mode        |
| `build`      | Production build           |
| `start`      | Serve the production build |

## Architecture

Two top-level folders do most of the work:

**`app/`** — routes only: `/`, `/stays/[stayId]`, `/checkout`,
`/bookings/[bookingId]`.

**`features/`** — one folder per domain (`stays`, `reviews`, `bookings`,
`home`). Inside each domain:

- `api/` — fetch calls plus TanStack Query hooks
- `components/` — screens and UI, with tests next to the file they cover
- `domain/` or `utils/` — plain business logic (pricing, filtering, schemas)
- `types/` — the request/response shapes, shared by both client and mock server

Other folders: `mocks/` is the mock backend (handlers → repositories →
seeded data), `components/ui/` and `components/layout/` hold shared UI
(mostly shadcn/ui primitives, see below), `lib/` has the fetch wrapper and
small helpers.

A request flows one direction: component → query hook → API client → HTTP →
MSW handler → repository → domain logic. Components never build URLs or read
mock data directly, and the same TypeScript types are used on both sides of
that HTTP call.

A few decisions worth explaining:

- **Mock API instead of a real server.** The frontend still talks over real
  HTTP, so nothing is faked at the component level, but there's no server to
  run or database to seed. The mock worker is deliberately left running in
  the production build too — see Tradeoffs below.
- **TypeScript types as the API contract, no Zod on responses.** This is an
  internal, trusted API, so compile-time types are enough there. Zod is used
  where it matters: validating the review and checkout forms.
- **Filters live in the URL**, not in component state. That makes a search
  shareable and makes it survive a page reload. Server data is cached by
  TanStack Query, forms by React Hook Form — no separate global store.
- **shadcn/ui as the component base.** It ships accessible primitives
  (keyboard support, focus handling, ARIA out of the box), so accessibility
  work could focus on the app-specific flows instead of rebuilding basics
  like a select or dialog from scratch.
- **Pricing, filtering and sorting are plain functions**, with no React or
  HTTP involved. That's what makes them easy to unit test directly.

## API Routes

The assessment asked for a minimal surface (list, details, reviews,
checkout). We added three more routes to make the flow feel real end to end:

| Method | Route                             | Purpose                                                           | In original brief?                                                                                                              |
| ------ | --------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/stays`                      | Search: query, location, category, guests, price, amenities, sort | Yes                                                                                                                             |
| GET    | `/api/stays/:stayId`              | Stay details                                                      | Yes                                                                                                                             |
| GET    | `/api/stays/:stayId/reviews`      | List reviews                                                      | Yes                                                                                                                             |
| POST   | `/api/stays/:stayId/reviews`      | Add a review                                                      | Yes                                                                                                                             |
| POST   | `/api/bookings`                   | Create a booking                                                  | Yes                                                                                                                             |
| GET    | `/api/stays/:stayId/availability` | Availability + price quote for a date range and guest count       | Added — the brief left "availability" open, and a real price needs its own request since it depends on dates, not just the stay |
| GET    | `/api/bookings/:bookingId`        | Look up a confirmed booking                                       | Added — needed so the confirmation page can be a real page you can reload or share, not just data passed through navigation     |
| PUT    | `/api/stays/:stayId/favorite`     | Save or unsave a stay                                             | Added — small optional feature, see Tradeoffs                                                                                   |

Missing resources return a `404` with a typed error body, and the client
turns any failed request into a single `ApiError` shape.

## Testing

75 tests, all runnable with `npm test` (or the pnpm/yarn/bun equivalent):

- **Domain tests** for the plain functions: night counting, price and quote
  math, invalid date ranges, filtering and sorting.
- **Schema tests** for the review and checkout forms.
- **Component tests** for the main screens (cards, availability panel,
  checkout, confirmation), rendered against the real MSW handlers rather
  than mocked fetch calls — an unhandled request fails the test.
- **One flow test** that goes browse → detail → availability → checkout →
  confirmation through the actual API clients, so the full journey is
  checked, not just each screen in isolation.

We didn't add a browser end-to-end test (e.g. Playwright). The component
tests already exercise real network calls through MSW, and the flow test
covers the full journey at that same level, so a browser e2e mainly buys
visual/DOM-rendering confidence on top of that — useful, but it was the
first thing cut for time. It's listed under "What I'd do next".

## CI, Releases & Deployment

- **CI** ([ci.yml](.github/workflows/ci.yml)) runs lint, typecheck, tests and
  a build on every push and pull request.
- **Releases are automatic.** Commit messages follow Conventional Commits;
  merging to `main` triggers semantic-release, which works out the next
  version, tags it, opens a GitHub release, and updates
  [CHANGELOG.md](CHANGELOG.md) and the `package.json` version
  (config: [.releaserc.json](.releaserc.json)).
- **Deployment** is a plain Vercel deploy with the default Next.js settings —
  the live demo link above is that deployment. Data resets per browser
  session (see below), so don't expect it to remember anything between
  visits.

## Tradeoffs & Assumptions

- **Mock backend, real contract.** There's no server-side validation or
  real persistence — that's assumed to sit with a backend team later. The
  API shape is built so a real backend could replace MSW without any
  frontend changes.
- **Availability is a quote, not real inventory.** Pick a date range and
  guest count, get back available/unavailable plus a price breakdown.
  There's no calendar of blocked nights. Good enough to demonstrate the
  flow, and a full inventory system was out of scope for the time spent.
- **Payment is a clearly labeled placeholder, not a real integration.** The
  checkout form is real — full name, email and terms are validated like any
  production form — but there's no actual payment provider behind it. The
  "payment" step is a static panel that says outright it's mocked, and
  submitting always succeeds if the stay is available. The goal was to show
  real form validation and a real booking being created, not to fake a
  believable card form.
- **Favorites is a partial feature.** You can save/unsave a stay and it
  persists for that session, but there's no page to view your saved list —
  that part wasn't finished. It's listed under "What I'd do next".
- **No browser e2e test** — see Testing above for why.
- **Data lives in memory per browser session.** Seeded stays reset on
  reload, bookings only exist for that session.
- **Time.** My own hands-on time was roughly within the suggested 4-6 hours.
  The wall-clock time was longer because a lot of the implementation ran as
  supervised LLM agent sessions in the background while I worked on other
  things — see LLM Usage below.

## What I'd Do Next

1. A real backend behind the same TypeScript contracts, with server-side
   validation.
2. Finish favorites: a saved-stays page, and persistence beyond one session.
3. A Playwright happy-path test in CI.
4. Real availability: an actual calendar of blocked dates.
5. Basic observability (e.g. Sentry, web-vitals) instead of console logging.

## LLM Usage

This was built spec-driven, using both Claude Code and Cursor. The UI design
was created with Claude Design.

- **Spec → plan.** The assessment brief
  ([docs/ASSESSMENT.md](docs/ASSESSMENT.md)) plus my own technical notes went
  into an LLM to produce [docs/PLAN.md](docs/PLAN.md): 15 phases, each with
  its own scope and exit criteria.
- **Plan → phases.** Each phase ran as its own Claude Code agent session.
  [docs/NOTES.md](docs/NOTES.md) carries the handoff between phases, so a new
  session doesn't need the old chat history to pick up where the last one
  left off.
- **Manual passes in Cursor.** Smaller edits and fixes along the way were
  done directly in Cursor rather than through an agent session.
- **Guardrails.** A few layers, concretely:
  - Cursor rules and a custom agent under `.cursor/` scope how code should be
    written (project conventions, TypeScript/React style, test style) and
    automate small recurring tasks.
  - Claude Code skills and hooks enforce things like test-writing
    conventions and design review at the point of use, rather than relying
    on the model remembering instructions from earlier in a conversation.
  - Every phase had to pass lint, typecheck, tests and a build before being
    marked done, and UI phases were additionally checked in a real browser
    (keyboard navigation, mobile widths, console errors) — that's how, for
    example, a production build silently missing its mock backend got
    caught before it shipped.
- **I stayed in the loop.** I reviewed every diff, wrote the commits myself,
  and made the scope calls when a session raised a question instead of
  letting it guess.
