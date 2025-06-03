import {
    WalletConnector,
    ConnectedWallet,
    StarknetSdkError
} from '@/types'
import { SdkError } from '@/utils/errors'

export abstract class BaseWalletConnector implements WalletConnector {
  abstract readonly id: string
  abstract readonly name: string
  abstract readonly icon?: string

  protected _connected = false
  protected _accounts: string[] = []
  protected _selectedAccount = ''

  get available(): boolean {
    return this.checkAvailability()
  }

  abstract checkAvailability(): boolean
  abstract connect(): Promise<ConnectedWallet>
  abstract disconnect(): Promise<void>
  abstract getAccounts(): Promise<string[]>
  abstract signMessage(message: string, account: string): Promise<string>
  abstract signTransaction(calls: any[], details?: any): Promise<string[]>

  isConnected(): boolean {
    return this._connected
  }

  protected setConnected(connected: boolean): void {
    this._connected = connected
  }

  protected setAccounts(accounts: string[]): void {
    this._accounts = accounts
    if (accounts.length > 0 && !this._selectedAccount) {
      this._selectedAccount = accounts[0]
    }
  }

  protected setSelectedAccount(account: string): void {
    if (!this._accounts.includes(account)) {
      throw SdkError.invalidConfiguration('Account not found in wallet')
    }
    this._selectedAccount = account
  }

  protected validateConnection(): void {
    if (!this._connected) {
      throw SdkError.unauthorized()
    }
  }

  protected handleError(error: unknown): StarknetSdkError {
    if (error instanceof Error) {
      if (error.message.includes('rejected') || error.message.includes('denied')) {
        return SdkError.connectionRejected()
      }
      return SdkError.connectionFailed(error.message)
    }
    return SdkError.connectionFailed('Unknown error occurred')
  }
} 