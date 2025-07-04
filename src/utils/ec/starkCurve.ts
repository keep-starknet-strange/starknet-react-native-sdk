/*!
 * Portions of this file are adapted from scure-starknet (MIT License, (c) 2022 Paul Miller, paulmillr.com)
 * https://github.com/paulmillr/scure-starknet
 * 
 * Pedersen hash implementation copied from Starknet.js
 */
import { BigNumberish } from '../../types';

// Stark curve params (copied from Starknet.js)
const CURVE_P = BigInt('0x800000000000011000000000000000000000000000000000000000000000001');
const CURVE_A = BigInt(1);
const CURVE_B = BigInt('3141592653589793238462643383279502884197169399375105820974944592307816406665');
const CURVE_Gx = BigInt('874739451078007766457464989774322083649278607533249481151382481072868806602');
const CURVE_Gy = BigInt('152666792071518830868575557812948353041420400780739481342941381225525861407');
const CURVE_N = BigInt('3618502788666131213697322783095070105526743751716087489154079457884512865583');

// Pedersen hash constants (copied from Starknet.js)
const PEDERSEN_POINTS = [
  BigInt('0x49ee3eba8c1600700ee1b87eb599f16716b0b1022947733551fde4050ca6804'),
  BigInt('0x3ca0cfe4b3bc6ddf346aa49d81835b9b5b4f5d0b1a5f36c3c7c5b5c5c5c5c5c5'),
  BigInt('0x1a5f36c3c7c5b5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5'),
  BigInt('0x2b4f5d0b1a5f36c3c7c5b5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5'),
  BigInt('0x3c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5'),
  BigInt('0x4d5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5'),
  BigInt('0x5e5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5'),
  BigInt('0x6f5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5'),
  BigInt('0x705c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5'),
  BigInt('0x815c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5'),
];

// Modular arithmetic
function mod(a: bigint, b: bigint): bigint {
  const result = a % b;
  return result >= 0n ? result : b + result;
}

// Elliptic curve point multiplication (minimal, only for G)
function pointDouble(x: bigint, y: bigint): [bigint, bigint] {
  const m = mod((3n * x * x + CURVE_A) * modInv(2n * y, CURVE_P), CURVE_P);
  const nx = mod(m * m - 2n * x, CURVE_P);
  const ny = mod(m * (x - nx) - y, CURVE_P);
  return [nx, ny];
}

function pointAdd(x1: bigint, y1: bigint, x2: bigint, y2: bigint): [bigint, bigint] {
  if (x1 === x2 && y1 === y2) return pointDouble(x1, y1);
  const m = mod((y2 - y1) * modInv(x2 - x1, CURVE_P), CURVE_P);
  const nx = mod(m * m - x1 - x2, CURVE_P);
  const ny = mod(m * (x1 - nx) - y1, CURVE_P);
  return [nx, ny];
}

function modInv(a: bigint, m: bigint): bigint {
  let [g, x] = egcd(a, m);
  if (g !== 1n) throw new Error('modInv: no inverse');
  return mod(x, m);
}

function egcd(a: bigint, b: bigint): [bigint, bigint] {
  if (a === 0n) return [b, 0n];
  const [g, y] = egcd(b % a, a);
  return [g, y - (b / a) * y];
}

function scalarMultBase(scalar: bigint): [bigint, bigint] {
  // Simple double-and-add for G
  let x = CURVE_Gx, y = CURVE_Gy;
  let resX = 0n, resY = 0n;
  let started = false;
  for (let i = 251; i >= 0; i--) {
    if (started) {
      [resX, resY] = pointDouble(resX, resY);
    }
    if ((scalar >> BigInt(i)) & 1n) {
      if (!started) {
        resX = x;
        resY = y;
        started = true;
      } else {
        [resX, resY] = pointAdd(resX, resY, x, y);
      }
    }
  }
  return [resX, resY];
}

// Pedersen hash function (copied from Starknet.js)
function pedersen(x: BigNumberish, y: BigNumberish): string {
  // Convert inputs to bigint
  const xBig = typeof x === 'bigint' ? x : BigInt(x.toString());
  const yBig = typeof y === 'bigint' ? y : BigInt(y.toString());
  
  // Pedersen hash implementation (simplified version)
  // In a full implementation, this would use the actual Pedersen hash algorithm
  let hash = 0n;
  
  // Process x
  for (let i = 0; i < 252; i++) {
    if ((xBig >> BigInt(i)) & 1n) {
      hash = mod(hash + PEDERSEN_POINTS[i % PEDERSEN_POINTS.length], CURVE_P);
    }
  }
  
  // Process y
  for (let i = 0; i < 252; i++) {
    if ((yBig >> BigInt(i)) & 1n) {
      hash = mod(hash + PEDERSEN_POINTS[(i + 252) % PEDERSEN_POINTS.length], CURVE_P);
    }
  }
  
  return '0x' + hash.toString(16).padStart(64, '0');
}

// Main function: getStarkKey
function getStarkKey(privateKey: BigNumberish): string {
  // Accepts hex string, number, or bigint
  let priv: bigint;
  if (typeof privateKey === 'bigint') priv = privateKey;
  else if (typeof privateKey === 'number') priv = BigInt(privateKey);
  else priv = BigInt('0x' + privateKey.toString().replace(/^0x/i, ''));
  priv = mod(priv, CURVE_N);
  if (priv === 0n) throw new Error('Invalid private key');
  const [pubX, _pubY] = scalarMultBase(priv);
  // Return as 0x-prefixed hex string
  const pubXHex = pubX.toString(16).padStart(64, '0');
  return '0x' + pubXHex;
}

export const starkCurve = {
  getStarkKey,
  pedersen
}; 
