import {
    VERSION,
    SDK_NAME,
    SdkError,
    ErrorCode,
    StarknetNetwork,
    createProvider,
    getDefaultConnectors,
    isValidStarknetAddress,
    normalizeAddress,
    formatAddress
} from '../index'

describe('Starknet React Native SDK', () => {
  test('exports version and name', () => {
    expect(VERSION).toBe('0.1.0')
    expect(SDK_NAME).toBe('Starknet React Native SDK')
  })

  test('creates SDK error correctly', () => {
    const error = SdkError.walletNotFound('test-wallet')
    expect(error.code).toBe(ErrorCode.WALLET_NOT_FOUND)
    expect(error.message).toContain('test-wallet')
  })

  test('creates provider with valid config', () => {
    const provider = createProvider({
      networkId: StarknetNetwork.TESTNET,
      chainId: '0x534e5f5345504f4c4941'
    })
    
    expect(provider.chainId).toBe('0x534e5f5345504f4c4941')
    expect(provider.networkName).toBe('Starknet Testnet')
  })

  test('gets default wallet connectors', () => {
    const connectors = getDefaultConnectors()
    expect(connectors).toHaveLength(2)
    expect(connectors[0].id).toBe('argentx')
    expect(connectors[1].id).toBe('braavos')
  })

  test('validates Starknet addresses correctly', () => {
    const validAddress = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
    const invalidAddress = '0xinvalid'
    
    expect(isValidStarknetAddress(validAddress)).toBe(true)
    expect(isValidStarknetAddress(invalidAddress)).toBe(false)
  })

  test('normalizes addresses correctly', () => {
    const address = '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
    const normalized = normalizeAddress(address)
    
    expect(normalized).toBe('0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7')
  })

  test('formats addresses correctly', () => {
    const address = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
    const formatted = formatAddress(address)
    
    expect(formatted).toBe('0x049d3657...9e004dc7')
  })
}) 