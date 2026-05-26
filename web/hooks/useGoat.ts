'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { goatById, type Goat } from '@/lib/goats';

const keyFor = (address?: string) => (address ? `bantm:goat:${address.toLowerCase()}` : null);

export function useGoat(): {
  goat: Goat | undefined;
  setGoat: (id: Goat['id']) => void;
  clearGoat: () => void;
  ready: boolean;
} {
  const { address } = useAccount();
  const [goatId, setGoatId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const k = keyFor(address);
    if (!k) {
      setGoatId(null);
      setReady(true);
      return;
    }
    if (typeof window === 'undefined') return;
    setGoatId(window.localStorage.getItem(k));
    setReady(true);
  }, [address]);

  const setGoat = useCallback(
    (id: Goat['id']) => {
      const k = keyFor(address);
      if (!k || typeof window === 'undefined') return;
      window.localStorage.setItem(k, id);
      setGoatId(id);
    },
    [address],
  );

  const clearGoat = useCallback(() => {
    const k = keyFor(address);
    if (!k || typeof window === 'undefined') return;
    window.localStorage.removeItem(k);
    setGoatId(null);
  }, [address]);

  return {
    goat: goatId ? goatById(goatId) : undefined,
    setGoat,
    clearGoat,
    ready,
  };
}
