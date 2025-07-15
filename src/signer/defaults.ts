import {
  Call,
  DeclareSignerDetails,
  DeployAccountSignerDetails,
  InvocationsSignerDetails,
  Signature,
  TypedData,
  V2DeclareSignerDetails,
  V2DeployAccountSignerDetails,
  V2InvocationsSignerDetails,
  V3DeclareSignerDetails,
  V3DeployAccountSignerDetails,
  V3InvocationsSignerDetails,
  ETransactionVersion2,
  ETransactionVersion3,
} from '../types';
import { CallData } from '../utils/calldata/CallData';
import { starkCurve } from '../utils/ec/starkCurve';
import { toHex, toBigInt } from '../utils/num';
import {
  calculateDeclareTransactionHash,
  calculateDeployAccountTransactionHash,
  calculateInvokeTransactionHash,
} from '../utils/hash/classHash';
import { getMessageHash } from '../utils/typedData';
import { intDAM } from '../utils/stark';
import { SignerInterface } from './interface';

export class Signer implements SignerInterface {
  private pk: string;

  constructor(pk: string | Uint8Array) {
    if (pk instanceof Uint8Array) {
      this.pk = '0x' + Array.from(pk, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
      this.pk = pk;
    }
  }

  public async getPubKey(): Promise<string> {
    return starkCurve.getStarkKey(this.pk);
  }

  public async signMessage(typedData: TypedData, accountAddress: string): Promise<Signature> {
    const msgHash = getMessageHash(typedData, accountAddress);
    return starkCurve.sign(toBigInt(msgHash), toBigInt(this.pk));
  }

  public async signTransaction(
    transactions: Call[],
    transactionsDetail: InvocationsSignerDetails
  ): Promise<Signature> {
    const compiledCalldata = CallData.getExecuteCalldata(transactions, transactionsDetail.cairoVersion);
    let msgHash: string;

    if (transactionsDetail.version === ETransactionVersion2.V2) {
      const det = transactionsDetail as V2InvocationsSignerDetails;
      msgHash = calculateInvokeTransactionHash({
        senderAddress: det.walletAddress,
        calldata: compiledCalldata,
        maxFee: det.maxFee,
        version: det.version,
        chainId: det.chainId,
        nonce: det.nonce,
      });
    } else {
      const det = transactionsDetail as V3InvocationsSignerDetails;
      msgHash = calculateInvokeTransactionHash({
        senderAddress: det.walletAddress,
        calldata: compiledCalldata,
        maxFee: det.maxFee,
        version: det.version,
        chainId: det.chainId,
        nonce: det.nonce,
        nonceDataAvailabilityMode: intDAM(det.nonceDataAvailabilityMode),
        feeDataAvailabilityMode: intDAM(det.feeDataAvailabilityMode),
        resourceBounds: det.resourceBounds,
        tip: det.tip,
        paymasterData: det.paymasterData?.map(p => p.toString()),
        accountDeploymentData: det.accountDeploymentData?.map(p => p.toString()),
      });
    }

    return starkCurve.sign(toBigInt(msgHash), toBigInt(this.pk));
  }

  public async signDeclareTransaction(
    transaction: DeclareSignerDetails
  ): Promise<Signature> {
    let msgHash: string;

    if (transaction.version === ETransactionVersion2.V2) {
      const det = transaction as V2DeclareSignerDetails;
      msgHash = calculateDeclareTransactionHash({
        senderAddress: det.senderAddress,
        classHash: det.classHash,
        version: det.version,
        maxFee: det.maxFee,
        nonce: det.nonce,
      });
    } else {
      const det = transaction as V3DeclareSignerDetails;
      msgHash = calculateDeclareTransactionHash({
        senderAddress: det.senderAddress,
        classHash: det.classHash,
        compiledClassHash: det.compiledClassHash,
        version: det.version,
        maxFee: det.maxFee,
        nonce: det.nonce,
        nonceDataAvailabilityMode: intDAM(det.nonceDataAvailabilityMode),
        feeDataAvailabilityMode: intDAM(det.feeDataAvailabilityMode),
        resourceBounds: det.resourceBounds,
        tip: det.tip,
        paymasterData: det.paymasterData?.map(p => p.toString()),
        accountDeploymentData: det.accountDeploymentData?.map(p => p.toString()),
      });
    }

    return starkCurve.sign(toBigInt(msgHash), toBigInt(this.pk));
  }

  public async signDeployAccountTransaction(
    transaction: DeployAccountSignerDetails
  ): Promise<Signature> {
    let msgHash: string;

    if (transaction.version === ETransactionVersion2.V2) {
      const det = transaction as V2DeployAccountSignerDetails;
      msgHash = calculateDeployAccountTransactionHash({
        contractAddress: det.contractAddress,
        classHash: det.classHash,
        constructorCalldata: det.constructorCalldata.map(c => c.toString()),
        salt: det.addressSalt,
        version: det.version,
        maxFee: det.maxFee,
        nonce: det.nonce,
      });
    } else {
      const det = transaction as V3DeployAccountSignerDetails;
      msgHash = calculateDeployAccountTransactionHash({
        contractAddress: det.contractAddress,
        classHash: det.classHash,
        constructorCalldata: det.constructorCalldata.map(c => c.toString()),
        salt: det.addressSalt,
        version: det.version,
        maxFee: det.maxFee,
        nonce: det.nonce,
        nonceDataAvailabilityMode: intDAM(det.nonceDataAvailabilityMode),
        feeDataAvailabilityMode: intDAM(det.feeDataAvailabilityMode),
        resourceBounds: det.resourceBounds,
        tip: det.tip,
        paymasterData: det.paymasterData?.map(p => p.toString()),
        accountDeploymentData: det.accountDeploymentData?.map(p => p.toString()),
      });
    }

    return starkCurve.sign(toBigInt(msgHash), toBigInt(this.pk));
  }
} 
