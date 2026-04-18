// src/pages/HomePage.js
import React, { useEffect, useMemo, useState } from "react";
import MovieCard from "../components/movieCard";
import {
  fetchTrendingMovies,
  fetchMovieGenres,
  searchMovies,
} from "../services/tmdbService";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  const [timeWindow, setTimeWindow] = useState("day"); // day | week
  const [selectedGenreId, setSelectedGenreId] = useState("");

  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState(""); // submitted query
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mode = query ? "search" : "trending";

  // Load genres once
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const g = await fetchMovieGenres();
        if (!cancelled) setGenres(g || []);
      } catch (e) {
        // not fatal
        console.error("Genres load failed:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load trending when not searching
  useEffect(() => {
    if (mode !== "trending") return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const results = await fetchTrendingMovies(timeWindow);
        if (!cancelled) {
          setMovies(results || []);
          setPage(1);
          setTotalPages(1);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load trending movies.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, timeWindow]);

  // Load search results
  useEffect(() => {
    if (mode !== "search") return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await searchMovies(query, page);
        if (!cancelled) {
          setMovies(data?.results || []);
          setTotalPages(data?.total_pages || 1);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Search failed.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, query, page]);

  const filteredMovies = useMemo(() => {
    if (!selectedGenreId) return movies;
    const gid = Number(selectedGenreId);
    return movies.filter(
      (m) => Array.isArray(m.genre_ids) && m.genre_ids.includes(gid)
    );
  }, [movies, selectedGenreId]);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    const q = queryInput.trim();
    setPage(1);
    setQuery(q); // empty => goes back to trending
  };

  const onClear = () => {
    setQueryInput("");
    setQuery("");
    setPage(1);
  };

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ color: "white" }}>Movies</h1>

      {/* Controls */}
      <form
        onSubmit={onSubmitSearch}
        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        <input
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Search movies..."
          style={{ padding: 8, minWidth: 260 }}
        />

        <button type="submit" style={{ padding: "8px 12px" }}>
          Search
        </button>

        <button type="button" onClick={onClear} style={{ padding: "8px 12px" }}>
          Clear
        </button>

        <select
          value={timeWindow}
          onChange={(e) => setTimeWindow(e.target.value)}
          disabled={mode !== "trending"}
          style={{ padding: 8 }}
        >
          <option value="day">Trending: Today</option>
          <option value="week">Trending: This Week</option>
        </select>

        <select
          value={selectedGenreId}
          onChange={(e) => setSelectedGenreId(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.id} value={String(g.id)}>
              {g.name}
            </option>
          ))}
        </select>
      </form>

      {/* Status */}
      <div style={{ marginTop: 10, color: "white" }}>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "tomato" }}>{error}</div>}
        {!loading && !error && (
          <div style={{ opacity: 0.9 }}>
            Mode: <b>{mode}</b>
            {mode === "trending" ? (
              <>
                {" "}
                • Window: <b>{timeWindow}</b>
              </>
            ) : (
              <>
                {" "}
                • Query: <b>{query}</b> • Page: <b>{page}</b>/<b>{totalPages}</b>
              </>
            )}
          </div>
        )}
      </div>

      {/* Pagination (search only) */}
      {mode === "search" && totalPages > 1 && (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 8,
            alignItems: "center",
            color: "white",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>
      )}

      {/* Movies grid */}
      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {filteredMovies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>

      {!loading && !error && filteredMovies.length === 0 && (
        <div style={{ marginTop: 14, color: "white" }}>No movies found.</div>
      )}
    </div>
  );
}