'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { ShareOnX } from '@/components/ShareOnX';
import { useProfile } from '@/hooks/useProfile';
import { useBantmBalance } from '@/hooks/useBantmToken';
import { TEAMS } from '@/lib/teams';
import { formatUsdt } from '@/lib/format';
import { fanScore, netPnl } from '@/lib/score';

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { data: profile, isLoading } = useProfile();
  const { data: balance } = useBantmBalance();

  if (!isConnected) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-3xl mx-auto px-6 py-20 w-full text-center">
          <h1 className="text-3xl font-black mb-3">No profile yet</h1>
          <p className="text-[#8B92A8] mb-6">Connect your wallet to see your Fan Score and tribe.</p>
        </main>
      </>
    );
  }

  if (isLoading || !profile) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-3xl mx-auto px-6 py-10 w-full">
          <div className="h-72 rounded-2xl bg-[#131826] border border-[#1F2538] animate-pulse" />
        </main>
      </>
    );
  }

  const tribe = profile.tribeSet ? TEAMS[profile.tribe] : null;
  const score = fanScore(profile);
  const pnl = netPnl(profile);
  const pnlPositive = pnl >= 0n;

  const shareText = tribe
    ? `My Fan Score is ${score} on bantM 🔥\n\nTribe: ${tribe.flag} ${tribe.name}\nStaked: ${formatUsdt(profile.totalStaked)} BANTM\nWon: ${formatUsdt(profile.totalWon)} BANTM\n\nPick yours: bantm.xyz`
    : `Just landed on bantM. Football tribes, on-chain. Picking my tribe now.\n\n@XLayerOfficial #XCupHackathon`;

  return (
    <>
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 w-full">
        {/* Tribe banner */}
        <div
          className="rounded-2xl border p-8 mb-6 relative overflow-hidden"
          style={
            tribe
              ? { background: `linear-gradient(135deg, ${tribe.color}33, #131826 60%)`, borderColor: `${tribe.color}66` }
              : { background: '#131826', borderColor: '#1F2538' }
          }
        >
          <div className="flex items-start gap-6">
            <div className="text-7xl leading-none">{tribe ? tribe.flag : '🪪'}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-[#8B92A8] font-bold mb-1">
                {tribe ? 'Tribe' : 'No tribe yet'}
              </div>
              <div className="text-3xl sm:text-4xl font-black leading-tight">
                {tribe ? tribe.name : 'Pick your tribe'}
              </div>
              <div className="text-xs font-mono text-[#8B92A8] mt-2">
                {address ? shortAddress(address) : '-'}
              </div>
            </div>
            {!tribe && (
              <Link
                href="/tribes"
                className="shrink-0 px-4 py-2 rounded-full bg-[#00D26A] text-black font-bold text-sm hover:bg-[#00E876]"
              >
                Pick tribe →
              </Link>
            )}
          </div>
        </div>

        {/* Fan Score hero */}
        <div className="rounded-2xl bg-[#131826] border border-[#1F2538] p-8 mb-6 text-center">
          <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-2">
            Fan Score
          </div>
          <div className="font-mono text-7xl sm:text-8xl font-black text-white leading-none tabular-nums">
            {score}
          </div>
          <div className="text-xs text-[#8B92A8] mt-3 max-w-sm mx-auto leading-relaxed">
            <span className="block">Computed live from on-chain reads.</span>
            <span className="font-mono text-[10px]">winRate × 1000 + log&#8321;&#8320;(totalStaked) × 100</span>
            <span className="block mt-1">Higher means sharper. Capped at 9999.</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Stat label="Wallet balance" value={`${balance !== undefined ? formatUsdt(balance) : '-'}`} unit="BANTM" />
          <Stat label="Total staked" value={formatUsdt(profile.totalStaked)} unit="BANTM" />
          <Stat label="Total won" value={formatUsdt(profile.totalWon)} unit="BANTM" />
          <Stat
            label="Net P&L"
            value={`${pnlPositive ? '+' : '−'}${formatUsdt(pnl < 0n ? -pnl : pnl)}`}
            unit="BANTM"
            tone={pnlPositive ? 'good' : 'bad'}
          />
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <ShareOnX text={shareText} label={tribe ? 'Flex my Fan Score' : 'Share on X'} />
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-full bg-[#131826] border border-[#1F2538] text-sm font-bold hover:border-[#00D26A] transition-colors"
          >
            Browse markets
          </Link>
        </div>
      </main>
    </>
  );
}

function Stat({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit: string;
  tone?: 'good' | 'bad';
}) {
  const valueColor = tone === 'good' ? 'text-[#00D26A]' : tone === 'bad' ? 'text-[#FF4D6D]' : 'text-white';
  return (
    <div className="rounded-2xl bg-[#131826] border border-[#1F2538] p-4">
      <div className="text-[10px] uppercase tracking-widest text-[#8B92A8] mb-2">{label}</div>
      <div className={`font-mono text-lg sm:text-xl font-bold ${valueColor} tabular-nums`}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-[#8B92A8] font-mono mt-1">
        {unit}
      </div>
    </div>
  );
}
