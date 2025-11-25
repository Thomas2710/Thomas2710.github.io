export type Category = {
  id: string;
  color: string;
  name: string;
  description: string;
  path: string;
  image: string; 
};

export const categories: Category[] = [
  {
    id: '1',
    color: '#f00',
    name: 'Knowledge',
    description: 'Explore a wealth of information and resources.',
    path: 'knowledge',
    image: 'knowledge.png',
  },
  {
    id: '2',
    color: '#0f0',
    name: 'Thoughts',
    description: 'Read articles, reflections, and curated ideas.',
    path: 'thoughts',
    image: 'thoughts.png',
  },
  {
    id: '3',
    color: '#00f',
    name: 'Padova',
    description: 'Discover content related to Padova.',
    path: 'padova',
    image: 'padova.webp',
  },
  {
    id: '4',
    color: 'rgba(173, 20, 155, 1)',
    name: 'Trento',
    description: 'Discover content related to Trento.',
    path: 'trento',
    image: 'trento.jpeg',
  },
  {
    id: '5',
    color: 'rgba(173, 127, 20, 1)',
    name: 'Movies',
    description: 'My letterboxd',
    path: 'movies',
    image: 'movies.jpeg',
  },
];
