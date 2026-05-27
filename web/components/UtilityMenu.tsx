'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BANTM_MARKET_ADDRESS } from '@/lib/contracts';

export function UtilityMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-[#131826] border border-[#1F2538] hover:border-[#00D26A] transition-colors flex items-center justify-center"
        aria-label="Menu"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#8B92A8]">
          <line x1="3" y1="6"  x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#131826] border border-[#1F2538] shadow-2xl p-3 z-50">
          <div className="md:hidden">
            <Item
              href="/"
              onClick={() => setOpen(false)}
              label="Markets"
              sublabel="Open prediction markets"
              icon="🎯"
            />
            <Item
              href="/tribes"
              onClick={() => setOpen(false)}
              label="Tribes"
              sublabel="Pick your team"
              icon="🏴"
            />
            <Item
              href="/leaderboard"
              onClick={() => setOpen(false)}
              label="Leaderboard"
              sublabel="Top fans + tribe standings"
              icon="🏆"
            />
            <Item
              href="/profile"
              onClick={() => setOpen(false)}
              label="Profile"
              sublabel="Your Fan Score + history"
              icon="👤"
            />
            <div className="border-t border-[#1F2538] my-2" />
          </div>
          <Item
            href="/how"
            onClick={() => setOpen(false)}
            label="How it works"
            sublabel="The bantM mechanic in 60 seconds"
            icon="📖"
          />
          <Item
            href="https://web3.okx.com/xlayer/faucet"
            external
            onClick={() => setOpen(false)}
            label="Get free OKB"
            sublabel="Testnet gas. 0.2 per day."
            icon="⛽"
          />
          <Item
            href="https://x.com/bantM_"
            external
            onClick={() => setOpen(false)}
            label="@bantM_ on X"
            sublabel="Follow build updates"
            icon="𝕏"
          />
          <Item
            href={`https://www.oklink.com/xlayer-test/address/${BANTM_MARKET_ADDRESS}`}
            external
            onClick={() => setOpen(false)}
            label="View contract"
            sublabel="On-chain proof, public ledger"
            icon="🔗"
          />
          <div className="border-t border-[#1F2538] my-2" />
          <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#8B92A8]">
            Built for <span className="text-white">#XCupHackathon</span> on X Layer Testnet
          </div>
        </div>
      )}
    </div>
  );
}

function Item({
  href,
  external,
  onClick,
  label,
  sublabel,
  icon,
}: {
  href: string;
  external?: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
  icon: string;
}) {
  const className =
    'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0A0E1A] transition-colors';

  const content = (
    <>
      <div className="w-9 h-9 rounded-lg bg-[#0A0E1A] border border-[#1F2538] flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate">{label}</div>
        <div className="text-[11px] text-[#8B92A8] truncate">{sublabel}</div>
      </div>
      {external && <span className="text-[#8B92A8] text-xs">↗</span>}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {content}
    </Link>
  );
}
