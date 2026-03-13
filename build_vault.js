#!/usr/bin/env node
/**
 * Build script for Amy's 80s Movie Vault
 *
 * Generates vault.html — a single-file app with all 296 movies.
 *
 * Usage:
 *   node build_vault.js                          # uses amys_80s_vault.json + hardcoded posters
 *   node build_vault.js movies_with_posters.json  # uses enriched TMDB data
 */

const fs = require('fs');

// Load movie data
const inputFile = process.argv[2] || 'amys_80s_vault.json';
const vault = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const movies = vault.movies;

// Hardcoded poster paths for 64 iconic movies (fallback when no TMDB enrichment)
const FALLBACK_POSTERS = {
  "Raiders of the Lost Ark": "/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
  "Die Hard": "/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg",
  "The Terminator": "/qvktm0BHcnmDpul4Hz01GIazWPr.jpg",
  "RoboCop": "/hoCbhAOfOFpnF7MCsIv04v1rnkS.jpg",
  "Beverly Hills Cop": "/eBJEvMR82Lhyri6XKV2B3pRXCAm.jpg",
  "Top Gun": "/xUuHj3CgmZQ9P2cMaqQs4J0d4Zc.jpg",
  "Lethal Weapon": "/bFxAftejRNhkMFederCq9QghF8u.jpg",
  "Aliens": "/r1x5JGpyqZU8PYhbs4UcrO1Xb6x.jpg",
  "First Blood": "/a9sa6ERZCpplbPEO7OMWE763CLD.jpg",
  "Predator": "/bFOqHIDN2MnJNQph5SMpWnQyilq.jpg",
  "Ghostbusters": "/loFCAro1YSAhMJHfmRFCemMNLun.jpg",
  "Ferris Bueller's Day Off": "/9LddG87JMmHXsRJbpLpwMjcWpW2.jpg",
  "Tootsie": "/rBaW4mq1E3NqWfVHU9GPn5hOj8I.jpg",
  "Coming to America": "/djRAvxyvvN4yMFnDEqeKkz7lkOl.jpg",
  "Airplane!": "/7Q4bPJVkealJWDi4CaF4VlPYS47.jpg",
  "Beetlejuice": "/nnl6OWkyPpuMm595hmAxNW614NU.jpg",
  "Trading Places": "/4ACm9hOr7ib3TjBqv5dRkAe0JKb.jpg",
  "National Lampoon's Vacation": "/q3DvIoSbhwOOd4T7mDYENsaXvYH.jpg",
  "Spaceballs": "/o624HTt9RMu9YwWHKt7lSm1DVXE.jpg",
  "9 to 5": "/6xIKMxk2h6vP1WA7bqFqjvEFvqT.jpg",
  "Stand By Me": "/bXbTlLFj3zHEdcfnlMlNvPbY8za.jpg",
  "Scarface": "/iQ5ztdjvteGeboXVh1eW3xIF5gO.jpg",
  "Rain Man": "/jOUPMGemkJBd6sGl0NnjIS3CoWQ.jpg",
  "The Color Purple": "/sGNlnJEhm5x7BBCsSFxfSpqzTAF.jpg",
  "Platoon": "/oJDPvJynGqVfxjJMkMjXJIPhSsa.jpg",
  "Full Metal Jacket": "/kMKyx1k8hWWscYFnPbnxxYAEOoW.jpg",
  "Ordinary People": "/4eFgqxMbFxV7lSjRNphdCJK8VIt.jpg",
  "Driving Miss Daisy": "/vYcFBCj1gqTaFAfFdEiRjeMBBjU.jpg",
  "Blue Velvet": "/p74T3JoHsL1MFMfL5rTgm3OWbeS.jpg",
  "Do the Right Thing": "/v8GAMPFijQddPWPxECDETRfSqfR.jpg",
  "The Shining": "/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",
  "A Nightmare on Elm Street": "/wGTpGGRMZmyFCcrY2mFKBSHoXw1.jpg",
  "The Thing": "/tzGY49kseSE9QAKk47uuDGwnSCu.jpg",
  "Poltergeist": "/2DMJV9RhTtaXnEUmjuqmBj1jCD5.jpg",
  "Gremlins": "/kFNVfJCjs5d4GD5nRt0dxMUcbtC.jpg",
  "The Fly": "/1MYCbEMbXTNjVbaiGJElCOGLkfR.jpg",
  "Friday the 13th": "/HzrPn1gEHWixfMOvOehOTlHROo.jpg",
  "Halloween II": "/wSqAXL1EHVJ3MnDZ7dOucGGMscu.jpg",
  "Christine": "/c0RuUAvsCW9t8gGVLR4cH3EB9t3.jpg",
  "Hellraiser": "/tCBFDCeB3wYlfVHvE06tCOFfoJq.jpg",
  "The Breakfast Club": "/aYPV0pzfoaaCvn9CBfXPqqFMFTi.jpg",
  "Sixteen Candles": "/aXcidnDDnCmoEnc9MIQ7bNlMd2z.jpg",
  "Pretty in Pink": "/cMcggIi3JDvnVfK5BoMTj4BpkCA.jpg",
  "Fast Times at Ridgemont High": "/7jACMfZTM2r0IPo35JxnKbNn7Ix.jpg",
  "Heathers": "/n28BVBzMkim2dO2bInY7vMi1H7r.jpg",
  "Say Anything...": "/mxVMJPx3rqBkRIBIXI5URqV1wdw.jpg",
  "Valley Girl": "/cpf1F0r33EX5vRBPDT1bBBgcj4r.jpg",
  "Some Kind of Wonderful": "/z5WNAhS9DO4BBDNA39MHKGN8hyB.jpg",
  "Weird Science": "/fNOJwol6l1X82A3OQRT2FfdIPKN.jpg",
  "Back to the Future": "/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg",
  "E.T. the Extra-Terrestrial": "/an0UbGBgYMjO5CbRKcMV3UAvAcn.jpg",
  "E.T.": "/an0UbGBgYMjO5CbRKcMV3UAvAcn.jpg",
  "Blade Runner": "/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg",
  "Tron": "/zwSFEczP4eOSCipmqeHBEBJf7HR.jpg",
  "WarGames": "/gOINggBk1iFLTZFDifxFGPaqjzd.jpg",
  "The Last Starfighter": "/an1x4uKGERzVJvZpAo7qMiEMDBX.jpg",
  "Cocoon": "/sLXYEGxwbPIh2FwBcEGdBqO2hJR.jpg",
  "Short Circuit": "/kHSHIYe9sYKehTH97WMQlzL7KYm.jpg",
  "They Live": "/wXlOkp4002hAP7drPaFPmA1kHKH.jpg",
  "Dirty Dancing": "/ePXzWAn8015YPEk3RkEB3GXlhBx.jpg",
  "Flashdance": "/hGGRxjRDBhp2yRRAPRAYBo7FMbt.jpg",
  "An Officer and a Gentleman": "/chQtVijGFPzFMYEnFolk09JbRLU.jpg",
  "When Harry Met Sally...": "/srlSH8mGonEcSvSDlo17RKZNT3Z.jpg",
  "Moonstruck": "/tmHNSJOGjrJwxiPbZBEVlORjCgx.jpg",
  "The Princess Bride": "/gpSiauHMK84aTSAlWpPbCKjJBKQ.jpg"
};

// Enrich movies with poster paths if not already present
const enrichedMovies = movies.map(m => {
  if (!m.poster_path && FALLBACK_POSTERS[m.title]) {
    return {
      ...m,
      poster_path: FALLBACK_POSTERS[m.title],
      poster_url: `https://image.tmdb.org/t/p/w300${FALLBACK_POSTERS[m.title]}`,
      poster_url_large: `https://image.tmdb.org/t/p/w500${FALLBACK_POSTERS[m.title]}`
    };
  }
  return m;
});

// Serialize movie data for embedding
const moviesJSON = JSON.stringify(enrichedMovies);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Amy's 80s Movie Vault</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #1a1520;
  --bg2: #2a2030;
  --bg3: #3a3040;
  --pink: #e8527a;
  --cyan: #00f0ff;
  --yellow: #f0ff00;
  --text: #f0e6d3;
  --text-dim: rgba(240, 230, 211, 0.5);
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Space Mono', monospace;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Scanline overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px);
}

/* CRT vignette */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%);
}

/* ── Header ── */
.header {
  text-align: center;
  padding: 40px 24px 20px;
  position: relative;
}

.site-title {
  font-family: 'Press Start 2P', cursive;
  font-size: clamp(14px, 3vw, 24px);
  color: var(--pink);
  text-shadow: 0 0 7px var(--pink), 0 0 20px var(--pink), 0 0 42px var(--pink), 0 0 80px rgba(232,82,122,0.4);
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.site-subtitle {
  font-size: 13px;
  color: var(--text-dim);
  letter-spacing: 1px;
}

.site-subtitle span { color: var(--cyan); text-shadow: 0 0 8px var(--cyan); }

/* ── Dashboard Collections ── */
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px 30px;
}

.dash-title {
  font-family: 'Press Start 2P', cursive;
  font-size: 11px;
  color: var(--cyan);
  text-shadow: 0 0 7px var(--cyan), 0 0 20px var(--cyan);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.collection-card {
  background: var(--bg2);
  border: 2px solid var(--bg3);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.collection-card .cc-name {
  font-family: 'Press Start 2P', cursive;
  font-size: 10px;
  margin-bottom: 8px;
  line-height: 1.5;
}

.collection-card .cc-count {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 12px;
}

.collection-card .cc-posters {
  display: flex;
  gap: 6px;
}

.collection-card .cc-posters img {
  width: 45px;
  height: 67px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.1);
}

/* Special collection styles */
.collection-card[data-id="Horror Vault"] { border-color: #8b0000; }
.collection-card[data-id="Horror Vault"] .cc-name { color: #ff4444; text-shadow: 0 0 10px rgba(255,68,68,0.5); }
.collection-card[data-id="Horror Vault"]:hover { border-color: #ff4444; box-shadow: 0 8px 32px rgba(139,0,0,0.4); }

.collection-card[data-id="Queer Cinema & Stories"] { border-image: linear-gradient(135deg, #ff0018, #ffa52c, #ffff41, #008018, #0000f9, #86007d) 1; }
.collection-card[data-id="Queer Cinema & Stories"] .cc-name { background: linear-gradient(90deg, #ff0018, #ffa52c, #ffff41, #008018, #0000f9, #86007d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

.collection-card[data-id="John Hughes Universe"] { border-color: #ffaa00; }
.collection-card[data-id="John Hughes Universe"] .cc-name { color: #ffaa00; text-shadow: 0 0 10px rgba(255,170,0,0.4); }
.collection-card[data-id="John Hughes Universe"]:hover { border-color: #ffcc44; box-shadow: 0 8px 32px rgba(255,170,0,0.3); }

.collection-card[data-id="Spielberg Universe"] { border-color: #daa520; }
.collection-card[data-id="Spielberg Universe"] .cc-name { color: #daa520; text-shadow: 0 0 10px rgba(218,165,32,0.4); }
.collection-card[data-id="Spielberg Universe"]:hover { border-color: #ffd700; box-shadow: 0 8px 32px rgba(218,165,32,0.3); }

.collection-card[data-id="Badass Women of the 80s"] { border-color: var(--pink); }
.collection-card[data-id="Badass Women of the 80s"] .cc-name { color: var(--pink); text-shadow: 0 0 10px rgba(232,82,122,0.4); }
.collection-card[data-id="Badass Women of the 80s"]:hover { border-color: #ff6b9d; box-shadow: 0 8px 32px rgba(232,82,122,0.3); }

.collection-card[data-id="Brat Pack"] { border-color: #7c6bff; }
.collection-card[data-id="Brat Pack"] .cc-name { color: #7c6bff; text-shadow: 0 0 10px rgba(124,107,255,0.4); }
.collection-card[data-id="Brat Pack"]:hover { border-color: #9d8fff; box-shadow: 0 8px 32px rgba(124,107,255,0.3); }

.collection-card[data-id="Cult Classics"] { border-color: #33ff33; }
.collection-card[data-id="Cult Classics"] .cc-name { color: #33ff33; text-shadow: 0 0 10px rgba(51,255,51,0.4); }
.collection-card[data-id="Cult Classics"]:hover { border-color: #66ff66; box-shadow: 0 8px 32px rgba(51,255,51,0.3); }

.collection-card[data-id="Iconic Soundtracks"] { border-color: var(--cyan); }
.collection-card[data-id="Iconic Soundtracks"] .cc-name { color: var(--cyan); text-shadow: 0 0 10px rgba(0,240,255,0.4); }
.collection-card[data-id="Iconic Soundtracks"]:hover { border-color: #44ffff; box-shadow: 0 8px 32px rgba(0,240,255,0.3); }

.collection-card[data-id="Underrated Gems"] { border-color: #20b2aa; }
.collection-card[data-id="Underrated Gems"] .cc-name { color: #20b2aa; text-shadow: 0 0 10px rgba(32,178,170,0.4); }
.collection-card[data-id="Underrated Gems"]:hover { border-color: #48d1cc; box-shadow: 0 8px 32px rgba(32,178,170,0.3); }

.collection-card[data-id="Sequels & Franchises"] { border-color: #ff7a45; }
.collection-card[data-id="Sequels & Franchises"] .cc-name { color: #ff7a45; text-shadow: 0 0 10px rgba(255,122,69,0.4); }
.collection-card[data-id="Sequels & Franchises"]:hover { border-color: #ff9966; box-shadow: 0 8px 32px rgba(255,122,69,0.3); }

.collection-card[data-id="Holiday Films"] { border-color: #ff6b6b; }
.collection-card[data-id="Holiday Films"] .cc-name { color: #ff6b6b; text-shadow: 0 0 10px rgba(255,107,107,0.4); }
.collection-card[data-id="Holiday Films"]:hover { border-color: #ff8888; box-shadow: 0 8px 32px rgba(255,107,107,0.3); }

/* ── Sticky Filter Bar ── */
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(26, 21, 32, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 2px solid var(--pink);
  box-shadow: 0 2px 30px rgba(232, 82, 122, 0.25);
  padding: 12px 24px;
}

.filter-top {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-wrap {
  position: relative;
  flex: 1;
  max-width: 360px;
  min-width: 200px;
}

.search-wrap::before {
  content: '>';
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--pink);
  font-family: 'Press Start 2P', cursive;
  font-size: 10px;
}

.search-bar {
  width: 100%;
  padding: 10px 14px 10px 30px;
  background: rgba(255,255,255,0.06);
  border: 1.5px solid rgba(232,82,122,0.4);
  border-radius: 6px;
  color: var(--text);
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-bar::placeholder { color: var(--text-dim); }
.search-bar:focus { border-color: var(--pink); box-shadow: 0 0 12px rgba(232,82,122,0.35); }

.result-count {
  font-size: 11px;
  color: var(--text-dim);
  white-space: nowrap;
}

.result-count span { color: var(--cyan); text-shadow: 0 0 6px var(--cyan); }

.filter-toggle {
  font-family: 'Press Start 2P', cursive;
  font-size: 8px;
  padding: 8px 14px;
  background: rgba(232,82,122,0.1);
  border: 1.5px solid rgba(232,82,122,0.3);
  border-radius: 6px;
  color: var(--text);
  cursor: pointer;
  display: none;
}

.sort-select {
  padding: 8px 12px;
  background: rgba(255,255,255,0.06);
  border: 1.5px solid rgba(232,82,122,0.3);
  border-radius: 6px;
  color: var(--text);
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  outline: none;
  cursor: pointer;
}

.sort-select option { background: var(--bg); color: var(--text); }

.filter-panels {
  overflow: hidden;
  max-height: 300px;
  transition: max-height 0.3s;
}

.filter-panels.collapsed { max-height: 0; }

.filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
  align-items: center;
}

.filter-row-label {
  font-family: 'Press Start 2P', cursive;
  font-size: 7px;
  color: var(--text-dim);
  text-transform: uppercase;
  width: 80px;
  flex-shrink: 0;
}

.filter-pill {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 16px;
  border: 1.5px solid rgba(232,82,122,0.25);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-pill:hover { border-color: var(--pink); background: rgba(232,82,122,0.1); }
.filter-pill.active { background: var(--pink); border-color: var(--pink); color: #fff; box-shadow: 0 0 10px rgba(232,82,122,0.4); }

.active-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.active-tag {
  font-size: 10px;
  padding: 4px 10px;
  background: rgba(0,240,255,0.1);
  border: 1px solid rgba(0,240,255,0.3);
  border-radius: 12px;
  color: var(--cyan);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.active-tag .x { opacity: 0.6; }
.active-tag:hover .x { opacity: 1; }

.clear-all-btn {
  font-size: 10px;
  padding: 4px 10px;
  background: rgba(232,82,122,0.1);
  border: 1px solid rgba(232,82,122,0.3);
  border-radius: 12px;
  color: var(--pink);
  cursor: pointer;
}

/* ── Movie Grid ── */
.grid-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.movie-card {
  cursor: pointer;
  transition: transform 0.25s, opacity 0.3s;
}

.movie-card.hidden { display: none; }

.card-poster {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  border: 2px solid rgba(232,82,122,0.15);
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}

.movie-card:hover .card-poster {
  border-color: var(--pink);
  box-shadow: 0 0 8px rgba(232,82,122,0.4), 0 0 24px rgba(232,82,122,0.2), 0 0 48px rgba(232,82,122,0.1);
  transform: translateY(-4px) scale(1.03);
}

.poster-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.poster-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.year-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-family: 'Press Start 2P', cursive;
  font-size: 7px;
  background: rgba(0,0,0,0.7);
  color: var(--yellow);
  padding: 4px 6px;
  border-radius: 3px;
  text-shadow: 0 0 6px var(--yellow);
  z-index: 2;
}

.rating-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-family: 'Press Start 2P', cursive;
  font-size: 7px;
  background: rgba(0,0,0,0.7);
  color: var(--cyan);
  padding: 4px 6px;
  border-radius: 3px;
  text-shadow: 0 0 6px var(--cyan);
  z-index: 2;
}

.card-title {
  padding: 8px 2px 2px;
  font-weight: 700;
  font-size: 11px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Genre gradient backgrounds */
.genre-grad-Action { background: linear-gradient(135deg, #8b0000, #ff4500); }
.genre-grad-Adventure { background: linear-gradient(135deg, #2e4a1e, #daa520); }
.genre-grad-Animation { background: linear-gradient(135deg, #1a237e, #7c4dff); }
.genre-grad-Comedy { background: linear-gradient(135deg, #b8860b, #ffc53d); }
.genre-grad-Crime { background: linear-gradient(135deg, #1a1a2e, #6b6b6b); }
.genre-grad-Documentary { background: linear-gradient(135deg, #2d3436, #636e72); }
.genre-grad-Drama { background: linear-gradient(135deg, #1a3a5c, #69c0ff); }
.genre-grad-Fantasy { background: linear-gradient(135deg, #2d1b69, #b37feb); }
.genre-grad-Holiday { background: linear-gradient(135deg, #1b5e20, #c62828); }
.genre-grad-Horror { background: linear-gradient(135deg, #1a0a0a, #8b0000); }
.genre-grad-Musical { background: linear-gradient(135deg, #4a148c, #ce93d8); }
.genre-grad-Romance { background: linear-gradient(135deg, #880e4f, #ff85c0); }
.genre-grad-Sci-Fi { background: linear-gradient(135deg, #0d1b2a, #00f0ff); }
.genre-grad-Sports { background: linear-gradient(135deg, #1b5e20, #4caf50); }
.genre-grad-Teen { background: linear-gradient(135deg, #5c1a3a, #e8527a); }
.genre-grad-Thriller { background: linear-gradient(135deg, #212121, #9e9e9e); }
.genre-grad-War { background: linear-gradient(135deg, #1b3a1a, #556b2f); }

/* Genre neon colors */
.genre-color-Action { color: #ff7a45; }
.genre-color-Adventure { color: #daa520; }
.genre-color-Animation { color: #7c4dff; }
.genre-color-Comedy { color: #ffc53d; }
.genre-color-Crime { color: #9e9e9e; }
.genre-color-Documentary { color: #636e72; }
.genre-color-Drama { color: #69c0ff; }
.genre-color-Fantasy { color: #b37feb; }
.genre-color-Holiday { color: #ff6b6b; }
.genre-color-Horror { color: #ff4444; }
.genre-color-Musical { color: #ce93d8; }
.genre-color-Romance { color: #ff85c0; }
.genre-color-Sci-Fi { color: #00f0ff; }
.genre-color-Sports { color: #4caf50; }
.genre-color-Teen { color: #e8527a; }
.genre-color-Thriller { color: #9e9e9e; }
.genre-color-War { color: #556b2f; }

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 10000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

.modal-overlay.open { display: flex; }

.modal {
  background: var(--bg2);
  border: 2px solid var(--pink);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  display: flex;
  gap: 24px;
  padding: 24px;
  position: relative;
  box-shadow: 0 0 40px rgba(232,82,122,0.3), 0 0 80px rgba(232,82,122,0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  font-family: 'Press Start 2P', cursive;
  font-size: 14px;
  color: var(--text-dim);
  cursor: pointer;
  background: none;
  border: none;
  z-index: 2;
  transition: color 0.2s;
}

.modal-close:hover { color: var(--pink); }

.modal-poster {
  flex: 0 0 220px;
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.modal-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-poster .poster-bg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
}

.modal-info {
  flex: 1;
  min-width: 0;
}

.modal-title {
  font-family: 'Press Start 2P', cursive;
  font-size: clamp(12px, 2vw, 16px);
  color: var(--pink);
  text-shadow: 0 0 7px var(--pink), 0 0 20px var(--pink);
  margin-bottom: 8px;
  line-height: 1.4;
}

.modal-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 13px;
}

.modal-year { color: var(--yellow); text-shadow: 0 0 6px var(--yellow); font-weight: 700; }
.modal-rating { color: var(--cyan); text-shadow: 0 0 6px var(--cyan); }

.modal-genres {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.modal-genre-tag {
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid;
  font-weight: 700;
}

.modal-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.modal-badge {
  font-size: 9px;
  padding: 3px 8px;
  border-radius: 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  color: var(--text-dim);
}

.modal-section { margin-bottom: 14px; }

.modal-section-title {
  font-family: 'Press Start 2P', cursive;
  font-size: 8px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.modal-director { font-size: 14px; font-weight: 700; }

.modal-cast-list {
  list-style: none;
  font-size: 12px;
  line-height: 1.8;
}

.modal-cast-list .character { color: var(--text-dim); }

.modal-overview {
  font-size: 13px;
  line-height: 1.6;
  color: rgba(240,230,211,0.85);
}

.modal-notes {
  background: rgba(232,82,122,0.08);
  border-left: 3px solid var(--pink);
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
  font-size: 13px;
  line-height: 1.6;
  font-style: italic;
  color: rgba(240,230,211,0.9);
}

/* ── Footer ── */
.footer {
  text-align: center;
  padding: 40px 24px;
  border-top: 1px solid var(--bg3);
  margin-top: 40px;
}

.footer-text {
  font-family: 'Press Start 2P', cursive;
  font-size: 9px;
  color: var(--text-dim);
  line-height: 2;
}

.footer-text a { color: var(--pink); text-decoration: none; }
.footer-text a:hover { text-shadow: 0 0 8px var(--pink); }

/* ── Back to Top ── */
.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--pink);
  color: #fff;
  border: none;
  font-size: 20px;
  cursor: pointer;
  z-index: 5000;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s;
  box-shadow: 0 0 16px rgba(232,82,122,0.4);
}

.back-to-top.visible { opacity: 1; transform: translateY(0); }

/* ── Mobile ── */
@media (max-width: 768px) {
  .filter-toggle { display: block; }
  .filter-panels { max-height: 0; }
  .filter-panels.expanded { max-height: 400px; }
  .filter-row-label { width: 60px; font-size: 6px; }

  .movie-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }

  .modal { flex-direction: column; padding: 16px; }
  .modal-poster { flex: none; width: 100%; max-width: 250px; margin: 0 auto; }

  .collections-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .collection-card { padding: 14px; }
  .collection-card .cc-name { font-size: 8px; }
}

@media (max-width: 480px) {
  .movie-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .collections-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<!-- Header -->
<div class="header">
  <h1 class="site-title">AMY'S 80s MOVIE VAULT</h1>
  <p class="site-subtitle"><span>${enrichedMovies.length}</span> Films &mdash; The Ultimate Collection</p>
</div>

<!-- Dashboard -->
<div class="dashboard" id="dashboard">
  <div class="dash-title">Collections &amp; Curated Sections</div>
  <div class="collections-grid" id="collectionsGrid"></div>
</div>

<!-- Filter Bar -->
<div class="filter-bar" id="filterBar">
  <div class="filter-top">
    <div class="search-wrap">
      <input type="text" class="search-bar" id="searchBar" placeholder="SEARCH MOVIES..." autocomplete="off">
    </div>
    <div class="result-count" id="resultCount">Showing <span>${enrichedMovies.length}</span> of ${enrichedMovies.length} films</div>
    <select class="sort-select" id="sortSelect">
      <option value="title-asc">Title A-Z</option>
      <option value="title-desc">Title Z-A</option>
      <option value="year-asc">Year (oldest)</option>
      <option value="year-desc">Year (newest)</option>
      <option value="rating-desc">Rating (highest)</option>
    </select>
    <button class="filter-toggle" id="filterToggle">FILTERS</button>
  </div>
  <div class="filter-panels" id="filterPanels">
    <div class="filter-row" id="genreFilters">
      <span class="filter-row-label">Genre</span>
    </div>
    <div class="filter-row" id="yearFilters">
      <span class="filter-row-label">Years</span>
    </div>
    <div class="filter-row" id="sectionFilters">
      <span class="filter-row-label">Sections</span>
    </div>
    <div class="filter-row" id="collectionFilters">
      <span class="filter-row-label">Collections</span>
    </div>
  </div>
  <div class="active-filters" id="activeFilters"></div>
</div>

<!-- Movie Grid -->
<div class="grid-container">
  <div class="movie-grid" id="movieGrid"></div>
</div>

<!-- Modal -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal" id="modal">
    <button class="modal-close" id="modalClose">&times;</button>
    <div class="modal-poster" id="modalPoster"></div>
    <div class="modal-info" id="modalInfo"></div>
  </div>
</div>

<!-- Footer -->
<div class="footer">
  <p class="footer-text">Built with love for the Bramily<br>
  <a href="index.html">&larr; Design Gallery</a></p>
</div>

<button class="back-to-top" id="backToTop">&uarr;</button>

<script>
// ── Movie Data ──
const MOVIES = ${moviesJSON};

// ── Genre Config ──
const GENRE_ICONS = {
  Action: '💥', Adventure: '🗺️', Animation: '🎨', Comedy: '😂',
  Crime: '🔫', Documentary: '📹', Drama: '🎭', Fantasy: '🧙',
  Holiday: '🎄', Horror: '👻', Musical: '🎵', Romance: '💕',
  'Sci-Fi': '🚀', Sports: '🏆', Teen: '🎒', Thriller: '🔪', War: '⚔️'
};

const GENRE_COLORS = {
  Action: '#ff7a45', Adventure: '#daa520', Animation: '#7c4dff', Comedy: '#ffc53d',
  Crime: '#9e9e9e', Documentary: '#636e72', Drama: '#69c0ff', Fantasy: '#b37feb',
  Holiday: '#ff6b6b', Horror: '#ff4444', Musical: '#ce93d8', Romance: '#ff85c0',
  'Sci-Fi': '#00f0ff', Sports: '#4caf50', Teen: '#e8527a', Thriller: '#9e9e9e', War: '#556b2f'
};

// All filter categories
const ALL_GENRES = ${JSON.stringify(vault.genres)};
const ALL_SECTIONS = ${JSON.stringify(vault.special_sections)};
const ALL_COLLECTIONS = ${JSON.stringify(vault.collections)};
const YEAR_RANGES = [
  { label: '1980-82', min: 1980, max: 1982 },
  { label: '1983-85', min: 1983, max: 1985 },
  { label: '1986-88', min: 1986, max: 1988 },
  { label: '1989', min: 1989, max: 1989 }
];

// ── State ──
let activeGenre = null;
let activeYear = null;
let activeSection = null;
let activeCollection = null;
let searchQuery = '';
let sortBy = 'title-asc';

// ── Build Collections Dashboard ──
function buildDashboard() {
  const grid = document.getElementById('collectionsGrid');
  const allGroups = [
    ...ALL_SECTIONS.map(s => ({ id: s, type: 'section' })),
    ...ALL_COLLECTIONS.filter(c => !ALL_SECTIONS.includes(c)).map(c => ({ id: c, type: 'collection' }))
  ];

  allGroups.forEach(group => {
    const movies = MOVIES.filter(m => {
      if (group.type === 'section') return (m.special_sections || []).includes(group.id);
      return (m.collections || []).includes(group.id);
    });
    if (movies.length === 0) return;

    const card = document.createElement('div');
    card.className = 'collection-card';
    card.dataset.id = group.id;
    card.dataset.type = group.type;

    const postersWithImages = movies.filter(m => m.poster_path || m.poster_url);
    const previewMovies = postersWithImages.slice(0, 4);

    let postersHTML = previewMovies.map(m => {
      const url = m.poster_url || (m.poster_path ? 'https://image.tmdb.org/t/p/w92' + m.poster_path : '');
      if (!url) return '';
      return '<img src="' + url.replace('/w300/', '/w92/').replace('/w300', '/w92') + '" alt="" loading="lazy" onerror="this.remove()">';
    }).join('');

    card.innerHTML =
      '<div class="cc-name">' + group.id + '</div>' +
      '<div class="cc-count">' + movies.length + ' films</div>' +
      '<div class="cc-posters">' + postersHTML + '</div>';

    card.addEventListener('click', () => {
      // Clear other filters, set this one
      activeGenre = null; activeYear = null; activeSection = null; activeCollection = null;
      if (group.type === 'section') activeSection = group.id;
      else activeCollection = group.id;
      updateFilterUI();
      applyFilters();
      document.getElementById('filterBar').scrollIntoView({ behavior: 'smooth' });
    });

    grid.appendChild(card);
  });
}

// ── Build Filter Pills ──
function buildFilters() {
  const genreRow = document.getElementById('genreFilters');
  ALL_GENRES.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill';
    btn.textContent = g;
    btn.dataset.genre = g;
    btn.style.borderColor = GENRE_COLORS[g] || 'var(--pink)';
    btn.addEventListener('click', () => {
      activeGenre = activeGenre === g ? null : g;
      updateFilterUI();
      applyFilters();
    });
    genreRow.appendChild(btn);
  });

  const yearRow = document.getElementById('yearFilters');
  YEAR_RANGES.forEach(yr => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill';
    btn.textContent = yr.label;
    btn.dataset.year = yr.label;
    btn.addEventListener('click', () => {
      activeYear = activeYear === yr.label ? null : yr.label;
      updateFilterUI();
      applyFilters();
    });
    yearRow.appendChild(btn);
  });

  const sectionRow = document.getElementById('sectionFilters');
  ALL_SECTIONS.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill';
    btn.textContent = s;
    btn.dataset.section = s;
    btn.addEventListener('click', () => {
      activeSection = activeSection === s ? null : s;
      updateFilterUI();
      applyFilters();
    });
    sectionRow.appendChild(btn);
  });

  const collRow = document.getElementById('collectionFilters');
  ALL_COLLECTIONS.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill';
    btn.textContent = c;
    btn.dataset.collection = c;
    btn.addEventListener('click', () => {
      activeCollection = activeCollection === c ? null : c;
      updateFilterUI();
      applyFilters();
    });
    collRow.appendChild(btn);
  });
}

function updateFilterUI() {
  document.querySelectorAll('#genreFilters .filter-pill').forEach(b => b.classList.toggle('active', b.dataset.genre === activeGenre));
  document.querySelectorAll('#yearFilters .filter-pill').forEach(b => b.classList.toggle('active', b.dataset.year === activeYear));
  document.querySelectorAll('#sectionFilters .filter-pill').forEach(b => b.classList.toggle('active', b.dataset.section === activeSection));
  document.querySelectorAll('#collectionFilters .filter-pill').forEach(b => b.classList.toggle('active', b.dataset.collection === activeCollection));

  // Active filter tags
  const container = document.getElementById('activeFilters');
  container.innerHTML = '';
  const filters = [];
  if (activeGenre) filters.push({ label: activeGenre, clear: () => { activeGenre = null; } });
  if (activeYear) filters.push({ label: activeYear, clear: () => { activeYear = null; } });
  if (activeSection) filters.push({ label: activeSection, clear: () => { activeSection = null; } });
  if (activeCollection) filters.push({ label: activeCollection, clear: () => { activeCollection = null; } });
  if (searchQuery) filters.push({ label: '"' + searchQuery + '"', clear: () => { searchQuery = ''; document.getElementById('searchBar').value = ''; } });

  filters.forEach(f => {
    const tag = document.createElement('span');
    tag.className = 'active-tag';
    tag.innerHTML = f.label + ' <span class="x">&times;</span>';
    tag.addEventListener('click', () => { f.clear(); updateFilterUI(); applyFilters(); });
    container.appendChild(tag);
  });

  if (filters.length > 1) {
    const clearAll = document.createElement('span');
    clearAll.className = 'clear-all-btn';
    clearAll.textContent = 'Clear all';
    clearAll.addEventListener('click', () => {
      activeGenre = null; activeYear = null; activeSection = null; activeCollection = null;
      searchQuery = ''; document.getElementById('searchBar').value = '';
      updateFilterUI(); applyFilters();
    });
    container.appendChild(clearAll);
  }
}

// ── Build Movie Grid ──
function buildGrid() {
  const grid = document.getElementById('movieGrid');
  grid.innerHTML = '';

  MOVIES.forEach((movie, idx) => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.idx = idx;

    const genre = movie.genres[0] || 'Drama';
    const gradClass = 'genre-grad-' + genre.replace(/[^a-zA-Z-]/g, '');
    const posterUrl = movie.poster_url || (movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : '');
    const icon = GENRE_ICONS[genre] || '🎬';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '';

    let posterHTML = '<div class="poster-bg ' + gradClass + '">' + icon + '</div>';
    if (posterUrl) {
      posterHTML += '<img class="poster-img" src="' + posterUrl + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" loading="lazy" onerror="this.remove()">';
    }

    card.innerHTML =
      '<div class="card-poster">' +
        posterHTML +
        '<div class="year-badge">' + movie.year + '</div>' +
        (rating ? '<div class="rating-badge">' + rating + '</div>' : '') +
      '</div>' +
      '<div class="card-title">' + movie.title + '</div>';

    card.addEventListener('click', () => openModal(idx));
    grid.appendChild(card);
  });
}

// ── Filtering ──
function applyFilters() {
  const cards = document.querySelectorAll('.movie-card');
  let visibleCount = 0;
  const q = searchQuery.toLowerCase();

  const yearRange = activeYear ? YEAR_RANGES.find(yr => yr.label === activeYear) : null;

  cards.forEach(card => {
    const movie = MOVIES[parseInt(card.dataset.idx)];
    let visible = true;

    if (q && !movie.title.toLowerCase().includes(q)) visible = false;
    if (activeGenre && !movie.genres.includes(activeGenre)) visible = false;
    if (yearRange && (movie.year < yearRange.min || movie.year > yearRange.max)) visible = false;
    if (activeSection && !(movie.special_sections || []).includes(activeSection)) visible = false;
    if (activeCollection && !(movie.collections || []).includes(activeCollection)) visible = false;

    card.classList.toggle('hidden', !visible);
    if (visible) visibleCount++;
  });

  document.getElementById('resultCount').innerHTML = 'Showing <span>' + visibleCount + '</span> of ' + MOVIES.length + ' films';
}

// ── Sorting ──
function applySorting() {
  const grid = document.getElementById('movieGrid');
  const cards = [...grid.children];

  cards.sort((a, b) => {
    const ma = MOVIES[parseInt(a.dataset.idx)];
    const mb = MOVIES[parseInt(b.dataset.idx)];
    switch (sortBy) {
      case 'title-asc': return ma.title.localeCompare(mb.title);
      case 'title-desc': return mb.title.localeCompare(ma.title);
      case 'year-asc': return ma.year - mb.year || ma.title.localeCompare(mb.title);
      case 'year-desc': return mb.year - ma.year || ma.title.localeCompare(mb.title);
      case 'rating-desc': return (mb.vote_average || 0) - (ma.vote_average || 0) || ma.title.localeCompare(mb.title);
      default: return 0;
    }
  });

  cards.forEach(c => grid.appendChild(c));
}

// ── Modal ──
function openModal(idx) {
  const movie = MOVIES[idx];
  const overlay = document.getElementById('modalOverlay');
  const posterDiv = document.getElementById('modalPoster');
  const infoDiv = document.getElementById('modalInfo');

  const genre = movie.genres[0] || 'Drama';
  const gradClass = 'genre-grad-' + genre.replace(/[^a-zA-Z-]/g, '');
  const posterUrl = movie.poster_url_large || movie.poster_url || (movie.poster_path ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path : '');

  let posterHTML = '<div class="poster-bg ' + gradClass + '">' + (GENRE_ICONS[genre] || '🎬') + '</div>';
  if (posterUrl) {
    posterHTML += '<img src="' + posterUrl + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" onerror="this.remove()">';
  }
  posterDiv.innerHTML = posterHTML;

  let html = '<div class="modal-title">' + movie.title + '</div>';
  html += '<div class="modal-meta">';
  html += '<span class="modal-year">' + movie.year + '</span>';
  if (movie.vote_average) html += '<span class="modal-rating">&#9733; ' + movie.vote_average.toFixed(1) + '/10</span>';
  html += '</div>';

  // Genres
  html += '<div class="modal-genres">';
  movie.genres.forEach(g => {
    const col = GENRE_COLORS[g] || '#888';
    html += '<span class="modal-genre-tag" style="color:' + col + ';border-color:' + col + '">' + g + '</span>';
  });
  html += '</div>';

  // Badges (sections + collections)
  const badges = [...(movie.special_sections || []), ...(movie.collections || [])];
  if (badges.length) {
    html += '<div class="modal-badges">';
    badges.forEach(b => { html += '<span class="modal-badge">' + b + '</span>'; });
    html += '</div>';
  }

  // Director
  if (movie.director) {
    html += '<div class="modal-section"><div class="modal-section-title">Director</div><div class="modal-director">' + movie.director + '</div></div>';
  }

  // Cast
  if (movie.cast && movie.cast.length) {
    html += '<div class="modal-section"><div class="modal-section-title">Cast</div><ul class="modal-cast-list">';
    movie.cast.forEach(c => {
      html += '<li>' + c.name + (c.character ? ' <span class="character">as ' + c.character + '</span>' : '') + '</li>';
    });
    html += '</ul></div>';
  }

  // Overview
  if (movie.overview) {
    html += '<div class="modal-section"><div class="modal-section-title">Synopsis</div><div class="modal-overview">' + movie.overview + '</div></div>';
  }

  // Amy's Notes
  if (movie.notes) {
    html += '<div class="modal-section"><div class="modal-section-title">Amy\\'s Notes</div><div class="modal-notes">' + movie.notes + '</div></div>';
  }

  infoDiv.innerHTML = html;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Event Listeners ──
document.getElementById('searchBar').addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  updateFilterUI();
  applyFilters();
});

document.getElementById('sortSelect').addEventListener('change', (e) => {
  sortBy = e.target.value;
  applySorting();
});

document.getElementById('filterToggle').addEventListener('click', () => {
  document.getElementById('filterPanels').classList.toggle('expanded');
  document.getElementById('filterPanels').classList.toggle('collapsed');
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Back to top
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backBtn.classList.toggle('visible', window.scrollY > 400);
});
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Init ──
buildDashboard();
buildFilters();
buildGrid();

// Default: show filters expanded on desktop
if (window.innerWidth > 768) {
  document.getElementById('filterPanels').classList.remove('collapsed');
}
</script>
</body>
</html>`;

fs.writeFileSync('vault.html', html);
console.log(`vault.html generated with ${enrichedMovies.length} movies.`);
console.log(`Movies with posters: ${enrichedMovies.filter(m => m.poster_path || m.poster_url).length}`);
