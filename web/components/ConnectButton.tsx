'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useSwitchChain } from 'wagmi';
import { xLayerTestnet } from '@/lib/wagmi';
import { AccountMenu } from './AccountMenu';

export function ConnectButton() {
  const { ready, authenticated, login } = usePrivy();
  const { address, chainId } = useAccount();
  const { switchChain, isPending: switching } = useSwitchChain();

  if (!ready) {
    return (
      <div className="px-4 py-2 rounded-full bg-[#131826] border border-[#1F2538] text-sm font-mono text-[#8B92A8]">
        Loading…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={login}
          className="hidden sm:inline-block px-3 py-2 text-sm font-bold text-[#8B92A8] hover:text-white transition-colors"
        >
          Log in
        </button>
        <button
          onClick={login}
          className="px-4 py-2 rounded-full bg-[#00D26A] text-black font-bold text-sm hover:bg-[#00E876] transition-colors"
        >
          Sign up
        </button>
      </div>
    );
  }

  const onWrongNetwork = address && chainId !== xLayerTestnet.id;
  if (onWrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: xLayerTestnet.id })}
        disabled={switching}
        className="px-4 py-2 rounded-full bg-[#FF4D6D] text-white font-bold text-sm hover:bg-[#FF6680] disabled:opacity-50"
      >
        {switching ? 'Switching…' : 'Switch to X Layer'}
      </button>
    );
  }

  return <AccountMenu />;
}
