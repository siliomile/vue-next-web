/*
 * @Author: silio
 * @Date: 2026/06/04
 * @FilePath: src/composables/useDict.ts
 * @Description: 字典组合式函数（Composition API），用于 <script setup> 中加载和使用字典数据（迁移自 party-dues-pc）
 *
 * 使用示例：
 *
 * ```vue
 * <script setup lang="ts">
 * import { useDict } from '@/composables/useDict'
 *
 * // 1. 基础用法：组件挂载时自动加载
 * const { dict, dictOptions, loading, ready, getDictLabel } = useDict(['gender', 'nation'])
 *
 * // 2. 手动控制加载时机
 * const { dict, loadDicts } = useDict(['gender'], { immediate: false })
 * // 在某个事件中手动加载
 * async function onNeed() {
 *   await loadDicts()
 * }
 *
 * // 3. 动态加载单个字典
 * const { loadDict } = useDict()
 * async function onExpand() {
 *   const entry = await loadDict('education')
 *   console.log(entry.option)
 * }
 * </script>
 *
 * <template>
 *   <!-- 使用 option 列表渲染下拉 -->
 *   <el-select :options="dictOptions.gender" />
 *
 *   <!-- 使用 label 映射将值转为文本 -->
 *   <span>{{ getDictLabel('gender', user.gender) }}</span>
 *
 *   <!-- 直接访问 dict 对象 -->
 *   <div v-if="ready">
 *     <div v-for="item in dict.gender.option" :key="item.value">
 *       {{ item.label }}
 *     </div>
 *   </div>
 *
 *   <!-- 加载状态 -->
 *   <el-icon v-if="loading"><Loading /></el-icon>
 * </template>
 * ```
 */
import type { DictEntry, DictOption, DictValue } from '@/utils/modules/DictManager'
import { computed, onMounted, reactive, ref } from 'vue'
import DictManager from '@/utils/modules/DictManager'

/** 字典状态，key 为字典编码，value 为 DictEntry */
export type DictState = Record<string, DictEntry>
/** 字典值类型 */
export type { DictOption, DictValue }

/** useDict 配置项 */
export interface UseDictOptions {
  /** 是否在 onMounted 时自动加载，默认 true */
  immediate?: boolean
}

/** 创建空字典占位 */
function createEmptyDict(): DictEntry {
  return {
    option: [],
    label: {},
    raw: [],
  }
}

/**
 * 字典组合式函数
 * @param names - 需要加载的字典编码数组
 * @param options - 配置项
 * @returns 字典响应式数据和操作方法
 */
export function useDict(names: string[] = [], options: UseDictOptions = {}) {
  const { immediate = true } = options

  /** 响应式字典数据，key 为字典编码 */
  const dict = reactive<DictState>({})

  /** 是否正在加载中 */
  const loading = ref(false)

  /** 首次加载是否已完成 */
  const ready = ref(false)

  /** 确保 dict 中存在该字典的占位 */
  function ensureDict(name: string) {
    if (!dict[name]) dict[name] = DictManager.get(name)

    if (!dict[name]) dict[name] = createEmptyDict()
  }

  /**
   * 加载单个字典（带缓存）
   * @param name - 字典编码
   * @returns 加载完成的 DictEntry
   */
  async function loadDict(name: string) {
    if (!name) return createEmptyDict()

    ensureDict(name)
    const entry = await DictManager.load(name)
    dict[name] = entry
    return entry
  }

  /**
   * 批量加载多个字典
   * @param nextNames - 字典编码数组，默认使用初始化时的 names
   */
  async function loadDicts(nextNames: string[] = names) {
    const uniqueNames = Array.from(new Set(nextNames.filter(Boolean)))
    uniqueNames.forEach(ensureDict)

    loading.value = true
    ready.value = false

    try {
      const entries = await DictManager.loadMany(uniqueNames)
      uniqueNames.forEach((name, index) => {
        dict[name] = entries[index] ?? createEmptyDict()
      })
      ready.value = true
      return dict
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据字典编码和值获取标签文本
   * @param name - 字典编码
   * @param value - 字典值
   * @param fallback - 未找到时的默认值
   */
  function getDictLabel(name: string, value: unknown, fallback = '') {
    const key = String(value ?? '')
    return dict[name]?.label?.[key] ?? fallback
  }

  /** 派生所有字典的 option 列表，key 为字典编码，value 为 DictOption[] */
  const dictOptions = computed(() => Object.fromEntries(Object.entries(dict).map(([name, entry]) => [name, entry.option])))

  // 初始化占位
  names.filter(Boolean).forEach(ensureDict)

  // 自动加载
  if (immediate) onMounted(() => loadDicts())

  return {
    /** 响应式字典数据，可直接在模板中使用 */
    dict,
    /** 派生的 option 列表，适用于下拉组件 columns 属性 */
    dictOptions,
    /** 是否正在加载 */
    loading,
    /** 首次加载是否完成 */
    ready,
    /** 加载单个字典 */
    loadDict,
    /** 批量加载字典 */
    loadDicts,
    /** 根据字典值获取标签文本 */
    getDictLabel,
  }
}
