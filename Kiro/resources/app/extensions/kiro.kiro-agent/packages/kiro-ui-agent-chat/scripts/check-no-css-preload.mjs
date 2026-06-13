/**
 * Post-build guard against CSS preload entries in the Vite bundle.
 *
 * WHY THIS EXISTS:
 * The chat webview runs inside a VS Code webview with a vscode-webview:// origin.
 * When Vite code-splits a chunk that imports CSS (e.g. streamdown's lazy-loaded
 * HighlightedCodeBlockBody), it registers the CSS file in __vite__mapDeps and
 * injects a runtime preload helper that creates <link rel="stylesheet"> tags.
 * Those tags resolve the CSS path relative to document.baseURI, which is the
 * webview origin — not the extension's vscode-resource:// asset URI. The fetch
 * fails, the preload helper throws "Unable to preload CSS for /styles.css",
 * and React's error boundary replaces the entire chat panel with an error screen.
 *
 * HOW IT'S PREVENTED:
 * cssCodeSplit: false in vite.config.ts bundles all CSS into a single file loaded
 * via the <link> tag in the webview HTML (which uses the correct asset URI).
 *
 * WHAT TO DO IF THIS SCRIPT FAILS:
 * A .css entry appeared in __vite__mapDeps, meaning CSS code splitting is active.
 * Ensure cssCodeSplit: false is set in vite.config.ts. This can happen if the
 * setting is removed, or if a Vite upgrade changes the default behavior.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mainJs = readFileSync(join(__dirname, '..', 'dist', 'session-view', 'main.js'), 'utf-8');

// __vite__mapDeps is Vite's generated function that maps dependency indices to file paths.
// If any entry ends with .css, the preload helper will try to fetch it at runtime.
const match = mainJs.match(/__vite__mapDeps.*?\[([^\]]*)\]/);
if (match) {
  const entries = match[1].split(',').map((s) => s.trim().replace(/['"]/g, ''));
  const cssEntries = entries.filter((e) => e.endsWith('.css'));
  if (cssEntries.length > 0) {
    process.exit(1);
  }
}
