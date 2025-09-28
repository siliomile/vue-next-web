<template>
  <div></div>
</template>

<script setup lang="ts" name="about">
  const { pkg, lastBuildTime } = __APP_INFO__
  const { dependencies, devDependencies, version } = pkg
</script>

<style lang="scss" scoped>
  .card {
    .title {
      margin: 0 0 15px;
      font-size: 17px;
      font-weight: bold;
      color: var(--el-text-color-primary);
    }
    .text {
      font-size: 15px;
      line-height: 25px;
      color: var(--el-text-color-regular);
      .el-link {
        font-size: 15px;
      }
    }
  }
</style>
