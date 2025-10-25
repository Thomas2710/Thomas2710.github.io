// lib/thoughts.ts

export interface Thought {
  id: string;
  text: string;
  category_id: string;
}

// Hardcoded thoughts (optional)
export const thoughtsData: Thought[] = [
  { id: '1', text: 'Read more books', category_id: 'Self Improvement' },
  { id: '2', text: 'Plan trip to Japan', category_id: 'Travel Ideas' },
];

// ✅ Hardcoded list of all valid categories
export const thoughtCategories: string[] = [
  'Self Improvement',
  'Travel Ideas',
  'Creative Writing',
  'Random Questions',
  'Focus & Mindset',
];
