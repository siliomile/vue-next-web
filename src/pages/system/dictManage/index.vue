<template>
  <div class="table-main">
    <el-tabs v-model="activeTab" class="dict-tabs">
      <!-- 字典类型 -->
      <el-tab-pane label="字典类型" name="type">
        <ProTable ref="typeTable" :columns="typeColumns" :request-api="getDictTypePage" row-key="id">
          <template #tableHeader="scope">
            <el-button v-if="hasPermission('system:dict:create')" type="primary" :icon="CirclePlus" @click="openTypeDialog()">
              新增字典类型
            </el-button>
            <el-button
              v-if="hasPermission('system:dict:delete')"
              type="danger"
              plain
              :icon="Delete"
              :disabled="!scope.isSelected"
              @click="batchDeleteType(scope.selectedListIds)">
              批量删除
            </el-button>
            <el-button :icon="Download" plain @click="exportTypes">导出</el-button>
          </template>

          <template #status="{ row }">
            <DictTag code="common_status" :value="row.status" always />
          </template>

          <template #createTime="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>

          <template #operation="{ row }">
            <el-button type="primary" link :icon="Tickets" @click="openDataTab(row)">字典数据</el-button>
            <el-button v-if="hasPermission('system:dict:update')" type="primary" link :icon="EditPen" @click="openTypeDialog(row)">
              编辑
            </el-button>
            <el-button v-if="hasPermission('system:dict:delete')" type="danger" link :icon="Delete" @click="deleteType(row)">
              删除
            </el-button>
          </template>
        </ProTable>
      </el-tab-pane>

      <!-- 字典数据 -->
      <el-tab-pane label="字典数据" name="data">
        <ProTable ref="dataTable" :columns="dataColumns" :request-api="getDictDataPage" :init-param="dataInitParam" row-key="id">
          <template #tableHeader="scope">
            <el-button v-if="hasPermission('system:dict:create')" type="primary" :icon="CirclePlus" @click="openDataDialog()">
              新增字典数据
            </el-button>
            <el-button
              v-if="hasPermission('system:dict:delete')"
              type="danger"
              plain
              :icon="Delete"
              :disabled="!scope.isSelected"
              @click="batchDeleteData(scope.selectedListIds)">
              批量删除
            </el-button>
            <el-button :icon="RefreshLeft" plain @click="resetDictTypeFilter">重置字典类型筛选</el-button>
          </template>

          <template #status="{ row }">
            <DictTag code="common_status" :value="row.status" always />
          </template>

          <template #colorType="{ row }">
            <el-tag v-if="row.colorType" :type="toTagType(row.colorType) ?? 'info'" size="small">{{ row.colorType }}</el-tag>
            <span v-else>--</span>
          </template>

          <template #operation="{ row }">
            <el-button v-if="hasPermission('system:dict:update')" type="primary" link :icon="EditPen" @click="openDataDialog(row)">
              编辑
            </el-button>
            <el-button v-if="hasPermission('system:dict:delete')" type="danger" link :icon="Delete" @click="deleteData(row)">
              删除
            </el-button>
          </template>
        </ProTable>
      </el-tab-pane>
    </el-tabs>

    <!-- 字典类型表单 -->
    <el-dialog v-model="typeDialogVisible" :title="typeForm.id ? '编辑字典类型' : '新增字典类型'" width="560px" draggable @closed="resetTypeForm">
      <el-form ref="typeFormRef" :model="typeForm" :rules="typeRules" label-width="100px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="typeForm.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="typeForm.type" placeholder="请输入字典类型编码，如 member_type" :disabled="!!typeForm.id" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="typeForm.status">
            <el-radio :value="0">开启</el-radio>
            <el-radio :value="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="typeForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="typeDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="typeLoading" @click="submitType">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 字典数据表单 -->
    <el-dialog v-model="dataDialogVisible" :title="dataForm.id ? '编辑字典数据' : '新增字典数据'" width="560px" draggable @closed="resetDataForm">
      <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="dataForm.dictType" disabled />
        </el-form-item>
        <el-form-item label="数据标签" prop="label">
          <el-input v-model="dataForm.label" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="value">
          <el-input v-model="dataForm.value" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="dataForm.sort" :min="0" controls-position="right" class="w-full" />
        </el-form-item>
        <el-form-item label="标签颜色" prop="colorType">
          <el-select v-model="dataForm.colorType" clearable placeholder="请选择标签颜色">
            <el-option v-for="item in colorTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :value="0">开启</el-radio>
            <el-radio :value="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dataDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dataLoading" @click="submitData">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="SystemDictType">
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { CirclePlus, Delete, Download, EditPen, RefreshLeft, Tickets } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import DictTag from "@/components/DictTag/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { exportCsv } from "@/utils/export";
import { dictEnum, toTagType } from "@/utils/dictHelper";
import { usePermission } from "@/hooks/usePermission";
import {
  createDictData,
  createDictType,
  deleteDictData,
  deleteDictType,
  getDictDataPage,
  getDictTypePage,
  updateDictData,
  updateDictType,
} from "@/api/modules/dict";
import { SysDictData, SysDictType } from "@/api/interface";
import DictManager from "@/utils/modules/DictManager";

const { hasPermission } = usePermission();

const activeTab = ref("type");
const typeTable = ref<ProTableInstance>();
const dataTable = ref<ProTableInstance>();

const formatDateTime = (value?: number | string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

/* ------------------------------ 字典类型 ------------------------------ */
const typeColumns = reactive<ColumnProps<SysDictType.Resp>[]>([
  { type: "selection", width: 50, fixed: "left" },
  { prop: "name", label: "字典名称", width: 200, align: "left", search: { el: "input", label: "字典名称" } },
  { prop: "type", label: "字典类型", width: 220, align: "left", search: { el: "input", label: "字典类型" } },
  {
    prop: "status",
    label: "状态",
    width: 110,
    align: "center",
    enum: dictEnum("common_status"),
    search: { el: "select", label: "状态" },
    isFilterEnum: false,
  },
  { prop: "remark", label: "备注", minWidth: 240, align: "left", showOverflowTooltip: true },
  { prop: "createTime", label: "创建时间", width: 180, align: "center", isFilterEnum: false },
  { prop: "operation", label: "操作", width: 260, align: "center", fixed: "right" },
]);

const typeDialogVisible = ref(false);
const typeLoading = ref(false);
const typeFormRef = ref<FormInstance>();
const typeDefaultForm = (): SysDictType.Req => ({ id: undefined, name: "", type: "", status: 0, remark: "" });
const typeForm = reactive<SysDictType.Req>(typeDefaultForm());
const typeRules = reactive<FormRules>({
  name: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  type: [{ required: true, message: "请输入字典类型", trigger: "blur" }],
});

const openTypeDialog = (row?: SysDictType.Resp) => {
  Object.assign(typeForm, typeDefaultForm());
  if (row) Object.assign(typeForm, { id: row.id, name: row.name, type: row.type, status: row.status, remark: row.remark });
  typeDialogVisible.value = true;
};

const resetTypeForm = () => {
  typeFormRef.value?.resetFields();
  Object.assign(typeForm, typeDefaultForm());
};

const submitType = async () => {
  if (!typeFormRef.value) return;
  const valid = await typeFormRef.value.validate().catch(() => false);
  if (!valid) return;
  typeLoading.value = true;
  try {
    if (typeForm.id) {
      await updateDictType(typeForm);
      ElMessage.success("修改成功");
    } else {
      await createDictType(typeForm);
      ElMessage.success("新增成功");
    }
    typeDialogVisible.value = false;
    typeTable.value?.getTableList();
    DictManager.remove(typeForm.type);
  } finally {
    typeLoading.value = false;
  }
};

const deleteType = async (row: SysDictType.Resp) => {
  await ElMessageBox.confirm(`是否确认删除字典类型「${row.name}」?`, "温馨提示", { type: "warning" });
  await deleteDictType(row.id);
  ElMessage.success("删除成功");
  DictManager.remove(row.type);
  typeTable.value?.getTableList();
};

const batchDeleteType = async (ids: Array<number | string>) => {
  if (!ids.length) return ElMessage.warning("请先勾选需要删除的字典类型");
  await ElMessageBox.confirm(`是否确认删除选中的 ${ids.length} 个字典类型?`, "温馨提示", { type: "warning" });
  for (const id of ids) await deleteDictType(id);
  ElMessage.success("删除成功");
  typeTable.value?.getTableList();
};

const exportTypes = async () => {
  const { data } = await getDictTypePage({ pageNo: 1, pageSize: 200, ...typeTable.value?.searchParam });
  exportCsv("字典类型", [
    { prop: "name", label: "字典名称" },
    { prop: "type", label: "字典类型" },
    { prop: "status", label: "状态", formatter: row => (row.status === 0 ? "开启" : "关闭") },
    { prop: "remark", label: "备注" },
    { prop: "createTime", label: "创建时间", formatter: row => formatDateTime(row.createTime) },
  ], data.list || []);
  ElMessage.success("导出成功");
};

/* ------------------------------ 字典数据 ------------------------------ */
const dataInitParam = reactive<{ dictType?: string }>({ dictType: undefined });

const dataColumns = reactive<ColumnProps<SysDictData.Resp>[]>([
  { type: "selection", width: 50, fixed: "left" },
  { prop: "label", label: "字典标签", width: 180, align: "left", search: { el: "input", label: "字典标签" } },
  { prop: "value", label: "字典键值", width: 140, align: "center" },
  { prop: "dictType", label: "字典类型", width: 200, align: "left", search: { el: "input", label: "字典类型" } },
  { prop: "sort", label: "排序", width: 90, align: "center" },
  { prop: "colorType", label: "标签颜色", width: 130, align: "center", isFilterEnum: false },
  {
    prop: "status",
    label: "状态",
    width: 110,
    align: "center",
    enum: dictEnum("common_status"),
    search: { el: "select", label: "状态" },
    isFilterEnum: false,
  },
  { prop: "remark", label: "备注", minWidth: 220, align: "left", showOverflowTooltip: true },
  { prop: "operation", label: "操作", width: 200, align: "center", fixed: "right" },
]);

const openDataTab = (row: SysDictType.Resp) => {
  dataInitParam.dictType = row.type;
  activeTab.value = "data";
  dataTable.value?.search();
};

const resetDictTypeFilter = () => {
  dataInitParam.dictType = undefined;
  dataTable.value?.search();
};

const dataDialogVisible = ref(false);
const dataLoading = ref(false);
const dataFormRef = ref<FormInstance>();
const dataDefaultForm = (): SysDictData.Req => ({
  id: undefined,
  sort: 0,
  label: "",
  value: "",
  dictType: "",
  status: 0,
  colorType: "",
  cssClass: "",
  remark: "",
});
const dataForm = reactive<SysDictData.Req>(dataDefaultForm());
const dataRules = reactive<FormRules>({
  label: [{ required: true, message: "请输入数据标签", trigger: "blur" }],
  value: [{ required: true, message: "请输入数据键值", trigger: "blur" }],
});

const colorTypeOptions = [
  { label: "default", value: "default" },
  { label: "primary", value: "primary" },
  { label: "success", value: "success" },
  { label: "info", value: "info" },
  { label: "warning", value: "warning" },
  { label: "danger", value: "danger" },
];

const openDataDialog = (row?: SysDictData.Resp) => {
  Object.assign(dataForm, dataDefaultForm());
  if (row) {
    Object.assign(dataForm, { ...row });
  } else {
    dataForm.dictType = dataInitParam.dictType || (dataTable.value?.searchParam?.dictType as string) || "";
  }
  dataDialogVisible.value = true;
};

const resetDataForm = () => {
  dataFormRef.value?.resetFields();
  Object.assign(dataForm, dataDefaultForm());
};

const submitData = async () => {
  if (!dataFormRef.value) return;
  const valid = await dataFormRef.value.validate().catch(() => false);
  if (!valid) return;
  dataLoading.value = true;
  try {
    if (dataForm.id) {
      await updateDictData(dataForm);
      ElMessage.success("修改成功");
    } else {
      await createDictData(dataForm);
      ElMessage.success("新增成功");
    }
    dataDialogVisible.value = false;
    DictManager.remove(dataForm.dictType);
    dataTable.value?.getTableList();
  } finally {
    dataLoading.value = false;
  }
};

const deleteData = async (row: SysDictData.Resp) => {
  await ElMessageBox.confirm(`是否确认删除字典数据「${row.label}」?`, "温馨提示", { type: "warning" });
  await deleteDictData(row.id);
  ElMessage.success("删除成功");
  DictManager.remove(row.dictType);
  dataTable.value?.getTableList();
};

const batchDeleteData = async (ids: Array<number | string>) => {
  if (!ids.length) return ElMessage.warning("请先勾选需要删除的字典数据");
  await ElMessageBox.confirm(`是否确认删除选中的 ${ids.length} 条字典数据?`, "温馨提示", { type: "warning" });
  for (const id of ids) await deleteDictData(id);
  ElMessage.success("删除成功");
  dataTable.value?.getTableList();
};

onMounted(() => {
  // 预加载字典，保证表格内的标签可正常渲染
  DictManager.loadMany(["common_status", "system_menu_type"]);
});
</script>

<style scoped lang="scss">
.dict-tabs {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  :deep(.el-tabs__content) {
    flex: 1;
    overflow: visible;
  }
  :deep(.el-tab-pane) {
    height: 100%;
  }
}
</style>
