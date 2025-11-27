"use client";

import React, { useEffect, useState } from "react";
import { StatBar } from "@/components/ui/StatBar";


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

  // Filters
  const [watchedFilter, setWatchedFilter] = useState<"all" | "watched" | "notWatched">("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");

  // Sort
  const [sortField, setSortField] = useState<"imdb" | "rating" | "year">("imdb");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal
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

  // Extract all genres for filter dropdown
  const allGenres = Array.from(new Set(movies.flatMap((m) => m.genre?.split(",") ?? []))).filter(Boolean);

  // Apply search + filters + sort
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
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      if (sortField === "imdb") {
        aVal = parseFloat(a.imdb_score || "0");
        bVal = parseFloat(b.imdb_score || "0");
      } else if (sortField === "rating") {
        aVal = parseFloat(a.rating || "0");
        bVal = parseFloat(b.rating || "0");
      } else if (sortField === "year") {
        aVal = parseInt(a.year || "0");
        bVal = parseInt(b.year || "0");
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
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
        }}
      >
        Loading movies…
      </main>
    );
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "1rem",
        backgroundColor: "#444444",
        minHeight: "100vh",
      }}
    >
      {/* Top controls: search + filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "0.5rem",
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "0.8rem",
            border: "2px solid white",
            borderRadius: "4px",
            backgroundColor: "#222",
            color: "white",
            outline: "none",
          }}
        />
        <select
          value={watchedFilter}
          onChange={(e) => setWatchedFilter(e.target.value as any)}
          style={{
            padding: "0.5rem",
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "0.7rem",
            border: "2px solid white",
            borderRadius: "4px",
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
            padding: "0.5rem",
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "0.7rem",
            border: "2px solid white",
            borderRadius: "4px",
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
            padding: "0.5rem",
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "0.7rem",
            border: "2px solid white",
            borderRadius: "4px",
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
            padding: "0.5rem",
            fontFamily: "'Press Start 2P', cursive",
            fontSize: "0.7rem",
            border: "2px solid white",
            borderRadius: "4px",
            backgroundColor: "#222",
            color: "white",
          }}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Results count */}
      <div
        style={{
          marginTop: "0.5rem",
          color: "white",
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "0.7rem",
        }}
      >
        {filteredMovies.length} results
      </div>

      {/* Movies grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "0.5rem",
        }}
      >
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            style={{
              backgroundColor: "#222",
              color: "white",
              border: "2px solid white",
              borderRadius: "8px",
              padding: "0.5rem",
              width: "220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontFamily: "'Press Start 2P', cursive",
              cursor: "pointer",
            }}
          >
            {movie.poster && (
            <div
                style={{
                width: "100%",
                aspectRatio: "2/3", // maintains poster ratio
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#222", // matches card background
                borderRadius: "4px",
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
                    objectFit: "contain", // ensures full poster is visible
                }}
                />
            </div>
            )}

            <h3 style={{ fontSize: "0.9rem", textAlign: "center" }}>{movie.title}</h3>
            {movie.imdb_score && (
              <StatBar
                label="HP"
                value={parseFloat(movie.imdb_score)}
                color="limegreen"
              />
            )}

            {movie.rating && (
              <StatBar
                label="MP"
                value={parseFloat(movie.rating)}
                color="dodgerblue"
              />
            )}


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
            backgroundColor: "rgba(0,0,0,0.85)",
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
              border: "2px solid white",
              borderRadius: "8px",
              padding: "1rem",
              maxWidth: "900px",
              width: "100%",
              color: "white",
              fontFamily: "'Press Start 2P', cursive",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Top section: image + main fields */}
            <div style={{ display: "flex", gap: "1rem" }}>
              {selectedMovie.poster && (
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  style={{
                    width: "200px",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <h2>{selectedMovie.title}</h2>
                {selectedMovie.imdb_score && (
                  <StatBar
                    label="HP"
                    value={parseFloat(selectedMovie.imdb_score)}
                    color="limegreen"
                  />
                )}
                {selectedMovie.rating && (
                  <StatBar
                    label="MP"
                    value={parseFloat(selectedMovie.rating)}
                    color="dodgerblue"
                  />
                )}
                {selectedMovie.year && <p>Year: {selectedMovie.year}</p>}
                {selectedMovie.genre && <p>Genre: {selectedMovie.genre}</p>}
                {selectedMovie.director && <p>Director: {selectedMovie.director}</p>}
                {selectedMovie.actors && <p>Actors: {selectedMovie.actors}</p>}
                {selectedMovie.imdb_score && <p>IMDb Score: {selectedMovie.imdb_score}</p>}
                {selectedMovie.watched !== undefined && <p>Watched: {selectedMovie.watched ? "✔️" : "❌"}</p>}
                {selectedMovie.rating && <p>Your rating: {selectedMovie.rating}</p>}
                {selectedMovie.runtime && <p>Runtime: {selectedMovie.runtime}</p>}
              </div>
            </div>

            {/* Plot section */}
            {selectedMovie.plot && (
              <div style={{ marginTop: "1rem" }}>
                <h3>Plot</h3>
                <p style={{ marginTop: "0.5rem" }}>{selectedMovie.plot}</p>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setSelectedMovie(null)}
              style={{
                alignSelf: "flex-end",
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                fontFamily: "'Press Start 2P', cursive",
                border: "2px solid white",
                borderRadius: "4px",
                backgroundColor: "#222",
                color: "white",
                cursor: "pointer",
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
