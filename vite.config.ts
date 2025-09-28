import {
  defineConfig,
  loadEnv,
} from 'vite'
import { wrapperEnv } from './build/getEnv'
import { createProxy } from './build/proxy'
import { createVitePlugins } from './build/plugins'
import { resolve } from 'path'
import pkg from './package.json'
import dayjs from 'dayjs'

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}


export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)


  const plugins = createVitePlugins(viteEnv)

  return {
    plugins,
    resolve: {
      alias: { '@': resolve(__dirname, './src') },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/var.scss" as *;`,
        },
      },
    },
    server: {
      port: viteEnv.VITE_PORT,
      host: '0.0.0.0',
      open: viteEnv.VITE_OPEN,
      cors: true,
      proxy: createProxy(viteEnv.VITE_PROXY), // ✅ 使用 createProxy 动态生成
    },
    build: {
      outDir: 'dist',
      sourcemap: viteEnv.VITE_USER_NODE_ENV === 'production',
      minify: 'terser',
      chunkSizeWarningLimit: 1000,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0]
            }
          },
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  }
})
