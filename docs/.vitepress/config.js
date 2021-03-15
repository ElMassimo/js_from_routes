// @ts-check

const isProd = process.env.NODE_ENV === 'production'

const title = 'JS From Routes'
const description = 'Generate path helpers and API methods from your Rails routes'
const site = isProd ? 'https://js-from-routes.netlify.app' : 'http://localhost:3000'
const image = `${site}/banner.png`

const head = [
  ['style', {}, 'img { border-radius: 10px }' + 'h1.title { margin-left: 0.5em }'],
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

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: 'JS From Routes',
  description,
  head,
  themeConfig: {
    algolia: {
      appId: 'GERZE019PN',
      apiKey: 'cdb4a3df8ecf73fadf6bde873fc1b0d2',
      indexName: 'js_from_routes',
    },
    repo: 'ElMassimo/js_from_routes',
    logo: '/logo.svg',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Suggest changes to this page',

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Config', link: '/config/' },
      {
        text: 'Changelog',
        link: 'https://github.com/ElMassimo/js_from_routes/blob/main/js_from_routes/CHANGELOG.md',
      },
    ],

    sidebar: {
      '/config/': 'auto',
      // catch-all fallback
      '/': [
        {
          text: 'Guide',
          children: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Development', link: '/guide/development' },
          ],
        },
        {
          text: 'Client Libraries',
          children: [
            { text: 'Introduction', link: '/client/' },
            { text: 'Fetch', link: '/client/fetch' },
            { text: 'Axios', link: '/client/axios' },
            { text: 'Redaxios', link: '/client/redaxios' },
            { text: 'Inertia.js', link: '/client/inertia' },
          ],
        },
        {
          text: 'FAQs',
          children: [
            { text: 'Configuration', link: '/faqs/' },
            { text: 'Troubleshooting', link: '/faqs/troubleshooting' },
            { text: 'Motivation', link: '/faqs/motivation' },
          ],
        },
        {
          text: 'Config',
          link: '/config/',
        },
      ],
    },
  },
}
