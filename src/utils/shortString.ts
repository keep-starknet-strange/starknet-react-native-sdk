import { BigNumberish } from '../types/lib';
import { toBigInt } from './num';

/**
 * Check if string is long text (more than 31 characters)
 * @param str string to check
 * @returns boolean
 */
export function isLongText(str: string): boolean {
  return str.length > 31;
}

/**
 * Encode short string to felt
 * @param str string to encode
 * @returns felt string
 */
export function encodeShortString(str: string): string {
  if (isLongText(str)) {
    throw new Error(`${str} is too long. Use encodeLongString instead.`);
  }
  return toBigInt(str).toString();
}

/**
 * Decode felt to short string
 * @param felt felt to decode
 * @returns string
 */
export function decodeShortString(felt: BigNumberish): string {
  const decoded = toBigInt(felt).toString(16);
  // Convert hex to string manually for React Native compatibility
  const bytes = [];
  for (let i = 0; i < decoded.length; i += 2) {
    bytes.push(parseInt(decoded.substr(i, 2), 16));
  }
  return String.fromCharCode(...bytes);
}

/**
 * Test if a string is a Cairo short string (string with less or equal 31 characters)
 * @param {string} str the string to test
 * @returns {boolean} Returns true if the string has less than or equal to 31 characters, otherwise false.
 */
export function isShortString(str: string): boolean {
  return str.length <= 31;
}

/**
 * Test if value is a pure string text, and not a hex string or number string
 * @param {any} val the value to test
 * @returns {boolean} returns true if the value is a free-form string text, otherwise false
 */
export function isText(val: any): boolean {
  return typeof val === 'string' && !/^0x[0-9a-fA-F]+$/.test(val) && !/^[0-9]+$/.test(val);
} 
