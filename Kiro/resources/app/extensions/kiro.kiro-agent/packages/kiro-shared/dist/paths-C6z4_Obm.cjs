"use strict";
const path = require("path");
const os = require("os");
const fs = require("fs");
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
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const os__namespace = /* @__PURE__ */ _interopNamespaceDefault(os);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
function getHomeKiroPath() {
  const homePath = os__namespace.homedir();
  return path__namespace.join(homePath, ".kiro");
}
function getWorkspaceKiroPath(workspaceDir) {
  return path__namespace.join(workspaceDir, ".kiro");
}
function getActiveMcpConfigLocation(workspaceDirs) {
  const workspaceConfigPaths = [];
  let userConfigPath;
  if (workspaceDirs && workspaceDirs.length > 0) {
    for (const workspaceDir of workspaceDirs) {
      const workspacePath = path__namespace.join(getWorkspaceKiroPath(workspaceDir), "settings", "mcp.json");
      if (fs__namespace.existsSync(workspacePath)) {
        workspaceConfigPaths.push(workspacePath);
      }
    }
  }
  const kiroHomePath = getHomeKiroPath();
  if (kiroHomePath) {
    const homePath = path__namespace.join(kiroHomePath, "settings", "mcp.json");
    if (fs__namespace.existsSync(homePath)) {
      userConfigPath = homePath;
    }
  }
  return {
    workspaceConfigPaths,
    userConfigPath
  };
}
exports.getActiveMcpConfigLocation = getActiveMcpConfigLocation;
exports.getHomeKiroPath = getHomeKiroPath;
exports.getWorkspaceKiroPath = getWorkspaceKiroPath;
