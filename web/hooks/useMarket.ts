'use client';

import { useReadContract, useReadContracts } from 'wagmi';
import { BANTM_MARKET_ADDRESS, bantmMarketAbi } from '@/lib/contracts';
import type { MarketView } from './useMarkets';

export function useMarket(marketId: number | undefined): {
  data: MarketView | undefined;
  isLoading: boolean;
  refetch: () => void;
} {
  const enabled = marketId !== undefined;

  const marketRead = useReadContract({
    address: BANTM_MARKET_ADDRESS,
    abi: bantmMarketAbi,
    functionName: 'getMarket',
    args: enabled ? [BigInt(marketId)] : undefined,
    query: { enabled },
  });

  const totalsRead = useReadContract({
    address: BANTM_MARKET_ADDRESS,
    abi: bantmMarketAbi,
    functionName: 'getOptionTotals',
    args: enabled ? [BigInt(marketId)] : undefined,
    query: { enabled },
  });

  const isLoading = marketRead.isLoading || totalsRead.isLoading;
  if (isLoading || !marketRead.data || marketId === undefined) {
    return {
      data: undefined,
      isLoading,
      refetch: () => {
        marketRead.refetch();
        totalsRead.refetch();
      },
    };
  }

  const m = marketRead.data as
    | readonly [string, readonly string[], bigint, boolean, bigint, bigint]
    | undefined;
  if (!m) {
    return { data: undefined, isLoading: false, refetch: () => {} };
  }

  const data: MarketView = {
    id: marketId,
    question: m[0],
    options: m[1],
    deadline: m[2],
    settled: m[3],
    winningOption: m[4],
    totalPool: m[5],
    optionTotals: (totalsRead.data as readonly bigint[] | undefined) ?? [],
  };

  return {
    data,
    isLoading: false,
    refetch: () => {
      marketRead.refetch();
      totalsRead.refetch();
    },
  };
}

export function useUserStakes(marketId: number | undefined, user: `0x${string}` | undefined, optionCount: number) {
  const enabled = marketId !== undefined && !!user && optionCount > 0;
  const calls = enabled
    ? Array.from({ length: optionCount }, (_, idx) => ({
        address: BANTM_MARKET_ADDRESS,
        abi: bantmMarketAbi,
        functionName: 'getUserStake' as const,
        args: [BigInt(marketId!), user!, BigInt(idx)] as const,
      }))
    : [];

  const { data, isLoading, refetch } = useReadContracts({
    contracts: calls,
    query: { enabled },
  });

  const stakes: bigint[] = (data ?? []).map((r) => (r.result as bigint | undefined) ?? 0n);
  return { stakes, isLoading, refetch };
}
