'use client';

import { useAccount } from 'wagmi';
import { Header } from '@/components/Header';
import { useLeaderboard, type FanRow, type TribeRow } from '@/hooks/useLeaderboard';
import { TEAMS } from '@/lib/teams';
import { formatUsdt } from '@/lib/format';

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function LeaderboardPage() {
  const { data, isLoading } = useLeaderboard();
  const { address: me } = useAccount();

  return (
    <>
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full">
        <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-2">
          Leaderboard
        </div>
        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-2">Top of the table.</h1>
        <p className="text-[#8B92A8] mb-10">
          Live from on-chain <span className="font-mono">Staked</span> + <span className="font-mono">TribeSet</span> events. Refreshes every 15s.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Top fans</h2>
              <span className="text-[10px] uppercase tracking-widest text-[#8B92A8]">By volume staked</span>
            </div>
            {isLoading ? (
              <SkeletonList />
            ) : data && data.topFans.length > 0 ? (
              <ol className="space-y-2">
                {data.topFans.map((row, i) => (
                  <FanRowView
                    key={row.address}
                    row={row}
                    rank={i + 1}
                    isMe={!!me && me.toLowerCase() === row.address.toLowerCase()}
                  />
                ))}
              </ol>
            ) : (
              <EmptyState text="No stakes yet. Be the first 👑" />
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Tribe standings</h2>
              <span className="text-[10px] uppercase tracking-widest text-[#8B92A8]">By tribe pot</span>
            </div>
            {isLoading ? (
              <SkeletonList />
            ) : data && data.tribes.length > 0 ? (
              <ol className="space-y-2">
                {data.tribes.map((row, i) => (
                  <TribeRowView key={row.tribeId} row={row} rank={i + 1} />
                ))}
              </ol>
            ) : (
              <EmptyState text="No tribes have rallied yet" />
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function FanRowView({ row, rank, isMe }: { row: FanRow; rank: number; isMe: boolean }) {
  const tribe = row.tribeId !== undefined ? TEAMS[row.tribeId] : null;
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
  return (
    <li
      className={`flex items-center gap-3 p-3 rounded-xl border ${
        isMe ? 'border-[#00D26A] bg-[#00D26A]/5' : 'border-[#1F2538] bg-[#131826]'
      }`}
    >
      <div className="w-9 text-center font-mono font-bold text-[#8B92A8]">
        {medal ?? `#${rank}`}
      </div>
      {tribe && <div className="text-2xl leading-none">{tribe.flag}</div>}
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm truncate">
          {shortAddress(row.address)}
          {isMe && (
            <span className="ml-2 text-[10px] uppercase tracking-widest text-[#00D26A] font-bold">
              YOU
            </span>
          )}
        </div>
        <div className="text-xs text-[#8B92A8] truncate">
          {tribe ? tribe.name : 'No tribe'} · {row.stakeCount} stake{row.stakeCount === 1 ? '' : 's'}
        </div>
      </div>
      <div className="font-mono text-sm font-bold tabular-nums shrink-0">
        {formatUsdt(row.totalStaked)} <span className="text-[#8B92A8] text-[10px]">BANTM</span>
      </div>
    </li>
  );
}

function TribeRowView({ row, rank }: { row: TribeRow; rank: number }) {
  const tribe = TEAMS[row.tribeId];
  if (!tribe) return null;
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
  return (
    <li
      className="flex items-center gap-3 p-3 rounded-xl border border-[#1F2538] bg-[#131826]"
      style={{ borderLeftWidth: 4, borderLeftColor: tribe.color }}
    >
      <div className="w-9 text-center font-mono font-bold text-[#8B92A8]">
        {medal ?? `#${rank}`}
      </div>
      <div className="text-2xl leading-none">{tribe.flag}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold truncate">{tribe.name}</div>
        <div className="text-xs text-[#8B92A8]">
          {row.fanCount} fan{row.fanCount === 1 ? '' : 's'}
        </div>
      </div>
      <div className="font-mono text-sm font-bold tabular-nums shrink-0">
        {formatUsdt(row.total)} <span className="text-[#8B92A8] text-[10px]">BANTM</span>
      </div>
    </li>
  );
}

function SkeletonList() {
  return (
    <ol className="space-y-2">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="h-14 rounded-xl bg-[#131826] border border-[#1F2538] animate-pulse" />
      ))}
    </ol>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#1F2538] p-8 text-center text-[#8B92A8] text-sm">
      {text}
    </div>
  );
}
