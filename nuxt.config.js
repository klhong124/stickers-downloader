import colors from 'vuetify/es5/util/colors'
const webpack = require('webpack')
require('dotenv').config()

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - sticker-downloader',
    title: 'sticker-downloader',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'sticker-downloader from Sticker Cloud, help to download stickers and upload onto signal! }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
      '~/plugins/axios',
      { src: '~plugins/ga.js', mode: 'client' }

    ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  env: {
    TrackingID: process.env.TrackingID
  },

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    '@nuxtjs/google-adsense',

  ],
  'google-adsense': {
      id: 'ca-pub-7892889845905168'
    },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
    credentials: true,
  },

  proxy: {
    '/sc': {
      target: 'https://internal-api.stickers.cloud/v1/pack/',
      pathRewrite: {
        '^/sc': '',
      },
      headers:{
          origin: 'https://stickers.cloud',
      }
    },
    '/img': {
      target: 'https://img.stickers.cloud/packs/',
      pathRewrite: {
        '^/img': '',
      },
    },
    '/s1': {
      target: 'https://s1.stickers.cloud/packs/',
      pathRewrite: {
        '^/s1': '',
      },
    }
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  }
}
