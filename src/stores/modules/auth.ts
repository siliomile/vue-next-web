import { defineStore } from "pinia";
import { AuthState, MenuItem } from "@/stores/interface";
import { getAuthButtonListApi, getAuthMenuListApi } from "@/api/modules/login";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";

export const useAuthStore = defineStore("sys-auth", {
  state: (): AuthState => ({
    // 按钮权限列表
    authButtonList: {},
    // 菜单权限列表
    authMenuList: [],
    // 当前页面的 router name，用来做按钮权限筛选
    routeName: "",
  }),
  getters: {
    // 按钮权限列表
    authButtonListGet: (state) => state.authButtonList,
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: (state) => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    showMenuListGet: (state) => getShowMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: (state) => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: (state) => getAllBreadcrumbList(state.authMenuList),
  },
  actions: {
    // Get AuthButtonList
    async getAuthButtonList() {
      const { data } = await getAuthButtonListApi();
      this.authButtonList = data;
    },
    // Get AuthMenuList
    async getPermissionInfo() {
      const { code, data, msg } = await getAuthMenuListApi();

      if (code !== 200 || !Array.isArray(data) || !data.length) {
        console.warn("菜单数据为空或请求失败", msg);
        return false;
      }

      // 1️⃣ 过滤不需要的菜单
      const filteredData = (data || []).filter((item) => item.path !== "/feature");

      // 2️⃣ 构造树形结构
      const buildTree = (list: MenuItem[]): MenuItem[] => {
        const map = new Map<number, MenuItem>();
        const roots: MenuItem[] = [];

        list.forEach((item) => map.set(item.id, { ...item, children: [] }));

        list.forEach((item) => {
          const parent = map.get(item.parentId);
          if (parent) {
            parent.children!.push(map.get(item.id)!);
          } else {
            roots.push(map.get(item.id)!);
          }
        });

        return roots;
      };

      // 3️⃣ 菜单转路由结构
      const transformMenuToRoutes = (menus: MenuItem[]) =>
        menus.map((menu) => {
          const route = {
            id: menu.id,
            name: menu.routeName,
            path: menu.path,
            menuType: menu.menuType,
            sort: menu.sort,
            meta: {
              icon: menu.icon ?? "HomeFilled",
              title: menu.name,
              activeMenu: menu.path,
              enabled: menu.enabled,
              isLink: "",
              isHide: menu.isHide,
              isFull: menu.isFull,
              isAffix: menu.isAffix,
              keepAlive: !!menu.keepAlive,
            },
            ...(menu.children?.length
              ? { children: transformMenuToRoutes(menu.children), redirect: menu.component }
              : { component: menu.component }),
          };
          return route;
        });

      // 4️⃣ 处理最终结果
      const structuredData = buildTree(filteredData);
      const menuItems = transformMenuToRoutes(structuredData);

      console.log("✅ 构建完成菜单:", menuItems);
      this.authMenuList = menuItems;
    },
    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    },
  },
});
