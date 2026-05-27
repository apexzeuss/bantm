'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { BANTM_MARKET_ADDRESS, bantmMarketAbi } from '@/lib/contracts';
import { useBantmAllowance, useBantmBalance, useApproveMaxBantm } from '@/hooks/useBantmToken';
import { formatUsdt } from '@/lib/format';

type Props = {
  marketId: number;
  optionIdx: number;
  optionLabel: string;
  onStaked?: () => void;
  onClose: () => void;
};

export function StakePanel({ marketId, optionIdx, optionLabel, onStaked, onClose }: Props) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('10');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'idle' | 'approving' | 'staking' | 'done'>('idle');

  const { data: balance } = useBantmBalance();
  const { data: allowance, refetch: refetchAllowance } = useBantmAllowance();
  const { approve } = useApproveMaxBantm();
  const { writeContractAsync } = useWriteContract();

  const numericAmount = (() => {
    try { return parseUnits(amount || '0', 6); } catch { return 0n; }
  })();
  const needsApproval = (allowance ?? 0n) < numericAmount;
  const insufficientBalance = (balance ?? 0n) < numericAmount;
  const validAmount = numericAmount > 0n;

  const handleStake = async () => {
    if (!validAmount || !isConnected) return;
    setBusy(true);
    setError(null);
    try {
      if (needsApproval) {
        setStep('approving');
        await approve();
        await refetchAllowance();
      }
      setStep('staking');
      await writeContractAsync({
        address: BANTM_MARKET_ADDRESS,
        abi: bantmMarketAbi,
        functionName: 'stake',
        args: [BigInt(marketId), BigInt(optionIdx), numericAmount],
      });
      setStep('done');
      onStaked?.();
      setTimeout(onClose, 1200);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed';
      setError(msg.split('\n')[0].slice(0, 120));
      setStep('idle');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-[#131826] border border-[#1F2538] p-6 modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold">
            Beef on
          </div>
          <button onClick={onClose} className="text-[#8B92A8] hover:text-white text-xl leading-none">×</button>
        </div>
        <h3 className="text-2xl font-bold mb-6">{optionLabel}</h3>

        <label className="block mb-2 text-xs text-[#8B92A8] uppercase tracking-widest">
          Amount (BANTM)
        </label>
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#0A0E1A] border border-[#1F2538] rounded-xl px-4 py-3 text-2xl font-mono font-bold focus:border-[#00D26A] focus:outline-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B92A8] text-sm">BANTM</span>
        </div>

        <div className="flex gap-2 mt-3">
          {[10, 50, 100].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              className="flex-1 py-2 rounded-lg bg-[#0A0E1A] border border-[#1F2538] text-xs font-mono hover:border-[#00D26A]"
            >
              {v}
            </button>
          ))}
          <button
            onClick={() => balance !== undefined && setAmount(formatUnits(balance, 6))}
            className="flex-1 py-2 rounded-lg bg-[#0A0E1A] border border-[#1F2538] text-xs font-mono hover:border-[#00D26A]"
          >
            MAX
          </button>
        </div>

        <div className="mt-4 text-xs text-[#8B92A8] flex justify-between">
          <span>Wallet balance</span>
          <span className="font-mono text-white">{balance !== undefined ? formatUsdt(balance) : '-'} BANTM</span>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs p-3">
            {error}
          </div>
        )}

        <button
          onClick={handleStake}
          disabled={busy || !validAmount || insufficientBalance || !isConnected}
          className="mt-6 w-full py-3 rounded-xl bg-[#00D26A] text-black font-black text-base hover:bg-[#00E876] disabled:opacity-40 transition-colors"
        >
          {!isConnected
            ? 'Connect wallet to stake'
            : insufficientBalance
            ? 'Insufficient BANTM'
            : step === 'approving'
            ? 'Approving BANTM…'
            : step === 'staking'
            ? 'Locking your stake…'
            : step === 'done'
            ? 'Locked in ✓'
            : needsApproval
            ? `Approve + Stake ${amount} BANTM`
            : `Stake ${amount} BANTM`}
        </button>

        <p className="mt-3 text-[11px] text-[#555A6B] text-center">
          Two transactions on first stake (approve + stake). After that, one.
        </p>
      </div>
    </div>
  );
}
