import { ConnectedWallet } from '@/types'
import { BaseWalletConnector } from './base'

export class BraavosConnector extends BaseWalletConnector {
  readonly id = 'braavos'
  readonly name = 'Braavos'
  readonly icon = 'https://braavos.app/assets/braavos-logo.svg'

  checkAvailability(): boolean {
    return true
  }

  async connect(): Promise<ConnectedWallet> {
    try {
      const accounts = ['0x5678...'] // Mock for now
      
      this.setAccounts(accounts)
      this.setConnected(true)

      return {
        connector: this,
        accounts,
        selectedAccount: accounts[0]
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.setConnected(false)
      this.setAccounts([])
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getAccounts(): Promise<string[]> {
    this.validateConnection()
    return this._accounts
  }

  async signMessage(message: string, account: string): Promise<string> {
    this.validateConnection()
    
    try {
      return `braavos_signed_${message}_by_${account}`
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async signTransaction(_calls: any[], _details?: any): Promise<string[]> {
    this.validateConnection()
    
    try {
      return ['braavos_mock_transaction_hash']
    } catch (error) {
      throw this.handleError(error)
    }
  }
} 