import { defineStore } from 'pinia'
import { UserState } from '@/stores/interface'
import piniaPersistConfig from '@/stores/helper/persist'

export const useUserStore = defineStore(
  'geeker-user', // ✅ 第一个参数必须是 id 字符串
  {
    state: (): UserState => ({
      token: '',
      userInfo: { name: 'Geeker' },
    }),
    getters: {
      // 可选示例
      isLogin: (state) => !!state.token,
    },
    actions: {
      // 设置 token
      setToken(token: string) {
        this.token = token
      },
      // 设置 userInfo
      setUserInfo(userInfo: UserState['userInfo']) {
        this.userInfo = userInfo
      },
      // 清空用户信息
      resetUser() {
        this.token = ''
        this.userInfo = { name: '' }
      },
    },
    persist: piniaPersistConfig('geeker-user'), // ✅ 持久化配置
  },
)
