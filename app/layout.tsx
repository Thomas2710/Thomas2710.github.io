"use client";

import "@/app/ui/global.css";
import MusicPlayer from "@/components/MusicPlayer";
import React, { Suspense } from "react";
import Header from "./Header";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname !== "/";

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        style={{
          backgroundColor: "#444444",
          color: "#e2e8f0",
          fontFamily: "'Press Start 2P', cursive",
        }}
      >
        {/* Music runs globally */}
        <MusicPlayer />

        {/* Header contains mute button */}
        {showHeader && (
          <Suspense fallback={<div>Loading header…</div>}>
            <Header />
          </Suspense>
        )}

        {children}
      </body>
    </html>
  );
}
