'use client'

import React, { useState } from 'react'
import FilterBar from './FilterBar'
import CardGrid from './CardGrid'
import { cards as allCards, categories } from '@/lib/pd'
import type { Placecard } from '@/lib/pd'

export default function PadovaPageClient() {
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
    <div className="overflow-x-hidden flex flex-col min-h-screen">
      <main className="flex-1">
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
