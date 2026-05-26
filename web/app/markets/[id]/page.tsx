'use client';

import { use, useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { Header } from '@/components/Header';
import { FaucetButton } from '@/components/FaucetButton';
import { StakePanel } from '@/components/StakePanel';
import { useMarket, useUserStakes } from '@/hooks/useMarket';
import { BANTM_MARKET_ADDRESS, bantmMarketAbi } from '@/lib/contracts';
import { formatUsdt, timeRemaining, pct } from '@/lib/format';
import { getOptionDisplay } from '@/lib/optionDisplay';

type Props = { params: Promise<{ id: string }> };

export default function MarketPage({ params }: Props) {
  const { id } = use(params);
  const marketId = Number(id);
  const { address, isConnected } = useAccount();
  const { data: market, isLoading, refetch } = useMarket(marketId);
  const { stakes, refetch: refetchStakes } = useUserStakes(marketId, address, market?.options.length ?? 0);
  const [staking, setStaking] = useState<{ optionIdx: number; label: string } | null>(null);
  const { writeContractAsync: claim } = useWriteContract();
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    setClaiming(true);
    setClaimError(null);
    try {
      await claim({
        address: BANTM_MARKET_ADDRESS,
        abi: bantmMarketAbi,
        functionName: 'claim',
        args: [BigInt(marketId)],
      });
      setTimeout(() => refetch(), 2500);
    } catch (e) {
      setClaimError(e instanceof Error ? e.message.split('\n')[0].slice(0, 100) : 'Failed');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 w-full">
        <a href="/" className="text-xs text-[#8B92A8] hover:text-white mb-6 inline-block">← All markets</a>

        {isLoading && (
          <div className="h-96 rounded-2xl bg-[#131826] border border-[#1F2538] animate-pulse" />
        )}

        {!isLoading && !market && (
          <div className="rounded-2xl border border-dashed border-[#1F2538] p-10 text-center text-[#8B92A8]">
            Market not found.
          </div>
        )}

        {market && (
          <>
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-2">
                Market #{market.id} · {market.settled ? 'SETTLED' : 'LIVE'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight">{market.question}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div>
                  <span className="text-[#8B92A8]">Closes </span>
                  <span className="font-mono font-bold">{timeRemaining(market.deadline)}</span>
                </div>
                <div>
                  <span className="text-[#8B92A8]">Total pool </span>
                  <span className="font-mono font-bold">{formatUsdt(market.totalPool)} BANTM</span>
                </div>
              </div>
            </div>

            <div className="mb-6 flex justify-end">
              <FaucetButton />
            </div>

            {market.settled && (
              <div className="mb-6 rounded-2xl bg-[#00D26A]/10 border border-[#00D26A]/30 p-4">
                <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-1">
                  Settled
                </div>
                <div className="text-lg font-bold">
                  Winner: {market.options[Number(market.winningOption)] ?? '-'}
                </div>
                {isConnected && stakes[Number(market.winningOption)] > 0n && (
                  <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="mt-3 px-4 py-2 rounded-full bg-[#00D26A] text-black font-bold text-sm disabled:opacity-50"
                  >
                    {claiming ? 'Claiming…' : 'Claim your winnings'}
                  </button>
                )}
                {claimError && (
                  <div className="mt-2 text-xs text-[#FF4D6D]">{claimError}</div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {market.options.map((label, idx) => {
                const total = market.optionTotals[idx] ?? 0n;
                const share = pct(total, market.totalPool);
                const myStake = stakes[idx] ?? 0n;
                const isWinner = market.settled && Number(market.winningOption) === idx;
                const isLoser = market.settled && Number(market.winningOption) !== idx;
                const disp = getOptionDisplay(label);

                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border ${
                      isWinner ? 'border-[#00D26A]' : isLoser ? 'border-[#1F2538] opacity-50' : 'border-[#1F2538]'
                    } bg-[#131826]`}
                    style={!isWinner && !isLoser && disp.color ? { borderLeftWidth: 3, borderLeftColor: disp.color } : undefined}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-[#00D26A]/10"
                      style={{ width: `${Math.max(share, total > 0n ? 4 : 0)}%` }}
                    />
                    <div className="relative flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0 flex-1 flex items-center gap-3">
                        {disp.flag && <span className="text-3xl leading-none shrink-0">{disp.flag}</span>}
                        <div className="min-w-0">
                          <div className="font-bold truncate">{disp.label}</div>
                          {disp.sublabel && (
                            <div className="text-[10px] text-[#8B92A8] uppercase tracking-widest mt-0.5">{disp.sublabel}</div>
                          )}
                          <div className="text-xs text-[#8B92A8] mt-1 font-mono">
                            {formatUsdt(total)} BANTM · {share.toFixed(1)}%
                            {myStake > 0n && (
                              <span className="ml-2 text-[#00D26A]">
                                · your stake: {formatUsdt(myStake)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!market.settled && (
                        <button
                          onClick={() => setStaking({ optionIdx: idx, label })}
                          className="shrink-0 px-4 py-2 rounded-full bg-[#00D26A] text-black text-sm font-bold hover:bg-[#00E876]"
                        >
                          Stake
                        </button>
                      )}
                      {isWinner && (
                        <span className="shrink-0 text-[#00D26A] text-xs font-bold uppercase tracking-widest">Won</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {staking && market && (
        <StakePanel
          marketId={market.id}
          optionIdx={staking.optionIdx}
          optionLabel={staking.label}
          onStaked={() => {
            refetch();
            refetchStakes();
          }}
          onClose={() => setStaking(null)}
        />
      )}
    </>
  );
}
