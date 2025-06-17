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

## Installation

```bash
npm install @keep-starknet-strange/starknet-react-native-sdk
# or
yarn add @keep-starknet-strange/starknet-react-native-sdk
```

## Usage

### Basic Setup

```typescript
import { StarknetProvider } from 'starknet-react-native-sdk/src/core/provider';


const provider = new StarknetProvider({
  network: 'mainnet', // or 'sepolia'
  rpcUrl: 'YOUR_RPC_URL',
  headers: {
    // Optional custom headers
  }
});

// Subscribe to provider state changes
const unsubscribe = provider.onStateChange((state) => {
  console.log('Provider state:', state);
});

// Clean up when done
provider.destroy();
```

### Network Operations

```typescript
// Get current block number
const blockNumber = await provider.getBlockNumber();

// Get chain ID
const chainId = await provider.getChainId();

// Get block information
const block = await provider.getBlockWithTxs(blockId);

// Get transaction status
const txStatus = await provider.getTransactionStatus(txHash);
```

### Contract Interactions

```typescript
// Call a contract
const result = await provider.callContract({
  contractAddress: '0x...',
  entrypoint: 'function_name',
  calldata: [...]
}, 'latest');

// Get storage value
const storage = await provider.getStorageAt(
  '0x...', // contract address
  '0x...', // storage key
  'latest'
);
```

### Event Handling

```typescript
// Get events
const events = await provider.getEvents({
  from_block: 'latest',
  to_block: 'latest',
  address: '0x...',
  keys: [['0x...']],
  chunk_size: 10
});
```

### Fee Estimation

```typescript
// Estimate transaction fee
const fee = await provider.getEstimateFee(
  {
    contractAddress: '0x...',
    entrypoint: 'function_name',
    calldata: [...]
  },
  'latest'
);

// Estimate message fee
const messageFee = await provider.estimateMessageFee(
  {
    // message details
  },
  'latest'
);
```

## API Reference

### Constructor

```typescript
new StarknetProvider(config: StarknetProviderConfig)
```

#### Config Options

- `network`: 'mainnet' | 'sepolia'
- `rpcUrl`: string (required)
- `headers`: Record<string, string> (optional)

### Methods

- `getState()`: Get current provider state
- `getNetworkName()`: Get current network name
- `getCurrentRpcUrl()`: Get current RPC URL
- `switchProvider(config)`: Switch to a different provider
- `destroy()`: Clean up resources

### Provider State

```typescript
interface ProviderState {
  isConnected: boolean;
  lastBlockNumber?: number;
  network: Network;
  isOnline: boolean;
}
```

## Error Handling

The provider includes built-in error handling for common scenarios:
- Network connectivity issues
- RPC endpoint failures
- Invalid configuration
- Transaction failures

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License] 
