# @bikariya/modals

模态框状态管理，基于 [Pinia](https://pinia.vuejs.org)。

## 安装

```bash
pnpm i -D @bikariya/modals
```

## 使用方式

1. 在 `nuxt.config.ts` 中添加模块：

   ```ts
   export default defineNuxtConfig({
     modules: [
       "@bikariya/modals",
     ],
   });
   ```

2. 在根组件或 Layout 中添加模态框容器：

   ```vue
   <template>
     <bikariya-modals />
   </template>
   ```

3. 在 `components` 文件夹下创建模态框组件：

   ```vue
   <script lang="ts" setup>
     import type { ModalEmits, ModalProps } from "#modals";

     defineProps<ModalProps>();
     defineEmits<ModalEmits>();
   </script>

   <template>
     <transition>
       <div v-if="open">
         <span>I'm a modal.</span>
         <button @click="$emit(`close`)">Close</button>
       </div>
     </transition>
   </template>
   ```

4. 在页面或组件中使用模态框：

   ```vue
   <script lang="ts" setup>
     import { LazySimpleModal } from "#components";

     const modalStore = useModalStore();
     const { open, close } = modalStore.use(() => h(LazySimpleModal));
   </script>
   ```
