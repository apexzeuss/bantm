'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { config, xLayerTestnet } from '@/lib/wagmi';
import { WalletSync } from '@/components/WalletSync';
import { GoatPicker } from '@/components/GoatPicker';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'discord', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#00D26A',
          logo: undefined,
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        defaultChain: xLayerTestnet,
        supportedChains: [xLayerTestnet],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <WalletSync />
          {children}
          <GoatPicker />
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
