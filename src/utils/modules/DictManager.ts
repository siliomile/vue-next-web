/*
 * @Author: silio
 * @Date: 2026/06/04
 * @FilePath: src/utils/modules/DictManager.ts
 * @Description: 字典缓存管理器，提供内存缓存、去重加载、批量加载能力（迁移自 party-dues-pc）
 *
 * 使用示例：
 *
 * ```ts
 * import DictManager from '@/utils/modules/DictManager'
 *
 * // 1. 加载单个字典
 * const gender = await DictManager.load('gender')
 * console.log(gender.option)  // [{ label: '男', value: '1', raw: ... }, ...]
 * console.log(gender.label)   // { '1': '男', '2': '女' }
 *
 * // 2. 批量加载
 * const [gender, nation] = await DictManager.loadMany(['gender', 'nation'])
 *
 * // 3. 手动设置缓存
 * DictManager.set('custom', [{ dictValue: '1', dictLabel: '选项A' }])
 *
 * // 4. 读取缓存（不会发起请求）
 * const cached = DictManager.get('gender')
 *
 * // 5. 清除缓存
 * DictManager.remove('gender')  // 清除单个
 * DictManager.clear()           // 清除全部
 * ```
 */
import type { Dict, ResultData } from '@/api/interface'
import { queryDictDataByCode } from '@/api/modules/dict'

/**
 * 服务端返回的原始字典项结构
 * 兼容两种字段命名：dictValue/dictLabel 和 value/label
 */
export interface RawDictItem extends Omit<Dict.ResDictDataDetail, 'dictValue'> {
  /** 字典值（优先） */
  dictValue?: string | number | boolean
  /** 字典标签（优先） */
  dictLabel?: string
  /** 字典标签（备选） */
  label?: string
  /** 兼容其他备注/描述字段 */
  dictRemark?: string
  description?: string
  desc?: string
  range?: string
  /** 字典值（备选） */
  value?: string | number | boolean
  [key: string]: unknown
}

/** 字典值类型 */
export type DictValue = string | number | boolean

/** 标准化的字典选项，用于下拉框等组件 */
export interface DictOption {
  /** 显示文本 */
  label: string
  /** 选项值 */
  value: DictValue
  /** 原始数据 */
  raw: RawDictItem
}

/** 单个字典编码的完整数据结构 */
export interface DictEntry {
  /** 选项列表，可直接用于 u-picker / u-select 等组件 */
  option: DictOption[]
  /** 值 -> 标签映射表，用于快速根据值获取显示文本 */
  label: Record<string, string>
  /** 原始数据列表 */
  raw: RawDictItem[]
}

/** 字典缓存池，key 为字典编码 */
export type DictCache = Record<string, DictEntry>

/** 空字典占位，避免返回 undefined */
const EMPTY_DICT: DictEntry = {
  option: [],
  label: {},
  raw: [],
}

/** 正在加载中的请求映射，用于去重防止重复请求 */
const loadingMap: Record<string, Promise<DictEntry> | undefined> = {}

/** 内存缓存 */
let memoryCache: DictCache = {}

/**
 * 将 PC 端 HTTP 响应拆为字典数组
 * H5 端 HTTP 会直接返回 data，PC 端 HTTP 返回 ResultData<T>
 */
function resolveRawDictData(response: RawDictItem[] | ResultData<RawDictItem[]> | unknown): RawDictItem[] {
  if (Array.isArray(response)) return response

  if (response && typeof response === 'object' && Array.isArray((response as ResultData<RawDictItem[]>).data)) return (response as ResultData<RawDictItem[]>).data

  return []
}

/**
 * 将字典值统一为 boolean、number 或 string
 * 数字字符串会被转为 number 类型
 */
function normalizeValue(value: unknown): DictValue {
  if (typeof value === 'boolean') return value

  if (typeof value === 'number') return value

  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value)

  return String(value ?? '')
}

function getRawRemark(item: RawDictItem) {
  const nestedRaw = item.raw && typeof item.raw === 'object' ? (item.raw as Record<string, unknown>) : {}
  return item.remark ?? item.dictRemark ?? item.description ?? item.desc ?? item.range ?? nestedRaw.remark
}

/**
 * 将服务端原始字典数据构建为标准 DictEntry
 * @param rawDict - 服务端返回的原始字典项数组
 * @returns 包含 option / label / raw 的标准结构
 */
export function buildDictEntryFromRaw(rawDict: RawDictItem[] = []): DictEntry {
  if (!Array.isArray(rawDict)) return { ...EMPTY_DICT }

  return rawDict.reduce<DictEntry>(
    (entry, item) => {
      const value = normalizeValue(item.dictValue ?? item.value)
      const label = String(item.dictLabel ?? item.label ?? '')
      const raw: RawDictItem = {
        ...item,
        value,
        label,
        remark: String(getRawRemark(item) ?? ''),
      }

      entry.label[String(value)] = label
      entry.option.push({
        value,
        label,
        raw,
      })
      entry.raw.push(raw)

      return entry
    },
    {
      option: [],
      label: {},
      raw: [],
    },
  )
}

/**
 * 字典管理器单例
 * - 内存缓存：同一字典编码只请求一次
 * - 请求去重：并发加载同一字典时复用同一个 Promise
 * - 支持手动 set / remove / clear 管理缓存
 */
export const DictManager = {
  /** 获取完整缓存对象（调试用） */
  getCache() {
    return memoryCache
  },

  /**
   * 从缓存获取字典，未缓存时返回空结构（不发起请求）
   * @param name - 字典编码
   */
  get(name: string) {
    return memoryCache[name] ?? { ...EMPTY_DICT }
  },

  /**
   * 加载字典数据，带缓存和去重
   * - 已缓存：直接返回
   * - 正在加载中：复用同一 Promise
   * - 未加载：发起请求并缓存结果
   * @param name - 字典编码
   * @returns DictEntry
   */
  async load(name: string) {
    if (!name) return { ...EMPTY_DICT }

    // 已缓存，直接返回
    if (memoryCache[name]) return memoryCache[name]

    // 正在加载中，复用 Promise
    if (loadingMap[name]) return loadingMap[name]

    // 发起请求
    const loading = (async () => {
      try {
        const response = await queryDictDataByCode(name)
        const data = resolveRawDictData(response)
        const dictEntry = buildDictEntryFromRaw(data)
        memoryCache[name] = dictEntry
        return dictEntry
      } catch (error) {
        console.error(`Failed to load dict: ${name}`, error)
        return { ...EMPTY_DICT }
      } finally {
        delete loadingMap[name]
      }
    })()

    loadingMap[name] = loading
    return loading
  },

  /**
   * 批量加载多个字典（并行），自动去重
   * @param names - 字典编码数组
   * @returns DictEntry 数组，顺序与 names 一致
   */
  async loadMany(names: string[] = []) {
    const uniqueNames = Array.from(new Set(names.filter(Boolean)))
    return Promise.all(uniqueNames.map((name) => this.load(name)))
  },

  /**
   * 手动设置字典缓存（用于本地 mock 或动态数据）
   * @param name - 字典编码
   * @param rawDict - 原始字典项数组
   */
  set(name: string, rawDict: RawDictItem[] = []) {
    const dictEntry = buildDictEntryFromRaw(rawDict)
    memoryCache[name] = dictEntry
    return dictEntry
  },

  /** 移除指定字典缓存 */
  remove(name: string) {
    delete memoryCache[name]
    delete loadingMap[name]
  },

  /** 清空全部字典缓存 */
  clear() {
    memoryCache = {}
    Object.keys(loadingMap).forEach((key) => delete loadingMap[key])
  },
}

export default DictManager
