// Simplified Cairo enum types for React Native compatibility
import { BigNumberish } from '../../../types';

// Basic type definitions
export interface CairoFelt {
  value: BigNumberish;
}

export interface CairoUint256 {
  low: BigNumberish;
  high: BigNumberish;
}

export interface CairoUint512 {
  limb0: BigNumberish;
  limb1: BigNumberish;
  limb2: BigNumberish;
  limb3: BigNumberish;
}

// Type guards
export const isTypeStruct = (type: string, structs: any): boolean => type in structs;
export const isTypeEnum = (type: string, enums: any): boolean => type in enums;

// Simplified version check
export function isCairo1Abi(abi: any): boolean {
  // Simplified check - in a full implementation this would check the actual ABI structure
  return Array.isArray(abi) && abi.length > 0;
}

export function getAbiContractVersion(abi: any): { cairo: '0' | '1' | undefined; compiler: '0' | '1' | '2' | undefined } {
  // Simplified version detection
  return {
    cairo: '1',
    compiler: '2'
  };
}

/**
 * Create felt Cairo type (cairo type helper)
 * @returns format: felt-string
 */
export function felt(it: BigNumberish): string {
  return it.toString();
}
