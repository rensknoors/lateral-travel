# Notes For Future Agents

Concise handover notes for the next agent working on this assessment.

## Current state

Phases 1-11 of [docs/PLAN.md](PLAN.md) are done. Quality gate to run before any work:

```bash
pnpm test && pnpm lint && pnpm build
```

## Phase 10 (availability quote) handover

- `features/stays/components/stay-availability-panel.tsx` now calls `useAvailabilityQuery` (already scaffolded in Phase 9) once check-in, check-out and guests form a valid selection (`isValidBookingSelection`). It renders a loading skeleton, a price breakdown (nightly rate x nights, service fee, total) when available, or an alert with the reason when unavailable/errored.
- Reserve is only enabled when the selection is valid **and** the resolved quote says `isAvailable: true`. Don't gate it on the local date/guest check alone — the mock backend can still reject a quote (e.g. guests over `maxGuests`).
- The panel reuses `Alert`/`AlertAction` for the "couldn't check availability" case with a "Try again" button wired to `refetch()`. Checkout/confirmation now follow the same recoverable-error pattern.

## MSW is now wired into tests

- `tests/setup.ts` starts the shared `mocks/server.ts` MSW server for every test run (`server.listen({ onUnhandledRequest: "error" })`, reset after each test, closed at the end). This closes the gap noted after Phase 9: components using `useQuery`/`useMutation` are now integration-tested against the real mock handlers instead of needing manual fetch mocks.
- Added `tests/render-with-query-client.tsx` — a small `renderWithQueryClient(ui)` helper that wraps a component in a fresh `QueryClient` (retries disabled). Use this for any new component test that calls a React Query hook.
- `onUnhandledRequest: "error"` means any request hitting a route without a handler (or without a `server.use()` override) will fail the test loudly — this is intentional, keep it that way.
- Test stay fixtures (e.g. `id: "harbor-loft"`) are **not** present in the seeded `mockStays` (random faker UUIDs, seeded in `mocks/stays.ts`). For any test that needs a specific stay response, override the handler with `server.use(http.get("*/api/stays/:stayId/...", ...))` inside the test rather than relying on the seeded data — see `features/stays/components/stay-availability-panel.spec.tsx` for the pattern.

## Known gaps to watch

- `@hookform/resolvers` is still unused — `zodResolver` breaks the build against `zod@4.4.x` (see Phase 9 note in `PLAN.md`). Keep using manual `schema.safeParse` + `setError` unless the resolver is proven build-safe with the installed Zod version.
- Review list/form components (`features/reviews/components/review-list.tsx`, `review-form.tsx`) still have no dedicated tests. Now that MSW is wired in, they can be tested the same way as the availability and checkout flows if a future phase needs that coverage.

## Phase 11 (checkout and confirmation) handover

- Checkout now lives at `/checkout` via `app/checkout/page.tsx` and `features/bookings/components/checkout-page-client.tsx`. The page unwraps async `searchParams`, passes `stayId`, `checkIn`, `checkOut`, `guests` into `CheckoutFlow`, and the client wrapper owns the `router.push("/bookings/:bookingId")` side effect.
- `features/bookings/components/checkout-flow.tsx` intentionally re-fetches both stay details and the availability quote from the URL params before `POST /api/bookings`. It validates with React Hook Form + Zod through `checkoutFormSchema.safeParse` and `setError`; keep this manual pattern unless `@hookform/resolvers` is proven build-safe with the installed Zod version.
- URL-derived checkout params are guarded by `features/bookings/utils/is-valid-checkout-selection.ts`, including missing `stayId`, malformed dates and non-integer guest counts. Keep invalid params on the recovery state instead of letting them fall through to API calls or broken stay links.
- Confirmation now lives at `/bookings/[bookingId]` and renders `BookingConfirmation`, which fetches the booking first and then fetches the stay name/location from `booking.stayId`. In the mock app, bookings are stored in the in-memory `bookingsById` map, so a confirmation URL is only resolvable after the booking was created in the same browser/MSW session.
- Focused Phase 11 tests are in `features/bookings/components/checkout-flow.spec.tsx` and `booking-confirmation.spec.tsx`. They override MSW handlers with complete stay/quote/booking fixtures instead of relying on seeded faker stays.
