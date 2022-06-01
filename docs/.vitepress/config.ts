import baseConfig from '@mussi/vitepress-theme/config'

import { defineConfigWithTheme, HeadConfig, UserConfig } from 'vitepress'
import type { Config } from '@mussi/vitepress-theme'

const isProd = process.env.NODE_ENV === 'production'

const title = 'JS From Routes'
const description = 'Generate path helpers and API methods from your Rails routes'
const site = isProd ? 'https://js-from-routes.netlify.app' : 'http://localhost:3000'
const image = `${site}/banner.png`

const head = [
  ['meta', { name: 'author', content: 'Máximo Mussini' }],
  ['meta', { name: 'keywords', content: 'rails, ruby, routes, codegen, js, typescript, vitejs' }],

  ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],

  ['meta', { name: 'HandheldFriendly', content: 'True' }],
  ['meta', { name: 'MobileOptimized', content: '320' }],
  ['meta', { name: 'theme-color', content: '#cc0000' }],

  ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ['meta', { name: 'twitter:site', content: site }],
  ['meta', { name: 'twitter:title', value: title }],
  ['meta', { name: 'twitter:description', value: description }],
  ['meta', { name: 'twitter:image', content: image }],

  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:locale', content: 'en_US' }],
  ['meta', { property: 'og:site', content: site }],
  ['meta', { property: 'og:site_name', content: title }],
  ['meta', { property: 'og:title', content: title }],
  ['meta', { property: 'og:image', content: image }],
  ['meta', { property: 'og:description', content: description }],
]

if (isProd)
  head.push(['script', { src: 'https://unpkg.com/thesemetrics@latest', async: '' }])

export default defineConfigWithTheme({
  extends: baseConfig as () => UserConfig<Config>,
  title,
  description,
  head,
  themeConfig: {
    algolia: {
      appId: 'GERZE019PN',
      apiKey: 'cdb4a3df8ecf73fadf6bde873fc1b0d2',
      indexName: 'js_from_routes',
    },

    logo: '/logo.svg',

    author: {
      name: 'Maximo Mussini',
      link: 'https://maximomussini.com',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ElMassimo/js_from_routes' },
      { icon: 'twitter', link: 'https://twitter.com/MaximoMussini' },
      { icon: 'discord', link: 'https://discord.gg/9sSq53jxb4' },
    ],

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT',
      },
      copyright: 'Copyright © 2021-2022',
    },

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Config', link: '/config/' },
      {
        text: 'Changelog',
        link: 'https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/CHANGELOG.md',
      },
    ],

    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Code Generation', link: '/guide/codegen' },
          ],
        },
        {
          text: 'Client',
          items: [
            { text: 'Integrations', link: '/client/' },
          ],
        },
        {
          text: 'FAQs',
          items: [
            { text: 'Troubleshooting', link: '/faqs/' },
          ],
        },
        {
          text: 'Config',
          link: '/config/',
          items: [
            { text: 'Code Generation', link: '/config/' },
          ],
        },
      ],
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['@mussi/vitepress-theme'],
    },
  },
})
