# AGENTS.md — MEKAN 76 KAFE NARGILE

Non-obvious notes for anyone (human or agent) working in this repository.

## Running the app

- Everything runs through `docker-compose.base44.yml`: `db` (postgres:16-alpine) and `web`
  (`node:22-bookworm-slim`, source bind-mounted, `npm install` + `scripts/db-setup.mjs` +
  `next dev` on start). Never run language runtimes on the sandbox host.
- The startup command is idempotent: dependencies sync from `package.json`, the schema is
  `CREATE TABLE IF NOT EXISTS`, and seeds only insert when a table is empty.
- There is no test runner configured. Verification is done by exercising the app:
  `curl -s localhost:3000 | head`, then the real flows (menu → add to order → place order,
  reservation form → confirmation, `/login` → `/admin` tabs).
- Type checking: `docker compose -f docker-compose.base44.yml exec web npx tsc --noEmit`.

## Gotchas

- **Tailwind opacity steps.** The design uses hairline borders such as `border-cream/12`.
  Tailwind v3 only accepts opacity values present in `theme.opacity`; `tailwind.config.ts`
  extends the scale with 8/12/15/18/22/35/45/55/65/85/92/98. A new `/NN` value not in that
  list silently produces no CSS (and throws inside `@apply`). Restart `web` after editing the
  Tailwind config — it is not hot-reloaded.
- **`src/app/(site)` is a route group.** The navbar, footer, cart drawer and cart button live
  in `(site)/layout.tsx`; `/admin`, `/login` and `/signup` are outside it and render without
  them. `CartProvider` sits in the root layout, so `CartDrawer` resets its open state on
  mount — otherwise the drawer reappears after returning from `/admin`.
- **Auth.** Sessions are a `jose` HS256 JWT in the `mkn_session` httpOnly cookie. `AUTH_SECRET`
  comes from `/run/base44/app.env` (generated for development); a fallback string keeps the
  app booting. `requireAdmin()` re-reads the user row on every request, so role changes take
  effect immediately.
- **Admin CRUD** is table-driven: `src/lib/adminResources.ts` whitelists table, columns and
  ordering for `/api/admin/[resource]`. Add a resource there before adding UI for it.
- **Prices** are `NUMERIC` and arrive from `pg` as strings — always pass through
  `formatPrice()` before rendering.
- **Images** are remote Unsplash URLs (plain `<img>`, `loading="lazy"`). `next.config.mjs`
  also allows `images.unsplash.com` if `next/image` is adopted later.
- **Preview/dev origin.** `allowedDevOrigins` only adds `3000-<BASE44_PUBLIC_HOST_SUFFIX>`
  when `BASE44_PREVIEW_MODE === '1'`; shared behaviour is unchanged outside the sandbox.
- Cross-route-group client navigation (e.g. `/admin` → `/reservations`) can take several
  seconds on the first compile in dev; it is a compile cost, not a routing bug.
