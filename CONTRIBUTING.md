# Contributing to Starknet React Native SDK

Thank you for your interest in contributing to the Starknet React Native SDK! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- React Native development environment (for testing)
- iOS Simulator and/or Android Emulator

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/starknet-react-native-sdk.git
   cd starknet-react-native-sdk
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Run Tests**
   ```bash
   yarn test
   ```

4. **Build the SDK**
   ```bash
   yarn build
   ```

## Project Structure

```
starknet-react-native-sdk/
├── src/                    # Source code
│   ├── types/             # TypeScript type definitions
│   ├── core/              # Core Starknet functionality
│   ├── wallets/           # Wallet connectors
│   ├── utils/             # Utility functions
│   ├── hooks/             # React hooks
│   ├── ui/                # UI components
│   └── components/        # Reusable components
├── example/               # Example React Native app
├── docs/                  # Documentation
└── __tests__/            # Test files
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style (enforced by ESLint and Prettier)
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for public APIs

### Testing

- Write tests for all new features
- Maintain test coverage above 80%
- Use Jest for unit tests
- Test on both iOS and Android simulators

### Git Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write code following our guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `test:` for test changes
   - `refactor:` for code refactoring
   - `chore:` for maintenance tasks

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## What to Contribute

### High Priority Areas

1. **Phase 1 (Current): Core Wallet Connectivity**
   - Improve WalletConnect v2 integration
   - Add support for more wallet providers
   - Enhance error handling and user feedback

2. **Phase 2: Embedded Wallet Features**
   - Biometric authentication implementation
   - Secure key storage for iOS/Android
   - Wallet UI components

3. **Phase 3: Advanced Features**
   - Paymaster integrations (AVNU, Cartridge)
   - Account abstraction features
   - Session key support

### Documentation

- API documentation improvements
- Usage examples and tutorials
- Integration guides for different use cases
- FAQ and troubleshooting guides

### Testing

- Unit test coverage improvements
- Integration tests with real Starknet networks
- Performance testing and optimization
- Security testing and audits

## Code Review Process

1. **Submit Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure CI tests pass

2. **Review Process**
   - Maintainers will review within 48 hours
   - Address feedback and requested changes
   - Update PR with fixes

3. **Merge Requirements**
   - All tests must pass
   - Code coverage maintained
   - At least one maintainer approval
   - No merge conflicts

## Development Commands

```bash
# Install dependencies
yarn install

# Run tests
yarn test
yarn test:watch
yarn test:coverage

# Type checking
yarn typecheck

# Linting and formatting
yarn lint
yarn lint:fix
yarn format

# Build SDK
yarn build
yarn clean

# Example app
yarn example ios
yarn example android
```

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

- SDK version
- React Native version
- Platform (iOS/Android) and version
- Steps to reproduce
- Expected vs actual behavior
- Console logs and error messages
- Minimal code example

### Feature Requests

For feature requests, please provide:

- Clear description of the feature
- Use case and motivation
- Proposed API design (if applicable)
- Impact on existing functionality

## Architecture Guidelines

### Modularity

- Keep modules loosely coupled
- Use dependency injection where appropriate
- Implement clear interfaces for external services

### Error Handling

- Use typed errors with specific error codes
- Provide meaningful error messages
- Handle edge cases gracefully

### Performance

- Optimize for mobile performance
- Use lazy loading where appropriate
- Minimize bundle size impact

### Security

- Never expose private keys in JavaScript
- Use secure storage for sensitive data
- Validate all external inputs
- Follow security best practices

## Release Process

1. **Version Bump**
   - Follow semantic versioning (SEMVER)
   - Update CHANGELOG.md
   - Tag release in git

2. **Testing**
   - Run full test suite
   - Test on example app
   - Verify on real devices

3. **Documentation**
   - Update API documentation
   - Update README if needed
   - Add migration guide for breaking changes

4. **Publish**
   - Publish to NPM
   - Create GitHub release
   - Announce in community channels

## Community

- Join our [Discord](https://discord.gg/starknet) for discussions
- Follow [@StarknetEco](https://twitter.com/StarknetEco) for updates
- Participate in [Starknet forums](https://community.starknet.io/)

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

**Questions?** Feel free to reach out to the maintainers or open a discussion issue! 