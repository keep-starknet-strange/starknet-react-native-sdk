import { RpcProvider } from './rpc-provider';
import { Invocation, InvocationsDetailsWithNonce } from '../types/lib';
import { 
  StarknetProviderConfig, 
  ProviderState, 
  Network,
  EventFilter
} from '../types/provider';

export class StarknetProvider {
  private provider: RpcProvider;
  private currentNetwork: Network;
  private state: ProviderState;
  private stateListeners: ((state: ProviderState) => void)[] = [];
  private networkCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: StarknetProviderConfig) {
    if (!config.rpcUrl) {
      throw new Error('RPC URL is required');
    }

    this.currentNetwork = config.network;
    this.state = {
      isConnected: false,
      network: config.network,
      chainId: '',
      error: null,
      isOnline: true
    };

    this.provider = new RpcProvider({
      nodeUrl: config.rpcUrl,
      headers: config.headers,
    });

    // Initialize provider state and network monitoring
    this.initializeProvider();
    this.setupNetworkMonitoring();
  }

  private setupNetworkMonitoring() {
    // Simple network monitoring using fetch
    this.networkCheckInterval = setInterval(async () => {
      try {
        const response = await fetch('https://httpbin.org/status/200', { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });
        const isOnline = response.ok;
        this.updateState({ isOnline });
      } catch (error) {
        this.updateState({ isOnline: false });
      }
    }, 10000); // Check every 10 seconds
  }

  private async initializeProvider() {
    try {
      await this.getBlockNumber();
      this.updateState({ isConnected: true });
    } catch (error) {
      console.error('Failed to initialize provider:', error);
      this.updateState({ isConnected: false });
    }
  }

  private updateState(newState: Partial<ProviderState>) {
    this.state = { ...this.state, ...newState };
    this.notifyStateListeners();
  }

  private notifyStateListeners() {
    this.stateListeners.forEach(listener => listener(this.state));
  }

  /**
   * Subscribe to provider state changes
   */
  onStateChange(listener: (state: ProviderState) => void) {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  /**
   * Get current provider state
   */
  getState(): ProviderState {
    return { ...this.state };
  }

  /**
   * Get the current network name
   */
  getNetworkName(): string {
    return this.currentNetwork;
  }

  /**
   * Get the current RPC URL
   */
  getCurrentRpcUrl(): string {
    return this.provider.nodeUrl;
  }

  /**
   * Switch to a different provider
   */
  async switchProvider(config: StarknetProviderConfig) {
    if (!config.rpcUrl) {
      throw new Error('RPC URL is required');
    }

    this.currentNetwork = config.network;
    this.provider = new RpcProvider({
      nodeUrl: config.rpcUrl,
      headers: config.headers,
    });

    this.updateState({
      network: config.network,
      isConnected: false
    });

    try {
      await this.getBlockNumber();
      this.updateState({ isConnected: true });
    } catch (error) {
      console.error('Failed to switch provider:', error);
      this.updateState({ isConnected: false });
      throw error;
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.networkCheckInterval) {
      clearInterval(this.networkCheckInterval);
    }
    this.stateListeners = [];
  }

  // Provider methods
  async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  async getChainId(): Promise<string> {
    return this.provider.getChainId();
  }

  async getBlockWithTxHashes(blockId: string | number) {
    return this.provider.getBlockWithTxHashes(blockId);
  }

  async getBlockWithTxs(blockId: string | number) {
    return this.provider.getBlockWithTxs(blockId);
  }

  async getStateUpdate(blockId: string) {
    return this.provider.getStateUpdate(blockId);
  }

  async getStorageAt(contractAddress: string, key: string, blockId: string | number): Promise<string> {
    return this.provider.getStorageAt(contractAddress, key, blockId);
  }

  async getTransactionStatus(txHash: string): Promise<string> {
    const status = await this.provider.getTransactionStatus(txHash);
    return (status as any).finality_status || (status as any).execution_status || 'UNKNOWN';
  }

  async getTransactionByHash(txHash: string) {
    return this.provider.getTransactionByHash(txHash);
  }

  async getTransactionReceipt(txHash: string) {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    return {
      ...receipt,
      status: (receipt as any).finality_status || (receipt as any).execution_status || 'UNKNOWN'
    };
  }

  async getClassAt(blockId: string | number, contractAddress: string) {
    return this.provider.getClassAt(blockId, contractAddress);
  }

  async getClassHashAt(blockId: string | number, contractAddress: string) {
    return this.provider.getClassHashAt(blockId, contractAddress);
  }

  async getClass(blockId: string, classHash: string) {
    return this.provider.getClass(blockId, classHash);
  }

  async getEvents(filter: EventFilter) {
    // Convert the filter to match the starknet package's expected format
    const starknetFilter = {
      ...filter,
      from_block: filter.from_block || 'latest',
      to_block: filter.to_block || 'latest'
    };
    return this.provider.getEvents(starknetFilter as any);
  }

  async callContract(request: any, blockId: string | number) {
    return this.provider.callContract(request, blockId);
  }

  async getEstimateFee(tx: Invocation, _blockId: string | number) {
    return this.provider.getEstimateFee(tx, { 
      nonce: '0x0' // Add required nonce field
    } as InvocationsDetailsWithNonce);
  }

  async estimateMessageFee(message: any, blockId: string | number) {
    return this.provider.estimateMessageFee(message, blockId);
  }
} 
