import React from 'react';

type FilterBarProps = {
  categories: string[];
  selected: string[];
  toggleCategory: (category: string) => void;
};

const FilterBar: React.FC<FilterBarProps> = ({ categories, selected, toggleCategory }) => {
  return (
    <div style={{ padding: '0.5rem', backgroundColor: '#444444', borderRadius: '0.375rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {categories.map(cat => {
          const isSelected = selected.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isSelected ? '#e2e8f0' : '#444444',
                color: isSelected ? 'black' : 'white',
                border: 'white 1px solid',
                borderRadius: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
