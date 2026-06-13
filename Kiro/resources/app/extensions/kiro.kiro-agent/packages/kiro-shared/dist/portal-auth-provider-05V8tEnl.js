import * as vscode from "vscode";
import crypto from "crypto";
import { T as TelemetryNamespace, MetricReporter } from "./telemetry/definitions/index.js";
import http__default from "http";
import { b as logger, d as isMwinitToolAvailable } from "./errors-BVoUlRsM.js";
import "path";
import "os";
import "fs";
import "node-machine-id";
import { withSpan } from "./telemetry/index.js";
import { U as UnexpectedIssueError, a as ServerListenError, b as ServerTimeoutError, M as MissingPortError, c as AuthProviderDeniedAccess, d as AuthProviderFailure, e as MissingStateError, I as InvalidStateError, C as CanceledError, f as AbandonedError, g as SignInBlockedError, h as InvalidUserInputError, i as UserEnvironmentError, j as isBadAuthIssue, A as AuthServiceClient, k as MissingCodeError } from "./sso-oidc-client-DdDU-AJU.js";
import { g as getAuthSuccessPageUrl, a as getAuthErrorPageUrl, b as getAuthPortalUrl } from "./auth-config-BMjEljVD.js";
const CALLBACK_PORTS = [3128, 4649, 6588, 8008, 9091, 49153, 50153, 51153, 52153, 53153];
class PortalAuthServer {
  constructor(expectedState) {
    this.expectedState = expectedState;
    this.authenticationPromise = new Promise((resolve, reject) => {
      this.deferred = { resolve, reject };
    });
    this.connections = [];
    this.server = http__default.createServer((request, response) => {
      response.setHeader("Access-Control-Allow-Methods", "GET");
      response.setHeader("Access-Control-Allow-Origin", "*");
      if (!request.url) {
        return;
      }
      const url = new URL(request.url, this.baseUrl);
      if (this.callbackPaths.includes(url.pathname)) {
        this.handleCallback(url.pathname, url.searchParams, response);
      } else {
        logger.info("PortalAuthServer: Unexpected path: %s", url.pathname);
        this.sendResponse(response, 404, "Not Found");
      }
    });
    this.server.on("connection", (connection) => {
      this.connections.push(connection);
    });
  }
  static lastInstance;
  /** Returns the last created server instance */
  static get instance() {
    return PortalAuthServer.lastInstance;
  }
  baseUrl = "http://localhost";
  callbackPaths = ["/oauth/callback", "/signin/callback"];
  authenticationFlowTimeoutInMs = 6e5;
  // 10 minutes
  authenticationWarningTimeoutInMs = 6e4;
  // 1 minute
  listenTimeoutMs = 1e4;
  authenticationPromise;
  deferred;
  server;
  connections;
  _closed = false;
  /**
   * Initializes a new PortalAuthServer
   * @param state - The state parameter for CSRF validation
   */
  static async init(state) {
    return withSpan(TelemetryNamespace.Auth, "portal-auth-server.init", async () => {
      const lastInstance = PortalAuthServer.lastInstance;
      if (lastInstance !== void 0 && !lastInstance.closed) {
        try {
          await lastInstance.close();
        } catch (error) {
          logger.error("Failed to close existing portal auth server: %s", error);
        }
      }
      logger.debug("PortalAuthServer: Initialized new server");
      const instance = new PortalAuthServer(state);
      PortalAuthServer.lastInstance = instance;
      return instance;
    });
  }
  /** Starts the server on one of the allowed ports */
  start(ports = CALLBACK_PORTS) {
    return withSpan(TelemetryNamespace.Auth, "portal-auth-server.start", async (span) => {
      let portIndex = 0;
      if (this.server.listening) {
        throw new UnexpectedIssueError("PortalAuthServer: Server already started");
      }
      return new Promise((resolve, reject) => {
        this.server.on("close", () => {
          reject(new UnexpectedIssueError("PortalAuthServer: Server has closed"));
        });
        this.server.on("error", (error) => {
          if (ports.length > portIndex + 1) {
            this.listen(ports[++portIndex]);
          } else {
            reject(new ServerListenError(error.message, ports));
          }
        });
        const timeout = setTimeout(() => {
          if (!this.server.listening) {
            void this.close();
            reject(new ServerTimeoutError());
          }
        }, this.listenTimeoutMs);
        this.server.on("listening", () => {
          clearTimeout(timeout);
          if (!this.server.address()) {
            reject(new MissingPortError());
          }
          span.setAttribute("redirectUri", this.redirectUri);
          logger.info("PortalAuthServer: Listening on %s", this.redirectUri);
          resolve();
        });
        this.listen(ports[0]);
      });
    });
  }
  listen(port) {
    this.server.listen(port, "127.0.0.1");
  }
  /** Closes the server */
  async close() {
    return withSpan(TelemetryNamespace.Auth, "portal-auth-server.close", async () => {
      return new Promise((resolve, reject) => {
        if (this._closed) {
          resolve();
          return;
        }
        if (!this.server.listening) {
          reject(new UnexpectedIssueError("PortalAuthServer: Server not started"));
          return;
        }
        logger.debug("PortalAuthServer: Closing server");
        for (const connection of this.connections) {
          connection.destroy();
        }
        this.server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          this._closed = true;
          logger.debug("PortalAuthServer: Server closed successfully");
          resolve();
        });
      });
    });
  }
  /** Attempts to close the server without throwing */
  attemptClose() {
    this.close().catch(() => {
    });
  }
  /** Gets the redirect URI for the callback */
  get redirectUri() {
    return `${this.baseUrl}:${this.getPort()}`;
  }
  /** Returns whether the server has been closed */
  get closed() {
    return this._closed;
  }
  /** Returns the server address info */
  getAddress() {
    return this.server.address();
  }
  getPort() {
    const address = this.getAddress();
    if (address instanceof Object) {
      return address.port;
    } else if (typeof address === "string") {
      return Number.parseInt(address);
    } else {
      throw new MissingPortError();
    }
  }
  handleCallback(path, params, response) {
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    if (error) {
      const errorMsg = errorDescription || error;
      if (error === "access_denied") {
        this.handleRejection(response, new AuthProviderDeniedAccess());
      } else {
        this.handleRejection(response, new AuthProviderFailure(errorMsg));
      }
      return;
    }
    const state = params.get("state");
    if (!state) {
      this.handleRejection(response, new MissingStateError());
      return;
    }
    if (state !== this.expectedState) {
      this.handleRejection(response, new InvalidStateError());
      return;
    }
    const loginOption = params.get("login_option") || "";
    const code = params.get("code") || void 0;
    const issuerUrl = params.get("issuer_url") || void 0;
    const idcRegion = params.get("idc_region") || void 0;
    const clientId = params.get("client_id") || void 0;
    const scopes = params.get("scopes") || void 0;
    const loginHint = params.get("login_hint") || void 0;
    const audience = params.get("audience") || void 0;
    const callbackData = {
      loginOption,
      code,
      issuerUrl,
      idcRegion,
      state,
      path,
      clientId,
      scopes,
      loginHint,
      audience
    };
    logger.info("PortalAuthServer: Received callback for login_option=%s", loginOption);
    this.deferred?.resolve(callbackData);
    this.sendSuccessResponse(response, loginOption);
  }
  handleRejection(response, error) {
    this.sendErrorResponse(response, error.message);
    this.deferred?.reject(error);
  }
  sendSuccessResponse(response, _loginOption) {
    const successUrl = getAuthSuccessPageUrl();
    response.writeHead(302, { Location: successUrl });
    response.end();
  }
  sendErrorResponse(response, message) {
    const errorUrl = getAuthErrorPageUrl(message);
    response.writeHead(302, { Location: errorUrl });
    response.end();
  }
  sendResponse(response, status, body, contentType = "text/plain") {
    response.writeHead(status, { "Content-Type": contentType });
    response.write(body);
    response.end();
  }
  /** Cancels the current authentication flow */
  cancelCurrentFlow() {
    logger.debug("PortalAuthServer: Canceling current flow");
    this.deferred?.reject(new CanceledError("user cancellation"));
  }
  /** Waits for the authorization callback */
  async waitForCallback() {
    const warningTimeout = setTimeout(() => {
      logger.warn("PortalAuthServer: Authentication is taking a long time");
    }, this.authenticationWarningTimeoutInMs);
    try {
      return await Promise.race([
        this.authenticationPromise,
        new Promise((_resolve, reject) => {
          setTimeout(() => {
            reject(new AbandonedError());
          }, this.authenticationFlowTimeoutInMs);
        })
      ]);
    } finally {
      clearTimeout(warningTimeout);
      this.attemptClose();
    }
  }
}
const ERROR_MAPPER = (error) => {
  if (error instanceof SignInBlockedError) {
    return {
      blocked: 1
    };
  } else if (error instanceof CanceledError) {
    return {
      abort: 1
    };
  } else if (error instanceof AbandonedError) {
    return {
      abandon: 1
    };
  } else if (error instanceof InvalidUserInputError) {
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
function getProviderForMetrics(provider) {
  return provider?.toString() || "unknown";
}
function getTraceConfig(name, provider) {
  return {
    traceName: `${getProviderForMetrics(provider)}.${name}`,
    errorMapper: ERROR_MAPPER,
    metricAliases: [name]
  };
}
const Metrics = new MetricReporter(TelemetryNamespace.Auth, "auth-provider");
const EXTERNAL_IDP_ENV_OVERRIDE = {
  issuerUrl: process.env.KIRO_TEST_EXTERNAL_IDP_ISSUER_URL,
  clientId: process.env.KIRO_TEST_EXTERNAL_IDP_CLIENT_ID,
  scopes: process.env.KIRO_TEST_EXTERNAL_IDP_SCOPES
};
class PortalAuthProvider {
  authServiceClient;
  server;
  constructor() {
    this.authServiceClient = new AuthServiceClient();
  }
  /**
   * Starts the unified auth portal flow.
   * Opens browser to the portal and waits for callback.
   */
  async authenticate() {
    return withSpan(TelemetryNamespace.Auth, "portal-provider.authenticate", async (span) => {
      const state = crypto.randomUUID();
      const codeVerifier = crypto.randomBytes(32).toString("base64url");
      const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest().toString("base64url");
      const isAmazonInternal = await isMwinitToolAvailable();
      span.setAttribute("isAmazonInternal", isAmazonInternal);
      this.server = await PortalAuthServer.init(state);
      await this.server.start(CALLBACK_PORTS);
      const localRedirectUri = this.server.redirectUri;
      const externalRedirectUri = await vscode.env.asExternalUri(vscode.Uri.parse(localRedirectUri));
      const redirectUri = externalRedirectUri.toString().replace(/\/$/, "");
      span.setAttribute("redirectUri", redirectUri);
      const portalUrl = this.buildPortalUrl(state, codeChallenge, redirectUri, isAmazonInternal);
      logger.info("PortalAuthProvider: Opening portal at %s", portalUrl);
      logger.info("PortalAuthProvider: Firing kiro.signIn.portalUrlGenerated command");
      vscode.commands.executeCommand("kiro.signIn.portalUrlGenerated", portalUrl);
      const browserOpenStart = Date.now();
      let opened;
      try {
        opened = await vscode.env.openExternal(vscode.Uri.parse(portalUrl));
        span.setAttribute("browserOpenDurationMs", Date.now() - browserOpenStart);
        span.setAttribute("browserOpenSuccess", opened);
      } catch (error) {
        span.setAttribute("browserOpenDurationMs", Date.now() - browserOpenStart);
        span.setAttribute("browserOpenSuccess", false);
        span.setAttribute("failurePhase", "portal_browser_open");
        throw error;
      }
      if (!opened) {
        span.setAttribute("failurePhase", "portal_browser_open");
        throw new UnexpectedIssueError("Failed to open browser for authentication");
      }
      const callbackWaitStart = Date.now();
      let callback;
      try {
        callback = await this.server.waitForCallback();
        span.setAttribute("callbackWaitDurationMs", Date.now() - callbackWaitStart);
      } catch (error) {
        span.setAttribute("callbackWaitDurationMs", Date.now() - callbackWaitStart);
        span.setAttribute("failurePhase", "portal_callback_wait");
        throw error;
      }
      span.setAttribute("loginOption", callback.loginOption);
      try {
        return await this.processCallback(callback, codeVerifier, redirectUri);
      } catch (error) {
        span.setAttribute("failurePhase", "portal_callback_processing");
        throw error;
      }
    });
  }
  /**
   * Cancels the current authentication flow
   */
  cancelAuth() {
    this.server?.cancelCurrentFlow();
  }
  buildPortalUrl(state, codeChallenge, redirectUri, isAmazonInternal) {
    const baseUrl = getAuthPortalUrl();
    const params = new URLSearchParams({
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      redirect_uri: redirectUri,
      redirect_from: "KiroIDE"
    });
    if (isAmazonInternal) {
      params.set("from_amazon_internal", "true");
    }
    return `${baseUrl}/signin?${params.toString()}`;
  }
  async processCallback(callback, codeVerifier, redirectUri) {
    const { loginOption, code, issuerUrl, idcRegion } = callback;
    switch (loginOption) {
      case "google":
      case "github": {
        if (!code) {
          throw new MissingCodeError();
        }
        const token = await this.exchangeSocialToken(
          loginOption === "google" ? "Google" : "Github",
          code,
          codeVerifier,
          redirectUri,
          callback
        );
        return { type: "social", token };
      }
      case "builderid": {
        if (!issuerUrl || !idcRegion) {
          throw new UnexpectedIssueError("Missing issuer_url or idc_region for BuilderId");
        }
        return { type: "builderid", issuerUrl, idcRegion };
      }
      case "awsidc": {
        if (!issuerUrl || !idcRegion) {
          throw new UnexpectedIssueError("Missing issuer_url or idc_region for AWS IdC");
        }
        return { type: "awsidc", issuerUrl, idcRegion };
      }
      case "internal": {
        if (!issuerUrl || !idcRegion) {
          throw new UnexpectedIssueError("Missing issuer_url or idc_region for Internal");
        }
        return { type: "internal", issuerUrl, idcRegion };
      }
      case "external_idp": {
        const { clientId, scopes, loginHint, audience } = callback;
        const finalIssuerUrl = EXTERNAL_IDP_ENV_OVERRIDE.issuerUrl || issuerUrl;
        const finalClientId = EXTERNAL_IDP_ENV_OVERRIDE.clientId || clientId;
        const finalScopes = EXTERNAL_IDP_ENV_OVERRIDE.scopes || scopes;
        if (!finalIssuerUrl || !finalClientId || !finalScopes) {
          throw new UnexpectedIssueError("Missing issuer_url, client_id, or scopes for External IdP");
        }
        return {
          type: "external_idp",
          issuerUrl: finalIssuerUrl,
          clientId: finalClientId,
          scopes: finalScopes,
          loginHint,
          audience
        };
      }
      default:
        throw new UnexpectedIssueError(`Unknown login_option: ${loginOption}`);
    }
  }
  async exchangeSocialToken(provider, code, codeVerifier, redirectUri, callback) {
    return Metrics.withTrace(getTraceConfig("authenticate", provider), async () => {
      const fullRedirectUri = `${redirectUri}${callback.path}?login_option=${callback.loginOption}`;
      logger.info("PortalAuthProvider: Exchanging code for token (provider=%s)", provider);
      const response = await this.authServiceClient.createToken({
        code,
        codeVerifier,
        redirectUri: fullRedirectUri
      });
      return this.tokenResponseToCache(response, provider);
    });
  }
  tokenResponseToCache({ accessToken, refreshToken, profileArn, expiresIn }, provider) {
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + expiresIn * 1e3).toISOString();
    return {
      accessToken,
      refreshToken,
      profileArn,
      expiresAt,
      authMethod: "social",
      provider
    };
  }
}
export {
  CALLBACK_PORTS as C,
  PortalAuthProvider as P,
  PortalAuthServer as a,
  getTraceConfig as g
};
