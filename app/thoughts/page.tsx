// app/thoughts/page.tsx
import React, { Suspense } from 'react'
import ThoughtsPageClient from './pageLogic'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading thoughts…</div>}>
      <ThoughtsPageClient />
    </Suspense>
  )
}
