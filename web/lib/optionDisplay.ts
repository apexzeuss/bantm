import { TEAMS } from './teams';
import { playerByName } from './players';

const TEAM_BY_NAME = new Map(TEAMS.map((t) => [t.name, t]));

export type OptionDisplay = {
  flag: string | null;
  label: string;
  sublabel: string | null;
  color: string | null;
};

export function getOptionDisplay(rawLabel: string): OptionDisplay {
  const team = TEAM_BY_NAME.get(rawLabel);
  if (team) {
    return { flag: team.flag, label: team.name, sublabel: null, color: team.color };
  }
  const player = playerByName(rawLabel);
  if (player) {
    return { flag: player.flag, label: player.name, sublabel: player.country, color: null };
  }
  return { flag: null, label: rawLabel, sublabel: null, color: null };
}
