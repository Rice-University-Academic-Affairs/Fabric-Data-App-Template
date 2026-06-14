# Minimal Fabric Data App Template

Framework-agnostic template for Fabric Apps: Rayfin embedded auth + DAX queries against a semantic model.

## New project from this template

### 1. Copy and rename

```bash
cp -r minimal-app my-new-app
cd my-new-app
```

Set your app name in two places (this becomes the Fabric App Backend name on deploy):

- `rayfin/rayfin.yml` — `id` and `name`
- `package.json` — `"name"`

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

Replace `src/main.ts` with your own frontend entry point.
