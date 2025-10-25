import React, { Suspense, useEffect, useRef, useState } from 'react';
import type { Thought } from '../../lib/thoughts';

interface RenderedThought extends Thought {
  top: number;
  left: number;
  rotation: number;
}

interface PostItBoardProps {
  thoughts: Thought[];
  filterCategory: string;
  categoryIdMap: Record<string, string>;
  newlyAddedThoughtId: string | null;
}

export default function PostItBoard({
  thoughts,
  filterCategory,
  categoryIdMap,
  newlyAddedThoughtId,
}: PostItBoardProps) {
  const [renderedThoughts, setRenderedThoughts] = useState<RenderedThought[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const draggingRef = useRef<string | null>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Board size state
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 800, height: 600 });

  // Update board size dynamically on resize
  useEffect(() => {
    const updateBoardSize = () => {
      const computedWidth = Math.max(window.innerWidth, thoughts.length * 50);
      const computedHeight = window.innerHeight - 200;
      setBoardSize({ width: computedWidth, height: computedHeight });
    };

    updateBoardSize();  // Initial size setup

    window.addEventListener('resize', updateBoardSize);

    return () => {
      window.removeEventListener('resize', updateBoardSize);
    };
  }, [thoughts]);

  useEffect(() => {
    const thoughtCount = thoughts.length;
    const computedWidth = Math.max(window.innerWidth, thoughtCount * 50);
    const computedHeight = window.innerHeight - 200;
    setBoardSize({ width: computedWidth, height: computedHeight });

    setRenderedThoughts((prev) => {
      const updated = thoughts.map((thought) => {
        const existing = prev.find((t) => t.id === thought.id);
        return existing
          ? existing
          : {
              ...thought,
              top: Math.random() * (computedHeight - 150),
              left: Math.random() * (computedWidth - 180),
              rotation: (Math.random() - 0.5) * 20,
            };
      });
      return updated;
    });
  }, [thoughts]);

  // Automatically highlight newly added thought if its ID is passed
  useEffect(() => {
    if (newlyAddedThoughtId) {
      setHighlightedId(newlyAddedThoughtId);
    }
  }, [newlyAddedThoughtId]);

  // Mouse drag handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingRef.current !== null) {
        setRenderedThoughts((prev) =>
          prev.map((note) =>
            note.id === draggingRef.current
              ? {
                  ...note,
                  top: e.clientY - offsetRef.current.y,
                  left: e.clientX - offsetRef.current.x,
                }
              : note
          )
        );
      }
    };

    const handleMouseUp = () => {
      draggingRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Touch drag handler with scaling adjustments
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (draggingRef.current !== null) {
        const touch = e.touches[0];
        const boardRect = boardRef.current?.getBoundingClientRect();
        const adjustedX = touch.clientX - boardRect!.left;
        const adjustedY = touch.clientY - boardRect!.top;

        setRenderedThoughts((prev) =>
          prev.map((note) =>
            note.id === draggingRef.current
              ? {
                  ...note,
                  top: adjustedY - offsetRef.current.y,
                  left: adjustedX - offsetRef.current.x,
                }
              : note
          )
        );
      }
    };

    const handleTouchEnd = () => {
      draggingRef.current = null;
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    draggingRef.current = id;
    setHighlightedId(id);
  };

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    offsetRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    draggingRef.current = id;
    setHighlightedId(id);
    e.preventDefault();
  };

  const visibleNotes = renderedThoughts.filter((note) => {
    if (filterCategory === 'all') return true;
    const categoryName = categoryIdMap[note.category_id];
    return categoryName === filterCategory;
  });

  return (
    <Suspense fallback={<div>Loading notes...</div>}>
      <div
        ref={boardRef}
        style={{
          height: boardSize.height,
          width: boardSize.width,
          position: 'relative',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          backgroundColor: '#444444',
        }}
      >
        {visibleNotes.map((note) => (
          <div
            key={note.id}
            onMouseDown={(e) => handleMouseDown(e, note.id)}
            onTouchStart={(e) => handleTouchStart(e, note.id)}
            style={{
              position: 'absolute',
              top: note.top,
              left: note.left,
              width: '180px',
              minHeight: '100px',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: note.id === newlyAddedThoughtId ? '#fffae6' : '#fff', // Highlight color
              backgroundImage: `
                repeating-linear-gradient(
                  to bottom,
                  #ffffff,
                  #ffffff 22px,
                  #d3d3d3 23px
                )
              `,
              color: '#000',
              boxShadow: highlightedId === note.id ? '4px 4px 12px rgba(0,0,0,0.4)' : '2px 2px 6px rgba(0,0,0,0.2)',
              border: highlightedId === note.id ? '2px solid #007bff' : 'none',
              transform: `rotate(${note.rotation}deg)`,
              cursor: 'grab',
              zIndex: highlightedId === note.id ? 10 : 1,
              transition: 'box-shadow 0.2s, border 0.2s',
              fontFamily: 'Comic Sans MS, cursive',
              userSelect: 'none',
              touchAction: 'none',
              overflowWrap: 'break-word',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '15px',
                width: '1px',
                backgroundColor: '#ff6b6b',
              }}
            />
            <strong>{note.text}</strong>
          </div>
        ))}
      </div>
    </Suspense>
  );
}
