export const categories: string[] = ['Cibo', 'Bar'];

export const colorMap: Record<string, string> = {
  'Cibo': '#ae7acfff',
  'Bar': '#00D1CD',
};

export type Placecard = {
  id: number;
  title: string;
  category: string;
  nazionalità?: string;
  description?: string;
  rating?: number;
  link:string;
  imageUrl?: string;
};
export const cards: Placecard[] = [
  { id: 1, title: 'Barkowsky', nazionalità: '', description: 'Classic CPH stud bar', category: 'Bar', link:'https://www.barkowskibar.dk/', rating: 4.3, imageUrl: '' },
  { id: 2, title: 'Leanowski', nazionalità: '', description: 'Classic CPH stud bar', category: 'Bar', link:'https://www.leanowskibar.dk/', rating: 4.5, imageUrl: '' },
  { id: 3, title: 'Little brother', nazionalità: '', description: 'Pizza place', category: 'Cibo', link:'https://www.littlebrother.dk/', rating: 4.2, imageUrl: '/logos/Italia.png' },
  { id: 4, title: 'Popl Burger', nazionalità: '', description: 'Noma burger place. Very good but way too expensive', category: 'Cibo', link:'https://poplburger.com/', rating: 4.0, imageUrl: '' },
  { id: 5, title: 'Broens Street Food', nazionalità: '', description: 'Food court with various options. Good for atmosphere.', category: 'Cibo', link:'https://broensstreetfood.dk/en/', rating: 3.5, imageUrl: '' },
  { id: 6, title: 'Ramen Tobiiru', nazionalità: '', description: 'Ramen place in Norrebro', category: 'Cibo', link:'https://ramentobiiru.dk/norrebro/', rating: 4.6, imageUrl: '/logos/Giappone.png' },
];
