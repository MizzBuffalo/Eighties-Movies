#!/usr/bin/env node
/**
 * Fetch ALL missing TMDB poster data and update every vault HTML file.
 *
 * Usage:
 *   node fetch_all_posters.js
 *
 * Requires TMDB_API_KEY in a .env file or as an environment variable.
 * Get a free key at: https://www.themoviedb.org/settings/api
 *
 * What this does:
 *   1. Reads the MOVIES array from vault.html (source of truth)
 *   2. For each movie without poster data, queries TMDB search + credits
 *   3. Writes the enriched MOVIES array back into ALL vault files
 *   4. Saves a poster_cache.json so re-runs skip already-fetched movies
 *
 * Get a free TMDB API key at: https://www.themoviedb.org/settings/api
 */
const fs = require('fs');
const https = require('https');
const path = require('path');

// Auto-load .env if present
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
      const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*?)\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    });
  }
} catch {}

// ── Config ──
const API_KEY = process.env.TMDB_API_KEY;
if (!API_KEY) {
  console.error('ERROR: TMDB_API_KEY not found. Create a .env file with TMDB_API_KEY=your_key');
  process.exit(1);
}
const VAULT_FILES = ['vault.html', 'vault_a.html', 'vault_b.html', 'vault_c.html'];
const CACHE_FILE = 'poster_cache.json';
const RATE_LIMIT_MS = 300;   // ms between API calls (TMDB allows 40/sec)
const MAX_RETRIES = 3;

// ── HTTP helper with retry ──
function httpGet(url, retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 429 && retries > 0) {
          // Rate limited — wait and retry
          const wait = parseInt(res.headers['retry-after'] || '2', 10) * 1000;
          console.log(`  Rate limited, waiting ${wait}ms...`);
          setTimeout(() => httpGet(url, retries - 1).then(resolve, reject), wait);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
          return;
        }
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
      res.on('error', reject);
    });
    req.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => httpGet(url, retries - 1).then(resolve, reject), 1000);
      } else {
        reject(err);
      }
    });
    req.setTimeout(10000, () => {
      req.destroy();
      if (retries > 0) {
        setTimeout(() => httpGet(url, retries - 1).then(resolve, reject), 1000);
      } else {
        reject(new Error('Request timeout'));
      }
    });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── TMDB API calls ──
async function searchMovie(title, year) {
  const query = encodeURIComponent(title);
  // Try with year first
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&year=${year}`;
  const json = await httpGet(url);
  if (json.results && json.results.length > 0) {
    const m = json.results[0];
    return { poster_path: m.poster_path, vote_average: m.vote_average, overview: m.overview, tmdb_id: m.id };
  }
  // Fallback: try without year
  await sleep(RATE_LIMIT_MS);
  const url2 = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
  const json2 = await httpGet(url2);
  if (json2.results && json2.results.length > 0) {
    const m = json2.results[0];
    return { poster_path: m.poster_path, vote_average: m.vote_average, overview: m.overview, tmdb_id: m.id };
  }
  return null;
}

async function fetchCredits(tmdbId) {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${API_KEY}`;
  const json = await httpGet(url);
  const director = (json.crew || []).find(c => c.job === 'Director');
  const cast = (json.cast || []).slice(0, 5).map(c => ({ name: c.name, character: c.character }));
  return { director: director ? director.name : null, cast };
}

// ── Cache ──
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch {}
  return {};
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// ── Extract and replace MOVIES array in HTML ──
function extractMovies(html) {
  const match = html.match(/const MOVIES = (\[[\s\S]*?\]);\s*\n/);
  if (!match) return null;
  return JSON.parse(match[1]);
}

function replaceMovies(html, movies) {
  const json = JSON.stringify(movies);
  return html.replace(/const MOVIES = \[[\s\S]*?\];\s*\n/, `const MOVIES = ${json};\n`);
}

// ── Main ──
async function main() {
  console.log('=== TMDB Poster Fetcher for Amy\'s 80s Movie Vault ===\n');

  // Find the source of truth (first available vault file)
  let sourceFile = null;
  for (const f of VAULT_FILES) {
    if (fs.existsSync(f)) {
      sourceFile = f;
      break;
    }
  }
  if (!sourceFile) {
    console.error('ERROR: No vault HTML files found. Run from the project root.');
    process.exit(1);
  }

  const html = fs.readFileSync(sourceFile, 'utf8');
  const movies = extractMovies(html);
  if (!movies) {
    console.error(`ERROR: Could not find MOVIES array in ${sourceFile}`);
    process.exit(1);
  }

  console.log(`Source: ${sourceFile}`);
  console.log(`Total movies: ${movies.length}`);

  // Load poster cache
  const cache = loadCache();
  const cacheHits = Object.keys(cache).length;
  if (cacheHits > 0) {
    console.log(`Poster cache: ${cacheHits} entries in ${CACHE_FILE}`);
  }

  let updated = 0;
  let skipped = 0;
  let failed = 0;
  let fromCache = 0;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const cacheKey = `${movie.title}|${movie.year}`;

    // Skip if already has poster data baked in
    if (movie.poster_path || movie.poster_url) {
      skipped++;
      // Still save to cache for future reference
      if (!cache[cacheKey] && movie.poster_path) {
        cache[cacheKey] = {
          poster_path: movie.poster_path,
          poster_url: movie.poster_url,
          poster_url_large: movie.poster_url_large,
          vote_average: movie.vote_average,
          overview: movie.overview,
          tmdb_id: movie.tmdb_id,
          director: movie.director,
          cast: movie.cast
        };
      }
      continue;
    }

    // Check local cache first
    if (cache[cacheKey] && cache[cacheKey].poster_path) {
      Object.assign(movie, cache[cacheKey]);
      fromCache++;
      updated++;
      console.log(`[${i+1}/${movies.length}] CACHED ${movie.title} (${movie.year})`);
      continue;
    }

    // Fetch from TMDB
    try {
      const result = await searchMovie(movie.title, movie.year);
      if (result && result.poster_path) {
        movie.tmdb_id = result.tmdb_id;
        movie.poster_path = result.poster_path;
        movie.poster_url = `https://image.tmdb.org/t/p/w300${result.poster_path}`;
        movie.poster_url_large = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
        if (result.vote_average) movie.vote_average = result.vote_average;
        if (result.overview) movie.overview = result.overview;

        // Fetch credits
        if (result.tmdb_id) {
          await sleep(RATE_LIMIT_MS);
          try {
            const credits = await fetchCredits(result.tmdb_id);
            if (credits.director) movie.director = credits.director;
            if (credits.cast && credits.cast.length > 0) movie.cast = credits.cast;
          } catch (credErr) {
            console.log(`  (credits fetch failed: ${credErr.message})`);
          }
        }

        // Save to cache
        cache[cacheKey] = {
          poster_path: movie.poster_path,
          poster_url: movie.poster_url,
          poster_url_large: movie.poster_url_large,
          vote_average: movie.vote_average,
          overview: movie.overview,
          tmdb_id: movie.tmdb_id,
          director: movie.director,
          cast: movie.cast
        };
        saveCache(cache);

        updated++;
        console.log(`[${i+1}/${movies.length}] \u2713 ${movie.title} (${movie.year})`);
      } else {
        // Mark as attempted so we don't keep retrying
        cache[cacheKey] = { _notFound: true };
        saveCache(cache);
        failed++;
        console.log(`[${i+1}/${movies.length}] \u2717 ${movie.title} (${movie.year}) \u2014 not found on TMDB`);
      }
    } catch (err) {
      failed++;
      console.error(`[${i+1}/${movies.length}] ERROR: ${movie.title} \u2014 ${err.message}`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  // ── Write enriched MOVIES into ALL vault files ──
  console.log(`\n--- Writing enriched data to vault files ---`);
  let filesUpdated = 0;

  for (const vaultFile of VAULT_FILES) {
    if (!fs.existsSync(vaultFile)) {
      console.log(`  SKIP ${vaultFile} (not found)`);
      continue;
    }

    const vaultHtml = fs.readFileSync(vaultFile, 'utf8');
    const existingMovies = extractMovies(vaultHtml);
    if (!existingMovies) {
      console.log(`  SKIP ${vaultFile} (no MOVIES array found)`);
      continue;
    }

    const newHtml = replaceMovies(vaultHtml, movies);
    fs.writeFileSync(vaultFile, newHtml);
    filesUpdated++;
    console.log(`  \u2713 ${vaultFile}`);
  }

  // ── Summary ──
  console.log(`\n=== Done! ===`);
  console.log(`  Movies with posters (pre-existing): ${skipped}`);
  console.log(`  Movies enriched from cache:         ${fromCache}`);
  console.log(`  Movies fetched from TMDB:           ${updated - fromCache}`);
  console.log(`  Movies not found:                   ${failed}`);
  console.log(`  Vault files updated:                ${filesUpdated}`);
  console.log(`  Poster cache saved to:              ${CACHE_FILE}`);

  if (failed > 0) {
    console.log(`\nTo retry failed movies, delete their entries from ${CACHE_FILE} and re-run.`);
  }

  const total = skipped + updated;
  const pct = ((total / movies.length) * 100).toFixed(1);
  console.log(`\nPoster coverage: ${total}/${movies.length} (${pct}%)`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
