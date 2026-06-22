<div align="center">

# 🪪 UNIQUE — Digital Card Platform

### *Your identity, one tap away.*

**Create · Share · Print · Track** — Premium digital business cards built for Ethiopian professionals.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-digital--identity--platform--web.vercel.app-4f46e5?style=for-the-badge)](https://digital-identity-platform-web.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-sisiyotakele-181717?style=for-the-badge&logo=github)](https://github.com/sisiyotakele/digital-identity-platform-)

---

### 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-FF0055?style=flat-square&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-Monorepo-F69220?style=flat-square&logo=pnpm&logoColor=white)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=flat-square)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-Forms-EC5990?style=flat-square)
![Recharts](https://img.shields.io/badge/Recharts-Charts-22B5BF?style=flat-square)
![Sonner](https://img.shields.io/badge/Sonner-Toasts-000000?style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand-State-FF6B35?style=flat-square)

---

### 📊 Project Stats

![GitHub last commit](https://img.shields.io/github/last-commit/sisiyotakele/digital-identity-platform-?style=flat-square&color=4f46e5)
![GitHub repo size](https://img.shields.io/github/repo-size/sisiyotakele/digital-identity-platform-?style=flat-square&color=7c3aed)
![Lines of code](https://img.shields.io/badge/Lines_of_Code-15%2C000+-brightgreen?style=flat-square)
![Pages](https://img.shields.io/badge/Pages-27-blue?style=flat-square)
![API Routes](https://img.shields.io/badge/API_Routes-6-orange?style=flat-square)

</div>

---

## 🌟 What is UNIQUE?

**UNIQUE** is a full-stack SaaS platform that replaces paper business cards with a premium digital experience. Built specifically for Ethiopian professionals, it lets you:

- Create a beautiful digital business card in under 2 minutes
- Share it via **NFC tap**, **QR code**, or a **direct link**
- Track every view, click, and interaction in a real-time analytics dashboard
- **Print physical cards** with a QR code on the back
- Capture leads directly from your card page

> Think of it as your digital identity hub — one link that contains everything about you, always up to date.

---

## 🖥️ Live Preview

> **Visit the live site:** [https://digital-identity-platform-web.vercel.app](https://digital-identity-platform-web.vercel.app)

```
Landing Page  →  https://digital-identity-platform-web.vercel.app
Dashboard     →  https://digital-identity-platform-web.vercel.app/dashboard
Create Card   →  https://digital-identity-platform-web.vercel.app/cards/create
Analytics     →  https://digital-identity-platform-web.vercel.app/analytics
Print Cards   →  https://digital-identity-platform-web.vercel.app/print
```

### 📱 Public Card Example
Once you create a card with username `abel` and slug `my-card`, it's live at:
```
https://digital-identity-platform-web.vercel.app/abel/my-card
```
Anyone who visits that URL (via NFC, QR, or direct link) can view the card, save your contact, and leave their details.

---

## ✨ Full Feature List

### 🪪 Digital Business Cards
- **8 premium templates**: Minimal, Modern, Corporate, Creative, Executive, Dark, Gradient, Startup
- Custom accent color picker for each template
- Upload profile photo and company logo
- Live preview — see changes in real time as you type
- Card URL slug (e.g. `/abel/my-card`) — customizable and checked for uniqueness
- Active/inactive toggle per card

### 📡 NFC & QR Code Sharing
- Every card automatically gets a unique QR code
- Download QR code as PNG (512×512px, print-ready)
- NFC-compatible — program any NFC card/tag to point to your card URL
- One tap → instant card sharing

### 💾 Contact Sharing (vCard)
- "Save Contact" button on every public card page
- Downloads a `.vcf` file (RFC 6350 compliant)
- Works with iOS Contacts, Android, Outlook, Gmail
- Includes name, company, email, phone, website, address, social links, and photo

### 📊 Analytics Dashboard
- **Views** — every time someone visits your card
- **Contact downloads** — every time someone saves your contact
- **Link clicks** — which social links people click and how often
- **QR scans** — tracked every time your QR is generated
- **Share clicks** — when the share button is used
- Date range selector: 7 days / 30 days / 90 days
- Line chart (views over time) + bar chart (event breakdown)
- Platform breakdown (which social links get clicked most)

### 🤝 Lead Capture
- A contact form at the bottom of every public card page
- Visitors enter their name, email, phone, and message
- Stored in the `leads` table in Supabase
- Card owner can view all leads from their dashboard

### 🖨️ Physical Card Printing
- 6 professional print templates (Modern Corporate, Luxury Gold, Minimalist, etc.)
- 3D card preview with **flip animation** — see front and back
- Front: name, title, company, contact details
- Back: QR code + UNIQUE branding
- Export as PDF (`/api/pdf`) — A4, 300 DPI
- Standard business card dimensions (85mm × 54mm)

### 🌙 Dark / Light Mode
- Full dark mode support across every page
- Brighter dark theme (not pitch black — medium navy)
- System preference support + manual toggle in navbar and settings
- Saved per-user preference

### 🔐 Authentication
- Email/password sign up with email verification
- Login, forgot password, reset password flows
- Session management via HTTP-only cookies (secure)
- Auto-creates user profile on signup via database trigger

### 🗂️ Settings
- Update display name and avatar
- Set/change username (checked for availability in real time)
- Change password
- Appearance mode toggle (Light / Dark)
- Danger zone — delete account (requires typing "DELETE" to confirm)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React)                          │
│  Next.js 14 App Router — Server & Client Components          │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP + WebSocket
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Cloud                            │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Auth    │  │  PostgreSQL  │  │  Storage (S3)        │  │
│  │  (JWT)   │  │  (7 tables)  │  │  avatars + card-media│  │
│  └──────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  PostgREST — auto REST API from schema              │    │
│  │  Row Level Security — enforced in the database      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Hosting)                          │
│  Edge Middleware → API Routes → Static Assets               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```sql
auth.users          ← Supabase Auth (managed automatically)
    └── profiles    ← display_name, username, avatar_url, role
          └── business_cards  ← slug, template, title, company, contacts...
                ├── social_links    ← platform, url, display_order
                ├── analytics_events ← event_type, device_type, created_at
                ├── leads           ← name, email, phone, message
                └── qr_codes        ← created_at (tracks QR generations)
```

### Row Level Security (RLS)

Every table has RLS enabled. This means security is enforced **inside the database**, not just in the API:

| Table | Who can read | Who can write |
|---|---|---|
| `profiles` | Anyone (public profiles) | Owner only |
| `business_cards` | Anyone (active cards only) | Owner only |
| `social_links` | Anyone (active cards only) | Owner only |
| `analytics_events` | Owner only | Anyone (anonymous visitors) |
| `leads` | Owner only | Anyone (anonymous visitors) |

### Auto-triggers

```sql
-- Fires when a new user signs up → creates their profile row automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 📁 Project Structure

```
digital-identity-platform/
├── apps/
│   └── web/                          ← Next.js 14 app
│       ├── app/
│       │   ├── (auth)/               ← Login, register, forgot password
│       │   ├── (dashboard)/          ← Dashboard, cards, analytics, settings
│       │   ├── (public)/             ← Public card pages
│       │   ├── [username]/           ← /abel → profile page
│       │   ├── [username]/[slug]/    ← /abel/my-card → card page
│       │   └── api/                  ← health, upload, vcard, qr, pdf, analytics
│       ├── components/
│       │   ├── landing/              ← Landing page sections
│       │   ├── card/templates/       ← 8 card template components
│       │   ├── layout/               ← Sidebar, TopNav, MobileSidebar
│       │   ├── dashboard/            ← Stats, RecentCards, QuickActions
│       │   ├── forms/                ← CardForm (the main editor)
│       │   ├── brand/                ← Logo component
│       │   └── ui/                   ← shadcn/ui components + Dock
│       ├── hooks/                    ← useAuth, useCards, useUpload
│       ├── lib/
│       │   ├── supabase/             ← client.ts + server.ts
│       │   ├── api/                  ← card.api.ts, user.api.ts, analytics.api.ts
│       │   └── validations.ts        ← Zod schemas for all forms
│       └── config/
│           └── site.ts               ← App name, URL, description
│
├── packages/
│   ├── shared/types/                 ← TypeScript interfaces
│   ├── shared/constants/             ← platforms, limits
│   └── database/
│       ├── schema.sql                ← All CREATE TABLE statements
│       ├── rls.sql                   ← All Row Level Security policies
│       └── fix_trigger.sql           ← Auth trigger with proper permissions
```

---

## 🔌 API Routes

| Route | Method | Description |
|---|---|---|
| `/api/health` | GET | Returns `{ status: "ok" }` — uptime check |
| `/api/upload` | POST | Receives image, compresses, uploads to Supabase Storage |
| `/api/vcard` | GET | Generates and downloads `.vcf` contact file |
| `/api/qr` | GET | Generates and downloads QR code PNG |
| `/api/pdf` | GET | Renders card as PDF using `@react-pdf/renderer` |
| `/api/analytics` | POST | Records analytics event from public card page |

---

## ⚙️ Environment Variables

```bash
# Supabase — from supabase.com → project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5c...

# App URL — localhost for dev, Vercel URL for production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ Never expose `SUPABASE_SERVICE_ROLE_KEY` in the browser. It is only used in server-side API routes.

---

## 🚀 Local Development

```bash
# Prerequisites: Node.js 18+, pnpm 8+

# 1. Clone
git clone https://github.com/sisiyotakele/digital-identity-platform-
cd digital-identity-platform

# 2. Install (from root)
pnpm install

# 3. Set up environment
cp apps/web/.env.example apps/web/.env.local
# → Fill in your Supabase keys

# 4. Set up database
# Run packages/database/schema.sql in Supabase SQL Editor
# Run packages/database/rls.sql in Supabase SQL Editor
# Run packages/database/fix_trigger.sql in Supabase SQL Editor

# 5. Create storage buckets in Supabase
# Create: avatars (public)
# Create: card-media (public)

# 6. Start dev server
cd apps/web
pnpm dev
# → http://localhost:3000
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 14.x | App framework |
| `@supabase/supabase-js` | 2.x | Database & auth client |
| `@supabase/ssr` | 0.x | Server-side Supabase client for Next.js |
| `framer-motion` | 10.x | Animations |
| `react-hook-form` | 7.x | Form management |
| `zod` | 3.x | Schema validation |
| `recharts` | 2.x | Analytics charts |
| `@react-pdf/renderer` | 4.x | PDF generation |
| `qrcode` | 1.x | QR code generation |
| `next-themes` | latest | Dark/light mode |
| `sonner` | 1.x | Toast notifications |
| `zustand` | 4.x | Global state management |
| `browser-image-compression` | 2.x | Client-side image compression |

---

## 🌍 Deployment

The app is deployed on **Vercel** and uses **Supabase** as the cloud backend.

- Every push to `main` branch triggers an automatic deployment
- The build takes ~2 minutes
- Environment variables are set in the Vercel project settings

**Production URL:** [https://digital-identity-platform-web.vercel.app](https://digital-identity-platform-web.vercel.app)

---

## 🛡️ Security

- All API routes verify user session before processing
- File uploads use the service role key server-side (bypasses storage RLS safely)
- Row Level Security enforced at the database level — even if API is bypassed
- No sensitive keys exposed to the browser
- Passwords hashed by Supabase Auth (bcrypt)
- Email verification required before login

---

## 🗺️ Roadmap

- [ ] Custom domain support per card
- [ ] Team/organization accounts
- [ ] Analytics export (CSV)
- [ ] Multiple languages (Amharic support)
- [ ] Card templates marketplace
- [ ] NFC card ordering integration
- [ ] Mobile app (React Native)

---

<div align="center">

**Built with ❤️ in Ethiopia 🇪🇹**

[![Made in Ethiopia](https://img.shields.io/badge/Made_in-Ethiopia_🇪🇹-078930?style=for-the-badge)](https://digital-identity-platform-web.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

*© 2025 UNIQUE Digital Card — All rights reserved*

</div>
