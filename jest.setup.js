import 'react-native-get-random-values'

global.__DEV__ = true

jest.mock('react-native', () => ({
  NativeModules: {},
  NativeEventEmitter: jest.fn(),
  Platform: {
    OS: 'ios',
    select: jest.fn()
  }
}))

jest.mock('react-native-keychain', () => ({
  getInternetCredentials: jest.fn(),
  setInternetCredentials: jest.fn(),
  resetInternetCredentials: jest.fn()
}))

jest.mock('react-native-biometrics', () => ({
  isSensorAvailable: jest.fn().mockResolvedValue({ available: true }),
  createKeys: jest.fn(),
  createSignature: jest.fn()
}))

console.warn = jest.fn()
console.error = jest.fn() 