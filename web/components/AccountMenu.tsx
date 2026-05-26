'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { useDUSDTBalance, useFaucet } from '@/hooks/useDUSDT';
import { useProfile } from '@/hooks/useProfile';
import { useGoat } from '@/hooks/useGoat';
import { fanScore } from '@/lib/score';
import { TEAMS } from '@/lib/teams';
import { formatUsdt } from '@/lib/format';
import { GoatAvatar } from './GoatAvatar';

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function deriveDisplayName(user: ReturnType<typeof usePrivy>['user'], address?: string): string {
  if (!user) return address ? shortAddress(address) : '-';
  const tw = user.twitter?.username;
  if (tw) return `@${tw}`;
  const dc = user.discord?.username;
  if (dc) return dc;
  const g = user.google?.name;
  if (g) return g.split(' ')[0];
  const e = user.email?.address;
  if (e) return e.split('@')[0];
  return address ? shortAddress(address) : '-';
}

function deriveLoginMethod(user: ReturnType<typeof usePrivy>['user']): string {
  if (!user) return 'wallet';
  if (user.twitter?.username) return 'X';
  if (user.discord?.username) return 'Discord';
  if (user.google?.email) return 'Google';
  if (user.email?.address) return 'Email';
  return 'wallet';
}

export function AccountMenu() {
  const { user, logout } = usePrivy();
  const { address } = useAccount();
  const { data: nativeBalance } = useBalance({ address });
  const { data: dusdtBalance, refetch: refetchDusdt } = useDUSDTBalance();
  const { data: profile } = useProfile();
  const { goat } = useGoat();
  const { claim: claimFaucet, isPending: claiming } = useFaucet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleClaimBantm = async () => {
    setClaimError(null);
    try {
      await claimFaucet();
      setTimeout(() => refetchDusdt(), 3000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed';
      setClaimError(msg.includes('cooldown') ? 'Already claimed today' : 'Failed');
      setTimeout(() => setClaimError(null), 4000);
    }
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const name = deriveDisplayName(user, address);
  const loginMethod = deriveLoginMethod(user);
  const tribe = profile?.tribeSet ? TEAMS[profile.tribe] : null;
  const score = fanScore(profile);
  const okbStr = nativeBalance ? Number(formatUnits(nativeBalance.value, 18)).toFixed(4) : '-';
  const lowOkb = nativeBalance ? nativeBalance.value < BigInt(1e15) : false; // <0.001 OKB

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group px-3 py-2 rounded-full bg-[#131826] border border-[#1F2538] text-white text-sm font-bold hover:border-[#00D26A] transition-colors flex items-center gap-2"
      >
        {tribe && <span className="text-base leading-none">{tribe.flag}</span>}
        <span>{name}</span>
        <span className="text-[#00D26A] text-xs">●</span>
        <svg className={`w-3 h-3 text-[#8B92A8] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none">
          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#131826] border border-[#1F2538] shadow-2xl p-4 z-50">
          {/* identity block */}
          <div className="flex items-start gap-3 pb-4 border-b border-[#1F2538]">
            <GoatAvatar goat={goat} fallbackInitial={name.slice(0, 1).toUpperCase()} size={44} />
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate">{name}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#8B92A8]">
                Signed in via {loginMethod}
                {goat && <span className="text-[#00D26A]"> · GOAT: {goat.short}</span>}
              </div>
            </div>
          </div>

          {/* address row */}
          <button
            onClick={copyAddress}
            className="mt-3 w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#0A0E1A] border border-[#1F2538] hover:border-[#00D26A]/40 transition-colors"
          >
            <span className="text-xs text-[#8B92A8]">Wallet</span>
            <span className="font-mono text-xs">
              {address ? shortAddress(address) : '-'}
            </span>
            <span className="text-[10px] text-[#00D26A] font-bold w-12 text-right">
              {copied ? 'COPIED' : 'COPY'}
            </span>
          </button>

          {/* balances */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className={`rounded-lg p-3 border ${lowOkb ? 'bg-[#FF4D6D]/10 border-[#FF4D6D]/30' : 'bg-[#0A0E1A] border-[#1F2538]'}`}>
              <div className="text-[10px] uppercase tracking-widest text-[#8B92A8] mb-1">OKB · gas</div>
              <div className="font-mono text-sm font-bold tabular-nums">{okbStr}</div>
            </div>
            <div className="rounded-lg p-3 bg-[#0A0E1A] border border-[#1F2538]">
              <div className="text-[10px] uppercase tracking-widest text-[#8B92A8] mb-1">BANTM · stake</div>
              <div className="font-mono text-sm font-bold tabular-nums">
                {dusdtBalance !== undefined ? formatUsdt(dusdtBalance) : '-'}
              </div>
            </div>
          </div>

          {/* tribe + score */}
          <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-[#0A0E1A] border border-[#1F2538]">
            {tribe ? (
              <>
                <span className="text-3xl leading-none">{tribe.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate text-sm">{tribe.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#8B92A8]">Your tribe</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-[#00D26A]">Fan Score</div>
                  <div className="font-mono font-black tabular-nums">{score}</div>
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl leading-none">🏳️</span>
                <div className="flex-1 text-sm text-[#8B92A8]">No tribe yet</div>
                <Link
                  href="/tribes"
                  onClick={() => setOpen(false)}
                  className="text-xs font-bold text-[#00D26A]"
                >
                  Pick →
                </Link>
              </>
            )}
          </div>

          {/* quick actions */}
          <div className="mt-3 space-y-1">
            <button
              onClick={handleClaimBantm}
              disabled={claiming}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#00D26A]/10 border border-[#00D26A]/30 text-sm hover:bg-[#00D26A]/20 transition-colors disabled:opacity-50"
            >
              <span className="font-bold text-[#00D26A]">
                {claiming ? 'Claiming BANTM…' : claimError ?? '+ Claim 1000 BANTM'}
              </span>
              <span className="text-[#00D26A] text-xs">free · daily</span>
            </button>
            {lowOkb && (
              <a
                href="https://web3.okx.com/xlayer/faucet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-sm hover:bg-[#FF4D6D]/20 transition-colors"
              >
                <span className="font-bold">⛽ Get free OKB</span>
                <span className="text-[#FF4D6D] text-xs">Need gas ↗</span>
              </a>
            )}
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#0A0E1A] text-sm"
            >
              <span>View profile</span>
              <span className="text-[#8B92A8]">→</span>
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#0A0E1A] text-sm"
            >
              <span>Leaderboard</span>
              <span className="text-[#8B92A8]">→</span>
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#FF4D6D]/10 text-sm text-[#FF4D6D]"
            >
              <span>Sign out</span>
              <span>↩</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
