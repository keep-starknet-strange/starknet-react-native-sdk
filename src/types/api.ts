import { BigNumberish } from './index';

export const ETransactionVersion2 = {
  V2: '0x2',
} as const;

export const ETransactionVersion3 = {
  V3: '0x3',
} as const;

export type ETransactionVersion2 = ValuesType<typeof ETransactionVersion2>;
export type ETransactionVersion3 = ValuesType<typeof ETransactionVersion3>;

import { ValuesType } from './helpers/valuesType';

export const RPCSPEC08 = {
  V0_8: '0.8',
  V0_8_1: '0.8.1',
} as const;

export type RPCSPEC08 = ValuesType<typeof RPCSPEC08>;

// RPC 0.8 specific types
export interface RPC08FeeEstimate {
  l1_gas_consumed: BigNumberish;
  l1_gas_price: BigNumberish;
  l1_data_gas_consumed: BigNumberish;
  l1_data_gas_price: BigNumberish;
  l2_gas_consumed: BigNumberish;
  l2_gas_price: BigNumberish;
  overall_fee: BigNumberish;
}

export interface RPC08ResourceBounds {
  l1_gas: {
    max_amount: BigNumberish;
    max_price_per_unit: BigNumberish;
  };
  l2_gas: {
    max_amount: BigNumberish;
    max_price_per_unit: BigNumberish;
  };
  l1_data_gas: {
    max_amount: BigNumberish;
    max_price_per_unit: BigNumberish;
  };
}

// Namespace for RPCSPEC08
export namespace RPCSPEC08 {
  export type FeeEstimate = RPC08FeeEstimate;
  export type ResourceBounds = RPC08ResourceBounds;
} 
