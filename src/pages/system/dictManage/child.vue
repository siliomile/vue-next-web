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
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="openDialog(`编辑——${row.dictLabel}`, row)"
          >编辑</el-button
        >
        <el-button type="primary" link @click="deleteAccount(row)">删除</el-button>
      </template>
    </ProTable>
    <ImportExcel ref="dialogRef" />
    <FormDialog ref="formDialogRef" />
  </div>
</template>

<script setup lang="tsx" name="dictManage">
import { ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { Dict } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import FormDialog from "@/pages/system/dictManage/components/ChildFormDialog.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus } from "@element-plus/icons-vue";
import { addDictData, editDictData, delDictData, queryDictDataPage } from "@/api/modules/system";
const route = useRoute();

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 分页数据
const pageable = computed(() => proTable.value?.pageable || { curPage: 1, pageSize: 10 });

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ dictId: Number(route.params.id || 0) });

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
  return queryDictDataPage(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps<Dict.ResDictDataDetail>[]>([
  {
    type: "index",
    label: "#",
    width: 80,
    index: (index: number) => (pageable.value.curPage - 1) * pageable.value.pageSize + index + 1,
  },
  {
    prop: "dictLabel",
    label: "字典标签",
    align: "left",
    search: { el: "input" },
  },
  { prop: "dictValue", label: "字典值", align: "left", search: { el: "input" } },
  { prop: "cssClass", align: "left", label: "样式" },
  { prop: "remark", align: "left", label: "备注" },
  { prop: "operation", align: "right", label: "操作", fixed: "right", width: 330 },
]);

// 删除信息
const deleteAccount = async (params: Dict.ResDictDataDetail) => {
  await useHandleData(delDictData, { id: [params.id] }, `删除【${params.dictLabel}】字典数据`);
  proTable.value?.getTableList();
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);

// 新增或编辑角色信息
const formDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const openDialog = (title: string, row: Partial<Dict.ResDictDataDetail> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, ...(title.includes("新增") ? { dictId: Number(route.params.id || 0) } : {}) },
    api: title.includes("新增") ? addDictData : title.includes("编辑") ? editDictData : undefined,
    getTableList: proTable.value?.getTableList,
  };
  formDialogRef.value?.acceptParams(params);
};
</script>
