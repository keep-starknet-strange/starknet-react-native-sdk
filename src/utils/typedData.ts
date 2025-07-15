import { TypedData } from '../types';
import { starkCurve } from './ec/starkCurve';

// Starknet message prefix for typed data
const STARKNET_MESSAGE_PREFIX = 'StarkNet Message:';

/**
 * Gets the message hash for typed data signing
 * @param typedData The typed data to hash
 * @param accountAddress The account address
 * @returns The message hash as a hex string
 */
export function getMessageHash(typedData: TypedData, accountAddress: string): string {
  // Create the message to hash
  const message = createStarknetMessage(typedData);
  
  // Hash the message using Pedersen hash
  const messageHash = starkCurve.pedersen(
    BigInt('0x' + accountAddress.replace('0x', '')),
    BigInt('0x' + message.replace('0x', ''))
  );
  
  return messageHash;
}

/**
 * Creates a Starknet message from typed data
 * @param typedData The typed data
 * @returns The message as a hex string
 */
function createStarknetMessage(typedData: TypedData): string {
  // This is a simplified implementation
  // In a full implementation, you would properly encode the typed data
  // according to EIP-712 format
  
  const { domain, message, primaryType } = typedData;
  
  // Create a simple hash of the domain and message
  let hash = 0n;
  
  // Hash domain
  for (const [key, value] of Object.entries(domain)) {
    const keyHash = BigInt('0x' + key.replace(/[^0-9a-f]/gi, ''));
    const valueHash = typeof value === 'string' 
      ? BigInt('0x' + value.replace(/[^0-9a-f]/gi, ''))
      : BigInt(value);
    hash = hash ^ keyHash ^ valueHash;
  }
  
  // Hash message
  for (const [key, value] of Object.entries(message)) {
    const keyHash = BigInt('0x' + key.replace(/[^0-9a-f]/gi, ''));
    const valueHash = typeof value === 'string' 
      ? BigInt('0x' + value.replace(/[^0-9a-f]/gi, ''))
      : BigInt(value);
    hash = hash ^ keyHash ^ valueHash;
  }
  
  // Add primary type
  const typeHash = BigInt('0x' + primaryType.replace(/[^0-9a-f]/gi, ''));
  hash = hash ^ typeHash;
  
  return '0x' + hash.toString(16).padStart(64, '0');
} 
