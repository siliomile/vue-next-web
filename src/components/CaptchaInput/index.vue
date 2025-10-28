<template>
  <div class="captcha-input">
    <el-input v-model="inputValue" placeholder="请输入验证码">
      <template #prefix>
        <el-icon class="el-input__icon">
          <HelpFilled />
        </el-icon>
      </template>
      <!-- 尾部验证码图片 -->
      <template #suffix>
        <div class="captcha-box" @click="refreshCaptcha">
          <img v-if="captchaImg" :src="captchaImg" alt="验证码" class="captcha-img" />
          <el-icon v-else><Loading /></el-icon>
        </div>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Loading } from "@element-plus/icons-vue";
import { Login } from "@/api/interface/index";

const props = defineProps<{
  modelValue: string;
  fetchCaptcha: () => Promise<Login.CaptchaResponse>;
}>();

const emits = defineEmits([
  "update:modelValue", // v-model
  "update:uuid", // 输出 uuid
  "refresh", // 通知外部验证码已刷新
]);

const inputValue = ref(props.modelValue);
const captchaImg = ref<string>("");

watch(
  () => props.modelValue,
  (v) => (inputValue.value = v),
);
watch(inputValue, (v) => emits("update:modelValue", v));

/** 获取验证码 */
const loadCaptcha = async () => {
  captchaImg.value = "";
  try {
    const res = await props.fetchCaptcha();
    captchaImg.value = res.image!;
    emits("update:uuid", res.uuid);
    emits("refresh");
  } catch (err) {
    ElMessage.error("验证码加载失败");
  }
};

/** 刷新验证码 */
const refreshCaptcha = async () => {
  await loadCaptcha();
  inputValue.value = "";
  emits("update:modelValue", "");
};

onMounted(loadCaptcha);
// 将方法暴露给父组件
defineExpose({ refreshCaptcha });
</script>

<style lang="scss" scoped>
.captcha-input {
  display: flex;
  align-items: center;
  width: 100%;
  :deep(.el-input__wrapper) {
    width: 100%;
    padding: 0 1px 0 15px !important;
  }
}
.captcha-box {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.captcha-img {
  height: 44px;
  border-radius: 4px;
  user-select: none;
}
</style>
