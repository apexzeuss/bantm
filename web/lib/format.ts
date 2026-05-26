import { formatUnits } from 'viem';

export function formatUsdt(amount: bigint): string {
  const formatted = formatUnits(amount, 6);
  const n = Number(formatted);
  if (n === 0) return '0';
  if (n < 1) return n.toFixed(2);
  if (n < 1000) return n.toFixed(0);
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(2)}M`;
}

export function timeRemaining(deadline: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const secs = Number(deadline) - now;
  if (secs <= 0) return 'Closed';
  const days = Math.floor(secs / 86400);
  const hours = Math.floor((secs % 86400) / 3600);
  if (days > 1) return `${days}d ${hours}h`;
  if (days === 1) return `1d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  const mins = Math.floor(secs / 60);
  return `${mins}m`;
}

export function pct(part: bigint, total: bigint): number {
  if (total === 0n) return 0;
  return Number((part * 10000n) / total) / 100;
}
