import { defineStore } from "pinia";
import { reactive, toRaw } from "vue";

export interface DictOption {
  value: string | number;
  label: string;
}

export interface DictEntry {
  option: DictOption[];
  label: Record<string | number, string>;
}

export const useDictStore = defineStore(
  "dict",
  () => {
    // reactive 原始缓存
    const cache = reactive<Record<string, DictEntry>>({});

    // 写入字典
    function setDict(name: string, entry: DictEntry) {
      cache[name] = {
        option: [...entry.option],
        label: { ...entry.label },
      };
    }

    // 取字典（返回 readonly 避免直接修改 Pinia store）
    function getDict(name: string): DictEntry {
      const entry = cache[name];
      return entry
        ? {
            option: [...entry.option],
            label: { ...entry.label },
          }
        : { option: [], label: {} };
    }

    return { cache, setDict, getDict };
  },
  {
    persist: {
      key: "DICT_STORE",
      storage: localStorage,
      paths: ["cache"],
    } as any,
  },
);
