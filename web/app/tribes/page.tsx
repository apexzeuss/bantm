'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAccount, useWriteContract } from 'wagmi';
import { Header } from '@/components/Header';
import { TEAMS } from '@/lib/teams';
import { useProfile } from '@/hooks/useProfile';
import { BANTM_MARKET_ADDRESS, bantmMarketAbi } from '@/lib/contracts';
import { fireTribeConfetti } from '@/lib/confetti';

export default function TribesPage() {
  const { isConnected } = useAccount();
  const { data: profile, refetch } = useProfile();
  const { writeContractAsync } = useWriteContract();
  const [picking, setPicking] = useState<number | null>(null);
  const [justPicked, setJustPicked] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async (teamId: number) => {
    setPicking(teamId);
    setError(null);
    try {
      await writeContractAsync({
        address: BANTM_MARKET_ADDRESS,
        abi: bantmMarketAbi,
        functionName: 'setTribe',
        args: [BigInt(teamId)],
      });
      setJustPicked(teamId);
      const picked = TEAMS[teamId];
      if (picked) fireTribeConfetti(picked.color);
      setTimeout(() => refetch(), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message.split('\n')[0].slice(0, 120) : 'Failed');
    } finally {
      setPicking(null);
    }
  };

  const myTribe = profile?.tribeSet ? TEAMS[profile.tribe] : justPicked !== null ? TEAMS[justPicked] : null;

  return (
    <>
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-[#8B92A8] hover:text-white mb-6">
          ← Back to markets
        </Link>

        {/* SUCCESS STATE . replaces the picker once user has a tribe */}
        {myTribe ? (
          <div className="rounded-3xl border p-10 relative overflow-hidden mb-10"
            style={{
              background: `linear-gradient(135deg, ${myTribe.color}33, #131826 70%)`,
              borderColor: `${myTribe.color}66`,
            }}
          >
            <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-2">
              ✓ Tribe locked on-chain
            </div>
            <div className="flex items-center gap-6 mb-6">
              <div className="text-8xl leading-none">{myTribe.flag}</div>
              <div className="flex-1 min-w-0">
                <h1 className="text-5xl sm:text-6xl font-black leading-tight">{myTribe.name}</h1>
                <p className="text-[#8B92A8] mt-2">No takebacks. You ride or die with the {myTribe.name} tribe.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="px-5 py-3 rounded-full bg-[#00D26A] text-black font-black text-sm hover:bg-[#00E876] inline-flex items-center gap-2"
              >
                Browse markets →
              </Link>
              <Link
                href="/profile"
                className="px-5 py-3 rounded-full bg-[#131826] border border-[#1F2538] text-sm font-bold hover:border-[#00D26A]"
              >
                View profile
              </Link>
              <Link
                href="/leaderboard"
                className="px-5 py-3 rounded-full bg-[#131826] border border-[#1F2538] text-sm font-bold hover:border-[#00D26A]"
              >
                See leaderboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-2">
              Step 1
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
              Pick your tribe.
            </h1>
            <p className="text-[#8B92A8] max-w-xl mb-10">
              One-time choice. Locks in forever. Your tribe shows up next to every stake you make.
              Pick the team you'd die on a hill for.
            </p>

            {!isConnected && (
              <div className="mb-10 rounded-2xl border border-dashed border-[#1F2538] p-6 text-center text-[#8B92A8]">
                Sign in to lock a tribe.
              </div>
            )}
          </>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs p-3">
            {error}
          </div>
        )}

        {/* PICKER GRID . disabled / dimmed once a tribe is locked */}
        {!myTribe && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {TEAMS.map((team) => {
              const disabled = !isConnected || picking !== null;
              return (
                <button
                  key={team.id}
                  onClick={() => handlePick(team.id)}
                  disabled={disabled}
                  className={`relative rounded-2xl border p-5 text-left transition-all ${
                    disabled
                      ? 'border-[#1F2538] bg-[#131826] opacity-50 cursor-not-allowed'
                      : 'border-[#1F2538] bg-[#131826] hover:border-[#00D26A]/60 hover:bg-[#1A1F30] hover:-translate-y-0.5'
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                    style={{ background: team.color }}
                  />
                  <div className="text-4xl leading-none mb-3 mt-1">{team.flag}</div>
                  <div className="font-bold text-sm leading-tight">{team.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#8B92A8] mt-1 font-mono">
                    {team.short}
                  </div>
                  {picking === team.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl text-sm font-bold text-[#00D26A]">
                      Locking…
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
