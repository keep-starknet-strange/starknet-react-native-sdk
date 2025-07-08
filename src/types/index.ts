// Type definitions based on Starknet.js (without importing external packages)
export type BigNumberish = string | number | bigint;
export type RawArgs = Record<string, any>;

// Basic Starknet types (standalone definitions)
export interface Account {
  address: string;
  deploy(contractAddress: string, calldata?: any[]): Promise<any>;
  execute(calls: Call[], abis?: any[], transactionsDetail?: InvocationsDetails): Promise<any>;
  estimateInvokeFee(calls: Call[], abis?: any[], transactionsDetail?: InvocationsDetails): Promise<any>;
  estimateAccountDeployFee(contractAddress: string, calldata?: any[], transactionsDetail?: InvocationsDetails): Promise<any>;
  signMessage(typedData: any): Promise<any>;
  hashMessage(typedData: any): string;
  verifyMessage(typedData: any, signature: any): boolean;
}

export interface Call {
  contractAddress: string;
  entrypoint: string;
  calldata?: any[];
}

export interface InvocationsDetails {
  nonce?: string;
  maxFee?: string;
  version?: string;
  cairoVersion?: string;
}

export interface Provider {
  getChainId(): Promise<string>;
  getBlock(blockIdentifier?: any): Promise<any>;
  getBlockNumber(): Promise<number>;
  getClassAt(blockIdentifier: any, contractAddress: string): Promise<any>;
  getClassHashAt(blockIdentifier: any, contractAddress: string): Promise<string>;
  getClass(blockIdentifier: any, classHash: string): Promise<any>;
  getEstimateFee(invocation: any, invocationDetails?: any): Promise<any>;
  getInvokeEstimateFee(invocation: any, invocationDetails?: any): Promise<any>;
  getL1MessageHash(message: any): Promise<string>;
  getNonce(contractAddress: string, blockIdentifier?: any): Promise<string>;
  getStorageAt(contractAddress: string, key: string, blockIdentifier?: any): Promise<string>;
  getTransaction(txHash: string): Promise<any>;
  getTransactionReceipt(txHash: string): Promise<any>;
  getTransactionStatus(txHash: string): Promise<any>;
  getTransactionTrace(txHash: string): Promise<any>;
  getEvents(eventFilter: any): Promise<any>;
  callContract(request: any, blockIdentifier?: any): Promise<any>;
  invokeFunction(invocation: any, abis?: any[], transactionsDetail?: any): Promise<any>;
  declareContract(contract: any, classHash: string, contractAddress?: string): Promise<any>;
  deployContract(payload: any, constructorCalldata?: any[], addressSalt?: string): Promise<any>;
  deployAccountContract(payload: any, constructorCalldata?: any[], addressSalt?: string): Promise<any>;
  waitForTransaction(txHash: string, options?: any): Promise<any>;
  getSimulateTransaction(invocation: any, invocationDetails?: any, blockIdentifier?: any): Promise<any>;
}

export type BigNumberish = string | number | bigint;
export type RawArgs = Record<string, any>;

export interface StarknetConfig {
  networkId: StarknetNetwork
  rpcUrl?: string
  chainId: string
  explorerUrl?: string
}

export enum StarknetNetwork {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  DEVNET = 'devnet'
}

export interface WalletConnector {
  id: string
  name: string
  icon?: string
  available: boolean
  connect(): Promise<ConnectedWallet>
  disconnect(): Promise<void>
  isConnected(): boolean
  getAccounts(): Promise<string[]>
  signMessage(message: string, account: string): Promise<string>
  signTransaction(calls: Call[], details?: InvocationsDetails): Promise<string[]>
}

export interface ConnectedWallet {
  connector: WalletConnector
  accounts: string[]
  selectedAccount: string
}

export interface EmbeddedWalletOptions {
  enableBiometrics?: boolean
  requireBiometrics?: boolean
  recoveryOptions?: RecoveryOption[]
  theme?: WalletTheme
}

export interface RecoveryOption {
  type: 'seed' | 'social' | 'cloud'
  enabled: boolean
  config?: Record<string, unknown>
}

export interface WalletTheme {
  primaryColor?: string
  backgroundColor?: string
  textColor?: string
  borderRadius?: number
  fontFamily?: string
}

export interface BiometricAuthConfig {
  title?: string
  subtitle?: string
  description?: string
  fallbackPrompt?: string
  disableDeviceFallback?: boolean
}

export interface StarknetAccount extends Account {
  address: string
  publicKey: string
  type: AccountType
  deploymentStatus: AccountDeploymentStatus
  biometricEnabled: boolean
}

export enum AccountType {
  EXTERNAL = 'external',
  EMBEDDED = 'embedded',
  SESSION = 'session'
}

export enum AccountDeploymentStatus {
  NOT_DEPLOYED = 'not_deployed',
  DEPLOYING = 'deploying',
  DEPLOYED = 'deployed',
  FAILED = 'failed'
}

export interface PaymasterConfig {
  type: PaymasterType
  enabled: boolean
  config: AvnuPaymasterConfig | CartridgePaymasterConfig
}

export enum PaymasterType {
  AVNU = 'avnu',
  CARTRIDGE = 'cartridge',
  CUSTOM = 'custom'
}

export interface AvnuPaymasterConfig {
  apiKey?: string
  baseUrl?: string
  supportedTokens?: string[]
}

export interface CartridgePaymasterConfig {
  policyId?: string
  baseUrl?: string
}

export interface TransactionRequest {
  calls: Call[]
  details?: InvocationsDetails
  paymaster?: PaymasterConfig
}

export interface TransactionResult {
  transactionHash: string
  status: TransactionStatus
  blockNumber?: number
  blockHash?: string
  actualFee?: string
}

export enum TransactionStatus {
  PENDING = 'pending',
  ACCEPTED_ON_L2 = 'accepted_on_l2',
  ACCEPTED_ON_L1 = 'accepted_on_l1',
  REJECTED = 'rejected',
  REVERTED = 'reverted'
}

export interface SessionKeyConfig {
  permissions: SessionPermission[]
  expiresAt: number
  maxCalls?: number
  allowedContracts?: string[]
}

export interface SessionPermission {
  contractAddress: string
  selector: string
  maxAmount?: string
}

export interface StarknetSdkError extends Error {
  code: string
  details?: Record<string, unknown>
}

export enum ErrorCode {
  // Connection errors
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  CONNECTION_REJECTED = 'CONNECTION_REJECTED',
  
  // Authentication errors
  BIOMETRIC_NOT_available = 'BIOMETRIC_NOT_AVAILABLE',
  BIOMETRIC_AUTH_FAILED = 'BIOMETRIC_AUTH_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // Transaction errors
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  INVALID_TRANSACTION = 'INVALID_TRANSACTION',
  
  // Account errors
  ACCOUNT_NOT_DEPLOYED = 'ACCOUNT_NOT_DEPLOYED',
  ACCOUNT_DEPLOYMENT_FAILED = 'ACCOUNT_DEPLOYMENT_FAILED',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  RPC_ERROR = 'RPC_ERROR',
  
  // Paymaster errors
  PAYMASTER_ERROR = 'PAYMASTER_ERROR',
  PAYMASTER_NOT_CONFIGURED = 'PAYMASTER_NOT_CONFIGURED',
  
  // General errors
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
  OPERATION_CANCELLED = 'OPERATION_CANCELLED'
}

export interface ContractInfo {
  address: string
  abi: unknown[]
  name?: string
}

export interface TokenInfo {
  address: string
  name: string
  symbol: string
  decimals: number
  icon?: string
}

export interface WalletBalance {
  token: TokenInfo
  balance: string
  formattedBalance: string
  usdValue?: string
}

export interface NetworkInfo {
  chainId: string
  name: string
  rpcUrl: string
  explorerUrl?: string
  tokens: TokenInfo[]
}

export interface StarknetContextValue {
  config: StarknetConfig
  provider: Provider | null
  account: StarknetAccount | null
  connector: WalletConnector | null
  isConnected: boolean
  isConnecting: boolean
  error: StarknetSdkError | null
  connect: (walletId?: string) => Promise<void>
  disconnect: () => Promise<void>
  signMessage: (message: string) => Promise<string>
  sendTransaction: (request: TransactionRequest) => Promise<TransactionResult>
}

export interface WalletModalConfig {
  title?: string
  description?: string
  showQrCode?: boolean
  connectors?: WalletConnector[]
  theme?: WalletTheme
}

export interface StarknetSdkConfig {
  network: StarknetConfig
  wallets?: {
    connectors?: WalletConnector[]
    embedded?: EmbeddedWalletOptions
  }
  paymasters?: PaymasterConfig[]
  ui?: {
    theme?: WalletTheme
    modal?: WalletModalConfig
  }
}

export type EventType = 
  | 'accountChanged'
  | 'chainChanged' 
  | 'disconnect'
  | 'transactionSent'
  | 'transactionConfirmed'
  | 'error'

export interface StarknetEvent {
  type: EventType
  data?: unknown
}

export type EventListener = (event: StarknetEvent) => void 
