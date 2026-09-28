<!-- 📚 字典标签：基于系统统一字典能力（DictManager）渲染带颜色的 el-tag（迁移自 party-dues-pc） -->
<template>
  <el-tag v-if="showTag" :type="tagType ?? 'info'" :size="size" :effect="effect" :round="round">
    {{ label }}
  </el-tag>
  <span v-else>{{ label }}</span>
</template>

<script setup lang="ts" name="DictTag">
import { computed, ref, watch } from "vue";
import DictManager from "@/utils/modules/DictManager";
import { toTagType, type DictTagType } from "@/utils/dictHelper";

interface DictTagProps {
  /** 字典编码 */
  code: string;
  /** 字典值 */
  value?: string | number | boolean | null;
  size?: "large" | "default" | "small";
  effect?: "dark" | "light" | "plain";
  round?: boolean;
  /** 未匹配到字典时的兜底文案 */
  fallback?: string;
  /** 无论字典是否配置颜色，都以标签形式展示 */
  always?: boolean;
}

const props = withDefaults(defineProps<DictTagProps>(), {
  value: undefined,
  size: "default",
  effect: "light",
  round: false,
  fallback: "--",
  always: false,
});

const entry = ref(DictManager.get(props.code));
watch(
  () => props.code,
  async code => {
    entry.value = await DictManager.load(code);
  },
  { immediate: true },
);

const isEmpty = computed(() => props.value === undefined || props.value === null || props.value === "");

const label = computed(() => {
  if (isEmpty.value) return props.fallback;
  const matched = entry.value.label[String(props.value)];
  return matched ?? props.fallback;
});

const tagType = computed<DictTagType | undefined>(() => {
  if (isEmpty.value) return undefined;
  const option = entry.value.option.find(item => String(item.value) === String(props.value));
  return toTagType((option?.raw as Record<string, any>)?.colorType);
});

/** 是否以标签形式展示 */
const showTag = computed(() => !isEmpty.value && (props.always || !!tagType.value));
</script>
