import { StarknetConfig, StarknetNetwork, NetworkInfo, TokenInfo } from '@/types'
import { SdkError } from '@/utils/errors'

export const NETWORK_CONFIGS: Record<StarknetNetwork, NetworkInfo> = {
  [StarknetNetwork.MAINNET]: {
    chainId: '0x534e5f4d41494e',
    name: 'Starknet Mainnet',
    rpcUrl: 'https://starknet-mainnet.public.blastapi.io',
    explorerUrl: 'https://starkscan.co',
    tokens: [
      {
        address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      {
        address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
        name: 'Starknet Token',
        symbol: 'STRK',
        decimals: 18
      }
    ]
  },
  [StarknetNetwork.TESTNET]: {
    chainId: '0x534e5f5345504f4c4941',
    name: 'Starknet Testnet',
    rpcUrl: 'https://starknet-sepolia.public.blastapi.io',
    explorerUrl: 'https://sepolia.starkscan.co',
    tokens: [
      {
        address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      {
        address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
        name: 'Starknet Token',
        symbol: 'STRK',
        decimals: 18
      }
    ]
  },
  [StarknetNetwork.DEVNET]: {
    chainId: '0x534e5f474f45524c49',
    name: 'Starknet Devnet',
    rpcUrl: 'http://localhost:5050',
    explorerUrl: 'http://localhost:4000',
    tokens: [
      {
        address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      }
    ]
  }
}

export class StarknetProvider {
  private config: StarknetConfig
  private networkInfo: NetworkInfo

  constructor(config: StarknetConfig) {
    this.config = config
    this.networkInfo = NETWORK_CONFIGS[config.networkId]

    if (!this.networkInfo) {
      throw SdkError.invalidConfiguration(`networkId: ${config.networkId}`)
    }

    if (config.rpcUrl) {
      this.networkInfo = {
        ...this.networkInfo,
        rpcUrl: config.rpcUrl
      }
    }

    if (config.explorerUrl) {
      this.networkInfo = {
        ...this.networkInfo,
        explorerUrl: config.explorerUrl
      }
    }
  }

  get rpcUrl(): string {
    return this.networkInfo.rpcUrl
  }

  get chainId(): string {
    return this.networkInfo.chainId
  }

  get explorerUrl(): string | undefined {
    return this.networkInfo.explorerUrl
  }

  get networkName(): string {
    return this.networkInfo.name
  }

  get supportedTokens(): TokenInfo[] {
    return this.networkInfo.tokens
  }

  getTokenByAddress(address: string): TokenInfo | undefined {
    return this.networkInfo.tokens.find(
      token => token.address.toLowerCase() === address.toLowerCase()
    )
  }

  getTokenBySymbol(symbol: string): TokenInfo | undefined {
    return this.networkInfo.tokens.find(
      token => token.symbol.toLowerCase() === symbol.toLowerCase()
    )
  }

  getExplorerUrl(type: 'tx' | 'account' | 'contract', identifier: string): string {
    if (!this.explorerUrl) return ''
    
    const paths = {
      tx: 'tx',
      account: 'contract',
      contract: 'contract'
    }
    
    return `${this.explorerUrl}/${paths[type]}/${identifier}`
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'starknet_chainId',
          params: [],
          id: 1
        })
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      return data.result === this.chainId
    } catch {
      return false
    }
  }

  updateConfig(newConfig: Partial<StarknetConfig>): void {
    this.config = {...this.config, ...newConfig}

    if (newConfig.networkId && newConfig.networkId !== this.config.networkId) {
      this.networkInfo = NETWORK_CONFIGS[newConfig.networkId]
      if (!this.networkInfo) {
        throw SdkError.invalidConfiguration(`networkId: ${newConfig.networkId}`)
      }
    }

    if (newConfig.rpcUrl) {
      this.networkInfo = {
        ...this.networkInfo,
        rpcUrl: newConfig.rpcUrl
      }
    }

    if (newConfig.explorerUrl) {
      this.networkInfo = {
        ...this.networkInfo,
        explorerUrl: newConfig.explorerUrl
      }
    }
  }
}

export const createProvider = (config: StarknetConfig): StarknetProvider => {
  return new StarknetProvider(config)
}

export const getDefaultConfig = (network: StarknetNetwork): StarknetConfig => {
  const networkData = NETWORK_CONFIGS[network]
  if (!networkData) {
    throw SdkError.invalidConfiguration(`networkId: ${network}`)
  }

  return {
    networkId: network,
    chainId: networkData.chainId,
    rpcUrl: networkData.rpcUrl,
    explorerUrl: networkData.explorerUrl
  }
} 