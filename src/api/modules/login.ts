import { Login, ApiResponse } from "@/api/interface/index";
import { PORT1, PORT2, PORT5 } from "@/api/config/servicePort";
import authMenuList from "@/assets/json/authMenuList.json";
import authButtonList from "@/assets/json/authButtonList.json";
import http from "@/api";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(`/research-monitor/auth/login/phone`, params, {
    loading: false,
  }); // 正常 post json 请求  ==>  application/json
};

// 获取菜单列表
export const getAuthMenuListApi = () => {
  return http.get<Menu.MenuOptions[]>(`/research-monitor/menu/user`, {}, { loading: false });
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { loading: false });
  // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtonList.json 数据
  return authButtonList;
};

// 用户退出登录
export const logoutApi = () => {
  return http.get(`/research-monitor/auth/logout`);
};

// 获取登录验证码
export const getCaptchaApi = () => {
  return http.get<{ data: Login.CaptchaResponse }>(`/research-monitor/auth/login/code`);
};

// 用户退出登录
// export const verifyCaptchaApi = () => {
//   return http.get(`/research-monitor/auth/logout`);
// };
