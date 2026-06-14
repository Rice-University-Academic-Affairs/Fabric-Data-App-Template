import { RayfinClient } from "@microsoft/rayfin-client";

let _client: RayfinClient | undefined;

export function getRayfinClient(): RayfinClient {
    if (!_client) {
        const apiUrl = import.meta.env.VITE_RAYFIN_API_URL;
        const publishableKey = import.meta.env.VITE_RAYFIN_PUBLISHABLE_KEY;

        if (!apiUrl || !publishableKey) {
            throw new Error(`Missing required env vars for creating rayfin client - run 'npx rayfin up'`);
        }

        _client = new RayfinClient({
            baseUrl: apiUrl,
            publishableKey,
            authStorage: true,
            useProxy: false,
        });
    }

    return _client;
}
