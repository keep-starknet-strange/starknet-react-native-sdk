/*!
 * Production-ready Stark curve implementation using @scure/starknet
 * Based on starknet.js implementation
 */
import { BigNumberish } from '../../types';
import { toBigInt } from '../num';

// Import the production-ready stark curve from @scure/starknet
import * as scureStarknet from '@scure/starknet';

// Re-export the production functions
export const starkCurve = {
  /**
   * Get the Stark public key from a private key
   * @param privateKey - The private key as BigNumberish
   * @returns The public key as a hex string
   */
  getStarkKey: (privateKey: BigNumberish): string => {
    const priv = toBigInt(privateKey);
    return scureStarknet.getStarkKey(priv.toString(16).padStart(64, '0'));
  },

  /**
   * Sign a message hash with a private key
   * @param hash - The message hash to sign
   * @param privateKey - The private key to sign with
   * @returns The signature as { r: bigint, s: bigint, recovery: number }
   */
  sign: (hash: BigNumberish, privateKey: BigNumberish): { r: bigint; s: bigint; recovery: number } => {
    const hashBig = toBigInt(hash);
    const privBig = toBigInt(privateKey);
    
    const signature = scureStarknet.sign(
      privBig.toString(16).padStart(64, '0'),
      hashBig.toString(16).padStart(64, '0')
    );
    
    // Handle different signature formats
    if (typeof signature === 'object' && 'r' in signature && 's' in signature) {
      return {
        r: BigInt('0x' + signature.r),
        s: BigInt('0x' + signature.s),
        recovery: (signature as any).recovery || 0
      };
    } else {
      // If signature is a Uint8Array or other format, convert it
      const sigArray = Array.from(signature as Uint8Array);
      return {
        r: BigInt('0x' + sigArray.slice(0, 32).map(b => b.toString(16).padStart(2, '0')).join('')),
        s: BigInt('0x' + sigArray.slice(32, 64).map(b => b.toString(16).padStart(2, '0')).join('')),
        recovery: 0
      };
    }
  },

  /**
   * Verify a signature
   * @param hash - The message hash that was signed
   * @param signature - The signature to verify
   * @param publicKey - The public key to verify against
   * @returns True if the signature is valid
   */
  verify: (hash: BigNumberish, signature: { r: bigint; s: bigint }, publicKey: BigNumberish): boolean => {
    const hashBig = toBigInt(hash);
    const pubBig = toBigInt(publicKey);
    
    return scureStarknet.verify(
      hashBig.toString(16).padStart(64, '0'),
      {
        r: signature.r.toString(16).padStart(64, '0'),
        s: signature.s.toString(16).padStart(64, '0')
      } as any,
      pubBig.toString(16).padStart(64, '0')
    );
  },

  /**
   * Compute Pedersen hash of two elements
   * @param x - First element
   * @param y - Second element
   * @returns The Pedersen hash as a hex string
   */
  pedersen: (x: BigNumberish, y: BigNumberish): string => {
    const xBig = toBigInt(x);
    const yBig = toBigInt(y);
    
    return scureStarknet.pedersen(
      xBig.toString(16).padStart(64, '0'),
      yBig.toString(16).padStart(64, '0')
    );
  }
};

// Legacy compatibility exports
export const getStarkKey = starkCurve.getStarkKey;
export const sign = starkCurve.sign;
export const verify = starkCurve.verify;
export const pedersen = starkCurve.pedersen; 
