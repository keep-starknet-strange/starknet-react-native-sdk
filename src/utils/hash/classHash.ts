/**
 * Limited Class Hash for RN
 */

import { BigNumberish, RawArgs } from '../../types';
import { ADDR_BOUND } from '../../global/constants';
import { isString, parse } from '../assert';
import { starkCurve } from '../ec/starkCurve';

// Simple utility functions
function toHex(value: bigint): string {
  return '0x' + value.toString(16);
}

function felt(value: string): string {
  return value;
}

function CallData_compile(data: RawArgs): string[] {
  // Simplified CallData compilation
  return Object.entries(data).map(([key, value]) => value?.toString() || '0');
}

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
  const compiledCalldata = CallData_compile(constructorCalldata);
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
 * Compute hash on elements using Pedersen hash
 */
export function computeHashOnElements(data: BigNumberish[]): string {
  return [...data, data.length]
    .reduce((x: BigNumberish, y: BigNumberish) => starkCurve.pedersen(BigInt(x), BigInt(y)), 0)
    .toString();
}

/**
 * Simplified contract class hash computation
 */
export function computeContractClassHash(contract: any | string): string {
  const compiledContract = isString(contract) ? parse(contract) : contract;
  
  // For now, return a simplified hash
  // In a full implementation, this would compute the actual class hash
  const contractString = JSON.stringify(compiledContract);
  const hash = starkCurve.pedersen(BigInt(contractString.length), BigInt(contractString.charCodeAt(0)));
  return '0x' + hash.replace('0x', '');
}
