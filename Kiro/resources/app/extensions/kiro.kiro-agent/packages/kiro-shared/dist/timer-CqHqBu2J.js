import * as vscode from "vscode";
import { b as logger, d as isMwinitToolAvailable } from "./errors-BVoUlRsM.js";
let cachedIsAmazonInternal = null;
async function checkIsAmazonInternal() {
  if (cachedIsAmazonInternal === null) {
    cachedIsAmazonInternal = await isMwinitToolAvailable();
  }
  return cachedIsAmazonInternal;
}
function addPrivacyHeadersMiddleware(client, clientName = "CodeWhisperer") {
  const contentCollectionEnabled = vscode.workspace.getConfiguration("telemetry").get("dataSharingAndPromptLogging.contentCollectionForServiceImprovement", false);
  if (!contentCollectionEnabled) {
    logger.debug(`${clientName}: content collection is disabled, setting x-amzn-codewhisperer-optout to true`);
    const middleware = (next) => async (args) => {
      const requestArgs = args;
      requestArgs.request.headers = {
        ...requestArgs.request.headers,
        "x-amzn-codewhisperer-optout": "true"
      };
      return next(args);
    };
    const clientWithMiddleware = client;
    clientWithMiddleware.middlewareStack.add(middleware, { step: "build" });
  }
}
function addAgentModeHeadersMiddleware(client, agentMode) {
  const middleware = (next) => async (args) => {
    const requestArgs = args;
    requestArgs.request.headers = {
      ...requestArgs.request.headers,
      "x-amzn-kiro-agent-mode": agentMode
    };
    return next(args);
  };
  const clientWithMiddleware = client;
  clientWithMiddleware.middlewareStack.add(middleware, { step: "build" });
}
function addExternalIdpTokenTypeMiddleware(client, authMethod, clientName = "CodeWhisperer") {
  if (authMethod !== "external_idp") {
    return;
  }
  logger.debug(`${clientName}: adding TokenType header for External IdP`);
  const middleware = (next) => async (args) => {
    const requestArgs = args;
    requestArgs.request.headers = {
      ...requestArgs.request.headers,
      TokenType: "EXTERNAL_IDP"
    };
    return next(args);
  };
  const clientWithMiddleware = client;
  clientWithMiddleware.middlewareStack.add(middleware, { step: "build" });
}
function addRedirectForInternalMiddleware(client, provider) {
  const middleware = (next, context) => async (args) => {
    if (context.commandName === "SendTelemetryEventCommand") {
      return next(args);
    }
    const isInternal = provider !== void 0 ? provider === "Internal" : await checkIsAmazonInternal();
    if (isInternal) {
      const requestArgs = args;
      requestArgs.request.headers = {
        ...requestArgs.request.headers,
        "redirect-for-internal": "true"
      };
    }
    return next(args);
  };
  const clientWithMiddleware = client;
  clientWithMiddleware.middlewareStack.add(middleware, { step: "build" });
}
async function updateResolvedIDESetting(section, setting, value, scope) {
  const settings = vscode.workspace.getConfiguration(section, scope);
  const hasWorkspace = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0;
  if (hasWorkspace && settings.inspect(setting)?.workspaceValue !== void 0) {
    await settings.update(setting, value, vscode.ConfigurationTarget.Workspace);
  } else {
    await settings.update(setting, value, vscode.ConfigurationTarget.Global);
  }
}
class IntervalTimer {
  handle;
  /** Starts a periodic timer, cancelling any existing one first. */
  start(callback, intervalMs) {
    this.cancel();
    this.handle = setInterval(() => void callback(), intervalMs);
  }
  /** Cancels the current timer if one is running. Safe to call when idle. */
  cancel() {
    if (this.handle !== void 0) {
      clearInterval(this.handle);
      this.handle = void 0;
    }
  }
}
export {
  IntervalTimer as I,
  addAgentModeHeadersMiddleware as a,
  addExternalIdpTokenTypeMiddleware as b,
  addPrivacyHeadersMiddleware as c,
  addRedirectForInternalMiddleware as d,
  updateResolvedIDESetting as u
};
