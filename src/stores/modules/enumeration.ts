import { defineStore } from 'pinia'
import { Enumeration, AreaRequest } from '@/api/interface'
import piniaPersistConfig from '@/stores/helper/persist'

interface EnumerationList {
  enumerationList: Enumeration[]
  areaList: AreaRequest[]
}

export const useEnumerationStore = defineStore(
  'geeker-enumeration', // ✅ 第一个参数必须是 id 字符串
  {
    state: (): EnumerationList => ({
      enumerationList: [],
      areaList: [],
    }),
    getters: {},
    actions: {
      // 多例枚举
      setEnumerationList(enumerationList: Enumeration[]) {
        this.enumerationList = enumerationList
      },

      // 地区
      setAreaList(areaList: AreaRequest[]) {
        this.areaList = areaList
      },
    },
    persist: piniaPersistConfig('geeker-enumeration'), // ✅ 持久化配置
  },
)
