import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

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
    plugins: [tailwindcss(), sveltekit(), localNetworkAccessPlugin],
    envPrefix: "VITE_",
    build: {
        commonjsOptions: {
            include: [/node_modules/],
        },
    },
};
