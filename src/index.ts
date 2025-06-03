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

export const VERSION = '0.1.0'
export const SDK_NAME = 'Starknet React Native SDK' 