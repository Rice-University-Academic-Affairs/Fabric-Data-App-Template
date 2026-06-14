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
│   └── query-semantic-model.ts  # querySemanticModel(), clearQueryCache()
└── vite-env.d.ts          # Vite type declarations
```

## Data Layer API

### Auth

```ts
import { bootstrapAuth } from "@/services/rayfin-auth.service";

const session = await bootstrapAuth().initEmbeddedAuth();
// session?.isAuthenticated — true when running inside Fabric iframe
```

### DAX Queries

```ts
import { querySemanticModel } from "@/lib/query-semantic-model";

const result = await querySemanticModel("default", 'EVALUATE ROW("test", 1)');
if (result.status === "success") {
  const { columns, rows } = result.table;
}
```

The SDK never throws on query failures — check `result.status === "error"` and read `result.error.message`.

## Registering a Semantic Model

In WSL on a `/mnt/c/` path, `npx fabric-app-data` can silently no-op. Call the CLI directly:

```bash
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js add <alias> --from-url "<Power BI or Fabric URL>"
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js generate -o src/fabric.generated.ts
```

Test queries with:

```bash
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js query <alias> --query "EVALUATE ROW(\"test\", 1)"
```

## Critical Rules

1. **Never use mock or hardcoded data.** All data must come from a real semantic model.
2. **Never guess column names.** Run queries with the fabric-app-data CLI first.
3. **Apps only work inside the Fabric portal embed flow.** Standalone loads show the "not embedded" notice.
