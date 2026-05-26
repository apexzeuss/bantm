'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { GOATS, type Goat } from '@/lib/goats';
import { useGoat } from '@/hooks/useGoat';

const STORAGE_DISMISSED = 'bantm:goat:dismissed';

export function GoatPicker() {
  const { authenticated, ready: privyReady } = usePrivy();
  const { address } = useAccount();
  const { goat, setGoat, ready: goatReady } = useGoat();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<Goat | null>(null);

  useEffect(() => {
    if (!privyReady || !goatReady) return;
    if (!authenticated || !address) {
      setOpen(false);
      return;
    }
    if (goat) {
      setOpen(false);
      return;
    }
    if (typeof window !== 'undefined') {
      const dismissed = window.localStorage.getItem(STORAGE_DISMISSED + ':' + address.toLowerCase());
      if (dismissed) return;
    }
    setOpen(true);
  }, [authenticated, address, goat, privyReady, goatReady]);

  const dismissForever = () => {
    if (!address || typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_DISMISSED + ':' + address.toLowerCase(), '1');
    setOpen(false);
  };

  const onPick = (g: Goat) => {
    setPicked(g);
    setTimeout(() => {
      setGoat(g.id);
      setOpen(false);
      setPicked(null);
    }, 900);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-[#131826] border border-[#1F2538] p-6 sm:p-8 relative">
        <button
          onClick={dismissForever}
          className="absolute top-4 right-4 text-[#8B92A8] hover:text-white text-sm"
          aria-label="Close"
        >
          Skip
        </button>

        <div className="text-[10px] uppercase tracking-widest text-[#00D26A] font-bold mb-2">
          One question before you stake
        </div>
        <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-2">
          Who&apos;s the GOAT?
        </h2>
        <p className="text-[#8B92A8] mb-6 text-sm">
          Pick one. They become your profile picture across bantM.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {GOATS.map((g) => {
            const isPicked = picked?.id === g.id;
            return (
              <button
                key={g.id}
                onClick={() => onPick(g)}
                disabled={!!picked}
                className={`group relative rounded-2xl border-2 p-5 text-left transition-all overflow-hidden ${
                  isPicked
                    ? 'scale-[1.03]'
                    : picked
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:-translate-y-0.5'
                }`}
                style={{
                  background: `linear-gradient(160deg, ${g.color}, ${g.color}33 70%, #131826)`,
                  borderColor: isPicked ? g.color : `${g.color}44`,
                }}
              >
                <div className="text-5xl mb-3 leading-none">{g.flag}</div>
                <div
                  className="font-black text-2xl leading-tight tracking-tight"
                  style={{ color: g.textColor }}
                >
                  {g.short}
                </div>
                <div
                  className="text-[10px] uppercase tracking-widest font-bold opacity-80 mt-1"
                  style={{ color: g.textColor }}
                >
                  {g.country}
                </div>

                {isPicked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-black text-lg rounded-2xl">
                    Locked in ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-[#555A6B] text-center mt-5">
          Saved locally on this device. You can change it later from your profile.
        </p>
      </div>
    </div>
  );
}
