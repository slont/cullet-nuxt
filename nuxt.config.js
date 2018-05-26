const nodeExternals = require('webpack-node-externals')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'cullet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css', integrity: 'sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp', crossorigin: 'anonymous' }
    ]
  },
  css: [
    // { src: 'bulma/bulma.sass', lang: 'sass' },
    // { src: 'bulma-checkradio/dist/bulma-checkradio.sass', lang: 'sass' },
    // { src: 'bulma-switch/dist/bulma-switch.sass', lang: 'sass' },
    { src: '~/assets/styles/global.scss', lang: 'scss' },
    'element-ui/lib/theme-chalk/index.css'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/moment',
    '@nuxtjs/pwa',
    ['nuxt-sass-resources-loader', '@/assets/styles/common.scss']
  ],
  plugins: [
    '@/plugins/main',
    '@/plugins/vue-i18n',
    '@/plugins/axios',
    {src: '@/plugins/vee-validate', ssr: true},
    {src: '@/plugins/social', ssr: true},
    {src: '@/plugins/persistedstate', ssr: true},
    '@/plugins/element-ui'
  ],
  inject: ['$validator'],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    postcss: { plugins: { 'postcss-custom-properties': false } },
    vendor: [
      'blueimp-canvas-to-blob',
      'vue-i18n',
      'vee-validate',
      'axios',
      'element-ui'
    ],
    extend (config, { isServer, isDev, isClient }) {
      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vue-tweet-embed/]
          })
        ]
      }
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  axios: {
    credentials: true,
    debug: true,
    retry: {
      retries: 3
    }
  },
  manifest: {
    name: "Cullet",
    lang: 'ja'
  },
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT || 'https://api.cullet.me/v1'
  }
}
