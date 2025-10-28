import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore(
  "sys-user", // ✅ 第一个参数必须是 id 字符串
  {
    state: (): UserState => ({
      token: "",
      deptId: "",
      userInfo: {
        username: "超级管理员",
        account: "",
        permissions: [],
        roles: [],
        depts: [],
        companyInfo: {},
      },
    }),
    getters: {
      // 可选示例
      isLogin: (state) => !!state.token,
    },
    actions: {
      // 设置 token
      setToken(token: string) {
        this.token = token;
      },
      setDeptId(deptId: string) {
        this.deptId = deptId;
      },
      // 设置 userInfo
      setUserInfo(userInfo: UserState["userInfo"]) {
        this.userInfo = userInfo;
      },
      // 清空用户信息
      resetUser() {
        this.token = "";
        this.userInfo = {
          username: "",
          account: "",
          permissions: [],
          roles: [],
          depts: [],
          companyInfo: {},
        };
      },
    },
    persist: piniaPersistConfig("sys-user"), // ✅ 持久化配置
  },
);
