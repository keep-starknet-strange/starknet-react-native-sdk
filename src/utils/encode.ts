// Base64 implementation copied from Starknet.js (without importing @scure/base)
export const base64 = {
  encode: (data: Uint8Array): string => {
    // Implementation copied from @scure/base
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    while (i < data.length) {
      const byte1 = data[i++];
      const byte2 = i < data.length ? data[i++] : 0;
      const byte3 = i < data.length ? data[i++] : 0;
      
      const enc1 = byte1 >> 2;
      const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
      const enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
      const enc4 = byte3 & 63;
      
      result += chars[enc1] + chars[enc2] + 
                (i > data.length + 1 ? '=' : chars[enc3]) + 
                (i > data.length ? '=' : chars[enc4]);
    }
    return result;
  },
  decode: (str: string): Uint8Array => {
    // Implementation copied from @scure/base
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    str = str.replace(/=+$/, '');
    const result = [];
    let i = 0;
    while (i < str.length) {
      const enc1 = chars.indexOf(str[i++]);
      const enc2 = chars.indexOf(str[i++]);
      const enc3 = chars.indexOf(str[i++]);
      const enc4 = chars.indexOf(str[i++]);
      
      const byte1 = (enc1 << 2) | (enc2 >> 4);
      const byte2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const byte3 = ((enc3 & 3) << 6) | enc4;
      
      result.push(byte1);
      if (enc3 !== -1) result.push(byte2);
      if (enc4 !== -1) result.push(byte3);
    }
    return new Uint8Array(result);
  }
};

export const IS_BROWSER = typeof window !== 'undefined';

//const STRING_ZERO = '0';

/**
 * Some functions recreated from https://github.com/pedrouid/enc-utils/blob/master/src/index.ts
 * enc-utils is not a dependency to avoid using `Buffer` which only works in node and not browsers
 */

/**
 * Convert array buffer to string
 *
 * *[internal usage]*
 *
 * @param {ArrayBuffer} array The ArrayBuffer to convert to string.
 * @returns {string} The converted string.
 *
 * @example
 * ```typescript
 * const buffer = new ArrayBuffer(5);
 * const view = new Uint8Array(buffer);
 * [72, 101, 108, 108, 111].forEach((x, idx) => view[idx] = x);
 * const result = encode.arrayBufferToString(buffer);
 * // result = "Hello"
 * ```
 */
export function arrayBufferToString(array: ArrayBuffer): string {
  return new Uint8Array(array).reduce((data, byte) => data + String.fromCharCode(byte), '');
}

/**
 * Convert utf8-string to Uint8Array
 *
 * *[internal usage]*
 *
 * @param {string} str The UTF-8 string to convert.
 * @returns {Uint8Array} The encoded Uint8Array.
 *
 * @example
 * ```typescript
 * const myString = 'Hi';
 * const result = encode.utf8ToArray(myString);
 * // result = Uint8Array(2) [ 72, 105 ]
 * ```
 */
export function utf8ToArray(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Convert string to array buffer (browser and node compatible)
 *
 * @param {string} a The Base64 encoded string to convert.
 * @returns {Uint8Array} The decoded Uint8Array.
 *
 * @example
 * ```typescript
 * const base64String = 'SGVsbG8='; // 'Hello' in Base64
 * const result = encode.atobUniversal(base64String);
 * // result = Uint8Array(5) [ 72, 101, 108, 108, 111 ]
 * ```
 */
export function atobUniversal(a: string): Uint8Array {
  return base64.decode(a);
}

/**
 * Convert array buffer to string (browser and node compatible)
 *
 * @param {ArrayBuffer} b The Array buffer.
 * @returns {string} The Base64 encoded string.
 *
 * @example
 * ```typescript
 * const buffer = new Uint8Array([72, 101, 108, 108, 111]); // Array with ASCII values for 'Hello'
 * const result = encode.btoaUniversal(buffer);
 * // result = "SGVsbG8="
 * ```
 */
export function btoaUniversal(b: ArrayBuffer): string {
  return base64.encode(new Uint8Array(b));
}

/**
 * Convert array buffer to hex-string
 *
 * @param {Uint8Array} buffer The encoded Uint8Array.
 * @returns {string} The hex-string
 *
 * @example
 * ```typescript
 * const buffer = new Uint8Array([72, 101, 108, 108, 111]); // Array with ASCII values for 'Hello'
 * const result = encode.buf2hex(buffer);
 * // result = "48656c6c6f"
 * ```
 */
export function buf2hex(buffer: Uint8Array): string {
  return Array.from(buffer, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Add hex prefix to string
 */
export function addHexPrefix(str: string): string {
  return str.startsWith('0x') ? str : `0x${str}`;
}

/**
 * Remove hex prefix from string
 */
export function removeHexPrefix(str: string): string {
  return str.startsWith('0x') ? str.slice(2) : str;
}

/**
 * Sanitize hex string
 */
export function sanitizeHex(str: string): string {
  const hex = str.replace(/^0x/i, '');
  if (hex.length % 2 !== 0) {
    return `0${hex}`;
  }
  return hex;
}
