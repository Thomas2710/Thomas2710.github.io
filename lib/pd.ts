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
  { id: 1, title: 'Souvlaki greco', nazionalità: 'Greco', description: 'Piccolo locale greco take away: bono', category: 'Cibo', link:'https://www.suvlakigreco.it/wp-content/uploads/2024/01/Back-2024.png', rating: 4.8, imageUrl: '/logos/Grecia.jpeg' },
  { id: 2, title: 'Handa', nazionalità: 'Asiatico', description: 'Piccolo locale giapponese fusion: bono, stiloso, giovane, originale', category: 'Cibo', link:'https://www.instagram.com/handa_mushi/', rating: 5.0, imageUrl: '/logos/Giappone.png' },
  { id: 3, title: 'Ali baba e i 40 panini', nazionalità: 'Libanese', description: 'Kebab però libanese: buona qualità del cibo', category: 'Cibo', link:'https://www.facebook.com/p/ALI-BABA-e-i-quaranta-panini-100054208344458/', rating: 3.7, imageUrl: '/logos/Libano.png' },
  { id: 4, title: 'Mo sarpi', nazionalità: 'Cinese', description: 'Catena take away, buono, poca scelta', category: 'Cibo', link:'https://www.instagram.com/mosarpi/', rating: 4.1, imageUrl: '/logos/Cina.png' },
  { id: 5, title: 'LievitArti', nazionalità: 'Italiano', description: 'Pizza takeaway di quartiere: cheap, kind', category: 'Cibo', link:'https://lievitarti.com/', rating: 4.0, imageUrl: '/logos/Italia.png' },
  { id: 6, title: 'Sugo', nazionalità: 'Italiano', description: 'Catena di pasta. Cheap, se magna', category: 'Cibo', link:'https://www.instagram.com/sugo_padova/?hl=en', rating: 3.7, imageUrl: '/logos/Italia.png' },
  { id: 7, title: 'Buddha', nazionalità: 'Indiano', description: 'Ristorante indiano: buono, piccante, un pò costoso', category: 'Cibo', link:'https://www.buddharestaurant.info/menu-buddha/', rating: 4.0, imageUrl: '/logos/India.png' },
  { id: 8, title: 'Xiang Dimsum', nazionalità: 'Cinese', description: 'Ravioleria: buono, costoso, menù originale', category: 'Cibo', link:'https://www.instagram.com/xiang.dimsum/?hl=en', rating: 4.5, imageUrl: '/logos/Cina.png' },
  { id: 9, title: 'Angolo del mondo', nazionalità: 'Cinese', description: 'Ristorante tipico cinese: molti piatti della tradizione, particolari. Poca scelta veg', category: 'Cibo', link:'https://www.instagram.com/angolo_delmondo/', rating: 3.7, imageUrl: '/logos/Cina.png' },
  { id: 10, title: 'Galateia', nazionalità: 'Italiano', description: 'Gelateria', category: 'Cibo', link:'https://galateia.it/', rating: 4.5, imageUrl: '/logos/Italia.png' },
  { id: 11, title: 'Casa Barozzi', nazionalità: 'Italiano', description: 'Panineria', category: 'Cibo', link:'https://casabarozzi.com/', rating: -1, imageUrl: '/logos/Italia.png' },
  { id: 12, title: 'MexiCani', nazionalità: 'Messicano', description: 'Ristorante messicano', category: 'Cibo', link:'https://www.mexicanitaqueria.com/it/our-menu', rating: -1, imageUrl: '/logos/Messico.png' },
  { id: 13, title: 'Marrakech express', nazionalità: 'Turco', description: 'Kebab', category: 'Cibo', link:'https://marrakeshexpress.it/', rating: 4.1, imageUrl: '/logos/Turchia.png' },
  { id: 15, title: 'Pizza & Love', nazionalità: 'Turco', description: 'Kebab, bello ripieno', category: 'Cibo', link:'https://www.tripadvisor.it/Restaurant_Review-g187867-d12320818-Reviews-Pizza_Love-Padua_Province_of_Padua_Veneto.html', rating: 4.3, imageUrl: '/logos/Turchia.png' },
  { id: 14, title: 'Il Gottino', nazionalità: '', description: 'Bel baretto in ghetto. Si consuma fuori', category: 'Bar', link:'https://www.ilgottinopadova.it/', rating: 4.0, imageUrl: '' },

];
