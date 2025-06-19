'use client'

import React, { useState } from 'react'
import FilterBar from './FilterBar'
import CardGrid from './CardGrid'
import { cards as allCards, categories } from '../lib/cards'
import type { Card } from '../lib/cards'

export default function KnowledgePageClient() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (category: string) => 
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )

  const filteredCards: Card[] =
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
