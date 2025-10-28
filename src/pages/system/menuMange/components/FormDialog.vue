<template>
  <el-dialog
    v-model="dialogVisible"
    :title="parameter.title"
    :destroy-on-close="true"
    width="650px"
    draggable
  >
    <el-form
      ref="ruleFormRef"
      class="menu-manage-form"
      label-position="top"
      :model="parameter.row"
      :rules="rules"
    >
      <el-form-item label="父级菜单" prop="parentId">
        <el-cascader
          ref="cascaderRef"
          clearable
          filterable
          v-model="parameter.row.parentId"
          :options="cascaderOptions"
          :props="cascaderProps"
          @change="onChangeCascader"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="parameter.row.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <SelectIcon v-model:icon-value="parameter.row.icon!" />
      </el-form-item>
      <el-form-item label="菜单name" prop="routeName">
        <el-input v-model="parameter.row.routeName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="菜单路径" prop="path">
        <el-input v-model="parameter.row.path" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model="parameter.row.component" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="是否在菜单中隐藏" prop="isHide">
        <el-radio-group v-model="parameter.row.isHide">
          <el-radio :value="false">否</el-radio>
          <el-radio :value="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否全屏" prop="isFull">
        <el-radio-group v-model="parameter.row.isFull">
          <el-radio :value="false">否</el-radio>
          <el-radio :value="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否固定在标签页" prop="isAffix">
        <el-radio-group v-model="parameter.row.isAffix">
          <el-radio :value="false">否</el-radio>
          <el-radio :value="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否缓存路由" prop="keepAlive">
        <el-radio-group v-model="parameter.row.keepAlive">
          <el-radio :value="false">否</el-radio>
          <el-radio :value="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否启用" prop="enabled">
        <el-radio-group v-model="parameter.row.enabled">
          <el-radio :value="false">否</el-radio>
          <el-radio :value="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="parameter.row.sort" placeholder="请输入" />
      </el-form-item>
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
import { Menu } from "@/api/interface";
import { useAuthStore } from "@/stores/modules/auth";
import SelectIcon from "@/components/SelectIcon/index.vue";
import type { FormInstance, ElCascader } from "element-plus";
import { getMenuTree } from "@/api/modules/system";
import { ElMessage } from "element-plus";
const authStore = useAuthStore();
interface FormParameterProps {
  title: string; // 标题
  isView?: boolean;
  row: Partial<Menu.ResMenuDetailVO>;
  api: (params: any) => Promise<any>;
  getTableList?: () => void; // 获取表格数据的Api
}

// 父菜单选择树属性
const cascaderProps = {
  checkStrictly: true,
  value: "id",
  label: "name",
};

// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: "请填写菜单名称" }],
  routeName: [{ required: true, message: "请填写菜单name" }],
  path: [{ required: true, message: "请填写菜单路径" }],
  component: [{ required: true, message: "请填写组件路径" }],
});
/**
 * 递归转换树结构为 Cascader 所需格式
 */
function transformToCascaderOptions(list: Menu.ResMenuTreeVO[]): Menu.ResMenuTreeVO[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => !item.isHide)
    .map((item) => {
      const children = item.children?.length
        ? transformToCascaderOptions(item.children)
        : undefined;
      return {
        ...item,
        ...(children ? { children } : {}),
      };
    });
}
// 父菜单选择树实例
const cascaderRef = ref<InstanceType<typeof ElCascader> | null>(null);

const onChangeCascader = () => {
  const cascader = cascaderRef.value;
  if (!cascader) return;

  // 获取选中节点对象数组
  const nodes = cascader.getCheckedNodes(false);
  if (!nodes || nodes.length === 0) return;

  const nodeData = nodes[0].data as { id?: number; menuType?: number };

  // 安全赋值
  parameter.value.row.parentId = nodeData.id;
  if (nodeData.menuType !== undefined) {
    const typeMap = {
      0: 1,
      1: 2,
      2: 3,
    };
    parameter.value.row.menuType = typeMap[nodeData.menuType];
  }
};
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
// 父菜单选择树
const cascaderOptions = ref<Menu.ResMenuTreeVO[]>([]);
// 接收父组件参数
const acceptParams = async (params: FormParameterProps) => {
  const { data } = await getMenuTree();
  if (Array.isArray(data)) {
    cascaderOptions.value = transformToCascaderOptions(data);
  }
  parameter.value = { ...parameter.value, ...params };
  dialogVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return;
    try {
      await parameter.value.api!({ ...parameter.value.row });
      ElMessage.success({ message: `${parameter.value.title}菜单成功！` });
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
.menu-manage-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0px, 1fr));
  gap: 24px;
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
  :deep(.el-cascader) {
    width: 100%;
  }
}
</style>
