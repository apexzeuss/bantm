'use client';

import { useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { useSetActiveWallet } from '@privy-io/wagmi';

/**
 * Forces the Privy embedded wallet (created by social/email login) to be the
 * active wallet for wagmi hooks. Without this, if a user has both an embedded
 * wallet AND a linked external wallet (MetaMask etc.), wagmi may surface the
 * external one . making their tribe + stakes appear under the wrong address.
 */
export function WalletSync() {
  const { wallets, ready } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();

  useEffect(() => {
    if (!ready) return;
    const embedded = wallets.find((w) => w.walletClientType === 'privy');
    if (embedded) {
      void setActiveWallet(embedded);
    }
  }, [ready, wallets, setActiveWallet]);

  return null;
}
