import { BlockIdentifier } from 'starknet';

// Network Types
export type Network = 'mainnet' | 'sepolia';

// Configuration Types
export interface StarknetProviderConfig {
  network: Network;
  rpcUrl: string;
  headers?: Record<string, string>;
}

// State Types
export interface ProviderState {
  isConnected: boolean;
  network: string;
  chainId: string;
  blockNumber?: number;
  error: string | null;
}

// Event Types
export interface EventFilter {
  from_block?: BlockIdentifier;
  to_block?: BlockIdentifier;
  address?: string;
  keys?: string[][];
  chunk_size: number;
}

// Transaction Types
export interface TransactionReceipt {
  status: string;
  block_number?: number;
  finality_status: string;
}

// Provider Interface
export interface StarknetProviderInterface {
  // State Management
  getState(): ProviderState;
  getNetworkName(): string;
  getCurrentRpcUrl(): string;
  onStateChange(listener: (state: ProviderState) => void): () => void;
  
  // Provider Management
  switchProvider(config: StarknetProviderConfig): Promise<void>;
  destroy(): void;
  
  // Block Methods
  getBlockNumber(): Promise<number>;
  getBlockWithTxHashes(blockId: string | number): Promise<any>;
  getBlockWithTxs(blockId: string | number): Promise<any>;
  getStateUpdate(blockId: string): Promise<any>;
  
  // Storage Methods
  getStorageAt(contractAddress: string, key: string, blockId: string | number): Promise<string>;
  
  // Transaction Methods
  getTransactionStatus(txHash: string): Promise<string>;
  getTransactionByHash(txHash: string): Promise<any>;
  getTransactionReceipt(txHash: string): Promise<TransactionReceipt>;
  
  // Contract Methods
  getClassAt(blockId: string | number, contractAddress: string): Promise<any>;
  getClassHashAt(blockId: string | number, contractAddress: string): Promise<string>;
  getClass(blockId: string, classHash: string): Promise<any>;
  
  // Event Methods
  getEvents(filter: EventFilter): Promise<any>;
  
  // Contract Interaction
  callContract(request: any, blockId: string | number): Promise<any>;
  
  // Fee Estimation
  getEstimateFee(tx: any, blockId: string | number): Promise<any>;
  estimateMessageFee(message: any, blockId: string | number): Promise<any>;
  
  // Balance
  getBalance(address: string): Promise<string>;
}

// Network State Types
export interface NetworkState {
  isConnected: boolean;
  type: 'wifi' | 'cellular' | 'none';
  strength?: number;
}

// Response Types
export interface CallContractResponse {
  result: string[];
  block_number?: number;
}

// Event Listener Types
export type ProviderStateListener = (state: ProviderState) => void;
