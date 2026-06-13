# Kiro extension

This package is the VS Code extension that wraps the Kiro AI development environment. It consumes the four `@kiro/*` packages from `kiro-agent` (the agent core, ACP transport, shared types, and the chat webview UI), so cross-repo work usually means iterating in both repos at once.

## Choose a watcher

One of these MUST be running in another shell before you launch the dev host. Without it the chat webview hits `localhost:5173` and renders blank.

Extension-only changes:

```bash
npm install     # only needed if package-lock.json changed since last install; use npm ci only for module resolution errors
npm run watch
```

Changes that span both repos (or to test a kiro-agent branch):

```bash
npm install                                                            # skip if lockfile hasn't changed; use npm ci only for clean-slate troubleshooting
npm run dev:agent -- --agent-path /path/to/kiro-agent
```

`dev:agent` symlinks the four `@kiro/*` packages from the agent worktree into this worktree's `node_modules/`, starts watchers in both repos, and bridges the agent's `dist/` updates to esbuild. The symlinks are scoped to this worktree, so two extension worktrees can each link to different agent worktrees concurrently.

Running a one-off build (for example `npm run pr-check:quick`) against a local agent is supported: start `dev:agent` in one shell and run the build in another. The watcher and the build share the symlinks without conflict. If you skip `dev:agent` while the agent branch has changes that haven't been published as a new `@kiro/*` version, the extension build will fail to find the new types.

## Where the rest lives

The `local-development` skill (`.kiro/skills/local-development/SKILL.md`) is the source of truth for everything else in the extension dev environment:

- CodeArtifact authentication (`npm run auth`, token lifetime, what to do when `npm install` returns 401/403).
- Launching and reloading the dev host with `--extensionDevelopmentPath`, the throwaway `/tmp` workspace folder trick, and the `--remote-debugging-port` flag.
- Driving the dev host from chat through the `kiro-devtools` MCP, including the `mcp.json` snippet and the typical click-through flow.
- Troubleshooting playbooks for missing link symptoms, nested `@kiro/*` copies, duplicate-dependency `instanceof` failures, TypeScript type mismatches, stale Vite chunks, and the esbuild bridge.

Activate the skill when the standard install or link doesn't behave as documented above, when you need to launch or drive the dev host, or when a build error points at the `@kiro/*` link mechanism.
