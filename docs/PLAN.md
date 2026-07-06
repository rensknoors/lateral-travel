# Lateral Travel Development Plan

## Product Direction

Build a small Booking.com-like product for **curated remote-work stays**: boutique hotels, cabins and apartments selected for focus, comfort and reliable work conditions.

Reason: this scope is specific enough to feel designed, but still maps cleanly to the assessment requirements: search, details, reviews, availability, price display and checkout.

## Goals

- Deliver an end-to-end booking flow, not just isolated screens.
- Keep backend small but real: frontend talks to HTTP API routes.
- Make product and engineering choices easy to defend.
- Show quality through typed contracts, loading/error states, accessibility, tests, CI and documentation.
- Stop at the timebox and document tradeoffs clearly.

## Core Choices

- **Framework:** Next.js App Router with React and TypeScript.
  - Reason: one app, one local command, easy deployment, supports a focused frontend delivery.
- **Backend contract:** MSW-backed mock API for all `/api/*` endpoints.
  - Reason: lets the frontend develop against real HTTP boundaries while assuming the backend team owns runtime validation.
- **Contracts:** TypeScript request/response types only.
  - Reason: the frontend and backend contract is compile-time here; no duplicate Zod schemas for trusted internal endpoints.
- **Forms:** React Hook Form with field-level validation.
  - Reason: strong validation UX with little boilerplate and no runtime API schema duplication.
- **Styling:** Tailwind plus small reusable UI primitives.
  - Reason: fast iteration, consistent responsive UI, no heavy component dependency.
- **State:** URL search params for search/filter state; local component state for forms; no global store unless favourites are added.
  - Reason: search state should be shareable, most other state is local.
- **Data:** Seeded in-memory mock data.
  - Reason: the assessment is frontend-focused; no database keeps scope under control.
- **Testing:** Vitest for domain logic, contracts and one integration/e2e happy path if time allows.
  - Reason: tests cover high-risk behavior instead of snapshots of markup.
- **Observability:** console instrumentation around user-facing flow milestones.
  - Reason: meets basics without adding external services.

## Phase 0: Setup And Scope Lock

**Goal:** define the product promise and remove ambiguity before coding.

**Work:**

- Pick the final product angle: remote-work stays.
- Define must-have flow: browse -> detail -> review -> availability quote -> checkout -> confirmation.
- Define non-goals:
  - no real payment provider;
  - no authentication;
  - no persistent database;
  - no admin panel;
  - no real map integration.
- Update README later with assumptions and tradeoffs.

**Deliverables:**

- Product one-liner.
- Feature scope.
- Tradeoff list.

**Exit criteria:**

- Every required assessment capability maps to one planned screen or API route.

## Phase 1: Project Foundation (Done)

**Goal:** make the project ready for disciplined development.

**Status:** Done.

**Verification:** `pnpm test && pnpm lint && pnpm build` passes.

**Work:**

- Add dependencies:
  - `react-hook-form`
  - `msw`
  - `vitest`
  - `@testing-library/react`
  - `@testing-library/jest-dom`
  - optionally `playwright` if using e2e.
- Add scripts:
  - `dev`
  - `lint`
  - `test`
  - `test:watch`
  - `build`
- Configure test setup.
- Replace starter metadata and base layout.
- Define design tokens in `app/globals.css`.

**Reasoning:**

Foundation first avoids mixing build/test setup with product work. It also shows that quality gates are intentional, not added at the end.

**Exit criteria:**

- `pnpm lint`, `pnpm test` and `pnpm build` have clear scripts.
- App has real metadata and no starter copy.

## Phase 2: Domain Model, API Contracts And MSW Mocks (Done)

**Goal:** create typed contracts before UI screens depend on them.

**Status:** Done.

**Verification:** `pnpm test && pnpm lint && pnpm build` passes.

**Work:**

- Define domain types:
  - `Stay`
  - `StaySummary`
  - `Review`
  - `AvailabilityQuote`
  - `Booking`
  - `Money`
  - `DateRange`
- Define TypeScript-only API contracts:
  - request/query types;
  - response types;
  - error response type;
  - route-to-contract map.
- Add MSW mock backend:
  - stay search and details;
  - reviews list and create;
  - availability quote;
  - booking create and lookup.
- Add MSW contract tests for the mocked endpoints.

**Reasoning:**

The frontend can trust internal backend contracts without duplicating runtime validation in Zod. MSW still gives us a realistic HTTP boundary and makes the product flow demoable before real backend integration.

**Exit criteria:**

- Types are reusable from mocks, tests and client helpers.
- All planned endpoints have MSW handlers.
- Contract tests prove the mocked endpoints return the expected shapes.

## Phase 3: Seed Data And Domain Services (Done)

**Goal:** isolate business behavior from UI and HTTP.

**Status:** Done.

**Verification:** Code audit confirmed seeded stays, pure domain helpers and in-memory repositories exist for stays, reviews and bookings.

**Work:**

- Add realistic stay seed data:
  - location;
  - photos;
  - nightly price;
  - amenities;
  - rating;
  - review count;
  - work-focused attributes like wifi score, desk setup and quiet score.
- Add pure helpers:
  - filter stays;
  - sort stays;
  - calculate nightly and total price;
  - calculate availability quote;
  - create booking reference.
- Add repository functions around in-memory data:
  - list stays;
  - get stay by id;
  - list/add reviews;
  - create/get booking.

**Reasoning:**

Pure services make pricing and filtering testable. Repositories keep MSW handlers and future backend adapters thin and easy to read.

**Exit criteria:**

- MSW handlers can call services without knowing seed data internals.

## Phase 4: Mock Backend Scenario Coverage (Done)

**Goal:** refine the MSW backend surface required by the assessment.

**Status:** Done.

**Verification:** Code audit confirmed handlers exist for all planned routes, missing resources return 404 and created bookings can be looked up.

**Routes:**

- `GET /api/stays`
  - query, location, price range, guest count, amenities and sort.
- `GET /api/stays/:stayId`
  - full stay details.
- `GET /api/stays/:stayId/reviews`
  - review list.
- `POST /api/stays/:stayId/reviews`
  - add review with basic moderation handled in frontend form logic.
- `GET /api/stays/:stayId/availability`
  - availability and price quote for date range and guests.
- `POST /api/bookings`
  - create mocked confirmed booking.
- `GET /api/bookings/:bookingId`
  - confirmation lookup.

**Reasoning:**

This mock API is small, complete and directly aligned to the user journey. Availability gets its own route because it behaves like a quote and can change independently from stay details.

**Exit criteria:**

- All handlers return typed JSON.
- Missing resources return 404.
- Booking creation produces a retrievable confirmation.

## Phase 5: API Client Layer (Done)

**Goal:** avoid raw `fetch` calls scattered through components.

**Status:** Done.

**Verification:** Code audit confirmed typed client helpers exist for every planned endpoint and API URL construction is isolated to client helpers.

**Work:**

- Create typed client functions:
  - `getStays`
  - `getStay`
  - `getReviews`
  - `addReview`
  - `getAvailability`
  - `createBooking`
  - `getBooking`
- Normalize API errors into a small `ApiError` shape.
- Keep request construction near feature code.

**Reasoning:**

Typed client functions keep UI components focused on rendering states. They also make the frontend/backend boundary easy to explain.

**Exit criteria:**

- Components do not build API URLs manually except through client helpers.

## Phase 6: Shared UI System (Done)

**Status:** Done.

**Goal:** create enough reusable UI to move fast without generic-looking screens.

**Work:**

- Build small primitives:
  - button;
  - input;
  - select;
  - card;
  - badge;
  - skeleton;
  - alert/error state;
  - empty state.
- Build layout components:
  - site header;
  - page shell;
  - responsive content container.
- Define visual direction:
  - refined editorial travel style;
  - warm neutral background;
  - high-quality image treatment;
  - strong typography and spacing;
  - subtle motion only where it helps.

**Reasoning:**

The UI should feel intentionally designed, but the component system should stay small. The assessment rewards product thinking more than a large design system.

**Exit criteria:**

- Core screens can be assembled from consistent primitives.
- Buttons, inputs and forms have accessible labels/focus states.

## Phase 7: Browse And Search Experience (Done)

**Goal:** build the first impression and main discovery flow.

**Status:** Done.

**Verification:** `pnpm test && pnpm lint && pnpm build` passes. Manually verified in-browser at desktop and mobile widths: search, sort, price range, amenity toggles and clear-filters all update the URL and results; empty and error states render correctly.

**Work:**

- Replace starter homepage with:
  - hero section;
  - search form;
  - filter/sort controls;
  - stay result grid;
  - responsive mobile layout.
- Use URL search params for filters.
- Implement loading, empty and error states.
- Show price, rating, location and remote-work highlights on each card.

**Reasoning:**

Search is the main entry point. URL-driven filters make the flow shareable and avoid unnecessary client state.

**Exit criteria:**

- User can browse stays.
- Filters and sorting update results.
- Empty state explains what to change.
- Cards link to detail pages.

## Phase 8: Stay Detail Experience (Done)

**Goal:** help the user decide whether to book.

**Status:** Done.

**Verification:** `pnpm test && pnpm lint && pnpm build` passes. Stay detail page at `/stays/[stayId]` renders gallery, header, amenities, remote-work fit, policies, review summary and sticky availability panel with loading, error and not-found states.

**Work:**

- Build stay detail page:
  - photo gallery;
  - title, location and rating;
  - amenities;
  - remote-work fit section;
  - policies;
  - review summary;
  - sticky availability panel.
- Fetch stay details and reviews.
- Handle not found, loading and error states.

**Reasoning:**

The detail page should combine product storytelling with booking utility. The sticky quote panel keeps the next action obvious without overbuilding a full checkout widget.

**Exit criteria:**

- Detail page is responsive.
- User can inspect the stay and start a checkout.
- Missing stay ids render a clear not-found state.

## Phase 9: Reviews And Comments (Done)

**Goal:** satisfy review list and add-review requirements with useful validation.

**Status:** Done.

**Verification:** `pnpm test && pnpm lint && pnpm build` passes. Stay detail page shows the review list (loading/error/empty states) and an add-review form below it; submitting a valid review clears the form and the new review appears at the top of the list via query invalidation.

**Note:** `@hookform/resolvers` was dropped due to an upstream type incompatibility between its `zodResolver` overloads and zod 4.4.x (see `docs/NOTES.md`). Validation instead runs `reviewFormSchema.safeParse` manually in the submit handler and reports errors through React Hook Form's `setError`, keeping the intended Zod-validation UX without the broken glue package.

**Work:**

- Show reviews on stay detail page.
- Add review form:
  - name;
  - rating;
  - comment.
- Validate with Zod:
  - required fields;
  - rating range;
  - minimum comment length;
  - basic profanity/spam moderation.
- Refresh review list after successful submission.

**Reasoning:**

This keeps moderation basic, as requested, while showing real form handling and API mutation behavior.

**Exit criteria:**

- User can add a valid review.
- Invalid reviews show inline errors.
- Newly added review appears in the list.

## Phase 10: Availability And Price Quote

**Goal:** make availability concrete without building a full inventory system.

**Work:**

- Add date range and guest controls.
- Call availability route when inputs are valid.
- Show:
  - available/unavailable;
  - nightly price;
  - number of nights;
  - fees;
  - total price.
- Disable checkout when unavailable or invalid.

**Reasoning:**

Availability is modeled as a quote instead of full inventory. This is realistic enough for the assignment and easy to explain.

**Exit criteria:**

- User sees a clear price before checkout.
- Invalid dates or guest counts cannot proceed.

## Phase 11: Checkout And Confirmation

**Goal:** complete the end-to-end booking flow.

**Work:**

- Build checkout page:
  - booking summary;
  - guest details;
  - mocked payment section;
  - terms confirmation.
- Validate checkout form with React Hook Form and Zod.
- Create booking through `POST /api/bookings`.
- Redirect to confirmation page.
- Build confirmation page from `GET /api/bookings/:bookingId`.

**Reasoning:**

The payment step should be clearly mocked, not fake-complex. The value is in validation, API mutation and confirmation state.

**Exit criteria:**

- User can complete booking.
- Confirmation page shows booking reference, stay, dates, guests and total.
- Failed booking attempts show recoverable errors.

## Phase 12: Testing

**Goal:** cover meaningful behavior instead of superficial rendering.

**Tests:**

- Pricing:
  - calculates nights correctly;
  - calculates total with fees;
  - rejects invalid date ranges.
- Filtering:
  - filters by query/location;
  - filters by guests;
  - sorts by price/rating.
- Schemas:
  - rejects invalid reviews;
  - rejects invalid booking payloads.
- Flow test if time allows:
  - browse -> detail -> availability -> checkout -> confirmation.

**Reasoning:**

Pricing, filtering and validation are high-risk areas. Testing those gives better signal than snapshot tests.

**Exit criteria:**

- Tests run through `pnpm test`.
- CI runs lint, tests and build.

## Phase 13: Accessibility And UX Polish

**Goal:** make the app feel complete and usable.

**Work:**

- Check keyboard navigation for:
  - search controls;
  - review form;
  - checkout form.
- Add accessible labels and error descriptions.
- Ensure focus states are visible.
- Verify mobile layout for browse, detail and checkout.
- Add skeletons where data loading is noticeable.
- Add empty and error states for async screens.

**Reasoning:**

Accessibility and state handling are assessment requirements and strong quality signals. They also make the demo smoother.

**Exit criteria:**

- Core flow is usable on mobile and desktop.
- Forms have clear labels and errors.
- No obvious keyboard traps.

## Phase 14: CI And Release

**Goal:** make the repository submission-ready.

**Work:**

- Add GitHub Actions workflow:
  - install;
  - lint;
  - test;
  - build.
- Confirm production build.
- Optional: deploy to Vercel.
- Define release approach:
  - tag-based release;
  - changelog entry;
  - README release notes.

**Reasoning:**

CI and build prove the project is not just a local demo. Optional deployment is high-impact if time allows.

**Exit criteria:**

- CI passes on push/PR.
- Production build succeeds.
- README explains release/deploy flow.

## Phase 15: Documentation And Presentation

**Goal:** make choices easy to defend.

**Work:**

- Rewrite README with:
  - setup;
  - scripts;
  - architecture notes;
  - API routes;
  - testing strategy;
  - tradeoffs;
  - future improvements;
  - LLM usage note.
- Prepare a short demo script:
  - product framing;
  - search flow;
  - details and reviews;
  - availability quote;
  - checkout;
  - engineering choices.

**Reasoning:**

The assessment explicitly asks for architecture notes, tradeoffs and LLM usage. Strong docs turn scope cuts into intentional decisions.

**Exit criteria:**

- README can answer why each major choice was made.
- Demo can be recorded without improvising.

## Proposed Folder Structure

```txt
app/
  layout.tsx
  page.tsx
  stays/
    [stayId]/
      page.tsx
      loading.tsx
      error.tsx
      not-found.tsx
  checkout/
    page.tsx
  bookings/
    [bookingId]/
      page.tsx
      not-found.tsx
  api/
    stays/
      route.ts
      [stayId]/
        route.ts
        availability/
          route.ts
        reviews/
          route.ts
    bookings/
      route.ts
      [bookingId]/
        route.ts

features/
  stays/
    api/
      stay-api.ts
    components/
      availability-panel.tsx
      stay-card.tsx
      stay-filters.tsx
      stay-gallery.tsx
      stay-grid.tsx
      stay-search.tsx
    types/
      stay.ts
  reviews/
    components/
      review-form.tsx
      review-list.tsx
    types/
      review.ts
  bookings/
    api/
      booking-api.ts
    components/
      booking-summary.tsx
      checkout-form.tsx
      confirmation-card.tsx
    types/
      booking.ts

components/
  layout/
    page-shell.tsx
    site-footer.tsx
    site-header.tsx
  ui/
    badge.tsx
    button.tsx
    card.tsx
    empty-state.tsx
    error-state.tsx
    input.tsx
    select.tsx
    skeleton.tsx

server/
  data/
    stays.seed.ts
  http/
    errors.ts
    responses.ts
  repositories/
    bookings.repository.ts
    reviews.repository.ts
    stays.repository.ts
  services/
    availability.service.ts
    booking.service.ts
    pricing.service.ts

lib/
  api/
    client.ts
    errors.ts
  utils/
    cn.ts
    currency.ts
    dates.ts

tests/
  booking-flow.spec.ts
  filtering.spec.ts
  pricing.spec.ts
  contracts.spec.ts

docs/
  ASSESSMENT.md
  PLAN.md
```

## Timebox Strategy

If the timebox gets tight, cut in this order:

1. Deployment.
2. Full e2e test.
3. Favourites or any optional personalization.
4. Advanced filters.
5. Visual extras.

Do not cut:

1. End-to-end booking flow.
2. API routes.
3. Loading, empty and error states.
4. Basic tests.
5. README tradeoffs.

## Review Checklist

- Does every assessment must-have have a working path?
- Can the app run locally with one clear command?
- Are API payloads validated?
- Are loading, empty and error states visible?
- Is the checkout clearly mocked but complete?
- Do tests cover pricing, filtering and validation?
- Does README explain decisions and tradeoffs?
- Can the demo be recorded in under five minutes?

## Unresolved Questions

- Should the final product stay strictly within the 4-6 hour scope, or aim for a more polished portfolio-level version?
- Should deployment to Vercel be part of the required finish line or treated as optional polish?
- Do we want a distinctive visual theme first, or prioritize engineering completeness first?
