import { ErrorCode, StarknetSdkError } from '@/types'

export class SdkError extends Error implements StarknetSdkError {
  code: string
  details?: Record<string, unknown>

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'StarknetSdkError'
    this.code = code
    this.details = details
    Object.setPrototypeOf(this, SdkError.prototype)
  }

  static walletNotFound(walletId?: string): SdkError {
    return new SdkError(
      ErrorCode.WALLET_NOT_FOUND,
      walletId
        ? `Wallet with ID "${walletId}" not found or not available`
        : 'No compatible wallet found',
      {walletId}
    )
  }

  static connectionFailed(reason?: string): SdkError {
    return new SdkError(
      ErrorCode.CONNECTION_FAILED,
      `Failed to connect to wallet${reason ? `: ${reason}` : ''}`,
      {reason}
    )
  }

  static connectionRejected(): SdkError {
    return new SdkError(
      ErrorCode.CONNECTION_REJECTED,
      'Wallet connection was rejected by user'
    )
  }

  static biometricNotAvailable(): SdkError {
    return new SdkError(
      ErrorCode.BIOMETRIC_NOT_available,
      'Biometric authentication is not available on this device'
    )
  }

  static biometricAuthFailed(reason?: string): SdkError {
    return new SdkError(
      ErrorCode.BIOMETRIC_AUTH_FAILED,
      `Biometric authentication failed${reason ? `: ${reason}` : ''}`,
      {reason}
    )
  }

  static unauthorized(): SdkError {
    return new SdkError(
      ErrorCode.UNAUTHORIZED,
      'Operation requires authentication'
    )
  }

  static insufficientFunds(required?: string, available?: string): SdkError {
    return new SdkError(
      ErrorCode.INSUFFICIENT_FUNDS,
      'Insufficient funds for transaction',
      {required, available}
    )
  }

  static transactionFailed(hash?: string, reason?: string): SdkError {
    return new SdkError(
      ErrorCode.TRANSACTION_FAILED,
      `Transaction failed${reason ? `: ${reason}` : ''}`,
      {hash, reason}
    )
  }

  static invalidTransaction(reason?: string): SdkError {
    return new SdkError(
      ErrorCode.INVALID_TRANSACTION,
      `Invalid transaction${reason ? `: ${reason}` : ''}`,
      {reason}
    )
  }

  static accountNotDeployed(address?: string): SdkError {
    return new SdkError(
      ErrorCode.ACCOUNT_NOT_DEPLOYED,
      'Account is not deployed on Starknet',
      {address}
    )
  }

  static accountDeploymentFailed(reason?: string): SdkError {
    return new SdkError(
      ErrorCode.ACCOUNT_DEPLOYMENT_FAILED,
      `Account deployment failed${reason ? `: ${reason}` : ''}`,
      {reason}
    )
  }

  static networkError(message?: string): SdkError {
    return new SdkError(
      ErrorCode.NETWORK_ERROR,
      message || 'Network connection error'
    )
  }

  static rpcError(code?: number, message?: string): SdkError {
    return new SdkError(
      ErrorCode.RPC_ERROR,
      message || 'RPC request failed',
      {code}
    )
  }

  static paymasterError(message?: string): SdkError {
    return new SdkError(
      ErrorCode.PAYMASTER_ERROR,
      message || 'Paymaster operation failed'
    )
  }

  static paymasterNotConfigured(): SdkError {
    return new SdkError(
      ErrorCode.PAYMASTER_NOT_CONFIGURED,
      'No paymaster configured for this operation'
    )
  }

  static invalidConfiguration(field?: string): SdkError {
    return new SdkError(
      ErrorCode.INVALID_CONFIGURATION,
      field
        ? `Invalid configuration for field: ${field}`
        : 'Invalid SDK configuration'
    )
  }

  static operationCancelled(): SdkError {
    return new SdkError(
      ErrorCode.OPERATION_CANCELLED,
      'Operation was cancelled by user'
    )
  }
}

export const isStarknetSdkError = (error: unknown): error is StarknetSdkError =>
  error instanceof Error && 'code' in error

export const getErrorMessage = (error: unknown): string => {
  if (isStarknetSdkError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

export const handleAsyncError = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    if (isStarknetSdkError(error)) {
      throw error
    }
    throw new SdkError(
      ErrorCode.NETWORK_ERROR,
      getErrorMessage(error),
      {originalError: error}
    )
  }
} 