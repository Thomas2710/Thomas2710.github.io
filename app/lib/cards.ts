export const categories: string[] = ['Food', 'Volunteer', 'Sustainable Products', 'Wellfare'];


export const colorMap: Record<string, string> = {
  'Food': '#F30067',
  'Volunteer': '#00D1CD',
  'Wellfare': '#F78536',
  'Sustainable Products': '#93A7D1',
};

export type Card = {
  id: number;
  title: string;
  category: string;
  description?: string;
  link:string;
  imageUrl?: string;
};

export const cards: Card[] = [
  { id: 1, title: 'What we eat', description: 'Breve serie documentario prodotta da Will media riguardo la produzione e distribuzione del cibo che mangiamo', category: 'Food', link:'https://www.youtube.com/embed/videoseries?si=G739mNVYnq83N5DY&amp;list=PLXWi3zoRuQ1CbOhwew-SD4uhD7-OOUomo', imageUrl: '/logos/will.svg' },
  { id: 2, title: 'Food for profit', description:'Documentario ritraente la realtà degli allevamenti intensivi, con approfondimento a livello politico europeo', category: 'Food', link:'https://www.youtube.com/embed/sZs7nDjMc0c?si=JbgDBFCtwXv3-O1a', imageUrl: '/logos/logo-foodforprofit.svg' },
  { id: 3, title: 'Make you greener', description: 'per la cura della tua persona', category: 'Sustainable Products', link:'https://www.makeyougreener.com/', imageUrl: '/logos/make-you-greener-logo.avif' },
  { id: 4, title: 'Plastic free', description: 'per prendere roba gratis da per terra' , category: 'Volunteer', link:'https://www.plasticfreeonlus.it/', imageUrl: '/logos/plasticfree_logo.png'},
  { id: 5, title: "Sant'Egidio", description: 'per farti due chiacchiere se ti senti solo' , category: 'Volunteer', link:'https://www.santegidio.org/pageID/1/langID/en/HOME.html', imageUrl: '/logos/santegidio_logo.png'},
  { id: 6, title: 'Quanto ti senti povero?', description: 'Calcolatrice per il tuo benessere economico (non ti pagherà le tasse) ', category: 'Wellfare', link:'https://www.givingwhatwecan.org/how-rich-am-i', imageUrl: '/logos/GivingWhatWeCan.svg'},
  { id: 7, title: 'Quanto costa la spesa fatta come si deve?' , description: 'Video in cui parlano del costo dei prodotti animali (quasi) sostenibili', category: 'Food', link:'https://www.youtube.com/embed/5sVfTPaxRwk?si=Bge3fz7wxGndh3QD', imageUrl: '/logos/kurzgesact.webp' },
];
