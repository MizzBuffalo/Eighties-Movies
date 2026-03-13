# Amy's 80s Movie Vault — Complete Tech Stack & Build Plan

## Data Summary (from `amys_80s_vault.json`)
- **296 movies** with: title, year, genres (17 types), special_sections (6), collections (7), queer_flagged (14 movies), and notes (238 movies have notes)
- Special sections: Cult Classics, Holiday Films, Horror Vault, John Hughes Universe, Queer Cinema & Stories, Spielberg Universe
- Collections: Badass Women of the 80s, Brat Pack, Cult Classics, Iconic Soundtracks, Sequels & Franchises, Spielberg Universe, Underrated Gems

---

## Step 1: Recommended Tech Stack

### Frontend Framework: **React + Vite**
**Why React over alternatives:**
- Largest ecosystem of animation/UI libraries — critical for the "visually stunning" requirement
- Component model maps perfectly to this project (MovieCard, FilterBar, TierList, QuoteGame — all discrete, reusable components)
- Vite gives instant hot-reload during development and optimized production builds
- React's state management handles complex interactive features (seen-it tracker, tier list drag-and-drop, filtering) more naturally than vanilla JS
- Svelte is lighter but has a smaller plugin ecosystem; Vue is viable but React's animation library options (Framer Motion) are unmatched
- Future expandability is strongest with React — more contributors know it, more libraries support it

### Styling: **Tailwind CSS + Framer Motion**
**Why this combination:**
- **Tailwind CSS**: Utility-first CSS that makes it fast to build responsive layouts AND create completely different visual treatments per section (Horror = dark/red palette, Queer Cinema = rainbow/vibrant, Holiday = warm/festive) using Tailwind's theming system
- **Framer Motion**: Best-in-class React animation library — smooth card transitions, hover effects, page transitions, drag-and-drop for the tier list, and staggered grid reveals. Far simpler than GSAP for React projects
- No need for Three.js — it's overkill for a movie grid app and would hurt mobile performance

### Movie Data & Posters: **TMDB API**
**Why TMDB:**
- Free tier allows 40+ requests/second — more than enough
- Provides high-quality poster images in multiple sizes (w185, w342, w500, w780, original)
- Rich metadata: taglines, overviews, ratings, cast, trailers — useful for future phases
- We'll **pre-fetch and cache** all 296 poster URLs at build time into a local JSON file, so the live site only loads images (no API calls at runtime = faster, no rate limits, no API key exposure)

### Hosting: **Vercel** (primary recommendation) or **GitHub Pages**
**Why Vercel:**
- Free tier is generous (100GB bandwidth/month — more than enough)
- One-click deploy from GitHub repo, automatic deploys on push
- Perfect Vite/React support out of the box
- Custom domain support (free)
- Preview URLs for every branch — great for sharing with friends
- **GitHub Pages** is the fallback: also free, slightly more manual setup, but works great for static sites

### State Management: **localStorage + React Context**
**Why not Redux/Zustand:**
- The interactive features (seen-it tracker, tier rankings, scores) need to persist across sessions but DON'T need a backend database
- localStorage is simple, free, requires zero infrastructure
- React Context handles in-session state (filters, search, current view)
- This keeps the app as a pure static site — no server, no database, no cost

---

## Step 2: Complete Tool & Library List

### Core Build Stack
| Tool | Purpose | Why |
|------|---------|-----|
| **React 18+** | UI framework | Component model, huge ecosystem, Framer Motion support |
| **Vite 6** | Build tool & dev server | Instant HMR, optimized builds, modern defaults |
| **TypeScript** | Type safety | Catch bugs early with 296 movies of structured data |

### Styling & Animation
| Tool | Purpose | Why |
|------|---------|-----|
| **Tailwind CSS 4** | Utility-first styling | Rapid development, responsive design, section theming |
| **Framer Motion 12** | Animations & transitions | Card reveals, hover effects, page transitions, drag-and-drop |
| **@fontsource** | Self-hosted retro fonts | 80s-appropriate typography (e.g., Press Start 2P, Orbitron) without Google Fonts dependency |

### Data & API
| Tool | Purpose | Why |
|------|---------|-----|
| **TMDB API** | Poster images & metadata | Free, high-quality, comprehensive 80s movie data |
| **Node.js build script** | Pre-fetch TMDB data at build time | Cache poster URLs locally so the live site makes zero API calls |

### Interactive Features (Phase 3)
| Tool | Purpose | Why |
|------|---------|-----|
| **@dnd-kit** | Drag-and-drop tier list | Best React DnD library — accessible, performant, touch-friendly |
| **canvas-confetti** | Celebratory effects | Fun visual feedback when completing trackers or winning quiz rounds |

### Hosting & Deployment
| Tool | Purpose | Why |
|------|---------|-----|
| **Vercel** | Hosting | Free, auto-deploy from GitHub, preview URLs, custom domains |
| **GitHub Actions** (optional) | CI/CD | Auto-rebuild poster cache when data changes |

### Development Tools
| Tool | Purpose | Why |
|------|---------|-----|
| **ESLint + Prettier** | Code quality | Consistent formatting across phases |
| **React Router** | Client-side routing | Clean URLs for sections (/horror, /queer-cinema, /top-20) |

---

## Step 3: Pre-Build Checklist

### Already Available in Environment
- [x] Node.js v22.22.0
- [x] npm 10.9.4
- [x] Python 3.11 (useful for data scripts)
- [x] Git configured with repo

### Needs to Be Set Up Before Building
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install Tailwind CSS, Framer Motion, React Router
- [ ] Get TMDB API key (free at themoviedb.org) — needed to fetch poster images
- [ ] Create build script to pre-fetch all 296 poster URLs from TMDB
- [ ] Set up Vercel project (connect to GitHub repo)

---

## Phase-by-Phase Build Plan

### Phase 1: Beautiful Browsable Movie Grid
**What gets built:**
- Responsive movie poster grid (masonry or uniform grid layout)
- Each card shows: poster image, title, year, genre tags
- Filter bar: by genre (17), by special section (6), by collection (7)
- Search bar: instant fuzzy search by title
- Sort: by title (A-Z/Z-A), by year, by genre
- 80s-themed header with neon/retro styling
- Mobile-responsive: 1 column on phone, 2-3 on tablet, 4-5 on desktop
- Smooth card animations on filter/search (Framer Motion layout animations)

### Phase 2: Special Section Pages
**Each section gets its own visual identity:**
- **Amy's Top 20**: Gold/premium design, numbered ranking, Amy's personal write-ups
- **John Hughes Universe**: Warm, nostalgic, yearbook aesthetic
- **Spielberg Universe**: Epic, cinematic, wide-format poster displays
- **Horror Vault**: Dark background, red accents, fog/mist effects, atmospheric lighting
- **Holiday Films**: Warm golds, snowfall effect, cozy aesthetic
- **Cult Classics**: VHS tape aesthetic, tracking lines, retro TV look
- **Queer Cinema & Stories**: Rainbow gradient accents, pride-inspired palette, celebratory design

### Phase 3: Interactive Features
- **"Have You Seen It?" Tracker**: Click to mark movies as seen, rate 1-5 stars, progress bar showing % complete, stats dashboard
- **Movie Randomizer**: Spin-wheel or slot-machine animation, filter by genre/mood before randomizing
- **Tier List Builder**: Drag-and-drop movies into S/A/B/C/D/F tiers, shareable as image
- **Quote Guessing Game**: Show a famous quote, guess the movie from 4 choices, track score

### Phase 4: Amy's Voice
- Expanded notes/reviews for every film
- Full written Top 20 with personal essays
- "Amy Says" badges on cards with her hot takes

### Phase 5: Go Live
- Deploy to Vercel with custom domain
- Social sharing: Open Graph meta tags for link previews
- Shareable URLs for individual movies and sections
- Performance optimization pass

---

## Key Architecture Decisions

### Why Static Site (No Backend)?
- All 296 movies are known upfront — no database needed
- TMDB poster URLs are cached at build time — no runtime API calls
- User data (seen-it, ratings, tiers) stored in localStorage
- Result: **zero hosting cost**, instant load times, works offline

### Why Pre-Fetch TMDB Data?
- Avoids exposing API key in client code
- Eliminates 296 API calls on every page load
- Posters load from TMDB's CDN (image.tmdb.org) — fast and free
- Build script runs once, generates a `movies_with_posters.json` file

### Why Not a Single HTML File?
- 296 movies with interactive features would make a single file unwieldy (5000+ lines)
- React components keep code organized and maintainable across 5 phases
- Vite's build output is still just static files — deployable anywhere
- If single-file sharing is needed later, we can add an "export" feature

---

## TMDB API Key Requirement

**Before we can build Phase 1, we need a TMDB API key.**
- Sign up free at https://www.themoviedb.org/settings/api
- We'll use it ONLY in a build script (never exposed in the live site)
- The build script will search TMDB for each of the 296 movies and save poster URLs to a local JSON file

---

## Cost Summary

| Item | Cost |
|------|------|
| React, Vite, Tailwind, Framer Motion | Free (open source) |
| TMDB API | Free (40 req/sec) |
| Vercel hosting | Free tier (100GB/mo) |
| Custom domain (optional) | ~$10-15/year |
| **Total** | **$0 — $15/year** |
