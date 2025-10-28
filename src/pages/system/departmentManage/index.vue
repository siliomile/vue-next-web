<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      stripe
      :border="false"
      :pagination="false"
      :request-api="getTableList"
      :columns="columns"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')">新增</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="openDialog(`编辑——${row.name}`, row)"
          >编辑</el-button
        >
        <el-button type="primary" link @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>
    <FormDialog ref="formDialogRef" />
  </div>
</template>

<script setup lang="tsx" name="departmentManage">
import { ref, reactive, computed } from "vue";
import { Department } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import FormDialog from "@/pages/system/departmentManage/components/FormDialog.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus } from "@element-plus/icons-vue";
import {
  addDepartment,
  editDepartment,
  delDepartment,
  switchDepartmentEnabled,
  queryDepartmentTree,
} from "@/api/modules/system";
import { useDict } from "@/hooks/useDict";
const dict = useDict(["organ_attribute", "custom_status"]);

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 分页数据
const pageable = computed(() => proTable.value?.pageable || { curPage: 1, pageSize: 10 });

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
const getTableList = async (params) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return queryDepartmentTree(newParams);
};

const dataCallback = (data: any) => {
  return data;
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps<Department.ResListVO>[]>([
  {
    type: "index",
    label: "#",
    width: 80,
    index: (index: number) => (pageable.value.curPage - 1) * pageable.value.pageSize + index + 1,
  },
  {
    prop: "name",
    label: "机构名称",
    align: "left",
    search: { el: "input" },
  },
  // {
  //   prop: "property",
  //   label: "机构属性",
  //   enum: computed(() => dict.organ_attribute?.option || []),
  //   isFilterEnum: true,
  //   align: "left",
  //   search: { el: "select" },
  // },
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
    prop: "createTime",
    label: "创建时间",
    width: 180,
  },
  { prop: "operation", label: "操作", align: "right", fixed: "right", width: 330 },
]);

// 删除信息
const handleDelete = async (params: Department.ResListVO) => {
  await useHandleData(delDepartment, { id: [params.id] }, `删除【${params.name}】角色`);
  proTable.value?.getTableList();
};

// 切换状态
const changeStatus = async (row: Department.ResListVO) => {
  await useHandleData(switchDepartmentEnabled, { id: row.id }, `切换【${row.name}】角色状态`);
  proTable.value?.getTableList();
};

// 新增或编辑角色信息
const formDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const openDialog = (title: string, row: Partial<Department.ResListVO> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, ...(row.id ? {} : { enabled: true }) },
    api: title.includes("新增")
      ? addDepartment
      : title.includes("编辑")
        ? editDepartment
        : undefined,
    getTableList: proTable.value?.getTableList,
  };
  formDialogRef.value?.acceptParams(params);
};
</script>
