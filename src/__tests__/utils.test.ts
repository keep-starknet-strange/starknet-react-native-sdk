import { SdkError, isStarknetSdkError } from '../utils/errors'
import { ErrorCode } from '../types'
import { isValidStarknetAddress, normalizeAddress, formatAddress } from '../utils/validation'

describe('Error Utilities', () => {
  test('creates SdkError correctly', () => {
    const error = new SdkError(ErrorCode.WALLET_NOT_FOUND, 'Test message')
    
    expect(error).toBeInstanceOf(Error)
    expect(error.code).toBe(ErrorCode.WALLET_NOT_FOUND)
    expect(error.message).toBe('Test message')
    expect(error.name).toBe('StarknetSdkError')
  })

  test('isStarknetSdkError identifies SDK errors correctly', () => {
    const sdkError = new SdkError(ErrorCode.TRANSACTION_FAILED, 'Invalid address')
    const regularError = new Error('Regular error')
    
    expect(isStarknetSdkError(sdkError)).toBe(true)
    expect(isStarknetSdkError(regularError)).toBe(false)
    expect(isStarknetSdkError(null)).toBe(false)
    expect(isStarknetSdkError(undefined)).toBe(false)
  })

  test('SdkError static methods work correctly', () => {
    const error = SdkError.connectionFailed('Network timeout')
    expect(error.code).toBe(ErrorCode.CONNECTION_FAILED)
    expect(error.message).toContain('Network timeout')
  })

  test('SdkError includes user-friendly messages', () => {
    const error = SdkError.walletNotFound('test-wallet')
    expect(error.message).toContain('test-wallet')
    expect(error.message).toContain('not found')
  })
})

describe('Address Validation', () => {
  const validAddress = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
  const invalidAddresses = [
    '',
    'invalid',
    '0x' + 'a'.repeat(65), // too long
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dcg' // invalid hex
  ]

  test('validates correct Starknet addresses', () => {
    expect(isValidStarknetAddress(validAddress)).toBe(true)
    expect(isValidStarknetAddress('0x123')).toBe(true) // short addresses are valid
    expect(isValidStarknetAddress('0x')).toBe(false) // empty after 0x
  })

  test('rejects invalid addresses', () => {
    invalidAddresses.forEach(address => {
      expect(isValidStarknetAddress(address)).toBe(false)
    })
  })

  test('normalizes addresses correctly', () => {
    const address = '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
    const normalized = normalizeAddress(address)
    
    expect(normalized).toBe('0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7')
    expect(normalized).toHaveLength(66) // 0x + 64 chars
  })

  test('formats addresses for display', () => {
    const formatted = formatAddress(validAddress)
    
    expect(formatted).toMatch(/^0x[a-fA-F0-9]{8}\.{3}[a-fA-F0-9]{8}$/)
    expect(formatted).toBe('0x049d3657...9e004dc7')
  })

  test('handles edge cases in formatting', () => {
    expect(formatAddress('')).toBe('')
    const shortFormatted = formatAddress('0x123')
    expect(shortFormatted).toMatch(/^0x[a-fA-F0-9]+\.{3}[a-fA-F0-9]+$/)
  })
})

describe('Error Codes', () => {
  test('key error codes are defined', () => {
    const expectedCodes = [
      'WALLET_NOT_FOUND',
      'CONNECTION_FAILED', 
      'CONNECTION_REJECTED',
      'TRANSACTION_FAILED',
      'NETWORK_ERROR'
    ]
    
    expectedCodes.forEach(code => {
      expect(ErrorCode[code as keyof typeof ErrorCode]).toBeDefined()
    })
  })
}) 