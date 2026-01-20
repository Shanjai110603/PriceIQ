# PriceIQ - Freelance Rate Discovery Platform

> **MVP Version**

## 🎯 What is PriceIQ?

PriceIQ is the most accurate freelance pricing intelligence platform. We help freelancers discover fair market rates and clients budget accurately using real, crowdsourced data.

### Core Features (MVP)
- ✅ Rate Discovery Engine (search rates by skill + location)
- ✅ P25/P50/P75/P90 percentile calculator
- ✅ User authentication (Supabase)
- ✅ Crowdsourced rate submissions
- ✅ Admin panel for data validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (you have v24.12.0 ✅)
- npm 7+ (you have v11.6.2 ✅)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up Supabase**:
   - Go to [supabase.com](https://supabase.com) and create a free project
   - Copy your project URL and anon key
   - Create `.env.local` file:
```bash
cp .env.local.example .env.local
```
   - Fill in your Supabase credentials

3. **Run database migrations** (see `/supabase/schema.sql`)

4. **Start development server**:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 💰 Zero-Cost Stack

| Service | Free Tier | Usage |
|---------|-----------|-------|
| **Vercel** | 100GB bandwidth | Hosting |
| **Supabase** | 500MB database | PostgreSQL + Auth |
| **Cloudflare** | Unlimited | CDN + DNS |
| **Resend** | 3K emails/month | Transactional emails |

**Total: ₹0/month** (Free Tiers)

## 📁 Project Structure

```
priceiq/
├── src/
│   ├── app/                 # Next.js 14 app router
│   │   ├── page.tsx         # Landing page
│   │   ├── explore/         # Rate discovery
│   │   ├── submit/          # Submit rates
│   │   ├── auth/            # Login/signup
│   │   └── api/             # API routes
│   ├── components/          # Reusable UI
│   ├── lib/                 # Utils & clients
│   └── types/               # TypeScript types
├── supabase/                # Database schema
└── public/                  # Static assets
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Deployment**: Vercel
- **CDN**: Cloudflare

## 📊 Development Roadmap

- [x] Phase 1: Foundation (Days 1-10)
- [ ] Phase 2: Core Features (Days 11-20)
- [ ] Phase 3: Polish & Launch (Days 21-30)
- [ ] Phase 4: Data Collection (Days 31-45)

See `/implementation_plan.md` for full details.

## 🤝 Contributing

This is a solo project built by AI + human collaboration. Not accepting contributions yet.

## 📝 License

Proprietary - All rights reserved

## 🔗 Links

- **Live Site**: Coming soon
- **Docs**: `/implementation_plan.md`
- **Strategic Blueprint**: See `/brain/` artifacts

---

**Powered by determination. 🚀**
