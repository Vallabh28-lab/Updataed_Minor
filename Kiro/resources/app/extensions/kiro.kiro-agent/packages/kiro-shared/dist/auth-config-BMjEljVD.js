import * as vscode from "vscode";
const DEFAULT_AUTH_PORTAL_URL = "https://app.kiro.dev";
const AUTH_PORTAL_URL_ENV = "KIRO_AUTH_PORTAL_URL";
function getAuthPortalUrl() {
  const envOverride = process.env[AUTH_PORTAL_URL_ENV];
  if (envOverride) {
    return envOverride;
  }
  const portalUrl = vscode.workspace.getConfiguration().get("kiroAuthConfig.portalUrl");
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
export {
  getAuthErrorPageUrl as a,
  getAuthPortalUrl as b,
  getAuthSuccessPageUrl as g
};
