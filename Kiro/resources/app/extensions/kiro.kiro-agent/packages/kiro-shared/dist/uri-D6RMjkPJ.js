import * as vscode from "vscode";
class UriEventHandler {
  _onUri = new vscode.EventEmitter();
  onUri = this._onUri.event;
  /**
   * Register uri handler
   * @param context
   */
  register(context) {
    const disposable = vscode.window.registerUriHandler(this);
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
export {
  uriEventHandler as u
};
