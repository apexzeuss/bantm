export type Player = { name: string; country: string; flag: string };

export const PLAYERS: Player[] = [
  { name: 'Mbappe',           country: 'France',    flag: '🇫🇷' },
  { name: 'Messi',            country: 'Argentina', flag: '🇦🇷' },
  { name: 'Haaland',          country: 'Norway',    flag: '🇳🇴' },
  { name: 'Bellingham',       country: 'England',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Vinicius Jr',      country: 'Brazil',    flag: '🇧🇷' },
  { name: 'Lautaro Martinez', country: 'Argentina', flag: '🇦🇷' },
  { name: 'Harry Kane',       country: 'England',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Pedri',            country: 'Spain',     flag: '🇪🇸' },
  { name: 'Rodrygo',          country: 'Brazil',    flag: '🇧🇷' },
  { name: 'Lamine Yamal',     country: 'Spain',     flag: '🇪🇸' },
];

const PLAYER_BY_NAME = new Map(PLAYERS.map((p) => [p.name, p]));
export const playerByName = (name: string): Player | undefined => PLAYER_BY_NAME.get(name);
