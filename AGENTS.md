# Agent Instructions

## Purpose

This is a minimal SvelteKit SPA (SSR off) for Fabric Apps. It provides Rayfin embedded auth and DAX query execution against Power BI semantic models. The UI is Svelte 5 with runes; the entry point is `src/routes/`.

## Project Structure

```
fabric.yaml                # Fabric connection config (managed by the fabric-app-data CLI)
svelte.config.js           # SvelteKit build config (adapter-static, Vite plugins)
tsconfig.json              # TypeScript configuration
src/
├── app.html               # SvelteKit HTML shell
├── app.d.ts               # SvelteKit and Vite env type declarations
├── fabric.generated.ts    # Auto-generated from fabric.yaml — connection aliases
├── routes/
│   ├── +layout.ts         # SSR off, auth gate load
│   ├── +layout.svelte     # Auth gate UI
│   ├── +page.ts           # Home page load (sample query)
│   └── +page.svelte       # Home page UI
├── services/
│   └── rayfin-auth.service.ts   # bootstrapAuth() → initEmbeddedAuth()
└── lib/
    ├── rayfin-client.ts         # getRayfinClient()
    ├── fabric-client.ts         # getFabricClient()
    └── query-semantic-model.ts  # readSemanticModelTable(), clearQueryCache()
```

## Data Layer API

### Auth

Auth runs in `src/routes/+layout.ts` via a SvelteKit load function:

```ts
import { bootstrapAuth } from "@/services/rayfin-auth.service";

const session = await bootstrapAuth().initEmbeddedAuth();
// session?.isAuthenticated — true when running inside Fabric iframe
```

The layout passes `authenticated` to all pages. `+layout.svelte` blocks rendering when not embedded.

### Semantic Model Tables

```ts
import { readSemanticModelTable } from "@/lib/query-semantic-model";

const result = await readSemanticModelTable("default", "Sales");
if (result.status === "success") {
  const rows = result.table.filter((d) => d.Amount > 0).objects();
}
```

`readSemanticModelTable` runs `EVALUATE <table>` internally and returns an [Arquero](https://github.com/uwdata/arquero) `ColumnTable` on success. Pass the plain table name (e.g. `Sales`, `Sales Order`) — DAX quoting is handled for you. Column names are simplified from `Table[Column]` to `Column` (e.g. `Faculty ID` instead of `Faculty[Faculty ID]`).

The SDK never throws on query failures — check `result.status === "error"` and handle inline in load functions (e.g. return an empty `preview`). Do not use SvelteKit `error()` or `+error.svelte`.

The sample home page in `src/routes/+page.ts` queries `"Faculty"` — replace this placeholder table name after schema discovery.

`npm run check` may report type errors in `arquero`'s bundled definitions (third-party); this is a known issue and not a gate for template correctness.

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
4. **SSR is off.** All loads and DAX queries run in the browser only.
