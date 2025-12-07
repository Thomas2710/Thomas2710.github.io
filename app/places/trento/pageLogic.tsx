'use client'

import React, { useState } from 'react'
import FilterBar from '@/app/places/trento/FilterBar'
import CardGrid from '@/app/places/trento/CardGrid'
import { cards as allCards, categories } from '@/lib/tn'
import type { Placecard } from '@/lib/tn'

export default function TrentoPageClient() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (category: string) => 
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )

  const filteredCards: Placecard[] =
    selectedCategories.length === 0
      ? allCards
      : allCards.filter(card => selectedCategories.includes(card.category))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flex: 1 }}>
        <FilterBar
          categories={categories}
          selected={selectedCategories}
          toggleCategory={toggleCategory}
        />
        <CardGrid cards={filteredCards} />
      </main>
    </div>
  )
}
