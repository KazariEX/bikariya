import { addComponent, addImportsSources, createResolver, defineNuxtModule } from "@nuxt/kit";
import packageJson from "../package.json";

export default defineNuxtModule({
    meta: {
        name: packageJson.name,
        configKey: "modals",
    },
    moduleDependencies: {
        "@bikariya/core": {},
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        nuxt.options.alias["#modals"] = resolver.resolve("runtime/types");

        addImportsSources({
            from: resolver.resolve("runtime/store"),
            imports: [
                "useModalStore",
            ],
        });

        addComponent({
            name: "BikariyaModals",
            filePath: resolver.resolve("runtime/modals.vue"),
        });
    },
});
