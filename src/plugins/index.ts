// src/plugins/index.ts
import type { App, Plugin } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
const pinia = createPinia()

const plugins: Plugin[] = [ElementPlus, pinia]

const GlobalPlugins: Plugin = {
  install(app: App) {
    plugins.forEach((p) => app.use(p))
  },
}

export default GlobalPlugins
