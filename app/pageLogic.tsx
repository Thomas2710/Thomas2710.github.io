"use client";

import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaInstagram, FaLinkedin, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { categories } from "@/lib/sections";
import ParticleBackground from "./ParticleBackground";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [quote, setQuote] = useState<{ content: string; author: string } | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      try {
        // Try themed quotes (environment / climate / nature)
        const res = await fetch("https://quoteslate.vercel.app/api/quotes/random?tags=happiness,mindfullness,knowledge");
        const data = await res.json();
        console.log("Fetched quote:", data);

        if (data?.quote && data?.author) {
          setQuote({ content: data.quote, author: data.author });
        } else {
          // fallback to general random quote if none found for that tag
          const fallbackRes = await fetch("https://quoteslate.vercel.app/api/quotes/random");
          const fallbackData = await fallbackRes.json();
          setQuote({ content: fallbackData.quote, author: fallbackData.author });
        }
      } catch (error) {
        console.error("Failed to fetch quote:", error);
        // fallback to a static message
        setQuote({
          content: "The Earth is what we all have in common.",
          author: "Wendell Berry",
        });
      }
    }
    fetchQuote();
  }, []);
  return (
    <div className="relative">
      {/* Animated particle background */}
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center text-white text-center px-4">
        {quote ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-2xl md:text-3xl font-light mb-4">&ldquo;{quote.content}&rdquo;</p>
            <p className="text-lg md:text-xl text-gray-300">— {quote.author}</p>
          </motion.div>
        ) : (
          <p className="text-gray-400 text-lg">Loading inspiration...</p>
        )}
      </section>
    
    </div>
  );
}
