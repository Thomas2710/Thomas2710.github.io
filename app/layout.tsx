// app/layout.tsx
"use client";

import '@/app/ui/global.css';
import React, { Suspense } from 'react';
import Header from './Header';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeader = pathname !== '/'; // Show header on all pages except home

  return (
    <html lang="en">
      <head>
        {/* Move Google Fonts inside <head> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: '#444444', color: '#e2e8f0', fontFamily: "'Press Start 2P', cursive" }}>
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
