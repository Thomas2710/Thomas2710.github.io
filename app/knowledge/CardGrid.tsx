import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Card, colorMap} from '../lib/cards';
import Image from 'next/image';

/*
type Card = {
  id: string | number;
  title: string;
  description?: string;
  category: string;
  link:string
  imageUrl?: string;
};
*/


type CardGridProps = {
  cards: Card[];
};


const CardGrid: React.FC<CardGridProps> = ({ cards }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '1.5rem',
        padding: '1rem',
      }}
    >
      <AnimatePresence>
        {cards.map(card => (
          <a
            href={card.link}
            style={{ textDecoration: 'none', color: 'inherit' }} // removes underline and default blue color
            target="_blank" // optional: opens in new tab
            rel="noopener noreferrer" // safe external link
          >
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: colorMap[card.category] || '#444444',
              borderRadius: '0.375rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              minHeight: '150px',
            }}
          >
            {/* Conditionally render image */}
            {card.imageUrl && (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                style={{ objectFit: 'contain' }}
              />
              </div>
            )}

            {/* Text Content */}
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{card.title}</h3>
              <p style={{ color: '#4a5568' }}>{card.category}</p>
            </div>
          </motion.div>
        </a>

        ))}
      </AnimatePresence>
    </div>
  );
};

export default CardGrid;
