<script lang="ts" setup>
    import { storeToRefs, useModalStore } from "#imports";

    const modalStore = useModalStore();
    const { modals } = storeToRefs(modalStore);
</script>

<template>
    <template v-for="{ vnode, zIndex, duration, open, close } in modals" :key="zIndex">
        <transition>
            <div
                v-if="open.value"
                class="bikariya-overlay"
                :style="{ zIndex: zIndex - 1 }"
                @click="close.value()"
            ></div>
        </transition>
        <component :is="vnode.value" :duration :open="open.value" :style="{ zIndex }"/>
    </template>
</template>
