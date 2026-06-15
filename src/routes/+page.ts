import type { PageLoad } from "./$types";
import { readSemanticModelTable } from "@/lib/query-semantic-model";

export const load: PageLoad = async ({ parent }) => {
    const { authenticated } = await parent();
    if (!authenticated) {
        return { preview: [] };
    }

    const result = await readSemanticModelTable("default", "Faculty");
    if (result.status === "error") {
        return { preview: [] };
    }

    return { preview: result.table.slice(0, 5).objects() };
};
