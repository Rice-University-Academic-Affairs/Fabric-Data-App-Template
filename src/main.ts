import { bootstrapAuth } from "@/services/rayfin-auth.service";
import { querySemanticModel } from "@/lib/query-semantic-model";

const root = document.getElementById("root")!;
const show = (msg: string) => (root.textContent = msg);

async function main() {
    const session = await bootstrapAuth().initEmbeddedAuth();
    if (!session?.isAuthenticated) return show("Open this app inside the Fabric portal.");

    const result = await querySemanticModel("default", 'EVALUATE ROW("connected", 1)');
    show(
        result.status === "success"
            ? `Connected. ${JSON.stringify(result.table.rows)}`
            : `Query failed: ${result.error.message}`,
    );
}

main().catch((e) => show(`Error: ${e instanceof Error ? e.message : String(e)}`));
