<template>
  <el-dialog
    v-model="dialogVisible"
    :title="parameter.title"
    :destroy-on-close="true"
    width="800px"
    draggable
  >
    <el-form
      ref="ruleFormRef"
      class="role-manage-form"
      label-position="top"
      :model="parameter.row"
      :rules="rules"
    >
      <div class="left">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="parameter.row.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="parameter.row.code" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            v-model="parameter.row.description"
            :rows="3"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-radio-group v-model="parameter.row.enabled">
            <el-radio :value="false">禁用</el-radio>
            <el-radio :value="true">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="right">
        <i>菜单</i>
        <div>
          <el-tree
            ref="treeRef"
            :data="menuData"
            check-strictly
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="checkedKeys"
            :props="menuTreeProps"
          />
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="FormDialog">
import { ref, reactive } from "vue";
import { Menu, Role } from "@/api/interface";
import { useAuthStore } from "@/stores/modules/auth";
import type { FormInstance, TreeInstance } from "element-plus";
import { getMenuTree, queryRoleDetail } from "@/api/modules/system";
import { ElMessage } from "element-plus";
const authStore = useAuthStore();
const menuTreeProps = {
  label: "name",
};
export interface FormParameterProps {
  title: string; // 标题
  isView?: boolean;
  row: Partial<Role.ReqRoleParams>;
  api: (params: any) => Promise<any>;
  getTableList?: () => void; // 获取表格数据的Api
}
const menuData = ref<Menu.ResMenuTreeVO[]>([]);
const rules = reactive({
  name: [{ required: true, message: "请填写角色名称" }],
  code: [{ required: true, message: "请填写角色编码" }],
});

const checkedKeys = ref<number[]>([]);
const getMenuData = async () => {
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
// tree
const treeRef = ref<TreeInstance>();
// dialog状态
const dialogVisible = ref(false);
// 父组件传过来的参数
const parameter = ref<FormParameterProps>({
  title: "", // 默认空标题
  isView: false, // 默认非查看模式
  row: {}, // 默认空对象
  api: async () => Promise.resolve(), // 默认空 Promise 防止调用时报错
  getTableList: undefined,
});

// 接收父组件参数
const acceptParams = (params: FormParameterProps) => {
  parameter.value = { ...parameter.value, ...params };
  getMenuData();
  params.row.id && detail(params.row.id!);
  dialogVisible.value = true;
};

// 获取详情
const detail = async (id: number) => {
  try {
    const {
      code,
      data: { menuIds, ...rest },
    } = await queryRoleDetail({ id });

    if (code !== 200) return;
    parameter.value.row = { ...parameter.value.row, ...rest };

    checkedKeys.value = Array.isArray(menuIds) ? menuIds : [];
  } catch (error) {
    console.error("查询角色详情失败：", error);
  }
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return;
    try {
      const menuIds = treeRef.value!.getCheckedKeys(false);
      await parameter.value.api!({ ...parameter.value.row, menuIds });
      ElMessage.success({ message: `${parameter.value.title}成功！` });
      parameter.value.getTableList!();
      authStore.getPermissionInfo();
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
defineExpose({
  acceptParams,
});
</script>
<style lang="scss" scoped>
@use "@/assets/styles/base.scss" as *;
.role-manage-form {
  display: flex;
  gap: 0 32px;
  .left {
    display: flex;
    flex-direction: column;
    gap: 24px 0;
    flex: 0 0 auto;
    min-width: 20vw;
  }
  .right {
    flex: 1;
  }
  :deep(.el-form-item__label) {
    height: auto !important;
    line-height: 1 !important;
  }
  :deep(.el-radio) {
    height: auto !important;
  }
  :deep(.el-radio-group) {
    gap: 0 28px;
  }
}
</style>
