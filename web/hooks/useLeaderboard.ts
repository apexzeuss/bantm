'use client';

import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';
import { BANTM_MARKET_ADDRESS } from '@/lib/contracts';

const STAKED_EVENT = parseAbiItem(
  'event Staked(uint256 indexed marketId, address indexed user, uint256 optionIdx, uint256 amount)',
);
const TRIBE_SET_EVENT = parseAbiItem(
  'event TribeSet(address indexed user, uint256 teamId)',
);

export type FanRow = {
  address: `0x${string}`;
  totalStaked: bigint;
  stakeCount: number;
  tribeId: number | undefined;
};

export type TribeRow = {
  tribeId: number;
  total: bigint;
  fanCount: number;
};

export function useLeaderboard() {
  const client = usePublicClient();

  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<{ topFans: FanRow[]; tribes: TribeRow[] }> => {
      if (!client) return { topFans: [], tribes: [] };

      const latestBlock = await client.getBlockNumber();
      const fromBlock = latestBlock > 250_000n ? latestBlock - 250_000n : 0n;

      const [stakeLogs, tribeLogs] = await Promise.all([
        client.getLogs({
          address: BANTM_MARKET_ADDRESS,
          event: STAKED_EVENT,
          fromBlock,
          toBlock: 'latest',
        }),
        client.getLogs({
          address: BANTM_MARKET_ADDRESS,
          event: TRIBE_SET_EVENT,
          fromBlock,
          toBlock: 'latest',
        }),
      ]);

      const userTribe = new Map<string, number>();
      for (const log of tribeLogs) {
        if (log.args.user && log.args.teamId !== undefined) {
          userTribe.set(log.args.user.toLowerCase(), Number(log.args.teamId));
        }
      }

      const userStaked = new Map<string, { amount: bigint; count: number }>();
      for (const log of stakeLogs) {
        if (log.args.user && log.args.amount !== undefined) {
          const key = log.args.user.toLowerCase();
          const prev = userStaked.get(key) ?? { amount: 0n, count: 0 };
          userStaked.set(key, { amount: prev.amount + log.args.amount, count: prev.count + 1 });
        }
      }

      const topFans: FanRow[] = [...userStaked.entries()]
        .map(([addr, { amount, count }]) => ({
          address: addr as `0x${string}`,
          totalStaked: amount,
          stakeCount: count,
          tribeId: userTribe.get(addr),
        }))
        .sort((a, b) => (b.totalStaked > a.totalStaked ? 1 : a.totalStaked > b.totalStaked ? -1 : 0))
        .slice(0, 10);

      const tribeAgg = new Map<number, { total: bigint; users: Set<string> }>();
      for (const [addr, { amount }] of userStaked) {
        const tribeId = userTribe.get(addr);
        if (tribeId !== undefined) {
          const existing = tribeAgg.get(tribeId) ?? { total: 0n, users: new Set<string>() };
          existing.total += amount;
          existing.users.add(addr);
          tribeAgg.set(tribeId, existing);
        }
      }

      const tribes: TribeRow[] = [...tribeAgg.entries()]
        .map(([tribeId, { total, users }]) => ({ tribeId, total, fanCount: users.size }))
        .sort((a, b) => (b.total > a.total ? 1 : a.total > b.total ? -1 : 0));

      return { topFans, tribes };
    },
    enabled: !!client,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}
