export type Goat = {
  id: 'messi' | 'ronaldo' | 'neymar';
  name: string;
  short: string;
  initials: string;
  country: string;
  flag: string;
  color: string;
  textColor: string;
  image: string;
};

export const GOATS: Goat[] = [
  {
    id: 'messi',
    name: 'Lionel Messi',
    short: 'Messi',
    initials: 'M',
    country: 'Argentina',
    flag: '🇦🇷',
    color: '#75AADB',
    textColor: '#0A0E1A',
    image: '/goats/messi.png',
  },
  {
    id: 'ronaldo',
    name: 'Cristiano Ronaldo',
    short: 'Ronaldo',
    initials: 'R',
    country: 'Portugal',
    flag: '🇵🇹',
    color: '#006600',
    textColor: '#FFFFFF',
    image: '/goats/ronaldo.png',
  },
  {
    id: 'neymar',
    name: 'Neymar Jr',
    short: 'Neymar',
    initials: 'N',
    country: 'Brazil',
    flag: '🇧🇷',
    color: '#FEE500',
    textColor: '#0A0E1A',
    image: '/goats/neymar.png',
  },
];

export const goatById = (id: string): Goat | undefined =>
  GOATS.find((g) => g.id === id);
