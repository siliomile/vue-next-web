// eslint.config.js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import parserTs from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import unocss from '@unocss/eslint-config/flat'

export default [
  js.configs.recommended,
  unocss,
  {
    // 应用到哪些文件
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      vue,
      prettier: eslintPluginPrettier,
    },
    rules: {
      semi: ['error', 'never'],
      '@typescript-eslint/semi': ['error', 'never'],
      // Vue 推荐规则
      ...vue.configs['vue3-recommended'].rules,

      // TypeScript 推荐规则
      ...tseslint.configs.recommended.rules,

      // Prettier 风格强制
      'prettier/prettier': 'error',
    },
    // 内联忽略规则（替代 .eslintignore）
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.min.js', '**/generated/**'],
  },
  // 关闭 ESLint 与 Prettier 冲突的规则
  prettier,
]
