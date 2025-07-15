// Type definitions based on Starknet.js (without importing external packages)
import { ValuesType } from './helpers/valuesType';

export type BigNumberish = string | number | bigint;
export type RawArgs = Record<string, any>;

// Additional types for Account and Signer
export type AllowArray<T> = T | T[];
export type Nonce = BigNumberish;
export type BlockIdentifier = string | number;
export type CairoVersion = '0' | '1';

// Signature types
export type Signature = string[] | { r: bigint; s: bigint; recovery?: number };
export type ArraySignatureType = string[];

// TypedData interface
export interface TypedData {
  types: Record<string, any[]>;
  primaryType: string;
  domain: Record<string, any>;
  message: Record<string, any>;
}

// InvocationsSignerDetails interface
export interface InvocationsSignerDetails {
  walletAddress: string;
  nonce: BigNumberish;
  maxFee: BigNumberish;
  version: string;
  chainId: string;
  cairoVersion?: CairoVersion;
  skipValidate?: boolean;
  resourceBounds?: any;
}

// Transaction version types
// ETransactionVersion for compatibility with existing code
export const ETransactionVersion = {
  V0: '0x0',
  V1: '0x1',
  V2: '0x2',
  V3: '0x3',
  F0: '0x100000000000000000000000000000000',
  F1: '0x100000000000000000000000000000001',
  F2: '0x100000000000000000000000000000002',
  F3: '0x100000000000000000000000000000003',
} as const;

export const ETransactionVersion2 = {
  V2: '0x2',
} as const;

export const ETransactionVersion3 = {
  V3: '0x3',
} as const;

export type ETransactionVersion = ValuesType<typeof ETransactionVersion>;
export type ETransactionVersion2 = ValuesType<typeof ETransactionVersion2>;
export type ETransactionVersion3 = ValuesType<typeof ETransactionVersion3>;

// Data availability mode
export type EDataAvailabilityMode = 'L1' | 'L2';

// Resource bounds
export interface ResourceBounds {
  l1_gas: ResourceBound;
  l2_gas: ResourceBound;
}

export interface ResourceBound {
  max_amount: BigNumberish;
  max_price_per_unit: BigNumberish;
}

// Uint256 type for signer operations (used by EthSigner)
export interface Uint256 {
  low: BigNumberish;
  high: BigNumberish;
}

// Legacy Uint256 type for compatibility
export interface Uint256Legacy {
  type: 'struct';
  members: any[];
}

// Cairo Uint256 type for ABI operations
export interface CairoUint256 {
  type: 'struct';
  members: any[];
}

// Uint512 type for signer operations
export interface Uint512 {
  low: BigNumberish;
  high: BigNumberish;
}

// Legacy Uint512 type for compatibility
export interface Uint512Legacy {
  type: 'struct';
  members: any[];
}

// Signer details types
export interface DeclareSignerDetails {
  walletAddress: string;
  nonce: BigNumberish;
  maxFee: BigNumberish;
  version: string;
  chainId: string;
  cairoVersion?: CairoVersion;
  skipValidate?: boolean;
  resourceBounds?: ResourceBounds;
  classHash: string;
  compiledClassHash?: string;
  senderAddress: string;
  nonceDataAvailabilityMode?: EDataAvailabilityMode;
  feeDataAvailabilityMode?: EDataAvailabilityMode;
  tip?: BigNumberish;
  paymasterData?: BigNumberish[];
  accountDeploymentData?: BigNumberish[];
}

export interface DeployAccountSignerDetails {
  walletAddress: string;
  nonce: BigNumberish;
  maxFee: BigNumberish;
  version: string;
  chainId: string;
  cairoVersion?: CairoVersion;
  skipValidate?: boolean;
  resourceBounds?: ResourceBounds;
  classHash: string;
  contractAddress: string;
  addressSalt: BigNumberish;
  constructorCalldata: BigNumberish[];
  nonceDataAvailabilityMode?: EDataAvailabilityMode;
  feeDataAvailabilityMode?: EDataAvailabilityMode;
  tip?: BigNumberish;
  paymasterData?: BigNumberish[];
  accountDeploymentData?: BigNumberish[];
}

// V2 and V3 specific types
export interface V2DeclareSignerDetails extends DeclareSignerDetails {
  version: ETransactionVersion2;
}

export interface V3DeclareSignerDetails extends DeclareSignerDetails {
  version: ETransactionVersion3;
  nonceDataAvailabilityMode: EDataAvailabilityMode;
  feeDataAvailabilityMode: EDataAvailabilityMode;
}

export interface V2DeployAccountSignerDetails extends DeployAccountSignerDetails {
  version: ETransactionVersion2;
}

export interface V3DeployAccountSignerDetails extends DeployAccountSignerDetails {
  version: ETransactionVersion3;
  nonceDataAvailabilityMode: EDataAvailabilityMode;
  feeDataAvailabilityMode: EDataAvailabilityMode;
}

export interface V2InvocationsSignerDetails extends InvocationsSignerDetails {
  version: ETransactionVersion2;
}

export interface V3InvocationsSignerDetails extends InvocationsSignerDetails {
  version: ETransactionVersion3;
  nonceDataAvailabilityMode: EDataAvailabilityMode;
  feeDataAvailabilityMode: EDataAvailabilityMode;
  resourceBounds: ResourceBounds;
  tip?: BigNumberish;
  paymasterData?: BigNumberish[];
  accountDeploymentData?: BigNumberish[];
}

// Cairo types
export type Abi = any[];
export type AbiEnums = Record<string, any>;
export type AbiStructs = Record<string, any>;
export type ContractVersion = { cairo: string; compiler?: string };
export const ETH_ADDRESS = 'core::starknet::eth_address::EthAddress';
export const NON_ZERO_PREFIX = 'core::zeroable::NonZero::<';

export enum Literal {
  ContractAddress = 'core::starknet::contract_address::ContractAddress',
  Secp256k1Point = 'core::starknet::secp256k1::Secp256k1Point'
}

export enum Uint {
  u8 = 'core::integer::u8',
  u16 = 'core::integer::u16',
  u32 = 'core::integer::u32',
  u64 = 'core::integer::u64',
  u128 = 'core::integer::u128',
  u256 = 'core::integer::u256'
}

// Legacy Uint256 type for Cairo ABI operations
export interface Uint256Legacy {
  type: 'struct';
  members: any[];
}

// Legacy Uint512 type for Cairo ABI operations
export interface Uint512Legacy {
  type: 'struct';
  members: any[];
}

// Additional types for stark utils
export type CompressedProgram = string;
export type Program = any;
export interface UniversalDetails {
  tip?: BigNumberish;
  paymasterData?: BigNumberish[];
  accountDeploymentData?: BigNumberish[];
  nonceDataAvailabilityMode?: EDataAvailabilityMode;
  feeDataAvailabilityMode?: EDataAvailabilityMode;
  resourceBounds?: ResourceBounds;
}

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

// Response types for provider operations
export interface GetBlockResponse {
  status: 'PENDING' | 'ACCEPTED_ON_L2' | 'ACCEPTED_ON_L1' | 'REJECTED';
  block_hash?: string;
  parent_hash: string;
  block_number?: number;
  new_root: string;
  timestamp: number;
  sequencer_address: string;
  transactions: any[];
  version?: string;
}

export interface PendingBlock {
  status: 'PENDING';
  parent_hash: string;
  new_root: string;
  timestamp: number;
  sequencer_address: string;
  transactions: any[];
  version?: string;
}

export interface GetTransactionReceiptResponse {
  transaction_hash: string;
  actual_fee?: string;
  finality_status?: string;
  execution_status?: string;
  block_hash?: string;
  block_number?: number;
  type?: string;
  messages_sent?: any[];
  events?: any[];
  contract_address?: string;
  revert_reason?: string;
}

export interface StateUpdateResponse {
  block_hash?: string;
  new_root: string;
  old_root: string;
  state_diff: any;
}

export interface PendingStateUpdate {
  new_root: string;
  old_root: string;
  state_diff: any;
}

export interface V3TransactionDetails {
  nonce: BigNumberish;
  version: ETransactionVersion3;
  maxFee: BigNumberish;
  feeDataAvailabilityMode: EDataAvailabilityMode;
  nonceDataAvailabilityMode: EDataAvailabilityMode;
  resourceBounds: ResourceBounds;
  tip?: BigNumberish;
  paymasterData?: BigNumberish[];
  accountDeploymentData?: BigNumberish[];
}

export interface InvocationsDetailsWithNonce {
  nonce: BigNumberish;
  maxFee?: string;
  version?: string;
  cairoVersion?: string;
} 
