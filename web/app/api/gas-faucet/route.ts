import { NextRequest, NextResponse } from 'next/server';
import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  isAddress,
  formatEther,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { xLayerTestnet } from '@/lib/wagmi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DRIP_AMOUNT = parseEther('0.002');
/** If a wallet already has more than this, deny the claim. Self-regulating rate limit. */
const ALREADY_FUNDED_THRESHOLD = parseEther('0.0008');

const HOT_WALLET_ADDRESS = '0xa04E724f567c7c531CB5A42327859A6327b14FB4' as const;

export async function POST(req: NextRequest) {
  const key = process.env.GAS_FAUCET_PRIVATE_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'Faucet is not configured. Use OKX faucet as a backup.' },
      { status: 503 },
    );
  }

  let address: string;
  try {
    const body = await req.json();
    address = body?.address;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
  }

  if (address.toLowerCase() === HOT_WALLET_ADDRESS.toLowerCase()) {
    return NextResponse.json({ error: 'Cannot claim to faucet wallet' }, { status: 400 });
  }

  const publicClient = createPublicClient({
    chain: xLayerTestnet,
    transport: http(),
  });

  try {
    const currentBalance = await publicClient.getBalance({ address: address as `0x${string}` });

    if (currentBalance > ALREADY_FUNDED_THRESHOLD) {
      const have = formatEther(currentBalance);
      return NextResponse.json(
        {
          error: `You already have ${Number(have).toFixed(4)} OKB. Spend it before claiming again.`,
        },
        { status: 429 },
      );
    }
  } catch (e) {
    console.error('[gas-faucet] balance check failed', e);
    // Fall through and let the user try anyway. RPC hiccups shouldn't block legitimate claims.
  }

  try {
    const account = privateKeyToAccount(
      key.startsWith('0x') ? (key as `0x${string}`) : (`0x${key}` as `0x${string}`),
    );
    const client = createWalletClient({
      account,
      chain: xLayerTestnet,
      transport: http(),
    });

    const hash = await client.sendTransaction({
      to: address as `0x${string}`,
      value: DRIP_AMOUNT,
    });

    return NextResponse.json({
      ok: true,
      hash,
      amount: '0.002',
      symbol: 'OKB',
      explorer: `https://www.oklink.com/xlayer-test/tx/${hash}`,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown failure';
    console.error('[gas-faucet]', message);
    if (message.toLowerCase().includes('insufficient')) {
      return NextResponse.json(
        { error: 'Faucet is drained. Use the OKX faucet as a backup.' },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: `Faucet failed: ${message.slice(0, 100)}` }, { status: 500 });
  }
}
