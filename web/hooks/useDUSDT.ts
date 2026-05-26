'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { DEMO_USDT_ADDRESS, BANTM_MARKET_ADDRESS, demoUsdtAbi } from '@/lib/contracts';
import { maxUint256 } from 'viem';

export function useDUSDTBalance() {
  const { address } = useAccount();
  return useReadContract({
    address: DEMO_USDT_ADDRESS,
    abi: demoUsdtAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useDUSDTAllowance(spender: `0x${string}` = BANTM_MARKET_ADDRESS) {
  const { address } = useAccount();
  return useReadContract({
    address: DEMO_USDT_ADDRESS,
    abi: demoUsdtAbi,
    functionName: 'allowance',
    args: address ? [address, spender] : undefined,
    query: { enabled: !!address },
  });
}

export function useFaucet() {
  const { writeContractAsync, isPending } = useWriteContract();
  const claim = () =>
    writeContractAsync({
      address: DEMO_USDT_ADDRESS,
      abi: demoUsdtAbi,
      functionName: 'faucet',
    });
  return { claim, isPending };
}

export function useApproveMax() {
  const { writeContractAsync, isPending } = useWriteContract();
  const approve = (spender: `0x${string}` = BANTM_MARKET_ADDRESS) =>
    writeContractAsync({
      address: DEMO_USDT_ADDRESS,
      abi: demoUsdtAbi,
      functionName: 'approve',
      args: [spender, maxUint256],
    });
  return { approve, isPending };
}
