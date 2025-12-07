'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Placecard, colorMap } from '@/lib/pd';
import Image from 'next/image';
import { StatBar } from "@/components/ui/StatBar";

type CardGridProps = {
  cards: Placecard[];
};

const CardGrid: React.FC<CardGridProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 overflow-hidden">
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
              className="flex items-center gap-4 p-4 rounded-md shadow-md h-60 overflow-hidden min-w-0"
            >
              {card.imageUrl && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl mb-1">
                {card.title}
              </h3>

              <p className="text-xs sm:text-sm text-white-500 overflow-hidden text-ellipsis line-clamp-3">
                {card.description}
              </p>

              {card.rating !== undefined && (
                <div className="mt-3">
                  <StatBar label="Greatness" value={card.rating} max={5} color="limegreen" />
                </div>
              )}
            </div>

            </motion.div>
          </a>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CardGrid;
