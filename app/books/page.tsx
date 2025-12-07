"use client";

import React, { useEffect, useState } from "react";
import { StatIcons } from "@/components/ui/StatBar";
import { HeartFull, HeartEmpty } from "@/components/ui/StatBar"; // e.g., rating
import { ShieldFull, ShieldEmpty } from "@/components/ui/StatBar"; // e.g., pages read

interface Book {
  id: string;
  title: string;
  author?: string;
  year?: string;
  pages?: string;
  publisher?: string;
  language?: string;
  categories?: string;
  plot?: string;
  cover?: string;
  read?: boolean;
  rating?: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [readFilter, setReadFilter] = useState<"all" | "read" | "notRead">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [sortField, setSortField] = useState<"rating" | "year" | "pages">("year");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        if (Array.isArray(data)) setBooks(data);
        else setBooks([]);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const allCategories = Array.from(new Set(books.flatMap((b) => b.categories?.split(",") ?? []))).filter(Boolean);

  const filteredBooks = books
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
    .filter((b) => {
      if (readFilter === "read") return b.read;
      if (readFilter === "notRead") return !b.read;
      return true;
    })
    .filter((b) => {
      if (categoryFilter === "all") return true;
      return b.categories?.split(",").includes(categoryFilter);
    })
    .sort((a, b) => {
      let aVal: number = 0;
      let bVal: number = 0;

      if (sortField === "rating") {
        aVal = parseFloat(a.rating || "0");
        bVal = parseFloat(b.rating || "0");
      } else if (sortField === "year") {
        aVal = parseInt(a.year || "0");
        bVal = parseInt(b.year || "0");
      } else if (sortField === "pages") {
        aVal = parseInt(a.pages || "0");
        bVal = parseInt(b.pages || "0");
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  if (loading) {
    return (
      <main style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "#444",
        color: "white",
        fontFamily: "'Press Start 2P', cursive",
      }}>
        Loading books…
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#444", minHeight: "100vh", padding: "1rem", fontFamily: "'Press Start 2P', cursive", color: "#e2e8f0" }}>

      {/* Filters */}
      
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between", // <-- space-between separates left and right
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {/* LEFT: filters */}
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
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value as any)}
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
            <option value="read">Read</option>
            <option value="notRead">Not Read</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "0.8rem",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.7rem",
              border: "3px solid white",
              backgroundColor: "#222",
              color: "white",
            }}
          >
            <option value="all">All categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
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
            <option value="year">Year</option>
            <option value="pages">Pages</option>
            <option value="rating">Your Rating</option>
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

        {/* RIGHT: legend */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            minWidth: "100px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            <HeartFull /> = My rating
          </div>
        </div>
      </div>


      {/* Results count */}
      <div style={{ marginBottom: "0.5rem", fontSize: "0.7rem" }}>
        {filteredBooks.length} results
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book)}
            style={{
              backgroundColor: "#222",
              border: "3px solid white",
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
            {book.cover && <img src={book.cover} alt={book.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", marginBottom: "0.5rem" }} />}
            <h3 style={{ fontSize: "0.8rem", textAlign: "center", height: "2.6rem", overflow: "hidden" }}>{book.title}</h3>
            <div style={{ marginTop: "auto", width: "100%" }}>
              <StatIcons label="Rating" value={parseFloat(book.rating ?? "0")} max={10} fullIcon={HeartFull} emptyIcon={HeartEmpty} />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedBook && (
        <div
          onClick={() => setSelectedBook(null)}
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.9)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100, overflowY: "auto", padding: "1rem" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#222", border: "3px solid white", padding: "1rem", width: "100%", maxWidth: "900px", color: "white", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-start" }}>
              {selectedBook.cover && <img src={selectedBook.cover} alt={selectedBook.title} style={{ width: "100%", maxWidth: "200px", aspectRatio: "2/3", objectFit: "cover", border: "2px solid white", flexShrink: 0 }} />}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, minWidth: "150px" }}>
                <h2 style={{ fontSize: "0.9rem" }}>{selectedBook.title}</h2>
                {selectedBook.author && <p>Author: {selectedBook.author}</p>}
                {selectedBook.year && <p>Year: {selectedBook.year}</p>}
                {selectedBook.pages && <p>Pages: {selectedBook.pages}</p>}
                {selectedBook.publisher && <p>Publisher: {selectedBook.publisher}</p>}
                {selectedBook.language && <p>Language: {selectedBook.language}</p>}
                {selectedBook.read !== undefined && <p>Read: {selectedBook.read ? "✔️" : "❌"}</p>}
              </div>
            </div>
            {selectedBook.plot && (
              <div>
                <h3>Plot</h3>
                <p>{selectedBook.plot}</p>
              </div>
            )}
            <button onClick={() => setSelectedBook(null)} style={{ alignSelf: "flex-end", padding: "0.5rem 1rem", border: "3px solid white", backgroundColor: "#222", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
