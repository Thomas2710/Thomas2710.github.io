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

  //Duplicated, to put in a shared utils file
  const [boardSize, setBoardSize] = useState({ width: 800, height: 600 })
  const thoughtCount = thoughts.length
  useEffect(() => {
    const handleResize = () => {
      const computedWidth = Math.max(window.innerWidth, thoughtCount * 50);
      const computedHeight = Math.max(window.innerHeight, Math.ceil(thoughtCount / 4) * 60);
      setBoardSize({ width: computedWidth, height: computedHeight });
      console.log('Board size updated:', { width: computedWidth, height: computedHeight });
    };

    handleResize(); // Initial size calculation
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [thoughtCount]);

  // End of duplicated code
  return (
    <Suspense
      fallback={
        <main
          style={{
            width: `${boardSize.width}px`,
            height: `${boardSize.height}px`,
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
          width: `${boardSize.width}px`,
          height: `${boardSize.height}px`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#444444',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            flexGrow: 1,
          }}
        >
          <PostItBoard
            thoughts={filteredThoughts}
            filterCategory={selectedCategory}
            categoryIdMap={categoryIdMap}
          />
        </div>

        <ThoughtInputBar
          newThought={newThought}
          setNewThought={setNewThought}
          addThought={addThought}
        />

        {rateLimitedMessage && (
          <p style={{
            marginTop: '0.5rem',
            color: 'red',
            textAlign: 'center',
          }}>
            {rateLimitedMessage}
          </p>
        )}
      </main>

      )}
    </Suspense>
  );
}
