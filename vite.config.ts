import {
  defineConfig,
  loadEnv,
  type ConfigEnv,
  type UserConfig,
  type PluginOption,
  type ProxyOptions,
} from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import removeConsole from 'vite-plugin-remove-console'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'

/**
 * 创建代理，用于解析 .env.development / .env.* 配置
 */
function createProxy(list: [string, string][] = []) {
  const ret: Record<string, ProxyOptions> = {}
  for (const [prefix, target] of list) {
    const httpsRE = /^https:\/\//
    const isHttps = httpsRE.test(target)

    ret[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      ...(isHttps ? { secure: false } : {}),
    }
  }
  return ret
}

function definedPlugins<T>(plugins: (T | false | null | undefined)[]): T[] {
  return plugins.filter(Boolean) as T[]
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isProd = mode === 'production'
  const needAnalyze = process.env.VITE_ANALYZE

  // 解析 .env 文件中的代理配置
  // 写法示例：VITE_PROXY=[["/api","http://localhost:3000"],["/foo","https://foo.com"]]
  const proxyList: [string, string][] = env.VITE_PROXY ? JSON.parse(env.VITE_PROXY) : []

  const plugins = definedPlugins<PluginOption>([
    vue(),
    UnoCSS(),
    vueSetupExtend(),

    // 关键行：先 cast 到 unknown，再 cast 到 PluginOption
    needAnalyze && (visualizer({ open: true, gzipSize: true }) as unknown as PluginOption),
    // 仅生产环境去除 console/debugger
    isProd && removeConsole(),

    // 仅生产环境启用 gzip 压缩
    isProd &&
      viteCompression({
        verbose: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
  ])

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
      port: 8805,
      host: '0.0.0.0',
      open: true,
      cors: true,
      proxy: createProxy(proxyList), // ✅ 使用 createProxy 动态生成
    },
    build: {
      outDir: 'dist',
      sourcemap: isProd,
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
    optimizeDeps: {
      include: ['vue', 'lodash'],
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  }
})
