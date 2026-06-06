# Digital Business Card Platform — Agent Setup Instructions

## Read This First

You are an autonomous agent setting up a production-ready Next.js monorepo project.
Follow every section in order. Do not skip steps. Do not install anything not listed here.
Do not create components, pages, or implementation code unless a section explicitly says to.
Confirm the working directory before every command block.

---

## Project Overview

| Property | Value |
|---|---|
| Project Name | digital-identity-platform |
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Package Manager | pnpm |
| Structure | Monorepo |
| Next.js App Location | `apps/web/` |
| Deployment Target | Vercel |

---

## Monorepo Structure (Already Created — Do Not Recreate)

```
digital-identity-platform/
├── apps/
│   └── web/                          # Next.js app — all installs happen here
├── packages/
│   ├── database/
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   ├── rls.sql
│   │   ├── types.ts
│   │   └── migrations/
│   ├── shared/
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   ├── card.ts
│   │   │   └── analytics.ts
│   │   ├── constants/
│   │   │   ├── platforms.ts
│   │   │   └── limits.ts
│   │   └── utils/
│   │       └── formatters.ts
│   └── ui/
├── services/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── queries.ts
│   ├── storage/
│   │   ├── uploadImage.ts
│   │   └── deleteImage.ts
│   └── analytics/
│       └── trackEvent.ts
├── docs/
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## Section 1 — Root Configuration Files

### 1.1 Verify `pnpm-workspace.yaml` exists at root

If it does not exist, create it:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "services/*"
```

### 1.2 Verify root `package.json` exists

If it does not exist, create it:

```json
{
  "name": "digital-identity-platform",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "lint": "pnpm --filter web lint"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### 1.3 Verify `tsconfig.base.json` exists at root

If it does not exist, create it:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "exclude": ["node_modules"]
}
```

---

## Section 2 — Environment Variables

### 2.1 Create `.env.example` at root (safe to commit — no real values)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=

# Cloudinary (optional — only if switching from Supabase Storage later)
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
```

### 2.2 Create `apps/web/.env.local` (never committed — already in .gitignore)

```bash
# Supabase — get these from supabase.com → your project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL — use localhost for development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Section 3 — Install All Dependencies

**Working directory for ALL commands in this section: `apps/web`**

```bash
cd apps/web
```

Confirm you are in `apps/web` before running anything below.

---

### 3.1 Supabase

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

| Package | Why |
|---|---|
| `@supabase/supabase-js` | Core Supabase client — database queries, auth, storage |
| `@supabase/ssr` | SSR-safe Supabase client for Next.js App Router server components and middleware |

---

### 3.2 Forms and Validation

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

| Package | Why |
|---|---|
| `react-hook-form` | Performant form state management with minimal re-renders |
| `zod` | TypeScript-first schema validation — used for forms and API route input validation |
| `@hookform/resolvers` | Connects zod schemas directly to react-hook-form |

---

### 3.3 UI Utilities

```bash
pnpm add clsx tailwind-merge class-variance-authority
```

| Package | Why |
|---|---|
| `clsx` | Conditionally joins class names |
| `tailwind-merge` | Merges conflicting Tailwind classes correctly — required by shadcn/ui |
| `class-variance-authority` | Builds typed component variants — required by shadcn/ui |

---

### 3.4 Icons

```bash
pnpm add lucide-react
```

| Package | Why |
|---|---|
| `lucide-react` | The default icon library used by shadcn/ui — consistent, tree-shakeable |

---

### 3.5 State Management

```bash
pnpm add zustand
```

| Package | Why |
|---|---|
| `zustand` | Lightweight global state — used for card editor state, UI state, user session caching |

---

### 3.6 Notifications

```bash
pnpm add sonner
```

| Package | Why |
|---|---|
| `sonner` | Toast notification library — the recommended toast solution for shadcn/ui projects |

---

### 3.7 QR Code Generation

```bash
pnpm add qrcode
pnpm add -D @types/qrcode
```

| Package | Why |
|---|---|
| `qrcode` | Generates QR codes as PNG or SVG from a URL — used in /api/qr/[slug] route |
| `@types/qrcode` | TypeScript types for qrcode |

---

### 3.8 Analytics Charts

```bash
pnpm add recharts
```

| Package | Why |
|---|---|
| `recharts` | React chart library built on D3 — used for the analytics dashboard (views, clicks, downloads over time) |

---

### 3.9 Date Utilities

```bash
pnpm add date-fns
```

| Package | Why |
|---|---|
| `date-fns` | Formats and manipulates dates — used in analytics dashboard for date ranges and event timestamps |

---

### 3.10 Animations

```bash
pnpm add framer-motion
```

| Package | Why |
|---|---|
| `framer-motion` | Declarative animations — used for card template transitions, dashboard entry animations, and modal animations |

---

### 3.11 vCard Generation

```bash
pnpm add vcard-creator
```

| Package | Why |
|---|---|
| `vcard-creator` | Generates RFC 6350 compliant .vcf files — used in /api/vcard/[slug] route for the Save Contact feature |

---

### 3.12 PDF Generation

```bash
pnpm add @react-pdf/renderer
```

| Package | Why |
|---|---|
| `@react-pdf/renderer` | Renders React components as PDFs server-side — used in /api/pdf/[slug] for the printable business card |

---

### 3.13 Slug Generation

```bash
pnpm add slugify
```

| Package | Why |
|---|---|
| `slugify` | Converts names to URL-safe slugs e.g. "John Doe" → "john-doe" — used when creating a new card |

---

### 3.14 Unique ID Generation

```bash
pnpm add nanoid
```

| Package | Why |
|---|---|
| `nanoid` | Generates short unique IDs — used for generating unique card slugs when a name collision occurs |

---

### 3.15 Image Upload Utilities

```bash
pnpm add browser-image-compression
```

| Package | Why |
|---|---|
| `browser-image-compression` | Compresses images client-side before uploading to Supabase Storage — reduces storage usage and load times |

---

### 3.16 Radix UI Primitives (shadcn/ui peer dependencies)

shadcn/ui components are built on Radix UI. Install the primitives for all components used in this project:

```bash
pnpm add \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-label \
  @radix-ui/react-select \
  @radix-ui/react-separator \
  @radix-ui/react-slot \
  @radix-ui/react-switch \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  @radix-ui/react-tooltip \
  @radix-ui/react-avatar \
  @radix-ui/react-progress \
  @radix-ui/react-alert-dialog
```

| Package | Why |
|---|---|
| `@radix-ui/react-dialog` | Modal dialogs — used for card delete confirmation, image crop |
| `@radix-ui/react-dropdown-menu` | Dropdown menus — used in dashboard navbar and card options |
| `@radix-ui/react-label` | Accessible form labels — used in all forms |
| `@radix-ui/react-select` | Select inputs — used for template selection and platform selection |
| `@radix-ui/react-separator` | Visual dividers — used in card layouts |
| `@radix-ui/react-slot` | Slot primitive — required by shadcn/ui Button component |
| `@radix-ui/react-switch` | Toggle switches — used for card active/inactive toggle |
| `@radix-ui/react-tabs` | Tab navigation — used in dashboard and analytics |
| `@radix-ui/react-toast` | Toast primitives — used by sonner |
| `@radix-ui/react-tooltip` | Tooltips — used on icon buttons in the card editor |
| `@radix-ui/react-avatar` | Avatar component — used in dashboard header and card preview |
| `@radix-ui/react-progress` | Progress bar — used during image upload |
| `@radix-ui/react-alert-dialog` | Confirmation dialogs — used for destructive actions like card deletion |

---

### 3.17 Development Dependencies

```bash
pnpm add -D \
  @types/node \
  @types/react \
  @types/react-dom \
  typescript \
  eslint \
  eslint-config-next \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  prettier \
  prettier-plugin-tailwindcss \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest \
  jest-environment-jsdom \
  @jest/types
```

| Package | Why |
|---|---|
| `@types/node` | TypeScript types for Node.js — required for Next.js API routes |
| `@types/react` | TypeScript types for React |
| `@types/react-dom` | TypeScript types for React DOM |
| `typescript` | TypeScript compiler |
| `eslint` | Linting |
| `eslint-config-next` | Next.js ESLint rules |
| `@typescript-eslint/eslint-plugin` | TypeScript-specific ESLint rules |
| `@typescript-eslint/parser` | Parses TypeScript for ESLint |
| `prettier` | Code formatting |
| `prettier-plugin-tailwindcss` | Auto-sorts Tailwind classes on save |
| `@testing-library/react` | Component testing utilities |
| `@testing-library/jest-dom` | Custom jest matchers for DOM assertions |
| `@testing-library/user-event` | Simulates user interactions in tests |
| `jest` | Test runner |
| `jest-environment-jsdom` | jsdom environment for jest — required for React component tests |
| `@jest/types` | TypeScript types for jest configuration |

---

## Section 4 — shadcn/ui Initialisation

**Working directory: `apps/web`**

Check if `components.json` already exists:

```bash
# If components.json exists — SKIP this step entirely
# If components.json does NOT exist — run the following:

npx shadcn@latest init
```

When prompted:
- Style → **Default**
- Base color → **Slate**
- CSS variables → **Yes**

### 4.1 Install shadcn/ui Components

```bash
npx shadcn@latest add \
  button \
  input \
  label \
  card \
  dialog \
  alert-dialog \
  tabs \
  toast \
  avatar \
  badge \
  separator \
  dropdown-menu \
  select \
  switch \
  tooltip \
  progress \
  skeleton \
  sheet \
  textarea \
  form
```

---

## Section 5 — Supabase Client Setup

**Working directory: `apps/web`**

Create the following files. Do not add implementation logic — only the client configuration.

### 5.1 `apps/web/lib/supabase/client.ts`

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 5.2 `apps/web/lib/supabase/server.ts`

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

### 5.3 `apps/web/middleware.ts`

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: object) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: object) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## Section 6 — Configuration Files

**Working directory: `apps/web`**

### 6.1 `apps/web/lib/utils.ts`

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 6.2 `apps/web/config/site.ts`

```ts
export const siteConfig = {
  name: 'Digital Identity Platform',
  description: 'Create and share your digital business card',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ogImage: '/og.png',
} as const

export type SiteConfig = typeof siteConfig
```

### 6.3 `apps/web/.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 6.4 `apps/web/jest.config.ts`

```ts
import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
}

export default config
```

### 6.5 `apps/web/jest.setup.ts`

```ts
import '@testing-library/jest-dom'
```

---

## Section 7 — Database Schema

Run the following SQL in your Supabase project → SQL Editor → New Query.
Run them in order: schema first, then RLS.

### 7.1 Schema (`packages/database/schema.sql`)

```sql
-- ─── Profiles (extends auth.users 1:1) ───────────────────────────────────────
create table if not exists profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  display_name varchar(100),
  avatar_url  text,
  role        text default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── Business Cards (many per user) ──────────────────────────────────────────
create table if not exists business_cards (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete cascade not null,
  slug        varchar(100) unique not null,
  template    text default 'minimal'
              check (template in ('minimal','modern','corporate','creative')),
  title       varchar(100),
  company     varchar(100),
  phone       varchar(30),
  email       varchar(255),
  website     varchar(255),
  address     text,
  bio         varchar(300),
  photo_url   text,
  logo_url    text,
  theme_color varchar(7) default '#1B4F8A',
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── Social Links ─────────────────────────────────────────────────────────────
create table if not exists social_links (
  id            uuid primary key default gen_random_uuid(),
  card_id       uuid references business_cards(id) on delete cascade not null,
  platform      varchar(50) not null,
  url           text not null,
  display_order integer default 0
);

-- ─── Analytics Events ─────────────────────────────────────────────────────────
create table if not exists analytics_events (
  id            uuid primary key default gen_random_uuid(),
  card_id       uuid references business_cards(id) on delete cascade not null,
  event_type    text check (event_type in (
                  'card_view', 'contact_download', 'link_click',
                  'qr_scan', 'share_click', 'email_click',
                  'phone_click', 'website_click'
                )),
  device_type   varchar(50),
  country       varchar(50),
  link_platform varchar(50),
  created_at    timestamptz default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists idx_business_cards_slug    on business_cards(slug);
create index if not exists idx_business_cards_user_id on business_cards(user_id);
create index if not exists idx_analytics_card_id      on analytics_events(card_id);
create index if not exists idx_analytics_created_at   on analytics_events(created_at);

-- ─── Auto-create profile on signup ───────────────────────────────────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

create trigger update_cards_updated_at
  before update on business_cards
  for each row execute procedure update_updated_at();
```

### 7.2 Row-Level Security (`packages/database/rls.sql`)

```sql
-- ─── Enable RLS on all tables ─────────────────────────────────────────────────
alter table profiles          enable row level security;
alter table business_cards    enable row level security;
alter table social_links      enable row level security;
alter table analytics_events  enable row level security;

-- ─── Profiles ────────────────────────────────────────────────────────────────
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ─── Business Cards ──────────────────────────────────────────────────────────
create policy "Owner full access to own cards"
  on business_cards for all
  using (auth.uid() = user_id);

create policy "Public can view active cards"
  on business_cards for select
  using (is_active = true);

-- ─── Social Links ────────────────────────────────────────────────────────────
create policy "Owner can manage social links"
  on social_links for all
  using (
    exists (
      select 1 from business_cards
      where id = social_links.card_id
      and user_id = auth.uid()
    )
  );

create policy "Public can view social links of active cards"
  on social_links for select
  using (
    exists (
      select 1 from business_cards
      where id = social_links.card_id
      and is_active = true
    )
  );

-- ─── Analytics Events ────────────────────────────────────────────────────────
create policy "Anyone can record analytics events"
  on analytics_events for insert
  with check (true);

create policy "Owner can view own card analytics"
  on analytics_events for select
  using (
    exists (
      select 1 from business_cards
      where id = analytics_events.card_id
      and user_id = auth.uid()
    )
  );
```

### 7.3 Seed Data (`packages/database/seed.sql`)

```sql
-- Run this only in development to create a test card
-- Replace 'your-user-uuid' with a real user id from auth.users after signing up

insert into business_cards (user_id, slug, template, title, company, phone, email, website, bio, is_active)
values (
  'your-user-uuid',
  'test-card',
  'modern',
  'Software Engineer',
  'Acme Corp',
  '+1234567890',
  'test@example.com',
  'https://example.com',
  'Building great products.',
  true
);
```

---

## Section 8 — Supabase Storage Setup

In your Supabase dashboard → Storage → create the following buckets:

| Bucket Name | Public | Purpose |
|---|---|---|
| `avatars` | Yes | User account profile pictures |
| `card-media` | Yes | Card profile photos and company logos |

For each bucket, set the following policy in Storage → Policies:

**Allow public read:**
```sql
create policy "Public read access"
  on storage.objects for select
  using (bucket_id in ('avatars', 'card-media'));
```

**Allow authenticated upload:**
```sql
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (
    bucket_id in ('avatars', 'card-media')
    and auth.role() = 'authenticated'
  );
```

**Allow owner delete:**
```sql
create policy "Owner can delete own files"
  on storage.objects for delete
  using (
    bucket_id in ('avatars', 'card-media')
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## Section 9 — Shared Type Definitions

Create these files. They are shared across the monorepo.

### 9.1 `packages/shared/types/card.ts`

```ts
export type CardTemplate = 'minimal' | 'modern' | 'corporate' | 'creative'

export type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'instagram'
  | 'x'
  | 'facebook'
  | 'telegram'
  | 'tiktok'
  | 'youtube'

export interface SocialLink {
  id: string
  card_id: string
  platform: SocialPlatform
  url: string
  display_order: number
}

export interface BusinessCard {
  id: string
  user_id: string
  slug: string
  template: CardTemplate
  title: string | null
  company: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  bio: string | null
  photo_url: string | null
  logo_url: string | null
  theme_color: string
  is_active: boolean
  created_at: string
  updated_at: string
  social_links?: SocialLink[]
}

export interface CreateCardInput {
  slug: string
  template: CardTemplate
  title?: string
  company?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  bio?: string
  theme_color?: string
}

export interface UpdateCardInput extends Partial<CreateCardInput> {
  photo_url?: string
  logo_url?: string
  is_active?: boolean
}
```

### 9.2 `packages/shared/types/analytics.ts`

```ts
export type AnalyticsEventType =
  | 'card_view'
  | 'contact_download'
  | 'link_click'
  | 'qr_scan'
  | 'share_click'
  | 'email_click'
  | 'phone_click'
  | 'website_click'

export interface AnalyticsEvent {
  id: string
  card_id: string
  event_type: AnalyticsEventType
  device_type: string | null
  country: string | null
  link_platform: string | null
  created_at: string
}

export interface AnalyticsSummary {
  total_views: number
  total_contact_downloads: number
  total_link_clicks: number
  total_qr_scans: number
  total_share_clicks: number
  events_by_day: { date: string; count: number }[]
  top_platforms: { platform: string; count: number }[]
}
```

### 9.3 `packages/shared/types/user.ts`

```ts
export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}
```

### 9.4 `packages/shared/constants/platforms.ts`

```ts
import type { SocialPlatform } from '../types/card'

export const SOCIAL_PLATFORMS: {
  id: SocialPlatform
  label: string
  placeholder: string
  baseUrl: string
}[] = [
  { id: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/username',  baseUrl: 'https://linkedin.com/in/' },
  { id: 'github',    label: 'GitHub',    placeholder: 'https://github.com/username',        baseUrl: 'https://github.com/' },
  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username',     baseUrl: 'https://instagram.com/' },
  { id: 'x',         label: 'X',         placeholder: 'https://x.com/username',             baseUrl: 'https://x.com/' },
  { id: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/username',      baseUrl: 'https://facebook.com/' },
  { id: 'telegram',  label: 'Telegram',  placeholder: 'https://t.me/username',              baseUrl: 'https://t.me/' },
  { id: 'tiktok',    label: 'TikTok',    placeholder: 'https://tiktok.com/@username',       baseUrl: 'https://tiktok.com/@' },
  { id: 'youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/@username',      baseUrl: 'https://youtube.com/@' },
]
```

### 9.5 `packages/shared/constants/limits.ts`

```ts
export const LIMITS = {
  MAX_CARDS_PER_USER: 10,
  MAX_SOCIAL_LINKS_PER_CARD: 8,
  MAX_BIO_LENGTH: 300,
  MAX_PHOTO_SIZE_MB: 5,
  MAX_LOGO_SIZE_MB: 2,
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  CARD_SLUG_MIN_LENGTH: 3,
  CARD_SLUG_MAX_LENGTH: 50,
} as const
```

---

## Section 10 — Verification Checklist

After completing all sections, verify the following:

```bash
# 1. Confirm working directory
pwd
# Expected: .../digital-identity-platform/apps/web

# 2. Confirm Next.js dev server starts without errors
pnpm dev
# Expected: ready on http://localhost:3000

# 3. Confirm TypeScript has no errors
pnpm tsc --noEmit
# Expected: no output (no errors)

# 4. Confirm all dependencies are installed
cat package.json
# Expected: all packages from sections 3.1–3.17 present
```

---

## Section 11 — Final Dependency Summary

After installation, output this summary filled in with actual installed versions:

```
PRODUCTION DEPENDENCIES
─────────────────────────────────────────
Supabase
  @supabase/supabase-js          x.x.x
  @supabase/ssr                  x.x.x

Forms & Validation
  react-hook-form                x.x.x
  zod                            x.x.x
  @hookform/resolvers            x.x.x

UI Utilities
  clsx                           x.x.x
  tailwind-merge                 x.x.x
  class-variance-authority       x.x.x

Icons
  lucide-react                   x.x.x

State Management
  zustand                        x.x.x

Notifications
  sonner                         x.x.x

QR Code
  qrcode                         x.x.x

Analytics Charts
  recharts                       x.x.x

Date Utilities
  date-fns                       x.x.x

Animations
  framer-motion                  x.x.x

vCard
  vcard-creator                  x.x.x

PDF
  @react-pdf/renderer            x.x.x

Slug
  slugify                        x.x.x

Unique IDs
  nanoid                         x.x.x

Image Compression
  browser-image-compression      x.x.x

Radix UI Primitives
  @radix-ui/react-dialog         x.x.x
  @radix-ui/react-dropdown-menu  x.x.x
  @radix-ui/react-label          x.x.x
  @radix-ui/react-select         x.x.x
  @radix-ui/react-separator      x.x.x
  @radix-ui/react-slot           x.x.x
  @radix-ui/react-switch         x.x.x
  @radix-ui/react-tabs           x.x.x
  @radix-ui/react-toast          x.x.x
  @radix-ui/react-tooltip        x.x.x
  @radix-ui/react-avatar         x.x.x
  @radix-ui/react-progress       x.x.x
  @radix-ui/react-alert-dialog   x.x.x

DEV DEPENDENCIES
─────────────────────────────────────────
  @types/node                    x.x.x
  @types/react                   x.x.x
  @types/react-dom               x.x.x
  @types/qrcode                  x.x.x
  typescript                     x.x.x
  eslint                         x.x.x
  eslint-config-next             x.x.x
  @typescript-eslint/eslint-plugin x.x.x
  @typescript-eslint/parser      x.x.x
  prettier                       x.x.x
  prettier-plugin-tailwindcss    x.x.x
  @testing-library/react         x.x.x
  @testing-library/jest-dom      x.x.x
  @testing-library/user-event    x.x.x
  jest                           x.x.x
  jest-environment-jsdom         x.x.x
  @jest/types                    x.x.x
```

---

## What This File Does NOT Cover

The following are intentionally excluded from this setup file and will be handled in separate instruction files:

- Page implementation (`app/(auth)/login/page.tsx` etc.)
- Component implementation
- API route implementation
- Card template design and styling
- Analytics dashboard charts implementation
- NFC programming script
- Deployment configuration
- CI/CD pipeline


