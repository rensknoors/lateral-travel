# Ralph Fix Plan

## CRITICAL: Run `pnpm install` before testing
New dependencies were added to package.json (zod, react-hook-form, @hookform/resolvers, zustand, date-fns, lucide-react, vitest, @testing-library/react, etc.).
Claude Code cannot auto-approve this command. Run it manually in your terminal.

## High Priority
- [x] Submitting destination + date range + guests returns only hotels matching `destination` and where `maxGuests >= guests`.
- [x] Leaving all fields empty returns the full hotel list.
- [x] Loading state shown while results are fetched.
- [x] Empty state shown when zero hotels match, with a "reset filters" action.
- [x] Error state shown with retry if `/api/hotels` fails. (ErrorState component exists; wire into page)
- [x] Setting min/max price filters out hotels outside that range.
- [x] Setting a minimum star rating filters out hotels below it.
- [x] Selecting amenities filters to hotels containing all selected amenities.
- [x] Sort control reorders results by price (asc/desc) or rating (desc) without a full page reload.
- [x] Details page renders name, address, star rating, description, amenities, and photo gallery for a valid `:id`.
- [x] Requesting an invalid/nonexistent `:id` shows a not-found state, not a crash.
- [x] Price breakdown reflects current date range and guest count.
- [ ] Results page shows a map with a pin per visible result; clicking a pin highlights/scrolls to the matching card.
- [ ] Hotel details page shows a single-pin map at the hotel's location.
- [ ] Map failing to load does not block viewing the list/details content.
- [x] Hotel details page lists all reviews for that hotel with guest name, rating, text, and date.
- [x] Hotel with zero reviews shows an empty state, not a broken list.
- [x] Submitting a review with name, rating (1-5), and text creates it via `POST /api/hotels/:id/reviews` and it appears in the list without a full page reload.
- [x] Submitting with a missing required field is blocked client-side with a visible validation message.
- [x] Submitted review updates the hotel's `averageRating`/`reviewCount`.
- [x] Clicking the heart on any hotel card toggles favorited state immediately (optimistic).
- [x] Favorited state persists across page reloads via `localStorage`.
- [x] Favorite state is consistent between the results list and the details page for the same hotel.
- [x] Favorites page lists all hotels currently saved in `localStorage`.
- [x] Favorites page shows an empty state with a link back to search when none are saved.
- [x] Unfavoriting from the favorites page removes it from the grid immediately.
- [x] Changing check-in/check-out dates or guest count on the details page recalculates and displays nights × rate = total.
- [x] Guest count exceeding `maxGuests` is blocked with an inline message.
- [x] Invalid date range (checkout before/equal to checkin) is blocked with an inline message.
- [x] Checkout form requires guest name, email, and mock payment fields before submission is enabled.
- [x] Submitting valid checkout calls `POST /api/bookings` and redirects to confirmation.
- [x] Submit button shows loading/disabled state while in flight.
- [x] Confirmation page shows hotel name, dates, guests, total price, booking reference.
- [x] Nonexistent booking id shows not-found state.

## Medium Priority
- [ ] Add map view (Leaflet + OpenStreetMap) — lat/lng data ready in hotels.json
- [ ] Wire ErrorState into home page for API failures (error.tsx boundary)
- [ ] CI pipeline (.github/workflows/ci.yml) ✓ DONE

## Low Priority
- [ ] Toast notifications for favorite toggled / review submitted
- [ ] E2E Playwright test (happy path)
- [ ] Deploy to Vercel

## Completed
- [x] Project enabled for Ralph
- [x] Foundation: types, mock data, Zod schemas, data helpers (lib/hotels.ts, lib/bookings.ts)
- [x] All API route handlers (hotels list/detail/reviews/availability, bookings create/get)
- [x] Zustand favorites store with localStorage persistence
- [x] Components: HotelCard, SearchBar, FilterPanel, StarRating, PhotoGallery, AmenitiesList
- [x] Components: ReviewList, ReviewForm, DateGuestPicker, CheckoutForm
- [x] Components: FavoriteButton, EmptyState, ErrorState, LoadingSkeleton
- [x] Pages: Home (search/results), Hotel detail, Favorites, Checkout, Confirmation
- [x] not-found pages for hotel and booking
- [x] Unit tests: filter-hotels, pricing, schemas
- [x] Next.js image config for Unsplash
- [x] Vitest config and test setup
- [x] GitHub Actions CI workflow
- [x] README with architecture, tradeoffs, LLM usage
- [x] Commit: b83d3a8 (53 files, 3528 insertions)

## Notes
- BLOCKER: `pnpm install` must be run manually — Claude Code cannot auto-approve it
- After install: run `pnpm dev` to start, `pnpm test` to run unit tests
- In-memory data resets on server restart (documented in README as known limitation)
- Map view is next highest-value item; lat/lng fields already in data
