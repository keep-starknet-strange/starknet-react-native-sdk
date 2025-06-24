# StarknetProvider SDK

A React Native SDK for interacting with Starknet networks, wrapper of Startknet.js.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/keep-starknet-strange/starknet-react-native-sdk)

> Source: [starknet-react-native-sdk](https://github.com/keep-starknet-strange/starknet-react-native-sdk/blob/main/src/core/provider.ts)

## Method Test Status

| Method | Status | Notes |
|--------|--------|-------|
| starknet_specVersion | ✅ Tested | |
| starknet_getBlockWithTxHashes | ✅ Tested | |
| starknet_getBlockWithTxs | ✅ Tested | |
| starknet_getBlockWithReceipts | ✅ Tested | |
| starknet_getStateUpdate | ✅ Tested | |
| starknet_getStorageAt | ✅ Tested | |
| starknet_getTransactionStatus | ✅ Tested | |
| starknet_getTransactionByHash | ✅ Tested | |
| starknet_getTransactionByBlockIdAndIndex | ✅ Tested | |
| starknet_getTransactionReceipt | ✅ Tested | |
| starknet_getClass | ✅ Tested | |
| starknet_getClassHashAt | ✅ Tested | |
| starknet_getClassAt | ✅ Tested | |
| starknet_getBlockTransactionCount | ✅ Tested | |
| starknet_call | ✅ Tested | |
| starknet_estimateFee | ❌ Not Implemented | |
| starknet_estimateMessageFee | ❌ Not Tested | |
| starknet_blockNumber | ✅ Tested | |
| starknet_blockHashAndNumber | ✅ Tested | |
| starknet_chainId | ✅ Tested | |
| starknet_getSyncingStats | ✅ Tested | |
| starknet_getEvents | ✅ Tested | |
| starknet_getNonceForAddress | ✅ Tested | |

## Files

- `rpc-provider.ts` - Standalone RPC provider implementation
- `provider.ts` - StarknetProvider with network monitoring
- `example.ts` - Usage examples
- `README.md` - This documentation

### Type Organization

```
types/lib/index.ts          ← Core Starknet types (Call, Invocation, BlockIdentifier, etc.)
types/provider.ts           ← Provider types (ProviderState, EventFilter, response types, etc.)
core/rpc-provider.ts        ← RPC implementation
core/StarknetProvider.ts    ← StarknetProvider
```

## RpcProvider

### Usage

```typescript
import { RpcProvider } from './rpc-provider';
import { Call } from '../types/lib';
import { FeeEstimate } from '../types/provider';

const provider = new RpcProvider({
  nodeUrl: 'https://alpha-mainnet.starknet.io',
  headers: {
    'Authorization': 'Bearer your-api-key' // Optional
  },
  retries: 3,
  timeout: 30000
});

// Get chain ID
const chainId = await provider.getChainId();

// Get latest block number
const blockNumber = await provider.getBlockNumber();

// Call a contract
const result = await provider.callContract({
  contractAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  entrypoint: 'balanceOf',
  calldata: ['0x1234567890abcdef']
} as Call, 'latest');

// Estimate fees with proper typing
const feeEstimate: FeeEstimate = await provider.getEstimateFee(tx, details);
```

## StarknetProvider

A higher-level provider that wraps RpcProvider with additional features like network monitoring and state management.

### Usage

```typescript
import { StarknetProvider } from './provider';
import { StarknetProviderConfig } from '../types/provider';

const provider = new StarknetProvider({
  network: 'mainnet',
  rpcUrl: 'https://alpha-mainnet.starknet.io',
  headers: {
    'Authorization': 'Bearer your-api-key' // Optional
  }
});

// Subscribe to state changes
const unsubscribe = provider.onStateChange((state) => {
  console.log('Provider state:', state);
});

// Get current state
const state = provider.getState();

// Switch to different network
await provider.switchProvider({
  network: 'sepolia',
  rpcUrl: 'https://alpha-sepolia.starknet.io'
});

// Clean up
unsubscribe();
provider.destroy();
```

### State Management

The provider maintains a state object with:

```typescript
interface ProviderState {
  isConnected: boolean;    // Connection to RPC node
  lastBlockNumber?: number; // Latest block number
  network: Network;        // Current network
  isOnline: boolean;       // Internet connectivity
}
```

### Network Monitoring

The provider automatically monitors network connectivity by making periodic HEAD requests to a reliable endpoint. This helps detect when the device goes offline.

## Configuration

### RpcProviderOptions

```typescript
interface RpcProviderOptions {
  nodeUrl: string;                    // RPC endpoint URL
  headers?: Record<string, string>;   // Custom headers
  retries?: number;                   // Number of retries (default: 3)
  timeout?: number;                   // Request timeout in ms (default: 30000)
}
```

### StarknetProviderConfig

```typescript
interface StarknetProviderConfig {
  network: Network;                   // 'mainnet' | 'sepolia'
  rpcUrl: string;                     // RPC endpoint URL
  headers?: Record<string, string>;   // Custom headers
}
```

## Error Handling

Both providers include comprehensive error handling:

- Network errors are caught and reported
- RPC errors include detailed error messages
- Timeout handling prevents hanging requests
- Automatic retries for transient failures

## Examples

See `example.ts` for complete usage examples including:

- Basic RPC provider usage with proper typing
- StarknetProvider with state management
- Fee estimation with typed responses
- Event filtering
- Contract calls
