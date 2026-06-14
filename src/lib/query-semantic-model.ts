import { type CachedQueryResult } from "@microsoft/fabric-app-data";
import { getFabricClient } from "@/lib/fabric-client";

export function querySemanticModel(
    connection: string,
    query: string,
    options?: { bypassCache?: boolean },
): Promise<CachedQueryResult> {
    return getFabricClient().semanticModel(connection).query(query, options);
}

export function clearQueryCache(connection?: string): void {
    if (connection) {
        getFabricClient().semanticModel(connection).clearCache();
    } else {
        getFabricClient().clearCache();
    }
}
