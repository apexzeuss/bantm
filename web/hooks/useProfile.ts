'use client';

import { useAccount, useReadContract } from 'wagmi';
import { BANTM_MARKET_ADDRESS, bantmMarketAbi } from '@/lib/contracts';

export type Profile = {
  tribe: number;
  tribeSet: boolean;
  totalStaked: bigint;
  totalWon: bigint;
};

export function useProfile(address?: `0x${string}`) {
  const { address: connected } = useAccount();
  const target = address ?? connected;

  const { data, isLoading, refetch } = useReadContract({
    address: BANTM_MARKET_ADDRESS,
    abi: bantmMarketAbi,
    functionName: 'profiles',
    args: target ? [target] : undefined,
    query: { enabled: !!target },
  });

  if (!data) return { data: undefined, isLoading, refetch };

  const profile: Profile = {
    tribe: Number(data[0]),
    tribeSet: data[1],
    totalStaked: data[2],
    totalWon: data[3],
  };
  return { data: profile, isLoading, refetch };
}
