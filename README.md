# Playlist CoPilot - Playlist Sync Service

Sync playlists between Spotify, Apple Music, Deezer and YouTube for the price of a coffee ($1.99/mo).

## Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes + Server Actions
- **Database**: Supabase (Postgres) - Free tier
- **Auth**: Supabase Auth (Magic Link + OAuth)
- **Payments**: Stripe (Subscriptions + Trial)
- **Deployment**: Vercel (Free tier)

## Local Development (0€)

### Prerequisites

- Node.js 18+ LTS ([download](https://nodejs.org))
- npm (included with Node)
- Git
- A Supabase account (free)

### Step-by-Step Local Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd playlist-sync

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.local.example .env.local

# 4. Edit .env.local with your values (see "Environment Variables" below)
# Use your favorite editor: code .env.local | vim .env.local | nano .env.local
```

### Supabase Setup (Cloud - Free Tier)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose organization → Project name: `playlist-sync` → Region closest to you
3. Wait for database to be ready (~2 min)
4. Go to Project Settings → API
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
5. Go to SQL Editor → New query
   - Copy entire content of `supabase/migrations/001_initial.sql`
   - Click Run
   - Verify tables created (Table Editor should show: profiles, subscriptions, connections, etc.)

### OAuth Setup (Local)

**Spotify:**
1. [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) → Create App
2. App name: `SyncTune Local`
3. Redirect URI: `http://localhost:3000/api/auth/callback`
4. Copy Client ID → `SPOTIFY_CLIENT_ID`
5. Show Client Secret → `SPOTIFY_CLIENT_SECRET`

**Deezer:**
1. [developers.deezer.com/myapps](https://developers.deezer.com/myapps) → Create App
2. Application domain: `localhost`
3. Redirect URI: `http://localhost:3000/api/auth/callback`
4. Copy App ID → `DEEZER_APP_ID`
5. Copy Secret Key → `DEEZER_APP_SECRET`

**YouTube:**
1. [console.cloud.google.com](https://console.cloud.google.com) → New Project
2. APIs & Services → Enable APIs → YouTube Data API v3
3. Credentials → Create Credentials → API Key → `YOUTUBE_API_KEY`
4. (Optional for write) OAuth 2.0 Client → Web application → Redirect URI: `http://localhost:3000/api/auth/callback`

### Environment Variables (Complete List)

```bash
# Supabase (from supabase.com dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App URL (for auth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (skip for pure V0 testing, required for payments)
# Get from stripe.com → Developers → API Keys (use Test mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuth Apps
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
DEEZER_APP_ID=your_deezer_app_id
DEEZER_APP_SECRET=your_deezer_secret
YOUTUBE_API_KEY=your_youtube_api_key

# Encryption (generate with: openssl rand -base64 32)
ENCRYPTION_KEY=your_32_char_random_string_here
```

### Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Local Verification Checklist

Test these features in order:

- [ ] **Landing page** loads at `/`
- [ ] **Login page** accessible at `/login`
- [ ] **Magic Link login** → Check email → Click link → Redirects to `/dashboard`
- [ ] **Supported Services** at `/supported-services`
  - [ ] Capability matrix displays all 4 platforms
  - [ ] Apple Music CTA shows "0/100"
  - [ ] Lead capture form accepts email → "You're on the list!"
- [ ] **Feedback** at `/feedback`
  - [ ] Submit feature request without login
  - [ ] Upvote existing request
- [ ] **Pricing page** at `/pricing`
- [ ] **Dashboard** shows user email, plan "free"

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `Invalid login credentials` | Supabase Auth not configured | Check NEXT_PUBLIC_SUPABASE_URL and ANON_KEY match your project |
| `Failed to save subscription` (lead capture) | Missing service_role key | Add SUPABASE_SERVICE_ROLE_KEY from Supabase dashboard |
| OAuth redirect fails | Redirect URI mismatch | Verify exact match: `http://localhost:3000/api/auth/callback` (no trailing slash) |
| `cookies() called in Server Component` | Middleware issue | Ensure you're using `@supabase/auth-helpers-nextjs` v0.8.7+ |
| `Module not found` | Dependencies not installed | Run `npm install` again |
| Database tables missing | Migration not run | Execute SQL from `supabase/migrations/001_initial.sql` in Supabase SQL Editor |

## Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "v0.1 - Playlist sync MVP with lead capture"

# Create GitHub repository:
# 1. Go to github.com → New Repository
# 2. Name: playlist-sync
# 3. Don't initialize with README (we already have one)
# 4. Copy the commands shown (or use below):

git remote add origin https://github.com/YOUR_USERNAME/playlist-sync.git
git branch -M main
git push -u origin main
```

Verify on GitHub:
- [ ] All files pushed
- [ ] `supabase/migrations/` visible
- [ ] `.env.local.example` visible (NOT `.env.local` - should be in .gitignore)

## Deploy to Vercel (0€)

### 1. Import from GitHub

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import Git Repository → Select `playlist-sync`
3. Configure Project:
   - Framework Preset: Next.js
   - Root Directory: `./` (or `playlist-sync/` if monorepo)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### 2. Environment Variables on Vercel

Add ALL variables from `.env.local` (except Stripe if not testing payments yet):

| Variable | Value | Where to find |
|----------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase Dashboard → Settings → API (secret) |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Will be provided by Vercel after deploy, then update |
| `ENCRYPTION_KEY` | `your_32_char_key` | Same as local (generate once, keep consistent) |
| `SPOTIFY_CLIENT_ID` | Same as local | But update redirect URI after deploy |
| `SPOTIFY_CLIENT_SECRET` | Same as local | |
| `DEEZER_APP_ID` | Same as local | But update redirect URI after deploy |
| `DEEZER_APP_SECRET` | Same as local | |
| `YOUTUBE_API_KEY` | Same as local | |

Click **Deploy** (will fail on first auth attempt, that's OK - we need the URL first)

### 3. Get Production URL

After first deploy:
- Vercel assigns URL: `https://playlist-sync-xxx.vercel.app`
- Copy this URL → Update `NEXT_PUBLIC_APP_URL` in Vercel env vars
- **Redeploy** (Required for auth to work)

### 4. Update OAuth Redirect URIs (Production)

**Spotify:**
- [dashboard](https://developer.spotify.com/dashboard) → Your App → Settings
- Add Redirect URI: `https://your-app.vercel.app/api/auth/callback`
- Save

**Deezer:**
- [myapps](https://developers.deezer.com/myapps) → Edit App
- Add Redirect URI: `https://your-app.vercel.app/api/auth/callback`
- Save

**Google (YouTube):**
- [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
- OAuth 2.0 Client ID → Edit
- Add Authorized redirect URI: `https://your-app.vercel.app/api/auth/callback`
- Save

### 5. Update Supabase Auth Settings

1. Supabase Dashboard → Authentication → URL Configuration
2. **Site URL**: `https://your-app.vercel.app`
3. **Additional Redirect URLs**: Add `https://your-app.vercel.app/api/auth/callback`
4. Save

### 6. Production Sanity Checklist

Test in order on your Vercel URL:

- [ ] **Landing page** loads (no 500 errors)
- [ ] **Login** works (Magic Link or Google)
- [ ] **Lead capture** at `/supported-services`:
  - Submit email → Success message
  - Verify in Supabase Table Editor → `leads` table shows new row
- [ ] **Feedback** at `/feedback`:
  - Submit request without login
  - Upvote works (no 409 error)
  - Verify in `feature_requests` table
- [ ] **OAuth callback**:
  - Try connecting Spotify → Should redirect back without error
  - Check `connections` table shows new row
- [ ] **Supabase logs** clean:
  - Dashboard → Logs → No RLS policy errors
  - No "relation does not exist" errors (migrations applied)

### Troubleshooting Production

| Issue | Fix |
|-------|-----|
| `Error: fetch failed` (Supabase) | Check env vars in Vercel match exactly (no spaces) |
| `Invalid redirect URI` (OAuth) | Update Spotify/Deezer/Google with exact Vercel URL |
| Auth loop (login → login) | Check Supabase Auth → URL Configuration matches Vercel URL |
| `Module not found` on build | Check `package.json` has all dependencies, `npm install` locally then push |
| Lead capture 500 error | Check `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel |
| Styles not loading | Check `tailwind.config.ts` paths match your folder structure |

### Post-Deploy Next Steps

1. **Custom domain** (optional, free on Vercel):
   - Vercel Dashboard → Domains → Add `synctune.app` or similar
   - Update OAuth redirects again with custom domain

2. **Stripe activation** (when ready for payments):
   - Switch from Test to Live keys
   - Update webhook endpoint in Stripe Dashboard with Vercel URL
   - Create products (Premium $1.99, Annual $18, Lifetime $99)
   - Test checkout flow

3. **Apple Music upgrade** (at 100 leads):
   - Pay Apple Developer Program ($99)
   - Update `lib/platforms/apple-music.ts`
   - Update capability matrix

---

## Quick Start (Original - for reference)

### 1. Clone & Install

```bash
git clone <repo>
cd playlist-sync
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Supabase (from supabase.com)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (from stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# OAuth Apps
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
DEEZER_APP_ID=
DEEZER_APP_SECRET=
YOUTUBE_API_KEY=

# Encryption (generate: openssl rand -base64 32)
ENCRYPTION_KEY=
```

### 3. Database Setup

1. Create project on [Supabase](https://supabase.com)
2. Run SQL in `supabase/migrations/001_initial.sql` in the SQL Editor
3. Enable Google Auth provider (if using Google login)

### 4. OAuth Setup

**Spotify:**
- Create app at [developer.spotify.com](https://developer.spotify.com/dashboard)
- Redirect URI: `http://localhost:3000/api/auth/callback`

**Deezer:**
- Create app at [developers.deezer.com](https://developers.deezer.com/myapps)
- Redirect URI: `http://localhost:3000/api/auth/callback`

**YouTube:**
- Enable YouTube Data API v3 in [Google Cloud Console](https://console.cloud.google.com/)
- Create API Key (for public playlists)
- Create OAuth credentials (for write access)

### 5. Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Create products:
   - Premium Monthly: $1.99
   - Premium Annual: $18.00
   - Lifetime: $99.00
3. Get API keys and webhook secret
4. Configure webhook endpoint: `/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`

### 6. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture

```
app/
├── (auth)/          # Auth routes (login, callback)
├── (dashboard)/     # Protected routes
│   ├── dashboard/   # Main dashboard
│   ├── playlists/   # Playlist management
│   ├── connections/ # OAuth connections
│   ├── supported-services/  # Capability matrix
│   └── feedback/    # Feature requests
├── api/
│   ├── leads/subscribe       # Lead capture
│   ├── feedback/             # Feature requests & votes
│   ├── webhooks/stripe       # Stripe webhooks
│   └── sync/manual           # Manual sync trigger

components/
├── ui/              # shadcn/ui components
├── leads/           # Lead capture forms
└── feedback/        # Feedback forms

lib/
├── supabase/        # Supabase clients
├── stripe/          # Stripe helpers
├── platforms/       # Music platform APIs
│   ├── spotify.ts
│   ├── deezer.ts
│   ├── youtube.ts
│   └── apple-music.ts
└── i18n/            # Translations
```

## Roadmap

### V0 (Current - 0€ Mode)
- [x] Auth (Magic Link + Google)
- [x] Spotify FULL (OAuth + Write)
- [x] Deezer FULL (OAuth + Write)
- [x] YouTube FULL (API Data v3)
- [x] Apple Music PARTIAL (Export only)
- [x] Lead capture system
- [x] Feedback & voting system
- [x] Capability matrix page

### V1 (First Revenue)
- [ ] Apple Music FULL (after 100 leads or $99 budget)
- [ ] Auto-sync (cron jobs)
- [ ] Better matching algorithm
- [ ] Email notifications

### V2 (Scale)
- [ ] Mobile app (PWA)
- [ ] API for developers
- [ ] More platforms (Tidal, SoundCloud)

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 1 playlist, manual sync |
| Premium | $1.99/mo | Unlimited, auto-sync |
| Annual | $18/yr | Same as Premium, 25% off |
| Lifetime | $99 once | Forever access |

**Trial**: 1 month free, no credit card required.

## Contributing

This is an MVP starter. Feel free to fork and customize.

## License

MIT
