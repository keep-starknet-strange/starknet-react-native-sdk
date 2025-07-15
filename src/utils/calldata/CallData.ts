import { RawArgs, Calldata, Call, CairoVersion } from '../../types/lib';
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

  /**
   * Get execute calldata for transactions
   * @param calls Array of Call objects
   * @param cairoVersion Cairo version
   * @returns Compiled calldata
   */
  static getExecuteCalldata(calls: Call[], cairoVersion?: CairoVersion): string[] {
    const calldata: string[] = [];
    
    for (const call of calls) {
      calldata.push(call.contractAddress);
      calldata.push(call.entrypoint);
      
      let callCalldata: string[] = [];
      if (call.calldata) {
        if (Array.isArray(call.calldata)) {
          callCalldata = call.calldata.map((c: any) => c.toString());
        } else {
          // If it's RawArgs, compile it
          callCalldata = this.compile(call.calldata);
        }
      }
      
      calldata.push(callCalldata.length.toString());
      calldata.push(...callCalldata);
    }
    
    return calldata;
  }
}

/**
 * Standalone function for getExecuteCalldata
 */
export function getExecuteCalldata(calls: Call[], cairoVersion?: CairoVersion): string[] {
  return CallData.getExecuteCalldata(calls, cairoVersion);
} 
