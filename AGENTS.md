# Agent Instructions

## Purpose

This is a minimal, framework-agnostic data layer for Fabric Apps. It provides Rayfin embedded auth and DAX query execution against Power BI semantic models. There is no React — the entry point is vanilla TypeScript in `src/main.ts`.

## Project Structure

```
fabric.yaml                # Fabric connection config (managed by the fabric-app-data CLI)
index.html                 # Vite entry HTML
vite.config.ts             # Vite build config
tsconfig.json              # TypeScript configuration
src/
├── fabric.generated.ts    # Auto-generated from fabric.yaml — connection aliases
├── main.ts                # Vanilla entry point (auth gate + sample query demo)
├── services/
│   └── rayfin-auth.service.ts   # bootstrapAuth() → initEmbeddedAuth()
├── lib/
│   ├── rayfin-client.ts         # getRayfinClient()
│   ├── fabric-client.ts         # getFabricClient()
│   └── query-semantic-model.ts  # readSemanticModelTable(), clearQueryCache()
└── vite-env.d.ts          # Vite type declarations
```

## Data Layer API

### Auth

```ts
import { bootstrapAuth } from "@/services/rayfin-auth.service";

const session = await bootstrapAuth().initEmbeddedAuth();
// session?.isAuthenticated — true when running inside Fabric iframe
```

### Semantic Model Tables

```ts
import { readSemanticModelTable } from "@/lib/query-semantic-model";

const result = await readSemanticModelTable("default", "Sales");
if (result.status === "success") {
  const rows = result.table.filter((d) => d.Amount > 0).objects();
}
```

`readSemanticModelTable` runs `EVALUATE <table>` internally and returns an [Arquero](https://github.com/uwdata/arquero) `ColumnTable` on success. Pass the plain table name (e.g. `Sales`, `Sales Order`) — DAX quoting is handled for you. Column names are simplified from `Table[Column]` to `Column` (e.g. `Faculty ID` instead of `Faculty[Faculty ID]`).

The SDK never throws on query failures — check `result.status === "error"` and read `result.error.message`.

## Registering a Semantic Model

In WSL on a `/mnt/c/` path, `npx fabric-app-data` can silently no-op. Call the CLI directly:

```bash
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js add <alias> --from-url "<Power BI or Fabric URL>"
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js generate -o src/fabric.generated.ts
```

Discover table names with:

```bash
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js query <alias> --query "EVALUATE INFO.VIEW.TABLES()"
```

## Critical Rules

1. **Never use mock or hardcoded data.** All data must come from a real semantic model.
2. **Never guess column names.** Run queries with the fabric-app-data CLI first.
3. **Apps only work inside the Fabric portal embed flow.** Standalone loads show the "not embedded" notice.
