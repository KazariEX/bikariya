<script lang="ts" setup>
    const code = `
export default defineConfig({
    themes: {
        light: () => import("..."),
        dark: () => import("..."),
    },
});
`.trim();
</script>

<template>
    <div overflow="hidden" size="80">
        <simple-image size="100%" object="cover" src="https://picsum.photos/seed/picsum/800/400"/>
    </div>
    <div leading="normal">
        <simple-shiki :raw="code"/>
    </div>
    <bikariya-modals />
</template>

<style>
    *, ::before, ::after {
        padding: 0;
        margin: 0;
        border: none;
        box-sizing: border-box;
    }

    .bikariya-overlay {
        position: fixed;
        opacity: 0.5;
        inset: 0;
        background-color: black;

        &:where(.v-enter-active, .v-leave-active) {
            transition: opacity 0.4s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
        }
    }
</style>
