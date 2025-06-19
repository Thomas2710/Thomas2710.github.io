// app/layout.tsx
import '@/app/ui/global.css';
import React, { Suspense } from 'react';
import Header from './Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#444444', color: '#e2e8f0' }}>
        <Suspense fallback={<div>Loading header…</div>}>
          <Header />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

