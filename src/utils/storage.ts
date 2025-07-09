import { SdkError } from '@/utils/errors'

export interface SecureStorageConfig {
  serviceName?: string
  accessControl?: string
  authenticatePrompt?: string
}

export interface StoredKeyInfo {
  address: string
  createdAt: number
  biometricEnabled: boolean
}

export class SecureStorage {
  private serviceName: string

  constructor(config: SecureStorageConfig = {}) {
    this.serviceName = config.serviceName || 'StarknetReactNativeSDK'
  }

  async storeKey(
    address: string, 
    privateKey: string, 
    biometricEnabled = false
  ): Promise<void> {
    try {
      const keyInfo: StoredKeyInfo = {
        address,
        createdAt: Date.now(),
        biometricEnabled
      }

      const keyData = {
        privateKey,
        info: keyInfo
      }

      await this.setItem(`account_${address}`, JSON.stringify(keyData))
      await this.setItem('stored_keys', JSON.stringify(await this.getStoredKeys()))
    } catch (error) {
      throw SdkError.networkError(`Failed to store key: ${error}`)
    }
  }

  async getKey(address: string): Promise<string | null> {
    try {
      const keyData = await this.getItem(`account_${address}`)
      if (!keyData) return null

      const parsed = JSON.parse(keyData)
      return parsed.privateKey || null
    } catch (error) {
      throw SdkError.networkError(`Failed to retrieve key: ${error}`)
    }
  }

  async removeKey(address: string): Promise<void> {
    try {
      await this.removeItem(`account_${address}`)
      
      const storedKeys = await this.getStoredKeys()
      const updatedKeys = storedKeys.filter(key => key.address !== address)
      await this.setItem('stored_keys', JSON.stringify(updatedKeys))
    } catch (error) {
      throw SdkError.networkError(`Failed to remove key: ${error}`)
    }
  }

  async getStoredKeys(): Promise<StoredKeyInfo[]> {
    try {
      const keys = await this.getItem('stored_keys')
      return keys ? JSON.parse(keys) : []
    } catch {
      return []
    }
  }

  async hasKey(address: string): Promise<boolean> {
    try {
      const key = await this.getKey(address)
      return key !== null
    } catch {
      return false
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.getStoredKeys()
      for (const key of keys) {
        await this.removeItem(`account_${key.address}`)
      }
      await this.removeItem('stored_keys')
    } catch (error) {
      throw SdkError.networkError(`Failed to clear storage: ${error}`)
    }
  }

  private async setItem(key: string, value: string): Promise<void> {
    // Mock implementation - will be replaced with actual secure storage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`${this.serviceName}_${key}`, value)
    }
  }

  private async getItem(key: string): Promise<string | null> {
    // Mock implementation - will be replaced with actual secure storage
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(`${this.serviceName}_${key}`)
    }
    return null
  }

  private async removeItem(key: string): Promise<void> {
    // Mock implementation - will be replaced with actual secure storage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`${this.serviceName}_${key}`)
    }
  }
}

export const createSecureStorage = (config?: SecureStorageConfig): SecureStorage => {
  return new SecureStorage(config)
} 
