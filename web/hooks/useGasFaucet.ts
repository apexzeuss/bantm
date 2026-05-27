'use client';

import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

type ClaimResult =
  | { ok: true; hash: string; amount: string; explorer: string }
  | { ok: false; error: string };

export function useGasFaucet() {
  const { address } = useAccount();
  const [claiming, setClaiming] = useState(false);
  const [lastResult, setLastResult] = useState<ClaimResult | null>(null);

  const claim = useCallback(async (): Promise<ClaimResult> => {
    if (!address) {
      const r: ClaimResult = { ok: false, error: 'Connect a wallet first' };
      setLastResult(r);
      return r;
    }
    setClaiming(true);
    try {
      const res = await fetch('/api/gas-faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      const result: ClaimResult = res.ok
        ? { ok: true, hash: data.hash, amount: data.amount, explorer: data.explorer }
        : { ok: false, error: data.error ?? `HTTP ${res.status}` };
      setLastResult(result);
      return result;
    } catch (e) {
      const result: ClaimResult = {
        ok: false,
        error: e instanceof Error ? e.message : 'Network error',
      };
      setLastResult(result);
      return result;
    } finally {
      setClaiming(false);
    }
  }, [address]);

  return { claim, claiming, lastResult };
}
