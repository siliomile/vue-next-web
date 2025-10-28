<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="path"
      :pagination="false"
      :indent="20"
      :columns="columns"
      :data="menuData"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')"
          >新增菜单
        </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18" v-if="scope.row.icon">
          <component :is="scope.row.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link @click="openDialog('编辑', row)"> 编辑 </el-button>
        <el-button type="primary" link @click="handleDelete(row)"> 删除 </el-button>
      </template>
    </ProTable>
    <FormDialog ref="formDialogRef" />
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref, onMounted } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus } from "@element-plus/icons-vue";
import { Menu } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";

import { addMenu, editMenu, getMenuTree, delMenu } from "@/api/modules/system";
import FormDialog from "@/pages/system/menuMange/components/FormDialog.vue";
import ProTable from "@/components/ProTable/index.vue";

const proTable = ref();
const menuData = ref<Menu.ResMenuTreeVO[]>([]);

onMounted(async () => {
  getTableList();
});

const getTableList = async () => {
  const res = await getMenuTree();
  if (Array.isArray(res.data)) {
    menuData.value = transformToCascaderOptions(res.data);
  }
};
/**
 * 递归转换树结构为 Cascader 所需格式
 */
const transformToCascaderOptions = (list: Menu.ResMenuTreeVO[]): Menu.ResMenuTreeVO[] => {
  return list.map((item) => ({
    ...item,
    ...(item.children?.length ? { children: transformToCascaderOptions(item.children) } : {}),
  }));
};
// 表格配置项
const columns: ColumnProps[] = [
  { prop: "name", label: "菜单名称", align: "left", search: { el: "input" } },
  { prop: "icon", label: "菜单图标" },
  { prop: "routeName", align: "left", label: "菜单 name", search: { el: "input" } },
  { prop: "path", align: "left", label: "菜单路径", width: 300, search: { el: "input" } },
  { prop: "component", align: "left", label: "组件路径", width: 300 },
  { prop: "sort", align: "left", label: "排序", width: 60 },
  { prop: "operation", align: "right", label: "操作", width: 120, fixed: "right" },
];
// 新增或编辑
const formDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);
const openDialog = (title: string, row: Partial<Menu.ResMenuDetailVO> = {}) => {
  const { ...restRow } = row || {};
  const params = {
    title,
    isView: title === "查看",
    row: {
      ...restRow,
      ...(title.includes("新增")
        ? {
            isHide: false,
            isFull: false,
            isAffix: false,
            keepAlive: true,
            enabled: true,
            sort: 1,
            parentId: 0,
            menuType: 1,
          }
        : {}),
    },
    api: title.includes("新增") ? addMenu : title === "编辑" ? editMenu : undefined,
    getTableList,
  };
  formDialogRef.value?.acceptParams(params);
};

// 删除用户信息
const handleDelete = async (params: Menu.ReqMenuParams) => {
  await useHandleData(delMenu, { id: [params.id] }, `删除【${params.name}】菜单`);
  getTableList();
};
</script>
