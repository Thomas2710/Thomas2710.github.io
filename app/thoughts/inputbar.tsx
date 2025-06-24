import React, { Suspense } from 'react'

interface ThoughtInputBarProps {
  newThought: string
  setNewThought: (text: string) => void
  addThought: () => void
}

export default function ThoughtInputBar({
  newThought,
  setNewThought,
  addThought,
}: ThoughtInputBarProps) {
  return (
    <Suspense fallback={<div>Loading input bar...</div>}>
    <div
      style={{
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        padding: '1rem',
        borderTop: '1px solid #ccc',
        backgroundColor: '#444444',
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
      }}
    >
      <input
        type="text"
        placeholder="Write your thought..."
        value={newThought}
        onChange={e => setNewThought(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') addThought()
        }}
        style={{
          flex: 1,
          padding: '0.75rem',
          borderRadius: '4px 0 0 4px',
          border: '1px solid #ccc',
          fontSize: '1rem',
          color: '#333'
        }}
      />
      <button
        onClick={addThought}
        style={{
          padding: '0.75rem 1rem',
          border: 'none',
          borderRadius: '0 4px 4px 0',
          backgroundColor: '#f4d35e',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Add
      </button>
    </div>
    </Suspense>
  )
}
