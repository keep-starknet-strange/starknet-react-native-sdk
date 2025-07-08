// Local error definitions (copied from Starknet.js without external imports)
export const PAYMASTER_API = {
  // Add any paymaster API constants here
} as const;

// Basic error types
export interface StarknetError extends Error {
  code: string;
  details?: Record<string, unknown>;
}

export const ErrorCode = {
  // Connection errors
  WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  CONNECTION_REJECTED: 'CONNECTION_REJECTED',
  
  // Authentication errors
  BIOMETRIC_NOT_AVAILABLE: 'BIOMETRIC_NOT_AVAILABLE',
  BIOMETRIC_AUTH_FAILED: 'BIOMETRIC_AUTH_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // Transaction errors
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  INVALID_TRANSACTION: 'INVALID_TRANSACTION',
  
  // Account errors
  ACCOUNT_NOT_DEPLOYED: 'ACCOUNT_NOT_DEPLOYED',
  ACCOUNT_DEPLOYMENT_FAILED: 'ACCOUNT_DEPLOYMENT_FAILED',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  RPC_ERROR: 'RPC_ERROR',
  
  // Paymaster errors
  PAYMASTER_ERROR: 'PAYMASTER_ERROR',
  PAYMASTER_NOT_CONFIGURED: 'PAYMASTER_NOT_CONFIGURED',
  
  // General errors
  INVALID_CONFIGURATION: 'INVALID_CONFIGURATION',
  OPERATION_CANCELLED: 'OPERATION_CANCELLED'
} as const;
