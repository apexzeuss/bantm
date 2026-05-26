import { http } from 'wagmi';
import { defineChain } from 'viem';
import { createConfig } from '@privy-io/wagmi';

export const xLayerTestnet = defineChain({
  id: 1952,
  name: 'X Layer Testnet',
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://xlayer-testnet.drpc.org',
        'https://testrpc.xlayer.tech',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'OKLink', url: 'https://www.oklink.com/xlayer-test' },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [xLayerTestnet],
  transports: {
    [xLayerTestnet.id]: http(),
  },
});
