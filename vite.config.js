const path = require('path')
const { defineConfig, loadEnv } = require('vite')
const vue2 = require('@vitejs/plugin-vue2')

module.exports = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isSteam = env.VITE_APP_STEAM === 'true' || mode.includes('steam')

  return {
    plugins: [vue2()],
    base: './',
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@/env', replacement: path.resolve(__dirname, 'env.js') }
      ],
      extensions: ['.js', '.vue', '.json']
    },
    build: {
      outDir: isSteam ? '../AppFiles' : 'dist',
      sourcemap: true,
    },
    server: {
      port: 8080,
      hmr: { overlay: false }
    }
  }
})