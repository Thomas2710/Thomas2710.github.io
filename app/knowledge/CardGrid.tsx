// components/CardGrid.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, colorMap } from '../lib/cards';
import Image from 'next/image';

type CardGridProps = {
  cards: Card[];
};

const CardGrid: React.FC<CardGridProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <AnimatePresence>
        {cards.map((card) => (
          <a
            key={card.id}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-inherit no-underline"
          >
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: colorMap[card.category] || '#444444' }}
              className="flex items-center gap-4 p-4 rounded-md shadow-md min-h-[150px]"
            >
              {card.imageUrl && (
                <div className="w-20 h-20 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <div>
                <h3 className="text-xl mb-1">{card.title}</h3>
                <p className="text-gray-500">{card.category}</p>
              </div>
            </motion.div>
          </a>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CardGrid;
