# @bikariya/shiki

Shiki 集成，基于 [Pinia](https://pinia.vuejs.org)。

## 安装

```bash
pnpm i -D @bikariya/shiki
```

## 使用方式

1. 在 `nuxt.config.ts` 中添加模块：

   ```ts
   export default defineNuxtConfig({
     modules: [
       "@bikariya/shiki",
     ],
   });
   ```

2. 在 `app` 目录下创建 `shiki.config.ts`:

   ```ts
   import { defineConfig } from "#shiki/config";

   export default defineConfig({
     themes: {
       light: () => import("shiki/themes/min-light.mjs"),
       dark: () => import("shiki/themes/min-dark.mjs"),
     },
   });
   ```

3. 参照[集成示例](/playground/app/components/simple-shiki.vue)。
