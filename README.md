# Lateral Travel

A small Booking.com-style product for curated remote-work stays, built with
Next.js (App Router), TypeScript, Tailwind and an MSW-backed mock API.

> Full architecture notes, tradeoffs and API documentation land with
> Phase 15 of [docs/PLAN.md](docs/PLAN.md).

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The mock backend (MSW
service worker) starts automatically and serves every `/api/*` route — no
separate server or database is needed.

## Scripts

| Script            | What it does                          |
| ----------------- | ------------------------------------- |
| `pnpm dev`        | Start the dev server                  |
| `pnpm lint`       | Lint with oxlint                      |
| `pnpm test`       | Run the Vitest suite                  |
| `pnpm test:watch` | Run tests in watch mode               |
| `pnpm build`      | Production build                      |
| `pnpm start`      | Serve the production build            |

## CI

Every push to `main`/`develop` and every pull request runs
[.github/workflows/ci.yml](.github/workflows/ci.yml): install, lint, test,
build. The same gate can be run locally:

```bash
pnpm lint && pnpm test && pnpm build
```

## Release Flow

Releases are fully automated with
[semantic-release](https://github.com/semantic-release/semantic-release):

1. Write [Conventional Commits](https://www.conventionalcommits.org)
   (`feat:` → minor, `fix:` → patch, `feat!:` or a `BREAKING CHANGE:` footer
   → major; `chore:`, `docs:`, `test:` etc. release nothing).
2. Merge to `main`. Once the `verify` CI job is green, the `release` job runs
   `semantic-release`, which:
   - determines the next version from the commits since the last release;
   - tags the commit and creates a GitHub release with generated notes;
   - prepends the notes to [CHANGELOG.md](CHANGELOG.md) and bumps
     `package.json`, committed back as `chore(release): x.y.z [skip ci]`.

No manual tagging or changelog editing — if nothing releasable was merged,
no release happens. Configuration lives in [.releaserc.json](.releaserc.json).

## Deployment

The app deploys as a standard Next.js project (e.g. Vercel with the Next.js
preset — no extra configuration needed). Two things to know:

- **The mock API ships to production on purpose.** MSW is the backend for
  this assessment, so the service worker also runs in production builds.
  When a real backend takes over the `/api/*` routes, build with
  `NEXT_PUBLIC_API_MOCKING=disabled` to turn the worker off.
- **Data is per-browser and in-memory.** Seeded stays reset on every page
  load; bookings and favorites live only in the current session. This is a
  deliberate assessment tradeoff, not a bug.

To verify the production build locally:

```bash
pnpm build && pnpm start
```
