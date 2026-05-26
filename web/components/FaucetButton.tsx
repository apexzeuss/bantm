'use client';

import { useAccount } from 'wagmi';
import { useDUSDTBalance, useFaucet } from '@/hooks/useDUSDT';
import { formatUsdt } from '@/lib/format';
import { useState } from 'react';

export function FaucetButton() {
  const { isConnected } = useAccount();
  const { data: balance, refetch } = useDUSDTBalance();
  const { claim, isPending } = useFaucet();
  const [error, setError] = useState<string | null>(null);

  if (!isConnected) return null;

  const onClaim = async () => {
    setError(null);
    try {
      await claim();
      setTimeout(() => refetch(), 3000);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed';
      setError(message.includes('cooldown') ? 'Cooldown. Try in 24h' : 'Failed to claim');
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="px-3 py-1.5 rounded-full bg-[#131826] border border-[#1F2538] font-mono">
        <span className="text-[#8B92A8]">Balance:</span>{' '}
        <span className="font-bold text-white">
          {balance !== undefined ? formatUsdt(balance) : '-'} BANTM
        </span>
      </div>
      <button
        onClick={onClaim}
        disabled={isPending}
        className="px-3 py-1.5 rounded-full bg-[#00D26A]/10 text-[#00D26A] border border-[#00D26A]/30 font-bold hover:bg-[#00D26A]/20 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Claiming…' : error ?? '+ Free BANTM'}
      </button>
    </div>
  );
}
