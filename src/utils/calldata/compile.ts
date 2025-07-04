import { BigNumberish, RawArgs, Calldata } from '../../types/lib';
import { felt } from './enum/cairo';
import { isBigInt } from '../typed';
import { CairoOption, CairoOptionVariant } from './enum/CairoOptions';
import { CairoResult, CairoResultVariant } from './enum/CairoResults';
import { CairoCustomEnum } from './enum/CairoCustomEnums';

/**
 * Compile contract callData without abi
 * @param rawArgs RawArgs representing cairo method arguments or string array of compiled data
 * @returns Calldata
 */
export function compile(rawArgs: RawArgs): Calldata {
  const createTree = (obj: object) => {
    const getEntries = (o: object, prefix = '.'): any => {
      const oe = Array.isArray(o) ? [o.length.toString(), ...o] : o;
      return Object.entries(oe).flatMap(([k, v]) => {
        let value = v;
        const kk = Array.isArray(oe) && k === '0' ? '$$len' : k;
        if (isBigInt(value)) return [[`${prefix}${kk}`, felt(value)]];
        if (Object(value) === value) {
          const methodsKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(value));
          const keys = [...Object.getOwnPropertyNames(value), ...methodsKeys];
          if (keys.includes('isSome') && keys.includes('isNone')) {
            // Option
            const myOption = value as CairoOption<any>;
            const variantNb = myOption.isSome()
              ? CairoOptionVariant.Some
              : CairoOptionVariant.None;
            if (myOption.isSome())
              return getEntries({ 0: variantNb, 1: myOption.unwrap() }, `${prefix}${kk}.`);
            return [[`${prefix}${kk}`, felt(variantNb)]];
          }
          if (keys.includes('isOk') && keys.includes('isErr')) {
            // Result
            const myResult = value as CairoResult<any, any>;
            const variantNb = myResult.isOk() ? CairoResultVariant.Ok : CairoResultVariant.Err;
            return getEntries({ 0: variantNb, 1: myResult.unwrap() }, `${prefix}${kk}.`);
          }
          if (keys.includes('variant') && keys.includes('activeVariant')) {
            // CustomEnum
            const myEnum = value as CairoCustomEnum;
            const activeVariant: string = myEnum.activeVariant();
            const listVariants = Object.keys(myEnum.variant);
            const activeVariantNb = listVariants.findIndex(
              (variant: any) => variant === activeVariant
            );
            if (
              typeof myEnum.unwrap() === 'object' &&
              Object.keys(myEnum.unwrap()).length === 0 // empty object : {}
            ) {
              return [[`${prefix}${kk}`, felt(activeVariantNb)]];
            }
            return getEntries({ 0: activeVariantNb, 1: myEnum.unwrap() }, `${prefix}${kk}.`);
          }
          // normal object
          return getEntries(value, `${prefix}${kk}.`);
        }
        return [[`${prefix}${kk}`, felt(value)]];
      });
    };
    const result = Object.fromEntries(getEntries(obj));
    return result;
  };

  let callTreeArray;
  if (!Array.isArray(rawArgs)) {
    // flatten structs, tuples, add array length. Process leafs as Felt
    const callTree = createTree(rawArgs);
    // convert to array
    callTreeArray = Object.values(callTree);
  } else {
    // already compiled data but modified or raw args provided as array, recompile it
    // recreate tree
    const callObj = { ...rawArgs };
    const callTree = createTree(callObj);
    callTreeArray = Object.values(callTree);
  }

  // add compiled property to array object
  Object.defineProperty(callTreeArray, '__compiled__', {
    enumerable: false,
    writable: false,
    value: true,
  });
  return callTreeArray;
} 
