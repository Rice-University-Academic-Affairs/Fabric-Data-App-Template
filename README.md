# Minimal Fabric Data App Template

SvelteKit template for Fabric Apps with VPAA design tokens and shadcn-svelte theming (on the `svelte-vpaa` branch).

## New project from this template

### 1. Clone and name your app

Pick a name for your app (e.g. `enrollment-dashboard`). Use lowercase with hyphens. 

Clone this template, using your app's name:

```bash
git clone https://github.com/Rice-University-Academic-Affairs/Fabric-Data-App-Template.git enrollment-dashboard
cd enrollment-dashboard
```

Then replace the template placeholder `fabric-data-app-template` in these two files with the same name. This is the name that will appear in Fabric.

**`rayfin/rayfin.yml`**
```yaml
id: enrollment-dashboard
name: enrollment-dashboard
```

**`package.json`**
```json
"name": "enrollment-dashboard"
```

The folder name, `rayfin.yml` `id`/`name`, and `package.json` `name` should all match.

### 2. Install Node and dependencies

Install nvm, the node version manager:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash
```

Install npm and node:

```bash
nvm install 24
```

Verify npm and node installation:

```bash
node -v
npm -v
```

Install project dependencies:

```bash
npm install
```

### 3. Log in to Rayfin

```bash
npx rayfin login
```

If the OS keychain is unavailable:

```bash
npx rayfin login --encryption-fallback-enabled
```

### 4. Register a semantic model

```bash
node node_modules/@microsoft/fabric-app-data-cli/dist/index.js add default \
  --from-url "<Fabric URL of your semantic model>"

node node_modules/@microsoft/fabric-app-data-cli/dist/index.js generate \
  -o src/fabric.generated.ts
```

### 5. Deploy to Fabric

```bash
npx rayfin up --workspace "<Your Fabric workspace name>"
```

This builds the app, creates the Rayfin App Backend in Fabric, and writes the `VITE_*` env vars your app needs.

Verify:

```bash
npx rayfin up status
```

## UI components

Add shadcn-svelte components from WSL:

```bash
npx shadcn-svelte@latest add button
```

Theme tokens live in `src/styles/`. See `AGENTS.md` for details.
