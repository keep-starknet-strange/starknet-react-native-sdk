import { 
  Call, 
  Invocation, 
  InvocationsDetailsWithNonce
} from '../types/lib';
import { 
  EventFilter,
  TransactionReceipt,
  Block,
  StateUpdate,
  ContractClass,
  FeeEstimate
} from '../types/provider';

// Types for RPC Provider
export interface RpcProviderOptions {
  nodeUrl: string;
  headers?: Record<string, string>;
  retries?: number;
  timeout?: number;
}

export class RpcProvider {
  public nodeUrl: string;
  private headers: Record<string, string>;
  private retries: number;
  private timeout: number;

  constructor(options: RpcProviderOptions) {
    this.nodeUrl = options.nodeUrl;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };
    this.retries = options.retries || 3;
    this.timeout = options.timeout || 30000;
  }

  private async makeRequest(method: string, params: any[] = []): Promise<any> {
    const payload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.nodeUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(`RPC error: ${result.error.message || result.error}`);
      }

      return result.result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getChainId(): Promise<string> {
    return this.makeRequest('starknet_chainId');
  }

  async getBlockNumber(): Promise<number> {
    return this.makeRequest('starknet_blockNumber');
  }

  async getBlockWithTxHashes(blockId: string | number = 'latest'): Promise<Block> {
    return this.makeRequest('starknet_getBlockWithTxHashes', [blockId]);
  }

  async getBlockWithTxs(blockId: string | number = 'latest'): Promise<Block> {
    return this.makeRequest('starknet_getBlockWithTxs', [blockId]);
  }

  async getStateUpdate(blockId: string): Promise<StateUpdate> {
    return this.makeRequest('starknet_getStateUpdate', [blockId]);
  }

  async getStorageAt(
    contractAddress: string,
    key: string,
    blockId: string | number = 'latest'
  ): Promise<string> {
    return this.makeRequest('starknet_getStorageAt', [contractAddress, key, blockId]);
  }

  async getTransactionStatus(txHash: string): Promise<any> {
    return this.makeRequest('starknet_getTransactionStatus', [txHash]);
  }

  async getTransactionByHash(txHash: string): Promise<any> {
    return this.makeRequest('starknet_getTransactionByHash', [txHash]);
  }

  async getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
    return this.makeRequest('starknet_getTransactionReceipt', [txHash]);
  }

  async getClassAt(
    blockId: string | number,
    contractAddress: string
  ): Promise<ContractClass> {
    return this.makeRequest('starknet_getClassAt', [blockId, contractAddress]);
  }

  async getClassHashAt(
    blockId: string | number,
    contractAddress: string
  ): Promise<string> {
    return this.makeRequest('starknet_getClassHashAt', [blockId, contractAddress]);
  }

  async getClass(blockId: string, classHash: string): Promise<ContractClass> {
    return this.makeRequest('starknet_getClass', [blockId, classHash]);
  }

  async getEvents(filter: EventFilter): Promise<any> {
    return this.makeRequest('starknet_getEvents', [filter]);
  }

  async callContract(request: Call, blockId: string | number = 'latest'): Promise<any> {
    return this.makeRequest('starknet_call', [request, blockId]);
  }

  async getEstimateFee(
    tx: Invocation,
    details: InvocationsDetailsWithNonce
  ): Promise<FeeEstimate> {
    return this.makeRequest('starknet_estimateFee', [[tx], details]);
  }

  async estimateMessageFee(message: any, blockId: string | number = 'latest'): Promise<FeeEstimate> {
    return this.makeRequest('starknet_estimateMessageFee', [message, blockId]);
  }

  async getBlockLatestAccepted(): Promise<any> {
    return this.makeRequest('starknet_getBlockLatestAccepted');
  }

  async getBlockWithReceipts(blockId: string | number = 'latest'): Promise<any> {
    return this.makeRequest('starknet_getBlockWithReceipts', [blockId]);
  }

  async getBlockStateUpdate(blockId: string | number = 'latest'): Promise<StateUpdate> {
    return this.makeRequest('starknet_getStateUpdate', [blockId]);
  }

  async getBlockTransactionsTraces(blockId: string | number = 'latest'): Promise<any> {
    return this.makeRequest('starknet_getBlockTransactionsTraces', [blockId]);
  }

  async getBlockTransactionCount(blockId: string | number = 'latest'): Promise<number> {
    return this.makeRequest('starknet_getBlockTransactionCount', [blockId]);
  }

  async getTransactionByBlockIdAndIndex(blockId: string | number, index: number): Promise<any> {
    return this.makeRequest('starknet_getTransactionByBlockIdAndIndex', [blockId, index]);
  }

  async getTransactionTrace(txHash: string): Promise<any> {
    return this.makeRequest('starknet_getTransactionTrace', [txHash]);
  }

  async getNonceForAddress(
    contractAddress: string,
    blockId: string | number = 'latest'
  ): Promise<string> {
    return this.makeRequest('starknet_getNonce', [contractAddress, blockId]);
  }

  async getL1GasPrice(blockId: string | number = 'latest'): Promise<any> {
    return this.makeRequest('starknet_getL1GasPrice', [blockId]);
  }

  async getSyncingStats(): Promise<any> {
    return this.makeRequest('starknet_syncing');
  }

  async invokeFunction(
    invocation: any,
    abis?: any[],
    transactionsDetail?: any
  ): Promise<any> {
    return this.makeRequest('starknet_addInvokeTransaction', [invocation]);
  }

  async deployAccountContract(
    payload: any,
    constructorCalldata?: any[],
    addressSalt?: string
  ): Promise<any> {
    return this.makeRequest('starknet_addDeployAccountTransaction', [payload]);
  }

  async waitForTransaction(txHash: string): Promise<any> {
    const retryInterval = 5000;
    const maxRetries = 50;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const receipt = await this.getTransactionReceipt(txHash);
        if (receipt) {
          return receipt;
        }
      } catch (error) {
        // Transaction not found yet, continue waiting
      }
      
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
    
    throw new Error(`Transaction ${txHash} not found after ${maxRetries} retries`);
  }
} 
