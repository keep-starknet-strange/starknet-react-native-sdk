import { RawArgs, Calldata } from '../../types/lib';
import { compile } from './compile';

export class CallData {
  /**
   * Compile contract callData without abi
   * @param rawArgs RawArgs representing cairo method arguments or string array of compiled data
   * @returns Calldata
   */
  static compile(rawArgs: RawArgs): Calldata {
    return compile(rawArgs);
  }
} 
