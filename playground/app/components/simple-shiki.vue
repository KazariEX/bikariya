<script lang="ts" setup>
    import type { BundledLanguage } from "shiki";

    const props = withDefaults(defineProps<{
        lang?: BundledLanguage;
        raw?: string;
    }>(), {
        lang: "javascript",
        raw: "",
    });

    const shikiStore = useShikiStore();

    const code = computedAsync(async () => {
        const { lang, raw } = props;
        const shiki = await shikiStore.load();
        await shikiStore.loadLang(lang);

        return shiki.codeToHtml(raw, {
            ...shikiStore.options,
            lang,
        });
    }, `<pre>${props.raw}</pre>`, { lazy: true });
</script>

<template>
    <figure v-html="code"></figure>
</template>
