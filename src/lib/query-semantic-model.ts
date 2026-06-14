import { type QueryError, type QueryTable } from "@microsoft/fabric-app-data";
import { table, type ColumnTable } from "arquero";
import { getFabricClient } from "@/lib/fabric-client";

export type ReadSemanticModelTableResult =
    | { status: "success"; table: ColumnTable; fromCache: boolean; cachedAt?: Date }
    | { status: "error"; error: QueryError; fromCache: boolean };

function unqualifyColumnName(qualified: string, tableName: string): string {
    const prefix = `${tableName}[`;
    if (qualified.startsWith(prefix) && qualified.endsWith("]")) {
        return qualified.slice(prefix.length, -1);
    }
    const match = qualified.match(/^[^[\]]+\[(.+)\]$/);
    return match ? match[1] : qualified;
}

function uniqueColumnNames(names: string[]): string[] {
    const used = new Map<string, number>();
    return names.map((name) => {
        const n = used.get(name) ?? 0;
        used.set(name, n + 1);
        if (n === 0) return name;
        return `${name}_${n + 1}`;
    });
}

function toArqueroTable({ columns, rows }: QueryTable, tableName: string): ColumnTable {
    const shortNames = uniqueColumnNames(
        columns.map(({ name }) => unqualifyColumnName(name, tableName)),
    );
    const data: Record<string, unknown[]> = {};
    for (const name of shortNames) data[name] = [];
    for (const row of rows) {
        for (let i = 0; i < columns.length; i++) {
            data[shortNames[i]].push(row[i]);
        }
    }
    return table(data);
}

function formatDaxTableRef(name: string): string {
    return `'${name.replace(/'/g, "''")}'`;
}

export function readSemanticModelTable(
    connection: string,
    tableName: string,
    options?: { bypassCache?: boolean },
): Promise<ReadSemanticModelTableResult> {
    return getFabricClient()
        .semanticModel(connection)
        .query(`EVALUATE ${formatDaxTableRef(tableName)}`, options)
        .then((result) => {
            if (result.status === "error") {
                return { status: "error", error: result.error, fromCache: result.fromCache };
            }
            return {
                status: "success",
                table: toArqueroTable(result.table, tableName),
                fromCache: result.fromCache,
                cachedAt: result.cachedAt,
            };
        });
}

export function clearQueryCache(connection?: string): void {
    if (connection) {
        getFabricClient().semanticModel(connection).clearCache();
    } else {
        getFabricClient().clearCache();
    }
}
