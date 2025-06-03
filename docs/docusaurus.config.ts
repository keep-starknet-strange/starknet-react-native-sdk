import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'Starknet React Native SDK',
  tagline: 'Build consumer-grade mobile dApps on Starknet with React Native',
  favicon: 'img/favicon.ico',

  url: 'https://keep-starknet-strange.github.io',
  baseUrl: '/starknet-react-native-sdk/',

  organizationName: 'keep-starknet-strange',
  projectName: 'starknet-react-native-sdk',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/keep-starknet-strange/starknet-react-native-sdk/tree/main/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/keep-starknet-strange/starknet-react-native-sdk/tree/main/docs/',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-XXXXXXXXXX', // Replace with actual tracking ID
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/starknet-sdk-social-card.jpg',
    navbar: {
      title: 'Starknet RN SDK',
      logo: {
        alt: 'Starknet Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/api-reference',
          label: 'API Reference',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left'
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          href: 'https://github.com/keep-starknet-strange/starknet-react-native-sdk',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://discord.gg/starknet',
          label: 'Discord',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference',
            },
            {
              label: 'Examples',
              to: '/docs/examples',
            },
            {
              label: 'Troubleshooting',
              to: '/docs/troubleshooting',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/starknet',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/StarkNetEco',
            },
            {
              label: 'Forum',
              href: 'https://community.starknet.io',
            },
          ],
        },
        {
          title: 'Development',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/keep-starknet-strange/starknet-react-native-sdk',
            },
            {
              label: 'Contributing',
              href: 'https://github.com/keep-starknet-strange/starknet-react-native-sdk/blob/main/CONTRIBUTING.md',
            },
            {
              label: 'Issues',
              href: 'https://github.com/keep-starknet-strange/starknet-react-native-sdk/issues',
            },
            {
              label: 'NPM Package',
              href: 'https://www.npmjs.com/package/@starknet/react-native-sdk',
            },
          ],
        },
        {
          title: 'Starknet Ecosystem',
          items: [
            {
              label: 'Starknet.io',
              href: 'https://starknet.io',
            },
            {
              label: 'StarkWare',
              href: 'https://starkware.co',
            },
            {
              label: 'Starknet Book',
              href: 'https://book.starknet.io',
            },
            {
              label: 'Starknet JS',
              href: 'https://www.starknetjs.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Keep Starknet Strange. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'javascript', 'typescript', 'jsx', 'tsx'],
    },
    algolia: {
      appId: 'YOUR_APP_ID', // Replace with actual Algolia app ID
      apiKey: 'YOUR_SEARCH_API_KEY', // Replace with actual Algolia search key
      indexName: 'starknet-react-native-sdk',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'support_us',
      content: '⭐️ If you like Starknet React Native SDK, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/keep-starknet-strange/starknet-react-native-sdk">GitHub</a>! ⭐️',
      backgroundColor: '#fafbfc',
      textColor: '#091E42',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    '@docusaurus/theme-live-codeblock',
    '@docusaurus/theme-mermaid',
  ],

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],
}

export default config 