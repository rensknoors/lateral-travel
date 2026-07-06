# Notes For Future Agents

Concise handover notes for the next agent working on this assessment.

## Current state

Phases 1-10 of [docs/PLAN.md](PLAN.md) are done. Quality gate to run before any work:

```bash
pnpm test && pnpm lint && pnpm build
```

## Phase 10 (availability quote) handover

- `features/stays/components/stay-availability-panel.tsx` now calls `useAvailabilityQuery` (already scaffolded in Phase 9) once check-in, check-out and guests form a valid selection (`isValidBookingSelection`). It renders a loading skeleton, a price breakdown (nightly rate x nights, service fee, total) when available, or an alert with the reason when unavailable/errored.
- Reserve is only enabled when the selection is valid **and** the resolved quote says `isAvailable: true`. Don't gate it on the local date/guest check alone — the mock backend can still reject a quote (e.g. guests over `maxGuests`).
- The panel reuses `Alert`/`AlertAction` for the "couldn't check availability" case with a "Try again" button wired to `refetch()`. Reuse this pattern for the checkout mutation's error state in Phase 11.

## MSW is now wired into tests

- `tests/setup.ts` starts the shared `mocks/server.ts` MSW server for every test run (`server.listen({ onUnhandledRequest: "error" })`, reset after each test, closed at the end). This closes the gap noted after Phase 9: components using `useQuery`/`useMutation` are now integration-tested against the real mock handlers instead of needing manual fetch mocks.
- Added `tests/render-with-query-client.tsx` — a small `renderWithQueryClient(ui)` helper that wraps a component in a fresh `QueryClient` (retries disabled). Use this for any new component test that calls a React Query hook.
- `onUnhandledRequest: "error"` means any request hitting a route without a handler (or without a `server.use()` override) will fail the test loudly — this is intentional, keep it that way.
- Test stay fixtures (e.g. `id: "harbor-loft"`) are **not** present in the seeded `mockStays` (random faker UUIDs, seeded in `mocks/stays.ts`). For any test that needs a specific stay response, override the handler with `server.use(http.get("*/api/stays/:stayId/...", ...))` inside the test rather than relying on the seeded data — see `features/stays/components/stay-availability-panel.spec.tsx` for the pattern.
- Review list/form components (`features/reviews/components/review-list.tsx`, `review-form.tsx`) still have no dedicated tests. Now that MSW is wired in, they can be tested the same way as the availability panel if a future phase needs that coverage.

## Known gaps to watch

- Checkout (Phase 11) data layer is already scaffolded: `useCreateBookingMutation` and `useBookingQuery` in `features/bookings/api/use-booking-queries.ts`, backed by `createBooking`/`getBooking` in `features/bookings/api/booking-api.ts`. No new API client code should be needed — just build the checkout form/page and confirmation page against these.
- `buildCheckoutUrl` already encodes `stayId`, `checkIn`, `checkOut`, `guests` as query params on `/checkout`. The checkout page should read these via `useSearchParams` and re-fetch the same availability quote (don't trust client-side price state carried over navigation) before submitting the booking.
- `@hookform/resolvers` is still unused — `zodResolver` breaks the build against `zod@4.4.x` (see Phase 9 note in `PLAN.md`). Reuse the manual `schema.safeParse` + `setError` pattern from `features/reviews/components/review-form.tsx` for the checkout form.
