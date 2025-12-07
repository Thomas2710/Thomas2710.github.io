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
  { id: 1, title: 'Angolo dei 33', nazionalità: '', description: 'Baretto studenti', category: 'Bar', link:'https://www.angolodei33.com/index.php', rating: 4.3, imageUrl: '' },
  { id: 2, title: 'Agritur Sandro', nazionalità: '', description: 'All you can eat Tortel di Patate', category: 'Cibo', link:'https://www.agritursandro.com/', rating: 4.3, imageUrl: '/logos/Italia.png' },
  { id: 3, title: 'La miniera dei sapori', nazionalità: 'Italiano', description: 'Cucina tipica mochena', category: 'Cibo', link:'https://www.laminieradeisaporimocheni.it/', rating: 0, imageUrl: '/logos/Italia.png' },
  { id: 4, title: 'Twist Pizza', nazionalità: 'Italiano', description: 'Pizza in pala', category: 'Cibo', link:'https://twistpizza.it/', rating: 4.5, imageUrl: '/logos/Italia.png' },
  { id: 5, title: 'Lunelli', nazionalità: 'Italia', description: 'Chiedere per il panino dello studente a 4 euro', category: 'Cibo', link:'https://www.lunellitrento.it/jcms/', rating: 4.0, imageUrl: '/logos/Italia.png' },
  { id: 6, title: 'Trattoria piedicastello', nazionalità: 'Italia', description: 'Trattoria onta, molto aglio', category: 'Cibo', link:'https://www.tripadvisor.it/Restaurant_Review-g187861-d1382793-Reviews-Trattoria_Piedicastello-Trento_Province_of_Trento_Trentino_Alto_Adige.html', rating: 3.5, imageUrl: '/logos/Italia.png' },
];
