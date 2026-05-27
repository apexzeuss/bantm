'use client';

import { Header } from '@/components/Header';
import { MarketCard } from '@/components/MarketCard';
import { TribeCTACard } from '@/components/TribeCTACard';
import { LiveTicker } from '@/components/LiveTicker';
import { useMarkets } from '@/hooks/useMarkets';
import { formatUsdt } from '@/lib/format';
import { CountUp } from '@/components/CountUp';

export default function HomePage() {
  const { data: markets, isLoading } = useMarkets();

  const totalPool = (markets ?? []).reduce((acc, m) => acc + m.totalPool, 0n);
  const liveCount = (markets ?? []).filter((m) => !m.settled).length;

  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="hero-bg">
          <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
            <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-4 hero-rise" style={{ animationDelay: '0ms' }}>
              World Cup 2026 · Football tribes, on-chain
            </div>
            <h1 className="text-4xl sm:text-6xl font-black leading-[0.95] tracking-tight max-w-3xl hero-rise" style={{ animationDelay: '120ms' }}>
              Pick your team.<br />
              Stake. <span className="text-[#00D26A]">Beef on-chain.</span>
            </h1>
            <p className="mt-6 text-[#8B92A8] max-w-xl text-base sm:text-lg hero-rise" style={{ animationDelay: '260ms' }}>
              Football twitter has been a prediction market the whole time. We just put it on-chain.
              Lock your tribe, stake BANTM, settle the score with the winning fans.
            </p>
          </div>
        </section>

        <LiveTicker />

        <section className="bg-[#0A0E1A] border-b border-[#1F2538]">
          <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-3 gap-4 text-center sm:text-left">
            <Stat label="Live markets" valueNode={isLoading ? <>-</> : <CountUp value={liveCount} />} />
            <Stat label="Total staked" valueNode={isLoading ? <>-</> : <><CountUp value={Number(formatUsdt(totalPool).replace(/[^\d.-]/g, '')) || 0} /> BANTM</>} />
            <Stat label="Tribes" valueNode={<CountUp value={32} />} />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold">Open markets</h2>
            <div className="text-xs text-[#8B92A8]">Tap a card to stake</div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-2xl bg-[#131826] border border-[#1F2538] animate-pulse" />
              ))}
            </div>
          ) : markets && markets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card-rise" style={{ animationDelay: '0ms' }}>
                <TribeCTACard />
              </div>
              {markets.map((m, i) => (
                <div key={m.id} className="card-rise" style={{ animationDelay: `${80 + i * 90}ms` }}>
                  <MarketCard market={m} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#1F2538] py-16 text-center text-[#8B92A8]">
              No markets yet. The owner needs to seed them.
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[#1F2538] mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-[#8B92A8] flex flex-wrap items-center justify-between gap-3">
          <span>bantM</span>
          <span className="font-mono">© 2026</span>
        </div>
      </footer>
    </>
  );
}

function Stat({ label, valueNode }: { label: string; valueNode: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[#8B92A8]">{label}</div>
      <div className="font-mono text-lg sm:text-xl font-bold tabular-nums">{valueNode}</div>
    </div>
  );
}
