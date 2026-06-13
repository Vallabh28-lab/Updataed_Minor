"use strict";
const vscode = require("vscode");
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
const DEFAULT_AUTH_PORTAL_URL = "https://app.kiro.dev";
const AUTH_PORTAL_URL_ENV = "KIRO_AUTH_PORTAL_URL";
function getAuthPortalUrl() {
  const envOverride = process.env[AUTH_PORTAL_URL_ENV];
  if (envOverride) {
    return envOverride;
  }
  const portalUrl = vscode__namespace.workspace.getConfiguration().get("kiroAuthConfig.portalUrl");
  if (portalUrl) {
    return portalUrl;
  }
  return DEFAULT_AUTH_PORTAL_URL;
}
function getAuthSuccessPageUrl() {
  return `${getAuthPortalUrl()}/signin?auth_status=success&redirect_from=KiroIDE`;
}
function getAuthErrorPageUrl(errorMessage) {
  const encodedMessage = encodeURIComponent(errorMessage);
  return `${getAuthPortalUrl()}/signin?auth_status=error&redirect_from=KiroIDE&error_message=${encodedMessage}`;
}
exports.getAuthErrorPageUrl = getAuthErrorPageUrl;
exports.getAuthPortalUrl = getAuthPortalUrl;
exports.getAuthSuccessPageUrl = getAuthSuccessPageUrl;
