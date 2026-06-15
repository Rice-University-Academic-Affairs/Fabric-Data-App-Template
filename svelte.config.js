import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname;

export default {
    preprocess: vitePreprocess(),
    compilerOptions: {
        runes: true,
    },
    kit: {
        adapter: adapter({
            fallback: "index.html",
            strict: false,
        }),
        alias: {
            "@": resolve(projectRoot, "src"),
        },
    },
};
