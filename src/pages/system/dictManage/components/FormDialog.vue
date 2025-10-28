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
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="parameter.row.dictName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="字典编码" prop="dictCode">
        <el-input v-model="parameter.row.dictCode" placeholder="例如：sys_user_sex" />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-radio-group v-model="parameter.row.dictType">
          <el-radio :value="1">列表</el-radio>
          <el-radio :value="2">树结构</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="parameter.row.remark" :rows="3" type="textarea" placeholder="请输入" />
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
import { Dict } from "@/api/interface";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";

export interface FormParameterProps {
  title: string; // 标题
  isView?: boolean;
  row: Partial<Dict.ResDictDetailVO>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void; // 获取表格数据的Api
}

const rules = reactive({
  dictName: [{ required: true, message: "请填写字典名称" }],
  dictCode: [{ required: true, message: "请填写字典编码" }],
});

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
  dialogVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return;
    try {
      await parameter.value.api!({ ...parameter.value.row });
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
  :deep(.el-radio) {
    height: auto !important;
  }
  :deep(.el-radio-group) {
    gap: 0 28px;
  }
}
</style>
