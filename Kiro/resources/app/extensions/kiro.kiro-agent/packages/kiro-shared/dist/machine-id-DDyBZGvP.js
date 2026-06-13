import * as vscode from "vscode";
import { machineIdSync } from "node-machine-id";
const DEFAULT_MACHINE_ID = "UNDETERMINED_MACHINE_ID";
function getMachineId() {
  try {
    return machineIdSync();
  } catch (_e) {
    return vscode.env.machineId || DEFAULT_MACHINE_ID;
  }
}
export {
  getMachineId as g
};
