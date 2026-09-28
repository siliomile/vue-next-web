<!-- 📚 字典下拉选择器：基于系统统一字典能力（DictManager）渲染 el-select（迁移自 party-dues-pc） -->
<template>
  <el-select
    v-model="_value"
    :multiple="multiple"
    :clearable="clearable"
    :disabled="disabled"
    :filterable="filterable"
    :placeholder="placeholder"
    :collapse-tags="collapseTags"
    :collapse-tags-tooltip="collapseTags"
    :style="width ? { width } : undefined"
    @change="onChange"
  >
    <el-option v-for="item in options" :key="String(item.value)" :label="item.label" :value="String(item.value)" />
  </el-select>
</template>

<script setup lang="ts" name="DictSelect">
import { computed, ref, watch } from "vue";
import DictManager from "@/utils/modules/DictManager";

interface DictSelectProps {
  /** 字典编码 */
  code: string;
  /** 绑定的值（支持单选 / 多选） */
  modelValue?: string | number | Array<string | number> | null;
  multiple?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  filterable?: boolean;
  collapseTags?: boolean;
  placeholder?: string;
  width?: string;
}

const props = withDefaults(defineProps<DictSelectProps>(), {
  modelValue: undefined,
  multiple: false,
  clearable: true,
  disabled: false,
  filterable: true,
  collapseTags: true,
  placeholder: "请选择",
  width: "100%",
});

const emit = defineEmits<{ "update:modelValue": [value: any]; change: [value: any] }>();

// 字典数据（随 code 变化自动加载，带缓存）
const entry = ref(DictManager.get(props.code));
watch(
  () => props.code,
  async code => {
    entry.value = await DictManager.load(code);
  },
  { immediate: true },
);

const options = computed(() => entry.value.option);

// 对外值为字符串，与后端传参保持一致
const _value = computed({
  get: () => {
    if (props.modelValue === undefined || props.modelValue === null || props.modelValue === "") return undefined;
    if (props.multiple) {
      const list = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];
      return list.map(item => String(item));
    }
    return String(props.modelValue);
  },
  set: (value: any) => emit("update:modelValue", value),
});

const onChange = (value: any) => emit("change", value);
</script>
