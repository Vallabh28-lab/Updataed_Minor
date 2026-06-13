import * as vscode from "vscode";
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { MetricReporter, T as TelemetryNamespace } from "./telemetry/definitions/index.js";
import { withSpan } from "./telemetry/index.js";
import { T as TrustedError, b as logger } from "./errors-BVoUlRsM.js";
import "path";
import "os";
import "fs";
import { g as getMachineId } from "./machine-id-DDyBZGvP.js";
import { SSOOIDC, SSOOIDCServiceException, InvalidGrantException, AccessDeniedException, ExpiredTokenException, InvalidClientException, UnauthorizedClientException, InternalServerException, SlowDownException, InvalidRequestException } from "@aws-sdk/client-sso-oidc";
import "node-machine-id";
var AuthErrorType = /* @__PURE__ */ ((AuthErrorType2) => {
  AuthErrorType2["INVALID_AUTH"] = "INVALID_AUTH";
  AuthErrorType2["INVALID_SSO_AUTH"] = "INVALID_SSO_AUTH";
  AuthErrorType2["INVALID_IDC_AUTH"] = "INVALID_IDC_AUTH";
  AuthErrorType2["MISSING_TOKEN"] = "MISSING_TOKEN";
  AuthErrorType2["MALFORMED_TOKEN"] = "MALFORMED_TOKEN";
  AuthErrorType2["USER_ENVIRONMENT_ERROR"] = "USER_ENVIRONMENT_ERROR";
  AuthErrorType2["SERVER_ISSUE"] = "SERVER_ISSUE";
  AuthErrorType2["UNEXPECTED_ISSUE"] = "UNEXPECTED_ISSUE";
  AuthErrorType2["CANCELED"] = "CANCELED";
  AuthErrorType2["ABANDONED"] = "ABANDONED";
  AuthErrorType2["ACCESS_DENIED"] = "ACCESS_DENIED";
  AuthErrorType2["INVALID_USER_INPUT"] = "INVALID_USER_INPUT";
  AuthErrorType2["SIGN_IN_BLOCKED"] = "SIGN_IN_BLOCKED";
  AuthErrorType2["GENERIC_USER_FACING_KIRO_ERROR"] = "GENERIC_USER_FACING_KIRO_ERROR";
  return AuthErrorType2;
})(AuthErrorType || {});
const UserFacingErrorTypes = [
  "CANCELED",
  "SIGN_IN_BLOCKED"
  /* SIGN_IN_BLOCKED */
];
class AuthError extends TrustedError {
  constructor(authErrorType, message, userFacingErrorMessage) {
    super(message);
    this.authErrorType = authErrorType;
    this.userFacingErrorMessage = userFacingErrorMessage;
    this.name = authErrorType;
  }
  /**
   * Creates a new UserFacingError instance of the user facing message
   */
  toUserFacingError(defaultErrorMessage) {
    return new UserFacingError(this.userFacingErrorMessage || defaultErrorMessage, this.name);
  }
}
class UserFacingError extends AuthError {
  constructor(message, originType) {
    const errorType = originType && UserFacingErrorTypes.includes(originType) ? originType : "GENERIC_USER_FACING_KIRO_ERROR";
    super(errorType, message);
  }
}
class MissingTokenError extends AuthError {
  constructor(message, userFacingErrorMessage) {
    super("MISSING_TOKEN", message, userFacingErrorMessage);
  }
}
class MalformedTokenError extends AuthError {
  constructor(message, userFacingErrorMessage) {
    super("MALFORMED_TOKEN", message, userFacingErrorMessage);
  }
}
class InvalidAuthError extends AuthError {
  constructor(message, userFacingErrorMessage) {
    super("INVALID_AUTH", message, userFacingErrorMessage);
  }
}
class InvalidSSOAuthError extends AuthError {
  constructor(message) {
    super(
      "INVALID_SSO_AUTH",
      message,
      "Authentication with IAM Identity Center failed. Please verify you have an active subscription. For more information: https://kiro.dev/docs/troubleshooting/#aws-iam-identity-center-issues"
    );
  }
}
class InvalidIdCAuthError extends AuthError {
  constructor(message, userFacingErrorMessage) {
    super("INVALID_IDC_AUTH", message, userFacingErrorMessage);
  }
}
class UserEnvironmentError extends AuthError {
  constructor(message, userFacingErrorMessage) {
    super("USER_ENVIRONMENT_ERROR", message, userFacingErrorMessage);
  }
}
class NetworkIssueError extends UserEnvironmentError {
  constructor(message, userFacingErrorMessage) {
    const defaultUserFacingErrorMessage = "Operation failed due to network connectivity issues. Please verify your network connection, firewall settings, or proxy configuration that might be blocking the connection.";
    super(message, userFacingErrorMessage || defaultUserFacingErrorMessage);
  }
}
class FileSystemAccessError extends UserEnvironmentError {
  constructor(path, cause) {
    super(
      "Failed to access file system path",
      `Unable to access path: ${path}. Please verify that your user account has sufficient permissions for this location.`
    );
    if (cause) {
      this.cause = cause;
    }
  }
}
class SymlinkDetectedError extends UserEnvironmentError {
  constructor(path) {
    super(
      "Symbolic link detected at token storage path",
      `Security error: A symbolic link was detected at ${path}. Please remove the symlink and try again.`
    );
  }
}
class ServerIssueError extends AuthError {
  constructor(message, userFacingErrorMessage) {
    super("SERVER_ISSUE", message, userFacingErrorMessage);
  }
}
class UnexpectedIssueError extends AuthError {
  constructor(message, userFacingErrorMessage) {
    super("UNEXPECTED_ISSUE", message, userFacingErrorMessage);
  }
}
class CanceledError extends AuthError {
  constructor(message, userFacingErrorMessage) {
    super("CANCELED", message, userFacingErrorMessage);
  }
}
class AbandonedError extends AuthError {
  constructor() {
    super(
      "ABANDONED",
      "Timed-out waiting for browser login flow to complete",
      "Authentication session timed out. Please try signing in again."
    );
  }
}
class AccessDeniedError extends AuthError {
  constructor(message, userFacingErrorMessage) {
    super("ACCESS_DENIED", message, userFacingErrorMessage);
  }
}
class InvalidUserInputError extends AuthError {
  constructor(message, userFacingErrorMessage) {
    super("INVALID_USER_INPUT", message, userFacingErrorMessage);
  }
}
class InvalidStartUrlError extends InvalidUserInputError {
  constructor() {
    super(
      "Invalid start URL provided",
      "The start URL you entered is invalid. Please verify the URL format and try again."
    );
  }
}
class SignInBlockedError extends AuthError {
  constructor(message) {
    super("SIGN_IN_BLOCKED", message);
  }
}
class MissingPortError extends UnexpectedIssueError {
  /** Constructs a new MissingPortError */
  constructor() {
    super("AuthSSOServer: missing auth server port");
  }
}
class MissingCodeError extends InvalidAuthError {
  /** Constructs a new MissingCodeError */
  constructor() {
    super("AuthSSOServer: missing code", "Authentication failed: Please try signing in again.");
  }
}
class MissingStateError extends InvalidAuthError {
  /** Constructs a new MissingStateError */
  constructor() {
    super("AuthSSOServer: missing state", "Authentication failed: Please try signing in again.");
  }
}
class InvalidStateError extends InvalidAuthError {
  /** Constructs a new InvalidStateError */
  constructor() {
    super("AuthSSOServer: invalid state", "Authentication failed: Please try signing in again.");
  }
}
class AuthProviderDeniedAccess extends InvalidAuthError {
  constructor() {
    super(
      "Access denied through identity provider",
      "Authentication failed: The identity provider denied access to Kiro. Please ensure you grant all required permissions."
    );
  }
}
class AuthProviderFailure extends InvalidAuthError {
  constructor(cause) {
    super(
      `Failure from identity provider: ${cause}`,
      `Authentication failed: The identity provider reported an error: ${cause}`
    );
  }
}
class InvalidInvitationCodeError extends InvalidAuthError {
  constructor() {
    super(`Invalid invitation code entered`, `Invalid access code.`);
  }
}
class ServerTimeoutError extends UnexpectedIssueError {
  /** Constructs a new ServerTimeoutError */
  constructor() {
    super("AuthSSOServer: local server did not initiate within time limit.");
  }
}
class ServerListenError extends NetworkIssueError {
  constructor(cause, ports = []) {
    super(`AuthSSOServer: failed to listen to server. Tried ports: ${JSON.stringify(ports)}. Cause: ${cause}`);
  }
}
class FailedToConnectError extends NetworkIssueError {
  constructor(cause) {
    const parts = ["EAI_AGAIN", "ENOTFOUND"].map((separator) => cause.split(separator)).find((parts2) => parts2.length > 1);
    const endpoint = parts?.[1]?.trim();
    const userFacingErrorMessage = endpoint ? `Unable to establish connection to ${endpoint}. Please verify your network connection, firewall settings, or proxy configuration that might be blocking the connection.` : `Unable to establish connection. Please verify your network connection, firewall settings, or proxy configuration that might be blocking the connection.`;
    super(`Failed to connect. Cause: ${cause}`, userFacingErrorMessage);
  }
}
class SSORedirectTimeoutError extends UnexpectedIssueError {
  constructor() {
    super("SocialAuth: redirect event not received within time limit.", "Sign in timed out. Please try again.");
  }
}
class SSOMissingCodeError extends InvalidAuthError {
  constructor() {
    super("SocialAuth: missing code", "Authentication failed: Please try signing in again.");
  }
}
class SSOMissingStateError extends InvalidAuthError {
  constructor() {
    super("SocialAuth: missing state", "Authentication failed: Please try signing in again.");
  }
}
class SSOInvalidStateError extends InvalidAuthError {
  constructor() {
    super("SocialAuth: invalid state", "Authentication failed: Please try signing in again.");
  }
}
function isBadAuthIssue(error) {
  return error instanceof MissingTokenError || error instanceof MalformedTokenError || error instanceof InvalidIdCAuthError || error instanceof InvalidSSOAuthError || error instanceof InvalidAuthError;
}
function getUnknownErrorDetails(error, level = 0) {
  if (error === null) return "null";
  if (error === void 0) return "undefined";
  if (typeof error === "string") return error;
  if (typeof error === "number") return error.toString();
  if (typeof error === "boolean") return error.toString();
  if (typeof error === "symbol") return error.toString();
  if (typeof error === "bigint") return error.toString();
  if (typeof error === "object" && !Array.isArray(error)) {
    const parts = [];
    if ("name" in error && typeof error.name === "string") {
      parts.push(error.name);
    } else if ("constructor" in error && "name" in error.constructor) {
      parts.push(error.constructor.name);
    }
    let mainMessage = "";
    if ("message" in error && typeof error.message === "string" && error.message) {
      mainMessage = error.message;
    } else if ("toString" in error && typeof error.toString === "function") {
      try {
        const toStringResult = error.toString();
        if (toStringResult !== "[object Object]") {
          mainMessage = toStringResult;
        }
      } catch {
      }
    }
    if (mainMessage) {
      parts.push(mainMessage);
    }
    if ("code" in error && error.code != null) {
      const code = error.code;
      parts.push(`[${typeof code === "string" || typeof code === "number" ? code : "unknown"}]`);
    }
    const status = "status" in error && error.status || "statusCode" in error && error.statusCode;
    if (status != null) {
      let statusInfo = `HTTP ${typeof status === "string" || typeof status === "number" ? status : "unknown"}`;
      if ("statusText" in error && typeof error.statusText === "string") {
        statusInfo += ` ${error.statusText}`;
      }
      parts.push(`(${statusInfo})`);
    }
    if ("cause" in error && error.cause != null && error.cause !== error && level < 1) {
      const causeDetails = getUnknownErrorDetails(error.cause, level + 1);
      if (causeDetails !== "unknown error") {
        parts.push(`caused by: ${causeDetails}`);
      }
    }
    return parts.length > 0 ? parts.join(" ") : "unknown error";
  }
  return "unknown error";
}
const DEFAULT_CONFIG = {
  endpoint: "https://prod.us-east-1.auth.desktop.kiro.dev"
};
function getAuthConfig() {
  const config = vscode.workspace.getConfiguration().get("kiroAuthConfig");
  if (config) {
    if (config.endpoint) {
      return config;
    }
    vscode.window.showErrorMessage("Invalid Kiro Auth configuration, please specify an endpoint");
  }
  return DEFAULT_CONFIG;
}
const REQUEST_ID_HEADER_NAME = "x-amzn-requestid";
const SIGN_UP_PAUSED_MESSAGE = "New signups are temporarily paused.";
const Metrics$1 = new MetricReporter(TelemetryNamespace.Auth, "auth-service-client");
const USER_MACHINE_ID = getMachineId();
const USER_AGENT = `KiroIDE-${vscode.kiroVersion ?? "0.0.0"}-${USER_MACHINE_ID}`;
const ERROR_MAPPER$1 = (error) => {
  if (isBadAuthIssue(error)) {
    return {
      unauthorized: 1
    };
  } else if (error instanceof SignInBlockedError) {
    return {
      blocked: 1
    };
  } else if (error instanceof UserEnvironmentError) {
    return {
      environmentIssue: 1
    };
  } else {
    return {
      failure: 1
    };
  }
};
function getTraceConfig$1(traceName) {
  return {
    traceName,
    errorMapper: ERROR_MAPPER$1
  };
}
function handleRetryLogging(retryCount, error) {
  withSpan(TelemetryNamespace.Auth, "retryAuth", (span) => {
    span.setAttribute("retryCount", retryCount);
    span.setAttribute("errorCode", error.code || "unknown");
    span.setAttribute("errorStatus", error.response?.status || 0);
    span.setAttribute("errorMessage", error.message);
  });
}
const isAxiosErrorWithCauseMessage = (error) => typeof error.cause === "object" && typeof error.cause.message === "string";
function isErrorResponseWithMessage(data) {
  return typeof data === "object" && data !== null && "message" in data;
}
function getAuthServiceErrorResponseMessage(error) {
  if (!error.response) return "";
  const responseData = error.response.data;
  if (!isErrorResponseWithMessage(responseData)) return "";
  return responseData.message || "";
}
function translateError$1(error, { badRequestUnexpected, withInvitationCode } = {
  badRequestUnexpected: false,
  withInvitationCode: false
}) {
  if (!(error instanceof AxiosError)) {
    return new UnexpectedIssueError("AuthService client: Unexpected issue");
  }
  if (error.response?.data?.message === SIGN_UP_PAUSED_MESSAGE) {
    if (withInvitationCode) {
      return new InvalidInvitationCodeError();
    } else {
      return new SignInBlockedError(`AuthService client: Sign-in temporarily not allowed`);
    }
  }
  switch (error.code) {
    case AxiosError.ECONNABORTED:
    case AxiosError.ETIMEDOUT:
      return new NetworkIssueError(`AuthService client: Network related issue: ${error.message}`);
    case AxiosError.ERR_BAD_RESPONSE:
      return new ServerIssueError(`AuthService client: Bad response: ${error.message}`);
    case AxiosError.ERR_NETWORK:
      return new FailedToConnectError(isAxiosErrorWithCauseMessage(error) ? error.cause.message : "unknown cause");
    // 4xx response will be considered as unexpected for the sign-in case but invalid auth
    // for the token refresh if the status code is 401.
    case AxiosError.ERR_BAD_REQUEST: {
      const message = getAuthServiceErrorResponseMessage(error);
      const ErrorConstructor = !badRequestUnexpected && error.response?.status === 401 ? InvalidAuthError : UnexpectedIssueError;
      return new ErrorConstructor(`AuthService client: ${message}`, message);
    }
    default:
      return new UnexpectedIssueError("AuthService client: " + getAuthServiceErrorResponseMessage(error));
  }
}
function logCommonErrorDetails$1(error, span) {
  try {
    if (error instanceof AxiosError && error.response) {
      span.setAttribute("requestId", String(error.response.headers[REQUEST_ID_HEADER_NAME] || ""));
      span.setAttribute("error", error.code || "unknown");
      span.setAttribute(
        "errorDescription",
        error.message ?? (isAxiosErrorWithCauseMessage(error) ? error.cause.message : getUnknownErrorDetails(error))
      );
    } else {
      span.setAttribute("error", "unknown");
      span.setAttribute("errorDescription", getUnknownErrorDetails(error));
    }
  } catch (error2) {
    logger.error("AuthService client: Failed to log error details:", error2);
  }
}
class AuthServiceClient {
  endpoint;
  client;
  get createTokenUrl() {
    return `${this.endpoint}/oauth/token`;
  }
  get refreshTokenUrl() {
    return `${this.endpoint}/refreshToken`;
  }
  get logoutUrl() {
    return `${this.endpoint}/logout`;
  }
  get deleteAccountUrl() {
    return `${this.endpoint}/account`;
  }
  constructor() {
    this.endpoint = getAuthConfig().endpoint;
    this.client = axios.create({ baseURL: this.endpoint, timeout: 1e4 });
    axiosRetry(this.client, {
      retries: 3,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) && !(error.response && error.response.status >= 500 && error.response.status < 600);
      },
      // eslint-disable-next-line @typescript-eslint/unbound-method
      retryDelay: axiosRetry.exponentialDelay,
      onRetry: handleRetryLogging
    });
  }
  /**
   * Creates and returns a new token
   */
  createToken({ code, codeVerifier, redirectUri, invitationCode }) {
    return Metrics$1.withTrace(getTraceConfig$1("createToken"), async (span) => {
      try {
        span.setAttribute("withInvitationCode", !!invitationCode);
        const response = await this.client.post(
          this.createTokenUrl,
          { code, code_verifier: codeVerifier, redirect_uri: redirectUri, invitation_code: invitationCode },
          { headers: { "Content-Type": "application/json", "User-Agent": USER_AGENT } }
        );
        span.setAttribute("requestId", String(response.headers[REQUEST_ID_HEADER_NAME] || ""));
        return response.data;
      } catch (error) {
        logCommonErrorDetails$1(error, span);
        throw translateError$1(error, { badRequestUnexpected: true, withInvitationCode: !!invitationCode });
      }
    });
  }
  /**
   * Refreshes the auth token
   */
  refreshToken({ refreshToken }) {
    return Metrics$1.withTrace(getTraceConfig$1("refreshToken"), async (span) => {
      try {
        const response = await this.client.post(
          this.refreshTokenUrl,
          { refreshToken },
          { headers: { "Content-Type": "application/json", "User-Agent": USER_AGENT } }
        );
        span.setAttribute("requestId", String(response.headers[REQUEST_ID_HEADER_NAME] || ""));
        return response.data;
      } catch (error) {
        logCommonErrorDetails$1(error, span);
        throw translateError$1(error);
      }
    });
  }
  /**
   * Invalidates the refresh token
   */
  logout({ refreshToken }) {
    return Metrics$1.withTrace(getTraceConfig$1("logout"), async (span) => {
      try {
        const response = await this.client.post(
          this.logoutUrl,
          { refreshToken },
          { headers: { "Content-Type": "application/json", "User-Agent": USER_AGENT } }
        );
        span.setAttribute("requestId", String(response.headers[REQUEST_ID_HEADER_NAME] || ""));
      } catch (error) {
        logCommonErrorDetails$1(error, span);
        throw translateError$1(error);
      }
    });
  }
  /**
   * Deletes the user account
   */
  deleteAccount(accessToken) {
    return Metrics$1.withTrace(getTraceConfig$1("deleteAccount"), async (span) => {
      try {
        const response = await this.client.delete(this.deleteAccountUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": USER_AGENT
          }
        });
        span.setAttribute("requestId", String(response.headers[REQUEST_ID_HEADER_NAME] || ""));
      } catch (error) {
        logCommonErrorDetails$1(error, span);
        throw translateError$1(error);
      }
    });
  }
}
const Metrics = new MetricReporter(TelemetryNamespace.Auth, "sso-oidc-client");
const ERROR_MAPPER = (error) => {
  if (error instanceof InvalidUserInputError) {
    return {
      badInput: 1
    };
  } else if (error instanceof UserEnvironmentError) {
    return {
      environmentIssue: 1
    };
  } else if (isBadAuthIssue(error)) {
    return {
      unauthorized: 1
    };
  } else {
    return {
      failure: 1
    };
  }
};
function getTraceConfig(traceName) {
  return {
    traceName,
    errorMapper: ERROR_MAPPER
  };
}
function translateError(error, hasUserProvidedInput) {
  if (error instanceof InvalidGrantException) {
    return new InvalidSSOAuthError("SSOOIDC client: Invalid grant");
  } else if (error instanceof AccessDeniedException) {
    return new InvalidSSOAuthError("SSOOIDC client: Access denied");
  } else if (error instanceof ExpiredTokenException) {
    return new InvalidSSOAuthError("SSOOIDC client: Expired token");
  } else if (error instanceof InvalidClientException) {
    return new InvalidSSOAuthError("SSOOIDC client: Invalid client");
  } else if (error instanceof UnauthorizedClientException) {
    return new InvalidSSOAuthError("SSOOIDC client: Unauthorized client");
  } else if (error instanceof InternalServerException) {
    return new ServerIssueError("SSOOIDC client: Internal server error");
  } else if (error instanceof SlowDownException) {
    return new ServerIssueError("SSOOIDC client: Throttling");
  } else if (error instanceof InvalidRequestException) {
    if (hasUserProvidedInput && "error_description" in error && typeof error.error_description === "string" && error.error_description.toLowerCase().indexOf("invalid start url provided") > -1) {
      return new InvalidStartUrlError();
    } else {
      return new UnexpectedIssueError("SSOOIDC client: Unexpected InvalidRequestException");
    }
  } else if (error instanceof TypeError && error.message === "fetch failed") {
    const cause = String(error.cause);
    return new FailedToConnectError(cause);
  } else {
    return new UnexpectedIssueError("SSOOIDC client: Unexpected issue");
  }
}
function logCommonErrorDetails(error, span) {
  try {
    if (error instanceof SSOOIDCServiceException) {
      const { requestId, cfId, extendedRequestId } = error.$metadata;
      span.setAttribute("requestId", requestId || "");
      span.setAttribute("cfId", cfId || "");
      span.setAttribute("extendedRequestId", extendedRequestId || "");
      if ("error_description" in error && typeof error.error_description === "string") {
        span.setAttribute("errorDescription", error.error_description);
      }
      if ("error" in error && typeof error.error === "string") {
        span.setAttribute("error", error.error);
      }
    } else {
      span.setAttribute("error", "unknown");
      span.setAttribute("errorDescription", getUnknownErrorDetails(error));
    }
  } catch (error2) {
    logger.error("SSOOIDC client: Failed to log error details:", error2);
  }
}
class SSOOIDCClient {
  ssoClient;
  region;
  constructor(region = "us-east-1") {
    this.region = region;
    this.ssoClient = new SSOOIDC({
      region: this.region,
      customUserAgent: "KiroIDE",
      maxAttempts: 4,
      retryMode: "standard"
    });
  }
  /**
   * Get the region used by this client
   */
  getRegion() {
    return this.region;
  }
  /**
   * Registers a new client using SSOOIDC
   */
  registerClient(input, hasUserProvidedInput = false) {
    return Metrics.withTrace(getTraceConfig("registerClient"), async (span) => {
      try {
        return await this.ssoClient.registerClient(input);
      } catch (error) {
        logCommonErrorDetails(error, span);
        throw translateError(error, hasUserProvidedInput);
      }
    });
  }
  /**
   * Creates a new token using SSOOIDC
   */
  createToken(input) {
    return Metrics.withTrace(getTraceConfig("createToken"), async (span) => {
      span.setAttribute("grantType", input.grantType || "");
      try {
        return await this.ssoClient.createToken(input);
      } catch (error) {
        logCommonErrorDetails(error, span);
        throw translateError(error, false);
      }
    });
  }
}
export {
  AuthServiceClient as A,
  SSOMissingStateError as B,
  CanceledError as C,
  SSORedirectTimeoutError as D,
  ServerIssueError as E,
  FileSystemAccessError as F,
  getUnknownErrorDetails as G,
  InvalidStateError as I,
  MissingPortError as M,
  NetworkIssueError as N,
  SSOOIDCClient as S,
  UnexpectedIssueError as U,
  ServerListenError as a,
  ServerTimeoutError as b,
  AuthProviderDeniedAccess as c,
  AuthProviderFailure as d,
  MissingStateError as e,
  AbandonedError as f,
  SignInBlockedError as g,
  InvalidUserInputError as h,
  UserEnvironmentError as i,
  isBadAuthIssue as j,
  MissingCodeError as k,
  SymlinkDetectedError as l,
  MissingTokenError as m,
  MalformedTokenError as n,
  InvalidAuthError as o,
  AccessDeniedError as p,
  InvalidSSOAuthError as q,
  InvalidIdCAuthError as r,
  AuthError as s,
  UserFacingError as t,
  AuthErrorType as u,
  FailedToConnectError as v,
  InvalidInvitationCodeError as w,
  InvalidStartUrlError as x,
  SSOInvalidStateError as y,
  SSOMissingCodeError as z
};
