import {
  AllowArray,
  BigNumberish,
  Call,
  InvocationsSignerDetails,
  Signature,
  TypedData,
} from '../types';

export abstract class SignerInterface {
  /**
   * Signs a transaction with the provided details
   */
  public abstract signTransaction(
    transactions: AllowArray<Call>,
    details: InvocationsSignerDetails
  ): Promise<Signature>;

  /**
   * Signs a message with typed data
   */
  public abstract signMessage(typedData: TypedData, accountAddress: string): Promise<Signature>;

  /**
   * Signs a declare transaction
   */
  public abstract signDeclareTransaction(
    transaction: InvocationsSignerDetails & {
      classHash: string;
      compiledClassHash?: string;
      senderAddress: string;
    }
  ): Promise<Signature>;

  /**
   * Signs a deploy account transaction
   */
  public abstract signDeployAccountTransaction(
    transaction: InvocationsSignerDetails & {
      classHash: string;
      contractAddress: string;
      addressSalt: BigNumberish;
      constructorCalldata: BigNumberish[];
    }
  ): Promise<Signature>;

  /**
   * Gets the public key from the private key
   */
  public abstract getPubKey(): Promise<string>;
} 
