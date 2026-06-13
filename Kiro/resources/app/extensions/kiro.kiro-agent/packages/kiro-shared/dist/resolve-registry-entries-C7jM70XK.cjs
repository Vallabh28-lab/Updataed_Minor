"use strict";
const vscode = require("vscode");
const zod = require("zod");
const telemetry_index = require("./telemetry/index.cjs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const vscode__namespace = /* @__PURE__ */ _interopNamespaceDefault(vscode);
const KeyValueInputSchema = zod.z.object({
  name: zod.z.string().min(1),
  value: zod.z.string().optional()
});
const PositionalArgumentSchema = zod.z.object({
  type: zod.z.literal("positional"),
  value: zod.z.string()
});
const StdioTransportSchema = zod.z.object({
  type: zod.z.literal("stdio")
});
const StreamableHttpTransportSchema = zod.z.object({
  type: zod.z.literal("streamable-http"),
  url: zod.z.string().url(),
  headers: zod.z.array(KeyValueInputSchema).optional()
});
const SseTransportSchema = zod.z.object({
  type: zod.z.literal("sse"),
  url: zod.z.string().url(),
  headers: zod.z.array(KeyValueInputSchema).optional()
});
const TransportSchema = zod.z.discriminatedUnion("type", [
  StdioTransportSchema,
  StreamableHttpTransportSchema,
  SseTransportSchema
]);
const RemoteTransportSchema = zod.z.discriminatedUnion("type", [StreamableHttpTransportSchema, SseTransportSchema]);
const PackageRegistryTypeSchema = zod.z.enum(["npm", "pypi", "oci"]);
const PackageSchema = zod.z.object({
  registryType: PackageRegistryTypeSchema,
  registryBaseUrl: zod.z.string().min(1).optional(),
  identifier: zod.z.string().min(1),
  transport: TransportSchema,
  runtimeArguments: zod.z.array(PositionalArgumentSchema).optional(),
  packageArguments: zod.z.array(PositionalArgumentSchema).optional(),
  environmentVariables: zod.z.array(KeyValueInputSchema).optional()
}).refine(
  (pkg) => {
    if (pkg.registryBaseUrl === void 0 || pkg.registryType === "oci") {
      return true;
    }
    return zod.z.string().url().safeParse(pkg.registryBaseUrl).success;
  },
  {
    message: "registryBaseUrl must be a valid URL for non-OCI registry types",
    path: ["registryBaseUrl"]
  }
);
const SERVER_NAME_PATTERN = /^[a-zA-Z0-9._-]+$/;
const VERSION_RANGE_PATTERN = /^[\^~>=<]|[.][x*]|^[0-9]+\.[x*]/;
function isVersionRange(version) {
  return VERSION_RANGE_PATTERN.test(version);
}
const ServerDetailSchema = zod.z.object({
  name: zod.z.string().min(3).max(200).regex(SERVER_NAME_PATTERN),
  title: zod.z.string().min(1).max(100).optional(),
  description: zod.z.string().min(1).max(100),
  version: zod.z.string().max(255).refine((v) => !isVersionRange(v), { message: "Version ranges are not allowed" }),
  packages: zod.z.array(PackageSchema).length(1).optional(),
  remotes: zod.z.array(RemoteTransportSchema).length(1).optional()
}).refine((s) => s.packages !== void 0 !== (s.remotes !== void 0), {
  message: "Server must have either packages or remotes, not both or neither"
});
const RegistryJsonSchema = zod.z.object({
  servers: zod.z.array(
    zod.z.object({
      server: ServerDetailSchema
    })
  )
});
const RegistryServerConfigEntrySchema = zod.z.object({
  type: zod.z.literal("registry"),
  timeout: zod.z.number().positive().optional(),
  headers: zod.z.record(zod.z.string()).optional(),
  env: zod.z.record(zod.z.string()).optional(),
  disabled: zod.z.boolean().default(false),
  autoApprove: zod.z.array(zod.z.string()).optional(),
  disabledTools: zod.z.array(zod.z.string()).optional()
});
function getServerKind(server) {
  const hasPackages = server.packages !== void 0 && server.packages.length === 1;
  const hasRemotes = server.remotes !== void 0 && server.remotes.length === 1;
  if (hasRemotes && !hasPackages) return "remote";
  if (hasPackages && !hasRemotes) return "local";
  return "invalid";
}
function keyValueArrayToRecord(arr) {
  const record = /* @__PURE__ */ Object.create(null);
  for (const entry of arr) {
    record[entry.name] = entry.value ?? "";
  }
  return record;
}
function keyValueRecordToArray(record) {
  return Object.entries(record).map(([name, value]) => ({ name, value }));
}
function deriveCommandFromPackage(pkg) {
  const runtimeArgs = (pkg.runtimeArguments ?? []).map((a) => a.value);
  const packageArgs = (pkg.packageArguments ?? []).map((a) => a.value);
  switch (pkg.registryType) {
    case "npm": {
      const args = ["-y", ...runtimeArgs, pkg.identifier, ...packageArgs];
      const implicitEnv = {};
      if (pkg.registryBaseUrl) {
        implicitEnv["NPM_CONFIG_REGISTRY"] = pkg.registryBaseUrl;
      }
      return { command: "npx", args, implicitEnv };
    }
    case "pypi": {
      const args = [
        ...pkg.registryBaseUrl ? ["--default-index", pkg.registryBaseUrl] : [],
        ...runtimeArgs,
        pkg.identifier,
        ...packageArgs
      ];
      return { command: "uvx", args, implicitEnv: {} };
    }
    case "oci": {
      const baseUrl = pkg.registryBaseUrl?.replace(/^https?:\/\//, "");
      const image = baseUrl ? `${baseUrl}/${pkg.identifier}` : pkg.identifier;
      const args = ["run", ...runtimeArgs, image, ...packageArgs];
      return { command: "docker", args, implicitEnv: {} };
    }
  }
}
class RegistryStore {
  /**
   * Creates a new RegistryStore.
   *
   * Production callers should use `getInstance()` instead. The constructor is
   * public so tests can create isolated instances with mock dependencies.
   * @param interpolate - injected string interpolation function (used by config resolution)
   * @param envProvider - abstracts process.env access for testability
   */
  constructor(interpolate, envProvider = {
    get: (name) => process.env[name]
  }) {
    this.interpolate = interpolate;
    this.envProvider = envProvider;
  }
  static instance;
  _serverMap = /* @__PURE__ */ new Map();
  _onDidChangeEmitter = new vscode__namespace.EventEmitter();
  /** Fires when registry content is replaced or cleared. */
  onDidChange = this._onDidChangeEmitter.event;
  /**
   * Get the shared RegistryStore singleton.
   *
   * Must be initialized via `initInstance()` before first use.
   * Throws if the instance has not been initialized.
   */
  static getInstance() {
    if (!RegistryStore.instance) {
      throw new Error("RegistryStore has not been initialized. Call RegistryStore.initInstance() first.");
    }
    return RegistryStore.instance;
  }
  /**
   * Initialize the singleton with the required dependencies.
   *
   * Throws if an instance already exists — call `reset()` first if
   * re-initialization is needed (e.g. during extension reactivation).
   */
  static initInstance(interpolate, envProvider) {
    if (RegistryStore.instance) {
      throw new Error("RegistryStore is already initialized. Call RegistryStore.reset() before re-initializing.");
    }
    RegistryStore.instance = new RegistryStore(interpolate, envProvider);
    return RegistryStore.instance;
  }
  /**
   * Dispose and remove the singleton instance.
   */
  static reset() {
    if (RegistryStore.instance) {
      RegistryStore.instance.dispose();
      RegistryStore.instance = void 0;
    }
  }
  /** True when the store has registry content loaded. */
  get isActive() {
    return this._serverMap.size > 0;
  }
  /** Dispose the EventEmitter and clear internal state. */
  dispose() {
    this._onDidChangeEmitter.dispose();
    this._serverMap.clear();
  }
  /** Replace all registry content with the given validated RegistryJson. */
  setRegistry(registryJson) {
    const serverMap = /* @__PURE__ */ new Map();
    for (const entry of registryJson.servers) {
      serverMap.set(entry.server.name, entry.server);
    }
    this._serverMap = serverMap;
    this._onDidChangeEmitter.fire();
  }
  /** Remove all registry content. */
  clear() {
    this._serverMap.clear();
    this._onDidChangeEmitter.fire();
  }
  /** Look up a server by name, or undefined if not found. */
  getServerDefinition(name) {
    return this._serverMap.get(name);
  }
  /** Return all server definitions, or an empty array when inactive. */
  getAllServerDefinitions() {
    return Array.from(this._serverMap.values());
  }
  /**
   * Merge a registry server definition with a user config entry to produce
   * an MCPOptions the manager can consume directly.
   */
  resolveServerConfig(name, configEntry) {
    const serverDef = this.getServerDefinition(name);
    if (!serverDef) return void 0;
    const kind = getServerKind(serverDef);
    if (kind === "invalid") return void 0;
    return kind === "remote" ? this.resolveRemoteConfig(serverDef, configEntry) : this.resolveLocalConfig(serverDef, configEntry);
  }
  // resolveRemoteConfig and resolveLocalConfig are only called after getServerKind
  // confirms the server has exactly one remote or one package, so the array access is safe.
  resolveRemoteConfig(serverDef, configEntry) {
    const remote = serverDef.remotes[0];
    const registryHeaders = remote.headers ? this.interpolateRecord(keyValueArrayToRecord(remote.headers)) : {};
    const userHeaders = configEntry.headers ? this.interpolateRecord(configEntry.headers) : {};
    const mergedHeaders = { ...registryHeaders, ...userHeaders };
    const url = this.interpolateString(remote.url);
    return {
      url,
      headers: Object.keys(mergedHeaders).length > 0 ? mergedHeaders : void 0,
      disabled: configEntry.disabled,
      autoApprove: configEntry.autoApprove,
      disabledTools: configEntry.disabledTools
    };
  }
  resolveLocalConfig(serverDef, configEntry) {
    const pkg = serverDef.packages[0];
    const { command, args, implicitEnv } = deriveCommandFromPackage(pkg);
    const registryEnv = pkg.environmentVariables ? this.interpolateRecord(keyValueArrayToRecord(pkg.environmentVariables)) : {};
    const userEnv = configEntry.env ? this.interpolateRecord(configEntry.env) : {};
    const mergedEnv = { ...implicitEnv, ...registryEnv, ...userEnv };
    const interpolatedArgs = args.map((a) => this.interpolateString(a, mergedEnv));
    return {
      command,
      args: interpolatedArgs,
      env: Object.keys(mergedEnv).length > 0 ? mergedEnv : void 0,
      disabled: configEntry.disabled,
      autoApprove: configEntry.autoApprove,
      disabledTools: configEntry.disabledTools
    };
  }
  interpolateString(value, env) {
    const combinedEnv = new Proxy(env ?? {}, {
      get: (_target, prop) => env?.[prop] ?? this.envProvider.get(prop) ?? "",
      has: (_target, prop) => {
        return env?.[prop] !== void 0 || this.envProvider.get(prop) !== void 0;
      }
    });
    return this.interpolate(value, { expandAll: true, fallbackToEmpty: true, env: combinedEnv });
  }
  interpolateRecord(record, env) {
    const result = {};
    for (const [key, value] of Object.entries(record)) {
      result[key] = this.interpolateString(value, env);
    }
    return result;
  }
}
function resolveRegistryEntries(config, registryStore, options) {
  const accessMode = options?.accessMode ?? "nonRegistry";
  const resolvedServers = {};
  const unresolvedServers = [];
  const accessModeFilteredServers = [];
  for (const [name, entry] of Object.entries(config.mcpServers)) {
    if (entry.type === "registry") {
      if (accessMode === "nonRegistry") {
        accessModeFilteredServers.push(name);
        continue;
      }
      const parsed = RegistryServerConfigEntrySchema.safeParse(entry);
      if (!parsed.success) {
        unresolvedServers.push(name);
        continue;
      }
      const resolved = registryStore.resolveServerConfig(name, parsed.data);
      if (resolved) {
        resolvedServers[name] = { ...resolved, type: "registry" };
      } else {
        unresolvedServers.push(name);
      }
    } else {
      if (accessMode === "registry") {
        accessModeFilteredServers.push(name);
      } else {
        resolvedServers[name] = entry;
      }
    }
  }
  const registryEntryCount = Object.values(config.mcpServers).filter((e) => e.type === "registry").length;
  const resolvedCount = registryEntryCount - unresolvedServers.length;
  telemetry_index.recordMcpRegistryEvent({
    type: "registryResolutionCompleted",
    dimensions: {
      resolvedCount: String(resolvedCount),
      unresolvedCount: String(unresolvedServers.length),
      storeActive: String(registryStore.isActive)
    }
  });
  const resolvedConfig = {
    mcpServers: resolvedServers
  };
  if (config.powers) {
    resolvedConfig.powers = config.powers;
  }
  return { resolvedConfig, unresolvedServers, accessModeFilteredServers };
}
exports.KeyValueInputSchema = KeyValueInputSchema;
exports.PackageRegistryTypeSchema = PackageRegistryTypeSchema;
exports.PackageSchema = PackageSchema;
exports.PositionalArgumentSchema = PositionalArgumentSchema;
exports.RegistryJsonSchema = RegistryJsonSchema;
exports.RegistryServerConfigEntrySchema = RegistryServerConfigEntrySchema;
exports.RegistryStore = RegistryStore;
exports.RemoteTransportSchema = RemoteTransportSchema;
exports.ServerDetailSchema = ServerDetailSchema;
exports.SseTransportSchema = SseTransportSchema;
exports.StdioTransportSchema = StdioTransportSchema;
exports.StreamableHttpTransportSchema = StreamableHttpTransportSchema;
exports.TransportSchema = TransportSchema;
exports.VERSION_RANGE_PATTERN = VERSION_RANGE_PATTERN;
exports.deriveCommandFromPackage = deriveCommandFromPackage;
exports.getServerKind = getServerKind;
exports.isVersionRange = isVersionRange;
exports.keyValueArrayToRecord = keyValueArrayToRecord;
exports.keyValueRecordToArray = keyValueRecordToArray;
exports.resolveRegistryEntries = resolveRegistryEntries;
