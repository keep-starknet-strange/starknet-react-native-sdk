/**
 * Limited Class Hash for RN
 */

import { BigNumberish, RawArgs } from '../../types/lib';
import { CallData } from '../calldata/CallData';
import { computeHashOnElements, felt, toHex } from '../num';

const ADDR_BOUND = BigInt(2) ** BigInt(251) - BigInt(256) - BigInt(1);

/**
 * Calculate contract address from class hash
 *
 * @param {BigNumberish} salt Salt to be used for hashing
 * @param {BigNumberish} classHash Class hash of contract to generate address for
 * @param {RawArgs} constructorCalldata Call data for contract constructor
 * @param {BigNumberish} deployerAddress Address of contract deployer
 * @returns {string} hex-string
 */
export function calculateContractAddressFromHash(
  salt: BigNumberish,
  classHash: BigNumberish,
  constructorCalldata: RawArgs,
  deployerAddress: BigNumberish
): string {
  const compiledCalldata = CallData.compile(constructorCalldata);
  const constructorCalldataHash = computeHashOnElements(compiledCalldata);

  const CONTRACT_ADDRESS_PREFIX = felt('0x535441524b4e45545f434f4e54524143545f41444452455353');

  const hash = computeHashOnElements([
    CONTRACT_ADDRESS_PREFIX,
    deployerAddress,
    salt,
    classHash,
    constructorCalldataHash,
  ]);
  return toHex(BigInt(hash) % ADDR_BOUND);
}

/**
 * Calculate invoke transaction hash
 */
export function calculateInvokeTransactionHash(params: {
  senderAddress: string;
  calldata: string[];
  maxFee: BigNumberish;
  version: string;
  chainId: string;
  nonce: BigNumberish;
  compiledCalldata?: string[];
  nonceDataAvailabilityMode?: number;
  feeDataAvailabilityMode?: number;
  resourceBounds?: any;
  tip?: BigNumberish;
  paymasterData?: BigNumberish[];
  accountDeploymentData?: BigNumberish[];
}): string {
  const {
    senderAddress,
    calldata,
    maxFee,
    version,
    chainId,
    nonce,
    compiledCalldata,
    nonceDataAvailabilityMode,
    feeDataAvailabilityMode,
    resourceBounds,
    tip,
    paymasterData,
    accountDeploymentData,
  } = params;

  const calldataHash = computeHashOnElements(compiledCalldata || calldata);
  
  const elements = [
    senderAddress,
    nonce,
    calldataHash,
    maxFee,
    version,
    chainId,
  ];

  // Add V3 specific fields if present
  if (version === '0x3') {
    if (resourceBounds) {
      elements.push(
        resourceBounds.l1_gas.max_amount,
        resourceBounds.l1_gas.max_price_per_unit,
        resourceBounds.l2_gas.max_amount,
        resourceBounds.l2_gas.max_price_per_unit
      );
    }
    if (tip !== undefined) elements.push(tip);
    if (paymasterData) elements.push(...paymasterData);
    if (accountDeploymentData) elements.push(...accountDeploymentData);
    if (nonceDataAvailabilityMode !== undefined) elements.push(nonceDataAvailabilityMode);
    if (feeDataAvailabilityMode !== undefined) elements.push(feeDataAvailabilityMode);
  }

  return toHex(computeHashOnElements(elements));
}

/**
 * Calculate deploy account transaction hash
 */
export function calculateDeployAccountTransactionHash(params: {
  contractAddress: string;
  classHash: string;
  constructorCalldata: string[];
  salt: BigNumberish;
  version: string;
  maxFee: BigNumberish;
  nonce: BigNumberish;
  nonceDataAvailabilityMode?: number;
  feeDataAvailabilityMode?: number;
  resourceBounds?: any;
  tip?: BigNumberish;
  paymasterData?: BigNumberish[];
  accountDeploymentData?: BigNumberish[];
}): string {
  const {
    contractAddress,
    classHash,
    constructorCalldata,
    salt,
    version,
    maxFee,
    nonce,
    nonceDataAvailabilityMode,
    feeDataAvailabilityMode,
    resourceBounds,
    tip,
    paymasterData,
    accountDeploymentData,
  } = params;

  const constructorCalldataHash = computeHashOnElements(constructorCalldata);
  
  const elements = [
    contractAddress,
    classHash,
    constructorCalldataHash,
    salt,
    version,
    maxFee,
    nonce,
  ];

  // Add V3 specific fields if present
  if (version === '0x3') {
    if (resourceBounds) {
      elements.push(
        resourceBounds.l1_gas.max_amount,
        resourceBounds.l1_gas.max_price_per_unit,
        resourceBounds.l2_gas.max_amount,
        resourceBounds.l2_gas.max_price_per_unit
      );
    }
    if (tip !== undefined) elements.push(tip);
    if (paymasterData) elements.push(...paymasterData);
    if (accountDeploymentData) elements.push(...accountDeploymentData);
    if (nonceDataAvailabilityMode !== undefined) elements.push(nonceDataAvailabilityMode);
    if (feeDataAvailabilityMode !== undefined) elements.push(feeDataAvailabilityMode);
  }

  return toHex(computeHashOnElements(elements));
}

/**
 * Calculate declare transaction hash
 */
export function calculateDeclareTransactionHash(params: {
  senderAddress: string;
  classHash: string;
  compiledClassHash?: string;
  version: string;
  maxFee: BigNumberish;
  nonce: BigNumberish;
  nonceDataAvailabilityMode?: number;
  feeDataAvailabilityMode?: number;
  resourceBounds?: any;
  tip?: BigNumberish;
  paymasterData?: BigNumberish[];
  accountDeploymentData?: BigNumberish[];
}): string {
  const {
    senderAddress,
    classHash,
    compiledClassHash,
    version,
    maxFee,
    nonce,
    nonceDataAvailabilityMode,
    feeDataAvailabilityMode,
    resourceBounds,
    tip,
    paymasterData,
    accountDeploymentData,
  } = params;

  const elements = [
    senderAddress,
    classHash,
    version,
    maxFee,
    nonce,
  ];

  // Add V3 specific fields if present
  if (version === '0x3') {
    if (compiledClassHash) elements.push(compiledClassHash);
    if (resourceBounds) {
      elements.push(
        resourceBounds.l1_gas.max_amount,
        resourceBounds.l1_gas.max_price_per_unit,
        resourceBounds.l2_gas.max_amount,
        resourceBounds.l2_gas.max_price_per_unit
      );
    }
    if (tip !== undefined) elements.push(tip);
    if (paymasterData) elements.push(...paymasterData);
    if (accountDeploymentData) elements.push(...accountDeploymentData);
    if (nonceDataAvailabilityMode !== undefined) elements.push(nonceDataAvailabilityMode);
    if (feeDataAvailabilityMode !== undefined) elements.push(feeDataAvailabilityMode);
  }

  return toHex(computeHashOnElements(elements));
}
