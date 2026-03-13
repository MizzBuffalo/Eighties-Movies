# Amy's 80s Movie Vault — Setup Advice

## 1. Best Tech Stack for a Static Movie Database a Non-Developer Can Maintain

### Recommendation: **Plain HTML/CSS/JS** (for this project)

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Plain HTML/JS** | Zero build step, edit and refresh, any host works, single-file possible | Harder to scale past ~1000 lines without discipline | **Best fit** — 296 movies is well within range, no tooling overhead |
| **React (Vite)** | Great component model, huge ecosystem, Framer Motion animations | Requires npm, Node.js, build step — intimidating for non-developers | Overkill unless you need complex state (tier lists, games) |
| **Astro** | Static-first, partial hydration, great for content sites | Requires Node.js, build step, newer ecosystem | Good if you want blog-style pages later |
| **Next.js** | Full-featured React framework, SSR, API routes | Heaviest setup, server-side features unnecessary for a static movie list | Too much for this use case |

**Why plain HTML/JS wins here:**
- Amy can open any `.html` file in a browser — no terminal, no npm, no build step
- The entire app can be a single file or a small set of files
- 296 movies loads instantly as a JSON file — no framework overhead needed
- CSS handles all the visual design; vanilla JS handles filtering/searching
- If we want React-level interactivity later (Phase 3: tier lists, games), we can add it then

---

## 2. Free Hosting — GitHub Pages vs Vercel vs Netlify

### Recommendation: **GitHub Pages** (primary) + **Vercel** (for future phases)

| Platform | Free Tier | Custom Domain | Auto-Deploy | Best For |
|----------|-----------|---------------|-------------|----------|
| **GitHub Pages** | 1GB storage, 100GB bandwidth/month | Yes (free) | Yes (on push to branch) | Static HTML/JS — exactly what we have |
| **Vercel** | 100GB bandwidth/month, serverless functions | Yes (free) | Yes (on push) | React/Next.js apps with build steps |
| **Netlify** | 100GB bandwidth/month, serverless functions | Yes (free) | Yes (on push) | Similar to Vercel, slightly less polished |

**Why GitHub Pages for now:**
- The repo already exists on GitHub — deployment is just a settings toggle
- No build step needed for plain HTML/JS
- Free HTTPS, free custom domain support
- URL format: `https://mizzbuffalo.github.io/Eighties-Movies/`
- Dead simple: push to repo → site updates automatically

**When to switch to Vercel:**
- When we add React-based features (Phase 3+) that need a build step
- When we want preview deployments for testing designs
- Migration is trivial — connect the same GitHub repo

---

## 3. Best Way to Load and Filter a 296-Movie JSON File Client-Side

### Approach: **Fetch JSON → Store in Memory → Filter/Sort in JavaScript**

```
Strategy:
1. Embed movie data directly in a <script> tag (fastest) OR fetch from a .json file
2. On page load, render all movies into genre-grouped rows
3. Use JS array methods (.filter(), .sort(), .includes()) for instant filtering
4. Re-render only visible cards on filter/search change
```

**Why this works perfectly for 296 movies:**
- 296 objects × ~200 bytes each = ~60KB of data — trivially small
- `.filter()` on 296 items takes <1ms — instant UI response
- No pagination needed — all movies fit in memory
- Fuzzy search with simple `.toLowerCase().includes()` is fast enough
- No database, no backend, no API calls needed at runtime

**Search implementation:**
```js
// Instant title search
movies.filter(m => m.title.toLowerCase().includes(query.toLowerCase()))

// Genre filter
movies.filter(m => m.genres.includes(selectedGenre))

// Combined filters
movies.filter(m =>
  m.title.toLowerCase().includes(query) &&
  (genre === 'all' || m.genres.includes(genre)) &&
  (section === 'all' || m.special_sections.includes(section))
)
```

---

## 4. TMDB API for Auto-Fetching Posters — How to Set Up Without a Backend

### Approach: **Pre-fetch at build time, serve cached URLs at runtime**

**The Problem:** TMDB requires an API key. Putting it in client-side HTML exposes it publicly.

**The Solution — Two-Step Process:**

**Step 1: One-time build script (run locally)**
```
1. Get a free TMDB API key at https://www.themoviedb.org/settings/api
2. Run a Node.js/Python script that:
   - Reads amys_80s_vault.json
   - Searches TMDB for each movie by title + year
   - Saves the poster URL path for each movie
   - Outputs a new JSON file: movies_with_posters.json
3. Commit this file to the repo
```

**Step 2: Runtime (no API key needed)**
```
- The HTML page loads movies_with_posters.json
- Poster images load directly from TMDB's CDN:
  https://image.tmdb.org/t/p/w342/{poster_path}
- No API calls, no key exposure, instant loading
```

**TMDB image CDN is free and public** — you don't need an API key to load images from `image.tmdb.org`, only to *search* for the poster paths. So we search once, cache the paths, and use the CDN forever.

**When to re-run the script:**
- Only when you add new movies to the vault
- Takes ~30 seconds for 296 movies

---

## 5. Recommended Folder/File Structure

```
Eighties-Movies/
├── index.html                  # Main app entry point
├── amys_80s_vault.json         # Source movie data (already exists)
├── movies_with_posters.json    # Enhanced data with TMDB poster URLs
├── css/
│   ├── main.css                # Core styles
│   └── sections/
│       ├── horror.css          # Horror Vault dark theme
│       ├── queer.css           # Queer Cinema pride theme
│       ├── hughes.css          # John Hughes warm theme
│       └── ...                 # Other section themes
├── js/
│   ├── app.js                  # Main app logic
│   ├── search.js               # Search & filter logic
│   ├── drag-scroll.js          # Drag-to-scroll for rows
│   └── features/
│       ├── tracker.js          # "Have you seen it?" tracker
│       ├── randomizer.js       # Movie randomizer
│       ├── tierlist.js         # Drag-to-rank tier list
│       └── quote-game.js       # Quote guessing game
├── scripts/
│   └── fetch-posters.js        # TMDB poster pre-fetch script
├── assets/
│   ├── fonts/                  # Self-hosted retro fonts
│   └── icons/                  # UI icons
├── designs/
│   ├── design_01.html          # Design mockups
│   ├── design_02.html
│   └── ...
├── PLAN.md                     # Build plan (already exists)
├── SETUP_ADVICE.md             # This file
└── README.md                   # Project overview
```

**Key principles:**
- Keep it flat and simple — no src/ or dist/ folders unless we add a build step
- CSS is separated by section so each special section can have its own theme
- JS features are modular — add new features without touching existing code
- The `designs/` folder keeps mockups separate from the production site

---

## 6. What Will This Cost to Run?

### Total Cost: **$0 per year** (with optional $12/year for a custom domain)

| Item | Cost |
|------|------|
| GitHub Pages hosting | Free (100GB bandwidth/month) |
| TMDB API key | Free (no rate limits for our usage) |
| TMDB image CDN | Free (public, no key needed) |
| Custom domain (optional) | ~$12/year from Namecheap/Google Domains |
| SSL certificate | Free (included with GitHub Pages) |
| **Total without domain** | **$0/year** |
| **Total with domain** | **~$12/year** |

**Bandwidth math:**
- Page size estimate: ~2MB (HTML + CSS + JS + 20 visible poster thumbnails)
- Additional posters loaded on scroll: ~50KB each
- 1,000 visitors/month × 5MB avg = 5GB/month — well within any free tier
- Even 10,000 visitors/month would only use 50GB — still free

**No ongoing costs because:**
- No server to maintain (static files only)
- No database to pay for (localStorage for user data)
- No API calls at runtime (posters pre-fetched)
- No CDN needed (GitHub/Vercel includes one)
