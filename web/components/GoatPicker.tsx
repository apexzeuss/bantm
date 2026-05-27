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
      <div className="w-full max-w-2xl rounded-3xl bg-[#131826] border border-[#1F2538] p-6 sm:p-8 relative modal-pop">
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
                className={`group relative rounded-2xl border-2 text-left transition-all overflow-hidden h-72 ${
                  isPicked
                    ? 'scale-[1.03]'
                    : picked
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:-translate-y-1 hover:shadow-2xl'
                }`}
                style={{
                  background: `linear-gradient(160deg, ${g.color}, ${g.color}66 50%, #131826)`,
                  borderColor: isPicked ? g.color : `${g.color}66`,
                }}
              >
                <img
                  src={g.image}
                  alt={g.name}
                  className="absolute inset-x-0 top-0 w-full h-full object-cover object-top opacity-95"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(180deg, transparent 35%, ${g.color}cc 75%, #0A0E1A 100%)` }}
                />
                <div className="relative h-full flex flex-col justify-end p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl leading-none">{g.flag}</span>
                    <div
                      className="text-[10px] uppercase tracking-widest font-bold opacity-90"
                      style={{ color: g.textColor }}
                    >
                      {g.country}
                    </div>
                  </div>
                  <div
                    className="font-black text-2xl leading-tight tracking-tight"
                    style={{ color: g.textColor }}
                  >
                    {g.short}
                  </div>
                </div>

                {isPicked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white font-black text-lg rounded-2xl backdrop-blur-sm">
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
