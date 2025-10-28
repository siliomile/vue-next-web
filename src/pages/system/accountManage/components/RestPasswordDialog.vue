<template>
  <el-dialog
    v-model="dialogVisible"
    :title="parameter.title"
    :destroy-on-close="true"
    width="400px"
    draggable
  >
    <el-form
      ref="ruleFormRef"
      class="role-manage-form"
      label-position="top"
      :model="parameter.row"
      :rules="rules"
    >
      <el-form-item label="新密码" prop="password">
        <el-input
          type="password"
          show-password
          v-model="parameter.row.password"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="再次输入" prop="confirmPassword">
        <el-input
          type="password"
          show-password
          v-model="parameter.row.confirmPassword"
          placeholder="请输入"
        />
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

<script setup lang="ts" name="RestPasswordDialog">
import { ref, reactive } from "vue";
import { Account } from "@/api/interface";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
export interface FormParameterProps {
  title: string; // 标题
  isView?: boolean;
  row: Partial<Account.ReqRestPassword>;
  api: (params: any) => Promise<any>;
  getTableList?: () => void; // 获取表格数据的Api
}
// ============= 🔒 校验规则 =============
// const validatePassword = (rule: any, value: string, callback: any) => {
//   if (!value) {
//     return callback(new Error("请填写新密码"));
//   }
//   // 至少8位，包含字母和数字
//   const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&.,]{8,}$/;
//   if (!reg.test(value)) {
//     return callback(new Error("密码需包含字母和数字，且不少于8位"));
//   }
//   callback();
// };

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error("请再次填写密码"));
  }
  if (value !== parameter.value.row.password) {
    return callback(new Error("两次输入的密码不一致"));
  }
  callback();
};
const rules = reactive({
  password: [{ required: true, message: "请填写新密码" }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
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
      const { password = "", id = null } = parameter.value?.row ?? {};
      await parameter.value.api!({ password, id });
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
