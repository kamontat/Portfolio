const path = require('path')
const serveStatic = require('serve-static')

const pkg = require('./package')

const name = 'KcNt Portfolio'
const env = process.env.NODE_ENV
const branch = process.env.BRANCH

const onesignal_dev = process.env.ONESIGNAL_DEV_APPID
const onesignal_prod = process.env.ONESIGNAL_APPID

const isProd = env === 'production'
const isDev = env === 'development'

const baseUrl = isProd ? 'https://kcnt.info' : 'http://localhost:3000'

const generateIconPath = () => {
  const size = ['dot5x', '1x', '300ppi']
  const type = ['round-icon', 'icon']
  const color = ['dark', 'light', 'primary']
  const extension = ['png']

  const result = []

  color.forEach(c => {
    size.forEach(s => {
      type.forEach(t => {
        const afterIconPath = s === 'dot5x' ? '0.5x' : s
        const sizePath = s === '1x' ? '' : `-${s}`
        const postfix = s === '300ppi' ? '-high' : s === 'dot5x' ? '@0.5x' : ''

        result.push({
          from: `/logo/png/${c}${t
            .replace(/[-]?icon/g, '')
            .replace('round', '-round')}${sizePath}`,
          to: `/resources/images/icon/${afterIconPath}/${c}-${t}${postfix}.png`
        })
      })
    })
  })

  color.forEach(c => {
    type.forEach(t => {
      result.push({
        from: `/logo/svg/${c}${t
          .replace(/[-]?icon/g, '')
          .replace('round', '-round')}`,
        to: `/resources/images/icon/svg/${c}-${t}.svg`
      })
    })
  })

  console.log(result.map(v => v.from)) // path all icon redirect path

  return result
}

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: name,
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'Portfolio,VueJS,JS,CSS,Website,Nuxt,Personal'
      },
      {
        hid: 'author',
        name: 'author',
        content: pkg.author
      },
      {
        hid: 'version',
        name: 'version',
        content: pkg.version
      }
    ]
    // script: [
    //   {
    //     innerHTML:
    //       'var _sz=_sz||{};_sz.appId="951278c3",function(){var e=document.createElement("script");e.src="https://cdn.signalzen.com/signalzen.js",e.setAttribute("async","true"),document.documentElement.firstChild.appendChild(e);var t=setInterval(function(){"undefined"!=typeof SignalZen&&(clearInterval(t),new SignalZen(_sz).load())},10)}();',
    //     type: 'text/javascript'
    //   }
    // ],
    // __dangerouslyDisableSanitizers: ['script']
  },

  /*
   ** Include css not in components
   */
  css: [
    {
      src: '@fortawesome/fontawesome-free/css/all.css'
    }
  ],

  env: {
    baseUrl: baseUrl
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: '~plugins/ga.js',
      ssr: false
    }
  ],

  router: {
    middleware: 'manage-cookies'
  },

  generate: {
    subFolders: false,
    routes: ['404']
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/redirect-module',
    '@nuxtjs/sentry',
    [
      'nuxt-buefy',
      {
        css: false
      }
    ],
    [
      'cookie-universal-nuxt',
      {
        parseJSON: false
      }
    ],
    // Doc: https://github.com/Developmint/nuxt-purgecss (NOT TESTED)
    'nuxt-purgecss',
    '@nuxtjs/onesignal',
    [
      // Doc: https://pwa.nuxtjs.org/
      '@nuxtjs/pwa',
      {
        workbox: {
          offlinePage: '/'
          // Workbox options
        },
        meta: {
          name: name
        },
        manifest: {
          name: name,
          short_name: 'Portfolio',
          description: pkg.description,
          lang: 'en'
        },
        icon: {
          iconSrc: 'static/resources/images/icon/1x/primary-icon.png'
          // Icon options
        }
      }
    ],
    [
      'nuxt-i18n',
      {
        // seo: false,
        lazy: true,
        vueI18nLoader: true,
        langDir: 'lang/',
        baseUrl: baseUrl,
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'kcnt-i18n'
        },
        locales: [
          {
            code: 'en',
            file: 'en.js',
            name: 'English',
            iso: 'en-US'
          },
          {
            code: 'th',
            file: 'th.js',
            name: 'Thai',
            iso: 'th-TH'
          }
        ],
        defaultLocale: 'en'
      }
    ]
  ],

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Sentry module configuration
   */
  sentry: {
    disabled: isDev,
    public_key: 'ae4134e4a62b4ccd8bc0b7b7aab7e7c7',
    project_id: '1338780',
    config: {
      // Additional config
      environment: env,
      release: isProd ? `portfolio@${pkg.version}` : undefined,
      debug: isDev
    }
  },

  /*
   ** Purge CSS module configuration (NO TEST YET)
   */
  purgeCSS: {
    // See https://github.com/Developmint/nuxt-purgecss
  },

  oneSignal: {
    cdn: true,
    init: {
      appId: branch === 'master' ? onesignal_prod : onesignal_dev,
      autoRegister: false,
      persistNotification: false, // dismiss the notification after 20 seconds
      notifyButton: {
        enable: true,
        size: 'small',
        displayPredicate: function() {
          return OneSignal.isPushNotificationsEnabled().then(function(
            isPushEnabled
          ) {
            /* The user is subscribed, so we want to return "false" to hide the Subscription Bell */
            return !isPushEnabled
          })
        }
      },
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        title: 'Welcome to portfolio website',
        message: 'Thanks for subscribing!'
      }
    }
  },

  redirect: [
    // Redirect options here
    {
      from: '^/images/(.*)$',
      to: '/resources/images/$1'
    },
    ...generateIconPath()
  ],

  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    profile: true,
    publicPath: '/_kcnt/',
    splitChunks: {
      layouts: true,
      pages: true
    },
    analyze: {
      analyzerMode: isDev ? 'static' : 'disable',
      reportFilename: 'report.html',
      openAnalyzer: false
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
