<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      stripe
      :border="false"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增</el-button>
      </template>
      <template #roleList="{ row }">
        <div class="flex gap-2" v-if="row.roleList && row.roleList.length">
          <el-tag type="primary" v-for="role in row.roleList" :key="role.id">{{
            role.name
          }}</el-tag>
        </div>
        <i v-else>/</i>
      </template>
      <template #deptList="{ row }">
        <div class="flex gap-2" v-if="row.deptList && row.deptList.length">
          <el-tag type="info" v-for="role in row.deptList" :key="role.id">{{ role.name }}</el-tag>
        </div>
        <i v-else>/</i>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="openDialog(`编辑——${row.nickname}`, row)"
          >编辑</el-button
        >
        <el-button type="primary" link @click="handleRestPassword(row)">重置密码</el-button>
        <el-button type="primary" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>
    <FormDialog ref="formDialogRef" />
    <RestPasswordDialog ref="restPasswordDialogRef" />
  </div>
</template>

<script setup lang="tsx" name="accountManage">
import { ref, reactive, computed } from "vue";
import { Account } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import FormDialog from "@/pages/system/accountManage/components/FormDialog.vue";
import RestPasswordDialog from "@/pages/system/accountManage/components/RestPasswordDialog.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus } from "@element-plus/icons-vue";
import {
  addAccount,
  editAccount,
  delAccount,
  switchAccountEnabled,
  queryAccountPage,
  restPassword,
} from "@/api/modules/system";
import { useDict } from "@/hooks/useDict";
const dict = useDict(["custom_status"]);

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 分页数据
const pageable = computed(() => proTable.value?.pageable || { curPage: 1, pageSize: 10 });

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return queryAccountPage(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps<Account.ResListVO>[]>([
  {
    type: "index",
    label: "#",
    width: 80,
    index: (index: number) => (pageable.value.curPage - 1) * pageable.value.pageSize + index + 1,
  },
  {
    prop: "nickname",
    label: "姓名",
    align: "left",
    search: { el: "input" },
  },
  { prop: "phone", label: "手机号", align: "left", search: { el: "input" } },
  { prop: "roleList", label: "角色", align: "left" },
  { prop: "deptList", label: "所属部门", align: "left" },
  {
    prop: "enabled",
    label: "状态",
    align: "left",
    enum: computed(() => dict.custom_status?.option || []),
    search: { el: "select" },
    render: (scope) => {
      return (
        <>
          <el-switch
            model-value={scope.row.enabled}
            active-text={scope.row.enabled ? "启用" : "禁用"}
            active-value={true}
            inactive-value={false}
            onClick={() => changeStatus(scope.row)}
          />
          {/* {BUTTONS.value.enabled ? (
            <el-switch
              model-value={scope.row.enabled}
              active-text={scope.row.enabled ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.enabled ? "success" : "danger"}>
              {scope.row.enabled ? "启用" : "禁用"}
            </el-tag>
          )} */}
        </>
      );
    },
  },
  {
    prop: "lastLoginTime",
    label: "最近登录时间",
    width: 160,
    align: "left",
  },
  { prop: "operation", label: "操作", align: "right", fixed: "right", width: 200 },
]);

// 删除信息
const handleDelete = async (params: Account.ResListVO) => {
  await useHandleData(delAccount, { id: [params.id] }, `删除【${params.nickname}】账号`);
  proTable.value?.getTableList();
};

// 切换状态
const changeStatus = async (row: Account.ResListVO) => {
  await useHandleData(switchAccountEnabled, { id: row.id }, `切换【${row.nickname}】状态`);
  proTable.value?.getTableList();
};

// 重置密码
const restPasswordDialogRef = ref<InstanceType<typeof RestPasswordDialog> | null>(null);
const handleRestPassword = async (row: Account.ResListVO) => {
  const params = {
    title: "重置密码",
    isView: false,
    row: { ...row, ...(row.id ? {} : { enabled: true }) },
    api: restPassword,
    getTableList: proTable.value?.getTableList,
  };
  restPasswordDialogRef.value?.acceptParams(params);
};

// 新增或编辑角色信息
const formDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const openDialog = (title: string, row: Partial<Account.ResListVO> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, ...(row.id ? {} : { enabled: true }) },
    api: title.includes("新增") ? addAccount : title.includes("编辑") ? editAccount : undefined,
    getTableList: proTable.value?.getTableList,
  };
  formDialogRef.value?.acceptParams(params);
};
</script>
