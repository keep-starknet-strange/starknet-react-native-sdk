import { BlockIdentifier } from './lib';
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
  isOnline?: boolean;
}

// Block Types - Detailed standalone definitions
export interface Block {
  block_number: number;
  block_hash: string;
  parent_block_hash: string;
  timestamp: number;
  transactions: string[];
  status: 'ACCEPTED_ON_L1' | 'ACCEPTED_ON_L2' | 'PENDING' | 'REJECTED';
  sequencer_address?: string;
  gas_price?: string;
  starknet_version?: string;
  l1_gas_price?: {
    price_in_wei: string;
  };
  l1_data_gas_price?: {
    price_in_wei: string;
  };
}

export interface PendingBlock {
  parent_block_hash: string;
  timestamp: number;
  transactions: string[];
  sequencer_address?: string;
  gas_price?: string;
  starknet_version?: string;
  l1_gas_price?: {
    price_in_wei: string;
  };
  l1_data_gas_price?: {
    price_in_wei: string;
  };
}

// State Update Types - Detailed standalone definitions
export interface StateUpdate {
  block_hash: string;
  new_root: string;
  old_root: string;
  state_diff: {
    storage_diffs: Array<{
      address: string;
      storage_entries: Array<{
        key: string;
        value: string;
      }>;
    }>;
    declared_contracts: Array<{
      class_hash: string;
    }>;
    deployed_contracts: Array<{
      address: string;
      class_hash: string;
    }>;
    nonces: Array<{
      contract_address: string;
      nonce: string;
    }>;
    declared_classes: Array<{
      class_hash: string;
      compiled_class_hash: string;
    }>;
    replaced_classes: Array<{
      contract_address: string;
      class_hash: string;
    }>;
  };
}

export interface PendingStateUpdate {
  old_root: string;
  state_diff: StateUpdate['state_diff'];
}

// Contract Types - Detailed standalone definitions
export interface ContractClass {
  program: string;
  entry_points_by_type: {
    CONSTRUCTOR: Array<{
      offset: string;
      selector: string;
    }>;
    EXTERNAL: Array<{
      offset: string;
      selector: string;
    }>;
    L1_HANDLER: Array<{
      offset: string;
      selector: string;
    }>;
  };
  abi?: Array<{
    type: string;
    name: string;
    inputs?: Array<{
      name: string;
      type: string;
    }>;
    outputs?: Array<{
      name: string;
      type: string;
    }>;
    state_mutability?: string;
  }>;
}

export interface CompiledSierra {
  sierra_program: string[];
  entry_points_by_type: {
    CONSTRUCTOR: Array<{
      function_idx: number;
      function_integration: {
        type: string;
        inner: string;
      };
    }>;
    EXTERNAL: Array<{
      function_idx: number;
      function_integration: {
        type: string;
        inner: string;
      };
    }>;
    L1_HANDLER: Array<{
      function_idx: number;
      function_integration: {
        type: string;
        inner: string;
      };
    }>;
  };
  abi: Array<{
    type: string;
    name: string;
    inputs?: Array<{
      name: string;
      type: string;
    }>;
    outputs?: Array<{
      name: string;
      type: string;
    }>;
  }>;
  contract_class_version: string;
}

export type ContractClassResponse = ContractClass | Omit<CompiledSierra, 'sierra_program_debug_info'>;

// Fee Estimation Types - Detailed standalone definitions
export interface FeeEstimate {
  gas_consumed: string;
  gas_price: string;
  overall_fee: string;
  unit: 'WEI' | 'FRI';
  l1_gas_consumed?: string;
  l1_gas_price?: string;
  l1_data_gas_consumed?: string;
  l1_data_gas_price?: string;
  suggestedMaxFee?: string;
  resourceBounds?: {
    l1_gas: {
      max_amount: string;
      max_price_per_unit: string;
    };
    l2_gas: {
      max_amount: string;
      max_price_per_unit: string;
    };
  };
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
  transaction_hash: string;
  actual_fee: string;
  finality_status: 'ACCEPTED_ON_L1' | 'ACCEPTED_ON_L2' | 'PENDING' | 'REJECTED';
  execution_status: 'SUCCEEDED' | 'REVERTED';
  block_hash?: string;
  block_number?: number;
  type: 'INVOKE' | 'DECLARE' | 'DEPLOY' | 'DEPLOY_ACCOUNT' | 'L1_HANDLER';
  messages_sent: Array<{
    to_address: string;
    payload: string[];
  }>;
  events: Array<{
    from_address: string;
    keys: string[];
    data: string[];
  }>;
  contract_address?: string;
  l1_to_l2_consumed_message?: {
    from_address: string;
    to_address: string;
    selector: string;
    payload: string[];
  };
  l2_to_l1_messages?: Array<{
    to_address: string;
    payload: string[];
  }>;
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
  getBlockWithTxHashes(blockId: string | number): Promise<Block>;
  getBlockWithTxs(blockId: string | number): Promise<Block>;
  getStateUpdate(blockId: string): Promise<StateUpdate>;
  
  // Storage Methods
  getStorageAt(contractAddress: string, key: string, blockId: string | number): Promise<string>;
  
  // Transaction Methods
  getTransactionStatus(txHash: string): Promise<string>;
  getTransactionByHash(txHash: string): Promise<any>;
  getTransactionReceipt(txHash: string): Promise<TransactionReceipt>;
  
  // Contract Methods
  getClassAt(blockId: string | number, contractAddress: string): Promise<ContractClass>;
  getClassHashAt(blockId: string | number, contractAddress: string): Promise<string>;
  getClass(blockId: string, classHash: string): Promise<ContractClass>;
  
  // Event Methods
  getEvents(filter: EventFilter): Promise<any>;
  
  // Contract Interaction
  callContract(request: any, blockId: string | number): Promise<any>;
  
  // Fee Estimation
  getEstimateFee(tx: any, blockId: string | number): Promise<FeeEstimate>;
  estimateMessageFee(message: any, blockId: string | number): Promise<FeeEstimate>;
  
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
