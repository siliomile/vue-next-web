import { Menu, Role, Dict, Department, Account } from '@/api/interface/index'
import http from '@/api'

// 通用接口响应
export interface ApiResponse<T = any> {
  code: number
  data: T
  msg?: string
}

//#region 菜单接口
// 新增
export const addMenu = (params: any) => {
  return http.post<Menu.ReqMenuParams>(`/research-monitor/menu`, params, { loading: false }) // 正常 post json 请求  ==>  application/json
}

// 编辑
export const editMenu = (params: any) => {
  return http.put<Menu.ReqMenuParams[]>(`/research-monitor/menu`, params, { loading: false })
}

// 获取树
export const getMenuTree = () => {
  return http.get<{ data: Menu.ResMenuTreeVO[] }>(
    `/research-monitor/menu/tree`,
    {},
    { loading: false },
  )
}

// 删除
export const delMenu = (params: any) => {
  return http.delete<{ data: Menu.ReqMenuParams[] }>(
    `/research-monitor/menu/${params.id}`,
    {},
    { loading: false },
  )
}
//#endregion

//#region 角色接口
// 新增
export const addRole = (params: any) => {
  return http.post<Role.ReqRoleParams>(`/research-monitor/role`, params, { loading: false }) // 正常 post json 请求  ==>  application/json
}

// 编辑
export const editRole = (params: any) => {
  return http.put<Role.ReqRoleParams[]>(`/research-monitor/role`, params, { loading: false })
}

// 删除
export const delRole = (params: any) => {
  return http.delete(`/research-monitor/role/${params.id}`, {}, { loading: false })
}
// 启用禁用
export const switchRoleEnabled = (params: any) => {
  return http.put(`/research-monitor/role/enabledSwitch/${params.id}`, {}, { loading: false })
}
// 列表
export const queryRolePage = (params: any) => {
  return http.get<{ data: Role.ResRoleListVO[] }>(`/research-monitor/role/page`, params, {
    loading: true,
  })
}
// 下拉数据
export const queryRoleSelect = (params: any) => {
  return http.get<{ data: Role.ResRoleListVO[] }>(`/role/options`, params, { loading: true })
}
// 详情
export const queryRoleDetail = (params: any) => {
  return http.get<{ date: Role.ResRoleDetailVO }>(
    `/research-monitor/role/${params.id}`,
    {},
    { loading: true },
  )
}
//#endregion

//#region 字典接口
// 新增
export const addDict = (params: any) => {
  return http.post<Dict.ReqDictParams>(`/research-monitor/dict`, params, { loading: false }) // 正常 post json 请求  ==>  application/json
}

// 编辑
export const editDict = (params: any) => {
  return http.put<Dict.ReqDictParams[]>(`/research-monitor/dict`, params, { loading: false })
}

// 删除
export const delDict = (params: any) => {
  return http.delete(`/research-monitor/dict/${params.id}`, {}, { loading: false })
}
// code查询
export const queryDictDataByCode = (code: any) => {
  return http.get(`/research-monitor/dict/code/${code}`, {}, { loading: true })
}
// 列表
export const queryDictPage = (params: any) => {
  return http.get<{ data: Dict.ResDictListVO[] }>(`/research-monitor/dict/page`, params, {
    loading: true,
  })
}
// 详情
export const queryDictDetail = (params: any) => {
  return http.get<{ date: Dict.ResDictDetailVO }>(
    `/research-monitor/dict/${params.id}`,
    {},
    { loading: true },
  )
}

//#endregion

//#region 字典数据接口
// 新增
export const addDictData = (params: any) => {
  return http.post<Dict.ReqDictDataParams>(`/research-monitor/dictData`, params, {
    loading: false,
  }) // 正常 post json 请求  ==>  application/json
}

// 编辑
export const editDictData = (params: any) => {
  return http.put<Dict.ReqDictDataParams[]>(`/research-monitor/dictData`, params, {
    loading: false,
  })
}

// 删除
export const delDictData = (params: any) => {
  return http.delete(`/research-monitor/dictData/${params.id}`, {}, { loading: false })
}
// 列表
export const queryDictDataPage = (params: any) => {
  return http.get<{ data: Dict.ResDictDataDetail[] }>(`/research-monitor/dictData/page`, params, {
    loading: true,
  })
}
// 详情
export const queryDictDataDetail = (params: any) => {
  return http.get<{ date: Dict.ResDictDataDetail }>(
    `/research-monitor/dictData/${params.id}`,
    {},
    { loading: true },
  )
}

//#endregion

//#region 账号接口
// 新增
export const addAccount = (params: any) => {
  return http.post<Account.ReqParams>(`/research-monitor/user`, params, { loading: false }) // 正常 post json 请求  ==>  application/json
}

// 编辑
export const editAccount = (params: any) => {
  return http.put<Account.ReqParams[]>(`/research-monitor/user`, params, { loading: false })
}

// 删除
export const delAccount = (params: any) => {
  return http.delete(`/research-monitor/user/${params.id}`, {}, { loading: false })
}
// 启用禁用
export const switchAccountEnabled = (params: any) => {
  return http.put(`/research-monitor/user/enabledSwitch/${params.id}`, {}, { loading: false })
}
// 重置密码
export const restPassword = (params: any) => {
  return http.put(`/research-monitor/user/resetPasswd`, params, { loading: false })
}
// 列表
export const queryAccountPage = (params: any) => {
  return http.get<{ data: Account.ResListVO[] }>(`/research-monitor/user/page`, params, {
    loading: true,
  })
}
// 详情
export const queryAccountDetail = (params: any) => {
  return http.get<{ date: Account.ResListVO }>(
    `/research-monitor/user/${params.id}`,
    {},
    { loading: true },
  )
}
//#endregion

//#region 机构接口
// 新增
export const addDepartment = (params: any) => {
  return http.post<Department.ReqParams>(`/research-monitor/dept`, params, { loading: false }) // 正常 post json 请求  ==>  application/json
}

// 编辑
export const editDepartment = (params: any) => {
  return http.put<Department.ReqParams[]>(`/research-monitor/dept`, params, { loading: false })
}

// 删除
export const delDepartment = (params: any) => {
  return http.delete(`/research-monitor/dept/${params.id}`, {}, { loading: false })
}
// 启用禁用
export const switchDepartmentEnabled = (params: any) => {
  return http.put(`/research-monitor/dept/enabledSwitch/${params.id}`, {}, { loading: false })
}
// 列表
export const queryDepartmentPage = (params: any) => {
  return http.get<{ data: Department.ResListVO[] }>(`/research-monitor/dept/page`, params, {
    loading: true,
  })
}
// 树
export const queryDepartmentTree = (params: any) => {
  return http.get(`/research-monitor/dept/tree`, params, { loading: true })
}
// 详情
export const queryDepartmentDetail = (params: any) => {
  return http.get<{ date: Department.ResListVO }>(
    `/research-monitor/dept/${params.id}`,
    {},
    { loading: true },
  )
}
//#endregion
