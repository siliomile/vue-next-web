import { defineConfig, presetUno, presetTypography, presetIcons } from "unocss";

export default defineConfig({
  presets: [
    // 使用 UnoCSS 内置的 UNO 样式预设
    presetUno(),

    // 使用 Typography 插件，帮助生成排版相关的样式
    presetTypography(),

    // 使用 Icons 插件，可以方便地处理图标
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],

  theme: {
    extend: {
      // colors: {
      //   primary: "#3490dc", // 自定义主题颜色
      //   secondary: "#ffed4a",
      // },
      // spacing: {
      //   18: "4.5rem", // 自定义间距
      // },
    },
  },

  rules: [
    // 添加你自己的规则
    // ["m-auto", { margin: "auto" }],
    // [
    //   "flex-center",
    //   { display: "flex", justifyContent: "center", alignItems: "center" },
    // ],
  ],

  shortcuts: {
    // 定义简写
    // btn: "px-4 py-2 rounded bg-primary text-white",
    // card: "shadow-lg p-4 rounded-md bg-white",
  },

  // variants: [
  //   // 控制变体规则，比如添加 `hover` 等状态
  //   "hover",
  //   "focus",
  //   "active",
  // ],
});
