const path = require('path')
const { defineConfig, loadEnv } = require('vite')
const vue2 = require('@vitejs/plugin-vue2')

module.exports = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isSteam = env.VUE_APP_STEAM === 'true' || mode.includes('steam')

  const envForDefine = {}
  for (const key in env) {
    if (key.startsWith('VUE_APP_')) {
      envForDefine[key] = JSON.stringify(env[key])
    }
  }

  return {
    plugins: [vue2()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.vue', '.json']
    },
    build: {
      outDir: isSteam ? '../AppFiles' : 'dist',
      sourcemap: true,
    },
    server: {
      port: 8080,
      hmr: {
        overlay: false
      }
    },
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || mode),
        VUE_APP_DEV: JSON.stringify(env.VUE_APP_DEV === 'true'),
        VUE_APP_STEAM: JSON.stringify(isSteam),
        ...envForDefine
      }
    }
  }
})