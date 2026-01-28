import type { BundledLanguage, CodeOptionsMeta, CodeOptionsMultipleThemes, CodeToHastOptionsCommon, ThemeInput } from "shiki";

export interface Config extends Omit<
    CodeToHastOptionsCommon<BundledLanguage> & CodeOptionsMultipleThemes<any> & CodeOptionsMeta,
    "lang" | "themes"
> {
    themes?: Record<string, () => ThemeInput>;
    defaultLang?: CodeToHastOptionsCommon<BundledLanguage>["lang"];
}

export function defineConfig(config: Config) {
    return config;
}
