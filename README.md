# Starknet React Native SDK

A comprehensive React Native SDK for Starknet that enables developers to build consumer-grade mobile dApps with account abstraction, biometric authentication, and seamless wallet integration.

## Features

✅ **Multi-Platform Support** - Works on both iOS and Android via React Native  
✅ **External Wallet Integration** - Support for Argent X, Braavos, and more via WalletConnect v2  
🚧 **Embeddable In-App Wallet** - Built-in wallet with biometric security (Phase 2)  
🚧 **Account Abstraction** - Leverages Starknet's native account abstraction features  
🚧 **Paymaster Support** - Gasless transactions via AVNU and Cartridge paymasters  
🚧 **Biometric Authentication** - FaceID/TouchID integration for transaction signing  
✅ **TypeScript First** - Fully typed with comprehensive TypeScript support  
✅ **Developer Friendly** - React hooks and intuitive APIs  

## Installation

### Prerequisites

- **Node.js**: Version 18.x - 22.x (Required for Docusaurus compatibility)
  - ⚠️ **Note**: Node.js v23+ is not currently supported due to Docusaurus compatibility issues
  - Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions: `nvm use` (reads from `.nvmrc`)
- **Yarn**: v3.6.1+ (automatically managed via Corepack)

### Install the SDK

```bash
npm install @starknet/react-native-sdk
# or
yarn add @starknet/react-native-sdk
```

### Dependencies

```bash
npm install starknet @walletconnect/react-native-v2 react-native-keychain react-native-biometrics
```

## Quick Start

### 1. Basic Setup

```typescript
import {
  createProvider,
  getDefaultConnectors,
  StarknetNetwork
} from '@starknet/react-native-sdk'

// Create a provider
const provider = createProvider({
  networkId: StarknetNetwork.TESTNET,
  chainId: '0x534e5f5345504f4c4941'
})

// Get available wallet connectors
const connectors = getDefaultConnectors()
```

### 2. Connect to External Wallets

```typescript
import {ArgentXConnector, BraavosConnector} from '@starknet/react-native-sdk'

const argentConnector = new ArgentXConnector()
const braavosConnector = new BraavosConnector()

// Connect to Argent X
if (argentConnector.available) {
  const wallet = await argentConnector.connect()
  console.log('Connected accounts:', wallet.accounts)
}
```

### 3. Error Handling

```typescript
import {SdkError, isStarknetSdkError} from '@starknet/react-native-sdk'

try {
  await connector.connect()
} catch (error) {
  if (isStarknetSdkError(error)) {
    console.log('SDK Error:', error.code, error.message)
  }
}
```

### 4. Address Validation and Formatting

```typescript
import {
  isValidStarknetAddress,
  normalizeAddress,
  formatAddress
} from '@starknet/react-native-sdk'

const address = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'

if (isValidStarknetAddress(address)) {
  const normalized = normalizeAddress(address)
  const formatted = formatAddress(address) // 0x049d36...e004dc7
}
```

## Architecture

The SDK is organized into modular components:

```
src/
├── types/           # TypeScript type definitions
├── core/           # Core Starknet provider and network logic
├── wallets/        # Wallet connectors (external and embedded)
├── utils/          # Utilities (errors, storage, validation)
├── hooks/          # React hooks and context providers
├── ui/             # UI components for embedded wallet
└── components/     # Reusable React components
```

## Network Configuration

```typescript
import {StarknetNetwork, getDefaultConfig} from '@starknet/react-native-sdk'

// Use default network configuration
const config = getDefaultConfig(StarknetNetwork.MAINNET)

// Or create custom configuration
const customConfig = {
  networkId: StarknetNetwork.TESTNET,
  rpcUrl: 'https://custom-rpc-endpoint.com',
  chainId: '0x534e5f5345504f4c4941',
  explorerUrl: 'https://custom-explorer.com'
}
```

## Supported Wallets

### External Wallets
- **Argent X** - Mobile wallet with WalletConnect v2 support
- **Braavos** - Mobile wallet with WalletConnect v2 support

### In-App Wallet (Coming in Phase 2)
- Biometric authentication (FaceID/TouchID)
- Secure key storage (iOS Keychain / Android Keystore)
- Account abstraction features
- Session key support

## Development Status

🟢 **CI Pipeline**: All workflows passing  
🟢 **Build & Test**: Working correctly  
🟢 **Documentation**: ✅ Deployed via CI (⚠️ Local build requires Node 18-22)  
🟡 **Release**: Temporarily disabled due to dependency conflicts  

### Known Issues & Solutions

#### 📖 Documentation Build (Local Development)
- **Issue**: Docusaurus 3.x doesn't support Node.js v23+ 
- **Error**: `chalk_1.default.yellow is not a function`
- **Solution**: Use Node.js 18-22 for local development
  ```bash
  # Install and use Node 20 (recommended)
  nvm install 20
  nvm use 20
  
  # Then build documentation
  cd docs && yarn build
  ```
- **CI Status**: ✅ Working (uses Node.js 20.x automatically)

#### 🔧 Other Known Issues
- **Release Tools**: CLI dependency conflicts with Yarn PnP resolution
- **Security**: GitHub reports 5 vulnerabilities (production dependencies are clean)

---

## Testing

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Type checking
yarn typecheck

# Linting
yarn lint
```

## Security

The SDK includes comprehensive security auditing using Yarn v3's audit commands:

```bash
# Check production dependencies across all workspaces for vulnerabilities
yarn audit:prod

# Check all dependencies (including dev dependencies) across all workspaces  
yarn audit:all

# Comprehensive audit with moderate+ severity threshold
yarn audit:comprehensive

# Get detailed JSON output for programmatic use
yarn audit:json

# Run comprehensive security check (production + all dependencies)
yarn security:check
```

### CI Security Checks

The CI pipeline includes multiple security layers:
- **Security Audit**: Yarn v3 vulnerability scanning across all workspaces for production, dev, and transitive dependencies
- **CodeQL Analysis**: Static code analysis for security vulnerabilities  
- **Dependency Review**: GitHub's dependency scanning for pull requests
- **License Compliance**: Automated license verification
- **Secrets Scanning**: Trivy vulnerability scanner for exposed secrets

Critical vulnerabilities in production dependencies will fail the CI build.

### Workspace Coverage
The audit commands use `--all` flag to scan dependencies across all workspaces:
- Main SDK package (`@starknet/react-native-sdk`)
- Documentation site (`docs/`)  
- Example application (`example/`)

This ensures comprehensive coverage of the entire project's dependency tree.

## API Reference

### Core Types

```typescript
interface StarknetConfig {
  networkId: StarknetNetwork
  rpcUrl?: string
  chainId: string
  explorerUrl?: string
}

interface WalletConnector {
  id: string
  name: string
  available: boolean
  connect(): Promise<ConnectedWallet>
  disconnect(): Promise<void>
  signMessage(message: string, account: string): Promise<string>
  signTransaction(calls: Call[], details?: InvocationsDetails): Promise<string[]>
}
```

### Error Codes

```typescript
enum ErrorCode {
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  CONNECTION_REJECTED = 'CONNECTION_REJECTED',
  BIOMETRIC_NOT_AVAILABLE = 'BIOMETRIC_NOT_AVAILABLE',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  // ... more error codes
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

#### Node.js Version Management

This project requires Node.js 18.x - 22.x for optimal compatibility:

```bash
# Install Node Version Manager (nvm) if you haven't already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use the project's specified Node version
nvm use  # reads from .nvmrc

# Or install and use Node 20 specifically
nvm install 20
nvm use 20
```

#### Local Development

1. Clone the repository
2. Ensure you're using Node.js 18-22: `nvm use`
3. Install dependencies: `yarn install`
4. Build the SDK: `yarn build`
5. Run tests: `yarn test`

#### Documentation Development

```bash
# Start development server (requires Node.js 18-22)
yarn docs:dev

# Build documentation site
yarn docs:build

# Generate API documentation
yarn docs:generate
```

#### Running the Example App

```bash
# iOS
yarn dev:ios

# Android  
yarn dev:android
```

## Roadmap

See our [Product Requirements Document](PRD.md) for detailed feature roadmap and implementation plans.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://docs.starknet.io/react-native-sdk)
- 💬 [Discord Community](https://discord.gg/starknet)
- 🐛 [Issue Tracker](https://github.com/keep-starknet-strange/starknet-react-native-sdk/issues)
- 📧 [Email Support](mailto:support@starknet.io)
