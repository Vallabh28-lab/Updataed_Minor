"use strict";
const vscode = require("vscode");
const child_process = require("child_process");
const util = require("util");
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
const channel = vscode__namespace.window.createOutputChannel("Kiro Logs", { log: true });
const logs = [];
function logLocalLevel(level, message, ...arguments_) {
  const argumentsJoined = arguments_.map((a) => typeof a === "object" ? JSON.stringify(a) : a).join(" ");
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message} ${argumentsJoined}`;
  logs.push(logMessage);
}
const logger = {
  trace(message, ...arguments_) {
    channel.trace(message, ...arguments_);
    logLocalLevel("trace", message, ...arguments_);
  },
  debug(message, ...arguments_) {
    channel.debug(message, ...arguments_);
    logLocalLevel("debug", message, ...arguments_);
  },
  info(message, ...arguments_) {
    channel.info(message, ...arguments_);
    logLocalLevel("info", message, ...arguments_);
  },
  warn(message, ...arguments_) {
    channel.warn(message, ...arguments_);
    logLocalLevel("warn", message, ...arguments_);
  },
  error(error, ...arguments_) {
    channel.error(error, ...arguments_);
    logLocalLevel("error", `${error}`, ...arguments_);
  },
  capture() {
    const logsString = logs.join("\n");
    logs.length = 0;
    channel.clear();
    return logsString;
  }
};
const mcpLogsPerServer = /* @__PURE__ */ new Map();
const mcpLogChannel = vscode__namespace.window.createOutputChannel("Kiro - MCP Logs", { log: true });
function storeMCPLogMessage(message, level, serverName, ...arguments_) {
  const argumentsJoined = arguments_.map((a) => typeof a === "object" ? JSON.stringify(a) : a).join(" ");
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const logServerName = serverName || "KIRO_MCP_DEFAULT";
  const logMessage = `[${timestamp}] [${level}] [${logServerName}] ${message} ${argumentsJoined}`;
  const serverLogs = mcpLogsPerServer.get(logServerName) || [];
  serverLogs.push(logMessage);
  mcpLogsPerServer.set(logServerName, serverLogs);
}
const mcpLogger = {
  trace(message, serverName, ...arguments_) {
    const serverNamePrefix = serverName ? `[${serverName}] ` : "";
    mcpLogChannel.trace(`${serverNamePrefix}${message}`, ...arguments_);
    storeMCPLogMessage(message, "trace", serverName, ...arguments_);
  },
  debug(message, serverName, ...arguments_) {
    const serverNamePrefix = serverName ? `[${serverName}] ` : "";
    mcpLogChannel.debug(`${serverNamePrefix}${message}`, ...arguments_);
    storeMCPLogMessage(message, "debug", serverName, ...arguments_);
  },
  info(message, serverName, ...arguments_) {
    const serverNamePrefix = serverName ? `[${serverName}] ` : "";
    mcpLogChannel.info(`${serverNamePrefix}${message}`, ...arguments_);
    storeMCPLogMessage(message, "info", serverName, ...arguments_);
  },
  warn(message, serverName, ...arguments_) {
    const serverNamePrefix = serverName ? `[${serverName}] ` : "";
    mcpLogChannel.warn(`${serverNamePrefix}${message}`, ...arguments_);
    storeMCPLogMessage(message, "warn", serverName, ...arguments_);
  },
  error(error, serverName, ...arguments_) {
    const serverNamePrefix = serverName ? `[${serverName}] ` : "";
    mcpLogChannel.error(`${serverNamePrefix}${error}`, ...arguments_);
    storeMCPLogMessage(`${error}`, "error", serverName, ...arguments_);
  },
  getLogsForServer(serverName) {
    return mcpLogsPerServer.get(serverName) || [];
  },
  show() {
    mcpLogChannel.show();
  },
  capture() {
    const logsString = Array.from(mcpLogsPerServer.values()).flatMap((it) => it).join("\n");
    mcpLogsPerServer.clear();
    mcpLogChannel.clear();
    return logsString;
  }
};
const powersLogChannel = vscode__namespace.window.createOutputChannel("Kiro - Powers", { log: true });
const powersLogs = [];
function storePowersLogMessage(message, level, ...arguments_) {
  const argumentsJoined = arguments_.map((a) => typeof a === "object" ? JSON.stringify(a) : a).join(" ");
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message} ${argumentsJoined}`;
  powersLogs.push(logMessage);
}
const powersLogger = {
  trace(message, ...arguments_) {
    powersLogChannel.trace(message, ...arguments_);
    storePowersLogMessage(message, "trace", ...arguments_);
  },
  debug(message, ...arguments_) {
    powersLogChannel.debug(message, ...arguments_);
    storePowersLogMessage(message, "debug", ...arguments_);
  },
  info(message, ...arguments_) {
    powersLogChannel.info(message, ...arguments_);
    storePowersLogMessage(message, "info", ...arguments_);
  },
  warn(message, ...arguments_) {
    powersLogChannel.warn(message, ...arguments_);
    storePowersLogMessage(message, "warn", ...arguments_);
  },
  error(error, ...arguments_) {
    powersLogChannel.error(error, ...arguments_);
    storePowersLogMessage(`${error}`, "error", ...arguments_);
  },
  show() {
    powersLogChannel.show();
  },
  capture() {
    const logsString = powersLogs.join("\n");
    powersLogs.length = 0;
    powersLogChannel.clear();
    return logsString;
  }
};
const logOutputChannels = {
  kiro: channel,
  mcp: mcpLogChannel,
  powers: powersLogChannel
};
const execAsync = util.promisify(child_process.exec);
const MIDWAY_COMMAND = "mwinit";
const WHICH_COMMAND = process.platform == "win32" ? "where.exe" : "which";
async function isMwinitToolAvailable() {
  try {
    await execAsync(`${WHICH_COMMAND} ${MIDWAY_COMMAND}`);
    return true;
  } catch {
    return false;
  }
}
function isAbortError(error) {
  return error instanceof Error && (error.name.includes("Abort") || error.message.includes("Aborted"));
}
function isBlockedAccessError(error) {
  return error instanceof Error && (error.name.includes("NewUserAccessPausedError") || error.message.includes("Kiro access not available for this account"));
}
function mapUnknownToErrorType(error) {
  const errorType = error instanceof Error ? error.name : "UnknownError";
  const isAbort = isAbortError(error);
  return isAbort ? "AbortedError" : errorType;
}
class TrustedError extends Error {
}
exports.TrustedError = TrustedError;
exports.isAbortError = isAbortError;
exports.isBlockedAccessError = isBlockedAccessError;
exports.isMwinitToolAvailable = isMwinitToolAvailable;
exports.logOutputChannels = logOutputChannels;
exports.logger = logger;
exports.mapUnknownToErrorType = mapUnknownToErrorType;
exports.mcpLogger = mcpLogger;
exports.powersLogger = powersLogger;
