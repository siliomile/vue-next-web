import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'virtual:uno.css'
import GlobalPlugins from './plugins'

const app = createApp(App)

// 用 Vue.use 也能一次性注册
app.use(GlobalPlugins)

app.mount('#app')
