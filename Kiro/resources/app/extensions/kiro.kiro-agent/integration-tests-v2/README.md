# Integration Tests v2 (CDP Harness)

CDP-based UI integration test harness for Kiro. Interact with the product like a user would — no extra extensions required.

## How it works

Kiro is an Electron app. This harness launches the Kiro installation from `.vscode-test/` (downloaded by the existing test infrastructure) with `--remote-debugging-port=6789` and connects via Chrome DevTools Protocol over WebSocket. It injects JavaScript into the renderer to find elements, click buttons, type text, and read what's on screen.

## Prerequisites

Make sure Kiro is downloaded:

```bash
# From the kiro-extension root
npm run vscode-test:install
```

## Quick start

```bash
cd integration-tests-v2
npm install
npm run build

# Run unit tests (mock server, event stream encoder, etc.)
npm test

# Run e2e tests (launches Kiro, connects via CDP)
npm run test:e2e
```

## Directory layout

```
integration-tests-v2/
  __workspace__/     # Isolated workspace opened by Kiro during tests
  __userdir__/       # Isolated user-data dir (gitignored, recreated each run)
  __extensions__/    # Isolated extensions dir (gitignored, recreated each run)
  src/
    setup/           # Global setup/teardown and per-suite test env
    rts-mock/        # Mock server for CodeWhisperer runtime APIs
    tests/           # E2E test suites
    cdp.ts           # Low-level CDP connection
    harness.ts       # High-level test harness API
    selectors.ts     # CSS selectors for Kiro's webview
    types.ts         # Public types
    index.ts         # Barrel exports
```

## Usage

```typescript
import { KiroTestHarness } from './harness.js';

const kiro = new KiroTestHarness({ cdpPort: 6789 });
await kiro.connect(0);

await kiro.chat('Build a todo app', 'expected response text');
await kiro.takeSnapshot('agent');

await kiro.dispose();
```
