import * as path from "path";
import * as os from "os";
import * as fs from "fs";
function getHomeKiroPath() {
  const homePath = os.homedir();
  return path.join(homePath, ".kiro");
}
function getWorkspaceKiroPath(workspaceDir) {
  return path.join(workspaceDir, ".kiro");
}
function getActiveMcpConfigLocation(workspaceDirs) {
  const workspaceConfigPaths = [];
  let userConfigPath;
  if (workspaceDirs && workspaceDirs.length > 0) {
    for (const workspaceDir of workspaceDirs) {
      const workspacePath = path.join(getWorkspaceKiroPath(workspaceDir), "settings", "mcp.json");
      if (fs.existsSync(workspacePath)) {
        workspaceConfigPaths.push(workspacePath);
      }
    }
  }
  const kiroHomePath = getHomeKiroPath();
  if (kiroHomePath) {
    const homePath = path.join(kiroHomePath, "settings", "mcp.json");
    if (fs.existsSync(homePath)) {
      userConfigPath = homePath;
    }
  }
  return {
    workspaceConfigPaths,
    userConfigPath
  };
}
export {
  getHomeKiroPath as a,
  getWorkspaceKiroPath as b,
  getActiveMcpConfigLocation as g
};
