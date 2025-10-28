export type LayoutType = "vertical" | "classic" | "transverse" | "columns";

export type AssemblySizeType = "large" | "default" | "small";

export type LanguageType = "zh" | "en" | null;

/* GlobalState */
export interface GlobalState {
  layout: LayoutType;
  assemblySize: AssemblySizeType;
  language: LanguageType;
  maximize: boolean;
  primary: string;
  isDark: boolean;
  isGrey: boolean;
  isWeak: boolean;
  asideInverted: boolean;
  headerInverted: boolean;
  isCollapse: boolean;
  accordion: boolean;
  watermark: boolean;
  breadcrumb: boolean;
  breadcrumbIcon: boolean;
  tabs: boolean;
  tabsIcon: boolean;
  footer: boolean;
}

/* UserState */
export interface UserState {
  token: string;
  deptId: string;
  userInfo: {
    username: string;
    account: any;
    permissions: string[];
    roles: any[];
    depts: any[];
    companyInfo: Record<string, any>;
  };
}

/* tabsMenuProps */
export interface TabsMenuProps {
  icon: string;
  title: string;
  path: string;
  name: string;
  close: boolean;
  keepAlive: boolean;
}

/* TabsState */
export interface TabsState {
  tabsMenuList: TabsMenuProps[];
}

/* AuthState */
export interface AuthState {
  routeName: string;
  authButtonList: {
    [key: string]: string[];
  };
  authMenuList: Menu.MenuOptions[];
}

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[];
}

// 定义后端菜单类型
export interface MenuItem {
  id: number;
  parentId: number;
  name: string;
  routeName: string;
  icon?: string;
  sort?: number;
  path: string;
  component?: string;
  menuType?: string;
  isHide?: boolean;
  isFull?: boolean;
  isAffix?: boolean;
  enabled?: boolean;
  keepAlive?: boolean;
  children?: MenuItem[];
}
