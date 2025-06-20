import React, { Suspense, useEffect, useRef, useState } from 'react'
import type { Thought } from '../lib/thoughts'

interface RenderedThought extends Thought {
  top: number
  left: number
  rotation: number
}

interface PostItBoardProps {
  thoughts: Thought[]
  filterCategory: string
  categoryIdMap: Record<string, string>
}

export default function PostItBoard({
  thoughts,
  filterCategory,
  categoryIdMap,
}: PostItBoardProps) {
  const [renderedThoughts, setRenderedThoughts] = useState<RenderedThought[]>([])
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const draggingRef = useRef<string | null>(null)
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

//Random Layout
const boardRef = useRef<HTMLDivElement>(null)
useEffect(() => {
  const boardRect = boardRef.current?.getBoundingClientRect()
  const boardWidth = boardRect?.width ?? 800
  const boardHeight = boardRect?.height ?? 600

  setRenderedThoughts((prev) => {
    const updated = thoughts.map((thought) => {
      const existing = prev.find((t) => t.id === thought.id)
      return existing
        ? existing
        : {
            ...thought,
            top: Math.random() * (boardHeight - 150), // 150 is height of post-it
            left: Math.random() * (boardWidth - 180), // 180 is width of post-it
            rotation: (Math.random() - 0.5) * 20,
          }
    })
    return updated
  })
}, [thoughts])

  // Mouse drag
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
  // Touch drag
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (draggingRef.current !== null) {
        const touch = e.touches[0]
        setRenderedThoughts((prev) =>
          prev.map((note) =>
            note.id === draggingRef.current
              ? {
                  ...note,
                  top: touch.clientY - offsetRef.current.y,
                  left: touch.clientX - offsetRef.current.x,
                }
              : note
          )
        )
      }
    }

    const handleTouchEnd = () => {
      draggingRef.current = null
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
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

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const touch = e.touches[0]
    offsetRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
    draggingRef.current = id
    setHighlightedId(id)
    e.preventDefault()
  }

  const visibleNotes = renderedThoughts.filter((note) => {
    if (filterCategory === 'all') return true
    const categoryName = categoryIdMap[note.category_id]
    return categoryName === filterCategory
  })

  return (
    <Suspense fallback={<div>Loading notes...</div>}>
      <div
        ref={boardRef}
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
            onTouchStart={(e) => handleTouchStart(e, note.id)}
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
  )
}
