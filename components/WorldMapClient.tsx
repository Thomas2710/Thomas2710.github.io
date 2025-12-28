'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { PlaceWithVisits } from '@/app/api/places/route';

const WorldMap = dynamic(() => import('./WorldMap'), { ssr: false });

export default function WorldMapClient() {
  const [places, setPlaces] = useState<PlaceWithVisits[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/places')
      .then((res) => res.json())
      .then((data) => setPlaces(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white font-['Press_Start_2P']">
        Loading map…
      </div>
    );
  }

  return <WorldMap places={places} />;
}
