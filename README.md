# MEKAN 76 KAFE NARGILE

A premium, cinematic website for a luxury Turkish kafe and nargile lounge — with a real
menu, reservations, online ordering and an owner dashboard.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS** and **PostgreSQL**
(accessed with `pg` — no ORM).

---

## Design system

| Token | Value | Usage |
| --- | --- | --- |
| `ink` | `#240407` | Primary background |
| `wine` | `#35080D` | Card / section surfaces |
| `gold` | `#F9B923` | CTAs, accents, hairlines |
| `cream` | `#F5F0EA` | Primary text |
| `beige` | `#C7B8B5` | Secondary text |

- Display type: **Cormorant Garamond** (light / italic). UI type: **Montserrat**.
- Hairline gold borders, 24px image radius, arch-cropped hero imagery, gold radial glows.
- Scroll-reveal sections, magnetic CTAs, ken-burns hero parallax, reduced-motion support.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero, menu preview, about, amenities, gallery, reservation form |
| `/menu` | Full menu with category filters, search and add-to-order |
| `/reservations` | Reservation form with live seat availability and confirmation card |
| `/about`, `/amenities`, `/gallery`, `/contact` | Content pages |
| `/login`, `/signup`, `/account` | Guest accounts and reservation history |
| `/admin` | Owner dashboard (role-protected) |

## Owner dashboard

Sign in at `/login` with the seeded owner account:

```
email:    admin@mekan76.com
password: Mekan76!2026
```

> Demo credentials for local development. Change the password (or the
> `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` environment variables) before going live.

Tabs: **Overview** (KPIs, reservation density, menu popularity, upcoming tables, recent
orders), **Reservations** (confirm / seat / cancel / delete), **Menu** (full CRUD, visibility
and featured flags), **Gallery** (CRUD + visibility), **Orders** (status + delete),
**Customers** (role management), **Content** (every headline, paragraph, contact detail and
social link shown on the site).

## Menu content

All dishes, prices and contact details are **sample demo content** and clearly labelled as
such on the site. Replace them from the dashboard (`/admin` → Menu / Content).

## Local development (Docker)

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

The `web` service installs dependencies, creates the schema, seeds demo content and starts
`next dev` with hot reload on <http://localhost:3000>. Postgres data lives in the `db_data`
volume; dependencies in the `node_modules` volume.

Useful commands:

```bash
docker compose -f docker-compose.base44.yml logs -f web
docker compose -f docker-compose.base44.yml exec web npm run db:setup   # idempotent schema + seed
docker compose -f docker-compose.base44.yml exec web npx tsc --noEmit    # type check
```

### Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (set in compose for local dev) |
| `AUTH_SECRET` | Signing key for the session cookie (delivered via `/run/base44/app.env`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Optional overrides for the seeded owner account |

## Project structure

```
db/schema.sql              PostgreSQL schema (idempotent)
scripts/db-setup.mjs       Applies the schema and seeds demo content
src/app/(site)/            Public site (shared navbar, footer, cart)
src/app/admin/             Owner dashboard
src/app/api/               Auth, reservations, availability, orders, newsletter, admin CRUD
src/components/            UI components (hero, menu, gallery, cart, admin tabs)
src/lib/                   DB access, auth, content, formatting, types
```
