import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/configuration',
        'getting-started/first-app',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'core-concepts/providers',
        'core-concepts/accounts',
        'core-concepts/transactions',
        'core-concepts/errors',
      ],
    },
    {
      type: 'category',
      label: 'Wallet Integration',
      items: [
        'wallets/overview',
        'wallets/external-wallets',
        'wallets/argentx',
        'wallets/braavos',
        'wallets/embedded-wallet',
        'wallets/custom-connectors',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Features',
      items: [
        'advanced/account-abstraction',
        'advanced/paymasters',
        'advanced/session-keys',
        'advanced/biometric-auth',
        'advanced/security',
      ],
    },
    {
      type: 'category',
      label: 'React Native Integration',
      items: [
        'react-native/hooks',
        'react-native/context',
        'react-native/components',
        'react-native/state-management',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/basic-wallet',
        'examples/token-transfer',
        'examples/contract-interaction',
        'examples/gasless-transactions',
        'examples/biometric-wallet',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/overview',
        'api-reference/types',
        'api-reference/providers',
        'api-reference/wallets',
        'api-reference/utils',
        'api-reference/errors',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/testing',
        'guides/debugging',
        'guides/performance',
        'guides/deployment',
        'guides/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Contributing',
      items: [
        'contributing/overview',
        'contributing/development',
        'contributing/testing',
        'contributing/documentation',
      ],
    },
  ],
}

export default sidebars 