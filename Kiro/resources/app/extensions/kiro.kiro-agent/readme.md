# Kiro Extension

The Kiro extension powers an AI-integrated, spec-based development environment. Customers define systems and their components using a friendly, natural language based specification in a local application which in turn produces code for deployment.

## Development

### Prerequisites

You need `ada` (AWS credential tool) and the AWS CLI to authenticate with CodeArtifact, where `@kiro` scoped packages are hosted.

### Standard development (published packages)

Use this path when you're working on the extension only and don't need local kiro-agent changes.

**1. Authenticate with CodeArtifact:**

```bash
npm run auth
```

This runs `ada credentials update` to refresh AWS credentials, fetches a CodeArtifact auth token, and configures npm. The token is valid for **12 hours** — re-run when it expires.

If you already have valid AWS credentials (e.g., from a recent `ada` session):

```bash
npm run auth -- --skip-ada
```

**2. Install and watch:**

```bash
npm ci
npm run watch
```

The watcher (esbuild) recompiles on source changes. Press <kbd>F5</kbd> in VS Code to launch the Extension Development Host.

### Local kiro-agent development

Use this when you need to develop the extension and kiro-agent simultaneously with live reloading across both repos.

**Single command:**

```bash
npm run dev:agent
```

This handles everything: symlinks all 4 `@kiro` workspace packages from kiro-agent (backing up the originals), cleans nested `node_modules` copies that interfere with symlinks, starts watchers in both repos with color-coded output, and bridges esbuild's file watcher so agent changes trigger extension rebuilds.

**Custom agent repo path** (default is `../kiro-agent`):

```bash
npm run dev:agent -- --agent-path /path/to/kiro-agent
```

Press <kbd>Ctrl+C</kbd> to stop — this tears down the symlinks and restores the original packages automatically.

> For manual setup steps, troubleshooting, and detailed explanations, see [docs/agent-repo-migration/local-dev-setup.md](https://github.com/kiro-team/kiro-extension/blob/HEAD/docs/agent-repo-migration/local-dev-setup.md).

## Build Process and Bundling Strategy

This extension uses a sophisticated bundling strategy to minimize the number of files in the final package while preserving functionality for packages that cannot be bundled.

### Overview

The extension uses ESBuild to bundle most dependencies into the main extension file (`dist/extension.js`), but keeps certain packages external due to:

- Native binaries that can't be bundled
- Dynamic requires or runtime constraints
- Platform-specific dependencies
- VSCode runtime provided modules

### External Dependencies Management

We use an automated system to manage which packages remain external (unbundled):

#### The `analyze-externals` Script

The `scripts/analyze-externals.mjs` script maintains consistency between:

- `scripts/esbuild.mjs` - ESBuild external packages list (auto-generated section only)
- `.vscodeignore` - Extension packaging exclusions (auto-generated section only)

**What it does:**

1. Reads the curated `UNBUNDLEABLE_PACKAGES` list
2. Updates auto-generated sections in both configuration files using START/END markers
3. Runs automatically during all build processes
4. Preserves manual entries outside the auto-generated sections

**Usage:**

```bash
npm run analyze-externals
```

#### Adding New External Dependencies

If you need to add a package that cannot be bundled:

1. **Add to the curated list**: Edit `scripts/analyze-externals.mjs` and add the package to the `UNBUNDLEABLE_PACKAGES` array:

   ```javascript
   const UNBUNDLEABLE_PACKAGES = [
     // ... existing packages
     'your-new-package',
   ];
   ```

2. **Categorize appropriately**: Place it in the correct section:
   - `// VSCode runtime provided` - for vscode module
   - `// Native binaries that can't be bundled` - for packages with .node files
   - `// ESBuild and platform-specific binaries` - for @esbuild/\* packages
   - `// Runtime dependencies with native binaries or dynamic requires`
   - `// Relative imports that can't be bundled`

3. **Run the script**: The changes will be applied automatically during the next build, or run manually:
   ```bash
   npm run analyze-externals
   ```

#### Manual Exceptions

**esbuild.mjs manual externals** - Some packages need to be external to ESBuild bundling:

```javascript
// Manual externals (esbuild-specific, not in .vscodeignore)
'vscode',           // Provided by VSCode runtime
```

**\*.vscodeignore manual exceptions** - Some packages need to be included in the extension package for runtime use but are not directly imported by the bundled code:

```gitignore
# Keep dependencies of native binary packages
!node_modules/@lancedb/
!node_modules/@vscode/ripgrep/
```

Only add manual .vscodeignore exceptions for packages that:

- Contain native binaries needed at runtime
- Are dynamically loaded by other dependencies
- Are not directly imported by the main extension code

### Build Commands

- `npm run compile` - Build all components
- `npm run package` - Compile code only
- `npm run release` - Full build with extension packaging
- `npm run analyze-externals` - Update external dependencies configuration

## Security

See [CONTRIBUTING](https://github.com/kiro-team/kiro-extension/blob/main/CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
