'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';

const STEPS = [
  {
    n: '1',
    title: 'Sign in',
    body: 'Google, X, Discord, email, or a wallet. Pick whatever. Privy creates an on-chain wallet for you behind the scenes. No MetaMask. No seed phrases.',
  },
  {
    n: '2',
    title: 'Get free testnet tokens',
    body: 'You need OKB (for gas) and BANTM (to stake). Both are free. The in-app menu has 1-click links. This is testnet, so play money. The mechanics are real.',
  },
  {
    n: '3',
    title: 'Pick your tribe',
    body: 'One-time choice. Your tribe shows up on your profile and on every stake you make. It locks forever. You ride or die with your team.',
  },
  {
    n: '4',
    title: 'Stake on markets',
    body: 'Each market is a shared pot. You stake BANTM on the option you believe in. Opposing fans stake against you. Both sides keep adding to the pot.',
  },
  {
    n: '5',
    title: 'Settlement',
    body: 'When the real-world outcome resolves, the contract pays the winning side. Your share = (your stake ÷ winning side total) × total pool. Losers fund the winners. That\'s the whole mechanic.',
  },
  {
    n: '6',
    title: 'Climb the leaderboard',
    body: 'Your Fan Score combines win-rate and stake volume. Top tribes by total pot. Public bragging rights. Share your card on X with one tap.',
  },
];

export default function HowItWorks() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-2">
          The mechanic
        </div>
        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-3">How it works.</h1>
        <p className="text-[#8B92A8] mb-12 max-w-xl">
          Football twitter has been a prediction market the whole time. We just put it on-chain.
          Six steps. About a minute to read.
        </p>

        <ol className="space-y-6">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-5 group">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#131826] border border-[#1F2538] group-hover:border-[#00D26A]/40 flex items-center justify-center font-mono font-black text-[#00D26A] transition-colors">
                {s.n}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold mb-1">{s.title}</h3>
                <p className="text-[#8B92A8] leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/tribes"
            className="px-5 py-3 rounded-full bg-[#00D26A] text-black font-bold text-sm hover:bg-[#00E876]"
          >
            Pick your tribe →
          </Link>
          <Link
            href="/"
            className="px-5 py-3 rounded-full bg-[#131826] border border-[#1F2538] text-sm font-bold hover:border-[#00D26A]"
          >
            Browse markets
          </Link>
        </div>
      </main>
    </>
  );
}
