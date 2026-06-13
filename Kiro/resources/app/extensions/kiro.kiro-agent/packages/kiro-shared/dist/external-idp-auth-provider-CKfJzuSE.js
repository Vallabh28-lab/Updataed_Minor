import * as vscode from "vscode";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";
import { f as AbandonedError, C as CanceledError, c as AuthProviderDeniedAccess, d as AuthProviderFailure, k as MissingCodeError, U as UnexpectedIssueError, a as ServerListenError, b as ServerTimeoutError, M as MissingPortError, e as MissingStateError, I as InvalidStateError, A as AuthServiceClient, S as SSOOIDCClient, r as InvalidIdCAuthError, F as FileSystemAccessError } from "./sso-oidc-client-DdDU-AJU.js";
import http__default from "http";
import { T as TelemetryNamespace } from "./telemetry/definitions/index.js";
import { b as logger, T as TrustedError } from "./errors-BVoUlRsM.js";
import "node-machine-id";
import { withSpan } from "./telemetry/index.js";
import { g as getAuthSuccessPageUrl, a as getAuthErrorPageUrl } from "./auth-config-BMjEljVD.js";
import * as client from "openid-client";
const AUTH_CALLBACK_REDIRECT_URI = "kiro://kiro.oauth/callback";
const AUTH_FLOW_TIMEOUT_MS = 6e5;
const AUTH_WARNING_TIMEOUT_MS = 6e4;
class AuthCallbackHandler {
  pendingCallbacks = /* @__PURE__ */ new Map();
  disposable;
  /**
   * Initializes the callback handler by registering a listener on the URI event handler.
   * @param onUri - Event emitter that fires when a URI is received
   */
  initialize(onUri) {
    if (this.disposable) {
      logger.debug("AuthCallbackHandler: Already initialized");
      return;
    }
    this.disposable = onUri((uri) => {
      this.handleUri(uri);
    });
    logger.info("AuthCallbackHandler: Initialized");
  }
  /**
   * Waits for an OAuth callback with the specified state parameter.
   * @param state - The state parameter to match against incoming callbacks
   * @returns Promise that resolves with the callback data (code and state)
   */
  waitForCallback(state) {
    return new Promise((resolve, reject) => {
      if (this.pendingCallbacks.has(state)) {
        reject(new Error("AuthCallbackHandler: callback already pending for this state"));
        return;
      }
      const warningTimeoutId = setTimeout(() => {
        logger.warn("AuthCallbackHandler: Authentication is taking a long time for state=%s", state);
      }, AUTH_WARNING_TIMEOUT_MS);
      const timeoutId = setTimeout(() => {
        this.cleanupPendingCallback(state);
        reject(new AbandonedError());
      }, AUTH_FLOW_TIMEOUT_MS);
      this.pendingCallbacks.set(state, {
        resolve,
        reject,
        timeoutId,
        warningTimeoutId
      });
      logger.debug("AuthCallbackHandler: Waiting for callback with state=%s", state);
    });
  }
  /**
   * Cancels a pending callback for the given state.
   * @param state - The state parameter of the callback to cancel
   */
  cancelCallback(state) {
    const pending = this.pendingCallbacks.get(state);
    if (pending) {
      this.cleanupPendingCallback(state);
      pending.reject(new CanceledError("user cancellation"));
      logger.debug("AuthCallbackHandler: Canceled callback for state=%s", state);
    }
  }
  /**
   * Handles incoming URI events and routes them to pending callbacks.
   */
  handleUri(uri) {
    logger.info(
      "AuthCallbackHandler: handleUri called with path=%s, query=%s, full=%s",
      uri.path,
      uri.query,
      uri.toString()
    );
    if (uri.authority !== "kiro.oauth" || uri.path !== "/callback") {
      logger.debug("AuthCallbackHandler: Ignoring URI - authority=%s, path=%s", uri.authority, uri.path);
      return;
    }
    logger.info("AuthCallbackHandler: Processing auth callback URI");
    const params = new URLSearchParams(uri.query);
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    if (error) {
      const state2 = params.get("state");
      if (state2) {
        const pending2 = this.pendingCallbacks.get(state2);
        if (pending2) {
          this.cleanupPendingCallback(state2);
          if (error === "access_denied") {
            pending2.reject(new AuthProviderDeniedAccess());
          } else {
            pending2.reject(new AuthProviderFailure(errorDescription || error));
          }
          this.showErrorNotification(errorDescription || error);
          return;
        }
      }
      this.showErrorNotification(errorDescription || error);
      return;
    }
    const state = params.get("state");
    if (!state) {
      logger.error("AuthCallbackHandler: Missing state parameter");
      this.showErrorNotification("Authentication failed: missing state parameter");
      return;
    }
    logger.info(
      "AuthCallbackHandler: Looking for pending callback with state=%s, pending states=%s",
      state,
      Array.from(this.pendingCallbacks.keys()).join(", ") || "(none)"
    );
    const pending = this.pendingCallbacks.get(state);
    if (!pending) {
      logger.warn("AuthCallbackHandler: No pending callback for state=%s", state);
      this.showErrorNotification("Authentication session expired. Please try signing in again.");
      return;
    }
    const code = params.get("code");
    if (!code) {
      this.cleanupPendingCallback(state);
      pending.reject(new MissingCodeError());
      this.showErrorNotification("Authentication failed: missing authorization code");
      return;
    }
    const iss = params.get("iss") ?? void 0;
    this.cleanupPendingCallback(state);
    pending.resolve({ code, state, iss });
    logger.info("AuthCallbackHandler: Successfully received authorization code");
    void vscode.env.openExternal(vscode.Uri.parse(getAuthSuccessPageUrl()));
  }
  cleanupPendingCallback(state) {
    const pending = this.pendingCallbacks.get(state);
    if (pending) {
      clearTimeout(pending.timeoutId);
      clearTimeout(pending.warningTimeoutId);
      this.pendingCallbacks.delete(state);
    }
  }
  showErrorNotification(message) {
    void vscode.window.showErrorMessage(`Authentication failed: ${message}`);
  }
  /**
   * Disposes the callback handler and cleans up all pending callbacks.
   */
  dispose() {
    for (const [_state, pending] of this.pendingCallbacks) {
      clearTimeout(pending.timeoutId);
      clearTimeout(pending.warningTimeoutId);
      pending.reject(new CanceledError("handler disposed"));
    }
    this.pendingCallbacks.clear();
    this.disposable?.dispose();
    this.disposable = void 0;
    logger.debug("AuthCallbackHandler: Disposed");
  }
}
const authCallbackHandler = new AuthCallbackHandler();
class AuthSSOServer {
  constructor(state) {
    this.state = state;
    this.authenticationPromise = new Promise((resolve, reject) => {
      this.deferred = { resolve, reject };
    });
    this.connections = [];
    this.server = http__default.createServer((request, response) => {
      response.setHeader("Access-Control-Allow-Methods", "GET");
      if (!request.url) {
        return;
      }
      const url = new URL(request.url, this.baseUrl);
      switch (url.pathname) {
        case this.oauthCallback: {
          this.handleAuthentication(url.searchParams, response);
          break;
        }
        default: {
          logger.info("Unexpected invocation of AuthSSOServer. Path: %s", url.pathname);
        }
      }
    });
    this.server.on("connection", (connection) => {
      this.connections.push(connection);
    });
  }
  // Last initialized instance of the Auth Server
  static #lastInstance;
  /** Gets the last initialized instance */
  static get lastInstance() {
    return AuthSSOServer.#lastInstance;
  }
  baseUrl = `http://127.0.0.1`;
  oauthCallback = "/oauth/callback";
  authenticationFlowTimeoutInMs = 6e5;
  authenticationWarningTimeoutInMs = 6e4;
  listenTimeoutMs = 1e4;
  authenticationPromise;
  deferred;
  server;
  connections;
  _closed = false;
  /**
   * Initializes a new AuthSSOServer
   * @param state - The state parameter for validation
   */
  static init(state = "") {
    return withSpan(TelemetryNamespace.Auth, "auth-server.init", async () => {
      const lastInstance = AuthSSOServer.#lastInstance;
      if (lastInstance !== void 0 && !lastInstance.closed) {
        try {
          await lastInstance.close();
        } catch (error) {
          logger.error("Failed to close already existing auth server in AuthSSOServer.init(): %s", error);
        }
      }
      logger.debug("AuthSSOServer: Initialized new auth server.");
      const instance = new AuthSSOServer(state);
      AuthSSOServer.#lastInstance = instance;
      return instance;
    });
  }
  /** Starts the server */
  start(ports) {
    return withSpan(TelemetryNamespace.Auth, "auth-server.start", async (span) => {
      let portIndex = 0;
      if (this.server.listening) {
        throw new UnexpectedIssueError("AuthSSOServer: Server already started");
      }
      return new Promise((resolve, reject) => {
        this.server.on("close", () => {
          reject(new UnexpectedIssueError("AuthSSOServer: Server has closed"));
        });
        this.server.on("error", (error) => {
          if (ports && ports.length > portIndex + 1) {
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
          resolve();
        });
        this.listen(ports?.[0] || 0);
      });
    });
  }
  listen(port) {
    this.server.listen(port, "127.0.0.1");
  }
  /**
   * Attempts to close the server and swallows exceptions
   */
  attemptClose() {
    const doClose = async () => {
      try {
        await this.close();
      } catch (_e) {
      }
    };
    void doClose();
  }
  /** Closes the server */
  close() {
    return withSpan(TelemetryNamespace.Auth, "auth-server.close", async (span) => {
      try {
        span.setAttribute("redirectUri", this.redirectUri);
      } catch (_e) {
        span.setAttribute("redirectUri", "");
      }
      return new Promise((resolve, reject) => {
        if (this._closed) {
          resolve();
          return;
        }
        if (!this.server.listening) {
          reject(new UnexpectedIssueError("AuthSSOServer: Server not started"));
        }
        logger.debug("AuthSSOServer: Attempting to close server.");
        for (const connection of this.connections) {
          connection.destroy();
        }
        this.server.close((error) => {
          if (error) {
            reject(error);
          }
          this._closed = true;
          logger.debug("AuthSSOServer: Server closed successfully.");
          resolve();
        });
      });
    });
  }
  /** Gets the redirect URI */
  get redirectUri() {
    return `${this.baseLocation}${this.oauthCallback}`;
  }
  get baseLocation() {
    return `${this.baseUrl}:${this.getPort()}`;
  }
  /** Gets whether the server is closed */
  get closed() {
    return this._closed;
  }
  /** Gets the server address */
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
  redirectToSuccess(response) {
    response.writeHead(302, { Location: getAuthSuccessPageUrl() });
    response.end();
  }
  redirectToError(response, errorMessage) {
    response.writeHead(302, { Location: getAuthErrorPageUrl(errorMessage) });
    response.end();
  }
  handleAuthentication(parameters, response) {
    const error = parameters.get("error");
    const errorDescription = parameters.get("error_description");
    if (error && errorDescription) {
      if (error === "access_denied") {
        this.handleRequestRejection(response, new AuthProviderDeniedAccess());
      } else {
        this.handleRequestRejection(response, new AuthProviderFailure(`${error}: ${errorDescription}`));
      }
      return;
    }
    const code = parameters.get("code");
    if (!code) {
      this.handleRequestRejection(response, new MissingCodeError());
      return;
    }
    if (this.state) {
      const state = parameters.get("state");
      if (!state) {
        this.handleRequestRejection(response, new MissingStateError());
        return;
      }
      if (state !== this.state) {
        this.handleRequestRejection(response, new InvalidStateError());
        return;
      }
    }
    this.deferred?.resolve(code);
    this.redirectToSuccess(response);
  }
  handleRequestRejection(response, error) {
    this.redirectToError(response, error.message);
    this.deferred?.reject(error);
  }
  /** Cancels the current authentication flow */
  cancelCurrentFlow() {
    logger.debug("AuthSSOServer: Canceling current login flow");
    this.deferred?.reject(new CanceledError("user cancellation"));
  }
  /** Waits for authorization to complete */
  async waitForAuthorization() {
    const warningTimeout = setTimeout(() => {
      logger.warn("AuthSSOServer: Authentication is taking a long time");
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
function supportsProfiles(token) {
  const isIdCProvider = token.provider === "Enterprise" || token.provider === "Internal" || token.provider === "BuilderId";
  const isExternalIdp = token.authMethod === "external_idp" || token.provider === "ExternalIdp";
  const isSocial = token.authMethod === "social";
  return isIdCProvider || isExternalIdp || isSocial;
}
async function selectOrPromptProfile(profiles) {
  if (profiles.length === 0) {
    logger.warn("No profiles available to select");
    return;
  }
  if (profiles.length === 1) {
    await vscode.commands.executeCommand("kiro.profiles.selectProfile", profiles[0]);
    return;
  }
  await vscode.commands.executeCommand("kiro.profiles.showProfileSelector", { isDismissible: true });
}
async function handleProfiles(token) {
  if (!supportsProfiles(token)) {
    return;
  }
  const { data: profiles, error } = await vscode.commands.executeCommand(
    "kiro.profiles.listAvailableProfiles",
    {
      accessToken: token.accessToken,
      idcRegion: token.region,
      tokenProvider: token.provider,
      authMethod: token.authMethod
    }
  );
  if (error) {
    throw new UnexpectedIssueError(error.message);
  }
  if (profiles) {
    await selectOrPromptProfile(profiles);
  }
}
const CLIENT_REG_INVALIDATION_OFFSET_SECONDS = 15 * 60;
const BUILDER_ID_START_URL = "https://view.awsapps.com/start";
const INTERNAL_SSO_START_URL = "https://amzn.awsapps.com/start";
class ClientRegistrationStorage {
  cacheDirectory = path.join(os.homedir(), ".aws", "sso", "cache");
  getClientRegistrationPath(clientIdHash) {
    return path.join(this.cacheDirectory, `${clientIdHash}.json`);
  }
  ensureCacheDirectory() {
    try {
      if (!fs.existsSync(this.cacheDirectory)) {
        fs.mkdirSync(this.cacheDirectory, { recursive: true });
      }
    } catch (_e) {
      throw new FileSystemAccessError(this.cacheDirectory);
    }
  }
  /**
   * Writes client registration to cache
   */
  writeClientRegistration(clientIdHash, registration) {
    this.ensureCacheDirectory();
    const filePath = this.getClientRegistrationPath(clientIdHash);
    try {
      fs.writeFileSync(filePath, JSON.stringify(registration, void 0, 2), { mode: 384 });
      fs.chmodSync(filePath, 384);
    } catch (_e) {
      throw new FileSystemAccessError(filePath);
    }
  }
  /**
   * Reads the currently cached client registration
   */
  readClientRegistration(clientIdHash) {
    const filePath = this.getClientRegistrationPath(clientIdHash);
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        try {
          return JSON.parse(fileContent);
        } catch (_e) {
          return void 0;
        }
      } catch (_e) {
        throw new FileSystemAccessError(filePath);
      }
    }
  }
  /**
   * Deletes the cached client registration file
   */
  deleteClientRegistration(clientIdHash) {
    const filePath = this.getClientRegistrationPath(clientIdHash);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (_e) {
        throw new FileSystemAccessError(filePath);
      }
    }
  }
}
const GRANT_SCOPES = ["completions", "analysis", "conversations", "transformations", "taskassist"];
class IDCAuthProvider {
  storage;
  authServiceClient;
  scopes;
  authServer;
  constructor() {
    this.storage = new ClientRegistrationStorage();
    this.authServiceClient = new AuthServiceClient();
    const scopePrefix = vscode.workspace.getConfiguration("codewhisperer.config").get("scopePrefix") ?? "codewhisperer";
    this.scopes = GRANT_SCOPES.map((scope) => {
      return `${scopePrefix}:${scope}`;
    });
  }
  getClientIdHash(startUrl) {
    return crypto.createHash("sha1").update(JSON.stringify({ startUrl })).digest("hex");
  }
  tokenResponseToToken(tokenResponse, clientIdHash, provider, region) {
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + Number(tokenResponse.expiresIn) * 1e3);
    return {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresAt: expiresAt.toISOString(),
      clientIdHash,
      authMethod: "IdC",
      provider,
      region
    };
  }
  isClientRegistrationExpired(clientReg) {
    if (!clientReg.expiresAt) {
      return true;
    }
    const expiresAt = new Date(clientReg.expiresAt);
    const now = /* @__PURE__ */ new Date();
    return expiresAt.valueOf() < now.valueOf() + CLIENT_REG_INVALIDATION_OFFSET_SECONDS * 1e3;
  }
  async registerClient(startUrl, region, hasUserProvidedInput = false) {
    return withSpan(TelemetryNamespace.Auth, "idc-provider.register", async () => {
      const clientIdHash = this.getClientIdHash(startUrl);
      const ssoClient = new SSOOIDCClient(region);
      const clientRegistrationResp = await ssoClient.registerClient(
        {
          clientName: "Kiro IDE",
          clientType: "public",
          scopes: this.scopes,
          grantTypes: ["authorization_code", "refresh_token"],
          redirectUris: ["http://127.0.0.1/oauth/callback"],
          issuerUrl: startUrl
        },
        hasUserProvidedInput
      );
      const clientReg = {
        clientId: clientRegistrationResp.clientId,
        clientSecret: clientRegistrationResp.clientSecret,
        expiresAt: new Date(clientRegistrationResp.clientSecretExpiresAt * 1e3).toISOString()
      };
      this.storage.writeClientRegistration(clientIdHash, clientReg);
      return clientReg;
    });
  }
  getStartUrl(options) {
    if (options.provider === "Enterprise") {
      return options.startUrl;
    } else if (options.provider === "BuilderId") {
      return BUILDER_ID_START_URL;
    } else {
      return INTERNAL_SSO_START_URL;
    }
  }
  /**
   * Authenticates via IDC method using browser-based OAuth flow using start url
   * @returns Promise that resolves to the token data when authentication is complete
   */
  async authenticate(options) {
    return withSpan(TelemetryNamespace.Auth, "idc-provider.authenticate", async (span) => {
      if (options.authMethod !== "IdC") {
        throw new UnexpectedIssueError("IdC auth: invalid auth method");
      }
      span.setAttribute("authProvider", options.provider);
      const startUrl = this.getStartUrl(options);
      const region = options.region || "us-east-1";
      const ssoClient = new SSOOIDCClient(region);
      const clientRegistration = await this.registerClient(startUrl, region, options.provider === "Enterprise");
      const state = crypto.randomUUID();
      this.authServer = await AuthSSOServer.init(state);
      try {
        await this.authServer.start();
      } catch (error) {
        const trustedError = new TrustedError(
          `Failed to start authentication server. This is likely due to network or firewall restrictions preventing the local server from starting. ${error instanceof Error ? error.message : String(error)}`
        );
        logger.error("AuthServer start failed:", trustedError);
        throw trustedError;
      }
      const codeVerifier = crypto.randomBytes(32).toString("base64url");
      const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest().toString("base64url");
      const localRedirectUri = this.authServer.redirectUri;
      const externalRedirectUri = await vscode.env.asExternalUri(vscode.Uri.parse(localRedirectUri));
      const redirectUri = externalRedirectUri.toString().replace(/\/$/, "");
      const parameters = new URLSearchParams({
        response_type: "code",
        client_id: clientRegistration.clientId,
        redirect_uri: redirectUri,
        scopes: this.scopes.join(","),
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256"
      });
      const authorizeUrl = `https://oidc.${region}.amazonaws.com/authorize?${parameters.toString()}`;
      await vscode.env.openExternal(vscode.Uri.parse(authorizeUrl));
      let code;
      try {
        code = await this.authServer.waitForAuthorization();
      } finally {
        this.authServer = void 0;
      }
      const response = await ssoClient.createToken({
        clientId: clientRegistration.clientId,
        clientSecret: clientRegistration.clientSecret,
        grantType: "authorization_code",
        redirectUri,
        code,
        codeVerifier
      });
      const token = this.tokenResponseToToken(response, this.getClientIdHash(startUrl), options.provider, region);
      await handleProfiles(token);
      return token;
    });
  }
  /**
   * Cancels a currently ongoing sign-in flow
   */
  cancelAuth() {
    if (this.authServer) {
      this.authServer.cancelCurrentFlow();
    }
  }
  /**
   * Refreshes token granted through IDC auth
   * @returns Promise that resolves to the refreshed token data
   */
  async refreshToken(token) {
    return withSpan(TelemetryNamespace.Auth, "idc-provider.refreshToken", async (span) => {
      span.setAttribute("authProvider", token.provider);
      if (token.authMethod !== "IdC") {
        throw new UnexpectedIssueError("IdC auth: invalid auth method");
      }
      const { refreshToken, clientIdHash, provider, region } = token;
      try {
        const clientToken = this.storage.readClientRegistration(clientIdHash);
        const tokenRegion = region || "us-east-1";
        const ssoClient = new SSOOIDCClient(tokenRegion);
        if (!clientToken || this.isClientRegistrationExpired(clientToken)) {
          throw new InvalidIdCAuthError("IdC auth: No valid client registration found");
        }
        const token2 = await ssoClient.createToken({
          clientId: clientToken.clientId,
          clientSecret: clientToken.clientSecret,
          refreshToken,
          grantType: "refresh_token"
        });
        return this.tokenResponseToToken(token2, clientIdHash, provider, tokenRegion);
      } catch (error) {
        logger.error("Error refreshing token:", error);
        throw error;
      }
    });
  }
  /**
   * Logs the user out of a session generated through IDC auth
   * @returns Promise that resolves when logout was complete
   */
  logout(token) {
    try {
      if (token.authMethod !== "IdC") {
        throw new UnexpectedIssueError("IdC auth: invalid auth method");
      }
      this.storage.deleteClientRegistration(token.clientIdHash);
    } catch (error) {
      logger.error("Error deleting client registration during logout:", error);
    }
    return Promise.resolve();
  }
  /**
   * Deletes the user account for IDC auth provider.
   * Only supported for BuilderId accounts.
   * @param token - The token cache data
   * @throws {Error} Throws if account deletion is not supported for the provider type
   */
  async deleteAccount(token) {
    return withSpan(TelemetryNamespace.Auth, "idc-provider.deleteAccount", async (span) => {
      span.setAttribute("authProvider", token.provider);
      if (token.authMethod !== "IdC") {
        throw new UnexpectedIssueError("IdC auth: invalid auth method");
      }
      if (token.provider === "BuilderId") {
        return this.authServiceClient.deleteAccount(token.accessToken);
      } else {
        throw new Error("Account deletion not supported for enterprise auth");
      }
    });
  }
}
class SocialAuthProvider {
  authServiceClient;
  constructor() {
    this.authServiceClient = new AuthServiceClient();
  }
  tokenResponseToToken({ accessToken, refreshToken, profileArn, expiresIn }, provider) {
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + expiresIn * 1e3).toISOString();
    return { accessToken, refreshToken, profileArn, expiresAt, authMethod: "social", provider };
  }
  /**
   * Not implemented - social authentication is handled by PortalAuthProvider.
   */
  authenticate(_options) {
    throw new Error("Not implemented - use PortalAuthProvider for social auth");
  }
  /**
   * No-op since social authentication is handled by PortalAuthProvider.
   */
  cancelAuth() {
  }
  /**
   * Refreshes token granted through social auth
   * @returns Promise that resolves to the refreshed token data
   */
  async refreshToken(token) {
    return withSpan(TelemetryNamespace.Auth, "social-provider.refreshToken", async (span) => {
      span.setAttribute("authProvider", token.provider);
      if (token.authMethod !== "social") {
        throw new UnexpectedIssueError("SocialAuth: invalid auth method");
      }
      const { refreshToken, profileArn, provider } = token;
      try {
        const token2 = await this.authServiceClient.refreshToken({ refreshToken });
        token2.profileArn = profileArn;
        return this.tokenResponseToToken(token2, provider);
      } catch (error) {
        logger.error("Error refreshing token:", error);
        throw error;
      }
    });
  }
  /**
   * Logs the user out of a session generated through social auth
   * @returns Promise that resolves when logout was complete
   */
  async logout(token) {
    return withSpan(TelemetryNamespace.Auth, "social-provider.logout", async (span) => {
      span.setAttribute("authProvider", token.provider);
      if (!token.refreshToken) {
        return;
      }
      return this.authServiceClient.logout({ refreshToken: token.refreshToken });
    });
  }
  /**
   * Deletes the user account using the social auth provider.
   * @param token - The token cache data containing access token
   */
  async deleteAccount(token) {
    return withSpan(TelemetryNamespace.Auth, "social-provider.deleteAccount", async (span) => {
      span.setAttribute("authProvider", token.provider);
      return this.authServiceClient.deleteAccount(token.accessToken);
    });
  }
}
function getIdpProviderFromIssuer(issuerUrl) {
  try {
    const url = new URL(issuerUrl);
    const parts = url.hostname.split(".");
    if (parts.length >= 2) {
      return parts[parts.length - 2];
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}
class ExternalIdpAuthProvider {
  currentAuthState;
  /**
   * Authenticates with an external IdP using Authorization Code + PKCE flow.
   */
  async authenticate(options) {
    return withSpan(TelemetryNamespace.Auth, "external-idp-provider.authenticate", async (span) => {
      if (options.authMethod !== "external_idp") {
        throw new UnexpectedIssueError("ExternalIdpAuth: invalid auth method");
      }
      const { issuerUrl, clientId, scopes, loginHint, audience } = options;
      span.setAttribute("issuerUrl", issuerUrl);
      span.setAttribute("idpProvider", getIdpProviderFromIssuer(issuerUrl));
      let finalScopes = scopes;
      if (!scopes.includes("offline_access")) {
        finalScopes = `${scopes} offline_access`;
      }
      logger.debug("ExternalIdpAuth: Starting OIDC discovery for issuer: %s, clientId: %s", issuerUrl, clientId);
      const discoveryStart = Date.now();
      let config;
      try {
        config = await client.discovery(new URL(issuerUrl), clientId, void 0, client.None());
        span.setAttribute("discoveryDurationMs", Date.now() - discoveryStart);
      } catch (error) {
        span.setAttribute("discoveryDurationMs", Date.now() - discoveryStart);
        span.setAttribute("failurePhase", "external_idp_discovery");
        throw error;
      }
      const serverMetadata = config.serverMetadata();
      const tokenEndpoint = serverMetadata.token_endpoint;
      if (!tokenEndpoint) {
        span.setAttribute("failurePhase", "external_idp_discovery");
        throw new UnexpectedIssueError("ExternalIdpAuth: token_endpoint not found in discovery");
      }
      logger.info(
        "ExternalIdpAuth: OIDC discovery completed - tokenEndpoint: %s, authEndpoint: %s",
        tokenEndpoint,
        serverMetadata.authorization_endpoint
      );
      const codeVerifier = client.randomPKCECodeVerifier();
      const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
      const state = client.randomState();
      this.currentAuthState = state;
      const redirectUri = AUTH_CALLBACK_REDIRECT_URI;
      span.setAttribute("redirectUri", redirectUri);
      const authUrlParams = {
        redirect_uri: redirectUri,
        scope: finalScopes,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        response_mode: "query",
        state
      };
      if (loginHint) {
        authUrlParams.login_hint = loginHint;
      }
      if (audience) {
        authUrlParams.audience = audience;
      }
      const authUrl = client.buildAuthorizationUrl(config, authUrlParams);
      logger.debug("ExternalIdpAuth: Authorization URL built: %s", authUrl.href);
      logger.info("ExternalIdpAuth: Opening browser for authentication");
      const browserOpenStart = Date.now();
      let opened;
      try {
        opened = await vscode.env.openExternal(vscode.Uri.parse(authUrl.href), { skipValidation: true });
        span.setAttribute("browserOpenDurationMs", Date.now() - browserOpenStart);
        span.setAttribute("browserOpenSuccess", opened);
      } catch (error) {
        span.setAttribute("browserOpenDurationMs", Date.now() - browserOpenStart);
        span.setAttribute("browserOpenSuccess", false);
        span.setAttribute("failurePhase", "external_idp_browser_open");
        this.currentAuthState = void 0;
        throw error;
      }
      if (!opened) {
        this.currentAuthState = void 0;
        span.setAttribute("failurePhase", "external_idp_browser_open");
        throw new UnexpectedIssueError("ExternalIdpAuth: Failed to open browser for authentication");
      }
      const callbackWaitStart = Date.now();
      let code;
      let iss;
      try {
        const callbackData = await authCallbackHandler.waitForCallback(state);
        code = callbackData.code;
        iss = callbackData.iss;
        span.setAttribute("callbackWaitDurationMs", Date.now() - callbackWaitStart);
        logger.info("ExternalIdpAuth: Received authorization code");
      } catch (error) {
        span.setAttribute("callbackWaitDurationMs", Date.now() - callbackWaitStart);
        span.setAttribute("failurePhase", "external_idp_callback_wait");
        this.currentAuthState = void 0;
        throw error;
      }
      this.currentAuthState = void 0;
      const callbackUrl = new URL(redirectUri);
      callbackUrl.searchParams.set("code", code);
      callbackUrl.searchParams.set("state", state);
      if (iss) {
        callbackUrl.searchParams.set("iss", iss);
      }
      logger.debug("ExternalIdpAuth: Token exchange - callbackUrl: %s", callbackUrl.href);
      const tokenExchangeStart = Date.now();
      let tokens;
      try {
        tokens = await client.authorizationCodeGrant(config, callbackUrl, {
          pkceCodeVerifier: codeVerifier,
          expectedState: state,
          idTokenExpected: false
        });
        span.setAttribute("tokenExchangeDurationMs", Date.now() - tokenExchangeStart);
      } catch (error) {
        span.setAttribute("tokenExchangeDurationMs", Date.now() - tokenExchangeStart);
        span.setAttribute("failurePhase", "external_idp_token_exchange");
        if (error instanceof client.ResponseBodyError) {
          span.setAttribute("errorType", "ResponseBodyError");
          span.setAttribute("errorCode", error.error || "");
          span.setAttribute("errorDescription", error.error_description || "");
          logger.error(
            "ExternalIdpAuth: Token exchange failed (ResponseBodyError) - error: %s, description: %s, status: %d",
            error.error,
            error.error_description,
            error.status
          );
        } else if (error instanceof client.WWWAuthenticateChallengeError) {
          span.setAttribute("errorType", "WWWAuthenticateChallengeError");
          logger.error(
            "ExternalIdpAuth: Token exchange failed (WWWAuthenticateChallengeError) - status: %d, message: %s",
            error.status,
            error.message
          );
        } else if (error instanceof client.AuthorizationResponseError) {
          span.setAttribute("errorType", "AuthorizationResponseError");
          span.setAttribute("errorCode", error.error || "");
          span.setAttribute("errorDescription", error.error_description || "");
          logger.error(
            "ExternalIdpAuth: Token exchange failed (AuthorizationResponseError) - error: %s, description: %s",
            error.error,
            error.error_description
          );
        } else if (error instanceof Error) {
          span.setAttribute("errorType", error.constructor.name);
          logger.error(
            "ExternalIdpAuth: Token exchange failed (%s) - message: %s, cause: %s",
            error.constructor.name,
            error.message,
            error.cause
          );
        } else {
          span.setAttribute("errorType", "unknown");
          logger.error("ExternalIdpAuth: Token exchange failed (unknown): %s", error);
        }
        throw error;
      }
      logger.info("ExternalIdpAuth: Token exchange successful");
      const token = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || "",
        expiresAt: this.calculateExpiresAt(tokens.expires_in),
        authMethod: "external_idp",
        provider: "ExternalIdp",
        tokenEndpoint,
        issuerUrl,
        clientId,
        scopes: finalScopes,
        audience
      };
      try {
        await handleProfiles(token);
      } catch (error) {
        span.setAttribute("failurePhase", "external_idp_profile_selection");
        throw error;
      }
      return token;
    });
  }
  /**
   * Cancels the current authentication flow
   */
  cancelAuth() {
    if (this.currentAuthState) {
      authCallbackHandler.cancelCallback(this.currentAuthState);
      this.currentAuthState = void 0;
    }
  }
  /**
   * Refreshes token by calling the customer's IdP token endpoint
   */
  async refreshToken(token) {
    return withSpan(TelemetryNamespace.Auth, "external-idp-provider.refreshToken", async (span) => {
      span.setAttribute("authProvider", token.provider);
      if (token.authMethod !== "external_idp") {
        throw new UnexpectedIssueError("ExternalIdpAuth: invalid auth method");
      }
      const { refreshToken, tokenEndpoint, issuerUrl, clientId, scopes, audience } = token;
      logger.info(
        "ExternalIdpAuth: Starting token refresh - issuerUrl: %s, clientId: %s, hasRefreshToken: %s, scopes: %s, audience: %s",
        issuerUrl,
        clientId,
        !!refreshToken,
        scopes,
        audience
      );
      span.setAttribute("issuerUrl", issuerUrl || "missing");
      span.setAttribute("idpProvider", getIdpProviderFromIssuer(issuerUrl));
      if (!issuerUrl) {
        span.setAttribute("failurePhase", "external_idp_validation");
        throw new UnexpectedIssueError("ExternalIdpAuth: missing issuerUrl in stored token");
      }
      let issuerUrlParsed;
      try {
        issuerUrlParsed = new URL(issuerUrl);
      } catch {
        span.setAttribute("failurePhase", "external_idp_validation");
        throw new UnexpectedIssueError(`ExternalIdpAuth: invalid issuerUrl in stored token: ${issuerUrl}`);
      }
      const discoveryStart = Date.now();
      let config;
      try {
        config = await client.discovery(issuerUrlParsed, clientId, void 0, client.None());
        logger.info("ExternalIdpAuth: OIDC discovery completed in %dms", Date.now() - discoveryStart);
      } catch (error) {
        span.setAttribute("discoveryDurationMs", Date.now() - discoveryStart);
        span.setAttribute("failurePhase", "external_idp_discovery");
        if (error instanceof TypeError) {
          span.setAttribute("errorType", "TypeError");
          logger.error(
            "ExternalIdpAuth: Refresh discovery failed (TypeError) - issuerUrl: %s, message: %s",
            issuerUrl,
            error.message
          );
        } else if (error instanceof Error) {
          span.setAttribute("errorType", error.constructor.name);
          logger.error(
            "ExternalIdpAuth: Refresh discovery failed (%s) - issuerUrl: %s, message: %s",
            error.constructor.name,
            issuerUrl,
            error.message
          );
        }
        throw error;
      }
      const refreshStart = Date.now();
      try {
        const refreshParams = {};
        if (scopes) {
          refreshParams.scope = scopes;
        }
        const tokens = await client.refreshTokenGrant(config, refreshToken, refreshParams);
        const newRefreshTokenReceived = !!tokens.refresh_token;
        logger.info(
          "ExternalIdpAuth: Token refresh successful in %dms - newRefreshTokenReceived: %s, expiresIn: %s",
          Date.now() - refreshStart,
          newRefreshTokenReceived,
          tokens.expires_in
        );
        return {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || refreshToken,
          expiresAt: this.calculateExpiresAt(tokens.expires_in),
          authMethod: "external_idp",
          provider: "ExternalIdp",
          tokenEndpoint,
          issuerUrl,
          clientId,
          scopes,
          audience
        };
      } catch (error) {
        span.setAttribute("refreshDurationMs", Date.now() - refreshStart);
        span.setAttribute("failurePhase", "external_idp_refresh_grant");
        if (error instanceof client.ResponseBodyError) {
          span.setAttribute("errorType", "ResponseBodyError");
          span.setAttribute("errorCode", error.error || "");
          span.setAttribute("errorDescription", error.error_description || "");
          logger.error(
            "ExternalIdpAuth: Refresh failed (ResponseBodyError) - error: %s, description: %s, status: %d",
            error.error,
            error.error_description,
            error.status
          );
        } else if (error instanceof client.WWWAuthenticateChallengeError) {
          span.setAttribute("errorType", "WWWAuthenticateChallengeError");
          logger.error(
            "ExternalIdpAuth: Refresh failed (WWWAuthenticateChallengeError) - status: %d, message: %s",
            error.status,
            error.message
          );
        } else if (error instanceof Error) {
          span.setAttribute("errorType", error.constructor.name);
          logger.error(
            "ExternalIdpAuth: Refresh failed (%s) - message: %s, cause: %s",
            error.constructor.name,
            error.message,
            error.cause
          );
        } else {
          span.setAttribute("errorType", "unknown");
          logger.error("ExternalIdpAuth: Refresh failed (unknown): %s", error);
        }
        throw error;
      }
    });
  }
  /**
   * Logout for External IdP tokens - no-op since managed by customer IdP.
   */
  async logout(_token) {
    return Promise.resolve();
  }
  /**
   * Account deletion is not supported for External IdP authentication.
   */
  deleteAccount(_token) {
    return Promise.reject(new UnexpectedIssueError("Account deletion not supported for external IdP authentication"));
  }
  calculateExpiresAt(expiresIn) {
    const now = /* @__PURE__ */ new Date();
    const seconds = expiresIn ?? 3600;
    return new Date(now.getTime() + seconds * 1e3).toISOString();
  }
}
export {
  AUTH_CALLBACK_REDIRECT_URI as A,
  ClientRegistrationStorage as C,
  ExternalIdpAuthProvider as E,
  IDCAuthProvider as I,
  SocialAuthProvider as S,
  AuthCallbackHandler as a,
  authCallbackHandler as b,
  selectOrPromptProfile as c,
  handleProfiles as h,
  supportsProfiles as s
};
