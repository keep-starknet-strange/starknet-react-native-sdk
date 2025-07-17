import {
  Account as AccountInterface,
  BigNumberish,
  Call,
  InvocationsDetails,
  TypedData,
  Signature,
  DeployAccountSignerDetails,
  InvocationsSignerDetails,
  V2InvocationsSignerDetails,
  V3InvocationsSignerDetails,
  ETransactionVersion2,
  ETransactionVersion3,
} from '../types';
import { RpcProvider } from './rpc-provider';
import { EthSigner } from '../signer/ethSigner';
import { starkCurve } from '../utils/ec/starkCurve';
import { calculateContractAddressFromHash, calculateInvokeTransactionHash, calculateDeployAccountTransactionHash } from '../utils/hash/classHash';
import { CallData } from '../utils/calldata/CallData';
import { getMessageHash } from '../utils/typedData';
import { toHex, toBigInt, computeHashOnElements } from '../utils/num';
import { intDAM } from '../utils/stark';
import { SdkError } from '../utils/errors';
import { Invocation } from '../types/lib';

export interface DeployAccountParams {
  classHash: string;
  constructorCalldata: BigNumberish[];
  addressSalt: BigNumberish;
  contractAddress: string;
}

export interface DeployAccountResponse {
  transaction_hash: string;
  contract_address: string;
}

export interface ExecuteResponse {
  transaction_hash: string;
}

export class Account implements AccountInterface {
  public address: string;
  public provider: RpcProvider;
  private signer: EthSigner;
  private cairoVersion: '0' | '1' = '0';

  constructor(
    provider: RpcProvider,
    address: string,
    privateKey: string,
    cairoVersion: '0' | '1' = '0'
  ) {
    this.provider = provider;
    this.address = address;
    this.signer = new EthSigner(privateKey);
    this.cairoVersion = cairoVersion;
  }

  /**
   * Execute a list of calls
   */
  async execute(
    calls: Call[],
    abis?: any[],
    transactionsDetail?: InvocationsDetails
  ): Promise<ExecuteResponse> {
    try {
      const nonce = await this.getNonce();
      const chainId = await this.provider.getChainId();
      
      const details: InvocationsDetails = {
        maxFee: transactionsDetail?.maxFee || '0x0',
        version: transactionsDetail?.version || '0x1',
        nonce,
        ...transactionsDetail,
      };

      const signature = await this.signer.signTransaction(calls, {
        ...details,
        walletAddress: this.address,
        chainId,
        cairoVersion: this.cairoVersion,
      } as InvocationsSignerDetails);

      const calldata = CallData.getExecuteCalldata(calls, this.cairoVersion);
      
      const transactionHash = calculateInvokeTransactionHash({
        senderAddress: this.address,
        calldata,
        maxFee: details.maxFee || '0x0',
        version: details.version || '0x1',
        chainId,
        nonce,
        compiledCalldata: calldata,
      });

      const invokeTransaction = {
        sender_address: this.address,
        calldata,
        max_fee: details.maxFee || '0x0',
        signature: Array.isArray(signature) ? signature : [signature.r.toString(), signature.s.toString()],
        nonce,
        version: details.version || '0x1',
      };

      const result = await this.provider.invokeFunction(invokeTransaction);
      
      return {
        transaction_hash: result.transaction_hash,
      };
    } catch (error) {
      throw SdkError.transactionFailed(`Execute failed: ${error}`);
    }
  }

  /**
   * Deploy account contract
   */
  async deployAccount(
    params: DeployAccountParams,
    transactionsDetail?: InvocationsDetails
  ): Promise<DeployAccountResponse> {
    try {
      const nonce = await this.getNonce();
      const chainId = await this.provider.getChainId();
      
      const details: InvocationsDetails = {
        maxFee: transactionsDetail?.maxFee || '0x0',
        version: transactionsDetail?.version || '0x1',
        nonce,
        ...transactionsDetail,
      };

      const constructorCalldata = CallData.compile(params.constructorCalldata);
      
      const deployAccountSignerDetails: DeployAccountSignerDetails = {
        walletAddress: this.address,
        nonce,
        maxFee: details.maxFee || '0x0',
        version: details.version || '0x1',
        chainId,
        cairoVersion: this.cairoVersion,
        classHash: params.classHash,
        contractAddress: params.contractAddress,
        addressSalt: params.addressSalt,
        constructorCalldata,
      };

      const signature = await this.signer.signDeployAccountTransaction(deployAccountSignerDetails);

      const transactionHash = calculateDeployAccountTransactionHash({
        contractAddress: params.contractAddress,
        classHash: params.classHash,
        constructorCalldata,
        salt: params.addressSalt,
        version: details.version || '0x1',
        maxFee: details.maxFee || '0x0',
        nonce,
      });

      const deployAccountTransaction = {
        class_hash: params.classHash,
        constructor_calldata: constructorCalldata,
        contract_address_salt: params.addressSalt,
        version: details.version || '0x1',
        max_fee: details.maxFee || '0x0',
        signature: Array.isArray(signature) ? signature : [signature.r.toString(), signature.s.toString()],
        nonce,
      };

      const result = await this.provider.deployAccountContract(deployAccountTransaction);
      
      return {
        transaction_hash: result.transaction_hash,
        contract_address: result.contract_address,
      };
    } catch (error) {
      throw SdkError.accountDeploymentFailed(`Deploy account failed: ${error}`);
    }
  }

  /**
   * Sign typed data message
   */
  async signMessage(typedData: TypedData): Promise<Signature> {
    try {
      const messageHash = getMessageHash(typedData, this.address);
      const signature = starkCurve.sign(messageHash, this.signer.getPrivateKey());
      
      return {
        r: signature.r,
        s: signature.s,
        recovery: signature.recovery,
      };
    } catch (error) {
      throw SdkError.unauthorized(`Message signing failed: ${error}`);
    }
  }

  /**
   * Hash typed data message
   */
  hashMessage(typedData: TypedData): string {
    return getMessageHash(typedData, this.address);
  }

  /**
   * Verify message signature
   */
  verifyMessage(typedData: TypedData, signature: Signature): boolean {
    try {
      const messageHash = this.hashMessage(typedData);
      const publicKey = starkCurve.getStarkKey(this.signer.getPrivateKey());
      
      if (Array.isArray(signature)) {
        return starkCurve.verify(messageHash, {
          r: BigInt(signature[0]),
          s: BigInt(signature[1]),
        }, publicKey);
      } else {
        return starkCurve.verify(messageHash, signature, publicKey);
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Estimate invoke fee
   */
  async estimateInvokeFee(
    calls: Call[],
    abis?: any[],
    transactionsDetail?: InvocationsDetails
  ): Promise<any> {
    try {
      const nonce = await this.getNonce();
      const calldata = CallData.getExecuteCalldata(calls, this.cairoVersion);
      
      const invocation: Invocation = {
        contractAddress: this.address,
        entrypoint: '0x15d40a3d6ca2ac30f4031e42be28da9b056fef9bb7357ac5e97127e7ea1a3c3', // __execute__
        calldata,
      };

      const details = {
        maxFee: transactionsDetail?.maxFee || '0x0',
        version: transactionsDetail?.version || '0x1',
        nonce,
        ...transactionsDetail,
      };

      return await this.provider.getEstimateFee(invocation, details);
    } catch (error) {
      throw SdkError.transactionFailed(`Fee estimation failed: ${error}`);
    }
  }

  /**
   * Estimate account deployment fee
   */
  async estimateAccountDeployFee(
    contractAddress: string,
    calldata?: any[],
    transactionsDetail?: InvocationsDetails
  ): Promise<any> {
    try {
      const nonce = await this.getNonce();
      
      const invocation: Invocation = {
        contractAddress: contractAddress,
        entrypoint: '0x28ffe4ff0f226a9107253e17a904099aa4f63a02a5621de0576e5aa71bc9d425', // __validate__
        calldata: calldata || [],
      };

      const details = {
        maxFee: transactionsDetail?.maxFee || '0x0',
        version: transactionsDetail?.version || '0x1',
        nonce,
        ...transactionsDetail,
      };

      return await this.provider.getEstimateFee(invocation, details);
    } catch (error) {
      throw SdkError.transactionFailed(`Deployment fee estimation failed: ${error}`);
    }
  }

  /**
   * Deploy contract (legacy method)
   */
  async deploy(contractAddress: string, calldata?: any[]): Promise<any> {
    return this.deployAccount({
      classHash: contractAddress,
      constructorCalldata: calldata || [],
      addressSalt: '0x0',
      contractAddress,
    });
  }

  /**
   * Get account nonce
   */
  private async getNonce(): Promise<string> {
    try {
      return await this.provider.getNonceForAddress(this.address);
    } catch (error) {
      throw SdkError.networkError(`Failed to get nonce: ${error}`);
    }
  }

  /**
   * Wait for transaction
   */
  async waitForTransaction(txHash: string, options?: any): Promise<any> {
    return this.provider.waitForTransaction(txHash, options);
  }
} 
