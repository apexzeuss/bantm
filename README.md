# bantM

> Football tribes, on-chain. Pick your team. Stake. Beef on-chain.

bantM is a World Cup 2026 social prediction market built on **X Layer Testnet** for the **#XCupHackathon**. Sign in with Google (no MetaMask required), lock your fan tribe, stake BANTM tokens on World Cup outcomes, and beef with opposing fans.

## What's in here

- [`contracts/`](contracts/) — Solidity for the BANTM ERC-20 + the BantmMarket prediction-market contract
- [`web/`](web/) — Next.js 16 app (Tailwind v4, wagmi v3, viem, Privy embedded wallets)
- [`deployments.json`](deployments.json) — Live contract addresses on X Layer Testnet

## Deployed contracts (X Layer Testnet · chainId 1952)

| Contract | Address |
|---|---|
| **BantmToken** (BANTM, 6 decimals) | `0x6fd04e69165652c1AC79de956F1AA5732e41920c` |
| **BantmMarket** | `0x20dB44C21e8c6b6c037bE496ea8066F98cbdE695` |

Block explorer: [oklink.com/xlayer-test](https://www.oklink.com/xlayer-test)

## How the mechanic works

1. Sign in with Google / X / Discord / Email (Privy creates an embedded EVM wallet)
2. Claim free BANTM and free OKB (gas) from in-app + X Layer faucets
3. Pick your tribe (1 of 32 World Cup teams, one-time, on-chain)
4. Stake BANTM on market outcomes. Opposing fans stake against you. The pot grows.
5. After settlement, winning side splits the losing side's stakes proportional to their share.
6. Climb the leaderboard. Earn a real Fan Score (`winRate × 1000 + log₁₀(stakedVolume) × 100`).

## Live now

- 6 markets across Tournament Winner, Golden Boot, Best Young Player, host-nation drama, and prop bets
- Real-time World Cup news ticker (NewsAPI)
- Public on-chain Fan Score, tribe leaderboard, and top fans by volume
- Shareable profile card with one-click X tweet

## Local dev

```bash
cd web
npm install --legacy-peer-deps
npm run dev
```

Set `web/.env.local`:

```
NEXT_PUBLIC_PRIVY_APP_ID=...
NEWSAPI_KEY=...
```

## Built for

[#XCupHackathon](https://x.com/XLayerOfficial) by [@bantM_](https://x.com/bantM_).
