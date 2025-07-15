export * from './types'
export * from './utils/errors'
export * from './utils/storage'
export * from './utils/validation'
export * from './core/providers'
export * from './wallets'

export {SdkError} from './utils/errors'
export {createProvider, getDefaultConfig, NETWORK_CONFIGS} from './core/providers'
export {createSecureStorage} from './utils/storage'
export {
  getDefaultConnectors,
  getConnectorById,
  getAvailableConnectors
} from './wallets'
export {CallData} from './utils/calldata/CallData'

// Import components for compatibility with starknet package format

import {RpcProvider} from './core/rpc-provider'
import {starkCurve} from './utils/ec/starkCurve'
import {calculateContractAddressFromHash} from './utils/hash/classHash'
import {StarknetChainId} from './global/constants'
// TO DO ADD ACCOUNT
// Export components for compatibility with starknet package format
export {Account}
export {RpcProvider}
export {starkCurve}
export {calculateContractAddressFromHash}
export {StarknetChainId}

// Export in the format expected by starknet package
export const constants = { StarknetChainId };
export const ec = { starkCurve };
export const hash = { calculateContractAddressFromHash };

export const VERSION = '0.1.0'
export const SDK_NAME = 'Starknet React Native SDK' 
