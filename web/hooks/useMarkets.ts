'use client';

import { useReadContract, useReadContracts } from 'wagmi';
import { BANTM_MARKET_ADDRESS, bantmMarketAbi } from '@/lib/contracts';

export type MarketView = {
  id: number;
  question: string;
  options: readonly string[];
  deadline: bigint;
  settled: boolean;
  winningOption: bigint;
  totalPool: bigint;
  optionTotals: readonly bigint[];
};

export function useMarketCount() {
  return useReadContract({
    address: BANTM_MARKET_ADDRESS,
    abi: bantmMarketAbi,
    functionName: 'marketCount',
  });
}

export function useMarkets(): { data: MarketView[] | undefined; isLoading: boolean } {
  const { data: count, isLoading: countLoading } = useMarketCount();

  const ids = count !== undefined ? Array.from({ length: Number(count) }, (_, i) => i) : [];

  const marketCalls = ids.map((id) => ({
    address: BANTM_MARKET_ADDRESS,
    abi: bantmMarketAbi,
    functionName: 'getMarket' as const,
    args: [BigInt(id)] as const,
  }));

  const totalsCalls = ids.map((id) => ({
    address: BANTM_MARKET_ADDRESS,
    abi: bantmMarketAbi,
    functionName: 'getOptionTotals' as const,
    args: [BigInt(id)] as const,
  }));

  const { data: marketsData, isLoading: marketsLoading } = useReadContracts({
    contracts: [...marketCalls, ...totalsCalls],
    query: { enabled: ids.length > 0 },
  });

  if (countLoading || marketsLoading || !marketsData) {
    return { data: undefined, isLoading: true };
  }

  const half = marketsData.length / 2;
  const data: MarketView[] = ids.map((id, i) => {
    const m = marketsData[i].result as
      | readonly [string, readonly string[], bigint, boolean, bigint, bigint]
      | undefined;
    const totals = (marketsData[i + half].result as readonly bigint[] | undefined) ?? [];
    if (!m) {
      return {
        id,
        question: '',
        options: [],
        deadline: 0n,
        settled: false,
        winningOption: 0n,
        totalPool: 0n,
        optionTotals: [],
      };
    }
    return {
      id,
      question: m[0],
      options: m[1],
      deadline: m[2],
      settled: m[3],
      winningOption: m[4],
      totalPool: m[5],
      optionTotals: totals,
    };
  });

  return { data, isLoading: false };
}
