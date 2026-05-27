'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { maxUint256 } from 'viem';
import { BANTM_MARKET_ADDRESS, BANTM_TOKEN_ADDRESS, bantmTokenAbi } from '@/lib/contracts';

export function useBantmBalance() {
  const { address } = useAccount();
  return useReadContract({
    address: BANTM_TOKEN_ADDRESS,
    abi: bantmTokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useBantmAllowance(spender: `0x${string}` = BANTM_MARKET_ADDRESS) {
  const { address } = useAccount();
  return useReadContract({
    address: BANTM_TOKEN_ADDRESS,
    abi: bantmTokenAbi,
    functionName: 'allowance',
    args: address ? [address, spender] : undefined,
    query: { enabled: !!address },
  });
}

export function useBantmFaucet() {
  const { writeContractAsync, isPending } = useWriteContract();
  const claim = () =>
    writeContractAsync({
      address: BANTM_TOKEN_ADDRESS,
      abi: bantmTokenAbi,
      functionName: 'faucet',
    });
  return { claim, isPending };
}

/** Returns the unix timestamp (seconds) of this address's last faucet claim, or undefined. */
export function useLastBantmFaucetClaim() {
  const { address } = useAccount();
  return useReadContract({
    address: BANTM_TOKEN_ADDRESS,
    abi: bantmTokenAbi,
    functionName: 'lastFaucetClaim',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 30_000 },
  });
}

export function useApproveMaxBantm() {
  const { writeContractAsync, isPending } = useWriteContract();
  const approve = (spender: `0x${string}` = BANTM_MARKET_ADDRESS) =>
    writeContractAsync({
      address: BANTM_TOKEN_ADDRESS,
      abi: bantmTokenAbi,
      functionName: 'approve',
      args: [spender, maxUint256],
    });
  return { approve, isPending };
}
