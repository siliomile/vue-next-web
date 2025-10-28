<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.phone" placeholder="用户名：admin / user">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="密码：123456"
        show-password
        autocomplete="new-password"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <CaptchaInput
        ref="captchaInputRef"
        v-model="loginForm.code!"
        :fetch-captcha="getCaptcha"
        @update:uuid="loginForm.uuid = $event"
      />
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)">
      重置
    </el-button>
    <el-button
      :icon="UserFilled"
      round
      size="large"
      type="primary"
      :loading="loading"
      @click="login(loginFormRef)"
    >
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { Login } from "@/api/interface";
import { ElNotification, ElMessage } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { getSimpleList } from "@/api/modules/enterprise";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useEnumerationStore } from "@/stores/modules/enumeration";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import CaptchaInput from "@/components/CaptchaInput/index.vue";
import { getCaptchaApi } from "@/api/modules/login";
import type { ElForm } from "element-plus";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  phone: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  phone: "admin",
  password: "123456",
  code: "",
  uuid: "",
});

const getCaptcha = async (): Promise<Login.CaptchaResponse> => {
  const res = await getCaptchaApi();
  return {
    image: res.data.image, // base64 或 URL
    uuid: res.data.uuid,
  };
};
const captchaInputRef = ref<InstanceType<typeof CaptchaInput>>();
// login
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (!valid) return;
  loading.value = true;
  try {
    const { code, data, msg } = await loginApi({ ...loginForm });
    if (code === 204) {
      captchaInputRef.value?.refreshCaptcha();
      return ElMessage.error(msg);
    }
    if (code !== 200) return ElNotification.error(msg);
    const {
      depts = [],
      permissions = [],
      roles = [],
      tokenInfo = {},
      companyInfo = {},
      nickname = "",
      phone = "",
    } = data;
    userStore.setToken(tokenInfo.tokenValue!);
    userStore.setDeptId(depts[0].id + "");
    userStore.setUserInfo({
      username: nickname,
      companyInfo: companyInfo,
      account: phone,
      permissions,
      roles,
      depts,
    });

    // 2.添加动态路由
    await initDynamicRouter();

    // 3.清空 tabs、keepAlive 数据
    tabsStore.setTabs([]);
    keepAliveStore.setKeepAliveName([]);

    // 4.跳转到首页
    router.push(HOME_URL);
    ElNotification({
      title: getTimeState(),
      message: "欢迎登录",
      type: "success",
      duration: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});

onBeforeUnmount(() => {
  document.onkeydown = null;
});
</script>

<style scoped lang="scss">
@use "../index.scss" as *;
:deep(.el-input) {
  line-height: 48px;
  height: 48px;
  font-size: 18px;
}
</style>
