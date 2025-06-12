import React, { useEffect, useRef, useState } from 'react'
import type { Thought } from '../lib/thoughts'

interface RenderedThought extends Thought {
  top: number
  left: number
  rotation: number
}

interface PostItBoardProps {
  thoughts: Thought[]
  filterCategory: string
  categoryIdMap: Record<string, string> // Add the categoryIdMap prop here
}

export default function PostItBoard({
  thoughts,
  filterCategory,
  categoryIdMap, // Receive the map as prop
}: PostItBoardProps) {
  const [renderedThoughts, setRenderedThoughts] = useState<RenderedThought[]>([])
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const draggingRef = useRef<string | null>(null)
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Generate random visual layout only once per note
  useEffect(() => {
    setRenderedThoughts((prev) => {
      const updated = thoughts.map((thought) => {
        const existing = prev.find((t) => t.id === thought.id)
        return existing
          ? existing
          : {
              ...thought,
              top: Math.random() * 400,
              left: Math.random() * 600,
              rotation: (Math.random() - 0.5) * 20,
            }
      })
      return updated
    })
  }, [thoughts])

  // Drag handlers
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
        )
      }
    }

    const handleMouseUp = () => {
      draggingRef.current = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    draggingRef.current = id
    setHighlightedId(id)
  }

  // Compute visible notes by checking the category name
  const visibleNotes = renderedThoughts.filter((note) => {
    if (filterCategory === 'all') return true
    const categoryName = categoryIdMap[note.category_id] // Get category name from map
    return categoryName === filterCategory
  })

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        overflow: 'auto',
        padding: '2rem',
        backgroundColor: '#444444',
        height: '100%',
      }}
    >
      {visibleNotes.map((note) => (
        <div
          key={note.id}
          onMouseDown={(e) => handleMouseDown(e, note.id)}
          style={{
            position: 'absolute',
            top: note.top,
            left: note.left,
            width: '180px',
            minHeight: '100px',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: '#fff',
            backgroundImage: `
              repeating-linear-gradient(
                to bottom,
                #ffffff,
                #ffffff 22px,
                #d3d3d3 23px
              )
            `,
            color: '#000',
            boxShadow:
              highlightedId === note.id
                ? '4px 4px 12px rgba(0,0,0,0.4)'
                : '2px 2px 6px rgba(0,0,0,0.2)',
            border:
              highlightedId === note.id
                ? '2px solid #007bff'
                : 'none',
            transform: `rotate(${note.rotation}deg)`,
            cursor: 'grab',
            zIndex: highlightedId === note.id ? 10 : 1,
            transition: 'box-shadow 0.2s, border 0.2s',
            fontFamily: 'Comic Sans MS, cursive',
            userSelect: 'none',
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
  )
}
