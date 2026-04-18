import React from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import MovieCard from "../components/movieCard";

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div style={{ padding: 16 }}>
      <h1>Favorites</h1>

      {favorites.length > 0 && (
        <button onClick={clearFavorites} style={{ padding: "8px 12px", cursor: "pointer" }}>
          Clear all
        </button>
      )}

      {favorites.length === 0 ? (
        <p style={{ marginTop: 12 }}>No favorites yet. Add some from the Home page.</p>
      ) : (
        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {favorites.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
}