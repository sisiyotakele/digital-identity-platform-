# UNIQUE — Digital Card Platform

> **Your identity, one tap away.** Create, share and print premium digital business cards built for Ethiopian professionals.

🌐 **Live:** [digital-identity-platform-web.vercel.app](https://digital-identity-platform-web.vercel.app)  
📦 **GitHub:** [sisiyotakele/digital-identity-platform-](https://github.com/sisiyotakele/digital-identity-platform-)

---

## What is UNIQUE?

UNIQUE is a modern digital business card platform. Instead of handing out paper cards, you create a beautiful digital card, share it via a link, QR code, or NFC tap, and anyone can save your contact instantly. You can also print premium physical cards with your QR code on the back.

---

## Features

- 🪪 **Digital business cards** — 8 premium templates to choose from
- 📱 **NFC ready** — tap your phone to share your card instantly
- 🔗 **QR code** — every card gets its own QR code
- 💾 **Save contact** — visitors download your contact as a `.vcf` file
- 📊 **Analytics** — see views, link clicks, QR scans, and contact downloads
- 🤝 **Lead capture** — visitors can leave their details directly on your card
- 🖨️ **Print cards** — design and preview physical business cards
- 🌙 **Dark & light mode** — full theme support
- 📍 **Ethiopian localisation** — built for Ethiopian professionals

---

## Tech Stack

| | Technology | What it does |
|---|---|---|
| ⚡ | **Next.js 14** | The web framework — handles pages, routing, and server logic |
| 🔷 | **TypeScript** | Adds type safety to the JavaScript code |
| 🎨 | **Tailwind CSS** | Handles all the styling and layout |
| 🟢 | **Supabase** | Database, authentication, and file storage — the entire backend |
| 🔐 | **Supabase Auth** | Handles sign up, login, email verification, and sessions |
| 🗄️ | **PostgreSQL** | The database (runs inside Supabase) |
| 📦 | **Supabase Storage** | Stores profile photos and company logos |
| ✨ | **Framer Motion** | All the animations and transitions |
| 🧩 | **shadcn/ui** | Ready-made UI components (buttons, inputs, dialogs) |
| 📋 | **React Hook Form + Zod** | Form handling and validation |
| 📈 | **Recharts** | The analytics charts |
| 🔔 | **Sonner** | Toast notifications |
| 🌐 | **Vercel** | Deployment and hosting |

---

## How It Works

```
User signs up
    ↓
Supabase Auth creates account + auto-creates profile
    ↓
User creates a card (fills in details, picks template, uploads photo)
    ↓
Card is saved to Supabase database
    ↓
User shares their link / QR / NFC
    ↓
Visitor opens card → views it → saves contact or leaves details
    ↓
Every action (view, click, scan) is recorded as an analytics event
    ↓
Card owner sees all data in their dashboard
```

---

## Project Structure

```
digital-identity-platform/
├── apps/web/          ← Next.js app (everything the user sees)
├── packages/shared/   ← Shared types and constants
└── packages/database/ ← SQL schema and security rules
```

---

## Getting Started Locally

```bash
# 1. Clone the repo
git clone https://github.com/sisiyotakele/digital-identity-platform-

# 2. Install dependencies
cd apps/web
pnpm install

# 3. Add environment variables
# Create apps/web/.env.local with your Supabase keys

# 4. Run the dev server
pnpm dev
# → http://localhost:3000
```

**Environment variables needed:**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

*Built with ❤️ in Ethiopia 🇪🇹 — UNIQUE Digital Card*
