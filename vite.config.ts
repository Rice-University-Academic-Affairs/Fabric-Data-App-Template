import { defineConfig, type PluginOption } from "vite";
import { resolve } from "path";

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname;

const localNetworkAccessPlugin: PluginOption = {
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

export default defineConfig({
    plugins: [localNetworkAccessPlugin],
    resolve: {
        alias: {
            "@": resolve(projectRoot, "src"),
        },
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/],
        },
    },
});
