import { SdkError } from './errors'

export const isValidStarknetAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false
  
  const cleanAddress = address.startsWith('0x') ? address.slice(2) : address
  
  if (cleanAddress.length === 0 || cleanAddress.length > 64) return false
  
  return /^[0-9a-fA-F]+$/.test(cleanAddress)
}

export const normalizeAddress = (address: string): string => {
  if (!isValidStarknetAddress(address)) {
    throw SdkError.invalidConfiguration(`Invalid Starknet address: ${address}`)
  }
  
  const cleanAddress = address.startsWith('0x') ? address.slice(2) : address
  return `0x${cleanAddress.toLowerCase().padStart(64, '0')}`
}

export const isValidChainId = (chainId: string): boolean => {
  if (!chainId || typeof chainId !== 'string') return false
  return chainId.startsWith('0x') && chainId.length > 2
}

export const isValidTransactionHash = (hash: string): boolean => {
  if (!hash || typeof hash !== 'string') return false
  
  const cleanHash = hash.startsWith('0x') ? hash.slice(2) : hash
  return cleanHash.length === 64 && /^[0-9a-fA-F]+$/.test(cleanHash)
}

export const validateAmount = (amount: string): boolean => {
  if (!amount || typeof amount !== 'string') return false
  
  try {
    const num = parseFloat(amount)
    return num >= 0 && !isNaN(num) && isFinite(num)
  } catch {
    return false
  }
}

export const validateUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false
  
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return ''
  
  return input.trim().replace(/[<>\"'&]/g, '')
}

export const isValidPrivateKey = (privateKey: string): boolean => {
  if (!privateKey || typeof privateKey !== 'string') return false
  
  const cleanKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey
  return cleanKey.length === 64 && /^[0-9a-fA-F]+$/.test(cleanKey)
}

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export const formatAddress = (address: string, length = 8): string => {
  if (!isValidStarknetAddress(address)) return address
  
  const normalized = normalizeAddress(address)
  const start = normalized.slice(0, length + 2)
  const end = normalized.slice(-length)
  
  return `${start}...${end}`
}

export const formatAmount = (
  amount: string, 
  decimals = 18, 
  precision = 6
): string => {
  if (!validateAmount(amount)) return '0'
  
  try {
    const num = parseFloat(amount) / Math.pow(10, decimals)
    return num.toFixed(precision).replace(/\.?0+$/, '')
  } catch {
    return '0'
  }
} 