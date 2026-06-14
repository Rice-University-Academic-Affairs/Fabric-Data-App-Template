import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname;

const localNetworkAccessPlugin = {
    name: "local-network-access-headers",
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Private-Network", "true");
            if (req.method === "OPTIONS" && req.headers["access-control-request-private-network"]) {
                const origin = req.headers.origin || "*";
                res.setHeader("Access-Control-Allow-Origin", origin);
                res.setHeader("Access-Control-Allow-Credentials", "true");
                res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
                res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || "*");
                res.statusCode = 204;
                res.end();
                return;
            }
            next();
        });
    },
};

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
    vite: {
        envPrefix: "VITE_",
        plugins: [localNetworkAccessPlugin],
        build: {
            commonjsOptions: {
                include: [/node_modules/],
            },
        },
    },
};
