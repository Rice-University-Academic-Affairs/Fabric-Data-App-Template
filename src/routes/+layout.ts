import type { LayoutLoad } from "./$types";
import { bootstrapAuth } from "@/services/rayfin-auth.service";

export const ssr = false;
export const prerender = true;

export const load: LayoutLoad = async () => {
    const session = await bootstrapAuth().initEmbeddedAuth();
    return { authenticated: !!session?.isAuthenticated };
};
