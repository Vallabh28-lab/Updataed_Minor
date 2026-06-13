"use strict";
const vscode = require("vscode");
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
class UriEventHandler {
  _onUri = new vscode__namespace.EventEmitter();
  onUri = this._onUri.event;
  /**
   * Register uri handler
   * @param context
   */
  register(context) {
    const disposable = vscode__namespace.window.registerUriHandler(this);
    context.subscriptions.push(disposable);
  }
  /**
   * Called by IDE when a URI targeting this extension is opened.
   */
  handleUri(uri) {
    this._onUri.fire(uri);
  }
  /**
   * Dispose this object and free resources.
   */
  dispose() {
    this._onUri.dispose();
  }
}
const uriEventHandler = new UriEventHandler();
exports.uriEventHandler = uriEventHandler;
