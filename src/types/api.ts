export const ETransactionVersion2 = {
  V2: '0x2',
} as const;

export const ETransactionVersion3 = {
  V3: '0x3',
} as const;

export type ETransactionVersion2 = ValuesType<typeof ETransactionVersion2>;
export type ETransactionVersion3 = ValuesType<typeof ETransactionVersion3>;

import { ValuesType } from './helpers/valuesType'; 
