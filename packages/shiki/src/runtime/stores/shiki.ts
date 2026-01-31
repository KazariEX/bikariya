/// <reference types="pinia" />

import type { BundledLanguage, CodeToHastOptions, HighlighterCore, RegexEngine } from "shiki";
import { defineStore, onScopeDispose } from "#imports";
// @ts-expect-error https://typescript.tv/errors/ts2307
import untyped from "~/shiki.config";
import type { Config } from "../config";

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
            // eslint-disable-next-line regexp/strict
            void /(?i: )/;
            engine = createJavaScriptRegexEngine();
        }
        catch {
            const { createOnigurumaEngine } = await import("shiki/engine-oniguruma.mjs");
            // @ts-expect-error https://typescript.tv/errors/ts2307
            engine = await createOnigurumaEngine(import("https://esm.sh/shiki/wasm"));
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
        // @ts-expect-error https://typescript.tv/errors/ts2307
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
