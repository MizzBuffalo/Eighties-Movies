#!/usr/bin/env node
/**
 * Fetch all missing TMDB poster data and update vault.html inline MOVIES array
 * Uses the API key already embedded in vault.html
 */
const fs = require('fs');
const https = require('https');

const API_KEY = 'b5be0091e28a74a864c82ec31da4f981';

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function searchMovie(title, year) {
  const query = encodeURIComponent(title);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&year=${year}`;
  const json = await httpGet(url);
  if (json.results && json.results.length > 0) {
    const m = json.results[0];
    return { poster_path: m.poster_path, vote_average: m.vote_average, overview: m.overview, tmdb_id: m.id };
  }
  // Try without year
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

async function main() {
  // Read the vault.html and extract MOVIES array
  const html = fs.readFileSync('vault.html', 'utf8');
  const match = html.match(/const MOVIES = (\[[\s\S]*?\]);\s*\n/);
  if (!match) { console.error('Could not find MOVIES array'); process.exit(1); }

  const movies = JSON.parse(match[1]);
  console.log(`Total movies: ${movies.length}`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];

    // Skip if already has poster data
    if (movie.poster_path || movie.poster_url) {
      console.log(`[${i+1}/${movies.length}] SKIP ${movie.title} (already has poster)`);
      continue;
    }

    try {
      const result = await searchMovie(movie.title, movie.year);
      if (result && result.poster_path) {
        movie.poster_path = result.poster_path;
        movie.poster_url = `https://image.tmdb.org/t/p/w300${result.poster_path}`;
        movie.poster_url_large = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
        if (result.vote_average) movie.vote_average = result.vote_average;
        if (result.overview) movie.overview = result.overview;

        // Fetch credits
        if (result.tmdb_id) {
          await sleep(250);
          const credits = await fetchCredits(result.tmdb_id);
          if (credits.director) movie.director = credits.director;
          if (credits.cast.length > 0) movie.cast = credits.cast;
        }

        updated++;
        console.log(`[${i+1}/${movies.length}] ✓ ${movie.title} (${movie.year})`);
      } else {
        failed++;
        console.log(`[${i+1}/${movies.length}] ✗ ${movie.title} (${movie.year}) — not found`);
      }
    } catch (err) {
      failed++;
      console.error(`[${i+1}/${movies.length}] ERROR: ${movie.title} — ${err.message}`);
    }

    await sleep(300);
  }

  // Write updated MOVIES back into vault.html
  const newMoviesJson = JSON.stringify(movies);
  const newHtml = html.replace(/const MOVIES = \[[\s\S]*?\];\s*\n/, `const MOVIES = ${newMoviesJson};\n`);
  fs.writeFileSync('vault.html', newHtml);

  console.log(`\nDone! Updated ${updated} movies, ${failed} failed.`);
}

main().catch(console.error);
