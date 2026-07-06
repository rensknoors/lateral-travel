# Notes For Future Agents

Concise handover notes for the next agent working on this assessment.

## Current state

All 15 phases of [docs/PLAN.md](PLAN.md) are done — the project is submission-ready. Quality gate to run before any work:

```bash
pnpm test && pnpm lint && pnpm build
```

The same gate runs in CI (`.github/workflows/ci.yml`) on pushes to `main`/`develop` and on PRs.

## Phase 10 (availability quote) handover

- `features/stays/components/stay-availability-panel.tsx` now calls `useAvailabilityQuery` (already scaffolded in Phase 9) once check-in, check-out and guests form a valid selection (`isValidBookingSelection`). It renders a loading skeleton, a price breakdown (nightly rate x nights, service fee, total) when available, or an alert with the reason when unavailable/errored.
- Reserve is only enabled when the selection is valid **and** the resolved quote says `isAvailable: true`. Don't gate it on the local date/guest check alone — the mock backend can still reject a quote (e.g. guests over `maxGuests`).
- The panel reuses `Alert`/`AlertAction` for the "couldn't check availability" case with a "Try again" button wired to `refetch()`. Checkout/confirmation now follow the same recoverable-error pattern.

## MSW is now wired into tests

- `tests/setup.ts` starts the shared `mocks/server.ts` MSW server for every test run (`server.listen({ onUnhandledRequest: "error" })`, reset after each test, closed at the end). This closes the gap noted after Phase 9: components using `useQuery`/`useMutation` are now integration-tested against the real mock handlers instead of needing manual fetch mocks.
- Added `tests/render-with-query-client.tsx` — a small `renderWithQueryClient(ui)` helper that wraps a component in a fresh `QueryClient` (retries disabled). Use this for any new component test that calls a React Query hook.
- `onUnhandledRequest: "error"` means any request hitting a route without a handler (or without a `server.use()` override) will fail the test loudly — this is intentional, keep it that way.
- Test stay fixtures (e.g. `id: "harbor-loft"`) are **not** present in the seeded `mockStays` (random faker UUIDs, seeded in `mocks/stays.ts`). For any test that needs a specific stay response, override the handler with `server.use(http.get("*/api/stays/:stayId/...", ...))` inside the test rather than relying on the seeded data — see `features/stays/components/stay-availability-panel.spec.tsx` for the pattern.

## Phase 12 (testing) handover

- Domain coverage lives next to the code it tests: `features/stays/domain/stay-service.spec.ts` covers night counting, quote pricing/rounding, invalid date ranges, guest capacity, filtering (query/location/category/guests/price/amenities) and all four sort options including the recommended tiebreak chain (rating -> review count -> quiet score).
- That spec builds stays with a local `createStay(overrides)` fixture instead of importing `mocks/factories`. Keep it that way for unit tests: the factory pulls in faker and produces randomized fields, which makes assertions on exact prices/ordering impossible.
- `tests/booking-flow.spec.ts` is the end-to-end flow test: browse -> detail -> availability -> checkout -> confirmation through the typed API clients (`stay-api.ts`, `booking-api.ts`) against the shared MSW server. It deliberately does **not** render pages — every screen already has a component spec, and a browser e2e was cut per the plan's timebox strategy. It also avoids hardcoding stay ids by using `stays[0]` from the live list response, so it survives reseeding.
- MSW's `server.resetHandlers()` (in `tests/setup.ts`) resets handler overrides but **not** repository state — `bookingsById` and stay favorite flags persist across tests within one spec file. Don't assert on "no bookings exist"; create what you need and assert on it.
- `checkoutFormSchema` validation is covered in `features/bookings/utils/checkout-schema.spec.ts`. Note the mock booking endpoint itself trusts its payload (no runtime validation, per the compile-time-contracts decision in PLAN.md) — an unknown `stayId` is the only rejected case (404).
- CI (`.github/workflows/ci.yml`) uses pnpm 10 + Node 22 and runs lint, test, build. If you add Playwright later, give it a separate job so unit feedback stays fast.

## Phase 13 (accessibility and UX polish) handover

- The `<main id="main-content">` landmark lives in `app/layout.tsx` (wrapping `children`), **not** in `PageShell` — the refactored pages stopped using `PageShell`, so putting it there left every page without a main landmark. If a new page needs its own `<main>`, remove the layout-level one first; never render two.
- Skip link gotcha: Tailwind v4 does not generate `focus:not-sr-only` (the v4 `not-` variant prefix shadows the `not-sr-only` utility — the rule silently never appears in the stylesheet). The skip link in `app/layout.tsx` uses `-translate-y-24` + `focus-visible:translate-y-0` instead. Reuse that pattern for any future visually-hidden-until-focus element.
- `globals.css` has a global `prefers-reduced-motion: reduce` override that flattens all animations/transitions and disables smooth scroll (`html` uses `motion-safe:scroll-smooth`). New animations don't need per-component reduced-motion handling unless they animate something the override can't neutralize.
- Form error pattern (used by both review and checkout forms): manual `schema.safeParse` in submit, `setError` per issue, `setFocus` on the first errored field, inline `<p role="alert">` linked via `aria-describedby`, `aria-invalid` on the control. The review rating radiogroup is skipped by `setFocus` because its radios are not `register`-ed.
- Async status announcements: the filter bar result count and the hero guest stepper count have `aria-live="polite"`; the availability quote region already had it. Keep new async status text in one of these regions or add its own.
- `next/image` in this Next 16 install: `priority` is deprecated — use `preload` (see `stay-gallery.tsx`). The build does not warn loudly, so grep before adding new hero images.
- Amenity filter chips are raw `<button>`s and need explicit `outline-none focus-visible:ring-3 focus-visible:ring-ring/50` (done); shared `Button`/`Input` primitives already handle their own focus styles.

## Phase 14 (CI and release) handover

- **MSW now runs in production builds.** `app/msw-provider.tsx` gates the worker on `NEXT_PUBLIC_API_MOCKING !== "disabled"` instead of `NODE_ENV`. The old dev-only gate shipped a broken production app (no `/api/*` backend existed). If you see the app hang on a blank screen in a prod build, check that `public/mockServiceWorker.js` is being served and the env var wasn't set.
- Production build was smoke-tested via `pnpm start` (config `prod` in `.claude/launch.json`, port 3100): worker registers, stays render, and a full quote -> booking POST round trip succeeds in the browser.
- Releases are automated with **semantic-release** (`.releaserc.json`, `release` job in `ci.yml` gated on the `verify` job and `main` pushes). Commit messages must follow Conventional Commits — `feat:` -> minor, `fix:` -> patch, `feat!:`/`BREAKING CHANGE:` -> major; `chore:`/`docs:`/`test:` release nothing. The existing history is already conventional.
- semantic-release owns `CHANGELOG.md` and the `version` field in `package.json` (`@semantic-release/npm` with `npmPublish: false`); never edit either by hand. The release commit is `chore(release): x.y.z [skip ci]`, pushed back to `main` by `@semantic-release/git` — if branch protection is ever enabled on `main`, that push needs a bypass (e.g. a PAT or an app token) or the git plugin must be dropped.
- No tags exist yet; the first merge to `main` with a releasable commit produces **v1.0.0** (verified via `semantic-release --dry-run`). Nothing was pushed from this session.
- Vercel deploy is intentionally not done (timebox cut #1, unresolved question in PLAN.md). It needs no config beyond the Next.js preset; the README's deployment section covers the MSW env flag and the in-memory-data caveat that should be repeated in any demo.
- CI pass/fail on GitHub couldn't be verified from this environment (private repo, no `gh` CLI/auth). The workflow mirrors the local gate exactly; check the Actions tab after the next push.

## Phase 15 (documentation and presentation) handover

- README is the submission artifact: setup, architecture, API table, testing strategy, tradeoffs, next steps and the LLM usage note. The owner wants docs **concise** — interviewers won't read 15 minutes of documentation. Don't grow it; tighten it.
- The tradeoffs section frames time honestly: active hands-on time roughly within the 4-6h box, wall-clock longer because agent sessions ran unattended. Keep that framing consistent everywhere (README, DEMO.md, the recording).
- `docs/DEMO.md` is a timed 5-minute outline with a click path per section and a likely-questions appendix — it references the two "what broke" stories (dev-only MSW, Tailwind v4 `focus:not-sr-only`) as interview material.
- Production deployment: https://lateral-travel.vercel.app (Vercel project `lateral-travel` under `rensknoors-projects`, default Next.js preset, deployed via `vercel deploy --prod`). `.vercel/` and `.env.local` are gitignored artifacts of `vercel link`. Redeploy = `npx vercel deploy --prod --yes`; consider enabling the Vercel git integration so merges to `main` deploy automatically.
- The live site was smoke-tested over HTTP (page + `mockServiceWorker.js` both 200). Before recording the demo, click through the booking flow once on the live URL in a real browser.

## Known gaps to watch

- `@hookform/resolvers` is still unused — `zodResolver` breaks the build against `zod@4.4.x` (see Phase 9 note in `PLAN.md`). Keep using manual `schema.safeParse` + `setError` unless the resolver is proven build-safe with the installed Zod version.
- Review list/form components (`features/reviews/components/review-list.tsx`, `review-form.tsx`) still have no dedicated tests. Now that MSW is wired in, they can be tested the same way as the availability and checkout flows if a future phase needs that coverage.

## Phase 11 (checkout and confirmation) handover

- Checkout now lives at `/checkout` via `app/checkout/page.tsx` and `features/bookings/components/checkout-page-client.tsx`. The page unwraps async `searchParams`, passes `stayId`, `checkIn`, `checkOut`, `guests` into `CheckoutFlow`, and the client wrapper owns the `router.push("/bookings/:bookingId")` side effect.
- `features/bookings/components/checkout-flow.tsx` intentionally re-fetches both stay details and the availability quote from the URL params before `POST /api/bookings`. It validates with React Hook Form + Zod through `checkoutFormSchema.safeParse` and `setError`; keep this manual pattern unless `@hookform/resolvers` is proven build-safe with the installed Zod version.
- URL-derived checkout params are guarded by `features/bookings/utils/is-valid-checkout-selection.ts`, including missing `stayId`, malformed dates and non-integer guest counts. Keep invalid params on the recovery state instead of letting them fall through to API calls or broken stay links.
- Confirmation now lives at `/bookings/[bookingId]` and renders `BookingConfirmation`, which fetches the booking first and then fetches the stay name/location from `booking.stayId`. In the mock app, bookings are stored in the in-memory `bookingsById` map, so a confirmation URL is only resolvable after the booking was created in the same browser/MSW session.
- Focused Phase 11 tests are in `features/bookings/components/checkout-flow.spec.tsx` and `booking-confirmation.spec.tsx`. They override MSW handlers with complete stay/quote/booking fixtures instead of relying on seeded faker stays.
