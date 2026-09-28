/**
 * @description 字典使用辅助方法（迁移自 party-dues-pc）
 * - dictEnum：提供给 ProTable 的 enum 使用（搜索下拉、单元格格式化）
 * - dictLabel：根据字典编码与值取标签
 * - dictTagType：字典 colorType 转 Element Plus 标签类型
 * 说明：底层复用系统统一的字典能力（DictManager / queryDictDataByCode），此处仅做展示层适配
 */
import DictManager from "@/utils/modules/DictManager";

/** Element Plus el-tag 支持的 type */
export type DictTagType = "primary" | "success" | "info" | "warning" | "danger";

/** 字典 colorType -> el-tag type */
export const COLOR_TYPE_MAP: Record<string, DictTagType> = {
  default: "info",
  primary: "primary",
  success: "success",
  info: "info",
  warning: "warning",
  danger: "danger",
};

/** colorType 转 el-tag type */
export const toTagType = (colorType?: unknown): DictTagType | undefined => {
  if (!colorType) return undefined;
  return COLOR_TYPE_MAP[String(colorType)] ?? undefined;
};

/**
 * ProTable 列 enum 配置：() => dictEnum('system_user_sex')
 * 返回 { data: [{ label, value, tagType }] }
 */
export const dictEnum = (code: string) => {
  return async () => {
    const entry = await DictManager.load(code);
    return {
      data: entry.option.map(item => ({
        label: item.label,
        value: String(item.value),
        tagType: toTagType((item.raw as Record<string, any>)?.colorType),
        colorType: (item.raw as Record<string, any>)?.colorType,
      })),
    };
  };
};

/** 根据字典编码与值获取标签（同步，需保证字典已加载） */
export const dictLabel = (code: string, value: unknown, fallback = "--") => {
  if (value === undefined || value === null || value === "") return fallback;
  const entry = DictManager.get(code);
  return entry.label[String(value)] ?? fallback;
};

/** 根据字典编码与值获取标签颜色类型（同步，需保证字典已加载） */
export const dictTagType = (code: string, value: unknown): DictTagType | undefined => {
  const entry = DictManager.get(code);
  const option = entry.option.find(item => String(item.value) === String(value));
  return toTagType((option?.raw as Record<string, any>)?.colorType);
};

/** 预加载多个字典（页面进入前调用，避免表格列渲染时取不到标签） */
export const preloadDicts = async (codes: string[]) => {
  await DictManager.loadMany(codes);
};
