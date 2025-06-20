// app/thoughtspage.tsx
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PostItBoard from './postitboard';
import ThoughtInputBar from './inputbar';
import { Thought } from '../lib/thoughts';

export default function ThoughtsPageClient() {
  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get('category') || '';

  const [newThought, setNewThought] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromQuery);
  const [categoryIdMap, setCategoryIdMap] = useState<Record<string, string>>({});
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
    const [rateLimitedMessage, setRateLimitedMessage] = useState('');


  useEffect(() => {
    setSelectedCategory(categoryFromQuery);
  }, [categoryFromQuery]);

  const fetchThoughts = async () => {
    try {
      const res = await fetch('/api/thoughts');
      const data = await res.json();
      setThoughts(data);
    } catch (err) {
      console.error('Failed to fetch thoughts:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data: { id: string; name: string }[] = await res.json();
      const map: Record<string, string> = {};
      data.forEach((cat) => {
        map[cat.id] = cat.name;
      });
      setCategoryIdMap(map);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchThoughts(), fetchCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const addThought = async () => {
    if (!newThought.trim() || !selectedCategory) return;

    const categoryId = Object.keys(categoryIdMap).find(
      (key) => categoryIdMap[key] === selectedCategory
    );
    if (!categoryId) {
      console.error('Category ID not found for:', selectedCategory);
      return;
    }

    try {
      const res = await fetch('/api/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newThought,
          category_id: categoryId,
        }),
      });

      if (res.status === 429) {
        const body = await res.json();
        setRateLimitedMessage(body.error || 'You are sending too many thoughts. Please slow down.');
        return;
      }

      if (!res.ok) throw new Error('Failed to post thought');
      setNewThought('');
      await fetchThoughts();
    } catch (error) {
      console.error('Error posting thought:', error);
      setRateLimitedMessage('An error occurred while posting your thought.');
    }
  };

  const filteredThoughts = loading
    ? []
    : thoughts.filter((t) => categoryIdMap[t.category_id] === selectedCategory);

  return (
    <Suspense
      fallback={
        <main
          style={{
            height: '100vh',
            backgroundColor: '#444444',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Loading thoughts…
        </main>
      }
    >
      {loading ? (
        <main
          style={{
            height: '100vh',
            backgroundColor: '#444444',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Loading thoughts…
        </main>
      ) : (
        <main
          style={{
            height: 'calc(100vh - 70px)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#444444',
          }}
        >
          <PostItBoard
            thoughts={filteredThoughts}
            filterCategory={selectedCategory}
            categoryIdMap={categoryIdMap}
          />
          <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            <ThoughtInputBar
              newThought={newThought}
              setNewThought={setNewThought}
              addThought={addThought}
            />
            {rateLimitedMessage && (
              <p className="mt-2 text-red-500 text-center">{rateLimitedMessage}</p>
            )}
          </div>
        </main>
      )}
    </Suspense>
  );
}
