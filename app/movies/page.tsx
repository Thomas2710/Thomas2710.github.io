"use client";

import React, { useEffect, useState } from "react";
import { StatIcons } from "@/components/ui/StatBar";
import { HeartFull, HeartEmpty } from "@/components/ui/StatBar";
import { ShieldFull, ShieldEmpty } from "@/components/ui/StatBar";

interface Movie {
  id: string;
  title: string;
  year?: string;
  genre?: string;
  director?: string;
  actors?: string;
  plot?: string;
  poster?: string;
  imdb_score?: string;
  watched?: boolean;
  rating?: string;
  runtime?: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [watchedFilter, setWatchedFilter] = useState<"all" | "watched" | "notWatched">("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");

  const [sortField, setSortField] = useState<"imdb" | "rating" | "year">("imdb");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("/api/movies");
        const data = await res.json();
        if (Array.isArray(data)) setMovies(data);
        else setMovies([]);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const allGenres = Array.from(new Set(movies.flatMap((m) => m.genre?.split(",") ?? []))).filter(Boolean);


  function toNum(v?: string) {
    if (!v) return -Infinity;
    const cleaned = v.replace(",", ".").trim();
    const n = Number(cleaned);
    return isFinite(n) ? n : -Infinity;
  }

  const filteredMovies = movies
    .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    .filter((m) => {
      if (watchedFilter === "watched") return m.watched;
      if (watchedFilter === "notWatched") return !m.watched;
      return true;
    })
    .filter((m) => {
      if (genreFilter === "all") return true;
      return m.genre?.split(",").includes(genreFilter);
    })
    .sort((a, b) => {
      const aVal =
        sortField === "imdb"
          ? toNum(a.imdb_score)
          : sortField === "rating"
          ? toNum(a.rating)
          : toNum(a.year);

      const bVal =
        sortField === "imdb"
          ? toNum(b.imdb_score)
          : sortField === "rating"
          ? toNum(b.rating)
          : toNum(b.year);

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });


  if (loading) {
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          backgroundColor: "#444444",
          color: "white",
          fontFamily: "'Press Start 2P', cursive",
        }}
      >
        Loading movies…
      </main>
    );
  }

  return (
    <main
      style={{
        backgroundColor: "#444444",
        minHeight: "100vh",
        padding: "1rem",
        fontFamily: "'Press Start 2P', cursive",
        color: "#e2e8f0",
      }}
    >
      {/* Filters + legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            flex: 1,
            minWidth: "200px",
          }}
        >
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: "120px",
              maxWidth: "300px",
              padding: "0.8rem",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.7rem",
              border: "3px solid white",
              backgroundColor: "#222",
              color: "white",
              outline: "none",
            }}
          />
          <select
            value={watchedFilter}
            onChange={(e) => setWatchedFilter(e.target.value as any)}
            style={{
              padding: "0.8rem",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.7rem",
              border: "3px solid white",
              backgroundColor: "#222",
              color: "white",
            }}
          >
            <option value="all">All</option>
            <option value="watched">Watched</option>
            <option value="notWatched">Not Watched</option>
          </select>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            style={{
              padding: "0.8rem",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.7rem",
              border: "3px solid white",
              backgroundColor: "#222",
              color: "white",
            }}
          >
            <option value="all">All genres</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            style={{
              padding: "0.8rem",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.7rem",
              border: "3px solid white",
              backgroundColor: "#222",
              color: "white",
            }}
          >
            <option value="imdb">IMDb Score</option>
            <option value="rating">Your Rating</option>
            <option value="year">Year</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            style={{
              padding: "0.8rem",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.7rem",
              border: "3px solid white",
              backgroundColor: "#222",
              color: "white",
            }}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            <HeartFull /> = IMDb Score
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            <ShieldFull /> = My Rating
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: "0.5rem", fontSize: "0.7rem" }}>
        {filteredMovies.length} results
      </div>

      {/* Movies grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => e.key === "Enter" && setSelectedMovie(movie)}
            style={{
              backgroundColor: "#222",
              border: "3px solid white",
              borderRadius: 0,
              padding: "0.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(2px,2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(0,0)")}
          >
            {movie.poster && (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "2/3",
                  overflow: "hidden",
                  marginBottom: "0.5rem",
                }}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            <h3
              style={{
                fontSize: "0.8rem",
                textAlign: "center",
                height: "2.6rem",
                overflow: "hidden",
              }}
            >
              {movie.title}
            </h3>

            <div style={{ marginTop: "auto", width: "100%" }}>
              <StatIcons
                label="HP"
                value={parseFloat(movie.imdb_score || "0") || 0}
                max={10}
                fullIcon={HeartFull}
                emptyIcon={HeartEmpty}
              />
              <StatIcons
                label="Shield"
                value={parseFloat(movie.rating || "0") || 0}
                max={10}
                fullIcon={ShieldFull}
                emptyIcon={ShieldEmpty}
              />
            </div>
          </div>
        ))}
      </div>

{/* Modal */}
{selectedMovie && (
  <div
    onClick={() => setSelectedMovie(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
      overflowY: "auto",
      padding: "1rem",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: "#222",
        border: "3px solid white",
        borderRadius: 0,
        padding: "1rem",
        width: "100%",
        maxWidth: "900px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        fontFamily: "'Press Start 2P', cursive",
      }}
    >
      {/* Top section: Poster + Info */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        {selectedMovie.poster && (
          <img
            src={selectedMovie.poster}
            alt={selectedMovie.title}
            style={{
              width: "100%",
              maxWidth: "200px",       // caps size on large screens
              aspectRatio: "2/3",      // maintain 2:3 ratio
              objectFit: "cover",
              border: "2px solid white",
              borderRadius: 0,
              flexShrink: 0,
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            flex: 1,
            minWidth: "150px",
          }}
        >
          <h2 style={{ fontSize: "0.9rem" }}>{selectedMovie.title}</h2>

          {/* HP / IMDb Score */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minHeight: "24px" }}>
            <StatIcons
              label="HP"
              value={parseFloat(selectedMovie.imdb_score ?? "0") || 0}
              max={10}
              fullIcon={HeartFull}
              emptyIcon={HeartEmpty}
            />
          </div>

          {/* Shield / Rating - always rendered */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minHeight: "24px" }}>
            <StatIcons
              label="Shield"
              value={parseFloat(selectedMovie.rating ?? "0") || 0}
              max={10}
              fullIcon={ShieldFull}
              emptyIcon={ShieldEmpty}
            />
          </div>

          {selectedMovie.year && <p>Year: {selectedMovie.year}</p>}
          {selectedMovie.genre && <p>Genre: {selectedMovie.genre}</p>}
          {selectedMovie.director && <p>Director: {selectedMovie.director}</p>}
          {selectedMovie.actors && <p>Actors: {selectedMovie.actors}</p>}
          {selectedMovie.watched !== undefined && <p>Watched: {selectedMovie.watched ? "✔️" : "❌"}</p>}
          {selectedMovie.runtime && <p>Runtime: {selectedMovie.runtime}</p>}
        </div>
      </div>

      {/* Plot section */}
      {selectedMovie.plot && (
        <div>
          <h3>Plot</h3>
          <p>{selectedMovie.plot}</p>
        </div>
      )}

      {/* Close button */}
      <button
        onClick={() => setSelectedMovie(null)}
        style={{
          alignSelf: "flex-end",
          padding: "0.5rem 1rem",
          fontFamily: "'Press Start 2P', cursive",
          border: "3px solid white",
          backgroundColor: "#222",
          cursor: "pointer",
          borderRadius: 0,
        }}
      >
        Close
      </button>
    </div>
  </div>
)}

    </main>
  );
}
