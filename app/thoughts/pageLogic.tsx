// app/thoughtspage.tsx
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PostItBoard from './postitboard';
import ThoughtInputBar from './inputbar';
import { Thought } from '../../lib/thoughts';

export default function ThoughtsPageClient() {
  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get('category') || '';

  const [newThought, setNewThought] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromQuery);
  const [categoryIdMap, setCategoryIdMap] = useState<Record<string, string>>({});
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [rateLimitedMessage, setRateLimitedMessage] = useState('');
  const [newlyAddedThoughtId, setNewlyAddedThoughtId] = useState<string | null>(null);



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

        // Automatically clear the message after 3 seconds
        setTimeout(() => {
          setRateLimitedMessage('');
        }, 3000);  // 3000 milliseconds = 3 seconds
        return;
      }

      if (!res.ok) throw new Error('Failed to post thought');

      const newThoughtData = await res.json();  // Assuming API returns the new thought with its ID
      setNewlyAddedThoughtId(newThoughtData.id);  // Set newly added thought ID

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
            width: `100%`,
            height: `100%`,
            backgroundColor: '#444444',
            color: 'white',
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

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Loading thoughts…
        </main>
      ) : (
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '90vh',
          backgroundColor: '#444444',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '1rem',
            overflowX: 'auto'
          }}
        >
          <PostItBoard
            thoughts={filteredThoughts}
            filterCategory={selectedCategory}
            categoryIdMap={categoryIdMap}
            newlyAddedThoughtId={newlyAddedThoughtId}
          />
        </div>

        {rateLimitedMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 20,
          }}
        >
            {rateLimitedMessage}
      </div>
        )}

        <ThoughtInputBar
          newThought={newThought}
          setNewThought={setNewThought}
          addThought={addThought}
        />


      </main>

      )}
    </Suspense>
  );
}
