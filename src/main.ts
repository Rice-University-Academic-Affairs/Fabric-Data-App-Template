import { bootstrapAuth } from "@/services/rayfin-auth.service";
import { readSemanticModelTable } from "@/lib/query-semantic-model";

const root = document.getElementById("root")!;
const show = (msg: string) => (root.textContent = msg);

async function main() {
    const session = await bootstrapAuth().initEmbeddedAuth();
    if (!session?.isAuthenticated) return show("Open this app inside the Fabric portal.");

    const result = await readSemanticModelTable("default", "Faculty");
    if (result.status === "error") return show(`Query failed: ${result.error.message}`);

    const preview = result.table.slice(0, 5).objects();
    show(`Loaded ${result.table.numRows()} rows. Preview: ${JSON.stringify(preview)}`);
}

main().catch((e) => show(`Error: ${e instanceof Error ? e.message : String(e)}`));
