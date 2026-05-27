'use client';

import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { TEAMS } from '@/lib/teams';
import { useProfile } from '@/hooks/useProfile';
import { formatUsdt } from '@/lib/format';
import { fanScore } from '@/lib/score';

const PREVIEW_TEAMS = ['Argentina', 'Brazil', 'France', 'England', 'Germany', 'Spain'];

export function TribeCTACard() {
  const { authenticated, ready: privyReady } = usePrivy();
  const { data: profile, isLoading } = useProfile();

  if (privyReady && authenticated && (isLoading || !profile)) {
    return <div className="h-64 rounded-2xl bg-[#131826] border border-[#1F2538] animate-pulse" />;
  }

  const tribe = profile?.tribeSet ? TEAMS[profile.tribe] : null;

  if (tribe) {
    const score = fanScore(profile);
    return (
      <Link
        href="/profile"
        className="block rounded-2xl border transition-all p-6 group relative overflow-hidden hover:scale-[1.01]"
        style={{
          background: `linear-gradient(135deg, ${tribe.color}40, #131826 65%)`,
          borderColor: `${tribe.color}66`,
        }}
      >
        <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-2">
          Your tribe · locked on-chain
        </div>
        <div className="flex items-start gap-4 mb-5">
          <div className="text-6xl leading-none">{tribe.flag}</div>
          <div className="flex-1 min-w-0">
            <div className="text-3xl font-black leading-tight truncate">{tribe.name}</div>
            <div className="text-xs text-[#8B92A8] mt-1 font-mono uppercase tracking-widest">
              Fan Score · <span className="text-white font-bold">{score}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#8B92A8] mb-5">
          Ride or die. Stake on markets below. Every BANTM counts toward your team&apos;s pot and your score.
        </p>

        <div className="flex flex-wrap gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-full bg-[#0A0E1A] border border-[#1F2538] font-mono">
            <span className="text-[#8B92A8]">Staked </span>
            <span className="text-white font-bold">{profile ? formatUsdt(profile.totalStaked) : '0'}</span>
            <span className="text-[#8B92A8]"> BANTM</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-[#0A0E1A] border border-[#1F2538] font-mono">
            <span className="text-[#8B92A8]">Won </span>
            <span className="text-[#00D26A] font-bold">{profile ? formatUsdt(profile.totalWon) : '0'}</span>
            <span className="text-[#8B92A8]"> BANTM</span>
          </div>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#00D26A] group-hover:translate-x-1 transition-transform">
          View your profile →
        </div>
      </Link>
    );
  }

  if (isLoading) {
    return (
      <div className="h-64 rounded-2xl bg-[#131826] border border-[#1F2538] animate-pulse" />
    );
  }

  const previews = TEAMS.filter((t) => PREVIEW_TEAMS.includes(t.name));

  return (
    <Link
      href="/tribes"
      className="block rounded-2xl bg-gradient-to-br from-[#00D26A]/20 via-[#131826] to-[#131826] border border-[#00D26A]/30 hover:border-[#00D26A] transition-all p-6 group relative overflow-hidden"
    >
      <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-2">
        Start here
      </div>
      <h3 className="text-2xl font-black leading-tight mb-3">
        Pick your tribe.
      </h3>
      <p className="text-sm text-[#8B92A8] mb-6 max-w-xs">
        Lock your fan tribe. Once, forever. Every stake counts toward your team&apos;s pot and your Fan Score.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {previews.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0A0E1A] border border-[#1F2538] text-xs"
          >
            <span className="text-base leading-none">{t.flag}</span>
            <span className="font-bold">{t.short}</span>
          </div>
        ))}
        <div className="flex items-center px-2.5 py-1.5 rounded-full bg-[#0A0E1A] border border-[#1F2538] text-xs text-[#8B92A8] font-mono">
          +{TEAMS.length - previews.length}
        </div>
      </div>

      <div className="inline-flex items-center gap-2 text-sm font-black text-[#00D26A] group-hover:translate-x-1 transition-transform">
        Choose your team →
      </div>
    </Link>
  );
}
