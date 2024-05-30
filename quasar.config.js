/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { configure } = require('quasar/wrappers')
const dotenv = require('dotenv')
const path = require('path')
const copy = require('rollup-plugin-copy')
// const NodeGlobalsPolyfillPlugin = require('vite-plugin-node-globals-polyfill')
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})
// dotenvExpand(myEnv)
module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      // fix: true,
      // include: [],
      // exclude: [],
      // rawOptions: {},
      warnings: true,
      errors: true
    },

    // https://v2.quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli/boot-files
    boot: ['axios'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node18'
      },

      vueRouterMode: 'hash', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools: true,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      publicPath: '/',
      // analyze: true,
      env: {
        VITE_API: process.env.VITE_API,
        Fetch_api: process.env.Fetch_api,
        opay_api: process.env.opay_api,
        apiOrder: process.env.apiOrder,
        giveMe: process.env.giveMe,
        funpoint_api: process.env.funpoint_api,
        HashKey: process.env.HashKey,
        HashIV: process.env.HashIV,
        MerchantID: process.env.MerchantID,
        MerchantIDecpay: process.env.MerchantIDecpay,
        uncode: process.env.uncode,
        idno: process.env.idno
      },
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      // extendViteConf (viteConf) {},
      // viteVuePluginOptions: {},
      vitePlugins: [
        // @intlify/vite-plugin-vue-i18n 插件配置
        [
          '@intlify/vite-plugin-vue-i18n',
          {
            include: path.resolve(__dirname, './src/i18n/**')
          }
        ],

        // rollup-plugin-copy 插件配置
        copy({
          targets: [
            { src: 'src-keep/.htaccess', dest: 'dist/spa' }
          ],
          hook: 'writeBundle'
        })
      ],
      alias: {
        '@': path.join(__dirname, './src')
      }

    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      open: true,
      proxy: {
        '/api': {
          target: 'http://dods.dtstw.com',
          changeOrigin: true
        },
        '/B2CInvoice': {
          target: 'https://einvoice-stage.ecpay.com.tw/',
          changeOrigin: true
        },
        '/Cashier': {
          target: 'https://payment-stage.funpoint.com.tw/',
          changeOrigin: true
        },
        '/Content': {
          target: 'https://payment-stage.funpoint.com.tw/',
          changeOrigin: true
        },
        '/Scripts': {
          target: 'https://payment-stage.funpoint.com.tw/',
          changeOrigin: true
        },
        '/Upload': {
          target: 'https://payment-stage.funpoint.com.tw/',
          changeOrigin: true
        }
      }
    },
    // opens browser window automatically

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      // config: { dark: 'auto' },

      // iconSet: 'material-icons', // Quasar icon set
      lang: 'zh-TW', // Quasar language pack
      cssAddon: true,
      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'LocalStorage',
        'Notify',
        'Loading',
        'Dialog',
        'QCarousel',
        'QCarouselSlide ',
        'QCarouselControl ',
        'QTable'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#property-sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    // pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: true,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render' // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'injectManifest', // or 'injectManifest'
      injectPwaMetaTags: false,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      useFilenameHashes: true
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },
    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,
      electron: {
        preload: path.resolve(__dirname, '.quasar/electron/electron-preload.js')
        // 其他 Electron 配置
      },
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'bing-quasar'
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ['my-content-script']

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    }
  }
})
