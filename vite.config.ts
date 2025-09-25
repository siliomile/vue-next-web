import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import removeConsole from 'vite-plugin-remove-console'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'
import dayjs from 'dayjs'

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  const needAnalyze = process.env.ANALYZE === 'true'

  const plugins = [
    vue(),
    UnoCSS(),
    vueSetupExtend(),

    // 仅分析时启用
    needAnalyze && visualizer({ open: true, gzipSize: true }),

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
  ].filter(Boolean)

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
      host: '0.0.0.0', // 允许通过本机IP 访问
      open: true,
      cors: true,
      proxy: {
        // '/api': { target: 'http://localhost:5000', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') }
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: isProd, // 只有生产时才生成 map
      minify: 'terser',
      chunkSizeWarningLimit: 1000,
      terserOptions: {
        compress: {
          drop_console: true, // 再次双保险
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
      include: ['vue', 'lodash'], // 预构建常用库
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  }
})
