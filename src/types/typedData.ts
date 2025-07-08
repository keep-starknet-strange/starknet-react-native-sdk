// Local type definitions (copied from Starknet.js without external imports)
export type TypedData = {
  types: Record<string, TypedDataField[]>;
  primaryType: string;
  domain: Record<string, unknown>;
  message: Record<string, unknown>;
};

export type TypedDataField = {
  name: string;
  type: string;
};
