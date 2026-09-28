import { computed } from "vue";
import { useUserStore } from "@/stores/modules/user";

/**
 * @description 权限判断（按钮 / 操作权限）（迁移自 party-dues-pc）
 * 数据来源：用户信息中的 permissions（如 system:user:create）
 */
export const usePermission = () => {
  const userStore = useUserStore();

  const permissions = computed<string[]>(() => userStore.userInfo.permissions || []);
  const roles = computed<string[]>(() => userStore.userInfo.roles || []);
  const isSuperAdmin = computed(() => roles.value.includes("super_admin"));

  /**
   * 是否拥有某个（或任意一个）权限标识
   * 超级管理员默认拥有全部权限
   */
  const hasPermission = (permission?: string | string[]) => {
    if (!permission || (Array.isArray(permission) && !permission.length)) return true;
    if (isSuperAdmin.value) return true;
    const list = Array.isArray(permission) ? permission : [permission];
    return list.some(item => permissions.value.includes(item));
  };

  return { permissions, roles, isSuperAdmin, hasPermission };
};

export default usePermission;
