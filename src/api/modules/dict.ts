import { DictData, SysDictData, SysDictType } from "@/api/interface/index";
import http from "@/api";

/**
 * @name 字典数据模块（迁移自 party-dues-pc）
 */
// 新增字典数据
export const addDictData = (params: DictData.AddDictDataPayload) => {
  return http.post<DictData.RawDictItem>(`/admin-api/system/dict-data/create`, params);
};

// 根据字典编码获取字典数据列表
export const getDictByCode = (code: string) => {
  return http.get<DictData.RawDictItem[]>(`/admin-api/dict/code/${code}`);
};

// 根据参数获取字典数据平铺列表
export const getDictListByCode = (params: DictData.DictListParams) => {
  return http.get<DictData.RawDictItem[]>(`/admin-api/dict/dictData/list`, params);
};

// 根据参数获取字典数据树形结构
export const getDictTreeByCode = (params: DictData.DictListParams) => {
  return http.get<DictData.RawDictItem[]>(`/admin-api/dict/dictData/tree`, params);
};

// 根据字典编码查询字典数据（供 DictManager 使用，不显示全局 loading）
export const queryDictDataByCode = (code: string) => {
  return http.get<DictData.RawDictItem[]>(`/admin-api/dict/code/${code}`, {}, { loading: false });
};

/* ------------------------------ 字典类型 ------------------------------ */

// 获得字典类型的分页
export const getDictTypePage = (params: { pageNo?: number; pageSize?: number; name?: string; type?: string; status?: number; [key: string]: any }) => {
  return http.get<{ list: SysDictType.Resp[]; total: number }>(`/admin-api/system/dict-type/page`, params);
};

// 获得全部字典类型列表
export const getDictTypeSimpleList = () => {
  return http.get<SysDictType.SimpleResp[]>(`/admin-api/system/dict-type/list-all-simple`);
};

// 查询字典类型详细
export const getDictTypeDetail = (id: number) => {
  return http.get<SysDictType.Resp>(`/admin-api/system/dict-type/get`, { id });
};

// 创建字典类型
export const createDictType = (params: SysDictType.Req) => {
  return http.post<number>(`/admin-api/system/dict-type/create`, params);
};

// 修改字典类型
export const updateDictType = (params: SysDictType.Req) => {
  return http.put<boolean>(`/admin-api/system/dict-type/update`, params);
};

// 删除字典类型
export const deleteDictType = (id: number | string) => {
  return http.delete<boolean>(`/admin-api/system/dict-type/delete`, { id });
};

/* ------------------------------ 字典数据 ------------------------------ */

// 获得字典数据的分页
export const getDictDataPage = (params: { pageNo?: number; pageSize?: number; label?: string; dictType?: string; status?: number; [key: string]: any }) => {
  return http.get<{ list: SysDictData.Resp[]; total: number }>(`/admin-api/system/dict-data/page`, params);
};

// 查询字典数据详细
export const getDictDataDetail = (id: number) => {
  return http.get<SysDictData.Resp>(`/admin-api/system/dict-data/get`, { id });
};

// 新增字典数据
export const createDictData = (params: SysDictData.Req) => {
  return http.post<number>(`/admin-api/system/dict-data/create`, params);
};

// 修改字典数据
export const updateDictData = (params: SysDictData.Req) => {
  return http.put<boolean>(`/admin-api/system/dict-data/update`, params);
};

// 删除字典数据
export const deleteDictData = (id: number | string) => {
  return http.delete<boolean>(`/admin-api/system/dict-data/delete`, { id });
};
