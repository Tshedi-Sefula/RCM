# RCM Toitskraal website

Next.js (App Router) + Tailwind CSS v4 + Supabase.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design system

- **Tokens** live in `app/globals.css` (`@theme`). Use them as Tailwind utilities:
  `bg-brand-primary`, `bg-brand-accent`, `bg-brand-surface`, `bg-brand-cream`,
  `text-brand-ink`, `text-brand-muted`, `text-brand-accent-strong`, `border-brand-line`,
  `text-success` / `text-error` (+ `-soft` backgrounds). The comment block there
  explains which combinations pass WCAG AA — notably, don't use `brand-accent`
  gold as text on light backgrounds; use `brand-accent-strong`.
- **Fonts**: Fraunces (display, `font-display`) + Inter (body, `font-sans`), loaded via `next/font/google` in `app/layout.tsx`.
- **Primitives** in `components/ui/` (import from `@/components/ui`):
  `Button` (primary / secondary / ghost; sm / md / lg; `tone="inverse"` on dark backgrounds; renders a link when given `href`),
  `Container`, `Section` (tone: surface / white / cream / primary), `Heading` + `Eyebrow`,
  `Card` (`interactive` for hover lift), `Hero`, and `Reveal` (scroll fade-in via `lib/hooks/useInView.ts`; disabled for `prefers-reduced-motion`).

## Supabase setup

### 1. Environment variables

Set these in `.env.local` (and in your hosting provider for production). Values are in
Supabase Dashboard → **Project Settings → API**.

| Variable | Where it's used |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server clients (RLS-limited) |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts` only — server-side, bypasses RLS, keep secret |

### 2. Apply the migrations

Migrations are in `supabase/migrations/` and must run in filename order:

1. `20261030000000_init_schema.sql` — `profiles`, `events`, `calendar_entries`, `gallery_images`, `stream_videos`, RLS policies, `is_admin()` helper.
2. `20261030000100_storage.sql` — `event-posters` and `gallery` buckets and their policies.

**Option A — SQL editor (no tooling):** Dashboard → **SQL Editor** → New query → paste the
contents of each file → Run. Do them in order.

**Option B — Supabase CLI:**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Both migrations are safe to re-run.

### 3. Storage buckets

Running `20261030000100_storage.sql` creates both buckets (public, 10 MB limit, JPEG/PNG/WebP/AVIF only)
and their policies — nothing else to do.

If you'd rather use the dashboard: **Storage → New bucket** → name `event-posters`, tick
**Public bucket** → Create. Repeat for `gallery`. Then run only the `create policy` statements
from the storage migration so uploads are restricted to admins.

### 4. Access rules & making an admin

- Everyone (signed in or not) can **read** all four content tables and both buckets.
- Only signed-in users with `profiles.is_admin = true` can **insert / update / delete**.
- A `profiles` row is created automatically when a user signs up.

To make someone an admin: create the user under **Authentication → Users → Add user**, then in the SQL editor run:

```sql
update public.profiles set is_admin = true
where id = (select id from auth.users where email = 'admin@example.com');
```

Recommended: turn off public sign-ups (**Authentication → Sign In / Providers → Allow new users to sign up**) so only invited admins have accounts.

### Code

- `lib/supabase/client.ts` — browser client (Client Components).
- `lib/supabase/server.ts` — cookie-based server client (Server Components, Server Actions, Route Handlers).
- `lib/supabase/admin.ts` — service-role client (server only).
- `lib/auth.ts` — admin Data Access Layer: `requireAdmin()` verifies the session and `profiles.is_admin`. Call it in every admin page and Server Action.
- `proxy.ts` (Next.js 16's name for `middleware.ts`) — runs on `/admin/*` only; refreshes the session and redirects signed-out visitors to `/admin/login`.
- `lib/types/database.ts` — row types (`ChurchEvent`, `CalendarEntry`, `GalleryImage`, `StreamVideo`, `Profile`) and the `Database` type all clients are typed with.
