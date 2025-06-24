// url

const _BaseUrl = {
  SN_MAIN: 'https://alpha-mainnet.starknet.io',
  SN_SEPOLIA: 'https://alpha-sepolia.starknet.io',
} as const;
type _BaseUrl = ValuesType<typeof _BaseUrl>;
export { _BaseUrl as BaseUrl };

export const NetworkName = {
  SN_MAIN: 'SN_MAIN',
  SN_SEPOLIA: 'SN_SEPOLIA',
} as const;

export type NetworkName = typeof NetworkName[keyof typeof NetworkName];

// Chain IDs

const _StarknetChainId = {
  SN_MAIN: '0x534e5f4d41494e', // encodeShortString('SN_MAIN'),
  SN_SEPOLIA: '0x534e5f5345504f4c4941', // encodeShortString('SN_SEPOLIA')
} as const;
type _StarknetChainId = ValuesType<typeof _StarknetChainId>;
export { _StarknetChainId as StarknetChainId };

const _TransactionHashPrefix = {
  DECLARE: '0x6465636c617265', // encodeShortString('declare'),
  DEPLOY: '0x6465706c6f79', // encodeShortString('deploy'),
  DEPLOY_ACCOUNT: '0x6465706c6f795f6163636f756e74', // encodeShortString('deploy_account'),
  INVOKE: '0x696e766f6b65', // encodeShortString('invoke'),
  L1_HANDLER: '0x6c315f68616e646c6572', // encodeShortString('l1_handler'),
} as const;
type _TransactionHashPrefix = ValuesType<typeof _TransactionHashPrefix>;
export { _TransactionHashPrefix as TransactionHashPrefix };

/**
 * dot format rpc versions
 */
const _SupportedRpcVersion = {
  '0.7.1': '0.7.1',
  '0.8.1': '0.8.1',
  v0_7_1: '0.7.1',
  v0_8_1: '0.8.1',
} as const;
type _SupportedRpcVersion = ValuesType<typeof _SupportedRpcVersion>;
export { _SupportedRpcVersion as SupportedRpcVersion };


// RPC Nodes
export const RPC_DEFAULT_NODES = {
  SN_MAIN: [`https://starknet-mainnet.public.blastapi.io/rpc/`],
  SN_SEPOLIA: [`https://starknet-sepolia.public.blastapi.io/rpc/`],
} as const;

// React Native Specific Constants
export const REACT_NATIVE_CONFIG = {
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  DEFAULT_RETRY_ATTEMPTS: 3,
  NETWORK_CHECK_INTERVAL: 5000, // 5 seconds
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error',
  TIMEOUT_ERROR: 'Request timeout',
  INVALID_RPC_URL: 'Invalid RPC URL',
  NETWORK_NOT_SUPPORTED: 'Network not supported',
  PROVIDER_NOT_INITIALIZED: 'Provider not initialized',
  NETWORK_CONNECTION_LOST: 'Network connection lost',
  NETWORK_CONNECTION_RESTORED: 'Network connection restored',
  NETWORK_CONNECTION_SLOW: 'Network connection is slow',
  NETWORK_CONNECTION_UNSTABLE: 'Network connection is unstable',
} as const;

// Transaction Types
export const TransactionType = {
  INVOKE: 'INVOKE',
  DECLARE: 'DECLARE',
  DEPLOY: 'DEPLOY',
  DEPLOY_ACCOUNT: 'DEPLOY_ACCOUNT',
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

// Network State Types
export const NetworkStateType = {
  WIFI: 'wifi',
  CELLULAR: 'cellular',
  NONE: 'none',
} as const;

export type NetworkStateType = typeof NetworkStateType[keyof typeof NetworkStateType];

export const UDC = {
  ADDRESS: '0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf',
  ENTRYPOINT: 'deployContract',
} as const;

export const OutsideExecutionCallerAny = '0x414e595f43414c4c4552'; // encodeShortString('ANY_CALLER')
export const SNIP9_V1_INTERFACE_ID =
  '0x68cfd18b92d1907b8ba3cc324900277f5a3622099431ea85dd8089255e4181';
export const SNIP9_V2_INTERFACE_ID =
  '0x1d1144bb2138366ff28d8e9ab57456b1d332ac42196230c3a602003c89872';
export const ADDR_BOUND = 2n ** 251n - MAX_STORAGE_ITEM_SIZE;


// Default Configuration
export const DEFAULT_CONFIG = {
  network: NetworkName.SN_SEPOLIA,
  timeout: REACT_NATIVE_CONFIG.DEFAULT_TIMEOUT,
  retryAttempts: REACT_NATIVE_CONFIG.DEFAULT_RETRY_ATTEMPTS,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;
