# ACP Agent Migration — Complete

## Done

### Phase 1-4: Capability types, VS Code handlers, type predicates, ACP tools

- 7 new capabilities: findFiles, findTextInFiles, getDiagnostics, renameSymbol, moveFile, readCode, editCode
- Full stack: acp-type-covenant types → VS Code handlers → kiro-client predicates → ACP tool impls

### Phase 5: Nuke src/extension/interaction/

- All files relocated to capabilities/, utils/, spec-editor/utils/, terminal/
- Zero remaining references to interaction/

### Phase 6: Consolidate workspace connections

- ACPWorkspaceConnection class → createACPWorkspaceConnection() factory function
- Both ACP and VS Code paths now use WorkspaceConnectionImpl with different injected providers
- ACP providers: ACPSteeringProvider, ACPCheckpointProvider, ACPFileOperationsProvider,
  ACPWorkspaceResolver, ACPTerminalManager, ACPFileSystem, ACPBackgroundProcessManager
