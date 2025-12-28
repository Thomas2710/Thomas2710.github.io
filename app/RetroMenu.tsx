"use client";

import Link from "next/link";
import { categories } from "@/lib/sections";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RetroMenu() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center bg-black overflow-auto">

      {/* CRT Scanlines */}
      <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_2px,transparent_2px,transparent_4px)]" />

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />

      {/* Menu */}
      <div className="flex flex-col space-y-6 z-50 items-center">

        {/* LOGO */}
        <motion.img
          src="/logo.png"
          alt="Site Logo"
          className="w-48 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Main Categories */}
        {categories.map((cat, i) => (
          <CategoryItem key={cat.name} cat={cat} index={i} />
        ))}

      </div>
    </div>
  );
}

// Component for a single category
function CategoryItem({ cat, index }: { cat: any; index: number }) {
  return (
    <div className="relative flex flex-col items-center group w-full">

      {/* Main category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="w-full"
      >
        <Link
          href={`/${cat.path}`} // always navigate to the main page
          className="
            block w-72 mx-auto text-center text-white text-lg
            font-['Press_Start_2P'] tracking-wide
            py-4 px-4 border-4 border-white bg-black
            hover:bg-white hover:text-black transition-all duration-150
            shadow-[6px_6px_0px_0px_white]
            hover:shadow-[2px_2px_0px_0px_white]
            active:translate-y-1 active:shadow-[0px_0px_0px_0px_white]
          "
        >
          {cat.name.toUpperCase()}
        </Link>
      </motion.div>

    </div>
  );
}

