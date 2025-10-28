<template>
  <el-dialog
    v-model="dialogVisible"
    :title="parameter.title"
    :destroy-on-close="true"
    width="500px"
    draggable
  >
    <el-form
      ref="ruleFormRef"
      class="role-manage-form"
      label-position="top"
      :model="parameter.row"
      :rules="rules"
    >
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="parameter.row.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="上级机构" prop="parentId">
        <!-- <el-input v-model="parameter.row.parentId" placeholder="请输入" /> -->
        <el-cascader :props="cascaderProps" v-model="parameter.row.parentId" :options="organData" />
      </el-form-item>
      <!-- <el-form-item label="备注" prop="description">
        <el-input
          v-model="parameter.row.description"
          :rows="3"
          type="textarea"
          placeholder="请输入"
        />
      </el-form-item> -->
      <el-form-item label="是否启用" prop="enabled">
        <el-radio-group v-model="parameter.row.enabled">
          <el-radio :value="false">禁用</el-radio>
          <el-radio :value="true">启用</el-radio>
        </el-radio-group>
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
import { Department } from "@/api/interface";
import type { FormInstance } from "element-plus";
import { queryDepartmentTree } from "@/api/modules/system";
import { ElMessage } from "element-plus";
export interface FormParameterProps {
  title: string; // 标题
  isView?: boolean;
  row: Partial<Department.ResListVO>;
  api: (params: any) => Promise<any>;
  getTableList?: () => void; // 获取表格数据的Api
}
const cascaderProps = {
  expandTrigger: "hover" as const,
  checkStrictly: true,
  filterable: true,
  value: "id",
  label: "name",
};
// 树结构
const organData = ref<Department.ResListVO[]>([]);
// 表单验证
const rules = reactive({
  name: [{ required: true, message: "请填写机构名称" }],
});

// 获取机构树结构
const getOrganData = async () => {
  const res = await queryDepartmentTree({});
  if (Array.isArray(res.data)) {
    organData.value = transformToCascaderOptions(res.data);
  }
};
/**
 * 递归转换树结构为 Cascader 所需格式
 */
const transformToCascaderOptions = (list: Department.ResListVO[]): Department.ResListVO[] => {
  return list.map((item) => ({
    ...item,
    ...(item.children?.length ? { children: transformToCascaderOptions(item.children) } : {}),
  }));
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

// 接收父组件参数
const acceptParams = (params: FormParameterProps) => {
  parameter.value = { ...parameter.value, ...params };
  getOrganData();
  dialogVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return;
    try {
      await parameter.value.api!({
        ...parameter.value.row,
        parentId: parameter.value.row?.parentId?.[0] ?? "",
      });
      ElMessage.success({ message: `${parameter.value.title}成功！` });
      parameter.value.getTableList!();
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
  flex-direction: column;
  gap: 24px 0;

  :deep(.el-form-item__label) {
    height: auto !important;
    line-height: 1 !important;
  }
  :deep(.el-cascader) {
    width: 100%;
  }
  :deep(.el-radio) {
    height: auto !important;
  }
  :deep(.el-radio-group) {
    gap: 0 28px;
  }
}
</style>
