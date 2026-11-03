import router from '@/routers/index'
import { LOGIN_URL } from '@/config'
import { RouteRecordRaw } from 'vue-router'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'

// 引入 pages 文件夹下所有 vue 文件
const modules = import.meta.glob('@/pages/**/*.vue')

// 初始化单航班：同一时刻只允许一个权限菜单请求 + 动态路由注册流程，
// 并发调用（快速连续导航等）共享同一个 Promise，完成或失败后才清空
let initPromise: Promise<void> | null = null

// 已注册的动态路由 name 集合，用于重新注册前清理旧路由，保证路由集合与当前菜单集合一致
let registeredRouteNames: string[] = []

/**
 * @description 清理已注册的动态路由
 */
const removeRegisteredRoutes = () => {
  registeredRouteNames.forEach((name) => {
    if (name && router.hasRoute(name)) router.removeRoute(name)
  })
  registeredRouteNames = []
}

/**
 * @description 初始化动态路由
 */
export const initDynamicRouter = async () => {
  // 单航班控制：并发调用复用同一个初始化 Promise
  if (initPromise) return initPromise

  const runInit = async (): Promise<void> => {
    const userStore = useUserStore()
    const authStore = useAuthStore()

    try {
      // 1.获取菜单列表 && 按钮权限列表
      await authStore.getPermissionInfo()
      // await authStore.getAuthButtonList()

      // 2.判断当前用户有没有菜单权限
      if (!authStore.authMenuListGet.length) {
        ElNotification({
          title: '无权限访问',
          message: '当前账号无任何菜单权限，请联系系统管理员！',
          type: 'warning',
          duration: 3000,
        })
        userStore.setToken('')
        router.replace(LOGIN_URL)
        return Promise.reject('No permission')
      }

      // 3.幂等注册：先移除上一次注册的动态路由（切换端、重新拉取权限后路由集合与菜单保持一致），
      //   避免同一端重复添加相同 name 的路由
      removeRegisteredRoutes()

      // 4.添加动态路由
      authStore.flatMenuListGet.forEach((item) => {
        item.children && delete item.children
        if (item.component && typeof item.component == 'string') {
          item.component = modules['/src/pages' + item.component + '.vue']
        }
        if (item.meta.isFull) {
          router.addRoute(item as unknown as RouteRecordRaw)
        } else {
          router.addRoute('layout', item as unknown as RouteRecordRaw)
        }
        if (item.name) registeredRouteNames.push(item.name as string)
      })
    } catch (error) {
      // 当按钮 || 菜单请求出错时，重定向到登陆页
      userStore.setToken('')
      router.replace(LOGIN_URL)
      return Promise.reject(error)
    }
  }

  initPromise = runInit()

  try {
    await initPromise
  } finally {
    // 初始化完成或失败后清空，允许后续（如重新登录、权限刷新）重新初始化
    initPromise = null
  }
}
