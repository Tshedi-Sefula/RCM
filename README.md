# RCM Toitskraal website

The website for Restoration Center Ministries Toitskraal, with an admin dashboard for
managing events, the church calendar, gallery photos and stream videos, and an inbox for
messages and prayer requests from the contact form.

Next.js 16 (App Router) + Tailwind CSS v4 + Supabase (Postgres, Auth, Storage).

- **Public pages:** Home (with the latest stream), Beliefs, Events, Calendar, Gallery, Contact.
- **Admin:** `/admin` — sign in to add, edit and delete content. Changes show on the public site immediately.
  Contact form messages arrive under **Messages**; the dashboard shows how many are unread.

## Local setup

Requirements: Node.js 20.9 or newer, npm, and a free [Supabase](https://supabase.com) project.

### 1. Install

```bash
npm install
cp .env.local.example .env.local
```

### 2. Environment variables

Fill in `.env.local`. The Supabase values are in Supabase Dashboard → **Project Settings → API**.

| Variable | Required | Where it's used |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Browser + server clients. Also used to allow Supabase images in `next/image`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Browser + server clients (limited by Row Level Security). |
| `NEXT_PUBLIC_SITE_URL` | No | Public address for canonical URLs, Open Graph tags, `robots.txt` and `sitemap.xml`. On Vercel it defaults to the production domain; set it when you add a custom domain. |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Only `lib/supabase/admin.ts`, for trusted scripts. The app doesn't use it. Bypasses RLS — never commit it or prefix it with `NEXT_PUBLIC_`. |

`.env.local` is git-ignored. Only `.env.local.example` (placeholders) is committed.

Without Supabase keys the site still runs: pages show friendly "couldn't load" messages and the
calendar shows sample dates.

### 3. Apply the database migrations

Migrations are in `supabase/migrations/` and must run in filename order:

1. `20261030000000_init_schema.sql` — `profiles`, `events`, `calendar_entries`, `gallery_images`, `stream_videos`, RLS policies, `is_admin()` helper.
2. `20261030000100_storage.sql` — `event-posters` and `gallery` storage buckets (public, 10 MB limit, JPEG/PNG/WebP/AVIF) and their policies.
3. `20261030000200_contact_messages.sql` — `contact_messages` for the contact form: anyone can submit, only admins can read.

**Option A — SQL editor (no tooling):** Dashboard → **SQL Editor** → New query → paste the
contents of each file → Run. Do them in order.

**Option B — Supabase CLI:**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

All migrations are safe to re-run.

### 4. Create an admin user

See [Admin login](#admin-login) below.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), and [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

Other scripts: `npm run build` (production build), `npm run start` (serve the build), `npm run lint`.

## Admin login

Admins are ordinary Supabase Auth users with `profiles.is_admin = true`. There is no public sign-up page.

1. Supabase Dashboard → **Authentication → Users → Add user → Create new user**. Enter the email
   and a strong password, and tick **Auto Confirm User**.
2. In **SQL Editor**, mark them as an admin:

   ```sql
   update public.profiles set is_admin = true
   where id = (select id from auth.users where email = 'admin@example.com');
   ```

3. Go to `/admin` (e.g. `https://your-site.vercel.app/admin`) and sign in with that email and password.

Signed-in users who aren't admins are refused. Use **Log out** in the dashboard when you're done.

Recommended: turn off public sign-ups (**Authentication → Sign In / Providers → Allow new users to sign up**)
so only accounts you create can exist. To reset a password, use **Authentication → Users → ⋯ → Send password recovery**
or set a new one from the same menu.

### Access rules

- Everyone (signed in or not) can **read** the four content tables and both buckets.
- Only signed-in users with `profiles.is_admin = true` can **insert / update / delete**.
- A `profiles` row is created automatically when a user is added.
- `contact_messages` is the exception: anyone can **insert** a message, but only admins can **read**, update
  or delete them, so prayer requests stay private.

## Deploying to Vercel

The Next.js app is at the root of the repository, so Vercel needs no special root directory.

1. **Push the code to GitHub** (this repo: `Tshedi-Sefula/RCM`). Vercel deploys the production
   branch (usually `main`) and creates preview deployments for other branches.
2. **Import the project:** [vercel.com/new](https://vercel.com/new) → **Import Git Repository** →
   pick the repo. If it isn't listed, use **Adjust GitHub App Permissions** to grant access.
3. **Configure:**
   - Framework Preset: **Next.js** (detected automatically)
   - Root Directory: `./`
   - Build Command: `npm run build` (default) · Output Directory: default · Install Command: default
4. **Environment variables** (Production, Preview and Development):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` — only once you have a custom domain

   `NEXT_PUBLIC_*` values are baked in at build time, so **redeploy after changing them**
   (Deployments → ⋯ → Redeploy).
5. **Deploy.** When it finishes, open the URL Vercel gives you.
6. **Point Supabase Auth at the live site:** Supabase → **Authentication → URL Configuration** →
   set **Site URL** to your production URL and add it under **Redirect URLs**
   (e.g. `https://your-site.vercel.app/**`). Sign-in is email + password, so this mainly affects
   password-recovery emails.
7. **Check the live site:** every public page loads, `/admin` signs in, `/robots.txt` and
   `/sitemap.xml` show the production URL.

**Custom domain:** Vercel project → **Settings → Domains** → add it and follow the DNS
instructions, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy.

## Project notes

### Design system

- **Tokens** live in `app/globals.css` (`@theme`). Use them as Tailwind utilities:
  `bg-brand-primary` (deep blue), `bg-brand-accent` (warm gold), `bg-brand-surface`, `bg-brand-cream`,
  `text-brand-ink`, `text-brand-muted`, `text-brand-accent-strong`, `border-brand-line`,
  `text-success` / `text-error` (+ `-soft` backgrounds). The comment block there
  explains which combinations pass WCAG AA — notably, don't use `brand-accent`
  gold as text on light backgrounds; use `brand-accent-strong`.
- **Fonts**: Fraunces (display, `font-display`) + Inter (body, `font-sans`), loaded via `next/font/google` in `app/layout.tsx`.
- **Primitives** in `components/ui/` (import from `@/components/ui`):
  `Button` (primary / secondary / ghost; sm / md / lg; `tone="inverse"` on dark backgrounds; renders a link when given `href`),
  `Container`, `Section` (tone: surface / white / cream / primary), `Heading` + `Eyebrow`,
  `Card` (`interactive` for hover lift), `Hero`, `Notice` (empty / error states), and `Reveal`
  (scroll fade-in via `lib/hooks/useInView.ts`; disabled for `prefers-reduced-motion`).
- **Church details** (name, address, service times, Spotify link, intro video) are in `lib/site.ts`.

### Loading and errors

Data-fetching sections stream in behind `<Suspense>` skeletons. Failed Supabase queries return
`{ error }` instead of throwing, so pages show a `Notice` rather than breaking. Unexpected render
errors are caught by `app/(site)/error.tsx`, `app/admin/error.tsx` and `app/global-error.tsx`;
unknown URLs show `app/not-found.tsx`.

### Caching

Public queries (`lib/data/public.ts`) use `"use cache"` with cache tags, so public pages are
served from the static shell. Admin Server Actions call `updateTag()` after every change, so
edits appear on the site straight away. Admin queries (`lib/data/admin.ts`) are never cached.

### SEO

Each page exports `metadata` (title + description + canonical URL). The home page adds Open Graph
and Twitter card tags using `public/images/hero.jpg`. `app/robots.ts` and `app/sitemap.ts`
generate `/robots.txt` and `/sitemap.xml`; `/admin` is disallowed and marked `noindex`.

### Code

- `lib/supabase/client.ts` — browser client (Client Components).
- `lib/supabase/server.ts` — cookie-based server client (Server Components, Server Actions, Route Handlers).
- `lib/supabase/admin.ts` — service-role client (server only, unused by the app).
- `lib/auth.ts` — admin Data Access Layer: `requireAdmin()` verifies the session and `profiles.is_admin`. Call it in every admin page and Server Action.
- `proxy.ts` (Next.js 16's name for `middleware.ts`) — runs on `/admin/*` only; refreshes the session and redirects signed-out visitors to `/admin/login`.
- `lib/types/database.ts` — row types (`ChurchEvent`, `CalendarEntry`, `GalleryImage`, `StreamVideo`, `Profile`) and the `Database` type all clients are typed with.
