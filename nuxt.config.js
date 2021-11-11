import colors from 'vuetify/es5/util/colors'
const webpack = require('webpack')
require('dotenv').config()

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  loadingIndicator: {
    name: 'fading-circle',
    color: 'white',
    background: '#121212',
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - sticker-downloader',
    title: 'sticker-downloader',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'sticker-downloader from Sticker Cloud, help to download stickers and upload onto signal!' }
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
    ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/google-analytics',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',

  ],

  googleAnalytics: {
    id: process.env.TrackingID,
    checkDuplicatedScript: true,
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
    credentials: true,
  },

  proxy: {
    '/sc': {
      target: 'https://internal-api.stickers.cloud/v1/with-packs/',
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
    },
    '/s2': {
      target: 'https://s2.stickers.cloud/packs/',
      pathRewrite: {
        '^/s2': '',
      },
    },
    '/s3': {
      target: 'https://s3.stickers.cloud/packs/',
      pathRewrite: {
        '^/s3': '',
      },
    },
    '/s4': {
      target: 'https://s4.stickers.cloud/packs/',
      pathRewrite: {
        '^/s4': '',
      },
    },
    '/s5': {
      target: 'https://s5.stickers.cloud/packs/',
      pathRewrite: {
        '^/s5': '',
      },
    },
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
