'use client';

import Link from 'next/link';
import { ConnectButton } from './ConnectButton';
import { UtilityMenu } from './UtilityMenu';

export function Header() {
  return (
    <header className="border-b border-[#1F2538] bg-[#0A0E1A]/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight">
            bant<span className="text-[#00D26A]">M</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-[#8B92A8]">
          <Link href="/" className="hover:text-white transition-colors">Markets</Link>
          <Link href="/tribes" className="hover:text-white transition-colors">Tribes</Link>
          <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
          <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ConnectButton />
          <UtilityMenu />
        </div>
      </div>
    </header>
  );
}
