import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';

// Visual design borrowed from the Vela app (../app/globals.css):
//   Indigo #5b5bd6 / hover #4a4ac4 / glow #a5a5f5 / ink #0a0a0f / slate #1a1a24
//   Geist Sans + Geist Mono · tight tracking · 8px radius
// Served under the Next app at http://localhost:3000/docs via a next.config rewrite.
// The interactive API reference is a Swagger UI page (src/pages/api.tsx) reading
// the OpenAPI spec — Authorize with X-API-Key, edit JSON, Try it out.
const config: Config = {
  title: 'ImagePipeline',
  tagline: 'Identity generation API for developers and product teams',
  favicon: 'img/favicon.svg',

  url: 'http://localhost:3000',
  baseUrl: '/docs/',

  organizationName: 'imagepipeline',
  projectName: 'imagepipeline-docs',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    // Geist (docs body) + Plus Jakarta Sans / Fraunces / JetBrains Mono so the docs
    // header can match the marketing site's typography exactly.
    'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // docs live at baseUrl root (= /docs/)
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // swagger-ui-react pulls in the `xml` package, which references Node's `stream`.
    // Provide a browser polyfill (and stub the other Node-only modules) for webpack 5.
    function swaggerWebpackFallbacks() {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const webpack = require('webpack');
      return {
        name: 'swagger-webpack-fallbacks',
        configureWebpack() {
          return {
            resolve: {
              fallback: {
                stream: require.resolve('stream-browserify'),
                buffer: require.resolve('buffer/'),
                process: require.resolve('process/browser'),
                http: false,
                https: false,
                zlib: false,
                crypto: false,
                fs: false,
                net: false,
                tls: false,
                child_process: false,
              },
            },
            plugins: [
              // swagger-ui-react's deep-extend dep expects Node's Buffer/process globals.
              new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser',
              }),
            ],
          };
        },
      };
    },
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: false, // force light as default
    },
    // The navbar is fully replaced by the swizzled marketing header at
    // src/theme/Navbar — no default Docusaurus navbar items are used.
    footer: {
      style: 'light',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Introduction', to: '/intro' },
            { label: 'Quickstart', to: '/quickstart' },
            { label: 'API Reference', to: '/api' },
          ],
        },
        {
          title: 'Concepts',
          items: [
            { label: 'Jobs & Webhooks', to: '/concepts/jobs' },
            { label: 'Identity Profiles', to: '/concepts/profiles' },
            { label: 'Composable Workflows', to: '/concepts/workflows' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'Errors', to: '/reference/errors' },
            { label: 'Compliance', to: '/reference/compliance' },
            { label: 'Dashboard', href: 'https://imagepipeline.io/dashboard' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} ImagePipeline · Generate, preserve, swap, and animate real people.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
