// src/services/tmdbService.js
import axios from "axios";

/**
 * Put these in your FRONTEND .env (same folder as frontend package.json)
 *
 * REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
 * REACT_APP_TMDB_API_KEY=YOUR_TMDB_V3_KEY
 *
 * (Optional images)
 * REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
 *
 * Then STOP and restart React: Ctrl+C then npm start
 */

const BASE_URL =
  process.env.REACT_APP_TMDB_BASE_URL || "https://api.themoviedb.org/3";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Debug (optional) — remove after it works
// This prints in the BROWSER console (F12), not in the terminal.
console.log("TMDB KEY loaded?", !!API_KEY);

const tmdbAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { accept: "application/json" },
});

// Always attach api_key to every request (prevents missing key issues)
tmdbAPI.interceptors.request.use((config) => {
  if (!API_KEY) {
    throw new Error(
      "Missing TMDB API key. Add REACT_APP_TMDB_API_KEY to your frontend .env and restart npm start."
    );
  }

  config.params = { ...(config.params || {}), api_key: API_KEY };
  return config;
});

function friendlyError(error, fallback) {
  if (error?.response?.data?.status_message) {
    return new Error(error.response.data.status_message);
  }
  if (error?.response) return new Error(`${fallback} (HTTP ${error.response.status})`);
  if (error?.request) return new Error("Network error. Check your internet connection.");
  return new Error(error?.message || fallback);
}

export async function fetchTrendingMovies(timeWindow = "day") {
  try {
    const res = await tmdbAPI.get(`/trending/movie/${timeWindow}`);
    return res.data.results;
  } catch (error) {
    throw friendlyError(error, "Failed to fetch trending movies.");
  }
}

export async function fetchMovieGenres() {
  try {
    const res = await tmdbAPI.get("/genre/movie/list");
    return res.data.genres; // [{id, name}, ...]
  } catch (error) {
    throw friendlyError(error, "Failed to fetch genres.");
  }
}

export async function searchMovies(query, page = 1) {
  try {
    const res = await tmdbAPI.get("/search/movie", {
      params: { query, page, include_adult: false },
    });
    return res.data; // {page, results, total_pages, ...}
  } catch (error) {
    throw friendlyError(error, "Failed to search movies.");
  }
}

export async function fetchMovieDetails(movieId) {
  try {
    const res = await tmdbAPI.get(`/movie/${movieId}`, {
      params: { append_to_response: "videos,credits" },
    });
    return res.data;
  } catch (error) {
    throw friendlyError(error, "Failed to fetch movie details.");
  }
}

export default tmdbAPI;