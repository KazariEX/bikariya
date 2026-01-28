import { addImportsDir, createResolver, defineNuxtModule } from "@nuxt/kit";
import packageJson from "../package.json";

export default defineNuxtModule({
    meta: {
        name: packageJson.name,
        configKey: "shiki",
    },
    moduleDependencies: {
        "@bikariya/core": {},
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        addImportsDir(resolver.resolve("runtime/stores"));

        nuxt.options.alias["#shiki/config"] = resolver.resolve("runtime/config");
    },
});
