#!/usr/bin/env node
/**
 * TMDB Poster Fetcher for Amy's 80s Movie Vault
 *
 * Usage:
 *   1. Get a free API key at https://www.themoviedb.org/settings/api
 *   2. Run: TMDB_API_KEY=your_key_here node fetch_posters.js
 *   3. This creates movies_with_posters.json with all poster URLs
 *   4. Your HTML files can then use: https://image.tmdb.org/t/p/w300/{poster_path}
 */

const fs = require('fs');
const https = require('https');

const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  console.error('ERROR: Set TMDB_API_KEY environment variable first.');
  console.error('  Get a free key at: https://www.themoviedb.org/settings/api');
  console.error('  Then run: TMDB_API_KEY=your_key node fetch_posters.js');
  process.exit(1);
}

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

async function searchMovie(title, year) {
  const query = encodeURIComponent(title);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&year=${year}`;
  const json = await httpGet(url);

  if (json.results && json.results.length > 0) {
    const movie = json.results[0];
    return {
      tmdb_id: movie.id,
      poster_path: movie.poster_path,
      overview: movie.overview,
      vote_average: movie.vote_average
    };
  }
  return { tmdb_id: null, poster_path: null, overview: null, vote_average: null };
}

async function fetchCredits(tmdbId) {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${API_KEY}`;
  const json = await httpGet(url);

  const director = (json.crew || []).find(c => c.job === 'Director');
  const cast = (json.cast || []).slice(0, 5).map(c => ({
    name: c.name,
    character: c.character
  }));

  return {
    director: director ? director.name : null,
    cast
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const vaultData = JSON.parse(fs.readFileSync('amys_80s_vault.json', 'utf8'));
  const movies = vaultData.movies;
  const results = [];
  let found = 0;
  let missing = 0;

  console.log(`Fetching posters for ${movies.length} movies...`);
  console.log('');

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    try {
      const tmdb = await searchMovie(movie.title, movie.year);

      // Fetch credits if we got a TMDB ID
      let credits = { director: null, cast: [] };
      if (tmdb.tmdb_id) {
        await sleep(200);
        credits = await fetchCredits(tmdb.tmdb_id);
      }

      const enriched = {
        ...movie,
        tmdb_id: tmdb.tmdb_id,
        poster_path: tmdb.poster_path,
        poster_url: tmdb.poster_path
          ? `https://image.tmdb.org/t/p/w300${tmdb.poster_path}`
          : null,
        poster_url_large: tmdb.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
          : null,
        overview: tmdb.overview,
        vote_average: tmdb.vote_average,
        director: credits.director,
        cast: credits.cast
      };

      results.push(enriched);

      if (tmdb.poster_path) {
        found++;
        console.log(`[${i + 1}/${movies.length}] ✓ ${movie.title} (${movie.year})`);
      } else {
        missing++;
        console.log(`[${i + 1}/${movies.length}] ✗ ${movie.title} (${movie.year}) — no poster found`);
      }

      // Rate limit: ~3 requests per second (TMDB allows 40/sec but let's be nice)
      await sleep(350);
    } catch (err) {
      console.error(`[${i + 1}/${movies.length}] ERROR: ${movie.title} — ${err.message}`);
      results.push({ ...movie, tmdb_id: null, poster_path: null, poster_url: null });
      missing++;
      await sleep(1000);
    }
  }

  const output = {
    ...vaultData,
    movies: results
  };

  fs.writeFileSync('movies_with_posters.json', JSON.stringify(output, null, 2));

  console.log('');
  console.log(`Done! Found ${found} posters, ${missing} missing.`);
  console.log('Saved to: movies_with_posters.json');
  console.log('');
  console.log('Poster URLs use this format:');
  console.log('  Small:  https://image.tmdb.org/t/p/w300{poster_path}');
  console.log('  Medium: https://image.tmdb.org/t/p/w500{poster_path}');
  console.log('  Large:  https://image.tmdb.org/t/p/w780{poster_path}');
}

main().catch(console.error);
