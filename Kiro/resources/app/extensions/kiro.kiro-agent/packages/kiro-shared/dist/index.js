import { E as ExternalIdpAuthProvider, S as SocialAuthProvider, I as IDCAuthProvider, s as supportsProfiles } from "./external-idp-auth-provider-CKfJzuSE.js";
import { A, a, b, h, c } from "./external-idp-auth-provider-CKfJzuSE.js";
import { a as a2, b as b2, g } from "./auth-config-BMjEljVD.js";
import { F as FileSystemAccessError, l as SymlinkDetectedError, j as isBadAuthIssue, m as MissingTokenError, n as MalformedTokenError, o as InvalidAuthError, U as UnexpectedIssueError, g as SignInBlockedError, C as CanceledError, f as AbandonedError, h as InvalidUserInputError, p as AccessDeniedError, q as InvalidSSOAuthError, r as InvalidIdCAuthError, N as NetworkIssueError, s as AuthError, t as UserFacingError } from "./sso-oidc-client-DdDU-AJU.js";
import { u, c as c2, d, v, w, x, I, k, M, e, y, z, B, D, E, a as a3, b as b3, i, G } from "./sso-oidc-client-DdDU-AJU.js";
import * as vscode from "vscode";
import { b as logger, d as isMwinitToolAvailable } from "./errors-BVoUlRsM.js";
import { T, i as i2, a as a4, l, m, c as c3, p } from "./errors-BVoUlRsM.js";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import "node-machine-id";
import { MetricReporter, T as TelemetryNamespace, c as clearUserId, r as recordOnboardingStep, a as recordAuthFromSource } from "./telemetry/definitions/index.js";
import { A as A2, b as b4, C, Feature, M as M2, Telemetry, deriveUserCohort, getContentCollectionOptIn, getUserCohort, g as g2, i as i3, d as d2, e as e2, f, s } from "./telemetry/definitions/index.js";
import "http";
import { recordProfileStorageEvent, withSpan } from "./telemetry/index.js";
import { JourneyTracker, Metrics, ToolUsage, createCounter, createHistogram, getJourneyTracker, recordChatWebviewEvent, recordMcpRegistryEvent, recordMcpRegistryHistogram, recordMcpRegistryOutcome, recordPlatformEvent, recordPowersEvent, recordPowersHistogram, startActiveSpan } from "./telemetry/index.js";
import { P as PortalAuthProvider, g as getTraceConfig } from "./portal-auth-provider-05V8tEnl.js";
import { Sema } from "async-sema";
import { M as M3, a as a5, b as b5, c as c4, O, d as d3, e as e3, f as f2, g as g3, h as h2, i as i4, j, k as k2, l as l2, m as m2, n, o, p as p2, r, s as s2, q } from "./mcp-manager-BZIncIx4.js";
import { K, P, a as a6, b as b6, R, c as c5, d as d4, e as e4, S, f as f3, g as g4, h as h3, T as T2, V, i as i5, j as j2, k as k3, l as l3, m as m3, r as r2 } from "./resolve-registry-entries-DSUmtYNT.js";
import { u as u2 } from "./uri-D6RMjkPJ.js";
import { g as g5, a as a7, b as b7 } from "./paths-D3AmlBbI.js";
import { I as I2, a as a8, b as b8, c as c6, d as d5, u as u3 } from "./timer-CqHqBu2J.js";
import { g as g6 } from "./machine-id-DDyBZGvP.js";
import { Tool, ToolRecorder, initializeToolCounters } from "@kiro/agent";
const KIRO_AUTH_TOKEN_FILE_NAME = "kiro-auth-token.json";
const SOCIAL_PROVIDERS = ["Google", "Github"];
const IDC_PROVIDERS = ["Enterprise", "BuilderId", "Internal"];
class TokenStorage {
  tokenCache;
  cacheDirectory = path.join(os.homedir(), ".aws", "sso", "cache");
  _onDidChange = new vscode.EventEmitter();
  watchListener;
  constructor() {
    this.watchListener = () => {
      try {
        const oldToken = this.tokenCache;
        this.clearCache();
        const newToken = this.readTokenFromDisk();
        this._onDidChange.fire({ oldToken, newToken });
      } catch (e5) {
        logger.error("Token file watcher error: %s", e5);
      }
    };
    const tokenPath = this.getAuthTokenPath();
    this.assertNotSymlink(tokenPath);
    fs.watchFile(tokenPath, this.watchListener);
  }
  /**
   * Cleans up internal state
   */
  dispose() {
    fs.unwatchFile(this.getAuthTokenPath(), this.watchListener);
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
    return path.join(this.cacheDirectory, KIRO_AUTH_TOKEN_FILE_NAME);
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
   * Checks that the given path is not a symbolic link.
   * Prevents symlink-based credential theft (CWE-59) where an attacker
   * pre-places a symlink to redirect token writes to an attacker-controlled location.
   */
  assertNotSymlink(filePath) {
    let stat;
    try {
      stat = fs.lstatSync(filePath);
    } catch (e5) {
      if (e5.code === "ENOENT") {
        return;
      }
      throw new FileSystemAccessError(filePath, e5);
    }
    if (stat.isSymbolicLink()) {
      logger.error("Security: symbolic link detected at token storage path: %s", filePath);
      throw new SymlinkDetectedError(filePath);
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
      fs.writeFileSync(tokenPath, JSON.stringify(token, void 0, 2), { mode: 384 });
      fs.chmodSync(tokenPath, 384);
    } catch (_e) {
      throw new FileSystemAccessError(tokenPath);
    }
  }
  clearCache() {
    this.tokenCache = void 0;
  }
  readTokenFromDisk() {
    const tokenPath = this.getAuthTokenPath();
    this.assertNotSymlink(tokenPath);
    if (fs.existsSync(tokenPath)) {
      try {
        const cacheContents = fs.readFileSync(tokenPath, "utf8");
        try {
          return JSON.parse(cacheContents);
        } catch (e5) {
          logger.error("Error trying to parse the token file.", e5);
          return void 0;
        }
      } catch (_e) {
        throw new FileSystemAccessError(tokenPath);
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
      if (fs.existsSync(tokenPath)) {
        fs.unlinkSync(tokenPath);
      }
    } catch (_e) {
      throw new FileSystemAccessError(tokenPath);
    }
    this._onDidChange.fire({ oldToken, newToken: void 0 });
  }
}
class ProfileStorage {
  static instance;
  profileUri;
  PROFILE_FILE_NAME = "profile.json";
  // avoid profile reads running concurrently with writes/deletion
  profileAccessSemaphore = new Sema(1);
  constructor(context) {
    this.profileUri = vscode.Uri.joinPath(context.globalStorageUri, this.PROFILE_FILE_NAME);
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
      await this.ensureDirectoryExists(vscode.Uri.joinPath(this.profileUri, ".."));
      const jsonContent = JSON.stringify(profile, null, 2);
      const content = new TextEncoder().encode(jsonContent);
      await vscode.workspace.fs.writeFile(this.profileUri, content);
      recordProfileStorageEvent("writeProfile", true);
    } catch (error) {
      recordProfileStorageEvent("writeProfile", false, "fileSystemError");
      logger.error("[ProfileStorage] Failed to write profile", { error });
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
      const fileContent = await vscode.workspace.fs.readFile(this.profileUri);
      const fileText = new TextDecoder().decode(fileContent);
      const parsedData = JSON.parse(fileText);
      if (this.validateProfile(parsedData)) {
        recordProfileStorageEvent("readProfile", true);
        return parsedData;
      } else {
        recordProfileStorageEvent("readProfile", false, "invalidData");
        logger.error("[ProfileStorage] Invalid profile data structure in storage file");
        return void 0;
      }
    } catch (error) {
      let errorType = "unknown";
      if (error instanceof vscode.FileSystemError && error.code === "FileNotFound") {
        errorType = "fileNotFound";
      } else if (error instanceof SyntaxError) {
        errorType = "parseError";
      } else {
        errorType = "fileSystemError";
      }
      recordProfileStorageEvent("readProfile", false, errorType);
      logger.error("[ProfileStorage] Error reading profile", { error });
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
      await vscode.workspace.fs.delete(this.profileUri);
      recordProfileStorageEvent("deleteProfile", true);
    } catch (error) {
      if (error instanceof vscode.FileSystemError && error.code === "FileNotFound") {
        recordProfileStorageEvent("deleteProfile", true);
        return;
      }
      recordProfileStorageEvent("deleteProfile", false, "fileSystemError");
      logger.error("[ProfileStorage] Error deleting profile", { error });
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
      await vscode.workspace.fs.createDirectory(dirUri);
    } catch (error) {
      if (error instanceof vscode.FileSystemError && error.code === "FileExists") {
        return;
      }
      logger.error("[ProfileStorage] Failed to create directory", { dirUri: dirUri.toString(), error });
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
const Metrics2 = new MetricReporter(TelemetryNamespace.Auth, "auth-provider");
function translateError(error) {
  return error instanceof AuthError ? error : new UnexpectedIssueError("Auth provider: unexpected issue");
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
  _onDidChangeLoginStatus = new vscode.EventEmitter();
  _onDidPerformUserInitiatedLogout = new vscode.EventEmitter();
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
      IdC: new IDCAuthProvider(),
      social: new SocialAuthProvider(),
      external_idp: new ExternalIdpAuthProvider()
    };
    this.portalProvider = new PortalAuthProvider();
    if (vscode.window.state.focused) {
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
      vscode.window.onDidChangeWindowState((event) => {
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
        logger.info(
          "Auth refresh loop: token close to expiry, attempting refresh - provider: %s, authMethod: %s, expiresAt: %s",
          token.provider,
          token.authMethod,
          token.expiresAt
        );
        await withSpan(TelemetryNamespace.Auth, "auth-provider.scheduled-refresh", () => {
          return this.refreshToken();
        });
        logger.info("Auth refresh loop: refresh completed successfully");
      }
    } catch (error) {
      logger.error("Auth refresh loop: refresh failed, will retry next loop - error: %s", error);
      const token = this.storage.readToken();
      if (isBadAuthIssue(error) && token && this.isAuthTokenExpiredWithinSeconds(token, AUTH_TOKEN_INVALIDATION_OFFSET_SECONDS)) {
        logger.warn("Auth refresh loop: bad auth issue and token near expiry, logging out");
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
        throw new MissingTokenError("No valid token found");
      }
      if (!this.isAuthTokenExpired(token)) {
        return token;
      }
      if (token.refreshToken && attemptRefresh) {
        return await withSpan(TelemetryNamespace.Auth, "auth-provider.getTokenData", async () => {
          await this.refreshToken();
          return await this.getTokenData({ attemptRefresh: false });
        });
      }
      throw new MalformedTokenError("No valid token found");
    } catch (error) {
      if (isBadAuthIssue(error)) {
        void this.logoutAndForget();
      }
      logger.error("Failed to retrieve auth token:", error);
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
    return Metrics2.withTrace(getTraceConfig("logout", token.provider), async (span) => {
      span.setAttribute("authProvider", token.provider);
      try {
        this.storage.clearToken();
        await ProfileStorage.getInstance().deleteProfile();
        const provider = this.providers[token.authMethod];
        await provider.logout(token);
        clearUserId();
      } catch (e5) {
        logger.error("Failed to logout:", e5);
        throw translateError(e5);
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
      throw new InvalidAuthError("Not logged in");
    }
    const token = this.storage.readToken();
    if (!token) {
      throw new MissingTokenError("No token available");
    }
    return Metrics2.withTrace(getTraceConfig("deleteAccount", token.provider), async (span) => {
      span.setAttribute("authProvider", token.provider);
      const provider = this.providers[token.authMethod];
      try {
        await provider.deleteAccount(token);
        this.storage.clearToken();
        clearUserId();
        this._onDidPerformUserInitiatedLogout.fire();
      } catch (e5) {
        logger.error("Failed to delete account:", e5);
        throw translateError(e5);
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
      throw new InvalidAuthError("No valid refresh token found");
    }
    return Metrics2.withTrace(getTraceConfig("refreshToken", token.provider), async (span) => {
      span.setAttribute("authProvider", token.provider);
      try {
        const provider = this.providers[token.authMethod];
        const newToken = await provider.refreshToken(token);
        if (this.storage.readToken()?.refreshToken === token.refreshToken) {
          this.storage.writeToken(newToken);
        }
      } catch (e5) {
        logger.error("Failed to refresh token:", e5);
        throw e5;
      }
    });
  }
  async openInternalLink(path2) {
    const callbackUri = await vscode.env.asExternalUri(
      vscode.Uri.parse(`${vscode.env.uriScheme}://kiro.kiroAgent${path2}`)
    );
    await vscode.env.openExternal(callbackUri);
  }
  /**
   * Authenticates the user via the unified auth portal.
   * All authentication now goes through app.kiro.dev/signin.
   */
  async authenticateWithOptions(options) {
    recordOnboardingStep("started-login");
    if (options.authMethod !== "portal") {
      throw new UnexpectedIssueError("Only portal authentication is supported");
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
      const result = await Metrics2.withTrace(
        getTraceConfig("authenticate", "unknown"),
        () => this.portalProvider.authenticate()
      );
      const token = await this.processPortalResult(result);
      this.storage.writeToken(token);
      try {
        await this.openInternalLink("/did-authenticate");
      } catch (e5) {
        logger.warn("Failed to open internal link after authentication:", e5);
      }
      recordOnboardingStep("finished-login");
      const authSource = this.getAuthSourceFromPortalResult(result);
      recordAuthFromSource(authSource);
    } catch (error) {
      if (error instanceof SignInBlockedError) {
        logger.info("Sign-in temporarily not allowed");
      } else if (error instanceof CanceledError) {
        logger.info("Authentication canceled");
        recordOnboardingStep("canceled-login");
      } else if (error instanceof AbandonedError) {
        logger.info("Authentication timed out");
        recordOnboardingStep("abandoned-login");
      } else if (error instanceof InvalidUserInputError) {
        logger.error("Authentication failed due to bad user input:", error);
        recordOnboardingStep("bad-user-input");
      } else {
        logger.error("Authentication failed:", error);
        recordOnboardingStep("failed-login");
        void vscode.window.showErrorMessage("Failed to authenticate with Kiro.");
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
      return Metrics2.withTrace(getTraceConfig("authenticate", "ExternalIdp"), () => {
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
    return Metrics2.withTrace(getTraceConfig("authenticate", provider), () => {
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
    if (error instanceof AccessDeniedError || error instanceof MissingTokenError || error instanceof MalformedTokenError || error instanceof InvalidAuthError || error instanceof InvalidSSOAuthError || error instanceof InvalidIdCAuthError) {
      return this.showInvalidSessionErrorMessage();
    } else if (error instanceof NetworkIssueError) {
      return this.showNetworkIssueErrorMessage();
    } else {
      return this.showUnknownIssueErrorMessage();
    }
  }
  async showInvalidSessionErrorMessage() {
    return withSpan(TelemetryNamespace.Auth, "auth-provider.manual-error-resolve", async () => {
      if (this.authErrorMessagePromises.AccessDenied) {
        return this.authErrorMessagePromises.AccessDenied;
      }
      const promise = vscode.window.showErrorMessage(
        "Could not complete the request because your session is invalid or expired.",
        "Refresh session",
        "Login"
      );
      this.authErrorMessagePromises.AccessDenied = promise;
      let action = await promise;
      if (action === "Refresh session") {
        try {
          await this.refreshToken();
          void vscode.window.showInformationMessage("Your session was successfully refreshed.");
        } catch (_e) {
          void this.logoutAndForget();
          action = await vscode.window.showErrorMessage("We are unable to refresh your session.", "Login");
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
    const promise = vscode.window.showErrorMessage(
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
    const promise = vscode.window.showErrorMessage("An unexpected issue occurred.", "Dismiss");
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
  _onDidChangeSessions = new vscode.EventEmitter();
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
  _onDidReceiveSignInRequest = new vscode.EventEmitter();
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
      if (error instanceof AuthError) {
        throw error.toUserFacingError(DEFAULT_USER_FACING_ERROR_MESSAGE);
      }
      throw new UserFacingError(DEFAULT_USER_FACING_ERROR_MESSAGE);
    }
  }
  cancelSignIn() {
    authProvider.cancelSignIn();
  }
}
async function registerAuthProviderExtension(context) {
  const signInController = new SignInController();
  const extensionInstance = new AuthProviderExtension(signInController);
  const authProviderRegistration = vscode.authentication.registerAuthenticationProvider(
    PROVIDER_ID,
    AuthProviderExtension.name,
    extensionInstance
  );
  const isInternalUser = await isMwinitToolAvailable();
  const signInControllerRegistration = vscode.authentication.registerSignInController(PROVIDER_ID, signInController, {
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
  if (!token || !supportsProfiles(token)) {
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
  fetchCts = new vscode.CancellationTokenSource();
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
  logger.warn("[ProfileArnGuard] profileArn missing, fetching from ListAvailableProfiles");
  try {
    const { data: profiles } = await vscode.commands.executeCommand(
      "kiro.profiles.listAvailableProfiles"
    );
    if (ct.isCancellationRequested) {
      return void 0;
    }
    if (!profiles || profiles.length === 0) {
      logger.error("[ProfileArnGuard] No profiles available from ListAvailableProfiles");
      return void 0;
    }
    const firstProfile = profiles[0];
    if (!firstProfile.arn) {
      logger.error("[ProfileArnGuard] First profile has no ARN");
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
    logger.info("[ProfileArnGuard] Fetched profileArn and wrote to ProfileStorage", {
      profileArn: firstProfile.arn
    });
    return firstProfile.arn;
  } catch (error) {
    logger.error("[ProfileArnGuard] Failed to fetch profileArn:", error);
    return void 0;
  }
}
export {
  A2 as APPLICATION_NAME,
  b4 as APPLICATION_VERSION,
  A as AUTH_CALLBACK_REDIRECT_URI,
  AbandonedError,
  AccessDeniedError,
  a as AuthCallbackHandler,
  AuthError,
  u as AuthErrorType,
  AuthProvider,
  c2 as AuthProviderDeniedAccess,
  d as AuthProviderFailure,
  CanceledError,
  C as ContextPropagation,
  v as FailedToConnectError,
  Feature,
  FileSystemAccessError,
  I2 as IntervalTimer,
  InvalidAuthError,
  InvalidIdCAuthError,
  w as InvalidInvitationCodeError,
  InvalidSSOAuthError,
  x as InvalidStartUrlError,
  I as InvalidStateError,
  InvalidUserInputError,
  JourneyTracker,
  K as KeyValueInputSchema,
  M3 as MCPConnection,
  a5 as MCPJsonConfigSchema,
  b5 as MCPManagerSingleton,
  c4 as MCPOptionsSchema,
  MalformedTokenError,
  M2 as MetricNamespace,
  MetricReporter,
  Metrics,
  k as MissingCodeError,
  M as MissingPortError,
  e as MissingStateError,
  MissingTokenError,
  NetworkIssueError,
  O as OAuthConfigSchema,
  P as PackageRegistryTypeSchema,
  a6 as PackageSchema,
  b6 as PositionalArgumentSchema,
  ProfileStorage,
  R as RegistryJsonSchema,
  c5 as RegistryServerConfigEntrySchema,
  d4 as RegistryStore,
  e4 as RemoteTransportSchema,
  y as SSOInvalidStateError,
  z as SSOMissingCodeError,
  B as SSOMissingStateError,
  D as SSORedirectTimeoutError,
  S as ServerDetailSchema,
  E as ServerIssueError,
  a3 as ServerListenError,
  b3 as ServerTimeoutError,
  SignInBlockedError,
  f3 as SseTransportSchema,
  g4 as StdioTransportSchema,
  h3 as StreamableHttpTransportSchema,
  SymlinkDetectedError,
  Telemetry,
  Tool,
  ToolRecorder,
  ToolUsage,
  T2 as TransportSchema,
  T as TrustedError,
  UnexpectedIssueError,
  i as UserEnvironmentError,
  UserFacingError,
  V as VERSION_RANGE_PATTERN,
  a8 as addAgentModeHeadersMiddleware,
  b8 as addExternalIdpTokenTypeMiddleware,
  d3 as addMCPServerConfig,
  e3 as addMCPToolToAutoApproveConfig,
  c6 as addPrivacyHeadersMiddleware,
  d5 as addRedirectForInternalMiddleware,
  b as authCallbackHandler,
  authProvider,
  clearUserId,
  f2 as clientCapabilityEvents,
  createCounter,
  createHistogram,
  g3 as deepValidateMCPServerOptions,
  i5 as deriveCommandFromPackage,
  deriveUserCohort,
  h2 as disableMCPTools,
  dispose,
  i4 as enableMCPTools,
  j as expandEnvironmentVariables,
  k2 as findConfigFileForServer,
  l2 as formatToolName,
  g5 as getActiveMcpConfigLocation,
  a2 as getAuthErrorPageUrl,
  b2 as getAuthPortalUrl,
  g as getAuthSuccessPageUrl,
  getContentCollectionOptIn,
  a7 as getHomeKiroPath,
  getJourneyTracker,
  g6 as getMachineId,
  j2 as getServerKind,
  G as getUnknownErrorDetails,
  getUserCohort,
  g2 as getUserId,
  b7 as getWorkspaceKiroPath,
  h as handleProfiles,
  i3 as initializeBaggagePropagation,
  d2 as initializeTelemetry,
  initializeToolCounters,
  i2 as isAbortError,
  isBadAuthIssue,
  a4 as isBlockedAccessError,
  m2 as isHttpsOrLocalhost,
  e2 as isInitialized,
  k3 as isVersionRange,
  l3 as keyValueArrayToRecord,
  m3 as keyValueRecordToArray,
  n as loadMcpConfig,
  l as logOutputChannels,
  logger,
  m as mapUnknownToErrorType,
  c3 as mcpLogger,
  o as mcpServerSources,
  p2 as parseRedirectPort,
  p as powersLogger,
  providerLabel,
  f as recordBashToolEvent,
  recordChatWebviewEvent,
  recordMcpRegistryEvent,
  recordMcpRegistryHistogram,
  recordMcpRegistryOutcome,
  recordPlatformEvent,
  recordPowersEvent,
  recordPowersHistogram,
  recordProfileStorageEvent,
  registerAuthProviderExtension,
  registerProfileStorage,
  r as resetApprovedEnvVars,
  resolveProfileArn,
  r2 as resolveRegistryEntries,
  c as selectOrPromptProfile,
  s2 as serverCapabilityEvents,
  q as setMCPServerDisabled,
  s as setUserId,
  startActiveSpan,
  supportsProfiles,
  u3 as updateResolvedIDESetting,
  u2 as uriEventHandler,
  withSpan
};
