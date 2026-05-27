import { parseAbi } from 'viem';

export const BANTM_MARKET_ADDRESS = '0x20dB44C21e8c6b6c037bE496ea8066F98cbdE695' as const;
export const BANTM_TOKEN_ADDRESS = '0x6fd04e69165652c1AC79de956F1AA5732e41920c' as const;

/**
 * Markets that were seeded with bad text or replaced by a corrected version.
 * They still exist on-chain but the frontend filters them out so users only see the canonical ones.
 * Match by exact question text (case-sensitive) — index-proof against re-deploys.
 */
export const HIDDEN_MARKET_QUESTIONS: ReadonlySet<string> = new Set([
  'Will the Argentina reach the knockout rounds?',
]);
export const HIDDEN_MARKET_IDS: ReadonlySet<number> = new Set([]);

export const bantmTokenAbi = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function faucet()',
  'function lastFaucetClaim(address) view returns (uint256)',
  'function FAUCET_AMOUNT() view returns (uint256)',
  'function FAUCET_COOLDOWN() view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
] as const);

export const bantmMarketAbi = parseAbi([
  'function setTribe(uint256 teamId)',
  'function stake(uint256 marketId, uint256 optionIdx, uint256 amount)',
  'function claim(uint256 marketId)',
  'function createMarket(string question, string[] options, uint256 deadline) returns (uint256)',
  'function settleMarket(uint256 marketId, uint256 winningOption)',
  'function owner() view returns (address)',
  'function stakingToken() view returns (address)',
  'function teams(uint256) view returns (string)',
  'function teamCount() view returns (uint256)',
  'function getTeams() view returns (string[])',
  'function marketCount() view returns (uint256)',
  'function getMarket(uint256 marketId) view returns (string question, string[] options, uint256 deadline, bool settled, uint256 winningOption, uint256 totalPool)',
  'function getOptionTotals(uint256 marketId) view returns (uint256[])',
  'function getUserStake(uint256 marketId, address user, uint256 optionIdx) view returns (uint256)',
  'function hasClaimed(uint256 marketId, address user) view returns (bool)',
  'function profiles(address) view returns (uint256 tribe, bool tribeSet, uint256 totalStaked, uint256 totalWon)',
  'event MarketCreated(uint256 indexed marketId, string question, uint256 deadline)',
  'event Staked(uint256 indexed marketId, address indexed user, uint256 optionIdx, uint256 amount)',
  'event MarketSettled(uint256 indexed marketId, uint256 winningOption)',
  'event Claimed(uint256 indexed marketId, address indexed user, uint256 payout)',
  'event TribeSet(address indexed user, uint256 teamId)',
] as const);
