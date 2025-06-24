/**
 * Limited Class Hash for RN
 */

import { BigNumberish, RawArgs } from '../../types';
import { CallData } from '../calldata';
import { felt } from '../calldata/cairo';
import { toHex } from '../num';
import { ADDR_BOUND } from '../../global/constants';

/**
 * Calculate contract address from class hash
 *
 * @param {BigNumberish} salt Salt to be used for hashing
 * @param {BigNumberish} classHash Class hash of contract to generate address for
 * @param {RawArgs} constructorCalldata Call data for contract constructor
 * @param {BigNumberish} deployerAddress Address of contract deployer
 * @returns {string} hex-string
 * @example
 * ```typescript
 * const result = hash.calculateContractAddressFromHash(1234, 0x1cf4fe5d37868d25524cdacb89518d88bf217a9240a1e6fde71cc22c429e0e3, [1234, true, false], 0x052fb1a9ab0db3c4f81d70fea6a2f6e55f57c709a46089b25eeec0e959db3695);
 * // result = 0x5fb03d3a88d8e474976932f927ff6a9e332e06ed36642ea3e8c7e38bf010f76
 * ```
 */
export function computeHashOnElements(data: BigNumberish[]): string {
  return [...data, data.length]
    .reduce((x: BigNumberish, y: BigNumberish) => starkCurve.pedersen(BigInt(x), BigInt(y)), 0)
    .toString();
}

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

function nullSkipReplacer(key: string, value: any) {
  if (key === 'attributes' || key === 'accessible_scopes') {
    return Array.isArray(value) && value.length === 0 ? undefined : value;
  }

  if (key === 'debug_info') {
    return null;
  }

  return value === null ? undefined : value;
}



export function computeContractClassHash(contract: CompiledContract | string): string {
  const compiledContract = isString(contract) ? parse(contract) : contract;

  if ('sierra_program' in compiledContract) {
    return computeSierraContractClassHash(compiledContract as CompiledSierra);
  }

  return computeLegacyContractClassHash(compiledContract as LegacyCompiledContract);
}
