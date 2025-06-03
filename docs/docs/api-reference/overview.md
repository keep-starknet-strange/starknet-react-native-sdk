---
sidebar_position: 1
title: API Overview
---

# API Reference Overview

Complete API reference for the Starknet React Native SDK.

## Core Modules

### [Types](./types)
Type definitions and interfaces for the entire SDK.

```typescript
import type { 
  StarknetConfig, 
  WalletConnector, 
  StarknetAccount 
} from '@starknet/react-native-sdk'
```

### [Providers](./providers)
Network provider and configuration management.

```typescript
import { createProvider, StarknetNetwork } from '@starknet/react-native-sdk'
```

### [Wallets](./wallets)
Wallet connectors and management.

```typescript
import { 
  getDefaultConnectors, 
  ArgentXConnector, 
  BraavosConnector 
} from '@starknet/react-native-sdk'
```

### [Utils](./utils)
Utility functions for validation, formatting, and error handling.

```typescript
import { 
  isValidStarknetAddress, 
  normalizeAddress, 
  SdkError 
} from '@starknet/react-native-sdk'
```

### [Errors](./errors)
Error handling and typed error classes.

```typescript
import { SdkError, ErrorCode } from '@starknet/react-native-sdk'
```

## Auto-Generated API Documentation

For complete, auto-generated API documentation from TypeScript source code, visit the [TypeDoc API Reference](/api/).

## Constants

```typescript
export const VERSION = '0.1.0'
export const SDK_NAME = 'Starknet React Native SDK'
```

## Quick Reference

### Common Imports

```typescript
// Core functionality
import {
  createProvider,
  getDefaultConnectors,
  StarknetNetwork,
  SdkError,
  ErrorCode
} from '@starknet/react-native-sdk'

// Type definitions
import type {
  StarknetConfig,
  WalletConnector,
  StarknetAccount,
  TransactionRequest,
  TransactionResult
} from '@starknet/react-native-sdk'
```

### Error Handling

```typescript
import { SdkError, isStarknetSdkError } from '@starknet/react-native-sdk'

try {
  await connector.connect()
} catch (error) {
  if (isStarknetSdkError(error)) {
    console.log('SDK Error:', error.code, error.message)
  }
}
```

### Network Configuration

```typescript
import { createProvider, StarknetNetwork } from '@starknet/react-native-sdk'

const provider = createProvider({
  networkId: StarknetNetwork.TESTNET,
  chainId: '0x534e5f5345504f4c4941'
})
``` 