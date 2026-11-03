# 路由切换偶发 404 问题分析报告

## 1. 问题概述

项目在路由切换、页面刷新或快速连续点击菜单时，偶尔显示 404 页面。该问题不是单个业务页面路径写错，而是动态路由注册、导航守卫和静态 404 兜底路由之间存在竞态。

该架构使用 Vue Router History 模式，业务菜单由后端返回，前端在运行时通过 `router.addRoute()` 注册。应用启动时，静态路由已经包含通配兜底路由 `/:pathMatch(.*)*`。因此，动态路由尚未完成注册时，任意业务 URL 都会被立即判定为 404。

## 2. 涉及的路由架构

核心链路如下：

1. `src/routers/index.ts` 创建 Router，挂载静态路由和错误路由。
2. `src/routers/modules/staticRouter.ts` 注册 `/layout`、登录页和错误页。
3. 同文件注册 `/:pathMatch(.*)*` 通配路由，作为最终 404 兜底。
4. `src/routers/modules/dynamicRouter.ts` 请求权限菜单，将后端菜单转换为前端路由，并通过 `router.addRoute()` 注册。
5. `beforeEach` 导航守卫在有 Token 且菜单状态不完整时调用 `initDynamicRouter()`。

## 3. 根因分析

### 3.1 导航守卫用菜单状态代替路由注册状态

原逻辑只判断：

```ts
if (!authStore.authMenuListGet.length) {
  await initDynamicRouter()
  return next({ ...to, replace: true })
}
```

这个判断并不能证明 `to` 对应的路由已经注册。以下场景中，两种状态会短暂不一致：

- 第一次导航正在请求权限菜单，用户又快速触发了第二次导航。
- 权限接口返回后菜单状态已经写入，但当前导航仍然保留了第一次匹配结果。

当目标路径没有动态匹配项时，Vue Router 会先匹配静态通配路由，`to.matched` 已经包含 404 页面。原守卫没有识别这个情况，直接放行后就会显示 404。

### 3.2 动态路由初始化允许并发执行

`initDynamicRouter()` 原来每次调用都会重新请求权限信息并注册路由。快速切换或并发导航时，可能出现：

```text
导航 A -> initDynamicRouter()
导航 B -> initDynamicRouter()
请求 A/B 并发返回
注册 A/B 交错执行
导航结果依赖返回顺序
```

这会放大动态路由注册时序问题，也可能重复调用 `router.addRoute()`。

### 3.3 History 模式的部署前提

项目配置使用：

- `VITE_ROUTER_MODE = history`
- 生产 History base：`/qzkjj/`
- Vite production base：`/qzkjj`

服务器必须把 `/qzkjj/` 下所有未知页面请求回退到对应的 `index.html`。如果服务器没有配置 History fallback，直接刷新业务子路径也会产生服务器 404。这属于部署层风险，与前端动态路由竞态是两条独立链路。

## 4. 已实施的代码修复

### 4.1 导航命中通配 404 时重新初始化并重放导航

文件：`src/routers/index.ts`

新增逻辑：

```ts
const hitNotFound = to.matched.some((record) => record.path === "/:pathMatch(.*)*")

if ((!authStore.authMenuListGet.length || hitNotFound) && !isReplayed) {
  isReplayed = true
  await initDynamicRouter()
  return next({ ...to, replace: true })
}
if (!hitNotFound) isReplayed = false
```

作用：

- 不再只依赖菜单数组是否为空。
- 识别当前导航是否已经命中静态 404 兜底。
- 动态路由完成注册后，重新解析原目标路径。
- 通过 `replace` 避免把错误的 404 地址额外压入历史记录。
- `isReplayed` 标记保证同一导航最多重放一次：真实不存在的路径不会触发无限重新初始化，落到真实业务路由后标记自动重置。

### 4.2 动态路由初始化增加单航班控制

文件：`src/routers/modules/dynamicRouter.ts`

新增模块级 Promise：

```ts
let initPromise: Promise<void> | null = null
```

所有并发调用共享同一个初始化 Promise，初始化完成或失败后才清空。这样可以保证同一时刻只有一套权限菜单请求和动态路由注册流程。

### 4.3 动态路由注册改为幂等

文件：`src/routers/modules/dynamicRouter.ts`

注册动态路由前，先移除上一次注册的动态路由：

```ts
removeRegisteredRoutes()
```

作用：

- 避免重复添加相同 name 的路由。
- 保证重新拉取权限后，路由集合与当前菜单集合一致。

## 5. 修复后的导航时序

正常首次访问或刷新：

```text
进入目标 URL
  -> beforeEach 检查 Token
  -> 发现菜单为空或命中 404 兜底
  -> 单航班初始化动态路由
  -> 注册动态路由
  -> replace 重放原目标 URL
  -> 匹配业务路由
```

## 6. 文件改动清单

| 文件 | 改动 | 目的 |
| --- | --- | --- |
| `src/routers/index.ts` | 检测通配 404；命中时初始化动态路由并重放导航（带单次重放保护） | 修复刷新、快速切换时的首次错误匹配 |
| `src/routers/modules/dynamicRouter.ts` | 增加初始化单航班；注册前清理旧动态路由 | 消除并发初始化和重复注册 |
| `docs/router-404-bug-analysis.md` | 本分析报告 | 记录根因、修复和验证结果 |

## 7. 部署检查项

生产环境需要确认：

1. 应用实际访问前缀确实是 `/qzkjj/`。
2. Nginx 或其他 Web 服务器将 `/qzkjj/` 下的页面请求回退到 `/qzkjj/index.html`。
3. 静态资源也部署在 `/qzkjj/` 前缀下。
4. CDN、反向代理和压缩文件配置没有缓存旧版本 JS chunk。
5. 发布新版本时，旧 HTML 与新 JS chunk 不会长期混用。
6. 如果应用实际部署在根路径 `/`，则需要同步调整 Vite `base` 和 `createWebHistory()` 的 base，不能继续使用 `/qzkjj/`。

## 8. 后续建议

建议后续补充一组路由集成测试或浏览器回归用例，覆盖：

- 登录后首次进入动态菜单页面。
- 已登录状态刷新深层业务 URL。
- 快速连续点击两个菜单。
- 权限接口延迟返回期间触发导航。
- 权限接口失败后的登录页回退。

这些用例应验证最终 `router.currentRoute.value.matched` 命中业务路由，而不只是验证 `router.push()` Promise 没有抛异常。
