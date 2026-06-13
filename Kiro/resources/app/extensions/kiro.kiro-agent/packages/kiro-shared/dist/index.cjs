"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const externalIdpAuthProvider = require("./external-idp-auth-provider-CiC01FcA.cjs");
const authConfig = require("./auth-config-Ci0TiIj0.cjs");
const ssoOidcClient = require("./sso-oidc-client-DPRN1YFU.cjs");
const vscode = require("vscode");
const errors = require("./errors-CHx_k7HS.cjs");
const path = require("path");
const os = require("os");
const fs = require("fs");
require("node-machine-id");
const telemetry_definitions_index = require("./telemetry/definitions/index.cjs");
require("http");
const telemetry_index = require("./telemetry/index.cjs");
const portalAuthProvider = require("./portal-auth-provider-KQnCQMCF.cjs");
const asyncSema = require("async-sema");
const mcpManager = require("./mcp-manager-yLaX9_IS.cjs");
const resolveRegistryEntries = require("./resolve-registry-entries-C7jM70XK.cjs");
const uri = require("./uri-CwHODiaj.cjs");
const paths = require("./paths-C6z4_Obm.cjs");
const timer = require("./timer-Bu5upiIL.cjs");
const machineId = require("./machine-id-hff6ippA.cjs");
const agent = require("@kiro/agent");
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
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const os__namespace = /* @__PURE__ */ _interopNamespaceDefault(os);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const KIRO_AUTH_TOKEN_FILE_NAME = "kiro-auth-token.json";
const SOCIAL_PROVIDERS = ["Google", "Github"];
const IDC_PROVIDERS = ["Enterprise", "BuilderId", "Internal"];
class TokenStorage {
  tokenCache;
  cacheDirectory = path__namespace.join(os__namespace.homedir(), ".aws", "sso", "cache");
  _onDidChange = new vscode__namespace.EventEmitter();
  watchListener;
  constructor() {
    this.watchListener = () => {
      try {
        const oldToken = this.tokenCache;
        this.clearCache();
        const newToken = this.readTokenFromDisk();
        this._onDidChange.fire({ oldToken, newToken });
      } catch (e) {
        errors.logger.error("Token file watcher error: %s", e);
      }
    };
    const tokenPath = this.getAuthTokenPath();
    this.assertNotSymlink(tokenPath);
    fs__namespace.watchFile(tokenPath, this.watchListener);
  }
  /**
   * Cleans up internal state
   */
  dispose() {
    fs__namespace.unwatchFile(this.getAuthTokenPath(), this.watchListener);
  }
  /**
   * Event that fires when the token changes, providing both old and new token values
   */
  get onDidChange() {
    return this._onDidChange.event;
  }
  readTokenFromLocalCache() {
    return this.tokenCache;
  }
  getAuthTokenPath() {
    return path__namespace.join(this.cacheDirectory, KIRO_AUTH_TOKEN_FILE_NAME);
  }
  ensureCacheDirectory() {
    try {
      if (!fs__namespace.existsSync(this.cacheDirectory)) {
        fs__namespace.mkdirSync(this.cacheDirectory, { recursive: true });
      }
    } catch (_e) {
      throw new ssoOidcClient.FileSystemAccessError(this.cacheDirectory);
    }
  }
  /**
   * Checks that the given path is not a symbolic link.
   * Prevents symlink-based credential theft (CWE-59) where an attacker
   * pre-places a symlink to redirect token writes to an attacker-controlled location.
   */
  assertNotSymlink(filePath) {
    let stat;
    try {
      stat = fs__namespace.lstatSync(filePath);
    } catch (e) {
      if (e.code === "ENOENT") {
        return;
      }
      throw new ssoOidcClient.FileSystemAccessError(filePath, e);
    }
    if (stat.isSymbolicLink()) {
      errors.logger.error("Security: symbolic link detected at token storage path: %s", filePath);
      throw new ssoOidcClient.SymlinkDetectedError(filePath);
    }
  }
  writeTokenToLocalCache(token) {
    this.tokenCache = token;
  }
  writeTokenToDisk(token) {
    this.ensureCacheDirectory();
    const tokenPath = this.getAuthTokenPath();
    this.assertNotSymlink(tokenPath);
    try {
      fs__namespace.writeFileSync(tokenPath, JSON.stringify(token, void 0, 2), { mode: 384 });
      fs__namespace.chmodSync(tokenPath, 384);
    } catch (_e) {
      throw new ssoOidcClient.FileSystemAccessError(tokenPath);
    }
  }
  clearCache() {
    this.tokenCache = void 0;
  }
  readTokenFromDisk() {
    const tokenPath = this.getAuthTokenPath();
    this.assertNotSymlink(tokenPath);
    if (fs__namespace.existsSync(tokenPath)) {
      try {
        const cacheContents = fs__namespace.readFileSync(tokenPath, "utf8");
        try {
          return JSON.parse(cacheContents);
        } catch (e) {
          errors.logger.error("Error trying to parse the token file.", e);
          return void 0;
        }
      } catch (_e) {
        throw new ssoOidcClient.FileSystemAccessError(tokenPath);
      }
    }
  }
  /**
   * The method removed internal token inconsistencies enabled through redundant data stored in the token (authMethod vs. provider)
   * We treat the provider as the source of truth and, if provided, we determine authMethod based on that.
   */
  sanitizeToken(token) {
    if (SOCIAL_PROVIDERS.includes(token.provider)) {
      return { ...token, authMethod: "social" };
    } else if (IDC_PROVIDERS.includes(token.provider)) {
      return { ...token, authMethod: "IdC" };
    }
    return token;
  }
  /**
   * Retrieves the currently cached auth token
   */
  readToken() {
    const localToken = this.readTokenFromLocalCache();
    if (localToken) {
      return this.sanitizeToken(localToken);
    }
    const tokenFromDisk = this.readTokenFromDisk();
    if (tokenFromDisk) {
      this.writeTokenToLocalCache(tokenFromDisk);
      return this.sanitizeToken(tokenFromDisk);
    }
  }
  /**
   * Writes an auth token to cache
   */
  writeToken(token) {
    const oldToken = this.tokenCache;
    this.writeTokenToDisk(token);
    this.clearCache();
    this._onDidChange.fire({ oldToken, newToken: token });
  }
  /**
   * Deletes cached auth token
   */
  clearToken() {
    const oldToken = this.tokenCache;
    this.clearCache();
    const tokenPath = this.getAuthTokenPath();
    this.assertNotSymlink(tokenPath);
    try {
      if (fs__namespace.existsSync(tokenPath)) {
        fs__namespace.unlinkSync(tokenPath);
      }
    } catch (_e) {
      throw new ssoOidcClient.FileSystemAccessError(tokenPath);
    }
    this._onDidChange.fire({ oldToken, newToken: void 0 });
  }
}
class ProfileStorage {
  static instance;
  profileUri;
  PROFILE_FILE_NAME = "profile.json";
  // avoid profile reads running concurrently with writes/deletion
  profileAccessSemaphore = new asyncSema.Sema(1);
  constructor(context) {
    this.profileUri = vscode__namespace.Uri.joinPath(context.globalStorageUri, this.PROFILE_FILE_NAME);
  }
  /**
   * Initialize the ProfileStorage singleton instance.
   * This should be called once during extension activation.
   * Safe to call multiple times - will only initialize once.
   * @param context - The VSCode extension context
   */
  static initializeInstance(context) {
    if (!ProfileStorage.instance) {
      ProfileStorage.instance = new ProfileStorage(context);
    }
  }
  /**
   * Get the ProfileStorage singleton instance.
   * @returns The singleton instance
   * @throws Error if not initialized
   */
  static getInstance() {
    if (!ProfileStorage.instance) {
      throw new Error("ProfileStorage must be initialized before use. Call initializeInstance() first.");
    }
    return ProfileStorage.instance;
  }
  /**
   * Writes a profile to persistent storage.
   * @param profile - The profile to persist
   * @throws Will not throw - errors are logged and handled gracefully
   */
  async writeProfile(profile) {
    await this.profileAccessSemaphore.acquire();
    try {
      await this.ensureDirectoryExists(vscode__namespace.Uri.joinPath(this.profileUri, ".."));
      const jsonContent = JSON.stringify(profile, null, 2);
      const content = new TextEncoder().encode(jsonContent);
      await vscode__namespace.workspace.fs.writeFile(this.profileUri, content);
      telemetry_index.recordProfileStorageEvent("writeProfile", true);
    } catch (error) {
      telemetry_index.recordProfileStorageEvent("writeProfile", false, "fileSystemError");
      errors.logger.error("[ProfileStorage] Failed to write profile", { error });
    } finally {
      this.profileAccessSemaphore.release();
    }
  }
  /**
   * Reads the current profile from persistent storage.
   * @returns The current profile, or undefined if no valid profile exists
   */
  async readProfile() {
    await this.profileAccessSemaphore.acquire();
    try {
      const fileContent = await vscode__namespace.workspace.fs.readFile(this.profileUri);
      const fileText = new TextDecoder().decode(fileContent);
      const parsedData = JSON.parse(fileText);
      if (this.validateProfile(parsedData)) {
        telemetry_index.recordProfileStorageEvent("readProfile", true);
        return parsedData;
      } else {
        telemetry_index.recordProfileStorageEvent("readProfile", false, "invalidData");
        errors.logger.error("[ProfileStorage] Invalid profile data structure in storage file");
        return void 0;
      }
    } catch (error) {
      let errorType = "unknown";
      if (error instanceof vscode__namespace.FileSystemError && error.code === "FileNotFound") {
        errorType = "fileNotFound";
      } else if (error instanceof SyntaxError) {
        errorType = "parseError";
      } else {
        errorType = "fileSystemError";
      }
      telemetry_index.recordProfileStorageEvent("readProfile", false, errorType);
      errors.logger.error("[ProfileStorage] Error reading profile", { error });
      return void 0;
    } finally {
      this.profileAccessSemaphore.release();
    }
  }
  /**
   * Deletes the current profile from persistent storage.
   * @throws Will not throw - errors are logged and handled gracefully
   */
  async deleteProfile() {
    await this.profileAccessSemaphore.acquire();
    try {
      await vscode__namespace.workspace.fs.delete(this.profileUri);
      telemetry_index.recordProfileStorageEvent("deleteProfile", true);
    } catch (error) {
      if (error instanceof vscode__namespace.FileSystemError && error.code === "FileNotFound") {
        telemetry_index.recordProfileStorageEvent("deleteProfile", true);
        return;
      }
      telemetry_index.recordProfileStorageEvent("deleteProfile", false, "fileSystemError");
      errors.logger.error("[ProfileStorage] Error deleting profile", { error });
    } finally {
      this.profileAccessSemaphore.release();
    }
  }
  /**
   * Gets the URI for the profile storage file.
   *
   * Uses the extension's global storage URI to ensure the profile persists
   * across workspaces and is accessible by all IDE windows.
   *
   * This method allows external components to set up their own file watchers
   * or perform other operations that need the profile file location.
   * @returns The URI to the profile storage file
   */
  getProfileFileUri() {
    return this.profileUri;
  }
  /**
   * Ensures that the storage directory exists, creating it if necessary.
   * @param dirUri - The directory URI to ensure exists
   */
  async ensureDirectoryExists(dirUri) {
    try {
      await vscode__namespace.workspace.fs.createDirectory(dirUri);
    } catch (error) {
      if (error instanceof vscode__namespace.FileSystemError && error.code === "FileExists") {
        return;
      }
      errors.logger.error("[ProfileStorage] Failed to create directory", { dirUri: dirUri.toString(), error });
    }
  }
  /**
   * Validates that an object conforms to the Profile interface.
   * @param data - The data to validate
   * @returns True if the data is a valid Profile, false otherwise
   */
  validateProfile(data) {
    return !!data && typeof data === "object" && "arn" in data && "name" in data && typeof data.arn === "string" && typeof data.name === "string" && data.arn.length > 0 && data.name.length > 0;
  }
}
function registerProfileStorage(context) {
  ProfileStorage.initializeInstance(context);
}
const AUTH_TOKEN_INVALIDATION_OFFSET_SECONDS = 3 * 60;
const REFRESH_BEFORE_EXPIRY_SECONDS = 10 * 60;
const REFRESH_LOOP_INTERVAL_SECONDS = 60;
const Metrics = new telemetry_definitions_index.MetricReporter(telemetry_definitions_index.TelemetryNamespace.Auth, "auth-provider");
function translateError(error) {
  return error instanceof ssoOidcClient.AuthError ? error : new ssoOidcClient.UnexpectedIssueError("Auth provider: unexpected issue");
}
class AuthProvider {
  storage;
  signInDeferred;
  signInPromise;
  providers;
  portalProvider;
  authErrorMessagePromises = {
    AccessDenied: null,
    NetworkIssue: null,
    Unknown: null
  };
  refreshSettled = Promise.resolve();
  refreshLoopTimeout;
  _onDidChangeLoginStatus = new vscode__namespace.EventEmitter();
  _onDidPerformUserInitiatedLogout = new vscode__namespace.EventEmitter();
  disposables = [];
  /**
   * Event that triggers where there is a change in login status
   */
  get onDidChangeLoginStatus() {
    return this._onDidChangeLoginStatus.event;
  }
  /**
   * Event that triggers when user initiates a logout
   * We treat this separately from other changes to the login status because a user initiated logout
   * will result in the sign-in page to be rendered again.
   */
  get onDidPerformUserInitiatedLogout() {
    return this._onDidPerformUserInitiatedLogout.event;
  }
  constructor() {
    this.storage = new TokenStorage();
    this.providers = {
      IdC: new externalIdpAuthProvider.IDCAuthProvider(),
      social: new externalIdpAuthProvider.SocialAuthProvider(),
      external_idp: new externalIdpAuthProvider.ExternalIdpAuthProvider()
    };
    this.portalProvider = new portalAuthProvider.PortalAuthProvider();
    if (vscode__namespace.window.state.focused) {
      this.startRefreshLoop();
    }
    this.disposables.push(
      this.storage,
      {
        dispose: () => {
          this.stopRefreshLoop();
        }
      },
      this.storage.onDidChange(({ oldToken, newToken }) => {
        this.handleTokenChanges(oldToken, newToken);
      }),
      vscode__namespace.window.onDidChangeWindowState((event) => {
        if (event.focused) {
          this.startRefreshLoop();
        } else {
          this.stopRefreshLoop();
        }
      })
    );
  }
  /**
   * Cleans up internal state
   */
  dispose() {
    this.disposables.forEach((disposable) => {
      disposable.dispose();
    });
  }
  stopRefreshLoop() {
    if (this.refreshLoopTimeout) {
      clearInterval(this.refreshLoopTimeout);
    }
  }
  startRefreshLoop() {
    this.stopRefreshLoop();
    this.refreshSettled = this.attemptRefreshIfCloseToExpiry();
    this.refreshLoopTimeout = setInterval(() => {
      this.refreshSettled = this.attemptRefreshIfCloseToExpiry();
    }, REFRESH_LOOP_INTERVAL_SECONDS * 1e3);
  }
  /**
   * Handles changes of the token inside the storage
   * This ensures that changes made to the file system reflect correctly on the UI
   * More importantly, it ensures that an action performed in one IDE window reflect
   * correctly in all other open IDE windows.
   */
  handleTokenChanges(oldToken, newToken) {
    const wasSignedIn = !!oldToken?.refreshToken;
    const isNowSignedIn = !!newToken?.refreshToken;
    if (isNowSignedIn && this.signInDeferred) {
      this.signInDeferred.resolve(newToken);
    }
    if (wasSignedIn === isNowSignedIn) {
      return;
    }
    if (isNowSignedIn) {
      this._onDidChangeLoginStatus.fire({
        isSignedIn: true,
        token: newToken
      });
    } else {
      this._onDidChangeLoginStatus.fire({
        isSignedIn: false,
        token: void 0
      });
    }
  }
  async attemptRefreshIfCloseToExpiry() {
    try {
      const token = this.storage.readToken();
      if (!token) {
        return;
      }
      if (!token.expiresAt || !token.accessToken) {
        return;
      }
      if (this.isAuthTokenExpiredWithinSeconds(token, REFRESH_BEFORE_EXPIRY_SECONDS)) {
        errors.logger.info(
          "Auth refresh loop: token close to expiry, attempting refresh - provider: %s, authMethod: %s, expiresAt: %s",
          token.provider,
          token.authMethod,
          token.expiresAt
        );
        await telemetry_index.withSpan(telemetry_definitions_index.TelemetryNamespace.Auth, "auth-provider.scheduled-refresh", () => {
          return this.refreshToken();
        });
        errors.logger.info("Auth refresh loop: refresh completed successfully");
      }
    } catch (error) {
      errors.logger.error("Auth refresh loop: refresh failed, will retry next loop - error: %s", error);
      const token = this.storage.readToken();
      if (ssoOidcClient.isBadAuthIssue(error) && token && this.isAuthTokenExpiredWithinSeconds(token, AUTH_TOKEN_INVALIDATION_OFFSET_SECONDS)) {
        errors.logger.warn("Auth refresh loop: bad auth issue and token near expiry, logging out");
        void this.logoutAndForget();
      }
    }
  }
  isAuthTokenExpiredWithinSeconds(token, seconds) {
    if (!token.expiresAt || !token.accessToken) {
      return true;
    }
    const expiresAt = new Date(token.expiresAt);
    const now = /* @__PURE__ */ new Date();
    return expiresAt.valueOf() < now.valueOf() + seconds * 1e3;
  }
  isAuthTokenExpired(token) {
    return this.isAuthTokenExpiredWithinSeconds(token, AUTH_TOKEN_INVALIDATION_OFFSET_SECONDS);
  }
  /**
   * Returns the current auth token if authenticated
   * @returns Promise that resolves to the token (string)
   */
  async getToken() {
    return (await this.getTokenData()).accessToken;
  }
  /**
   * Returns the current auth token if authenticated
   * @returns The token read from cache / disk
   */
  readToken() {
    return this.storage.readToken();
  }
  /**
   * Returns the current profileArn if authenticated
   * @returns Promise that resolves to the profileArn (string)
   */
  async getProfileArn() {
    const token = await this.getTokenData();
    if ("profileArn" in token) {
      return token.profileArn;
    }
    const profile = await ProfileStorage.getInstance().readProfile();
    return profile?.arn;
  }
  /**
   * Returns the current auth token by trying various methods to read or re-generate it
   * (including attempting to refresh the token if expired)
   * @returns Promise that resolves to the token (LocalTokenCacheData)
   */
  async getTokenData({ attemptRefresh } = { attemptRefresh: true }) {
    await this.refreshSettled;
    try {
      const token = this.storage.readToken();
      if (!token) {
        throw new ssoOidcClient.MissingTokenError("No valid token found");
      }
      if (!this.isAuthTokenExpired(token)) {
        return token;
      }
      if (token.refreshToken && attemptRefresh) {
        return await telemetry_index.withSpan(telemetry_definitions_index.TelemetryNamespace.Auth, "auth-provider.getTokenData", async () => {
          await this.refreshToken();
          return await this.getTokenData({ attemptRefresh: false });
        });
      }
      throw new ssoOidcClient.MalformedTokenError("No valid token found");
    } catch (error) {
      if (ssoOidcClient.isBadAuthIssue(error)) {
        void this.logoutAndForget();
      }
      errors.logger.error("Failed to retrieve auth token:", error);
      throw translateError(error);
    }
  }
  /**
   * Whether the user is currently considered to be logged in
   */
  isLoggedIn() {
    const token = this.storage.readToken();
    return !!token?.refreshToken;
  }
  /**
   * Logs the user out of the session
   * @returns Promise that resolves when logout is complete
   */
  async logout() {
    if (!this.isLoggedIn()) {
      return;
    }
    const token = this.storage.readToken();
    if (!token) {
      return;
    }
    return Metrics.withTrace(portalAuthProvider.getTraceConfig("logout", token.provider), async (span) => {
      span.setAttribute("authProvider", token.provider);
      try {
        this.storage.clearToken();
        await ProfileStorage.getInstance().deleteProfile();
        const provider = this.providers[token.authMethod];
        await provider.logout(token);
        telemetry_definitions_index.clearUserId();
      } catch (e) {
        errors.logger.error("Failed to logout:", e);
        throw translateError(e);
      }
    });
  }
  async logoutAndForget() {
    try {
      await this.logout();
    } catch (_e) {
    }
  }
  /**
   * Deletes the user account
   * @returns Promise that resolves when account deletion is complete
   */
  async deleteAccount() {
    if (!this.isLoggedIn()) {
      throw new ssoOidcClient.InvalidAuthError("Not logged in");
    }
    const token = this.storage.readToken();
    if (!token) {
      throw new ssoOidcClient.MissingTokenError("No token available");
    }
    return Metrics.withTrace(portalAuthProvider.getTraceConfig("deleteAccount", token.provider), async (span) => {
      span.setAttribute("authProvider", token.provider);
      const provider = this.providers[token.authMethod];
      try {
        await provider.deleteAccount(token);
        this.storage.clearToken();
        telemetry_definitions_index.clearUserId();
        this._onDidPerformUserInitiatedLogout.fire();
      } catch (e) {
        errors.logger.error("Failed to delete account:", e);
        throw translateError(e);
      }
    });
  }
  /**
   * Attempts to refresh the auth token
   * @returns Promise that resolves when token refresh is complete
   */
  async refreshToken() {
    const token = this.storage.readToken();
    if (!token?.refreshToken) {
      throw new ssoOidcClient.InvalidAuthError("No valid refresh token found");
    }
    return Metrics.withTrace(portalAuthProvider.getTraceConfig("refreshToken", token.provider), async (span) => {
      span.setAttribute("authProvider", token.provider);
      try {
        const provider = this.providers[token.authMethod];
        const newToken = await provider.refreshToken(token);
        if (this.storage.readToken()?.refreshToken === token.refreshToken) {
          this.storage.writeToken(newToken);
        }
      } catch (e) {
        errors.logger.error("Failed to refresh token:", e);
        throw e;
      }
    });
  }
  async openInternalLink(path2) {
    const callbackUri = await vscode__namespace.env.asExternalUri(
      vscode__namespace.Uri.parse(`${vscode__namespace.env.uriScheme}://kiro.kiroAgent${path2}`)
    );
    await vscode__namespace.env.openExternal(callbackUri);
  }
  /**
   * Authenticates the user via the unified auth portal.
   * All authentication now goes through app.kiro.dev/signin.
   */
  async authenticateWithOptions(options) {
    telemetry_definitions_index.recordOnboardingStep("started-login");
    if (options.authMethod !== "portal") {
      throw new ssoOidcClient.UnexpectedIssueError("Only portal authentication is supported");
    }
    return this.authenticateWithPortal();
  }
  /**
   * Authenticates via the unified auth portal.
   * The portal handles login method selection and returns either:
   * - A token directly (for social logins)
   * - Issuer URL and region (for IdC logins, requiring a second authentication step)
   * - IdP metadata (for external IdP, IDE performs OAuth flow with customer IdP)
   */
  async authenticateWithPortal() {
    if (this.isLoggedIn()) {
      await this.logout();
    }
    try {
      const result = await Metrics.withTrace(
        portalAuthProvider.getTraceConfig("authenticate", "unknown"),
        () => this.portalProvider.authenticate()
      );
      const token = await this.processPortalResult(result);
      this.storage.writeToken(token);
      try {
        await this.openInternalLink("/did-authenticate");
      } catch (e) {
        errors.logger.warn("Failed to open internal link after authentication:", e);
      }
      telemetry_definitions_index.recordOnboardingStep("finished-login");
      const authSource = this.getAuthSourceFromPortalResult(result);
      telemetry_definitions_index.recordAuthFromSource(authSource);
    } catch (error) {
      if (error instanceof ssoOidcClient.SignInBlockedError) {
        errors.logger.info("Sign-in temporarily not allowed");
      } else if (error instanceof ssoOidcClient.CanceledError) {
        errors.logger.info("Authentication canceled");
        telemetry_definitions_index.recordOnboardingStep("canceled-login");
      } else if (error instanceof ssoOidcClient.AbandonedError) {
        errors.logger.info("Authentication timed out");
        telemetry_definitions_index.recordOnboardingStep("abandoned-login");
      } else if (error instanceof ssoOidcClient.InvalidUserInputError) {
        errors.logger.error("Authentication failed due to bad user input:", error);
        telemetry_definitions_index.recordOnboardingStep("bad-user-input");
      } else {
        errors.logger.error("Authentication failed:", error);
        telemetry_definitions_index.recordOnboardingStep("failed-login");
        void vscode__namespace.window.showErrorMessage("Failed to authenticate with Kiro.");
      }
      await this.logout();
      throw error;
    }
  }
  /**
   * Processes the portal auth result to obtain a token.
   * For social logins, the token is returned directly.
   * For IdC logins, initiates the IdC authentication flow with the provided issuer URL.
   */
  async processPortalResult(result) {
    if (result.type === "social") {
      return result.token;
    }
    if (result.type === "external_idp") {
      return Metrics.withTrace(portalAuthProvider.getTraceConfig("authenticate", "ExternalIdp"), () => {
        return this.providers.external_idp.authenticate({
          authMethod: "external_idp",
          provider: "ExternalIdp",
          issuerUrl: result.issuerUrl,
          clientId: result.clientId,
          scopes: result.scopes,
          loginHint: result.loginHint
        });
      });
    }
    const idcProvider = this.providers.IdC;
    const provider = this.getIdcProviderFromPortalResult(result);
    const idcOptions = {
      authMethod: "IdC",
      provider,
      ...provider === "Enterprise" ? { startUrl: result.issuerUrl, region: result.idcRegion } : {}
    };
    return Metrics.withTrace(portalAuthProvider.getTraceConfig("authenticate", provider), () => {
      return idcProvider.authenticate(idcOptions);
    });
  }
  getIdcProviderFromPortalResult(result) {
    switch (result.type) {
      case "builderid":
        return "BuilderId";
      case "awsidc":
        return "Enterprise";
      case "internal":
        return "Internal";
    }
  }
  getAuthSourceFromPortalResult(result) {
    switch (result.type) {
      case "social":
        return { authMethod: "social", provider: result.token.provider };
      case "builderid":
        return { authMethod: "IdC", provider: "BuilderId" };
      case "awsidc":
        return { authMethod: "IdC", provider: "Enterprise", startUrl: result.issuerUrl, region: result.idcRegion };
      case "internal":
        return { authMethod: "IdC", provider: "Internal" };
      case "external_idp":
        return {
          authMethod: "external_idp",
          provider: "ExternalIdp",
          issuerUrl: result.issuerUrl,
          clientId: result.clientId,
          scopes: result.scopes,
          loginHint: result.loginHint,
          audience: result.audience
        };
    }
  }
  /**
   * Cancels any current ongoing sign-in flow
   */
  cancelSignIn() {
    this.providers.IdC.cancelAuth();
    this.providers.social.cancelAuth();
    this.providers.external_idp.cancelAuth();
    this.portalProvider.cancelAuth();
  }
  /**
   * Consumers of the auth provider should call this method when a token issued through this provider
   * was rejected by the invoked service.
   */
  async handleAuthError(error) {
    if (error instanceof ssoOidcClient.AccessDeniedError || error instanceof ssoOidcClient.MissingTokenError || error instanceof ssoOidcClient.MalformedTokenError || error instanceof ssoOidcClient.InvalidAuthError || error instanceof ssoOidcClient.InvalidSSOAuthError || error instanceof ssoOidcClient.InvalidIdCAuthError) {
      return this.showInvalidSessionErrorMessage();
    } else if (error instanceof ssoOidcClient.NetworkIssueError) {
      return this.showNetworkIssueErrorMessage();
    } else {
      return this.showUnknownIssueErrorMessage();
    }
  }
  async showInvalidSessionErrorMessage() {
    return telemetry_index.withSpan(telemetry_definitions_index.TelemetryNamespace.Auth, "auth-provider.manual-error-resolve", async () => {
      if (this.authErrorMessagePromises.AccessDenied) {
        return this.authErrorMessagePromises.AccessDenied;
      }
      const promise = vscode__namespace.window.showErrorMessage(
        "Could not complete the request because your session is invalid or expired.",
        "Refresh session",
        "Login"
      );
      this.authErrorMessagePromises.AccessDenied = promise;
      let action = await promise;
      if (action === "Refresh session") {
        try {
          await this.refreshToken();
          void vscode__namespace.window.showInformationMessage("Your session was successfully refreshed.");
        } catch (_e) {
          void this.logoutAndForget();
          action = await vscode__namespace.window.showErrorMessage("We are unable to refresh your session.", "Login");
        }
      }
      if (action === "Login") {
        await this.logout();
        this._onDidPerformUserInitiatedLogout.fire();
      }
      this.authErrorMessagePromises.AccessDenied = null;
    });
  }
  async showNetworkIssueErrorMessage() {
    if (this.authErrorMessagePromises.NetworkIssue) {
      return this.authErrorMessagePromises.NetworkIssue;
    }
    const promise = vscode__namespace.window.showErrorMessage(
      "Could not communicate with the service. Please check your network connection.",
      "Dismiss"
    );
    this.authErrorMessagePromises.NetworkIssue = promise;
    await promise;
    this.authErrorMessagePromises.NetworkIssue = null;
  }
  async showUnknownIssueErrorMessage() {
    if (this.authErrorMessagePromises.Unknown) {
      return this.authErrorMessagePromises.Unknown;
    }
    const promise = vscode__namespace.window.showErrorMessage("An unexpected issue occurred.", "Dismiss");
    this.authErrorMessagePromises.Unknown = promise;
    await promise;
    this.authErrorMessagePromises.Unknown = null;
  }
  /**
   * Returns a promise that resolves once the user is logged in
   */
  async waitForSignIn() {
    if (this.isLoggedIn()) {
      return this.storage.readToken();
    }
    if (!this.signInPromise) {
      this.signInPromise = new Promise((resolve) => {
        this.signInDeferred = { resolve };
      }).then((token) => {
        this.signInPromise = void 0;
        this.signInDeferred = void 0;
        return token;
      });
    }
    return this.signInPromise;
  }
}
const PROVIDER_ID = "kiro";
const DEFAULT_USER_FACING_ERROR_MESSAGE = "There was an error signing you in. Please try again.";
const authProvider = new AuthProvider();
const providerLabel = {
  BuilderId: "BuilderId",
  Enterprise: "AWS IAM Identity Center",
  Internal: "Amazon internal (Midway)",
  Github: "GitHub",
  Google: "Google",
  ExternalIdp: "External Identity Provider"
};
class AuthProviderSession {
  account;
  id = PROVIDER_ID;
  scopes = [];
  accessToken = "";
  constructor(provider) {
    this.account = { id: PROVIDER_ID, label: provider ? providerLabel[provider] : "" };
  }
}
class AuthProviderExtension {
  constructor(controller) {
    this.controller = controller;
    this.disposables.push(
      authProvider.onDidChangeLoginStatus(({ token, isSignedIn }) => {
        if (isSignedIn) {
          this._onDidChangeSessions.fire({
            removed: [],
            added: [new AuthProviderSession(token.provider)],
            changed: []
          });
        } else {
          this._onDidChangeSessions.fire({
            removed: [new AuthProviderSession()],
            added: [],
            changed: []
          });
        }
      }),
      authProvider.onDidPerformUserInitiatedLogout(() => {
        this.controller.showSignInPage();
      })
    );
  }
  static name = "Kiro";
  disposables = [];
  _onDidChangeSessions = new vscode__namespace.EventEmitter();
  get onDidChangeSessions() {
    return this._onDidChangeSessions.event;
  }
  dispose() {
    this.disposables.forEach((disposable) => {
      disposable.dispose();
    });
  }
  async getSessions(_scopes, _options) {
    if (authProvider.isLoggedIn()) {
      const token = authProvider.readToken();
      return Promise.resolve([new AuthProviderSession(token.provider)]);
    }
    return Promise.resolve([]);
  }
  async createSession(_scopes, _options) {
    if (authProvider.isLoggedIn()) {
      const token2 = authProvider.readToken();
      return new AuthProviderSession(token2.provider);
    }
    this.controller.showSignInPage();
    const token = await authProvider.waitForSignIn();
    return new AuthProviderSession(token.provider);
  }
  async removeSession(_sessionId) {
    if (!authProvider.isLoggedIn()) {
      return;
    }
    await authProvider.logout();
    this.controller.showSignInPage();
  }
}
class SignInController {
  _onDidReceiveSignInRequest = new vscode__namespace.EventEmitter();
  get onDidReceiveSignInRequest() {
    return this._onDidReceiveSignInRequest.event;
  }
  showSignInPage() {
    this._onDidReceiveSignInRequest.fire();
  }
  async signIn(providerConfiguration) {
    try {
      return await authProvider.authenticateWithOptions(providerConfiguration);
    } catch (error) {
      if (error instanceof ssoOidcClient.AuthError) {
        throw error.toUserFacingError(DEFAULT_USER_FACING_ERROR_MESSAGE);
      }
      throw new ssoOidcClient.UserFacingError(DEFAULT_USER_FACING_ERROR_MESSAGE);
    }
  }
  cancelSignIn() {
    authProvider.cancelSignIn();
  }
}
async function registerAuthProviderExtension(context) {
  const signInController = new SignInController();
  const extensionInstance = new AuthProviderExtension(signInController);
  const authProviderRegistration = vscode__namespace.authentication.registerAuthenticationProvider(
    PROVIDER_ID,
    AuthProviderExtension.name,
    extensionInstance
  );
  const isInternalUser = await errors.isMwinitToolAvailable();
  const signInControllerRegistration = vscode__namespace.authentication.registerSignInController(PROVIDER_ID, signInController, {
    isInternalUser
  });
  context.subscriptions.push(extensionInstance, authProviderRegistration, signInControllerRegistration, authProvider);
}
let cachedFallbackProfileArn;
let inflightFetch;
let fetchCts;
function clearCache() {
  cachedFallbackProfileArn = void 0;
  fetchCts?.cancel();
  fetchCts?.dispose();
  fetchCts = void 0;
  inflightFetch = void 0;
}
const subscription = authProvider.onDidChangeLoginStatus(({ isSignedIn }) => {
  if (!isSignedIn) {
    clearCache();
  }
});
function dispose() {
  subscription.dispose();
  clearCache();
}
async function resolveProfileArn(options) {
  const profileArn = await authProvider.getProfileArn();
  if (profileArn) {
    return profileArn;
  }
  const token = authProvider.readToken();
  if (!token || !externalIdpAuthProvider.supportsProfiles(token)) {
    if (options?.required) {
      throw new Error("profileArn is required but could not be resolved");
    }
    return void 0;
  }
  if (cachedFallbackProfileArn) {
    return cachedFallbackProfileArn;
  }
  if (inflightFetch) {
    const result = await inflightFetch;
    if (options?.required && !result) {
      throw new Error("profileArn is required but could not be resolved");
    }
    return result;
  }
  fetchCts?.cancel();
  fetchCts?.dispose();
  fetchCts = new vscode__namespace.CancellationTokenSource();
  const ct = fetchCts.token;
  inflightFetch = fetchProfileArnFromBackend(ct);
  try {
    const result = await inflightFetch;
    if (options?.required && !result) {
      throw new Error("profileArn is required but could not be resolved");
    }
    return result;
  } finally {
    inflightFetch = void 0;
  }
}
async function fetchProfileArnFromBackend(ct) {
  errors.logger.warn("[ProfileArnGuard] profileArn missing, fetching from ListAvailableProfiles");
  try {
    const { data: profiles } = await vscode__namespace.commands.executeCommand(
      "kiro.profiles.listAvailableProfiles"
    );
    if (ct.isCancellationRequested) {
      return void 0;
    }
    if (!profiles || profiles.length === 0) {
      errors.logger.error("[ProfileArnGuard] No profiles available from ListAvailableProfiles");
      return void 0;
    }
    const firstProfile = profiles[0];
    if (!firstProfile.arn) {
      errors.logger.error("[ProfileArnGuard] First profile has no ARN");
      return void 0;
    }
    if (ct.isCancellationRequested) {
      return void 0;
    }
    cachedFallbackProfileArn = firstProfile.arn;
    await ProfileStorage.getInstance().writeProfile({ arn: firstProfile.arn, name: firstProfile.name });
    if (ct.isCancellationRequested) {
      cachedFallbackProfileArn = void 0;
      return void 0;
    }
    errors.logger.info("[ProfileArnGuard] Fetched profileArn and wrote to ProfileStorage", {
      profileArn: firstProfile.arn
    });
    return firstProfile.arn;
  } catch (error) {
    errors.logger.error("[ProfileArnGuard] Failed to fetch profileArn:", error);
    return void 0;
  }
}
exports.AUTH_CALLBACK_REDIRECT_URI = externalIdpAuthProvider.AUTH_CALLBACK_REDIRECT_URI;
exports.AuthCallbackHandler = externalIdpAuthProvider.AuthCallbackHandler;
exports.authCallbackHandler = externalIdpAuthProvider.authCallbackHandler;
exports.handleProfiles = externalIdpAuthProvider.handleProfiles;
exports.selectOrPromptProfile = externalIdpAuthProvider.selectOrPromptProfile;
exports.supportsProfiles = externalIdpAuthProvider.supportsProfiles;
exports.getAuthErrorPageUrl = authConfig.getAuthErrorPageUrl;
exports.getAuthPortalUrl = authConfig.getAuthPortalUrl;
exports.getAuthSuccessPageUrl = authConfig.getAuthSuccessPageUrl;
exports.AbandonedError = ssoOidcClient.AbandonedError;
exports.AccessDeniedError = ssoOidcClient.AccessDeniedError;
exports.AuthError = ssoOidcClient.AuthError;
exports.AuthErrorType = ssoOidcClient.AuthErrorType;
exports.AuthProviderDeniedAccess = ssoOidcClient.AuthProviderDeniedAccess;
exports.AuthProviderFailure = ssoOidcClient.AuthProviderFailure;
exports.CanceledError = ssoOidcClient.CanceledError;
exports.FailedToConnectError = ssoOidcClient.FailedToConnectError;
exports.FileSystemAccessError = ssoOidcClient.FileSystemAccessError;
exports.InvalidAuthError = ssoOidcClient.InvalidAuthError;
exports.InvalidIdCAuthError = ssoOidcClient.InvalidIdCAuthError;
exports.InvalidInvitationCodeError = ssoOidcClient.InvalidInvitationCodeError;
exports.InvalidSSOAuthError = ssoOidcClient.InvalidSSOAuthError;
exports.InvalidStartUrlError = ssoOidcClient.InvalidStartUrlError;
exports.InvalidStateError = ssoOidcClient.InvalidStateError;
exports.InvalidUserInputError = ssoOidcClient.InvalidUserInputError;
exports.MalformedTokenError = ssoOidcClient.MalformedTokenError;
exports.MissingCodeError = ssoOidcClient.MissingCodeError;
exports.MissingPortError = ssoOidcClient.MissingPortError;
exports.MissingStateError = ssoOidcClient.MissingStateError;
exports.MissingTokenError = ssoOidcClient.MissingTokenError;
exports.NetworkIssueError = ssoOidcClient.NetworkIssueError;
exports.SSOInvalidStateError = ssoOidcClient.SSOInvalidStateError;
exports.SSOMissingCodeError = ssoOidcClient.SSOMissingCodeError;
exports.SSOMissingStateError = ssoOidcClient.SSOMissingStateError;
exports.SSORedirectTimeoutError = ssoOidcClient.SSORedirectTimeoutError;
exports.ServerIssueError = ssoOidcClient.ServerIssueError;
exports.ServerListenError = ssoOidcClient.ServerListenError;
exports.ServerTimeoutError = ssoOidcClient.ServerTimeoutError;
exports.SignInBlockedError = ssoOidcClient.SignInBlockedError;
exports.SymlinkDetectedError = ssoOidcClient.SymlinkDetectedError;
exports.UnexpectedIssueError = ssoOidcClient.UnexpectedIssueError;
exports.UserEnvironmentError = ssoOidcClient.UserEnvironmentError;
exports.UserFacingError = ssoOidcClient.UserFacingError;
exports.getUnknownErrorDetails = ssoOidcClient.getUnknownErrorDetails;
exports.isBadAuthIssue = ssoOidcClient.isBadAuthIssue;
exports.TrustedError = errors.TrustedError;
exports.isAbortError = errors.isAbortError;
exports.isBlockedAccessError = errors.isBlockedAccessError;
exports.logOutputChannels = errors.logOutputChannels;
exports.logger = errors.logger;
exports.mapUnknownToErrorType = errors.mapUnknownToErrorType;
exports.mcpLogger = errors.mcpLogger;
exports.powersLogger = errors.powersLogger;
exports.APPLICATION_NAME = telemetry_definitions_index.APPLICATION_NAME;
exports.APPLICATION_VERSION = telemetry_definitions_index.APPLICATION_VERSION;
exports.ContextPropagation = telemetry_definitions_index.ContextPropagation;
exports.Feature = telemetry_definitions_index.Feature;
exports.MetricNamespace = telemetry_definitions_index.MetricNamespace;
exports.MetricReporter = telemetry_definitions_index.MetricReporter;
exports.Telemetry = telemetry_definitions_index.Telemetry;
exports.clearUserId = telemetry_definitions_index.clearUserId;
exports.deriveUserCohort = telemetry_definitions_index.deriveUserCohort;
exports.getContentCollectionOptIn = telemetry_definitions_index.getContentCollectionOptIn;
exports.getUserCohort = telemetry_definitions_index.getUserCohort;
exports.getUserId = telemetry_definitions_index.getUserId;
exports.initializeBaggagePropagation = telemetry_definitions_index.initializeBaggagePropagation;
exports.initializeTelemetry = telemetry_definitions_index.initializeTelemetry;
exports.isInitialized = telemetry_definitions_index.isInitialized;
exports.recordBashToolEvent = telemetry_definitions_index.recordBashToolEvent;
exports.setUserId = telemetry_definitions_index.setUserId;
exports.JourneyTracker = telemetry_index.JourneyTracker;
exports.Metrics = telemetry_index.Metrics;
exports.ToolUsage = telemetry_index.ToolUsage;
exports.createCounter = telemetry_index.createCounter;
exports.createHistogram = telemetry_index.createHistogram;
exports.getJourneyTracker = telemetry_index.getJourneyTracker;
exports.recordChatWebviewEvent = telemetry_index.recordChatWebviewEvent;
exports.recordMcpRegistryEvent = telemetry_index.recordMcpRegistryEvent;
exports.recordMcpRegistryHistogram = telemetry_index.recordMcpRegistryHistogram;
exports.recordMcpRegistryOutcome = telemetry_index.recordMcpRegistryOutcome;
exports.recordPlatformEvent = telemetry_index.recordPlatformEvent;
exports.recordPowersEvent = telemetry_index.recordPowersEvent;
exports.recordPowersHistogram = telemetry_index.recordPowersHistogram;
exports.recordProfileStorageEvent = telemetry_index.recordProfileStorageEvent;
exports.startActiveSpan = telemetry_index.startActiveSpan;
exports.withSpan = telemetry_index.withSpan;
exports.MCPConnection = mcpManager.MCPConnection;
exports.MCPJsonConfigSchema = mcpManager.MCPJsonConfigSchema;
exports.MCPManagerSingleton = mcpManager.MCPManagerSingleton;
exports.MCPOptionsSchema = mcpManager.MCPOptionsSchema;
exports.OAuthConfigSchema = mcpManager.OAuthConfigSchema;
exports.addMCPServerConfig = mcpManager.addMCPServerConfig;
exports.addMCPToolToAutoApproveConfig = mcpManager.addMCPToolToAutoApproveConfig;
exports.clientCapabilityEvents = mcpManager.clientCapabilityEvents;
exports.deepValidateMCPServerOptions = mcpManager.deepValidateMCPServerOptions;
exports.disableMCPTools = mcpManager.disableMCPTools;
exports.enableMCPTools = mcpManager.enableMCPTools;
exports.expandEnvironmentVariables = mcpManager.expandEnvironmentVariables;
exports.findConfigFileForServer = mcpManager.findConfigFileForServer;
exports.formatToolName = mcpManager.formatToolName;
exports.isHttpsOrLocalhost = mcpManager.isHttpsOrLocalhost;
exports.loadMcpConfig = mcpManager.loadMcpConfig;
exports.mcpServerSources = mcpManager.mcpServerSources;
exports.parseRedirectPort = mcpManager.parseRedirectPort;
exports.resetApprovedEnvVars = mcpManager.resetApprovedEnvVars;
exports.serverCapabilityEvents = mcpManager.serverCapabilityEvents;
exports.setMCPServerDisabled = mcpManager.setMCPServerDisabled;
exports.KeyValueInputSchema = resolveRegistryEntries.KeyValueInputSchema;
exports.PackageRegistryTypeSchema = resolveRegistryEntries.PackageRegistryTypeSchema;
exports.PackageSchema = resolveRegistryEntries.PackageSchema;
exports.PositionalArgumentSchema = resolveRegistryEntries.PositionalArgumentSchema;
exports.RegistryJsonSchema = resolveRegistryEntries.RegistryJsonSchema;
exports.RegistryServerConfigEntrySchema = resolveRegistryEntries.RegistryServerConfigEntrySchema;
exports.RegistryStore = resolveRegistryEntries.RegistryStore;
exports.RemoteTransportSchema = resolveRegistryEntries.RemoteTransportSchema;
exports.ServerDetailSchema = resolveRegistryEntries.ServerDetailSchema;
exports.SseTransportSchema = resolveRegistryEntries.SseTransportSchema;
exports.StdioTransportSchema = resolveRegistryEntries.StdioTransportSchema;
exports.StreamableHttpTransportSchema = resolveRegistryEntries.StreamableHttpTransportSchema;
exports.TransportSchema = resolveRegistryEntries.TransportSchema;
exports.VERSION_RANGE_PATTERN = resolveRegistryEntries.VERSION_RANGE_PATTERN;
exports.deriveCommandFromPackage = resolveRegistryEntries.deriveCommandFromPackage;
exports.getServerKind = resolveRegistryEntries.getServerKind;
exports.isVersionRange = resolveRegistryEntries.isVersionRange;
exports.keyValueArrayToRecord = resolveRegistryEntries.keyValueArrayToRecord;
exports.keyValueRecordToArray = resolveRegistryEntries.keyValueRecordToArray;
exports.resolveRegistryEntries = resolveRegistryEntries.resolveRegistryEntries;
exports.uriEventHandler = uri.uriEventHandler;
exports.getActiveMcpConfigLocation = paths.getActiveMcpConfigLocation;
exports.getHomeKiroPath = paths.getHomeKiroPath;
exports.getWorkspaceKiroPath = paths.getWorkspaceKiroPath;
exports.IntervalTimer = timer.IntervalTimer;
exports.addAgentModeHeadersMiddleware = timer.addAgentModeHeadersMiddleware;
exports.addExternalIdpTokenTypeMiddleware = timer.addExternalIdpTokenTypeMiddleware;
exports.addPrivacyHeadersMiddleware = timer.addPrivacyHeadersMiddleware;
exports.addRedirectForInternalMiddleware = timer.addRedirectForInternalMiddleware;
exports.updateResolvedIDESetting = timer.updateResolvedIDESetting;
exports.getMachineId = machineId.getMachineId;
Object.defineProperty(exports, "Tool", {
  enumerable: true,
  get: () => agent.Tool
});
Object.defineProperty(exports, "ToolRecorder", {
  enumerable: true,
  get: () => agent.ToolRecorder
});
Object.defineProperty(exports, "initializeToolCounters", {
  enumerable: true,
  get: () => agent.initializeToolCounters
});
exports.AuthProvider = AuthProvider;
exports.ProfileStorage = ProfileStorage;
exports.authProvider = authProvider;
exports.dispose = dispose;
exports.providerLabel = providerLabel;
exports.registerAuthProviderExtension = registerAuthProviderExtension;
exports.registerProfileStorage = registerProfileStorage;
exports.resolveProfileArn = resolveProfileArn;
