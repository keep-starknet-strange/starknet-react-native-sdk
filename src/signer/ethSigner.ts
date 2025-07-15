import type { RecoveredSignatureType } from '@noble/curves/abstract/weierstrass';
import { secp256k1 } from '@noble/curves/secp256k1';
import {
  ArraySignatureType,
  Call,
  DeclareSignerDetails,
  DeployAccountSignerDetails,
  InvocationsSignerDetails,
  Signature,
  TypedData,
  Uint256,
  V2DeclareSignerDetails,
  V2DeployAccountSignerDetails,
  V2InvocationsSignerDetails,
  V3DeclareSignerDetails,
  V3DeployAccountSignerDetails,
  V3InvocationsSignerDetails,
} from '../types';
import { ETransactionVersion2, ETransactionVersion3 } from '../types/api';
import { CallData } from '../utils/calldata/CallData';
import { addHexPrefix, buf2hex, removeHexPrefix, sanitizeHex } from '../utils/encode';
import { ethRandomPrivateKey } from '../utils/eth';
import {
  calculateDeclareTransactionHash,
  calculateDeployAccountTransactionHash,
  calculateInvokeTransactionHash,
} from '../utils/hash/classHash';
import { toHex } from '../utils/num';
import { intDAM } from '../utils/stark';
import { getExecuteCalldata } from '../utils/calldata/CallData';
import { getMessageHash } from '../utils/typedData';
import { bnToUint256 } from '../utils/uint256';
import { SignerInterface } from './interface';

export class EthSigner implements SignerInterface {
  protected pk: string;

  constructor(pk: Uint8Array | string = ethRandomPrivateKey()) {
    this.pk =
      pk instanceof Uint8Array
        ? buf2hex(pk).padStart(64, '0')
        : removeHexPrefix(toHex(pk)).padStart(64, '0');
  }

  public async getPubKey(): Promise<string> {
    return addHexPrefix(
      buf2hex(secp256k1.getPublicKey(this.pk, false)).padStart(130, '0').slice(2)
    );
  }

  public async signMessage(typedData: TypedData, accountAddress: string): Promise<Signature> {
    const msgHash = getMessageHash(typedData, accountAddress);
    const signature: RecoveredSignatureType = secp256k1.sign(
      removeHexPrefix(sanitizeHex(msgHash)),
      this.pk
    );
    return this.formatEthSignature(signature);
  }

  public async signTransaction(
    transactions: Call[],
    details: InvocationsSignerDetails
  ): Promise<Signature> {
    const compiledCalldata = getExecuteCalldata(transactions, details.cairoVersion);
    let msgHash;
    if (Object.values(ETransactionVersion2).includes(details.version as any)) {
      const det = details as V2InvocationsSignerDetails;
      msgHash = calculateInvokeTransactionHash({
        ...det,
        senderAddress: det.walletAddress,
        calldata: compiledCalldata,
        compiledCalldata,
        version: det.version,
      });
    } else if (Object.values(ETransactionVersion3).includes(details.version as any)) {
      const det = details as V3InvocationsSignerDetails;
      msgHash = calculateInvokeTransactionHash({
        ...det,
        senderAddress: det.walletAddress,
        calldata: compiledCalldata,
        compiledCalldata,
        version: det.version,
        nonceDataAvailabilityMode: intDAM(det.nonceDataAvailabilityMode),
        feeDataAvailabilityMode: intDAM(det.feeDataAvailabilityMode),
      });
    } else {
      throw Error('unsupported signTransaction version');
    }
    const signature: RecoveredSignatureType = secp256k1.sign(
      removeHexPrefix(sanitizeHex(msgHash)),
      this.pk
    );
    return this.formatEthSignature(signature);
  }

  public async signDeployAccountTransaction(
    details: DeployAccountSignerDetails
  ): Promise<Signature> {
    const compiledConstructorCalldata = CallData.compile(details.constructorCalldata);
    let msgHash;
    if (Object.values(ETransactionVersion2).includes(details.version as any)) {
      const det = details as V2DeployAccountSignerDetails;
      msgHash = calculateDeployAccountTransactionHash({
        contractAddress: det.contractAddress,
        classHash: det.classHash,
        constructorCalldata: compiledConstructorCalldata,
        salt: det.addressSalt,
        version: det.version,
        maxFee: det.maxFee,
        nonce: det.nonce,
      });
    } else if (Object.values(ETransactionVersion3).includes(details.version as any)) {
      const det = details as V3DeployAccountSignerDetails;
      msgHash = calculateDeployAccountTransactionHash({
        contractAddress: det.contractAddress,
        classHash: det.classHash,
        constructorCalldata: compiledConstructorCalldata,
        salt: det.addressSalt,
        version: det.version,
        maxFee: det.maxFee,
        nonce: det.nonce,
        nonceDataAvailabilityMode: intDAM(det.nonceDataAvailabilityMode),
        feeDataAvailabilityMode: intDAM(det.feeDataAvailabilityMode),
      });
    } else {
      throw Error('unsupported signDeployAccountTransaction version');
    }
    const signature: RecoveredSignatureType = secp256k1.sign(
      removeHexPrefix(sanitizeHex(msgHash)),
      this.pk
    );
    return this.formatEthSignature(signature);
  }

  public async signDeclareTransaction(
    details: DeclareSignerDetails
  ): Promise<Signature> {
    let msgHash;
    if (Object.values(ETransactionVersion2).includes(details.version as any)) {
      const det = details as V2DeclareSignerDetails;
      msgHash = calculateDeclareTransactionHash({
        senderAddress: det.senderAddress,
        classHash: det.classHash,
        version: det.version,
        maxFee: det.maxFee,
        nonce: det.nonce,
      });
    } else if (Object.values(ETransactionVersion3).includes(details.version as any)) {
      const det = details as V3DeclareSignerDetails;
      msgHash = calculateDeclareTransactionHash({
        senderAddress: det.senderAddress,
        classHash: det.classHash,
        compiledClassHash: det.compiledClassHash,
        version: det.version,
        maxFee: det.maxFee,
        nonce: det.nonce,
        nonceDataAvailabilityMode: intDAM(det.nonceDataAvailabilityMode),
        feeDataAvailabilityMode: intDAM(det.feeDataAvailabilityMode),
      });
    } else {
      throw Error('unsupported signDeclareTransaction version');
    }
    const signature: RecoveredSignatureType = secp256k1.sign(
      removeHexPrefix(sanitizeHex(msgHash)),
      this.pk
    );
    return this.formatEthSignature(signature);
  }

  protected formatEthSignature(ethSignature: RecoveredSignatureType): ArraySignatureType {
    const r: Uint256 = bnToUint256(ethSignature.r);
    const s: Uint256 = bnToUint256(ethSignature.s);
    return [
      toHex(r.low),
      toHex(r.high),
      toHex(s.low),
      toHex(s.high),
      toHex(ethSignature.recovery),
    ] as ArraySignatureType;
  }
} 
