import { StarknetProvider } from './StarknetProvider';
import { StarknetNetwork, StarknetConfig } from '../types';
import { Network } from '../types/provider';

export interface ProviderConfig {
  networkId: StarknetNetwork;
  chainId: string;
  rpcUrl?: string;
  headers?: Record<string, string>;
}

export interface NetworkConfig {
  chainId: string;
  networkName: string;
  rpcUrl: string;
  explorerUrl: string;
}

const NETWORK_CONFIGS: Record<StarknetNetwork, NetworkConfig> = {
  [StarknetNetwork.MAINNET]: {
    chainId: '0x534e5f4d41494e',
    networkName: 'Starknet Mainnet',
    rpcUrl: 'https://alpha-mainnet.starknet.io',
    explorerUrl: 'https://starkscan.co'
  },
  [StarknetNetwork.TESTNET]: {
    chainId: '0x534e5f5345504f4c4941',
    networkName: 'Starknet Testnet',
    rpcUrl: 'https://starknet-sepolia.drpc.org',
    explorerUrl: 'https://sepolia.starkscan.co'
  },
  [StarknetNetwork.DEVNET]: {
    chainId: '0x534e5f474f45524c49',
    networkName: 'Starknet Devnet',
    rpcUrl: 'https://alpha4.starknet.io',
    explorerUrl: 'https://devnet.starkscan.co'
  }
};

export function createProvider(config: ProviderConfig): StarknetProvider {
  const networkConfig = NETWORK_CONFIGS[config.networkId];
  
  if (!networkConfig) {
    throw new Error(`Unsupported network: ${config.networkId}`);
  }

  // Convert StarknetNetwork to Network type
  const networkMap: Record<StarknetNetwork, Network> = {
    [StarknetNetwork.MAINNET]: 'mainnet',
    [StarknetNetwork.TESTNET]: 'sepolia',
    [StarknetNetwork.DEVNET]: 'sepolia' // Devnet maps to sepolia for now
  };

  return new StarknetProvider({
    rpcUrl: config.rpcUrl || networkConfig.rpcUrl,
    network: networkMap[config.networkId],
    headers: config.headers
  });
}

export function getDefaultConfig(networkId: StarknetNetwork = StarknetNetwork.TESTNET): StarknetConfig {
  const networkConfig = NETWORK_CONFIGS[networkId];
  
  if (!networkConfig) {
    throw new Error(`Unsupported network: ${networkId}`);
  }

  return {
    networkId,
    chainId: networkConfig.chainId,
    rpcUrl: networkConfig.rpcUrl,
    explorerUrl: networkConfig.explorerUrl
  };
}

export { NETWORK_CONFIGS }; 
