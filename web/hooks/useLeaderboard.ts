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

/**
 * Fetch logs in chunks to stay under public-RPC range limits (typically 10k blocks).
 * X Layer Testnet via drpc tends to be permissive but we keep chunks small to be safe.
 */
async function getLogsChunked<TEvent>(
  client: ReturnType<typeof usePublicClient>,
  args: { address: `0x${string}`; event: TEvent; fromBlock: bigint; toBlock: bigint },
  chunkSize = 9_000n,
) {
  if (!client) return [];
  const out: Awaited<ReturnType<NonNullable<typeof client>['getLogs']>> = [];
  let cursor = args.fromBlock;
  while (cursor <= args.toBlock) {
    const end = cursor + chunkSize > args.toBlock ? args.toBlock : cursor + chunkSize;
    try {
      const logs = await client.getLogs({
        address: args.address,
        // viem types complain about the generic event shape inside this helper.
        event: args.event as never,
        fromBlock: cursor,
        toBlock: end,
      });
      out.push(...logs);
    } catch (err) {
      console.warn('[leaderboard] getLogs chunk failed', { cursor, end, err });
    }
    cursor = end + 1n;
  }
  return out;
}

export function useLeaderboard() {
  const client = usePublicClient();

  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<{ topFans: FanRow[]; tribes: TribeRow[] }> => {
      if (!client) return { topFans: [], tribes: [] };

      const latestBlock = await client.getBlockNumber();
      // Scan the last ~60k blocks (~33h on X Layer @ ~2s blocks). Plenty for hackathon timeframe.
      const window = 60_000n;
      const fromBlock = latestBlock > window ? latestBlock - window : 0n;

      const [stakeLogs, tribeLogs] = await Promise.all([
        getLogsChunked(client, {
          address: BANTM_MARKET_ADDRESS,
          event: STAKED_EVENT,
          fromBlock,
          toBlock: latestBlock,
        }),
        getLogsChunked(client, {
          address: BANTM_MARKET_ADDRESS,
          event: TRIBE_SET_EVENT,
          fromBlock,
          toBlock: latestBlock,
        }),
      ]);

      console.log('[leaderboard] events fetched', {
        stakeLogs: stakeLogs.length,
        tribeLogs: tribeLogs.length,
        fromBlock,
        latestBlock,
      });

      const userTribe = new Map<string, number>();
      for (const log of tribeLogs) {
        const args = (log as { args?: { user?: string; teamId?: bigint } }).args ?? {};
        if (args.user && args.teamId !== undefined) {
          userTribe.set(args.user.toLowerCase(), Number(args.teamId));
        }
      }

      const userStaked = new Map<string, { amount: bigint; count: number }>();
      for (const log of stakeLogs) {
        const args = (log as { args?: { user?: string; amount?: bigint } }).args ?? {};
        if (args.user && args.amount !== undefined) {
          const key = args.user.toLowerCase();
          const prev = userStaked.get(key) ?? { amount: 0n, count: 0 };
          userStaked.set(key, {
            amount: prev.amount + args.amount,
            count: prev.count + 1,
          });
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
