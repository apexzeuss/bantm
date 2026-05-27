'use client';

import Link from 'next/link';
import type { MarketView } from '@/hooks/useMarkets';
import { formatUsdt, timeRemaining, pct } from '@/lib/format';
import { getOptionDisplay } from '@/lib/optionDisplay';

type Props = { market: MarketView };

export function MarketCard({ market }: Props) {
  const { id, question, options, deadline, settled, totalPool, optionTotals } = market;

  const ranked = options
    .map((label, idx) => ({ label, idx, total: optionTotals[idx] ?? 0n }))
    .sort((a, b) => (b.total > a.total ? 1 : b.total < a.total ? -1 : 0))
    .slice(0, 3);

  return (
    <Link
      href={`/markets/${id}`}
      className="block rounded-2xl bg-[#131826] border border-[#1F2538] hover:border-[#00D26A]/60 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(0,210,106,0.35)] transition-all duration-200 p-6 group"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#8B92A8] mb-2">
            Market #{id} {settled ? '· SETTLED' : '· LIVE'}
          </div>
          <h3 className="text-xl font-bold leading-tight group-hover:text-[#00D26A] transition-colors">
            {question}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] uppercase tracking-widest text-[#8B92A8]">Closes</div>
          <div className="font-mono text-sm text-white">{timeRemaining(deadline)}</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {ranked.map(({ label, idx, total }) => {
          const share = pct(total, totalPool);
          const disp = getOptionDisplay(label);
          return (
            <div
              key={idx}
              className="relative h-11 rounded-lg bg-[#0A0E1A] overflow-hidden border border-transparent"
              style={disp.color ? { borderLeftWidth: 2, borderLeftColor: disp.color } : undefined}
            >
              <div
                className="absolute inset-y-0 left-0 bg-[#00D26A]/15"
                style={{ width: `${Math.max(share, total > 0n ? 4 : 0)}%` }}
              />
              <div className="relative flex items-center justify-between h-full px-3 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {disp.flag && <span className="text-xl leading-none shrink-0">{disp.flag}</span>}
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate leading-tight">{disp.label}</div>
                    {disp.sublabel && (
                      <div className="text-[10px] text-[#8B92A8] truncate leading-tight">{disp.sublabel}</div>
                    )}
                  </div>
                </div>
                <span className="text-xs font-mono text-[#8B92A8] tabular-nums shrink-0">
                  {formatUsdt(total)} BANTM
                </span>
              </div>
            </div>
          );
        })}
        {options.length > 3 && (
          <div className="text-[11px] text-[#8B92A8] pl-1">
            +{options.length - 3} more options
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#1F2538]">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#8B92A8]">Total pool</div>
          <div className="font-mono text-base font-bold text-white">
            {formatUsdt(totalPool)} <span className="text-[#8B92A8] text-xs">BANTM</span>
          </div>
        </div>
        <div className="text-sm font-bold text-[#00D26A] opacity-0 group-hover:opacity-100 transition-opacity">
          Open market →
        </div>
      </div>
    </Link>
  );
}
