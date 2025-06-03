---
sidebar_position: 1
title: Installation
---

# Installation

Get started with the Starknet React Native SDK by installing it in your React Native project.

## Prerequisites

Before installing the SDK, ensure you have the following:

- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **React Native 0.70+** - [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup)
- **iOS 13+ / Android API 21+** - For device compatibility
- **Xcode 14+ / Android Studio** - For building native apps

## Package Installation

### Using npm

```bash
npm install @starknet/react-native-sdk
```

### Using Yarn

```bash
yarn add @starknet/react-native-sdk
```

### Using pnpm

```bash
pnpm add @starknet/react-native-sdk
```

## Peer Dependencies

The SDK requires the following peer dependencies:

```bash
npm install react react-native
```

## Platform-Specific Setup

### iOS Setup

1. **Install iOS Dependencies**

   ```bash
   cd ios && pod install
   ```

2. **Update Info.plist** (for biometric authentication - Phase 2)

   Add the following to your `ios/YourApp/Info.plist`:

   ```xml
   <key>NSFaceIDUsageDescription</key>
   <string>This app uses Face ID for secure wallet authentication</string>
   ```

3. **Enable Keychain Sharing** (for secure storage - Phase 2)

   In Xcode, go to your app target → Signing & Capabilities → Add Capability → Keychain Sharing

### Android Setup

1. **Update Minimum SDK Version**

   In `android/app/build.gradle`:

   ```gradle
   android {
       compileSdkVersion 34
       
       defaultConfig {
           minSdkVersion 21  // Required for biometric APIs
           targetSdkVersion 34
       }
   }
   ```

2. **Add Biometric Permission** (for biometric authentication - Phase 2)

   In `android/app/src/main/AndroidManifest.xml`:

   ```xml
   <uses-permission android:name="android.permission.USE_BIOMETRIC" />
   <uses-permission android:name="android.permission.USE_FINGERPRINT" />
   ```

## Metro Configuration

If you encounter bundling issues, update your `metro.config.js`:

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

## Expo Configuration

If you're using Expo, you'll need to use the bare workflow or create a development build:

### Using EAS Build

1. **Install Expo CLI**

   ```bash
   npm install -g @expo/cli
   ```

2. **Create Development Build**

   ```bash
   eas build --profile development --platform all
   ```

3. **Configure app.json**

   ```json
   {
     "expo": {
       "plugins": [
         [
           "expo-local-authentication",
           {
             "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID for secure authentication"
           }
         ]
       ]
     }
   }
   ```

## Polyfills

The SDK requires certain polyfills for React Native. Add this to your app entry point (`App.tsx` or `index.js`):

```typescript
import 'react-native-get-random-values';
```

## Verification

Verify your installation by importing the SDK:

```typescript
import {
  VERSION,
  StarknetNetwork,
  createProvider
} from '@starknet/react-native-sdk';

console.log('Starknet React Native SDK version:', VERSION);
```

## Troubleshooting

### Common Issues

**Metro bundler fails with crypto errors**

Add to your `metro.config.js`:

```javascript
const crypto = require.resolve('crypto-browserify');
const url = require.resolve('url/');

module.exports = {
  resolver: {
    alias: {
      crypto: crypto,
      url: url,
    },
  },
};
```

**iOS build fails with CocoaPods**

```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
```

**Android build fails with missing dependencies**

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

**TypeScript errors**

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

### Getting Help

- 📖 [Troubleshooting Guide](../guides/troubleshooting)
- 💬 [Discord Community](https://discord.gg/starknet)
- 🐛 [GitHub Issues](https://github.com/keep-starknet-strange/starknet-react-native-sdk/issues)

## Next Steps

Now that you have the SDK installed, you're ready to start building:

- 🚀 [Quick Start Guide](./quick-start) - Your first Starknet mobile app
- ⚙️ [Configuration](./configuration) - Configure the SDK for your needs
- 💼 [Wallet Integration](../wallets/overview) - Connect external wallets

---

**Installation complete!** 🎉 Ready to build amazing mobile dApps on Starknet. 