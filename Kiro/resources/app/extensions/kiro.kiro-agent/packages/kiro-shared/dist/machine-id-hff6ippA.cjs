"use strict";
const vscode = require("vscode");
const nodeMachineId = require("node-machine-id");
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
const DEFAULT_MACHINE_ID = "UNDETERMINED_MACHINE_ID";
function getMachineId() {
  try {
    return nodeMachineId.machineIdSync();
  } catch (_e) {
    return vscode__namespace.env.machineId || DEFAULT_MACHINE_ID;
  }
}
exports.getMachineId = getMachineId;
