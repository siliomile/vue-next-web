import { reactive, toRaw } from "vue";
import { useDictStore, DictEntry, DictOption } from "@/stores/modules/dict";
import { queryDictDataByCode } from "@/api/modules/system";

type DictCache = Record<string, DictEntry>;

const store = useDictStore();
const cache: DictCache = reactive({});

function buildDictEntry(raw: any[]): DictEntry {
  if (!Array.isArray(raw)) return { option: [], label: {} };
  const option: DictOption[] = raw.map(({ dictValue, dictLabel }) => ({
    value: dictValue,
    label: dictLabel,
  }));
  const label: Record<string | number, string> = {};
  option.forEach(({ value, label: l }) => (label[value] = l));
  return { option, label };
}

// 异步加载字典
export async function loadDict(name: string): Promise<DictEntry> {
  const storeEntry = toRaw(store.getDict(name)); // 拿原始对象
  if (storeEntry.option.length) {
    cache[name] = {
      option: [...storeEntry.option],
      label: { ...storeEntry.label },
    };
    return cache[name];
  }

  if (!cache[name]) cache[name] = { option: [], label: {} };

  try {
    const res = await queryDictDataByCode(name);
    if (res?.code === 200 && Array.isArray(res.data)) {
      const entry = buildDictEntry(res.data);
      cache[name] = entry;
      store.setDict(name, entry); // 写入 Pinia + 本地缓存
    }
  } catch (err) {
    console.error(`[useDict] 加载字典 ${name} 失败`, err);
  }

  return cache[name];
}

/**
 * useDict hook
 * @param names 字典名称数组
 */
export function useDict(names: string[]): DictCache {
  names.forEach((name) => {
    if (!cache[name]) cache[name] = { option: [], label: {} };
    loadDict(name);
  });
  return cache;
}
