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
      <el-form-item label="姓名" prop="nickname">
        <el-input v-model="parameter.row.nickname" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="parameter.row.phone" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="所属机构" prop="deptIdList">
        <el-cascader
          v-model="parameter.row.deptIdList"
          :show-all-levels="false"
          :props="cascaderProps"
          :options="organData"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleIdList">
        <el-select
          v-model="parameter.row.roleIdList"
          :options="roleOptions"
          :props="selectProps"
          multiple
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="初始密码" prop="password" v-if="!isEdit">
        <el-input type="password" show-password v-model="parameter.row.password" placeholder="请输入" />
      </el-form-item>
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
import { Department, Account, Role } from "@/api/interface";
import type { FormInstance, TreeInstance } from "element-plus";
import { queryDepartmentTree, queryRoleSelect } from "@/api/modules/system";
import { ElMessage } from "element-plus";
const cascaderProps = {
  expandTrigger: "hover" as const,
  checkStrictly: true,
  filterable: true,
  multiple: true,
  value: "id",
  label: "name",
};
const selectProps = { value: "id", label: "name" };

// 是否编辑
const isEdit = ref(false);

export interface FormParameterProps {
  title: string; // 标题
  isView?: boolean;
  row: Partial<Account.ReqParams>;
  api: (params: any) => Promise<any>;
  getTableList?: () => void; // 获取表格数据的Api
}
// 树结构
const organData = ref<Department.ResListVO[]>([]);

// 角色数据
const roleOptions = ref<Role.ResRoleListVO[]>([]);

const rules = reactive({
  nickname: [{ required: true, message: "请填写姓名" }],
  phone: [{ required: true, message: "请填写手机号" }],
  password: [{ required: true, message: "请填写初始密码" }],
  deptIdList: [{ required: true, message: "请选择所属机构" }],
  roleIdList: [{ required: true, message: "请选择角色" }],
});

// 获取角色数据
const getRoleData = async () => {
  const res = await queryRoleSelect({});
  if (Array.isArray(res.data)) {
    roleOptions.value = res.data;
  }
};

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
  getRoleData();
  isEdit.value = !!params.row.id;
  dialogVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return;
    try {
      const {
        deptIdList = [],
        enabled = true,
        id = null,
        nickname = "",
        phone = "",
        roleIdList = [],
      } = parameter.value?.row ?? {};
      const flat = [...new Set(deptIdList.map((path) => path[path.length - 1]))];
      await parameter.value.api!({ enabled, id, nickname, phone, roleIdList, deptIdList: flat });
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
