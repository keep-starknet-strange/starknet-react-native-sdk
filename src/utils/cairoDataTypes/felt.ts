// TODO Convert to CairoFelt base on CairoUint256 and implement it in the codebase in the backward compatible manner

import { BigNumberish } from '@/types';
import { isHex, isStringWholeNumber } from '@/utils/num';
import {
  encodeShortString,
  isShortString,
  isText
} from '@/utils/shortString';
import { isBoolean, isString, isBigInt } from '@/utils/typed';

/**
 * Create felt Cairo type (cairo type helper)
 * @returns format: felt-string
 */
export function CairoFelt(it: BigNumberish): string {
  // BN or number
  if (isBigInt(it) || Number.isInteger(it)) {
    return it.toString();
  }

  // Handling strings
  if (isString(it)) {
    // Hex strings
    if (isHex(it)) {
      return BigInt(it).toString();
    }
    // Text strings that must be short
    if (isText(it)) {
      if (!isShortString(it)) {
        throw new Error(
          `${it} is a long string > 31 chars. Please split it into an array of short strings.`
        );
      }
      // Assuming encodeShortString returns a hex representation of the string
      return BigInt(encodeShortString(it)).toString();
    }
    // Whole numeric strings
    if (isStringWholeNumber(it)) {
      return it.toString();
    }
  }
  // bool to felt
  if (isBoolean(it)) {
    return `${Number(it)}`;
  }

  throw new Error(`${it} can't be computed by felt()`);
} 
