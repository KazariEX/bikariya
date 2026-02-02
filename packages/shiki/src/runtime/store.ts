/// <reference types="pinia" />

import type { BundledLanguage, CodeToHastOptions, HighlighterCore, RegexEngine } from "shiki";
import { defineStore, onScopeDispose } from "#imports";
// @ts-expect-error TS2307
import untyped from "~/shiki.config";
import type { Config } from "./config";

export const useShikiStore = defineStore("shiki", () => {
    let promise: Promise<HighlighterCore> | undefined;
    let shiki: HighlighterCore | undefined;

    const config = untyped as Config;
    const options: CodeToHastOptions<BundledLanguage, any> = {
        lang: "plaintext",
        themes: {},
    };

    onScopeDispose(() => {
        promise?.then((shiki) => shiki.dispose());
    });

    async function load() {
        promise ??= loadShiki();
        shiki ??= await promise;
        return shiki;
    }

    async function loadShiki() {
        const [
            { createHighlighterCore },
            { createJavaScriptRegexEngine },
            ...themes
        ] = await Promise.all([
            import("shiki/core"),
            import("shiki/engine-javascript.mjs"),
            ...Object.values(config.themes ?? {}).map((load) => load()),
        ]);

        let engine: RegexEngine;
        try {
            // eslint-disable-next-line prefer-regex-literals, regexp/strict
            void new RegExp("(?i: )");
            engine = createJavaScriptRegexEngine();
        }
        catch {
            const [{ createOnigurumaEngine }, wasm] = await Promise.all([
                // @ts-expect-error TS2307
                import("https://esm.sh/shiki/engine-oniguruma.mjs") as typeof import("shiki/engine-oniguruma.mjs"),
                // @ts-expect-error TS2307
                import("https://esm.sh/shiki/wasm") as typeof import("shiki/wasm"),
            ]);
            engine = await createOnigurumaEngine(wasm);
        }

        Object.assign(options, {
            ...config,
            lang: config.defaultLang,
            themes: Object.fromEntries(
                Object.keys(config.themes ?? {}).map((key, i) => {
                    const theme = themes[i]!;
                    const name = "default" in theme ? theme.default.name : theme?.name;
                    return [key, name];
                }),
            ),
        });

        return createHighlighterCore({
            engine,
            themes,
        });
    }

    async function loadLang(...langs: string[]) {
        // @ts-expect-error TS2307
        const { bundledLanguages } = await import("https://esm.sh/shiki/langs") as typeof import("shiki/langs");
        const loadedLanguages = shiki?.getLoadedLanguages() ?? [];
        await Promise.all(
            langs
                .filter((lang) => !loadedLanguages.includes(lang))
                .map((lang) => bundledLanguages[lang as BundledLanguage]?.().then(shiki?.loadLanguage)),
        );
    }

    return {
        options,
        load,
        loadLang,
    };
});
