import type { Profile } from '@/hooks/useProfile';

/**
 * Fan Score: a single number representing fan reputation.
 * Combines win-rate, total volume, and bonus for staked-and-still-locked.
 * Cap at 9999 to keep it scoreboard-style.
 */
export function fanScore(profile: Profile | undefined): number {
  if (!profile) return 0;
  const staked = Number(profile.totalStaked);
  const won = Number(profile.totalWon);
  if (staked === 0) return 0;
  const winRate = won / staked;
  const volumeBoost = Math.log10(staked / 1e6 + 1) * 100; // tiers by log volume
  const raw = winRate * 1000 + volumeBoost;
  return Math.min(Math.round(raw), 9999);
}

export function netPnl(profile: Profile | undefined): bigint {
  if (!profile) return 0n;
  return profile.totalWon - profile.totalStaked;
}
