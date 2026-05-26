export type Team = {
  id: number;
  name: string;
  short: string;
  flag: string;
  color: string;
};

export const TEAMS: Team[] = [
  { id: 0,  name: 'Argentina',   short: 'ARG', flag: '🇦🇷', color: '#75AADB' },
  { id: 1,  name: 'Brazil',      short: 'BRA', flag: '🇧🇷', color: '#FEE500' },
  { id: 2,  name: 'France',      short: 'FRA', flag: '🇫🇷', color: '#1E2B96' },
  { id: 3,  name: 'England',     short: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#CE1124' },
  { id: 4,  name: 'Spain',       short: 'ESP', flag: '🇪🇸', color: '#C60B1E' },
  { id: 5,  name: 'Germany',     short: 'GER', flag: '🇩🇪', color: '#1A1A1A' },
  { id: 6,  name: 'Portugal',    short: 'POR', flag: '🇵🇹', color: '#006600' },
  { id: 7,  name: 'Netherlands', short: 'NED', flag: '🇳🇱', color: '#FF6600' },
  { id: 8,  name: 'Italy',       short: 'ITA', flag: '🇮🇹', color: '#0066CC' },
  { id: 9,  name: 'Belgium',     short: 'BEL', flag: '🇧🇪', color: '#ED2939' },
  { id: 10, name: 'Croatia',     short: 'CRO', flag: '🇭🇷', color: '#FF0000' },
  { id: 11, name: 'Uruguay',     short: 'URU', flag: '🇺🇾', color: '#5CBCFA' },
  { id: 12, name: 'USA',         short: 'USA', flag: '🇺🇸', color: '#002868' },
  { id: 13, name: 'Mexico',      short: 'MEX', flag: '🇲🇽', color: '#006847' },
  { id: 14, name: 'Canada',      short: 'CAN', flag: '🇨🇦', color: '#FF0000' },
  { id: 15, name: 'Morocco',     short: 'MAR', flag: '🇲🇦', color: '#C1272D' },
  { id: 16, name: 'Senegal',     short: 'SEN', flag: '🇸🇳', color: '#00853F' },
  { id: 17, name: 'Japan',       short: 'JPN', flag: '🇯🇵', color: '#BC002D' },
  { id: 18, name: 'South Korea', short: 'KOR', flag: '🇰🇷', color: '#003478' },
  { id: 19, name: 'Australia',   short: 'AUS', flag: '🇦🇺', color: '#FFCD00' },
  { id: 20, name: 'Denmark',     short: 'DEN', flag: '🇩🇰', color: '#C60C30' },
  { id: 21, name: 'Switzerland', short: 'SUI', flag: '🇨🇭', color: '#FF0000' },
  { id: 22, name: 'Poland',      short: 'POL', flag: '🇵🇱', color: '#DC143C' },
  { id: 23, name: 'Serbia',      short: 'SRB', flag: '🇷🇸', color: '#C6363C' },
  { id: 24, name: 'Ecuador',     short: 'ECU', flag: '🇪🇨', color: '#FFD700' },
  { id: 25, name: 'Colombia',    short: 'COL', flag: '🇨🇴', color: '#FCD116' },
  { id: 26, name: 'Chile',       short: 'CHI', flag: '🇨🇱', color: '#D52B1E' },
  { id: 27, name: 'Wales',       short: 'WAL', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', color: '#D5212C' },
  { id: 28, name: 'Scotland',    short: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', color: '#0065BD' },
  { id: 29, name: 'Nigeria',     short: 'NGA', flag: '🇳🇬', color: '#008751' },
  { id: 30, name: 'Cameroon',    short: 'CMR', flag: '🇨🇲', color: '#007A5E' },
  { id: 31, name: 'Ghana',       short: 'GHA', flag: '🇬🇭', color: '#FCD116' },
];

export const teamById = (id: number): Team | undefined => TEAMS[id];
