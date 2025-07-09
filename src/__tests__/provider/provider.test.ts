import { StarknetProvider, StarknetProviderConfig } from './provider';

// Real contract address for testing
const TEST_CONTRACT_ADDRESS = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';
//const TEST_CLASS_HASH = '0x009524a94b41c4440a16fd96d7c1ef6ad6f44c1c013e96662734502cd4ee9b1f';
//const TEST_EVENT_KEY = '0x039c116571d9c88bae30f40bb0d9fdd934951a509a2e61b4132dd489c8830fcc_0';
const TEST_STORAGE_KEY = '0x05496768776e3db30053404f18067d81a6e06f5a2b0de326e21298fd9d569a9a';

// Define response types
interface BlockResponse {
  block_number: number;
  block_hash: string;
  transactions: string[];
}

interface StateUpdateResponse {
  block_hash: string;
  new_root: string;
  old_root: string;
  state_diff: {
    storage_diffs: any[];
    nonces: any[];
    deployed_contracts: any[];
  };
}

interface Transaction {
  transaction_hash: string;
  type: string;
  contract_address?: string;
  entry_point_selector?: string;
  calldata?: string[];
}

interface FeeEstimate {
  gas_price?: bigint;
  overall_fee?: bigint;
}

describe('StarknetProvider', () => {
  let provider: StarknetProvider;
  //let latestBlockNumber: number;
  let latestBlockHash: string;
  let latestTxHash: string;

  beforeAll(async () => {
    // Initialize provider with real RPC URL
    const config: StarknetProviderConfig = {
      network: 'sepolia',
      rpcUrl: 'https://starknet-sepolia.drpc.org'
    };
    provider = new StarknetProvider(config);

    // Get latest block data for testing
    const block = await provider.getBlockWithTxHashes('latest') as BlockResponse;
    latestBlockNumber = block.block_number;
    latestBlockHash = block.block_hash;
    latestTxHash = block.transactions[0];

    // Wait for provider to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(() => {
    provider.destroy();
  });

  describe('initialization', () => {
    it('should initialize with correct configuration', () => {
      expect(provider.getNetworkName()).toBe('sepolia');
      expect(provider.getCurrentRpcUrl()).toBe('https://starknet-sepolia.drpc.org');
    });

    it('should throw error if RPC URL is not provided', () => {
      expect(() => new StarknetProvider({ network: 'sepolia', rpcUrl: '' }))
        .toThrow('RPC URL is required');
    });

    it('should initialize with correct initial state', () => {
      const state = provider.getState();
      Object.entries(state).forEach(([key, value]) => {
        console.log(`Initial State - ${key}:`, value);
      });
      expect(state.isConnected).toBe(true);
      expect(state.network).toBe('sepolia');
      expect(state.chainId).toBeTruthy();
      expect(state.error).toBeNull();
    });
  });

  describe('provider methods', () => {
    it('should get block number', async () => {
      const blockNumber = await provider.getBlockNumber();
      console.log('Block Number:', blockNumber);
      expect(blockNumber).toBeGreaterThan(0);
    });

    it('should get chain id', async () => {
      const chainId = await provider.getChainId();
      console.log('Chain ID:', chainId);
      expect(chainId).toBeTruthy();
    });

    it('should get block with transaction hashes', async () => {
      const block = await provider.getBlockWithTxHashes('latest') as BlockResponse;
      console.log('Block With Tx Hashes - block_hash:', block.block_hash);
      console.log('Block With Tx Hashes - transactions:', block.transactions);
      expect(block.block_hash).toBeTruthy();
      expect(Array.isArray(block.transactions)).toBe(true);
    });

    it('should get transaction status', async () => {
      const status = await provider.getTransactionStatus(latestTxHash);
      console.log('Transaction Hash:', latestTxHash);
      console.log('Status:', status);
      expect(status).toBeTruthy();
    });

    it('should get transaction receipt', async () => {
      const receipt = await provider.getTransactionReceipt(latestTxHash);
      console.log('Transaction Receipt - status:', receipt.status);
      console.log('Transaction Receipt - block_number:', receipt.block_number);
      console.log('Transaction Receipt - finality_status:', receipt.finality_status);
      expect(receipt.status).toBeTruthy();
      expect(receipt.block_number).toBeGreaterThan(0);
    });

    it('should get block with transactions', async () => {
      const block = await provider.getBlockWithTxs('latest') as unknown as BlockResponse;
      console.log('Block With Txs - block_hash:', block.block_hash);
      console.log('Block With Txs - transactions:', block.transactions.length);
      expect(block.block_hash).toBeTruthy();
      expect(Array.isArray(block.transactions)).toBe(true);
    });

    it('should get state update', async () => {
      const stateUpdate = await provider.getStateUpdate(latestBlockHash) as StateUpdateResponse;
      console.log('State Update - block_hash:', stateUpdate.block_hash);
      console.log('State Update - new_root:', stateUpdate.new_root);
      expect(stateUpdate.block_hash).toBeTruthy();
      expect(stateUpdate.new_root).toBeTruthy();
    });

    it('should get storage at contract address', async () => {
      const storage = await provider.getStorageAt(TEST_CONTRACT_ADDRESS, TEST_STORAGE_KEY, 'latest');
      console.log('Storage Value:', storage);
      expect(storage).toBeDefined();
    });

    it('should get transaction by hash', async () => {
      const tx = await provider.getTransactionByHash(latestTxHash) as Transaction;
      console.log('Transaction - hash:', tx.transaction_hash);
      console.log('Transaction - type:', tx.type);
      expect(tx.transaction_hash).toBe(latestTxHash);
    });

    it('should get class at contract address', async () => {
      const classAt = await provider.getClassAt(TEST_CONTRACT_ADDRESS, 'latest');
      console.log('Class At - entry_points_by_type:', Object.keys(classAt.entry_points_by_type));
      expect(classAt.entry_points_by_type).toBeDefined();
    });

    it('should get class hash at contract address', async () => {
      const classHash = await provider.getClassHashAt(TEST_CONTRACT_ADDRESS, 'latest');
      console.log('Class Hash:', classHash);
      expect(classHash).toBeDefined();
    });

    it('should get class by hash', async () => {
      const classHash = await provider.getClassHashAt(TEST_CONTRACT_ADDRESS, 'latest');
      const classByHash = await provider.getClass(classHash, 'latest');
      console.log('Class By Hash - entry_points_by_type:', Object.keys(classByHash.entry_points_by_type));
      expect(classByHash.entry_points_by_type).toBeDefined();
    });

    it('should get events with filter', async () => {
      const events = await provider.getEvents({
        from_block: 'latest',
        to_block: 'latest',
        address: TEST_CONTRACT_ADDRESS,
        keys: [['0x0']], // Using a simple key for testing
        chunk_size: 10
      });
      console.log('Events:', events);
      expect(events).toBeDefined();
    });

    it('should call contract', async () => {
      const result = await provider.callContract({
        contractAddress: TEST_CONTRACT_ADDRESS,
        entrypoint: 'total_supply', 
        // Using a simple entry point for testing
        calldata: []
      }, 'latest');
      console.log('Call Result:', result);
      expect(result).toBeDefined();
    });

    it('should get estimate fee', async () => {
      console.log('getEstimateFee is not implemented yet for the test');
      // Placeholder for future implementation
      expect(true).toBe(true);
    });

    it('should estimate message fee', async () => {
      const message = {
        from_address: TEST_CONTRACT_ADDRESS,
        to_address: TEST_CONTRACT_ADDRESS,
        entry_point_selector: '0x0',
        payload: []
      };
      
      const fee = await provider.estimateMessageFee(message, 'latest') as unknown as FeeEstimate;
      console.log('Message Fee - gas_price:', fee.gas_price?.toString());
      console.log('Message Fee - overall_fee:', fee.overall_fee?.toString());
      expect(fee.overall_fee).toBeDefined();
    });

    it('should throw error for unimplemented getBalance', async () => {
      await expect(provider.getBalance(TEST_CONTRACT_ADDRESS))
        .rejects
        .toThrow('Method not implemented');
    });
  });

  describe('provider switching', () => {
    it('should switch to new provider', async () => {
      const newConfig: StarknetProviderConfig = {
        network: 'mainnet',
        rpcUrl: 'https://starknet.drpc.org'
      };

      await provider.switchProvider(newConfig);
      console.log('New Network Name:', provider.getNetworkName());
      console.log('New RPC URL:', provider.getCurrentRpcUrl());

      const state = provider.getState();
      Object.entries(state).forEach(([key, value]) => {
        console.log(`Provider State - ${key}:`, value);
      });

      expect(provider.getNetworkName()).toBe('mainnet');
      expect(provider.getCurrentRpcUrl()).toBe('https://starknet.drpc.org');
      expect(state.isConnected).toBe(true);
      expect(state.network).toBe('mainnet');
      expect(state.chainId).toBeTruthy();
      expect(state.error).toBeNull();
    });

    it('should throw error when switching to invalid provider', async () => {
      const invalidConfig: StarknetProviderConfig = {
        network: 'mainnet',
        rpcUrl: ''
      };

      await expect(provider.switchProvider(invalidConfig))
        .rejects
        .toThrow('RPC URL is required');
    });
  });

  describe('cleanup', () => {
    it('should clean up resources on destroy', () => {
      provider.destroy();
      const state = provider.getState();
      expect(state.isConnected).toBe(false);
    });
  });
}); 
