# UNIQUE — Digital Card Platform

> **The premium digital business card platform.** Create, share, and print professional digital business cards that work with NFC, QR codes, and direct links.

---

## What This Project Is

UNIQUE is a full-stack SaaS platform built with **Next.js 14 App Router**, **Supabase**, and **TypeScript**. It lets professionals create stunning digital business cards, share them via NFC tap, QR code, or link, track every interaction with analytics, and order premium printed physical cards — all from one dashboard.

Think of it as the professional alternative to a paper business card — but smarter, trackable, and always up to date.

---

## What Makes It Different

| Feature | UNIQUE | Paper cards | Linktree-style |
|---|---|---|---|
| NFC tap sharing | ✅ | ❌ | ❌ |
| QR code per card | ✅ | ❌ | ✅ |
| Analytics per card | ✅ | ❌ | Limited |
| Physical card printing | ✅ | ✅ | ❌ |
| Lead capture form | ✅ | ❌ | ❌ |
| vCard download (Save Contact) | ✅ | ❌ | ❌ |
| 8 premium templates | ✅ | Limited | ❌ |
| Dark/Light mode | ✅ | — | Partial |
| Real-time live preview | ✅ | ❌ | ❌ |

---

## Full User Journey — Entry to End

### 1. Landing Page (`/`)

The first thing a visitor sees is the landing page. It features:

- **Animated hero section** with a live phone mockup showing a sample card for Abel Smith
- **Feature grid** listing all 9 capabilities: digital cards, QR codes, NFC, contact sharing, analytics, printing, public profile, multiple templates, team management
- **How it works** — 4 illustrated steps (Create → Customize → Share → Track)
- **Template showcase** — 8 visual card previews
- **CTA section** with social proof ("50K+ users")

No authentication is required to view the landing page.

---

### 2. Registration (`/register`)

When a new user clicks "Get started free":

**What happens on the frontend:**
- They fill in full name, work email, and password (min 8 chars, 1 uppercase, 1 number)
- Form validation runs client-side via `react-hook-form` + `zod` before any network call
- On submit, `supabase.auth.signUp()` is called with `emailRedirectTo` pointing to `/verify-email`

**What happens in Supabase:**
- Supabase Auth creates a new row in `auth.users` (its internal table)
- A database trigger `on_auth_user_created` fires automatically:
  ```sql
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function handle_new_user();
  ```
- The `handle_new_user()` function inserts a matching row into the public `profiles` table:
  ```sql
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  ```
- This links the Supabase Auth identity to the app's profile data via the same UUID
- Supabase sends a verification email to the user's address

**After signup:**
User is redirected to `/verify-email` with instructions to check their inbox.

---

### 3. Email Verification (`/verify-email`)

- User clicks the link in the email
- Supabase validates the token and marks the user as confirmed in `auth.users`
- The redirect lands back at the app, where the session is automatically established via the `@supabase/ssr` middleware

---

### 4. Login (`/login`)

**What happens:**
- `supabase.auth.signInWithPassword({ email, password })` is called
- Supabase validates credentials against `auth.users`
- On success, Supabase issues a JWT session stored in an HTTP-only cookie
- The middleware (`middleware.ts`) reads this cookie on every request using `createServerClient` from `@supabase/ssr` to keep the session alive and refresh it when needed
- User is redirected to `/dashboard`

**Middleware session handling:**
```
Every page request → middleware reads Supabase session cookie
  → If authenticated + on auth page → redirect to /dashboard
  → If unauthenticated + on protected page → redirect to /login
  → Otherwise → pass through
```

---

### 5. Dashboard (`/dashboard`)

After login, the user lands on their personal dashboard. This is a **Server Component** that:

1. Calls `supabase.auth.getUser()` on the server — no client-side flash
2. Queries `profiles` for display name and avatar
3. Queries `business_cards` for the user's cards (filtered by `user_id`)
4. Runs 3 parallel `COUNT` queries on `analytics_events` for views, downloads, and clicks
5. Renders stat cards (Total Views, Cards, Contacts Saved, Link Clicks)
6. Shows a recent cards list and a Quick Actions panel

If the user has no username set yet, a banner prompts them to go to Settings to set their public URL.

---

### 6. My Cards (`/cards`)

A fully interactive client-side page that:

- Fetches all the user's cards via the `useCards` hook (which calls `supabase.from('business_cards').select('*, social_links(*)')`)
- Displays them in a **visual card grid** — each card shows its template gradient, avatar, name, company, and Live/Draft status
- Supports **grid and list views**
- Allows **searching** by name, company, or slug
- Allows **filtering** by All / Active / Inactive

**Per-card actions:**
- **Edit** — opens the full card editor
- **Duplicate** — creates a copy with a new slug
- **Copy link** — writes `https://yourdomain.com/username/slug` to clipboard
- **View live** — opens the public card page in a new tab
- **Download QR** — hits `/api/qr?slug=X&username=Y` which generates a PNG and also records a `qr_codes` row in Supabase
- **Toggle active/inactive** — updates `is_active` on the card row
- **Delete** — shows a confirmation dialog, then deletes the card (cascades to social_links, analytics_events, leads, qr_codes via foreign key constraints)

---

### 7. Create / Edit Card (`/cards/create`, `/cards/[id]/edit`)

The card editor uses a 3-tab layout:

**Tab 1 — Identity:**
- Full name (maps to `title` column)
- Company, phone, email, website, address, bio
- Profile photo upload and company logo upload
- Card URL slug (auto-generated from name, manually editable, checked for uniqueness against the DB in real-time)
- Active toggle (edit only)

**Tab 2 — Social & Links:**
- Add/remove/reorder social links (LinkedIn, GitHub, Instagram, X, Facebook, Telegram, TikTok, YouTube)
- Stored in the `social_links` table with `card_id` foreign key and `display_order`

**Tab 3 — Appearance:**
- 8 template picker with visual preview swatches
- Accent color picker (hex color stored in `theme_color`)

**Right panel — Live phone mockup:**
- Updates in real time as you type (no debounce needed — it reads from `form.watch()`)
- QR code toggle — switches the phone screen to show a live QR code of the card's URL generated client-side using the `qrcode` library
- Auto-saved indicator (shows after 3 seconds of inactivity on edit pages)

**Photo/Logo upload flow:**
1. User selects a file
2. `browser-image-compression` compresses it client-side (max 1MB, 1200px)
3. `POST /api/upload` is called with a `FormData` body
4. The API route verifies the user's session via `createServerSupabaseClient`
5. It then uses a **service role Supabase client** (bypasses RLS) to upload to the `card-media` bucket at path `{userId}/{folder}/{timestamp}.{ext}`
6. Returns the public URL
7. The URL is stored in `photo_url` or `logo_url` on the card row

**On save (create):**
1. `createCard()` inserts into `business_cards` with `user_id = auth.uid()`
2. `upsertSocialLinks()` deletes all existing links for the card, then batch-inserts the new ones
3. `updateCard()` adds the photo/logo URLs

**On save (edit):**
Same as above but uses `update` instead of `insert`.

---

### 8. Public Card Page (`/[username]/[slug]`)

This is the NFC tap destination — what someone sees when they tap your card or scan your QR code.

**What happens on load:**
1. Next.js Server Component queries Supabase for the profile matching `username`
2. Then queries `business_cards` joined with `social_links` for the matching slug + user_id + `is_active = true`
3. If not found → `notFound()` → 404 page
4. Renders `CardTemplateRenderer` which picks the right template component (Minimal, Modern, Corporate, Creative, Executive, Dark, Gradient, or Startup)
5. After hydration, the `CardPublicView` client component fires a `card_view` analytics event:
   ```
   POST /api/analytics → inserts into analytics_events { card_id, event_type: 'card_view', device_type }
   ```

**What the visitor can do:**
- **Save Contact** → triggers `contact_download` analytics event → downloads a `.vcf` vCard file from `/api/vcard`
- **Share** → triggers `share_click` → uses Web Share API or copies the link to clipboard
- **Click phone** → triggers `phone_click` analytics event → opens `tel:` link
- **Click email** → triggers `email_click` → opens `mailto:` link
- **Click website** → triggers `website_click` → opens the URL
- **Click social link** → triggers `link_click` with `link_platform` (e.g. "linkedin") analytics event
- **Leave your details form** → submits name/email/phone/message to the `leads` table

**OpenGraph/Twitter meta tags** are generated server-side via `generateMetadata()` so the card URL shows a rich preview when shared on WhatsApp, LinkedIn, etc.

---

### 9. Profile Page (`/[username]`)

Lists all active cards for a user — their public "profile". Visitors can:
- See the user's avatar and display name
- Click any card to go to its individual card page

---

### 10. Analytics (`/analytics`)

Fetches `analytics_events` for the user's cards and computes:

- Total views, contact downloads, link clicks, QR scans, shares
- Views over time (line chart via Recharts)
- Event breakdown by type (bar chart)
- Top platforms clicked (LinkedIn, GitHub, etc.)

Supports:
- **Card selector** — view analytics for one card or all cards combined
- **Date range** — 7 days, 30 days, 90 days

---

### 11. Print Cards (`/print`)

Lets users preview and export physical business card designs:

- Select which digital card to use as source
- Choose from 6 print templates (Modern Corporate, Luxury Gold, Minimalist, Premium Dark, Elegant White, Tech Startup)
- **3D flip animation** — click the card to flip between front and back
- Front shows: logo, name, company, email, phone — styled with the print template
- Back shows: live QR code (generated via `qrcode` library), card URL
- Export as PDF via `/api/pdf` (rendered server-side with `@react-pdf/renderer`)
- Export QR as PNG via `/api/qr`

---

### 12. Settings (`/settings`)

- Update display name and username
- Username availability checked in real-time against the `profiles` table
- Upload avatar (to `avatars` Supabase Storage bucket, same upload flow as card photos)
- Change password via `supabase.auth.updateUser({ password })`
- **Danger zone** — delete account (requires typing "DELETE" to confirm)

---

### 13. API Routes

All API routes live in `app/api/`:

| Route | Method | What it does |
|---|---|---|
| `/api/health` | GET | Returns `{ status: "ok", timestamp }` — uptime check |
| `/api/upload` | POST | Receives image file, verifies auth, uploads via service role to Supabase Storage, returns public URL |
| `/api/vcard` | GET | Fetches card from DB, generates RFC 6350 `.vcf` file, returns as download attachment |
| `/api/qr` | GET | Generates QR code PNG via `qrcode` library, records row in `qr_codes` table, returns image |
| `/api/pdf` | GET | Renders card as PDF using `@react-pdf/renderer`, returns as download attachment |
| `/api/analytics` | POST | Receives analytics event from public card page, inserts into `analytics_events` |

---

## Database Schema (Supabase)

### Tables

```
auth.users (Supabase managed)
  └── profiles (1:1, linked by UUID)
        └── business_cards (many per user)
              ├── social_links (many per card)
              ├── analytics_events (many per card)
              ├── leads (many per card)
              └── qr_codes (many per card)
```

### Row Level Security (RLS)

Every table has RLS enabled. Key policies:

- `profiles` — anyone can read (for public profile pages), only owner can update
- `business_cards` — owner has full access; public can only read `is_active = true` cards
- `social_links` — owner can manage; public can read links of active cards
- `analytics_events` — anyone can insert (anonymous visitors record views); only owner can read
- `leads` — anyone can insert (visitors leave their details); only card owner can read
- `qr_codes` — anyone can insert; only owner can read

### Storage Buckets

| Bucket | Visibility | Purpose |
|---|---|---|
| `avatars` | Public | User profile photos |
| `card-media` | Public | Card profile photos and company logos |

Files are uploaded at path `{userId}/{folder}/{timestamp}.{ext}` so ownership is clear and RLS-compatible.

### Triggers

**`on_auth_user_created`** — fires after a new user signs up in `auth.users`, auto-creates their `profiles` row.

**`update_profiles_updated_at`** and **`update_cards_updated_at`** — automatically stamp `updated_at` on every update.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Database + Auth + Storage | Supabase (PostgreSQL + Auth + Storage) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui built on @base-ui/react |
| Forms | react-hook-form + zod |
| Animations | Framer Motion |
| Charts | Recharts |
| Notifications | Sonner |
| State | Zustand |
| PDF generation | @react-pdf/renderer |
| QR generation | qrcode |
| vCard generation | Custom (RFC 6350 compliant) |
| Image compression | browser-image-compression |
| Theme | next-themes (dark/light mode) |
| Deployment | Vercel |

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=       # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Public anon key (safe to expose)
SUPABASE_SERVICE_ROLE_KEY=      # Secret service role key (server-only, bypasses RLS)
NEXT_PUBLIC_APP_URL=            # e.g. http://localhost:3000 or https://yourdomain.com
```

---

## Running Locally

```bash
# Install dependencies
cd apps/web
pnpm install

# Start development server
pnpm dev
# → http://localhost:3000
```

Set up Supabase:
1. Run `packages/database/schema.sql` in the Supabase SQL Editor
2. Run `packages/database/rls.sql` in the Supabase SQL Editor
3. Run `packages/database/fix_trigger.sql` in the Supabase SQL Editor
4. Create two storage buckets: `avatars` and `card-media` (both public)
5. Add your credentials to `apps/web/.env.local`

---

*Built with ❤️ — UNIQUE Digital Card Platform*
