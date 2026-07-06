# Notes For Future Agents

Concise handover notes for the next agent working on this assessment.

## Current state

Phases 1-9 of [docs/PLAN.md](PLAN.md) are done. Quality gate to run before any work:

```bash
pnpm test && pnpm lint && pnpm build
```

## Phase 9 (reviews) handover

- Added review list and form on stay detail via `features/reviews/components/review-list.tsx` and `review-form.tsx`.
- Validation lives in `features/reviews/utils/review-schema.ts` (Zod; required name, rating 1-5, 20-1000 chars comment, basic blocked-terms check).
- Review form uses React Hook Form but **does not use `@hookform/resolvers`**. `zodResolver` from `@hookform/resolvers@5.4.0` has a type mismatch with `zod@4.4.x` that breaks `pnpm build`. If you need to add more Zod forms, reuse the manual `safeParse` + `setError` pattern in `review-form.tsx` unless a later `@hookform/resolvers` version fixes this.
- `useAddReviewMutation` already invalidates the review list and stay detail query; new reviews appear immediately. Aggregate `rating`/`reviewCount` in `ReviewSummary` are still static from the mock stay object — recompute if a future phase needs it.

## Known gaps to watch

- `mocks/server.ts` exists but is not wired into `tests/setup.ts`, so components that call `useQuery`/`useMutation` are not integration-tested with MSW yet. Phase 10 (availability quote) will likely need a test wrapper and `server.listen()`/`resetHandlers()`/`close()` in setup if you want to cover network behavior in tests.
- `features/stays/components/stay-availability-panel.tsx` only picks dates/guests and links to checkout. It does not yet call `useAvailabilityQuery` or display a price quote. The data layer is already scaffolded: `AvailabilityRequest`/`AvailabilityQuote` types, `getAvailability`, and `useAvailabilityQuery` in `features/stays/api/*`.
