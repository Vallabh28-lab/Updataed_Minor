import * as vscode from "vscode";
import { EventEmitter } from "vscode";
import require$$2 from "path";
import { MetricReporter, Feature, getMachineId, updateResolvedIDESetting, authProvider, addPrivacyHeadersMiddleware, addAgentModeHeadersMiddleware, addExternalIdpTokenTypeMiddleware, addRedirectForInternalMiddleware, resolveProfileArn, AccessDeniedError } from "@kiro/shared";
import { TelemetryNamespace } from "@kiro/shared-types";
import "node:fs";
import * as path from "node:path";
import { CodeWhispererRuntime, GenerateCompletionsCommand, AccessDeniedException, ThrottlingException, ValidationException } from "@amzn/codewhisperer-runtime";
import * as https from "https";
import https__default from "https";
import require$$0$1 from "os";
import require$$1$1 from "fs";
import require$$1 from "child_process";
import require$$4 from "util";
import require$$6 from "http";
import require$$0$2 from "net";
var byteToHex = [];
for (var i = 0; i < 256; ++i)
  byteToHex.push((i + 256).toString(16).slice(1));
function unsafeStringify(s, e = 0) {
  return (byteToHex[s[e + 0]] + byteToHex[s[e + 1]] + byteToHex[s[e + 2]] + byteToHex[s[e + 3]] + "-" + byteToHex[s[e + 4]] + byteToHex[s[e + 5]] + "-" + byteToHex[s[e + 6]] + byteToHex[s[e + 7]] + "-" + byteToHex[s[e + 8]] + byteToHex[s[e + 9]] + "-" + byteToHex[s[e + 10]] + byteToHex[s[e + 11]] + byteToHex[s[e + 12]] + byteToHex[s[e + 13]] + byteToHex[s[e + 14]] + byteToHex[s[e + 15]]).toLowerCase();
}
var getRandomValues, rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues && (getRandomValues = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !getRandomValues))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return getRandomValues(rnds8);
}
var randomUUID = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const native = {
  randomUUID
};
function v4(s, e, A) {
  if (native.randomUUID && !s)
    return native.randomUUID();
  s = s || {};
  var g = s.random || (s.rng || rng)();
  return g[6] = g[6] & 15 | 64, g[8] = g[8] & 63 | 128, unsafeStringify(g);
}
const Typescript = {
  name: "TypeScript",
  topLevelKeywords: ["function", "class", "module", "export", "import"],
  singleLineComment: "//",
  endOfLine: [";"]
}, Python = {
  name: "Python",
  // """"#" is for .ipynb files, where we add '"""' surrounding markdown blocks.
  // This stops the model from trying to complete the start of a new markdown block
  topLevelKeywords: ["def", "class", '"""#'],
  singleLineComment: "#",
  endOfLine: []
}, Java = {
  name: "Java",
  topLevelKeywords: ["class", "function"],
  singleLineComment: "//",
  endOfLine: [";"]
}, Cpp = {
  name: "C++",
  topLevelKeywords: ["class", "namespace", "template"],
  singleLineComment: "//",
  endOfLine: [";"]
}, CSharp = {
  name: "C#",
  topLevelKeywords: ["class", "namespace", "void"],
  singleLineComment: "//",
  endOfLine: [";"]
}, C$1 = {
  name: "C",
  topLevelKeywords: ["if", "else", "while", "for", "switch", "case"],
  singleLineComment: "//",
  endOfLine: [";"]
}, Scala = {
  name: "Scala",
  topLevelKeywords: ["def", "val", "var", "class", "object", "trait"],
  singleLineComment: "//",
  endOfLine: [";"]
}, Go = {
  name: "Go",
  topLevelKeywords: ["func", "package", "import", "type"],
  singleLineComment: "//",
  endOfLine: []
}, Rust = {
  name: "Rust",
  topLevelKeywords: ["fn", "mod", "pub", "struct", "enum", "trait"],
  singleLineComment: "//",
  endOfLine: [";"]
}, Haskell = {
  name: "Haskell",
  topLevelKeywords: ["data", "type", "newtype", "class", "instance", "let", "in", "where"],
  singleLineComment: "--",
  endOfLine: []
}, PHP = {
  name: "PHP",
  topLevelKeywords: ["function", "class", "namespace", "use"],
  singleLineComment: "//",
  endOfLine: [";"]
}, RubyOnRails = {
  name: "Ruby on Rails",
  topLevelKeywords: ["def", "class", "module"],
  singleLineComment: "#",
  endOfLine: []
}, Swift = {
  name: "Swift",
  topLevelKeywords: ["func", "class", "struct", "import"],
  singleLineComment: "//",
  endOfLine: [";"]
}, Kotlin = {
  name: "Kotlin",
  topLevelKeywords: ["fun", "class", "package", "import"],
  singleLineComment: "//",
  endOfLine: [";"]
}, Ruby = {
  name: "Ruby",
  topLevelKeywords: ["class", "module", "def"],
  singleLineComment: "#",
  endOfLine: []
}, Clojure = {
  name: "Clojure",
  topLevelKeywords: ["def", "fn", "let", "do", "if", "defn", "ns", "defmacro"],
  singleLineComment: ";",
  endOfLine: []
}, Julia = {
  name: "Julia",
  topLevelKeywords: ["function", "macro", "if", "else", "elseif", "while", "for", "begin", "end", "module"],
  singleLineComment: "#",
  endOfLine: [";"]
}, FSharp = {
  name: "F#",
  topLevelKeywords: ["let", "type", "module", "namespace", "open", "if", "then", "else", "match", "with"],
  singleLineComment: "//",
  endOfLine: []
}, R = {
  name: "R",
  topLevelKeywords: ["function", "if", "else", "for", "while", "repeat", "library", "require"],
  singleLineComment: "#",
  endOfLine: []
}, Dart = {
  name: "Dart",
  topLevelKeywords: ["class", "import", "void", "enum"],
  singleLineComment: "//",
  endOfLine: [";"]
}, Solidity = {
  name: "Solidity",
  topLevelKeywords: [
    "contract",
    "event",
    "modifier",
    "function",
    "constructor",
    "for",
    "require",
    "emit",
    "interface",
    "error",
    "library",
    "struct",
    "enum",
    "type"
  ],
  singleLineComment: "//",
  endOfLine: [";"]
}, YAML = {
  name: "YAML",
  topLevelKeywords: [],
  singleLineComment: "#",
  endOfLine: [],
  lineFilters: [
    // Only display one list item at a time
    async function* ({ lines: s, fullStop: e }) {
      let A = !1;
      for await (const g of s)
        if (g.trim().startsWith("- ")) {
          if (A) {
            e();
            break;
          } else
            A = !0;
          yield g;
        } else
          yield g;
    },
    // Don't allow consecutive lines of same key
    async function* ({ lines: s }) {
      let e;
      for await (const A of s)
        if (A.includes(":")) {
          const g = A.split(":")[0];
          if (g !== e)
            yield A, e = g;
          else
            break;
        }
    }
  ]
}, Markdown = {
  name: "Markdown",
  topLevelKeywords: [],
  singleLineComment: "",
  endOfLine: [],
  useMultiline: ({ prefix: s, suffix: e }) => {
    const A = ["- ", "* ", /^\d+\. /, "> ", "```", /^#{1,6} /];
    let g = s.split(`
`).pop();
    if (g) {
      g = g.trim();
      for (const r of A)
        if (typeof r == "string" ? g.startsWith(r) : r.test(g))
          return !1;
    }
  }
}, LANGUAGES = {
  ts: Typescript,
  js: Typescript,
  tsx: Typescript,
  jsx: Typescript,
  ipynb: Python,
  py: Python,
  pyi: Python,
  java: Java,
  cpp: Cpp,
  cxx: Cpp,
  h: Cpp,
  hpp: Cpp,
  cs: CSharp,
  c: C$1,
  scala: Scala,
  sc: Scala,
  go: Go,
  rs: Rust,
  hs: Haskell,
  php: PHP,
  rb: Ruby,
  rails: RubyOnRails,
  swift: Swift,
  kt: Kotlin,
  clj: Clojure,
  cljs: Clojure,
  cljc: Clojure,
  jl: Julia,
  fs: FSharp,
  fsi: FSharp,
  fsx: FSharp,
  fsscript: FSharp,
  r: R,
  R,
  dart: Dart,
  sol: Solidity,
  yaml: YAML,
  yml: YAML,
  md: Markdown
}, RTS_LANGUAGES = {
  // JavaScript/TypeScript related
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "typescript",
  // Python related
  py: "python",
  pyi: "python",
  pyx: "python",
  ipynb: "python",
  // C/C++ related
  c: "cpp",
  cpp: "cpp",
  cxx: "cpp",
  cc: "cpp",
  h: "cpp",
  hpp: "cpp",
  hh: "cpp",
  // Java/JVM languages
  java: "java",
  kt: "kotlin",
  kts: "kotlin",
  scala: "scala",
  sc: "scala",
  sbt: "scala",
  // Shell/scripting languages
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  ksh: "shell",
  csh: "shell",
  fish: "shell",
  ps1: "powershell",
  psm1: "powershell",
  psd1: "powershell",
  // Web technologies
  php: "php",
  phtml: "php",
  rb: "ruby",
  vue: "vue",
  // Data formats
  json: "json",
  jsonl: "json",
  geojson: "json",
  jsonc: "json",
  yaml: "yaml",
  yml: "yaml",
  // SQL related
  sql: "sql",
  mysql: "sql",
  psql: "sql",
  tsql: "sql",
  // Other languages
  go: "go",
  rs: "rust",
  dart: "dart",
  lua: "lua",
  r: "r",
  R: "r",
  rmd: "r",
  swift: "swift",
  tf: "tf",
  tfvars: "tf",
  cs: "csharp",
  // Hardware description languages
  sv: "systemverilog",
  svh: "systemverilog",
  v: "systemverilog"
};
function languageForFilepath(s) {
  const e = s.split(".").pop() ?? "";
  return LANGUAGES[e] ?? Typescript;
}
function rtsLanguageForFilepath(s) {
  const e = s.split(".").pop() ?? "";
  return RTS_LANGUAGES[e];
}
const Metrics$1 = new MetricReporter(TelemetryNamespace.Continue, "Autocomplete"), ERRORS_TO_IGNORE = ["unexpected server status"], DEFAULT_AUTOCOMPLETE_OPTS = {
  disable: !1,
  useCopyBuffer: !1,
  useFileSuffix: !0,
  maxPromptTokens: 1024,
  debounceDelay: 350,
  maxSuffixPercentage: 0.25,
  prefixPercentage: 0.75,
  multilineCompletions: "auto",
  slidingWindowPrefixPercentage: 0.75,
  slidingWindowSize: 500,
  maxSnippetPercentage: 0.6,
  recentlyEditedSimilarityThreshold: 0.3,
  useCache: !0,
  onlyMyCode: !0,
  useOtherFiles: !0,
  useRecentlyEdited: !0,
  recentLinePrefixMatchMinLength: 7
}, COUNT_COMPLETION_REJECTED_AFTER = 1e4, MAX_FILE_CONTENT_LENGTH = 10240, MAX_FILE_NAME_LENGTH = 1024;
function getBasename(s) {
  return require$$2.basename(s);
}
function getRangeInString(s, e) {
  const A = s.split(`
`), g = Math.max(0, e.start.line), r = Math.min(A.length - 1, e.end.line);
  if (g === r)
    return A[g]?.substring(e.start.character, e.end.character) ?? "";
  const B = [];
  for (let F = g; F <= r; F++)
    F === g ? B.push(A[F]?.substring(e.start.character) ?? "") : F === r ? B.push(A[F]?.substring(0, e.end.character) ?? "") : B.push(A[F] ?? "");
  return B.join(`
`);
}
async function readFile$1(s) {
  const e = vscode.Uri.file(s), A = await vscode.workspace.fs.readFile(e);
  return new TextDecoder().decode(A);
}
function getWorkspaceDirs() {
  return vscode.workspace.workspaceFolders?.map((s) => s.uri.fsPath) ?? [];
}
async function getRepoName(s) {
  try {
    const e = vscode.extensions.getExtension("vscode.git");
    if (!e)
      return;
    const r = (e.isActive ? e.exports : await e.activate()).getAPI(1).getRepository(vscode.Uri.file(s));
    if (r?.state.HEAD?.upstream) {
      const B = r.state.remotes;
      if (B && B.length > 0) {
        const F = B[0].fetchUrl ?? B[0].pushUrl;
        if (F) {
          const k = F.match(/[/:]([^/:]+\/[^/.]+)(\.git)?$/);
          return k ? k[1] : void 0;
        }
      }
    }
    return;
  } catch {
    return;
  }
}
function getUniqueId() {
  return getMachineId();
}
class CompletionProvider {
  constructor(e, A, g) {
    this.rtsClient = e, this._onError = A, this.getDefinitionsFromLsp = g;
  }
  static debounceTimeout = void 0;
  static debouncing = !1;
  static lastUUID = void 0;
  errorsShown = /* @__PURE__ */ new Set();
  onError(e) {
    const A = e instanceof Error ? e : new Error(String(e));
    ERRORS_TO_IGNORE.some((g) => A.message.includes(g)) || this.errorsShown.has(A.message) || (this.errorsShown.add(A.message), this._onError(A));
  }
  _abortControllers = /* @__PURE__ */ new Map();
  _logRejectionTimeouts = /* @__PURE__ */ new Map();
  _outcomes = /* @__PURE__ */ new Map();
  /**
   * Cancel all pending completions
   */
  cancel() {
    this._abortControllers.forEach((e) => {
      e.abort();
    }), this._abortControllers.clear(), Metrics$1.reportCountMetrics({ completionCanceled: !0 });
  }
  /**
   * Accept a completion by ID
   */
  accept(e) {
    this._logRejectionTimeouts.has(e) && (clearTimeout(this._logRejectionTimeouts.get(e)), this._logRejectionTimeouts.delete(e));
    const A = this._outcomes.get(e);
    A && (A.accepted = !0, Feature.reportUsage("AutocompleteAccepted"), Metrics$1.reportCountMetrics({
      completionAccepted: !0
    }), Metrics$1.reportHistogramMetrics({
      completionAcceptanceTime: A.time,
      completionAcceptedLength: A.completion.length
    }), this._outcomes.delete(e));
  }
  /**
   * Cancel the rejection timeout for a completion
   */
  cancelRejectionTimeout(e) {
    this._logRejectionTimeouts.has(e) && (clearTimeout(this._logRejectionTimeouts.get(e)), this._logRejectionTimeouts.delete(e)), this._outcomes.has(e) && this._outcomes.delete(e), Metrics$1.reportCountMetrics({ completionRejectionTimeout: !0 });
  }
  /**
   * Provide inline completion items for the given input
   */
  async provideInlineCompletionItems(e, A, g) {
    try {
      const r = v4();
      CompletionProvider.lastUUID = r;
      const B = DEFAULT_AUTOCOMPLETE_OPTS;
      if (!g) {
        const k = new AbortController();
        g = k.signal, this._abortControllers.set(A.completionId, k);
      }
      if (CompletionProvider.debouncing) {
        CompletionProvider.debounceTimeout?.refresh();
        const k = await new Promise(
          (P) => setTimeout(() => P(CompletionProvider.lastUUID), B.debounceDelay)
        );
        if (r !== k)
          return;
      } else
        CompletionProvider.debouncing = !0, CompletionProvider.debounceTimeout = setTimeout(() => {
          CompletionProvider.debouncing = !1;
        }, B.debounceDelay);
      const F = await Metrics$1.callWithTrace(
        "TabCompletionInvoke",
        () => this.getTabCompletion(e, B, A)
      );
      return Metrics$1.reportCountMetrics({ completionOutcomeRecieved: !!F }), Metrics$1.reportHistogramMetrics({ completionProvidedLength: F?.completion.length }), e?.appendLine(`[Autocomplete model] result: [${F?.completion}]`), !F?.completion || isOnlyPunctuationAndWhitespace(F.completion) ? void 0 : F;
    } catch (r) {
      this.onError(r);
    } finally {
      this._abortControllers.delete(A.completionId);
    }
  }
  _lastDisplayedCompletion = void 0;
  /**
   * Mark a completion as displayed and set up rejection timeout
   */
  markDisplayed(e, A) {
    const g = setTimeout(() => {
      A.accepted = !1, Metrics$1.reportCountMetrics({ completionRejected: !0 }), this._logRejectionTimeouts.delete(e);
    }, COUNT_COMPLETION_REJECTED_AFTER);
    this._outcomes.set(e, A), this._logRejectionTimeouts.set(e, g);
    const r = this._lastDisplayedCompletion, B = Date.now();
    if (r && this._logRejectionTimeouts.has(r.id)) {
      const F = this._outcomes.get(r.id), k = F?.completion.split(`
`)[0] ?? "", P = A.completion.split(`
`)[0];
      F && (k.endsWith(P) || P.endsWith(k) || k.startsWith(P) || P.startsWith(k)) ? this.cancelRejectionTimeout(r.id) : B - r.displayedAt < 500 && this.cancelRejectionTimeout(r.id);
    }
    this._lastDisplayedCompletion = { id: e, displayedAt: B };
  }
  /**
   * Get tab completion for the given input
   */
  async getTabCompletion(e, A, g) {
    const r = Date.now(), { filepath: B, pos: F, manuallyPassFileContents: k } = g, P = k ?? await readFile$1(B), q = P.split(`
`), Z = languageForFilepath(B), $ = q[F.line] ?? "";
    for (const o of Z.endOfLine)
      if ($.endsWith(o) && F.character >= $.length)
        return;
    let sA = getRangeInString(P, {
      start: { line: 0, character: 0 },
      end: g.selectedCompletionInfo?.range.start ?? F
    }) + (g.selectedCompletionInfo?.text ?? "");
    if (g.injectDetails) {
      const o = sA.split(`
`);
      sA = `${o.slice(0, -1).join(`
`)}
${Z.singleLineComment} ${g.injectDetails.split(`
`).join(`
${Z.singleLineComment} `)}
${o[o.length - 1]}`;
    }
    const X = getRangeInString(P, {
      start: F,
      end: { line: q.length - 1, character: Number.MAX_SAFE_INTEGER }
    }), S = performance.now();
    let J = [];
    A.useOtherFiles && (J = await Promise.race([
      this.getDefinitionsFromLsp(B, sA + X, sA.length, Z),
      new Promise((o) => setTimeout(() => o([]), 100))
    ]));
    const eA = getWorkspaceDirs();
    A.onlyMyCode && (J = J.filter(
      (o) => eA.some((Q) => o.filepath.startsWith(Q))
    ));
    const b = getBasename(g.filepath), N = rtsLanguageForFilepath(g.filepath);
    if (!N)
      return;
    let p = sA, h = X, E = b;
    p.length > MAX_FILE_CONTENT_LENGTH && (p = p.slice(-MAX_FILE_CONTENT_LENGTH)), b.length > MAX_FILE_NAME_LENGTH && (E = B.slice(-MAX_FILE_NAME_LENGTH)), h.length > MAX_FILE_CONTENT_LENGTH && (h = h.slice(0, MAX_FILE_CONTENT_LENGTH)), Metrics$1.reportHistogramMetrics({
      buildContextDuration: performance.now() - S,
      completionContextPrefix: p.length,
      completionContextSuffix: h.length
    });
    const u = await this.rtsClient.tabComplete({
      logger: e,
      leftFileContent: p,
      rightFileContent: h,
      languageName: N,
      filename: E,
      lineNumber: g.pos.line + 1,
      snippets: J
    });
    if (u)
      return {
        time: Date.now() - r,
        completion: u,
        prefix: p,
        suffix: h,
        prompt: "unknown",
        modelProvider: "qdev",
        modelName: "qdev",
        completionOptions: {},
        cacheHit: !1,
        filepath: g.filepath,
        completionId: g.completionId,
        gitRepo: await getRepoName(g.filepath),
        uniqueId: getUniqueId(),
        ...A
      };
  }
}
function isOnlyPunctuationAndWhitespace(s) {
  return /^[^\w\d})\]]+$/.test(s);
}
var __defProp = Object.defineProperty, __name = (s, e) => __defProp(s, "name", { value: e, configurable: !0 }), SIZE_OF_SHORT = 2, SIZE_OF_INT = 4, SIZE_OF_CURSOR = 4 * SIZE_OF_INT, SIZE_OF_NODE = 5 * SIZE_OF_INT, SIZE_OF_POINT = 2 * SIZE_OF_INT, SIZE_OF_RANGE = 2 * SIZE_OF_INT + 2 * SIZE_OF_POINT, ZERO_POINT = { row: 0, column: 0 }, INTERNAL = /* @__PURE__ */ Symbol("INTERNAL");
function assertInternal(s) {
  if (s !== INTERNAL) throw new Error("Illegal constructor");
}
__name(assertInternal, "assertInternal");
function isPoint(s) {
  return !!s && typeof s.row == "number" && typeof s.column == "number";
}
__name(isPoint, "isPoint");
function setModule(s) {
  C = s;
}
__name(setModule, "setModule");
var C, Ae, LookaheadIterator = (Ae = class {
  /** @internal */
  0 = 0;
  // Internal handle for WASM
  /** @internal */
  language;
  /** @internal */
  constructor(e, A, g) {
    assertInternal(e), this[0] = A, this.language = g;
  }
  /** Get the current symbol of the lookahead iterator. */
  get currentTypeId() {
    return C._ts_lookahead_iterator_current_symbol(this[0]);
  }
  /** Get the current symbol name of the lookahead iterator. */
  get currentType() {
    return this.language.types[this.currentTypeId] || "ERROR";
  }
  /** Delete the lookahead iterator, freeing its resources. */
  delete() {
    C._ts_lookahead_iterator_delete(this[0]), this[0] = 0;
  }
  /**
   * Reset the lookahead iterator.
   *
   * This returns `true` if the language was set successfully and `false`
   * otherwise.
   */
  reset(e, A) {
    return C._ts_lookahead_iterator_reset(this[0], e[0], A) ? (this.language = e, !0) : !1;
  }
  /**
   * Reset the lookahead iterator to another state.
   *
   * This returns `true` if the iterator was reset to the given state and
   * `false` otherwise.
   */
  resetState(e) {
    return !!C._ts_lookahead_iterator_reset_state(this[0], e);
  }
  /**
   * Returns an iterator that iterates over the symbols of the lookahead iterator.
   *
   * The iterator will yield the current symbol name as a string for each step
   * until there are no more symbols to iterate over.
   */
  [Symbol.iterator]() {
    return {
      next: /* @__PURE__ */ __name(() => C._ts_lookahead_iterator_next(this[0]) ? { done: !1, value: this.currentType } : { done: !0, value: "" }, "next")
    };
  }
}, __name(Ae, "LookaheadIterator"), Ae);
function getText(s, e, A, g) {
  const r = A - e;
  let B = s.textCallback(e, g);
  if (B) {
    for (e += B.length; e < A; ) {
      const F = s.textCallback(e, g);
      if (F && F.length > 0)
        e += F.length, B += F;
      else
        break;
    }
    e > A && (B = B.slice(0, r));
  }
  return B ?? "";
}
__name(getText, "getText");
var OA, Tree = (OA = class {
  /** @internal */
  0 = 0;
  // Internal handle for WASM
  /** @internal */
  textCallback;
  /** The language that was used to parse the syntax tree. */
  language;
  /** @internal */
  constructor(e, A, g, r) {
    assertInternal(e), this[0] = A, this.language = g, this.textCallback = r;
  }
  /** Create a shallow copy of the syntax tree. This is very fast. */
  copy() {
    const e = C._ts_tree_copy(this[0]);
    return new OA(INTERNAL, e, this.language, this.textCallback);
  }
  /** Delete the syntax tree, freeing its resources. */
  delete() {
    C._ts_tree_delete(this[0]), this[0] = 0;
  }
  /** Get the root node of the syntax tree. */
  get rootNode() {
    return C._ts_tree_root_node_wasm(this[0]), unmarshalNode(this);
  }
  /**
   * Get the root node of the syntax tree, but with its position shifted
   * forward by the given offset.
   */
  rootNodeWithOffset(e, A) {
    const g = TRANSFER_BUFFER + SIZE_OF_NODE;
    return C.setValue(g, e, "i32"), marshalPoint(g + SIZE_OF_INT, A), C._ts_tree_root_node_with_offset_wasm(this[0]), unmarshalNode(this);
  }
  /**
   * Edit the syntax tree to keep it in sync with source code that has been
   * edited.
   *
   * You must describe the edit both in terms of byte offsets and in terms of
   * row/column coordinates.
   */
  edit(e) {
    marshalEdit(e), C._ts_tree_edit_wasm(this[0]);
  }
  /** Create a new {@link TreeCursor} starting from the root of the tree. */
  walk() {
    return this.rootNode.walk();
  }
  /**
   * Compare this old edited syntax tree to a new syntax tree representing
   * the same document, returning a sequence of ranges whose syntactic
   * structure has changed.
   *
   * For this to work correctly, this syntax tree must have been edited such
   * that its ranges match up to the new tree. Generally, you'll want to
   * call this method right after calling one of the [`Parser::parse`]
   * functions. Call it on the old tree that was passed to parse, and
   * pass the new tree that was returned from `parse`.
   */
  getChangedRanges(e) {
    if (!(e instanceof OA))
      throw new TypeError("Argument must be a Tree");
    C._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
    const A = C.getValue(TRANSFER_BUFFER, "i32"), g = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), r = new Array(A);
    if (A > 0) {
      let B = g;
      for (let F = 0; F < A; F++)
        r[F] = unmarshalRange(B), B += SIZE_OF_RANGE;
      C._free(g);
    }
    return r;
  }
  /** Get the included ranges that were used to parse the syntax tree. */
  getIncludedRanges() {
    C._ts_tree_included_ranges_wasm(this[0]);
    const e = C.getValue(TRANSFER_BUFFER, "i32"), A = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), g = new Array(e);
    if (e > 0) {
      let r = A;
      for (let B = 0; B < e; B++)
        g[B] = unmarshalRange(r), r += SIZE_OF_RANGE;
      C._free(A);
    }
    return g;
  }
}, __name(OA, "Tree"), OA), ZA, TreeCursor = (ZA = class {
  /** @internal */
  // @ts-expect-error: never read
  0 = 0;
  // Internal handle for Wasm
  /** @internal */
  // @ts-expect-error: never read
  1 = 0;
  // Internal handle for Wasm
  /** @internal */
  // @ts-expect-error: never read
  2 = 0;
  // Internal handle for Wasm
  /** @internal */
  // @ts-expect-error: never read
  3 = 0;
  // Internal handle for Wasm
  /** @internal */
  tree;
  /** @internal */
  constructor(e, A) {
    assertInternal(e), this.tree = A, unmarshalTreeCursor(this);
  }
  /** Creates a deep copy of the tree cursor. This allocates new memory. */
  copy() {
    const e = new ZA(INTERNAL, this.tree);
    return C._ts_tree_cursor_copy_wasm(this.tree[0]), unmarshalTreeCursor(e), e;
  }
  /** Delete the tree cursor, freeing its resources. */
  delete() {
    marshalTreeCursor(this), C._ts_tree_cursor_delete_wasm(this.tree[0]), this[0] = this[1] = this[2] = 0;
  }
  /** Get the tree cursor's current {@link Node}. */
  get currentNode() {
    return marshalTreeCursor(this), C._ts_tree_cursor_current_node_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /**
   * Get the numerical field id of this tree cursor's current node.
   *
   * See also {@link TreeCursor#currentFieldName}.
   */
  get currentFieldId() {
    return marshalTreeCursor(this), C._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
  }
  /** Get the field name of this tree cursor's current node. */
  get currentFieldName() {
    return this.tree.language.fields[this.currentFieldId];
  }
  /**
   * Get the depth of the cursor's current node relative to the original
   * node that the cursor was constructed with.
   */
  get currentDepth() {
    return marshalTreeCursor(this), C._ts_tree_cursor_current_depth_wasm(this.tree[0]);
  }
  /**
   * Get the index of the cursor's current node out of all of the
   * descendants of the original node that the cursor was constructed with.
   */
  get currentDescendantIndex() {
    return marshalTreeCursor(this), C._ts_tree_cursor_current_descendant_index_wasm(this.tree[0]);
  }
  /** Get the type of the cursor's current node. */
  get nodeType() {
    return this.tree.language.types[this.nodeTypeId] || "ERROR";
  }
  /** Get the type id of the cursor's current node. */
  get nodeTypeId() {
    return marshalTreeCursor(this), C._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
  }
  /** Get the state id of the cursor's current node. */
  get nodeStateId() {
    return marshalTreeCursor(this), C._ts_tree_cursor_current_node_state_id_wasm(this.tree[0]);
  }
  /** Get the id of the cursor's current node. */
  get nodeId() {
    return marshalTreeCursor(this), C._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
  }
  /**
   * Check if the cursor's current node is *named*.
   *
   * Named nodes correspond to named rules in the grammar, whereas
   * *anonymous* nodes correspond to string literals in the grammar.
   */
  get nodeIsNamed() {
    return marshalTreeCursor(this), C._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]) === 1;
  }
  /**
   * Check if the cursor's current node is *missing*.
   *
   * Missing nodes are inserted by the parser in order to recover from
   * certain kinds of syntax errors.
   */
  get nodeIsMissing() {
    return marshalTreeCursor(this), C._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]) === 1;
  }
  /** Get the string content of the cursor's current node. */
  get nodeText() {
    marshalTreeCursor(this);
    const e = C._ts_tree_cursor_start_index_wasm(this.tree[0]), A = C._ts_tree_cursor_end_index_wasm(this.tree[0]);
    C._ts_tree_cursor_start_position_wasm(this.tree[0]);
    const g = unmarshalPoint(TRANSFER_BUFFER);
    return getText(this.tree, e, A, g);
  }
  /** Get the start position of the cursor's current node. */
  get startPosition() {
    return marshalTreeCursor(this), C._ts_tree_cursor_start_position_wasm(this.tree[0]), unmarshalPoint(TRANSFER_BUFFER);
  }
  /** Get the end position of the cursor's current node. */
  get endPosition() {
    return marshalTreeCursor(this), C._ts_tree_cursor_end_position_wasm(this.tree[0]), unmarshalPoint(TRANSFER_BUFFER);
  }
  /** Get the start index of the cursor's current node. */
  get startIndex() {
    return marshalTreeCursor(this), C._ts_tree_cursor_start_index_wasm(this.tree[0]);
  }
  /** Get the end index of the cursor's current node. */
  get endIndex() {
    return marshalTreeCursor(this), C._ts_tree_cursor_end_index_wasm(this.tree[0]);
  }
  /**
   * Move this cursor to the first child of its current node.
   *
   * This returns `true` if the cursor successfully moved, and returns
   * `false` if there were no children.
   */
  gotoFirstChild() {
    marshalTreeCursor(this);
    const e = C._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
    return unmarshalTreeCursor(this), e === 1;
  }
  /**
   * Move this cursor to the last child of its current node.
   *
   * This returns `true` if the cursor successfully moved, and returns
   * `false` if there were no children.
   *
   * Note that this function may be slower than
   * {@link TreeCursor#gotoFirstChild} because it needs to
   * iterate through all the children to compute the child's position.
   */
  gotoLastChild() {
    marshalTreeCursor(this);
    const e = C._ts_tree_cursor_goto_last_child_wasm(this.tree[0]);
    return unmarshalTreeCursor(this), e === 1;
  }
  /**
   * Move this cursor to the parent of its current node.
   *
   * This returns `true` if the cursor successfully moved, and returns
   * `false` if there was no parent node (the cursor was already on the
   * root node).
   *
   * Note that the node the cursor was constructed with is considered the root
   * of the cursor, and the cursor cannot walk outside this node.
   */
  gotoParent() {
    marshalTreeCursor(this);
    const e = C._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
    return unmarshalTreeCursor(this), e === 1;
  }
  /**
   * Move this cursor to the next sibling of its current node.
   *
   * This returns `true` if the cursor successfully moved, and returns
   * `false` if there was no next sibling node.
   *
   * Note that the node the cursor was constructed with is considered the root
   * of the cursor, and the cursor cannot walk outside this node.
   */
  gotoNextSibling() {
    marshalTreeCursor(this);
    const e = C._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
    return unmarshalTreeCursor(this), e === 1;
  }
  /**
   * Move this cursor to the previous sibling of its current node.
   *
   * This returns `true` if the cursor successfully moved, and returns
   * `false` if there was no previous sibling node.
   *
   * Note that this function may be slower than
   * {@link TreeCursor#gotoNextSibling} due to how node
   * positions are stored. In the worst case, this will need to iterate
   * through all the children up to the previous sibling node to recalculate
   * its position. Also note that the node the cursor was constructed with is
   * considered the root of the cursor, and the cursor cannot walk outside this node.
   */
  gotoPreviousSibling() {
    marshalTreeCursor(this);
    const e = C._ts_tree_cursor_goto_previous_sibling_wasm(this.tree[0]);
    return unmarshalTreeCursor(this), e === 1;
  }
  /**
   * Move the cursor to the node that is the nth descendant of
   * the original node that the cursor was constructed with, where
   * zero represents the original node itself.
   */
  gotoDescendant(e) {
    marshalTreeCursor(this), C._ts_tree_cursor_goto_descendant_wasm(this.tree[0], e), unmarshalTreeCursor(this);
  }
  /**
   * Move this cursor to the first child of its current node that contains or
   * starts after the given byte offset.
   *
   * This returns `true` if the cursor successfully moved to a child node, and returns
   * `false` if no such child was found.
   */
  gotoFirstChildForIndex(e) {
    marshalTreeCursor(this), C.setValue(TRANSFER_BUFFER + SIZE_OF_CURSOR, e, "i32");
    const A = C._ts_tree_cursor_goto_first_child_for_index_wasm(this.tree[0]);
    return unmarshalTreeCursor(this), A === 1;
  }
  /**
   * Move this cursor to the first child of its current node that contains or
   * starts after the given byte offset.
   *
   * This returns the index of the child node if one was found, and returns
   * `null` if no such child was found.
   */
  gotoFirstChildForPosition(e) {
    marshalTreeCursor(this), marshalPoint(TRANSFER_BUFFER + SIZE_OF_CURSOR, e);
    const A = C._ts_tree_cursor_goto_first_child_for_position_wasm(this.tree[0]);
    return unmarshalTreeCursor(this), A === 1;
  }
  /**
   * Re-initialize this tree cursor to start at the original node that the
   * cursor was constructed with.
   */
  reset(e) {
    marshalNode(e), marshalTreeCursor(this, TRANSFER_BUFFER + SIZE_OF_NODE), C._ts_tree_cursor_reset_wasm(this.tree[0]), unmarshalTreeCursor(this);
  }
  /**
   * Re-initialize a tree cursor to the same position as another cursor.
   *
   * Unlike {@link TreeCursor#reset}, this will not lose parent
   * information and allows reusing already created cursors.
   */
  resetTo(e) {
    marshalTreeCursor(this, TRANSFER_BUFFER), marshalTreeCursor(e, TRANSFER_BUFFER + SIZE_OF_CURSOR), C._ts_tree_cursor_reset_to_wasm(this.tree[0], e.tree[0]), unmarshalTreeCursor(this);
  }
}, __name(ZA, "TreeCursor"), ZA), ee, Node = (ee = class {
  /** @internal */
  // @ts-expect-error: never read
  0 = 0;
  // Internal handle for Wasm
  /** @internal */
  _children;
  /** @internal */
  _namedChildren;
  /** @internal */
  constructor(e, {
    id: A,
    tree: g,
    startIndex: r,
    startPosition: B,
    other: F
  }) {
    assertInternal(e), this[0] = F, this.id = A, this.tree = g, this.startIndex = r, this.startPosition = B;
  }
  /**
   * The numeric id for this node that is unique.
   *
   * Within a given syntax tree, no two nodes have the same id. However:
   *
   * * If a new tree is created based on an older tree, and a node from the old tree is reused in
   *   the process, then that node will have the same id in both trees.
   *
   * * A node not marked as having changes does not guarantee it was reused.
   *
   * * If a node is marked as having changed in the old tree, it will not be reused.
   */
  id;
  /** The byte index where this node starts. */
  startIndex;
  /** The position where this node starts. */
  startPosition;
  /** The tree that this node belongs to. */
  tree;
  /** Get this node's type as a numerical id. */
  get typeId() {
    return marshalNode(this), C._ts_node_symbol_wasm(this.tree[0]);
  }
  /**
   * Get the node's type as a numerical id as it appears in the grammar,
   * ignoring aliases.
   */
  get grammarId() {
    return marshalNode(this), C._ts_node_grammar_symbol_wasm(this.tree[0]);
  }
  /** Get this node's type as a string. */
  get type() {
    return this.tree.language.types[this.typeId] || "ERROR";
  }
  /**
   * Get this node's symbol name as it appears in the grammar, ignoring
   * aliases as a string.
   */
  get grammarType() {
    return this.tree.language.types[this.grammarId] || "ERROR";
  }
  /**
   * Check if this node is *named*.
   *
   * Named nodes correspond to named rules in the grammar, whereas
   * *anonymous* nodes correspond to string literals in the grammar.
   */
  get isNamed() {
    return marshalNode(this), C._ts_node_is_named_wasm(this.tree[0]) === 1;
  }
  /**
   * Check if this node is *extra*.
   *
   * Extra nodes represent things like comments, which are not required
   * by the grammar, but can appear anywhere.
   */
  get isExtra() {
    return marshalNode(this), C._ts_node_is_extra_wasm(this.tree[0]) === 1;
  }
  /**
   * Check if this node represents a syntax error.
   *
   * Syntax errors represent parts of the code that could not be incorporated
   * into a valid syntax tree.
   */
  get isError() {
    return marshalNode(this), C._ts_node_is_error_wasm(this.tree[0]) === 1;
  }
  /**
   * Check if this node is *missing*.
   *
   * Missing nodes are inserted by the parser in order to recover from
   * certain kinds of syntax errors.
   */
  get isMissing() {
    return marshalNode(this), C._ts_node_is_missing_wasm(this.tree[0]) === 1;
  }
  /** Check if this node has been edited. */
  get hasChanges() {
    return marshalNode(this), C._ts_node_has_changes_wasm(this.tree[0]) === 1;
  }
  /**
   * Check if this node represents a syntax error or contains any syntax
   * errors anywhere within it.
   */
  get hasError() {
    return marshalNode(this), C._ts_node_has_error_wasm(this.tree[0]) === 1;
  }
  /** Get the byte index where this node ends. */
  get endIndex() {
    return marshalNode(this), C._ts_node_end_index_wasm(this.tree[0]);
  }
  /** Get the position where this node ends. */
  get endPosition() {
    return marshalNode(this), C._ts_node_end_point_wasm(this.tree[0]), unmarshalPoint(TRANSFER_BUFFER);
  }
  /** Get the string content of this node. */
  get text() {
    return getText(this.tree, this.startIndex, this.endIndex, this.startPosition);
  }
  /** Get this node's parse state. */
  get parseState() {
    return marshalNode(this), C._ts_node_parse_state_wasm(this.tree[0]);
  }
  /** Get the parse state after this node. */
  get nextParseState() {
    return marshalNode(this), C._ts_node_next_parse_state_wasm(this.tree[0]);
  }
  /** Check if this node is equal to another node. */
  equals(e) {
    return this.tree === e.tree && this.id === e.id;
  }
  /**
   * Get the node's child at the given index, where zero represents the first child.
   *
   * This method is fairly fast, but its cost is technically log(n), so if
   * you might be iterating over a long list of children, you should use
   * {@link Node#children} instead.
   */
  child(e) {
    return marshalNode(this), C._ts_node_child_wasm(this.tree[0], e), unmarshalNode(this.tree);
  }
  /**
   * Get this node's *named* child at the given index.
   *
   * See also {@link Node#isNamed}.
   * This method is fairly fast, but its cost is technically log(n), so if
   * you might be iterating over a long list of children, you should use
   * {@link Node#namedChildren} instead.
   */
  namedChild(e) {
    return marshalNode(this), C._ts_node_named_child_wasm(this.tree[0], e), unmarshalNode(this.tree);
  }
  /**
   * Get this node's child with the given numerical field id.
   *
   * See also {@link Node#childForFieldName}. You can
   * convert a field name to an id using {@link Language#fieldIdForName}.
   */
  childForFieldId(e) {
    return marshalNode(this), C._ts_node_child_by_field_id_wasm(this.tree[0], e), unmarshalNode(this.tree);
  }
  /**
   * Get the first child with the given field name.
   *
   * If multiple children may have the same field name, access them using
   * {@link Node#childrenForFieldName}.
   */
  childForFieldName(e) {
    const A = this.tree.language.fields.indexOf(e);
    return A !== -1 ? this.childForFieldId(A) : null;
  }
  /** Get the field name of this node's child at the given index. */
  fieldNameForChild(e) {
    marshalNode(this);
    const A = C._ts_node_field_name_for_child_wasm(this.tree[0], e);
    return A ? C.AsciiToString(A) : null;
  }
  /** Get the field name of this node's named child at the given index. */
  fieldNameForNamedChild(e) {
    marshalNode(this);
    const A = C._ts_node_field_name_for_named_child_wasm(this.tree[0], e);
    return A ? C.AsciiToString(A) : null;
  }
  /**
   * Get an array of this node's children with a given field name.
   *
   * See also {@link Node#children}.
   */
  childrenForFieldName(e) {
    const A = this.tree.language.fields.indexOf(e);
    return A !== -1 && A !== 0 ? this.childrenForFieldId(A) : [];
  }
  /**
    * Get an array of this node's children with a given field id.
    *
    * See also {@link Node#childrenForFieldName}.
    */
  childrenForFieldId(e) {
    marshalNode(this), C._ts_node_children_by_field_id_wasm(this.tree[0], e);
    const A = C.getValue(TRANSFER_BUFFER, "i32"), g = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), r = new Array(A);
    if (A > 0) {
      let B = g;
      for (let F = 0; F < A; F++)
        r[F] = unmarshalNode(this.tree, B), B += SIZE_OF_NODE;
      C._free(g);
    }
    return r;
  }
  /** Get the node's first child that contains or starts after the given byte offset. */
  firstChildForIndex(e) {
    marshalNode(this);
    const A = TRANSFER_BUFFER + SIZE_OF_NODE;
    return C.setValue(A, e, "i32"), C._ts_node_first_child_for_byte_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /** Get the node's first named child that contains or starts after the given byte offset. */
  firstNamedChildForIndex(e) {
    marshalNode(this);
    const A = TRANSFER_BUFFER + SIZE_OF_NODE;
    return C.setValue(A, e, "i32"), C._ts_node_first_named_child_for_byte_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /** Get this node's number of children. */
  get childCount() {
    return marshalNode(this), C._ts_node_child_count_wasm(this.tree[0]);
  }
  /**
   * Get this node's number of *named* children.
   *
   * See also {@link Node#isNamed}.
   */
  get namedChildCount() {
    return marshalNode(this), C._ts_node_named_child_count_wasm(this.tree[0]);
  }
  /** Get this node's first child. */
  get firstChild() {
    return this.child(0);
  }
  /**
   * Get this node's first named child.
   *
   * See also {@link Node#isNamed}.
   */
  get firstNamedChild() {
    return this.namedChild(0);
  }
  /** Get this node's last child. */
  get lastChild() {
    return this.child(this.childCount - 1);
  }
  /**
   * Get this node's last named child.
   *
   * See also {@link Node#isNamed}.
   */
  get lastNamedChild() {
    return this.namedChild(this.namedChildCount - 1);
  }
  /**
   * Iterate over this node's children.
   *
   * If you're walking the tree recursively, you may want to use the
   * {@link TreeCursor} APIs directly instead.
   */
  get children() {
    if (!this._children) {
      marshalNode(this), C._ts_node_children_wasm(this.tree[0]);
      const e = C.getValue(TRANSFER_BUFFER, "i32"), A = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
      if (this._children = new Array(e), e > 0) {
        let g = A;
        for (let r = 0; r < e; r++)
          this._children[r] = unmarshalNode(this.tree, g), g += SIZE_OF_NODE;
        C._free(A);
      }
    }
    return this._children;
  }
  /**
   * Iterate over this node's named children.
   *
   * See also {@link Node#children}.
   */
  get namedChildren() {
    if (!this._namedChildren) {
      marshalNode(this), C._ts_node_named_children_wasm(this.tree[0]);
      const e = C.getValue(TRANSFER_BUFFER, "i32"), A = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
      if (this._namedChildren = new Array(e), e > 0) {
        let g = A;
        for (let r = 0; r < e; r++)
          this._namedChildren[r] = unmarshalNode(this.tree, g), g += SIZE_OF_NODE;
        C._free(A);
      }
    }
    return this._namedChildren;
  }
  /**
   * Get the descendants of this node that are the given type, or in the given types array.
   *
   * The types array should contain node type strings, which can be retrieved from {@link Language#types}.
   *
   * Additionally, a `startPosition` and `endPosition` can be passed in to restrict the search to a byte range.
   */
  descendantsOfType(e, A = ZERO_POINT, g = ZERO_POINT) {
    Array.isArray(e) || (e = [e]);
    const r = [], B = this.tree.language.types;
    for (const Z of e)
      Z == "ERROR" && r.push(65535);
    for (let Z = 0, $ = B.length; Z < $; Z++)
      e.includes(B[Z]) && r.push(Z);
    const F = C._malloc(SIZE_OF_INT * r.length);
    for (let Z = 0, $ = r.length; Z < $; Z++)
      C.setValue(F + Z * SIZE_OF_INT, r[Z], "i32");
    marshalNode(this), C._ts_node_descendants_of_type_wasm(
      this.tree[0],
      F,
      r.length,
      A.row,
      A.column,
      g.row,
      g.column
    );
    const k = C.getValue(TRANSFER_BUFFER, "i32"), P = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), q = new Array(k);
    if (k > 0) {
      let Z = P;
      for (let $ = 0; $ < k; $++)
        q[$] = unmarshalNode(this.tree, Z), Z += SIZE_OF_NODE;
    }
    return C._free(P), C._free(F), q;
  }
  /** Get this node's next sibling. */
  get nextSibling() {
    return marshalNode(this), C._ts_node_next_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /** Get this node's previous sibling. */
  get previousSibling() {
    return marshalNode(this), C._ts_node_prev_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /**
   * Get this node's next *named* sibling.
   *
   * See also {@link Node#isNamed}.
   */
  get nextNamedSibling() {
    return marshalNode(this), C._ts_node_next_named_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /**
   * Get this node's previous *named* sibling.
   *
   * See also {@link Node#isNamed}.
   */
  get previousNamedSibling() {
    return marshalNode(this), C._ts_node_prev_named_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /** Get the node's number of descendants, including one for the node itself. */
  get descendantCount() {
    return marshalNode(this), C._ts_node_descendant_count_wasm(this.tree[0]);
  }
  /**
   * Get this node's immediate parent.
   * Prefer {@link Node#childWithDescendant} for iterating over this node's ancestors.
   */
  get parent() {
    return marshalNode(this), C._ts_node_parent_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /**
   * Get the node that contains `descendant`.
   *
   * Note that this can return `descendant` itself.
   */
  childWithDescendant(e) {
    return marshalNode(this), marshalNode(e, 1), C._ts_node_child_with_descendant_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /** Get the smallest node within this node that spans the given byte range. */
  descendantForIndex(e, A = e) {
    if (typeof e != "number" || typeof A != "number")
      throw new Error("Arguments must be numbers");
    marshalNode(this);
    const g = TRANSFER_BUFFER + SIZE_OF_NODE;
    return C.setValue(g, e, "i32"), C.setValue(g + SIZE_OF_INT, A, "i32"), C._ts_node_descendant_for_index_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /** Get the smallest named node within this node that spans the given byte range. */
  namedDescendantForIndex(e, A = e) {
    if (typeof e != "number" || typeof A != "number")
      throw new Error("Arguments must be numbers");
    marshalNode(this);
    const g = TRANSFER_BUFFER + SIZE_OF_NODE;
    return C.setValue(g, e, "i32"), C.setValue(g + SIZE_OF_INT, A, "i32"), C._ts_node_named_descendant_for_index_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /** Get the smallest node within this node that spans the given point range. */
  descendantForPosition(e, A = e) {
    if (!isPoint(e) || !isPoint(A))
      throw new Error("Arguments must be {row, column} objects");
    marshalNode(this);
    const g = TRANSFER_BUFFER + SIZE_OF_NODE;
    return marshalPoint(g, e), marshalPoint(g + SIZE_OF_POINT, A), C._ts_node_descendant_for_position_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /** Get the smallest named node within this node that spans the given point range. */
  namedDescendantForPosition(e, A = e) {
    if (!isPoint(e) || !isPoint(A))
      throw new Error("Arguments must be {row, column} objects");
    marshalNode(this);
    const g = TRANSFER_BUFFER + SIZE_OF_NODE;
    return marshalPoint(g, e), marshalPoint(g + SIZE_OF_POINT, A), C._ts_node_named_descendant_for_position_wasm(this.tree[0]), unmarshalNode(this.tree);
  }
  /**
   * Create a new {@link TreeCursor} starting from this node.
   *
   * Note that the given node is considered the root of the cursor,
   * and the cursor cannot walk outside this node.
   */
  walk() {
    return marshalNode(this), C._ts_tree_cursor_new_wasm(this.tree[0]), new TreeCursor(INTERNAL, this.tree);
  }
  /**
   * Edit this node to keep it in-sync with source code that has been edited.
   *
   * This function is only rarely needed. When you edit a syntax tree with
   * the {@link Tree#edit} method, all of the nodes that you retrieve from
   * the tree afterward will already reflect the edit. You only need to
   * use {@link Node#edit} when you have a specific {@link Node} instance that
   * you want to keep and continue to use after an edit.
   */
  edit(e) {
    if (this.startIndex >= e.oldEndIndex) {
      this.startIndex = e.newEndIndex + (this.startIndex - e.oldEndIndex);
      let A, g;
      this.startPosition.row > e.oldEndPosition.row ? (A = this.startPosition.row - e.oldEndPosition.row, g = this.startPosition.column) : (A = 0, g = this.startPosition.column, this.startPosition.column >= e.oldEndPosition.column && (g = this.startPosition.column - e.oldEndPosition.column)), A > 0 ? (this.startPosition.row += A, this.startPosition.column = g) : this.startPosition.column += g;
    } else this.startIndex > e.startIndex && (this.startIndex = e.newEndIndex, this.startPosition.row = e.newEndPosition.row, this.startPosition.column = e.newEndPosition.column);
  }
  /** Get the S-expression representation of this node. */
  toString() {
    marshalNode(this);
    const e = C._ts_node_to_string_wasm(this.tree[0]), A = C.AsciiToString(e);
    return C._free(e), A;
  }
}, __name(ee, "Node"), ee);
function unmarshalCaptures(s, e, A, g, r) {
  for (let B = 0, F = r.length; B < F; B++) {
    const k = C.getValue(A, "i32");
    A += SIZE_OF_INT;
    const P = unmarshalNode(e, A);
    A += SIZE_OF_NODE, r[B] = { patternIndex: g, name: s.captureNames[k], node: P };
  }
  return A;
}
__name(unmarshalCaptures, "unmarshalCaptures");
function marshalNode(s, e = 0) {
  let A = TRANSFER_BUFFER + e * SIZE_OF_NODE;
  C.setValue(A, s.id, "i32"), A += SIZE_OF_INT, C.setValue(A, s.startIndex, "i32"), A += SIZE_OF_INT, C.setValue(A, s.startPosition.row, "i32"), A += SIZE_OF_INT, C.setValue(A, s.startPosition.column, "i32"), A += SIZE_OF_INT, C.setValue(A, s[0], "i32");
}
__name(marshalNode, "marshalNode");
function unmarshalNode(s, e = TRANSFER_BUFFER) {
  const A = C.getValue(e, "i32");
  if (e += SIZE_OF_INT, A === 0) return null;
  const g = C.getValue(e, "i32");
  e += SIZE_OF_INT;
  const r = C.getValue(e, "i32");
  e += SIZE_OF_INT;
  const B = C.getValue(e, "i32");
  e += SIZE_OF_INT;
  const F = C.getValue(e, "i32");
  return new Node(INTERNAL, {
    id: A,
    tree: s,
    startIndex: g,
    startPosition: { row: r, column: B },
    other: F
  });
}
__name(unmarshalNode, "unmarshalNode");
function marshalTreeCursor(s, e = TRANSFER_BUFFER) {
  C.setValue(e + 0 * SIZE_OF_INT, s[0], "i32"), C.setValue(e + 1 * SIZE_OF_INT, s[1], "i32"), C.setValue(e + 2 * SIZE_OF_INT, s[2], "i32"), C.setValue(e + 3 * SIZE_OF_INT, s[3], "i32");
}
__name(marshalTreeCursor, "marshalTreeCursor");
function unmarshalTreeCursor(s) {
  s[0] = C.getValue(TRANSFER_BUFFER + 0 * SIZE_OF_INT, "i32"), s[1] = C.getValue(TRANSFER_BUFFER + 1 * SIZE_OF_INT, "i32"), s[2] = C.getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32"), s[3] = C.getValue(TRANSFER_BUFFER + 3 * SIZE_OF_INT, "i32");
}
__name(unmarshalTreeCursor, "unmarshalTreeCursor");
function marshalPoint(s, e) {
  C.setValue(s, e.row, "i32"), C.setValue(s + SIZE_OF_INT, e.column, "i32");
}
__name(marshalPoint, "marshalPoint");
function unmarshalPoint(s) {
  return {
    row: C.getValue(s, "i32") >>> 0,
    column: C.getValue(s + SIZE_OF_INT, "i32") >>> 0
  };
}
__name(unmarshalPoint, "unmarshalPoint");
function marshalRange(s, e) {
  marshalPoint(s, e.startPosition), s += SIZE_OF_POINT, marshalPoint(s, e.endPosition), s += SIZE_OF_POINT, C.setValue(s, e.startIndex, "i32"), s += SIZE_OF_INT, C.setValue(s, e.endIndex, "i32"), s += SIZE_OF_INT;
}
__name(marshalRange, "marshalRange");
function unmarshalRange(s) {
  const e = {};
  return e.startPosition = unmarshalPoint(s), s += SIZE_OF_POINT, e.endPosition = unmarshalPoint(s), s += SIZE_OF_POINT, e.startIndex = C.getValue(s, "i32") >>> 0, s += SIZE_OF_INT, e.endIndex = C.getValue(s, "i32") >>> 0, e;
}
__name(unmarshalRange, "unmarshalRange");
function marshalEdit(s, e = TRANSFER_BUFFER) {
  marshalPoint(e, s.startPosition), e += SIZE_OF_POINT, marshalPoint(e, s.oldEndPosition), e += SIZE_OF_POINT, marshalPoint(e, s.newEndPosition), e += SIZE_OF_POINT, C.setValue(e, s.startIndex, "i32"), e += SIZE_OF_INT, C.setValue(e, s.oldEndIndex, "i32"), e += SIZE_OF_INT, C.setValue(e, s.newEndIndex, "i32"), e += SIZE_OF_INT;
}
__name(marshalEdit, "marshalEdit");
function unmarshalLanguageMetadata(s) {
  const e = C.getValue(s, "i32"), A = C.getValue(s += SIZE_OF_INT, "i32"), g = C.getValue(s += SIZE_OF_INT, "i32");
  return { major_version: e, minor_version: A, patch_version: g };
}
__name(unmarshalLanguageMetadata, "unmarshalLanguageMetadata");
var PREDICATE_STEP_TYPE_CAPTURE = 1, PREDICATE_STEP_TYPE_STRING = 2, QUERY_WORD_REGEX = /[\w-]+/g, isCaptureStep = /* @__PURE__ */ __name((s) => s.type === "capture", "isCaptureStep"), isStringStep = /* @__PURE__ */ __name((s) => s.type === "string", "isStringStep"), QueryErrorKind = {
  Syntax: 1,
  NodeName: 2,
  FieldName: 3,
  CaptureName: 4,
  PatternStructure: 5
}, jA, QueryError = (jA = class extends Error {
  constructor(e, A, g, r) {
    super(jA.formatMessage(e, A)), this.kind = e, this.info = A, this.index = g, this.length = r, this.name = "QueryError";
  }
  /** Formats an error message based on the error kind and info */
  static formatMessage(e, A) {
    switch (e) {
      case QueryErrorKind.NodeName:
        return `Bad node name '${A.word}'`;
      case QueryErrorKind.FieldName:
        return `Bad field name '${A.word}'`;
      case QueryErrorKind.CaptureName:
        return `Bad capture name @${A.word}`;
      case QueryErrorKind.PatternStructure:
        return `Bad pattern structure at offset ${A.suffix}`;
      case QueryErrorKind.Syntax:
        return `Bad syntax at offset ${A.suffix}`;
    }
  }
}, __name(jA, "QueryError"), jA);
function parseAnyPredicate(s, e, A, g) {
  if (s.length !== 3)
    throw new Error(
      `Wrong number of arguments to \`#${A}\` predicate. Expected 2, got ${s.length - 1}`
    );
  if (!isCaptureStep(s[1]))
    throw new Error(
      `First argument of \`#${A}\` predicate must be a capture. Got "${s[1].value}"`
    );
  const r = A === "eq?" || A === "any-eq?", B = !A.startsWith("any-");
  if (isCaptureStep(s[2])) {
    const F = s[1].name, k = s[2].name;
    g[e].push((P) => {
      const q = [], Z = [];
      for (const sA of P)
        sA.name === F && q.push(sA.node), sA.name === k && Z.push(sA.node);
      const $ = /* @__PURE__ */ __name((sA, X, S) => S ? sA.text === X.text : sA.text !== X.text, "compare");
      return B ? q.every((sA) => Z.some((X) => $(sA, X, r))) : q.some((sA) => Z.some((X) => $(sA, X, r)));
    });
  } else {
    const F = s[1].name, k = s[2].value, P = /* @__PURE__ */ __name((Z) => Z.text === k, "matches"), q = /* @__PURE__ */ __name((Z) => Z.text !== k, "doesNotMatch");
    g[e].push((Z) => {
      const $ = [];
      for (const X of Z)
        X.name === F && $.push(X.node);
      const sA = r ? P : q;
      return B ? $.every(sA) : $.some(sA);
    });
  }
}
__name(parseAnyPredicate, "parseAnyPredicate");
function parseMatchPredicate(s, e, A, g) {
  if (s.length !== 3)
    throw new Error(
      `Wrong number of arguments to \`#${A}\` predicate. Expected 2, got ${s.length - 1}.`
    );
  if (s[1].type !== "capture")
    throw new Error(
      `First argument of \`#${A}\` predicate must be a capture. Got "${s[1].value}".`
    );
  if (s[2].type !== "string")
    throw new Error(
      `Second argument of \`#${A}\` predicate must be a string. Got @${s[2].name}.`
    );
  const r = A === "match?" || A === "any-match?", B = !A.startsWith("any-"), F = s[1].name, k = new RegExp(s[2].value);
  g[e].push((P) => {
    const q = [];
    for (const $ of P)
      $.name === F && q.push($.node.text);
    const Z = /* @__PURE__ */ __name(($, sA) => sA ? k.test($) : !k.test($), "test");
    return q.length === 0 ? !r : B ? q.every(($) => Z($, r)) : q.some(($) => Z($, r));
  });
}
__name(parseMatchPredicate, "parseMatchPredicate");
function parseAnyOfPredicate(s, e, A, g) {
  if (s.length < 2)
    throw new Error(
      `Wrong number of arguments to \`#${A}\` predicate. Expected at least 1. Got ${s.length - 1}.`
    );
  if (s[1].type !== "capture")
    throw new Error(
      `First argument of \`#${A}\` predicate must be a capture. Got "${s[1].value}".`
    );
  const r = A === "any-of?", B = s[1].name, F = s.slice(2);
  if (!F.every(isStringStep))
    throw new Error(
      `Arguments to \`#${A}\` predicate must be strings.".`
    );
  const k = F.map((P) => P.value);
  g[e].push((P) => {
    const q = [];
    for (const Z of P)
      Z.name === B && q.push(Z.node.text);
    return q.length === 0 ? !r : q.every((Z) => k.includes(Z)) === r;
  });
}
__name(parseAnyOfPredicate, "parseAnyOfPredicate");
function parseIsPredicate(s, e, A, g, r) {
  if (s.length < 2 || s.length > 3)
    throw new Error(
      `Wrong number of arguments to \`#${A}\` predicate. Expected 1 or 2. Got ${s.length - 1}.`
    );
  if (!s.every(isStringStep))
    throw new Error(
      `Arguments to \`#${A}\` predicate must be strings.".`
    );
  const B = A === "is?" ? g : r;
  B[e] || (B[e] = {}), B[e][s[1].value] = s[2]?.value ?? null;
}
__name(parseIsPredicate, "parseIsPredicate");
function parseSetDirective(s, e, A) {
  if (s.length < 2 || s.length > 3)
    throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${s.length - 1}.`);
  if (!s.every(isStringStep))
    throw new Error('Arguments to `#set!` predicate must be strings.".');
  A[e] || (A[e] = {}), A[e][s[1].value] = s[2]?.value ?? null;
}
__name(parseSetDirective, "parseSetDirective");
function parsePattern(s, e, A, g, r, B, F, k, P, q, Z) {
  if (e === PREDICATE_STEP_TYPE_CAPTURE) {
    const $ = g[A];
    B.push({ type: "capture", name: $ });
  } else if (e === PREDICATE_STEP_TYPE_STRING)
    B.push({ type: "string", value: r[A] });
  else if (B.length > 0) {
    if (B[0].type !== "string")
      throw new Error("Predicates must begin with a literal value");
    const $ = B[0].value;
    switch ($) {
      case "any-not-eq?":
      case "not-eq?":
      case "any-eq?":
      case "eq?":
        parseAnyPredicate(B, s, $, F);
        break;
      case "any-not-match?":
      case "not-match?":
      case "any-match?":
      case "match?":
        parseMatchPredicate(B, s, $, F);
        break;
      case "not-any-of?":
      case "any-of?":
        parseAnyOfPredicate(B, s, $, F);
        break;
      case "is?":
      case "is-not?":
        parseIsPredicate(B, s, $, q, Z);
        break;
      case "set!":
        parseSetDirective(B, s, P);
        break;
      default:
        k[s].push({ operator: $, operands: B.slice(1) });
    }
    B.length = 0;
  }
}
__name(parsePattern, "parsePattern");
var te, Query = (te = class {
  /** @internal */
  0 = 0;
  // Internal handle for WASM
  /** @internal */
  exceededMatchLimit;
  /** @internal */
  textPredicates;
  /** The names of the captures used in the query. */
  captureNames;
  /** The quantifiers of the captures used in the query. */
  captureQuantifiers;
  /**
   * The other user-defined predicates associated with the given index.
   *
   * This includes predicates with operators other than:
   * - `match?`
   * - `eq?` and `not-eq?`
   * - `any-of?` and `not-any-of?`
   * - `is?` and `is-not?`
   * - `set!`
   */
  predicates;
  /** The properties for predicates with the operator `set!`. */
  setProperties;
  /** The properties for predicates with the operator `is?`. */
  assertedProperties;
  /** The properties for predicates with the operator `is-not?`. */
  refutedProperties;
  /** The maximum number of in-progress matches for this cursor. */
  matchLimit;
  /**
   * Create a new query from a string containing one or more S-expression
   * patterns.
   *
   * The query is associated with a particular language, and can only be run
   * on syntax nodes parsed with that language. References to Queries can be
   * shared between multiple threads.
   *
   * @link {@see https://tree-sitter.github.io/tree-sitter/using-parsers/queries}
   */
  constructor(e, A) {
    const g = C.lengthBytesUTF8(A), r = C._malloc(g + 1);
    C.stringToUTF8(A, r, g + 1);
    const B = C._ts_query_new(
      e[0],
      r,
      g,
      TRANSFER_BUFFER,
      TRANSFER_BUFFER + SIZE_OF_INT
    );
    if (!B) {
      const b = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), N = C.getValue(TRANSFER_BUFFER, "i32"), p = C.UTF8ToString(r, N).length, h = A.slice(p, p + 100).split(`
`)[0], E = h.match(QUERY_WORD_REGEX)?.[0] ?? "";
      switch (C._free(r), b) {
        case QueryErrorKind.Syntax:
          throw new QueryError(QueryErrorKind.Syntax, { suffix: `${p}: '${h}'...` }, p, 0);
        case QueryErrorKind.NodeName:
          throw new QueryError(b, { word: E }, p, E.length);
        case QueryErrorKind.FieldName:
          throw new QueryError(b, { word: E }, p, E.length);
        case QueryErrorKind.CaptureName:
          throw new QueryError(b, { word: E }, p, E.length);
        case QueryErrorKind.PatternStructure:
          throw new QueryError(b, { suffix: `${p}: '${h}'...` }, p, 0);
      }
    }
    const F = C._ts_query_string_count(B), k = C._ts_query_capture_count(B), P = C._ts_query_pattern_count(B), q = new Array(k), Z = new Array(P), $ = new Array(F);
    for (let b = 0; b < k; b++) {
      const N = C._ts_query_capture_name_for_id(
        B,
        b,
        TRANSFER_BUFFER
      ), p = C.getValue(TRANSFER_BUFFER, "i32");
      q[b] = C.UTF8ToString(N, p);
    }
    for (let b = 0; b < P; b++) {
      const N = new Array(k);
      for (let p = 0; p < k; p++) {
        const h = C._ts_query_capture_quantifier_for_id(B, b, p);
        N[p] = h;
      }
      Z[b] = N;
    }
    for (let b = 0; b < F; b++) {
      const N = C._ts_query_string_value_for_id(
        B,
        b,
        TRANSFER_BUFFER
      ), p = C.getValue(TRANSFER_BUFFER, "i32");
      $[b] = C.UTF8ToString(N, p);
    }
    const sA = new Array(P), X = new Array(P), S = new Array(P), J = new Array(P), eA = new Array(P);
    for (let b = 0; b < P; b++) {
      const N = C._ts_query_predicates_for_pattern(B, b, TRANSFER_BUFFER), p = C.getValue(TRANSFER_BUFFER, "i32");
      J[b] = [], eA[b] = [];
      const h = new Array();
      let E = N;
      for (let u = 0; u < p; u++) {
        const o = C.getValue(E, "i32");
        E += SIZE_OF_INT;
        const Q = C.getValue(E, "i32");
        E += SIZE_OF_INT, parsePattern(
          b,
          o,
          Q,
          q,
          $,
          h,
          eA,
          J,
          sA,
          X,
          S
        );
      }
      Object.freeze(eA[b]), Object.freeze(J[b]), Object.freeze(sA[b]), Object.freeze(X[b]), Object.freeze(S[b]);
    }
    C._free(r), this[0] = B, this.captureNames = q, this.captureQuantifiers = Z, this.textPredicates = eA, this.predicates = J, this.setProperties = sA, this.assertedProperties = X, this.refutedProperties = S, this.exceededMatchLimit = !1;
  }
  /** Delete the query, freeing its resources. */
  delete() {
    C._ts_query_delete(this[0]), this[0] = 0;
  }
  /**
   * Iterate over all of the matches in the order that they were found.
   *
   * Each match contains the index of the pattern that matched, and a list of
   * captures. Because multiple patterns can match the same set of nodes,
   * one match may contain captures that appear *before* some of the
   * captures from a previous match.
   *
   * @param {Node} node - The node to execute the query on.
   *
   * @param {QueryOptions} options - Options for query execution.
   */
  matches(e, A = {}) {
    const g = A.startPosition ?? ZERO_POINT, r = A.endPosition ?? ZERO_POINT, B = A.startIndex ?? 0, F = A.endIndex ?? 0, k = A.matchLimit ?? 4294967295, P = A.maxStartDepth ?? 4294967295, q = A.timeoutMicros ?? 0, Z = A.progressCallback;
    if (typeof k != "number")
      throw new Error("Arguments must be numbers");
    if (this.matchLimit = k, F !== 0 && B > F)
      throw new Error("`startIndex` cannot be greater than `endIndex`");
    if (r !== ZERO_POINT && (g.row > r.row || g.row === r.row && g.column > r.column))
      throw new Error("`startPosition` cannot be greater than `endPosition`");
    Z && (C.currentQueryProgressCallback = Z), marshalNode(e), C._ts_query_matches_wasm(
      this[0],
      e.tree[0],
      g.row,
      g.column,
      r.row,
      r.column,
      B,
      F,
      k,
      P,
      q
    );
    const $ = C.getValue(TRANSFER_BUFFER, "i32"), sA = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), X = C.getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32"), S = new Array($);
    this.exceededMatchLimit = !!X;
    let J = 0, eA = sA;
    for (let b = 0; b < $; b++) {
      const N = C.getValue(eA, "i32");
      eA += SIZE_OF_INT;
      const p = C.getValue(eA, "i32");
      eA += SIZE_OF_INT;
      const h = new Array(p);
      if (eA = unmarshalCaptures(this, e.tree, eA, N, h), this.textPredicates[N].every((E) => E(h))) {
        S[J] = { pattern: N, patternIndex: N, captures: h };
        const E = this.setProperties[N];
        S[J].setProperties = E;
        const u = this.assertedProperties[N];
        S[J].assertedProperties = u;
        const o = this.refutedProperties[N];
        S[J].refutedProperties = o, J++;
      }
    }
    return S.length = J, C._free(sA), C.currentQueryProgressCallback = null, S;
  }
  /**
   * Iterate over all of the individual captures in the order that they
   * appear.
   *
   * This is useful if you don't care about which pattern matched, and just
   * want a single, ordered sequence of captures.
   *
   * @param {Node} node - The node to execute the query on.
   *
   * @param {QueryOptions} options - Options for query execution.
   */
  captures(e, A = {}) {
    const g = A.startPosition ?? ZERO_POINT, r = A.endPosition ?? ZERO_POINT, B = A.startIndex ?? 0, F = A.endIndex ?? 0, k = A.matchLimit ?? 4294967295, P = A.maxStartDepth ?? 4294967295, q = A.timeoutMicros ?? 0, Z = A.progressCallback;
    if (typeof k != "number")
      throw new Error("Arguments must be numbers");
    if (this.matchLimit = k, F !== 0 && B > F)
      throw new Error("`startIndex` cannot be greater than `endIndex`");
    if (r !== ZERO_POINT && (g.row > r.row || g.row === r.row && g.column > r.column))
      throw new Error("`startPosition` cannot be greater than `endPosition`");
    Z && (C.currentQueryProgressCallback = Z), marshalNode(e), C._ts_query_captures_wasm(
      this[0],
      e.tree[0],
      g.row,
      g.column,
      r.row,
      r.column,
      B,
      F,
      k,
      P,
      q
    );
    const $ = C.getValue(TRANSFER_BUFFER, "i32"), sA = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), X = C.getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32"), S = new Array();
    this.exceededMatchLimit = !!X;
    const J = new Array();
    let eA = sA;
    for (let b = 0; b < $; b++) {
      const N = C.getValue(eA, "i32");
      eA += SIZE_OF_INT;
      const p = C.getValue(eA, "i32");
      eA += SIZE_OF_INT;
      const h = C.getValue(eA, "i32");
      if (eA += SIZE_OF_INT, J.length = p, eA = unmarshalCaptures(this, e.tree, eA, N, J), this.textPredicates[N].every((E) => E(J))) {
        const E = J[h], u = this.setProperties[N];
        E.setProperties = u;
        const o = this.assertedProperties[N];
        E.assertedProperties = o;
        const Q = this.refutedProperties[N];
        E.refutedProperties = Q, S.push(E);
      }
    }
    return C._free(sA), C.currentQueryProgressCallback = null, S;
  }
  /** Get the predicates for a given pattern. */
  predicatesForPattern(e) {
    return this.predicates[e];
  }
  /**
   * Disable a certain capture within a query.
   *
   * This prevents the capture from being returned in matches, and also
   * avoids any resource usage associated with recording the capture.
   */
  disableCapture(e) {
    const A = C.lengthBytesUTF8(e), g = C._malloc(A + 1);
    C.stringToUTF8(e, g, A + 1), C._ts_query_disable_capture(this[0], g, A), C._free(g);
  }
  /**
   * Disable a certain pattern within a query.
   *
   * This prevents the pattern from matching, and also avoids any resource
   * usage associated with the pattern. This throws an error if the pattern
   * index is out of bounds.
   */
  disablePattern(e) {
    if (e >= this.predicates.length)
      throw new Error(
        `Pattern index is ${e} but the pattern count is ${this.predicates.length}`
      );
    C._ts_query_disable_pattern(this[0], e);
  }
  /**
   * Check if, on its last execution, this cursor exceeded its maximum number
   * of in-progress matches.
   */
  didExceedMatchLimit() {
    return this.exceededMatchLimit;
  }
  /** Get the byte offset where the given pattern starts in the query's source. */
  startIndexForPattern(e) {
    if (e >= this.predicates.length)
      throw new Error(
        `Pattern index is ${e} but the pattern count is ${this.predicates.length}`
      );
    return C._ts_query_start_byte_for_pattern(this[0], e);
  }
  /** Get the byte offset where the given pattern ends in the query's source. */
  endIndexForPattern(e) {
    if (e >= this.predicates.length)
      throw new Error(
        `Pattern index is ${e} but the pattern count is ${this.predicates.length}`
      );
    return C._ts_query_end_byte_for_pattern(this[0], e);
  }
  /** Get the number of patterns in the query. */
  patternCount() {
    return C._ts_query_pattern_count(this[0]);
  }
  /** Get the index for a given capture name. */
  captureIndexForName(e) {
    return this.captureNames.indexOf(e);
  }
  /** Check if a given pattern within a query has a single root node. */
  isPatternRooted(e) {
    return C._ts_query_is_pattern_rooted(this[0], e) === 1;
  }
  /** Check if a given pattern within a query has a single root node. */
  isPatternNonLocal(e) {
    return C._ts_query_is_pattern_non_local(this[0], e) === 1;
  }
  /**
   * Check if a given step in a query is 'definite'.
   *
   * A query step is 'definite' if its parent pattern will be guaranteed to
   * match successfully once it reaches the step.
   */
  isPatternGuaranteedAtStep(e) {
    return C._ts_query_is_pattern_guaranteed_at_step(this[0], e) === 1;
  }
}, __name(te, "Query"), te), LANGUAGE_FUNCTION_REGEX = /^tree_sitter_\w+$/, zA, Language = (zA = class {
  /** @internal */
  0 = 0;
  // Internal handle for WASM
  /**
   * A list of all node types in the language. The index of each type in this
   * array is its node type id.
   */
  types;
  /**
   * A list of all field names in the language. The index of each field name in
   * this array is its field id.
   */
  fields;
  /** @internal */
  constructor(e, A) {
    assertInternal(e), this[0] = A, this.types = new Array(C._ts_language_symbol_count(this[0]));
    for (let g = 0, r = this.types.length; g < r; g++)
      C._ts_language_symbol_type(this[0], g) < 2 && (this.types[g] = C.UTF8ToString(C._ts_language_symbol_name(this[0], g)));
    this.fields = new Array(C._ts_language_field_count(this[0]) + 1);
    for (let g = 0, r = this.fields.length; g < r; g++) {
      const B = C._ts_language_field_name_for_id(this[0], g);
      B !== 0 ? this.fields[g] = C.UTF8ToString(B) : this.fields[g] = null;
    }
  }
  /**
   * Gets the name of the language.
   */
  get name() {
    const e = C._ts_language_name(this[0]);
    return e === 0 ? null : C.UTF8ToString(e);
  }
  /**
   * @deprecated since version 0.25.0, use {@link Language#abiVersion} instead
   * Gets the version of the language.
   */
  get version() {
    return C._ts_language_version(this[0]);
  }
  /**
   * Gets the ABI version of the language.
   */
  get abiVersion() {
    return C._ts_language_abi_version(this[0]);
  }
  /**
  * Get the metadata for this language. This information is generated by the
  * CLI, and relies on the language author providing the correct metadata in
  * the language's `tree-sitter.json` file.
  */
  get metadata() {
    C._ts_language_metadata(this[0]);
    const e = C.getValue(TRANSFER_BUFFER, "i32"), A = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
    return e === 0 ? null : unmarshalLanguageMetadata(A);
  }
  /**
   * Gets the number of fields in the language.
   */
  get fieldCount() {
    return this.fields.length - 1;
  }
  /**
   * Gets the number of states in the language.
   */
  get stateCount() {
    return C._ts_language_state_count(this[0]);
  }
  /**
   * Get the field id for a field name.
   */
  fieldIdForName(e) {
    const A = this.fields.indexOf(e);
    return A !== -1 ? A : null;
  }
  /**
   * Get the field name for a field id.
   */
  fieldNameForId(e) {
    return this.fields[e] ?? null;
  }
  /**
   * Get the node type id for a node type name.
   */
  idForNodeType(e, A) {
    const g = C.lengthBytesUTF8(e), r = C._malloc(g + 1);
    C.stringToUTF8(e, r, g + 1);
    const B = C._ts_language_symbol_for_name(this[0], r, g, A ? 1 : 0);
    return C._free(r), B || null;
  }
  /**
   * Gets the number of node types in the language.
   */
  get nodeTypeCount() {
    return C._ts_language_symbol_count(this[0]);
  }
  /**
   * Get the node type name for a node type id.
   */
  nodeTypeForId(e) {
    const A = C._ts_language_symbol_name(this[0], e);
    return A ? C.UTF8ToString(A) : null;
  }
  /**
   * Check if a node type is named.
   *
   * @see {@link https://tree-sitter.github.io/tree-sitter/using-parsers/2-basic-parsing.html#named-vs-anonymous-nodes}
   */
  nodeTypeIsNamed(e) {
    return !!C._ts_language_type_is_named_wasm(this[0], e);
  }
  /**
   * Check if a node type is visible.
   */
  nodeTypeIsVisible(e) {
    return !!C._ts_language_type_is_visible_wasm(this[0], e);
  }
  /**
   * Get the supertypes ids of this language.
   *
   * @see {@link https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types.html?highlight=supertype#supertype-nodes}
   */
  get supertypes() {
    C._ts_language_supertypes_wasm(this[0]);
    const e = C.getValue(TRANSFER_BUFFER, "i32"), A = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), g = new Array(e);
    if (e > 0) {
      let r = A;
      for (let B = 0; B < e; B++)
        g[B] = C.getValue(r, "i16"), r += SIZE_OF_SHORT;
    }
    return g;
  }
  /**
   * Get the subtype ids for a given supertype node id.
   */
  subtypes(e) {
    C._ts_language_subtypes_wasm(this[0], e);
    const A = C.getValue(TRANSFER_BUFFER, "i32"), g = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), r = new Array(A);
    if (A > 0) {
      let B = g;
      for (let F = 0; F < A; F++)
        r[F] = C.getValue(B, "i16"), B += SIZE_OF_SHORT;
    }
    return r;
  }
  /**
   * Get the next state id for a given state id and node type id.
   */
  nextState(e, A) {
    return C._ts_language_next_state(this[0], e, A);
  }
  /**
   * Create a new lookahead iterator for this language and parse state.
   *
   * This returns `null` if state is invalid for this language.
   *
   * Iterating {@link LookaheadIterator} will yield valid symbols in the given
   * parse state. Newly created lookahead iterators will return the `ERROR`
   * symbol from {@link LookaheadIterator#currentType}.
   *
   * Lookahead iterators can be useful for generating suggestions and improving
   * syntax error diagnostics. To get symbols valid in an `ERROR` node, use the
   * lookahead iterator on its first leaf node state. For `MISSING` nodes, a
   * lookahead iterator created on the previous non-extra leaf node may be
   * appropriate.
   */
  lookaheadIterator(e) {
    const A = C._ts_lookahead_iterator_new(this[0], e);
    return A ? new LookaheadIterator(INTERNAL, A, this) : null;
  }
  /**
   * @deprecated since version 0.25.0, call `new` on a {@link Query} instead
   *
   * Create a new query from a string containing one or more S-expression
   * patterns.
   *
   * The query is associated with a particular language, and can only be run
   * on syntax nodes parsed with that language. References to Queries can be
   * shared between multiple threads.
   *
   * @link {@see https://tree-sitter.github.io/tree-sitter/using-parsers/queries}
   */
  query(e) {
    return console.warn("Language.query is deprecated. Use new Query(language, source) instead."), new Query(this, e);
  }
  /**
   * Load a language from a WebAssembly module.
   * The module can be provided as a path to a file or as a buffer.
   */
  static async load(e) {
    let A;
    e instanceof Uint8Array ? A = Promise.resolve(e) : globalThis.process?.versions.node ? A = (await import("fs/promises")).readFile(e) : A = fetch(e).then((k) => k.arrayBuffer().then((P) => {
      if (k.ok)
        return new Uint8Array(P);
      {
        const q = new TextDecoder("utf-8").decode(P);
        throw new Error(`Language.load failed with status ${k.status}.

${q}`);
      }
    }));
    const g = await C.loadWebAssemblyModule(await A, { loadAsync: !0 }), r = Object.keys(g), B = r.find((k) => LANGUAGE_FUNCTION_REGEX.test(k) && !k.includes("external_scanner_"));
    if (!B)
      throw console.log(`Couldn't find language function in WASM file. Symbols:
${JSON.stringify(r, null, 2)}`), new Error("Language.load failed: no language function found in WASM file");
    const F = g[B]();
    return new zA(INTERNAL, F);
  }
}, __name(zA, "Language"), zA), Module2 = (() => {
  var _scriptName = import.meta.url;
  return async function(moduleArg = {}) {
    var moduleRtn, Module = moduleArg, readyPromiseResolve, readyPromiseReject, readyPromise = new Promise((e, A) => {
      readyPromiseResolve = e, readyPromiseReject = A;
    }), ENVIRONMENT_IS_WEB = typeof window == "object", ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope < "u", ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
    if (ENVIRONMENT_IS_NODE) {
      const { createRequire: e } = await import("module");
      var require = e(import.meta.url);
    }
    Module.currentQueryProgressCallback = null, Module.currentProgressCallback = null, Module.currentLogCallback = null, Module.currentParseCallback = null;
    var moduleOverrides = Object.assign({}, Module), arguments_ = [], thisProgram = "./this.program", quit_ = /* @__PURE__ */ __name((e, A) => {
      throw A;
    }, "quit_"), scriptDirectory = "";
    function locateFile(e) {
      return Module.locateFile ? Module.locateFile(e, scriptDirectory) : scriptDirectory + e;
    }
    __name(locateFile, "locateFile");
    var readAsync, readBinary;
    if (ENVIRONMENT_IS_NODE) {
      var fs = require("fs"), nodePath = require("path");
      import.meta.url.startsWith("data:") || (scriptDirectory = nodePath.dirname(require("url").fileURLToPath(import.meta.url)) + "/"), readBinary = /* @__PURE__ */ __name((e) => {
        e = isFileURI(e) ? new URL(e) : e;
        var A = fs.readFileSync(e);
        return A;
      }, "readBinary"), readAsync = /* @__PURE__ */ __name(async (e, A = !0) => {
        e = isFileURI(e) ? new URL(e) : e;
        var g = fs.readFileSync(e, A ? void 0 : "utf8");
        return g;
      }, "readAsync"), !Module.thisProgram && process.argv.length > 1 && (thisProgram = process.argv[1].replace(/\\/g, "/")), arguments_ = process.argv.slice(2), quit_ = /* @__PURE__ */ __name((e, A) => {
        throw process.exitCode = e, A;
      }, "quit_");
    } else (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && (ENVIRONMENT_IS_WORKER ? scriptDirectory = self.location.href : typeof document < "u" && document.currentScript && (scriptDirectory = document.currentScript.src), _scriptName && (scriptDirectory = _scriptName), scriptDirectory.startsWith("blob:") ? scriptDirectory = "" : scriptDirectory = scriptDirectory.slice(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1), ENVIRONMENT_IS_WORKER && (readBinary = /* @__PURE__ */ __name((e) => {
      var A = new XMLHttpRequest();
      return A.open("GET", e, !1), A.responseType = "arraybuffer", A.send(null), new Uint8Array(
        /** @type{!ArrayBuffer} */
        A.response
      );
    }, "readBinary")), readAsync = /* @__PURE__ */ __name(async (e) => {
      if (isFileURI(e))
        return new Promise((g, r) => {
          var B = new XMLHttpRequest();
          B.open("GET", e, !0), B.responseType = "arraybuffer", B.onload = () => {
            if (B.status == 200 || B.status == 0 && B.response) {
              g(B.response);
              return;
            }
            r(B.status);
          }, B.onerror = r, B.send(null);
        });
      var A = await fetch(e, {
        credentials: "same-origin"
      });
      if (A.ok)
        return A.arrayBuffer();
      throw new Error(A.status + " : " + A.url);
    }, "readAsync"));
    var out = Module.print || console.log.bind(console), err = Module.printErr || console.error.bind(console);
    Object.assign(Module, moduleOverrides), moduleOverrides = null, Module.arguments && (arguments_ = Module.arguments), Module.thisProgram && (thisProgram = Module.thisProgram);
    var dynamicLibraries = Module.dynamicLibraries || [], wasmBinary = Module.wasmBinary, wasmMemory, ABORT = !1, EXITSTATUS;
    function assert(e, A) {
      e || abort(A);
    }
    __name(assert, "assert");
    var HEAP8, HEAPU8, HEAP64, HEAP_DATA_VIEW, runtimeInitialized = !1, isFileURI = /* @__PURE__ */ __name((e) => e.startsWith("file://"), "isFileURI");
    function updateMemoryViews() {
      var e = wasmMemory.buffer;
      Module.HEAP_DATA_VIEW = HEAP_DATA_VIEW = new DataView(e), Module.HEAP8 = HEAP8 = new Int8Array(e), Module.HEAP16 = new Int16Array(e), Module.HEAPU8 = HEAPU8 = new Uint8Array(e), Module.HEAPU16 = new Uint16Array(e), Module.HEAP32 = new Int32Array(e), Module.HEAPU32 = new Uint32Array(e), Module.HEAPF32 = new Float32Array(e), Module.HEAPF64 = new Float64Array(e), Module.HEAP64 = HEAP64 = new BigInt64Array(e), Module.HEAPU64 = new BigUint64Array(e);
    }
    if (__name(updateMemoryViews, "updateMemoryViews"), Module.wasmMemory)
      wasmMemory = Module.wasmMemory;
    else {
      var INITIAL_MEMORY = Module.INITIAL_MEMORY || 33554432;
      wasmMemory = new WebAssembly.Memory({
        initial: INITIAL_MEMORY / 65536,
        // In theory we should not need to emit the maximum if we want "unlimited"
        // or 4GB of memory, but VMs error on that atm, see
        // https://github.com/emscripten-core/emscripten/issues/14130
        // And in the pthreads case we definitely need to emit a maximum. So
        // always emit one.
        maximum: 32768
      });
    }
    updateMemoryViews();
    var __RELOC_FUNCS__ = [];
    function preRun() {
      if (Module.preRun)
        for (typeof Module.preRun == "function" && (Module.preRun = [Module.preRun]); Module.preRun.length; )
          addOnPreRun(Module.preRun.shift());
      callRuntimeCallbacks(onPreRuns);
    }
    __name(preRun, "preRun");
    function initRuntime() {
      runtimeInitialized = !0, callRuntimeCallbacks(__RELOC_FUNCS__), wasmExports.__wasm_call_ctors(), callRuntimeCallbacks(onPostCtors);
    }
    __name(initRuntime, "initRuntime");
    function preMain() {
    }
    __name(preMain, "preMain");
    function postRun() {
      if (Module.postRun)
        for (typeof Module.postRun == "function" && (Module.postRun = [Module.postRun]); Module.postRun.length; )
          addOnPostRun(Module.postRun.shift());
      callRuntimeCallbacks(onPostRuns);
    }
    __name(postRun, "postRun");
    var runDependencies = 0, dependenciesFulfilled = null;
    function getUniqueRunDependency(e) {
      return e;
    }
    __name(getUniqueRunDependency, "getUniqueRunDependency");
    function addRunDependency(e) {
      runDependencies++, Module.monitorRunDependencies?.(runDependencies);
    }
    __name(addRunDependency, "addRunDependency");
    function removeRunDependency(e) {
      if (runDependencies--, Module.monitorRunDependencies?.(runDependencies), runDependencies == 0 && dependenciesFulfilled) {
        var A = dependenciesFulfilled;
        dependenciesFulfilled = null, A();
      }
    }
    __name(removeRunDependency, "removeRunDependency");
    function abort(e) {
      Module.onAbort?.(e), e = "Aborted(" + e + ")", err(e), ABORT = !0, e += ". Build with -sASSERTIONS for more info.";
      var A = new WebAssembly.RuntimeError(e);
      throw readyPromiseReject(A), A;
    }
    __name(abort, "abort");
    var wasmBinaryFile;
    function findWasmBinary() {
      return Module.locateFile ? locateFile("tree-sitter.wasm") : new URL("data:application/wasm;base64,AGFzbQEAAAAAEAhkeWxpbmsuMAEFjFsEHgABvwEaYAF/AX9gAn9/AX9gAX8AYAN/f38AYAN/f38Bf2ACf38AYAR/f39/AX9gBX9/f39/AGAAAGAEf39/fwBgBX9/f39/AX9gAAF/YAh/f39/f39/fwF/YAd/f39/f39/AGALf39/f39/f39/f38AYAZ/fH9/f38Bf2ADf35/AX9gBH9+f38Bf2ABfwF+YAJ/fgBgBn9/f39/fwBgBH9/f38BfmADf35/AX5gAnx/AXxgB39/f39/f38Bf2ACfn8BfwLUAxADZW52GHRyZWVfc2l0dGVyX2xvZ19jYWxsYmFjawAFA2Vudhp0cmVlX3NpdHRlcl9wYXJzZV9jYWxsYmFjawAHA2Vudh10cmVlX3NpdHRlcl9wcm9ncmVzc19jYWxsYmFjawABA2VudiN0cmVlX3NpdHRlcl9xdWVyeV9wcm9ncmVzc19jYWxsYmFjawAAFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfY2xvc2UAABZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX3dyaXRlAAYDZW52CV9hYm9ydF9qcwAIFndhc2lfc25hcHNob3RfcHJldmlldzEOY2xvY2tfdGltZV9nZXQAEBZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3NlZWsAEQNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAAA2Vudg9fX3N0YWNrX3BvaW50ZXIDfwEDZW52DV9fbWVtb3J5X2Jhc2UDfwADZW52DF9fdGFibGVfYmFzZQN/AAdHT1QubWVtC19faGVhcF9iYXNlA38BA2VudgZtZW1vcnkCAYAEgIACA2VudhlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAXAAHgOXApUCCAgIAAEBBwECAAAAAAAABAEGAQEEAQIBBAAAAwAAAAIFBQIABQAMAAADCQMDAwEJBw0FAgICAQMSEwQHAwUDBAEUCQMGAgEDDAMHCgACCgkCAgIFAQQAAAAEBAQEAQEBAQEDBQsDBQMBAQUJCgAEAQQBAQEBBQUHBQAAFQAEAAUAAAIEBAQEBAMECwgFAwoGAAIBAQIFAgICAgUCAgICBQAAAAAAAAUAAAAAAAACAgAAAAAAAgABAQUCAgAAAAUFBQICAgIAAgICAgICAgIAAAACAg0AAAAAAAAAAA4ADgAWBAgCBAAFBQQEBQAAAAQGAAQEFxgDAAkZBw8FBgQBAAIBBQEABQABAAACAAsAAAQABAQAAQY5CH8BQbjTAAt/AUGw0wALfwFBvNMAC38BQbTTAAt/AUHw1AALfwFBgNUAC38BQYTbAAt/AUGI2wALB6EhmQERX193YXNtX2NhbGxfY3RvcnMACgZtYWxsb2MAiQIGY2FsbG9jAI0CB3JlYWxsb2MAiwIEZnJlZQCKAgZtZW1jbXAA+AEYdHNfbGFuZ3VhZ2Vfc3ltYm9sX2NvdW50ABMXdHNfbGFuZ3VhZ2Vfc3RhdGVfY291bnQAFBN0c19sYW5ndWFnZV92ZXJzaW9uABUXdHNfbGFuZ3VhZ2VfYWJpX3ZlcnNpb24AFRR0c19sYW5ndWFnZV9tZXRhZGF0YQAWEHRzX2xhbmd1YWdlX25hbWUAFxd0c19sYW5ndWFnZV9maWVsZF9jb3VudAAYFnRzX2xhbmd1YWdlX25leHRfc3RhdGUAGRd0c19sYW5ndWFnZV9zeW1ib2xfbmFtZQAaG3RzX2xhbmd1YWdlX3N5bWJvbF9mb3JfbmFtZQAbB3N0cm5jbXAA+wEXdHNfbGFuZ3VhZ2Vfc3ltYm9sX3R5cGUAHB10c19sYW5ndWFnZV9maWVsZF9uYW1lX2Zvcl9pZAAdGXRzX2xvb2thaGVhZF9pdGVyYXRvcl9uZXcAHxx0c19sb29rYWhlYWRfaXRlcmF0b3JfZGVsZXRlACAhdHNfbG9va2FoZWFkX2l0ZXJhdG9yX3Jlc2V0X3N0YXRlACEbdHNfbG9va2FoZWFkX2l0ZXJhdG9yX3Jlc2V0ACIadHNfbG9va2FoZWFkX2l0ZXJhdG9yX25leHQAIyR0c19sb29rYWhlYWRfaXRlcmF0b3JfY3VycmVudF9zeW1ib2wAJBB0c19wYXJzZXJfZGVsZXRlAD4PdHNfcGFyc2VyX3Jlc2V0AD8WdHNfcGFyc2VyX3NldF9sYW5ndWFnZQBAGHRzX3BhcnNlcl90aW1lb3V0X21pY3JvcwBCHHRzX3BhcnNlcl9zZXRfdGltZW91dF9taWNyb3MAQx10c19wYXJzZXJfc2V0X2luY2x1ZGVkX3JhbmdlcwBEDHRzX3F1ZXJ5X25ldwBVD3RzX3F1ZXJ5X2RlbGV0ZQBaCGlzd3NwYWNlAPcBCGlzd2FsbnVtAPUBFnRzX3F1ZXJ5X3BhdHRlcm5fY291bnQAYBZ0c19xdWVyeV9jYXB0dXJlX2NvdW50AGEVdHNfcXVlcnlfc3RyaW5nX2NvdW50AGIcdHNfcXVlcnlfY2FwdHVyZV9uYW1lX2Zvcl9pZABjInRzX3F1ZXJ5X2NhcHR1cmVfcXVhbnRpZmllcl9mb3JfaWQAZBx0c19xdWVyeV9zdHJpbmdfdmFsdWVfZm9yX2lkAGUfdHNfcXVlcnlfcHJlZGljYXRlc19mb3JfcGF0dGVybgBmH3RzX3F1ZXJ5X3N0YXJ0X2J5dGVfZm9yX3BhdHRlcm4AZx10c19xdWVyeV9lbmRfYnl0ZV9mb3JfcGF0dGVybgBoGnRzX3F1ZXJ5X2lzX3BhdHRlcm5fcm9vdGVkAGkddHNfcXVlcnlfaXNfcGF0dGVybl9ub25fbG9jYWwAaiZ0c19xdWVyeV9pc19wYXR0ZXJuX2d1YXJhbnRlZWRfYXRfc3RlcABrGHRzX3F1ZXJ5X2Rpc2FibGVfY2FwdHVyZQBsGHRzX3F1ZXJ5X2Rpc2FibGVfcGF0dGVybgBtDHRzX3RyZWVfY29weQCLAQ50c190cmVlX2RlbGV0ZQCMAQd0c19pbml0AJQBEnRzX3BhcnNlcl9uZXdfd2FzbQCVARx0c19wYXJzZXJfZW5hYmxlX2xvZ2dlcl93YXNtAJYBFHRzX3BhcnNlcl9wYXJzZV93YXNtAJgBHnRzX3BhcnNlcl9pbmNsdWRlZF9yYW5nZXNfd2FzbQCbAR50c19sYW5ndWFnZV90eXBlX2lzX25hbWVkX3dhc20AnAEgdHNfbGFuZ3VhZ2VfdHlwZV9pc192aXNpYmxlX3dhc20AnQEbdHNfbGFuZ3VhZ2Vfc3VwZXJ0eXBlc193YXNtAJ4BGXRzX2xhbmd1YWdlX3N1YnR5cGVzX3dhc20AnwEWdHNfdHJlZV9yb290X25vZGVfd2FzbQCgASJ0c190cmVlX3Jvb3Rfbm9kZV93aXRoX29mZnNldF93YXNtAKEBEXRzX3RyZWVfZWRpdF93YXNtAKIBHHRzX3RyZWVfaW5jbHVkZWRfcmFuZ2VzX3dhc20AowEfdHNfdHJlZV9nZXRfY2hhbmdlZF9yYW5nZXNfd2FzbQCkARd0c190cmVlX2N1cnNvcl9uZXdfd2FzbQClARh0c190cmVlX2N1cnNvcl9jb3B5X3dhc20ApgEadHNfdHJlZV9jdXJzb3JfZGVsZXRlX3dhc20ApwEZdHNfdHJlZV9jdXJzb3JfcmVzZXRfd2FzbQCoARx0c190cmVlX2N1cnNvcl9yZXNldF90b193YXNtAKkBJHRzX3RyZWVfY3Vyc29yX2dvdG9fZmlyc3RfY2hpbGRfd2FzbQCqASN0c190cmVlX2N1cnNvcl9nb3RvX2xhc3RfY2hpbGRfd2FzbQCrAS50c190cmVlX2N1cnNvcl9nb3RvX2ZpcnN0X2NoaWxkX2Zvcl9pbmRleF93YXNtAKwBMXRzX3RyZWVfY3Vyc29yX2dvdG9fZmlyc3RfY2hpbGRfZm9yX3Bvc2l0aW9uX3dhc20ArQEldHNfdHJlZV9jdXJzb3JfZ290b19uZXh0X3NpYmxpbmdfd2FzbQCuASl0c190cmVlX2N1cnNvcl9nb3RvX3ByZXZpb3VzX3NpYmxpbmdfd2FzbQCvASN0c190cmVlX2N1cnNvcl9nb3RvX2Rlc2NlbmRhbnRfd2FzbQCwAR90c190cmVlX2N1cnNvcl9nb3RvX3BhcmVudF93YXNtALEBKHRzX3RyZWVfY3Vyc29yX2N1cnJlbnRfbm9kZV90eXBlX2lkX3dhc20AsgEpdHNfdHJlZV9jdXJzb3JfY3VycmVudF9ub2RlX3N0YXRlX2lkX3dhc20AswEpdHNfdHJlZV9jdXJzb3JfY3VycmVudF9ub2RlX2lzX25hbWVkX3dhc20AtAErdHNfdHJlZV9jdXJzb3JfY3VycmVudF9ub2RlX2lzX21pc3Npbmdfd2FzbQC1ASN0c190cmVlX2N1cnNvcl9jdXJyZW50X25vZGVfaWRfd2FzbQC2ASJ0c190cmVlX2N1cnNvcl9zdGFydF9wb3NpdGlvbl93YXNtALcBIHRzX3RyZWVfY3Vyc29yX2VuZF9wb3NpdGlvbl93YXNtALgBH3RzX3RyZWVfY3Vyc29yX3N0YXJ0X2luZGV4X3dhc20AuQEddHNfdHJlZV9jdXJzb3JfZW5kX2luZGV4X3dhc20AugEkdHNfdHJlZV9jdXJzb3JfY3VycmVudF9maWVsZF9pZF93YXNtALsBIXRzX3RyZWVfY3Vyc29yX2N1cnJlbnRfZGVwdGhfd2FzbQC8ASx0c190cmVlX2N1cnNvcl9jdXJyZW50X2Rlc2NlbmRhbnRfaW5kZXhfd2FzbQC9ASB0c190cmVlX2N1cnNvcl9jdXJyZW50X25vZGVfd2FzbQC+ARN0c19ub2RlX3N5bWJvbF93YXNtAL8BIXRzX25vZGVfZmllbGRfbmFtZV9mb3JfY2hpbGRfd2FzbQDAASd0c19ub2RlX2ZpZWxkX25hbWVfZm9yX25hbWVkX2NoaWxkX3dhc20AwQEhdHNfbm9kZV9jaGlsZHJlbl9ieV9maWVsZF9pZF93YXNtAMIBIXRzX25vZGVfZmlyc3RfY2hpbGRfZm9yX2J5dGVfd2FzbQDDASd0c19ub2RlX2ZpcnN0X25hbWVkX2NoaWxkX2Zvcl9ieXRlX3dhc20AxAEbdHNfbm9kZV9ncmFtbWFyX3N5bWJvbF93YXNtAMUBGHRzX25vZGVfY2hpbGRfY291bnRfd2FzbQDGAR50c19ub2RlX25hbWVkX2NoaWxkX2NvdW50X3dhc20AxwESdHNfbm9kZV9jaGlsZF93YXNtAMgBGHRzX25vZGVfbmFtZWRfY2hpbGRfd2FzbQDJAR50c19ub2RlX2NoaWxkX2J5X2ZpZWxkX2lkX3dhc20AygEZdHNfbm9kZV9uZXh0X3NpYmxpbmdfd2FzbQDLARl0c19ub2RlX3ByZXZfc2libGluZ193YXNtAMwBH3RzX25vZGVfbmV4dF9uYW1lZF9zaWJsaW5nX3dhc20AzQEfdHNfbm9kZV9wcmV2X25hbWVkX3NpYmxpbmdfd2FzbQDOAR10c19ub2RlX2Rlc2NlbmRhbnRfY291bnRfd2FzbQDPARN0c19ub2RlX3BhcmVudF93YXNtANABInRzX25vZGVfY2hpbGRfd2l0aF9kZXNjZW5kYW50X3dhc20A0QEhdHNfbm9kZV9kZXNjZW5kYW50X2Zvcl9pbmRleF93YXNtANIBJ3RzX25vZGVfbmFtZWRfZGVzY2VuZGFudF9mb3JfaW5kZXhfd2FzbQDTASR0c19ub2RlX2Rlc2NlbmRhbnRfZm9yX3Bvc2l0aW9uX3dhc20A1AEqdHNfbm9kZV9uYW1lZF9kZXNjZW5kYW50X2Zvcl9wb3NpdGlvbl93YXNtANUBGHRzX25vZGVfc3RhcnRfcG9pbnRfd2FzbQDWARZ0c19ub2RlX2VuZF9wb2ludF93YXNtANcBGHRzX25vZGVfc3RhcnRfaW5kZXhfd2FzbQDYARZ0c19ub2RlX2VuZF9pbmRleF93YXNtANkBFnRzX25vZGVfdG9fc3RyaW5nX3dhc20A2gEVdHNfbm9kZV9jaGlsZHJlbl93YXNtANsBG3RzX25vZGVfbmFtZWRfY2hpbGRyZW5fd2FzbQDcASB0c19ub2RlX2Rlc2NlbmRhbnRzX29mX3R5cGVfd2FzbQDdARV0c19ub2RlX2lzX25hbWVkX3dhc20A3gEYdHNfbm9kZV9oYXNfY2hhbmdlc193YXNtAN8BFnRzX25vZGVfaGFzX2Vycm9yX3dhc20A4AEVdHNfbm9kZV9pc19lcnJvcl93YXNtAOEBF3RzX25vZGVfaXNfbWlzc2luZ193YXNtAOIBFXRzX25vZGVfaXNfZXh0cmFfd2FzbQDjARh0c19ub2RlX3BhcnNlX3N0YXRlX3dhc20A5AEddHNfbm9kZV9uZXh0X3BhcnNlX3N0YXRlX3dhc20A5QEVdHNfcXVlcnlfbWF0Y2hlc193YXNtAOYBFnRzX3F1ZXJ5X2NhcHR1cmVzX3dhc20A6AEGbWVtc2V0AO4BBm1lbWNweQDyAQdtZW1tb3ZlAJsCCGlzd2FscGhhAPYBCGlzd2JsYW5rAJgCCGlzd2RpZ2l0AJMCCGlzd2xvd2VyAJcCCGlzd3VwcGVyAJoCCWlzd3hkaWdpdACdAgZtZW1jaHIA/AEGc3RybGVuAPoBBnN0cmNtcACeAgdzdHJuY2F0AJkCB3N0cm5jcHkAnAIIdG93bG93ZXIAkAIIdG93dXBwZXIAkgIIc2V0VGhyZXcAjwIZX2Vtc2NyaXB0ZW5fc3RhY2tfcmVzdG9yZQCUAhdfZW1zY3JpcHRlbl9zdGFja19hbGxvYwCVAhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AJYCGF9fd2FzbV9hcHBseV9kYXRhX3JlbG9jcwALCAEMCTMBACMCCx4lJicoKSpKe318fniHAQ0OD4oCjQGOAY8BlwGZAZoB5wHpAesB6gGEAoUChwIMAQEKjIsLlQIgAQJ/IwEiAEGE1gBqIgEgAEHs1QBqNgJgIAFBKjYCGAvkAQAjAUGw0wBq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AgARAgAgAUEANgIgIAFCADcCGAsgASgCMCABQSRqIgggASgCNBBBIAEoAgQiAwRAA0AgASgCACAFQQV0aiICKAIABEAgASgCNCEHIAIoAgwEQCAGIAIpAgw3AwggByAGQQhqEDwLIAIoAhQEQCAGIAIpAhQ3AwAgByAGEDwLIAIoAgQiAwRAIAMoAgAiCgR/IAojBigCABECACADQQA2AgggA0IANwIAIAIoAgQFIAMLIwYoAgARAgALIAIoAgAgCCAHEEEgASgCBCEDCyAFQQFqIgUgA0kNAAsLQQAhAyABQQA2AgQCQCABKAIkIgVFDQAgASgCKARAA0AgASgCJCADQQJ0aigCACMGKAIAEQIAIANBAWoiAyABKAIoSQ0ACyAIKAIAIgVFDQELIAUjBigCABECACABQQA2AiwgAUIANwIkCyABKAIAIgIEQCACIwYoAgARAgAgAUEANgIIIAFCADcCAAsgASMGKAIAEQIAIAZBEGokACAAKAKoCSIBBEAgASMGKAIAEQIAIABBADYCsAkgAEIANwKoCQsgACgCvAoiAQRAIAEjBigCABECACAAQQA2AsQKIABCADcCvAoLIAAoArQKBEAgBCAAQbQKaikCADcDGCAAQYgJaiAEQRhqEDwgAEIANwK0CgsgACgCRCMGKAIAEQIAIABB4AlqIQEgACgC4AkEQCAEIAEpAgA3AxAgAEGICWogBEEQahA8CyAAKALoCQRAIAQgAEHoCWopAgA3AwggAEGICWogBEEIahA8CyABQgA3AgAgAUEANgIQIAFCADcCCAJAIAAoAogJIgFFDQAgACgCjAkEQANAIAAoAogJIAlBA3RqKAIAIwYoAgARAgAgCUEBaiIJIAAoAowJSQ0ACyAAKAKICSIBRQ0BCyABIwYoAgARAgAgAEEANgKQCSAAQgA3AogJCyAAKAKUCSIBBEAgASMGKAIAEQIAIABBADYCnAkgAEIANwKUCQsgACgC9AkiAQRAIAEjBigCABECACAAQQA2AvwJIABCADcC9AkLIAAoArwJIgEEQCABIwYoAgARAgAgAEEANgLECSAAQgA3ArwJCyAAKALICSIBBEAgASMGKAIAEQIAIABBADYC0AkgAEIANwLICQsgACgC1AkiAQRAIAEjBigCABECACAAQQA2AtwJIABCADcC1AkLIAAjBigCABEC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IBBLDQALDAALAAsgE0EBaiITIAMoAgQiDU8NASADKAIQIQQMAAsACyALIAMoAgg2AhAgCyADKQIANwMIIAMgEigCCDYCCCADIBIpAgA3AgAgEiALKAIQNgIIIBIgCykDCDcCAAsgJEEBaiIkQYACRw0ACyADQQE6AEgLIAtB0ABqJAALpQQBBH8gAARAIAAoAjwiAQRAIAEjBigCABECACAAQQA2AkQgAEIANwI8CyAAKAJIIgEEQCABIwYoAgARAgAgAEEANgJQIABCADcCSAsgACgCVCIBBEAgASMGKAIAEQIAIABBADYCXCAAQgA3AlQLIAAoAmAiAQRAIAEjBigCABECACAAQQA2AmggAEIANwJgCyAAKAJsIgEEQCABIwYoAgARAgAgAEEANgJ0IABCADcCbAsgACgChAEiAQRAIAEjBigCABECACAAQQA2AowBIABCADcChAELIAAoAngiAQRAIAEjBigCABECACAAQQA2AoABIABCADcCeAsgACgCkAEiAQRAIAEjBigCABECACAAQQA2ApgBIABCADcCkAELIAAoAgAiAQRAIAEjBigCABECACAAQQA2AgggAEIANwIACyAAKAIMIgEEQCABIwYoAgARAgAgAEEANgIUIABCADcCDAsgACgCGCIBBEAgASMGKAIAEQIAIABBADYCICAAQgA3AhgLIAAoAiQiAQRAIAEjBigCABECACAAQQA2AiwgAEIANwIkCyAAKAI0IgIEQEEAIQEDQCAAKAIwIAFBDGxqIgMoAgAiBARAIAQjBigCABECACADQQA2AgggA0IANwIAIAAoAjQhAgsgAUEBaiIBIAJJDQALCyAAKAIwIgEEQCABIwYoAgARAgAgAEEANgI4IABCADcCMAsgACMGKAIAEQIACwtuAQN/IAAoAgRBAWoiASAAKAIIIgJLBEBBCCACQQF0IgIgASABIAJJGyIBIAFBCE0bIgJBFGwhAQJ/IAAoAgAiAwRAIAMgASMEKAIAEQEADAELIAEjBSgCABEAAAshASAAIAI2AgggACABNgIACwvLAwEGfwNAIAAgACgCACAALQAQaiIENgIAAkACQCAAKAIIIgUgBEsEQCAAIAQsAAAiAUH/AXEiAjYCDEEBIQMgAUEASARAAkAgBSAEayIFQQFGDQACQCABQWBPBEACQCABQW9NBEAgACAC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IAQpAwg3AiggAiAEKQMQNwIMIAIgBCkDGDcCFCACIAE2AgggAiACKAIINgIcIAIvARghACACQQA2AiQgAiAAOwEsIAIoAiAhACACKAIMIQUCQAJAIAIoAhAiASACKAIoSwRAIAFBHGwhAwJ/IAAEQCAAIAMjBCgCABEBAAwBCyADIwUoAgARAAALIQAgAiABNgIoIAIgADYCICACKAIkIgNFDQEgA0EcbCIDRQ0BIAAgAUEcbGogACAD/AoAAAwBCyABRQ0BCyABQRxsIQMgBQRAIANFDQEgACAFIAP8CgAADAELIANFDQAgAEEAIAP8CwALIAIgAigCJCABajYCJCAEIAIpAiA3AwAgBCACKQIoNwMIIAJBMGokAAtRAQJ/IwBBIGsiASQAIAEgADYCDCABIwkiACkDADcCECABIAApAwg3AhggAUEMahCDASECIAAgASkCEDcDACAAIAEpAhg3AwggAUEgaiQAIAILZAEDfyMAQSBrIgEkACABIAA2AgwgASMJIgApAwA3AhAgASAAKQMINwIYIAFBDGohAgNAIAIQhAEiA0EBRg0ACyADQQJGIQIgACABKQIQNwMAIAAgASkCGDcDCCABQSBqJAAgAgtrAgJ/AX4jAEEgayIBJAAgASAANgIMIAEjCSIAKAIANgIQIAEgACkCBDcCFCABIAAoAgwiAjYCHCABQQxqIAJBAXRBAEEAEIUBIQMgACABKQIQNwMAIAAgASkCGDcDCCABQSBqJAAgA0IAUguMAQICfwF+IwBBMGsiASQAIAEgADYCHCABIwkiACgCADYCICABIAApAgQ3AiQgASAAKAIMIgI2AiwgASAAKAIQQQF0NgIYIAEgAjYCFCABIAEpAhQ3AwggAUEcakEAIAEoAgggASgCDBCFASEDIAAgASkCIDcDACAAIAEpAig3AwggAUEwaiQAIANCAFILUQECfyMAQSBrIgEkACABIAA2AgwgASMJIgApAwA3AhAgASAAKQMINwIYIAFBDGoQhgEhAiAAIAEpAhA3AwAgACABKQIYNwMIIAFBIGokACACC/gEAg1/AX4jAEEgayIGJAAgBiAANgIMIAYjCSIJKQMANwIQIAYgCSkDCDcCGEEBIQsCQCAGQQxqIgojAkEMahB5Ig1FDQAgCigCBCAKKAIIQRxsaiIAQRhrIgIoAgANACAAQRBrKAIARQ0AIABBDGsoAgAhByAAQThrKAIAIgEtAABBAXFFBEAgASgCACIBIAEoAiRBA3RrIQMLIABBMGspAgAhDiAAQTRrKAIAIQEgAiAHBH8CfyADKAAAIgJBAXEEQCABIAMtAAciAmohCCAOQiCIpyEEIA6nDAELQQAgDkIgiKcgAigCFCIFGyEEIAIoAhAgAWohCCACKAIYIQIgBSAOp2oLrSACIARqrUIghoQhDkEBIQIgB0EBRwRAA0ACQCADIAJBA3RqIgQoAAAiAUEBcQRAIAQtAAciASAELQAGaiEMIAQtAAVBD3EhBSAELQAEIQQMAQtBACABKAIMIAEoAhQiBRshBCABKAIQIAEoAgRqIQwgBSABKAIIaiEFIAEoAhghAQsgBSAOp2qtIAEgBGpBACAOQiCIpyAFG2qtQiCGhCEOIAggDGohCCACQQFqIgIgB0cNAAsLAn8gAyAHQQN0aiICKAAAIgNBAXEEQCACLQAFQQ9xIQEgAi0ABCEFIAItAAYMAQsgAygCDCEFIAMoAgghASADKAIECyECIAEgDqdqrUEAIA5CIIinIAEbIAVqrUIghoQhDiACIAhqBSABCzYCACAAQRRrIA43AgALAkACQAJAIA1BAWsOAgACAQsDQCAKEIQBQQFGDQALDAELQQAhCwsgCSAGKQIQNwMAIAkgBikCGDcDCCAGQSBqJAAgCwvECQIYfwF+IwBBIGsiBCQAIAQgADYCDCAEIwkiECkDADcCECAEIBApAwg3AhggASEMIAQoAhQhACAEKAIQIQgDQCAIIABBAWsiBkEcbGoiCSgCGCECIAkoAgAoAAAhBwJAAkAgBkUEQEEBIQEgB0EBcUUNAUEAIQUMAgsCQAJ/IAdBAXEiAwRAIAdBAnEEQEEAIQVBASEBDAULIAdBA3ZBAXEMAQtBASEBIAcvASwiBUEBcQ0CIAVBAnZBAXELDQAgCUEcaygCACgCAC8BQiIBRQ0AQQAhBSAEKAIMKAIIIgooAlQgCi8BJCABbEEBdGogCSgCFEEBdGovAQBBAEchASADRQ0BDAILQQAhAUEAIQUgAw0BCyAHKAIkRQRAQQAhBQwBCyAHKAI4IQULAkACQCACIAxLDQAgASACaiAFaiAMTQ0AA0AgBCgCECILIAQoAhQiDkEcbGoiBkEcaygCACgAACIAQQFxIgcNAiAAKAIkRQ0CIAQoAgwoAgghASAALwFCIgUEfyABKAJUIAEvASQgBWxBAXRqBUEACyESIAZBBGsoAgAhAgJAAkAgDkEBayIFRQ0AIAAvASwiCUEBcQ0AIAlBBHENASALIAVBHGxqIgVBHGsoAgAoAgAvAUIiCUUNASACIAEoAlQgAS8BJCAJbEEBdGogBSgCFEEBdGovAQBBAEdqIQIMAQsgAkEBaiECCyACIAxLDQJBACEBQQAgACAAKAIkIhNBA3RrIhggBxshGSAGQRhrKAIAIQMgBkEUaygCACEAIAZBEGsoAgAhCEEAIQkDQCACIQogCSEGIAghByAAIQUgAyEUIAEiFSATRg0DAn8gGSABQQN0aiIWKAAAIgNBAXEiAARAIANBAnFBAXYiDyECIANBA3ZBAXEMAQsgAy8BLCIPQQFxIQIgD0ECdkEBcQsEfyAGBSASBEAgEiAGQQF0ai8BACACckEARyIPIQILIAZBAWoLIQkCQAJ/AkAgAEUEQCADKAIkDQFBAAwCCyACIApqIQIgBSEAIBYtAAciAyEIIAchAQwCCyADKAI4CyEAQQAgByADKAIUIggbIQEgAiAKaiAAaiECIAUgCGohACADKAIYIQggAygCECEDCyABIAhqIQggAyAUaiEDIBMgFUEBaiIBSwRAAn8gGCABQQN0aikCACIapyINQQFxBEAgGkIgiKdB/wFxIRcgGkIoiKdBD3EhESAaQjCIp0H/AXEMAQsgDSgCDCEXIA0oAgghESANKAIECyENQQAgCCARGyAXaiEIIAMgDWohAyAAIBFqIQALIAIgDE0NAAsgBCAOQQFqIgAgBCgCGCIBSwR/QQggAUEBdCIBIAAgACABSRsiACAAQQhNGyIBQRxsIQACfyALBEAgCyAAIwQoAgARAQAMAQsgACMFKAIAEQAACyELIAQgATYCGCAEIAs2AhAgBCgCFCIOQQFqBSAACzYCFCALIA5BHGxqIgAgCjYCGCAAIAY2AhQgACAVNgIQIAAgBzYCDCAAIAU2AgggACAUNgIEIAAgFjYCACAPIAogDEZxRQ0ACwwBCyAAQQJJDQAgBCAGNgIUIAYhAAwBCwsgECAEKQIQNwMAIBAgBCkCGDcDCCAEQSBqJAALUQECfyMAQSBrIgEkACABIAA2AgwgASMJIgApAwA3AhAgASAAKQMINwIYIAFBDGoQiAEhAiAAIAEpAhA3AwAgACABKQIYNwMIIAFBIGokACACC2kBAX8jAEHQAGsiASQAIAEgADYCPCABIwkiACkDADcCQCABIAApAwg3AkggAUEkaiABQTxqEIkBIAEgASkCNDcDGCABIAEpAiw3AxAgASABKQIkNwMIIAFBCGoQLyEAIAFB0ABqJAAgAAtpAQF/IwBB0ABrIgEkACABIAA2AjwgASMJIgApAwA3AkAgASAAKQMINwJIIAFBJGogAUE8ahCJASABIAEpAjQ3AxggASABKQIsNwMQIAEgASkCJDcDCCABQQhqEDIhACABQdAAaiQAIAALaQEBfyMAQdAAayIBJAAgASAANgI8IAEjCSIAKQMANwJAIAEgACkDCDcCSCABQSRqIAFBPGoQiQEgASABKQI0NwMYIAEgASkCLDcDECABIAEpAiQ3AwggAUEIahAxIQAgAUHQAGokACAAC4oBAQF/IwBB0ABrIgEkACABIAA2AjwgASMJIgApAwA3AkAgASAAKQMINwJIIAFBJGogAUE8ahCJASABIAEpAjQ3AxggASABKQIsNwMQIAEgASkCJDcDCAJ/IAEoAhgoAgAiAEEBcQRAIABBBXZBAXEMAQsgAC8BLEEJdkEBcQshACABQdAAaiQAIAALRwEBfyMAQTBrIgEkACABIAA2AhwgASMJIgApAwA3AiAgASAAKQMINwIoIAFBBGogAUEcahCJASABKAIUIQAgAUEwaiQAIAALiQEBAX8jAEHQAGsiASQAIAEgADYCPCABIwkiACkDADcCQCABIAApAwg3AkggAUEkaiABQTxqEIkBIAEgASkCNDcDECABIAEpAiw3AwggASABKQIkNwMAIAEgASgCBDYCHCABIAEoAgg2AiAgACABKAIcNgIAIAAgASgCIEEBdjYCBCABQdAAaiQAC34BAX8jAEHQAGsiASQAIAEgADYCPCABIwkiACkDADcCQCABIAApAwg3AkggAUEkaiABQTxqEIkBIAEgASkCNDcDECABIAEpAiw3AwggASABKQIkNwMAIAFBHGogARAuIAAgASgCHDYCACAAIAEoAiBBAXY2AgQgAUHQAGokAAtqAQF/IwBB0ABrIgEkACABIAA2AjwgASMJIgApAwA3AkAgASAAKQMINwJIIAFBJGogAUE8ahCJASABIAEpAjQ3AxggASABKQIsNwMQIAEgASkCJDcDCCABKAIIIQAgAUHQAGokACAAQQF2C2wBAX8jAEHQAGsiASQAIAEgADYCPCABIwkiACkDADcCQCABIAApAwg3AkggAUEkaiABQTxqEIkBIAEgASkCNDcDGCABIAEpAiw3AxAgASABKQIkNwMIIAFBCGoQLSEAIAFB0ABqJAAgAEEBdgs9AQF/IwBBIGsiASQAIAEgADYCDCABIwkiACkDADcCECABIAApAwg3AhggAUEMahCKASEAIAFBIGokACAAC/MBAQd/IwBBIGsiASQAIAEgADYCDCABIwkiACkDADcCECABIAApAwg3AhhBACEAIAEoAhQiBUECTwRAIAEoAhAhBkEBIQMDQAJAAn8CQAJAIAYgA0EcbGoiBCgCACgAACICQQFxBEAgAkECcQ0BIAJBA3ZBAXEMAwsgAi8BLCICQQFxRQ0BCyAAQQFqIQAMAgsgAkECdkEBcQsNACAEQRxrKAIAKAIALwFCIgJFDQAgACABKAIMKAIIIgcoAlQgBy8BJCACbEEBdGogBCgCFEEBdGovAQBBAEdqIQALIANBAWoiAyAFRw0ACwsgAUEgaiQAIAALSQEBfyMAQSBrIgEkACABIAA2AgwgASMJIgApAwA3AhAgASAAKQMINwIYIAEoAhAgASgCFEEcbGpBBGsoAgAhACABQSBqJAAgAAt2AQF/IwBBMGsiASQAIAEgADYCHCABIwkiACkDADcCICABIAApAwg3AiggAUEEaiABQRxqEIkBIAAgASgCEDYCECAAIAEoAgg2AgggACABKAIUNgIAIAAgASgCDEEBdjYCDCAAIAEoAgRBAXY2AgQgAUEwaiQAC3sBAn8jAEEwayIBJAAgASMJIgIoAgA2AiggASACKAIMQQF0NgIgIAEgADYCLCABIAEpAig3AxAgASACKAIQNgIkIAEgASkCIDcDCCABIAIoAgg2AhwgASACKAIEQQF0NgIYIAEgASkCGDcDACABEC8hACABQTBqJAAgAAurBwENfyMAQTBrIgMkACADIwkiBCgCADYCKCADIAQoAgxBAXQ2AiAgAyAANgIsIAMgAykCKDcDECADIAQoAhA2AiQgAyADKQIgNwMIIAMgBCgCCDYCHCADIAQoAgRBAXQ2AhggAyADKQIYNwMAAn8CQCADKAIQIgAoAgAiAkEBcQ0AIAMoAhQhDANAIAAhBCACKAIkRQ0BQQAhCSACLwFCIgAEQCAMKAIIIgUoAlQgBS8BJCAAbEEBdGohCQsgAigCJCINRQ0BAn8gAiANQQN0ayIAKAAAIgJBAXEiBUUEQCACLwEsQQJ2QQFxDAELIAJBA3ZBAXELIgdFIQhBACEGAkAgBw0AIAlFDQAgCS8BAEEARyEGQQEhCAsCQAJAAkACfyAFRQRAIAIvASxBAXEMAQsgAkEBdkEBcQsgBnJBAXFFBEBBACEGIAAoAgAiBUEBcQ0BIAUoAiRFDQEgASAFKAIwIgZPDQEMAgtBASEGIAFFDQILQQEhDiANQQFGDQMDQEEAIQcCfyAAIA5BA3RqIgUoAAAiAkEBcSILBEAgAkEDdkEBcQwBCyACLwEsQQJ2QQFxC0UEQCAJBH8gCSAIQQF0ai8BAEEARwVBAAshByAIQQFqIQgLAn8gCwR/IAJBAXZBAXEFIAIvASxBAXELIAdyBEAgASAGRg0EIAZBAWoMAQtBACECAkAgBSgCACILQQFxDQAgCygCJEUNACABIAZrIgcgCygCMCICTw0AIAUhACAHIQEMAwsgAiAGagshBiAOQQFqIg4gDUcNAAsMAwsCf0EAIAwoAggiBSgCIEUNABpBACAFKAJAIAQoAgAvAUJBAnRqIgQvAQIiB0UNABogCEEBayEGIAUoAkQgBC8BAEECdGoiAiAHQQJ0aiEEA0ACQCACLQADDQAgBiACLQACRw0AIAUoAjwgAi8BAEECdGooAgAMAgsgAkEEaiICIARHDQALQQALIgQgCiAEGyEKIAAoAgAiAkEBcUUNAQwCCwsgAkEBcQR/IAJBA3ZBAXEFIAIvASxBAnZBAXELDQACQCAMKAIIIgAoAiBFDQAgACgCQCAEKAIALwFCQQJ0aiIBLwECIgRFDQAgCEEBayEFIAAoAkQgAS8BAEECdGoiAiAEQQJ0aiEBA0ACQCACLQADDQAgBSACLQACRw0AIAAoAjwgAi8BAEECdGooAgAiACAKIAAbDAQLIAJBBGoiAiABRw0ACwsgCgwBC0EACyEAIANBMGokACAAC7EIAQ1/IwBBMGsiBiQAIAYjCSIHKAIANgIoIAYgBygCDEEBdDYCICAGIAA2AiwgBiAGKQIoNwMQIAYgBygCEDYCJCAGIAYpAiA3AwggBiAHKAIINgIcIAYgBygCBEEBdDYCGCAGIAYpAhg3AwACfwJAIAYoAhAiACgCACICQQFxDQAgBigCFCELA0AgACEHIAIoAiRFDQFBACEKIAIvAUIiAARAIAsoAggiBCgCVCAELwEkIABsQQF0aiEKCyACKAIkIg5FDQECfyACIA5BA3RrIgAoAAAiA0EBcSIERQRAIAMvASxBAnZBAXEMAQsgA0EDdkEBcQsiAkUhCEEAIQUCQCACDQAgCkUNACAKLwEAIQVBASEICwJAAkACQAJAAkACQCAFQf7/A2sOAgECAAsgBUUEQCAERQRAIAMvASwiBEEBcUUNAiAEQQF2QQFxRQ0CDAMLIANBAnFFDQEgA0ECdkEBcQ0CDAELIAsoAggoAkggBUEDbGotAAFBAXENAQtBACEJIAAoAgAiBEEBcQ0BIAQoAiRFDQEgASAEKAI0IglJDQIMAQtBASEJIAFFDQILQQEhAiAOQQFGDQMDQEEAIQUCfyAAIAJBA3RqIgQoAAAiA0EBcSINBEAgA0EDdkEBcQwBCyADLwEsQQJ2QQFxC0UEQCAKBH8gCiAIQQF0ai8BAAVBAAshBSAIQQFqIQgLAn8CQAJAAkAgBUH+/wNrDgICAQALAkAgBUUEQCANRQ0BIANBAnFFDQMgA0ECdkEBcQ0CDAMLIAsoAggoAkggBUEDbGotAAFBAXFFDQIMAQsgAy8BLCIFQQFxRQ0BIAVBAXZBAXFFDQELIAEgCUYNBCAJQQFqDAELQQAhBQJAIAQoAgAiDUEBcQ0AIA0oAiRFDQAgASAJayIDIA0oAjQiBU8NACAEIQAgAyEBDAMLIAUgCWoLIQkgAkEBaiICIA5HDQALDAMLAn9BACALKAIIIgQoAiBFDQAaQQAgBCgCQCAHKAIALwFCQQJ0aiIHLwECIgNFDQAaIAhBAWshBSAEKAJEIAcvAQBBAnRqIgIgA0ECdGohBwNAAkAgAi0AAw0AIAUgAi0AAkcNACAEKAI8IAIvAQBBAnRqKAIADAILIAJBBGoiAiAHRw0AC0EACyIHIAwgBxshDCAAKAIAIgJBAXFFDQEMAgsLIANBAXEEfyADQQN2QQFxBSADLwEsQQJ2QQFxCw0AAkAgCygCCCIAKAIgRQ0AIAAoAkAgBygCAC8BQkECdGoiAS8BAiIHRQ0AIAhBAWshBCAAKAJEIAEvAQBBAnRqIgIgB0ECdGohAQNAAkAgAi0AAw0AIAQgAi0AAkcNACAAKAI8IAIvAQBBAnRqKAIAIgAgDCAAGwwECyACQQRqIgIgAUcNAAsLIAwMAQtBAAshACAGQTBqJAAgAAuTBAEJfyMAQYABayICJAAgAiMJIgMoAgA2AnggAiADKAIMQQF0NgJwIAIgADYCfCACIAIpAng3AzAgAiADKAIQNgJ0IAIgAikCcDcDKCACIAMoAgg2AmwgAiADKAIEQQF0NgJoIAIgAikCaDcDICACQdQAaiACQSBqEIIBAkAgAUUEQEEAIQMMAQsgAiACKQJ4NwMYIAIgAikCcDcDECACIAIpAmg3AwggAkHUAGoiACACQQhqEHAgABCDARpBACEAQQAhAwNAIAMhBAJAA0AgAkHUAGoiAxCKASABRg0BIAMQhgENAAsgBCEDDAILIAJBPGogAkHUAGoiAxCJASADEIYBIQcCQCAEQQVqIgMgAE0NAEEIIABBAXQiACADIAAgA0sbIgAgAEEITRsiAEECdCEGIAUEQCAFIAYjBCgCABEBACEFDAELIAYjBSgCABEAACEFCyAFIARBAnRqIgRCADcCACAEQQA2AhAgBEIANwIIIAIoAjwhBiACKAJEIQggAigCTCEJIAIoAkAhCiAFIANBAnRqIgRBBGsgAigCSDYCACAEQQxrIAo2AgAgBEEUayAJNgIAIARBCGsgCEEBdjYCACAEQRBrIAZBAXY2AgAgBw0ACwsgAigCWCIABEAgACMGKAIAEQIAIAJBADYCYCACQgA3AlgLIwkiACAFNgIEIAAgA0EFbjYCACACQYABaiQAC/oBAQN/IwBB0ABrIgEkACABIwkiAigCADYCSCABQUBrIgMgAigCDEEBdDYCACABIAA2AkwgASABKQJINwMYIAEgAigCEDYCRCABIAMpAgA3AxAgASACKAIINgI8IAEgAigCBEEBdDYCOCABIAEpAjg3AwggAigCFEEBdCEDIwBBIGsiACQAIAAgASkCGDcDGCAAIAEpAhA3AxAgACABKQIINwMIIAFBIGogAEEIaiADQQEQOSAAQSBqJAAgAiABKAIsNgIQIAIgASgCJDYCCCACIAEoAjA2AgAgAiABKAIoQQF2NgIMIAIgASgCIEEBdjYCBCABQdAAaiQAC/oBAQN/IwBB0ABrIgEkACABIwkiAigCADYCSCABQUBrIgMgAigCDEEBdDYCACABIAA2AkwgASABKQJINwMYIAEgAigCEDYCRCABIAMpAgA3AxAgASACKAIINgI8IAEgAigCBEEBdDYCOCABIAEpAjg3AwggAigCFEEBdCEDIwBBIGsiACQAIAAgASkCGDcDGCAAIAEpAhA3AxAgACABKQIINwMIIAFBIGogAEEIaiADQQAQOSAAQSBqJAAgAiABKAIsNgIQIAIgASgCJDYCCCACIAEoAjA2AgAgAiABKAIoQQF2NgIMIAIgASgCIEEBdjYCBCABQdAAaiQAC6ABAQJ/IwBBMGsiASQAIAEjCSICKAIANgIoIAEgAigCDEEBdDYCICABIAA2AiwgASABKQIoNwMQIAEgAigCEDYCJCABIAEpAiA3AwggASACKAIINgIcIAEgAigCBEEBdDYCGCABIAEpAhg3AwACfyABKAIQKAIAIgBBAXEEQCAAQYD+A3FBCHYMAQsgAC8BKAtB//8DcSEAIAFBMGokACAAC5oBAQJ/IwBBMGsiASQAIAEjCSICKAIANgIoIAEgAigCDEEBdDYCICABIAA2AiwgASABKQIoNwMQIAEgAigCEDYCJCABIAEpAiA3AwggASACKAIINgIcIAEgAigCBEEBdDYCGCABIAEpAhg3AwBBACEAAkAgASgCECgCACICQQFxDQAgAigCJEUNACACKAIwIQALIAFBMGokACAAC5oBAQJ/IwBBMGsiASQAIAEjCSICKAIANgIoIAEgAigCDEEBdDYCICABIAA2AiwgASABKQIoNwMQIAEgAigCEDYCJCABIAEpAiA3AwggASACKAIINgIcIAEgAigCBEEBdDYCGCABIAEpAhg3AwBBACEAAkAgASgCECgCACICQQFxDQAgAigCJEUNACACKAI0IQALIAFBMGokACAAC/ABAQN/IwBB0ABrIgIkACACIwkiAygCADYCSCACQUBrIgQgAygCDEEBdDYCACACIAA2AkwgAiACKQJINwMYIAIgAygCEDYCRCACIAQpAgA3AxAgAiADKAIINgI8IAIgAygCBEEBdDYCOCACIAIpAjg3AwgjAEEgayIAJAAgACACKQIYNwMYIAAgAikCEDcDECAAIAIpAgg3AwggAkEgaiAAQQhqIAFBARA0IABBIGokACADIAIoAiw2AhAgAyACKAIkNgIIIAMgAigCMDYCACADIAIoAihBAXY2AgwgAyACKAIgQQF2NgIEIAJB0ABqJAAL8AEBA38jAEHQAGsiAiQAIAIjCSIDKAIANgJIIAJBQGsiBCADKAIMQQF0NgIAIAIgADYCTCACIAIpAkg3AxggAiADKAIQNgJEIAIgBCkCADcDECACIAMoAgg2AjwgAiADKAIEQQF0NgI4IAIgAikCODcDCCMAQSBrIgAkACAAIAIpAhg3AxggACACKQIQNwMQIAAgAikCCDcDCCACQSBqIABBCGogAUEAEDQgAEEgaiQAIAMgAigCLDYCECADIAIoAiQ2AgggAyACKAIwNgIAIAMgAigCKEEBdjYCDCADIAIoAiBBAXY2AgQgAkHQAGokAAvFAQEDfyMAQdAAayICJAAgAiMJIgMoAgA2AkggAkFAayIEIAMoAgxBAXQ2AgAgAiAANgJMIAIgAikCSDcDGCACIAMoAhA2AkQgAiAEKQIANwMQIAIgAygCCDYCPCACIAMoAgRBAXQ2AjggAiACKQI4NwMIIAJBIGogAkEIaiABQf//A3EQNSADIAIoAiw2AhAgAyACKAIkNgIIIAMgAigCMDYCACADIAIoAihBAXY2AgwgAyACKAIgQQF2NgIEIAJB0ABqJAAL7gEBA38jAEHQAGsiASQAIAEjCSICKAIANgJIIAFBQGsiAyACKAIMQQF0NgIAIAEgADYCTCABIAEpAkg3AxggASACKAIQNgJEIAEgAykCADcDECABIAIoAgg2AjwgASACKAIEQQF0NgI4IAEgASkCODcDCCMAQSBrIgAkACAAIAEpAhg3AxggACABKQIQNwMQIAAgASkCCDcDCCABQSBqIABBCGpBARA2IABBIGokACACIAEoAiw2AhAgAiABKAIkNgIIIAIgASgCMDYCACACIAEoAihBAXY2AgwgAiABKAIgQQF2NgIEIAFB0ABqJAAL7gEBA38jAEHQAGsiASQAIAEjCSICKAIANgJIIAFBQGsiAyACKAIMQQF0NgIAIAEgADYCTCABIAEpAkg3AxggASACKAIQNgJEIAEgAykCADcDECABIAIoAgg2AjwgASACKAIEQQF0NgI4IAEgASkCODcDCCMAQSBrIgAkACAAIAEpAhg3AxggACABKQIQNwMQIAAgASkCCDcDCCABQSBqIABBCGpBARA3IABBIGokACACIAEoAiw2AhAgAiABKAIkNgIIIAIgASgCMDYCACACIAEoAihBAXY2AgwgAiABKAIgQQF2NgIEIAFB0ABqJAAL7gEBA38jAEHQAGsiASQAIAEjCSICKAIANgJIIAFBQGsiAyACKAIMQQF0NgIAIAEgADYCTCABIAEpAkg3AxggASACKAIQNgJEIAEgAykCADcDECABIAIoAgg2AjwgASACKAIEQQF0NgI4IAEgASkCODcDCCMAQSBrIgAkACAAIAEpAhg3AxggACABKQIQNwMQIAAgASkCCDcDCCABQSBqIABBCGpBABA2IABBIGokACACIAEoAiw2AhAgAiABKAIkNgIIIAIgASgCMDYCACACIAEoAihBAXY2AgwgAiABKAIgQQF2NgIEIAFB0ABqJAAL7gEBA38jAEHQAGsiASQAIAEjCSICKAIANgJIIAFBQGsiAyACKAIMQQF0NgIAIAEgADYCTCABIAEpAkg3AxggASACKAIQNgJEIAEgAykCADcDECABIAIoAgg2AjwgASACKAIEQQF0NgI4IAEgASkCODcDCCMAQSBrIgAkACAAIAEpAhg3AxggACABKQIQNwMQIAAgASkCCDcDCCABQSBqIABBCGpBABA3IABBIGokACACIAEoAiw2AhAgAiABKAIkNgIIIAIgASgCMDYCACACIAEoAihBAXY2AgwgAiABKAIgQQF2NgIEIAFB0ABqJAALnQEBAn8jAEEwayIBJAAgASMJIgIoAgA2AiggASACKAIMQQF0NgIgIAEgADYCLCABIAEpAig3AxAgASACKAIQNgIkIAEgASkCIDcDCCABIAIoAgg2AhwgASACKAIEQQF0NgIYIAEgASkCGDcDAEEBIQACQCABKAIQKAIAIgJBAXENACACKAIkRQ0AIAIoAjhBAWohAAsgAUEwaiQAIAAL4AQCBn8CfiMAQdAAayIBJAAgASMJIgMoAgA2AkggAUFAayICIAMoAgxBAXQ2AgAgASAANgJMIAEgASkCSDcDGCABIAMoAhA2AkQgASACKQIANwMQIAEgAygCCDYCPCABIAMoAgRBAXQ2AjggASABKQI4NwMIIwBBkAFrIgAkAAJ/IAEoAhwiAigAACIEQQFxBEAgAi0ABUEPcSEFIAItAAQhBiACLQAGDAELIAQoAgwhBiAEKAIIIQUgBCgCBAshBCAAIAI2AowBIAAgAjYCiAEgAEEANgKEASAAIAY2AoABIAAgBTYCfCAAIAQ2AngCQCACIAEoAhgiBEcEQCAAIAApAoABNwNQIAAgACkCiAE3A1ggACAAKQJ4NwNIIAAgASkCEDcDOCAAQUBrIAEpAhg3AwAgACABKQIINwMwIABB4ABqIABByABqIABBMGoQMwJAIAAoAnAiAiAERg0AIAJFDQADQCAAIAApAnAiBzcDiAEgACAAKQJoIgg3A4ABIAAgCDcDICAAIAc3AyggACAAKQJgIgc3A3ggACAHNwMYIAAgASkCEDcDCCAAIAEpAhg3AxAgACABKQIINwMAIABB4ABqIABBGGogABAzIAAoAnAiAiAERg0BIAINAAsLIAEgACkDeDcCICABIAApA4gBNwIwIAEgACkDgAE3AigMAQsgAUIANwIgIAFCADcCMCABQgA3AigLIABBkAFqJAAgAyABKAIsNgIQIAMgASgCJDYCCCADIAEoAjA2AgAgAyABKAIoQQF2NgIMIAMgASgCIEEBdjYCBCABQdAAaiQAC58CAQN/IwBBgAFrIgEkACABIwkiAigCADYCeCABIAIoAgxBAXQ2AnAgASAANgJ8IAEgAigCCDYCbCABIAIoAhA2AnQgASACKAIEQQF0NgJoIAEgAigCFDYCYCABIAIoAhhBAXQ2AlAgASACKAIcNgJUIAEgAigCIEEBdDYCWCACKAIkIQMgASABKQJ4NwMwIAEgASkCcDcDKCABIAA2AmQgASABKQJoNwMgIAEgAzYCXCABIAEpAmA3AxggASABKQJYNwMQIAEgASkCUDcDCCABQThqIAFBIGogAUEIahAzIAIgASgCRDYCECACIAEoAjw2AgggAiABKAJINgIAIAIgASgCQEEBdjYCDCACIAEoAjhBAXY2AgQgAUGAAWokAAuGAgEEfyMAQdAAayIBJAAgASMJIgIoAgA2AkggAUFAayIDIAIoAgxBAXQ2AgAgASAANgJMIAEgASkCSDcDGCABIAIoAhA2AkQgASADKQIANwMQIAEgAigCCDYCPCABIAIoAgRBAXQ2AjggASABKQI4NwMIIAIoAhRBAXQhAyACKAIYQQF0IQQjAEEgayIAJAAgACABKQIYNwMYIAAgASkCEDcDECAAIAEpAgg3AwggAUEgaiAAQQhqIAMgBEEBEDogAEEgaiQAIAIgASgCLDYCECACIAEoAiQ2AgggAiABKAIwNgIAIAIgASgCKEEBdjYCDCACIAEoAiBBAXY2AgQgAUHQAGokAAuGAgEEfyMAQdAAayIBJAAgASMJIgIoAgA2AkggAUFAayIDIAIoAgxBAXQ2AgAgASAANgJMIAEgASkCSDcDGCABIAIoAhA2AkQgASADKQIANwMQIAEgAigCCDYCPCABIAIoAgRBAXQ2AjggASABKQI4NwMIIAIoAhRBAXQhAyACKAIYQQF0IQQjAEEgayIAJAAgACABKQIYNwMYIAAgASkCEDcDECAAIAEpAgg3AwggAUEgaiAAQQhqIAMgBEEAEDogAEEgaiQAIAIgASgCLDYCECACIAEoAiQ2AgggAiABKAIwNgIAIAIgASgCKEEBdjYCDCACIAEoAiBBAXY2AgQgAUHQAGokAAvXAgEGfyMAQfAAayIBJAAgASMJIgIoAgA2AmggASACKAIMQQF0NgJgIAEgADYCbCABIAIoAgg2AlwgASACKAIQNgJkIAEgAigCBEEBdDYCWCABIAIoAhhBAXQ2AlQgASACKAIUNgJQIAIoAiAhACACKAIcIQMgASABKQJoNwMoIAEgASkCYDcDICABIAM2AkggASABKQJYNwMYIAEgAEEBdDYCTCABIAEpAlA3AxAgASABKQJINwMIIwBBIGsiACQAIAEoAgwhAyABKAIIIQQgASgCFCEFIAEoAhAhBiAAIAEpAig3AxggACABKQIgNwMQIAAgASkCGDcDCCABQTBqIABBCGogBiAFIAQgA0EBEDsgAEEgaiQAIAIgASgCPDYCECACIAEoAjQ2AgggAiABKAJANgIAIAIgASgCOEEBdjYCDCACIAEoAjBBAXY2AgQgAUHwAGokAAvXAgEGfyMAQfAAayIBJAAgASMJIgIoAgA2AmggASACKAIMQQF0NgJgIAEgADYCbCABIAIoAgg2AlwgASACKAIQNgJkIAEgAigCBEEBdDYCWCABIAIoAhhBAXQ2AlQgASACKAIUNgJQIAIoAiAhACACKAIcIQMgASABKQJoNwMoIAEgASkCYDcDICABIAM2AkggASABKQJYNwMYIAEgAEEBdDYCTCABIAEpAlA3AxAgASABKQJINwMIIwBBIGsiACQAIAEoAgwhAyABKAIIIQQgASgCFCEFIAEoAhAhBiAAIAEpAig3AxggACABKQIgNwMQIAAgASkCGDcDCCABQTBqIABBCGogBiAFIAQgA0EAEDsgAEEgaiQAIAIgASgCPDYCECACIAEoAjQ2AgggAiABKAJANgIAIAIgASgCOEEBdjYCDCACIAEoAjBBAXY2AgQgAUHwAGokAAueAQECfyMAQUBqIgEkACABIwkiAigCADYCOCABIAIoAgxBAXQ2AjAgASAANgI8IAEgASkCODcDGCABIAIoAhA2AjQgASABKQIwNwMQIAEgAigCCDYCLCABIAIoAgRBAXQ2AiggASABKQIoNwMIIAEgASgCDDYCICABIAEoAhA2AiQgAiABKAIgNgIAIAIgASgCJEEBdjYCBCABQUBrJAALlgEBAn8jAEFAaiIBJAAgASMJIgIoAgA2AjggASACKAIMQQF0NgIwIAEgADYCPCABIAEpAjg3AxggASACKAIQNgI0IAEgASkCMDcDECABIAIoAgg2AiwgASACKAIEQQF0NgIoIAEgASkCKDcDCCABQSBqIAFBCGoQLiACIAEoAiA2AgAgAiABKAIkQQF2NgIEIAFBQGskAAt/AQJ/IwBBMGsiASQAIAEjCSICKAIANgIoIAEgAigCDEEBdDYCICABIAA2AiwgASABKQIoNwMQIAEgAigCEDYCJCABIAEpAiA3AwggASACKAIINgIcIAEgAigCBEEBdDYCGCABIAEpAhg3AwAgASgCACEAIAFBMGokACAAQQF2C34BAn8jAEEwayIBJAAgASMJIgIoAgA2AiggASACKAIMQQF0NgIgIAEgADYCLCABIAEpAig3AxAgASACKAIQNgIkIAEgASkCIDcDCCABIAIoAgg2AhwgASACKAIEQQF0NgIYIAEgASkCGDcDACABEC0hACABQTBqJAAgAEEBdgusAgIHfwF+IwBBMGsiASQAIAEjCSICKAIANgIoIAEgAigCDEEBdDYCICABIAA2AiwgASABKQIoNwMQIAEgAigCEDYCJCABIAEpAiA3AwggASACKAIINgIcIAEgAigCBEEBdDYCGCABIAEpAhg3AwAjAEEgayIAJAAgASgCFCgCCCECIAEoAhApAgAhCEEBIQMCQAJAAkAgAS8BDCIEQf7/A2sOAgACAQtBACEDDAELIAIoAkggBEEDbGotAAAhAwsgACAINwMQIAAgCDcDCCAAQQhqIABB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QCAHQfAAaiMBQbDVAGoiABCJASAGQQFxDQIgABCGASIGDQAgABCIAQ0ACwsLIwkiACAINgIEIAAgBEEFbjYCACAHQaABaiQAC3sBAn8jAEEwayIBJAAgASMJIgIoAgA2AiggASACKAIMQQF0NgIgIAEgADYCLCABIAEpAig3AxAgASACKAIQNgIkIAEgASkCIDcDCCABIAIoAgg2AhwgASACKAIEQQF0NgIYIAEgASkCGDcDACABEDEhACABQTBqJAAgAAufAQECfyMAQTBrIgEkACABIwkiAigCADYCKCABIAIoAgxBAXQ2AiAgASAANgIsIAEgASkCKDcDECABIAIoAhA2AiQgASABKQIgNwMIIAEgAigCCDYCHCABIAIoAgRBAXQ2AhggASABKQIYNwMAAn8gASgCECgCACIAQQFxBEAgAEEEdkEBcQwBCyAALwEsQQV2QQFxCyEAIAFBMGokACAAC64BAQJ/IwBBMGsiASQAIAEjCSICKAIANgIoIAEgAigCDEEBdDYCICABIAA2AiwgASABKQIoNwMQIAEgAigCEDYCJCABIAEpAiA3AwggASACKAIINgIcIAEgAigCBEEBdDYCGCABIAEpAhg3AwACfyABKAIQKAIAIgBBAXEEQCAAQRp0QR91QeIEcQwBC0HiBCAALQAtQQJxDQAaIAAoAiALQQBHIQAgAUEwaiQAIAAL4gEBAn8jAEEwayIBJAAgASMJIgIoAgA2AiggASACKAIMQQF0NgIgIAEgADYCLCABIAEpAig3AxAgASACKAIQNgIkIAEgASkCIDcDCCABIAIoAgg2AhwgASACKAIEQQF0NgIYIAEgASkCGDcDAAJ/AkAgASgCDCIAQf//A3FFBEAgASgCECgCACIAQQFxBEAgAEGA/gNxQQh2IQAMAgsgAC8BKCEACyAAQf//A3FB//8DRw0AQQEMAQsgASgCFCgCCCgCTCAAQf//A3FBAXRqLwEAQf//A0YLIQAgAUEwaiQAIAALnwEBAn8jAEEwayIBJAAgASMJIgIoAgA2AiggASACKAIMQQF0NgIgIAEgADYCLCABIAEpAig3AxAgASACKAIQNgIkIAEgASkCIDcDCCABIAIoAgg2AhwgASACKAIEQQF0NgIYIAEgASkCGDcDAAJ/IAEoAhAoAgAiAEEBcQRAIABBBXZBAXEMAQsgAC8BLEEJdkEBcQshACABQTBqJAAgAAufAQECfyMAQTBrIgEkACABIwkiAigCADYCKCABIAIoAgxBAXQ2AiAgASAANgIsIAEgASkCKDcDECABIAIoAhA2AiQgASABKQIgNwMIIAEgAigCCDYCHCABIAIoAgRBAXQ2AhggASABKQIYNwMAAn8gASgCECgCACIAQQFxBEAgAEEDdkEBcQwBCyAALwEsQQJ2QQFxCyEAIAFBMGokACAAC3sBAn8jAEEwayIBJAAgASMJIgIoAgA2AiggASACKAIMQQF0NgIgIAEgADYCLCABIAEpAig3AxAgASACKAIQNgIkIAEgASkCIDcDCCABIAIoAgg2AhwgASACKAIEQQF0NgIYIAEgASkCGDcDACABEDIhACABQTBqJAAgAAvdAQEDfyMAQTBrIgEkACABIwkiAigCADYCKCABIAIoAgxBAXQ2AiAgASAANgIsIAEgASkCKDcDECABIAIoAhA2AiQgASABKQIgNwMIIAEgAigCCDYCHCABIAIoAgRBAXQ2AhggASABKQIYNwMAIAEoAhQoAgghAwJ/An8gASgCECgCACIAQQFxBEBB//8DIABBEHYiAkH//wNGDQIaIABBgP4DcUEIdgwBC0H//wMgAC8BKiICQf//A0YNARogAC8BKAshACADIAIgAEH//wNxEBkLIQAgAUEwaiQAIAALwAYBA38jAEHwAGsiCyQAIwFBxNUAaiINKAIAIgxFBEAgDRBuIgw2AgALIAwgCEF/IAgbNgJIIAsjCSIMKAIANgJoIAsgDCgCDEEBdDYCYCALIAwoAgg2AlwgCyABNgJsIAsgDCgCEDYCZCALIAwoAgRBAXQ2AlggCyADQQF0NgJUIAsgAjYCUCALIAVBAXQ2AkwgCyAENgJIIwEiAkHE1QBqIgMoAgAhASALIAspAlA3AyggCyALKQJINwMgIAEgC0EoaiALQSBqEHEgAygCACEBIAdBfyAHGyIEIAZPBEAgASAENgJcIAEgBjYCWAsgAygCACAINgJIIAMoAgAgCTYCVCADKAIAIAqtNwOIASALIAspAmA3AxAgCyALKQJoNwMYIAsgAkHY0wBqKQMANwNAIAsgCykCWDcDCCADKAIAIQIjAEEgayIBJAAgASALKQIYNwMYIAEgCykCEDcDECABIAspAgg3AwggAiAAIAFB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AwggASADIARCgJTr3AN+fT4CECAAIAEpAxA3AwggACABKQMINwMAQQALGiABQSBqJAAL8gICAn8BfgJAIAJFDQAgACABOgAAIAAgAmoiA0EBayABOgAAIAJBA0kNACAAIAE6AAIgACABOgABIANBA2sgAToAACADQQJrIAE6AAAgAkEHSQ0AIAAgAToAAyADQQRrIAE6AAAgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBBGsgATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQQhrIAE2AgAgAkEMayABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkEQayABNgIAIAJBFGsgATYCACACQRhrIAE2AgAgAkEcayABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa1CgYCAgBB+IQUgAyAEaiEBA0AgASAFNwMYIAEgBTcDECABIAU3AwggASAFNwMAIAFBIGohASACQSBrIgJBH0sNAAsLIAALWQEBfyAAIAAoAkgiAUEBayABcjYCSCAAKAIAIgFBCHEEQCAAIAFBIHI2AgBBfw8LIABCADcCBCAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQQQALgQEBAn8jAEEQayICJAAgAiABOgAPAkACQCAAKAIQIgMEfyADBSAAEO8BDQIgACgCEAsgACgCFCIDRg0AIAAoAlAgAUH/AXFGDQAgACADQQFqNgIUIAMgAToAAAwBCyAAIAJBD2pBASAAKAIkEQQAQQFHDQAgAi0ADxoLIAJBEGokAAvSAQEDfwJAIAEoAkwiAkEATgRAIAJFDQEjAUGE1gBqKAIYIAJB/////wNxRw0BCwJAIABB/wFxIgMgASgCUEYNACABKAIUIgIgASgCEEYNACABIAJBAWo2AhQgAiAAOgAADwsgASADEPABDwsgAUHMAGoiAiACKAIAIgNB/////wMgAxs2AgACQAJAIABB/wFxIgQgASgCUEYNACABKAIUIgMgASgCEEYNACABIANBAWo2AhQgAyAAOgAADAELIAEgBBDwAQsgAigCABogAkEANgIAC4kEAQN/IAJBgARPBEAgAgRAIAAgASAC/AoAAAsgAA8LIAAgAmohAwJAIAAg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cyB2ZXJzaW9uOiV1LCB2ZXJzaW9uX2NvdW50OiV1LCBzdGF0ZTolZCwgcm93OiV1LCBjb2w6JXUAcmVjb3Zlcl90b19wcmV2aW91cyBzdGF0ZToldSwgZGVwdGg6JXUALCBzaXplOiV1AHNoaWZ0IHN0YXRlOiV1AHJlY292ZXJfd2l0aF9taXNzaW5nIHN5bWJvbDolcywgc3RhdGU6JXUAZGlmZmVyZW50X2luY2x1ZGVkX3JhbmdlICV1IC0gJXUAYWNjZXB0AHBhcnNlX2FmdGVyX2VkaXQAXHQAYWJvcnRpbmcgcmVkdWNlIHdpdGggdG9vIG1hbnkgdmVyc2lvbnMAaGFzX2NoYW5nZXMAc3dpdGNoIGZyb21fa2V5d29yZDolcywgdG9fd29yZF90b2tlbjolcwBzdGF0ZV9taXNtYXRjaCBzeW06JXMAc2VsZWN0X3NtYWxsZXJfZXJyb3Igc3ltYm9sOiVzLCBvdmVyX3N5bWJvbDolcwBzZWxlY3RfZWFybGllciBzeW1ib2w6JXMsIG92ZXJfc3ltYm9sOiVzAHNlbGVjdF9leGlzdGluZyBzeW1ib2w6JXMsIG92ZXJfc3ltYm9sOiVzAGNhbnRfcmV1c2Vfbm9kZSBzeW1ib2w6JXMsIGZpcnN0X2xlYWZfc3ltYm9sOiVzAHNraXBfdG9rZW4gc3ltYm9sOiVzAGlnbm9yZV9lbXB0eV9leHRlcm5hbF90b2tlbiBzeW1ib2w6JXMAcmV1c2FibGVfbm9kZV9oYXNfZGlmZmVyZW50X2V4dGVybmFsX3NjYW5uZXJfc3RhdGUgc3ltYm9sOiVzAHJldXNlX25vZGUgc3ltYm9sOiVzAHBhc3RfcmV1c2FibGVfbm9kZSBzeW1ib2w6JXMAYmVmb3JlX3JldXNhYmxlX25vZGUgc3ltYm9sOiVzAGNhbnRfcmV1c2Vfbm9kZV8lcyB0cmVlOiVzAGJyZWFrZG93bl90b3Bfb2Zfc3RhY2sgdHJlZTolcwBkZXRlY3RfZXJyb3IgbG9va2FoZWFkOiVzACglcwBpc19lcnJvcgBza2lwX3VucmVjb2duaXplZF9jaGFyYWN0ZXIAbmFuAFxuAGlzX21pc3NpbmcAcmVzdW1lX3BhcnNpbmcAcmVjb3Zlcl9lb2YAaW5mAG5ld19wYXJzZQBjb25kZW5zZQBkb25lAGlzX2ZyYWdpbGUAY29udGFpbnNfZGlmZmVyZW50X2luY2x1ZGVkX3JhbmdlAHNraXAgY2hhcmFjdGVyOiVkAGNvbnN1bWUgY2hhcmFjdGVyOiVkAHNlbGVjdF9oaWdoZXJfcHJlY2VkZW5jZSBzeW1ib2w6JXMsIHByZWM6JWQsIG92ZXJfc3ltYm9sOiVzLCBvdGhlcl9wcmVjOiVkAHNoaWZ0X2V4dHJhAG5vX2xvb2thaGVhZF9hZnRlcl9ub25fdGVybWluYWxfZXh0cmEAX19ST09UX18AX0VSUk9SAE5BTgBNSVNTSU5HAElORgBJTlZBTElEAGxleGVkX2xvb2thaGVhZCBzeW06ACAwMDAwMDAwMDAwMDAQMDAALgAoJXMpAChudWxsKQAoTlVMTCkAKCIlcyIpACdcdCcAJ1xyJwAnXG4nAHNraXAgY2hhcmFjdGVyOiclYycAY29uc3VtZSBjaGFyYWN0ZXI6JyVjJwAnXDAnACIlcyIAKE1JU1NJTkcgAChVTkVYUEVDVEVEIAAlczogAAoKAAAAAAAAAAAAAAABAAAAAAAAAAAAAAD//////////wAAAAD/////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHg8PDwAAAAAAAAAAAQAAAAEAAAACAAAAAQAAAAIAAAAAAAAAAAAAABIRExQVFhcYGRobHB0eHyAhESIjJBElJicoKSorLBEtLi8QEDAQEBAQEBAQMTIzEDQ1EBARERERERERERERERERERERERERERERERERNhERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERETcREREROBE5Ojs8PT4RERERERERERERERERERERERERERERERERERERERERERERERERERERERERPxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBFAQRFCQ0RFRkdISUoRS0xNTk9QURBSU1RVVldYWVpbXF0QXl9gEBEREWFiYxAQEBAQEBAQEBARERERZBAQEBAQEBAQEBAQEBAQEBERZRAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBERZmcQEGhpERERERERERERERERERERERERERERERFqERFrEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBFsbRAQEBAQEBAQEG4QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEG9wcXIQEBAQEBAQEHN0dRAQEBAQdncQEBAQeBAQeRAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////////////////////////////////////////wAAAAAAAAAA/v//B/7//wcAAAAAAAQgBP//f////3//////////////////////////////////w/8DAB9QAAAAAAAAAAAAACAAAAAAAN+8QNf///v///////////+///////////////////////8D/P///////////////////////////v///38C//////8BAAAAAP+/tgD///+HBwAAAP8H//////////7/w////////////////+8f/uH/nwAA////////AOD///////////////8DAP//////BzAE/////P8fAAD///8B/wcAAAAAAAD//98/AADw//gD////////////7//f4f/P//7/75/5///9xeOfWYCwz/8DEO6H+f///W3DhxkCXsD/PwDuv/v///3t478bAQDP/wAe7p/5///97eOfGcCwz/8CAOzHPdYYx//Dxx2BAMD/AADv3/3///3/498dYAfP/wAA79/9///97+PfHWBAz/8GAO/f/f/////n313wgM//APzs/3/8///7L3+AX//A/wwA/v////9//wc/IP8DAAAAANb3//+v//87XyD/8wAAAAABAAAA/wMAAP/+////H/7/A////v///x8AAAAAAAAAAP///////3/5/wP///////////8//////78g///////3////////////PX89//////89/////z1/Pf9//////////z3//////////wcAAAAA//8AAP////////////8/P/7//////////////////////////////////////////////////////////5////7//wf////////////H/wH/3w8A//8PAP//DwD/3w0A////////z///AYAQ/wMAAAAA/wP//////////////wH//////wf//////////z8A////f/8P/wHA/////z8fAP//////D////wP/AwAAAAD///8P/////////3/+/x8A/wP/A4AAAAAAAAAAAAAAAP///////+//7w//AwAAAAD///////P///////+//wMA////////fwD/4///////P/8B///////nAAAAAADebwT///////////////////////////////8AAAAAgP8fAP//Pz//////Pz//qv///z/////////fX9wfzw//H9wfAAAAAAAAAAAAAAAAAAACgAAA/x8AAAAAAAAAAAAAAACE/C8+UL3/8+BDAAD//////wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA////////AwAA//////9///////9//////////////////////x94DAD/////vyD/////////gAAA//9/AH9/f39/f39//////wAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAP4DPh/+////////////f+D+//////////////fg///////+/////////////38AAP///wcAAAAAAAD///////////////////////////////8/AAAAAAAAAAAA////////////////////////////////////////AAD//////////////////////x8AAAAAAAAAAP//////P/8f////DwAA//////9/8I///////////////////wAAAACA//z////////////////5////////fAAAAAAAgP+//////wAAAP///////w8A//////////8vAP8DAAD86P//////B/////8HAP///x/////////3/wCA/wP///9/////////fwD/P/8D//9//P////////9/BQAAOP//PAB+fn4Af3////////f/AP///////////////////wf/A///////////////////////////DwD//3/4//////8P/////////////////z//////////////////AwAAAAB/APjg//1/X9v/////////////////AwAAAPj///////////////8/AAD///////////z///////8AAAAAAP8PAAAAAAAAAAAAAAAAAADf/////////////////////x8AAP8D/v//B/7//wfA/////////////3/8/PwcAAAAAP/v//9///+3/z//PwAAAAD///////////////////8HAAAAAAAAAAD///////8fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////H////////wEAAAAAAP////8A4P///wf//////wf///8//////w//PgAAAAAA/////////////////////////z//A/////8P/////w///////wD///////8PAAAAAAAAAAAAAAAAAAAAAAAAAP///////38A//8/AP8AAAAAAAAAAAAAAAAAAAAAAAAAP/3/////v5H//z8A//9/AP///38AAAAAAAAAAP//NwD//z8A////AwAAAAAAAAAA/////////8AAAAAAAAAAAG/w7/7//z8AAAAAAP///x////8fAAAAAP/+//8fAAAA////////PwD//z8A//8HAP//AwAAAAAAAAAAAAAAAAD///////////8BAAAAAAAA////////BwD///////8HAP//////AP8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////H4AA//8/AAAAAAAAAAAAAAAAAAAAAAAAAP//fwD//////////z8AAADA/wAA/P///////wEAAP///wH/A////////8f/cAD/////RwD//////////x4A/xcAAAAA///7////n0AAAAAAAAAAAH+9/7//Af////////8B/wPvn/n///3t458ZgeAPAAAAAAAAAAAAAAAAAAAAAAAAAP//////////uwf/gwAAAAD//////////7MA/wMAAAAAAAAAAAAAAAAAAAAAAAAAAP///////z9/AAAAPwAAAAD/////////fxEA/wMAAAAA////////PwH/AwAAAAAAAP///+f/B/8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////////wEAAAAAAAAAAAAAAAD///////////8DAIAAAAAAAAAAAAAAAAAAAAAAAAAAAP/8///////8GgAAAP///////+d/AAD///////////8gAAAAAP////////8B//3/////f38BAP8DAAD8/////P///n8AAAAAAAAAAAB/+/////9/tMsA/wO//f///397Af8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//38A/////////////////////////wMAAAAAAAAAAAAAAAD/////////////////fwAA////////////////////////////////DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////9/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////////38AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////////8B////f/8DAAAAAAAAAAAAAAAA////PwAA////////AAAPAP8D+P//4P//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//////////AAAAAAAAAAAAAAAAAAAAAP///////////4f/////////gP//AAAAAAAAAAALAAAA/////////////////////////////////////////wD///////////////////////////////////////8HAP///38AAAAAAAAHAPAA/////////////////////////////////////////////////////////////////w//////////////////B/8f/wH/QwAAAAAAAAAAAAAAAP/////////////f///////////fZN7/6+//////////v+ff3////3tf/P3//////////////////////////////////////////////////////z/////9///3////9///3////9///3////9//////f////3///fP////////f///+dsHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////x+AP/9DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//////D/8D////////////////////////////////HwAAAAAAAAD//////////48I/wMAAAAAAAAAAAAAAAAAAAAAAAAAAO////+W/vcKhOqWqpb3917/+/8P7vv/DwAAAAAAAAAAAAAAAAAA////A////wP///8DAAAAAAAAAAAAAAAAAAAgAAAACQAAAAoAAAANAAAACwAAAAwAAACFAAAAACAAAAEgAAACIAAAAyAAAAQgAAAFIAAABiAA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dHJlZV9zaXR0ZXJfcXVlcnlfcHJvZ3Jlc3NfY2FsbGJhY2sED19fd2FzaV9mZF9jbG9zZQUPX193YXNpX2ZkX3dyaXRlBglfYWJvcnRfanMHFV9fd2FzaV9jbG9ja190aW1lX2dldAgOX193YXNpX2ZkX3NlZWsJFmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAKEV9fd2FzbV9jYWxsX2N0b3JzCxhfX3dhc21fYXBwbHlfZGF0YV9yZWxvY3MMDF9fd2FzbV9zdGFydA0RdHNfbWFsbG9jX2RlZmF1bHQOEXRzX2NhbGxvY19kZWZhdWx0DxJ0c19yZWFsbG9jX2RlZmF1bHQQIXRzX3JhbmdlX2FycmF5X2dldF9jaGFuZ2VkX3JhbmdlcxEQaXRlcmF0b3JfZGVzY2VuZBIQaXRlcmF0b3JfYWR2YW5jZRMYdHNfbGFuZ3VhZ2Vfc3ltYm9sX2NvdW50FBd0c19sYW5ndWFnZV9zdGF0ZV9jb3VudBUTdHNfbGFuZ3VhZ2VfdmVyc2lvbhYUdHNfbGFuZ3VhZ2VfbWV0YWRhdGEXEHRzX2xhbmd1YWdlX25hbWUYF3RzX2xhbmd1YWdlX2ZpZWxkX2NvdW50GRZ0c19sYW5ndWFnZV9uZXh0X3N0YXRlGhd0c19sYW5ndWFnZV9zeW1ib2xfbmFtZRsbdHNfbGFuZ3VhZ2Vfc3ltYm9sX2Zvcl9uYW1lHBd0c19sYW5ndWFnZV9zeW1ib2xfdHlwZR0ddHNfbGFuZ3VhZ2VfZmllbGRfbmFtZV9mb3JfaWQeHXRzX2xhbmd1YWdlX2ZpZWxkX2lkX2Zvcl9uYW1lHxl0c19sb29rYWhlYWRfaXRlcmF0b3JfbmV3IBx0c19sb29rYWhlYWRfaXRlcmF0b3JfZGVsZXRlISF0c19sb29rYWhlYWRfaXRlcmF0b3JfcmVzZXRfc3RhdGUiG3RzX2xvb2thaGVhZF9pdGVyYXRvcl9yZXNldCMadHNfbG9va2FoZWFkX2l0ZXJhdG9yX25leHQkJHRzX2xvb2thaGVhZF9pdGVyYXRvcl9jdXJyZW50X3N5bWJvbCUNdHNfbGV4ZXJfX2xvZyYNdHNfbGV4ZXJfX2VvZickdHNfbGV4ZXJfX2lzX2F0X2luY2x1ZGVkX3JhbmdlX3N0YXJ0KBR0c19sZXhlcl9fZ2V0X2NvbHVtbikSdHNfbGV4ZXJfX21hcmtfZW5kKhF0c19sZXhlcl9fYWR2YW5jZSsUdHNfbGV4ZXJfX2RvX2FkdmFuY2UsDnRzX2xleGVyX3N0YXJ0LRB0c19ub2RlX2VuZF9ieXRlLhF0c19ub2RlX2VuZF9wb2ludC8OdHNfbm9kZV9zeW1ib2wwG3RzX3N1YnRyZWVfX3dyaXRlX3RvX3N0cmluZzEQdHNfbm9kZV9pc19uYW1lZDITdHNfbm9kZV9wYXJzZV9zdGF0ZTMddHNfbm9kZV9jaGlsZF93aXRoX2Rlc2NlbmRhbnQ0DnRzX25vZGVfX2NoaWxkNRl0c19ub2RlX2NoaWxkX2J5X2ZpZWxkX2lkNhV0c19ub2RlX19uZXh0X3NpYmxpbmc3FXRzX25vZGVfX3ByZXZfc2libGluZzgodHNfc3VidHJlZV9oYXNfdHJhaWxpbmdfZW1wdHlfZGVzY2VuZGFudDkddHNfbm9kZV9fZmlyc3RfY2hpbGRfZm9yX2J5dGU6InRzX25vZGVfX2Rlc2NlbmRhbnRfZm9yX2J5dGVfcmFuZ2U7I3RzX25vZGVfX2Rlc2NlbmRhbnRfZm9yX3BvaW50X3JhbmdlPBJ0c19zdWJ0cmVlX3JlbGVhc2U9DnRzX3N0YWNrX2NsZWFyPhB0c19wYXJzZXJfZGVsZXRlPw90c19wYXJzZXJfcmVzZXRAFnRzX3BhcnNlcl9zZXRfbGFuZ3VhZ2VBEnN0YWNrX25vZGVfcmVsZWFzZUIYdHNfcGFyc2VyX3RpbWVvdXRfbWljcm9zQxx0c19wYXJzZXJfc2V0X3RpbWVvdXRfbWljcm9zRB10c19wYXJzZXJfc2V0X2luY2x1ZGVkX3Jhbmdlc0UbdHNfc3VidHJlZV9fcHJpbnRfZG90X2dyYXBoRhh0c19zdGFja19wcmludF9kb3RfZ3JhcGhHF3RzX3N0YWNrX3JlbW92ZV92ZXJzaW9uSBNzdGFja19ub2RlX2FkZF9saW5rSSZ0c19wYXJzZXJfX2RvX2FsbF9wb3RlbnRpYWxfcmVkdWN0aW9uc0oYc3VtbWFyaXplX3N0YWNrX2NhbGxiYWNrSwtzdGFja19faXRlckwedHNfcGFyc2VyX19icmVha2Rvd25fbG9va2FoZWFkTRJ0c19wYXJzZXJfX3JlY292ZXJOH3RzX3BhcnNlcl9fY2FuX3JldXNlX2ZpcnN0X2xlYWZPFXJldXNhYmxlX25vZGVfYWR2YW5jZVAhdHNfcGFyc2VyX19icmVha2Rvd25fdG9wX29mX3N0YWNrURF0c19wYXJzZXJfX2FjY2VwdFIRdHNfcGFyc2VyX19yZWR1Y2VTGXRzX3N0YWNrX3JlbnVtYmVyX3ZlcnNpb25UDXRzX3N0YWNrX3B1c2hVDHRzX3F1ZXJ5X25ld1YOc3RyZWFtX2FkdmFuY2VXFnN0cmVhbV9za2lwX3doaXRlc3BhY2VYF3RzX3F1ZXJ5X19wYXJzZV9wYXR0ZXJuWRp0c19xdWVyeV9fcGVyZm9ybV9hbmFseXNpc1oPdHNfcXVlcnlfZGVsZXRlWwxfYXJyYXlfX2dyb3dcFnN0cmVhbV9zY2FuX2lkZW50aWZpZXJdG2NhcHR1cmVfcXVhbnRpZmllcnNfYWRkX2FsbF4edHNfcXVlcnlfX3BhcnNlX3N0cmluZ19saXRlcmFsXxhzeW1ib2xfdGFibGVfaW5zZXJ0X25hbWVgFnRzX3F1ZXJ5X3BhdHRlcm5fY291bnRhFnRzX3F1ZXJ5X2NhcHR1cmVfY291bnRiFXRzX3F1ZXJ5X3N0cmluZ19jb3VudGMcdHNfcXVlcnlfY2FwdHVyZV9uYW1lX2Zvcl9pZGQidHNfcXVlcnlfY2FwdHVyZV9xdWFudGlmaWVyX2Zvcl9pZGUcdHNfcXVlcnlfc3RyaW5nX3ZhbHVlX2Zvcl9pZGYfdHNfcXVlcnlfcHJlZGljYXRlc19mb3JfcGF0dGVybmcfdHNfcXVlcnlfc3RhcnRfYnl0ZV9mb3JfcGF0dGVybmgddHNfcXVlcnlfZW5kX2J5dGVfZm9yX3BhdHRlcm5pGnRzX3F1ZXJ5X2lzX3BhdHRlcm5fcm9vdGVkah10c19xdWVyeV9pc19wYXR0ZXJuX25vbl9sb2NhbGsmdHNfcXVlcnlfaXNfcGF0dGVybl9ndWFyYW50ZWVkX2F0X3N0ZXBsGHRzX3F1ZXJ5X2Rpc2FibGVfY2FwdHVyZW0YdHNfcXVlcnlfZGlzYWJsZV9wYXR0ZXJubhN0c19xdWVyeV9jdXJzb3JfbmV3bxR0c19xdWVyeV9jdXJzb3JfZXhlY3AUdHNfdHJlZV9jdXJzb3JfcmVzZXRxH3RzX3F1ZXJ5X2N1cnNvcl9zZXRfcG9pbnRfcmFuZ2VyGnRzX3F1ZXJ5X2N1cnNvcl9uZXh0X21hdGNocxh0c19xdWVyeV9jdXJzb3JfX2FkdmFuY2V0GnRzX3F1ZXJ5X2N1cnNvcl9fYWRkX3N0YXRldRh0c19xdWVyeV9jdXJzb3JfX2NhcHR1cmV2KnRzX3F1ZXJ5X2N1cnNvcl9fZmlyc3RfaW5fcHJvZ3Jlc3NfY2FwdHVyZXcodHNfdHJlZV9jdXJzb3JfZ290b19maXJzdF9jaGlsZF9pbnRlcm5hbHgidHNfdHJlZV9jdXJzb3JfY2hpbGRfaXRlcmF0b3JfbmV4dHkkdHNfdHJlZV9jdXJzb3JfZ290b19zaWJsaW5nX2ludGVybmFsehx0c19xdWVyeV9jdXJzb3JfbmV4dF9jYXB0dXJlexJwb3BfY291bnRfY2FsbGJhY2t8FHBvcF9wZW5kaW5nX2NhbGxiYWNrfRJwb3BfZXJyb3JfY2FsbGJhY2t+EHBvcF9hbGxfY2FsbGJhY2t/J3RzX3N1YnRyZWVfYXJyYXlfcmVtb3ZlX3RyYWlsaW5nX2V4dHJhc4ABHXRzX3N1YnRyZWVfc3VtbWFyaXplX2NoaWxkcmVugQETdHNfc3VidHJlZV9uZXdfbm9kZYIBEnRzX3RyZWVfY3Vyc29yX25ld4MBH3RzX3RyZWVfY3Vyc29yX2dvdG9fZmlyc3RfY2hpbGSEASd0c190cmVlX2N1cnNvcl9nb3RvX2xhc3RfY2hpbGRfaW50ZXJuYWyFATJ0c190cmVlX2N1cnNvcl9nb3RvX2ZpcnN0X2NoaWxkX2Zvcl9ieXRlX2FuZF9wb2ludIYBIHRzX3RyZWVfY3Vyc29yX2dvdG9fbmV4dF9zaWJsaW5nhwEmdHNfdHJlZV9jdXJzb3JfY2hpbGRfaXRlcmF0b3JfcHJldmlvdXOIARp0c190cmVlX2N1cnNvcl9nb3RvX3BhcmVudIkBG3RzX3RyZWVfY3Vyc29yX2N1cnJlbnRfbm9kZYoBH3RzX3RyZWVfY3Vyc29yX2N1cnJlbnRfZmllbGRfaWSLAQx0c190cmVlX2NvcHmMAQ50c190cmVlX2RlbGV0ZY0BDnRzX2RlY29kZV91dGY4jgESdHNfZGVjb2RlX3V0ZjE2X2xljwESdHNfZGVjb2RlX3V0ZjE2X2JlkAEWdHNfcGFyc2VyX19zZWxlY3RfdHJlZZEBIHRzX3BhcnNlcl9fYmV0dGVyX3ZlcnNpb25fZXhpc3RzkgEhYW5hbHlzaXNfc3RhdGVfc2V0X19pbnNlcnRfc29ydGVkkwEjdHNfcXVlcnlfY3Vyc29yX19wcmVwYXJlX3RvX2NhcHR1cmWUAQd0c19pbml0lQESdHNfcGFyc2VyX25ld193YXNtlgEcdHNfcGFyc2VyX2VuYWJsZV9sb2dnZXJfd2FzbZcBEWNhbGxfbG9nX2NhbGxiYWNrmAEUdHNfcGFyc2VyX3BhcnNlX3dhc22ZARNjYWxsX3BhcnNlX2NhbGxiYWNrmgERcHJvZ3Jlc3NfY2FsbGJhY2ubAR50c19wYXJzZXJfaW5jbHVkZWRfcmFuZ2VzX3dhc22cAR50c19sYW5ndWFnZV90eXBlX2lzX25hbWVkX3dhc22dASB0c19sYW5ndWFnZV90eXBlX2lzX3Zpc2libGVfd2FzbZ4BG3RzX2xhbmd1YWdlX3N1cGVydHlwZXNfd2FzbZ8BGXRzX2xhbmd1YWdlX3N1YnR5cGVzX3dhc22gARZ0c190cmVlX3Jvb3Rfbm9kZV93YXNtoQEidHNfdHJlZV9yb290X25vZGVfd2l0aF9vZmZzZXRfd2FzbaIBEXRzX3RyZWVfZWRpdF93YXNtowEcdHNfdHJlZV9pbmNsdWRlZF9yYW5nZXNfd2FzbaQBH3RzX3RyZWVfZ2V0X2NoYW5nZWRfcmFuZ2VzX3dhc22lARd0c190cmVlX2N1cnNvcl9uZXdfd2FzbaYBGHRzX3RyZWVfY3Vyc29yX2NvcHlfd2FzbacBGnRzX3RyZWVfY3Vyc29yX2RlbGV0ZV93YXNtqAEZdHNfdHJlZV9jdXJzb3JfcmVzZXRfd2FzbakBHHRzX3RyZWVfY3Vyc29yX3Jlc2V0X3RvX3dhc22qASR0c190cmVlX2N1cnNvcl9nb3RvX2ZpcnN0X2NoaWxkX3dhc22rASN0c190cmVlX2N1cnNvcl9nb3RvX2xhc3RfY2hpbGRfd2FzbawBLnRzX3RyZWVfY3Vyc29yX2dvdG9fZmlyc3RfY2hpbGRfZm9yX2luZGV4X3dhc22tATF0c190cmVlX2N1cnNvcl9nb3RvX2ZpcnN0X2NoaWxkX2Zvcl9wb3NpdGlvbl93YXNtrgEldHNfdHJlZV9jdXJzb3JfZ290b19uZXh0X3NpYmxpbmdfd2Fzba8BKXRzX3RyZWVfY3Vyc29yX2dvdG9fcHJldmlvdXNfc2libGluZ193YXNtsAEjdHNfdHJlZV9jdXJzb3JfZ290b19kZXNjZW5kYW50X3dhc22xAR90c190cmVlX2N1cnNvcl9nb3RvX3BhcmVudF93YXNtsgEodHNfdHJlZV9jdXJzb3JfY3VycmVudF9ub2RlX3R5cGVfaWRfd2FzbbMBKXRzX3RyZWVfY3Vyc29yX2N1cnJlbnRfbm9kZV9zdGF0ZV9pZF93YXNttAEpdHNfdHJlZV9jdXJzb3JfY3VycmVudF9ub2RlX2lzX25hbWVkX3dhc221ASt0c190cmVlX2N1cnNvcl9jdXJyZW50X25vZGVfaXNfbWlzc2luZ193YXNttgEjdHNfdHJlZV9jdXJzb3JfY3VycmVudF9ub2RlX2lkX3dhc223ASJ0c190cmVlX2N1cnNvcl9zdGFydF9wb3NpdGlvbl93YXNtuAEgdHNfdHJlZV9jdXJzb3JfZW5kX3Bvc2l0aW9uX3dhc225AR90c190cmVlX2N1cnNvcl9zdGFydF9pbmRleF93YXNtugEddHNfdHJlZV9jdXJzb3JfZW5kX2luZGV4X3dhc227ASR0c190cmVlX2N1cnNvcl9jdXJyZW50X2ZpZWxkX2lkX3dhc228ASF0c190cmVlX2N1cnNvcl9jdXJyZW50X2RlcHRoX3dhc229ASx0c190cmVlX2N1cnNvcl9jdXJyZW50X2Rlc2NlbmRhbnRfaW5kZXhfd2Fzbb4BIHRzX3RyZWVfY3Vyc29yX2N1cnJlbnRfbm9kZV93YXNtvwETdHNfbm9kZV9zeW1ib2xfd2FzbcABIXRzX25vZGVfZmllbGRfbmFtZV9mb3JfY2hpbGRfd2FzbcEBJ3RzX25vZGVfZmllbGRfbmFtZV9mb3JfbmFtZWRfY2hpbGRfd2FzbcIBIXRzX25vZGVfY2hpbGRyZW5fYnlfZmllbGRfaWRfd2FzbcMBIXRzX25vZGVfZmlyc3RfY2hpbGRfZm9yX2J5dGVfd2FzbcQBJ3RzX25vZGVfZmlyc3RfbmFtZWRfY2hpbGRfZm9yX2J5dGVfd2FzbcUBG3RzX25vZGVfZ3JhbW1hcl9zeW1ib2xfd2FzbcYBGHRzX25vZGVfY2hpbGRfY291bnRfd2FzbccBHnRzX25vZGVfbmFtZWRfY2hpbGRfY291bnRfd2FzbcgBEnRzX25vZGVfY2hpbGRfd2FzbckBGHRzX25vZGVfbmFtZWRfY2hpbGRfd2FzbcoBHnRzX25vZGVfY2hpbGRfYnlfZmllbGRfaWRfd2FzbcsBGXRzX25vZGVfbmV4dF9zaWJsaW5nX3dhc23MARl0c19ub2RlX3ByZXZfc2libGluZ193YXNtzQEfdHNfbm9kZV9uZXh0X25hbWVkX3NpYmxpbmdfd2Fzbc4BH3RzX25vZGVfcHJldl9uYW1lZF9zaWJsaW5nX3dhc23PAR10c19ub2RlX2Rlc2NlbmRhbnRfY291bnRfd2FzbdABE3RzX25vZGVfcGFyZW50X3dhc23RASJ0c19ub2RlX2NoaWxkX3dpdGhfZGVzY2VuZGFudF93YXNt0gEhdHNfbm9kZV9kZXNjZW5kYW50X2Zvcl9pbmRleF93YXNt0wEndHNfbm9kZV9uYW1lZF9kZXNjZW5kYW50X2Zvcl9pbmRleF93YXNt1AEkdHNfbm9kZV9kZXNjZW5kYW50X2Zvcl9wb3NpdGlvbl93YXNt1QEqdHNfbm9kZV9uYW1lZF9kZXNjZW5kYW50X2Zvcl9wb3NpdGlvbl93YXNt1gEYdHNfbm9kZV9zdGFydF9wb2ludF93YXNt1wEWdHNfbm9kZV9lbmRfcG9pbnRfd2FzbdgBGHRzX25vZGVfc3RhcnRfaW5kZXhfd2FzbdkBFnRzX25vZGVfZW5kX2luZGV4X3dhc23aARZ0c19ub2RlX3RvX3N0cmluZ193YXNt2wEVdHNfbm9kZV9jaGlsZHJlbl93YXNt3AEbdHNfbm9kZV9uYW1lZF9jaGlsZHJlbl93YXNt3QEgdHNfbm9kZV9kZXNjZW5kYW50c19vZl90eXBlX3dhc23eARV0c19ub2RlX2lzX25hbWVkX3dhc23fARh0c19ub2RlX2hhc19jaGFuZ2VzX3dhc23gARZ0c19ub2RlX2hhc19lcnJvcl93YXNt4QEVdHNfbm9kZV9pc19lcnJvcl93YXNt4gEXdHNfbm9kZV9pc19taXNzaW5nX3dhc23jARV0c19ub2RlX2lzX2V4dHJhX3dhc23kARh0c19ub2RlX3BhcnNlX3N0YXRlX3dhc23lAR10c19ub2RlX25leHRfcGFyc2Vfc3RhdGVfd2FzbeYBFXRzX3F1ZXJ5X21hdGNoZXNfd2FzbecBF3F1ZXJ5X3Byb2dyZXNzX2NhbGxiYWNr6AEWdHNfcXVlcnlfY2FwdHVyZXNfd2FzbekBDV9fc3RkaW9fY2xvc2XqAQxfX3N0ZGlvX3NlZWvrAQ1fX3N0ZGlvX3dyaXRl7AEFYWJvcnTtAQ9fX2Nsb2NrX2dldHRpbWXuAQhfX21lbXNldO8BCV9fdG93cml0ZfABCl9fb3ZlcmZsb3fxAQdkb19wdXRj8gEIX19tZW1jcHnzAQlfX2Z3cml0ZXj0AQZmd3JpdGX1AQhpc3dhbG51bfYBCGlzd2FscGhh9wEIaXN3c3BhY2X4AQZtZW1jbXD5AQhzbnByaW50ZvoBBnN0cmxlbvsBB3N0cm5jbXD8AQZtZW1jaHL9AQVmcmV4cP4BC3ByaW50Zl9jb3Jl/wEDb3V0gAIGZ2V0aW50gQIHcG9wX2FyZ4ICBWZtdF91gwIDcGFkhAIGZm10X2ZwhQITcG9wX2FyZ19sb25nX2RvdWJsZYYCCXZzbnByaW50ZocCCHNuX3dyaXRliAIGd2N0b21iiQIIZGxtYWxsb2OKAgZkbGZyZWWLAglkbHJlYWxsb2OMAg1kaXNwb3NlX2NodW5rjQIIZGxjYWxsb2OOAgRzYnJrjwIIc2V0VGhyZXeQAgh0b3dsb3dlcpECB2Nhc2VtYXCSAgh0b3d1cHBlcpMCCGlzd2RpZ2l0lAIZX2Vtc2NyaXB0ZW5fc3RhY2tfcmVzdG9yZZUCF19lbXNjcmlwdGVuX3N0YWNrX2FsbG9jlgIcZW1zY3JpcHRlbl9zdGFja19nZXRfY3VycmVudJcCCGlzd2xvd2VymAIIaXN3YmxhbmuZAgdzdHJuY2F0mgIIaXN3dXBwZXKbAgdtZW1tb3ZlnAIHc3RybmNweZ0CCWlzd3hkaWdpdJ4CBnN0cmNtcAfJAgwAD19fc3RhY2tfcG9pbnRlcgENX19tZW1vcnlfYmFzZQIMX190YWJsZV9iYXNlAwtfX2hlYXBfYmFzZQQkR09ULmRhdGEuaW50ZXJuYWwudHNfY3VycmVudF9yZWFsbG9jBSNHT1QuZGF0YS5pbnRlcm5hbC50c19jdXJyZW50X21hbGxvYwYhR09ULmRhdGEuaW50ZXJuYWwudHNfY3VycmVudF9mcmVlByNHT1QuZGF0YS5pbnRlcm5hbC50c19jdXJyZW50X2NhbGxvYwgYR09ULmRhdGEuaW50ZXJuYWwuc3RkZXJyCSFHT1QuZGF0YS5pbnRlcm5hbC5UUkFOU0ZFUl9CVUZGRVIKG0dPVC5kYXRhLmludGVybmFsLl9fVEhSRVdfXwseR09ULmRhdGEuaW50ZXJuYWwuX190aHJld1ZhbHVlCQgBAAUuZGF0YQAnEHNvdXJjZU1hcHBpbmdVUkwVLnRyZWUtc2l0dGVyLndhc20ubWFw", import.meta.url).href;
    }
    __name(findWasmBinary, "findWasmBinary");
    function getBinarySync(e) {
      if (e == wasmBinaryFile && wasmBinary)
        return new Uint8Array(wasmBinary);
      if (readBinary)
        return readBinary(e);
      throw "both async and sync fetching of the wasm failed";
    }
    __name(getBinarySync, "getBinarySync");
    async function getWasmBinary(e) {
      if (!wasmBinary)
        try {
          var A = await readAsync(e);
          return new Uint8Array(A);
        } catch {
        }
      return getBinarySync(e);
    }
    __name(getWasmBinary, "getWasmBinary");
    async function instantiateArrayBuffer(e, A) {
      try {
        var g = await getWasmBinary(e), r = await WebAssembly.instantiate(g, A);
        return r;
      } catch (B) {
        err(`failed to asynchronously prepare wasm: ${B}`), abort(B);
      }
    }
    __name(instantiateArrayBuffer, "instantiateArrayBuffer");
    async function instantiateAsync(e, A, g) {
      if (!e && typeof WebAssembly.instantiateStreaming == "function" && !isFileURI(A) && !ENVIRONMENT_IS_NODE)
        try {
          var r = fetch(A, {
            credentials: "same-origin"
          }), B = await WebAssembly.instantiateStreaming(r, g);
          return B;
        } catch (F) {
          err(`wasm streaming compile failed: ${F}`), err("falling back to ArrayBuffer instantiation");
        }
      return instantiateArrayBuffer(A, g);
    }
    __name(instantiateAsync, "instantiateAsync");
    function getWasmImports() {
      return {
        env: wasmImports,
        wasi_snapshot_preview1: wasmImports,
        "GOT.mem": new Proxy(wasmImports, GOTHandler),
        "GOT.func": new Proxy(wasmImports, GOTHandler)
      };
    }
    __name(getWasmImports, "getWasmImports");
    async function createWasm() {
      function e(F, k) {
        wasmExports = F.exports, wasmExports = relocateExports(wasmExports, 1024);
        var P = getDylinkMetadata(k);
        return P.neededDynlibs && (dynamicLibraries = P.neededDynlibs.concat(dynamicLibraries)), mergeLibSymbols(wasmExports, "main"), LDSO.init(), loadDylibs(), __RELOC_FUNCS__.push(wasmExports.__wasm_apply_data_relocs), removeRunDependency(), wasmExports;
      }
      __name(e, "receiveInstance"), addRunDependency();
      function A(F) {
        return e(F.instance, F.module);
      }
      __name(A, "receiveInstantiationResult");
      var g = getWasmImports();
      if (Module.instantiateWasm)
        return new Promise((F, k) => {
          Module.instantiateWasm(g, (P, q) => {
            e(P, q), F(P.exports);
          });
        });
      wasmBinaryFile ??= findWasmBinary();
      try {
        var r = await instantiateAsync(wasmBinary, wasmBinaryFile, g), B = A(r);
        return B;
      } catch (F) {
        return readyPromiseReject(F), Promise.reject(F);
      }
    }
    __name(createWasm, "createWasm");
    const s = class s {
      name = "ExitStatus";
      constructor(A) {
        this.message = `Program terminated with exit(${A})`, this.status = A;
      }
    };
    __name(s, "ExitStatus");
    let ExitStatus = s;
    var GOT = {}, currentModuleWeakSymbols = /* @__PURE__ */ new Set([]), GOTHandler = {
      get(e, A) {
        var g = GOT[A];
        return g || (g = GOT[A] = new WebAssembly.Global({
          value: "i32",
          mutable: !0
        })), currentModuleWeakSymbols.has(A) || (g.required = !0), g;
      }
    }, LE_HEAP_LOAD_F32 = /* @__PURE__ */ __name((e) => HEAP_DATA_VIEW.getFloat32(e, !0), "LE_HEAP_LOAD_F32"), LE_HEAP_LOAD_F64 = /* @__PURE__ */ __name((e) => HEAP_DATA_VIEW.getFloat64(e, !0), "LE_HEAP_LOAD_F64"), LE_HEAP_LOAD_I16 = /* @__PURE__ */ __name((e) => HEAP_DATA_VIEW.getInt16(e, !0), "LE_HEAP_LOAD_I16"), LE_HEAP_LOAD_I32 = /* @__PURE__ */ __name((e) => HEAP_DATA_VIEW.getInt32(e, !0), "LE_HEAP_LOAD_I32"), LE_HEAP_LOAD_U32 = /* @__PURE__ */ __name((e) => HEAP_DATA_VIEW.getUint32(e, !0), "LE_HEAP_LOAD_U32"), LE_HEAP_STORE_F32 = /* @__PURE__ */ __name((e, A) => HEAP_DATA_VIEW.setFloat32(e, A, !0), "LE_HEAP_STORE_F32"), LE_HEAP_STORE_F64 = /* @__PURE__ */ __name((e, A) => HEAP_DATA_VIEW.setFloat64(e, A, !0), "LE_HEAP_STORE_F64"), LE_HEAP_STORE_I16 = /* @__PURE__ */ __name((e, A) => HEAP_DATA_VIEW.setInt16(e, A, !0), "LE_HEAP_STORE_I16"), LE_HEAP_STORE_I32 = /* @__PURE__ */ __name((e, A) => HEAP_DATA_VIEW.setInt32(e, A, !0), "LE_HEAP_STORE_I32"), LE_HEAP_STORE_U32 = /* @__PURE__ */ __name((e, A) => HEAP_DATA_VIEW.setUint32(e, A, !0), "LE_HEAP_STORE_U32"), callRuntimeCallbacks = /* @__PURE__ */ __name((e) => {
      for (; e.length > 0; )
        e.shift()(Module);
    }, "callRuntimeCallbacks"), onPostRuns = [], addOnPostRun = /* @__PURE__ */ __name((e) => onPostRuns.unshift(e), "addOnPostRun"), onPreRuns = [], addOnPreRun = /* @__PURE__ */ __name((e) => onPreRuns.unshift(e), "addOnPreRun"), UTF8Decoder = typeof TextDecoder < "u" ? new TextDecoder() : void 0, UTF8ArrayToString = /* @__PURE__ */ __name((e, A = 0, g = NaN) => {
      for (var r = A + g, B = A; e[B] && !(B >= r); ) ++B;
      if (B - A > 16 && e.buffer && UTF8Decoder)
        return UTF8Decoder.decode(e.subarray(A, B));
      for (var F = ""; A < B; ) {
        var k = e[A++];
        if (!(k & 128)) {
          F += String.fromCharCode(k);
          continue;
        }
        var P = e[A++] & 63;
        if ((k & 224) == 192) {
          F += String.fromCharCode((k & 31) << 6 | P);
          continue;
        }
        var q = e[A++] & 63;
        if ((k & 240) == 224 ? k = (k & 15) << 12 | P << 6 | q : k = (k & 7) << 18 | P << 12 | q << 6 | e[A++] & 63, k < 65536)
          F += String.fromCharCode(k);
        else {
          var Z = k - 65536;
          F += String.fromCharCode(55296 | Z >> 10, 56320 | Z & 1023);
        }
      }
      return F;
    }, "UTF8ArrayToString"), getDylinkMetadata = /* @__PURE__ */ __name((e) => {
      var A = 0, g = 0;
      function r() {
        return e[A++];
      }
      __name(r, "getU8");
      function B() {
        for (var G = 0, K = 1; ; ) {
          var gA = e[A++];
          if (G += (gA & 127) * K, K *= 128, !(gA & 128)) break;
        }
        return G;
      }
      __name(B, "getLEB");
      function F() {
        var G = B();
        return A += G, UTF8ArrayToString(e, A - G, G);
      }
      __name(F, "getString");
      function k(G, K) {
        if (G) throw new Error(K);
      }
      __name(k, "failIf");
      var P = "dylink.0";
      if (e instanceof WebAssembly.Module) {
        var q = WebAssembly.Module.customSections(e, P);
        q.length === 0 && (P = "dylink", q = WebAssembly.Module.customSections(e, P)), k(q.length === 0, "need dylink section"), e = new Uint8Array(q[0]), g = e.length;
      } else {
        var Z = new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer), $ = Z[0] == 1836278016 || Z[0] == 6386541;
        k(!$, "need to see wasm magic number"), k(e[8] !== 0, "need the dylink section to be first"), A = 9;
        var sA = B();
        g = A + sA, P = F();
      }
      var X = {
        neededDynlibs: [],
        tlsExports: /* @__PURE__ */ new Set(),
        weakImports: /* @__PURE__ */ new Set()
      };
      if (P == "dylink") {
        X.memorySize = B(), X.memoryAlign = B(), X.tableSize = B(), X.tableAlign = B();
        for (var S = B(), J = 0; J < S; ++J) {
          var eA = F();
          X.neededDynlibs.push(eA);
        }
      } else {
        k(P !== "dylink.0");
        for (var b = 1, N = 2, p = 3, h = 4, E = 256, u = 3, o = 1; A < g; ) {
          var Q = r(), d = B();
          if (Q === b)
            X.memorySize = B(), X.memoryAlign = B(), X.tableSize = B(), X.tableAlign = B();
          else if (Q === N)
            for (var S = B(), J = 0; J < S; ++J)
              eA = F(), X.neededDynlibs.push(eA);
          else if (Q === p)
            for (var c = B(); c--; ) {
              var n = F(), L = B();
              L & E && X.tlsExports.add(n);
            }
          else if (Q === h)
            for (var c = B(); c--; ) {
              F();
              var n = F(), L = B();
              (L & u) == o && X.weakImports.add(n);
            }
          else
            A += d;
        }
      }
      return X;
    }, "getDylinkMetadata");
    function getValue(e, A = "i8") {
      switch (A.endsWith("*") && (A = "*"), A) {
        case "i1":
          return HEAP8[e];
        case "i8":
          return HEAP8[e];
        case "i16":
          return LE_HEAP_LOAD_I16((e >> 1) * 2);
        case "i32":
          return LE_HEAP_LOAD_I32((e >> 2) * 4);
        case "i64":
          return HEAP64[e >> 3];
        case "float":
          return LE_HEAP_LOAD_F32((e >> 2) * 4);
        case "double":
          return LE_HEAP_LOAD_F64((e >> 3) * 8);
        case "*":
          return LE_HEAP_LOAD_U32((e >> 2) * 4);
        default:
          abort(`invalid type for getValue: ${A}`);
      }
    }
    __name(getValue, "getValue");
    var newDSO = /* @__PURE__ */ __name((e, A, g) => {
      var r = {
        refcount: 1 / 0,
        name: e,
        exports: g,
        global: !0
      };
      return LDSO.loadedLibsByName[e] = r, A != null && (LDSO.loadedLibsByHandle[A] = r), r;
    }, "newDSO"), LDSO = {
      loadedLibsByName: {},
      loadedLibsByHandle: {},
      init() {
        newDSO("__main__", 0, wasmImports);
      }
    }, ___heap_base = 78224, alignMemory = /* @__PURE__ */ __name((e, A) => Math.ceil(e / A) * A, "alignMemory"), getMemory = /* @__PURE__ */ __name((e) => {
      if (runtimeInitialized)
        return _calloc(e, 1);
      var A = ___heap_base, g = A + alignMemory(e, 16);
      return ___heap_base = g, GOT.__heap_base.value = g, A;
    }, "getMemory"), isInternalSym = /* @__PURE__ */ __name((e) => ["__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm", "__start_em_js", "__stop_em_js"].includes(e) || e.startsWith("__em_js__"), "isInternalSym"), uleb128Encode = /* @__PURE__ */ __name((e, A) => {
      e < 128 ? A.push(e) : A.push(e % 128 | 128, e >> 7);
    }, "uleb128Encode"), sigToWasmTypes = /* @__PURE__ */ __name((e) => {
      for (var A = {
        i: "i32",
        j: "i64",
        f: "f32",
        d: "f64",
        e: "externref",
        p: "i32"
      }, g = {
        parameters: [],
        results: e[0] == "v" ? [] : [A[e[0]]]
      }, r = 1; r < e.length; ++r)
        g.parameters.push(A[e[r]]);
      return g;
    }, "sigToWasmTypes"), generateFuncType = /* @__PURE__ */ __name((e, A) => {
      var g = e.slice(0, 1), r = e.slice(1), B = {
        i: 127,
        // i32
        p: 127,
        // i32
        j: 126,
        // i64
        f: 125,
        // f32
        d: 124,
        // f64
        e: 111
      };
      A.push(96), uleb128Encode(r.length, A);
      for (var F = 0; F < r.length; ++F)
        A.push(B[r[F]]);
      g == "v" ? A.push(0) : A.push(1, B[g]);
    }, "generateFuncType"), convertJsFunctionToWasm = /* @__PURE__ */ __name((e, A) => {
      if (typeof WebAssembly.Function == "function")
        return new WebAssembly.Function(sigToWasmTypes(A), e);
      var g = [1];
      generateFuncType(A, g);
      var r = [
        0,
        97,
        115,
        109,
        // magic ("\0asm")
        1,
        0,
        0,
        0,
        // version: 1
        1
      ];
      uleb128Encode(g.length, r), r.push(...g), r.push(
        2,
        7,
        // import section
        // (import "e" "f" (func 0 (type 0)))
        1,
        1,
        101,
        1,
        102,
        0,
        0,
        7,
        5,
        // export section
        // (export "f" (func 0 (type 0)))
        1,
        1,
        102,
        0,
        0
      );
      var B = new WebAssembly.Module(new Uint8Array(r)), F = new WebAssembly.Instance(B, {
        e: {
          f: e
        }
      }), k = F.exports.f;
      return k;
    }, "convertJsFunctionToWasm"), wasmTableMirror = [], wasmTable = new WebAssembly.Table({
      initial: 31,
      element: "anyfunc"
    }), getWasmTableEntry = /* @__PURE__ */ __name((e) => {
      var A = wasmTableMirror[e];
      return A || (e >= wasmTableMirror.length && (wasmTableMirror.length = e + 1), wasmTableMirror[e] = A = wasmTable.get(e)), A;
    }, "getWasmTableEntry"), updateTableMap = /* @__PURE__ */ __name((e, A) => {
      if (functionsInTableMap)
        for (var g = e; g < e + A; g++) {
          var r = getWasmTableEntry(g);
          r && functionsInTableMap.set(r, g);
        }
    }, "updateTableMap"), functionsInTableMap, getFunctionAddress = /* @__PURE__ */ __name((e) => (functionsInTableMap || (functionsInTableMap = /* @__PURE__ */ new WeakMap(), updateTableMap(0, wasmTable.length)), functionsInTableMap.get(e) || 0), "getFunctionAddress"), freeTableIndexes = [], getEmptyTableSlot = /* @__PURE__ */ __name(() => {
      if (freeTableIndexes.length)
        return freeTableIndexes.pop();
      try {
        wasmTable.grow(1);
      } catch (e) {
        throw e instanceof RangeError ? "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH." : e;
      }
      return wasmTable.length - 1;
    }, "getEmptyTableSlot"), setWasmTableEntry = /* @__PURE__ */ __name((e, A) => {
      wasmTable.set(e, A), wasmTableMirror[e] = wasmTable.get(e);
    }, "setWasmTableEntry"), addFunction = /* @__PURE__ */ __name((e, A) => {
      var g = getFunctionAddress(e);
      if (g)
        return g;
      var r = getEmptyTableSlot();
      try {
        setWasmTableEntry(r, e);
      } catch (F) {
        if (!(F instanceof TypeError))
          throw F;
        var B = convertJsFunctionToWasm(e, A);
        setWasmTableEntry(r, B);
      }
      return functionsInTableMap.set(e, r), r;
    }, "addFunction"), updateGOT = /* @__PURE__ */ __name((e, A) => {
      for (var g in e)
        if (!isInternalSym(g)) {
          var r = e[g];
          GOT[g] ||= new WebAssembly.Global({
            value: "i32",
            mutable: !0
          }), (A || GOT[g].value == 0) && (typeof r == "function" ? GOT[g].value = addFunction(r) : typeof r == "number" ? GOT[g].value = r : err(`unhandled export type for '${g}': ${typeof r}`));
        }
    }, "updateGOT"), relocateExports = /* @__PURE__ */ __name((e, A, g) => {
      var r = {};
      for (var B in e) {
        var F = e[B];
        typeof F == "object" && (F = F.value), typeof F == "number" && (F += A), r[B] = F;
      }
      return updateGOT(r, g), r;
    }, "relocateExports"), isSymbolDefined = /* @__PURE__ */ __name((e) => {
      var A = wasmImports[e];
      return !(!A || A.stub);
    }, "isSymbolDefined"), dynCall = /* @__PURE__ */ __name((e, A, g = []) => {
      var r = getWasmTableEntry(A)(...g);
      return r;
    }, "dynCall"), stackSave = /* @__PURE__ */ __name(() => _emscripten_stack_get_current(), "stackSave"), stackRestore = /* @__PURE__ */ __name((e) => __emscripten_stack_restore(e), "stackRestore"), createInvokeFunction = /* @__PURE__ */ __name((e) => (A, ...g) => {
      var r = stackSave();
      try {
        return dynCall(e, A, g);
      } catch (B) {
        if (stackRestore(r), B !== B + 0) throw B;
        if (_setThrew(1, 0), e[0] == "j") return 0n;
      }
    }, "createInvokeFunction"), resolveGlobalSymbol = /* @__PURE__ */ __name((e, A = !1) => {
      var g;
      return isSymbolDefined(e) ? g = wasmImports[e] : e.startsWith("invoke_") && (g = wasmImports[e] = createInvokeFunction(e.split("_")[1])), {
        sym: g,
        name: e
      };
    }, "resolveGlobalSymbol"), onPostCtors = [], addOnPostCtor = /* @__PURE__ */ __name((e) => onPostCtors.unshift(e), "addOnPostCtor"), UTF8ToString = /* @__PURE__ */ __name((e, A) => e ? UTF8ArrayToString(HEAPU8, e, A) : "", "UTF8ToString"), loadWebAssemblyModule = /* @__PURE__ */ __name((binary, flags, libName, localScope, handle) => {
      var metadata = getDylinkMetadata(binary);
      currentModuleWeakSymbols = metadata.weakImports;
      function loadModule() {
        var memAlign = Math.pow(2, metadata.memoryAlign), memoryBase = metadata.memorySize ? alignMemory(getMemory(metadata.memorySize + memAlign), memAlign) : 0, tableBase = metadata.tableSize ? wasmTable.length : 0;
        handle && (HEAP8[handle + 8] = 1, LE_HEAP_STORE_U32((handle + 12 >> 2) * 4, memoryBase), LE_HEAP_STORE_I32((handle + 16 >> 2) * 4, metadata.memorySize), LE_HEAP_STORE_U32((handle + 20 >> 2) * 4, tableBase), LE_HEAP_STORE_I32((handle + 24 >> 2) * 4, metadata.tableSize)), metadata.tableSize && wasmTable.grow(metadata.tableSize);
        var moduleExports;
        function resolveSymbol(e) {
          var A = resolveGlobalSymbol(e).sym;
          return !A && localScope && (A = localScope[e]), A || (A = moduleExports[e]), A;
        }
        __name(resolveSymbol, "resolveSymbol");
        var proxyHandler = {
          get(e, A) {
            switch (A) {
              case "__memory_base":
                return memoryBase;
              case "__table_base":
                return tableBase;
            }
            if (A in wasmImports && !wasmImports[A].stub) {
              var g = wasmImports[A];
              return g;
            }
            if (!(A in e)) {
              var r;
              e[A] = (...B) => (r ||= resolveSymbol(A), r(...B));
            }
            return e[A];
          }
        }, proxy = new Proxy({}, proxyHandler), info = {
          "GOT.mem": new Proxy({}, GOTHandler),
          "GOT.func": new Proxy({}, GOTHandler),
          env: proxy,
          wasi_snapshot_preview1: proxy
        };
        function postInstantiation(module, instance) {
          updateTableMap(tableBase, metadata.tableSize), moduleExports = relocateExports(instance.exports, memoryBase), flags.allowUndefined || reportUndefinedSymbols();
          function addEmAsm(addr, body) {
            for (var args = [], arity = 0; arity < 16 && body.indexOf("$" + arity) != -1; arity++)
              args.push("$" + arity);
            args = args.join(",");
            var func = `(${args}) => { ${body} };`;
            eval(func);
          }
          if (__name(addEmAsm, "addEmAsm"), "__start_em_asm" in moduleExports)
            for (var start = moduleExports.__start_em_asm, stop = moduleExports.__stop_em_asm; start < stop; ) {
              var jsString = UTF8ToString(start);
              addEmAsm(start, jsString), start = HEAPU8.indexOf(0, start) + 1;
            }
          function addEmJs(name, cSig, body) {
            var jsArgs = [];
            if (cSig = cSig.slice(1, -1), cSig != "void") {
              cSig = cSig.split(",");
              for (var i in cSig) {
                var jsArg = cSig[i].split(" ").pop();
                jsArgs.push(jsArg.replace("*", ""));
              }
            }
            var func = `(${jsArgs}) => ${body};`;
            moduleExports[name] = eval(func);
          }
          __name(addEmJs, "addEmJs");
          for (var name in moduleExports)
            if (name.startsWith("__em_js__")) {
              var start = moduleExports[name], jsString = UTF8ToString(start), parts = jsString.split("<::>");
              addEmJs(name.replace("__em_js__", ""), parts[0], parts[1]), delete moduleExports[name];
            }
          var applyRelocs = moduleExports.__wasm_apply_data_relocs;
          applyRelocs && (runtimeInitialized ? applyRelocs() : __RELOC_FUNCS__.push(applyRelocs));
          var init = moduleExports.__wasm_call_ctors;
          return init && (runtimeInitialized ? init() : addOnPostCtor(init)), moduleExports;
        }
        if (__name(postInstantiation, "postInstantiation"), flags.loadAsync) {
          if (binary instanceof WebAssembly.Module) {
            var instance = new WebAssembly.Instance(binary, info);
            return Promise.resolve(postInstantiation(binary, instance));
          }
          return WebAssembly.instantiate(binary, info).then((e) => postInstantiation(e.module, e.instance));
        }
        var module = binary instanceof WebAssembly.Module ? binary : new WebAssembly.Module(binary), instance = new WebAssembly.Instance(module, info);
        return postInstantiation(module, instance);
      }
      return __name(loadModule, "loadModule"), flags.loadAsync ? metadata.neededDynlibs.reduce((e, A) => e.then(() => loadDynamicLibrary(A, flags, localScope)), Promise.resolve()).then(loadModule) : (metadata.neededDynlibs.forEach((e) => loadDynamicLibrary(e, flags, localScope)), loadModule());
    }, "loadWebAssemblyModule"), mergeLibSymbols = /* @__PURE__ */ __name((e, A) => {
      for (var [g, r] of Object.entries(e)) {
        const B = /* @__PURE__ */ __name((k) => {
          isSymbolDefined(k) || (wasmImports[k] = r);
        }, "setImport");
        B(g);
        const F = "__main_argc_argv";
        g == "main" && B(F), g == F && B("main");
      }
    }, "mergeLibSymbols"), asyncLoad = /* @__PURE__ */ __name(async (e) => {
      var A = await readAsync(e);
      return new Uint8Array(A);
    }, "asyncLoad");
    function loadDynamicLibrary(e, A = {
      global: !0,
      nodelete: !0
    }, g, r) {
      var B = LDSO.loadedLibsByName[e];
      if (B)
        return A.global ? B.global || (B.global = !0, mergeLibSymbols(B.exports, e)) : g && Object.assign(g, B.exports), A.nodelete && B.refcount !== 1 / 0 && (B.refcount = 1 / 0), B.refcount++, r && (LDSO.loadedLibsByHandle[r] = B), A.loadAsync ? Promise.resolve(!0) : !0;
      B = newDSO(e, r, "loading"), B.refcount = A.nodelete ? 1 / 0 : 1, B.global = A.global;
      function F() {
        if (r) {
          var q = LE_HEAP_LOAD_U32((r + 28 >> 2) * 4), Z = LE_HEAP_LOAD_U32((r + 32 >> 2) * 4);
          if (q && Z) {
            var $ = HEAP8.slice(q, q + Z);
            return A.loadAsync ? Promise.resolve($) : $;
          }
        }
        var sA = locateFile(e);
        if (A.loadAsync)
          return asyncLoad(sA);
        if (!readBinary)
          throw new Error(`${sA}: file not found, and synchronous loading of external files is not available`);
        return readBinary(sA);
      }
      __name(F, "loadLibData");
      function k() {
        return A.loadAsync ? F().then((q) => loadWebAssemblyModule(q, A, e, g, r)) : loadWebAssemblyModule(F(), A, e, g, r);
      }
      __name(k, "getExports");
      function P(q) {
        B.global ? mergeLibSymbols(q, e) : g && Object.assign(g, q), B.exports = q;
      }
      return __name(P, "moduleLoaded"), A.loadAsync ? k().then((q) => (P(q), !0)) : (P(k()), !0);
    }
    __name(loadDynamicLibrary, "loadDynamicLibrary");
    var reportUndefinedSymbols = /* @__PURE__ */ __name(() => {
      for (var [e, A] of Object.entries(GOT))
        if (A.value == 0) {
          var g = resolveGlobalSymbol(e, !0).sym;
          if (!g && !A.required)
            continue;
          if (typeof g == "function")
            A.value = addFunction(g, g.sig);
          else if (typeof g == "number")
            A.value = g;
          else
            throw new Error(`bad export type for '${e}': ${typeof g}`);
        }
    }, "reportUndefinedSymbols"), loadDylibs = /* @__PURE__ */ __name(() => {
      if (!dynamicLibraries.length) {
        reportUndefinedSymbols();
        return;
      }
      addRunDependency(), dynamicLibraries.reduce((e, A) => e.then(() => loadDynamicLibrary(A, {
        loadAsync: !0,
        global: !0,
        nodelete: !0,
        allowUndefined: !0
      })), Promise.resolve()).then(() => {
        reportUndefinedSymbols(), removeRunDependency();
      });
    }, "loadDylibs"), noExitRuntime = Module.noExitRuntime || !0;
    function setValue(e, A, g = "i8") {
      switch (g.endsWith("*") && (g = "*"), g) {
        case "i1":
          HEAP8[e] = A;
          break;
        case "i8":
          HEAP8[e] = A;
          break;
        case "i16":
          LE_HEAP_STORE_I16((e >> 1) * 2, A);
          break;
        case "i32":
          LE_HEAP_STORE_I32((e >> 2) * 4, A);
          break;
        case "i64":
          HEAP64[e >> 3] = BigInt(A);
          break;
        case "float":
          LE_HEAP_STORE_F32((e >> 2) * 4, A);
          break;
        case "double":
          LE_HEAP_STORE_F64((e >> 3) * 8, A);
          break;
        case "*":
          LE_HEAP_STORE_U32((e >> 2) * 4, A);
          break;
        default:
          abort(`invalid type for setValue: ${g}`);
      }
    }
    __name(setValue, "setValue");
    var ___memory_base = new WebAssembly.Global({
      value: "i32",
      mutable: !1
    }, 1024), ___stack_pointer = new WebAssembly.Global({
      value: "i32",
      mutable: !0
    }, 78224), ___table_base = new WebAssembly.Global({
      value: "i32",
      mutable: !1
    }, 1), __abort_js = /* @__PURE__ */ __name(() => abort(""), "__abort_js");
    __abort_js.sig = "v";
    var _emscripten_get_now = /* @__PURE__ */ __name(() => performance.now(), "_emscripten_get_now");
    _emscripten_get_now.sig = "d";
    var _emscripten_date_now = /* @__PURE__ */ __name(() => Date.now(), "_emscripten_date_now");
    _emscripten_date_now.sig = "d";
    var checkWasiClock = /* @__PURE__ */ __name((e) => e >= 0 && e <= 3, "checkWasiClock"), INT53_MAX = 9007199254740992, INT53_MIN = -9007199254740992, bigintToI53Checked = /* @__PURE__ */ __name((e) => e < INT53_MIN || e > INT53_MAX ? NaN : Number(e), "bigintToI53Checked");
    function _clock_time_get(e, A, g) {
      if (A = bigintToI53Checked(A), !checkWasiClock(e))
        return 28;
      var r;
      e === 0 ? r = _emscripten_date_now() : r = _emscripten_get_now();
      var B = Math.round(r * 1e3 * 1e3);
      return HEAP64[g >> 3] = BigInt(B), 0;
    }
    __name(_clock_time_get, "_clock_time_get"), _clock_time_get.sig = "iijp";
    var getHeapMax = /* @__PURE__ */ __name(() => (
      // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
      // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
      // for any code that deals with heap sizes, which would require special
      // casing all heap size related code to treat 0 specially.
      2147483648
    ), "getHeapMax"), growMemory = /* @__PURE__ */ __name((e) => {
      var A = wasmMemory.buffer, g = (e - A.byteLength + 65535) / 65536 | 0;
      try {
        return wasmMemory.grow(g), updateMemoryViews(), 1;
      } catch {
      }
    }, "growMemory"), _emscripten_resize_heap = /* @__PURE__ */ __name((e) => {
      var A = HEAPU8.length;
      e >>>= 0;
      var g = getHeapMax();
      if (e > g)
        return !1;
      for (var r = 1; r <= 4; r *= 2) {
        var B = A * (1 + 0.2 / r);
        B = Math.min(B, e + 100663296);
        var F = Math.min(g, alignMemory(Math.max(e, B), 65536)), k = growMemory(F);
        if (k)
          return !0;
      }
      return !1;
    }, "_emscripten_resize_heap");
    _emscripten_resize_heap.sig = "ip";
    var _fd_close = /* @__PURE__ */ __name((e) => 52, "_fd_close");
    _fd_close.sig = "ii";
    function _fd_seek(e, A, g, r) {
      return A = bigintToI53Checked(A), 70;
    }
    __name(_fd_seek, "_fd_seek"), _fd_seek.sig = "iijip";
    var printCharBuffers = [null, [], []], printChar = /* @__PURE__ */ __name((e, A) => {
      var g = printCharBuffers[e];
      A === 0 || A === 10 ? ((e === 1 ? out : err)(UTF8ArrayToString(g)), g.length = 0) : g.push(A);
    }, "printChar"), _fd_write = /* @__PURE__ */ __name((e, A, g, r) => {
      for (var B = 0, F = 0; F < g; F++) {
        var k = LE_HEAP_LOAD_U32((A >> 2) * 4), P = LE_HEAP_LOAD_U32((A + 4 >> 2) * 4);
        A += 8;
        for (var q = 0; q < P; q++)
          printChar(e, HEAPU8[k + q]);
        B += P;
      }
      return LE_HEAP_STORE_U32((r >> 2) * 4, B), 0;
    }, "_fd_write");
    _fd_write.sig = "iippp";
    function _tree_sitter_log_callback(e, A) {
      if (Module.currentLogCallback) {
        const g = UTF8ToString(A);
        Module.currentLogCallback(g, e !== 0);
      }
    }
    __name(_tree_sitter_log_callback, "_tree_sitter_log_callback");
    function _tree_sitter_parse_callback(e, A, g, r, B) {
      const k = Module.currentParseCallback(A, {
        row: g,
        column: r
      });
      typeof k == "string" ? (setValue(B, k.length, "i32"), stringToUTF16(k, e, 10240)) : setValue(B, 0, "i32");
    }
    __name(_tree_sitter_parse_callback, "_tree_sitter_parse_callback");
    function _tree_sitter_progress_callback(e, A) {
      return Module.currentProgressCallback ? Module.currentProgressCallback({
        currentOffset: e,
        hasError: A
      }) : !1;
    }
    __name(_tree_sitter_progress_callback, "_tree_sitter_progress_callback");
    function _tree_sitter_query_progress_callback(e) {
      return Module.currentQueryProgressCallback ? Module.currentQueryProgressCallback({
        currentOffset: e
      }) : !1;
    }
    __name(_tree_sitter_query_progress_callback, "_tree_sitter_query_progress_callback");
    var keepRuntimeAlive = /* @__PURE__ */ __name(() => noExitRuntime, "keepRuntimeAlive"), _proc_exit = /* @__PURE__ */ __name((e) => {
      EXITSTATUS = e, keepRuntimeAlive() || (Module.onExit?.(e), ABORT = !0), quit_(e, new ExitStatus(e));
    }, "_proc_exit");
    _proc_exit.sig = "vi";
    var exitJS = /* @__PURE__ */ __name((e, A) => {
      EXITSTATUS = e, _proc_exit(e);
    }, "exitJS"), handleException = /* @__PURE__ */ __name((e) => {
      if (e instanceof ExitStatus || e == "unwind")
        return EXITSTATUS;
      quit_(1, e);
    }, "handleException"), lengthBytesUTF8 = /* @__PURE__ */ __name((e) => {
      for (var A = 0, g = 0; g < e.length; ++g) {
        var r = e.charCodeAt(g);
        r <= 127 ? A++ : r <= 2047 ? A += 2 : r >= 55296 && r <= 57343 ? (A += 4, ++g) : A += 3;
      }
      return A;
    }, "lengthBytesUTF8"), stringToUTF8Array = /* @__PURE__ */ __name((e, A, g, r) => {
      if (!(r > 0)) return 0;
      for (var B = g, F = g + r - 1, k = 0; k < e.length; ++k) {
        var P = e.charCodeAt(k);
        if (P >= 55296 && P <= 57343) {
          var q = e.charCodeAt(++k);
          P = 65536 + ((P & 1023) << 10) | q & 1023;
        }
        if (P <= 127) {
          if (g >= F) break;
          A[g++] = P;
        } else if (P <= 2047) {
          if (g + 1 >= F) break;
          A[g++] = 192 | P >> 6, A[g++] = 128 | P & 63;
        } else if (P <= 65535) {
          if (g + 2 >= F) break;
          A[g++] = 224 | P >> 12, A[g++] = 128 | P >> 6 & 63, A[g++] = 128 | P & 63;
        } else {
          if (g + 3 >= F) break;
          A[g++] = 240 | P >> 18, A[g++] = 128 | P >> 12 & 63, A[g++] = 128 | P >> 6 & 63, A[g++] = 128 | P & 63;
        }
      }
      return A[g] = 0, g - B;
    }, "stringToUTF8Array"), stringToUTF8 = /* @__PURE__ */ __name((e, A, g) => stringToUTF8Array(e, HEAPU8, A, g), "stringToUTF8"), stackAlloc = /* @__PURE__ */ __name((e) => __emscripten_stack_alloc(e), "stackAlloc"), stringToUTF8OnStack = /* @__PURE__ */ __name((e) => {
      var A = lengthBytesUTF8(e) + 1, g = stackAlloc(A);
      return stringToUTF8(e, g, A), g;
    }, "stringToUTF8OnStack"), AsciiToString = /* @__PURE__ */ __name((e) => {
      for (var A = ""; ; ) {
        var g = HEAPU8[e++];
        if (!g) return A;
        A += String.fromCharCode(g);
      }
    }, "AsciiToString"), stringToUTF16 = /* @__PURE__ */ __name((e, A, g) => {
      if (g ??= 2147483647, g < 2) return 0;
      g -= 2;
      for (var r = A, B = g < e.length * 2 ? g / 2 : e.length, F = 0; F < B; ++F) {
        var k = e.charCodeAt(F);
        LE_HEAP_STORE_I16((A >> 1) * 2, k), A += 2;
      }
      return LE_HEAP_STORE_I16((A >> 1) * 2, 0), A - r;
    }, "stringToUTF16"), wasmImports = {
      /** @export */
      __heap_base: ___heap_base,
      /** @export */
      __indirect_function_table: wasmTable,
      /** @export */
      __memory_base: ___memory_base,
      /** @export */
      __stack_pointer: ___stack_pointer,
      /** @export */
      __table_base: ___table_base,
      /** @export */
      _abort_js: __abort_js,
      /** @export */
      clock_time_get: _clock_time_get,
      /** @export */
      emscripten_resize_heap: _emscripten_resize_heap,
      /** @export */
      fd_close: _fd_close,
      /** @export */
      fd_seek: _fd_seek,
      /** @export */
      fd_write: _fd_write,
      /** @export */
      memory: wasmMemory,
      /** @export */
      tree_sitter_log_callback: _tree_sitter_log_callback,
      /** @export */
      tree_sitter_parse_callback: _tree_sitter_parse_callback,
      /** @export */
      tree_sitter_progress_callback: _tree_sitter_progress_callback,
      /** @export */
      tree_sitter_query_progress_callback: _tree_sitter_query_progress_callback
    }, wasmExports = await createWasm();
    wasmExports.__wasm_call_ctors, Module._malloc = wasmExports.malloc;
    var _calloc = Module._calloc = wasmExports.calloc;
    Module._realloc = wasmExports.realloc, Module._free = wasmExports.free, Module._memcmp = wasmExports.memcmp, Module._ts_language_symbol_count = wasmExports.ts_language_symbol_count, Module._ts_language_state_count = wasmExports.ts_language_state_count, Module._ts_language_version = wasmExports.ts_language_version, Module._ts_language_abi_version = wasmExports.ts_language_abi_version, Module._ts_language_metadata = wasmExports.ts_language_metadata, Module._ts_language_name = wasmExports.ts_language_name, Module._ts_language_field_count = wasmExports.ts_language_field_count, Module._ts_language_next_state = wasmExports.ts_language_next_state, Module._ts_language_symbol_name = wasmExports.ts_language_symbol_name, Module._ts_language_symbol_for_name = wasmExports.ts_language_symbol_for_name, Module._strncmp = wasmExports.strncmp, Module._ts_language_symbol_type = wasmExports.ts_language_symbol_type, Module._ts_language_field_name_for_id = wasmExports.ts_language_field_name_for_id, Module._ts_lookahead_iterator_new = wasmExports.ts_lookahead_iterator_new, Module._ts_lookahead_iterator_delete = wasmExports.ts_lookahead_iterator_delete, Module._ts_lookahead_iterator_reset_state = wasmExports.ts_lookahead_iterator_reset_state, Module._ts_lookahead_iterator_reset = wasmExports.ts_lookahead_iterator_reset, Module._ts_lookahead_iterator_next = wasmExports.ts_lookahead_iterator_next, Module._ts_lookahead_iterator_current_symbol = wasmExports.ts_lookahead_iterator_current_symbol, Module._ts_parser_delete = wasmExports.ts_parser_delete, Module._ts_parser_reset = wasmExports.ts_parser_reset, Module._ts_parser_set_language = wasmExports.ts_parser_set_language, Module._ts_parser_timeout_micros = wasmExports.ts_parser_timeout_micros, Module._ts_parser_set_timeout_micros = wasmExports.ts_parser_set_timeout_micros, Module._ts_parser_set_included_ranges = wasmExports.ts_parser_set_included_ranges, Module._ts_query_new = wasmExports.ts_query_new, Module._ts_query_delete = wasmExports.ts_query_delete, Module._iswspace = wasmExports.iswspace, Module._iswalnum = wasmExports.iswalnum, Module._ts_query_pattern_count = wasmExports.ts_query_pattern_count, Module._ts_query_capture_count = wasmExports.ts_query_capture_count, Module._ts_query_string_count = wasmExports.ts_query_string_count, Module._ts_query_capture_name_for_id = wasmExports.ts_query_capture_name_for_id, Module._ts_query_capture_quantifier_for_id = wasmExports.ts_query_capture_quantifier_for_id, Module._ts_query_string_value_for_id = wasmExports.ts_query_string_value_for_id, Module._ts_query_predicates_for_pattern = wasmExports.ts_query_predicates_for_pattern, Module._ts_query_start_byte_for_pattern = wasmExports.ts_query_start_byte_for_pattern, Module._ts_query_end_byte_for_pattern = wasmExports.ts_query_end_byte_for_pattern, Module._ts_query_is_pattern_rooted = wasmExports.ts_query_is_pattern_rooted, Module._ts_query_is_pattern_non_local = wasmExports.ts_query_is_pattern_non_local, Module._ts_query_is_pattern_guaranteed_at_step = wasmExports.ts_query_is_pattern_guaranteed_at_step, Module._ts_query_disable_capture = wasmExports.ts_query_disable_capture, Module._ts_query_disable_pattern = wasmExports.ts_query_disable_pattern, Module._ts_tree_copy = wasmExports.ts_tree_copy, Module._ts_tree_delete = wasmExports.ts_tree_delete, Module._ts_init = wasmExports.ts_init, Module._ts_parser_new_wasm = wasmExports.ts_parser_new_wasm, Module._ts_parser_enable_logger_wasm = wasmExports.ts_parser_enable_logger_wasm, Module._ts_parser_parse_wasm = wasmExports.ts_parser_parse_wasm, Module._ts_parser_included_ranges_wasm = wasmExports.ts_parser_included_ranges_wasm, Module._ts_language_type_is_named_wasm = wasmExports.ts_language_type_is_named_wasm, Module._ts_language_type_is_visible_wasm = wasmExports.ts_language_type_is_visible_wasm, Module._ts_language_supertypes_wasm = wasmExports.ts_language_supertypes_wasm, Module._ts_language_subtypes_wasm = wasmExports.ts_language_subtypes_wasm, Module._ts_tree_root_node_wasm = wasmExports.ts_tree_root_node_wasm, Module._ts_tree_root_node_with_offset_wasm = wasmExports.ts_tree_root_node_with_offset_wasm, Module._ts_tree_edit_wasm = wasmExports.ts_tree_edit_wasm, Module._ts_tree_included_ranges_wasm = wasmExports.ts_tree_included_ranges_wasm, Module._ts_tree_get_changed_ranges_wasm = wasmExports.ts_tree_get_changed_ranges_wasm, Module._ts_tree_cursor_new_wasm = wasmExports.ts_tree_cursor_new_wasm, Module._ts_tree_cursor_copy_wasm = wasmExports.ts_tree_cursor_copy_wasm, Module._ts_tree_cursor_delete_wasm = wasmExports.ts_tree_cursor_delete_wasm, Module._ts_tree_cursor_reset_wasm = wasmExports.ts_tree_cursor_reset_wasm, Module._ts_tree_cursor_reset_to_wasm = wasmExports.ts_tree_cursor_reset_to_wasm, Module._ts_tree_cursor_goto_first_child_wasm = wasmExports.ts_tree_cursor_goto_first_child_wasm, Module._ts_tree_cursor_goto_last_child_wasm = wasmExports.ts_tree_cursor_goto_last_child_wasm, Module._ts_tree_cursor_goto_first_child_for_index_wasm = wasmExports.ts_tree_cursor_goto_first_child_for_index_wasm, Module._ts_tree_cursor_goto_first_child_for_position_wasm = wasmExports.ts_tree_cursor_goto_first_child_for_position_wasm, Module._ts_tree_cursor_goto_next_sibling_wasm = wasmExports.ts_tree_cursor_goto_next_sibling_wasm, Module._ts_tree_cursor_goto_previous_sibling_wasm = wasmExports.ts_tree_cursor_goto_previous_sibling_wasm, Module._ts_tree_cursor_goto_descendant_wasm = wasmExports.ts_tree_cursor_goto_descendant_wasm, Module._ts_tree_cursor_goto_parent_wasm = wasmExports.ts_tree_cursor_goto_parent_wasm, Module._ts_tree_cursor_current_node_type_id_wasm = wasmExports.ts_tree_cursor_current_node_type_id_wasm, Module._ts_tree_cursor_current_node_state_id_wasm = wasmExports.ts_tree_cursor_current_node_state_id_wasm, Module._ts_tree_cursor_current_node_is_named_wasm = wasmExports.ts_tree_cursor_current_node_is_named_wasm, Module._ts_tree_cursor_current_node_is_missing_wasm = wasmExports.ts_tree_cursor_current_node_is_missing_wasm, Module._ts_tree_cursor_current_node_id_wasm = wasmExports.ts_tree_cursor_current_node_id_wasm, Module._ts_tree_cursor_start_position_wasm = wasmExports.ts_tree_cursor_start_position_wasm, Module._ts_tree_cursor_end_position_wasm = wasmExports.ts_tree_cursor_end_position_wasm, Module._ts_tree_cursor_start_index_wasm = wasmExports.ts_tree_cursor_start_index_wasm, Module._ts_tree_cursor_end_index_wasm = wasmExports.ts_tree_cursor_end_index_wasm, Module._ts_tree_cursor_current_field_id_wasm = wasmExports.ts_tree_cursor_current_field_id_wasm, Module._ts_tree_cursor_current_depth_wasm = wasmExports.ts_tree_cursor_current_depth_wasm, Module._ts_tree_cursor_current_descendant_index_wasm = wasmExports.ts_tree_cursor_current_descendant_index_wasm, Module._ts_tree_cursor_current_node_wasm = wasmExports.ts_tree_cursor_current_node_wasm, Module._ts_node_symbol_wasm = wasmExports.ts_node_symbol_wasm, Module._ts_node_field_name_for_child_wasm = wasmExports.ts_node_field_name_for_child_wasm, Module._ts_node_field_name_for_named_child_wasm = wasmExports.ts_node_field_name_for_named_child_wasm, Module._ts_node_children_by_field_id_wasm = wasmExports.ts_node_children_by_field_id_wasm, Module._ts_node_first_child_for_byte_wasm = wasmExports.ts_node_first_child_for_byte_wasm, Module._ts_node_first_named_child_for_byte_wasm = wasmExports.ts_node_first_named_child_for_byte_wasm, Module._ts_node_grammar_symbol_wasm = wasmExports.ts_node_grammar_symbol_wasm, Module._ts_node_child_count_wasm = wasmExports.ts_node_child_count_wasm, Module._ts_node_named_child_count_wasm = wasmExports.ts_node_named_child_count_wasm, Module._ts_node_child_wasm = wasmExports.ts_node_child_wasm, Module._ts_node_named_child_wasm = wasmExports.ts_node_named_child_wasm, Module._ts_node_child_by_field_id_wasm = wasmExports.ts_node_child_by_field_id_wasm, Module._ts_node_next_sibling_wasm = wasmExports.ts_node_next_sibling_wasm, Module._ts_node_prev_sibling_wasm = wasmExports.ts_node_prev_sibling_wasm, Module._ts_node_next_named_sibling_wasm = wasmExports.ts_node_next_named_sibling_wasm, Module._ts_node_prev_named_sibling_wasm = wasmExports.ts_node_prev_named_sibling_wasm, Module._ts_node_descendant_count_wasm = wasmExports.ts_node_descendant_count_wasm, Module._ts_node_parent_wasm = wasmExports.ts_node_parent_wasm, Module._ts_node_child_with_descendant_wasm = wasmExports.ts_node_child_with_descendant_wasm, Module._ts_node_descendant_for_index_wasm = wasmExports.ts_node_descendant_for_index_wasm, Module._ts_node_named_descendant_for_index_wasm = wasmExports.ts_node_named_descendant_for_index_wasm, Module._ts_node_descendant_for_position_wasm = wasmExports.ts_node_descendant_for_position_wasm, Module._ts_node_named_descendant_for_position_wasm = wasmExports.ts_node_named_descendant_for_position_wasm, Module._ts_node_start_point_wasm = wasmExports.ts_node_start_point_wasm, Module._ts_node_end_point_wasm = wasmExports.ts_node_end_point_wasm, Module._ts_node_start_index_wasm = wasmExports.ts_node_start_index_wasm, Module._ts_node_end_index_wasm = wasmExports.ts_node_end_index_wasm, Module._ts_node_to_string_wasm = wasmExports.ts_node_to_string_wasm, Module._ts_node_children_wasm = wasmExports.ts_node_children_wasm, Module._ts_node_named_children_wasm = wasmExports.ts_node_named_children_wasm, Module._ts_node_descendants_of_type_wasm = wasmExports.ts_node_descendants_of_type_wasm, Module._ts_node_is_named_wasm = wasmExports.ts_node_is_named_wasm, Module._ts_node_has_changes_wasm = wasmExports.ts_node_has_changes_wasm, Module._ts_node_has_error_wasm = wasmExports.ts_node_has_error_wasm, Module._ts_node_is_error_wasm = wasmExports.ts_node_is_error_wasm, Module._ts_node_is_missing_wasm = wasmExports.ts_node_is_missing_wasm, Module._ts_node_is_extra_wasm = wasmExports.ts_node_is_extra_wasm, Module._ts_node_parse_state_wasm = wasmExports.ts_node_parse_state_wasm, Module._ts_node_next_parse_state_wasm = wasmExports.ts_node_next_parse_state_wasm, Module._ts_query_matches_wasm = wasmExports.ts_query_matches_wasm, Module._ts_query_captures_wasm = wasmExports.ts_query_captures_wasm, Module._memset = wasmExports.memset, Module._memcpy = wasmExports.memcpy, Module._memmove = wasmExports.memmove, Module._iswalpha = wasmExports.iswalpha, Module._iswblank = wasmExports.iswblank, Module._iswdigit = wasmExports.iswdigit, Module._iswlower = wasmExports.iswlower, Module._iswupper = wasmExports.iswupper, Module._iswxdigit = wasmExports.iswxdigit, Module._memchr = wasmExports.memchr, Module._strlen = wasmExports.strlen, Module._strcmp = wasmExports.strcmp, Module._strncat = wasmExports.strncat, Module._strncpy = wasmExports.strncpy, Module._towlower = wasmExports.towlower, Module._towupper = wasmExports.towupper;
    var _setThrew = wasmExports.setThrew, __emscripten_stack_restore = wasmExports._emscripten_stack_restore, __emscripten_stack_alloc = wasmExports._emscripten_stack_alloc, _emscripten_stack_get_current = wasmExports.emscripten_stack_get_current;
    wasmExports.__wasm_apply_data_relocs, Module.setValue = setValue, Module.getValue = getValue, Module.UTF8ToString = UTF8ToString, Module.stringToUTF8 = stringToUTF8, Module.lengthBytesUTF8 = lengthBytesUTF8, Module.AsciiToString = AsciiToString, Module.stringToUTF16 = stringToUTF16, Module.loadWebAssemblyModule = loadWebAssemblyModule;
    function callMain(e = []) {
      var A = resolveGlobalSymbol("main").sym;
      if (A) {
        e.unshift(thisProgram);
        var g = e.length, r = stackAlloc((g + 1) * 4), B = r;
        e.forEach((k) => {
          LE_HEAP_STORE_U32((B >> 2) * 4, stringToUTF8OnStack(k)), B += 4;
        }), LE_HEAP_STORE_U32((B >> 2) * 4, 0);
        try {
          var F = A(g, r);
          return exitJS(
            F,
            /* implicit = */
            !0
          ), F;
        } catch (k) {
          return handleException(k);
        }
      }
    }
    __name(callMain, "callMain");
    function run(e = arguments_) {
      if (runDependencies > 0) {
        dependenciesFulfilled = run;
        return;
      }
      if (preRun(), runDependencies > 0) {
        dependenciesFulfilled = run;
        return;
      }
      function A() {
        if (Module.calledRun = !0, !ABORT) {
          initRuntime(), readyPromiseResolve(Module), Module.onRuntimeInitialized?.();
          var g = Module.noInitialRun;
          g || callMain(e), postRun();
        }
      }
      __name(A, "doRun"), Module.setStatus ? (Module.setStatus("Running..."), setTimeout(() => {
        setTimeout(() => Module.setStatus(""), 1), A();
      }, 1)) : A();
    }
    if (__name(run, "run"), Module.preInit)
      for (typeof Module.preInit == "function" && (Module.preInit = [Module.preInit]); Module.preInit.length > 0; )
        Module.preInit.pop()();
    return run(), moduleRtn = readyPromise, moduleRtn;
  };
})(), tree_sitter_default = Module2, Module3 = null;
async function initializeBinding(s) {
  return Module3 || (Module3 = await tree_sitter_default(s)), Module3;
}
__name(initializeBinding, "initializeBinding");
function checkModule() {
  return !!Module3;
}
__name(checkModule, "checkModule");
var TRANSFER_BUFFER, LANGUAGE_VERSION, MIN_COMPATIBLE_VERSION, ge, Parser = (ge = class {
  /** @internal */
  0 = 0;
  // Internal handle for WASM
  /** @internal */
  1 = 0;
  // Internal handle for WASM
  /** @internal */
  logCallback = null;
  /** The parser's current language. */
  language = null;
  /**
   * This must always be called before creating a Parser.
   *
   * You can optionally pass in options to configure the WASM module, the most common
   * one being `locateFile` to help the module find the `.wasm` file.
   */
  static async init(e) {
    setModule(await initializeBinding(e)), TRANSFER_BUFFER = C._ts_init(), LANGUAGE_VERSION = C.getValue(TRANSFER_BUFFER, "i32"), MIN_COMPATIBLE_VERSION = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
  }
  /**
   * Create a new parser.
   */
  constructor() {
    this.initialize();
  }
  /** @internal */
  initialize() {
    if (!checkModule())
      throw new Error("cannot construct a Parser before calling `init()`");
    C._ts_parser_new_wasm(), this[0] = C.getValue(TRANSFER_BUFFER, "i32"), this[1] = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
  }
  /** Delete the parser, freeing its resources. */
  delete() {
    C._ts_parser_delete(this[0]), C._free(this[1]), this[0] = 0, this[1] = 0;
  }
  /**
   * Set the language that the parser should use for parsing.
   *
   * If the language was not successfully assigned, an error will be thrown.
   * This happens if the language was generated with an incompatible
   * version of the Tree-sitter CLI. Check the language's version using
   * {@link Language#version} and compare it to this library's
   * {@link LANGUAGE_VERSION} and {@link MIN_COMPATIBLE_VERSION} constants.
   */
  setLanguage(e) {
    let A;
    if (!e)
      A = 0, this.language = null;
    else if (e.constructor === Language) {
      A = e[0];
      const g = C._ts_language_version(A);
      if (g < MIN_COMPATIBLE_VERSION || LANGUAGE_VERSION < g)
        throw new Error(
          `Incompatible language version ${g}. Compatibility range ${MIN_COMPATIBLE_VERSION} through ${LANGUAGE_VERSION}.`
        );
      this.language = e;
    } else
      throw new Error("Argument must be a Language");
    return C._ts_parser_set_language(this[0], A), this;
  }
  /**
   * Parse a slice of UTF8 text.
   *
   * @param {string | ParseCallback} callback - The UTF8-encoded text to parse or a callback function.
   *
   * @param {Tree | null} [oldTree] - A previous syntax tree parsed from the same document. If the text of the
   *   document has changed since `oldTree` was created, then you must edit `oldTree` to match
   *   the new text using {@link Tree#edit}.
   *
   * @param {ParseOptions} [options] - Options for parsing the text.
   *  This can be used to set the included ranges, or a progress callback.
   *
   * @returns {Tree | null} A {@link Tree} if parsing succeeded, or `null` if:
   *  - The parser has not yet had a language assigned with {@link Parser#setLanguage}.
   *  - The progress callback returned true.
   */
  parse(e, A, g) {
    if (typeof e == "string")
      C.currentParseCallback = (P) => e.slice(P);
    else if (typeof e == "function")
      C.currentParseCallback = e;
    else
      throw new Error("Argument must be a string or a function");
    g?.progressCallback ? C.currentProgressCallback = g.progressCallback : C.currentProgressCallback = null, this.logCallback ? (C.currentLogCallback = this.logCallback, C._ts_parser_enable_logger_wasm(this[0], 1)) : (C.currentLogCallback = null, C._ts_parser_enable_logger_wasm(this[0], 0));
    let r = 0, B = 0;
    if (g?.includedRanges) {
      r = g.includedRanges.length, B = C._calloc(r, SIZE_OF_RANGE);
      let P = B;
      for (let q = 0; q < r; q++)
        marshalRange(P, g.includedRanges[q]), P += SIZE_OF_RANGE;
    }
    const F = C._ts_parser_parse_wasm(
      this[0],
      this[1],
      A ? A[0] : 0,
      B,
      r
    );
    if (!F)
      return C.currentParseCallback = null, C.currentLogCallback = null, C.currentProgressCallback = null, null;
    if (!this.language)
      throw new Error("Parser must have a language to parse");
    const k = new Tree(INTERNAL, F, this.language, C.currentParseCallback);
    return C.currentParseCallback = null, C.currentLogCallback = null, C.currentProgressCallback = null, k;
  }
  /**
   * Instruct the parser to start the next parse from the beginning.
   *
   * If the parser previously failed because of a timeout, cancellation,
   * or callback, then by default, it will resume where it left off on the
   * next call to {@link Parser#parse} or other parsing functions.
   * If you don't want to resume, and instead intend to use this parser to
   * parse some other document, you must call `reset` first.
   */
  reset() {
    C._ts_parser_reset(this[0]);
  }
  /** Get the ranges of text that the parser will include when parsing. */
  getIncludedRanges() {
    C._ts_parser_included_ranges_wasm(this[0]);
    const e = C.getValue(TRANSFER_BUFFER, "i32"), A = C.getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), g = new Array(e);
    if (e > 0) {
      let r = A;
      for (let B = 0; B < e; B++)
        g[B] = unmarshalRange(r), r += SIZE_OF_RANGE;
      C._free(A);
    }
    return g;
  }
  /**
   * @deprecated since version 0.25.0, prefer passing a progress callback to {@link Parser#parse}
   *
   * Get the duration in microseconds that parsing is allowed to take.
   *
   * This is set via {@link Parser#setTimeoutMicros}.
   */
  getTimeoutMicros() {
    return C._ts_parser_timeout_micros(this[0]);
  }
  /**
   * @deprecated since version 0.25.0, prefer passing a progress callback to {@link Parser#parse}
   *
   * Set the maximum duration in microseconds that parsing should be allowed
   * to take before halting.
   *
   * If parsing takes longer than this, it will halt early, returning `null`.
   * See {@link Parser#parse} for more information.
   */
  setTimeoutMicros(e) {
    C._ts_parser_set_timeout_micros(this[0], 0, e);
  }
  /** Set the logging callback that a parser should use during parsing. */
  setLogger(e) {
    if (!e)
      this.logCallback = null;
    else {
      if (typeof e != "function")
        throw new Error("Logger callback must be a function");
      this.logCallback = e;
    }
    return this;
  }
  /** Get the parser's current logger. */
  getLogger() {
    return this.logCallback;
  }
}, __name(ge, "Parser"), ge);
const supportedLanguages = {
  cpp: "cpp",
  hpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hxx: "cpp",
  cp: "cpp",
  hh: "cpp",
  inc: "cpp",
  // Depended on this PR: https://github.com/tree-sitter/tree-sitter-cpp/pull/173
  // ccm: "cpp",
  // c++m: "cpp",
  // cppm: "cpp",
  // cxxm: "cpp",
  cs: "c_sharp",
  c: "c",
  h: "c",
  css: "css",
  php: "php",
  phtml: "php",
  php3: "php",
  php4: "php",
  php5: "php",
  php7: "php",
  phps: "php",
  "php-s": "php",
  bash: "bash",
  sh: "bash",
  json: "json",
  ts: "typescript",
  mts: "typescript",
  cts: "typescript",
  tsx: "tsx",
  // vue: "vue",  // tree-sitter-vue parser is broken
  // The .wasm file being used is faulty, and yaml is split line-by-line anyway for the most part
  // yaml: "yaml",
  // yml: "yaml",
  elm: "elm",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  py: "python",
  ipynb: "python",
  pyw: "python",
  pyi: "python",
  el: "elisp",
  emacs: "elisp",
  ex: "elixir",
  exs: "elixir",
  go: "go",
  eex: "embedded_template",
  heex: "embedded_template",
  leex: "embedded_template",
  html: "html",
  htm: "html",
  java: "java",
  lua: "lua",
  ocaml: "ocaml",
  ml: "ocaml",
  mli: "ocaml",
  ql: "ql",
  res: "rescript",
  resi: "rescript",
  rb: "ruby",
  erb: "ruby",
  rs: "rust",
  rdl: "systemrdl",
  toml: "toml",
  sol: "solidity"
  // jl: "julia",
  // swift: "swift",
  // kt: "kotlin",
  // scala: "scala",
};
async function getParserForFile(s) {
  try {
    await Parser.init();
    const e = new Parser(), A = await getLanguageForFile(s);
    return A ? (e.setLanguage(A), e) : void 0;
  } catch {
    return;
  }
}
const nameToLanguage = /* @__PURE__ */ new Map();
async function getLanguageForFile(s) {
  try {
    await Parser.init();
    const e = path.extname(s).slice(1), A = supportedLanguages[e];
    if (!A)
      return;
    let g = nameToLanguage.get(A);
    return g || (g = await loadLanguageForFileExt(e), nameToLanguage.set(A, g)), g;
  } catch {
    return;
  }
}
async function loadLanguageForFileExt(s) {
  const e = path.join(
    __dirname,
    ...process.env.NODE_ENV === "test" ? ["node_modules", "tree-sitter-wasms", "out"] : ["..", "treesitter-wasm"],
    `tree-sitter-${supportedLanguages[s]}.wasm`
  );
  return await Language.load(e);
}
async function getAst(s, e) {
  const A = await getParserForFile(s);
  if (A)
    try {
      return A.parse(e) ?? void 0;
    } catch {
      return;
    }
}
function getTreePathAtCursor(s, e) {
  const A = [s.rootNode];
  for (; A[A.length - 1].childCount > 0; ) {
    let g = !1;
    for (const r of A[A.length - 1].children)
      if (r && r.startIndex <= e && r.endIndex >= e) {
        A.push(r), g = !0;
        break;
      }
    if (!g)
      break;
  }
  return A;
}
const FUNCTION_BLOCK_NODE_TYPES = ["block", "statement_block"], FUNCTION_DECLARATION_NODE_TYPES = [
  "method_definition",
  "function_definition",
  "function_item",
  "function_declaration",
  "method_declaration"
];
function gotoInputKey(s) {
  return `${s.name}${s.uri}${s.line}${s.character}`;
}
const MAX_CACHE_SIZE = 50, gotoCache = /* @__PURE__ */ new Map();
async function executeGotoProvider(s) {
  const e = gotoInputKey(s), A = gotoCache.get(e);
  if (A)
    return A;
  try {
    const g = await vscode.commands.executeCommand(
      s.name,
      vscode.Uri.file(s.uri),
      new vscode.Position(s.line, s.character)
    );
    if (!g || !Array.isArray(g))
      return [];
    const r = g.filter((B) => (B.targetUri ?? B.uri) && (B.targetRange ?? B.range)).map((B) => {
      const F = B.targetUri ?? B.uri, k = B.targetRange ?? B.range;
      if (!F || !k)
        throw new Error("Unexpected undefined uri or range");
      return {
        filepath: F.fsPath,
        range: {
          start: {
            line: k.start.line,
            character: k.start.character
          },
          end: {
            line: k.end.line,
            character: k.end.character
          }
        }
      };
    });
    if (gotoCache.size >= MAX_CACHE_SIZE) {
      const B = gotoCache.keys().next().value;
      B && gotoCache.delete(B);
    }
    return gotoCache.set(e, r), r;
  } catch {
    return [];
  }
}
async function readFile(s) {
  try {
    const e = vscode.Uri.file(s), A = await vscode.workspace.fs.readFile(e);
    return new TextDecoder("utf-8").decode(A);
  } catch {
    return "";
  }
}
async function readRangeInFile(s, e) {
  try {
    const A = vscode.Uri.file(s), g = await vscode.workspace.openTextDocument(A), r = new vscode.Range(
      new vscode.Position(e.start.line, e.start.character),
      new vscode.Position(e.end.line, e.end.character)
    );
    return g.getText(r);
  } catch {
    return "";
  }
}
function isRifWithContents(s) {
  return typeof s.contents == "string";
}
function findChildren(s, e, A) {
  let g = [];
  if (A !== void 0 && A <= 0)
    return [];
  e(s) && g.push(s);
  for (const r of s.children)
    r && (g = g.concat(
      findChildren(r, e, A !== void 0 ? A - g.length : void 0)
    ));
  return g;
}
function findTypeIdentifiers(s) {
  return findChildren(
    s,
    (e) => e.type === "type_identifier" || ["ERROR"].includes(e.parent?.type ?? "") && e.type === "identifier" && e.text[0].toUpperCase() === e.text[0]
  );
}
function rangesIntersect(s, e) {
  return !(s.end.line < e.start.line || e.end.line < s.start.line || s.end.line === e.start.line && s.end.character < e.start.character || e.end.line === s.start.line && e.end.character < s.start.character);
}
async function crawlTypes(s, e = 1, A = [], g = /* @__PURE__ */ new Set()) {
  const r = isRifWithContents(s) ? s.contents : await readFile(s.filepath), B = await getAst(s.filepath, r);
  if (!B) return A;
  const F = B.rootNode.text.split(`
`).length, k = findTypeIdentifiers(B.rootNode).filter((q) => !g.has(q.text));
  k.forEach((q) => g.add(q.text));
  const P = await Promise.all(
    k.map(async (q) => {
      const [Z] = await executeGotoProvider({
        uri: s.filepath,
        line: s.range.start.line + Math.min(q.startPosition.row, F - 1),
        character: s.range.start.character + q.startPosition.column,
        name: "vscode.executeDefinitionProvider"
      });
      if (Z)
        return {
          ...Z,
          contents: await readRangeInFile(Z.filepath, Z.range)
        };
    })
  );
  for (const q of P)
    q && (A.some(
      (Z) => Z.filepath === q.filepath && rangesIntersect(Z.range, q.range)
    ) || A.push(q));
  if (e > 0)
    for (const q of [...A])
      await crawlTypes(q, e - 1, A, g);
  return A;
}
async function getDefinitionsForNode(s, e, A) {
  const g = [];
  switch (e.type) {
    case "call_expression": {
      const [r] = await executeGotoProvider({
        uri: s,
        line: e.startPosition.row,
        character: e.startPosition.column,
        name: "vscode.executeDefinitionProvider"
      });
      if (!r)
        return [];
      let B = await readRangeInFile(r.filepath, r.range);
      if (B.split(`
`).length > 15) {
        let k = !1;
        const P = await getAst(r.filepath, B);
        if (P) {
          const [q] = findChildren(
            P.rootNode,
            (Z) => FUNCTION_DECLARATION_NODE_TYPES.includes(Z.type),
            1
          );
          if (q) {
            const [Z] = findChildren(q, ($) => FUNCTION_BLOCK_NODE_TYPES.includes($.type), 1);
            Z && (B = P.rootNode.text.slice(0, Z.startIndex).trim(), k = !0);
          }
        }
        k || (B = B.split(`
`)[0]);
      }
      g.push(r);
      const F = await crawlTypes({
        ...r,
        contents: B
      });
      g.push(...F);
      break;
    }
    case "variable_declarator":
      break;
    case "impl_item":
      break;
    case "new_expression": {
      const r = e.children.find((P) => P?.type === "identifier"), [B] = await executeGotoProvider({
        uri: s,
        line: (r ?? e).endPosition.row,
        character: (r ?? e).endPosition.column,
        name: "vscode.executeDefinitionProvider"
      });
      if (!B)
        break;
      const F = await readRangeInFile(B.filepath, B.range);
      g.push({
        ...B,
        contents: `${r?.text ? `${A.singleLineComment} ${r.text}:
` : ""}${F.trim()}`
      });
      const k = await crawlTypes({ ...B, contents: F });
      g.push(...k.filter(Boolean));
      break;
    }
  }
  return await Promise.all(
    g.map(async (r) => {
      const B = {
        start: {
          line: r.range.start.line,
          character: r.range.start.character
        },
        end: {
          line: r.range.end.line,
          character: r.range.end.character
        }
      };
      return r.range = B, isRifWithContents(r) ? r : {
        ...r,
        contents: await readRangeInFile(r.filepath, r.range)
      };
    })
  );
}
const getDefinitionsFromLsp = async (s, e, A, g) => {
  try {
    const r = await getAst(s, e);
    if (!r) return [];
    const B = getTreePathAtCursor(r, A);
    if (B.length === 0) return [];
    const F = [];
    for (const k of B.reverse()) {
      const P = await getDefinitionsForNode(s, k, g);
      F.push(...P);
    }
    return F.map((k) => ({
      ...k,
      score: 0.8
    }));
  } catch {
    return [];
  }
};
class RecentlyEditedTracker {
  static staleTime = 1e3 * 60 * 2;
  static maxRecentlyEditedRanges = 3;
  recentlyEditedRanges = [];
  recentlyEditedDocuments = [];
  static maxRecentlyEditedDocuments = 10;
  constructor() {
    vscode.workspace.onDidChangeTextDocument((e) => {
      e.document.uri.scheme === "file" && (e.contentChanges.forEach((A) => {
        const g = {
          uri: e.document.uri,
          range: new vscode.Range(
            new vscode.Position(A.range.start.line, 0),
            new vscode.Position(A.range.end.line + 1, 0)
          ),
          timestamp: Date.now()
        };
        this.insertRange(g);
      }), this.insertDocument(e.document.uri));
    }), setInterval(() => {
      this.removeOldEntries();
    }, 1e3 * 15);
  }
  async insertRange(e) {
    for (let r = 0; r < this.recentlyEditedRanges.length; r++) {
      let B = this.recentlyEditedRanges[r];
      if (B.range.intersection(e.range)) {
        const F = B.range.union(e.range), k = await this._getContentsForRange({
          ...B,
          range: F
        });
        B = {
          ...B,
          range: F,
          lines: k.split(`
`),
          symbols: getSymbolsForSnippet(k)
        };
        return;
      }
    }
    const A = await this._getContentsForRange(e);
    this.recentlyEditedRanges.unshift({
      ...e,
      lines: A.split(`
`),
      symbols: getSymbolsForSnippet(A)
    }) >= RecentlyEditedTracker.maxRecentlyEditedRanges && (this.recentlyEditedRanges = this.recentlyEditedRanges.slice(0, RecentlyEditedTracker.maxRecentlyEditedRanges));
  }
  insertDocument(e) {
    if (this.recentlyEditedDocuments.some((g) => g.uri === e))
      return;
    this.recentlyEditedDocuments.unshift({
      uri: e,
      timestamp: Date.now()
    }) >= RecentlyEditedTracker.maxRecentlyEditedDocuments && (this.recentlyEditedDocuments = this.recentlyEditedDocuments.slice(
      0,
      RecentlyEditedTracker.maxRecentlyEditedDocuments
    ));
  }
  removeOldEntries() {
    this.recentlyEditedRanges = this.recentlyEditedRanges.filter(
      (e) => e.timestamp > Date.now() - RecentlyEditedTracker.staleTime
    );
  }
  async _getContentsForRange(e) {
    return (await vscode.workspace.fs.readFile(e.uri)).toString().split(`
`).slice(e.range.start.line, e.range.end.line + 1).join(`
`);
  }
  /**
   * Get recently edited ranges for autocomplete context
   */
  getRecentlyEditedRanges() {
    return this.recentlyEditedRanges.map((e) => ({
      ...e,
      filepath: e.uri.fsPath,
      range: {
        start: { line: e.range.start.line, character: e.range.start.character },
        end: { line: e.range.end.line, character: e.range.end.character }
      }
    }));
  }
  /**
   * Get recently edited documents for autocomplete context
   */
  async getRecentlyEditedDocuments() {
    return (await Promise.all(
      this.recentlyEditedDocuments.map(async (A) => {
        try {
          const g = await vscode.workspace.fs.readFile(A.uri).then((B) => B.toString()), r = g.split(`
`);
          return {
            filepath: A.uri.fsPath,
            contents: g,
            range: {
              start: { line: 0, character: 0 },
              end: {
                line: r.length - 1,
                character: r[r.length - 1].length
              }
            }
          };
        } catch {
          return null;
        }
      })
    )).filter((A) => A !== null);
  }
}
const rx = /[\s.,/#!$%^&*;:{}=\-_`~()[\]]/g;
function getSymbolsForSnippet(s) {
  const e = s.split(rx).map((A) => A.trim()).filter((A) => A !== "");
  return new Set(e);
}
const EXTENSION_NAME = "kiroAgent", AUTOCOMPLETE_ENABLED_FLAG = "enableTabAutocomplete";
var StatusBarStatus = /* @__PURE__ */ ((s) => (s[s.Disabled = 0] = "Disabled", s[s.Enabled = 1] = "Enabled", s[s.Paused = 2] = "Paused", s))(StatusBarStatus || {});
const quickPickStatusText = (s) => {
  switch (s) {
    case void 0:
    case 0:
      return "$(circle-slash) Disable autocomplete";
    case 1:
      return "$(check) Enable autocomplete";
    case 2:
      return "$(debug-pause) Pause autocomplete";
  }
}, getStatusBarStatusFromQuickPickItemLabel = (s) => {
  switch (s) {
    case "$(circle-slash) Disable autocomplete":
      return 0;
    case "$(check) Enable autocomplete":
      return 1;
    case "$(debug-pause) Pause autocomplete":
      return 2;
    default:
      return;
  }
}, statusBarItemText = (s) => {
  switch (s) {
    case void 0:
    case 0:
      return "$(circle-slash) Autocomplete";
    case 1:
      return "$(check) Autocomplete";
    case 2:
      return "$(debug-pause) Autocomplete";
  }
}, statusBarItemTooltip = (s) => {
  switch (s) {
    case void 0:
    case 0:
      return "Click to enable tab autocomplete";
    case 1:
      return "Tab autocomplete is enabled";
    case 2:
      return "Tab autocomplete is paused";
  }
};
let statusBarStatus, statusBarItem, statusBarFalseTimeout;
function stopStatusBarLoading() {
  statusBarFalseTimeout = setTimeout(() => {
    setupStatusBar(1, !1);
  }, 100);
}
function initStatusBar(s) {
  setupStatusBar(s);
  const e = vscode.workspace.onDidChangeConfiguration((A) => {
    if (A.affectsConfiguration(EXTENSION_NAME)) {
      const g = vscode.workspace.getConfiguration(EXTENSION_NAME).get(AUTOCOMPLETE_ENABLED_FLAG);
      if (g && statusBarStatus === 2)
        return;
      setupStatusBar(
        g ? 1 : 0
        /* Disabled */
      );
    }
  });
  return new vscode.Disposable(() => {
    e.dispose(), clearTimeout(statusBarFalseTimeout), statusBarFalseTimeout = void 0, statusBarItem?.dispose(), statusBarItem = void 0, statusBarStatus = void 0;
  });
}
function setupStatusBar(s, e) {
  e !== !1 && (clearTimeout(statusBarFalseTimeout), statusBarFalseTimeout = void 0), statusBarItem || (statusBarItem = vscode.window.createStatusBarItem("kiro.status.autocomplete", vscode.StatusBarAlignment.Right)), statusBarItem.text = e ? "$(loading~spin) Autocomplete" : statusBarItemText(s), statusBarItem.tooltip = statusBarItemTooltip(s ?? statusBarStatus), statusBarItem.command = "kiroAgent.openTabAutocompleteConfigMenu", statusBarItem.name = "Tab Autocomplete", statusBarItem.show(), s !== void 0 && (statusBarStatus = s);
}
function getStatusBarStatus() {
  return statusBarStatus;
}
const autocompleteLogger = vscode.window.createOutputChannel("autocomplete-completion");
class ContinueCompletionProvider {
  onError(e) {
    vscode.window.showErrorMessage(e.message);
  }
  completionProvider;
  recentlyEditedTracker = new RecentlyEditedTracker();
  constructor(e) {
    this.completionProvider = new CompletionProvider(e, this.onError.bind(this), getDefinitionsFromLsp), vscode.workspace.onDidChangeTextDocument((A) => {
      A.document.uri.fsPath, this._lastShownCompletion?.filepath;
    });
  }
  _lastShownCompletion;
  _lastVsCodeCompletionInput;
  /**
   * Provide inline completion items for the current cursor position
   */
  async provideInlineCompletionItems(e, A, g, r) {
    const B = getStatusBarStatus() === StatusBarStatus.Enabled;
    if (r.isCancellationRequested || !B || g.selectedCompletionInfo && !g.selectedCompletionInfo.text.startsWith(e.getText(g.selectedCompletionInfo.range)))
      return null;
    const F = void 0, k = {
      context: g,
      document: e,
      position: A
    }, P = g.selectedCompletionInfo;
    this._lastVsCodeCompletionInput = k;
    try {
      const q = new AbortController(), Z = q.signal;
      r.onCancellationRequested(() => q.abort());
      const $ = {
        line: A.line,
        character: A.character
      };
      let sA = e.getText();
      if (e.uri.scheme === "vscode-notebook-cell") {
        const h = vscode.workspace.notebookDocuments.find(
          (E) => E.getCells().some((u) => u.document.uri === e.uri)
        );
        if (h) {
          const E = h.getCells();
          sA = E.map((u) => {
            const o = u.document.getText();
            return u.kind === vscode.NotebookCellKind.Markup ? `"""${o}"""` : o;
          }).join(`

`);
          for (const u of E) {
            if (u.document.uri === e.uri)
              break;
            $.line += u.document.getText().split(`
`).length + 1;
          }
        }
      }
      const X = void 0;
      if (e.uri.scheme === "vscode-scm")
        return null;
      const S = {
        completionId: v4(),
        filepath: e.uri.fsPath,
        pos: $,
        recentlyEditedFiles: [],
        recentlyEditedRanges: this.recentlyEditedTracker.getRecentlyEditedRanges(),
        manuallyPassFileContents: sA,
        manuallyPassPrefix: X,
        selectedCompletionInfo: P,
        injectDetails: F
      };
      setupStatusBar(void 0, !0);
      const J = await this.completionProvider.provideInlineCompletionItems(autocompleteLogger, S, Z);
      if (!J || !J.completion || (P && (J.completion = P.text + J.completion), !this.willDisplay(P, Z, J)))
        return null;
      this.completionProvider.markDisplayed(S.completionId, J), this._lastShownCompletion = J;
      const b = P?.range.start ?? A, N = new vscode.Range(b, b.translate(0, J.completion.length)), p = new vscode.InlineCompletionItem(J.completion, N, {
        title: "Log Autocomplete Outcome",
        command: "kiroAgent.logAutocompleteOutcome",
        arguments: [S.completionId, this.completionProvider]
      });
      return p.completeBracketPairs = !0, [p];
    } finally {
      stopStatusBarLoading();
    }
  }
  /**
   * Called when a completion is about to be displayed
   */
  willDisplay(e, A, g) {
    if (e) {
      const { text: r, range: B } = e;
      if (!g.completion.startsWith(r))
        return !1;
    }
    return !A.aborted;
  }
}
const triggerThreshold = 0.25, osCoefficientMap = {
  "Mac OS X": -0.1552,
  "Windows 10": -0.0238,
  Windows: 0.0412,
  win32: -0.0559
}, triggerTypeCoefficientMap = {
  SpecialCharacters: 0.0209,
  Enter: 0.2853
}, languageCoefficientMap = {
  java: -0.4622,
  javascript: -0.4688,
  python: -0.3052,
  typescript: -0.6084,
  tsx: -0.6084,
  jsx: -0.4688,
  shell: -0.4718,
  ruby: -0.7356,
  sql: -0.4937,
  rust: -0.4309,
  kotlin: -0.4739,
  php: -0.3917,
  csharp: -0.3475,
  go: -0.3504,
  scala: -0.534,
  cpp: -0.1734,
  json: 0,
  yaml: -0.3,
  tf: -0.55
}, lineNumCoefficient = -0.0416, lengthOfLeftCurrentCoefficient = -1.1747, lengthOfLeftPrevCoefficient = 0.4033, lengthOfRightCoefficient = -0.3321, prevDecisionOtherCoefficient = 0, ideCoefficient = -0.1905, lengthLeft0To5 = -0.8756, lengthLeft5To10 = -0.5463, lengthLeft10To20 = -0.4081, lengthLeft20To30 = -0.3272, lengthLeft30To40 = -0.2442, lengthLeft40To50 = -0.1471, intercept = 0.3738713, maxx = {
  lineNum: 4631,
  lenLeftCur: 157,
  lenLeftPrev: 176,
  lenRight: 10239
}, minn = {
  lineNum: 0,
  lenLeftCur: 0,
  lenLeftPrev: 0,
  lenRight: 0
}, charCoefficients = {
  throw: 1.5868,
  ";": -1.268,
  any: -1.1565,
  7: -1.1347,
  false: -1.1307,
  nil: -1.0653,
  elif: 1.0122,
  9: -1.0098,
  pass: -1.0058,
  True: -1.0002,
  False: -0.9434,
  6: -0.9222,
  true: -0.9142,
  None: -0.9027,
  8: -0.9013,
  break: -0.8475,
  "}": -0.847,
  5: -0.8414,
  4: -0.8197,
  1: -0.8085,
  "\\": -0.8019,
  static: -0.7748,
  0: -0.77,
  end: -0.7617,
  "(": 0.7239,
  "/": -0.7104,
  where: -0.6981,
  readonly: -0.6741,
  async: -0.6723,
  3: -0.654,
  continue: -0.6413,
  struct: -0.64,
  try: -0.6369,
  float: -0.6341,
  using: 0.6079,
  "@": 0.6016,
  "|": 0.5993,
  impl: 0.5808,
  private: -0.5746,
  for: 0.5741,
  2: -0.5634,
  let: -0.5187,
  foreach: 0.5186,
  select: -0.5148,
  export: -0.5,
  mut: -0.4921,
  ")": -0.463,
  "]": -0.4611,
  when: 0.4602,
  virtual: -0.4583,
  extern: -0.4465,
  catch: 0.4446,
  new: 0.4394,
  val: -0.4339,
  map: 0.4284,
  case: 0.4271,
  throws: 0.4221,
  null: -0.4197,
  protected: -0.4133,
  q: 0.4125,
  except: 0.4115,
  ": ": 0.4072,
  "^": -0.407,
  " ": 0.4066,
  $: 0.3981,
  this: 0.3962,
  switch: 0.3947,
  "*": -0.3931,
  module: 0.3912,
  array: 0.385,
  "=": 0.3828,
  p: 0.3728,
  ON: 0.3708,
  "`": 0.3693,
  u: 0.3658,
  a: 0.3654,
  require: 0.3646,
  ">": -0.3644,
  const: -0.3476,
  o: 0.3423,
  sizeof: 0.3416,
  object: 0.3362,
  w: 0.3345,
  print: 0.3344,
  range: 0.3336,
  if: 0.3324,
  abstract: -0.3293,
  var: -0.3239,
  i: 0.321,
  while: 0.3138,
  J: 0.3137,
  c: 0.3118,
  await: -0.3072,
  from: 0.3057,
  f: 0.302,
  echo: 0.2995,
  "#": 0.2984,
  e: 0.2962,
  r: 0.2925,
  mod: 0.2893,
  loop: 0.2874,
  t: 0.2832,
  "~": 0.282,
  final: -0.2816,
  del: 0.2785,
  override: -0.2746,
  ref: -0.2737,
  h: 0.2693,
  m: 0.2681,
  "{": 0.2674,
  implements: 0.2672,
  inline: -0.2642,
  match: 0.2613,
  with: -0.261,
  x: 0.2597,
  namespace: -0.2596,
  operator: 0.2573,
  double: -0.2563,
  source: -0.2482,
  import: -0.2419,
  NULL: -0.2399,
  l: 0.239,
  or: 0.2378,
  s: 0.2366,
  then: 0.2354,
  W: 0.2354,
  y: 0.2333,
  local: 0.2288,
  is: 0.2282,
  n: 0.2254,
  "+": -0.2251,
  G: 0.223,
  public: -0.2229,
  WHERE: 0.2224,
  list: 0.2204,
  Q: 0.2204,
  "[": 0.2136,
  VALUES: 0.2134,
  H: 0.2105,
  g: 0.2094,
  else: -0.208,
  bool: -0.2066,
  long: -0.2059,
  R: 0.2025,
  S: 0.2021,
  d: 0.2003,
  V: 0.1974,
  K: -0.1961,
  "<": 0.1958,
  debugger: -0.1929,
  NOT: -0.1911,
  b: 0.1907,
  boolean: -0.1891,
  z: -0.1866,
  LIKE: -0.1793,
  raise: 0.1782,
  L: 0.1768,
  fn: 0.176,
  delete: 0.1714,
  unsigned: -0.1675,
  auto: -0.1648,
  finally: 0.1616,
  k: 0.1599,
  as: 0.156,
  instanceof: 0.1558,
  "&": 0.1554,
  E: 0.1551,
  M: 0.1542,
  I: 0.1503,
  Y: 0.1493,
  typeof: 0.1475,
  j: 0.1445,
  INTO: 0.1442,
  IF: 0.1437,
  next: 0.1433,
  undef: -0.1427,
  THEN: -0.1416,
  v: 0.1415,
  C: 0.1383,
  P: 0.1353,
  AND: -0.1345,
  constructor: 0.1337,
  void: -0.1336,
  class: -0.1328,
  defer: 0.1316,
  begin: 0.1306,
  FROM: -0.1304,
  SET: 0.1291,
  decimal: -0.1278,
  friend: 0.1277,
  SELECT: -0.1265,
  event: 0.1259,
  lambda: 0.1253,
  enum: 0.1215,
  A: 0.121,
  lock: 0.1187,
  ensure: 0.1184,
  "%": 0.1177,
  isset: 0.1175,
  O: 0.1174,
  ".": 0.1146,
  UNION: -0.1145,
  alias: -0.1129,
  template: -0.1102,
  WHEN: 0.1093,
  rescue: 0.1083,
  DISTINCT: -0.1074,
  trait: -0.1073,
  D: 0.1062,
  in: 0.1045,
  internal: -0.1029,
  ",": 0.1027,
  static_cast: 0.1016,
  do: -0.1005,
  OR: 0.1003,
  AS: -0.1001,
  interface: 0.0996,
  super: 0.0989,
  B: 0.0963,
  U: 0.0962,
  T: 0.0943,
  CALL: -0.0918,
  BETWEEN: -0.0915,
  N: 0.0897,
  yield: 0.0867,
  done: -0.0857,
  string: -0.0837,
  out: -0.0831,
  volatile: -0.0819,
  retry: 0.0816,
  "?": -0.0796,
  number: -0.0791,
  short: 0.0787,
  sealed: -0.0776,
  package: 0.0765,
  OPEN: -0.0756,
  base: 0.0735,
  and: 0.0729,
  exit: 0.0726,
  _: 0.0721,
  keyof: -0.072,
  def: 0.0713,
  crate: -0.0706,
  "-": -0.07,
  FUNCTION: 0.0692,
  declare: -0.0678,
  include: 0.0671,
  COUNT: -0.0669,
  INDEX: -0.0666,
  CLOSE: -0.0651,
  fi: -0.0644,
  uint: 0.0624,
  params: 0.0575,
  HAVING: 0.0575,
  byte: -0.0575,
  clone: -0.0552,
  char: -0.054,
  func: 0.0538,
  never: -0.053,
  unset: -0.0524,
  unless: -0.051,
  esac: -0.0509,
  shift: -0.0507,
  require_once: 0.0486,
  ELSE: -0.0477,
  extends: 0.0461,
  elseif: 0.0452,
  mutable: -0.0451,
  asm: 0.0449,
  "!": 0.0446,
  LIMIT: 0.0444,
  ushort: -0.0438,
  '"': -0.0433,
  Z: 0.0431,
  exec: -0.0431,
  IS: -0.0429,
  DECLARE: -0.0425,
  __LINE__: -0.0424,
  BEGIN: -0.0418,
  typedef: 0.0414,
  EXIT: -0.0412,
  "'": 0.041,
  function: -0.0393,
  dyn: -0.039,
  wchar_t: -0.0388,
  unique: -0.0383,
  include_once: 0.0367,
  stackalloc: 0.0359,
  RETURN: -0.0356,
  const_cast: 0.035,
  MAX: 0.0341,
  assert: -0.0331,
  JOIN: -0.0328,
  use: 0.0318,
  GET: 0.0317,
  VIEW: 0.0314,
  move: 0.0308,
  typename: 0.0308,
  die: 0.0305,
  asserts: -0.0304,
  reinterpret_cast: -0.0302,
  USING: -0.0289,
  elsif: -0.0285,
  FIRST: -0.028,
  self: -0.0278,
  RETURNING: -0.0278,
  symbol: -0.0273,
  OFFSET: 0.0263,
  bigint: 0.0253,
  register: -0.0237,
  union: -0.0227,
  return: -0.0227,
  until: -0.0224,
  endfor: -0.0213,
  implicit: -0.021,
  LOOP: 0.0195,
  pub: 0.0182,
  global: 0.0179,
  EXCEPTION: 0.0175,
  delegate: 0.0173,
  signed: -0.0163,
  FOR: 0.0156,
  unsafe: 0.014,
  NEXT: -0.0133,
  IN: 0.0129,
  MIN: -0.0123,
  go: -0.0112,
  type: -0.0109,
  explicit: -0.0107,
  eval: -0.0104,
  int: -99e-4,
  CASE: -96e-4,
  END: 84e-4,
  UPDATE: 74e-4,
  default: 72e-4,
  chan: 68e-4,
  fixed: 66e-4,
  not: -52e-4,
  X: -47e-4,
  endforeach: 31e-4,
  goto: 28e-4,
  empty: 22e-4,
  checked: 12e-4,
  F: -1e-3
};
function shouldTriggerFromClassifier({
  leftFileContent: s,
  rightFileContent: e,
  triggerType: A,
  lineNumber: g,
  languageName: r,
  logger: B
}) {
  const F = s.split(/\r?\n/), P = F[F.length - 1].trim().split(" ");
  let q = "";
  const Z = P[P.length - 1];
  Z && Z.length > 1 && (q = Z);
  const $ = F[F.length - 1].length, sA = F[F.length - 2]?.length ?? 0, X = e.trim().length, S = triggerTypeCoefficientMap[A || ""] ?? 0, J = osCoefficientMap[getNormalizedOsName()] ?? 0, eA = 0, b = charCoefficients[q] ?? 0, N = Object.values(languageCoefficientMap), p = N.length > 0 ? N.reduce((Q, d) => Q + d) / N.length : 0, h = languageCoefficientMap[r.toLowerCase()] ?? p, E = prevDecisionOtherCoefficient;
  let u = 0;
  s.length >= 0 && s.length < 5 ? u = lengthLeft0To5 : s.length >= 5 && s.length < 10 ? u = lengthLeft5To10 : s.length >= 10 && s.length < 20 ? u = lengthLeft10To20 : s.length >= 20 && s.length < 30 ? u = lengthLeft20To30 : s.length >= 30 && s.length < 40 ? u = lengthLeft30To40 : s.length >= 40 && s.length < 50 && (u = lengthLeft40To50);
  const o = sigmoid(
    lengthOfRightCoefficient * (X - minn.lenRight) / (maxx.lenRight - minn.lenRight) + lengthOfLeftCurrentCoefficient * ($ - minn.lenLeftCur) / (maxx.lenLeftCur - minn.lenLeftCur) + lengthOfLeftPrevCoefficient * (sA - minn.lenLeftPrev) / (maxx.lenLeftPrev - minn.lenLeftPrev) + lineNumCoefficient * (g - minn.lineNum) / (maxx.lineNum - minn.lineNum) + J + S + eA + b + ideCoefficient + intercept + E + h + u
  );
  return B?.appendLine(
    JSON.stringify(
      {
        provider: "qdev",
        classifierScore: o,
        triggerThreshold,
        shouldTrigger: o > triggerThreshold
      },
      null,
      2
    )
  ), o > triggerThreshold;
}
function getNormalizedOsName() {
  const s = require$$0$1.platform(), e = require$$0$1.version(), A = s.toLowerCase();
  return A.includes("windows") ? e ? e.includes("Windows NT 10") || e.startsWith("10") ? "Windows 10" : e.includes("6.1") ? "Windows 7" : e.includes("6.3") ? "Windows 8.1" : "Windows" : "Windows" : A.includes("macos") || A.includes("mac os") || A.includes("darwin") ? "Mac OS X" : A.includes("linux") ? "Linux" : s;
}
function sigmoid(s) {
  return 1 / (1 + Math.exp(-s));
}
function recordReferences(s) {
  if (s && s.length > 0) {
    const e = s.filter((A) => !!A.licenseName).map(({ licenseName: A, url: g, repository: r }) => ({
      licenseName: A,
      repository: r,
      url: g
    }));
    e.length > 0 && vscode.commands.executeCommand("kiroAgent.recordReferences", e);
  }
}
function createAutocompleteCommands(s) {
  return {
    "kiroAgent.logAutocompleteOutcome": (...e) => {
      const A = e[0];
      e[1].accept(A);
    },
    "kiroAgent.toggleTabAutocompleteEnabled": () => {
      const e = vscode.workspace.getConfiguration(EXTENSION_NAME), A = e.get("enableTabAutocomplete");
      !e.get("pauseTabAutocompleteOnBattery") || s.isACConnected() ? updateResolvedIDESetting(EXTENSION_NAME, "enableTabAutocomplete", !A) : A ? getStatusBarStatus() === StatusBarStatus.Paused ? setupStatusBar(StatusBarStatus.Enabled) : updateResolvedIDESetting(EXTENSION_NAME, "enableTabAutocomplete", !1) : (setupStatusBar(StatusBarStatus.Paused), updateResolvedIDESetting(EXTENSION_NAME, "enableTabAutocomplete", !0));
    },
    "kiroAgent.openTabAutocompleteConfigMenu": () => {
      const e = vscode.workspace.getConfiguration(EXTENSION_NAME), A = vscode.window.createQuickPick(), g = e.get("pauseTabAutocompleteOnBattery") && !s.isACConnected(), r = getStatusBarStatus();
      let B;
      g ? B = r === StatusBarStatus.Paused ? StatusBarStatus.Enabled : r === StatusBarStatus.Disabled ? StatusBarStatus.Paused : StatusBarStatus.Disabled : B = r === StatusBarStatus.Disabled ? StatusBarStatus.Enabled : StatusBarStatus.Disabled, A.items = [
        {
          label: quickPickStatusText(B)
        }
      ], A.onDidAccept(() => {
        const F = A.selectedItems[0].label, k = getStatusBarStatusFromQuickPickItemLabel(F);
        k !== void 0 && (setupStatusBar(k), updateResolvedIDESetting(
          EXTENSION_NAME,
          "enableTabAutocomplete",
          k === StatusBarStatus.Enabled
        )), A.dispose();
      }), A.show();
    }
  };
}
function registerAutocompleteCommands(s, e) {
  const A = createAutocompleteCommands(e);
  for (const [g, r] of Object.entries(A))
    s.subscriptions.push(vscode.commands.registerCommand(g, r));
}
const Metrics = new MetricReporter(TelemetryNamespace.Continue, "QCompletion");
class RuntimeServiceClient {
  async getCodeWhispererClientConfig() {
    const { region: e, endpoint: A } = await vscode.commands.executeCommand(
      "kiroAgent.configuration.getKrsConfig"
    ), g = vscode.kiroVersion ?? "0.0.0", r = new https.Agent({
      keepAlive: !0,
      // Optionally set keepAlive timeout (in milliseconds)
      keepAliveMsecs: 3e4,
      // Optionally set maximum sockets
      maxSockets: 20
    }), B = getMachineId();
    return {
      region: e,
      endpoint: A,
      token: { token: await authProvider.getToken() },
      customUserAgent: `KiroIDE ${g} ${B}`,
      maxAttempts: 1,
      requestHandler: {
        httpOptions: {
          agent: r
        }
      }
    };
  }
  async initializeRuntimeClient() {
    return new CodeWhispererRuntime(await this.getCodeWhispererClientConfig());
  }
  /**
   * Get tab completion from the CodeWhisperer service
   */
  async tabComplete({
    lineNumber: e,
    leftFileContent: A,
    rightFileContent: g,
    languageName: r,
    logger: B,
    filename: F,
    snippets: k
  }) {
    if (!shouldTriggerFromClassifier({ lineNumber: e, leftFileContent: A, rightFileContent: g, languageName: r, logger: B }))
      return;
    const P = await this.initializeRuntimeClient();
    addPrivacyHeadersMiddleware(P, "AmazonQDeveloper Runtime"), addAgentModeHeadersMiddleware(P, "autocomplete"), addExternalIdpTokenTypeMiddleware(P, authProvider.readToken()?.authMethod, "autocomplete"), addRedirectForInternalMiddleware(P, authProvider.readToken()?.provider);
    const q = await resolveProfileArn({ required: !0 }), Z = [];
    k.forEach((X) => {
      Z.push({
        content: X.contents,
        filePath: X.filepath
      });
    });
    const $ = new GenerateCompletionsCommand({
      fileContext: {
        leftFileContent: A,
        rightFileContent: g,
        filename: F,
        programmingLanguage: {
          languageName: r
        }
      },
      supplementalContexts: Z,
      profileArn: q
    }), sA = performance.now();
    try {
      Metrics.reportCountMetrics({ invoke: 1 });
      const X = await P.send($);
      if (Metrics.reportCountMetrics({ success: 1 }), B?.appendLine(
        JSON.stringify(
          {
            provider: "qdev",
            response: {
              id: X.$metadata.requestId,
              competions: X.completions
            },
            request: $
          },
          null,
          2
        )
      ), X.completions && X.completions.length > 0) {
        const S = X.completions[0];
        if (!S.content) {
          Metrics.reportCountMetrics({ emptyResponse: 1 });
          return;
        }
        return recordReferences(S.references), Metrics.reportHistogramMetrics({ length: S.content.length }), S.content;
      }
      Metrics.reportCountMetrics({ emptyResponse: 1 });
    } catch (X) {
      const S = X.$metadata?.requestId;
      if (B?.appendLine(
        JSON.stringify({
          provider: "qdev",
          requestId: S,
          error: X instanceof Error ? { name: X.name, message: X.message } : X,
          request: $
        })
      ), X instanceof AccessDeniedException)
        throw new AccessDeniedError("CodeWhispererRuntime: AccessDenied");
      if (X instanceof ThrottlingException && X.reason === "MONTHLY_REQUEST_COUNT") {
        vscode.window.showErrorMessage("Autocomplete Failed: Maximum Kiro usage reached for this month.");
        return;
      }
      if (X instanceof ValidationException) {
        Metrics.reportCountMetrics({ validationError: 1 });
        return;
      }
      if (X instanceof ThrottlingException) {
        Metrics.reportCountMetrics({ throttled: 1 });
        return;
      }
      throw Metrics.reportCountMetrics({ failure: 1 }), X;
    } finally {
      Metrics.reportHistogramMetrics({
        completeLatency: performance.now() - sA
      });
    }
  }
}
const isAutoCompleteEnabled = () => vscode.workspace.getConfiguration(EXTENSION_NAME).get(AUTOCOMPLETE_ENABLED_FLAG) ?? !1;
var lib = {};
const version = "5.30.6", require$$0 = {
  version
};
var util = {}, hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  const s = require$$0$1, e = require$$1$1, A = require$$2, g = require$$1.spawn, r = require$$1.exec, B = require$$1.execSync, F = require$$4, k = process.platform, P = k === "linux" || k === "android", q = k === "darwin", Z = k === "win32", $ = k === "freebsd", sA = k === "openbsd", X = k === "netbsd";
  let S = 0, J = "", eA = null, b = null;
  const N = process.env.WINDIR || "C:\\Windows";
  let p, h = "";
  const E = [];
  let u = !1, o = "";
  const Q = "$OutputEncoding = [System.Console]::OutputEncoding = [System.Console]::InputEncoding = [System.Text.Encoding]::UTF8 ; ", d = "--###START###--", c = "--ERROR--", n = "--###ENDCMD###--", L = "--##ID##--", G = {
    windowsHide: !0,
    maxBuffer: 1024 * 102400,
    encoding: "UTF-8",
    env: Object.assign({}, process.env, { LANG: "en_US.UTF-8" })
  }, K = {
    maxBuffer: 1024 * 102400,
    encoding: "UTF-8",
    stdio: ["pipe", "pipe", "ignore"]
  };
  function gA(iA) {
    let IA = parseInt(iA, 10);
    return isNaN(IA) && (IA = 0), IA;
  }
  function H(iA) {
    let IA = !1, j = "", nA = "";
    for (const CA of iA)
      CA >= "0" && CA <= "9" || IA ? (IA = !0, j += CA) : nA += CA;
    return [nA, j];
  }
  const U = new String(), V = new String().replace, m = new String().toLowerCase, a = new String().toString, I = new String().substr, t = new String().substring, l = new String().trim, D = new String().startsWith, f = Math.min;
  function w(iA) {
    return iA && {}.toString.call(iA) === "[object Function]";
  }
  function Y(iA) {
    const IA = [], j = {};
    for (let nA = 0; nA < iA.length; nA++) {
      let CA = Object.keys(iA[nA]);
      CA.sort((EA, yA) => EA - yA);
      let T = "";
      for (let EA = 0; EA < CA.length; EA++)
        T += JSON.stringify(CA[EA]), T += JSON.stringify(iA[nA][CA[EA]]);
      ({}).hasOwnProperty.call(j, T) || (IA.push(iA[nA]), j[T] = !0);
    }
    return IA;
  }
  function _(iA, IA) {
    return iA.sort((j, nA) => {
      let CA = "", T = "";
      return IA.forEach((EA) => {
        CA = CA + j[EA], T = T + nA[EA];
      }), CA < T ? -1 : CA > T ? 1 : 0;
    });
  }
  function x() {
    return S === 0 && (S = s.cpus().length), S;
  }
  function W(iA, IA, j, nA, CA) {
    j = j || ":", IA = IA.toLowerCase(), nA = nA || !1, CA = CA || !1;
    let T = "";
    return iA.some((EA) => {
      let yA = EA.toLowerCase().replace(/\t/g, "");
      if (nA && (yA = yA.trim()), yA.startsWith(IA) && (!CA || yA.match(IA + j) || yA.match(IA + " " + j))) {
        const mA = nA ? EA.trim().split(j) : EA.split(j);
        if (mA.length >= 2)
          return mA.shift(), T = mA.join(j).trim(), !0;
      }
      return !1;
    }), T;
  }
  function z(iA, IA) {
    return IA = IA || 16, iA.replace(/\\x([0-9A-Fa-f]{2})/g, function() {
      return String.fromCharCode(parseInt(arguments[1], IA));
    });
  }
  function aA(iA) {
    let IA = "", j = 0;
    return iA.split("").forEach((nA) => {
      nA >= "0" && nA <= "9" ? j === 1 && j++ : (j === 0 && j++, j === 1 && (IA += nA));
    }), IA;
  }
  function tA(iA, IA) {
    IA = IA || "", iA = iA.toUpperCase();
    let j = 0, nA = 0;
    const CA = aA(iA), T = iA.split(CA);
    if (T.length >= 2) {
      T[2] && (T[1] += T[2]);
      let EA = T[1] && T[1].toLowerCase().indexOf("pm") > -1 || T[1].toLowerCase().indexOf("p.m.") > -1 || T[1].toLowerCase().indexOf("p. m.") > -1 || T[1].toLowerCase().indexOf("n") > -1 || T[1].toLowerCase().indexOf("ch") > -1 || T[1].toLowerCase().indexOf("ös") > -1 || IA && T[1].toLowerCase().indexOf(IA) > -1;
      return j = parseInt(T[0], 10), nA = parseInt(T[1], 10), j = EA && j < 12 ? j + 12 : j, ("0" + j).substr(-2) + ":" + ("0" + nA).substr(-2);
    }
  }
  function M(iA, IA) {
    const j = {
      date: "",
      time: ""
    };
    IA = IA || {};
    const nA = (IA.dateFormat || "").toLowerCase(), CA = IA.pmDesignator || "", T = iA.split(" ");
    if (T[0]) {
      if (T[0].indexOf("/") >= 0) {
        const EA = T[0].split("/");
        EA.length === 3 && (EA[0].length === 4 ? j.date = EA[0] + "-" + ("0" + EA[1]).substr(-2) + "-" + ("0" + EA[2]).substr(-2) : EA[2].length === 2 ? (nA.indexOf("/d/") > -1 || nA.indexOf("/dd/") > -1, j.date = "20" + EA[2] + "-" + ("0" + EA[1]).substr(-2) + "-" + ("0" + EA[0]).substr(-2)) : (iA.toLowerCase().indexOf("pm") > -1 || iA.toLowerCase().indexOf("p.m.") > -1 || iA.toLowerCase().indexOf("p. m.") > -1 || iA.toLowerCase().indexOf("am") > -1 || iA.toLowerCase().indexOf("a.m.") > -1 || iA.toLowerCase().indexOf("a. m.") > -1 || nA.indexOf("/d/") > -1 || nA.indexOf("/dd/") > -1) && nA.indexOf("dd/") !== 0 ? j.date = EA[2] + "-" + ("0" + EA[0]).substr(-2) + "-" + ("0" + EA[1]).substr(-2) : j.date = EA[2] + "-" + ("0" + EA[1]).substr(-2) + "-" + ("0" + EA[0]).substr(-2));
      }
      if (T[0].indexOf(".") >= 0) {
        const EA = T[0].split(".");
        EA.length === 3 && (nA.indexOf(".d.") > -1 || nA.indexOf(".dd.") > -1 ? j.date = EA[2] + "-" + ("0" + EA[0]).substr(-2) + "-" + ("0" + EA[1]).substr(-2) : j.date = EA[2] + "-" + ("0" + EA[1]).substr(-2) + "-" + ("0" + EA[0]).substr(-2));
      }
      if (T[0].indexOf("-") >= 0) {
        const EA = T[0].split("-");
        EA.length === 3 && (j.date = EA[0] + "-" + ("0" + EA[1]).substr(-2) + "-" + ("0" + EA[2]).substr(-2));
      }
    }
    if (T[1]) {
      T.shift();
      const EA = T.join(" ");
      j.time = tA(EA, CA);
    }
    return j;
  }
  function O(iA, IA) {
    let j = IA > 0, nA = 1, CA = 0, T = 0;
    const EA = [];
    for (let mA = 0; mA < iA.length; mA++)
      nA <= IA ? (/\s/.test(iA[mA]) && !j && (T = mA - 1, EA.push({
        from: CA,
        to: T + 1,
        cap: iA.substring(CA, T + 1)
      }), CA = T + 2, nA++), j = iA[mA] === " ") : (!/\s/.test(iA[mA]) && j && (T = mA - 1, CA < T && EA.push({
        from: CA,
        to: T,
        cap: iA.substring(CA, T)
      }), CA = T + 1, nA++), j = iA[mA] === " ");
    T = 5e3, EA.push({
      from: CA,
      to: T,
      cap: iA.substring(CA, T)
    });
    let yA = EA.length;
    for (let mA = 0; mA < yA; mA++)
      EA[mA].cap.replace(/\s/g, "").length === 0 && mA + 1 < yA && (EA[mA].to = EA[mA + 1].to, EA[mA].cap = EA[mA].cap + EA[mA + 1].cap, EA.splice(mA + 1, 1), yA = yA - 1);
    return EA;
  }
  function v(iA, IA, j) {
    for (let nA = 0; nA < iA.length; nA++)
      if (iA[nA][IA] === j)
        return nA;
    return -1;
  }
  function y() {
    if (o = "powershell.exe", Z) {
      const iA = `${N}\\system32\\WindowsPowerShell\\v1.0\\powershell.exe`;
      e.existsSync(iA) && (o = iA);
    }
  }
  function AA() {
    return Z ? `"${process.env.VBOX_INSTALL_PATH || process.env.VBOX_MSI_INSTALL_PATH}\\VBoxManage.exe"` : "vboxmanage";
  }
  function oA(iA) {
    let IA = "", j, nA = "";
    if (iA.indexOf(d) >= 0) {
      j = iA.split(d);
      const T = j[1].split(L);
      IA = T[0], T.length > 1 && (iA = T.slice(1).join(L));
    }
    iA.indexOf(n) >= 0 && (j = iA.split(n), nA = j[0]);
    let CA = -1;
    for (let T = 0; T < E.length; T++)
      E[T].id === IA && (CA = T, E[T].callback(nA));
    CA >= 0 && E.splice(CA, 1);
  }
  function rA() {
    p || (p = g(o, ["-NoProfile", "-NoLogo", "-InputFormat", "Text", "-NoExit", "-Command", "-"], {
      stdio: "pipe",
      windowsHide: !0,
      maxBuffer: 1024 * 102400,
      encoding: "UTF-8",
      env: Object.assign({}, process.env, { LANG: "en_US.UTF-8" })
    }), p && p.pid && (u = !0, p.stdout.on("data", (iA) => {
      h = h + iA.toString("utf8"), iA.indexOf(n) >= 0 && (oA(h), h = "");
    }), p.stderr.on("data", () => {
      oA(h + c);
    }), p.on("error", () => {
      oA(h + c);
    }), p.on("close", () => {
      p && p.kill();
    })));
  }
  function cA() {
    try {
      p && (p.stdin.write("exit" + s.EOL), p.stdin.end());
    } catch {
      p && p.kill();
    }
    u = !1, p = null;
  }
  function lA(iA) {
    if (u) {
      const IA = Math.random().toString(36).substring(2, 12);
      return new Promise((j) => {
        process.nextTick(() => {
          function nA(CA) {
            j(CA);
          }
          E.push({
            id: IA,
            cmd: iA,
            callback: nA,
            start: /* @__PURE__ */ new Date()
          });
          try {
            p && p.pid && p.stdin.write(Q + "echo " + d + IA + L + "; " + s.EOL + iA + s.EOL + "echo " + n + s.EOL);
          } catch {
            j("");
          }
        });
      });
    } else {
      let IA = "";
      return new Promise((j) => {
        process.nextTick(() => {
          try {
            const nA = s.release().split(".").map(Number), CA = nA[0] < 10 ? ["-NoProfile", "-NoLogo", "-InputFormat", "Text", "-NoExit", "-ExecutionPolicy", "Unrestricted", "-Command", "-"] : ["-NoProfile", "-NoLogo", "-InputFormat", "Text", "-ExecutionPolicy", "Unrestricted", "-Command", Q + iA], T = g(o, CA, {
              stdio: "pipe",
              windowsHide: !0,
              maxBuffer: 1024 * 102400,
              encoding: "UTF-8",
              env: Object.assign({}, process.env, { LANG: "en_US.UTF-8" })
            });
            if (T && !T.pid && T.on("error", () => {
              j(IA);
            }), T && T.pid) {
              if (T.stdout.on("data", (EA) => {
                IA = IA + EA.toString("utf8");
              }), T.stderr.on("data", () => {
                T.kill(), j(IA);
              }), T.on("close", () => {
                T.kill(), j(IA);
              }), T.on("error", () => {
                T.kill(), j(IA);
              }), nA[0] < 10)
                try {
                  T.stdin.write(Q + iA + s.EOL), T.stdin.write("exit" + s.EOL), T.stdin.end();
                } catch {
                  T.kill(), j(IA);
                }
            } else
              j(IA);
          } catch {
            j(IA);
          }
        });
      });
    }
  }
  function pA(iA, IA, j) {
    let nA = "";
    return j = j || {}, new Promise((CA) => {
      process.nextTick(() => {
        try {
          const T = g(iA, IA, j);
          T && !T.pid && T.on("error", () => {
            CA(nA);
          }), T && T.pid ? (T.stdout.on("data", (EA) => {
            nA += EA.toString();
          }), T.on("close", () => {
            T.kill(), CA(nA);
          }), T.on("error", () => {
            T.kill(), CA(nA);
          })) : CA(nA);
        } catch {
          CA(nA);
        }
      });
    });
  }
  function BA() {
    if (Z) {
      if (!J)
        try {
          const j = B("chcp", G).toString().split(`\r
`)[0].split(":");
          J = j.length > 1 ? j[1].replace(".", "").trim() : "";
        } catch {
          J = "437";
        }
      return J;
    }
    if (P || q || $ || sA || X) {
      if (!J)
        try {
          const j = B("echo $LANG", K).toString().split(`\r
`)[0].split(".");
          J = j.length > 1 ? j[1].trim() : "", J || (J = "UTF-8");
        } catch {
          J = "UTF-8";
        }
      return J;
    }
  }
  function uA() {
    if (eA !== null)
      return eA;
    if (eA = !1, Z)
      try {
        const iA = B("WHERE smartctl 2>nul", G).toString().split(`\r
`);
        iA && iA.length ? eA = iA[0].indexOf(":\\") >= 0 : eA = !1;
      } catch {
        eA = !1;
      }
    if (P || q || $ || sA || X)
      try {
        eA = B("which smartctl 2>/dev/null", K).toString().split(`\r
`).length > 0;
      } catch {
        F.noop();
      }
    return eA;
  }
  function hA(iA) {
    const IA = ["BCM2708", "BCM2709", "BCM2710", "BCM2711", "BCM2712", "BCM2835", "BCM2836", "BCM2837", "BCM2837B0"];
    if (b !== null)
      iA = b;
    else if (iA === void 0)
      try {
        iA = e.readFileSync("/proc/cpuinfo", { encoding: "utf8" }).toString().split(`
`), b = iA;
      } catch {
        return !1;
      }
    const j = W(iA, "hardware"), nA = W(iA, "model");
    return j && IA.indexOf(j) > -1 || nA && nA.indexOf("Raspberry Pi") > -1;
  }
  function fA() {
    let iA = [];
    try {
      iA = e.readFileSync("/etc/os-release", { encoding: "utf8" }).toString().split(`
`);
    } catch {
      return !1;
    }
    const IA = W(iA, "id", "=");
    return IA && IA.indexOf("raspbian") > -1;
  }
  function FA(iA, IA, j) {
    j || (j = IA, IA = G);
    let nA = "chcp 65001 > nul && cmd /C " + iA + " && chcp " + J + " > nul";
    r(nA, IA, (CA, T) => {
      j(CA, T);
    });
  }
  function dA() {
    const iA = e.existsSync("/Library/Developer/CommandLineTools/usr/bin/"), IA = e.existsSync("/Applications/Xcode.app/Contents/Developer/Tools"), j = e.existsSync("/Library/Developer/Xcode/");
    return iA || j || IA;
  }
  function NA() {
    const iA = process.hrtime();
    return !Array.isArray(iA) || iA.length !== 2 ? 0 : +iA[0] * 1e9 + +iA[1];
  }
  function RA(iA, IA) {
    IA = IA || "";
    const j = [];
    return iA.forEach((nA) => {
      nA.startsWith(IA) && j.indexOf(nA) === -1 && j.push(nA);
    }), j.length;
  }
  function DA(iA, IA) {
    IA = IA || "";
    const j = [];
    return iA.forEach((nA) => {
      nA.startsWith(IA) && j.push(nA);
    }), j.length;
  }
  function _A(iA, IA) {
    typeof IA > "u" && (IA = !1);
    const j = iA || "";
    let nA = "";
    const CA = f(j.length, 2e3);
    for (let T = 0; T <= CA; T++)
      j[T] === void 0 || j[T] === ">" || j[T] === "<" || j[T] === "*" || j[T] === "?" || j[T] === "[" || j[T] === "]" || j[T] === "|" || j[T] === "˚" || j[T] === "$" || j[T] === ";" || j[T] === "&" || j[T] === "]" || j[T] === "#" || j[T] === "\\" || j[T] === "	" || j[T] === `
` || j[T] === "\r" || j[T] === "'" || j[T] === "`" || j[T] === '"' || j[T].length > 1 || IA && j[T] === "(" || IA && j[T] === ")" || IA && j[T] === "@" || IA && j[T] === " " || IA && j[T] === "{" || IA && j[T] === ";" || IA && j[T] === "}" || (nA = nA + j[T]);
    return nA;
  }
  function SA() {
    const iA = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let IA = !0, j = "";
    try {
      j.__proto__.replace = V, j.__proto__.toLowerCase = m, j.__proto__.toString = a, j.__proto__.substr = I, j.__proto__.substring = t, j.__proto__.trim = l, j.__proto__.startsWith = D;
    } catch {
      Object.setPrototypeOf(j, U);
    }
    IA = IA || iA.length !== 62;
    const nA = Date.now();
    if (typeof nA == "number" && nA > 16e11) {
      const CA = nA % 100 + 15;
      for (let QA = 0; QA < CA; QA++) {
        const xA = Math.random() * 61.99999999 + 1, KA = parseInt(Math.floor(xA).toString(), 10), JA = parseInt(xA.toString().split(".")[0], 10), PA = Math.random() * 61.99999999 + 1, ie = parseInt(Math.floor(PA).toString(), 10), Ie = parseInt(PA.toString().split(".")[0], 10);
        IA = IA && xA !== PA, IA = IA && KA === JA && ie === Ie, j += iA[KA - 1];
      }
      IA = IA && j.length === CA;
      let T = Math.random() * CA * 0.9999999999, EA = j.substr(0, T) + " " + j.substr(T, 2e3);
      try {
        EA.__proto__.replace = V;
      } catch {
        Object.setPrototypeOf(EA, U);
      }
      let yA = EA.replace(/ /g, "");
      IA = IA && j === yA, T = Math.random() * CA * 0.9999999999, EA = j.substr(0, T) + "{" + j.substr(T, 2e3), yA = EA.replace(/{/g, ""), IA = IA && j === yA, T = Math.random() * CA * 0.9999999999, EA = j.substr(0, T) + "*" + j.substr(T, 2e3), yA = EA.replace(/\*/g, ""), IA = IA && j === yA, T = Math.random() * CA * 0.9999999999, EA = j.substr(0, T) + "$" + j.substr(T, 2e3), yA = EA.replace(/\$/g, ""), IA = IA && j === yA;
      const mA = j.toLowerCase();
      IA = IA && mA.length === CA && mA[CA - 1] && !mA[CA];
      for (let QA = 0; QA < CA; QA++) {
        const xA = j[QA];
        try {
          xA.__proto__.toLowerCase = m;
        } catch {
          Object.setPrototypeOf(j, U);
        }
        const KA = mA ? mA[QA] : "", JA = xA.toLowerCase();
        IA = IA && JA[0] === KA && JA[0] && !JA[1];
      }
    }
    return !IA;
  }
  function LA(iA) {
    return ("00000000" + parseInt(iA, 16).toString(2)).substr(-8);
  }
  function GA(iA) {
    const IA = e.lstatSync, j = e.readdirSync, nA = A.join;
    function CA(QA) {
      return IA(QA).isDirectory();
    }
    function T(QA) {
      return IA(QA).isFile();
    }
    function EA(QA) {
      return j(QA).map((xA) => nA(QA, xA)).filter(CA);
    }
    function yA(QA) {
      return j(QA).map((xA) => nA(QA, xA)).filter(T);
    }
    function mA(QA) {
      try {
        return EA(QA).map((JA) => mA(JA)).reduce((JA, PA) => JA.concat(PA), []).concat(yA(QA));
      } catch {
        return [];
      }
    }
    return e.existsSync(iA) ? mA(iA) : [];
  }
  function kA(iA) {
    b === null ? b = iA : iA === void 0 && (iA = b);
    const IA = {
      "0002": {
        type: "B",
        revision: "1.0",
        memory: 256,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "0003": {
        type: "B",
        revision: "1.0",
        memory: 256,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "0004": {
        type: "B",
        revision: "2.0",
        memory: 256,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "0005": {
        type: "B",
        revision: "2.0",
        memory: 256,
        manufacturer: "Qisda",
        processor: "BCM2835"
      },
      "0006": {
        type: "B",
        revision: "2.0",
        memory: 256,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "0007": {
        type: "A",
        revision: "2.0",
        memory: 256,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "0008": {
        type: "A",
        revision: "2.0",
        memory: 256,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "0009": {
        type: "A",
        revision: "2.0",
        memory: 256,
        manufacturer: "Qisda",
        processor: "BCM2835"
      },
      "000d": {
        type: "B",
        revision: "2.0",
        memory: 512,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "000e": {
        type: "B",
        revision: "2.0",
        memory: 512,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "000f": {
        type: "B",
        revision: "2.0",
        memory: 512,
        manufacturer: "Egoman",
        processor: "BCM2835"
      },
      "0010": {
        type: "B+",
        revision: "1.2",
        memory: 512,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "0011": {
        type: "CM1",
        revision: "1.0",
        memory: 512,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "0012": {
        type: "A+",
        revision: "1.1",
        memory: 256,
        manufacturer: "Sony UK",
        processor: "BCM2835"
      },
      "0013": {
        type: "B+",
        revision: "1.2",
        memory: 512,
        manufacturer: "Embest",
        processor: "BCM2835"
      },
      "0014": {
        type: "CM1",
        revision: "1.0",
        memory: 512,
        manufacturer: "Embest",
        processor: "BCM2835"
      },
      "0015": {
        type: "A+",
        revision: "1.1",
        memory: 256,
        manufacturer: "512MB	Embest",
        processor: "BCM2835"
      }
    }, j = ["BCM2835", "BCM2836", "BCM2837", "BCM2711", "BCM2712"], nA = ["Sony UK", "Egoman", "Embest", "Sony Japan", "Embest", "Stadium"], CA = {
      "00": "A",
      "01": "B",
      "02": "A+",
      "03": "B+",
      "04": "2B",
      "05": "Alpha (early prototype)",
      "06": "CM1",
      "08": "3B",
      "09": "Zero",
      "0a": "CM3",
      "0c": "Zero W",
      "0d": "3B+",
      "0e": "3A+",
      "0f": "Internal use only",
      10: "CM3+",
      11: "4B",
      12: "Zero 2 W",
      13: "400",
      14: "CM4",
      15: "CM4S",
      16: "Internal use only",
      17: "5",
      18: "CM5",
      19: "500/500+",
      "1a": "CM5 Lite"
    }, T = W(iA, "revision", ":", !0), EA = W(iA, "model:", ":", !0), yA = W(iA, "serial", ":", !0);
    let mA = {};
    if ({}.hasOwnProperty.call(IA, T))
      mA = {
        model: EA,
        serial: yA,
        revisionCode: T,
        memory: IA[T].memory,
        manufacturer: IA[T].manufacturer,
        processor: IA[T].processor,
        type: IA[T].type,
        revision: IA[T].revision
      };
    else {
      const QA = ("00000000" + W(iA, "revision", ":", !0).toLowerCase()).substr(-8), xA = parseInt(LA(QA.substr(2, 1)).substr(5, 3), 2) || 0, KA = nA[parseInt(QA.substr(3, 1), 10)], JA = j[parseInt(QA.substr(4, 1), 10)], PA = QA.substr(5, 2);
      mA = {
        model: EA,
        serial: yA,
        revisionCode: T,
        memory: 256 * Math.pow(2, xA),
        manufacturer: KA,
        processor: JA,
        type: {}.hasOwnProperty.call(CA, PA) ? CA[PA] : "",
        revision: "1." + QA.substr(7, 1)
      };
    }
    return mA;
  }
  function VA(iA) {
    if (b === null && iA !== void 0)
      b = iA;
    else if (iA === void 0 && b !== null)
      iA = b;
    else
      try {
        iA = e.readFileSync("/proc/cpuinfo", { encoding: "utf8" }).toString().split(`
`), b = iA;
      } catch {
        return !1;
      }
    const IA = kA(iA);
    return IA.type === "4B" || IA.type === "CM4" || IA.type === "CM4S" || IA.type === "400" ? "VideoCore VI" : IA.type === "5" || IA.type === "500" ? "VideoCore VII" : "VideoCore IV";
  }
  function bA(iA) {
    const IA = iA.map(
      (CA) => new Promise((T) => {
        const EA = new Array(2);
        CA.then((yA) => {
          EA[0] = yA;
        }).catch((yA) => {
          EA[1] = yA;
        }).then(() => {
          T(EA);
        });
      })
    ), j = [], nA = [];
    return Promise.all(IA).then((CA) => (CA.forEach((T) => {
      T[1] ? (j.push(T[1]), nA.push(null)) : (j.push(null), nA.push(T[0]));
    }), {
      errors: j,
      results: nA
    }));
  }
  function XA(iA) {
    return () => {
      const IA = Array.prototype.slice.call(arguments);
      return new Promise((j, nA) => {
        IA.push((CA, T) => {
          CA ? nA(CA) : j(T);
        }), iA.apply(null, IA);
      });
    };
  }
  function HA(iA) {
    return () => {
      const IA = Array.prototype.slice.call(arguments);
      return new Promise((j) => {
        IA.push((nA, CA) => {
          j(CA);
        }), iA.apply(null, IA);
      });
    };
  }
  function qA() {
    let iA = "";
    if (P)
      try {
        iA = B("uname -v", K).toString();
      } catch {
        iA = "";
      }
    return iA;
  }
  function vA(iA) {
    const IA = ["array", "dict", "key", "string", "integer", "date", "real", "data", "boolean", "arrayEmpty"];
    let nA = iA.indexOf("<plist version"), CA = iA.length;
    for (; iA[nA] !== ">" && nA < CA; )
      nA++;
    let T = 0, EA = !1, yA = !1, mA = !1, QA = [{ tagStart: "", tagEnd: "", tagContent: "", key: "", data: null }], xA = "", KA = iA[nA];
    for (; nA < CA; )
      xA = KA, nA + 1 < CA && (KA = iA[nA + 1]), xA === "<" ? (yA = !1, KA === "/" ? mA = !0 : QA[T].tagStart ? (QA[T].tagContent = "", QA[T].data || (QA[T].data = QA[T].tagStart === "array" ? [] : {}), T++, QA.push({ tagStart: "", tagEnd: "", tagContent: "", key: null, data: null }), EA = !0, yA = !1) : EA || (EA = !0)) : xA === ">" ? (QA[T].tagStart === "true/" && (EA = !1, mA = !0, QA[T].tagStart = "", QA[T].tagEnd = "/boolean", QA[T].data = !0), QA[T].tagStart === "false/" && (EA = !1, mA = !0, QA[T].tagStart = "", QA[T].tagEnd = "/boolean", QA[T].data = !1), QA[T].tagStart === "array/" && (EA = !1, mA = !0, QA[T].tagStart = "", QA[T].tagEnd = "/arrayEmpty", QA[T].data = []), yA && (yA = !1), EA && (EA = !1, yA = !0, QA[T].tagStart === "array" && (QA[T].data = []), QA[T].tagStart === "dict" && (QA[T].data = {})), mA && (mA = !1, QA[T].tagEnd && IA.indexOf(QA[T].tagEnd.substr(1)) >= 0 && (QA[T].tagEnd === "/dict" || QA[T].tagEnd === "/array" ? (T > 1 && QA[T - 2].tagStart === "array" && QA[T - 2].data.push(QA[T - 1].data), T > 1 && QA[T - 2].tagStart === "dict" && (QA[T - 2].data[QA[T - 1].key] = QA[T - 1].data), T--, QA.pop(), QA[T].tagContent = "", QA[T].tagStart = "", QA[T].tagEnd = "") : (QA[T].tagEnd === "/key" && QA[T].tagContent ? QA[T].key = QA[T].tagContent : (QA[T].tagEnd === "/real" && QA[T].tagContent && (QA[T].data = parseFloat(QA[T].tagContent) || 0), QA[T].tagEnd === "/integer" && QA[T].tagContent && (QA[T].data = parseInt(QA[T].tagContent) || 0), QA[T].tagEnd === "/string" && QA[T].tagContent && (QA[T].data = QA[T].tagContent || ""), QA[T].tagEnd === "/boolean" && (QA[T].data = QA[T].tagContent || !1), QA[T].tagEnd === "/arrayEmpty" && (QA[T].data = QA[T].tagContent || []), T > 0 && QA[T - 1].tagStart === "array" && QA[T - 1].data.push(QA[T].data), T > 0 && QA[T - 1].tagStart === "dict" && (QA[T - 1].data[QA[T].key] = QA[T].data)), QA[T].tagContent = "", QA[T].tagStart = "", QA[T].tagEnd = "")), QA[T].tagEnd = "", EA = !1, yA = !1)) : (EA && (QA[T].tagStart += xA), mA && (QA[T].tagEnd += xA), yA && (QA[T].tagContent += xA)), nA++;
    return QA[0].data;
  }
  function YA(iA) {
    return typeof iA == "string" && !isNaN(iA) && !isNaN(parseFloat(iA));
  }
  function wA(iA) {
    const IA = iA.split(`
`);
    for (let nA = 0; nA < IA.length; nA++) {
      if (IA[nA].indexOf(" = ") >= 0) {
        const CA = IA[nA].split(" = ");
        if (CA[0] = CA[0].trim(), CA[0].startsWith('"') || (CA[0] = '"' + CA[0] + '"'), CA[1] = CA[1].trim(), CA[1].indexOf('"') === -1 && CA[1].endsWith(";")) {
          const T = CA[1].substring(0, CA[1].length - 1);
          YA(T) || (CA[1] = `"${T}";`);
        }
        if (CA[1].indexOf('"') >= 0 && CA[1].endsWith(";")) {
          const T = CA[1].substring(0, CA[1].length - 1).replace(/"/g, "");
          YA(T) && (CA[1] = `${T};`);
        }
        IA[nA] = CA.join(" : ");
      }
      IA[nA] = IA[nA].replace(/\(/g, "[").replace(/\)/g, "]").replace(/;/g, ",").trim(), IA[nA].startsWith("}") && IA[nA - 1] && IA[nA - 1].endsWith(",") && (IA[nA - 1] = IA[nA - 1].substring(0, IA[nA - 1].length - 1));
    }
    iA = IA.join("");
    let j = {};
    try {
      j = JSON.parse(iA);
    } catch {
    }
    return j;
  }
  function TA(iA, IA) {
    let j = 0;
    const nA = iA.split("."), CA = IA.split(".");
    return nA[0] < CA[0] ? j = 1 : nA[0] > CA[0] ? j = -1 : nA[0] === CA[0] && nA.length >= 2 && CA.length >= 2 && (nA[1] < CA[1] ? j = 1 : nA[1] > CA[1] ? j = -1 : nA[1] === CA[1] && (nA.length >= 3 && CA.length >= 3 ? nA[2] < CA[2] ? j = 1 : nA[2] > CA[2] && (j = -1) : CA.length >= 3 && (j = 1))), j;
  }
  function $A(iA) {
    const j = [
      {
        key: "Mac15,12",
        name: "MacBook Air",
        size: "13-inch",
        processor: "M3",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac14,15",
        name: "MacBook Air",
        size: "15-inch",
        processor: "M2",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac14,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "M2",
        year: "2022",
        additional: ""
      },
      {
        key: "MacBookAir10,1",
        name: "MacBook Air",
        size: "13-inch",
        processor: "M1",
        year: "2020",
        additional: ""
      },
      {
        key: "MacBookAir9,1",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "2020",
        additional: ""
      },
      {
        key: "MacBookAir8,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookAir8,1",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "2018",
        additional: ""
      },
      {
        key: "MacBookAir7,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "2017",
        additional: ""
      },
      {
        key: "MacBookAir7,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Early 2015",
        additional: ""
      },
      {
        key: "MacBookAir7,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Early 2015",
        additional: ""
      },
      {
        key: "MacBookAir6,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Early 2014",
        additional: ""
      },
      {
        key: "MacBookAir6,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Early 2014",
        additional: ""
      },
      {
        key: "MacBookAir6,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Mid 2013",
        additional: ""
      },
      {
        key: "MacBookAir6,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Mid 2013",
        additional: ""
      },
      {
        key: "MacBookAir5,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacBookAir5,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacBookAir4,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "MacBookAir4,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "MacBookAir3,2",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Late 2010",
        additional: ""
      },
      {
        key: "MacBookAir3,1",
        name: "MacBook Air",
        size: "11-inch",
        processor: "",
        year: "Late 2010",
        additional: ""
      },
      {
        key: "MacBookAir2,1",
        name: "MacBook Air",
        size: "13-inch",
        processor: "",
        year: "Mid 2009",
        additional: ""
      },
      {
        key: "Mac16,1",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M4",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac16,6",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M4 Pro",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac16,8",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M4 Max",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac16,5",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M4 Pro",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac16,6",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M4 Max",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac15,3",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M3",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,6",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M3 Pro",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,8",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M3 Pro",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,10",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M3 Max",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,7",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M3 Pro",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,9",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M3 Pro",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac15,11",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M3 Max",
        year: "Nov 2023",
        additional: ""
      },
      {
        key: "Mac14,5",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M2 Max",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,9",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M2 Max",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,6",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M2 Max",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,10",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M2 Max",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,7",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "M2",
        year: "2022",
        additional: ""
      },
      {
        key: "MacBookPro18,3",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M1 Pro",
        year: "2021",
        additional: ""
      },
      {
        key: "MacBookPro18,4",
        name: "MacBook Pro",
        size: "14-inch",
        processor: "M1 Max",
        year: "2021",
        additional: ""
      },
      {
        key: "MacBookPro18,1",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M1 Pro",
        year: "2021",
        additional: ""
      },
      {
        key: "MacBookPro18,2",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "M1 Max",
        year: "2021",
        additional: ""
      },
      {
        key: "MacBookPro17,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "M1",
        year: "2020",
        additional: ""
      },
      {
        key: "MacBookPro16,3",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2020",
        additional: "Two Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro16,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2020",
        additional: "Four Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro16,1",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookPro16,4",
        name: "MacBook Pro",
        size: "16-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookPro15,3",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookPro15,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookPro15,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacBookPro15,4",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2019",
        additional: "Two Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro15,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "2018",
        additional: ""
      },
      {
        key: "MacBookPro15,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2018",
        additional: "Four Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro14,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2017",
        additional: "Two Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro14,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2017",
        additional: "Four Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro14,3",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "2017",
        additional: ""
      },
      {
        key: "MacBookPro13,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2016",
        additional: "Two Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro13,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "2016",
        additional: "Four Thunderbolt 3 ports"
      },
      {
        key: "MacBookPro13,3",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "2016",
        additional: ""
      },
      {
        key: "MacBookPro11,4",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2015",
        additional: ""
      },
      {
        key: "MacBookPro11,5",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2015",
        additional: ""
      },
      {
        key: "MacBookPro12,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Early 2015",
        additional: ""
      },
      {
        key: "MacBookPro11,2",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "MacBookPro11,3",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "MacBookPro11,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "MacBookPro10,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacBookPro10,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Late 2012",
        additional: ""
      },
      {
        key: "MacBookPro9,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacBookPro9,2",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacBookPro8,3",
        name: "MacBook Pro",
        size: "17-inch",
        processor: "",
        year: "Early 2011",
        additional: ""
      },
      {
        key: "MacBookPro8,2",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Early 2011",
        additional: ""
      },
      {
        key: "MacBookPro8,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Early 2011",
        additional: ""
      },
      {
        key: "MacBookPro6,1",
        name: "MacBook Pro",
        size: "17-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "MacBookPro6,2",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "MacBookPro7,1",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "MacBookPro5,2",
        name: "MacBook Pro",
        size: "17-inch",
        processor: "",
        year: "Early 2009",
        additional: ""
      },
      {
        key: "MacBookPro5,3",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Mid 2009",
        additional: ""
      },
      {
        key: "MacBookPro5,5",
        name: "MacBook Pro",
        size: "13-inch",
        processor: "",
        year: "Mid 2009",
        additional: ""
      },
      {
        key: "MacBookPro5,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Late 2008",
        additional: ""
      },
      {
        key: "MacBookPro4,1",
        name: "MacBook Pro",
        size: "15-inch",
        processor: "",
        year: "Early 2008",
        additional: ""
      },
      {
        key: "MacBook10,1",
        name: "MacBook",
        size: "12-inch",
        processor: "",
        year: "2017",
        additional: ""
      },
      {
        key: "MacBook9,1",
        name: "MacBook",
        size: "12-inch",
        processor: "",
        year: "Early 2016",
        additional: ""
      },
      {
        key: "MacBook8,1",
        name: "MacBook",
        size: "12-inch",
        processor: "",
        year: "Early 2015",
        additional: ""
      },
      {
        key: "MacBook7,1",
        name: "MacBook",
        size: "13-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "MacBook6,1",
        name: "MacBook",
        size: "13-inch",
        processor: "",
        year: "Late 2009",
        additional: ""
      },
      {
        key: "MacBook5,2",
        name: "MacBook",
        size: "13-inch",
        processor: "",
        year: "Early 2009",
        additional: ""
      },
      {
        key: "Mac14,13",
        name: "Mac Studio",
        size: "",
        processor: "M2 Max",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,14",
        name: "Mac Studio",
        size: "",
        processor: "M2 Ultra",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac15,14",
        name: "Mac Studio",
        size: "",
        processor: "M3 Ultra",
        year: "2025",
        additional: ""
      },
      {
        key: "Mac16,9",
        name: "Mac Studio",
        size: "",
        processor: "M4 Max",
        year: "2025",
        additional: ""
      },
      {
        key: "Mac13,1",
        name: "Mac Studio",
        size: "",
        processor: "M1 Max",
        year: "2022",
        additional: ""
      },
      {
        key: "Mac13,2",
        name: "Mac Studio",
        size: "",
        processor: "M1 Ultra",
        year: "2022",
        additional: ""
      },
      {
        key: "Mac16,11",
        name: "Mac mini",
        size: "",
        processor: "M4 Pro",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac16,10",
        name: "Mac mini",
        size: "",
        processor: "M4",
        year: "2024",
        additional: ""
      },
      {
        key: "Mac14,3",
        name: "Mac mini",
        size: "",
        processor: "M2",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,12",
        name: "Mac mini",
        size: "",
        processor: "M2 Pro",
        year: "2023",
        additional: ""
      },
      {
        key: "Macmini9,1",
        name: "Mac mini",
        size: "",
        processor: "M1",
        year: "2020",
        additional: ""
      },
      {
        key: "Macmini8,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Late 2018",
        additional: ""
      },
      {
        key: "Macmini7,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Late 2014",
        additional: ""
      },
      {
        key: "Macmini6,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Late 2012",
        additional: ""
      },
      {
        key: "Macmini6,2",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Late 2012",
        additional: ""
      },
      {
        key: "Macmini5,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "Macmini5,2",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "Macmini4,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "Macmini3,1",
        name: "Mac mini",
        size: "",
        processor: "",
        year: "Early 2009",
        additional: ""
      },
      {
        key: "Mac16,3",
        name: "iMac",
        size: "24-inch",
        processor: "M4",
        year: "2024",
        additional: "Four ports"
      },
      {
        key: "Mac16,2",
        name: "iMac",
        size: "24-inch",
        processor: "M4",
        year: "2024",
        additional: "Two ports"
      },
      {
        key: "Mac15,5",
        name: "iMac",
        size: "24-inch",
        processor: "M3",
        year: "2023",
        additional: "Four ports"
      },
      {
        key: "Mac15,4",
        name: "iMac",
        size: "24-inch",
        processor: "M3",
        year: "2023",
        additional: "Two ports"
      },
      {
        key: "iMac21,1",
        name: "iMac",
        size: "24-inch",
        processor: "M1",
        year: "2021",
        additional: ""
      },
      {
        key: "iMac21,2",
        name: "iMac",
        size: "24-inch",
        processor: "M1",
        year: "2021",
        additional: ""
      },
      {
        key: "iMac20,1",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "2020",
        additional: "Retina 5K"
      },
      {
        key: "iMac20,2",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "2020",
        additional: "Retina 5K"
      },
      {
        key: "iMac19,1",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "2019",
        additional: "Retina 5K"
      },
      {
        key: "iMac19,2",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "2019",
        additional: "Retina 4K"
      },
      {
        key: "iMacPro1,1",
        name: "iMac Pro",
        size: "",
        processor: "",
        year: "2017",
        additional: ""
      },
      {
        key: "iMac18,3",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "2017",
        additional: "Retina 5K"
      },
      {
        key: "iMac18,2",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "2017",
        additional: "Retina 4K"
      },
      {
        key: "iMac18,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "2017",
        additional: ""
      },
      {
        key: "iMac17,1",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Late 2015",
        additional: "Retina 5K"
      },
      {
        key: "iMac16,2",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Late 2015",
        additional: "Retina 4K"
      },
      {
        key: "iMac16,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Late 2015",
        additional: ""
      },
      {
        key: "iMac15,1",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Late 2014",
        additional: "Retina 5K"
      },
      {
        key: "iMac14,4",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Mid 2014",
        additional: ""
      },
      {
        key: "iMac14,2",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "iMac14,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "iMac13,2",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Late 2012",
        additional: ""
      },
      {
        key: "iMac13,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Late 2012",
        additional: ""
      },
      {
        key: "iMac12,2",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "iMac12,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Mid 2011",
        additional: ""
      },
      {
        key: "iMac11,3",
        name: "iMac",
        size: "27-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "iMac11,2",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "iMac10,1",
        name: "iMac",
        size: "21.5-inch",
        processor: "",
        year: "Late 2009",
        additional: ""
      },
      {
        key: "iMac9,1",
        name: "iMac",
        size: "20-inch",
        processor: "",
        year: "Early 2009",
        additional: ""
      },
      {
        key: "Mac14,8",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "2023",
        additional: ""
      },
      {
        key: "Mac14,8",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "2023",
        additional: "Rack"
      },
      {
        key: "MacPro7,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "2019",
        additional: ""
      },
      {
        key: "MacPro7,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "2019",
        additional: "Rack"
      },
      {
        key: "MacPro6,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "Late 2013",
        additional: ""
      },
      {
        key: "MacPro5,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "Mid 2012",
        additional: ""
      },
      {
        key: "MacPro5,1",
        name: "Mac Pro Server",
        size: "",
        processor: "",
        year: "Mid 2012",
        additional: "Server"
      },
      {
        key: "MacPro5,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "Mid 2010",
        additional: ""
      },
      {
        key: "MacPro5,1",
        name: "Mac Pro Server",
        size: "",
        processor: "",
        year: "Mid 2010",
        additional: "Server"
      },
      {
        key: "MacPro4,1",
        name: "Mac Pro",
        size: "",
        processor: "",
        year: "Early 2009",
        additional: ""
      }
    ].filter((CA) => CA.key === iA);
    if (j.length === 0)
      return {
        key: iA,
        model: "Apple",
        version: "Unknown"
      };
    const nA = [];
    return j[0].size && nA.push(j[0].size), j[0].processor && nA.push(j[0].processor), j[0].year && nA.push(j[0].year), j[0].additional && nA.push(j[0].additional), {
      key: iA,
      model: j[0].name,
      version: j[0].name + " (" + nA.join(", ") + ")"
    };
  }
  function WA(iA, IA = 5e3) {
    const j = iA.startsWith("https:") || iA.indexOf(":443/") > 0 || iA.indexOf(":8443/") > 0 ? https__default : require$$6, nA = Date.now();
    return new Promise((CA) => {
      const T = j.get(iA, (EA) => {
        EA.on("data", () => {
        }), EA.on("end", () => {
          CA({
            url: iA,
            statusCode: EA.statusCode,
            message: EA.statusMessage,
            time: Date.now() - nA
          });
        });
      }).on("error", (EA) => {
        CA({
          url: iA,
          statusCode: 404,
          message: EA.message,
          time: Date.now() - nA
        });
      }).setTimeout(IA, () => {
        T.destroy(), CA({
          url: iA,
          statusCode: 408,
          message: "Request Timeout",
          time: Date.now() - nA
        });
      });
    });
  }
  function UA(iA) {
    return iA.replace(/To Be Filled By O.E.M./g, "");
  }
  function MA() {
  }
  return util.toInt = gA, util.splitByNumber = H, util.execOptsWin = G, util.execOptsLinux = K, util.getCodepage = BA, util.execWin = FA, util.isFunction = w, util.unique = Y, util.sortByKey = _, util.cores = x, util.getValue = W, util.decodeEscapeSequence = z, util.parseDateTime = M, util.parseHead = O, util.findObjectByKey = v, util.darwinXcodeExists = dA, util.getVboxmanage = AA, util.powerShell = lA, util.powerShellStart = rA, util.powerShellRelease = cA, util.execSafe = pA, util.nanoSeconds = NA, util.countUniqueLines = RA, util.countLines = DA, util.noop = MA, util.isRaspberry = hA, util.isRaspbian = fA, util.sanitizeShellString = _A, util.isPrototypePolluted = SA, util.decodePiCpuinfo = kA, util.getRpiGpu = VA, util.promiseAll = bA, util.promisify = XA, util.promisifySave = HA, util.smartMonToolsInstalled = uA, util.linuxVersion = qA, util.plistParser = vA, util.plistReader = wA, util.stringObj = U, util.stringReplace = V, util.stringToLower = m, util.stringToString = a, util.stringSubstr = I, util.stringSubstring = t, util.stringTrim = l, util.stringStartWith = D, util.mathMin = f, util.WINDIR = N, util.getFilesInPath = GA, util.semverCompare = TA, util.getAppleModel = $A, util.checkWebsite = WA, util.cleanString = UA, util.getPowershell = y, util;
}
var system = {}, osinfo = {}, hasRequiredOsinfo;
function requireOsinfo() {
  if (hasRequiredOsinfo) return osinfo;
  hasRequiredOsinfo = 1;
  const s = require$$0$1, e = require$$1$1, A = requireUtil(), g = require$$1.exec, r = require$$1.execSync, B = process.platform, F = B === "linux" || B === "android", k = B === "darwin", P = B === "win32", q = B === "freebsd", Z = B === "openbsd", $ = B === "netbsd", sA = B === "sunos";
  function X() {
    const d = (/* @__PURE__ */ new Date()).toString().split(" ");
    let c = "";
    try {
      c = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      c = d.length >= 7 ? d.slice(6).join(" ").replace(/\(/g, "").replace(/\)/g, "") : "";
    }
    const n = {
      current: Date.now(),
      uptime: s.uptime(),
      timezone: d.length >= 7 ? d[5] : "",
      timezoneName: c
    };
    if (k || F)
      try {
        const G = r("date +%Z && date +%z && ls -l /etc/localtime 2>/dev/null", A.execOptsLinux).toString().split(s.EOL);
        G.length > 3 && !G[0] && G.shift();
        let K = G[0] || "";
        return (K.startsWith("+") || K.startsWith("-")) && (K = "GMT"), {
          current: Date.now(),
          uptime: s.uptime(),
          timezone: G[1] ? K + G[1] : K,
          timezoneName: G[2] && G[2].indexOf("/zoneinfo/") > 0 && G[2].split("/zoneinfo/")[1] || ""
        };
      } catch {
        A.noop();
      }
    return n;
  }
  osinfo.time = X;
  function S(d) {
    d = d || "", d = d.toLowerCase();
    let c = B;
    return P ? c = "windows" : d.indexOf("mac os") !== -1 || d.indexOf("macos") !== -1 ? c = "apple" : d.indexOf("arch") !== -1 ? c = "arch" : d.indexOf("cachy") !== -1 ? c = "cachy" : d.indexOf("centos") !== -1 ? c = "centos" : d.indexOf("coreos") !== -1 ? c = "coreos" : d.indexOf("debian") !== -1 ? c = "debian" : d.indexOf("deepin") !== -1 ? c = "deepin" : d.indexOf("elementary") !== -1 ? c = "elementary" : d.indexOf("endeavour") !== -1 ? c = "endeavour" : d.indexOf("fedora") !== -1 ? c = "fedora" : d.indexOf("gentoo") !== -1 ? c = "gentoo" : d.indexOf("mageia") !== -1 ? c = "mageia" : d.indexOf("mandriva") !== -1 ? c = "mandriva" : d.indexOf("manjaro") !== -1 ? c = "manjaro" : d.indexOf("mint") !== -1 ? c = "mint" : d.indexOf("mx") !== -1 ? c = "mx" : d.indexOf("openbsd") !== -1 ? c = "openbsd" : d.indexOf("freebsd") !== -1 ? c = "freebsd" : d.indexOf("opensuse") !== -1 ? c = "opensuse" : d.indexOf("pclinuxos") !== -1 ? c = "pclinuxos" : d.indexOf("puppy") !== -1 ? c = "puppy" : d.indexOf("popos") !== -1 ? c = "popos" : d.indexOf("raspbian") !== -1 ? c = "raspbian" : d.indexOf("reactos") !== -1 ? c = "reactos" : d.indexOf("redhat") !== -1 ? c = "redhat" : d.indexOf("slackware") !== -1 ? c = "slackware" : d.indexOf("sugar") !== -1 ? c = "sugar" : d.indexOf("steam") !== -1 ? c = "steam" : d.indexOf("suse") !== -1 ? c = "suse" : d.indexOf("mate") !== -1 ? c = "ubuntu-mate" : d.indexOf("lubuntu") !== -1 ? c = "lubuntu" : d.indexOf("xubuntu") !== -1 ? c = "xubuntu" : d.indexOf("ubuntu") !== -1 ? c = "ubuntu" : d.indexOf("solaris") !== -1 ? c = "solaris" : d.indexOf("tails") !== -1 ? c = "tails" : d.indexOf("feren") !== -1 ? c = "ferenos" : d.indexOf("robolinux") !== -1 ? c = "robolinux" : F && d && (c = d.toLowerCase().trim().replace(/\s+/g, "-")), c;
  }
  const J = [
    [26200, "25H2"],
    [26100, "24H2"],
    [22631, "23H2"],
    [22621, "22H2"],
    [19045, "22H2"],
    [22e3, "21H2"],
    [19044, "21H2"],
    [19043, "21H1"],
    [19042, "20H2"],
    [19041, "2004"],
    [18363, "1909"],
    [18362, "1903"],
    [17763, "1809"],
    [17134, "1803"]
  ];
  function eA(d) {
    for (const [c, n] of J)
      if (d >= c) return n;
    return "";
  }
  function b() {
    let d = s.hostname;
    if (F || k)
      try {
        d = r("hostname -f 2>/dev/null", A.execOptsLinux).toString().split(s.EOL)[0];
      } catch {
        A.noop();
      }
    if (q || Z || $)
      try {
        d = r("hostname 2>/dev/null").toString().split(s.EOL)[0];
      } catch {
        A.noop();
      }
    if (P)
      try {
        d = r("echo %COMPUTERNAME%.%USERDNSDOMAIN%", A.execOptsWin).toString().replace(".%USERDNSDOMAIN%", "").split(s.EOL)[0];
      } catch {
        A.noop();
      }
    return d;
  }
  function N(d) {
    return new Promise((c) => {
      process.nextTick(() => {
        let n = {
          platform: B === "win32" ? "Windows" : B,
          distro: "unknown",
          release: "unknown",
          codename: "",
          kernel: s.release(),
          arch: s.arch(),
          hostname: s.hostname(),
          fqdn: b(),
          codepage: "",
          logofile: "",
          serial: "",
          build: "",
          servicepack: "",
          uefi: !1
        };
        if (F && g("cat /etc/*-release; cat /usr/lib/os-release; cat /etc/openwrt_release", (L, G) => {
          let K = {};
          G.toString().split(`
`).forEach((m) => {
            m.indexOf("=") !== -1 && (K[m.split("=")[0].trim().toUpperCase()] = m.split("=")[1].trim());
          }), n.distro = (K.DISTRIB_ID || K.NAME || "unknown").replace(/"/g, ""), n.logofile = S(n.distro);
          let H = (K.VERSION || "").replace(/"/g, ""), U = (K.DISTRIB_CODENAME || K.VERSION_CODENAME || "").replace(/"/g, "");
          const V = (K.PRETTY_NAME || "").replace(/"/g, "");
          V.indexOf(n.distro + " ") === 0 && (H = V.replace(n.distro + " ", "").trim()), H.indexOf("(") >= 0 && (U = H.split("(")[1].replace(/[()]/g, "").trim(), H = H.split("(")[0].trim()), n.release = (H || K.DISTRIB_RELEASE || K.VERSION_ID || "unknown").replace(/"/g, ""), n.codename = U, n.codepage = A.getCodepage(), n.build = (K.BUILD_ID || "").replace(/"/g, "").trim(), p().then((m) => {
            n.uefi = m, Q().then((a) => {
              n.serial = a.os, d && d(n), c(n);
            });
          });
        }), (q || Z || $) && g("sysctl kern.ostype kern.osrelease kern.osrevision kern.hostuuid machdep.bootmethod kern.geom.confxml", (L, G) => {
          let K = G.toString().split(`
`);
          const gA = A.getValue(K, "kern.ostype"), H = S(gA), U = A.getValue(K, "kern.osrelease").split("-")[0], V = A.getValue(K, "kern.uuid"), m = A.getValue(K, "machdep.bootmethod"), a = G.toString().indexOf("<type>efi</type>") >= 0, I = m ? m.toLowerCase().indexOf("uefi") >= 0 : a || null;
          n.distro = gA || n.distro, n.logofile = H || n.logofile, n.release = U || n.release, n.serial = V || n.serial, n.codename = "", n.codepage = A.getCodepage(), n.uefi = I || null, d && d(n), c(n);
        }), k && g("sw_vers; sysctl kern.ostype kern.osrelease kern.osrevision kern.uuid", (L, G) => {
          let K = G.toString().split(`
`);
          n.serial = A.getValue(K, "kern.uuid"), n.distro = A.getValue(K, "ProductName"), n.release = (A.getValue(K, "ProductVersion", ":", !0, !0) + " " + A.getValue(K, "ProductVersionExtra", ":", !0, !0)).trim(), n.build = A.getValue(K, "BuildVersion"), n.logofile = S(n.distro), n.codename = "macOS", n.codename = n.release.indexOf("10.4") > -1 ? "OS X Tiger" : n.codename, n.codename = n.release.indexOf("10.5") > -1 ? "OS X Leopard" : n.codename, n.codename = n.release.indexOf("10.6") > -1 ? "OS X Snow Leopard" : n.codename, n.codename = n.release.indexOf("10.7") > -1 ? "OS X Lion" : n.codename, n.codename = n.release.indexOf("10.8") > -1 ? "OS X Mountain Lion" : n.codename, n.codename = n.release.indexOf("10.9") > -1 ? "OS X Mavericks" : n.codename, n.codename = n.release.indexOf("10.10") > -1 ? "OS X Yosemite" : n.codename, n.codename = n.release.indexOf("10.11") > -1 ? "OS X El Capitan" : n.codename, n.codename = n.release.indexOf("10.12") > -1 ? "Sierra" : n.codename, n.codename = n.release.indexOf("10.13") > -1 ? "High Sierra" : n.codename, n.codename = n.release.indexOf("10.14") > -1 ? "Mojave" : n.codename, n.codename = n.release.indexOf("10.15") > -1 ? "Catalina" : n.codename, n.codename = n.release.startsWith("11.") ? "Big Sur" : n.codename, n.codename = n.release.startsWith("12.") ? "Monterey" : n.codename, n.codename = n.release.startsWith("13.") ? "Ventura" : n.codename, n.codename = n.release.startsWith("14.") ? "Sonoma" : n.codename, n.codename = n.release.startsWith("15.") ? "Sequoia" : n.codename, n.codename = n.release.startsWith("26.") ? "Tahoe" : n.codename, n.uefi = !0, n.codepage = A.getCodepage(), d && d(n), c(n);
        }), sA && (n.release = n.kernel, g("uname -o", (L, G) => {
          const K = G.toString().split(`
`);
          n.distro = K[0], n.logofile = S(n.distro), d && d(n), c(n);
        })), P) {
          n.logofile = S(), n.release = n.kernel;
          try {
            const L = [];
            L.push(A.powerShell("Get-CimInstance Win32_OperatingSystem | select Caption,SerialNumber,BuildNumber,ServicePackMajorVersion,ServicePackMinorVersion | fl")), L.push(A.powerShell("(Get-CimInstance Win32_ComputerSystem).HypervisorPresent")), L.push(A.powerShell("Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SystemInformation]::TerminalServerSession")), L.push(A.powerShell('reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v DisplayVersion')), A.promiseAll(L).then((G) => {
              const K = G.results[0] ? G.results[0].toString().split(`\r
`) : [""];
              n.distro = A.getValue(K, "Caption", ":").trim(), n.serial = A.getValue(K, "SerialNumber", ":").trim(), n.build = A.getValue(K, "BuildNumber", ":").trim(), n.servicepack = A.getValue(K, "ServicePackMajorVersion", ":").trim() + "." + A.getValue(K, "ServicePackMinorVersion", ":").trim(), n.codepage = A.getCodepage();
              const gA = G.results[1] ? G.results[1].toString().toLowerCase() : "";
              n.hypervisor = gA.indexOf("true") !== -1;
              const H = G.results[2] ? G.results[2].toString() : "";
              if (G.results[3]) {
                const U = G.results[3].split("REG_SZ");
                n.codename = U.length > 1 ? U[1].trim() : "";
              }
              if (!n.codename) {
                const U = parseInt(n.build, 10);
                n.codename = eA(U);
              }
              n.remoteSession = H.toString().toLowerCase().indexOf("true") >= 0, h().then((U) => {
                n.uefi = U, d && d(n), c(n);
              });
            });
          } catch {
            d && d(n), c(n);
          }
        }
      });
    });
  }
  osinfo.osInfo = N;
  function p() {
    return new Promise((d) => {
      process.nextTick(() => {
        e.stat("/sys/firmware/efi", (c) => {
          if (c)
            g('dmesg | grep -E "EFI v"', (n, L) => {
              if (!n) {
                const G = L.toString().split(`
`);
                return d(G.length > 0);
              }
              return d(!1);
            });
          else
            return d(!0);
        });
      });
    });
  }
  function h() {
    return new Promise((d) => {
      process.nextTick(() => {
        try {
          g('findstr /C:"Detected boot environment" "%windir%\\Panther\\setupact.log"', A.execOptsWin, (c, n) => {
            if (c)
              g("echo %firmware_type%", A.execOptsWin, (L, G) => {
                if (L)
                  return d(!1);
                {
                  const K = G.toString() || "";
                  return d(K.toLowerCase().indexOf("efi") >= 0);
                }
              });
            else {
              const L = n.toString().split(`
\r`)[0];
              return d(L.toLowerCase().indexOf("efi") >= 0);
            }
          });
        } catch {
          return d(!1);
        }
      });
    });
  }
  function E(d, c) {
    let n = {
      kernel: s.release(),
      apache: "",
      bash: "",
      bun: "",
      deno: "",
      docker: "",
      dotnet: "",
      fish: "",
      gcc: "",
      git: "",
      grunt: "",
      gulp: "",
      homebrew: "",
      java: "",
      mongodb: "",
      mysql: "",
      nginx: "",
      node: "",
      //process.versions.node,
      npm: "",
      openssl: "",
      perl: "",
      php: "",
      pip3: "",
      pip: "",
      pm2: "",
      postfix: "",
      postgresql: "",
      powershell: "",
      python3: "",
      python: "",
      redis: "",
      systemOpenssl: "",
      systemOpensslLib: "",
      tsc: "",
      v8: process.versions.v8,
      virtualbox: "",
      yarn: "",
      zsh: ""
    };
    function L(G) {
      if (G === "*")
        return {
          versions: n,
          counter: 34
        };
      if (!Array.isArray(G)) {
        G = G.trim().toLowerCase().replace(/,+/g, "|").replace(/ /g, "|"), G = G.split("|");
        const K = {
          versions: {},
          counter: 0
        };
        return G.forEach((gA) => {
          if (gA)
            for (let H in n)
              ({}).hasOwnProperty.call(n, H) && H.toLowerCase() === gA.toLowerCase() && !{}.hasOwnProperty.call(K.versions, H) && (K.versions[H] = n[H], H === "openssl" && (K.versions.systemOpenssl = "", K.versions.systemOpensslLib = ""), K.versions[H] || K.counter++);
        }), K;
      }
    }
    return new Promise((G) => {
      process.nextTick(() => {
        if (A.isFunction(d) && !c)
          c = d, d = "*";
        else if (d = d || "*", typeof d != "string")
          return c && c({}), G({});
        const K = L(d);
        let gA = K.counter, H = () => {
          --gA === 0 && (c && c(K.versions), G(K.versions));
        }, U = "";
        try {
          if ({}.hasOwnProperty.call(K.versions, "openssl") && (K.versions.openssl = process.versions.openssl, g("openssl version", (V, m) => {
            if (!V) {
              let I = m.toString().split(`
`)[0].trim().split(" ");
              K.versions.systemOpenssl = I.length > 0 ? I[1] : I[0], K.versions.systemOpensslLib = I.length > 0 ? I[0] : "openssl";
            }
            H();
          })), {}.hasOwnProperty.call(K.versions, "npm") && g("npm -v", (V, m) => {
            V || (K.versions.npm = m.toString().split(`
`)[0]), H();
          }), {}.hasOwnProperty.call(K.versions, "pm2") && (U = "pm2", P && (U += ".cmd"), g(`${U} -v`, (V, m) => {
            if (!V) {
              let a = m.toString().split(`
`)[0].trim();
              a.startsWith("[PM2]") || (K.versions.pm2 = a);
            }
            H();
          })), {}.hasOwnProperty.call(K.versions, "yarn") && g("yarn --version", (V, m) => {
            V || (K.versions.yarn = m.toString().split(`
`)[0]), H();
          }), {}.hasOwnProperty.call(K.versions, "gulp") && (U = "gulp", P && (U += ".cmd"), g(`${U} --version`, (V, m) => {
            if (!V) {
              const a = m.toString().split(`
`)[0] || "";
              K.versions.gulp = (a.toLowerCase().split("version")[1] || "").trim();
            }
            H();
          })), {}.hasOwnProperty.call(K.versions, "homebrew") && (U = "brew", g(`${U} --version`, (V, m) => {
            if (!V) {
              const a = m.toString().split(`
`)[0] || "";
              K.versions.homebrew = (a.toLowerCase().split(" ")[1] || "").trim();
            }
            H();
          })), {}.hasOwnProperty.call(K.versions, "tsc") && (U = "tsc", P && (U += ".cmd"), g(`${U} --version`, (V, m) => {
            if (!V) {
              const a = m.toString().split(`
`)[0] || "";
              K.versions.tsc = (a.toLowerCase().split("version")[1] || "").trim();
            }
            H();
          })), {}.hasOwnProperty.call(K.versions, "grunt") && (U = "grunt", P && (U += ".cmd"), g(`${U} --version`, (V, m) => {
            if (!V) {
              const a = m.toString().split(`
`)[0] || "";
              K.versions.grunt = (a.toLowerCase().split("cli v")[1] || "").trim();
            }
            H();
          })), {}.hasOwnProperty.call(K.versions, "git"))
            if (k) {
              const V = e.existsSync("/usr/local/Cellar/git") || e.existsSync("/opt/homebrew/bin/git");
              A.darwinXcodeExists() || V ? g("git --version", (m, a) => {
                if (!m) {
                  let I = a.toString().split(`
`)[0] || "";
                  I = (I.toLowerCase().split("version")[1] || "").trim(), K.versions.git = (I.split(" ")[0] || "").trim();
                }
                H();
              }) : H();
            } else
              g("git --version", (V, m) => {
                if (!V) {
                  let a = m.toString().split(`
`)[0] || "";
                  a = (a.toLowerCase().split("version")[1] || "").trim(), K.versions.git = (a.split(" ")[0] || "").trim();
                }
                H();
              });
          if ({}.hasOwnProperty.call(K.versions, "apache") && g("apachectl -v 2>&1", (V, m) => {
            if (!V) {
              const a = (m.toString().split(`
`)[0] || "").split(":");
              K.versions.apache = a.length > 1 ? a[1].replace("Apache", "").replace("/", "").split("(")[0].trim() : "";
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "nginx") && g("nginx -v 2>&1", (V, m) => {
            if (!V) {
              const a = m.toString().split(`
`)[0] || "";
              K.versions.nginx = (a.toLowerCase().split("/")[1] || "").trim();
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "mysql") && g("mysql -V", (V, m) => {
            if (!V) {
              let a = m.toString().split(`
`)[0] || "";
              if (a = a.toLowerCase(), a.indexOf(",") > -1) {
                a = (a.split(",")[0] || "").trim();
                const I = a.split(" ");
                K.versions.mysql = (I[I.length - 1] || "").trim();
              } else
                a.indexOf(" ver ") > -1 && (a = a.split(" ver ")[1], K.versions.mysql = a.split(" ")[0]);
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "php") && g("php -v", (V, m) => {
            if (!V) {
              let I = (m.toString().split(`
`)[0] || "").split("(");
              I[0].indexOf("-") && (I = I[0].split("-")), K.versions.php = I[0].replace(/[^0-9.]/g, "");
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "redis") && g("redis-server --version", (V, m) => {
            if (!V) {
              const I = (m.toString().split(`
`)[0] || "").split(" ");
              K.versions.redis = A.getValue(I, "v", "=", !0);
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "docker") && g("docker --version", (V, m) => {
            if (!V) {
              const I = (m.toString().split(`
`)[0] || "").split(" ");
              K.versions.docker = I.length > 2 && I[2].endsWith(",") ? I[2].slice(0, -1) : "";
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "postfix") && g("postconf -d | grep mail_version", (V, m) => {
            if (!V) {
              const a = m.toString().split(`
`) || [];
              K.versions.postfix = A.getValue(a, "mail_version", "=", !0);
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "mongodb") && g("mongod --version", (V, m) => {
            if (!V) {
              const a = m.toString().split(`
`)[0] || "";
              K.versions.mongodb = (a.toLowerCase().split(",")[0] || "").replace(/[^0-9.]/g, "");
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "postgresql") && (F ? g("locate bin/postgres", (V, m) => {
            if (V)
              g("psql -V", (a, I) => {
                if (!a) {
                  const t = I.toString().split(`
`)[0].split(" ") || [];
                  K.versions.postgresql = t.length ? t[t.length - 1] : "", K.versions.postgresql = K.versions.postgresql.split("-")[0];
                }
                H();
              });
            else {
              const a = m.toString().split(`
`).sort();
              a.length ? g(a[a.length - 1] + " -V", (I, t) => {
                if (!I) {
                  const l = t.toString().split(`
`)[0].split(" ") || [];
                  K.versions.postgresql = l.length ? l[l.length - 1] : "";
                }
                H();
              }) : H();
            }
          }) : P ? A.powerShell("Get-CimInstance Win32_Service | select caption | fl").then((V) => {
            V.split(/\n\s*\n/).forEach((a) => {
              if (a.trim() !== "") {
                let I = a.trim().split(`\r
`), t = A.getValue(I, "caption", ":", !0).toLowerCase();
                if (t.indexOf("postgresql") > -1) {
                  const l = t.split(" server ");
                  l.length > 1 && (K.versions.postgresql = l[1]);
                }
              }
            }), H();
          }) : g("postgres -V", (V, m) => {
            if (V)
              g("pg_config --version", (a, I) => {
                if (!a) {
                  const t = I.toString().split(`
`)[0].split(" ") || [];
                  K.versions.postgresql = t.length ? t[t.length - 1] : "";
                }
              });
            else {
              const a = m.toString().split(`
`)[0].split(" ") || [];
              K.versions.postgresql = a.length ? a[a.length - 1] : "";
            }
            H();
          })), {}.hasOwnProperty.call(K.versions, "perl") && g("perl -v", (V, m) => {
            if (!V) {
              const a = m.toString().split(`
`) || "";
              for (; a.length > 0 && a[0].trim() === ""; )
                a.shift();
              a.length > 0 && (K.versions.perl = a[0].split("(").pop().split(")")[0].replace("v", ""));
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "python"))
            if (k)
              try {
                const m = r("sw_vers").toString().split(`
`), a = A.getValue(m, "ProductVersion", ":"), I = e.existsSync("/usr/local/Cellar/python"), t = e.existsSync("/opt/homebrew/bin/python");
                A.darwinXcodeExists() && A.semverCompare("12.0.1", a) < 0 || I || t ? g(I ? "/usr/local/Cellar/python -V 2>&1" : t ? "/opt/homebrew/bin/python -V 2>&1" : "python -V 2>&1", (D, f) => {
                  if (!D) {
                    const w = f.toString().split(`
`)[0] || "";
                    K.versions.python = w.toLowerCase().replace("python", "").trim();
                  }
                  H();
                }) : H();
              } catch {
                H();
              }
            else
              g("python -V 2>&1", (V, m) => {
                if (!V) {
                  const a = m.toString().split(`
`)[0] || "";
                  K.versions.python = a.toLowerCase().replace("python", "").trim();
                }
                H();
              });
          if ({}.hasOwnProperty.call(K.versions, "python3"))
            if (k) {
              const V = e.existsSync("/usr/local/Cellar/python3") || e.existsSync("/opt/homebrew/bin/python3");
              A.darwinXcodeExists() || V ? g("python3 -V 2>&1", (m, a) => {
                if (!m) {
                  const I = a.toString().split(`
`)[0] || "";
                  K.versions.python3 = I.toLowerCase().replace("python", "").trim();
                }
                H();
              }) : H();
            } else
              g("python3 -V 2>&1", (V, m) => {
                if (!V) {
                  const a = m.toString().split(`
`)[0] || "";
                  K.versions.python3 = a.toLowerCase().replace("python", "").trim();
                }
                H();
              });
          if ({}.hasOwnProperty.call(K.versions, "pip"))
            if (k) {
              const V = e.existsSync("/usr/local/Cellar/pip") || e.existsSync("/opt/homebrew/bin/pip");
              A.darwinXcodeExists() || V ? g("pip -V 2>&1", (m, a) => {
                if (!m) {
                  const t = (a.toString().split(`
`)[0] || "").split(" ");
                  K.versions.pip = t.length >= 2 ? t[1] : "";
                }
                H();
              }) : H();
            } else
              g("pip -V 2>&1", (V, m) => {
                if (!V) {
                  const I = (m.toString().split(`
`)[0] || "").split(" ");
                  K.versions.pip = I.length >= 2 ? I[1] : "";
                }
                H();
              });
          if ({}.hasOwnProperty.call(K.versions, "pip3"))
            if (k) {
              const V = e.existsSync("/usr/local/Cellar/pip3") || e.existsSync("/opt/homebrew/bin/pip3");
              A.darwinXcodeExists() || V ? g("pip3 -V 2>&1", (m, a) => {
                if (!m) {
                  const t = (a.toString().split(`
`)[0] || "").split(" ");
                  K.versions.pip3 = t.length >= 2 ? t[1] : "";
                }
                H();
              }) : H();
            } else
              g("pip3 -V 2>&1", (V, m) => {
                if (!V) {
                  const I = (m.toString().split(`
`)[0] || "").split(" ");
                  K.versions.pip3 = I.length >= 2 ? I[1] : "";
                }
                H();
              });
          ({}).hasOwnProperty.call(K.versions, "java") && (k ? g("/usr/libexec/java_home -V 2>&1", (V, m) => {
            !V && m.toString().toLowerCase().indexOf("no java runtime") === -1 ? g("java -version 2>&1", (a, I) => {
              if (!a) {
                const l = (I.toString().split(`
`)[0] || "").split('"');
                K.versions.java = l.length === 3 ? l[1].trim() : "";
              }
              H();
            }) : H();
          }) : g("java -version 2>&1", (V, m) => {
            if (!V) {
              const I = (m.toString().split(`
`)[0] || "").split('"');
              K.versions.java = I.length === 3 ? I[1].trim() : "";
            }
            H();
          })), {}.hasOwnProperty.call(K.versions, "gcc") && (k && A.darwinXcodeExists() || !k ? g("gcc -dumpversion", (V, m) => {
            V || (K.versions.gcc = m.toString().split(`
`)[0].trim() || ""), K.versions.gcc.indexOf(".") > -1 ? H() : g("gcc --version", (a, I) => {
              if (!a) {
                const t = I.toString().split(`
`)[0].trim();
                if (t.indexOf("gcc") > -1 && t.indexOf(")") > -1) {
                  const l = t.split(")");
                  K.versions.gcc = l[1].trim() || K.versions.gcc;
                }
              }
              H();
            });
          }) : H()), {}.hasOwnProperty.call(K.versions, "virtualbox") && g(A.getVboxmanage() + " -v 2>&1", (V, m) => {
            if (!V) {
              const I = (m.toString().split(`
`)[0] || "").split("r");
              K.versions.virtualbox = I[0];
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "bash") && g("bash --version", (V, m) => {
            if (!V) {
              const I = m.toString().split(`
`)[0].split(" version ");
              I.length > 1 && (K.versions.bash = I[1].split(" ")[0].split("(")[0]);
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "zsh") && g("zsh --version", (V, m) => {
            if (!V) {
              const I = m.toString().split(`
`)[0].split("zsh ");
              I.length > 1 && (K.versions.zsh = I[1].split(" ")[0]);
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "fish") && g("fish --version", (V, m) => {
            if (!V) {
              const I = m.toString().split(`
`)[0].split(" version ");
              I.length > 1 && (K.versions.fish = I[1].split(" ")[0]);
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "bun") && g("bun -v", (V, m) => {
            if (!V) {
              const a = m.toString().split(`
`)[0].trim();
              K.versions.bun = a;
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "deno") && g("deno -v", (V, m) => {
            if (!V) {
              const I = m.toString().split(`
`)[0].trim().split(" ");
              I.length > 1 && (K.versions.deno = I[1]);
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "node") && g("node -v", (V, m) => {
            if (!V) {
              let a = m.toString().split(`
`)[0].trim();
              a.startsWith("v") && (a = a.slice(1)), K.versions.node = a;
            }
            H();
          }), {}.hasOwnProperty.call(K.versions, "powershell") && (P ? A.powerShell("$PSVersionTable").then((V) => {
            const m = V.toString().toLowerCase().split(`
`).map((a) => a.replace(/ +/g, " ").replace(/ +/g, ":"));
            K.versions.powershell = A.getValue(m, "psversion"), H();
          }) : H()), {}.hasOwnProperty.call(K.versions, "dotnet") && (P ? A.powerShell(
            'gci "HKLM:\\SOFTWARE\\Microsoft\\NET Framework Setup\\NDP" -recurse | gp -name Version,Release -EA 0 | where { $_.PSChildName -match "^(?!S)\\p{L}"} | select PSChildName, Version, Release'
          ).then((V) => {
            const m = V.toString().split(`\r
`);
            let a = "";
            m.forEach((I) => {
              I = I.replace(/ +/g, " ");
              const t = I.split(" ");
              a = a || (t[0].toLowerCase().startsWith("client") && t.length > 2 || t[0].toLowerCase().startsWith("full") && t.length > 2 ? t[1].trim() : "");
            }), K.versions.dotnet = a.trim(), H();
          }) : H());
        } catch {
          c && c(K.versions), G(K.versions);
        }
      });
    });
  }
  osinfo.versions = E;
  function u(d) {
    return new Promise((c) => {
      process.nextTick(() => {
        if (P)
          try {
            A.powerShell(`Get-CimInstance -className win32_process | where-object {$_.ProcessId -eq ${process.ppid} } | select Name`).then((L) => {
              let G = "CMD";
              L && L.toString().toLowerCase().indexOf("powershell") >= 0 && (G = "PowerShell"), d && d(G), c(G);
            });
          } catch {
            d && d(result), c(result);
          }
        else {
          let n = "";
          g("echo $SHELL", (L, G) => {
            L || (n = G.toString().split(`
`)[0]), d && d(n), c(n);
          });
        }
      });
    });
  }
  osinfo.shell = u;
  function o() {
    let d = [];
    try {
      const c = s.networkInterfaces();
      for (let n in c)
        ({}).hasOwnProperty.call(c, n) && c[n].forEach((L) => {
          if (L && L.mac && L.mac !== "00:00:00:00:00:00") {
            const G = L.mac.toLowerCase();
            d.indexOf(G) === -1 && d.push(G);
          }
        });
      d = d.sort((n, L) => n < L ? -1 : n > L ? 1 : 0);
    } catch {
      d.push("00:00:00:00:00:00");
    }
    return d;
  }
  function Q(d) {
    return new Promise((c) => {
      process.nextTick(() => {
        let n = {
          os: "",
          hardware: "",
          macs: o()
        }, L;
        if (k && g("system_profiler SPHardwareDataType -json", (G, K) => {
          if (!G)
            try {
              const gA = JSON.parse(K.toString());
              if (gA.SPHardwareDataType && gA.SPHardwareDataType.length > 0) {
                const H = gA.SPHardwareDataType[0];
                n.os = H.platform_UUID.toLowerCase(), n.hardware = H.serial_number;
              }
            } catch {
              A.noop();
            }
          d && d(n), c(n);
        }), F && g(`echo -n "os: "; cat /var/lib/dbus/machine-id 2> /dev/null ||
cat /etc/machine-id 2> /dev/null; echo;
echo -n "hardware: "; cat /sys/class/dmi/id/product_uuid 2> /dev/null; echo;`, (K, gA) => {
          const H = gA.toString().split(`
`);
          if (n.os = A.getValue(H, "os").toLowerCase(), n.hardware = A.getValue(H, "hardware").toLowerCase(), !n.hardware) {
            const U = e.readFileSync("/proc/cpuinfo", { encoding: "utf8" }).toString().split(`
`), V = A.getValue(U, "serial");
            n.hardware = V || "";
          }
          d && d(n), c(n);
        }), (q || Z || $) && g("sysctl -i kern.hostid kern.hostuuid", (G, K) => {
          const gA = K.toString().split(`
`);
          n.hardware = A.getValue(gA, "kern.hostid", ":").toLowerCase(), n.os = A.getValue(gA, "kern.hostuuid", ":").toLowerCase(), n.os.indexOf("unknown") >= 0 && (n.os = ""), n.hardware.indexOf("unknown") >= 0 && (n.hardware = ""), d && d(n), c(n);
        }), P) {
          let G = "%windir%\\System32";
          process.arch === "ia32" && Object.prototype.hasOwnProperty.call(process.env, "PROCESSOR_ARCHITEW6432") && (G = "%windir%\\sysnative\\cmd.exe /c %windir%\\System32"), A.powerShell("Get-CimInstance Win32_ComputerSystemProduct | select UUID | fl").then((K) => {
            let gA = K.split(`\r
`);
            n.hardware = A.getValue(gA, "uuid", ":").toLowerCase(), g(`${G}\\reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid`, A.execOptsWin, (H, U) => {
              L = U.toString().split(`
\r`)[0].split("REG_SZ"), n.os = L.length > 1 ? L[1].replace(/\r+|\n+|\s+/gi, "").toLowerCase() : "", d && d(n), c(n);
            });
          });
        }
      });
    });
  }
  return osinfo.uuid = Q, osinfo;
}
var hasRequiredSystem;
function requireSystem() {
  if (hasRequiredSystem) return system;
  hasRequiredSystem = 1;
  const s = require$$1$1, e = require$$0$1, A = requireUtil(), { uuid: g } = requireOsinfo(), r = require$$1.exec, B = require$$1.execSync, F = A.promisify(require$$1.exec), k = process.platform, P = k === "linux" || k === "android", q = k === "darwin", Z = k === "win32", $ = k === "freebsd", sA = k === "openbsd", X = k === "netbsd", S = k === "sunos";
  function J(E) {
    return new Promise((u) => {
      process.nextTick(() => {
        let o = {
          manufacturer: "",
          model: "Computer",
          version: "",
          serial: "-",
          uuid: "-",
          sku: "-",
          virtual: !1
        };
        if ((P || $ || sA || X) && r("export LC_ALL=C; dmidecode -t system 2>/dev/null; unset LC_ALL", (Q, d) => {
          let c = d.toString().split(`
`);
          o.manufacturer = eA(A.getValue(c, "manufacturer")), o.model = eA(A.getValue(c, "product name")), o.version = eA(A.getValue(c, "version")), o.serial = eA(A.getValue(c, "serial number")), o.uuid = eA(A.getValue(c, "uuid")).toLowerCase(), o.sku = eA(A.getValue(c, "sku number"));
          const n = `echo -n "product_name: "; cat /sys/devices/virtual/dmi/id/product_name 2>/dev/null; echo;
            echo -n "product_serial: "; cat /sys/devices/virtual/dmi/id/product_serial 2>/dev/null; echo;
            echo -n "product_uuid: "; cat /sys/devices/virtual/dmi/id/product_uuid 2>/dev/null; echo;
            echo -n "product_version: "; cat /sys/devices/virtual/dmi/id/product_version 2>/dev/null; echo;
            echo -n "sys_vendor: "; cat /sys/devices/virtual/dmi/id/sys_vendor 2>/dev/null; echo;`;
          try {
            c = B(n, A.execOptsLinux).toString().split(`
`), o.manufacturer = eA(o.manufacturer === "" ? A.getValue(c, "sys_vendor") : o.manufacturer), o.model = eA(o.model === "" ? A.getValue(c, "product_name") : o.model), o.version = eA(o.version === "" ? A.getValue(c, "product_version") : o.version), o.serial = eA(o.serial === "" ? A.getValue(c, "product_serial") : o.serial), o.uuid = eA(o.uuid === "" ? A.getValue(c, "product_uuid").toLowerCase() : o.uuid);
          } catch {
            A.noop();
          }
          if (o.serial || (o.serial = "-"), o.manufacturer || (o.manufacturer = ""), o.model || (o.model = "Computer"), o.version || (o.version = ""), o.sku || (o.sku = "-"), o.model.toLowerCase() === "virtualbox" || o.model.toLowerCase() === "kvm" || o.model.toLowerCase() === "virtual machine" || o.model.toLowerCase() === "bochs" || o.model.toLowerCase().startsWith("vmware") || o.model.toLowerCase().startsWith("droplet"))
            switch (o.virtual = !0, o.model.toLowerCase()) {
              case "virtualbox":
                o.virtualHost = "VirtualBox";
                break;
              case "vmware":
                o.virtualHost = "VMware";
                break;
              case "kvm":
                o.virtualHost = "KVM";
                break;
              case "bochs":
                o.virtualHost = "bochs";
                break;
            }
          if (o.manufacturer.toLowerCase().startsWith("vmware") || o.manufacturer.toLowerCase() === "xen")
            switch (o.virtual = !0, o.manufacturer.toLowerCase()) {
              case "vmware":
                o.virtualHost = "VMware";
                break;
              case "xen":
                o.virtualHost = "Xen";
                break;
            }
          if (!o.virtual)
            try {
              const L = B("ls -1 /dev/disk/by-id/ 2>/dev/null; pciconf -lv  2>/dev/null", A.execOptsLinux).toString();
              (L.indexOf("_QEMU_") >= 0 || L.indexOf("QEMU ") >= 0) && (o.virtual = !0, o.virtualHost = "QEMU"), L.indexOf("_VBOX_") >= 0 && (o.virtual = !0, o.virtualHost = "VirtualBox");
            } catch {
              A.noop();
            }
          if ($ || sA || X)
            try {
              const L = B("sysctl -i kern.hostuuid kern.hostid hw.model", A.execOptsLinux).toString().split(`
`);
              o.uuid || (o.uuid = A.getValue(L, "kern.hostuuid", ":").toLowerCase()), (!o.serial || o.serial === "-") && (o.serial = A.getValue(L, "kern.hostid", ":").toLowerCase()), (!o.model || o.model === "Computer") && (o.model = A.getValue(L, "hw.model", ":").trim());
            } catch {
              A.noop();
            }
          if (!o.virtual && (e.release().toLowerCase().indexOf("microsoft") >= 0 || e.release().toLowerCase().endsWith("wsl2"))) {
            const L = parseFloat(e.release().toLowerCase());
            o.virtual = !0, o.manufacturer = "Microsoft", o.model = "WSL", o.version = L < 4.19 ? "1" : "2";
          }
          if (($ || sA || X) && !o.virtualHost)
            try {
              const G = B("dmidecode -t 4", A.execOptsLinux).toString().split(`
`);
              switch (A.getValue(G, "manufacturer", ":", !0).toLowerCase()) {
                case "virtualbox":
                  o.virtualHost = "VirtualBox";
                  break;
                case "vmware":
                  o.virtualHost = "VMware";
                  break;
                case "kvm":
                  o.virtualHost = "KVM";
                  break;
                case "bochs":
                  o.virtualHost = "bochs";
                  break;
              }
            } catch {
              A.noop();
            }
          (s.existsSync("/.dockerenv") || s.existsSync("/.dockerinit")) && (o.model = "Docker Container");
          try {
            const L = B('dmesg 2>/dev/null | grep -iE "virtual|hypervisor" | grep -iE "vmware|qemu|kvm|xen" | grep -viE "Nested Virtualization|/virtual/"');
            L.toString().split(`
`).length > 0 && (o.model === "Computer" && (o.model = "Virtual machine"), o.virtual = !0, L.toString().toLowerCase().indexOf("vmware") >= 0 && !o.virtualHost && (o.virtualHost = "VMware"), L.toString().toLowerCase().indexOf("qemu") >= 0 && !o.virtualHost && (o.virtualHost = "QEMU"), L.toString().toLowerCase().indexOf("xen") >= 0 && !o.virtualHost && (o.virtualHost = "Xen"), L.toString().toLowerCase().indexOf("kvm") >= 0 && !o.virtualHost && (o.virtualHost = "KVM"));
          } catch {
            A.noop();
          }
          o.manufacturer === "" && o.model === "Computer" && o.version === "" ? s.readFile("/proc/cpuinfo", (L, G) => {
            if (!L) {
              let K = G.toString().split(`
`);
              if (o.model = A.getValue(K, "hardware", ":", !0).toUpperCase(), o.version = A.getValue(K, "revision", ":", !0).toLowerCase(), o.serial = A.getValue(K, "serial", ":", !0), A.getValue(K, "model:", ":", !0), A.isRaspberry(K)) {
                const gA = A.decodePiCpuinfo(K);
                o.model = gA.model, o.version = gA.revisionCode, o.manufacturer = "Raspberry Pi Foundation", o.raspberry = {
                  manufacturer: gA.manufacturer,
                  processor: gA.processor,
                  type: gA.type,
                  revision: gA.revision
                };
              }
            }
            E && E(o), u(o);
          }) : (E && E(o), u(o));
        }), q && r("ioreg -c IOPlatformExpertDevice -d 2", (Q, d) => {
          if (!Q) {
            const c = d.toString().replace(/[<>"]/g, "").split(`
`), n = A.getAppleModel(A.getValue(c, "model", "=", !0));
            o.manufacturer = A.getValue(c, "manufacturer", "=", !0), o.model = n.key, o.type = p(n.version), o.version = n.version, o.serial = A.getValue(c, "ioplatformserialnumber", "=", !0), o.uuid = A.getValue(c, "ioplatformuuid", "=", !0).toLowerCase(), o.sku = A.getValue(c, "board-id", "=", !0) || A.getValue(c, "target-sub-type", "=", !0);
          }
          E && E(o), u(o);
        }), S && (E && E(o), u(o)), Z)
          try {
            A.powerShell("Get-CimInstance Win32_ComputerSystemProduct | select Name,Vendor,Version,IdentifyingNumber,UUID | fl").then((Q, d) => {
              if (d)
                E && E(o), u(o);
              else {
                const c = Q.split(`\r
`);
                o.manufacturer = A.getValue(c, "vendor", ":"), o.model = A.getValue(c, "name", ":"), o.version = A.getValue(c, "version", ":"), o.serial = A.getValue(c, "identifyingnumber", ":"), o.uuid = A.getValue(c, "uuid", ":").toLowerCase();
                const n = o.model.toLowerCase();
                (n === "virtualbox" || n === "kvm" || n === "virtual machine" || n === "bochs" || n.startsWith("vmware") || n.startsWith("qemu") || n.startsWith("parallels")) && (o.virtual = !0, n.startsWith("virtualbox") && (o.virtualHost = "VirtualBox"), n.startsWith("vmware") && (o.virtualHost = "VMware"), n.startsWith("kvm") && (o.virtualHost = "KVM"), n.startsWith("bochs") && (o.virtualHost = "bochs"), n.startsWith("qemu") && (o.virtualHost = "KVM"), n.startsWith("parallels") && (o.virtualHost = "Parallels"));
                const L = o.manufacturer.toLowerCase();
                (L.startsWith("vmware") || L.startsWith("qemu") || L === "xen" || L.startsWith("parallels")) && (o.virtual = !0, L.startsWith("vmware") && (o.virtualHost = "VMware"), L.startsWith("xen") && (o.virtualHost = "Xen"), L.startsWith("qemu") && (o.virtualHost = "KVM"), L.startsWith("parallels") && (o.virtualHost = "Parallels")), A.powerShell('Get-CimInstance MS_Systeminformation -Namespace "root/wmi" | select systemsku | fl ').then((G, K) => {
                  if (!K) {
                    const gA = G.split(`\r
`);
                    o.sku = A.getValue(gA, "systemsku", ":");
                  }
                  o.virtual ? (E && E(o), u(o)) : A.powerShell("Get-CimInstance Win32_bios | select Version, SerialNumber, SMBIOSBIOSVersion").then((gA, H) => {
                    if (H)
                      E && E(o), u(o);
                    else {
                      let U = gA.toString();
                      (U.indexOf("VRTUAL") >= 0 || U.indexOf("A M I ") >= 0 || U.indexOf("VirtualBox") >= 0 || U.indexOf("VMWare") >= 0 || U.indexOf("Xen") >= 0 || U.indexOf("Parallels") >= 0) && (o.virtual = !0, U.indexOf("VirtualBox") >= 0 && !o.virtualHost && (o.virtualHost = "VirtualBox"), U.indexOf("VMware") >= 0 && !o.virtualHost && (o.virtualHost = "VMware"), U.indexOf("Xen") >= 0 && !o.virtualHost && (o.virtualHost = "Xen"), U.indexOf("VRTUAL") >= 0 && !o.virtualHost && (o.virtualHost = "Hyper-V"), U.indexOf("A M I") >= 0 && !o.virtualHost && (o.virtualHost = "Virtual PC"), U.indexOf("Parallels") >= 0 && !o.virtualHost && (o.virtualHost = "Parallels")), E && E(o), u(o);
                    }
                  });
                });
              }
            });
          } catch {
            E && E(o), u(o);
          }
      });
    });
  }
  system.system = J;
  function eA(E) {
    const u = E.toLowerCase();
    return u.indexOf("o.e.m.") === -1 && u.indexOf("default string") === -1 && u !== "default" && E || "";
  }
  function b(E) {
    return new Promise((u) => {
      process.nextTick(() => {
        let o = {
          vendor: "",
          version: "",
          releaseDate: "",
          revision: ""
        }, Q = "";
        if ((P || $ || sA || X) && (process.arch === "arm" ? Q = "cat /proc/cpuinfo | grep Serial" : Q = "export LC_ALL=C; dmidecode -t bios 2>/dev/null; unset LC_ALL", r(Q, (d, c) => {
          let n = c.toString().split(`
`);
          o.vendor = A.getValue(n, "Vendor"), o.version = A.getValue(n, "Version");
          let L = A.getValue(n, "Release Date");
          o.releaseDate = A.parseDateTime(L).date, o.revision = A.getValue(n, "BIOS Revision"), o.serial = A.getValue(n, "SerialNumber");
          let G = A.getValue(n, "Currently Installed Language").split("|")[0];
          if (G && (o.language = G), n.length && c.toString().indexOf("Characteristics:") >= 0) {
            const gA = [];
            n.forEach((H) => {
              if (H.indexOf(" is supported") >= 0) {
                const U = H.split(" is supported")[0].trim();
                gA.push(U);
              }
            }), o.features = gA;
          }
          const K = `echo -n "bios_date: "; cat /sys/devices/virtual/dmi/id/bios_date 2>/dev/null; echo;
            echo -n "bios_vendor: "; cat /sys/devices/virtual/dmi/id/bios_vendor 2>/dev/null; echo;
            echo -n "bios_version: "; cat /sys/devices/virtual/dmi/id/bios_version 2>/dev/null; echo;`;
          try {
            n = B(K, A.execOptsLinux).toString().split(`
`), o.vendor = o.vendor ? o.vendor : A.getValue(n, "bios_vendor"), o.version = o.version ? o.version : A.getValue(n, "bios_version"), L = A.getValue(n, "bios_date"), o.releaseDate = o.releaseDate ? o.releaseDate : A.parseDateTime(L).date;
          } catch {
            A.noop();
          }
          E && E(o), u(o);
        })), q && (o.vendor = "Apple Inc.", r("system_profiler SPHardwareDataType -json", (d, c) => {
          try {
            const n = JSON.parse(c.toString());
            if (n && n.SPHardwareDataType && n.SPHardwareDataType.length) {
              let L = n.SPHardwareDataType[0].boot_rom_version;
              L = L ? L.split("(")[0].trim() : null, o.version = L;
            }
          } catch {
            A.noop();
          }
          E && E(o), u(o);
        })), S && (o.vendor = "Sun Microsystems", E && E(o), u(o)), Z)
          try {
            A.powerShell(
              'Get-CimInstance Win32_bios | select Description,Version,Manufacturer,@{n="ReleaseDate";e={$_.ReleaseDate.ToString("yyyy-MM-dd")}},BuildNumber,SerialNumber,SMBIOSBIOSVersion | fl'
            ).then((d, c) => {
              if (!c) {
                let n = d.toString().split(`\r
`);
                const L = A.getValue(n, "description", ":"), G = A.getValue(n, "SMBIOSBIOSVersion", ":");
                L.indexOf(" Version ") !== -1 ? (o.vendor = L.split(" Version ")[0].trim(), o.version = L.split(" Version ")[1].trim()) : L.indexOf(" Ver: ") !== -1 ? (o.vendor = A.getValue(n, "manufacturer", ":"), o.version = L.split(" Ver: ")[1].trim()) : (o.vendor = A.getValue(n, "manufacturer", ":"), o.version = G || A.getValue(n, "version", ":")), o.releaseDate = A.getValue(n, "releasedate", ":"), o.revision = A.getValue(n, "buildnumber", ":"), o.serial = eA(A.getValue(n, "serialnumber", ":"));
              }
              E && E(o), u(o);
            });
          } catch {
            E && E(o), u(o);
          }
      });
    });
  }
  system.bios = b;
  function N(E) {
    return new Promise((u) => {
      process.nextTick(() => {
        const o = {
          manufacturer: "",
          model: "",
          version: "",
          serial: "-",
          assetTag: "-",
          memMax: null,
          memSlots: null
        };
        let Q = "";
        if (P || $ || sA || X) {
          process.arch === "arm" ? Q = "cat /proc/cpuinfo | grep Serial" : Q = "export LC_ALL=C; dmidecode -t 2 2>/dev/null; unset LC_ALL";
          const d = [];
          d.push(F(Q)), d.push(F("export LC_ALL=C; dmidecode -t memory 2>/dev/null")), A.promiseAll(d).then((c) => {
            let n = c.results[0] ? c.results[0].toString().split(`
`) : [""];
            o.manufacturer = eA(A.getValue(n, "Manufacturer")), o.model = eA(A.getValue(n, "Product Name")), o.version = eA(A.getValue(n, "Version")), o.serial = eA(A.getValue(n, "Serial Number")), o.assetTag = eA(A.getValue(n, "Asset Tag"));
            const L = `echo -n "board_asset_tag: "; cat /sys/devices/virtual/dmi/id/board_asset_tag 2>/dev/null; echo;
            echo -n "board_name: "; cat /sys/devices/virtual/dmi/id/board_name 2>/dev/null; echo;
            echo -n "board_serial: "; cat /sys/devices/virtual/dmi/id/board_serial 2>/dev/null; echo;
            echo -n "board_vendor: "; cat /sys/devices/virtual/dmi/id/board_vendor 2>/dev/null; echo;
            echo -n "board_version: "; cat /sys/devices/virtual/dmi/id/board_version 2>/dev/null; echo;`;
            try {
              n = B(L, A.execOptsLinux).toString().split(`
`), o.manufacturer = eA(o.manufacturer ? o.manufacturer : A.getValue(n, "board_vendor")), o.model = eA(o.model ? o.model : A.getValue(n, "board_name")), o.version = eA(o.version ? o.version : A.getValue(n, "board_version")), o.serial = eA(o.serial ? o.serial : A.getValue(n, "board_serial")), o.assetTag = eA(o.assetTag ? o.assetTag : A.getValue(n, "board_asset_tag"));
            } catch {
              A.noop();
            }
            if (n = c.results[1] ? c.results[1].toString().split(`
`) : [""], o.memMax = A.toInt(A.getValue(n, "Maximum Capacity")) * 1024 * 1024 * 1024 || null, o.memSlots = A.toInt(A.getValue(n, "Number Of Devices")) || null, A.isRaspberry()) {
              const G = A.decodePiCpuinfo();
              o.manufacturer = G.manufacturer, o.model = "Raspberry Pi", o.serial = G.serial, o.version = G.type + " - " + G.revision, o.memMax = e.totalmem(), o.memSlots = 0;
            }
            E && E(o), u(o);
          });
        }
        if (q) {
          const d = [];
          d.push(F("ioreg -c IOPlatformExpertDevice -d 2")), d.push(F("system_profiler SPMemoryDataType")), A.promiseAll(d).then((c) => {
            const n = c.results[0] ? c.results[0].toString().replace(/[<>"]/g, "").split(`
`) : [""];
            o.manufacturer = A.getValue(n, "manufacturer", "=", !0), o.model = A.getValue(n, "model", "=", !0), o.version = A.getValue(n, "version", "=", !0), o.serial = A.getValue(n, "ioplatformserialnumber", "=", !0), o.assetTag = A.getValue(n, "board-id", "=", !0);
            let L = c.results[1] ? c.results[1].toString().split("        BANK ") : [""];
            L.length === 1 && (L = c.results[1] ? c.results[1].toString().split("        DIMM") : [""]), L.shift(), o.memSlots = L.length, e.arch() === "arm64" && (o.memSlots = 0, o.memMax = e.totalmem()), E && E(o), u(o);
          });
        }
        if (S && (E && E(o), u(o)), Z)
          try {
            const d = [], c = parseInt(e.release()) >= 10, n = c ? "MaxCapacityEx" : "MaxCapacity";
            d.push(A.powerShell("Get-CimInstance Win32_baseboard | select Model,Manufacturer,Product,Version,SerialNumber,PartNumber,SKU | fl")), d.push(A.powerShell(`Get-CimInstance Win32_physicalmemoryarray | select ${n}, MemoryDevices | fl`)), A.promiseAll(d).then((L) => {
              let G = L.results[0] ? L.results[0].toString().split(`\r
`) : [""];
              o.manufacturer = eA(A.getValue(G, "manufacturer", ":")), o.model = eA(A.getValue(G, "model", ":")), o.model || (o.model = eA(A.getValue(G, "product", ":"))), o.version = eA(A.getValue(G, "version", ":")), o.serial = eA(A.getValue(G, "serialnumber", ":")), o.assetTag = eA(A.getValue(G, "partnumber", ":")), o.assetTag || (o.assetTag = eA(A.getValue(G, "sku", ":"))), G = L.results[1] ? L.results[1].toString().split(`\r
`) : [""], o.memMax = A.toInt(A.getValue(G, n, ":")) * (c ? 1024 : 1) || null, o.memSlots = A.toInt(A.getValue(G, "MemoryDevices", ":")) || null, E && E(o), u(o);
            });
          } catch {
            E && E(o), u(o);
          }
      });
    });
  }
  system.baseboard = N;
  function p(E) {
    return E = E.toLowerCase(), E.indexOf("macbookair") >= 0 || E.indexOf("macbook air") >= 0 || E.indexOf("macbookpro") >= 0 || E.indexOf("macbook pro") >= 0 || E.indexOf("macbook") >= 0 ? "Notebook" : E.indexOf("macmini") >= 0 || E.indexOf("mac mini") >= 0 || E.indexOf("imac") >= 0 || E.indexOf("macstudio") >= 0 || E.indexOf("mac studio") >= 0 ? "Desktop" : E.indexOf("macpro") >= 0 || E.indexOf("mac pro") >= 0 ? "Tower" : "Other";
  }
  function h(E) {
    const u = [
      "Other",
      "Unknown",
      "Desktop",
      "Low Profile Desktop",
      "Pizza Box",
      "Mini Tower",
      "Tower",
      "Portable",
      "Laptop",
      "Notebook",
      "Hand Held",
      "Docking Station",
      "All in One",
      "Sub Notebook",
      "Space-Saving",
      "Lunch Box",
      "Main System Chassis",
      "Expansion Chassis",
      "SubChassis",
      "Bus Expansion Chassis",
      "Peripheral Chassis",
      "Storage Chassis",
      "Rack Mount Chassis",
      "Sealed-Case PC",
      "Multi-System Chassis",
      "Compact PCI",
      "Advanced TCA",
      "Blade",
      "Blade Enclosure",
      "Tablet",
      "Convertible",
      "Detachable",
      "IoT Gateway ",
      "Embedded PC",
      "Mini PC",
      "Stick PC"
    ];
    return new Promise((o) => {
      process.nextTick(() => {
        let Q = {
          manufacturer: "",
          model: "",
          type: "",
          version: "",
          serial: "-",
          assetTag: "-",
          sku: ""
        };
        if ((P || $ || sA || X) && r(`echo -n "chassis_asset_tag: "; cat /sys/devices/virtual/dmi/id/chassis_asset_tag 2>/dev/null; echo;
            echo -n "chassis_serial: "; cat /sys/devices/virtual/dmi/id/chassis_serial 2>/dev/null; echo;
            echo -n "chassis_type: "; cat /sys/devices/virtual/dmi/id/chassis_type 2>/dev/null; echo;
            echo -n "chassis_vendor: "; cat /sys/devices/virtual/dmi/id/chassis_vendor 2>/dev/null; echo;
            echo -n "chassis_version: "; cat /sys/devices/virtual/dmi/id/chassis_version 2>/dev/null; echo;`, (c, n) => {
          let L = n.toString().split(`
`);
          Q.manufacturer = eA(A.getValue(L, "chassis_vendor"));
          const G = parseInt(A.getValue(L, "chassis_type").replace(/\D/g, ""));
          Q.type = eA(G && !isNaN(G) && G < u.length ? u[G - 1] : ""), Q.version = eA(A.getValue(L, "chassis_version")), Q.serial = eA(A.getValue(L, "chassis_serial")), Q.assetTag = eA(A.getValue(L, "chassis_asset_tag")), E && E(Q), o(Q);
        }), q && r("ioreg -c IOPlatformExpertDevice -d 2", (d, c) => {
          if (!d) {
            const n = c.toString().replace(/[<>"]/g, "").split(`
`), L = A.getAppleModel(A.getValue(n, "model", "=", !0));
            Q.manufacturer = A.getValue(n, "manufacturer", "=", !0), Q.model = L.key, Q.type = p(L.model), Q.version = L.version, Q.serial = A.getValue(n, "ioplatformserialnumber", "=", !0), Q.assetTag = A.getValue(n, "board-id", "=", !0) || A.getValue(n, "target-type", "=", !0), Q.sku = A.getValue(n, "target-sub-type", "=", !0);
          }
          E && E(Q), o(Q);
        }), S && (E && E(Q), o(Q)), Z)
          try {
            A.powerShell("Get-CimInstance Win32_SystemEnclosure | select Model,Manufacturer,ChassisTypes,Version,SerialNumber,PartNumber,SKU,SMBIOSAssetTag | fl").then((d, c) => {
              if (!c) {
                let n = d.toString().split(`\r
`);
                Q.manufacturer = eA(A.getValue(n, "manufacturer", ":")), Q.model = eA(A.getValue(n, "model", ":"));
                const L = parseInt(A.getValue(n, "ChassisTypes", ":").replace(/\D/g, ""));
                Q.type = L && !isNaN(L) && L < u.length ? u[L - 1] : "", Q.version = eA(A.getValue(n, "version", ":")), Q.serial = eA(A.getValue(n, "serialnumber", ":")), Q.assetTag = eA(A.getValue(n, "partnumber", ":")), Q.assetTag || (Q.assetTag = eA(A.getValue(n, "SMBIOSAssetTag", ":"))), Q.sku = eA(A.getValue(n, "sku", ":"));
              }
              E && E(Q), o(Q);
            });
          } catch {
            E && E(Q), o(Q);
          }
      });
    });
  }
  return system.chassis = h, system;
}
var cpu = {}, hasRequiredCpu;
function requireCpu() {
  if (hasRequiredCpu) return cpu;
  hasRequiredCpu = 1;
  const s = require$$0$1, e = require$$1.exec, A = require$$1.execSync, g = require$$1$1, r = requireUtil(), B = process.platform, F = B === "linux" || B === "android", k = B === "darwin", P = B === "win32", q = B === "freebsd", Z = B === "openbsd", $ = B === "netbsd", sA = B === "sunos";
  let X = 0, S = {
    user: 0,
    nice: 0,
    system: 0,
    idle: 0,
    irq: 0,
    steal: 0,
    guest: 0,
    load: 0,
    tick: 0,
    ms: 0,
    currentLoad: 0,
    currentLoadUser: 0,
    currentLoadSystem: 0,
    currentLoadNice: 0,
    currentLoadIdle: 0,
    currentLoadIrq: 0,
    currentLoadSteal: 0,
    currentLoadGuest: 0,
    rawCurrentLoad: 0,
    rawCurrentLoadUser: 0,
    rawCurrentLoadSystem: 0,
    rawCurrentLoadNice: 0,
    rawCurrentLoadIdle: 0,
    rawCurrentLoadIrq: 0,
    rawCurrentLoadSteal: 0,
    rawCurrentLoadGuest: 0
  }, J = [], eA = 0;
  const b = {
    8346: "1.8",
    8347: "1.9",
    8350: "2.0",
    8354: "2.2",
    "8356|SE": "2.4",
    8356: "2.3",
    8360: "2.5",
    2372: "2.1",
    2373: "2.1",
    2374: "2.2",
    2376: "2.3",
    2377: "2.3",
    2378: "2.4",
    2379: "2.4",
    2380: "2.5",
    2381: "2.5",
    2382: "2.6",
    2384: "2.7",
    2386: "2.8",
    2387: "2.8",
    2389: "2.9",
    2393: "3.1",
    8374: "2.2",
    8376: "2.3",
    8378: "2.4",
    8379: "2.4",
    8380: "2.5",
    8381: "2.5",
    8382: "2.6",
    8384: "2.7",
    8386: "2.8",
    8387: "2.8",
    8389: "2.9",
    8393: "3.1",
    "2419EE": "1.8",
    "2423HE": "2.0",
    "2425HE": "2.1",
    2427: "2.2",
    2431: "2.4",
    2435: "2.6",
    "2439SE": "2.8",
    "8425HE": "2.1",
    8431: "2.4",
    8435: "2.6",
    "8439SE": "2.8",
    4122: "2.2",
    4130: "2.6",
    "4162EE": "1.7",
    "4164EE": "1.8",
    "4170HE": "2.1",
    "4174HE": "2.3",
    "4176HE": "2.4",
    4180: "2.6",
    4184: "2.8",
    "6124HE": "1.8",
    "6128HE": "2.0",
    "6132HE": "2.2",
    6128: "2.0",
    6134: "2.3",
    6136: "2.4",
    6140: "2.6",
    "6164HE": "1.7",
    "6166HE": "1.8",
    6168: "1.9",
    6172: "2.1",
    6174: "2.2",
    6176: "2.3",
    "6176SE": "2.3",
    "6180SE": "2.5",
    3250: "2.5",
    3260: "2.7",
    3280: "2.4",
    4226: "2.7",
    4228: "2.8",
    4230: "2.9",
    4234: "3.1",
    4238: "3.3",
    4240: "3.4",
    4256: "1.6",
    4274: "2.5",
    4276: "2.6",
    4280: "2.8",
    4284: "3.0",
    6204: "3.3",
    6212: "2.6",
    6220: "3.0",
    6234: "2.4",
    6238: "2.6",
    "6262HE": "1.6",
    6272: "2.1",
    6274: "2.2",
    6276: "2.3",
    6278: "2.4",
    "6282SE": "2.6",
    "6284SE": "2.7",
    6308: "3.5",
    6320: "2.8",
    6328: "3.2",
    "6338P": "2.3",
    6344: "2.6",
    6348: "2.8",
    6366: "1.8",
    "6370P": "2.0",
    6376: "2.3",
    6378: "2.4",
    6380: "2.5",
    6386: "2.8",
    "FX|4100": "3.6",
    "FX|4120": "3.9",
    "FX|4130": "3.8",
    "FX|4150": "3.8",
    "FX|4170": "4.2",
    "FX|6100": "3.3",
    "FX|6120": "3.6",
    "FX|6130": "3.6",
    "FX|6200": "3.8",
    "FX|8100": "2.8",
    "FX|8120": "3.1",
    "FX|8140": "3.2",
    "FX|8150": "3.6",
    "FX|8170": "3.9",
    "FX|4300": "3.8",
    "FX|4320": "4.0",
    "FX|4350": "4.2",
    "FX|6300": "3.5",
    "FX|6350": "3.9",
    "FX|8300": "3.3",
    "FX|8310": "3.4",
    "FX|8320": "3.5",
    "FX|8350": "4.0",
    "FX|8370": "4.0",
    "FX|9370": "4.4",
    "FX|9590": "4.7",
    "FX|8320E": "3.2",
    "FX|8370E": "3.3",
    // ZEN Desktop CPUs
    1200: "3.1",
    "Pro 1200": "3.1",
    "1300X": "3.5",
    "Pro 1300": "3.5",
    1400: "3.2",
    "1500X": "3.5",
    "Pro 1500": "3.5",
    1600: "3.2",
    "1600X": "3.6",
    "Pro 1600": "3.2",
    1700: "3.0",
    "Pro 1700": "3.0",
    "1700X": "3.4",
    "Pro 1700X": "3.4",
    "1800X": "3.6",
    "1900X": "3.8",
    1920: "3.2",
    "1920X": "3.5",
    "1950X": "3.4",
    // ZEN Desktop APUs
    "200GE": "3.2",
    "Pro 200GE": "3.2",
    "220GE": "3.4",
    "240GE": "3.5",
    "3000G": "3.5",
    "300GE": "3.4",
    "3050GE": "3.4",
    "2200G": "3.5",
    "Pro 2200G": "3.5",
    "2200GE": "3.2",
    "Pro 2200GE": "3.2",
    "2400G": "3.6",
    "Pro 2400G": "3.6",
    "2400GE": "3.2",
    "Pro 2400GE": "3.2",
    // ZEN Mobile APUs
    "Pro 200U": "2.3",
    "300U": "2.4",
    "2200U": "2.5",
    "3200U": "2.6",
    "2300U": "2.0",
    "Pro 2300U": "2.0",
    "2500U": "2.0",
    "Pro 2500U": "2.2",
    "2600H": "3.2",
    "2700U": "2.0",
    "Pro 2700U": "2.2",
    "2800H": "3.3",
    // ZEN Server Processors
    7351: "2.4",
    "7351P": "2.4",
    7401: "2.0",
    "7401P": "2.0",
    "7551P": "2.0",
    7551: "2.0",
    7251: "2.1",
    7261: "2.5",
    7281: "2.1",
    7301: "2.2",
    7371: "3.1",
    7451: "2.3",
    7501: "2.0",
    7571: "2.2",
    7601: "2.2",
    // ZEN Embedded Processors
    V1500B: "2.2",
    V1780B: "3.35",
    V1202B: "2.3",
    V1404I: "2.0",
    V1605B: "2.0",
    V1756B: "3.25",
    V1807B: "3.35",
    3101: "2.1",
    3151: "2.7",
    3201: "1.5",
    3251: "2.5",
    3255: "2.5",
    3301: "2.0",
    3351: "1.9",
    3401: "1.85",
    3451: "2.15",
    // ZEN+ Desktop
    "1200|AF": "3.1",
    "2300X": "3.5",
    "2500X": "3.6",
    2600: "3.4",
    "2600E": "3.1",
    "1600|AF": "3.2",
    "2600X": "3.6",
    2700: "3.2",
    "2700E": "2.8",
    "Pro 2700": "3.2",
    "2700X": "3.7",
    "Pro 2700X": "3.6",
    "2920X": "3.5",
    "2950X": "3.5",
    "2970WX": "3.0",
    "2990WX": "3.0",
    // ZEN+ Desktop APU
    "Pro 300GE": "3.4",
    "Pro 3125GE": "3.4",
    "3150G": "3.5",
    "Pro 3150G": "3.5",
    "3150GE": "3.3",
    "Pro 3150GE": "3.3",
    "3200G": "3.6",
    "Pro 3200G": "3.6",
    "3200GE": "3.3",
    "Pro 3200GE": "3.3",
    "3350G": "3.6",
    "Pro 3350G": "3.6",
    "3350GE": "3.3",
    "Pro 3350GE": "3.3",
    "3400G": "3.7",
    "Pro 3400G": "3.7",
    "3400GE": "3.3",
    "Pro 3400GE": "3.3",
    // ZEN+ Mobile
    "3300U": "2.1",
    "PRO 3300U": "2.1",
    "3450U": "2.1",
    "3500U": "2.1",
    "PRO 3500U": "2.1",
    "3500C": "2.1",
    "3550H": "2.1",
    "3580U": "2.1",
    "3700U": "2.3",
    "PRO 3700U": "2.3",
    "3700C": "2.3",
    "3750H": "2.3",
    "3780U": "2.3",
    // ZEN2 Desktop CPUS
    3100: "3.6",
    "3300X": "3.8",
    3500: "3.6",
    "3500X": "3.6",
    3600: "3.6",
    "Pro 3600": "3.6",
    "3600X": "3.8",
    "3600XT": "3.8",
    "Pro 3700": "3.6",
    "3700X": "3.6",
    "3800X": "3.9",
    "3800XT": "3.9",
    3900: "3.1",
    "Pro 3900": "3.1",
    "3900X": "3.8",
    "3900XT": "3.8",
    "3950X": "3.5",
    "3960X": "3.8",
    "3970X": "3.7",
    "3990X": "2.9",
    "3945WX": "4.0",
    "3955WX": "3.9",
    "3975WX": "3.5",
    "3995WX": "2.7",
    // ZEN2 Desktop APUs
    "4300GE": "3.5",
    "Pro 4300GE": "3.5",
    "4300G": "3.8",
    "Pro 4300G": "3.8",
    "4600GE": "3.3",
    "Pro 4650GE": "3.3",
    "4600G": "3.7",
    "Pro 4650G": "3.7",
    "4700GE": "3.1",
    "Pro 4750GE": "3.1",
    "4700G": "3.6",
    "Pro 4750G": "3.6",
    "4300U": "2.7",
    "4450U": "2.5",
    "Pro 4450U": "2.5",
    "4500U": "2.3",
    "4600U": "2.1",
    "PRO 4650U": "2.1",
    "4680U": "2.1",
    "4600HS": "3.0",
    "4600H": "3.0",
    "4700U": "2.0",
    "PRO 4750U": "1.7",
    "4800U": "1.8",
    "4800HS": "2.9",
    "4800H": "2.9",
    "4900HS": "3.0",
    "4900H": "3.3",
    "5300U": "2.6",
    "5500U": "2.1",
    "5700U": "1.8",
    // ZEN2 - EPYC
    "7232P": "3.1",
    "7302P": "3.0",
    "7402P": "2.8",
    "7502P": "2.5",
    "7702P": "2.0",
    7252: "3.1",
    7262: "3.2",
    7272: "2.9",
    7282: "2.8",
    7302: "3.0",
    7352: "2.3",
    7402: "2.8",
    7452: "2.35",
    7502: "2.5",
    7532: "2.4",
    7542: "2.9",
    7552: "2.2",
    7642: "2.3",
    7662: "2.0",
    7702: "2.0",
    7742: "2.25",
    "7H12": "2.6",
    "7F32": "3.7",
    "7F52": "3.5",
    "7F72": "3.2",
    // Epyc (Milan)
    "7773X": "2.2",
    7763: "2.45",
    7713: "2.0",
    "7713P": "2.0",
    7663: "2.0",
    7643: "2.3",
    "7573X": "2.8",
    "75F3": "2.95",
    7543: "2.8",
    "7543P": "2.8",
    7513: "2.6",
    "7473X": "2.8",
    7453: "2.75",
    "74F3": "3.2",
    7443: "2.85",
    "7443P": "2.85",
    7413: "2.65",
    "7373X": "3.05",
    "73F3": "3.5",
    7343: "3.2",
    7313: "3.0",
    "7313P": "3.0",
    "72F3": "3.7",
    // ZEN3
    "5600X": "3.7",
    "5800X": "3.8",
    "5900X": "3.7",
    "5950X": "3.4",
    "5945WX": "4.1",
    "5955WX": "4.0",
    "5965WX": "3.8",
    "5975WX": "3.6",
    "5995WX": "2.7",
    "7960X": "4.2",
    "7970X": "4.0",
    "7980X": "3.2",
    "7965WX": "4.2",
    "7975WX": "4.0",
    "7985WX": "3.2",
    "7995WX": "2.5",
    // ZEN4
    9754: "2.25",
    "9754S": "2.25",
    9734: "2.2",
    "9684X": "2.55",
    "9384X": "3.1",
    "9184X": "3.55",
    "9654P": "2.4",
    9654: "2.4",
    9634: "2.25",
    "9554P": "3.1",
    9554: "3.1",
    9534: "2.45",
    "9474F": "3.6",
    "9454P": "2.75",
    9454: "2.75",
    "9374F": "3.85",
    "9354P": "3.25",
    9354: "3.25",
    9334: "2.7",
    "9274F": "4.05",
    9254: "2.9",
    9224: "2.5",
    "9174F": "4.1",
    9124: "3.0",
    // Epyc 4th gen
    "4124P": "3.8",
    "4244P": "3.8",
    "4344P": "3.8",
    "4364P": "4.5",
    "4464P": "3.7",
    "4484PX": "4.4",
    "4564P": "4.5",
    "4584PX": "4.2",
    "8024P": "2.4",
    "8024PN": "2.05",
    "8124P": "2.45",
    "8124PN": "2.0",
    "8224P": "2.55",
    "8224PN": "2.0",
    "8324P": "2.65",
    "8324PN": "2.05",
    "8434P": "2.5",
    "8434PN": "2.0",
    "8534P": "2.3",
    "8534PN": "2.0",
    // Epyc 5th gen
    9115: "2.6",
    9135: "3.65",
    "9175F": "4.2",
    9255: "3.25",
    "9275F": "4.1",
    9335: "3.0",
    "9355P": "3.55",
    9355: "3.55",
    "9375F": "3.8",
    9365: "3.4",
    "9455P": "3.15",
    9455: "3.15",
    "9475F": "3.65",
    9535: "2.4",
    "9555P": "3.2",
    9555: "3.2",
    "9575F": "3.3",
    9565: "3.15",
    "9655P": "2.5",
    9655: "2.5",
    9755: "2.7",
    "4245P": "3.9",
    "4345P": "3.8",
    "4465P": "3.4",
    "4545P": "3.0",
    "4565P": "4.3",
    "4585PX": "4.3",
    "5900XT": "3.3",
    5900: "3.0",
    5945: "3.0",
    "5800X3D": "3.4",
    "5800XT": "3.8",
    5800: "3.4",
    "5700X3D": "3.0",
    "5700X": "3.4",
    5845: "3.4",
    "5600X3D": "3.3",
    "5600XT": "3.7",
    "5600T": "3.5",
    5600: "3.5",
    "5600F": "3.0",
    5645: "3.7",
    "5500X3D": "3.0",
    "5980HX": "3.3",
    "5980HS": "3.0",
    "5900HX": "3.3",
    "5900HS": "3.0",
    "5800H": "3.2",
    "5800HS": "2.8",
    "5800U": "1.9",
    "5600H": "3.3",
    "5600HS": "3.0",
    "5600U": "2.3",
    "5560U": "2.3",
    "5400U": "2.7",
    "5825U": "2.0",
    "5625U": "2.3",
    "5425U": "2.7",
    "5125C": "3.0",
    "7730U": "2.0",
    "7530U": "2.0",
    "7430U": "2.3",
    "7330U": "2.3",
    7203: "2.8",
    7303: "2.4",
    "7663P": "2.0",
    "6980HX": "3.3",
    "6980HS": "3.3",
    "6900HX": "3.3",
    "6900HS": "3.3",
    "6800H": "3.2",
    "6800HS": "3.2",
    "6800U": "2.7",
    "6600H": "3.3",
    "6600HS": "3.3",
    "6600U": "2.9",
    "7735HS": "3.2",
    "7735H": "3.2",
    "7736U": "2.7",
    "7735U": "2.7",
    "7435HS": "3.1",
    "7435H": "3.1",
    "7535HS": "3.3",
    "7535H": "3.3",
    "7535U": "2.9",
    "7235HS": "3.2",
    "7235H": "3.2",
    "7335U": "3.0",
    270: "4.0",
    260: "3.8",
    250: "3.3",
    240: "4.3",
    230: "3.5",
    220: "3.0",
    210: "2.8",
    "8945HS": "4.0",
    "8845HS": "3.8",
    "8840HS": "3.3",
    "8840U": "3.3",
    "8645HS": "4.3",
    "8640HS": "3.5",
    "8640U": "3.5",
    "8540U": "3.0",
    "8440U": "2.8",
    "9950X3D": "4.3",
    "9950X": "4.3",
    "9900X3D": "4.4",
    "9900X": "4.4",
    "9800X3D": "4.7",
    "9700X": "3.8",
    "9700F": "3.8",
    "9600X": "3.9",
    9600: "3.8",
    "9500F": "3.8",
    "9995WX": "2.5",
    "9985WX": "3.2",
    "9975WX": "4.0",
    "9965WX": "4.2",
    "9955WX": "4.5",
    "9945WX": "4.7",
    "9980X": "3.2",
    "9970X": "4.0",
    "9960X": "4.2",
    "PRO HX375": "2.0",
    HX375: "2.0",
    "PRO HX370": "2.0",
    HX370: "2.0",
    365: "2.0",
    "PRO 360": "2.0",
    350: "2.0",
    "PRO 350": "2.0",
    340: "2.0",
    "PRO 340": "2.0",
    330: "2.0",
    395: "3.0",
    "PRO 395": "3.0",
    390: "3.2",
    "PRO 390": "3.2",
    385: "3.6",
    "PRO 385": "3.6",
    "PRO 380": "3.6",
    "9955HX3D": "2.3",
    "9955HX": "2.5",
    "9850HX": "3.0",
    9015: "3.6",
    9965: "2.25",
    9845: "2.1",
    9825: "2.2",
    9745: "2.4",
    9645: "2.3"
  }, N = {
    1: "Other",
    2: "Unknown",
    3: "Daughter Board",
    4: "ZIF Socket",
    5: "Replacement/Piggy Back",
    6: "None",
    7: "LIF Socket",
    8: "Slot 1",
    9: "Slot 2",
    10: "370 Pin Socket",
    11: "Slot A",
    12: "Slot M",
    13: "423",
    14: "A (Socket 462)",
    15: "478",
    16: "754",
    17: "940",
    18: "939",
    19: "mPGA604",
    20: "LGA771",
    21: "LGA775",
    22: "S1",
    23: "AM2",
    24: "F (1207)",
    25: "LGA1366",
    26: "G34",
    27: "AM3",
    28: "C32",
    29: "LGA1156",
    30: "LGA1567",
    31: "PGA988A",
    32: "BGA1288",
    33: "rPGA988B",
    34: "BGA1023",
    35: "BGA1224",
    36: "LGA1155",
    37: "LGA1356",
    38: "LGA2011",
    39: "FS1",
    40: "FS2",
    41: "FM1",
    42: "FM2",
    43: "LGA2011-3",
    44: "LGA1356-3",
    45: "LGA1150",
    46: "BGA1168",
    47: "BGA1234",
    48: "BGA1364",
    49: "AM4",
    50: "LGA1151",
    51: "BGA1356",
    52: "BGA1440",
    53: "BGA1515",
    54: "LGA3647-1",
    55: "SP3",
    56: "SP3r2",
    57: "LGA2066",
    58: "BGA1392",
    59: "BGA1510",
    60: "BGA1528",
    61: "LGA4189",
    62: "LGA1200",
    63: "LGA4677",
    64: "LGA1700",
    65: "BGA1744",
    66: "BGA1781",
    67: "BGA1211",
    68: "BGA2422",
    69: "LGA1211",
    70: "LGA2422",
    71: "LGA5773",
    72: "BGA5773",
    73: "AM5",
    74: "SP5",
    75: "SP6",
    76: "BGA883",
    77: "BGA1190",
    78: "BGA4129",
    79: "LGA4710",
    80: "LGA7529",
    81: "BGA1964",
    82: "BGA1792",
    83: "BGA2049",
    84: "BGA2551",
    85: "LGA1851",
    86: "BGA2114",
    87: "BGA2833"
  }, p = {
    LGA1150: "i7-5775C i3-4340 i3-4170 G3250 i3-4160T i3-4160 E3-1231 G3258 G3240 i7-4790S i7-4790K i7-4790 i5-4690K i5-4690 i5-4590T i5-4590S i5-4590 i5-4460 i3-4360 i3-4150 G1820 G3420 G3220 i7-4771 i5-4440 i3-4330 i3-4130T i3-4130 E3-1230 i7-4770S i7-4770K i7-4770 i5-4670K i5-4670 i5-4570T i5-4570S i5-4570 i5-4430",
    LGA1151: "i9-9900KS E-2288G E-2224 G5420 i9-9900T i9-9900 i7-9700T i7-9700F i7-9700E i7-9700 i5-9600 i5-9500T i5-9500F i5-9500 i5-9400T i3-9350K i3-9300 i3-9100T i3-9100F i3-9100 G4930 i9-9900KF i7-9700KF i5-9600KF i5-9400F i5-9400 i3-9350KF i9-9900K i7-9700K i5-9600K G5500 G5400 i7-8700T i7-8086K i5-8600 i5-8500T i5-8500 i5-8400T i3-8300 i3-8100T G4900 i7-8700K i7-8700 i5-8600K i5-8400 i3-8350K i3-8100 E3-1270 G4600 G4560 i7-7700T i7-7700K i7-7700 i5-7600K i5-7600 i5-7500T i5-7500 i5-7400 i3-7350K i3-7300 i3-7100T i3-7100 G3930 G3900 G4400 i7-6700T i7-6700K i7-6700 i5-6600K i5-6600 i5-6500T i5-6500 i5-6400T i5-6400 i3-6300 i3-6100T i3-6100 E3-1270 E3-1270 T4500 T4400",
    1155: "G440 G460 G465 G470 G530T G540T G550T G1610T G1620T G530 G540 G1610 G550 G1620 G555 G1630 i3-2100T i3-2120T i3-3220T i3-3240T i3-3250T i3-2100 i3-2105 i3-2102 i3-3210 i3-3220 i3-2125 i3-2120 i3-3225 i3-2130 i3-3245 i3-3240 i3-3250 i5-3570T i5-2500T i5-2400S i5-2405S i5-2390T i5-3330S i5-2500S i5-3335S i5-2300 i5-3450S i5-3340S i5-3470S i5-3475S i5-3470T i5-2310 i5-3550S i5-2320 i5-3330 i5-3350P i5-3450 i5-2400 i5-3340 i5-3570S i5-2380P i5-2450P i5-3470 i5-2500K i5-3550 i5-2500 i5-3570 i5-3570K i5-2550K i7-3770T i7-2600S i7-3770S i7-2600K i7-2600 i7-3770 i7-3770K i7-2700K G620T G630T G640T G2020T G645T G2100T G2030T G622 G860T G620 G632 G2120T G630 G640 G2010 G840 G2020 G850 G645 G2030 G860 G2120 G870 G2130 G2140 E3-1220L E3-1220L E3-1260L E3-1265L E3-1220 E3-1225 E3-1220 E3-1235 E3-1225 E3-1230 E3-1230 E3-1240 E3-1245 E3-1270 E3-1275 E3-1240 E3-1245 E3-1270 E3-1280 E3-1275 E3-1290 E3-1280 E3-1290"
  };
  function h(a) {
    let I = "";
    for (const t in p)
      p[t].split(" ").forEach((D) => {
        a.indexOf(D) >= 0 && (I = t);
      });
    return I;
  }
  function E(a) {
    let I = a;
    return a = a.toLowerCase(), a.indexOf("intel") >= 0 && (I = "Intel"), a.indexOf("amd") >= 0 && (I = "AMD"), a.indexOf("qemu") >= 0 && (I = "QEMU"), a.indexOf("hygon") >= 0 && (I = "Hygon"), a.indexOf("centaur") >= 0 && (I = "WinChip/Via"), a.indexOf("vmware") >= 0 && (I = "VMware"), a.indexOf("Xen") >= 0 && (I = "Xen Hypervisor"), a.indexOf("tcg") >= 0 && (I = "QEMU"), a.indexOf("apple") >= 0 && (I = "Apple"), a.indexOf("sifive") >= 0 && (I = "SiFive"), a.indexOf("thead") >= 0 && (I = "T-Head"), a.indexOf("andestech") >= 0 && (I = "Andes Technology"), I;
  }
  function u(a) {
    a.brand = a.brand.replace(/\(R\)+/g, "®").replace(/\s+/g, " ").trim(), a.brand = a.brand.replace(/\(TM\)+/g, "™").replace(/\s+/g, " ").trim(), a.brand = a.brand.replace(/\(C\)+/g, "©").replace(/\s+/g, " ").trim(), a.brand = a.brand.replace(/CPU+/g, "").replace(/\s+/g, " ").trim(), a.manufacturer = E(a.brand);
    let I = a.brand.split(" ");
    return I.shift(), a.brand = I.join(" "), a;
  }
  function o(a) {
    let I = "0";
    for (let t in b)
      if ({}.hasOwnProperty.call(b, t)) {
        let l = t.split("|"), D = 0;
        l.forEach((f) => {
          a.indexOf(f) > -1 && D++;
        }), D === l.length && (I = b[t]);
      }
    return parseFloat(I);
  }
  function Q() {
    return new Promise((a) => {
      process.nextTick(() => {
        const I = "unknown";
        let t = {
          manufacturer: I,
          brand: I,
          vendor: "",
          family: "",
          model: "",
          stepping: "",
          revision: "",
          voltage: "",
          speed: 0,
          speedMin: 0,
          speedMax: 0,
          governor: "",
          cores: r.cores(),
          physicalCores: r.cores(),
          performanceCores: r.cores(),
          efficiencyCores: 0,
          processors: 1,
          socket: "",
          flags: "",
          virtualization: !1,
          cache: {}
        };
        G().then((l) => {
          if (t.flags = l, t.virtualization = l.indexOf("vmx") > -1 || l.indexOf("svm") > -1, k && e("sysctl machdep.cpu hw.cpufrequency_max hw.cpufrequency_min hw.packages hw.physicalcpu_max hw.ncpu hw.tbfrequency hw.cpufamily hw.cpusubfamily", (D, f) => {
            const w = f.toString().split(`
`), _ = r.getValue(w, "machdep.cpu.brand_string").split("@");
            t.brand = _[0].trim();
            const x = _[1] ? _[1].trim() : "0";
            t.speed = parseFloat(x.replace(/GHz+/g, ""));
            let W = r.getValue(w, "hw.tbfrequency") / 1e9;
            W = W < 0.1 ? W * 100 : W, t.speed = t.speed === 0 ? W : t.speed, X = t.speed, t = u(t), t.speedMin = r.getValue(w, "hw.cpufrequency_min") ? r.getValue(w, "hw.cpufrequency_min") / 1e9 : t.speed, t.speedMax = r.getValue(w, "hw.cpufrequency_max") ? r.getValue(w, "hw.cpufrequency_max") / 1e9 : t.speed, t.vendor = r.getValue(w, "machdep.cpu.vendor") || "Apple", t.family = r.getValue(w, "machdep.cpu.family") || r.getValue(w, "hw.cpufamily"), t.model = r.getValue(w, "machdep.cpu.model"), t.stepping = r.getValue(w, "machdep.cpu.stepping") || r.getValue(w, "hw.cpusubfamily"), t.virtualization = !0;
            const z = r.getValue(w, "hw.packages"), aA = r.getValue(w, "hw.physicalcpu_max"), tA = r.getValue(w, "hw.ncpu");
            if (s.arch() === "arm64") {
              t.socket = "SOC";
              try {
                const M = A("ioreg -c IOPlatformDevice -d 3 -r | grep cluster-type").toString().split(`
`), O = M.filter((y) => y.indexOf('"E"') >= 0).length, v = M.filter((y) => y.indexOf('"P"') >= 0).length;
                t.efficiencyCores = O, t.performanceCores = v;
              } catch {
                r.noop();
              }
            }
            z && (t.processors = parseInt(z, 10) || 1), aA && tA && (t.cores = parseInt(tA) || r.cores(), t.physicalCores = parseInt(aA) || r.cores()), K().then((M) => {
              t.cache = M, a(t);
            });
          }), F) {
            let D = "", f = [];
            s.cpus()[0] && s.cpus()[0].model && (D = s.cpus()[0].model), e('export LC_ALL=C; lscpu; echo -n "Governor: "; cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor 2>/dev/null; echo; unset LC_ALL', (w, Y) => {
              w || (f = Y.toString().split(`
`)), D = r.getValue(f, "model name") || D, D = r.getValue(f, "bios model name") || D, D = r.cleanString(D);
              const _ = D.split("@");
              if (t.brand = _[0].trim(), t.brand.indexOf("Unknown") >= 0 && (t.brand = t.brand.split("Unknown")[0].trim()), t.speed = _[1] ? parseFloat(_[1].trim()) : 0, t.speed === 0 && (t.brand.indexOf("AMD") > -1 || t.brand.toLowerCase().indexOf("ryzen") > -1) && (t.speed = o(t.brand)), t.speed === 0) {
                const O = c();
                O.avg !== 0 && (t.speed = O.avg);
              }
              X = t.speed, t.speedMin = Math.round(parseFloat(r.getValue(f, "cpu min mhz").replace(/,/g, ".")) / 10) / 100, t.speedMax = Math.round(parseFloat(r.getValue(f, "cpu max mhz").replace(/,/g, ".")) / 10) / 100, t = u(t), t.vendor = E(r.getValue(f, "vendor id")), t.family = r.getValue(f, "cpu family"), t.model = r.getValue(f, "model:"), t.stepping = r.getValue(f, "stepping"), t.revision = r.getValue(f, "cpu revision"), t.cache.l1d = r.getValue(f, "l1d cache"), t.cache.l1d && (t.cache.l1d = parseInt(t.cache.l1d) * (t.cache.l1d.indexOf("M") !== -1 ? 1024 * 1024 : t.cache.l1d.indexOf("K") !== -1 ? 1024 : 1)), t.cache.l1i = r.getValue(f, "l1i cache"), t.cache.l1i && (t.cache.l1i = parseInt(t.cache.l1i) * (t.cache.l1i.indexOf("M") !== -1 ? 1024 * 1024 : t.cache.l1i.indexOf("K") !== -1 ? 1024 : 1)), t.cache.l2 = r.getValue(f, "l2 cache"), t.cache.l2 && (t.cache.l2 = parseInt(t.cache.l2) * (t.cache.l2.indexOf("M") !== -1 ? 1024 * 1024 : t.cache.l2.indexOf("K") !== -1 ? 1024 : 1)), t.cache.l3 = r.getValue(f, "l3 cache"), t.cache.l3 && (t.cache.l3 = parseInt(t.cache.l3) * (t.cache.l3.indexOf("M") !== -1 ? 1024 * 1024 : t.cache.l3.indexOf("K") !== -1 ? 1024 : 1));
              const x = r.getValue(f, "thread(s) per core") || "1", W = r.getValue(f, "socket(s)") || "1", z = parseInt(x, 10), aA = parseInt(W, 10) || 1, tA = parseInt(r.getValue(f, "core(s) per socket"), 10);
              if (t.physicalCores = tA ? tA * aA : t.cores / z, t.performanceCores = z > 1 ? t.cores - t.physicalCores : t.cores, t.efficiencyCores = z > 1 ? t.cores - z * t.performanceCores : 0, t.processors = aA, t.governor = r.getValue(f, "governor") || "", t.vendor === "ARM" && r.isRaspberry()) {
                const O = r.decodePiCpuinfo();
                t.family = t.manufacturer, t.manufacturer = O.manufacturer, t.brand = O.processor, t.revision = O.revisionCode, t.socket = "SOC";
              }
              if (r.getValue(f, "architecture") === "riscv64") {
                const O = g.readFileSync("/proc/cpuinfo").toString().split(`
`), v = r.getValue(O, "uarch") || "";
                if (v.indexOf(",") > -1) {
                  const y = v.split(",");
                  t.manufacturer = E(y[0]), t.brand = y[1];
                }
              }
              let M = [];
              e('export LC_ALL=C; dmidecode –t 4 2>/dev/null | grep "Upgrade: Socket"; unset LC_ALL', (O, v) => {
                M = v.toString().split(`
`), M && M.length && (t.socket = r.getValue(M, "Upgrade").replace("Socket", "").trim() || t.socket), a(t);
              });
            });
          }
          if (q || Z || $) {
            let D = "", f = [];
            s.cpus()[0] && s.cpus()[0].model && (D = s.cpus()[0].model), e("export LC_ALL=C; dmidecode -t 4; dmidecode -t 7 unset LC_ALL", (w, Y) => {
              let _ = [];
              if (!w) {
                const tA = Y.toString().split("# dmidecode"), M = tA.length > 1 ? tA[1] : "";
                _ = tA.length > 2 ? tA[2].split("Cache Information") : [], f = M.split(`
`);
              }
              if (t.brand = D.split("@")[0].trim(), t.speed = D.split("@")[1] ? parseFloat(D.split("@")[1].trim()) : 0, t.speed === 0 && (t.brand.indexOf("AMD") > -1 || t.brand.toLowerCase().indexOf("ryzen") > -1) && (t.speed = o(t.brand)), t.speed === 0) {
                const tA = c();
                tA.avg !== 0 && (t.speed = tA.avg);
              }
              X = t.speed, t.speedMin = t.speed, t.speedMax = Math.round(parseFloat(r.getValue(f, "max speed").replace(/Mhz/g, "")) / 10) / 100, t = u(t), t.vendor = E(r.getValue(f, "manufacturer"));
              let x = r.getValue(f, "signature");
              x = x.split(",");
              for (let tA = 0; tA < x.length; tA++)
                x[tA] = x[tA].trim();
              t.family = r.getValue(x, "Family", " ", !0), t.model = r.getValue(x, "Model", " ", !0), t.stepping = r.getValue(x, "Stepping", " ", !0), t.revision = "";
              const W = parseFloat(r.getValue(f, "voltage"));
              t.voltage = isNaN(W) ? "" : W.toFixed(2);
              for (let tA = 0; tA < _.length; tA++) {
                f = _[tA].split(`
`);
                let M = r.getValue(f, "Socket Designation").toLowerCase().replace(" ", "-").split("-");
                M = M.length ? M[0] : "";
                const O = r.getValue(f, "Installed Size").split(" ");
                let v = parseInt(O[0], 10);
                const y = O.length > 1 ? O[1] : "kb";
                v = v * (y === "kb" ? 1024 : y === "mb" ? 1024 * 1024 : y === "gb" ? 1024 * 1024 * 1024 : 1), M && (M === "l1" ? (t.cache[M + "d"] = v / 2, t.cache[M + "i"] = v / 2) : t.cache[M] = v);
              }
              t.socket = r.getValue(f, "Upgrade").replace("Socket", "").trim();
              const z = r.getValue(f, "thread count").trim(), aA = r.getValue(f, "core count").trim();
              aA && z && (t.cores = parseInt(z, 10), t.physicalCores = parseInt(aA, 10)), a(t);
            });
          }
          if (sA && a(t), P)
            try {
              const D = [];
              D.push(
                r.powerShell(
                  "Get-CimInstance Win32_processor | select Name, Revision, L2CacheSize, L3CacheSize, Manufacturer, MaxClockSpeed, Description, UpgradeMethod, Caption, NumberOfLogicalProcessors, NumberOfCores | fl"
                )
              ), D.push(r.powerShell("Get-CimInstance Win32_CacheMemory | select CacheType,InstalledSize,Level | fl")), D.push(r.powerShell("(Get-CimInstance Win32_ComputerSystem).HypervisorPresent")), Promise.all(D).then((f) => {
                let w = f[0].split(`\r
`), Y = r.getValue(w, "name", ":") || "";
                Y.indexOf("@") >= 0 ? (t.brand = Y.split("@")[0].trim(), t.speed = Y.split("@")[1] ? parseFloat(Y.split("@")[1].trim()) : 0, X = t.speed) : (t.brand = Y.trim(), t.speed = 0), t = u(t), t.revision = r.getValue(w, "revision", ":"), t.vendor = r.getValue(w, "manufacturer", ":"), t.speedMax = Math.round(parseFloat(r.getValue(w, "maxclockspeed", ":").replace(/,/g, ".")) / 10) / 100, t.speed === 0 && (t.brand.indexOf("AMD") > -1 || t.brand.toLowerCase().indexOf("ryzen") > -1) && (t.speed = o(t.brand)), t.speed === 0 && (t.speed = t.speedMax), t.speedMin = t.speed;
                let _ = r.getValue(w, "description", ":").split(" ");
                for (let O = 0; O < _.length; O++)
                  _[O].toLowerCase().startsWith("family") && O + 1 < _.length && _[O + 1] && (t.family = _[O + 1]), _[O].toLowerCase().startsWith("model") && O + 1 < _.length && _[O + 1] && (t.model = _[O + 1]), _[O].toLowerCase().startsWith("stepping") && O + 1 < _.length && _[O + 1] && (t.stepping = _[O + 1]);
                const x = r.getValue(w, "UpgradeMethod", ":");
                N[x] && (t.socket = N[x]);
                const W = h(Y);
                W && (t.socket = W);
                const z = r.countLines(w, "Caption"), aA = r.getValue(w, "NumberOfLogicalProcessors", ":"), tA = r.getValue(w, "NumberOfCores", ":");
                z && (t.processors = parseInt(z) || 1), tA && aA && (t.cores = parseInt(aA) || r.cores(), t.physicalCores = parseInt(tA) || r.cores()), z > 1 && (t.cores = t.cores * z, t.physicalCores = t.physicalCores * z), t.cache = gA(f[0], f[1]);
                const M = f[2] ? f[2].toString().toLowerCase() : "";
                t.virtualization = M.indexOf("true") !== -1, a(t);
              });
            } catch {
              a(t);
            }
        });
      });
    });
  }
  function d(a) {
    return new Promise((I) => {
      process.nextTick(() => {
        Q().then((t) => {
          a && a(t), I(t);
        });
      });
    });
  }
  cpu.cpu = d;
  function c() {
    const a = s.cpus();
    let I = 999999999, t = 0, l = 0;
    const D = [], f = [];
    if (a && a.length && Object.prototype.hasOwnProperty.call(a[0], "speed"))
      for (let w in a)
        f.push(a[w].speed > 100 ? (a[w].speed + 1) / 1e3 : a[w].speed / 10);
    else if (F)
      try {
        const w = A('cat /proc/cpuinfo | grep "cpu MHz" | cut -d " " -f 3', r.execOptsLinux).toString().split(`
`).filter((Y) => Y.length > 0);
        for (let Y in w)
          f.push(Math.floor(parseInt(w[Y], 10) / 10) / 100);
      } catch {
        r.noop();
      }
    if (f && f.length)
      try {
        for (const w in f)
          l = l + f[w], f[w] > t && (t = f[w]), f[w] < I && (I = f[w]), D.push(parseFloat(f[w].toFixed(2)));
        return l = l / f.length, {
          min: parseFloat(I.toFixed(2)),
          max: parseFloat(t.toFixed(2)),
          avg: parseFloat(l.toFixed(2)),
          cores: D
        };
      } catch {
        return {
          min: 0,
          max: 0,
          avg: 0,
          cores: D
        };
      }
    else
      return {
        min: 0,
        max: 0,
        avg: 0,
        cores: D
      };
  }
  function n(a) {
    return new Promise((I) => {
      process.nextTick(() => {
        let t = c();
        if (t.avg === 0 && X !== 0) {
          const l = parseFloat(X);
          t = {
            min: l,
            max: l,
            avg: l,
            cores: []
          };
        }
        a && a(t), I(t);
      });
    });
  }
  cpu.cpuCurrentSpeed = n;
  function L(a) {
    return new Promise((I) => {
      process.nextTick(() => {
        let t = {
          main: null,
          cores: [],
          max: null,
          socket: [],
          chipset: null
        };
        if (F) {
          try {
            const f = A('cat /sys/class/thermal/thermal_zone*/type  2>/dev/null; echo "-----"; cat /sys/class/thermal/thermal_zone*/temp 2>/dev/null;', r.execOptsLinux).toString().split(`-----
`);
            if (f.length === 2) {
              const w = f[0].split(`
`), Y = f[1].split(`
`);
              for (let _ = 0; _ < w.length; _++) {
                const x = w[_].trim();
                x.startsWith("acpi") && Y[_] && t.socket.push(Math.round(parseInt(Y[_], 10) / 100) / 10), x.startsWith("pch") && Y[_] && (t.chipset = Math.round(parseInt(Y[_], 10) / 100) / 10);
              }
            }
          } catch {
            r.noop();
          }
          const l = 'for mon in /sys/class/hwmon/hwmon*; do for label in "$mon"/temp*_label; do if [ -f $label ]; then value=${label%_*}_input; echo $(cat "$label")___$(cat "$value"); fi; done; done;';
          try {
            e(l, (D, f) => {
              f = f.toString();
              const w = f.toLowerCase().indexOf("tdie");
              w !== -1 && (f = f.substring(w));
              const Y = f.split(`
`);
              let _ = 0;
              if (Y.forEach((x) => {
                const W = x.split("___"), z = W[0], aA = W.length > 1 && W[1] ? W[1] : "0";
                aA && z && z.toLowerCase() === "tctl" && (_ = t.main = Math.round(parseInt(aA, 10) / 100) / 10), aA && (z === void 0 || z && z.toLowerCase().startsWith("core")) ? t.cores.push(Math.round(parseInt(aA, 10) / 100) / 10) : aA && z && t.main === null && (z.toLowerCase().indexOf("package") >= 0 || z.toLowerCase().indexOf("physical") >= 0 || z.toLowerCase() === "tccd1") && (t.main = Math.round(parseInt(aA, 10) / 100) / 10);
              }), _ && t.main === null && (t.main = _), t.cores.length > 0) {
                t.main === null && (t.main = Math.round(t.cores.reduce((W, z) => W + z, 0) / t.cores.length));
                let x = Math.max.apply(Math, t.cores);
                t.max = x > t.main ? x : t.main;
              }
              if (t.main !== null) {
                t.max === null && (t.max = t.main), a && a(t), I(t);
                return;
              }
              e("sensors", (x, W) => {
                if (!x) {
                  const z = W.toString().split(`
`);
                  let aA = null, tA = !0, M = "";
                  if (z.forEach((O) => {
                    O.trim() === "" ? tA = !0 : tA && (O.trim().toLowerCase().startsWith("acpi") && (M = "acpi"), O.trim().toLowerCase().startsWith("pch") && (M = "pch"), O.trim().toLowerCase().startsWith("core") && (M = "core"), O.trim().toLowerCase().startsWith("k10temp") && (M = "coreAMD"), tA = !1);
                    const v = /[+-]([^°]*)/g, y = O.match(v), AA = O.split(":")[0].toUpperCase();
                    M === "acpi" ? AA.indexOf("TEMP") !== -1 && t.socket.push(parseFloat(y)) : M === "pch" && AA.indexOf("TEMP") !== -1 && !t.chipset && (t.chipset = parseFloat(y)), (AA.indexOf("PHYSICAL") !== -1 || AA.indexOf("PACKAGE") !== -1 || M === "coreAMD" && AA.indexOf("TDIE") !== -1 || AA.indexOf("TEMP") !== -1) && (t.main = parseFloat(y)), AA.indexOf("CORE ") !== -1 && t.cores.push(parseFloat(y)), AA.indexOf("TDIE") !== -1 && aA === null && (aA = parseFloat(y));
                  }), t.cores.length > 0) {
                    t.main = Math.round(t.cores.reduce((v, y) => v + y, 0) / t.cores.length);
                    const O = Math.max.apply(Math, t.cores);
                    t.max = O > t.main ? O : t.main;
                  } else
                    t.main === null && aA !== null && (t.main = aA, t.max = aA);
                  if (t.main !== null && t.max === null && (t.max = t.main), t.main !== null || t.max !== null) {
                    a && a(t), I(t);
                    return;
                  }
                }
                g.stat("/sys/class/thermal/thermal_zone0/temp", (z) => {
                  z === null ? g.readFile("/sys/class/thermal/thermal_zone0/temp", (aA, tA) => {
                    if (!aA) {
                      const M = tA.toString().split(`
`);
                      M.length > 0 && (t.main = parseFloat(M[0]) / 1e3, t.max = t.main);
                    }
                    a && a(t), I(t);
                  }) : e("/opt/vc/bin/vcgencmd measure_temp", (aA, tA) => {
                    if (!aA) {
                      const M = tA.toString().split(`
`);
                      M.length > 0 && M[0].indexOf("=") && (t.main = parseFloat(M[0].split("=")[1]), t.max = t.main);
                    }
                    a && a(t), I(t);
                  });
                });
              });
            });
          } catch {
            a && a(t), I(t);
          }
        }
        if ((q || Z || $) && e("sysctl dev.cpu | grep temp", (l, D) => {
          if (!l) {
            const f = D.toString().split(`
`);
            let w = 0;
            f.forEach((Y) => {
              const _ = Y.split(":");
              if (_.length > 1) {
                const x = parseFloat(_[1].replace(",", "."));
                x > t.max && (t.max = x), w = w + x, t.cores.push(x);
              }
            }), t.cores.length && (t.main = Math.round(w / t.cores.length * 100) / 100);
          }
          a && a(t), I(t);
        }), k) {
          try {
            if (t = require("osx-temperature-sensor").cpuTemperature(), t.main && (t.main = Math.round(t.main * 100) / 100), t.max && (t.max = Math.round(t.max * 100) / 100), t && t.cores && t.cores.length)
              for (let D = 0; D < t.cores.length; D++)
                t.cores[D] = Math.round(t.cores[D] * 100) / 100;
          } catch {
            r.noop();
          }
          try {
            const D = require("macos-temperature-sensor").temperature();
            if (D.cpu && (t.main = Math.round(D.cpu * 100) / 100, t.max = t.main), D.soc && (t.chipset = Math.round(D.soc * 100) / 100), D && D.cpuDieTemps.length)
              for (const f of D.cpuDieTemps)
                t.cores.push(Math.round(f * 100) / 100);
          } catch {
            r.noop();
          }
          a && a(t), I(t);
        }
        if (sA && (a && a(t), I(t)), P)
          try {
            r.powerShell('Get-CimInstance MSAcpi_ThermalZoneTemperature -Namespace "root/wmi" | Select CurrentTemperature').then((l, D) => {
              if (!D) {
                let f = 0;
                l.split(`\r
`).filter((Y) => Y.trim() !== "").filter((Y, _) => _ > 0).forEach((Y) => {
                  const _ = (parseInt(Y, 10) - 2732) / 10;
                  isNaN(_) || (f = f + _, _ > t.max && (t.max = _), t.cores.push(_));
                }), t.cores.length && (t.main = f / t.cores.length);
              }
              a && a(t), I(t);
            });
          } catch {
            a && a(t), I(t);
          }
      });
    });
  }
  cpu.cpuTemperature = L;
  function G(a) {
    return new Promise((I) => {
      process.nextTick(() => {
        let t = "";
        if (P)
          try {
            e('reg query "HKEY_LOCAL_MACHINE\\HARDWARE\\DESCRIPTION\\System\\CentralProcessor\\0" /v FeatureSet', r.execOptsWin, (l, D) => {
              if (!l) {
                let f = D.split("0x").pop().trim(), w = parseInt(f, 16).toString(2), Y = "0".repeat(32 - w.length) + w, _ = [
                  "fpu",
                  "vme",
                  "de",
                  "pse",
                  "tsc",
                  "msr",
                  "pae",
                  "mce",
                  "cx8",
                  "apic",
                  "",
                  "sep",
                  "mtrr",
                  "pge",
                  "mca",
                  "cmov",
                  "pat",
                  "pse-36",
                  "psn",
                  "clfsh",
                  "",
                  "ds",
                  "acpi",
                  "mmx",
                  "fxsr",
                  "sse",
                  "sse2",
                  "ss",
                  "htt",
                  "tm",
                  "ia64",
                  "pbe"
                ];
                for (let x = 0; x < _.length; x++)
                  Y[x] === "1" && _[x] !== "" && (t += " " + _[x]);
                t = t.trim().toLowerCase();
              }
              a && a(t), I(t);
            });
          } catch {
            a && a(t), I(t);
          }
        if (F)
          try {
            e("export LC_ALL=C; lscpu; unset LC_ALL", (l, D) => {
              l || D.toString().split(`
`).forEach((w) => {
                w.split(":")[0].toUpperCase().indexOf("FLAGS") !== -1 && (t = w.split(":")[1].trim().toLowerCase());
              }), t ? (a && a(t), I(t)) : g.readFile("/proc/cpuinfo", (f, w) => {
                if (!f) {
                  let Y = w.toString().split(`
`);
                  t = r.getValue(Y, "features", ":", !0).toLowerCase();
                }
                a && a(t), I(t);
              });
            });
          } catch {
            a && a(t), I(t);
          }
        (q || Z || $) && e("export LC_ALL=C; dmidecode -t 4 2>/dev/null; unset LC_ALL", (l, D) => {
          const f = [];
          if (!l) {
            const w = D.toString().split("	Flags:");
            (w.length > 1 ? w[1].split("	Version:")[0].split(`
`) : []).forEach((_) => {
              const x = (_.indexOf("(") ? _.split("(")[0].toLowerCase() : "").trim().replace(/\t/g, "");
              x && f.push(x);
            });
          }
          t = f.join(" ").trim().toLowerCase(), a && a(t), I(t);
        }), k && e("sysctl machdep.cpu.features", (l, D) => {
          if (!l) {
            let f = D.toString().split(`
`);
            f.length > 0 && f[0].indexOf("machdep.cpu.features:") !== -1 && (t = f[0].split(":")[1].trim().toLowerCase());
          }
          a && a(t), I(t);
        }), sA && (a && a(t), I(t));
      });
    });
  }
  cpu.cpuFlags = G;
  function K(a) {
    return new Promise((I) => {
      process.nextTick(() => {
        let t = {
          l1d: null,
          l1i: null,
          l2: null,
          l3: null
        };
        if (F)
          try {
            e("export LC_ALL=C; lscpu; unset LC_ALL", (l, D) => {
              l || D.toString().split(`
`).forEach((w) => {
                const Y = w.split(":");
                Y[0].toUpperCase().indexOf("L1D CACHE") !== -1 && (t.l1d = parseInt(Y[1].trim()) * (Y[1].indexOf("M") !== -1 ? 1024 * 1024 : Y[1].indexOf("K") !== -1 ? 1024 : 1)), Y[0].toUpperCase().indexOf("L1I CACHE") !== -1 && (t.l1i = parseInt(Y[1].trim()) * (Y[1].indexOf("M") !== -1 ? 1024 * 1024 : Y[1].indexOf("K") !== -1 ? 1024 : 1)), Y[0].toUpperCase().indexOf("L2 CACHE") !== -1 && (t.l2 = parseInt(Y[1].trim()) * (Y[1].indexOf("M") !== -1 ? 1024 * 1024 : Y[1].indexOf("K") !== -1 ? 1024 : 1)), Y[0].toUpperCase().indexOf("L3 CACHE") !== -1 && (t.l3 = parseInt(Y[1].trim()) * (Y[1].indexOf("M") !== -1 ? 1024 * 1024 : Y[1].indexOf("K") !== -1 ? 1024 : 1));
              }), a && a(t), I(t);
            });
          } catch {
            a && a(t), I(t);
          }
        if ((q || Z || $) && e("export LC_ALL=C; dmidecode -t 7 2>/dev/null; unset LC_ALL", (l, D) => {
          let f = [];
          l || (f = D.toString().split("Cache Information"), f.shift());
          for (let w = 0; w < f.length; w++) {
            const Y = f[w].split(`
`);
            let _ = r.getValue(Y, "Socket Designation").toLowerCase().replace(" ", "-").split("-");
            _ = _.length ? _[0] : "";
            const x = r.getValue(Y, "Installed Size").split(" ");
            let W = parseInt(x[0], 10);
            const z = x.length > 1 ? x[1] : "kb";
            W = W * (z === "kb" ? 1024 : z === "mb" ? 1024 * 1024 : z === "gb" ? 1024 * 1024 * 1024 : 1), _ && (_ === "l1" ? (t.cache[_ + "d"] = W / 2, t.cache[_ + "i"] = W / 2) : t.cache[_] = W);
          }
          a && a(t), I(t);
        }), k && e("sysctl hw.l1icachesize hw.l1dcachesize hw.l2cachesize hw.l3cachesize", (l, D) => {
          l || D.toString().split(`
`).forEach((w) => {
            let Y = w.split(":");
            Y[0].toLowerCase().indexOf("hw.l1icachesize") !== -1 && (t.l1d = parseInt(Y[1].trim()) * (Y[1].indexOf("K") !== -1 ? 1024 : 1)), Y[0].toLowerCase().indexOf("hw.l1dcachesize") !== -1 && (t.l1i = parseInt(Y[1].trim()) * (Y[1].indexOf("K") !== -1 ? 1024 : 1)), Y[0].toLowerCase().indexOf("hw.l2cachesize") !== -1 && (t.l2 = parseInt(Y[1].trim()) * (Y[1].indexOf("K") !== -1 ? 1024 : 1)), Y[0].toLowerCase().indexOf("hw.l3cachesize") !== -1 && (t.l3 = parseInt(Y[1].trim()) * (Y[1].indexOf("K") !== -1 ? 1024 : 1));
          }), a && a(t), I(t);
        }), sA && (a && a(t), I(t)), P)
          try {
            const l = [];
            l.push(r.powerShell("Get-CimInstance Win32_processor | select L2CacheSize, L3CacheSize | fl")), l.push(r.powerShell("Get-CimInstance Win32_CacheMemory | select CacheType,InstalledSize,Level | fl")), Promise.all(l).then((D) => {
              t = gA(D[0], D[1]), a && a(t), I(t);
            });
          } catch {
            a && a(t), I(t);
          }
      });
    });
  }
  function gA(a, I) {
    const t = {
      l1d: null,
      l1i: null,
      l2: null,
      l3: null
    };
    let l = a.split(`\r
`);
    t.l1d = 0, t.l1i = 0, t.l2 = r.getValue(l, "l2cachesize", ":"), t.l3 = r.getValue(l, "l3cachesize", ":"), t.l2 ? t.l2 = parseInt(t.l2, 10) * 1024 : t.l2 = 0, t.l3 ? t.l3 = parseInt(t.l3, 10) * 1024 : t.l3 = 0;
    const D = I.split(/\n\s*\n/);
    let f = 0, w = 0, Y = 0;
    return D.forEach((_) => {
      const x = _.split(`\r
`), W = r.getValue(x, "CacheType"), z = r.getValue(x, "Level"), aA = r.getValue(x, "InstalledSize");
      z === "3" && W === "3" && (t.l1i = t.l1i + parseInt(aA, 10) * 1024), z === "3" && W === "4" && (t.l1d = t.l1d + parseInt(aA, 10) * 1024), z === "3" && W === "5" && (f = parseInt(aA, 10) / 2, w = parseInt(aA, 10) / 2), z === "4" && W === "5" && (Y = Y + parseInt(aA, 10) * 1024);
    }), !t.l1i && !t.l1d && (t.l1i = f, t.l1d = w), Y && (t.l2 = Y), t;
  }
  cpu.cpuCache = K;
  function H() {
    return new Promise((a) => {
      process.nextTick(() => {
        const I = s.loadavg().map((f) => f / r.cores()), t = parseFloat(Math.max.apply(Math, I).toFixed(2));
        let l = {};
        if (Date.now() - S.ms >= 200) {
          S.ms = Date.now();
          const f = s.cpus().map((y) => (y.times.steal = 0, y.times.guest = 0, y));
          let w = 0, Y = 0, _ = 0, x = 0, W = 0, z = 0, aA = 0;
          const tA = [];
          if (eA = f && f.length ? f.length : 0, F)
            try {
              const y = A("cat /proc/stat 2>/dev/null | grep cpu", r.execOptsLinux).toString().split(`
`);
              if (y.length > 1 && (y.shift(), y.length === f.length))
                for (let AA = 0; AA < y.length; AA++) {
                  let oA = y[AA].split(" ");
                  if (oA.length >= 10) {
                    const rA = parseFloat(oA[8]) || 0, cA = parseFloat(oA[9]) || 0;
                    f[AA].times.steal = rA, f[AA].times.guest = cA;
                  }
                }
            } catch {
              r.noop();
            }
          for (let y = 0; y < eA; y++) {
            const AA = f[y].times;
            w += AA.user, Y += AA.sys, _ += AA.nice, W += AA.idle, x += AA.irq, z += AA.steal || 0, aA += AA.guest || 0;
            const oA = J && J[y] && J[y].totalTick ? J[y].totalTick : 0, rA = J && J[y] && J[y].totalLoad ? J[y].totalLoad : 0, cA = J && J[y] && J[y].user ? J[y].user : 0, lA = J && J[y] && J[y].sys ? J[y].sys : 0, pA = J && J[y] && J[y].nice ? J[y].nice : 0, BA = J && J[y] && J[y].idle ? J[y].idle : 0, uA = J && J[y] && J[y].irq ? J[y].irq : 0, hA = J && J[y] && J[y].steal ? J[y].steal : 0, fA = J && J[y] && J[y].guest ? J[y].guest : 0;
            J[y] = AA, J[y].totalTick = J[y].user + J[y].sys + J[y].nice + J[y].irq + J[y].steal + J[y].guest + J[y].idle, J[y].totalLoad = J[y].user + J[y].sys + J[y].nice + J[y].irq + J[y].steal + J[y].guest, J[y].currentTick = J[y].totalTick - oA, J[y].load = J[y].totalLoad - rA, J[y].loadUser = J[y].user - cA, J[y].loadSystem = J[y].sys - lA, J[y].loadNice = J[y].nice - pA, J[y].loadIdle = J[y].idle - BA, J[y].loadIrq = J[y].irq - uA, J[y].loadSteal = J[y].steal - hA, J[y].loadGuest = J[y].guest - fA, tA[y] = {}, tA[y].load = J[y].load / J[y].currentTick * 100, tA[y].loadUser = J[y].loadUser / J[y].currentTick * 100, tA[y].loadSystem = J[y].loadSystem / J[y].currentTick * 100, tA[y].loadNice = J[y].loadNice / J[y].currentTick * 100, tA[y].loadIdle = J[y].loadIdle / J[y].currentTick * 100, tA[y].loadIrq = J[y].loadIrq / J[y].currentTick * 100, tA[y].loadSteal = J[y].loadSteal / J[y].currentTick * 100, tA[y].loadGuest = J[y].loadGuest / J[y].currentTick * 100, tA[y].rawLoad = J[y].load, tA[y].rawLoadUser = J[y].loadUser, tA[y].rawLoadSystem = J[y].loadSystem, tA[y].rawLoadNice = J[y].loadNice, tA[y].rawLoadIdle = J[y].loadIdle, tA[y].rawLoadIrq = J[y].loadIrq, tA[y].rawLoadSteal = J[y].loadSteal, tA[y].rawLoadGuest = J[y].loadGuest;
          }
          const M = w + Y + _ + x + z + aA + W, O = w + Y + _ + x + z + aA, v = M - S.tick;
          l = {
            avgLoad: t,
            currentLoad: (O - S.load) / v * 100,
            currentLoadUser: (w - S.user) / v * 100,
            currentLoadSystem: (Y - S.system) / v * 100,
            currentLoadNice: (_ - S.nice) / v * 100,
            currentLoadIdle: (W - S.idle) / v * 100,
            currentLoadIrq: (x - S.irq) / v * 100,
            currentLoadSteal: (z - S.steal) / v * 100,
            currentLoadGuest: (aA - S.guest) / v * 100,
            rawCurrentLoad: O - S.load,
            rawCurrentLoadUser: w - S.user,
            rawCurrentLoadSystem: Y - S.system,
            rawCurrentLoadNice: _ - S.nice,
            rawCurrentLoadIdle: W - S.idle,
            rawCurrentLoadIrq: x - S.irq,
            rawCurrentLoadSteal: z - S.steal,
            rawCurrentLoadGuest: aA - S.guest,
            cpus: tA
          }, S = {
            user: w,
            nice: _,
            system: Y,
            idle: W,
            irq: x,
            steal: z,
            guest: aA,
            tick: M,
            load: O,
            ms: S.ms,
            currentLoad: l.currentLoad,
            currentLoadUser: l.currentLoadUser,
            currentLoadSystem: l.currentLoadSystem,
            currentLoadNice: l.currentLoadNice,
            currentLoadIdle: l.currentLoadIdle,
            currentLoadIrq: l.currentLoadIrq,
            currentLoadSteal: l.currentLoadSteal,
            currentLoadGuest: l.currentLoadGuest,
            rawCurrentLoad: l.rawCurrentLoad,
            rawCurrentLoadUser: l.rawCurrentLoadUser,
            rawCurrentLoadSystem: l.rawCurrentLoadSystem,
            rawCurrentLoadNice: l.rawCurrentLoadNice,
            rawCurrentLoadIdle: l.rawCurrentLoadIdle,
            rawCurrentLoadIrq: l.rawCurrentLoadIrq,
            rawCurrentLoadSteal: l.rawCurrentLoadSteal,
            rawCurrentLoadGuest: l.rawCurrentLoadGuest
          };
        } else {
          const f = [];
          for (let w = 0; w < eA; w++)
            f[w] = {}, f[w].load = J[w].load / J[w].currentTick * 100, f[w].loadUser = J[w].loadUser / J[w].currentTick * 100, f[w].loadSystem = J[w].loadSystem / J[w].currentTick * 100, f[w].loadNice = J[w].loadNice / J[w].currentTick * 100, f[w].loadIdle = J[w].loadIdle / J[w].currentTick * 100, f[w].loadIrq = J[w].loadIrq / J[w].currentTick * 100, f[w].rawLoad = J[w].load, f[w].rawLoadUser = J[w].loadUser, f[w].rawLoadSystem = J[w].loadSystem, f[w].rawLoadNice = J[w].loadNice, f[w].rawLoadIdle = J[w].loadIdle, f[w].rawLoadIrq = J[w].loadIrq, f[w].rawLoadSteal = J[w].loadSteal, f[w].rawLoadGuest = J[w].loadGuest;
          l = {
            avgLoad: t,
            currentLoad: S.currentLoad,
            currentLoadUser: S.currentLoadUser,
            currentLoadSystem: S.currentLoadSystem,
            currentLoadNice: S.currentLoadNice,
            currentLoadIdle: S.currentLoadIdle,
            currentLoadIrq: S.currentLoadIrq,
            currentLoadSteal: S.currentLoadSteal,
            currentLoadGuest: S.currentLoadGuest,
            rawCurrentLoad: S.rawCurrentLoad,
            rawCurrentLoadUser: S.rawCurrentLoadUser,
            rawCurrentLoadSystem: S.rawCurrentLoadSystem,
            rawCurrentLoadNice: S.rawCurrentLoadNice,
            rawCurrentLoadIdle: S.rawCurrentLoadIdle,
            rawCurrentLoadIrq: S.rawCurrentLoadIrq,
            rawCurrentLoadSteal: S.rawCurrentLoadSteal,
            rawCurrentLoadGuest: S.rawCurrentLoadGuest,
            cpus: f
          };
        }
        a(l);
      });
    });
  }
  function U(a) {
    return new Promise((I) => {
      process.nextTick(() => {
        H().then((t) => {
          a && a(t), I(t);
        });
      });
    });
  }
  cpu.currentLoad = U;
  function V() {
    return new Promise((a) => {
      process.nextTick(() => {
        const I = s.cpus();
        let t = 0, l = 0, D = 0, f = 0, w = 0, Y = 0;
        if (I && I.length) {
          for (let x = 0, W = I.length; x < W; x++) {
            const z = I[x].times;
            t += z.user, l += z.sys, D += z.nice, f += z.irq, w += z.idle;
          }
          const _ = w + f + D + l + t;
          Y = (_ - w) / _ * 100;
        }
        a(Y);
      });
    });
  }
  function m(a) {
    return new Promise((I) => {
      process.nextTick(() => {
        V().then((t) => {
          a && a(t), I(t);
        });
      });
    });
  }
  return cpu.fullLoad = m, cpu;
}
var memory = {}, hasRequiredMemory;
function requireMemory() {
  if (hasRequiredMemory) return memory;
  hasRequiredMemory = 1;
  const s = require$$0$1, e = require$$1.exec, A = require$$1.execSync, g = requireUtil(), r = require$$1$1;
  let B = process.platform;
  const F = B === "linux" || B === "android", k = B === "darwin", P = B === "win32", q = B === "freebsd", Z = B === "openbsd", $ = B === "netbsd", sA = B === "sunos", X = {
    "00CE": "Samsung Electronics Inc",
    "014F": "Transcend Information Inc.",
    "017A": "Apacer Technology Inc.",
    "0198": "HyperX",
    "029E": "Corsair",
    "02FE": "Elpida",
    "04CB": "A-DATA",
    "04CD": "G.Skill International Enterprise",
    "059B": "Crucial",
    1315: "Crucial",
    "2C00": "Micron Technology Inc.",
    5105: "Qimonda AG i. In.",
    "802C": "Micron Technology Inc.",
    "80AD": "Hynix Semiconductor Inc.",
    "80CE": "Samsung Electronics Inc.",
    8551: "Qimonda AG i. In.",
    "859B": "Crucial",
    AD00: "Hynix Semiconductor Inc.",
    CE00: "Samsung Electronics Inc.",
    SAMSUNG: "Samsung Electronics Inc.",
    HYNIX: "Hynix Semiconductor Inc.",
    "G-SKILL": "G-Skill International Enterprise",
    "G.SKILL": "G-Skill International Enterprise",
    TRANSCEND: "Transcend Information",
    APACER: "Apacer Technology Inc",
    MICRON: "Micron Technology Inc.",
    QIMONDA: "Qimonda AG i. In."
  };
  function S(eA) {
    return new Promise((b) => {
      process.nextTick(() => {
        let N = {
          total: s.totalmem(),
          free: s.freemem(),
          used: s.totalmem() - s.freemem(),
          active: s.totalmem() - s.freemem(),
          // temporarily (fallback)
          available: s.freemem(),
          // temporarily (fallback)
          buffers: 0,
          cached: 0,
          slab: 0,
          buffcache: 0,
          reclaimable: 0,
          swaptotal: 0,
          swapused: 0,
          swapfree: 0,
          writeback: null,
          dirty: null
        };
        if (F)
          try {
            r.readFile("/proc/meminfo", (p, h) => {
              if (!p) {
                const E = h.toString().split(`
`);
                N.total = parseInt(g.getValue(E, "memtotal"), 10), N.total = N.total ? N.total * 1024 : s.totalmem(), N.free = parseInt(g.getValue(E, "memfree"), 10), N.free = N.free ? N.free * 1024 : s.freemem(), N.used = N.total - N.free, N.buffers = parseInt(g.getValue(E, "buffers"), 10), N.buffers = N.buffers ? N.buffers * 1024 : 0, N.cached = parseInt(g.getValue(E, "cached"), 10), N.cached = N.cached ? N.cached * 1024 : 0, N.slab = parseInt(g.getValue(E, "slab"), 10), N.slab = N.slab ? N.slab * 1024 : 0, N.buffcache = N.buffers + N.cached + N.slab;
                let u = parseInt(g.getValue(E, "memavailable"), 10);
                N.available = u ? u * 1024 : N.free + N.buffcache, N.active = N.total - N.available, N.swaptotal = parseInt(g.getValue(E, "swaptotal"), 10), N.swaptotal = N.swaptotal ? N.swaptotal * 1024 : 0, N.swapfree = parseInt(g.getValue(E, "swapfree"), 10), N.swapfree = N.swapfree ? N.swapfree * 1024 : 0, N.swapused = N.swaptotal - N.swapfree, N.writeback = parseInt(g.getValue(E, "writeback"), 10), N.writeback = N.writeback ? N.writeback * 1024 : 0, N.dirty = parseInt(g.getValue(E, "dirty"), 10), N.dirty = N.dirty ? N.dirty * 1024 : 0, N.reclaimable = parseInt(g.getValue(E, "sreclaimable"), 10), N.reclaimable = N.reclaimable ? N.reclaimable * 1024 : 0;
              }
              eA && eA(N), b(N);
            });
          } catch {
            eA && eA(N), b(N);
          }
        if (q || Z || $)
          try {
            e(
              "/sbin/sysctl hw.realmem hw.physmem vm.stats.vm.v_page_count vm.stats.vm.v_wire_count vm.stats.vm.v_active_count vm.stats.vm.v_inactive_count vm.stats.vm.v_cache_count vm.stats.vm.v_free_count vm.stats.vm.v_page_size",
              (p, h) => {
                if (!p) {
                  const E = h.toString().split(`
`), u = parseInt(g.getValue(E, "vm.stats.vm.v_page_size"), 10), o = parseInt(g.getValue(E, "vm.stats.vm.v_inactive_count"), 10) * u, Q = parseInt(g.getValue(E, "vm.stats.vm.v_cache_count"), 10) * u;
                  N.total = parseInt(g.getValue(E, "hw.realmem"), 10), isNaN(N.total) && (N.total = parseInt(g.getValue(E, "hw.physmem"), 10)), N.free = parseInt(g.getValue(E, "vm.stats.vm.v_free_count"), 10) * u, N.buffcache = o + Q, N.available = N.buffcache + N.free, N.active = N.total - N.free - N.buffcache, N.swaptotal = 0, N.swapfree = 0, N.swapused = 0;
                }
                eA && eA(N), b(N);
              }
            );
          } catch {
            eA && eA(N), b(N);
          }
        if (sA && (eA && eA(N), b(N)), k) {
          let p = 4096;
          try {
            p = g.toInt(A("sysctl -n vm.pagesize").toString()) || p;
          } catch {
            g.noop();
          }
          try {
            e('vm_stat 2>/dev/null | egrep "Pages active|Pages inactive"', (h, E) => {
              if (!h) {
                let u = E.toString().split(`
`);
                N.active = (parseInt(g.getValue(u, "Pages active"), 10) || 0) * p, N.reclaimable = (parseInt(g.getValue(u, "Pages inactive"), 10) || 0) * p, N.buffcache = N.used - N.active, N.available = N.free + N.buffcache;
              }
              e("sysctl -n vm.swapusage 2>/dev/null", (u, o) => {
                if (!u) {
                  let Q = o.toString().split(`
`);
                  Q.length > 0 && Q[0].replace(/,/g, ".").replace(/M/g, "").trim().split("  ").forEach((n) => {
                    n.toLowerCase().indexOf("total") !== -1 && (N.swaptotal = parseFloat(n.split("=")[1].trim()) * 1024 * 1024), n.toLowerCase().indexOf("used") !== -1 && (N.swapused = parseFloat(n.split("=")[1].trim()) * 1024 * 1024), n.toLowerCase().indexOf("free") !== -1 && (N.swapfree = parseFloat(n.split("=")[1].trim()) * 1024 * 1024);
                  });
                }
                eA && eA(N), b(N);
              });
            });
          } catch {
            eA && eA(N), b(N);
          }
        }
        if (P) {
          let p = 0, h = 0;
          try {
            g.powerShell("Get-CimInstance Win32_PageFileUsage | Select AllocatedBaseSize, CurrentUsage").then((E, u) => {
              u || E.split(`\r
`).filter((Q) => Q.trim() !== "").filter((Q, d) => d > 0).forEach((Q) => {
                Q !== "" && (Q = Q.trim().split(/\s\s+/), p = p + (parseInt(Q[0], 10) || 0), h = h + (parseInt(Q[1], 10) || 0));
              }), N.swaptotal = p * 1024 * 1024, N.swapused = h * 1024 * 1024, N.swapfree = N.swaptotal - N.swapused, eA && eA(N), b(N);
            });
          } catch {
            eA && eA(N), b(N);
          }
        }
      });
    });
  }
  memory.mem = S;
  function J(eA) {
    function b(N) {
      const p = N.replace("0x", "").toUpperCase();
      return p.length >= 4 && {}.hasOwnProperty.call(X, p) ? X[p] : N;
    }
    return new Promise((N) => {
      process.nextTick(() => {
        let p = [];
        if ((F || q || Z || $) && e(
          'export LC_ALL=C; dmidecode -t memory 2>/dev/null | grep -iE "Size:|Type|Speed|Manufacturer|Form Factor|Locator|Memory Device|Serial Number|Voltage|Part Number"; unset LC_ALL',
          (h, E) => {
            if (!h) {
              const u = E.toString().split("Memory Device");
              u.shift(), u.forEach((o) => {
                const Q = o.split(`
`), d = g.getValue(Q, "Size"), c = d.indexOf("GB") >= 0 ? parseInt(d, 10) * 1024 * 1024 * 1024 : parseInt(d, 10) * 1024 * 1024;
                let n = g.getValue(Q, "Bank Locator");
                if (n.toLowerCase().indexOf("bad") >= 0 && (n = ""), parseInt(g.getValue(Q, "Size"), 10) > 0) {
                  const L = g.toInt(g.getValue(Q, "Total Width")), G = g.toInt(g.getValue(Q, "Data Width"));
                  p.push({
                    size: c,
                    bank: n,
                    type: g.getValue(Q, "Type:"),
                    ecc: G && L ? L > G : !1,
                    clockSpeed: g.getValue(Q, "Configured Clock Speed:") ? parseInt(g.getValue(Q, "Configured Clock Speed:"), 10) : g.getValue(Q, "Speed:") ? parseInt(g.getValue(Q, "Speed:"), 10) : null,
                    formFactor: g.getValue(Q, "Form Factor:"),
                    manufacturer: b(g.getValue(Q, "Manufacturer:")),
                    partNum: g.getValue(Q, "Part Number:"),
                    serialNum: g.getValue(Q, "Serial Number:"),
                    voltageConfigured: parseFloat(g.getValue(Q, "Configured Voltage:")) || null,
                    voltageMin: parseFloat(g.getValue(Q, "Minimum Voltage:")) || null,
                    voltageMax: parseFloat(g.getValue(Q, "Maximum Voltage:")) || null
                  });
                } else
                  p.push({
                    size: 0,
                    bank: n,
                    type: "Empty",
                    ecc: null,
                    clockSpeed: 0,
                    formFactor: g.getValue(Q, "Form Factor:"),
                    partNum: "",
                    serialNum: "",
                    voltageConfigured: null,
                    voltageMin: null,
                    voltageMax: null
                  });
              });
            }
            if (!p.length) {
              p.push({
                size: s.totalmem(),
                bank: "",
                type: "",
                ecc: null,
                clockSpeed: 0,
                formFactor: "",
                partNum: "",
                serialNum: "",
                voltageConfigured: null,
                voltageMin: null,
                voltageMax: null
              });
              try {
                let u = A("cat /proc/cpuinfo 2>/dev/null", g.execOptsLinux), o = u.toString().split(`
`), Q = g.getValue(o, "revision", ":", !0).toLowerCase();
                if (g.isRaspberry(o)) {
                  const d = {
                    0: 400,
                    1: 450,
                    2: 450,
                    3: 3200,
                    4: 4267
                  };
                  p[0].type = "LPDDR2", p[0].type = Q && Q[2] && Q[2] === "3" ? "LPDDR4" : p[0].type, p[0].type = Q && Q[2] && Q[2] === "4" ? "LPDDR4X" : p[0].type, p[0].ecc = !1, p[0].clockSpeed = Q && Q[2] && d[Q[2]] || 400, p[0].clockSpeed = Q && Q[4] && Q[4] === "d" ? 500 : p[0].clockSpeed, p[0].formFactor = "SoC", u = A("vcgencmd get_config sdram_freq 2>/dev/null", g.execOptsLinux), o = u.toString().split(`
`);
                  let c = parseInt(g.getValue(o, "sdram_freq", "=", !0), 10) || 0;
                  c && (p[0].clockSpeed = c), u = A("vcgencmd measure_volts sdram_p 2>/dev/null", g.execOptsLinux), o = u.toString().split(`
`);
                  let n = parseFloat(g.getValue(o, "volt", "=", !0)) || 0;
                  n && (p[0].voltageConfigured = n, p[0].voltageMin = n, p[0].voltageMax = n);
                }
              } catch {
                g.noop();
              }
            }
            eA && eA(p), N(p);
          }
        ), k && e("system_profiler SPMemoryDataType", (h, E) => {
          if (!h) {
            const u = E.toString().split(`
`), o = g.getValue(u, "ecc", ":", !0).toLowerCase();
            let Q = E.toString().split("        BANK "), d = !0;
            Q.length === 1 && (Q = E.toString().split("        DIMM"), d = !1), Q.shift(), Q.forEach((c) => {
              const n = c.split(`
`), L = (d ? "BANK " : "DIMM") + n[0].trim().split("/")[0], G = parseInt(g.getValue(n, "          Size"));
              G ? p.push({
                size: G * 1024 * 1024 * 1024,
                bank: L,
                type: g.getValue(n, "          Type:"),
                ecc: o ? o === "enabled" : null,
                clockSpeed: parseInt(g.getValue(n, "          Speed:"), 10),
                formFactor: "",
                manufacturer: b(g.getValue(n, "          Manufacturer:")),
                partNum: g.getValue(n, "          Part Number:"),
                serialNum: g.getValue(n, "          Serial Number:"),
                voltageConfigured: null,
                voltageMin: null,
                voltageMax: null
              }) : p.push({
                size: 0,
                bank: L,
                type: "Empty",
                ecc: null,
                clockSpeed: 0,
                formFactor: "",
                manufacturer: "",
                partNum: "",
                serialNum: "",
                voltageConfigured: null,
                voltageMin: null,
                voltageMax: null
              });
            });
          }
          if (!p.length) {
            const u = E.toString().split(`
`), o = parseInt(g.getValue(u, "      Memory:")), Q = g.getValue(u, "      Type:"), d = g.getValue(u, "      Manufacturer:");
            o && Q && p.push({
              size: o * 1024 * 1024 * 1024,
              bank: "0",
              type: Q,
              ecc: !1,
              clockSpeed: null,
              formFactor: "SOC",
              manufacturer: b(d),
              partNum: "",
              serialNum: "",
              voltageConfigured: null,
              voltageMin: null,
              voltageMax: null
            });
          }
          eA && eA(p), N(p);
        }), sA && (eA && eA(p), N(p)), P) {
          const h = "Unknown|Other|DRAM|Synchronous DRAM|Cache DRAM|EDO|EDRAM|VRAM|SRAM|RAM|ROM|FLASH|EEPROM|FEPROM|EPROM|CDRAM|3DRAM|SDRAM|SGRAM|RDRAM|DDR|DDR2|DDR2 FB-DIMM|Reserved|DDR3|FBD2|DDR4|LPDDR|LPDDR2|LPDDR3|LPDDR4|Logical non-volatile device|HBM|HBM2|DDR5|LPDDR5".split(
            "|"
          ), E = "Unknown|Other|SIP|DIP|ZIP|SOJ|Proprietary|SIMM|DIMM|TSOP|PGA|RIMM|SODIMM|SRIMM|SMD|SSMP|QFP|TQFP|SOIC|LCC|PLCC|BGA|FPBGA|LGA".split("|");
          try {
            g.powerShell(
              "Get-CimInstance Win32_PhysicalMemory | select DataWidth,TotalWidth,Capacity,BankLabel,MemoryType,SMBIOSMemoryType,ConfiguredClockSpeed,Speed,FormFactor,Manufacturer,PartNumber,SerialNumber,ConfiguredVoltage,MinVoltage,MaxVoltage,Tag | fl"
            ).then((u, o) => {
              if (!o) {
                const Q = u.toString().split(/\n\s*\n/);
                Q.shift(), Q.forEach((d) => {
                  const c = d.split(`\r
`), n = g.toInt(g.getValue(c, "DataWidth", ":")), L = g.toInt(g.getValue(c, "TotalWidth", ":")), G = parseInt(g.getValue(c, "Capacity", ":"), 10) || 0, K = g.getValue(c, "Tag", ":"), gA = g.splitByNumber(K);
                  G && p.push({
                    size: G,
                    bank: g.getValue(c, "BankLabel", ":") + (gA[1] ? "/" + gA[1] : ""),
                    // BankLabel
                    type: h[parseInt(g.getValue(c, "MemoryType", ":"), 10) || parseInt(g.getValue(c, "SMBIOSMemoryType", ":"), 10)],
                    ecc: n && L ? L > n : !1,
                    clockSpeed: parseInt(g.getValue(c, "ConfiguredClockSpeed", ":"), 10) || parseInt(g.getValue(c, "Speed", ":"), 10) || 0,
                    formFactor: E[parseInt(g.getValue(c, "FormFactor", ":"), 10) || 0],
                    manufacturer: b(g.getValue(c, "Manufacturer", ":")),
                    partNum: g.getValue(c, "PartNumber", ":"),
                    serialNum: g.getValue(c, "SerialNumber", ":"),
                    voltageConfigured: (parseInt(g.getValue(c, "ConfiguredVoltage", ":"), 10) || 0) / 1e3,
                    voltageMin: (parseInt(g.getValue(c, "MinVoltage", ":"), 10) || 0) / 1e3,
                    voltageMax: (parseInt(g.getValue(c, "MaxVoltage", ":"), 10) || 0) / 1e3
                  });
                });
              }
              eA && eA(p), N(p);
            });
          } catch {
            eA && eA(p), N(p);
          }
        }
      });
    });
  }
  return memory.memLayout = J, memory;
}
var battery, hasRequiredBattery;
function requireBattery() {
  if (hasRequiredBattery) return battery;
  hasRequiredBattery = 1;
  const s = require$$1.exec, e = require$$1$1, A = requireUtil(), g = process.platform, r = g === "linux" || g === "android", B = g === "darwin", F = g === "win32", k = g === "freebsd", P = g === "openbsd", q = g === "netbsd", Z = g === "sunos";
  function $(sA, X, S) {
    const J = {};
    let eA = parseInt(A.getValue(sA, "BatteryStatus", ":").trim(), 10) || 0;
    if (eA >= 0) {
      const b = eA;
      J.status = b, J.hasBattery = !0, J.maxCapacity = S || parseInt(A.getValue(sA, "DesignCapacity", ":") || 0), J.designedCapacity = parseInt(A.getValue(sA, "DesignCapacity", ":") || X), J.voltage = (parseInt(A.getValue(sA, "DesignVoltage", ":"), 10) || 0) / 1e3, J.capacityUnit = "mWh", J.percent = parseInt(A.getValue(sA, "EstimatedChargeRemaining", ":"), 10) || 0, J.currentCapacity = parseInt(J.maxCapacity * J.percent / 100), J.isCharging = b >= 6 && b <= 9 || b === 11 || b !== 3 && b !== 1 && J.percent < 100, J.acConnected = J.isCharging || b === 2, J.model = A.getValue(sA, "DeviceID", ":");
    } else
      J.status = -1;
    return J;
  }
  return battery = (sA) => new Promise((X) => {
    process.nextTick(() => {
      let S = {
        hasBattery: !1,
        cycleCount: 0,
        isCharging: !1,
        designedCapacity: 0,
        maxCapacity: 0,
        currentCapacity: 0,
        voltage: 0,
        capacityUnit: "",
        percent: 0,
        timeRemaining: null,
        acConnected: !0,
        type: "",
        model: "",
        manufacturer: "",
        serial: ""
      };
      if (r) {
        let J = "";
        e.existsSync("/sys/class/power_supply/BAT1/uevent") ? J = "/sys/class/power_supply/BAT1/" : e.existsSync("/sys/class/power_supply/BAT0/uevent") && (J = "/sys/class/power_supply/BAT0/");
        let eA = !1, b = "";
        e.existsSync("/sys/class/power_supply/AC/online") ? b = "/sys/class/power_supply/AC/online" : e.existsSync("/sys/class/power_supply/AC0/online") && (b = "/sys/class/power_supply/AC0/online"), b && (eA = e.readFileSync(b).toString().trim() === "1"), J ? e.readFile(J + "uevent", (N, p) => {
          if (N)
            sA && sA(S), X(S);
          else {
            let h = p.toString().split(`
`);
            S.isCharging = A.getValue(h, "POWER_SUPPLY_STATUS", "=").toLowerCase() === "charging", S.acConnected = eA || S.isCharging, S.voltage = parseInt("0" + A.getValue(h, "POWER_SUPPLY_VOLTAGE_NOW", "="), 10) / 1e6, S.capacityUnit = S.voltage ? "mWh" : "mAh", S.cycleCount = parseInt("0" + A.getValue(h, "POWER_SUPPLY_CYCLE_COUNT", "="), 10), S.maxCapacity = Math.round(parseInt("0" + A.getValue(h, "POWER_SUPPLY_CHARGE_FULL", "=", !0, !0), 10) / 1e3 * (S.voltage || 1));
            const E = parseInt("0" + A.getValue(h, "POWER_SUPPLY_VOLTAGE_MIN_DESIGN", "="), 10) / 1e6;
            S.designedCapacity = Math.round(
              parseInt("0" + A.getValue(h, "POWER_SUPPLY_CHARGE_FULL_DESIGN", "=", !0, !0), 10) / 1e3 * (E || S.voltage || 1)
            ), S.currentCapacity = Math.round(parseInt("0" + A.getValue(h, "POWER_SUPPLY_CHARGE_NOW", "="), 10) / 1e3 * (S.voltage || 1)), S.maxCapacity || (S.maxCapacity = parseInt("0" + A.getValue(h, "POWER_SUPPLY_ENERGY_FULL", "=", !0, !0), 10) / 1e3, S.designedCapacity = parseInt("0" + A.getValue(h, "POWER_SUPPLY_ENERGY_FULL_DESIGN", "=", !0, !0), 10) / 1e3 | S.maxCapacity, S.currentCapacity = parseInt("0" + A.getValue(h, "POWER_SUPPLY_ENERGY_NOW", "="), 10) / 1e3);
            const u = A.getValue(h, "POWER_SUPPLY_CAPACITY", "="), o = parseInt("0" + A.getValue(h, "POWER_SUPPLY_ENERGY_NOW", "="), 10), Q = parseInt("0" + A.getValue(h, "POWER_SUPPLY_POWER_NOW", "="), 10), d = parseInt("0" + A.getValue(h, "POWER_SUPPLY_CURRENT_NOW", "="), 10), c = parseInt("0" + A.getValue(h, "POWER_SUPPLY_CHARGE_NOW", "="), 10);
            S.percent = parseInt("0" + u, 10), S.maxCapacity && S.currentCapacity && (S.hasBattery = !0, u || (S.percent = 100 * S.currentCapacity / S.maxCapacity)), S.isCharging && (S.hasBattery = !0), o && Q ? S.timeRemaining = Math.floor(o / Q * 60) : d && c ? S.timeRemaining = Math.floor(c / d * 60) : d && S.currentCapacity && (S.timeRemaining = Math.floor(S.currentCapacity / d * 60)), S.type = A.getValue(h, "POWER_SUPPLY_TECHNOLOGY", "="), S.model = A.getValue(h, "POWER_SUPPLY_MODEL_NAME", "="), S.manufacturer = A.getValue(h, "POWER_SUPPLY_MANUFACTURER", "="), S.serial = A.getValue(h, "POWER_SUPPLY_SERIAL_NUMBER", "="), sA && sA(S), X(S);
          }
        }) : (sA && sA(S), X(S));
      }
      if ((k || P || q) && s("sysctl -i hw.acpi.battery hw.acpi.acline", (J, eA) => {
        let b = eA.toString().split(`
`);
        const N = parseInt("0" + A.getValue(b, "hw.acpi.battery.units"), 10), p = parseInt("0" + A.getValue(b, "hw.acpi.battery.life"), 10);
        S.hasBattery = N > 0, S.cycleCount = null, S.isCharging = A.getValue(b, "hw.acpi.acline") !== "1", S.acConnected = S.isCharging, S.maxCapacity = null, S.currentCapacity = null, S.capacityUnit = "unknown", S.percent = N ? p : null, sA && sA(S), X(S);
      }), B && s(
        'ioreg -n AppleSmartBattery -r | egrep "CycleCount|IsCharging|DesignCapacity|MaxCapacity|CurrentCapacity|DeviceName|BatterySerialNumber|Serial|TimeRemaining|Voltage"; pmset -g batt | grep %',
        (J, eA) => {
          if (eA) {
            let b = eA.toString().replace(/ +/g, "").replace(/"+/g, "").replace(/-/g, "").split(`
`);
            S.cycleCount = parseInt("0" + A.getValue(b, "cyclecount", "="), 10), S.voltage = parseInt("0" + A.getValue(b, "voltage", "="), 10) / 1e3, S.capacityUnit = S.voltage ? "mWh" : "mAh", S.maxCapacity = Math.round(parseInt("0" + A.getValue(b, "applerawmaxcapacity", "="), 10) * (S.voltage || 1)), S.currentCapacity = Math.round(parseInt("0" + A.getValue(b, "applerawcurrentcapacity", "="), 10) * (S.voltage || 1)), S.designedCapacity = Math.round(parseInt("0" + A.getValue(b, "DesignCapacity", "="), 10) * (S.voltage || 1)), S.manufacturer = "Apple", S.serial = A.getValue(b, "BatterySerialNumber", "=") || A.getValue(b, "Serial", "="), S.model = A.getValue(b, "DeviceName", "=");
            let N = null, h = A.getValue(b, "internal", "Battery").split(";");
            if (h && h[0]) {
              let E = h[0].split("	");
              E && E[1] && (N = parseFloat(E[1].trim().replace(/%/g, "")));
            }
            h && h[1] ? (S.isCharging = h[1].trim() === "charging", S.acConnected = h[1].trim() !== "discharging") : (S.isCharging = A.getValue(b, "ischarging", "=").toLowerCase() === "yes", S.acConnected = S.isCharging), S.maxCapacity && S.currentCapacity && (S.hasBattery = !0, S.type = "Li-ion", S.percent = N !== null ? N : Math.round(100 * S.currentCapacity / S.maxCapacity), S.isCharging || (S.timeRemaining = parseInt("0" + A.getValue(b, "TimeRemaining", "="), 10)));
          }
          sA && sA(S), X(S);
        }
      ), Z && (sA && sA(S), X(S)), F)
        try {
          const J = [];
          J.push(A.powerShell("Get-CimInstance Win32_Battery | select BatteryStatus, DesignCapacity, DesignVoltage, EstimatedChargeRemaining, DeviceID | fl")), J.push(A.powerShell("(Get-WmiObject -Class BatteryStaticData -Namespace ROOT/WMI).DesignedCapacity")), J.push(A.powerShell("(Get-CimInstance -Class BatteryFullChargedCapacity -Namespace ROOT/WMI).FullChargedCapacity")), A.promiseAll(J).then((eA) => {
            if (eA) {
              const b = eA.results[0].split(/\n\s*\n/), N = [], p = (u) => /\S/.test(u);
              for (let u = 0; u < b.length; u++)
                p(b[u]) && N.push(b[u]);
              const h = eA.results[1].split(`\r
`).filter((u) => u), E = eA.results[2].split(`\r
`).filter((u) => u);
              if (N.length) {
                let u = !1;
                const o = [];
                for (let Q = 0; Q < N.length; Q++) {
                  const d = N[Q].split(`\r
`), c = h && h.length >= Q + 1 && h[Q] ? A.toInt(h[Q]) : 0, n = E && E.length >= Q + 1 && E[Q] ? A.toInt(E[Q]) : 0, L = $(d, c, n);
                  !u && L.status > 0 && L.status !== 10 ? (S.hasBattery = L.hasBattery, S.maxCapacity = L.maxCapacity, S.designedCapacity = L.designedCapacity, S.voltage = L.voltage, S.capacityUnit = L.capacityUnit, S.percent = L.percent, S.currentCapacity = L.currentCapacity, S.isCharging = L.isCharging, S.acConnected = L.acConnected, S.model = L.model, u = !0) : L.status !== -1 && o.push({
                    hasBattery: L.hasBattery,
                    maxCapacity: L.maxCapacity,
                    designedCapacity: L.designedCapacity,
                    voltage: L.voltage,
                    capacityUnit: L.capacityUnit,
                    percent: L.percent,
                    currentCapacity: L.currentCapacity,
                    isCharging: L.isCharging,
                    timeRemaining: null,
                    acConnected: L.acConnected,
                    model: L.model,
                    type: "",
                    manufacturer: "",
                    serial: ""
                  });
                }
                !u && o.length && (S = o[0], o.shift()), o.length && (S.additionalBatteries = o);
              }
            }
            sA && sA(S), X(S);
          });
        } catch {
          sA && sA(S), X(S);
        }
    });
  }), battery;
}
var graphics = {}, hasRequiredGraphics;
function requireGraphics() {
  if (hasRequiredGraphics) return graphics;
  hasRequiredGraphics = 1;
  const s = require$$1$1, e = require$$2, A = require$$1.exec, g = require$$1.execSync, r = requireUtil(), B = process.platform;
  let F = "";
  const k = B === "linux" || B === "android", P = B === "darwin", q = B === "win32", Z = B === "freebsd", $ = B === "openbsd", sA = B === "netbsd", X = B === "sunos";
  let S = 0, J = 0, eA = 0, b = 0;
  const N = {
    "-2": "UNINITIALIZED",
    "-1": "OTHER",
    0: "HD15",
    1: "SVIDEO",
    2: "Composite video",
    3: "Component video",
    4: "DVI",
    5: "HDMI",
    6: "LVDS",
    8: "D_JPN",
    9: "SDI",
    10: "DP",
    11: "DP embedded",
    12: "UDI",
    13: "UDI embedded",
    14: "SDTVDONGLE",
    15: "MIRACAST",
    2147483648: "INTERNAL"
  };
  function p(Q) {
    const d = [
      { pattern: "^LG.+", manufacturer: "LG" },
      { pattern: "^BENQ.+", manufacturer: "BenQ" },
      { pattern: "^ASUS.+", manufacturer: "Asus" },
      { pattern: "^DELL.+", manufacturer: "Dell" },
      { pattern: "^SAMSUNG.+", manufacturer: "Samsung" },
      { pattern: "^VIEWSON.+", manufacturer: "ViewSonic" },
      { pattern: "^SONY.+", manufacturer: "Sony" },
      { pattern: "^ACER.+", manufacturer: "Acer" },
      { pattern: "^AOC.+", manufacturer: "AOC Monitors" },
      { pattern: "^HP.+", manufacturer: "HP" },
      { pattern: "^EIZO.?", manufacturer: "Eizo" },
      { pattern: "^PHILIPS.?", manufacturer: "Philips" },
      { pattern: "^IIYAMA.?", manufacturer: "Iiyama" },
      { pattern: "^SHARP.?", manufacturer: "Sharp" },
      { pattern: "^NEC.?", manufacturer: "NEC" },
      { pattern: "^LENOVO.?", manufacturer: "Lenovo" },
      { pattern: "COMPAQ.?", manufacturer: "Compaq" },
      { pattern: "APPLE.?", manufacturer: "Apple" },
      { pattern: "INTEL.?", manufacturer: "Intel" },
      { pattern: "AMD.?", manufacturer: "AMD" },
      { pattern: "NVIDIA.?", manufacturer: "NVDIA" }
    ];
    let c = "";
    return Q && (Q = Q.toUpperCase(), d.forEach((n) => {
      RegExp(n.pattern).test(Q) && (c = n.manufacturer);
    })), c;
  }
  function h(Q) {
    return {
      610: "Apple",
      "1e6d": "LG",
      "10ac": "DELL",
      "4dd9": "Sony",
      "38a3": "NEC"
    }[Q] || "";
  }
  function E(Q) {
    let d = "";
    return Q = (Q || "").toLowerCase(), Q.indexOf("apple") >= 0 ? d = "0x05ac" : Q.indexOf("nvidia") >= 0 ? d = "0x10de" : Q.indexOf("intel") >= 0 ? d = "0x8086" : (Q.indexOf("ati") >= 0 || Q.indexOf("amd") >= 0) && (d = "0x1002"), d;
  }
  function u(Q) {
    return {
      spdisplays_mtlgpufamilymac1: "mac1",
      spdisplays_mtlgpufamilymac2: "mac2",
      spdisplays_mtlgpufamilyapple1: "apple1",
      spdisplays_mtlgpufamilyapple2: "apple2",
      spdisplays_mtlgpufamilyapple3: "apple3",
      spdisplays_mtlgpufamilyapple4: "apple4",
      spdisplays_mtlgpufamilyapple5: "apple5",
      spdisplays_mtlgpufamilyapple6: "apple6",
      spdisplays_mtlgpufamilyapple7: "apple7",
      spdisplays_metalfeaturesetfamily11: "family1_v1",
      spdisplays_metalfeaturesetfamily12: "family1_v2",
      spdisplays_metalfeaturesetfamily13: "family1_v3",
      spdisplays_metalfeaturesetfamily14: "family1_v4",
      spdisplays_metalfeaturesetfamily21: "family2_v1"
    }[Q] || "";
  }
  function o(Q) {
    function d(a) {
      const I = {
        controllers: [],
        displays: []
      };
      try {
        return a.forEach((t) => {
          const l = (t.sppci_bus || "").indexOf("builtin") > -1 ? "Built-In" : (t.sppci_bus || "").indexOf("pcie") > -1 ? "PCIe" : "", D = (parseInt(t.spdisplays_vram || "", 10) || 0) * ((t.spdisplays_vram || "").indexOf("GB") > -1 ? 1024 : 1), f = (parseInt(t.spdisplays_vram_shared || "", 10) || 0) * ((t.spdisplays_vram_shared || "").indexOf("GB") > -1 ? 1024 : 1);
          let w = u(t.spdisplays_metal || t.spdisplays_metalfamily || "");
          I.controllers.push({
            vendor: p(t.spdisplays_vendor || "") || t.spdisplays_vendor || "",
            model: t.sppci_model || "",
            bus: l,
            vramDynamic: l === "Built-In",
            vram: D || f || null,
            deviceId: t["spdisplays_device-id"] || "",
            vendorId: t["spdisplays_vendor-id"] || E((t.spdisplays_vendor || "") + (t.sppci_model || "")),
            external: t.sppci_device_type === "spdisplays_egpu",
            cores: t.sppci_cores || null,
            metalVersion: w
          }), t.spdisplays_ndrvs && t.spdisplays_ndrvs.length && t.spdisplays_ndrvs.forEach((Y) => {
            const _ = Y.spdisplays_connection_type || "", x = (Y._spdisplays_resolution || "").split("@"), W = x[0].split("x"), z = (Y._spdisplays_pixels || "").split("x"), aA = Y.spdisplays_depth || "", tA = Y["_spdisplays_display-serial-number"] || Y["_spdisplays_display-serial-number2"] || null;
            I.displays.push({
              vendor: h(Y["_spdisplays_display-vendor-id"] || "") || p(Y._name || ""),
              vendorId: Y["_spdisplays_display-vendor-id"] || "",
              model: Y._name || "",
              productionYear: Y["_spdisplays_display-year"] || null,
              serial: tA !== "0" ? tA : null,
              displayId: Y._spdisplays_displayID || null,
              main: Y.spdisplays_main ? Y.spdisplays_main === "spdisplays_yes" : !1,
              builtin: (Y.spdisplays_display_type || "").indexOf("built-in") > -1,
              connection: _.indexOf("_internal") > -1 ? "Internal" : _.indexOf("_displayport") > -1 ? "Display Port" : _.indexOf("_hdmi") > -1 ? "HDMI" : null,
              sizeX: null,
              sizeY: null,
              pixelDepth: aA === "CGSThirtyBitColor" ? 30 : aA === "CGSThirtytwoBitColor" ? 32 : aA === "CGSTwentyfourBitColor" ? 24 : null,
              resolutionX: z.length > 1 ? parseInt(z[0], 10) : null,
              resolutionY: z.length > 1 ? parseInt(z[1], 10) : null,
              currentResX: W.length > 1 ? parseInt(W[0], 10) : null,
              currentResY: W.length > 1 ? parseInt(W[1], 10) : null,
              positionX: 0,
              positionY: 0,
              currentRefreshRate: x.length > 1 ? parseInt(x[1], 10) : null
            });
          });
        }), I;
      } catch {
        return I;
      }
    }
    function c(a) {
      let I = [], t = {
        vendor: "",
        subVendor: "",
        model: "",
        bus: "",
        busAddress: "",
        vram: null,
        vramDynamic: !1,
        pciID: ""
      }, l = !1, D = [];
      try {
        D = g('export LC_ALL=C; dmidecode -t 9 2>/dev/null; unset LC_ALL | grep "Bus Address: "', r.execOptsLinux).toString().split(`
`);
        for (let w = 0; w < D.length; w++)
          D[w] = D[w].replace("Bus Address:", "").replace("0000:", "").trim();
        D = D.filter((w) => w != null && w);
      } catch {
        r.noop();
      }
      let f = 1;
      return a.forEach((w) => {
        let Y = "";
        if (f < a.length && a[f] && (Y = a[f], Y.indexOf(":") > 0 && (Y = Y.split(":")[1])), w.trim() !== "") {
          if (w[0] !== " " && w[0] !== "	") {
            let _ = D.indexOf(w.split(" ")[0]) >= 0, x = w.toLowerCase().indexOf(" vga "), W = w.toLowerCase().indexOf("3d controller");
            if (x !== -1 || W !== -1) {
              W !== -1 && x === -1 && (x = W), (t.vendor || t.model || t.bus || t.vram !== null || t.vramDynamic) && (I.push(t), t = {
                vendor: "",
                model: "",
                bus: "",
                busAddress: "",
                vram: null,
                vramDynamic: !1
              });
              const z = w.split(" ")[0];
              /[\da-fA-F]{2}:[\da-fA-F]{2}\.[\da-fA-F]/.test(z) && (t.busAddress = z), l = !0;
              let aA = w.search(/\[[0-9a-f]{4}:[0-9a-f]{4}]|$/), tA = w.substr(x, aA - x).split(":");
              if (t.busAddress = w.substr(0, x).trim(), tA.length > 1 && (tA[1] = tA[1].trim(), tA[1].toLowerCase().indexOf("corporation") >= 0 ? (t.vendor = tA[1].substr(0, tA[1].toLowerCase().indexOf("corporation") + 11).trim(), t.model = tA[1].substr(tA[1].toLowerCase().indexOf("corporation") + 11, 200).split("(")[0].trim(), t.bus = D.length > 0 && _ ? "PCIe" : "Onboard", t.vram = null, t.vramDynamic = !1) : tA[1].toLowerCase().indexOf(" inc.") >= 0 ? ((tA[1].match(/]/g) || []).length > 1 ? (t.vendor = tA[1].substr(0, tA[1].toLowerCase().indexOf("]") + 1).trim(), t.model = tA[1].substr(tA[1].toLowerCase().indexOf("]") + 1, 200).trim().split("(")[0].trim()) : (t.vendor = tA[1].substr(0, tA[1].toLowerCase().indexOf(" inc.") + 5).trim(), t.model = tA[1].substr(tA[1].toLowerCase().indexOf(" inc.") + 5, 200).trim().split("(")[0].trim()), t.bus = D.length > 0 && _ ? "PCIe" : "Onboard", t.vram = null, t.vramDynamic = !1) : tA[1].toLowerCase().indexOf(" ltd.") >= 0 && ((tA[1].match(/]/g) || []).length > 1 ? (t.vendor = tA[1].substr(0, tA[1].toLowerCase().indexOf("]") + 1).trim(), t.model = tA[1].substr(tA[1].toLowerCase().indexOf("]") + 1, 200).trim().split("(")[0].trim()) : (t.vendor = tA[1].substr(0, tA[1].toLowerCase().indexOf(" ltd.") + 5).trim(), t.model = tA[1].substr(tA[1].toLowerCase().indexOf(" ltd.") + 5, 200).trim().split("(")[0].trim())), t.model && Y.indexOf(t.model) !== -1)) {
                const M = Y.split(t.model)[0].trim();
                M && (t.subVendor = M);
              }
            } else
              l = !1;
          }
          if (l) {
            let _ = w.split(":");
            if (_.length > 1 && _[0].replace(/ +/g, "").toLowerCase().indexOf("devicename") !== -1 && _[1].toLowerCase().indexOf("onboard") !== -1 && (t.bus = "Onboard"), _.length > 1 && _[0].replace(/ +/g, "").toLowerCase().indexOf("region") !== -1 && _[1].toLowerCase().indexOf("memory") !== -1) {
              let x = _[1].split("=");
              x.length > 1 && (t.vram = parseInt(x[1]));
            }
          }
        }
        f++;
      }), (t.vendor || t.model || t.bus || t.busAddress || t.vram !== null || t.vramDynamic) && I.push(t), I;
    }
    function n(a, I) {
      const t = /\[([^\]]+)\]\s+(\w+)\s+(.*)/, l = I.reduce((D, f) => {
        const w = t.exec(f.trim());
        return w && (D[w[1]] || (D[w[1]] = {}), D[w[1]][w[2]] = w[3]), D;
      }, {});
      for (let D in l) {
        const f = l[D];
        if (f.CL_DEVICE_TYPE === "CL_DEVICE_TYPE_GPU") {
          let w;
          if (f.CL_DEVICE_TOPOLOGY_AMD) {
            const Y = f.CL_DEVICE_TOPOLOGY_AMD.match(/[a-zA-Z0-9]+:\d+\.\d+/);
            Y && (w = Y[0]);
          } else if (f.CL_DEVICE_PCI_BUS_ID_NV && f.CL_DEVICE_PCI_SLOT_ID_NV) {
            const Y = parseInt(f.CL_DEVICE_PCI_BUS_ID_NV), _ = parseInt(f.CL_DEVICE_PCI_SLOT_ID_NV);
            if (!isNaN(Y) && !isNaN(_)) {
              const x = Y & 255, W = _ >> 3 & 255, z = _ & 7;
              w = `${x.toString().padStart(2, "0")}:${W.toString().padStart(2, "0")}.${z}`;
            }
          }
          if (w) {
            let Y = a.find((x) => x.busAddress === w);
            Y || (Y = {
              vendor: "",
              model: "",
              bus: "",
              busAddress: w,
              vram: null,
              vramDynamic: !1
            }, a.push(Y)), Y.vendor = f.CL_DEVICE_VENDOR, f.CL_DEVICE_BOARD_NAME_AMD ? Y.model = f.CL_DEVICE_BOARD_NAME_AMD : Y.model = f.CL_DEVICE_NAME;
            const _ = parseInt(f.CL_DEVICE_GLOBAL_MEM_SIZE);
            isNaN(_) || (Y.vram = Math.round(_ / 1024 / 1024));
          }
        }
      }
      return a;
    }
    function L() {
      if (F)
        return F;
      if (q)
        try {
          const a = e.join(r.WINDIR, "System32", "DriverStore", "FileRepository"), I = s.readdirSync(a, { withFileTypes: !0 }).filter((t) => t.isDirectory()).map((t) => {
            const l = e.join(a, t.name, "nvidia-smi.exe");
            try {
              const D = s.statSync(l);
              return { path: l, ctime: D.ctimeMs };
            } catch {
              return null;
            }
          }).filter(Boolean);
          I.length > 0 && (F = I.reduce((t, l) => l.ctime > t.ctime ? l : t).path);
        } catch {
          r.noop();
        }
      else k && (F = "nvidia-smi");
      return F;
    }
    function G(a) {
      const I = L();
      if (a = a || r.execOptsWin, I) {
        const l = `"${I}" --query-gpu=driver_version,pci.sub_device_id,name,pci.bus_id,fan.speed,memory.total,memory.used,memory.free,utilization.gpu,utilization.memory,temperature.gpu,temperature.memory,power.draw,power.limit,clocks.gr,clocks.mem --format=csv,noheader,nounits`;
        k && (a.stdio = ["pipe", "pipe", "ignore"]);
        try {
          const D = l + (k ? "  2>/dev/null" : "") + (q ? "  2> nul" : "");
          return g(D, a).toString();
        } catch {
          r.noop();
        }
      }
      return "";
    }
    function K() {
      function a(D) {
        return [null, void 0].includes(D) ? D : parseFloat(D);
      }
      const I = G();
      if (!I)
        return [];
      let l = I.split(`
`).filter(Boolean).map((D) => {
        const f = D.split(", ").map((w) => w.includes("N/A") ? void 0 : w);
        return f.length === 16 ? {
          driverVersion: f[0],
          subDeviceId: f[1],
          name: f[2],
          pciBus: f[3],
          fanSpeed: a(f[4]),
          memoryTotal: a(f[5]),
          memoryUsed: a(f[6]),
          memoryFree: a(f[7]),
          utilizationGpu: a(f[8]),
          utilizationMemory: a(f[9]),
          temperatureGpu: a(f[10]),
          temperatureMemory: a(f[11]),
          powerDraw: a(f[12]),
          powerLimit: a(f[13]),
          clockCore: a(f[14]),
          clockMemory: a(f[15])
        } : {};
      });
      return l = l.filter((D) => "pciBus" in D), l;
    }
    function gA(a, I) {
      return I.driverVersion && (a.driverVersion = I.driverVersion), I.subDeviceId && (a.subDeviceId = I.subDeviceId), I.name && (a.name = I.name), I.pciBus && (a.pciBus = I.pciBus), I.fanSpeed && (a.fanSpeed = I.fanSpeed), I.memoryTotal && (a.memoryTotal = I.memoryTotal, a.vram = I.memoryTotal, a.vramDynamic = !1), I.memoryUsed && (a.memoryUsed = I.memoryUsed), I.memoryFree && (a.memoryFree = I.memoryFree), I.utilizationGpu && (a.utilizationGpu = I.utilizationGpu), I.utilizationMemory && (a.utilizationMemory = I.utilizationMemory), I.temperatureGpu && (a.temperatureGpu = I.temperatureGpu), I.temperatureMemory && (a.temperatureMemory = I.temperatureMemory), I.powerDraw && (a.powerDraw = I.powerDraw), I.powerLimit && (a.powerLimit = I.powerLimit), I.clockCore && (a.clockCore = I.clockCore), I.clockMemory && (a.clockMemory = I.clockMemory), a;
    }
    function H(a) {
      const I = {
        vendor: "",
        model: "",
        deviceName: "",
        main: !1,
        builtin: !1,
        connection: "",
        sizeX: null,
        sizeY: null,
        pixelDepth: null,
        resolutionX: null,
        resolutionY: null,
        currentResX: null,
        currentResY: null,
        positionX: 0,
        positionY: 0,
        currentRefreshRate: null
      };
      let t = 108;
      if (a.substr(t, 6) === "000000" && (t += 36), a.substr(t, 6) === "000000" && (t += 36), a.substr(t, 6) === "000000" && (t += 36), a.substr(t, 6) === "000000" && (t += 36), I.resolutionX = parseInt("0x0" + a.substr(t + 8, 1) + a.substr(t + 4, 2)), I.resolutionY = parseInt("0x0" + a.substr(t + 14, 1) + a.substr(t + 10, 2)), I.sizeX = parseInt("0x0" + a.substr(t + 28, 1) + a.substr(t + 24, 2)), I.sizeY = parseInt("0x0" + a.substr(t + 29, 1) + a.substr(t + 26, 2)), t = a.indexOf("000000fc00"), t >= 0) {
        let l = a.substr(t + 10, 26);
        l.indexOf("0a") !== -1 && (l = l.substr(0, l.indexOf("0a")));
        try {
          l.length > 2 && (I.model = l.match(/.{1,2}/g).map((D) => String.fromCharCode(parseInt(D, 16))).join(""));
        } catch {
          r.noop();
        }
      } else
        I.model = "";
      return I;
    }
    function U(a, I) {
      const t = [];
      let l = {
        vendor: "",
        model: "",
        deviceName: "",
        main: !1,
        builtin: !1,
        connection: "",
        sizeX: null,
        sizeY: null,
        pixelDepth: null,
        resolutionX: null,
        resolutionY: null,
        currentResX: null,
        currentResY: null,
        positionX: 0,
        positionY: 0,
        currentRefreshRate: null
      }, D = !1, f = !1, w = "", Y = 0;
      for (let _ = 1; _ < a.length; _++)
        if (a[_].trim() !== "") {
          if (a[_][0] !== " " && a[_][0] !== "	" && a[_].toLowerCase().indexOf(" connected ") !== -1) {
            (l.model || l.main || l.builtin || l.connection || l.sizeX !== null || l.pixelDepth !== null || l.resolutionX !== null) && (t.push(l), l = {
              vendor: "",
              model: "",
              main: !1,
              builtin: !1,
              connection: "",
              sizeX: null,
              sizeY: null,
              pixelDepth: null,
              resolutionX: null,
              resolutionY: null,
              currentResX: null,
              currentResY: null,
              positionX: 0,
              positionY: 0,
              currentRefreshRate: null
            });
            let x = a[_].split(" ");
            l.connection = x[0], l.main = a[_].toLowerCase().indexOf(" primary ") >= 0, l.builtin = x[0].toLowerCase().indexOf("edp") >= 0;
          }
          if (D)
            if (a[_].search(/\S|$/) > Y)
              w += a[_].toLowerCase().trim();
            else {
              let x = H(w);
              l.vendor = x.vendor, l.model = x.model, l.resolutionX = x.resolutionX, l.resolutionY = x.resolutionY, l.sizeX = x.sizeX, l.sizeY = x.sizeY, l.pixelDepth = I, D = !1;
            }
          if (a[_].toLowerCase().indexOf("edid:") >= 0 && (D = !0, Y = a[_].search(/\S|$/)), a[_].toLowerCase().indexOf("*current") >= 0) {
            const x = a[_].split("(");
            if (x && x.length > 1 && x[0].indexOf("x") >= 0) {
              const W = x[0].trim().split("x");
              l.currentResX = r.toInt(W[0]), l.currentResY = r.toInt(W[1]);
            }
            f = !0;
          }
          if (f && a[_].toLowerCase().indexOf("clock") >= 0 && a[_].toLowerCase().indexOf("hz") >= 0 && a[_].toLowerCase().indexOf("v: height") >= 0) {
            const x = a[_].split("clock");
            x && x.length > 1 && x[1].toLowerCase().indexOf("hz") >= 0 && (l.currentRefreshRate = r.toInt(x[1])), f = !1;
          }
        }
      return (l.model || l.main || l.builtin || l.connection || l.sizeX !== null || l.pixelDepth !== null || l.resolutionX !== null) && t.push(l), t;
    }
    return new Promise((a) => {
      process.nextTick(() => {
        let I = {
          controllers: [],
          displays: []
        };
        if (P && A("system_profiler -xml -detailLevel full SPDisplaysDataType", (l, D) => {
          if (!l) {
            try {
              const f = D.toString();
              I = d(r.plistParser(f)[0]._items);
            } catch {
              r.noop();
            }
            try {
              D = g(
                'defaults read /Library/Preferences/com.apple.windowserver.plist 2>/dev/null;defaults read /Library/Preferences/com.apple.windowserver.displays.plist 2>/dev/null; echo ""',
                { maxBuffer: 1024 * 102400 }
              );
              const f = (D || "").toString(), w = r.plistReader(f);
              if (w.DisplayAnyUserSets && w.DisplayAnyUserSets.Configs && w.DisplayAnyUserSets.Configs[0] && w.DisplayAnyUserSets.Configs[0].DisplayConfig) {
                const Y = w.DisplayAnyUserSets.Configs[0].DisplayConfig;
                let _ = 0;
                Y.forEach((x) => {
                  x.CurrentInfo && x.CurrentInfo.OriginX !== void 0 && I.displays && I.displays[_] && (I.displays[_].positionX = x.CurrentInfo.OriginX), x.CurrentInfo && x.CurrentInfo.OriginY !== void 0 && I.displays && I.displays[_] && (I.displays[_].positionY = x.CurrentInfo.OriginY), _++;
                });
              }
              if (w.DisplayAnyUserSets && w.DisplayAnyUserSets.length > 0 && w.DisplayAnyUserSets[0].length > 0 && w.DisplayAnyUserSets[0][0].DisplayID) {
                const Y = w.DisplayAnyUserSets[0];
                let _ = 0;
                Y.forEach((x) => {
                  "OriginX" in x && I.displays && I.displays[_] && (I.displays[_].positionX = x.OriginX), "OriginY" in x && I.displays && I.displays[_] && (I.displays[_].positionY = x.OriginY), x.Mode && x.Mode.BitsPerPixel !== void 0 && I.displays && I.displays[_] && (I.displays[_].pixelDepth = x.Mode.BitsPerPixel), _++;
                });
              }
            } catch {
              r.noop();
            }
          }
          Q && Q(I), a(I);
        }), k && (r.isRaspberry() && A(`fbset -s 2> /dev/null | grep 'mode "' ; vcgencmd get_mem gpu 2> /dev/null; tvservice -s 2> /dev/null; tvservice -n 2> /dev/null;`, (D, f) => {
          const w = f.toString().split(`
`);
          if (w.length > 3 && w[0].indexOf('mode "') >= -1 && w[2].indexOf("0x12000a") > -1) {
            const Y = w[0].replace("mode", "").replace(/"/g, "").trim().split("x");
            Y.length === 2 && I.displays.push({
              vendor: "",
              model: r.getValue(w, "device_name", "="),
              main: !0,
              builtin: !1,
              connection: "HDMI",
              sizeX: null,
              sizeY: null,
              pixelDepth: null,
              resolutionX: parseInt(Y[0], 10),
              resolutionY: parseInt(Y[1], 10),
              currentResX: null,
              currentResY: null,
              positionX: 0,
              positionY: 0,
              currentRefreshRate: null
            });
          }
          w.length >= 1 && f.toString().indexOf("gpu=") >= -1 && I.controllers.push({
            vendor: "Broadcom",
            model: r.getRpiGpu(),
            bus: "",
            vram: r.getValue(w, "gpu", "=").replace("M", ""),
            vramDynamic: !0
          });
        }), A("lspci -vvv  2>/dev/null", (l, D) => {
          if (!l) {
            const w = D.toString().split(`
`);
            if (I.controllers.length === 0) {
              I.controllers = c(w);
              const Y = K();
              I.controllers = I.controllers.map((_) => gA(_, Y.find((x) => x.pciBus.toLowerCase().endsWith(_.busAddress.toLowerCase())) || {}));
            }
          }
          A("clinfo --raw", (w, Y) => {
            if (!w) {
              const x = Y.toString().split(`
`);
              I.controllers = n(I.controllers, x);
            }
            A("xdpyinfo 2>/dev/null | grep 'depth of root window' | awk '{ print $5 }'", (x, W) => {
              let z = 0;
              if (!x) {
                const tA = W.toString().split(`
`);
                z = parseInt(tA[0]) || 0;
              }
              A("xrandr --verbose 2>/dev/null", (tA, M) => {
                if (!tA) {
                  const O = M.toString().split(`
`);
                  I.displays = U(O, z);
                }
                Q && Q(I), a(I);
              });
            });
          });
        })), (Z || $ || sA) && (Q && Q(null), a(null)), X && (Q && Q(null), a(null)), q)
          try {
            const t = [];
            t.push(r.powerShell("Get-CimInstance win32_VideoController | fl *")), t.push(
              r.powerShell(
                'gp "HKLM:\\SYSTEM\\ControlSet001\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\*" -ErrorAction SilentlyContinue | where MatchingDeviceId $null -NE | select MatchingDeviceId,HardwareInformation.qwMemorySize | fl'
              )
            ), t.push(r.powerShell("Get-CimInstance win32_desktopmonitor | fl *")), t.push(r.powerShell("Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBasicDisplayParams | fl")), t.push(r.powerShell("Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::AllScreens")), t.push(r.powerShell("Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorConnectionParams | fl")), t.push(
              r.powerShell(
                'gwmi WmiMonitorID -Namespace root\\wmi | ForEach-Object {(($_.ManufacturerName -notmatch 0 | foreach {[char]$_}) -join "") + "|" + (($_.ProductCodeID -notmatch 0 | foreach {[char]$_}) -join "") + "|" + (($_.UserFriendlyName -notmatch 0 | foreach {[char]$_}) -join "") + "|" + (($_.SerialNumberID -notmatch 0 | foreach {[char]$_}) -join "") + "|" + $_.InstanceName}'
              )
            );
            const l = K();
            Promise.all(t).then((D) => {
              const f = D[0].replace(/\r/g, "").split(/\n\s*\n/), w = D[1].replace(/\r/g, "").split(/\n\s*\n/);
              I.controllers = V(f, w), I.controllers = I.controllers.map((tA) => tA.vendor.toLowerCase() === "nvidia" ? gA(
                tA,
                l.find((M) => {
                  let O = (tA.subDeviceId || "").toLowerCase();
                  const v = M.subDeviceId.split("x");
                  let y = v.length > 1 ? v[1].toLowerCase() : v[0].toLowerCase();
                  const AA = Math.abs(O.length - y.length);
                  if (O.length > y.length)
                    for (let oA = 0; oA < AA; oA++)
                      y = "0" + y;
                  else if (O.length < y.length)
                    for (let oA = 0; oA < AA; oA++)
                      O = "0" + O;
                  return O === y;
                }) || {}
              ) : tA);
              const Y = D[2].replace(/\r/g, "").split(/\n\s*\n/);
              Y[0].trim() === "" && Y.shift(), Y.length && Y[Y.length - 1].trim() === "" && Y.pop();
              const _ = D[3].replace(/\r/g, "").split("Active ");
              _.shift();
              const x = D[4].replace(/\r/g, "").split("BitsPerPixel ");
              x.shift();
              const W = D[5].replace(/\r/g, "").split(/\n\s*\n/);
              W.shift();
              const z = D[6].replace(/\r/g, "").split(/\n/), aA = [];
              z.forEach((tA) => {
                const M = tA.split("|");
                M.length === 5 && aA.push({
                  vendor: M[0],
                  code: M[1],
                  model: M[2],
                  serial: M[3],
                  instanceId: M[4]
                });
              }), I.displays = m(x, _, Y, W, aA), I.displays.length === 1 && (S && (I.displays[0].resolutionX = S, I.displays[0].currentResX || (I.displays[0].currentResX = S)), J && (I.displays[0].resolutionY = J, I.displays[0].currentResY === 0 && (I.displays[0].currentResY = J)), eA && (I.displays[0].pixelDepth = eA)), I.displays = I.displays.map((tA) => (b && !tA.currentRefreshRate && (tA.currentRefreshRate = b), tA)), Q && Q(I), a(I);
            }).catch(() => {
              Q && Q(I), a(I);
            });
          } catch {
            Q && Q(I), a(I);
          }
      });
    });
    function V(a, I) {
      const t = {};
      for (const D in I)
        if ({}.hasOwnProperty.call(I, D) && I[D].trim() !== "") {
          const f = I[D].trim().split(`
`), w = r.getValue(f, "MatchingDeviceId").match(/PCI\\(VEN_[0-9A-F]{4})&(DEV_[0-9A-F]{4})(?:&(SUBSYS_[0-9A-F]{8}))?(?:&(REV_[0-9A-F]{2}))?/i);
          if (w) {
            const Y = parseInt(r.getValue(f, "HardwareInformation.qwMemorySize"));
            if (!isNaN(Y)) {
              let _ = w[1].toUpperCase() + "&" + w[2].toUpperCase();
              w[3] && (_ += "&" + w[3].toUpperCase()), w[4] && (_ += "&" + w[4].toUpperCase()), t[_] = Y;
            }
          }
        }
      const l = [];
      for (const D in a)
        if ({}.hasOwnProperty.call(a, D) && a[D].trim() !== "") {
          const f = a[D].trim().split(`
`), w = r.getValue(f, "PNPDeviceID", ":").match(/PCI\\(VEN_[0-9A-F]{4})&(DEV_[0-9A-F]{4})(?:&(SUBSYS_[0-9A-F]{8}))?(?:&(REV_[0-9A-F]{2}))?/i);
          let Y = null, _ = null;
          if (w) {
            if (Y = w[3] || "", Y && (Y = Y.split("_")[1]), _ == null && w[3] && w[4]) {
              const x = w[1].toUpperCase() + "&" + w[2].toUpperCase() + "&" + w[3].toUpperCase() + "&" + w[4].toUpperCase();
              ({}).hasOwnProperty.call(t, x) && (_ = t[x]);
            }
            if (_ == null && w[3]) {
              const x = w[1].toUpperCase() + "&" + w[2].toUpperCase() + "&" + w[3].toUpperCase();
              ({}).hasOwnProperty.call(t, x) && (_ = t[x]);
            }
            if (_ == null && w[4]) {
              const x = w[1].toUpperCase() + "&" + w[2].toUpperCase() + "&" + w[4].toUpperCase();
              ({}).hasOwnProperty.call(t, x) && (_ = t[x]);
            }
            if (_ == null) {
              const x = w[1].toUpperCase() + "&" + w[2].toUpperCase();
              ({}).hasOwnProperty.call(t, x) && (_ = t[x]);
            }
          }
          l.push({
            vendor: r.getValue(f, "AdapterCompatibility", ":"),
            model: r.getValue(f, "name", ":"),
            bus: r.getValue(f, "PNPDeviceID", ":").startsWith("PCI") ? "PCI" : "",
            vram: (_ ?? r.toInt(r.getValue(f, "AdapterRAM", ":"))) / 1024 / 1024,
            vramDynamic: r.getValue(f, "VideoMemoryType", ":") === "2",
            subDeviceId: Y
          }), S = r.toInt(r.getValue(f, "CurrentHorizontalResolution", ":")) || S, J = r.toInt(r.getValue(f, "CurrentVerticalResolution", ":")) || J, b = r.toInt(r.getValue(f, "CurrentRefreshRate", ":")) || b, eA = r.toInt(r.getValue(f, "CurrentBitsPerPixel", ":")) || eA;
        }
      return l;
    }
    function m(a, I, t, l, D) {
      const f = [];
      let w = "", Y = "", _ = "", x = 0, W = 0;
      if (t && t.length) {
        const z = t[0].split(`
`);
        w = r.getValue(z, "MonitorManufacturer", ":"), Y = r.getValue(z, "Name", ":"), _ = r.getValue(z, "PNPDeviceID", ":").replace(/&amp;/g, "&").toLowerCase(), x = r.toInt(r.getValue(z, "ScreenWidth", ":")), W = r.toInt(r.getValue(z, "ScreenHeight", ":"));
      }
      for (let z = 0; z < a.length; z++)
        if (a[z].trim() !== "") {
          a[z] = "BitsPerPixel " + a[z], I[z] = "Active " + I[z], (l.length === 0 || l[z] === void 0) && (l[z] = "Unknown");
          const aA = a[z].split(`
`), tA = I[z].split(`
`), M = l[z].split(`
`), O = r.getValue(aA, "BitsPerPixel"), v = r.getValue(aA, "Bounds").replace("{", "").replace("}", "").replace(/=/g, ":").split(","), y = r.getValue(aA, "Primary"), AA = r.getValue(tA, "MaxHorizontalImageSize"), oA = r.getValue(tA, "MaxVerticalImageSize"), rA = r.getValue(tA, "InstanceName").toLowerCase(), cA = r.getValue(M, "VideoOutputTechnology"), lA = r.getValue(aA, "DeviceName");
          let pA = "", BA = "";
          D.forEach((uA) => {
            uA.instanceId.toLowerCase().startsWith(rA) && w.startsWith("(") && Y.startsWith("PnP") && (pA = uA.vendor, BA = uA.model);
          }), f.push({
            vendor: rA.startsWith(_) && pA === "" ? w : pA,
            model: rA.startsWith(_) && BA === "" ? Y : BA,
            deviceName: lA,
            main: y.toLowerCase() === "true",
            builtin: cA === "2147483648",
            connection: cA && N[cA] ? N[cA] : "",
            resolutionX: r.toInt(r.getValue(v, "Width", ":")),
            resolutionY: r.toInt(r.getValue(v, "Height", ":")),
            sizeX: AA ? parseInt(AA, 10) : null,
            sizeY: oA ? parseInt(oA, 10) : null,
            pixelDepth: O,
            currentResX: r.toInt(r.getValue(v, "Width", ":")),
            currentResY: r.toInt(r.getValue(v, "Height", ":")),
            positionX: r.toInt(r.getValue(v, "X", ":")),
            positionY: r.toInt(r.getValue(v, "Y", ":"))
          });
        }
      return a.length === 0 && f.push({
        vendor: w,
        model: Y,
        main: !0,
        sizeX: null,
        sizeY: null,
        resolutionX: x,
        resolutionY: W,
        pixelDepth: null,
        currentResX: x,
        currentResY: W,
        positionX: 0,
        positionY: 0
      }), f;
    }
  }
  return graphics.graphics = o, graphics;
}
var filesystem = {}, hasRequiredFilesystem;
function requireFilesystem() {
  if (hasRequiredFilesystem) return filesystem;
  hasRequiredFilesystem = 1;
  const s = requireUtil(), e = require$$1$1, A = require$$1.exec, g = require$$1.execSync, r = s.promisifySave(require$$1.exec), B = process.platform, F = B === "linux" || B === "android", k = B === "darwin", P = B === "win32", q = B === "freebsd", Z = B === "openbsd", $ = B === "netbsd", sA = B === "sunos", X = {}, S = {};
  function J(m, a) {
    s.isFunction(m) && (a = m, m = "");
    let I = [], t = [];
    function l(Y) {
      if (!Y.startsWith("/"))
        return "NFS";
      const _ = Y.split("/"), x = _[_.length - 1], W = I.filter((z) => z.indexOf(x) >= 0);
      return W.length === 1 && W[0].indexOf("APFS") >= 0 ? "APFS" : "HFS";
    }
    function D(Y) {
      const _ = ["rootfs", "unionfs", "squashfs", "cramfs", "initrd", "initramfs", "devtmpfs", "tmpfs", "udev", "devfs", "specfs", "type", "appimaged"];
      let x = !1;
      return _.forEach((W) => {
        Y.toLowerCase().indexOf(W) >= 0 && (x = !0);
      }), x;
    }
    function f(Y) {
      const _ = Y.toString().split(`
`);
      if (_.shift(), Y.toString().toLowerCase().indexOf("filesystem")) {
        let x = 0;
        for (let W = 0; W < _.length; W++)
          _[W] && _[W].toLowerCase().startsWith("filesystem") && (x = W);
        for (let W = 0; W < x; W++)
          _.shift();
      }
      return _;
    }
    function w(Y) {
      const _ = [];
      return Y.forEach((x) => {
        if (x !== "" && (x = x.replace(/ +/g, " ").split(" "), x && (x[0].startsWith("/") || x[6] && x[6] === "/" || x[0].indexOf("/") > 0 || x[0].indexOf(":") === 1 || !k && !D(x[1])))) {
          const W = x[0], z = F || q || Z || $ ? x[1] : l(x[0]), aA = parseInt(F || q || Z || $ ? x[2] : x[1], 10) * 1024, tA = parseInt(F || q || Z || $ ? x[3] : x[2], 10) * 1024, M = parseInt(F || q || Z || $ ? x[4] : x[3], 10) * 1024, O = parseFloat((100 * (tA / (tA + M))).toFixed(2)), v = t && Object.keys(t).length > 0 ? t[W] || !1 : null;
          x.splice(0, F || q || Z || $ ? 6 : 5);
          const y = x.join(" ");
          _.find((AA) => AA.fs === W && AA.type === z && AA.mount === y) || _.push({
            fs: W,
            type: z,
            size: aA,
            used: tA,
            available: M,
            use: O,
            mount: y,
            rw: v
          });
        }
      }), _;
    }
    return new Promise((Y) => {
      process.nextTick(() => {
        let _ = [];
        if (F || q || Z || $ || k) {
          let x = "";
          if (I = [], t = {}, k) {
            x = "df -kP";
            try {
              I = g("diskutil list").toString().split(`
`).filter((W) => !W.startsWith("/") && W.indexOf(":") > 0), g("mount").toString().split(`
`).filter((W) => W.startsWith("/")).forEach((W) => {
                t[W.split(" ")[0]] = W.toLowerCase().indexOf("read-only") === -1;
              });
            } catch {
              s.noop();
            }
          }
          if (F)
            try {
              x = "export LC_ALL=C; df -kPTx squashfs; unset LC_ALL", g("cat /proc/mounts 2>/dev/null", s.execOptsLinux).toString().split(`
`).filter((W) => W.startsWith("/")).forEach((W) => {
                t[W.split(" ")[0]] = t[W.split(" ")[0]] || !1, W.toLowerCase().indexOf("/snap/") === -1 && (t[W.split(" ")[0]] = W.toLowerCase().indexOf("rw,") >= 0 || W.toLowerCase().indexOf(" rw ") >= 0);
              });
            } catch {
              s.noop();
            }
          if (q || Z || $)
            try {
              x = "df -kPT", g("mount").toString().split(`
`).forEach((W) => {
                t[W.split(" ")[0]] = W.toLowerCase().indexOf("read-only") === -1;
              });
            } catch {
              s.noop();
            }
          A(x, { maxBuffer: 1024 * 1024 }, (W, z) => {
            const aA = f(z);
            _ = w(aA), m && (_ = _.filter((tA) => tA.fs.toLowerCase().indexOf(m.toLowerCase()) >= 0 || tA.mount.toLowerCase().indexOf(m.toLowerCase()) >= 0)), (!W || _.length) && z.toString().trim() !== "" ? (a && a(_), Y(_)) : A("df -kPT 2>/dev/null", { maxBuffer: 1024 * 1024 }, (tA, M) => {
              const O = f(M);
              _ = w(O), a && a(_), Y(_);
            });
          });
        }
        if (sA && (a && a(_), Y(_)), P)
          try {
            const x = m ? s.sanitizeShellString(m, !0) : "", W = `Get-WmiObject Win32_logicaldisk | select Access,Caption,FileSystem,FreeSpace,Size ${x ? "| where -property Caption -eq " + x : ""} | fl`;
            s.powerShell(W).then((z, aA) => {
              aA || z.toString().split(/\n\s*\n/).forEach((M) => {
                const O = M.split(`\r
`), v = s.toInt(s.getValue(O, "size", ":")), y = s.toInt(s.getValue(O, "freespace", ":")), AA = s.getValue(O, "caption", ":"), oA = s.getValue(O, "access", ":"), rA = oA ? s.toInt(oA) !== 1 : null;
                v && _.push({
                  fs: AA,
                  type: s.getValue(O, "filesystem", ":"),
                  size: v,
                  used: v - y,
                  available: y,
                  use: parseFloat((100 * (v - y) / v).toFixed(2)),
                  mount: AA,
                  rw: rA
                });
              }), a && a(_), Y(_);
            });
          } catch {
            a && a(_), Y(_);
          }
      });
    });
  }
  filesystem.fsSize = J;
  function eA(m) {
    return new Promise((a) => {
      process.nextTick(() => {
        const I = {
          max: null,
          allocated: null,
          available: null
        };
        (q || Z || $ || k) && A("sysctl -i kern.maxfiles kern.num_files kern.open_files", { maxBuffer: 1024 * 1024 }, (l, D) => {
          if (!l) {
            const f = D.toString().split(`
`);
            I.max = parseInt(s.getValue(f, "kern.maxfiles", ":"), 10), I.allocated = parseInt(s.getValue(f, "kern.num_files", ":"), 10) || parseInt(s.getValue(f, "kern.open_files", ":"), 10), I.available = I.max - I.allocated;
          }
          m && m(I), a(I);
        }), F && e.readFile("/proc/sys/fs/file-nr", (t, l) => {
          if (t)
            e.readFile("/proc/sys/fs/file-max", (D, f) => {
              if (!D) {
                const w = f.toString().split(`
`);
                w[0] && (I.max = parseInt(w[0], 10));
              }
              m && m(I), a(I);
            });
          else {
            const D = l.toString().split(`
`);
            if (D[0]) {
              const f = D[0].replace(/\s+/g, " ").split(" ");
              f.length === 3 && (I.allocated = parseInt(f[0], 10), I.available = parseInt(f[1], 10), I.max = parseInt(f[2], 10), I.available || (I.available = I.max - I.allocated));
            }
            m && m(I), a(I);
          }
        }), sA && (m && m(null), a(null)), P && (m && m(null), a(null));
      });
    });
  }
  filesystem.fsOpenFiles = eA;
  function b(m) {
    return parseInt(m.substr(m.indexOf(" (") + 2, m.indexOf(" Bytes)") - 10), 10);
  }
  function N(m) {
    const a = [];
    let I = 0;
    return m.forEach((t) => {
      if (t.length > 0)
        if (t[0] === "*")
          I++;
        else {
          const l = t.split(":");
          l.length > 1 && (a[I] || (a[I] = {
            name: "",
            identifier: "",
            type: "disk",
            fsType: "",
            mount: "",
            size: 0,
            physical: "HDD",
            uuid: "",
            label: "",
            model: "",
            serial: "",
            removable: !1,
            protocol: "",
            group: "",
            device: ""
          }), l[0] = l[0].trim().toUpperCase().replace(/ +/g, ""), l[1] = l[1].trim(), l[0] === "DEVICEIDENTIFIER" && (a[I].identifier = l[1]), l[0] === "DEVICENODE" && (a[I].name = l[1]), l[0] === "VOLUMENAME" && l[1].indexOf("Not applicable") === -1 && (a[I].label = l[1]), l[0] === "PROTOCOL" && (a[I].protocol = l[1]), l[0] === "DISKSIZE" && (a[I].size = b(l[1])), l[0] === "FILESYSTEMPERSONALITY" && (a[I].fsType = l[1]), l[0] === "MOUNTPOINT" && (a[I].mount = l[1]), l[0] === "VOLUMEUUID" && (a[I].uuid = l[1]), l[0] === "READ-ONLYMEDIA" && l[1] === "Yes" && (a[I].physical = "CD/DVD"), l[0] === "SOLIDSTATE" && l[1] === "Yes" && (a[I].physical = "SSD"), l[0] === "VIRTUAL" && (a[I].type = "virtual"), l[0] === "REMOVABLEMEDIA" && (a[I].removable = l[1] === "Removable"), l[0] === "PARTITIONTYPE" && (a[I].type = "part"), l[0] === "DEVICE/MEDIANAME" && (a[I].model = l[1]));
        }
    }), a;
  }
  function p(m) {
    let a = [];
    return m.filter((I) => I !== "").forEach((I) => {
      try {
        I = decodeURIComponent(I.replace(/\\x/g, "%")), I = I.replace(/\\/g, "\\\\");
        const t = JSON.parse(I);
        a.push({
          name: s.sanitizeShellString(t.name),
          type: t.type,
          fsType: t.fsType,
          mount: t.mountpoint,
          size: parseInt(t.size, 10),
          physical: t.type === "disk" ? t.rota === "0" ? "SSD" : "HDD" : t.type === "rom" ? "CD/DVD" : "",
          uuid: t.uuid,
          label: t.label,
          model: (t.model || "").trim(),
          serial: t.serial,
          removable: t.rm === "1",
          protocol: t.tran,
          group: t.group || ""
        });
      } catch {
        s.noop();
      }
    }), a = s.unique(a), a = s.sortByKey(a, ["type", "name"]), a;
  }
  function h(m) {
    const a = s.getValue(m, "md_level", "="), I = s.getValue(m, "md_name", "="), t = s.getValue(m, "md_uuid", "="), l = [];
    return m.forEach((D) => {
      D.toLowerCase().startsWith("md_device_dev") && D.toLowerCase().indexOf("/dev/") > 0 && l.push(D.split("/dev/")[1]);
    }), {
      raid: a,
      label: I,
      uuid: t,
      members: l
    };
  }
  function E(m) {
    let a = m;
    try {
      m.forEach((I) => {
        if (I.type.startsWith("raid")) {
          const t = g(`mdadm --export --detail /dev/${I.name}`, s.execOptsLinux).toString().split(`
`), l = h(t);
          I.label = l.label, I.uuid = l.uuid, l && l.members && l.members.length && l.raid === I.type && (a = a.map((D) => (D.fsType === "linux_raid_member" && l.members.indexOf(D.name) >= 0 && (D.group = I.name), D)));
        }
      });
    } catch {
      s.noop();
    }
    return a;
  }
  function u(m) {
    const a = [];
    return m.forEach((I) => {
      I.type.startsWith("disk") && a.push(I.name);
    }), a;
  }
  function o(m) {
    let a = m;
    try {
      const I = u(m);
      a = a.map((t) => ((t.type.startsWith("part") || t.type.startsWith("disk")) && I.forEach((l) => {
        t.name.startsWith(l) && (t.device = "/dev/" + l);
      }), t));
    } catch {
      s.noop();
    }
    return a;
  }
  function Q(m) {
    const a = [];
    return m.forEach((I) => {
      if (I.type.startsWith("disk") && a.push({ name: I.name, model: I.model, device: I.name }), I.type.startsWith("virtual")) {
        let t = "";
        a.forEach((l) => {
          l.model === I.model && (t = l.device);
        }), t && a.push({ name: I.name, model: I.model, device: t });
      }
    }), a;
  }
  function d(m) {
    let a = m;
    try {
      const I = Q(m);
      a = a.map((t) => ((t.type.startsWith("part") || t.type.startsWith("disk") || t.type.startsWith("virtual")) && I.forEach((l) => {
        t.name.startsWith(l.name) && (t.device = l.device);
      }), t));
    } catch {
      s.noop();
    }
    return a;
  }
  function c(m) {
    const a = [];
    return m.forEach((I) => {
      const t = I.split(`\r
`), l = s.getValue(t, "DeviceID", ":");
      let D = I.split("@{DeviceID=");
      D.length > 1 && (D = D.slice(1), D.forEach((f) => {
        a.push({ name: f.split(";")[0].toUpperCase(), device: l });
      }));
    }), a;
  }
  function n(m, a) {
    const I = c(a);
    return m.map((t) => {
      const l = I.filter((D) => D.name === t.name.toUpperCase());
      return l.length > 0 && (t.device = l[0].device), t;
    }), m;
  }
  function L(m) {
    return m.toString().replace(/NAME=/g, '{"name":').replace(/FSTYPE=/g, ',"fsType":').replace(/TYPE=/g, ',"type":').replace(/SIZE=/g, ',"size":').replace(/MOUNTPOINT=/g, ',"mountpoint":').replace(/UUID=/g, ',"uuid":').replace(/ROTA=/g, ',"rota":').replace(/RO=/g, ',"ro":').replace(/RM=/g, ',"rm":').replace(/TRAN=/g, ',"tran":').replace(/SERIAL=/g, ',"serial":').replace(/LABEL=/g, ',"label":').replace(/MODEL=/g, ',"model":').replace(/OWNER=/g, ',"owner":').replace(/GROUP=/g, ',"group":').replace(/\n/g, `}
`);
  }
  function G(m) {
    return new Promise((a) => {
      process.nextTick(() => {
        let I = [];
        if (F && A("lsblk -bPo NAME,TYPE,SIZE,FSTYPE,MOUNTPOINT,UUID,ROTA,RO,RM,TRAN,SERIAL,LABEL,MODEL,OWNER 2>/dev/null", { maxBuffer: 1048576 }, (l, D) => {
          if (l)
            A("lsblk -bPo NAME,TYPE,SIZE,FSTYPE,MOUNTPOINT,UUID,ROTA,RO,RM,LABEL,MODEL,OWNER 2>/dev/null", { maxBuffer: 1048576 }, (w, Y) => {
              if (!w) {
                const _ = L(Y).split(`
`);
                I = p(_), I = E(I);
              }
              m && m(I), a(I);
            }).on("error", () => {
              m && m(I), a(I);
            });
          else {
            const f = L(D).split(`
`);
            I = p(f), I = E(I), I = o(I), m && m(I), a(I);
          }
        }).on("error", () => {
          m && m(I), a(I);
        }), k && A("diskutil info -all", { maxBuffer: 1048576 }, (l, D) => {
          if (!l) {
            const f = D.toString().split(`
`);
            I = N(f), I = d(I);
          }
          m && m(I), a(I);
        }).on("error", () => {
          m && m(I), a(I);
        }), sA && (m && m(I), a(I)), P) {
          const t = ["Unknown", "NoRoot", "Removable", "Local", "Network", "CD/DVD", "RAM"];
          try {
            const l = [];
            l.push(s.powerShell("Get-CimInstance -ClassName Win32_LogicalDisk | select Caption,DriveType,Name,FileSystem,Size,VolumeSerialNumber,VolumeName | fl")), l.push(
              s.powerShell(
                "Get-WmiObject -Class Win32_diskdrive | Select-Object -Property PNPDeviceId,DeviceID, Model, Size, @{L='Partitions'; E={$_.GetRelated('Win32_DiskPartition').GetRelated('Win32_LogicalDisk') | Select-Object -Property DeviceID, VolumeName, Size, FreeSpace}} | fl"
              )
            ), s.promiseAll(l).then((D) => {
              const f = D.results[0].toString().split(/\n\s*\n/), w = D.results[1].toString().split(/\n\s*\n/);
              f.forEach((Y) => {
                const _ = Y.split(`\r
`), x = s.getValue(_, "drivetype", ":");
                x && I.push({
                  name: s.getValue(_, "name", ":"),
                  identifier: s.getValue(_, "caption", ":"),
                  type: "disk",
                  fsType: s.getValue(_, "filesystem", ":").toLowerCase(),
                  mount: s.getValue(_, "caption", ":"),
                  size: s.getValue(_, "size", ":"),
                  physical: x >= 0 && x <= 6 ? t[x] : t[0],
                  uuid: s.getValue(_, "volumeserialnumber", ":"),
                  label: s.getValue(_, "volumename", ":"),
                  model: "",
                  serial: s.getValue(_, "volumeserialnumber", ":"),
                  removable: x === "2",
                  protocol: "",
                  group: "",
                  device: ""
                });
              }), I = n(I, w), m && m(I), a(I);
            });
          } catch {
            m && m(I), a(I);
          }
        }
        (q || Z || $) && (m && m(null), a(null));
      });
    });
  }
  filesystem.blockDevices = G;
  function K(m, a) {
    const I = {
      rx: 0,
      wx: 0,
      tx: 0,
      rx_sec: null,
      wx_sec: null,
      tx_sec: null,
      ms: 0
    };
    return X && X.ms ? (I.rx = m, I.wx = a, I.tx = I.rx + I.wx, I.ms = Date.now() - X.ms, I.rx_sec = (I.rx - X.bytes_read) / (I.ms / 1e3), I.wx_sec = (I.wx - X.bytes_write) / (I.ms / 1e3), I.tx_sec = I.rx_sec + I.wx_sec, X.rx_sec = I.rx_sec, X.wx_sec = I.wx_sec, X.tx_sec = I.tx_sec, X.bytes_read = I.rx, X.bytes_write = I.wx, X.bytes_overall = I.rx + I.wx, X.ms = Date.now(), X.last_ms = I.ms) : (I.rx = m, I.wx = a, I.tx = I.rx + I.wx, X.rx_sec = null, X.wx_sec = null, X.tx_sec = null, X.bytes_read = I.rx, X.bytes_write = I.wx, X.bytes_overall = I.rx + I.wx, X.ms = Date.now(), X.last_ms = 0), I;
  }
  function gA(m) {
    return new Promise((a) => {
      process.nextTick(() => {
        if (P || q || Z || $ || sA)
          return a(null);
        let I = {
          rx: 0,
          wx: 0,
          tx: 0,
          rx_sec: null,
          wx_sec: null,
          tx_sec: null,
          ms: 0
        }, t = 0, l = 0;
        X && !X.ms || X && X.ms && Date.now() - X.ms >= 500 ? (F && A("lsblk -r 2>/dev/null | grep /", { maxBuffer: 1048576 }, (f, w) => {
          if (f)
            m && m(I), a(I);
          else {
            const Y = w.toString().split(`
`), _ = [];
            Y.forEach((z) => {
              z !== "" && (z = z.trim().split(" "), _.indexOf(z[0]) === -1 && _.push(z[0]));
            });
            const x = _.join("|");
            A('cat /proc/diskstats | egrep "' + x + '"', { maxBuffer: 1024 * 1024 }, (z, aA) => {
              z || (aA.toString().split(`
`).forEach((M) => {
                M = M.trim(), M !== "" && (M = M.replace(/ +/g, " ").split(" "), t += parseInt(M[5], 10) * 512, l += parseInt(M[9], 10) * 512);
              }), I = K(t, l)), m && m(I), a(I);
            }).on("error", () => {
              m && m(I), a(I);
            });
          }
        }).on("error", () => {
          m && m(I), a(I);
        }), k && A(
          `ioreg -c IOBlockStorageDriver -k Statistics -r -w0 | sed -n "/IOBlockStorageDriver/,/Statistics/p" | grep "Statistics" | tr -cd "01234567890,
"`,
          { maxBuffer: 1048576 },
          (f, w) => {
            f || (w.toString().split(`
`).forEach((_) => {
              _ = _.trim(), _ !== "" && (_ = _.split(","), t += parseInt(_[2], 10), l += parseInt(_[9], 10));
            }), I = K(t, l)), m && m(I), a(I);
          }
        ).on("error", () => {
          m && m(I), a(I);
        })) : (I.ms = X.last_ms, I.rx = X.bytes_read, I.wx = X.bytes_write, I.tx = X.bytes_read + X.bytes_write, I.rx_sec = X.rx_sec, I.wx_sec = X.wx_sec, I.tx_sec = X.tx_sec, m && m(I), a(I));
      });
    });
  }
  filesystem.fsStats = gA;
  function H(m, a, I, t, l) {
    const D = {
      rIO: 0,
      wIO: 0,
      tIO: 0,
      rIO_sec: null,
      wIO_sec: null,
      tIO_sec: null,
      rWaitTime: 0,
      wWaitTime: 0,
      tWaitTime: 0,
      rWaitPercent: null,
      wWaitPercent: null,
      tWaitPercent: null,
      ms: 0
    };
    return S && S.ms ? (D.rIO = m, D.wIO = a, D.tIO = m + a, D.ms = Date.now() - S.ms, D.rIO_sec = (D.rIO - S.rIO) / (D.ms / 1e3), D.wIO_sec = (D.wIO - S.wIO) / (D.ms / 1e3), D.tIO_sec = D.rIO_sec + D.wIO_sec, D.rWaitTime = I, D.wWaitTime = t, D.tWaitTime = l, D.rWaitPercent = (D.rWaitTime - S.rWaitTime) * 100 / D.ms, D.wWaitPercent = (D.wWaitTime - S.wWaitTime) * 100 / D.ms, D.tWaitPercent = (D.tWaitTime - S.tWaitTime) * 100 / D.ms, S.rIO = m, S.wIO = a, S.rIO_sec = D.rIO_sec, S.wIO_sec = D.wIO_sec, S.tIO_sec = D.tIO_sec, S.rWaitTime = I, S.wWaitTime = t, S.tWaitTime = l, S.rWaitPercent = D.rWaitPercent, S.wWaitPercent = D.wWaitPercent, S.tWaitPercent = D.tWaitPercent, S.last_ms = D.ms, S.ms = Date.now()) : (D.rIO = m, D.wIO = a, D.tIO = m + a, D.rWaitTime = I, D.wWaitTime = t, D.tWaitTime = l, S.rIO = m, S.wIO = a, S.rIO_sec = null, S.wIO_sec = null, S.tIO_sec = null, S.rWaitTime = I, S.wWaitTime = t, S.tWaitTime = l, S.rWaitPercent = null, S.wWaitPercent = null, S.tWaitPercent = null, S.last_ms = 0, S.ms = Date.now()), D;
  }
  function U(m) {
    return new Promise((a) => {
      process.nextTick(() => {
        if (P || sA)
          return a(null);
        let I = {
          rIO: 0,
          wIO: 0,
          tIO: 0,
          rIO_sec: null,
          wIO_sec: null,
          tIO_sec: null,
          rWaitTime: 0,
          wWaitTime: 0,
          tWaitTime: 0,
          rWaitPercent: null,
          wWaitPercent: null,
          tWaitPercent: null,
          ms: 0
        }, t = 0, l = 0, D = 0, f = 0, w = 0;
        S && !S.ms || S && S.ms && Date.now() - S.ms >= 500 ? ((F || q || Z || $) && A('for mount in `lsblk 2>/dev/null | grep " disk " | sed "s/[│└─├]//g" | awk \'{$1=$1};1\' | cut -d " " -f 1 | sort -u`; do cat /sys/block/$mount/stat | sed -r "s/ +/;/g" | sed -r "s/^;//"; done', { maxBuffer: 1024 * 1024 }, (_, x) => {
          _ ? (m && m(I), a(I)) : (x.split(`
`).forEach((z) => {
            if (!z)
              return;
            const aA = z.split(";");
            t += parseInt(aA[0], 10), l += parseInt(aA[4], 10), D += parseInt(aA[3], 10), f += parseInt(aA[7], 10), w += parseInt(aA[10], 10);
          }), I = H(t, l, D, f, w), m && m(I), a(I));
        }), k && A(
          `ioreg -c IOBlockStorageDriver -k Statistics -r -w0 | sed -n "/IOBlockStorageDriver/,/Statistics/p" | grep "Statistics" | tr -cd "01234567890,
"`,
          { maxBuffer: 1024 * 1024 },
          (Y, _) => {
            Y || (_.toString().split(`
`).forEach((W) => {
              W = W.trim(), W !== "" && (W = W.split(","), t += parseInt(W[10], 10), l += parseInt(W[0], 10));
            }), I = H(t, l, D, f, w)), m && m(I), a(I);
          }
        )) : (I.rIO = S.rIO, I.wIO = S.wIO, I.tIO = S.rIO + S.wIO, I.ms = S.last_ms, I.rIO_sec = S.rIO_sec, I.wIO_sec = S.wIO_sec, I.tIO_sec = S.tIO_sec, I.rWaitTime = S.rWaitTime, I.wWaitTime = S.wWaitTime, I.tWaitTime = S.tWaitTime, I.rWaitPercent = S.rWaitPercent, I.wWaitPercent = S.wWaitPercent, I.tWaitPercent = S.tWaitPercent, m && m(I), a(I));
      });
    });
  }
  filesystem.disksIO = U;
  function V(m) {
    function a(I) {
      const t = [
        { pattern: "WESTERN.*", manufacturer: "Western Digital" },
        { pattern: "^WDC.*", manufacturer: "Western Digital" },
        { pattern: "WD.*", manufacturer: "Western Digital" },
        { pattern: "TOSHIBA.*", manufacturer: "Toshiba" },
        { pattern: "HITACHI.*", manufacturer: "Hitachi" },
        { pattern: "^IC.*", manufacturer: "Hitachi" },
        { pattern: "^HTS.*", manufacturer: "Hitachi" },
        { pattern: "SANDISK.*", manufacturer: "SanDisk" },
        { pattern: "KINGSTON.*", manufacturer: "Kingston Technology" },
        { pattern: "^SONY.*", manufacturer: "Sony" },
        { pattern: "TRANSCEND.*", manufacturer: "Transcend" },
        { pattern: "SAMSUNG.*", manufacturer: "Samsung" },
        { pattern: "^ST(?!I\\ ).*", manufacturer: "Seagate" },
        { pattern: "^STI\\ .*", manufacturer: "SimpleTech" },
        { pattern: "^D...-.*", manufacturer: "IBM" },
        { pattern: "^IBM.*", manufacturer: "IBM" },
        { pattern: "^FUJITSU.*", manufacturer: "Fujitsu" },
        { pattern: "^MP.*", manufacturer: "Fujitsu" },
        { pattern: "^MK.*", manufacturer: "Toshiba" },
        { pattern: "MAXTO.*", manufacturer: "Maxtor" },
        { pattern: "PIONEER.*", manufacturer: "Pioneer" },
        { pattern: "PHILIPS.*", manufacturer: "Philips" },
        { pattern: "QUANTUM.*", manufacturer: "Quantum Technology" },
        { pattern: "FIREBALL.*", manufacturer: "Quantum Technology" },
        { pattern: "^VBOX.*", manufacturer: "VirtualBox" },
        { pattern: "CORSAIR.*", manufacturer: "Corsair Components" },
        { pattern: "CRUCIAL.*", manufacturer: "Crucial" },
        { pattern: "ECM.*", manufacturer: "ECM" },
        { pattern: "INTEL.*", manufacturer: "INTEL" },
        { pattern: "EVO.*", manufacturer: "Samsung" },
        { pattern: "APPLE.*", manufacturer: "Apple" }
      ];
      let l = "";
      return I && (I = I.toUpperCase(), t.forEach((D) => {
        RegExp(D.pattern).test(I) && (l = D.manufacturer);
      })), l;
    }
    return new Promise((I) => {
      process.nextTick(() => {
        const t = (f) => {
          for (let w = 0; w < f.length; w++)
            delete f[w].BSDName;
          m && m(f), I(f);
        }, l = [];
        let D = "";
        if (F) {
          let f = "";
          A("export LC_ALL=C; lsblk -ablJO 2>/dev/null; unset LC_ALL", { maxBuffer: 1024 * 1024 }, (w, Y) => {
            if (!w)
              try {
                const _ = Y.toString().trim();
                let x = [];
                try {
                  const W = JSON.parse(_);
                  W && {}.hasOwnProperty.call(W, "blockdevices") && (x = W.blockdevices.filter((z) => z.type === "disk" && z.size > 0 && (z.model !== null || z.mountpoint === null && z.label === null && z.fstype === null && z.parttype === null && z.path && z.path.indexOf("/ram") !== 0 && z.path.indexOf("/loop") !== 0 && z["disc-max"] && z["disc-max"] !== 0)));
                } catch {
                  try {
                    const W = g(
                      "export LC_ALL=C; lsblk -bPo NAME,TYPE,SIZE,FSTYPE,MOUNTPOINT,UUID,ROTA,RO,RM,LABEL,MODEL,OWNER,GROUP 2>/dev/null; unset LC_ALL",
                      s.execOptsLinux
                    ).toString(), z = L(W).split(`
`);
                    x = p(z).filter((tA) => tA.type === "disk" && tA.size > 0 && (tA.model !== null && tA.model !== "" || tA.mount === "" && tA.label === "" && tA.fsType === ""));
                  } catch {
                    s.noop();
                  }
                }
                x.forEach((W) => {
                  let z = "";
                  const aA = "/dev/" + W.name, tA = W.name;
                  try {
                    z = g("cat /sys/block/" + tA + "/queue/rotational 2>/dev/null", s.execOptsLinux).toString().split(`
`)[0];
                  } catch {
                    s.noop();
                  }
                  let M = W.tran ? W.tran.toUpperCase().trim() : "";
                  M === "NVME" && (z = "2", M = "PCIe"), l.push({
                    device: aA,
                    type: z === "0" ? "SSD" : z === "1" ? "HD" : z === "2" ? "NVMe" : W.model && W.model.indexOf("SSD") > -1 ? "SSD" : W.model && W.model.indexOf("NVM") > -1 ? "NVMe" : "HD",
                    name: W.model || "",
                    vendor: a(W.model) || (W.vendor ? W.vendor.trim() : ""),
                    size: W.size || 0,
                    bytesPerSector: null,
                    totalCylinders: null,
                    totalHeads: null,
                    totalSectors: null,
                    totalTracks: null,
                    tracksPerCylinder: null,
                    sectorsPerTrack: null,
                    firmwareRevision: W.rev ? W.rev.trim() : "",
                    serialNum: W.serial ? W.serial.trim() : "",
                    interfaceType: M,
                    smartStatus: "unknown",
                    temperature: null,
                    BSDName: aA
                  }), D += `printf "
${aA}|"; smartctl -H ${aA} | grep overall;`, f += `${f ? 'printf ",";' : ""}smartctl -a -j ${aA};`;
                });
              } catch {
                s.noop();
              }
            f ? A(f, { maxBuffer: 1024 * 1024 }, (_, x) => {
              try {
                JSON.parse(`[${x}]`).forEach((z) => {
                  const aA = z.smartctl.argv[z.smartctl.argv.length - 1];
                  for (let tA = 0; tA < l.length; tA++)
                    l[tA].BSDName === aA && (l[tA].smartStatus = z.smart_status.passed ? "Ok" : z.smart_status.passed === !1 ? "Predicted Failure" : "unknown", z.temperature && z.temperature.current && (l[tA].temperature = z.temperature.current), l[tA].smartData = z);
                }), t(l);
              } catch {
                D ? (D = D + `printf "
"`, A(D, { maxBuffer: 1024 * 1024 }, (W, z) => {
                  z.toString().split(`
`).forEach((tA) => {
                    if (tA) {
                      const M = tA.split("|");
                      if (M.length === 2) {
                        const O = M[0];
                        M[1] = M[1].trim();
                        const v = M[1].split(":");
                        if (v.length === 2) {
                          v[1] = v[1].trim();
                          const y = v[1].toLowerCase();
                          for (let AA = 0; AA < l.length; AA++)
                            l[AA].BSDName === O && (l[AA].smartStatus = y === "passed" ? "Ok" : y === "failed!" ? "Predicted Failure" : "unknown");
                        }
                      }
                    }
                  }), t(l);
                })) : t(l);
              }
            }) : t(l);
          });
        }
        if ((q || Z || $) && (m && m(l), I(l)), sA && (m && m(l), I(l)), k && A("system_profiler SPSerialATADataType SPNVMeDataType SPUSBDataType", { maxBuffer: 1024 * 1024 }, (f, w) => {
          if (f)
            t(l);
          else {
            const Y = w.toString().split(`
`), _ = [], x = [], W = [];
            let z = "SATA";
            Y.forEach((aA) => {
              aA === "NVMExpress:" ? z = "NVMe" : aA === "USB:" ? z = "USB" : aA === "SATA/SATA Express:" ? z = "SATA" : z === "SATA" ? _.push(aA) : z === "NVMe" ? x.push(aA) : z === "USB" && W.push(aA);
            });
            try {
              const aA = _.join(`
`).split(" Physical Interconnect: ");
              aA.shift(), aA.forEach((tA) => {
                tA = "InterfaceType: " + tA;
                const M = tA.split(`
`), O = s.getValue(M, "Medium Type", ":", !0).trim(), v = s.getValue(M, "capacity", ":", !0).trim(), y = s.getValue(M, "BSD Name", ":", !0).trim();
                if (v) {
                  let AA = 0;
                  if (v.indexOf("(") >= 0 && (AA = parseInt(
                    v.match(/\(([^)]+)\)/)[1].replace(/\./g, "").replace(/,/g, "").replace(/\s/g, ""),
                    10
                  )), AA || (AA = parseInt(v, 10)), AA) {
                    const oA = s.getValue(M, "S.M.A.R.T. status", ":", !0).trim().toLowerCase();
                    l.push({
                      device: y,
                      type: O.startsWith("Solid") ? "SSD" : "HD",
                      name: s.getValue(M, "Model", ":", !0).trim(),
                      vendor: a(s.getValue(M, "Model", ":", !0).trim()) || s.getValue(M, "Manufacturer", ":", !0),
                      size: AA,
                      bytesPerSector: null,
                      totalCylinders: null,
                      totalHeads: null,
                      totalSectors: null,
                      totalTracks: null,
                      tracksPerCylinder: null,
                      sectorsPerTrack: null,
                      firmwareRevision: s.getValue(M, "Revision", ":", !0).trim(),
                      serialNum: s.getValue(M, "Serial Number", ":", !0).trim(),
                      interfaceType: s.getValue(M, "InterfaceType", ":", !0).trim(),
                      smartStatus: oA === "verified" ? "OK" : oA || "unknown",
                      temperature: null,
                      BSDName: y
                    }), D = D + `printf "
` + y + '|"; diskutil info /dev/' + y + " | grep SMART;";
                  }
                }
              });
            } catch {
              s.noop();
            }
            try {
              const aA = x.join(`
`).split(`

          Capacity:`);
              aA.shift(), aA.forEach((tA) => {
                tA = `!Capacity: ${tA}`;
                const M = tA.split(`
`), O = s.getValue(M, "link width", ":", !0).trim(), v = s.getValue(M, "!capacity", ":", !0).trim(), y = s.getValue(M, "BSD Name", ":", !0).trim();
                if (v) {
                  let AA = 0;
                  if (v.indexOf("(") >= 0 && (AA = parseInt(
                    v.match(/\(([^)]+)\)/)[1].replace(/\./g, "").replace(/,/g, "").replace(/\s/g, ""),
                    10
                  )), AA || (AA = parseInt(v, 10)), AA) {
                    const oA = s.getValue(M, "S.M.A.R.T. status", ":", !0).trim().toLowerCase();
                    l.push({
                      device: y,
                      type: "NVMe",
                      name: s.getValue(M, "Model", ":", !0).trim(),
                      vendor: a(s.getValue(M, "Model", ":", !0).trim()),
                      size: AA,
                      bytesPerSector: null,
                      totalCylinders: null,
                      totalHeads: null,
                      totalSectors: null,
                      totalTracks: null,
                      tracksPerCylinder: null,
                      sectorsPerTrack: null,
                      firmwareRevision: s.getValue(M, "Revision", ":", !0).trim(),
                      serialNum: s.getValue(M, "Serial Number", ":", !0).trim(),
                      interfaceType: ("PCIe " + O).trim(),
                      smartStatus: oA === "verified" ? "OK" : oA || "unknown",
                      temperature: null,
                      BSDName: y
                    }), D = `${D}printf "
${y}|"; diskutil info /dev/${y} | grep SMART;`;
                  }
                }
              });
            } catch {
              s.noop();
            }
            try {
              const aA = W.join(`
`).replaceAll(`Media:
 `, "Model:").split(`

          Product ID:`);
              aA.shift(), aA.forEach((tA) => {
                const M = tA.split(`
`), O = s.getValue(M, "Capacity", ":", !0).trim(), v = s.getValue(M, "BSD Name", ":", !0).trim();
                if (O) {
                  let y = 0;
                  if (O.indexOf("(") >= 0 && (y = parseInt(
                    O.match(/\(([^)]+)\)/)[1].replace(/\./g, "").replace(/,/g, "").replace(/\s/g, ""),
                    10
                  )), y || (y = parseInt(O, 10)), y) {
                    const AA = s.getValue(M, "S.M.A.R.T. status", ":", !0).trim().toLowerCase();
                    l.push({
                      device: v,
                      type: "USB",
                      name: s.getValue(M, "Model", ":", !0).trim().replaceAll(":", ""),
                      vendor: a(s.getValue(M, "Model", ":", !0).trim()),
                      size: y,
                      bytesPerSector: null,
                      totalCylinders: null,
                      totalHeads: null,
                      totalSectors: null,
                      totalTracks: null,
                      tracksPerCylinder: null,
                      sectorsPerTrack: null,
                      firmwareRevision: s.getValue(M, "Revision", ":", !0).trim(),
                      serialNum: s.getValue(M, "Serial Number", ":", !0).trim(),
                      interfaceType: "USB",
                      smartStatus: AA === "verified" ? "OK" : AA || "unknown",
                      temperature: null,
                      BSDName: v
                    }), D = D + `printf "
` + v + '|"; diskutil info /dev/' + v + " | grep SMART;";
                  }
                }
              });
            } catch {
              s.noop();
            }
            D ? (D = D + `printf "
"`, A(D, { maxBuffer: 1024 * 1024 }, (aA, tA) => {
              tA.toString().split(`
`).forEach((O) => {
                if (O) {
                  const v = O.split("|");
                  if (v.length === 2) {
                    const y = v[0];
                    v[1] = v[1].trim();
                    const AA = v[1].split(":");
                    if (AA.length === 2) {
                      AA[1] = AA[1].trim();
                      const oA = AA[1].toLowerCase();
                      for (let rA = 0; rA < l.length; rA++)
                        l[rA].BSDName === y && (l[rA].smartStatus = oA === "not supported" ? "not supported" : oA === "verified" ? "Ok" : oA === "failing" ? "Predicted Failure" : "unknown");
                    }
                  }
                }
              }), t(l);
            })) : t(l);
          }
        }), P)
          try {
            const f = [];
            if (f.push(
              s.powerShell(
                "Get-CimInstance Win32_DiskDrive | select Caption,Size,Status,PNPDeviceId,DeviceId,BytesPerSector,TotalCylinders,TotalHeads,TotalSectors,TotalTracks,TracksPerCylinder,SectorsPerTrack,FirmwareRevision,SerialNumber,InterfaceType | fl"
              )
            ), f.push(s.powerShell("Get-PhysicalDisk | select BusType,MediaType,FriendlyName,Model,SerialNumber,Size | fl")), s.smartMonToolsInstalled())
              try {
                const w = JSON.parse(g("smartctl --scan -j").toString());
                w && w.devices && w.devices.length > 0 && w.devices.forEach((Y) => {
                  f.push(r(`smartctl -j -a ${Y.name}`, s.execOptsWin));
                });
              } catch {
                s.noop();
              }
            s.promiseAll(f).then((w) => {
              let Y = w.results[0].toString().split(/\n\s*\n/);
              Y.forEach((_) => {
                const x = _.split(`\r
`), W = s.getValue(x, "Size", ":").trim(), z = s.getValue(x, "Status", ":").trim().toLowerCase();
                W && l.push({
                  device: s.getValue(x, "DeviceId", ":"),
                  // changed from PNPDeviceId to DeviceID (be be able to match devices)
                  type: _.indexOf("SSD") > -1 ? "SSD" : "HD",
                  // just a starting point ... better: MSFT_PhysicalDisk - Media Type ... see below
                  name: s.getValue(x, "Caption", ":"),
                  vendor: a(s.getValue(x, "Caption", ":", !0).trim()),
                  size: parseInt(W, 10),
                  bytesPerSector: parseInt(s.getValue(x, "BytesPerSector", ":"), 10),
                  totalCylinders: parseInt(s.getValue(x, "TotalCylinders", ":"), 10),
                  totalHeads: parseInt(s.getValue(x, "TotalHeads", ":"), 10),
                  totalSectors: parseInt(s.getValue(x, "TotalSectors", ":"), 10),
                  totalTracks: parseInt(s.getValue(x, "TotalTracks", ":"), 10),
                  tracksPerCylinder: parseInt(s.getValue(x, "TracksPerCylinder", ":"), 10),
                  sectorsPerTrack: parseInt(s.getValue(x, "SectorsPerTrack", ":"), 10),
                  firmwareRevision: s.getValue(x, "FirmwareRevision", ":").trim(),
                  serialNum: s.getValue(x, "SerialNumber", ":").trim(),
                  interfaceType: s.getValue(x, "InterfaceType", ":").trim(),
                  smartStatus: z === "ok" ? "Ok" : z === "degraded" ? "Degraded" : z === "pred fail" ? "Predicted Failure" : "Unknown",
                  temperature: null
                });
              }), Y = w.results[1].split(/\n\s*\n/), Y.forEach((_) => {
                const x = _.split(`\r
`), W = s.getValue(x, "SerialNumber", ":").trim(), z = s.getValue(x, "FriendlyName", ":").trim().replace("Msft ", "Microsoft"), aA = s.getValue(x, "Size", ":").trim(), tA = s.getValue(x, "Model", ":").trim(), M = s.getValue(x, "BusType", ":").trim();
                let O = s.getValue(x, "MediaType", ":").trim();
                if ((O === "3" || O === "HDD") && (O = "HD"), O === "4" && (O = "SSD"), O === "5" && (O = "SCM"), O === "Unspecified" && (tA.toLowerCase().indexOf("virtual") > -1 || tA.toLowerCase().indexOf("vbox") > -1) && (O = "Virtual"), aA) {
                  let v = s.findObjectByKey(l, "serialNum", W);
                  (v === -1 || W === "") && (v = s.findObjectByKey(l, "name", z)), v !== -1 && (l[v].type = O, l[v].interfaceType = M);
                }
              }), w.results.shift(), w.results.shift(), w.results.length && w.results.forEach((_) => {
                try {
                  const x = JSON.parse(_);
                  if (x.serial_number) {
                    const W = x.serial_number, z = s.findObjectByKey(l, "serialNum", W);
                    z !== -1 && (l[z].smartStatus = x.smart_status && x.smart_status.passed ? "Ok" : x.smart_status && x.smart_status.passed === !1 ? "Predicted Failure" : "unknown", x.temperature && x.temperature.current && (l[z].temperature = x.temperature.current), l[z].smartData = x);
                  }
                } catch {
                  s.noop();
                }
              }), m && m(l), I(l);
            });
          } catch {
            m && m(l), I(l);
          }
      });
    });
  }
  return filesystem.diskLayout = V, filesystem;
}
var network = {}, hasRequiredNetwork;
function requireNetwork() {
  if (hasRequiredNetwork) return network;
  hasRequiredNetwork = 1;
  const s = require$$0$1, e = require$$1.exec, A = require$$1.execSync, g = require$$1$1, r = requireUtil(), B = process.platform, F = B === "linux" || B === "android", k = B === "darwin", P = B === "win32", q = B === "freebsd", Z = B === "openbsd", $ = B === "netbsd", sA = B === "sunos", X = {};
  let S = "", J = {}, eA = [], b = [], N = {}, p;
  function h() {
    let M = "", O = "";
    try {
      const v = s.networkInterfaces();
      let y = 9999;
      for (let AA in v)
        ({}).hasOwnProperty.call(v, AA) && v[AA].forEach((oA) => {
          oA && oA.internal === !1 && (O = O || AA, oA.scopeid && oA.scopeid < y && (M = AA, y = oA.scopeid));
        });
      if (M = M || O || "", P) {
        let AA = "";
        if (A("netstat -r", r.execOptsWin).toString().split(s.EOL).forEach((lA) => {
          if (lA = lA.replace(/\s+/g, " ").trim(), lA.indexOf("0.0.0.0 0.0.0.0") > -1 && !/[a-zA-Z]/.test(lA)) {
            const pA = lA.split(" ");
            pA.length >= 5 && (AA = pA[pA.length - 2]);
          }
        }), AA)
          for (let lA in v)
            ({}).hasOwnProperty.call(v, lA) && v[lA].forEach((pA) => {
              pA && pA.address && pA.address === AA && (M = lA);
            });
      }
      if (F) {
        const rA = A("ip route 2> /dev/null | grep default", r.execOptsLinux).toString().split(`
`)[0].split(/\s+/);
        rA[0] === "none" && rA[5] ? M = rA[5] : rA[4] && (M = rA[4]), M.indexOf(":") > -1 && (M = M.split(":")[1].trim());
      }
      if (k || q || Z || $ || sA) {
        let AA = "";
        F && (AA = "ip route 2> /dev/null | grep default | awk '{print $5}'"), k && (AA = "route -n get default 2>/dev/null | grep interface: | awk '{print $2}'"), (q || Z || $ || sA) && (AA = "route get 0.0.0.0 | grep interface:"), M = A(AA).toString().split(`
`)[0], M.indexOf(":") > -1 && (M = M.split(":")[1].trim());
      }
    } catch {
      r.noop();
    }
    return M && (S = M), S;
  }
  network.getDefaultNetworkInterface = h;
  function E() {
    let M = "", O = "";
    const v = {};
    if (F || q || Z || $) {
      if (typeof p > "u")
        try {
          const y = A("which ip", r.execOptsLinux).toString().split(`
`);
          y.length && y[0].indexOf(":") === -1 && y[0].indexOf("/") === 0 ? p = y[0] : p = "";
        } catch {
          p = "";
        }
      try {
        const y = "export LC_ALL=C; " + (p ? p + " link show up" : "/sbin/ifconfig") + "; unset LC_ALL", oA = A(y, r.execOptsLinux).toString().split(`
`);
        for (let rA = 0; rA < oA.length; rA++)
          if (oA[rA] && oA[rA][0] !== " ") {
            if (p) {
              const cA = oA[rA + 1].trim().split(" ");
              cA[0] === "link/ether" && (M = oA[rA].split(" ")[1], M = M.slice(0, M.length - 1), O = cA[1]);
            } else
              M = oA[rA].split(" ")[0], O = oA[rA].split("HWaddr ")[1];
            M && O && (v[M] = O.trim(), M = "", O = "");
          }
      } catch {
        r.noop();
      }
    }
    if (k)
      try {
        const oA = A("/sbin/ifconfig").toString().split(`
`);
        for (let rA = 0; rA < oA.length; rA++)
          oA[rA] && oA[rA][0] !== "	" && oA[rA].indexOf(":") > 0 ? M = oA[rA].split(":")[0] : oA[rA].indexOf("	ether ") === 0 && (O = oA[rA].split("	ether ")[1], M && O && (v[M] = O.trim(), M = "", O = ""));
      } catch {
        r.noop();
      }
    return v;
  }
  function u(M) {
    return new Promise((O) => {
      process.nextTick(() => {
        const v = h();
        M && M(v), O(v);
      });
    });
  }
  network.networkInterfaceDefault = u;
  function o(M, O) {
    const v = [];
    for (let y in M)
      try {
        if ({}.hasOwnProperty.call(M, y) && M[y].trim() !== "") {
          const AA = M[y].trim().split(`\r
`);
          let oA = null;
          try {
            oA = O && O[y] ? O[y].trim().split(`\r
`) : [];
          } catch {
            r.noop();
          }
          const rA = r.getValue(AA, "NetEnabled", ":");
          let cA = r.getValue(AA, "AdapterTypeID", ":") === "9" ? "wireless" : "wired";
          const lA = r.getValue(AA, "Name", ":").replace(/\]/g, ")").replace(/\[/g, "("), pA = r.getValue(AA, "NetConnectionID", ":").replace(/\]/g, ")").replace(/\[/g, "(");
          if ((lA.toLowerCase().indexOf("wi-fi") >= 0 || lA.toLowerCase().indexOf("wireless") >= 0) && (cA = "wireless"), rA !== "") {
            const BA = parseInt(r.getValue(AA, "speed", ":").trim(), 10) / 1e6;
            v.push({
              mac: r.getValue(AA, "MACAddress", ":").toLowerCase(),
              dhcp: r.getValue(oA, "dhcpEnabled", ":").toLowerCase() === "true",
              name: lA,
              iface: pA,
              netEnabled: rA === "TRUE",
              speed: isNaN(BA) ? null : BA,
              operstate: r.getValue(AA, "NetConnectionStatus", ":") === "2" ? "up" : "down",
              type: cA
            });
          }
        }
      } catch {
        r.noop();
      }
    return v;
  }
  function Q() {
    return new Promise((M) => {
      process.nextTick(() => {
        let O = "Get-CimInstance Win32_NetworkAdapter | fl *; echo '#-#-#-#';";
        O += "Get-CimInstance Win32_NetworkAdapterConfiguration | fl DHCPEnabled";
        try {
          r.powerShell(O).then((v) => {
            v = v.split("#-#-#-#");
            const y = (v[0] || "").split(/\n\s*\n/), AA = (v[1] || "").split(/\n\s*\n/);
            M(o(y, AA));
          });
        } catch {
          M([]);
        }
      });
    });
  }
  function d() {
    let M = {};
    const O = {
      primaryDNS: "",
      exitCode: 0,
      ifaces: []
    };
    try {
      return A("ipconfig /all", r.execOptsWin).split(`\r
\r
`).forEach((AA, oA) => {
        if (oA === 1) {
          const rA = AA.split(`\r
`).filter((lA) => lA.toUpperCase().includes("DNS")), cA = rA[0].substring(rA[0].lastIndexOf(":") + 1);
          O.primaryDNS = cA.trim(), O.primaryDNS || (O.primaryDNS = "Not defined");
        }
        if (oA > 1)
          if (oA % 2 === 0) {
            const rA = AA.substring(AA.lastIndexOf(" ") + 1).replace(":", "");
            M.name = rA;
          } else {
            const rA = AA.split(`\r
`).filter((lA) => lA.toUpperCase().includes("DNS")), cA = rA[0].substring(rA[0].lastIndexOf(":") + 1);
            M.dnsSuffix = cA.trim(), O.ifaces.push(M), M = {};
          }
      }), O;
    } catch {
      return {
        primaryDNS: "",
        exitCode: 0,
        ifaces: []
      };
    }
  }
  function c(M, O) {
    let v = "";
    const y = O + ".";
    try {
      const AA = M.filter((oA) => y.includes(oA.name + ".")).map((oA) => oA.dnsSuffix);
      return AA[0] && (v = AA[0]), v || (v = ""), v;
    } catch {
      return "Unknown";
    }
  }
  function n() {
    try {
      return A("netsh lan show profiles", r.execOptsWin).split(`\r
Profile on interface`);
    } catch (M) {
      return M.status === 1 && M.stdout.includes("AutoConfig") ? "Disabled" : [];
    }
  }
  function L(M) {
    try {
      return A(`netsh wlan show  interface name="${M}" | findstr "SSID"`, r.execOptsWin).split(`\r
`).shift().split(":").pop().trim();
    } catch {
      return "Unknown";
    }
  }
  function G(M, O, v) {
    const y = {
      state: "Unknown",
      protocol: "Unknown"
    };
    if (v === "Disabled")
      return y.state = "Disabled", y.protocol = "Not defined", y;
    if (M === "wired" && v.length > 0)
      try {
        const oA = v.find((cA) => cA.includes(O + `\r
`)).split(`\r
`), rA = oA.find((cA) => cA.includes("802.1x"));
        if (rA.includes("Disabled"))
          y.state = "Disabled", y.protocol = "Not defined";
        else if (rA.includes("Enabled")) {
          const cA = oA.find((lA) => lA.includes("EAP"));
          y.protocol = cA.split(":").pop(), y.state = "Enabled";
        }
      } catch {
        return y;
      }
    else if (M === "wireless") {
      let AA = "", oA = "";
      try {
        const rA = L(O);
        if (rA !== "Unknown") {
          let cA = "";
          const lA = r.isPrototypePolluted() ? "---" : r.sanitizeShellString(rA), pA = r.mathMin(lA.length, 32);
          for (let uA = 0; uA <= pA; uA++)
            lA[uA] !== void 0 && (cA = cA + lA[uA]);
          const BA = A(`netsh wlan show profiles "${cA}"`, r.execOptsWin).split(`\r
`);
          AA = (BA.find((uA) => uA.indexOf("802.1X") >= 0) || "").trim(), oA = (BA.find((uA) => uA.indexOf("EAP") >= 0) || "").trim();
        }
        AA.includes(":") && oA.includes(":") && (y.state = AA.split(":").pop(), y.protocol = oA.split(":").pop());
      } catch {
        return error.status === 1 && error.stdout.includes("AutoConfig") && (y.state = "Disabled", y.protocol = "Not defined"), y;
      }
    }
    return y;
  }
  function K(M) {
    const O = [];
    let v = [];
    return M.forEach((y) => {
      !y.startsWith("	") && !y.startsWith(" ") && v.length && (O.push(v), v = []), v.push(y);
    }), v.length && O.push(v), O;
  }
  function gA(M) {
    const O = [];
    return M.forEach((v) => {
      const y = {
        iface: "",
        mtu: null,
        mac: "",
        ip6: "",
        ip4: "",
        speed: null,
        type: "",
        operstate: "",
        duplex: "",
        internal: !1
      }, AA = v[0];
      y.iface = AA.split(":")[0].trim();
      const oA = AA.split("> mtu");
      y.mtu = oA.length > 1 ? parseInt(oA[1], 10) : null, isNaN(y.mtu) && (y.mtu = null), y.internal = oA[0].toLowerCase().indexOf("loopback") > -1, v.forEach((lA) => {
        lA.trim().startsWith("ether ") && (y.mac = lA.split("ether ")[1].toLowerCase().trim()), lA.trim().startsWith("inet6 ") && !y.ip6 && (y.ip6 = lA.split("inet6 ")[1].toLowerCase().split("%")[0].split(" ")[0]), lA.trim().startsWith("inet ") && !y.ip4 && (y.ip4 = lA.split("inet ")[1].toLowerCase().split(" ")[0]);
      });
      let rA = r.getValue(v, "link rate");
      y.speed = rA ? parseFloat(rA) : null, y.speed === null ? (rA = r.getValue(v, "uplink rate"), y.speed = rA ? parseFloat(rA) : null, y.speed !== null && rA.toLowerCase().indexOf("gbps") >= 0 && (y.speed = y.speed * 1e3)) : rA.toLowerCase().indexOf("gbps") >= 0 && (y.speed = y.speed * 1e3), y.type = r.getValue(v, "type").toLowerCase().indexOf("wi-fi") > -1 ? "wireless" : "wired";
      const cA = r.getValue(v, "status").toLowerCase();
      y.operstate = cA === "active" ? "up" : cA === "inactive" ? "down" : "unknown", y.duplex = r.getValue(v, "media").toLowerCase().indexOf("half-duplex") > -1 ? "half" : "full", (y.ip6 || y.ip4 || y.mac) && O.push(y);
    }), O;
  }
  function H() {
    const M = "/sbin/ifconfig -v";
    try {
      const O = A(M, { maxBuffer: 104857600 }).toString().split(`
`), v = K(O);
      return gA(v);
    } catch {
      return [];
    }
  }
  function U(M) {
    const O = `nmcli device status 2>/dev/null | grep ${M}`;
    try {
      const oA = A(O, r.execOptsLinux).toString().replace(/\s+/g, " ").trim().split(" ").slice(3).join(" ");
      return oA !== "--" ? oA : "";
    } catch {
      return "";
    }
  }
  function V(M) {
    let O = [];
    try {
      const v = `cat ${M} 2> /dev/null | grep 'iface\\|source'`;
      A(v, r.execOptsLinux).toString().split(`
`).forEach((AA) => {
        const oA = AA.replace(/\s+/g, " ").trim().split(" ");
        if (oA.length >= 4 && AA.toLowerCase().indexOf(" inet ") >= 0 && AA.toLowerCase().indexOf("dhcp") >= 0 && O.push(oA[1]), AA.toLowerCase().includes("source")) {
          const rA = AA.split(" ")[1];
          O = O.concat(V(rA));
        }
      });
    } catch {
      r.noop();
    }
    return O;
  }
  function m() {
    const M = "ip a 2> /dev/null";
    let O = [];
    try {
      const v = A(M, r.execOptsLinux).toString().split(`
`), y = K(v);
      O = a(y);
    } catch {
      r.noop();
    }
    try {
      O = V("/etc/network/interfaces");
    } catch {
      r.noop();
    }
    return O;
  }
  function a(M) {
    const O = [];
    return M && M.length && M.forEach((v) => {
      if (v && v.length && v[0].split(":").length > 2) {
        for (let AA of v)
          if (AA.indexOf(" inet ") >= 0 && AA.indexOf(" dynamic ") >= 0) {
            const oA = AA.split(" "), rA = oA[oA.length - 1].trim();
            O.push(rA);
            break;
          }
      }
    }), O;
  }
  function I(M, O, v) {
    let y = !1;
    if (O) {
      const AA = `nmcli connection show "${O}" 2>/dev/null | grep ipv4.method;`;
      try {
        return A(AA, r.execOptsLinux).toString().replace(/\s+/g, " ").trim().split(" ").slice(1).toString() === "auto" ? y = !0 : y = !1, y;
      } catch {
        return v.indexOf(M) >= 0;
      }
    } else
      return v.indexOf(M) >= 0;
  }
  function t(M) {
    let O = !1;
    const v = `ipconfig getpacket "${M}" 2>/dev/null | grep lease_time;`;
    try {
      const y = A(v).toString().split(`
`);
      y.length && y[0].startsWith("lease_time") && (O = !0);
    } catch {
      r.noop();
    }
    return O;
  }
  function l(M) {
    if (M) {
      const O = `nmcli connection show "${M}" 2>/dev/null | grep ipv4.dns-search;`;
      try {
        const AA = A(O, r.execOptsLinux).toString().replace(/\s+/g, " ").trim().split(" ").slice(1).toString();
        return AA === "--" ? "Not defined" : AA;
      } catch {
        return "Unknown";
      }
    } else
      return "Unknown";
  }
  function D(M) {
    if (M) {
      const O = `nmcli connection show "${M}" 2>/dev/null | grep 802-1x.eap;`;
      try {
        const AA = A(O, r.execOptsLinux).toString().replace(/\s+/g, " ").trim().split(" ").slice(1).toString();
        return AA === "--" ? "" : AA;
      } catch {
        return "Not defined";
      }
    } else
      return "Not defined";
  }
  function f(M) {
    return M ? M === "Not defined" ? "Disabled" : "Enabled" : "Unknown";
  }
  function w(M, O, v) {
    const y = [
      "00:00:00:00:00:00",
      "00:03:FF",
      "00:05:69",
      "00:0C:29",
      "00:0F:4B",
      "00:13:07",
      "00:13:BE",
      "00:15:5d",
      "00:16:3E",
      "00:1C:42",
      "00:21:F6",
      "00:24:0B",
      "00:50:56",
      "00:A0:B1",
      "00:E0:C8",
      "08:00:27",
      "0A:00:27",
      "18:92:2C",
      "16:DF:49",
      "3C:F3:92",
      "54:52:00",
      "FC:15:97"
    ];
    return v ? y.filter((AA) => v.toUpperCase().toUpperCase().startsWith(AA.substring(0, v.length))).length > 0 || M.toLowerCase().indexOf(" virtual ") > -1 || O.toLowerCase().indexOf(" virtual ") > -1 || M.toLowerCase().indexOf("vethernet ") > -1 || O.toLowerCase().indexOf("vethernet ") > -1 || M.toLowerCase().startsWith("veth") || O.toLowerCase().startsWith("veth") || M.toLowerCase().startsWith("vboxnet") || O.toLowerCase().startsWith("vboxnet") : !1;
  }
  function Y(M, O, v) {
    return typeof M == "string" && (v = M, O = !0, M = null), typeof M == "boolean" && (O = M, M = null, v = ""), typeof O > "u" && (O = !0), v = v || "", v = "" + v, new Promise((y) => {
      process.nextTick(() => {
        const AA = s.networkInterfaces();
        let oA = [], rA = [], cA = [], lA = [];
        if (k || q || Z || $)
          if (JSON.stringify(AA) === JSON.stringify(J) && !O)
            oA = b, M && M(oA), y(oA);
          else {
            const pA = h();
            J = JSON.parse(JSON.stringify(AA)), rA = H(), rA.forEach((BA) => {
              let uA = "", hA = "", fA = "", FA = "";
              BA.ip4 = "", BA.ip6 = "", {}.hasOwnProperty.call(AA, BA.iface) && AA[BA.iface].forEach((DA) => {
                (DA.family === "IPv4" || DA.family === 4) && (!BA.ip4 && !BA.ip4.match(/^169.254/i) && (BA.ip4 = DA.address, BA.ip4subnet = DA.netmask), BA.ip4.match(/^169.254/i) && (uA = DA.address, hA = DA.netmask)), (DA.family === "IPv6" || DA.family === 6) && (!BA.ip6 && !BA.ip6.match(/^fe80::/i) && (BA.ip6 = DA.address, BA.ip6subnet = DA.netmask), BA.ip6.match(/^fe80::/i) && (fA = DA.address, FA = DA.netmask));
              }), !BA.ip4 && uA && (BA.ip4 = uA, BA.ip4subnet = hA), !BA.ip6 && fA && (BA.ip6 = fA, BA.ip6subnet = FA);
              let dA = "";
              const NA = r.isPrototypePolluted() ? "---" : r.sanitizeShellString(BA.iface), RA = r.mathMin(NA.length, 2e3);
              for (let DA = 0; DA <= RA; DA++)
                NA[DA] !== void 0 && (dA = dA + NA[DA]);
              oA.push({
                iface: BA.iface,
                ifaceName: BA.iface,
                default: BA.iface === pA,
                ip4: BA.ip4,
                ip4subnet: BA.ip4subnet || "",
                ip6: BA.ip6,
                ip6subnet: BA.ip6subnet || "",
                mac: BA.mac,
                internal: BA.internal,
                virtual: BA.internal ? !1 : w(BA.iface, BA.iface, BA.mac),
                operstate: BA.operstate,
                type: BA.type,
                duplex: BA.duplex,
                mtu: BA.mtu,
                speed: BA.speed,
                dhcp: t(dA),
                dnsSuffix: "",
                ieee8021xAuth: "",
                ieee8021xState: "",
                carrierChanges: 0
              });
            }), b = oA, v.toLowerCase().indexOf("default") >= 0 && (oA = oA.filter((BA) => BA.default), oA.length > 0 ? oA = oA[0] : oA = []), M && M(oA), y(oA);
          }
        if (F)
          if (JSON.stringify(AA) === JSON.stringify(J) && !O)
            oA = b, M && M(oA), y(oA);
          else {
            J = JSON.parse(JSON.stringify(AA)), eA = m();
            const pA = h();
            for (let BA in AA) {
              let uA = "", hA = "", fA = "", FA = "", dA = "", NA = "", RA = "", DA = null, _A = 0, SA = !1, LA = "", GA = "", kA = "", VA = "", bA = "", XA = "", HA = "", qA = "";
              if ({}.hasOwnProperty.call(AA, BA)) {
                const vA = BA;
                AA[BA].forEach((CA) => {
                  (CA.family === "IPv4" || CA.family === 4) && (!uA && !uA.match(/^169.254/i) && (uA = CA.address, hA = CA.netmask), uA.match(/^169.254/i) && (bA = CA.address, XA = CA.netmask)), (CA.family === "IPv6" || CA.family === 6) && (!fA && !fA.match(/^fe80::/i) && (fA = CA.address, FA = CA.netmask), fA.match(/^fe80::/i) && (HA = CA.address, qA = CA.netmask)), dA = CA.mac;
                  const T = parseInt(process.versions.node.split("."), 10);
                  dA.indexOf("00:00:0") > -1 && (F || k) && !CA.internal && T >= 8 && T <= 11 && (Object.keys(N).length === 0 && (N = E()), dA = N[BA] || "");
                }), !uA && bA && (uA = bA, hA = XA), !fA && HA && (fA = HA, FA = qA);
                const YA = BA.split(":")[0].trim();
                let wA = "";
                const TA = r.isPrototypePolluted() ? "---" : r.sanitizeShellString(YA), $A = r.mathMin(TA.length, 2e3);
                for (let CA = 0; CA <= $A; CA++)
                  TA[CA] !== void 0 && (wA = wA + TA[CA]);
                const WA = `echo -n "addr_assign_type: "; cat /sys/class/net/${wA}/addr_assign_type 2>/dev/null; echo;
            echo -n "address: "; cat /sys/class/net/${wA}/address 2>/dev/null; echo;
            echo -n "addr_len: "; cat /sys/class/net/${wA}/addr_len 2>/dev/null; echo;
            echo -n "broadcast: "; cat /sys/class/net/${wA}/broadcast 2>/dev/null; echo;
            echo -n "carrier: "; cat /sys/class/net/${wA}/carrier 2>/dev/null; echo;
            echo -n "carrier_changes: "; cat /sys/class/net/${wA}/carrier_changes 2>/dev/null; echo;
            echo -n "dev_id: "; cat /sys/class/net/${wA}/dev_id 2>/dev/null; echo;
            echo -n "dev_port: "; cat /sys/class/net/${wA}/dev_port 2>/dev/null; echo;
            echo -n "dormant: "; cat /sys/class/net/${wA}/dormant 2>/dev/null; echo;
            echo -n "duplex: "; cat /sys/class/net/${wA}/duplex 2>/dev/null; echo;
            echo -n "flags: "; cat /sys/class/net/${wA}/flags 2>/dev/null; echo;
            echo -n "gro_flush_timeout: "; cat /sys/class/net/${wA}/gro_flush_timeout 2>/dev/null; echo;
            echo -n "ifalias: "; cat /sys/class/net/${wA}/ifalias 2>/dev/null; echo;
            echo -n "ifindex: "; cat /sys/class/net/${wA}/ifindex 2>/dev/null; echo;
            echo -n "iflink: "; cat /sys/class/net/${wA}/iflink 2>/dev/null; echo;
            echo -n "link_mode: "; cat /sys/class/net/${wA}/link_mode 2>/dev/null; echo;
            echo -n "mtu: "; cat /sys/class/net/${wA}/mtu 2>/dev/null; echo;
            echo -n "netdev_group: "; cat /sys/class/net/${wA}/netdev_group 2>/dev/null; echo;
            echo -n "operstate: "; cat /sys/class/net/${wA}/operstate 2>/dev/null; echo;
            echo -n "proto_down: "; cat /sys/class/net/${wA}/proto_down 2>/dev/null; echo;
            echo -n "speed: "; cat /sys/class/net/${wA}/speed 2>/dev/null; echo;
            echo -n "tx_queue_len: "; cat /sys/class/net/${wA}/tx_queue_len 2>/dev/null; echo;
            echo -n "type: "; cat /sys/class/net/${wA}/type 2>/dev/null; echo;
            echo -n "wireless: "; cat /proc/net/wireless 2>/dev/null | grep ${wA}; echo;
            echo -n "wirelessspeed: "; iw dev ${wA} link 2>&1 | grep bitrate; echo;`;
                let UA = [];
                try {
                  UA = A(WA, r.execOptsLinux).toString().split(`
`);
                  const CA = U(wA);
                  SA = I(wA, CA, eA), LA = l(CA), GA = D(CA), kA = f(GA);
                } catch {
                  r.noop();
                }
                NA = r.getValue(UA, "duplex"), NA = NA.startsWith("cat") ? "" : NA, RA = parseInt(r.getValue(UA, "mtu"), 10);
                let MA = parseInt(r.getValue(UA, "speed"), 10);
                DA = isNaN(MA) ? null : MA;
                const iA = r.getValue(UA, "tx bitrate");
                DA === null && iA && (MA = parseFloat(iA), DA = isNaN(MA) ? null : MA), _A = parseInt(r.getValue(UA, "carrier_changes"), 10);
                const IA = r.getValue(UA, "operstate");
                VA = IA === "up" ? r.getValue(UA, "wireless").trim() ? "wireless" : "wired" : "unknown", (wA === "lo" || wA.startsWith("bond")) && (VA = "virtual");
                let j = AA[BA] && AA[BA][0] ? AA[BA][0].internal : !1;
                (BA.toLowerCase().indexOf("loopback") > -1 || vA.toLowerCase().indexOf("loopback") > -1) && (j = !0);
                const nA = j ? !1 : w(BA, vA, dA);
                oA.push({
                  iface: wA,
                  ifaceName: vA,
                  default: YA === pA,
                  ip4: uA,
                  ip4subnet: hA,
                  ip6: fA,
                  ip6subnet: FA,
                  mac: dA,
                  internal: j,
                  virtual: nA,
                  operstate: IA,
                  type: VA,
                  duplex: NA,
                  mtu: RA,
                  speed: DA,
                  dhcp: SA,
                  dnsSuffix: LA,
                  ieee8021xAuth: GA,
                  ieee8021xState: kA,
                  carrierChanges: _A
                });
              }
            }
            b = oA, v.toLowerCase().indexOf("default") >= 0 && (oA = oA.filter((BA) => BA.default), oA.length > 0 ? oA = oA[0] : oA = []), M && M(oA), y(oA);
          }
        if (P)
          if (JSON.stringify(AA) === JSON.stringify(J) && !O)
            oA = b, M && M(oA), y(oA);
          else {
            J = JSON.parse(JSON.stringify(AA));
            const pA = h();
            Q().then((BA) => {
              BA.forEach((uA) => {
                let hA = !1;
                Object.keys(AA).forEach((fA) => {
                  hA || AA[fA].forEach((FA) => {
                    Object.keys(FA).indexOf("mac") >= 0 && (hA = FA.mac === uA.mac);
                  });
                }), hA || (AA[uA.name] = [{ mac: uA.mac }]);
              }), lA = n(), cA = d();
              for (let uA in AA) {
                let hA = "";
                const fA = r.isPrototypePolluted() ? "---" : r.sanitizeShellString(uA), FA = r.mathMin(fA.length, 2e3);
                for (let wA = 0; wA <= FA; wA++)
                  fA[wA] !== void 0 && (hA = hA + fA[wA]);
                let dA = uA, NA = "", RA = "", DA = "", _A = "", SA = "", LA = "", GA = "", kA = null, VA = 0, bA = "down", XA = !1, HA = "", qA = "", vA = "", YA = "";
                if ({}.hasOwnProperty.call(AA, uA)) {
                  let wA = uA;
                  AA[uA].forEach((MA) => {
                    (MA.family === "IPv4" || MA.family === 4) && (NA = MA.address, RA = MA.netmask), (MA.family === "IPv6" || MA.family === 6) && (!DA || DA.match(/^fe80::/i)) && (DA = MA.address, _A = MA.netmask), SA = MA.mac;
                    const iA = parseInt(process.versions.node.split("."), 10);
                    SA.indexOf("00:00:0") > -1 && (F || k) && !MA.internal && iA >= 8 && iA <= 11 && (Object.keys(N).length === 0 && (N = E()), SA = N[uA] || "");
                  }), HA = c(cA.ifaces, hA);
                  let TA = !1;
                  BA.forEach((MA) => {
                    MA.mac === SA && !TA && (dA = MA.iface || dA, wA = MA.name, XA = MA.dhcp, bA = MA.operstate, kA = bA === "up" ? MA.speed : 0, YA = MA.type, TA = !0);
                  }), (uA.toLowerCase().indexOf("wlan") >= 0 || wA.toLowerCase().indexOf("wlan") >= 0 || wA.toLowerCase().indexOf("802.11n") >= 0 || wA.toLowerCase().indexOf("wireless") >= 0 || wA.toLowerCase().indexOf("wi-fi") >= 0 || wA.toLowerCase().indexOf("wifi") >= 0) && (YA = "wireless");
                  const $A = G(YA, hA, lA);
                  qA = $A.protocol, vA = $A.state;
                  let WA = AA[uA] && AA[uA][0] ? AA[uA][0].internal : !1;
                  (uA.toLowerCase().indexOf("loopback") > -1 || wA.toLowerCase().indexOf("loopback") > -1) && (WA = !0);
                  const UA = WA ? !1 : w(uA, wA, SA);
                  oA.push({
                    iface: dA,
                    ifaceName: wA,
                    default: dA === pA,
                    ip4: NA,
                    ip4subnet: RA,
                    ip6: DA,
                    ip6subnet: _A,
                    mac: SA,
                    internal: WA,
                    virtual: UA,
                    operstate: bA,
                    type: YA,
                    duplex: LA,
                    mtu: GA,
                    speed: kA,
                    dhcp: XA,
                    dnsSuffix: HA,
                    ieee8021xAuth: qA,
                    ieee8021xState: vA,
                    carrierChanges: VA
                  });
                }
              }
              b = oA, v.toLowerCase().indexOf("default") >= 0 && (oA = oA.filter((uA) => uA.default), oA.length > 0 ? oA = oA[0] : oA = []), M && M(oA), y(oA);
            });
          }
      });
    });
  }
  network.networkInterfaces = Y;
  function _(M, O, v, y, AA, oA, rA, cA) {
    const lA = {
      iface: M,
      operstate: y,
      rx_bytes: O,
      rx_dropped: AA,
      rx_errors: oA,
      tx_bytes: v,
      tx_dropped: rA,
      tx_errors: cA,
      rx_sec: null,
      tx_sec: null,
      ms: 0
    };
    return X[M] && X[M].ms ? (lA.ms = Date.now() - X[M].ms, lA.rx_sec = O - X[M].rx_bytes >= 0 ? (O - X[M].rx_bytes) / (lA.ms / 1e3) : 0, lA.tx_sec = v - X[M].tx_bytes >= 0 ? (v - X[M].tx_bytes) / (lA.ms / 1e3) : 0, X[M].rx_bytes = O, X[M].tx_bytes = v, X[M].rx_sec = lA.rx_sec, X[M].tx_sec = lA.tx_sec, X[M].ms = Date.now(), X[M].last_ms = lA.ms, X[M].operstate = y) : (X[M] || (X[M] = {}), X[M].rx_bytes = O, X[M].tx_bytes = v, X[M].rx_sec = null, X[M].tx_sec = null, X[M].ms = Date.now(), X[M].last_ms = 0, X[M].operstate = y), lA;
  }
  function x(M, O) {
    let v = [];
    return new Promise((y) => {
      process.nextTick(() => {
        if (r.isFunction(M) && !O)
          O = M, v = [h()];
        else {
          if (typeof M != "string" && M !== void 0)
            return O && O([]), y([]);
          M = M || h();
          try {
            M.__proto__.toLowerCase = r.stringToLower, M.__proto__.replace = r.stringReplace, M.__proto__.toString = r.stringToString, M.__proto__.substr = r.stringSubstr, M.__proto__.substring = r.stringSubstring, M.__proto__.trim = r.stringTrim, M.__proto__.startsWith = r.stringStartWith;
          } catch {
            Object.setPrototypeOf(M, r.stringObj);
          }
          M = M.trim().replace(/,+/g, "|"), v = M.split("|");
        }
        const AA = [], oA = [];
        if (v.length && v[0].trim() === "*")
          v = [], Y(!1).then((rA) => {
            for (let cA of rA)
              v.push(cA.iface);
            x(v.join(",")).then((cA) => {
              O && O(cA), y(cA);
            });
          });
        else {
          for (let rA of v)
            oA.push(W(rA.trim()));
          oA.length ? Promise.all(oA).then((rA) => {
            O && O(rA), y(rA);
          }) : (O && O(AA), y(AA));
        }
      });
    });
  }
  function W(M) {
    function O(v) {
      const y = [];
      for (let AA in v)
        if ({}.hasOwnProperty.call(v, AA) && v[AA].trim() !== "") {
          const oA = v[AA].trim().split(`\r
`);
          y.push({
            name: r.getValue(oA, "Name", ":").replace(/[()[\] ]+/g, "").replace(/#|\//g, "_").toLowerCase(),
            rx_bytes: parseInt(r.getValue(oA, "BytesReceivedPersec", ":"), 10),
            rx_errors: parseInt(r.getValue(oA, "PacketsReceivedErrors", ":"), 10),
            rx_dropped: parseInt(r.getValue(oA, "PacketsReceivedDiscarded", ":"), 10),
            tx_bytes: parseInt(r.getValue(oA, "BytesSentPersec", ":"), 10),
            tx_errors: parseInt(r.getValue(oA, "PacketsOutboundErrors", ":"), 10),
            tx_dropped: parseInt(r.getValue(oA, "PacketsOutboundDiscarded", ":"), 10)
          });
        }
      return y;
    }
    return new Promise((v) => {
      process.nextTick(() => {
        let y = "";
        const AA = r.isPrototypePolluted() ? "---" : r.sanitizeShellString(M), oA = r.mathMin(AA.length, 2e3);
        for (let RA = 0; RA <= oA; RA++)
          AA[RA] !== void 0 && (y = y + AA[RA]);
        let rA = {
          iface: y,
          operstate: "unknown",
          rx_bytes: 0,
          rx_dropped: 0,
          rx_errors: 0,
          tx_bytes: 0,
          tx_dropped: 0,
          tx_errors: 0,
          rx_sec: null,
          tx_sec: null,
          ms: 0
        }, cA = "unknown", lA = 0, pA = 0, BA = 0, uA = 0, hA = 0, fA = 0, FA, dA, NA;
        if (!X[y] || X[y] && !X[y].ms || X[y] && X[y].ms && Date.now() - X[y].ms >= 500) {
          if (F && (g.existsSync("/sys/class/net/" + y) ? (FA = "cat /sys/class/net/" + y + "/operstate; cat /sys/class/net/" + y + "/statistics/rx_bytes; cat /sys/class/net/" + y + "/statistics/tx_bytes; cat /sys/class/net/" + y + "/statistics/rx_dropped; cat /sys/class/net/" + y + "/statistics/rx_errors; cat /sys/class/net/" + y + "/statistics/tx_dropped; cat /sys/class/net/" + y + "/statistics/tx_errors; ", e(FA, (RA, DA) => {
            RA || (dA = DA.toString().split(`
`), cA = dA[0].trim(), lA = parseInt(dA[1], 10), pA = parseInt(dA[2], 10), BA = parseInt(dA[3], 10), uA = parseInt(dA[4], 10), hA = parseInt(dA[5], 10), fA = parseInt(dA[6], 10), rA = _(y, lA, pA, cA, BA, uA, hA, fA)), v(rA);
          })) : v(rA)), (q || Z || $) && (FA = "netstat -ibndI " + y, e(FA, (RA, DA) => {
            if (!RA) {
              dA = DA.toString().split(`
`);
              for (let _A = 1; _A < dA.length; _A++) {
                const SA = dA[_A].replace(/ +/g, " ").split(" ");
                SA && SA[0] && SA[7] && SA[10] && (lA = lA + parseInt(SA[7]), SA[6].trim() !== "-" && (BA = BA + parseInt(SA[6])), SA[5].trim() !== "-" && (uA = uA + parseInt(SA[5])), pA = pA + parseInt(SA[10]), SA[12].trim() !== "-" && (hA = hA + parseInt(SA[12])), SA[9].trim() !== "-" && (fA = fA + parseInt(SA[9])), cA = "up");
              }
              rA = _(y, lA, pA, cA, BA, uA, hA, fA);
            }
            v(rA);
          })), k && (FA = "ifconfig " + y + ' | grep "status"', e(FA, (RA, DA) => {
            rA.operstate = (DA.toString().split(":")[1] || "").trim(), rA.operstate = (rA.operstate || "").toLowerCase(), rA.operstate = rA.operstate === "active" ? "up" : rA.operstate === "inactive" ? "down" : "unknown", FA = "netstat -bdI " + y, e(FA, (_A, SA) => {
              if (!_A && (dA = SA.toString().split(`
`), dA.length > 1 && dA[1].trim() !== "")) {
                NA = dA[1].replace(/ +/g, " ").split(" ");
                const LA = NA.length > 11 ? 1 : 0;
                lA = parseInt(NA[LA + 5]), BA = parseInt(NA[LA + 10]), uA = parseInt(NA[LA + 4]), pA = parseInt(NA[LA + 8]), hA = parseInt(NA[LA + 10]), fA = parseInt(NA[LA + 7]), rA = _(y, lA, pA, rA.operstate, BA, uA, hA, fA);
              }
              v(rA);
            });
          })), P) {
            let RA = [], DA = y;
            r.powerShell(
              "Get-CimInstance Win32_PerfRawData_Tcpip_NetworkInterface | select Name,BytesReceivedPersec,PacketsReceivedErrors,PacketsReceivedDiscarded,BytesSentPersec,PacketsOutboundErrors,PacketsOutboundDiscarded | fl"
            ).then((_A, SA) => {
              if (!SA) {
                const LA = _A.toString().split(/\n\s*\n/);
                RA = O(LA);
              }
              Y(!1).then((LA) => {
                lA = 0, pA = 0, RA.forEach((GA) => {
                  LA.forEach((kA) => {
                    (kA.iface.toLowerCase() === y.toLowerCase() || kA.mac.toLowerCase() === y.toLowerCase() || kA.ip4.toLowerCase() === y.toLowerCase() || kA.ip6.toLowerCase() === y.toLowerCase() || kA.ifaceName.replace(/[()[\] ]+/g, "").replace(/#|\//g, "_").toLowerCase() === y.replace(/[()[\] ]+/g, "").replace("#", "_").toLowerCase()) && kA.ifaceName.replace(/[()[\] ]+/g, "").replace(/#|\//g, "_").toLowerCase() === GA.name && (DA = kA.iface, lA = GA.rx_bytes, BA = GA.rx_dropped, uA = GA.rx_errors, pA = GA.tx_bytes, hA = GA.tx_dropped, fA = GA.tx_errors, cA = kA.operstate);
                  });
                }), lA && pA && (rA = _(DA, parseInt(lA), parseInt(pA), cA, BA, uA, hA, fA)), v(rA);
              });
            });
          }
        } else
          rA.rx_bytes = X[y].rx_bytes, rA.tx_bytes = X[y].tx_bytes, rA.rx_sec = X[y].rx_sec, rA.tx_sec = X[y].tx_sec, rA.ms = X[y].last_ms, rA.operstate = X[y].operstate, v(rA);
      });
    });
  }
  network.networkStats = x;
  function z(M, O) {
    let v = "";
    return M.forEach((y) => {
      const AA = y.split(" ");
      (parseInt(AA[0], 10) || -1) === O && (AA.shift(), v = AA.join(" ").split(":")[0]);
    }), v = v.split(" -")[0], v = v.split(" /")[0], v;
  }
  function aA(M) {
    return new Promise((O) => {
      process.nextTick(() => {
        const v = [];
        if (F || q || Z || $) {
          let y = 'export LC_ALL=C; netstat -tunap | grep "ESTABLISHED\\|SYN_SENT\\|SYN_RECV\\|FIN_WAIT1\\|FIN_WAIT2\\|TIME_WAIT\\|CLOSE\\|CLOSE_WAIT\\|LAST_ACK\\|LISTEN\\|CLOSING\\|UNKNOWN"; unset LC_ALL';
          (q || Z || $) && (y = 'export LC_ALL=C; netstat -na | grep "ESTABLISHED\\|SYN_SENT\\|SYN_RECV\\|FIN_WAIT1\\|FIN_WAIT2\\|TIME_WAIT\\|CLOSE\\|CLOSE_WAIT\\|LAST_ACK\\|LISTEN\\|CLOSING\\|UNKNOWN"; unset LC_ALL'), e(y, { maxBuffer: 1024 * 102400 }, (AA, oA) => {
            let rA = oA.toString().split(`
`);
            !AA && (rA.length > 1 || rA[0] !== "") ? (rA.forEach((cA) => {
              if (cA = cA.replace(/ +/g, " ").split(" "), cA.length >= 7) {
                let lA = cA[3], pA = "";
                const BA = cA[3].split(":");
                BA.length > 1 && (pA = BA[BA.length - 1], BA.pop(), lA = BA.join(":"));
                let uA = cA[4], hA = "";
                const fA = cA[4].split(":");
                fA.length > 1 && (hA = fA[fA.length - 1], fA.pop(), uA = fA.join(":"));
                const FA = cA[5], dA = cA[6].split("/");
                FA && v.push({
                  protocol: cA[0],
                  localAddress: lA,
                  localPort: pA,
                  peerAddress: uA,
                  peerPort: hA,
                  state: FA,
                  pid: dA[0] && dA[0] !== "-" ? parseInt(dA[0], 10) : null,
                  process: dA[1] ? dA[1].split(" ")[0].split(":")[0] : ""
                });
              }
            }), M && M(v), O(v)) : (y = 'ss -tunap | grep "ESTAB\\|SYN-SENT\\|SYN-RECV\\|FIN-WAIT1\\|FIN-WAIT2\\|TIME-WAIT\\|CLOSE\\|CLOSE-WAIT\\|LAST-ACK\\|LISTEN\\|CLOSING"', e(y, { maxBuffer: 1024 * 102400 }, (cA, lA) => {
              cA || lA.toString().split(`
`).forEach((BA) => {
                if (BA = BA.replace(/ +/g, " ").split(" "), BA.length >= 6) {
                  let uA = BA[4], hA = "";
                  const fA = BA[4].split(":");
                  fA.length > 1 && (hA = fA[fA.length - 1], fA.pop(), uA = fA.join(":"));
                  let FA = BA[5], dA = "";
                  const NA = BA[5].split(":");
                  NA.length > 1 && (dA = NA[NA.length - 1], NA.pop(), FA = NA.join(":"));
                  let RA = BA[1];
                  RA === "ESTAB" && (RA = "ESTABLISHED"), RA === "TIME-WAIT" && (RA = "TIME_WAIT");
                  let DA = null, _A = "";
                  if (BA.length >= 7 && BA[6].indexOf("users:") > -1) {
                    const SA = BA[6].replace('users:(("', "").replace(/"/g, "").replace("pid=", "").split(",");
                    if (SA.length > 2) {
                      _A = SA[0];
                      const LA = parseInt(SA[1], 10);
                      LA > 0 && (DA = LA);
                    }
                  }
                  RA && v.push({
                    protocol: BA[0],
                    localAddress: uA,
                    localPort: hA,
                    peerAddress: FA,
                    peerPort: dA,
                    state: RA,
                    pid: DA,
                    process: _A
                  });
                }
              }), M && M(v), O(v);
            }));
          });
        }
        if (k) {
          const y = 'netstat -natvln | head -n2; netstat -natvln | grep "tcp4\\|tcp6\\|udp4\\|udp6"', AA = "ESTABLISHED|SYN_SENT|SYN_RECV|FIN_WAIT1|FIN_WAIT_1|FIN_WAIT2|FIN_WAIT_2|TIME_WAIT|CLOSE|CLOSE_WAIT|LAST_ACK|LISTEN|CLOSING|UNKNOWN".split("|");
          e(y, { maxBuffer: 1024 * 102400 }, (oA, rA) => {
            oA || e("ps -axo pid,command", { maxBuffer: 1024 * 102400 }, (cA, lA) => {
              let pA = lA.toString().split(`
`);
              pA = pA.map((hA) => hA.trim().replace(/ +/g, " "));
              const BA = rA.toString().split(`
`);
              BA.shift();
              let uA = 8;
              BA.length > 1 && BA[0].indexOf("pid") > 0 && (uA = (BA.shift() || "").replace(/ Address/g, "_Address").replace(/process:/g, "").replace(/ +/g, " ").split(" ").indexOf("pid")), BA.forEach((hA) => {
                if (hA = hA.replace(/ +/g, " ").split(" "), hA.length >= 8) {
                  let fA = hA[3], FA = "";
                  const dA = hA[3].split(".");
                  dA.length > 1 && (FA = dA[dA.length - 1], dA.pop(), fA = dA.join("."));
                  let NA = hA[4], RA = "";
                  const DA = hA[4].split(".");
                  DA.length > 1 && (RA = DA[DA.length - 1], DA.pop(), NA = DA.join("."));
                  const _A = AA.indexOf(hA[5]) >= 0, SA = _A ? hA[5] : "UNKNOWN";
                  let LA = "";
                  hA[hA.length - 9].indexOf(":") >= 0 ? LA = hA[hA.length - 9].split(":")[1] : (LA = hA[uA + (_A ? 0 : -1)], LA.indexOf(":") >= 0 && (LA = LA.split(":")[1]));
                  const GA = parseInt(LA, 10);
                  SA && v.push({
                    protocol: hA[0],
                    localAddress: fA,
                    localPort: FA,
                    peerAddress: NA,
                    peerPort: RA,
                    state: SA,
                    pid: GA,
                    process: z(pA, GA)
                  });
                }
              }), M && M(v), O(v);
            });
          });
        }
        if (P) {
          let y = "netstat -nao";
          try {
            e(y, r.execOptsWin, (AA, oA) => {
              AA || (oA.toString().split(`\r
`).forEach((cA) => {
                if (cA = cA.trim().replace(/ +/g, " ").split(" "), cA.length >= 4) {
                  let lA = cA[1], pA = "";
                  const BA = cA[1].split(":");
                  BA.length > 1 && (pA = BA[BA.length - 1], BA.pop(), lA = BA.join(":")), lA = lA.replace(/\[/g, "").replace(/\]/g, "");
                  let uA = cA[2], hA = "";
                  const fA = cA[2].split(":");
                  fA.length > 1 && (hA = fA[fA.length - 1], fA.pop(), uA = fA.join(":")), uA = uA.replace(/\[/g, "").replace(/\]/g, "");
                  const FA = r.toInt(cA[4]);
                  let dA = cA[3];
                  dA === "HERGESTELLT" && (dA = "ESTABLISHED"), dA.startsWith("ABH") && (dA = "LISTEN"), dA === "SCHLIESSEN_WARTEN" && (dA = "CLOSE_WAIT"), dA === "WARTEND" && (dA = "TIME_WAIT"), dA === "SYN_GESENDET" && (dA = "SYN_SENT"), dA === "LISTENING" && (dA = "LISTEN"), dA === "SYN_RECEIVED" && (dA = "SYN_RECV"), dA === "FIN_WAIT_1" && (dA = "FIN_WAIT1"), dA === "FIN_WAIT_2" && (dA = "FIN_WAIT2"), cA[0].toLowerCase() !== "udp" && dA ? v.push({
                    protocol: cA[0].toLowerCase(),
                    localAddress: lA,
                    localPort: pA,
                    peerAddress: uA,
                    peerPort: hA,
                    state: dA,
                    pid: FA,
                    process: ""
                  }) : cA[0].toLowerCase() === "udp" && v.push({
                    protocol: cA[0].toLowerCase(),
                    localAddress: lA,
                    localPort: pA,
                    peerAddress: uA,
                    peerPort: hA,
                    state: "",
                    pid: parseInt(cA[3], 10),
                    process: ""
                  });
                }
              }), M && M(v), O(v));
            });
          } catch {
            M && M(v), O(v);
          }
        }
      });
    });
  }
  network.networkConnections = aA;
  function tA(M) {
    return new Promise((O) => {
      process.nextTick(() => {
        let v = "";
        if (F || q || Z || $) {
          const y = "ip route get 1";
          try {
            e(y, { maxBuffer: 1024 * 102400 }, (AA, oA) => {
              if (AA)
                M && M(v), O(v);
              else {
                let rA = oA.toString().split(`
`), lA = (rA && rA[0] ? rA[0] : "").split(" via ");
                lA && lA[1] && (lA = lA[1].split(" "), v = lA[0]), M && M(v), O(v);
              }
            });
          } catch {
            M && M(v), O(v);
          }
        }
        if (k) {
          let y = "route -n get default";
          try {
            e(y, { maxBuffer: 1024 * 102400 }, (AA, oA) => {
              if (!AA) {
                const rA = oA.toString().split(`
`).map((cA) => cA.trim());
                v = r.getValue(rA, "gateway");
              }
              v ? (M && M(v), O(v)) : (y = "netstat -rn | awk '/default/ {print $2}'", e(y, { maxBuffer: 1024 * 102400 }, (rA, cA) => {
                v = cA.toString().split(`
`).map((pA) => pA.trim()).find(
                  (pA) => /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(pA)
                ), M && M(v), O(v);
              }));
            });
          } catch {
            M && M(v), O(v);
          }
        }
        if (P)
          try {
            e("netstat -r", r.execOptsWin, (y, AA) => {
              AA.toString().split(s.EOL).forEach((rA) => {
                if (rA = rA.replace(/\s+/g, " ").trim(), rA.indexOf("0.0.0.0 0.0.0.0") > -1 && !/[a-zA-Z]/.test(rA)) {
                  const cA = rA.split(" ");
                  cA.length >= 5 && cA[cA.length - 3].indexOf(".") > -1 && (v = cA[cA.length - 3]);
                }
              }), v ? (M && M(v), O(v)) : r.powerShell("Get-CimInstance -ClassName Win32_IP4RouteTable | Where-Object { $_.Destination -eq '0.0.0.0' -and $_.Mask -eq '0.0.0.0' }").then((rA) => {
                let cA = rA.toString().split(`\r
`);
                cA.length > 1 && !v && (v = r.getValue(cA, "NextHop"), M && M(v), O(v));
              });
            });
          } catch {
            M && M(v), O(v);
          }
      });
    });
  }
  return network.networkGatewayDefault = tA, network;
}
var wifi = {}, hasRequiredWifi;
function requireWifi() {
  if (hasRequiredWifi) return wifi;
  hasRequiredWifi = 1;
  const s = require$$0$1, e = require$$1.exec, A = require$$1.execSync, g = requireUtil();
  let r = process.platform;
  const B = r === "linux" || r === "android", F = r === "darwin", k = r === "win32";
  function P(Q) {
    const d = parseFloat(Q);
    return d < 0 ? 0 : d >= 100 ? -50 : d / 2 - 100;
  }
  function q(Q) {
    const d = 2 * (parseFloat(Q) + 100);
    return d <= 100 ? d : 100;
  }
  const Z = {
    1: 2412,
    2: 2417,
    3: 2422,
    4: 2427,
    5: 2432,
    6: 2437,
    7: 2442,
    8: 2447,
    9: 2452,
    10: 2457,
    11: 2462,
    12: 2467,
    13: 2472,
    14: 2484,
    32: 5160,
    34: 5170,
    36: 5180,
    38: 5190,
    40: 5200,
    42: 5210,
    44: 5220,
    46: 5230,
    48: 5240,
    50: 5250,
    52: 5260,
    54: 5270,
    56: 5280,
    58: 5290,
    60: 5300,
    62: 5310,
    64: 5320,
    68: 5340,
    96: 5480,
    100: 5500,
    102: 5510,
    104: 5520,
    106: 5530,
    108: 5540,
    110: 5550,
    112: 5560,
    114: 5570,
    116: 5580,
    118: 5590,
    120: 5600,
    122: 5610,
    124: 5620,
    126: 5630,
    128: 5640,
    132: 5660,
    134: 5670,
    136: 5680,
    138: 5690,
    140: 5700,
    142: 5710,
    144: 5720,
    149: 5745,
    151: 5755,
    153: 5765,
    155: 5775,
    157: 5785,
    159: 5795,
    161: 5805,
    165: 5825,
    169: 5845,
    173: 5865,
    183: 4915,
    184: 4920,
    185: 4925,
    187: 4935,
    188: 4940,
    189: 4945,
    192: 4960,
    196: 4980
  };
  function $(Q) {
    return {}.hasOwnProperty.call(Z, Q) ? Z[Q] : null;
  }
  function sA(Q) {
    let d = 0;
    for (let c in Z)
      ({}).hasOwnProperty.call(Z, c) && Z[c] === Q && (d = g.toInt(c));
    return d;
  }
  function X() {
    const Q = [], d = "iw dev 2>/dev/null";
    try {
      const n = A(d, g.execOptsLinux).toString().split(`
`).map((L) => L.trim()).join(`
`).split(`
Interface `);
      return n.shift(), n.forEach((L) => {
        const G = L.split(`
`), K = G[0], gA = g.toInt(g.getValue(G, "ifindex", " ")), H = g.getValue(G, "addr", " "), U = g.toInt(g.getValue(G, "channel", " "));
        Q.push({
          id: gA,
          iface: K,
          mac: H,
          channel: U
        });
      }), Q;
    } catch {
      try {
        const n = A("nmcli -t -f general,wifi-properties,wired-properties,interface-flags,capabilities,nsp device show 2>/dev/null", g.execOptsLinux).toString().split(`

`);
        let L = 1;
        return n.forEach((G) => {
          const K = G.split(`
`), gA = g.getValue(K, "GENERAL.DEVICE"), H = g.getValue(K, "GENERAL.TYPE"), U = L++, V = g.getValue(K, "GENERAL.HWADDR");
          H.toLowerCase() === "wifi" && Q.push({
            id: U,
            iface: gA,
            mac: V,
            channel: ""
          });
        }), Q;
      } catch {
        return [];
      }
    }
  }
  function S(Q) {
    const d = `nmcli -t -f general,wifi-properties,capabilities,ip4,ip6 device show ${Q} 2> /dev/null`;
    try {
      const c = A(d, g.execOptsLinux).toString().split(`
`), n = g.getValue(c, "GENERAL.CONNECTION");
      return {
        iface: Q,
        type: g.getValue(c, "GENERAL.TYPE"),
        vendor: g.getValue(c, "GENERAL.VENDOR"),
        product: g.getValue(c, "GENERAL.PRODUCT"),
        mac: g.getValue(c, "GENERAL.HWADDR").toLowerCase(),
        ssid: n !== "--" ? n : null
      };
    } catch {
      return {};
    }
  }
  function J(Q) {
    const d = `nmcli -t --show-secrets connection show ${Q} 2>/dev/null`;
    try {
      const c = A(d, g.execOptsLinux).toString().split(`
`), n = g.getValue(c, "802-11-wireless.seen-bssids").toLowerCase();
      return {
        ssid: Q !== "--" ? Q : null,
        uuid: g.getValue(c, "connection.uuid"),
        type: g.getValue(c, "connection.type"),
        autoconnect: g.getValue(c, "connection.autoconnect") === "yes",
        security: g.getValue(c, "802-11-wireless-security.key-mgmt"),
        bssid: n !== "--" ? n : null
      };
    } catch {
      return {};
    }
  }
  function eA(Q) {
    if (!Q)
      return {};
    const d = `wpa_cli -i ${Q} status 2>&1`;
    try {
      const c = A(d, g.execOptsLinux).toString().split(`
`), n = g.toInt(g.getValue(c, "freq", "="));
      return {
        ssid: g.getValue(c, "ssid", "="),
        uuid: g.getValue(c, "uuid", "="),
        security: g.getValue(c, "key_mgmt", "="),
        freq: n,
        channel: sA(n),
        bssid: g.getValue(c, "bssid", "=").toLowerCase()
      };
    } catch {
      return {};
    }
  }
  function b() {
    const Q = [], d = "nmcli -t -m multiline --fields active,ssid,bssid,mode,chan,freq,signal,security,wpa-flags,rsn-flags device wifi list 2>/dev/null";
    try {
      const n = A(d, g.execOptsLinux).toString().split("ACTIVE:");
      return n.shift(), n.forEach((L) => {
        L = "ACTIVE:" + L;
        const G = L.split(s.EOL), K = g.getValue(G, "CHAN"), gA = g.getValue(G, "FREQ").toLowerCase().replace("mhz", "").trim(), H = g.getValue(G, "SECURITY").replace("(", "").replace(")", ""), U = g.getValue(G, "WPA-FLAGS").replace("(", "").replace(")", ""), V = g.getValue(G, "RSN-FLAGS").replace("(", "").replace(")", ""), m = g.getValue(G, "SIGNAL");
        Q.push({
          ssid: g.getValue(G, "SSID"),
          bssid: g.getValue(G, "BSSID").toLowerCase(),
          mode: g.getValue(G, "MODE"),
          channel: K ? parseInt(K, 10) : null,
          frequency: gA ? parseInt(gA, 10) : null,
          signalLevel: P(m),
          quality: m ? parseInt(m, 10) : null,
          security: H && H !== "none" ? H.split(" ") : [],
          wpaFlags: U && U !== "none" ? U.split(" ") : [],
          rsnFlags: V && V !== "none" ? V.split(" ") : []
        });
      }), Q;
    } catch {
      return [];
    }
  }
  function N(Q) {
    const d = [];
    try {
      let c = A(`export LC_ALL=C; iwlist ${Q} scan 2>&1; unset LC_ALL`, g.execOptsLinux).toString().split("        Cell ");
      return c[0].indexOf("resource busy") >= 0 ? -1 : (c.length > 1 && (c.shift(), c.forEach((n) => {
        const L = n.split(`
`), G = g.getValue(L, "channel", ":", !0), K = L && L.length && L[0].indexOf("Address:") >= 0 ? L[0].split("Address:")[1].trim().toLowerCase() : "", gA = g.getValue(L, "mode", ":", !0), H = g.getValue(L, "frequency", ":", !0), V = g.getValue(L, "Quality", "=", !0).toLowerCase().split("signal level="), m = V.length > 1 ? g.toInt(V[1]) : 0, a = m ? q(m) : 0, I = g.getValue(L, "essid", ":", !0), t = n.indexOf(" WPA ") >= 0, l = n.indexOf("WPA2 ") >= 0, D = [];
        t && D.push("WPA"), l && D.push("WPA2");
        const f = [];
        let w = "";
        L.forEach((Y) => {
          const _ = Y.trim().toLowerCase();
          if (_.indexOf("group cipher") >= 0) {
            w && f.push(w);
            const x = _.split(":");
            x.length > 1 && (w = x[1].trim().toUpperCase());
          }
          if (_.indexOf("pairwise cipher") >= 0) {
            const x = _.split(":");
            x.length > 1 && (x[1].indexOf("tkip") ? w = w ? "TKIP/" + w : "TKIP" : x[1].indexOf("ccmp") ? w = w ? "CCMP/" + w : "CCMP" : x[1].indexOf("proprietary") && (w = w ? "PROP/" + w : "PROP"));
          }
          if (_.indexOf("authentication suites") >= 0) {
            const x = _.split(":");
            x.length > 1 && (x[1].indexOf("802.1x") ? w = w ? "802.1x/" + w : "802.1x" : x[1].indexOf("psk") && (w = w ? "PSK/" + w : "PSK"));
          }
        }), w && f.push(w), d.push({
          ssid: I,
          bssid: K,
          mode: gA,
          channel: G ? g.toInt(G) : null,
          frequency: H ? g.toInt(H.replace(".", "")) : null,
          signalLevel: m,
          quality: a,
          security: D,
          wpaFlags: f,
          rsnFlags: []
        });
      })), d);
    } catch {
      return -1;
    }
  }
  function p(Q) {
    const d = [];
    try {
      let c = JSON.parse(Q);
      return c = c.SPAirPortDataType[0].spairport_airport_interfaces[0].spairport_airport_other_local_wireless_networks, c.forEach((n) => {
        const L = [], G = n.spairport_security_mode || "";
        G === "spairport_security_mode_wep" ? L.push("WEP") : G === "spairport_security_mode_wpa2_personal" ? L.push("WPA2") : G.startsWith("spairport_security_mode_wpa2_enterprise") ? L.push("WPA2 EAP") : G.startsWith("pairport_security_mode_wpa3_transition") ? L.push("WPA2/WPA3") : G.startsWith("pairport_security_mode_wpa3") && L.push("WPA3");
        const K = parseInt(("" + n.spairport_network_channel).split(" ")[0]) || 0, gA = n.spairport_signal_noise || null;
        d.push({
          ssid: n._name || "",
          bssid: n.spairport_network_bssid || null,
          mode: n.spairport_network_phymode,
          channel: K,
          frequency: $(K),
          signalLevel: gA ? parseInt(gA, 10) : null,
          quality: q(gA),
          security: L,
          wpaFlags: [],
          rsnFlags: []
        });
      }), d;
    } catch {
      return d;
    }
  }
  function h(Q) {
    return new Promise((d) => {
      process.nextTick(() => {
        let c = [];
        if (B)
          if (c = b(), c.length === 0)
            try {
              const n = A("export LC_ALL=C; iwconfig 2>/dev/null; unset LC_ALL", g.execOptsLinux).toString().split(`

`);
              let L = "";
              if (n.forEach((G) => {
                G.indexOf("no wireless") === -1 && G.trim() !== "" && (L = G.split(" ")[0]);
              }), L) {
                let G = "";
                const K = g.isPrototypePolluted() ? "---" : g.sanitizeShellString(L, !0), gA = g.mathMin(K.length, 2e3);
                for (let U = 0; U <= gA; U++)
                  K[U] !== void 0 && (G = G + K[U]);
                const H = N(G);
                H === -1 ? setTimeout((U) => {
                  const V = N(U);
                  V !== -1 && (c = V), Q && Q(c), d(c);
                }, 4e3) : (c = H, Q && Q(c), d(c));
              } else
                Q && Q(c), d(c);
            } catch {
              Q && Q(c), d(c);
            }
          else
            Q && Q(c), d(c);
        else F ? e("system_profiler SPAirPortDataType -json 2>/dev/null", { maxBuffer: 1024 * 4e4 }, (L, G) => {
          c = p(G.toString()), Q && Q(c), d(c);
        }) : k ? g.powerShell("netsh wlan show networks mode=Bssid").then((L) => {
          const G = L.toString("utf8").split(s.EOL + s.EOL + "SSID ");
          G.shift(), G.forEach((K) => {
            const gA = K.split(s.EOL);
            if (gA && gA.length >= 8 && gA[0].indexOf(":") >= 0) {
              const H = K.split(" BSSID");
              H.shift(), H.forEach((U) => {
                const V = U.split(s.EOL), m = V[0].split(":");
                m.shift();
                const a = m.join(":").trim().toLowerCase(), I = V[3].split(":").pop().trim(), t = V[1].split(":").pop().trim();
                c.push({
                  ssid: gA[0].split(":").pop().trim(),
                  bssid: a,
                  mode: "",
                  channel: I ? parseInt(I, 10) : null,
                  frequency: $(I),
                  signalLevel: P(t),
                  quality: t ? parseInt(t, 10) : null,
                  security: [gA[2].split(":").pop().trim()],
                  wpaFlags: [gA[3].split(":").pop().trim()],
                  rsnFlags: []
                });
              });
            }
          }), Q && Q(c), d(c);
        }) : (Q && Q(c), d(c));
      });
    });
  }
  wifi.wifiNetworks = h;
  function E(Q) {
    Q = Q.toLowerCase();
    let d = "";
    return Q.indexOf("intel") >= 0 ? d = "Intel" : Q.indexOf("realtek") >= 0 ? d = "Realtek" : Q.indexOf("qualcom") >= 0 ? d = "Qualcom" : Q.indexOf("broadcom") >= 0 ? d = "Broadcom" : Q.indexOf("cavium") >= 0 ? d = "Cavium" : Q.indexOf("cisco") >= 0 ? d = "Cisco" : Q.indexOf("marvel") >= 0 ? d = "Marvel" : Q.indexOf("zyxel") >= 0 ? d = "Zyxel" : Q.indexOf("melanox") >= 0 ? d = "Melanox" : Q.indexOf("d-link") >= 0 ? d = "D-Link" : Q.indexOf("tp-link") >= 0 ? d = "TP-Link" : Q.indexOf("asus") >= 0 ? d = "Asus" : Q.indexOf("linksys") >= 0 && (d = "Linksys"), d;
  }
  function u(Q) {
    return new Promise((d) => {
      process.nextTick(() => {
        const c = [];
        if (B) {
          const n = X(), L = b();
          n.forEach((G) => {
            let K = "";
            const gA = g.isPrototypePolluted() ? "---" : g.sanitizeShellString(G.iface, !0), H = g.mathMin(gA.length, 2e3);
            for (let _ = 0; _ <= H; _++)
              gA[_] !== void 0 && (K = K + gA[_]);
            const U = S(K), V = eA(K), m = U.ssid || V.ssid, a = L.filter((_) => _.ssid === m);
            let I = "";
            const t = g.isPrototypePolluted() ? "---" : g.sanitizeShellString(m, !0), l = g.mathMin(t.length, 32);
            for (let _ = 0; _ <= l; _++)
              t[_] !== void 0 && (I = I + t[_]);
            const D = J(I), f = a && a.length && a[0].channel ? a[0].channel : V.channel ? V.channel : null, w = a && a.length && a[0].bssid ? a[0].bssid : V.bssid ? V.bssid : null, Y = a && a.length && a[0].signalLevel ? a[0].signalLevel : null;
            m && w && c.push({
              id: G.id,
              iface: G.iface,
              model: U.product,
              ssid: m,
              bssid: a && a.length && a[0].bssid ? a[0].bssid : V.bssid ? V.bssid : null,
              channel: f,
              frequency: f ? $(f) : null,
              type: D.type ? D.type : "802.11",
              security: D.security ? D.security : V.security ? V.security : null,
              signalLevel: Y,
              quality: q(Y),
              txRate: null
            });
          }), Q && Q(c), d(c);
        } else F ? e('system_profiler SPNetworkDataType SPAirPortDataType -xml 2>/dev/null; echo "######" ; ioreg -n AppleBCMWLANSkywalkInterface -r 2>/dev/null', (L, G) => {
          try {
            const K = G.toString().split("######"), gA = g.plistParser(K[0]), H = gA[0]._SPCommandLineArguments.indexOf("SPNetworkDataType") >= 0 ? gA[0]._items : gA[1]._items, U = gA[0]._SPCommandLineArguments.indexOf("SPAirPortDataType") >= 0 ? gA[0]._items[0].spairport_airport_interfaces : gA[1]._items[0].spairport_airport_interfaces;
            let V = [];
            K[1].indexOf("  | {") > 0 && K[1].indexOf("  | }") > K[1].indexOf("  | {") && (V = K[1].split("  | {")[1].split("  | }")[0].replace(/ \| /g, "").replace(/"/g, "").split(`
`));
            const m = H.find((f) => f._name === "Wi-Fi"), a = U[0].spairport_current_network_information, I = parseInt(("" + a.spairport_network_channel).split(" ")[0], 10) || 0, t = a.spairport_signal_noise || null, l = [], D = a.spairport_security_mode || "";
            D === "spairport_security_mode_wep" ? l.push("WEP") : D === "spairport_security_mode_wpa2_personal" ? l.push("WPA2") : D.startsWith("spairport_security_mode_wpa2_enterprise") ? l.push("WPA2 EAP") : D.startsWith("pairport_security_mode_wpa3_transition") ? l.push("WPA2/WPA3") : D.startsWith("pairport_security_mode_wpa3") && l.push("WPA3"), c.push({
              id: m._name || "Wi-Fi",
              iface: m.interface || "",
              model: m.hardware || "",
              ssid: (a._name || "").replace("&lt;", "<").replace("&gt;", ">"),
              bssid: a.spairport_network_bssid || "",
              channel: I,
              frequency: I ? $(I) : null,
              type: a.spairport_network_phymode || "802.11",
              security: l,
              signalLevel: t ? parseInt(t, 10) : null,
              quality: q(t),
              txRate: a.spairport_network_rate || null
            });
          } catch {
            g.noop();
          }
          Q && Q(c), d(c);
        }) : k ? g.powerShell("netsh wlan show interfaces").then((L) => {
          const G = L.toString().split(`\r
`);
          for (let gA = 0; gA < G.length; gA++)
            G[gA] = G[gA].trim();
          const K = G.join(`\r
`).split(`:\r
\r
`);
          K.shift(), K.forEach((gA) => {
            const H = gA.split(`\r
`);
            if (H.length >= 5) {
              const U = H[0].indexOf(":") >= 0 ? H[0].split(":")[1].trim() : "", V = H[1].indexOf(":") >= 0 ? H[1].split(":")[1].trim() : "", m = H[2].indexOf(":") >= 0 ? H[2].split(":")[1].trim() : "", a = g.getValue(H, "SSID", ":", !0), I = g.getValue(H, "BSSID", ":", !0) || g.getValue(H, "AP BSSID", ":", !0), t = g.getValue(H, "Signal", ":", !0), l = P(t), D = g.getValue(H, "Radio type", ":", !0) || g.getValue(H, "Type de radio", ":", !0) || g.getValue(H, "Funktyp", ":", !0) || null, f = g.getValue(H, "authentication", ":", !0) || g.getValue(H, "Authentification", ":", !0) || g.getValue(H, "Authentifizierung", ":", !0) || null, w = g.getValue(H, "Channel", ":", !0) || g.getValue(H, "Canal", ":", !0) || g.getValue(H, "Kanal", ":", !0) || null, Y = g.getValue(H, "Transmit rate (mbps)", ":", !0) || g.getValue(H, "Transmission (mbit/s)", ":", !0) || g.getValue(H, "Empfangsrate (MBit/s)", ":", !0) || null;
              V && m && a && I && c.push({
                id: m,
                iface: U,
                model: V,
                ssid: a,
                bssid: I,
                channel: g.toInt(w),
                frequency: w ? $(w) : null,
                type: D,
                security: f,
                signalLevel: l,
                quality: t ? parseInt(t, 10) : null,
                txRate: g.toInt(Y) || null
              });
            }
          }), Q && Q(c), d(c);
        }) : (Q && Q(c), d(c));
      });
    });
  }
  wifi.wifiConnections = u;
  function o(Q) {
    return new Promise((d) => {
      process.nextTick(() => {
        const c = [];
        B ? (X().forEach((L) => {
          const G = S(L.iface);
          c.push({
            id: L.id,
            iface: L.iface,
            model: G.product ? G.product : null,
            vendor: G.vendor ? G.vendor : null,
            mac: L.mac
          });
        }), Q && Q(c), d(c)) : F ? e("system_profiler SPNetworkDataType", (L, G) => {
          const K = G.toString().split(`

    Wi-Fi:

`);
          if (K.length > 1) {
            const gA = K[1].split(`

`)[0].split(`
`), H = g.getValue(gA, "BSD Device Name", ":", !0), U = g.getValue(gA, "MAC Address", ":", !0), V = g.getValue(gA, "hardware", ":", !0);
            c.push({
              id: "Wi-Fi",
              iface: H,
              model: V,
              vendor: "",
              mac: U
            });
          }
          Q && Q(c), d(c);
        }) : k ? g.powerShell("netsh wlan show interfaces").then((L) => {
          const G = L.toString().split(`\r
`);
          for (let gA = 0; gA < G.length; gA++)
            G[gA] = G[gA].trim();
          const K = G.join(`\r
`).split(`:\r
\r
`);
          K.shift(), K.forEach((gA) => {
            const H = gA.split(`\r
`);
            if (H.length >= 5) {
              const U = H[0].indexOf(":") >= 0 ? H[0].split(":")[1].trim() : "", V = H[1].indexOf(":") >= 0 ? H[1].split(":")[1].trim() : "", m = H[2].indexOf(":") >= 0 ? H[2].split(":")[1].trim() : "", a = H[3].indexOf(":") >= 0 ? H[3].split(":") : [];
              a.shift();
              const I = a.join(":").trim(), t = E(V);
              U && V && m && I && c.push({
                id: m,
                iface: U,
                model: V,
                vendor: t,
                mac: I
              });
            }
          }), Q && Q(c), d(c);
        }) : (Q && Q(c), d(c));
      });
    });
  }
  return wifi.wifiInterfaces = o, wifi;
}
var processes = {}, hasRequiredProcesses;
function requireProcesses() {
  if (hasRequiredProcesses) return processes;
  hasRequiredProcesses = 1;
  const s = require$$0$1, e = require$$1$1, A = require$$2, g = require$$1.exec, r = require$$1.execSync, B = requireUtil();
  let F = process.platform;
  const k = F === "linux" || F === "android", P = F === "darwin", q = F === "win32", Z = F === "freebsd", $ = F === "openbsd", sA = F === "netbsd", X = F === "sunos", S = {
    all: 0,
    all_utime: 0,
    all_stime: 0,
    list: {},
    ms: 0,
    result: {}
  }, J = {
    all: 0,
    list: {},
    ms: 0,
    result: {}
  }, eA = {
    all: 0,
    all_utime: 0,
    all_stime: 0,
    list: {},
    ms: 0,
    result: {}
  }, b = {
    0: "unknown",
    1: "other",
    2: "ready",
    3: "running",
    4: "blocked",
    5: "suspended blocked",
    6: "suspended ready",
    7: "terminated",
    8: "stopped",
    9: "growing"
  };
  function N(c) {
    let n = c, L = c.replace(/ +/g, " ").split(" ");
    return L.length === 5 && (n = L[4] + "-" + ("0" + ("JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC".indexOf(L[1].toUpperCase()) / 3 + 1)).slice(-2) + "-" + ("0" + L[2]).slice(-2) + " " + L[3]), n;
  }
  function p(c) {
    let n = /* @__PURE__ */ new Date();
    n = new Date(n.getTime() - n.getTimezoneOffset() * 6e4);
    const L = c.split("-"), G = L.length - 1, K = G > 0 ? parseInt(L[G - 1]) : 0, gA = L[G].split(":"), H = gA.length === 3 ? parseInt(gA[0] || 0) : 0, U = parseInt(gA[gA.length === 3 ? 1 : 0] || 0), V = parseInt(gA[gA.length === 3 ? 2 : 1] || 0), m = (((K * 24 + H) * 60 + U) * 60 + V) * 1e3;
    let a = new Date(n.getTime()), I = a.toISOString().substring(0, 10) + " " + a.toISOString().substring(11, 19);
    try {
      a = new Date(n.getTime() - m), I = a.toISOString().substring(0, 10) + " " + a.toISOString().substring(11, 19);
    } catch {
      B.noop();
    }
    return I;
  }
  function h(c, n) {
    return B.isFunction(c) && !n && (n = c, c = ""), new Promise((L) => {
      process.nextTick(() => {
        if (typeof c != "string")
          return n && n([]), L([]);
        if (c) {
          let G = "";
          try {
            G.__proto__.toLowerCase = B.stringToLower, G.__proto__.replace = B.stringReplace, G.__proto__.toString = B.stringToString, G.__proto__.substr = B.stringSubstr, G.__proto__.substring = B.stringSubstring, G.__proto__.trim = B.stringTrim, G.__proto__.startsWith = B.stringStartWith;
          } catch {
            Object.setPrototypeOf(G, B.stringObj);
          }
          const K = B.sanitizeShellString(c), gA = B.mathMin(K.length, 2e3);
          for (let m = 0; m <= gA; m++)
            K[m] !== void 0 && (G = G + K[m]);
          G = G.trim().toLowerCase().replace(/, /g, "|").replace(/,+/g, "|"), G === "" && (G = "*"), B.isPrototypePolluted() && G !== "*" && (G = "------");
          let H = G.split("|"), U = [], V = [];
          if (k || Z || $ || sA || P) {
            if ((k || Z || $ || sA) && G === "*")
              try {
                const a = r("systemctl --all --type=service --no-legend 2> /dev/null", B.execOptsLinux).toString().split(`
`);
                H = [];
                for (const I of a) {
                  const t = I.split(".service")[0];
                  t && I.indexOf(" not-found ") === -1 && H.push(t.trim());
                }
                G = H.join("|");
              } catch {
                try {
                  G = "";
                  const I = r("service --status-all 2> /dev/null", B.execOptsLinux).toString().split(`
`);
                  for (const t of I) {
                    const l = t.split("]");
                    l.length === 2 && (G += (G !== "" ? "|" : "") + l[1].trim());
                  }
                  H = G.split("|");
                } catch {
                  try {
                    const t = r("ls /etc/init.d/ -m 2> /dev/null", B.execOptsLinux).toString().split(`
`).join("");
                    if (G = "", t) {
                      const l = t.split(",");
                      for (const D of l) {
                        const f = D.trim();
                        f && (G += (G !== "" ? "|" : "") + f);
                      }
                      H = G.split("|");
                    }
                  } catch {
                    G = "", H = [];
                  }
                }
              }
            P && G === "*" && (n && n(U), L(U));
            let m = P ? ["-caxo", "pcpu,pmem,pid,command"] : ["-axo", "pcpu,pmem,pid,command"];
            G !== "" && H.length > 0 ? B.execSafe("ps", m).then((a) => {
              if (a) {
                let I = a.replace(/ +/g, " ").replace(/,+/g, ".").split(`
`);
                if (H.forEach(function(t) {
                  let l;
                  P ? l = I.filter(function(f) {
                    return f.toLowerCase().indexOf(t) !== -1;
                  }) : l = I.filter(function(f) {
                    return f.toLowerCase().indexOf(" " + t.toLowerCase() + ":") !== -1 || f.toLowerCase().indexOf("(" + t.toLowerCase() + " ") !== -1 || f.toLowerCase().indexOf("(" + t.toLowerCase() + ")") !== -1 || f.toLowerCase().indexOf(" " + t.toLowerCase().replace(/[0-9.]/g, "") + ":") !== -1 || f.toLowerCase().indexOf("/" + t.toLowerCase()) !== -1;
                  });
                  const D = [];
                  for (const f of l) {
                    const w = f.trim().split(" ")[2];
                    w && D.push(parseInt(w, 10));
                  }
                  U.push({
                    name: t,
                    running: l.length > 0,
                    startmode: "",
                    pids: D,
                    cpu: parseFloat(
                      l.reduce(function(f, w) {
                        return f + parseFloat(w.trim().split(" ")[0]);
                      }, 0).toFixed(2)
                    ),
                    mem: parseFloat(
                      l.reduce(function(f, w) {
                        return f + parseFloat(w.trim().split(" ")[1]);
                      }, 0).toFixed(2)
                    )
                  });
                }), k) {
                  let t = 'cat /proc/stat | grep "cpu "';
                  for (let l in U)
                    for (let D in U[l].pids)
                      t += ";cat /proc/" + U[l].pids[D] + "/stat";
                  g(t, { maxBuffer: 1024 * 102400 }, function(l, D) {
                    let f = D.toString().split(`
`), w = E(f.shift()), Y = {}, _ = {};
                    f.forEach((x) => {
                      if (_ = u(x, w, J), _.pid) {
                        let W = -1;
                        for (let z in U)
                          for (let aA in U[z].pids)
                            parseInt(U[z].pids[aA]) === parseInt(_.pid) && (W = z);
                        W >= 0 && (U[W].cpu += _.cpuu + _.cpus), Y[_.pid] = {
                          cpuu: _.cpuu,
                          cpus: _.cpus,
                          utime: _.utime,
                          stime: _.stime,
                          cutime: _.cutime,
                          cstime: _.cstime
                        };
                      }
                    }), J.all = w, J.list = Object.assign({}, Y), J.ms = Date.now() - J.ms, J.result = Object.assign({}, U), n && n(U), L(U);
                  });
                } else
                  n && n(U), L(U);
              } else
                m = ["-o", "comm"], B.execSafe("ps", m).then((I) => {
                  if (I) {
                    let t = I.replace(/ +/g, " ").replace(/,+/g, ".").split(`
`);
                    H.forEach(function(l) {
                      let D = t.filter(function(f) {
                        return f.indexOf(l) !== -1;
                      });
                      U.push({
                        name: l,
                        running: D.length > 0,
                        startmode: "",
                        cpu: 0,
                        mem: 0
                      });
                    }), n && n(U), L(U);
                  } else
                    H.forEach(function(t) {
                      U.push({
                        name: t,
                        running: !1,
                        startmode: "",
                        cpu: 0,
                        mem: 0
                      });
                    }), n && n(U), L(U);
                });
            }) : (n && n(U), L(U));
          }
          if (q)
            try {
              let m = "Get-CimInstance Win32_Service";
              H[0] !== "*" && (m += ' -Filter "', H.forEach((a) => {
                m += `Name='${a}' or `;
              }), m = `${m.slice(0, -4)}"`), m += " | select Name,Caption,Started,StartMode,ProcessId | fl", B.powerShell(m).then((a, I) => {
                I ? (H.forEach((t) => {
                  U.push({
                    name: t,
                    running: !1,
                    startmode: "",
                    cpu: 0,
                    mem: 0
                  });
                }), n && n(U), L(U)) : (a.split(/\n\s*\n/).forEach((l) => {
                  if (l.trim() !== "") {
                    let D = l.trim().split(`\r
`), f = B.getValue(D, "Name", ":", !0).toLowerCase(), w = B.getValue(D, "Caption", ":", !0).toLowerCase(), Y = B.getValue(D, "Started", ":", !0), _ = B.getValue(D, "StartMode", ":", !0), x = B.getValue(D, "ProcessId", ":", !0);
                    (G === "*" || H.indexOf(f) >= 0 || H.indexOf(w) >= 0) && (U.push({
                      name: f,
                      running: Y.toLowerCase() === "true",
                      startmode: _,
                      pids: [x],
                      cpu: 0,
                      mem: 0
                    }), V.push(f), V.push(w));
                  }
                }), G !== "*" && H.filter((D) => V.indexOf(D) === -1).forEach((D) => {
                  U.push({
                    name: D,
                    running: !1,
                    startmode: "",
                    pids: [],
                    cpu: 0,
                    mem: 0
                  });
                }), n && n(U), L(U));
              });
            } catch {
              n && n(U), L(U);
            }
        } else
          n && n([]), L([]);
      });
    });
  }
  processes.services = h;
  function E(c) {
    const n = c.replace(/ +/g, " ").split(" "), L = n.length >= 2 ? parseInt(n[1]) : 0, G = n.length >= 3 ? parseInt(n[2]) : 0, K = n.length >= 4 ? parseInt(n[3]) : 0, gA = n.length >= 5 ? parseInt(n[4]) : 0, H = n.length >= 6 ? parseInt(n[5]) : 0, U = n.length >= 7 ? parseInt(n[6]) : 0, V = n.length >= 8 ? parseInt(n[7]) : 0, m = n.length >= 9 ? parseInt(n[8]) : 0, a = n.length >= 10 ? parseInt(n[9]) : 0, I = n.length >= 11 ? parseInt(n[10]) : 0;
    return L + G + K + gA + H + U + V + m + a + I;
  }
  function u(c, n, L) {
    let G = c.replace(/ +/g, " ").split(")");
    if (G.length >= 2) {
      let K = G[1].split(" ");
      if (K.length >= 16) {
        let gA = parseInt(G[0].split(" ")[0]), H = parseInt(K[12]), U = parseInt(K[13]), V = parseInt(K[14]), m = parseInt(K[15]), a = 0, I = 0;
        return L.all > 0 && L.list[gA] ? (a = (H + V - L.list[gA].utime - L.list[gA].cutime) / (n - L.all) * 100, I = (U + m - L.list[gA].stime - L.list[gA].cstime) / (n - L.all) * 100) : (a = (H + V) / n * 100, I = (U + m) / n * 100), {
          pid: gA,
          utime: H,
          stime: U,
          cutime: V,
          cstime: m,
          cpuu: a,
          cpus: I
        };
      } else
        return {
          pid: 0,
          utime: 0,
          stime: 0,
          cutime: 0,
          cstime: 0,
          cpuu: 0,
          cpus: 0
        };
    } else
      return {
        pid: 0,
        utime: 0,
        stime: 0,
        cutime: 0,
        cstime: 0,
        cpuu: 0,
        cpus: 0
      };
  }
  function o(c, n, L) {
    let G = 0, K = 0;
    return L.all > 0 && L.list[c.pid] ? (G = (c.utime - L.list[c.pid].utime) / (n - L.all) * 100, K = (c.stime - L.list[c.pid].stime) / (n - L.all) * 100) : (G = c.utime / n * 100, K = c.stime / n * 100), {
      pid: c.pid,
      utime: c.utime,
      stime: c.stime,
      cpuu: G > 0 ? G : 0,
      cpus: K > 0 ? K : 0
    };
  }
  function Q(c) {
    let n = [];
    function L(H) {
      H = H || "";
      let U = H.split(" ")[0];
      if (U.substr(-1) === ":" && (U = U.substr(0, U.length - 1)), U.substr(0, 1) !== "[") {
        let V = U.split("/");
        isNaN(parseInt(V[V.length - 1])) ? U = V[V.length - 1] : U = V[0];
      }
      return U;
    }
    function G(H) {
      let U = 0, V = 0;
      function m(v) {
        U = V, n[v] ? V = H.substring(n[v].to + U, 1e4).indexOf(" ") : V = 1e4;
      }
      m(0);
      const a = parseInt(H.substring(n[0].from + U, n[0].to + V));
      m(1);
      const I = parseInt(H.substring(n[1].from + U, n[1].to + V));
      m(2);
      const t = parseFloat(H.substring(n[2].from + U, n[2].to + V).replace(/,/g, "."));
      m(3);
      const l = parseFloat(H.substring(n[3].from + U, n[3].to + V).replace(/,/g, "."));
      m(4);
      const D = parseInt(H.substring(n[4].from + U, n[4].to + V));
      m(5);
      const f = parseInt(H.substring(n[5].from + U, n[5].to + V));
      m(6);
      const w = parseInt(H.substring(n[6].from + U, n[6].to + V));
      m(7);
      const Y = parseInt(H.substring(n[7].from + U, n[7].to + V)) || 0;
      m(8);
      const _ = X ? N(H.substring(n[8].from + U, n[8].to + V).trim()) : p(H.substring(n[8].from + U, n[8].to + V).trim());
      m(9);
      let x = H.substring(n[9].from + U, n[9].to + V).trim();
      x = x[0] === "R" ? "running" : x[0] === "S" ? "sleeping" : x[0] === "T" ? "stopped" : x[0] === "W" ? "paging" : x[0] === "X" ? "dead" : x[0] === "Z" ? "zombie" : x[0] === "D" || x[0] === "U" ? "blocked" : "unknown", m(10);
      let W = H.substring(n[10].from + U, n[10].to + V).trim();
      (W === "?" || W === "??") && (W = ""), m(11);
      const z = H.substring(n[11].from + U, n[11].to + V).trim();
      m(12);
      let aA = "", tA = "", M = "", O = H.substring(n[12].from + U, n[12].to + V).trim();
      if (O.substr(O.length - 1) === "]" && (O = O.slice(0, -1)), O.substr(0, 1) === "[")
        tA = O.substring(1);
      else {
        const v = O.indexOf("("), y = O.indexOf(")"), AA = O.indexOf("/"), oA = O.indexOf(":");
        if (v < y && v < AA && AA < y)
          tA = O.split(" ")[0], tA = tA.replace(/:/g, "");
        else if (oA > 0 && (AA === -1 || AA > 3))
          tA = O.split(" ")[0], tA = tA.replace(/:/g, "");
        else {
          let rA = O.indexOf(" -"), cA = O.indexOf(" /");
          rA = rA >= 0 ? rA : 1e4, cA = cA >= 0 ? cA : 1e4;
          const lA = Math.min(rA, cA);
          let pA = O.substr(0, lA);
          const BA = O.substr(lA), uA = pA.lastIndexOf("/");
          if (uA >= 0 && (aA = pA.substr(0, uA), pA = pA.substr(uA + 1)), lA === 1e4 && pA.indexOf(" ") > -1) {
            const hA = pA.split(" ");
            e.existsSync(A.join(aA, hA[0])) ? (tA = hA.shift(), M = (hA.join(" ") + " " + BA).trim()) : (tA = pA.trim(), M = BA.trim());
          } else
            tA = pA.trim(), M = BA.trim();
        }
      }
      return {
        pid: a,
        parentPid: I,
        name: k ? L(tA) : tA,
        cpu: t,
        cpuu: 0,
        cpus: 0,
        mem: l,
        priority: D,
        memVsz: f,
        memRss: w,
        nice: Y,
        started: _,
        state: x,
        tty: W,
        user: z,
        command: tA,
        params: M,
        path: aA
      };
    }
    function K(H) {
      let U = [];
      if (H.length > 1) {
        let V = H[0];
        n = B.parseHead(V, 8), H.shift(), H.forEach((m) => {
          m.trim() !== "" && U.push(G(m));
        });
      }
      return U;
    }
    function gA(H) {
      function U(a) {
        const I = ("0" + (a.getMonth() + 1).toString()).slice(-2), t = a.getFullYear().toString(), l = ("0" + a.getDate().toString()).slice(-2), D = ("0" + a.getHours().toString()).slice(-2), f = ("0" + a.getMinutes().toString()).slice(-2), w = ("0" + a.getSeconds().toString()).slice(-2);
        return t + "-" + I + "-" + l + " " + D + ":" + f + ":" + w;
      }
      function V(a) {
        let I = "";
        if (a.indexOf("d") >= 0) {
          const t = a.split("d");
          I = U(new Date(Date.now() - (t[0] * 24 + t[1] * 1) * 60 * 60 * 1e3));
        } else if (a.indexOf("h") >= 0) {
          const t = a.split("h");
          I = U(new Date(Date.now() - (t[0] * 60 + t[1] * 1) * 60 * 1e3));
        } else if (a.indexOf(":") >= 0) {
          const t = a.split(":");
          I = U(new Date(Date.now() - (t.length > 1 ? (t[0] * 60 + t[1]) * 1e3 : t[0] * 1e3)));
        }
        return I;
      }
      let m = [];
      return H.forEach((a) => {
        if (a.trim() !== "") {
          a = a.trim().replace(/ +/g, " ").replace(/,+/g, ".");
          const I = a.split(" "), t = I.slice(9).join(" "), l = parseFloat((1 * parseInt(I[3]) * 1024 / s.totalmem()).toFixed(1)), D = V(I[5]);
          m.push({
            pid: parseInt(I[0]),
            parentPid: parseInt(I[1]),
            name: L(t),
            cpu: 0,
            cpuu: 0,
            cpus: 0,
            mem: l,
            priority: 0,
            memVsz: parseInt(I[2]),
            memRss: parseInt(I[3]),
            nice: parseInt(I[4]),
            started: D,
            state: I[6] === "R" ? "running" : I[6] === "S" ? "sleeping" : I[6] === "T" ? "stopped" : I[6] === "W" ? "paging" : I[6] === "X" ? "dead" : I[6] === "Z" ? "zombie" : I[6] === "D" || I[6] === "U" ? "blocked" : "unknown",
            tty: I[7],
            user: I[8],
            command: t
          });
        }
      }), m;
    }
    return new Promise((H) => {
      process.nextTick(() => {
        let U = {
          all: 0,
          running: 0,
          blocked: 0,
          sleeping: 0,
          unknown: 0,
          list: []
        }, V = "";
        if (S.ms && Date.now() - S.ms >= 500 || S.ms === 0)
          if (k || Z || $ || sA || P || X) {
            k && (V = "export LC_ALL=C; ps -axo pid:11,ppid:11,pcpu:6,pmem:6,pri:5,vsz:11,rss:11,ni:5,etime:30,state:5,tty:15,user:20,command; unset LC_ALL"), (Z || $ || sA) && (V = "export LC_ALL=C; ps -axo pid,ppid,pcpu,pmem,pri,vsz,rss,ni,etime,state,tty,user,command; unset LC_ALL"), P && (V = "ps -axo pid,ppid,pcpu,pmem,pri,vsz=temp_title_1,rss=temp_title_2,nice,etime=temp_title_3,state,tty,user,command -r"), X && (V = "ps -Ao pid,ppid,pcpu,pmem,pri,vsz,rss,nice,stime,s,tty,user,comm");
            try {
              g(V, { maxBuffer: 1024 * 102400 }, (m, a) => {
                !m && a.toString().trim() ? (U.list = K(a.toString().split(`
`)).slice(), U.all = U.list.length, U.running = U.list.filter((I) => I.state === "running").length, U.blocked = U.list.filter((I) => I.state === "blocked").length, U.sleeping = U.list.filter((I) => I.state === "sleeping").length, k ? (V = 'cat /proc/stat | grep "cpu "', U.list.forEach((I) => {
                  V += ";cat /proc/" + I.pid + "/stat";
                }), g(V, { maxBuffer: 1024 * 102400 }, (I, t) => {
                  let l = t.toString().split(`
`), D = E(l.shift()), f = {}, w = {};
                  l.forEach((Y) => {
                    if (w = u(Y, D, S), w.pid) {
                      let _ = U.list.map((x) => x.pid).indexOf(w.pid);
                      _ >= 0 && (U.list[_].cpu = w.cpuu + w.cpus, U.list[_].cpuu = w.cpuu, U.list[_].cpus = w.cpus), f[w.pid] = {
                        cpuu: w.cpuu,
                        cpus: w.cpus,
                        utime: w.utime,
                        stime: w.stime,
                        cutime: w.cutime,
                        cstime: w.cstime
                      };
                    }
                  }), S.all = D, S.list = Object.assign({}, f), S.ms = Date.now() - S.ms, S.result = Object.assign({}, U), c && c(U), H(U);
                })) : (c && c(U), H(U))) : (V = "ps -o pid,ppid,vsz,rss,nice,etime,stat,tty,user,comm", X && (V = "ps -o pid,ppid,vsz,rss,nice,etime,s,tty,user,comm"), g(V, { maxBuffer: 1024 * 102400 }, (I, t) => {
                  if (I)
                    c && c(U), H(U);
                  else {
                    let l = t.toString().split(`
`);
                    l.shift(), U.list = gA(l).slice(), U.all = U.list.length, U.running = U.list.filter((D) => D.state === "running").length, U.blocked = U.list.filter((D) => D.state === "blocked").length, U.sleeping = U.list.filter((D) => D.state === "sleeping").length, c && c(U), H(U);
                  }
                }));
              });
            } catch {
              c && c(U), H(U);
            }
          } else if (q)
            try {
              B.powerShell(
                `Get-CimInstance Win32_Process | select-Object ProcessId,ParentProcessId,ExecutionState,Caption,CommandLine,ExecutablePath,UserModeTime,KernelModeTime,WorkingSetSize,Priority,PageFileUsage,
                @{n="CreationDate";e={$_.CreationDate.ToString("yyyy-MM-dd HH:mm:ss")}} | ConvertTo-Json -compress`
              ).then((m, a) => {
                if (!a) {
                  const I = [], t = [], l = {};
                  let D = 0, f = 0, w = [];
                  try {
                    m = m.trim().replace(/^\uFEFF/, ""), w = JSON.parse(m);
                  } catch {
                  }
                  w.forEach((Y) => {
                    const _ = Y.ProcessId, x = Y.ParentProcessId, W = Y.ExecutionState || null, z = Y.Caption, aA = Y.CommandLine, tA = Y.ExecutablePath, M = Y.UserModeTime, O = Y.KernelModeTime, v = Y.WorkingSetSize;
                    D = D + M, f = f + O, U.all++, W || U.unknown++, W === "3" && U.running++, (W === "4" || W === "5") && U.blocked++, t.push({
                      pid: _,
                      utime: M,
                      stime: O,
                      cpu: 0,
                      cpuu: 0,
                      cpus: 0
                    }), I.push({
                      pid: _,
                      parentPid: x,
                      name: z,
                      cpu: 0,
                      cpuu: 0,
                      cpus: 0,
                      mem: v / s.totalmem() * 100,
                      priority: Y.Priority | null,
                      memVsz: Y.PageFileUsage || null,
                      memRss: Math.floor((Y.WorkingSetSize || 0) / 1024),
                      nice: 0,
                      started: Y.CreationDate,
                      state: W ? b[W] : b[0],
                      tty: "",
                      user: "",
                      command: aA || z,
                      path: tA,
                      params: ""
                    });
                  }), U.sleeping = U.all - U.running - U.blocked - U.unknown, U.list = I, t.forEach((Y) => {
                    let _ = o(Y, D + f, S), x = U.list.map((W) => W.pid).indexOf(_.pid);
                    x >= 0 && (U.list[x].cpu = _.cpuu + _.cpus, U.list[x].cpuu = _.cpuu, U.list[x].cpus = _.cpus), l[_.pid] = {
                      cpuu: _.cpuu,
                      cpus: _.cpus,
                      utime: _.utime,
                      stime: _.stime
                    };
                  }), S.all = D + f, S.all_utime = D, S.all_stime = f, S.list = Object.assign({}, l), S.ms = Date.now() - S.ms, S.result = Object.assign({}, U);
                }
                c && c(U), H(U);
              });
            } catch {
              c && c(U), H(U);
            }
          else
            c && c(U), H(U);
        else
          c && c(S.result), H(S.result);
      });
    });
  }
  processes.processes = Q;
  function d(c, n) {
    return B.isFunction(c) && !n && (n = c, c = ""), new Promise((L) => {
      process.nextTick(() => {
        if (c = c || "", typeof c != "string")
          return n && n([]), L([]);
        let G = "";
        try {
          G.__proto__.toLowerCase = B.stringToLower, G.__proto__.replace = B.stringReplace, G.__proto__.toString = B.stringToString, G.__proto__.substr = B.stringSubstr, G.__proto__.substring = B.stringSubstring, G.__proto__.trim = B.stringTrim, G.__proto__.startsWith = B.stringStartWith;
        } catch {
          Object.setPrototypeOf(G, B.stringObj);
        }
        const K = B.sanitizeShellString(c), gA = B.mathMin(K.length, 2e3);
        for (let m = 0; m <= gA; m++)
          K[m] !== void 0 && (G = G + K[m]);
        G = G.trim().toLowerCase().replace(/, /g, "|").replace(/,+/g, "|"), G === "" && (G = "*"), B.isPrototypePolluted() && G !== "*" && (G = "------");
        let H = G.split("|"), U = [];
        if ((B.isPrototypePolluted() ? "" : B.sanitizeShellString(c) || "*") && H.length && H[0] !== "------") {
          if (q)
            try {
              B.powerShell("Get-CimInstance Win32_Process | select ProcessId,Caption,UserModeTime,KernelModeTime,WorkingSetSize | ConvertTo-Json -compress").then((m, a) => {
                if (!a) {
                  const I = [], t = {};
                  let l = 0, D = 0, f = [];
                  try {
                    m = m.trim().replace(/^\uFEFF/, ""), f = JSON.parse(m);
                  } catch {
                  }
                  f.forEach((w) => {
                    const Y = w.ProcessId, _ = w.Caption, x = w.UserModeTime, W = w.KernelModeTime, z = w.WorkingSetSize;
                    l = l + x, D = D + W, I.push({
                      pid: Y,
                      name: _,
                      utime: x,
                      stime: W,
                      cpu: 0,
                      cpuu: 0,
                      cpus: 0,
                      mem: z
                    });
                    let aA = "", tA = !1;
                    if (H.forEach((M) => {
                      _.toLowerCase().indexOf(M.toLowerCase()) >= 0 && !tA && (tA = !0, aA = M);
                    }), G === "*" || tA) {
                      let M = !1;
                      U.forEach((O) => {
                        O.proc.toLowerCase() === aA.toLowerCase() && (O.pids.push(Y), O.mem += z / s.totalmem() * 100, M = !0);
                      }), M || U.push({
                        proc: aA,
                        pid: Y,
                        pids: [Y],
                        cpu: 0,
                        mem: z / s.totalmem() * 100
                      });
                    }
                  }), G !== "*" && H.filter((Y) => I.filter((_) => _.name.toLowerCase().indexOf(Y) >= 0).length === 0).forEach((Y) => {
                    U.push({
                      proc: Y,
                      pid: null,
                      pids: [],
                      cpu: 0,
                      mem: 0
                    });
                  }), I.forEach((w) => {
                    let Y = o(w, l + D, eA), _ = -1;
                    for (let x = 0; x < U.length; x++)
                      (U[x].pid === Y.pid || U[x].pids.indexOf(Y.pid) >= 0) && (_ = x);
                    _ >= 0 && (U[_].cpu += Y.cpuu + Y.cpus), t[Y.pid] = {
                      cpuu: Y.cpuu,
                      cpus: Y.cpus,
                      utime: Y.utime,
                      stime: Y.stime
                    };
                  }), eA.all = l + D, eA.all_utime = l, eA.all_stime = D, eA.list = Object.assign({}, t), eA.ms = Date.now() - eA.ms, eA.result = JSON.parse(JSON.stringify(U)), n && n(U), L(U);
                }
              });
            } catch {
              n && n(U), L(U);
            }
          if (P || k || Z || $ || sA) {
            const m = ["-axo", "pid,ppid,pcpu,pmem,comm"];
            B.execSafe("ps", m).then((a) => {
              if (a) {
                const I = [], t = a.toString().split(`
`).filter((l) => {
                  if (G === "*")
                    return !0;
                  if (l.toLowerCase().indexOf("grep") !== -1)
                    return !1;
                  let D = !1;
                  return H.forEach((f) => {
                    D = D || l.toLowerCase().indexOf(f.toLowerCase()) >= 0;
                  }), D;
                });
                if (t.shift(), t.forEach((l) => {
                  const D = l.trim().replace(/ +/g, " ").split(" ");
                  if (D.length > 4) {
                    const f = D[4].indexOf("/") >= 0 ? D[4].substring(0, D[4].indexOf("/")) : D[4], w = k ? f : D[4].substring(D[4].lastIndexOf("/") + 1);
                    I.push({
                      name: w,
                      pid: parseInt(D[0]) || 0,
                      ppid: parseInt(D[1]) || 0,
                      cpu: parseFloat(D[2].replace(",", ".")),
                      mem: parseFloat(D[3].replace(",", "."))
                    });
                  }
                }), I.forEach((l) => {
                  let D = -1, f = !1, w = l.name;
                  for (let Y = 0; Y < U.length; Y++)
                    l.name.toLowerCase().indexOf(U[Y].proc.toLowerCase()) >= 0 && (D = Y);
                  H.forEach((Y) => {
                    l.name.toLowerCase().indexOf(Y.toLowerCase()) >= 0 && !f && (f = !0, w = Y);
                  }), (G === "*" || f) && (D < 0 ? w && U.push({
                    proc: w,
                    pid: l.pid,
                    pids: [l.pid],
                    cpu: l.cpu,
                    mem: l.mem
                  }) : (l.ppid < 10 && (U[D].pid = l.pid), U[D].pids.push(l.pid), U[D].cpu += l.cpu, U[D].mem += l.mem));
                }), G !== "*" && H.filter((D) => I.filter((f) => f.name.toLowerCase().indexOf(D) >= 0).length === 0).forEach((D) => {
                  U.push({
                    proc: D,
                    pid: null,
                    pids: [],
                    cpu: 0,
                    mem: 0
                  });
                }), k) {
                  U.forEach((D) => {
                    D.cpu = 0;
                  });
                  let l = 'cat /proc/stat | grep "cpu "';
                  for (let D in U)
                    for (let f in U[D].pids)
                      l += ";cat /proc/" + U[D].pids[f] + "/stat";
                  g(l, { maxBuffer: 1024 * 102400 }, (D, f) => {
                    let w = f.toString().split(`
`), Y = E(w.shift()), _ = {}, x = {};
                    w.forEach((W) => {
                      if (x = u(W, Y, eA), x.pid) {
                        let z = -1;
                        for (let aA in U)
                          U[aA].pids.indexOf(x.pid) >= 0 && (z = aA);
                        z >= 0 && (U[z].cpu += x.cpuu + x.cpus), _[x.pid] = {
                          cpuu: x.cpuu,
                          cpus: x.cpus,
                          utime: x.utime,
                          stime: x.stime,
                          cutime: x.cutime,
                          cstime: x.cstime
                        };
                      }
                    }), U.forEach((W) => {
                      W.cpu = Math.round(W.cpu * 100) / 100;
                    }), eA.all = Y, eA.list = Object.assign({}, _), eA.ms = Date.now() - eA.ms, eA.result = Object.assign({}, U), n && n(U), L(U);
                  });
                } else
                  n && n(U), L(U);
              } else
                n && n(U), L(U);
            });
          }
        }
      });
    });
  }
  return processes.processLoad = d, processes;
}
var users = {}, hasRequiredUsers;
function requireUsers() {
  if (hasRequiredUsers) return users;
  hasRequiredUsers = 1;
  const s = require$$1.exec, e = requireUtil(), A = process.platform, g = A === "linux" || A === "android", r = A === "darwin", B = A === "win32", F = A === "freebsd", k = A === "openbsd", P = A === "netbsd", q = A === "sunos";
  function Z(p, h) {
    let E = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    try {
      E = "" + (/* @__PURE__ */ new Date()).getFullYear() + "-" + ("0" + ("JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC".indexOf(p.toUpperCase()) / 3 + 1)).slice(-2) + "-" + ("0" + h).slice(-2), new Date(E) > /* @__PURE__ */ new Date() && (E = "" + ((/* @__PURE__ */ new Date()).getFullYear() - 1) + "-" + ("0" + ("JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC".indexOf(p.toUpperCase()) / 3 + 1)).slice(-2) + "-" + ("0" + h).slice(-2));
    } catch {
      e.noop();
    }
    return E;
  }
  function $(p, h) {
    const E = [];
    let u = [];
    const o = {};
    let Q = !0, d = [];
    const c = [];
    let n = {}, L = !0, G = !1;
    return p.forEach((K) => {
      if (K === "---")
        L = !1;
      else {
        const gA = K.replace(/ +/g, " ").split(" ");
        if (L) {
          if ((K.toLowerCase().indexOf("unexpected") >= 0 || K.toLowerCase().indexOf("unrecognized") >= 0) && (G = !0, u = []), !G) {
            const H = gA && gA.length > 4 && gA[4].indexOf(":") > 0 ? 4 : 3;
            u.push({
              user: gA[0],
              tty: gA[1],
              date: H === 4 ? Z(gA[2], gA[3]) : gA[2],
              time: gA[H],
              ip: gA && gA.length > H + 1 ? gA[H + 1].replace(/\(/g, "").replace(/\)/g, "") : "",
              command: ""
            });
          }
        } else
          Q ? K[0] !== " " && (d = gA, d.forEach((H) => {
            c.push(K.indexOf(H));
          }), Q = !1) : (o.user = K.substring(c[0], c[1] - 1).trim(), o.tty = K.substring(c[1], c[2] - 1).trim(), o.ip = K.substring(c[2], c[3] - 1).replace(/\(/g, "").replace(/\)/g, "").trim(), o.command = K.substring(c[7], 1e3).trim(), u.length || h === 1 ? n = u.filter((H) => H.user.substring(0, 8).trim() === o.user && H.tty === o.tty) : n = [{ user: o.user, tty: o.tty, date: "", time: "", ip: "" }], n.length === 1 && n[0].user !== "" && E.push({
            user: n[0].user,
            tty: n[0].tty,
            date: n[0].date,
            time: n[0].time,
            ip: n[0].ip,
            command: o.command
          }));
      }
    }), E.length === 0 && h === 2 ? u : E;
  }
  function sA(p) {
    const h = [], E = [], u = {};
    let o = {}, Q = !0;
    return p.forEach((d) => {
      if (d === "---")
        Q = !1;
      else {
        const c = d.replace(/ +/g, " ").split(" ");
        Q ? E.push({
          user: c[0],
          tty: c[1],
          date: Z(c[2], c[3]),
          time: c[4]
        }) : (u.user = c[0], u.tty = c[1], u.ip = c[2] !== "-" ? c[2] : "", u.command = c.slice(5, 1e3).join(" "), o = E.filter((n) => n.user.substring(0, 10) === u.user.substring(0, 10) && (n.tty.substring(3, 1e3) === u.tty || n.tty === u.tty)), o.length === 1 && h.push({
          user: o[0].user,
          tty: o[0].tty,
          date: o[0].date,
          time: o[0].time,
          ip: u.ip,
          command: u.command
        }));
      }
    }), h;
  }
  function X(p) {
    return new Promise((h) => {
      process.nextTick(() => {
        let E = [];
        if (g && s('export LC_ALL=C; who --ips; echo "---"; w; unset LC_ALL | tail -n +2', (u, o) => {
          if (u)
            p && p(E), h(E);
          else {
            let Q = o.toString().split(`
`);
            E = $(Q, 1), E.length === 0 ? s('who; echo "---"; w | tail -n +2', (d, c) => {
              d || (Q = c.toString().split(`
`), E = $(Q, 2)), p && p(E), h(E);
            }) : (p && p(E), h(E));
          }
        }), (F || k || P) && s('who; echo "---"; w -ih', (u, o) => {
          if (!u) {
            const Q = o.toString().split(`
`);
            E = sA(Q);
          }
          p && p(E), h(E);
        }), q && s('who; echo "---"; w -h', (u, o) => {
          if (!u) {
            const Q = o.toString().split(`
`);
            E = sA(Q);
          }
          p && p(E), h(E);
        }), r && s('export LC_ALL=C; who; echo "---"; w -ih; unset LC_ALL', (u, o) => {
          if (!u) {
            const Q = o.toString().split(`
`);
            E = sA(Q);
          }
          p && p(E), h(E);
        }), B)
          try {
            let u = `Get-CimInstance Win32_LogonSession | select LogonId,@{n="StartTime";e={$_.StartTime.ToString("yyyy-MM-dd HH:mm:ss")}} | fl; echo '#-#-#-#';`;
            u += "Get-CimInstance Win32_LoggedOnUser | select antecedent,dependent | fl ; echo '#-#-#-#';", u += `$process = (Get-CimInstance Win32_Process -Filter "name = 'explorer.exe'"); Invoke-CimMethod -InputObject $process[0] -MethodName GetOwner | select user, domain | fl; get-process -name explorer | select-object sessionid | fl; echo '#-#-#-#';`, u += "query user", e.powerShell(u).then((o) => {
              if (o) {
                o = o.split("#-#-#-#");
                const Q = S((o[0] || "").split(/\n\s*\n/)), d = b((o[1] || "").split(/\n\s*\n/)), c = N((o[3] || "").split(`\r
`)), n = eA((o[2] || "").split(/\n\s*\n/), c);
                for (let L in d)
                  ({}).hasOwnProperty.call(d, L) && (d[L].dateTime = {}.hasOwnProperty.call(Q, L) ? Q[L] : "");
                n.forEach((L) => {
                  let G = "";
                  for (let K in d)
                    ({}).hasOwnProperty.call(d, K) && d[K].user === L.user && (!G || G < d[K].dateTime) && (G = d[K].dateTime);
                  E.push({
                    user: L.user,
                    tty: L.tty,
                    date: `${G.substring(0, 10)}`,
                    time: `${G.substring(11, 19)}`,
                    ip: "",
                    command: ""
                  });
                });
              }
              p && p(E), h(E);
            });
          } catch {
            p && p(E), h(E);
          }
      });
    });
  }
  function S(p) {
    const h = {};
    return p.forEach((E) => {
      const u = E.split(`\r
`), o = e.getValue(u, "LogonId"), Q = e.getValue(u, "starttime");
      o && (h[o] = Q);
    }), h;
  }
  function J(p, h) {
    p = p.toLowerCase(), h = h.toLowerCase();
    let E = 0, u = p.length;
    h.length > u && (u = h.length);
    for (let o = 0; o < u; o++) {
      const Q = p[o] || "", d = h[o] || "";
      Q === d && E++;
    }
    return u > 10 ? E / u > 0.9 : u > 0 ? E / u > 0.8 : !1;
  }
  function eA(p, h) {
    const E = [];
    return p.forEach((u) => {
      const o = u.split(`\r
`), Q = e.getValue(o, "domain", ":", !0), d = e.getValue(o, "user", ":", !0), c = e.getValue(o, "sessionid", ":", !0);
      if (d) {
        const n = h.filter((L) => J(L.user, d));
        E.push({
          domain: Q,
          user: d,
          tty: n && n[0] && n[0].tty ? n[0].tty : c
        });
      }
    }), E;
  }
  function b(p) {
    const h = {};
    return p.forEach((E) => {
      const u = E.split(`\r
`);
      let Q = e.getValue(u, "antecedent", ":", !0).split("=");
      const d = Q.length > 2 ? Q[1].split(",")[0].replace(/"/g, "").trim() : "", c = Q.length > 2 ? Q[2].replace(/"/g, "").replace(/\)/g, "").trim() : "";
      Q = e.getValue(u, "dependent", ":", !0).split("=");
      const L = Q.length > 1 ? Q[1].replace(/"/g, "").replace(/\)/g, "").trim() : "";
      L && (h[L] = {
        domain: c,
        user: d
      });
    }), h;
  }
  function N(p) {
    p = p.filter((o) => o);
    let h = [];
    const E = p[0], u = [];
    if (E) {
      const o = E[0] === " " ? 1 : 0;
      u.push(o - 1);
      let Q = 0;
      for (let d = o + 1; d < E.length; d++)
        E[d] === " " && (E[d - 1] === " " || E[d - 1] === ".") ? Q = d : Q && (u.push(Q), Q = 0);
      for (let d = 1; d < p.length; d++)
        if (p[d].trim()) {
          const c = p[d].substring(u[0] + 1, u[1]).trim() || "", n = p[d].substring(u[1] + 1, u[2] - 2).trim() || "";
          h.push({
            user: c,
            tty: n
          });
        }
    }
    return h;
  }
  return users.users = X, users;
}
var internet = {}, hasRequiredInternet;
function requireInternet() {
  if (hasRequiredInternet) return internet;
  hasRequiredInternet = 1;
  const s = requireUtil(), e = process.platform, A = e === "linux" || e === "android", g = e === "darwin", r = e === "win32", B = e === "freebsd", F = e === "openbsd", k = e === "netbsd", P = e === "sunos";
  function q($, sA) {
    return new Promise((X) => {
      process.nextTick(() => {
        let S = {
          url: $,
          ok: !1,
          status: 404,
          ms: null
        };
        if (typeof $ != "string")
          return sA && sA(S), X(S);
        let J = "";
        const eA = s.sanitizeShellString($, !0), b = s.mathMin(eA.length, 2e3);
        for (let N = 0; N <= b; N++)
          if (eA[N] !== void 0) {
            try {
              eA[N].__proto__.toLowerCase = s.stringToLower;
            } catch {
              Object.setPrototypeOf(eA[N], s.stringObj);
            }
            const p = eA[N].toLowerCase();
            p && p[0] && !p[1] && p[0].length === 1 && (J = J + p[0]);
          }
        S.url = J;
        try {
          if (J && !s.isPrototypePolluted()) {
            try {
              J.__proto__.startsWith = s.stringStartWith;
            } catch {
              Object.setPrototypeOf(J, s.stringObj);
            }
            if (J.startsWith("file:") || J.startsWith("gopher:") || J.startsWith("telnet:") || J.startsWith("mailto:") || J.startsWith("news:") || J.startsWith("nntp:"))
              return sA && sA(S), X(S);
            s.checkWebsite(J).then((N) => {
              S.status = N.statusCode, S.ok = N.statusCode >= 200 && N.statusCode <= 399, S.ms = S.ok ? N.time : null, sA && sA(S), X(S);
            });
          } else
            sA && sA(S), X(S);
        } catch {
          sA && sA(S), X(S);
        }
      });
    });
  }
  internet.inetChecksite = q;
  function Z($, sA) {
    return s.isFunction($) && !sA && (sA = $, $ = ""), $ = $ || "8.8.8.8", new Promise((X) => {
      process.nextTick(() => {
        if (typeof $ != "string")
          return sA && sA(null), X(null);
        let S = "";
        const J = (s.isPrototypePolluted() ? "8.8.8.8" : s.sanitizeShellString($, !0)).trim(), eA = s.mathMin(J.length, 2e3);
        for (let N = 0; N <= eA; N++)
          if (J[N] !== void 0) {
            try {
              J[N].__proto__.toLowerCase = s.stringToLower;
            } catch {
              Object.setPrototypeOf(J[N], s.stringObj);
            }
            const p = J[N].toLowerCase();
            p && p[0] && !p[1] && (S = S + p[0]);
          }
        try {
          S.__proto__.startsWith = s.stringStartWith;
        } catch {
          Object.setPrototypeOf(S, s.stringObj);
        }
        if (S.startsWith("file:") || S.startsWith("gopher:") || S.startsWith("telnet:") || S.startsWith("mailto:") || S.startsWith("news:") || S.startsWith("nntp:"))
          return sA && sA(null), X(null);
        let b;
        if ((A || B || F || k || g) && (A && (b = ["-c", "2", "-w", "3", S]), (B || F || k) && (b = ["-c", "2", "-t", "3", S]), g && (b = ["-c2", "-t3", S]), s.execSafe("ping", b).then((N) => {
          let p = null;
          if (N) {
            const E = N.split(`
`).filter((u) => u.indexOf("rtt") >= 0 || u.indexOf("round-trip") >= 0 || u.indexOf("avg") >= 0).join(`
`).split("=");
            if (E.length > 1) {
              const u = E[1].split("/");
              u.length > 1 && (p = parseFloat(u[1]));
            }
          }
          sA && sA(p), X(p);
        })), P) {
          const N = ["-s", "-a", S, "56", "2"], p = "avg";
          s.execSafe("ping", N, { timeout: 3e3 }).then((h) => {
            let E = null;
            if (h) {
              const o = h.split(`
`).filter((Q) => Q.indexOf(p) >= 0).join(`
`).split("=");
              if (o.length > 1) {
                const Q = o[1].split("/");
                Q.length > 1 && (E = parseFloat(Q[1].replace(",", ".")));
              }
            }
            sA && sA(E), X(E);
          });
        }
        if (r) {
          let N = null;
          try {
            const p = [S, "-n", "1"];
            s.execSafe("ping", p, s.execOptsWin).then((h) => {
              if (h) {
                const E = h.split(`\r
`);
                E.shift(), E.forEach((u) => {
                  if ((u.toLowerCase().match(/ms/g) || []).length === 3) {
                    let o = u.replace(/ +/g, " ").split(" ");
                    o.length > 6 && (N = parseFloat(o[o.length - 1]));
                  }
                });
              }
              sA && sA(N), X(N);
            });
          } catch {
            sA && sA(N), X(N);
          }
        }
      });
    });
  }
  return internet.inetLatency = Z, internet;
}
var docker = {}, dockerSocket, hasRequiredDockerSocket;
function requireDockerSocket() {
  if (hasRequiredDockerSocket) return dockerSocket;
  hasRequiredDockerSocket = 1;
  const s = require$$0$2, A = require$$0$1.type() === "Windows_NT" ? "//./pipe/docker_engine" : "/var/run/docker.sock";
  class g {
    getInfo(B) {
      try {
        let F = s.createConnection({ path: A }), k = "", P;
        F.on("connect", () => {
          F.write(`GET http:/info HTTP/1.0\r
\r
`);
        }), F.on("data", (q) => {
          k = k + q.toString();
        }), F.on("error", () => {
          F = !1, B({});
        }), F.on("end", () => {
          const q = k.indexOf(`\r
\r
`);
          k = k.substring(q + 4), F = !1;
          try {
            P = JSON.parse(k), B(P);
          } catch {
            B({});
          }
        });
      } catch {
        B({});
      }
    }
    listImages(B, F) {
      try {
        let k = s.createConnection({ path: A }), P = "", q;
        k.on("connect", () => {
          k.write("GET http:/images/json" + (B ? "?all=1" : "") + ` HTTP/1.0\r
\r
`);
        }), k.on("data", (Z) => {
          P = P + Z.toString();
        }), k.on("error", () => {
          k = !1, F({});
        }), k.on("end", () => {
          const Z = P.indexOf(`\r
\r
`);
          P = P.substring(Z + 4), k = !1;
          try {
            q = JSON.parse(P), F(q);
          } catch {
            F({});
          }
        });
      } catch {
        F({});
      }
    }
    inspectImage(B, F) {
      if (B = B || "", B)
        try {
          let k = s.createConnection({ path: A }), P = "", q;
          k.on("connect", () => {
            k.write("GET http:/images/" + B + `/json?stream=0 HTTP/1.0\r
\r
`);
          }), k.on("data", (Z) => {
            P = P + Z.toString();
          }), k.on("error", () => {
            k = !1, F({});
          }), k.on("end", () => {
            const Z = P.indexOf(`\r
\r
`);
            P = P.substring(Z + 4), k = !1;
            try {
              q = JSON.parse(P), F(q);
            } catch {
              F({});
            }
          });
        } catch {
          F({});
        }
      else
        F({});
    }
    listContainers(B, F) {
      try {
        let k = s.createConnection({ path: A }), P = "", q;
        k.on("connect", () => {
          k.write("GET http:/containers/json" + (B ? "?all=1" : "") + ` HTTP/1.0\r
\r
`);
        }), k.on("data", (Z) => {
          P = P + Z.toString();
        }), k.on("error", () => {
          k = !1, F({});
        }), k.on("end", () => {
          const Z = P.indexOf(`\r
\r
`);
          P = P.substring(Z + 4), k = !1;
          try {
            q = JSON.parse(P), F(q);
          } catch {
            F({});
          }
        });
      } catch {
        F({});
      }
    }
    getStats(B, F) {
      if (B = B || "", B)
        try {
          let k = s.createConnection({ path: A }), P = "", q;
          k.on("connect", () => {
            k.write("GET http:/containers/" + B + `/stats?stream=0 HTTP/1.0\r
\r
`);
          }), k.on("data", (Z) => {
            P = P + Z.toString();
          }), k.on("error", () => {
            k = !1, F({});
          }), k.on("end", () => {
            const Z = P.indexOf(`\r
\r
`);
            P = P.substring(Z + 4), k = !1;
            try {
              q = JSON.parse(P), F(q);
            } catch {
              F({});
            }
          });
        } catch {
          F({});
        }
      else
        F({});
    }
    getInspect(B, F) {
      if (B = B || "", B)
        try {
          let k = s.createConnection({ path: A }), P = "", q;
          k.on("connect", () => {
            k.write("GET http:/containers/" + B + `/json?stream=0 HTTP/1.0\r
\r
`);
          }), k.on("data", (Z) => {
            P = P + Z.toString();
          }), k.on("error", () => {
            k = !1, F({});
          }), k.on("end", () => {
            const Z = P.indexOf(`\r
\r
`);
            P = P.substring(Z + 4), k = !1;
            try {
              q = JSON.parse(P), F(q);
            } catch {
              F({});
            }
          });
        } catch {
          F({});
        }
      else
        F({});
    }
    getProcesses(B, F) {
      if (B = B || "", B)
        try {
          let k = s.createConnection({ path: A }), P = "", q;
          k.on("connect", () => {
            k.write("GET http:/containers/" + B + `/top?ps_args=-opid,ppid,pgid,vsz,time,etime,nice,ruser,user,rgroup,group,stat,rss,args HTTP/1.0\r
\r
`);
          }), k.on("data", (Z) => {
            P = P + Z.toString();
          }), k.on("error", () => {
            k = !1, F({});
          }), k.on("end", () => {
            const Z = P.indexOf(`\r
\r
`);
            P = P.substring(Z + 4), k = !1;
            try {
              q = JSON.parse(P), F(q);
            } catch {
              F({});
            }
          });
        } catch {
          F({});
        }
      else
        F({});
    }
    listVolumes(B) {
      try {
        let F = s.createConnection({ path: A }), k = "", P;
        F.on("connect", () => {
          F.write(`GET http:/volumes HTTP/1.0\r
\r
`);
        }), F.on("data", (q) => {
          k = k + q.toString();
        }), F.on("error", () => {
          F = !1, B({});
        }), F.on("end", () => {
          const q = k.indexOf(`\r
\r
`);
          k = k.substring(q + 4), F = !1;
          try {
            P = JSON.parse(k), B(P);
          } catch {
            B({});
          }
        });
      } catch {
        B({});
      }
    }
  }
  return dockerSocket = g, dockerSocket;
}
var hasRequiredDocker;
function requireDocker() {
  if (hasRequiredDocker) return docker;
  hasRequiredDocker = 1;
  const s = requireUtil(), e = requireDockerSocket(), g = process.platform === "win32", r = {};
  let B, F = 0;
  function k(h) {
    return new Promise((E) => {
      process.nextTick(() => {
        B || (B = new e());
        const u = {};
        B.getInfo((o) => {
          u.id = o.ID, u.containers = o.Containers, u.containersRunning = o.ContainersRunning, u.containersPaused = o.ContainersPaused, u.containersStopped = o.ContainersStopped, u.images = o.Images, u.driver = o.Driver, u.memoryLimit = o.MemoryLimit, u.swapLimit = o.SwapLimit, u.kernelMemory = o.KernelMemory, u.cpuCfsPeriod = o.CpuCfsPeriod, u.cpuCfsQuota = o.CpuCfsQuota, u.cpuShares = o.CPUShares, u.cpuSet = o.CPUSet, u.ipv4Forwarding = o.IPv4Forwarding, u.bridgeNfIptables = o.BridgeNfIptables, u.bridgeNfIp6tables = o.BridgeNfIp6tables, u.debug = o.Debug, u.nfd = o.NFd, u.oomKillDisable = o.OomKillDisable, u.ngoroutines = o.NGoroutines, u.systemTime = o.SystemTime, u.loggingDriver = o.LoggingDriver, u.cgroupDriver = o.CgroupDriver, u.nEventsListener = o.NEventsListener, u.kernelVersion = o.KernelVersion, u.operatingSystem = o.OperatingSystem, u.osType = o.OSType, u.architecture = o.Architecture, u.ncpu = o.NCPU, u.memTotal = o.MemTotal, u.dockerRootDir = o.DockerRootDir, u.httpProxy = o.HttpProxy, u.httpsProxy = o.HttpsProxy, u.noProxy = o.NoProxy, u.name = o.Name, u.labels = o.Labels, u.experimentalBuild = o.ExperimentalBuild, u.serverVersion = o.ServerVersion, u.clusterStore = o.ClusterStore, u.clusterAdvertise = o.ClusterAdvertise, u.defaultRuntime = o.DefaultRuntime, u.liveRestoreEnabled = o.LiveRestoreEnabled, u.isolation = o.Isolation, u.initBinary = o.InitBinary, u.productLicense = o.ProductLicense, h && h(u), E(u);
        });
      });
    });
  }
  docker.dockerInfo = k;
  function P(h, E) {
    s.isFunction(h) && !E && (E = h, h = !1), typeof h == "string" && h === "true" && (h = !0), typeof h != "boolean" && h !== void 0 && (h = !1), h = h || !1;
    let u = [];
    return new Promise((o) => {
      process.nextTick(() => {
        B || (B = new e());
        const Q = [];
        B.listImages(h, (d) => {
          let c = {};
          try {
            c = d, c && Object.prototype.toString.call(c) === "[object Array]" && c.length > 0 ? (c.forEach((n) => {
              n.Names && Object.prototype.toString.call(n.Names) === "[object Array]" && n.Names.length > 0 && (n.Name = n.Names[0].replace(/^\/|\/$/g, "")), Q.push(q(n.Id.trim(), n));
            }), Q.length ? Promise.all(Q).then((n) => {
              E && E(n), o(n);
            }) : (E && E(u), o(u))) : (E && E(u), o(u));
          } catch {
            E && E(u), o(u);
          }
        });
      });
    });
  }
  function q(h, E) {
    return new Promise((u) => {
      process.nextTick(() => {
        if (h = h || "", typeof h != "string")
          return u();
        const o = (s.isPrototypePolluted() ? "" : s.sanitizeShellString(h, !0)).trim();
        o ? (B || (B = new e()), B.inspectImage(o.trim(), (Q) => {
          try {
            u({
              id: E.Id,
              container: Q.Container,
              comment: Q.Comment,
              os: Q.Os,
              architecture: Q.Architecture,
              parent: Q.Parent,
              dockerVersion: Q.DockerVersion,
              size: Q.Size,
              sharedSize: E.SharedSize,
              virtualSize: Q.VirtualSize,
              author: Q.Author,
              created: Q.Created ? Math.round(new Date(Q.Created).getTime() / 1e3) : 0,
              containerConfig: Q.ContainerConfig ? Q.ContainerConfig : {},
              graphDriver: Q.GraphDriver ? Q.GraphDriver : {},
              repoDigests: Q.RepoDigests ? Q.RepoDigests : {},
              repoTags: Q.RepoTags ? Q.RepoTags : {},
              config: Q.Config ? Q.Config : {},
              rootFS: Q.RootFS ? Q.RootFS : {}
            });
          } catch {
            u();
          }
        })) : u();
      });
    });
  }
  docker.dockerImages = P;
  function Z(h, E) {
    function u(Q, d) {
      return Q.filter((n) => n.Id && n.Id === d).length > 0;
    }
    s.isFunction(h) && !E && (E = h, h = !1), typeof h == "string" && h === "true" && (h = !0), typeof h != "boolean" && h !== void 0 && (h = !1), h = h || !1;
    let o = [];
    return new Promise((Q) => {
      process.nextTick(() => {
        B || (B = new e());
        const d = [];
        B.listContainers(h, (c) => {
          let n = {};
          try {
            if (n = c, n && Object.prototype.toString.call(n) === "[object Array]" && n.length > 0) {
              for (let L in r)
                ({}).hasOwnProperty.call(r, L) && (u(n, L) || delete r[L]);
              n.forEach((L) => {
                L.Names && Object.prototype.toString.call(L.Names) === "[object Array]" && L.Names.length > 0 && (L.Name = L.Names[0].replace(/^\/|\/$/g, "")), d.push($(L.Id.trim(), L));
              }), d.length ? Promise.all(d).then((L) => {
                E && E(L), Q(L);
              }) : (E && E(o), Q(o));
            } else
              E && E(o), Q(o);
          } catch {
            for (let G in r)
              ({}).hasOwnProperty.call(r, G) && (u(n, G) || delete r[G]);
            E && E(o), Q(o);
          }
        });
      });
    });
  }
  function $(h, E) {
    return new Promise((u) => {
      process.nextTick(() => {
        if (h = h || "", typeof h != "string")
          return u();
        const o = (s.isPrototypePolluted() ? "" : s.sanitizeShellString(h, !0)).trim();
        o ? (B || (B = new e()), B.getInspect(o.trim(), (Q) => {
          try {
            u({
              id: E.Id,
              name: E.Name,
              image: E.Image,
              imageID: E.ImageID,
              command: E.Command,
              created: E.Created,
              started: Q.State && Q.State.StartedAt ? Math.round(new Date(Q.State.StartedAt).getTime() / 1e3) : 0,
              finished: Q.State && Q.State.FinishedAt && !Q.State.FinishedAt.startsWith("0001-01-01") ? Math.round(new Date(Q.State.FinishedAt).getTime() / 1e3) : 0,
              createdAt: Q.Created ? Q.Created : "",
              startedAt: Q.State && Q.State.StartedAt ? Q.State.StartedAt : "",
              finishedAt: Q.State && Q.State.FinishedAt && !Q.State.FinishedAt.startsWith("0001-01-01") ? Q.State.FinishedAt : "",
              state: E.State,
              restartCount: Q.RestartCount || 0,
              platform: Q.Platform || "",
              driver: Q.Driver || "",
              ports: E.Ports,
              mounts: E.Mounts
              // hostconfig: payload.HostConfig,
              // network: payload.NetworkSettings
            });
          } catch {
            u();
          }
        })) : u();
      });
    });
  }
  docker.dockerContainers = Z;
  function sA(h, E) {
    if (g) {
      let u = s.nanoSeconds(), o = 0;
      if (F > 0) {
        let Q = u - F, d = h.cpu_usage.total_usage - E.cpu_usage.total_usage;
        Q > 0 && (o = 100 * d / Q);
      }
      return F = u, o;
    } else {
      let u = 0, o = h.cpu_usage.total_usage - E.cpu_usage.total_usage, Q = h.system_cpu_usage - E.system_cpu_usage;
      return Q > 0 && o > 0 && (E.online_cpus ? u = o / Q * E.online_cpus * 100 : u = o / Q * h.cpu_usage.percpu_usage.length * 100), u;
    }
  }
  function X(h) {
    let E, u;
    for (let o in h) {
      if (!{}.hasOwnProperty.call(h, o))
        continue;
      const Q = h[o];
      E = +Q.rx_bytes, u = +Q.tx_bytes;
    }
    return {
      rx: E,
      wx: u
    };
  }
  function S(h) {
    let E = {
      r: 0,
      w: 0
    };
    return h && h.io_service_bytes_recursive && Object.prototype.toString.call(h.io_service_bytes_recursive) === "[object Array]" && h.io_service_bytes_recursive.length > 0 && h.io_service_bytes_recursive.forEach((u) => {
      u.op && u.op.toLowerCase() === "read" && u.value && (E.r += u.value), u.op && u.op.toLowerCase() === "write" && u.value && (E.w += u.value);
    }), E;
  }
  function J(h, E) {
    let u = [];
    return new Promise((o) => {
      process.nextTick(() => {
        if (s.isFunction(h) && !E)
          E = h, u = ["*"];
        else {
          if (h = h || "*", typeof h != "string")
            return E && E([]), o([]);
          let c = "";
          try {
            c.__proto__.toLowerCase = s.stringToLower, c.__proto__.replace = s.stringReplace, c.__proto__.toString = s.stringToString, c.__proto__.substr = s.stringSubstr, c.__proto__.substring = s.stringSubstring, c.__proto__.trim = s.stringTrim, c.__proto__.startsWith = s.stringStartWith;
          } catch {
            Object.setPrototypeOf(c, s.stringObj);
          }
          if (c = h, c = c.trim(), c !== "*") {
            c = "";
            const n = (s.isPrototypePolluted() ? "" : s.sanitizeShellString(h, !0)).trim(), L = s.mathMin(n.length, 2e3);
            for (let G = 0; G <= L; G++)
              if (n[G] !== void 0) {
                n[G].__proto__.toLowerCase = s.stringToLower;
                const K = n[G].toLowerCase();
                K && K[0] && !K[1] && (c = c + K[0]);
              }
          }
          c = c.trim().toLowerCase().replace(/,+/g, "|"), u = c.split("|");
        }
        const Q = [], d = [];
        if (u.length && u[0].trim() === "*")
          u = [], Z().then((c) => {
            for (let n of c)
              u.push(n.id.substring(0, 12));
            u.length ? J(u.join(",")).then((n) => {
              E && E(n), o(n);
            }) : (E && E(Q), o(Q));
          });
        else {
          for (let c of u)
            d.push(eA(c.trim()));
          d.length ? Promise.all(d).then((c) => {
            E && E(c), o(c);
          }) : (E && E(Q), o(Q));
        }
      });
    });
  }
  function eA(h) {
    h = h || "";
    const E = {
      id: h,
      memUsage: 0,
      memLimit: 0,
      memPercent: 0,
      cpuPercent: 0,
      pids: 0,
      netIO: {
        rx: 0,
        wx: 0
      },
      blockIO: {
        r: 0,
        w: 0
      },
      restartCount: 0,
      cpuStats: {},
      precpuStats: {},
      memoryStats: {},
      networks: {}
    };
    return new Promise((u) => {
      process.nextTick(() => {
        h ? (B || (B = new e()), B.getInspect(h, (o) => {
          try {
            B.getStats(h, (Q) => {
              try {
                let d = Q;
                d.message || (Q.id && (E.id = Q.id), E.memUsage = d.memory_stats && d.memory_stats.usage ? d.memory_stats.usage : 0, E.memLimit = d.memory_stats && d.memory_stats.limit ? d.memory_stats.limit : 0, E.memPercent = d.memory_stats && d.memory_stats.usage && d.memory_stats.limit ? d.memory_stats.usage / d.memory_stats.limit * 100 : 0, E.cpuPercent = d.cpu_stats && d.precpu_stats ? sA(d.cpu_stats, d.precpu_stats) : 0, E.pids = d.pids_stats && d.pids_stats.current ? d.pids_stats.current : 0, E.restartCount = o.RestartCount ? o.RestartCount : 0, d.networks && (E.netIO = X(d.networks)), d.blkio_stats && (E.blockIO = S(d.blkio_stats)), E.cpuStats = d.cpu_stats ? d.cpu_stats : {}, E.precpuStats = d.precpu_stats ? d.precpu_stats : {}, E.memoryStats = d.memory_stats ? d.memory_stats : {}, E.networks = d.networks ? d.networks : {});
              } catch {
                s.noop();
              }
              u(E);
            });
          } catch {
            s.noop();
          }
        })) : u(E);
      });
    });
  }
  docker.dockerContainerStats = J;
  function b(h, E) {
    let u = [];
    return new Promise((o) => {
      process.nextTick(() => {
        if (h = h || "", typeof h != "string")
          return o(u);
        const Q = (s.isPrototypePolluted() ? "" : s.sanitizeShellString(h, !0)).trim();
        Q ? (B || (B = new e()), B.getProcesses(Q, (d) => {
          try {
            if (d && d.Titles && d.Processes) {
              let c = d.Titles.map(function(f) {
                return f.toUpperCase();
              }), n = c.indexOf("PID"), L = c.indexOf("PPID"), G = c.indexOf("PGID"), K = c.indexOf("VSZ"), gA = c.indexOf("TIME"), H = c.indexOf("ELAPSED"), U = c.indexOf("NI"), V = c.indexOf("RUSER"), m = c.indexOf("USER"), a = c.indexOf("RGROUP"), I = c.indexOf("GROUP"), t = c.indexOf("STAT"), l = c.indexOf("RSS"), D = c.indexOf("COMMAND");
              d.Processes.forEach((f) => {
                u.push({
                  pidHost: n >= 0 ? f[n] : "",
                  ppid: L >= 0 ? f[L] : "",
                  pgid: G >= 0 ? f[G] : "",
                  user: m >= 0 ? f[m] : "",
                  ruser: V >= 0 ? f[V] : "",
                  group: I >= 0 ? f[I] : "",
                  rgroup: a >= 0 ? f[a] : "",
                  stat: t >= 0 ? f[t] : "",
                  time: gA >= 0 ? f[gA] : "",
                  elapsed: H >= 0 ? f[H] : "",
                  nice: U >= 0 ? f[U] : "",
                  rss: l >= 0 ? f[l] : "",
                  vsz: K >= 0 ? f[K] : "",
                  command: D >= 0 ? f[D] : ""
                });
              });
            }
          } catch {
            s.noop();
          }
          E && E(u), o(u);
        })) : (E && E(u), o(u));
      });
    });
  }
  docker.dockerContainerProcesses = b;
  function N(h) {
    let E = [];
    return new Promise((u) => {
      process.nextTick(() => {
        B || (B = new e()), B.listVolumes((o) => {
          let Q = {};
          try {
            Q = o, Q && Q.Volumes && Object.prototype.toString.call(Q.Volumes) === "[object Array]" && Q.Volumes.length > 0 ? (Q.Volumes.forEach((d) => {
              E.push({
                name: d.Name,
                driver: d.Driver,
                labels: d.Labels,
                mountpoint: d.Mountpoint,
                options: d.Options,
                scope: d.Scope,
                created: d.CreatedAt ? Math.round(new Date(d.CreatedAt).getTime() / 1e3) : 0
              });
            }), h && h(E), u(E)) : (h && h(E), u(E));
          } catch {
            h && h(E), u(E);
          }
        });
      });
    });
  }
  docker.dockerVolumes = N;
  function p(h) {
    return new Promise((E) => {
      process.nextTick(() => {
        Z(!0).then((u) => {
          if (u && Object.prototype.toString.call(u) === "[object Array]" && u.length > 0) {
            let o = u.length;
            u.forEach((Q) => {
              J(Q.id).then((d) => {
                Q.memUsage = d[0].memUsage, Q.memLimit = d[0].memLimit, Q.memPercent = d[0].memPercent, Q.cpuPercent = d[0].cpuPercent, Q.pids = d[0].pids, Q.netIO = d[0].netIO, Q.blockIO = d[0].blockIO, Q.cpuStats = d[0].cpuStats, Q.precpuStats = d[0].precpuStats, Q.memoryStats = d[0].memoryStats, Q.networks = d[0].networks, b(Q.id).then((c) => {
                  Q.processes = c, o -= 1, o === 0 && (h && h(u), E(u));
                });
              });
            });
          } else
            h && h(u), E(u);
        });
      });
    });
  }
  return docker.dockerAll = p, docker;
}
var virtualbox = {}, hasRequiredVirtualbox;
function requireVirtualbox() {
  if (hasRequiredVirtualbox) return virtualbox;
  hasRequiredVirtualbox = 1;
  const s = require$$0$1, e = require$$1.exec, A = requireUtil();
  function g(r) {
    let B = [];
    return new Promise((F) => {
      process.nextTick(() => {
        try {
          e(A.getVboxmanage() + " list vms --long", (k, P) => {
            let q = (s.EOL + P.toString()).split(s.EOL + "Name:");
            q.shift(), q.forEach((Z) => {
              const $ = ("Name:" + Z).split(s.EOL), sA = A.getValue($, "State"), X = sA.startsWith("running"), S = X ? sA.replace("running (since ", "").replace(")", "").trim() : "";
              let J = 0;
              try {
                if (X) {
                  const N = new Date(S), p = N.getTimezoneOffset();
                  J = Math.round((Date.now() - Date.parse(N)) / 1e3) + p * 60;
                }
              } catch {
                A.noop();
              }
              const eA = X ? "" : sA.replace("powered off (since", "").replace(")", "").trim();
              let b = 0;
              try {
                if (!X) {
                  const N = new Date(eA), p = N.getTimezoneOffset();
                  b = Math.round((Date.now() - Date.parse(N)) / 1e3) + p * 60;
                }
              } catch {
                A.noop();
              }
              B.push({
                id: A.getValue($, "UUID"),
                name: A.getValue($, "Name"),
                running: X,
                started: S,
                runningSince: J,
                stopped: eA,
                stoppedSince: b,
                guestOS: A.getValue($, "Guest OS"),
                hardwareUUID: A.getValue($, "Hardware UUID"),
                memory: parseInt(A.getValue($, "Memory size", "     "), 10),
                vram: parseInt(A.getValue($, "VRAM size"), 10),
                cpus: parseInt(A.getValue($, "Number of CPUs"), 10),
                cpuExepCap: A.getValue($, "CPU exec cap"),
                cpuProfile: A.getValue($, "CPUProfile"),
                chipset: A.getValue($, "Chipset"),
                firmware: A.getValue($, "Firmware"),
                pageFusion: A.getValue($, "Page Fusion") === "enabled",
                configFile: A.getValue($, "Config file"),
                snapshotFolder: A.getValue($, "Snapshot folder"),
                logFolder: A.getValue($, "Log folder"),
                hpet: A.getValue($, "HPET") === "enabled",
                pae: A.getValue($, "PAE") === "enabled",
                longMode: A.getValue($, "Long Mode") === "enabled",
                tripleFaultReset: A.getValue($, "Triple Fault Reset") === "enabled",
                apic: A.getValue($, "APIC") === "enabled",
                x2Apic: A.getValue($, "X2APIC") === "enabled",
                acpi: A.getValue($, "ACPI") === "enabled",
                ioApic: A.getValue($, "IOAPIC") === "enabled",
                biosApicMode: A.getValue($, "BIOS APIC mode"),
                bootMenuMode: A.getValue($, "Boot menu mode"),
                bootDevice1: A.getValue($, "Boot Device 1"),
                bootDevice2: A.getValue($, "Boot Device 2"),
                bootDevice3: A.getValue($, "Boot Device 3"),
                bootDevice4: A.getValue($, "Boot Device 4"),
                timeOffset: A.getValue($, "Time offset"),
                rtc: A.getValue($, "RTC")
              });
            }), r && r(B), F(B);
          });
        } catch {
          r && r(B), F(B);
        }
      });
    });
  }
  return virtualbox.vboxInfo = g, virtualbox;
}
var printer = {}, hasRequiredPrinter;
function requirePrinter() {
  if (hasRequiredPrinter) return printer;
  hasRequiredPrinter = 1;
  const s = require$$1.exec, e = requireUtil();
  let A = process.platform;
  const g = A === "linux" || A === "android", r = A === "darwin", B = A === "win32", F = A === "freebsd", k = A === "openbsd", P = A === "netbsd", q = A === "sunos", Z = {
    1: "Other",
    2: "Unknown",
    3: "Idle",
    4: "Printing",
    5: "Warmup",
    6: "Stopped Printing",
    7: "Offline"
  };
  function $(b) {
    const N = {};
    if (b && b.length && b[0].indexOf(" CUPS v") > 0) {
      const p = b[0].split(" CUPS v");
      N.cupsVersion = p[1];
    }
    return N;
  }
  function sA(b) {
    const N = {}, p = e.getValue(b, "PrinterId", " ");
    return N.id = p ? parseInt(p, 10) : null, N.name = e.getValue(b, "Info", " "), N.model = b.length > 0 && b[0] ? b[0].split(" ")[0] : "", N.uri = e.getValue(b, "DeviceURI", " "), N.uuid = e.getValue(b, "UUID", " "), N.status = e.getValue(b, "State", " "), N.local = e.getValue(b, "Location", " ").toLowerCase().startsWith("local"), N.default = null, N.shared = e.getValue(b, "Shared", " ").toLowerCase().startsWith("yes"), N;
  }
  function X(b, N) {
    const p = {};
    return p.id = N, p.name = e.getValue(b, "Description", ":", !0), p.model = b.length > 0 && b[0] ? b[0].split(" ")[0] : "", p.uri = null, p.uuid = null, p.status = b.length > 0 && b[0] ? b[0].indexOf(" idle") > 0 ? "idle" : b[0].indexOf(" printing") > 0 ? "printing" : "unknown" : null, p.local = e.getValue(b, "Location", ":", !0).toLowerCase().startsWith("local"), p.default = null, p.shared = e.getValue(b, "Shared", " ").toLowerCase().startsWith("yes"), p;
  }
  function S(b, N) {
    const p = {}, h = b.uri.split("/");
    return p.id = N, p.name = b._name, p.model = h.length ? h[h.length - 1] : "", p.uri = b.uri, p.uuid = null, p.status = b.status, p.local = b.printserver === "local", p.default = b.default === "yes", p.shared = b.shared === "yes", p;
  }
  function J(b, N) {
    const p = {}, h = parseInt(e.getValue(b, "PrinterStatus", ":"), 10);
    return p.id = N, p.name = e.getValue(b, "name", ":"), p.model = e.getValue(b, "DriverName", ":"), p.uri = null, p.uuid = null, p.status = Z[h] ? Z[h] : null, p.local = e.getValue(b, "Local", ":").toUpperCase() === "TRUE", p.default = e.getValue(b, "Default", ":").toUpperCase() === "TRUE", p.shared = e.getValue(b, "Shared", ":").toUpperCase() === "TRUE", p;
  }
  function eA(b) {
    return new Promise((N) => {
      process.nextTick(() => {
        let p = [];
        if (g || F || k || P) {
          let h = "cat /etc/cups/printers.conf 2>/dev/null";
          s(h, (E, u) => {
            if (!E) {
              const o = u.toString().split("<Printer "), Q = $(o[0]);
              for (let d = 1; d < o.length; d++) {
                const c = sA(o[d].split(`
`));
                c.name && (c.engine = "CUPS", c.engineVersion = Q.cupsVersion, p.push(c));
              }
            }
            p.length === 0 && g ? (h = "export LC_ALL=C; lpstat -lp 2>/dev/null; unset LC_ALL", s(h, (o, Q) => {
              const d = (`
` + Q.toString()).split(`
printer `);
              for (let c = 1; c < d.length; c++) {
                const n = X(d[c].split(`
`), c);
                p.push(n);
              }
            }), b && b(p), N(p)) : (b && b(p), N(p));
          });
        }
        r && s("system_profiler SPPrintersDataType -json", (E, u) => {
          if (!E)
            try {
              const o = JSON.parse(u.toString());
              if (o.SPPrintersDataType && o.SPPrintersDataType.length)
                for (let Q = 0; Q < o.SPPrintersDataType.length; Q++) {
                  const d = S(o.SPPrintersDataType[Q], Q);
                  p.push(d);
                }
            } catch {
              e.noop();
            }
          b && b(p), N(p);
        }), B && e.powerShell("Get-CimInstance Win32_Printer | select PrinterStatus,Name,DriverName,Local,Default,Shared | fl").then((h, E) => {
          if (!E) {
            const u = h.toString().split(/\n\s*\n/);
            for (let o = 0; o < u.length; o++) {
              const Q = J(u[o].split(`
`), o);
              (Q.name || Q.model) && p.push(Q);
            }
          }
          b && b(p), N(p);
        }), q && N(null);
      });
    });
  }
  return printer.printer = eA, printer;
}
var usb = {}, hasRequiredUsb;
function requireUsb() {
  if (hasRequiredUsb) return usb;
  hasRequiredUsb = 1;
  const s = require$$1.exec, e = requireUtil();
  let A = process.platform;
  const g = A === "linux" || A === "android", r = A === "darwin", B = A === "win32", F = A === "freebsd", k = A === "openbsd", P = A === "netbsd", q = A === "sunos";
  function Z(b, N) {
    let p = b;
    const h = (N + " " + b).toLowerCase();
    return h.indexOf("camera") >= 0 ? p = "Camera" : h.indexOf("hub") >= 0 ? p = "Hub" : h.indexOf("keybrd") >= 0 || h.indexOf("keyboard") >= 0 ? p = "Keyboard" : h.indexOf("mouse") >= 0 ? p = "Mouse" : h.indexOf("stora") >= 0 ? p = "Storage" : h.indexOf("microp") >= 0 ? p = "Microphone" : (h.indexOf("headset") >= 0 || h.indexOf("audio") >= 0) && (p = "Audio"), p;
  }
  function $(b) {
    const N = {}, p = b.split(`
`);
    if (p && p.length && p[0].indexOf("Device") >= 0) {
      const m = p[0].split(" ");
      N.bus = parseInt(m[0], 10), m[2] ? N.deviceId = parseInt(m[2], 10) : N.deviceId = null;
    } else
      N.bus = null, N.deviceId = null;
    const h = e.getValue(p, "idVendor", " ", !0).trim();
    let E = h.split(" ");
    E.shift();
    const u = E.join(" "), o = e.getValue(p, "idProduct", " ", !0).trim();
    let Q = o.split(" ");
    Q.shift();
    const d = Q.join(" ");
    let n = e.getValue(p, "bInterfaceClass", " ", !0).trim().split(" ");
    n.shift();
    const L = n.join(" ");
    let K = e.getValue(p, "iManufacturer", " ", !0).trim().split(" ");
    K.shift();
    const gA = K.join(" ");
    let U = e.getValue(p, "iSerial", " ", !0).trim().split(" ");
    U.shift();
    const V = U.join(" ");
    return N.id = (h.startsWith("0x") ? h.split(" ")[0].substr(2, 10) : "") + ":" + (o.startsWith("0x") ? o.split(" ")[0].substr(2, 10) : ""), N.name = d, N.type = Z(L, d), N.removable = null, N.vendor = u, N.manufacturer = gA, N.maxPower = e.getValue(p, "MaxPower", " ", !0), N.serialNumber = V, N;
  }
  function sA(b) {
    let N = "";
    return b.indexOf("camera") >= 0 ? N = "Camera" : b.indexOf("touch bar") >= 0 ? N = "Touch Bar" : b.indexOf("controller") >= 0 ? N = "Controller" : b.indexOf("headset") >= 0 ? N = "Audio" : b.indexOf("keyboard") >= 0 ? N = "Keyboard" : b.indexOf("trackpad") >= 0 ? N = "Trackpad" : b.indexOf("sensor") >= 0 ? N = "Sensor" : b.indexOf("bthusb") >= 0 || b.indexOf("bth") >= 0 || b.indexOf("rfcomm") >= 0 ? N = "Bluetooth" : b.indexOf("usbhub") >= 0 || b.indexOf(" hub") >= 0 ? N = "Hub" : b.indexOf("mouse") >= 0 ? N = "Mouse" : b.indexOf("microp") >= 0 ? N = "Microphone" : b.indexOf("removable") >= 0 && (N = "Storage"), N;
  }
  function X(b, N) {
    const p = {};
    p.id = N, b = b.replace(/ \|/g, ""), b = b.trim();
    let h = b.split(`
`);
    h.shift();
    try {
      for (let o = 0; o < h.length; o++) {
        h[o] = h[o].trim(), h[o] = h[o].replace(/=/g, ":"), h[o] !== "{" && h[o] !== "}" && h[o + 1] && h[o + 1].trim() !== "}" && (h[o] = h[o] + ","), h[o] = h[o].replace(":Yes,", ':"Yes",'), h[o] = h[o].replace(": Yes,", ': "Yes",'), h[o] = h[o].replace(": Yes", ': "Yes"'), h[o] = h[o].replace(":No,", ':"No",'), h[o] = h[o].replace(": No,", ': "No",'), h[o] = h[o].replace(": No", ': "No"'), h[o] = h[o].replace("((", "").replace("))", "");
        const Q = /<(\w+)>/.exec(h[o]);
        if (Q) {
          const d = Q[0];
          h[o] = h[o].replace(d, `"${d}"`);
        }
      }
      const E = JSON.parse(h.join(`
`)), u = (E["Built-In"] ? E["Built-In"].toLowerCase() !== "yes" : !0) && (E["non-removable"] ? E["non-removable"].toLowerCase() === "no" : !0);
      return p.bus = null, p.deviceId = null, p.id = E["USB Address"] || null, p.name = E.kUSBProductString || E["USB Product Name"] || null, p.type = sA((E.kUSBProductString || E["USB Product Name"] || "").toLowerCase() + (u ? " removable" : "")), p.removable = E["non-removable"] ? E["non-removable"].toLowerCase() || !1 : !0, p.vendor = E.kUSBVendorString || E["USB Vendor Name"] || null, p.manufacturer = E.kUSBVendorString || E["USB Vendor Name"] || null, p.maxPower = null, p.serialNumber = E.kUSBSerialNumberString || null, p.name ? p : null;
    } catch {
      return null;
    }
  }
  function S(b, N) {
    let p = "";
    return N.indexOf("storage") >= 0 || N.indexOf("speicher") >= 0 ? p = "Storage" : b.indexOf("usbhub") >= 0 ? p = "Hub" : b.indexOf("storage") >= 0 ? p = "Storage" : b.indexOf("usbcontroller") >= 0 ? p = "Controller" : b.indexOf("keyboard") >= 0 ? p = "Keyboard" : b.indexOf("pointing") >= 0 ? p = "Mouse" : b.indexOf("microp") >= 0 ? p = "Microphone" : b.indexOf("disk") >= 0 && (p = "Storage"), p;
  }
  function J(b, N) {
    const p = S(e.getValue(b, "CreationClassName", ":").toLowerCase(), e.getValue(b, "name", ":").toLowerCase());
    if (p) {
      const h = {};
      return h.bus = null, h.deviceId = e.getValue(b, "deviceid", ":"), h.id = N, h.name = e.getValue(b, "name", ":"), h.type = p, h.removable = null, h.vendor = null, h.manufacturer = e.getValue(b, "Manufacturer", ":"), h.maxPower = null, h.serialNumber = null, h;
    } else
      return null;
  }
  function eA(b) {
    return new Promise((N) => {
      process.nextTick(() => {
        let p = [];
        g && s("export LC_ALL=C; lsusb -v 2>/dev/null; unset LC_ALL", { maxBuffer: 1024 * 1024 * 128 }, function(E, u) {
          if (!E) {
            const o = (`

` + u.toString()).split(`

Bus `);
            for (let Q = 1; Q < o.length; Q++) {
              const d = $(o[Q]);
              p.push(d);
            }
          }
          b && b(p), N(p);
        }), r && s("ioreg -p IOUSB -c AppleUSBRootHubDevice -w0 -l", { maxBuffer: 1024 * 1024 * 128 }, function(E, u) {
          if (!E) {
            const o = u.toString().split(" +-o ");
            for (let Q = 1; Q < o.length; Q++) {
              const d = X(o[Q]);
              d && p.push(d);
            }
            b && b(p), N(p);
          }
          b && b(p), N(p);
        }), B && e.powerShell('Get-CimInstance CIM_LogicalDevice | where { $_.Description -match "USB"} | select Name,CreationClassName,DeviceId,Manufacturer | fl').then((h, E) => {
          if (!E) {
            const u = h.toString().split(/\n\s*\n/);
            for (let o = 0; o < u.length; o++) {
              const Q = J(u[o].split(`
`), o);
              Q && p.filter((d) => d.deviceId === Q.deviceId).length === 0 && p.push(Q);
            }
          }
          b && b(p), N(p);
        }), (q || F || k || P) && N(null);
      });
    });
  }
  return usb.usb = eA, usb;
}
var audio = {}, hasRequiredAudio;
function requireAudio() {
  if (hasRequiredAudio) return audio;
  hasRequiredAudio = 1;
  const s = require$$1.exec, e = require$$1.execSync, A = requireUtil(), g = process.platform, r = g === "linux" || g === "android", B = g === "darwin", F = g === "win32", k = g === "freebsd", P = g === "openbsd", q = g === "netbsd", Z = g === "sunos";
  function $(p, h, E) {
    p = p.toLowerCase();
    let u = "";
    return p.indexOf("input") >= 0 && (u = "Microphone"), p.indexOf("display audio") >= 0 && (u = "Speaker"), p.indexOf("speak") >= 0 && (u = "Speaker"), p.indexOf("laut") >= 0 && (u = "Speaker"), p.indexOf("loud") >= 0 && (u = "Speaker"), p.indexOf("head") >= 0 && (u = "Headset"), p.indexOf("mic") >= 0 && (u = "Microphone"), p.indexOf("mikr") >= 0 && (u = "Microphone"), p.indexOf("phone") >= 0 && (u = "Phone"), p.indexOf("controll") >= 0 && (u = "Controller"), p.indexOf("line o") >= 0 && (u = "Line Out"), p.indexOf("digital o") >= 0 && (u = "Digital Out"), p.indexOf("smart sound technology") >= 0 && (u = "Digital Signal Processor"), p.indexOf("high definition audio") >= 0 && (u = "Sound Driver"), !u && E ? u = "Speaker" : !u && h && (u = "Microphone"), u;
  }
  function sA() {
    const p = "lspci -v 2>/dev/null", h = [];
    try {
      return e(p, A.execOptsLinux).toString().split(`

`).forEach((u) => {
        const o = u.split(`
`);
        if (o && o.length && o[0].toLowerCase().indexOf("audio") >= 0) {
          const Q = {};
          Q.slotId = o[0].split(" ")[0], Q.driver = A.getValue(o, "Kernel driver in use", ":", !0) || A.getValue(o, "Kernel modules", ":", !0), h.push(Q);
        }
      }), h;
    } catch {
      return h;
    }
  }
  function X(p) {
    let h = p;
    return p === 1 ? h = "other" : p === 2 ? h = "unknown" : p === 3 ? h = "enabled" : p === 4 ? h = "disabled" : p === 5 && (h = "not applicable"), h;
  }
  function S(p, h) {
    const E = {}, u = A.getValue(p, "Slot"), o = h.filter((Q) => Q.slotId === u);
    return E.id = u, E.name = A.getValue(p, "SDevice"), E.manufacturer = A.getValue(p, "SVendor"), E.revision = A.getValue(p, "Rev"), E.driver = o && o.length === 1 && o[0].driver ? o[0].driver : "", E.default = null, E.channel = "PCIe", E.type = $(E.name, null, null), E.in = null, E.out = null, E.status = "online", E;
  }
  function J(p) {
    let h = "";
    return p.indexOf("builtin") >= 0 && (h = "Built-In"), p.indexOf("extern") >= 0 && (h = "Audio-Jack"), p.indexOf("hdmi") >= 0 && (h = "HDMI"), p.indexOf("displayport") >= 0 && (h = "Display-Port"), p.indexOf("usb") >= 0 && (h = "USB"), p.indexOf("pci") >= 0 && (h = "PCIe"), h;
  }
  function eA(p, h) {
    const E = {}, u = ((p.coreaudio_device_transport || "") + " " + (p._name || "")).toLowerCase();
    return E.id = h, E.name = p._name, E.manufacturer = p.coreaudio_device_manufacturer, E.revision = null, E.driver = null, E.default = !!p.coreaudio_default_audio_input_device || !!p.coreaudio_default_audio_output_device, E.channel = J(u), E.type = $(E.name, !!p.coreaudio_device_input, !!p.coreaudio_device_output), E.in = !!p.coreaudio_device_input, E.out = !!p.coreaudio_device_output, E.status = "online", E;
  }
  function b(p) {
    const h = {}, E = X(A.getValue(p, "StatusInfo", ":"));
    return h.id = A.getValue(p, "DeviceID", ":"), h.name = A.getValue(p, "name", ":"), h.manufacturer = A.getValue(p, "manufacturer", ":"), h.revision = null, h.driver = null, h.default = null, h.channel = null, h.type = $(h.name, null, null), h.in = null, h.out = null, h.status = E, h;
  }
  function N(p) {
    return new Promise((h) => {
      process.nextTick(() => {
        const E = [];
        (r || k || P || q) && s("lspci -vmm 2>/dev/null", (o, Q) => {
          if (!o) {
            const d = sA();
            Q.toString().split(`

`).forEach((n) => {
              const L = n.split(`
`);
              if (A.getValue(L, "class", ":", !0).toLowerCase().indexOf("audio") >= 0) {
                const G = S(L, d);
                E.push(G);
              }
            });
          }
          p && p(E), h(E);
        }), B && s("system_profiler SPAudioDataType -json", (o, Q) => {
          if (!o)
            try {
              const d = JSON.parse(Q.toString());
              if (d.SPAudioDataType && d.SPAudioDataType.length && d.SPAudioDataType[0] && d.SPAudioDataType[0]._items && d.SPAudioDataType[0]._items.length)
                for (let c = 0; c < d.SPAudioDataType[0]._items.length; c++) {
                  const n = eA(d.SPAudioDataType[0]._items[c], c);
                  E.push(n);
                }
            } catch {
              A.noop();
            }
          p && p(E), h(E);
        }), F && A.powerShell("Get-CimInstance Win32_SoundDevice | select DeviceID,StatusInfo,Name,Manufacturer | fl").then((u, o) => {
          o || u.toString().split(/\n\s*\n/).forEach((d) => {
            const c = d.split(`
`);
            A.getValue(c, "name", ":") && E.push(b(c));
          }), p && p(E), h(E);
        }), Z && h(null);
      });
    });
  }
  return audio.audio = N, audio;
}
var bluetooth = {}, bluetoothVendors, hasRequiredBluetoothVendors;
function requireBluetoothVendors() {
  return hasRequiredBluetoothVendors || (hasRequiredBluetoothVendors = 1, bluetoothVendors = {
    0: "Ericsson Technology Licensing",
    1: "Nokia Mobile Phones",
    2: "Intel Corp.",
    3: "IBM Corp.",
    4: "Toshiba Corp.",
    5: "3Com",
    6: "Microsoft",
    7: "Lucent",
    8: "Motorola",
    9: "Infineon Technologies AG",
    10: "Cambridge Silicon Radio",
    11: "Silicon Wave",
    12: "Digianswer A/S",
    13: "Texas Instruments Inc.",
    14: "Ceva, Inc. (formerly Parthus Technologies, Inc.)",
    15: "Broadcom Corporation",
    16: "Mitel Semiconductor",
    17: "Widcomm, Inc",
    18: "Zeevo, Inc.",
    19: "Atmel Corporation",
    20: "Mitsubishi Electric Corporation",
    21: "RTX Telecom A/S",
    22: "KC Technology Inc.",
    23: "NewLogic",
    24: "Transilica, Inc.",
    25: "Rohde & Schwarz GmbH & Co. KG",
    26: "TTPCom Limited",
    27: "Signia Technologies, Inc.",
    28: "Conexant Systems Inc.",
    29: "Qualcomm",
    30: "Inventel",
    31: "AVM Berlin",
    32: "BandSpeed, Inc.",
    33: "Mansella Ltd",
    34: "NEC Corporation",
    35: "WavePlus Technology Co., Ltd.",
    36: "Alcatel",
    37: "NXP Semiconductors (formerly Philips Semiconductors)",
    38: "C Technologies",
    39: "Open Interface",
    40: "R F Micro Devices",
    41: "Hitachi Ltd",
    42: "Symbol Technologies, Inc.",
    43: "Tenovis",
    44: "Macronix International Co. Ltd.",
    45: "GCT Semiconductor",
    46: "Norwood Systems",
    47: "MewTel Technology Inc.",
    48: "ST Microelectronics",
    49: "Synopsis",
    50: "Red-M (Communications) Ltd",
    51: "Commil Ltd",
    52: "Computer Access Technology Corporation (CATC)",
    53: "Eclipse (HQ Espana) S.L.",
    54: "Renesas Electronics Corporation",
    55: "Mobilian Corporation",
    56: "Terax",
    57: "Integrated System Solution Corp.",
    58: "Matsushita Electric Industrial Co., Ltd.",
    59: "Gennum Corporation",
    60: "BlackBerry Limited (formerly Research In Motion)",
    61: "IPextreme, Inc.",
    62: "Systems and Chips, Inc.",
    63: "Bluetooth SIG, Inc.",
    64: "Seiko Epson Corporation",
    65: "Integrated Silicon Solution Taiwan, Inc.",
    66: "CONWISE Technology Corporation Ltd",
    67: "PARROT SA",
    68: "Socket Mobile",
    69: "Atheros Communications, Inc.",
    70: "MediaTek, Inc.",
    71: "Bluegiga",
    72: "Marvell Technology Group Ltd.",
    73: "3DSP Corporation",
    74: "Accel Semiconductor Ltd.",
    75: "Continental Automotive Systems",
    76: "Apple, Inc.",
    77: "Staccato Communications, Inc.",
    78: "Avago Technologies",
    79: "APT Licensing Ltd.",
    80: "SiRF Technology",
    81: "Tzero Technologies, Inc.",
    82: "J&M Corporation",
    83: "Free2move AB",
    84: "3DiJoy Corporation",
    85: "Plantronics, Inc.",
    86: "Sony Ericsson Mobile Communications",
    87: "Harman International Industries, Inc.",
    88: "Vizio, Inc.",
    89: "Nordic Semiconductor ASA",
    90: "EM Microelectronic-Marin SA",
    91: "Ralink Technology Corporation",
    92: "Belkin International, Inc.",
    93: "Realtek Semiconductor Corporation",
    94: "Stonestreet One, LLC",
    95: "Wicentric, Inc.",
    96: "RivieraWaves S.A.S",
    97: "RDA Microelectronics",
    98: "Gibson Guitars",
    99: "MiCommand Inc.",
    100: "Band XI International, LLC",
    101: "Hewlett-Packard Company",
    102: "9Solutions Oy",
    103: "GN Netcom A/S",
    104: "General Motors",
    105: "A&D Engineering, Inc.",
    106: "MindTree Ltd.",
    107: "Polar Electro OY",
    108: "Beautiful Enterprise Co., Ltd.",
    109: "BriarTek, Inc.",
    110: "Summit Data Communications, Inc.",
    111: "Sound ID",
    112: "Monster, LLC",
    113: "connectBlue AB",
    114: "ShangHai Super Smart Electronics Co. Ltd.",
    115: "Group Sense Ltd.",
    116: "Zomm, LLC",
    117: "Samsung Electronics Co. Ltd.",
    118: "Creative Technology Ltd.",
    119: "Laird Technologies",
    120: "Nike, Inc.",
    121: "lesswire AG",
    122: "MStar Semiconductor, Inc.",
    123: "Hanlynn Technologies",
    124: "A & R Cambridge",
    125: "Seers Technology Co. Ltd",
    126: "Sports Tracking Technologies Ltd.",
    127: "Autonet Mobile",
    128: "DeLorme Publishing Company, Inc.",
    129: "WuXi Vimicro",
    130: "Sennheiser Communications A/S",
    131: "TimeKeeping Systems, Inc.",
    132: "Ludus Helsinki Ltd.",
    133: "BlueRadios, Inc.",
    134: "equinox AG",
    135: "Garmin International, Inc.",
    136: "Ecotest",
    137: "GN ReSound A/S",
    138: "Jawbone",
    139: "Topcorn Positioning Systems, LLC",
    140: "Gimbal Inc. (formerly Qualcomm Labs, Inc. and Qualcomm Retail Solutions, Inc.)",
    141: "Zscan Software",
    142: "Quintic Corp.",
    143: "Stollman E+V GmbH",
    144: "Funai Electric Co., Ltd.",
    145: "Advanced PANMOBIL Systems GmbH & Co. KG",
    146: "ThinkOptics, Inc.",
    147: "Universal Electronics, Inc.",
    148: "Airoha Technology Corp.",
    149: "NEC Lighting, Ltd.",
    150: "ODM Technology, Inc.",
    151: "ConnecteDevice Ltd.",
    152: "zer01.tv GmbH",
    153: "i.Tech Dynamic Global Distribution Ltd.",
    154: "Alpwise",
    155: "Jiangsu Toppower Automotive Electronics Co., Ltd.",
    156: "Colorfy, Inc.",
    157: "Geoforce Inc.",
    158: "Bose Corporation",
    159: "Suunto Oy",
    160: "Kensington Computer Products Group",
    161: "SR-Medizinelektronik",
    162: "Vertu Corporation Limited",
    163: "Meta Watch Ltd.",
    164: "LINAK A/S",
    165: "OTL Dynamics LLC",
    166: "Panda Ocean Inc.",
    167: "Visteon Corporation",
    168: "ARP Devices Limited",
    169: "Magneti Marelli S.p.A",
    170: "CAEN RFID srl",
    171: "Ingenieur-Systemgruppe Zahn GmbH",
    172: "Green Throttle Games",
    173: "Peter Systemtechnik GmbH",
    174: "Omegawave Oy",
    175: "Cinetix",
    176: "Passif Semiconductor Corp",
    177: "Saris Cycling Group, Inc",
    178: "Bekey A/S",
    179: "Clarinox Technologies Pty. Ltd.",
    180: "BDE Technology Co., Ltd.",
    181: "Swirl Networks",
    182: "Meso international",
    183: "TreLab Ltd",
    184: "Qualcomm Innovation Center, Inc. (QuIC)",
    185: "Johnson Controls, Inc.",
    186: "Starkey Laboratories Inc.",
    187: "S-Power Electronics Limited",
    188: "Ace Sensor Inc",
    189: "Aplix Corporation",
    190: "AAMP of America",
    191: "Stalmart Technology Limited",
    192: "AMICCOM Electronics Corporation",
    193: "Shenzhen Excelsecu Data Technology Co.,Ltd",
    194: "Geneq Inc.",
    195: "adidas AG",
    196: "LG Electronics",
    197: "Onset Computer Corporation",
    198: "Selfly BV",
    199: "Quuppa Oy.",
    200: "GeLo Inc",
    201: "Evluma",
    202: "MC10",
    203: "Binauric SE",
    204: "Beats Electronics",
    205: "Microchip Technology Inc.",
    206: "Elgato Systems GmbH",
    207: "ARCHOS SA",
    208: "Dexcom, Inc.",
    209: "Polar Electro Europe B.V.",
    210: "Dialog Semiconductor B.V.",
    211: "Taixingbang Technology (HK) Co,. LTD.",
    212: "Kawantech",
    213: "Austco Communication Systems",
    214: "Timex Group USA, Inc.",
    215: "Qualcomm Technologies, Inc.",
    216: "Qualcomm Connected Experiences, Inc.",
    217: "Voyetra Turtle Beach",
    218: "txtr GmbH",
    219: "Biosentronics",
    220: "Procter & Gamble",
    221: "Hosiden Corporation",
    222: "Muzik LLC",
    223: "Misfit Wearables Corp",
    224: "Google",
    225: "Danlers Ltd",
    226: "Semilink Inc",
    227: "inMusic Brands, Inc",
    228: "L.S. Research Inc.",
    229: "Eden Software Consultants Ltd.",
    230: "Freshtemp",
    231: "KS Technologies",
    232: "ACTS Technologies",
    233: "Vtrack Systems",
    234: "Nielsen-Kellerman Company",
    235: "Server Technology, Inc.",
    236: "BioResearch Associates",
    237: "Jolly Logic, LLC",
    238: "Above Average Outcomes, Inc.",
    239: "Bitsplitters GmbH",
    240: "PayPal, Inc.",
    241: "Witron Technology Limited",
    242: "Aether Things Inc. (formerly Morse Project Inc.)",
    243: "Kent Displays Inc.",
    244: "Nautilus Inc.",
    245: "Smartifier Oy",
    246: "Elcometer Limited",
    247: "VSN Technologies Inc.",
    248: "AceUni Corp., Ltd.",
    249: "StickNFind",
    250: "Crystal Code AB",
    251: "KOUKAAM a.s.",
    252: "Delphi Corporation",
    253: "ValenceTech Limited",
    254: "Reserved",
    255: "Typo Products, LLC",
    256: "TomTom International BV",
    257: "Fugoo, Inc",
    258: "Keiser Corporation",
    259: "Bang & Olufsen A/S",
    260: "PLUS Locations Systems Pty Ltd",
    261: "Ubiquitous Computing Technology Corporation",
    262: "Innovative Yachtter Solutions",
    263: "William Demant Holding A/S",
    264: "Chicony Electronics Co., Ltd.",
    265: "Atus BV",
    266: "Codegate Ltd.",
    267: "ERi, Inc.",
    268: "Transducers Direct, LLC",
    269: "Fujitsu Ten Limited",
    270: "Audi AG",
    271: "HiSilicon Technologies Co., Ltd.",
    272: "Nippon Seiki Co., Ltd.",
    273: "Steelseries ApS",
    274: "vyzybl Inc.",
    275: "Openbrain Technologies, Co., Ltd.",
    276: "Xensr",
    277: "e.solutions",
    278: "1OAK Technologies",
    279: "Wimoto Technologies Inc",
    280: "Radius Networks, Inc.",
    281: "Wize Technology Co., Ltd.",
    282: "Qualcomm Labs, Inc.",
    283: "Aruba Networks",
    284: "Baidu",
    285: "Arendi AG",
    286: "Skoda Auto a.s.",
    287: "Volkswagon AG",
    288: "Porsche AG",
    289: "Sino Wealth Electronic Ltd.",
    290: "AirTurn, Inc.",
    291: "Kinsa, Inc.",
    292: "HID Global",
    293: "SEAT es",
    294: "Promethean Ltd.",
    295: "Salutica Allied Solutions",
    296: "GPSI Group Pty Ltd",
    297: "Nimble Devices Oy",
    298: "Changzhou Yongse Infotech Co., Ltd",
    299: "SportIQ",
    300: "TEMEC Instruments B.V.",
    301: "Sony Corporation",
    302: "ASSA ABLOY",
    303: "Clarion Co., Ltd.",
    304: "Warehouse Innovations",
    305: "Cypress Semiconductor Corporation",
    306: "MADS Inc",
    307: "Blue Maestro Limited",
    308: "Resolution Products, Inc.",
    309: "Airewear LLC",
    310: "Seed Labs, Inc. (formerly ETC sp. z.o.o.)",
    311: "Prestigio Plaza Ltd.",
    312: "NTEO Inc.",
    313: "Focus Systems Corporation",
    314: "Tencent Holdings Limited",
    315: "Allegion",
    316: "Murata Manufacuring Co., Ltd.",
    318: "Nod, Inc.",
    319: "B&B Manufacturing Company",
    320: "Alpine Electronics (China) Co., Ltd",
    321: "FedEx Services",
    322: "Grape Systems Inc.",
    323: "Bkon Connect",
    324: "Lintech GmbH",
    325: "Novatel Wireless",
    326: "Ciright",
    327: "Mighty Cast, Inc.",
    328: "Ambimat Electronics",
    329: "Perytons Ltd.",
    330: "Tivoli Audio, LLC",
    331: "Master Lock",
    332: "Mesh-Net Ltd",
    333: "Huizhou Desay SV Automotive CO., LTD.",
    334: "Tangerine, Inc.",
    335: "B&W Group Ltd.",
    336: "Pioneer Corporation",
    337: "OnBeep",
    338: "Vernier Software & Technology",
    339: "ROL Ergo",
    340: "Pebble Technology",
    341: "NETATMO",
    342: "Accumulate AB",
    343: "Anhui Huami Information Technology Co., Ltd.",
    344: "Inmite s.r.o.",
    345: "ChefSteps, Inc.",
    346: "micas AG",
    347: "Biomedical Research Ltd.",
    348: "Pitius Tec S.L.",
    349: "Estimote, Inc.",
    350: "Unikey Technologies, Inc.",
    351: "Timer Cap Co.",
    352: "AwoX",
    353: "yikes",
    354: "MADSGlobal NZ Ltd.",
    355: "PCH International",
    356: "Qingdao Yeelink Information Technology Co., Ltd.",
    357: "Milwaukee Tool (formerly Milwaukee Electric Tools)",
    358: "MISHIK Pte Ltd",
    359: "Bayer HealthCare",
    360: "Spicebox LLC",
    361: "emberlight",
    362: "Cooper-Atkins Corporation",
    363: "Qblinks",
    364: "MYSPHERA",
    365: "LifeScan Inc",
    366: "Volantic AB",
    367: "Podo Labs, Inc",
    368: "Roche Diabetes Care AG",
    369: "Amazon Fulfillment Service",
    370: "Connovate Technology Private Limited",
    371: "Kocomojo, LLC",
    372: "Everykey LLC",
    373: "Dynamic Controls",
    374: "SentriLock",
    375: "I-SYST inc.",
    376: "CASIO COMPUTER CO., LTD.",
    377: "LAPIS Semiconductor Co., Ltd.",
    378: "Telemonitor, Inc.",
    379: "taskit GmbH",
    380: "Daimler AG",
    381: "BatAndCat",
    382: "BluDotz Ltd",
    383: "XTel ApS",
    384: "Gigaset Communications GmbH",
    385: "Gecko Health Innovations, Inc.",
    386: "HOP Ubiquitous",
    387: "To Be Assigned",
    388: "Nectar",
    389: "bel’apps LLC",
    390: "CORE Lighting Ltd",
    391: "Seraphim Sense Ltd",
    392: "Unico RBC",
    393: "Physical Enterprises Inc.",
    394: "Able Trend Technology Limited",
    395: "Konica Minolta, Inc.",
    396: "Wilo SE",
    397: "Extron Design Services",
    398: "Fitbit, Inc.",
    399: "Fireflies Systems",
    400: "Intelletto Technologies Inc.",
    401: "FDK CORPORATION",
    402: "Cloudleaf, Inc",
    403: "Maveric Automation LLC",
    404: "Acoustic Stream Corporation",
    405: "Zuli",
    406: "Paxton Access Ltd",
    407: "WiSilica Inc",
    408: "Vengit Limited",
    409: "SALTO SYSTEMS S.L.",
    410: "TRON Forum (formerly T-Engine Forum)",
    411: "CUBETECH s.r.o.",
    412: "Cokiya Incorporated",
    413: "CVS Health",
    414: "Ceruus",
    415: "Strainstall Ltd",
    416: "Channel Enterprises (HK) Ltd.",
    417: "FIAMM",
    418: "GIGALANE.CO.,LTD",
    419: "EROAD",
    420: "Mine Safety Appliances",
    421: "Icon Health and Fitness",
    422: "Asandoo GmbH",
    423: "ENERGOUS CORPORATION",
    424: "Taobao",
    425: "Canon Inc.",
    426: "Geophysical Technology Inc.",
    427: "Facebook, Inc.",
    428: "Nipro Diagnostics, Inc.",
    429: "FlightSafety International",
    430: "Earlens Corporation",
    431: "Sunrise Micro Devices, Inc.",
    432: "Star Micronics Co., Ltd.",
    433: "Netizens Sp. z o.o.",
    434: "Nymi Inc.",
    435: "Nytec, Inc.",
    436: "Trineo Sp. z o.o.",
    437: "Nest Labs Inc.",
    438: "LM Technologies Ltd",
    439: "General Electric Company",
    440: "i+D3 S.L.",
    441: "HANA Micron",
    442: "Stages Cycling LLC",
    443: "Cochlear Bone Anchored Solutions AB",
    444: "SenionLab AB",
    445: "Syszone Co., Ltd",
    446: "Pulsate Mobile Ltd.",
    447: "Hong Kong HunterSun Electronic Limited",
    448: "pironex GmbH",
    449: "BRADATECH Corp.",
    450: "Transenergooil AG",
    451: "Bunch",
    452: "DME Microelectronics",
    453: "Bitcraze AB",
    454: "HASWARE Inc.",
    455: "Abiogenix Inc.",
    456: "Poly-Control ApS",
    457: "Avi-on",
    458: "Laerdal Medical AS",
    459: "Fetch My Pet",
    460: "Sam Labs Ltd.",
    461: "Chengdu Synwing Technology Ltd",
    462: "HOUWA SYSTEM DESIGN, k.k.",
    463: "BSH",
    464: "Primus Inter Pares Ltd",
    465: "August",
    466: "Gill Electronics",
    467: "Sky Wave Design",
    468: "Newlab S.r.l.",
    469: "ELAD srl",
    470: "G-wearables inc.",
    471: "Squadrone Systems Inc.",
    472: "Code Corporation",
    473: "Savant Systems LLC",
    474: "Logitech International SA",
    475: "Innblue Consulting",
    476: "iParking Ltd.",
    477: "Koninklijke Philips Electronics N.V.",
    478: "Minelab Electronics Pty Limited",
    479: "Bison Group Ltd.",
    480: "Widex A/S",
    481: "Jolla Ltd",
    482: "Lectronix, Inc.",
    483: "Caterpillar Inc",
    484: "Freedom Innovations",
    485: "Dynamic Devices Ltd",
    486: "Technology Solutions (UK) Ltd",
    487: "IPS Group Inc.",
    488: "STIR",
    489: "Sano, Inc",
    490: "Advanced Application Design, Inc.",
    491: "AutoMap LLC",
    492: "Spreadtrum Communications Shanghai Ltd",
    493: "CuteCircuit LTD",
    494: "Valeo Service",
    495: "Fullpower Technologies, Inc.",
    496: "KloudNation",
    497: "Zebra Technologies Corporation",
    498: "Itron, Inc.",
    499: "The University of Tokyo",
    500: "UTC Fire and Security",
    501: "Cool Webthings Limited",
    502: "DJO Global",
    503: "Gelliner Limited",
    504: "Anyka (Guangzhou) Microelectronics Technology Co, LTD",
    505: "Medtronic, Inc.",
    506: "Gozio, Inc.",
    507: "Form Lifting, LLC",
    508: "Wahoo Fitness, LLC",
    509: "Kontakt Micro-Location Sp. z o.o.",
    510: "Radio System Corporation",
    511: "Freescale Semiconductor, Inc.",
    512: "Verifone Systems PTe Ltd. Taiwan Branch",
    513: "AR Timing",
    514: "Rigado LLC",
    515: "Kemppi Oy",
    516: "Tapcentive Inc.",
    517: "Smartbotics Inc.",
    518: "Otter Products, LLC",
    519: "STEMP Inc.",
    520: "LumiGeek LLC",
    521: "InvisionHeart Inc.",
    522: "Macnica Inc. ",
    523: "Jaguar Land Rover Limited",
    524: "CoroWare Technologies, Inc",
    525: "Simplo Technology Co., LTD",
    526: "Omron Healthcare Co., LTD",
    527: "Comodule GMBH",
    528: "ikeGPS",
    529: "Telink Semiconductor Co. Ltd",
    530: "Interplan Co., Ltd",
    531: "Wyler AG",
    532: "IK Multimedia Production srl",
    533: "Lukoton Experience Oy",
    534: "MTI Ltd",
    535: "Tech4home, Lda",
    536: "Hiotech AB",
    537: "DOTT Limited",
    538: "Blue Speck Labs, LLC",
    539: "Cisco Systems, Inc",
    540: "Mobicomm Inc",
    541: "Edamic",
    542: "Goodnet, Ltd",
    543: "Luster Leaf Products Inc",
    544: "Manus Machina BV",
    545: "Mobiquity Networks Inc",
    546: "Praxis Dynamics",
    547: "Philip Morris Products S.A.",
    548: "Comarch SA",
    549: "Nestl Nespresso S.A.",
    550: "Merlinia A/S",
    551: "LifeBEAM Technologies",
    552: "Twocanoes Labs, LLC",
    553: "Muoverti Limited",
    554: "Stamer Musikanlagen GMBH",
    555: "Tesla Motors",
    556: "Pharynks Corporation",
    557: "Lupine",
    558: "Siemens AG",
    559: "Huami (Shanghai) Culture Communication CO., LTD",
    560: "Foster Electric Company, Ltd",
    561: "ETA SA",
    562: "x-Senso Solutions Kft",
    563: "Shenzhen SuLong Communication Ltd",
    564: "FengFan (BeiJing) Technology Co, Ltd",
    565: "Qrio Inc",
    566: "Pitpatpet Ltd",
    567: "MSHeli s.r.l.",
    568: "Trakm8 Ltd",
    569: "JIN CO, Ltd",
    570: "Alatech Tehnology",
    571: "Beijing CarePulse Electronic Technology Co, Ltd",
    572: "Awarepoint",
    573: "ViCentra B.V.",
    574: "Raven Industries",
    575: "WaveWare Technologies Inc.",
    576: "Argenox Technologies",
    577: "Bragi GmbH",
    578: "16Lab Inc",
    579: "Masimo Corp",
    580: "Iotera Inc",
    581: "Endress+Hauser",
    582: "ACKme Networks, Inc.",
    583: "FiftyThree Inc.",
    584: "Parker Hannifin Corp",
    585: "Transcranial Ltd",
    586: "Uwatec AG",
    587: "Orlan LLC",
    588: "Blue Clover Devices",
    589: "M-Way Solutions GmbH",
    590: "Microtronics Engineering GmbH",
    591: "Schneider Schreibgerte GmbH",
    592: "Sapphire Circuits LLC",
    593: "Lumo Bodytech Inc.",
    594: "UKC Technosolution",
    595: "Xicato Inc.",
    596: "Playbrush",
    597: "Dai Nippon Printing Co., Ltd.",
    598: "G24 Power Limited",
    599: "AdBabble Local Commerce Inc.",
    600: "Devialet SA",
    601: "ALTYOR",
    602: "University of Applied Sciences Valais/Haute Ecole Valaisanne",
    603: "Five Interactive, LLC dba Zendo",
    604: "NetEaseHangzhouNetwork co.Ltd.",
    605: "Lexmark International Inc.",
    606: "Fluke Corporation",
    607: "Yardarm Technologies",
    608: "SensaRx",
    609: "SECVRE GmbH",
    610: "Glacial Ridge Technologies",
    611: "Identiv, Inc.",
    612: "DDS, Inc.",
    613: "SMK Corporation",
    614: "Schawbel Technologies LLC",
    615: "XMI Systems SA",
    616: "Cerevo",
    617: "Torrox GmbH & Co KG",
    618: "Gemalto",
    619: "DEKA Research & Development Corp.",
    620: "Domster Tadeusz Szydlowski",
    621: "Technogym SPA",
    622: "FLEURBAEY BVBA",
    623: "Aptcode Solutions",
    624: "LSI ADL Technology",
    625: "Animas Corp",
    626: "Alps Electric Co., Ltd.",
    627: "OCEASOFT",
    628: "Motsai Research",
    629: "Geotab",
    630: "E.G.O. Elektro-Gertebau GmbH",
    631: "bewhere inc",
    632: "Johnson Outdoors Inc",
    633: "steute Schaltgerate GmbH & Co. KG",
    634: "Ekomini inc.",
    635: "DEFA AS",
    636: "Aseptika Ltd",
    637: "HUAWEI Technologies Co., Ltd. ( )",
    638: "HabitAware, LLC",
    639: "ruwido austria gmbh",
    640: "ITEC corporation",
    641: "StoneL",
    642: "Sonova AG",
    643: "Maven Machines, Inc.",
    644: "Synapse Electronics",
    645: "Standard Innovation Inc.",
    646: "RF Code, Inc.",
    647: "Wally Ventures S.L.",
    648: "Willowbank Electronics Ltd",
    649: "SK Telecom",
    650: "Jetro AS",
    651: "Code Gears LTD",
    652: "NANOLINK APS",
    653: "IF, LLC",
    654: "RF Digital Corp",
    655: "Church & Dwight Co., Inc",
    656: "Multibit Oy",
    657: "CliniCloud Inc",
    658: "SwiftSensors",
    659: "Blue Bite",
    660: "ELIAS GmbH",
    661: "Sivantos GmbH",
    662: "Petzl",
    663: "storm power ltd",
    664: "EISST Ltd",
    665: "Inexess Technology Simma KG",
    666: "Currant, Inc.",
    667: "C2 Development, Inc.",
    668: "Blue Sky Scientific, LLC",
    669: "ALOTTAZS LABS, LLC",
    670: "Kupson spol. s r.o.",
    671: "Areus Engineering GmbH",
    672: "Impossible Camera GmbH",
    673: "InventureTrack Systems",
    674: "LockedUp",
    675: "Itude",
    676: "Pacific Lock Company",
    677: "Tendyron Corporation ( )",
    678: "Robert Bosch GmbH",
    679: "Illuxtron international B.V.",
    680: "miSport Ltd.",
    681: "Chargelib",
    682: "Doppler Lab",
    683: "BBPOS Limited",
    684: "RTB Elektronik GmbH & Co. KG",
    685: "Rx Networks, Inc.",
    686: "WeatherFlow, Inc.",
    687: "Technicolor USA Inc.",
    688: "Bestechnic(Shanghai),Ltd",
    689: "Raden Inc",
    690: "JouZen Oy",
    691: "CLABER S.P.A.",
    692: "Hyginex, Inc.",
    693: "HANSHIN ELECTRIC RAILWAY CO.,LTD.",
    694: "Schneider Electric",
    695: "Oort Technologies LLC",
    696: "Chrono Therapeutics",
    697: "Rinnai Corporation",
    698: "Swissprime Technologies AG",
    699: "Koha.,Co.Ltd",
    700: "Genevac Ltd",
    701: "Chemtronics",
    702: "Seguro Technology Sp. z o.o.",
    703: "Redbird Flight Simulations",
    704: "Dash Robotics",
    705: "LINE Corporation",
    706: "Guillemot Corporation",
    707: "Techtronic Power Tools Technology Limited",
    708: "Wilson Sporting Goods",
    709: "Lenovo (Singapore) Pte Ltd. ( )",
    710: "Ayatan Sensors",
    711: "Electronics Tomorrow Limited",
    712: "VASCO Data Security International, Inc.",
    713: "PayRange Inc.",
    714: "ABOV Semiconductor",
    715: "AINA-Wireless Inc.",
    716: "Eijkelkamp Soil & Water",
    717: "BMA ergonomics b.v.",
    718: "Teva Branded Pharmaceutical Products R&D, Inc.",
    719: "Anima",
    720: "3M",
    721: "Empatica Srl",
    722: "Afero, Inc.",
    723: "Powercast Corporation",
    724: "Secuyou ApS",
    725: "OMRON Corporation",
    726: "Send Solutions",
    727: "NIPPON SYSTEMWARE CO.,LTD.",
    728: "Neosfar",
    729: "Fliegl Agrartechnik GmbH",
    730: "Gilvader",
    731: "Digi International Inc (R)",
    732: "DeWalch Technologies, Inc.",
    733: "Flint Rehabilitation Devices, LLC",
    734: "Samsung SDS Co., Ltd.",
    735: "Blur Product Development",
    736: "University of Michigan",
    737: "Victron Energy BV",
    738: "NTT docomo",
    739: "Carmanah Technologies Corp.",
    740: "Bytestorm Ltd.",
    741: "Espressif Incorporated ( () )",
    742: "Unwire",
    743: "Connected Yard, Inc.",
    744: "American Music Environments",
    745: "Sensogram Technologies, Inc.",
    746: "Fujitsu Limited",
    747: "Ardic Technology",
    748: "Delta Systems, Inc",
    749: "HTC Corporation",
    750: "Citizen Holdings Co., Ltd.",
    751: "SMART-INNOVATION.inc",
    752: "Blackrat Software",
    753: "The Idea Cave, LLC",
    754: "GoPro, Inc.",
    755: "AuthAir, Inc",
    756: "Vensi, Inc.",
    757: "Indagem Tech LLC",
    758: "Intemo Technologies",
    759: "DreamVisions co., Ltd.",
    760: "Runteq Oy Ltd",
    761: "IMAGINATION TECHNOLOGIES LTD",
    762: "CoSTAR TEchnologies",
    763: "Clarius Mobile Health Corp.",
    764: "Shanghai Frequen Microelectronics Co., Ltd.",
    765: "Uwanna, Inc.",
    766: "Lierda Science & Technology Group Co., Ltd.",
    767: "Silicon Laboratories",
    768: "World Moto Inc.",
    769: "Giatec Scientific Inc.",
    770: "Loop Devices, Inc",
    771: "IACA electronique",
    772: "Martians Inc",
    773: "Swipp ApS",
    774: "Life Laboratory Inc.",
    775: "FUJI INDUSTRIAL CO.,LTD.",
    776: "Surefire, LLC",
    777: "Dolby Labs",
    778: "Ellisys",
    779: "Magnitude Lighting Converters",
    780: "Hilti AG",
    781: "Devdata S.r.l.",
    782: "Deviceworx",
    783: "Shortcut Labs",
    784: "SGL Italia S.r.l.",
    785: "PEEQ DATA",
    786: "Ducere Technologies Pvt Ltd",
    787: "DiveNav, Inc.",
    788: "RIIG AI Sp. z o.o.",
    789: "Thermo Fisher Scientific",
    790: "AG Measurematics Pvt. Ltd.",
    791: "CHUO Electronics CO., LTD.",
    792: "Aspenta International",
    793: "Eugster Frismag AG",
    794: "Amber wireless GmbH",
    795: "HQ Inc",
    796: "Lab Sensor Solutions",
    797: "Enterlab ApS",
    798: "Eyefi, Inc.",
    799: "MetaSystem S.p.A.",
    800: "SONO ELECTRONICS. CO., LTD",
    801: "Jewelbots",
    802: "Compumedics Limited",
    803: "Rotor Bike Components",
    804: "Astro, Inc.",
    805: "Amotus Solutions",
    806: "Healthwear Technologies (Changzhou)Ltd",
    807: "Essex Electronics",
    808: "Grundfos A/S",
    809: "Eargo, Inc.",
    810: "Electronic Design Lab",
    811: "ESYLUX",
    812: "NIPPON SMT.CO.,Ltd",
    813: "BM innovations GmbH",
    814: "indoormap",
    815: "OttoQ Inc",
    816: "North Pole Engineering",
    817: "3flares Technologies Inc.",
    818: "Electrocompaniet A.S.",
    819: "Mul-T-Lock",
    820: "Corentium AS",
    821: "Enlighted Inc",
    822: "GISTIC",
    823: "AJP2 Holdings, LLC",
    824: "COBI GmbH",
    825: "Blue Sky Scientific, LLC",
    826: "Appception, Inc.",
    827: "Courtney Thorne Limited",
    828: "Virtuosys",
    829: "TPV Technology Limited",
    830: "Monitra SA",
    831: "Automation Components, Inc.",
    832: "Letsense s.r.l.",
    833: "Etesian Technologies LLC",
    834: "GERTEC BRASIL LTDA.",
    835: "Drekker Development Pty. Ltd.",
    836: "Whirl Inc",
    837: "Locus Positioning",
    838: "Acuity Brands Lighting, Inc",
    839: "Prevent Biometrics",
    840: "Arioneo",
    841: "VersaMe",
    842: "Vaddio",
    843: "Libratone A/S",
    844: "HM Electronics, Inc.",
    845: "TASER International, Inc.",
    846: "SafeTrust Inc.",
    847: "Heartland Payment Systems",
    848: "Bitstrata Systems Inc.",
    849: "Pieps GmbH",
    850: "iRiding(Xiamen)Technology Co.,Ltd.",
    851: "Alpha Audiotronics, Inc.",
    852: "TOPPAN FORMS CO.,LTD.",
    853: "Sigma Designs, Inc.",
    854: "Spectrum Brands, Inc.",
    855: "Polymap Wireless",
    856: "MagniWare Ltd.",
    857: "Novotec Medical GmbH",
    858: "Medicom Innovation Partner a/s",
    859: "Matrix Inc.",
    860: "Eaton Corporation",
    861: "KYS",
    862: "Naya Health, Inc.",
    863: "Acromag",
    864: "Insulet Corporation",
    865: "Wellinks Inc.",
    866: "ON Semiconductor",
    867: "FREELAP SA",
    868: "Favero Electronics Srl",
    869: "BioMech Sensor LLC",
    870: "BOLTT Sports technologies Private limited",
    871: "Saphe International",
    872: "Metormote AB",
    873: "littleBits",
    874: "SetPoint Medical",
    875: "BRControls Products BV",
    876: "Zipcar",
    877: "AirBolt Pty Ltd",
    878: "KeepTruckin Inc",
    879: "Motiv, Inc.",
    880: "Wazombi Labs O",
    881: "ORBCOMM",
    882: "Nixie Labs, Inc.",
    883: "AppNearMe Ltd",
    884: "Holman Industries",
    885: "Expain AS",
    886: "Electronic Temperature Instruments Ltd",
    887: "Plejd AB",
    888: "Propeller Health",
    889: "Shenzhen iMCO Electronic Technology Co.,Ltd",
    890: "Algoria",
    891: "Apption Labs Inc.",
    892: "Cronologics Corporation",
    893: "MICRODIA Ltd.",
    894: "lulabytes S.L.",
    895: "Nestec S.A.",
    896: "LLC MEGA - F service",
    897: "Sharp Corporation",
    898: "Precision Outcomes Ltd",
    899: "Kronos Incorporated",
    900: "OCOSMOS Co., Ltd.",
    901: "Embedded Electronic Solutions Ltd. dba e2Solutions",
    902: "Aterica Inc.",
    903: "BluStor PMC, Inc.",
    904: "Kapsch TrafficCom AB",
    905: "ActiveBlu Corporation",
    906: "Kohler Mira Limited",
    907: "Noke",
    908: "Appion Inc.",
    909: "Resmed Ltd",
    910: "Crownstone B.V.",
    911: "Xiaomi Inc.",
    912: "INFOTECH s.r.o.",
    913: "Thingsquare AB",
    914: "T&D",
    915: "LAVAZZA S.p.A.",
    916: "Netclearance Systems, Inc.",
    917: "SDATAWAY",
    918: "BLOKS GmbH",
    919: "LEGO System A/S",
    920: "Thetatronics Ltd",
    921: "Nikon Corporation",
    922: "NeST",
    923: "South Silicon Valley Microelectronics",
    924: "ALE International",
    925: "CareView Communications, Inc.",
    926: "SchoolBoard Limited",
    927: "Molex Corporation",
    928: "IVT Wireless Limited",
    929: "Alpine Labs LLC",
    930: "Candura Instruments",
    931: "SmartMovt Technology Co., Ltd",
    932: "Token Zero Ltd",
    933: "ACE CAD Enterprise Co., Ltd. (ACECAD)",
    934: "Medela, Inc",
    935: "AeroScout",
    936: "Esrille Inc.",
    937: "THINKERLY SRL",
    938: "Exon Sp. z o.o.",
    939: "Meizu Technology Co., Ltd.",
    940: "Smablo LTD",
    941: "XiQ",
    942: "Allswell Inc.",
    943: "Comm-N-Sense Corp DBA Verigo",
    944: "VIBRADORM GmbH",
    945: "Otodata Wireless Network Inc.",
    946: "Propagation Systems Limited",
    947: "Midwest Instruments & Controls",
    948: "Alpha Nodus, inc.",
    949: "petPOMM, Inc",
    950: "Mattel",
    951: "Airbly Inc.",
    952: "A-Safe Limited",
    953: "FREDERIQUE CONSTANT SA",
    954: "Maxscend Microelectronics Company Limited",
    955: "Abbott Diabetes Care",
    956: "ASB Bank Ltd",
    957: "amadas",
    958: "Applied Science, Inc.",
    959: "iLumi Solutions Inc.",
    960: "Arch Systems Inc.",
    961: "Ember Technologies, Inc.",
    962: "Snapchat Inc",
    963: "Casambi Technologies Oy",
    964: "Pico Technology Inc.",
    965: "St. Jude Medical, Inc.",
    966: "Intricon",
    967: "Structural Health Systems, Inc.",
    968: "Avvel International",
    969: "Gallagher Group",
    970: "In2things Automation Pvt. Ltd.",
    971: "SYSDEV Srl",
    972: "Vonkil Technologies Ltd",
    973: "Wynd Technologies, Inc.",
    974: "CONTRINEX S.A.",
    975: "MIRA, Inc.",
    976: "Watteam Ltd",
    977: "Density Inc.",
    978: "IOT Pot India Private Limited",
    979: "Sigma Connectivity AB",
    980: "PEG PEREGO SPA",
    981: "Wyzelink Systems Inc.",
    982: "Yota Devices LTD",
    983: "FINSECUR",
    984: "Zen-Me Labs Ltd",
    985: "3IWare Co., Ltd.",
    986: "EnOcean GmbH",
    987: "Instabeat, Inc",
    988: "Nima Labs",
    989: "Andreas Stihl AG & Co. KG",
    990: "Nathan Rhoades LLC",
    991: "Grob Technologies, LLC",
    992: "Actions (Zhuhai) Technology Co., Limited",
    993: "SPD Development Company Ltd",
    994: "Sensoan Oy",
    995: "Qualcomm Life Inc",
    996: "Chip-ing AG",
    997: "ffly4u",
    998: "IoT Instruments Oy",
    999: "TRUE Fitness Technology",
    1e3: "Reiner Kartengeraete GmbH & Co. KG.",
    1001: "SHENZHEN LEMONJOY TECHNOLOGY CO., LTD.",
    1002: "Hello Inc.",
    1003: "Evollve Inc.",
    1004: "Jigowatts Inc.",
    1005: "BASIC MICRO.COM,INC.",
    1006: "CUBE TECHNOLOGIES",
    1007: "foolography GmbH",
    1008: "CLINK",
    1009: "Hestan Smart Cooking Inc.",
    1010: "WindowMaster A/S",
    1011: "Flowscape AB",
    1012: "PAL Technologies Ltd",
    1013: "WHERE, Inc.",
    1014: "Iton Technology Corp.",
    1015: "Owl Labs Inc.",
    1016: "Rockford Corp.",
    1017: "Becon Technologies Co.,Ltd.",
    1018: "Vyassoft Technologies Inc",
    1019: "Nox Medical",
    1020: "Kimberly-Clark",
    1021: "Trimble Navigation Ltd.",
    1022: "Littelfuse",
    1023: "Withings",
    1024: "i-developer IT Beratung UG",
    1026: "Sears Holdings Corporation",
    1027: "Gantner Electronic GmbH",
    1028: "Authomate Inc",
    1029: "Vertex International, Inc.",
    1030: "Airtago",
    1031: "Swiss Audio SA",
    1032: "ToGetHome Inc.",
    1033: "AXIS",
    1034: "Openmatics",
    1035: "Jana Care Inc.",
    1036: "Senix Corporation",
    1037: "NorthStar Battery Company, LLC",
    1038: "SKF (U.K.) Limited",
    1039: "CO-AX Technology, Inc.",
    1040: "Fender Musical Instruments",
    1041: "Luidia Inc",
    1042: "SEFAM",
    1043: "Wireless Cables Inc",
    1044: "Lightning Protection International Pty Ltd",
    1045: "Uber Technologies Inc",
    1046: "SODA GmbH",
    1047: "Fatigue Science",
    1048: "Alpine Electronics Inc.",
    1049: "Novalogy LTD",
    1050: "Friday Labs Limited",
    1051: "OrthoAccel Technologies",
    1052: "WaterGuru, Inc.",
    1053: "Benning Elektrotechnik und Elektronik GmbH & Co. KG",
    1054: "Dell Computer Corporation",
    1055: "Kopin Corporation",
    1056: "TecBakery GmbH",
    1057: "Backbone Labs, Inc.",
    1058: "DELSEY SA",
    1059: "Chargifi Limited",
    1060: "Trainesense Ltd.",
    1061: "Unify Software and Solutions GmbH & Co. KG",
    1062: "Husqvarna AB",
    1063: "Focus fleet and fuel management inc",
    1064: "SmallLoop, LLC",
    1065: "Prolon Inc.",
    1066: "BD Medical",
    1067: "iMicroMed Incorporated",
    1068: "Ticto N.V.",
    1069: "Meshtech AS",
    1070: "MemCachier Inc.",
    1071: "Danfoss A/S",
    1072: "SnapStyk Inc.",
    1073: "Amyway Corporation",
    1074: "Silk Labs, Inc.",
    1075: "Pillsy Inc.",
    1076: "Hatch Baby, Inc.",
    1077: "Blocks Wearables Ltd.",
    1078: "Drayson Technologies (Europe) Limited",
    1079: "eBest IOT Inc.",
    1080: "Helvar Ltd",
    1081: "Radiance Technologies",
    1082: "Nuheara Limited",
    1083: "Appside co., ltd.",
    1084: "DeLaval",
    1085: "Coiler Corporation",
    1086: "Thermomedics, Inc.",
    1087: "Tentacle Sync GmbH",
    1088: "Valencell, Inc.",
    1089: "iProtoXi Oy",
    1090: "SECOM CO., LTD.",
    1091: "Tucker International LLC",
    1092: "Metanate Limited",
    1093: "Kobian Canada Inc.",
    1094: "NETGEAR, Inc.",
    1095: "Fabtronics Australia Pty Ltd",
    1096: "Grand Centrix GmbH",
    1097: "1UP USA.com llc",
    1098: "SHIMANO INC.",
    1099: "Nain Inc.",
    1100: "LifeStyle Lock, LLC",
    1101: "VEGA Grieshaber KG",
    1102: "Xtrava Inc.",
    1103: "TTS Tooltechnic Systems AG & Co. KG",
    1104: "Teenage Engineering AB",
    1105: "Tunstall Nordic AB",
    1106: "Svep Design Center AB",
    1107: "GreenPeak Technologies BV",
    1108: "Sphinx Electronics GmbH & Co KG",
    1109: "Atomation",
    1110: "Nemik Consulting Inc",
    1111: "RF INNOVATION",
    1112: "Mini Solution Co., Ltd.",
    1113: "Lumenetix, Inc",
    1114: "2048450 Ontario Inc",
    1115: "SPACEEK LTD",
    1116: "Delta T Corporation",
    1117: "Boston Scientific Corporation",
    1118: "Nuviz, Inc.",
    1119: "Real Time Automation, Inc.",
    1120: "Kolibree",
    1121: "vhf elektronik GmbH",
    1122: "Bonsai Systems GmbH",
    1123: "Fathom Systems Inc.",
    1124: "Bellman & Symfon",
    1125: "International Forte Group LLC",
    1126: "CycleLabs Solutions inc.",
    1127: "Codenex Oy",
    1128: "Kynesim Ltd",
    1129: "Palago AB",
    1130: "INSIGMA INC.",
    1131: "PMD Solutions",
    1132: "Qingdao Realtime Technology Co., Ltd.",
    1133: "BEGA Gantenbrink-Leuchten KG",
    1134: "Pambor Ltd.",
    65535: "SPECIAL USE/DEFAULT"
  }), bluetoothVendors;
}
var hasRequiredBluetooth;
function requireBluetooth() {
  if (hasRequiredBluetooth) return bluetooth;
  hasRequiredBluetooth = 1;
  const s = require$$1.exec, e = require$$1.execSync, A = require$$2, g = requireUtil(), r = requireBluetoothVendors(), B = require$$1$1, F = process.platform, k = F === "linux" || F === "android", P = F === "darwin", q = F === "win32", Z = F === "freebsd", $ = F === "openbsd", sA = F === "netbsd", X = F === "sunos";
  function S(E) {
    let u = "";
    return E.indexOf("keyboard") >= 0 && (u = "Keyboard"), E.indexOf("mouse") >= 0 && (u = "Mouse"), E.indexOf("trackpad") >= 0 && (u = "Trackpad"), E.indexOf("audio") >= 0 && (u = "Audio"), E.indexOf("sound") >= 0 && (u = "Audio"), E.indexOf("microph") >= 0 && (u = "Microphone"), E.indexOf("speaker") >= 0 && (u = "Speaker"), E.indexOf("headset") >= 0 && (u = "Headset"), E.indexOf("phone") >= 0 && (u = "Phone"), E.indexOf("macbook") >= 0 && (u = "Computer"), E.indexOf("imac") >= 0 && (u = "Computer"), E.indexOf("ipad") >= 0 && (u = "Tablet"), E.indexOf("watch") >= 0 && (u = "Watch"), E.indexOf("headphone") >= 0 && (u = "Headset"), u;
  }
  function J(E) {
    let u = E.split(" ")[0];
    return E = E.toLowerCase(), E.indexOf("apple") >= 0 && (u = "Apple"), E.indexOf("ipad") >= 0 && (u = "Apple"), E.indexOf("imac") >= 0 && (u = "Apple"), E.indexOf("iphone") >= 0 && (u = "Apple"), E.indexOf("magic mouse") >= 0 && (u = "Apple"), E.indexOf("magic track") >= 0 && (u = "Apple"), E.indexOf("macbook") >= 0 && (u = "Apple"), u;
  }
  function eA(E) {
    const u = parseInt(E);
    if (!isNaN(u)) return r[u];
  }
  function b(E, u, o) {
    const Q = {};
    return Q.device = null, Q.name = g.getValue(E, "name", "="), Q.manufacturer = null, Q.macDevice = u, Q.macHost = o, Q.batteryPercent = null, Q.type = S(Q.name.toLowerCase()), Q.connected = !1, Q;
  }
  function N(E, u) {
    const o = {}, Q = ((E.device_minorClassOfDevice_string || E.device_majorClassOfDevice_string || E.device_minorType || "") + (E.device_name || "")).toLowerCase();
    return o.device = E.device_services || "", o.name = E.device_name || "", o.manufacturer = E.device_manufacturer || eA(E.device_vendorID) || J(E.device_name || "") || "", o.macDevice = (E.device_addr || E.device_address || "").toLowerCase().replace(/-/g, ":"), o.macHost = u, o.batteryPercent = E.device_batteryPercent || null, o.type = S(Q), o.connected = E.device_isconnected === "attrib_Yes" || !1, o;
  }
  function p(E) {
    const u = {};
    return u.device = null, u.name = g.getValue(E, "name", ":"), u.manufacturer = g.getValue(E, "manufacturer", ":"), u.macDevice = null, u.macHost = null, u.batteryPercent = null, u.type = S(u.name.toLowerCase()), u.connected = null, u;
  }
  function h(E) {
    return new Promise((u) => {
      process.nextTick(() => {
        let o = [];
        if (k) {
          g.getFilesInPath("/var/lib/bluetooth/").forEach((d) => {
            const c = A.basename(d), n = d.split("/"), L = n.length >= 6 ? n[n.length - 2] : null, G = n.length >= 7 ? n[n.length - 3] : null;
            if (c === "info") {
              const K = B.readFileSync(d, { encoding: "utf8" }).split(`
`);
              o.push(b(K, L, G));
            }
          });
          try {
            const d = e("hcitool con", g.execOptsLinux).toString().toLowerCase();
            for (let c = 0; c < o.length; c++)
              o[c].macDevice && o[c].macDevice.length > 10 && d.indexOf(o[c].macDevice.toLowerCase()) >= 0 && (o[c].connected = !0);
          } catch {
            g.noop();
          }
          E && E(o), u(o);
        }
        P && s("system_profiler SPBluetoothDataType -json", (d, c) => {
          if (!d)
            try {
              const n = JSON.parse(c.toString());
              if (n.SPBluetoothDataType && n.SPBluetoothDataType.length && n.SPBluetoothDataType[0] && n.SPBluetoothDataType[0].device_title && n.SPBluetoothDataType[0].device_title.length) {
                let L = null;
                n.SPBluetoothDataType[0].local_device_title && n.SPBluetoothDataType[0].local_device_title.general_address && (L = n.SPBluetoothDataType[0].local_device_title.general_address.toLowerCase().replace(/-/g, ":")), n.SPBluetoothDataType[0].device_title.forEach((G) => {
                  const K = G, gA = Object.keys(K);
                  if (gA && gA.length === 1) {
                    const H = K[gA[0]];
                    H.device_name = gA[0];
                    const U = N(H, L);
                    o.push(U);
                  }
                });
              }
              if (n.SPBluetoothDataType && n.SPBluetoothDataType.length && n.SPBluetoothDataType[0] && n.SPBluetoothDataType[0].device_connected && n.SPBluetoothDataType[0].device_connected.length) {
                const L = n.SPBluetoothDataType[0].controller_properties && n.SPBluetoothDataType[0].controller_properties.controller_address ? n.SPBluetoothDataType[0].controller_properties.controller_address.toLowerCase().replace(/-/g, ":") : null;
                n.SPBluetoothDataType[0].device_connected.forEach((G) => {
                  const K = G, gA = Object.keys(K);
                  if (gA && gA.length === 1) {
                    const H = K[gA[0]];
                    H.device_name = gA[0], H.device_isconnected = "attrib_Yes";
                    const U = N(H, L);
                    o.push(U);
                  }
                });
              }
              if (n.SPBluetoothDataType && n.SPBluetoothDataType.length && n.SPBluetoothDataType[0] && n.SPBluetoothDataType[0].device_not_connected && n.SPBluetoothDataType[0].device_not_connected.length) {
                const L = n.SPBluetoothDataType[0].controller_properties && n.SPBluetoothDataType[0].controller_properties.controller_address ? n.SPBluetoothDataType[0].controller_properties.controller_address.toLowerCase().replace(/-/g, ":") : null;
                n.SPBluetoothDataType[0].device_not_connected.forEach((G) => {
                  const K = G, gA = Object.keys(K);
                  if (gA && gA.length === 1) {
                    const H = K[gA[0]];
                    H.device_name = gA[0], H.device_isconnected = "attrib_No";
                    const U = N(H, L);
                    o.push(U);
                  }
                });
              }
            } catch {
              g.noop();
            }
          E && E(o), u(o);
        }), q && g.powerShell("Get-CimInstance Win32_PNPEntity | select PNPClass, Name, Manufacturer, Status, Service, ConfigManagerErrorCode, Present | fl").then((Q, d) => {
          d || Q.toString().split(/\n\s*\n/).forEach((n) => {
            const L = n.split(`
`), G = g.getValue(L, "Service", ":"), K = g.getValue(L, "ConfigManagerErrorCode", ":");
            g.getValue(L, "PNPClass", ":").toLowerCase() === "bluetooth" && K === "0" && G === "" && o.push(p(L));
          }), E && E(o), u(o);
        }), (Z || sA || $ || X) && u(null);
      });
    });
  }
  return bluetooth.bluetoothDevices = h, bluetooth;
}
var hasRequiredLib;
function requireLib() {
  return hasRequiredLib || (hasRequiredLib = 1, (function(s) {
    const e = require$$0.version, A = requireUtil(), g = requireSystem(), r = requireOsinfo(), B = requireCpu(), F = requireMemory(), k = requireBattery(), P = requireGraphics(), q = requireFilesystem(), Z = requireNetwork(), $ = requireWifi(), sA = requireProcesses(), X = requireUsers(), S = requireInternet(), J = requireDocker(), eA = requireVirtualbox(), b = requirePrinter(), N = requireUsb(), p = requireAudio(), h = requireBluetooth(), E = process.platform, u = E === "win32", o = E === "freebsd", Q = E === "openbsd", d = E === "netbsd", c = E === "sunos";
    u && (A.getCodepage(), A.getPowershell());
    function n() {
      return e;
    }
    function L(U) {
      return new Promise((V) => {
        process.nextTick(() => {
          const m = {};
          m.version = n(), Promise.all([
            g.system(),
            g.bios(),
            g.baseboard(),
            g.chassis(),
            r.osInfo(),
            r.uuid(),
            r.versions(),
            B.cpu(),
            B.cpuFlags(),
            P.graphics(),
            Z.networkInterfaces(),
            F.memLayout(),
            q.diskLayout(),
            p.audio(),
            h.bluetoothDevices(),
            N.usb(),
            b.printer()
          ]).then((a) => {
            m.system = a[0], m.bios = a[1], m.baseboard = a[2], m.chassis = a[3], m.os = a[4], m.uuid = a[5], m.versions = a[6], m.cpu = a[7], m.cpu.flags = a[8], m.graphics = a[9], m.net = a[10], m.memLayout = a[11], m.diskLayout = a[12], m.audio = a[13], m.bluetooth = a[14], m.usb = a[15], m.printer = a[16], U && U(m), V(m);
          });
        });
      });
    }
    function G(U, V, m) {
      return A.isFunction(V) && (m = V, V = ""), A.isFunction(U) && (m = U, U = ""), new Promise((a) => {
        process.nextTick(() => {
          V = V || Z.getDefaultNetworkInterface(), U = U || "";
          let I = (() => {
            let l = 15;
            return u && (l = 13), (o || Q || d) && (l = 11), c && (l = 6), function() {
              --l === 0 && (m && m(t), a(t));
            };
          })();
          const t = {};
          t.time = r.time(), t.node = process.versions.node, t.v8 = process.versions.v8, B.cpuCurrentSpeed().then((l) => {
            t.cpuCurrentSpeed = l, I();
          }), X.users().then((l) => {
            t.users = l, I();
          }), sA.processes().then((l) => {
            t.processes = l, I();
          }), B.currentLoad().then((l) => {
            t.currentLoad = l, I();
          }), c || B.cpuTemperature().then((l) => {
            t.temp = l, I();
          }), !Q && !o && !d && !c && Z.networkStats(V).then((l) => {
            t.networkStats = l, I();
          }), c || Z.networkConnections().then((l) => {
            t.networkConnections = l, I();
          }), F.mem().then((l) => {
            t.mem = l, I();
          }), c || k().then((l) => {
            t.battery = l, I();
          }), c || sA.services(U).then((l) => {
            t.services = l, I();
          }), c || q.fsSize().then((l) => {
            t.fsSize = l, I();
          }), !u && !Q && !o && !d && !c && q.fsStats().then((l) => {
            t.fsStats = l, I();
          }), !u && !Q && !o && !d && !c && q.disksIO().then((l) => {
            t.disksIO = l, I();
          }), !Q && !o && !d && !c && $.wifiNetworks().then((l) => {
            t.wifiNetworks = l, I();
          }), S.inetLatency().then((l) => {
            t.inetLatency = l, I();
          });
        });
      });
    }
    function K(U, V, m) {
      return new Promise((a) => {
        process.nextTick(() => {
          let I = {};
          V && A.isFunction(V) && !m && (m = V, V = ""), U && A.isFunction(U) && !V && !m && (m = U, U = "", V = ""), L().then((t) => {
            I = t, G(U, V).then((l) => {
              for (let D in l)
                ({}).hasOwnProperty.call(l, D) && (I[D] = l[D]);
              m && m(I), a(I);
            });
          });
        });
      });
    }
    function gA(U, V) {
      return new Promise((m) => {
        process.nextTick(() => {
          const a = Object.keys(U).filter((I) => ({}).hasOwnProperty.call(s, I)).map((I) => {
            const t = U[I].substring(U[I].lastIndexOf("(") + 1, U[I].lastIndexOf(")"));
            let l = I.indexOf(")") >= 0 ? I.split(")")[1].trim() : I;
            return l = I.indexOf("|") >= 0 ? I.split("|")[0].trim() : l, t ? s[l](t) : s[l]("");
          });
          Promise.all(a).then((I) => {
            const t = {};
            let l = 0;
            for (let D in U)
              if ({}.hasOwnProperty.call(U, D) && {}.hasOwnProperty.call(s, D) && I.length > l) {
                if (U[D] === "*" || U[D] === "all")
                  t[D] = I[l];
                else {
                  let f = U[D], w = "", Y = [];
                  if (f.indexOf(")") >= 0 && (f = f.split(")")[1].trim()), f.indexOf("|") >= 0 && (w = f.split("|")[1].trim(), Y = w.split(":"), f = f.split("|")[0].trim()), f = f.replace(/,/g, " ").replace(/ +/g, " ").split(" "), I[l])
                    if (Array.isArray(I[l])) {
                      const _ = [];
                      I[l].forEach((x) => {
                        let W = {};
                        if (f.length === 1 && (f[0] === "*" || f[0] === "all") ? W = x : f.forEach((z) => {
                          ({}).hasOwnProperty.call(x, z) && (W[z] = x[z]);
                        }), w && Y.length === 2) {
                          if ({}.hasOwnProperty.call(W, Y[0].trim())) {
                            const z = W[Y[0].trim()];
                            typeof z == "number" ? z === parseFloat(Y[1].trim()) && _.push(W) : typeof z == "string" && z.toLowerCase() === Y[1].trim().toLowerCase() && _.push(W);
                          }
                        } else
                          _.push(W);
                      }), t[D] = _;
                    } else {
                      const _ = {};
                      f.forEach((x) => {
                        ({}).hasOwnProperty.call(I[l], x) && (_[x] = I[l][x]);
                      }), t[D] = _;
                    }
                  else
                    t[D] = {};
                }
                l++;
              }
            V && V(t), m(t);
          });
        });
      });
    }
    function H(U, V, m) {
      let a = null;
      return setInterval(() => {
        gA(U).then((t) => {
          JSON.stringify(a) !== JSON.stringify(t) && (a = Object.assign({}, t), m(t));
        });
      }, V);
    }
    s.version = n, s.system = g.system, s.bios = g.bios, s.baseboard = g.baseboard, s.chassis = g.chassis, s.time = r.time, s.osInfo = r.osInfo, s.versions = r.versions, s.shell = r.shell, s.uuid = r.uuid, s.cpu = B.cpu, s.cpuFlags = B.cpuFlags, s.cpuCache = B.cpuCache, s.cpuCurrentSpeed = B.cpuCurrentSpeed, s.cpuTemperature = B.cpuTemperature, s.currentLoad = B.currentLoad, s.fullLoad = B.fullLoad, s.mem = F.mem, s.memLayout = F.memLayout, s.battery = k, s.graphics = P.graphics, s.fsSize = q.fsSize, s.fsOpenFiles = q.fsOpenFiles, s.blockDevices = q.blockDevices, s.fsStats = q.fsStats, s.disksIO = q.disksIO, s.diskLayout = q.diskLayout, s.networkInterfaceDefault = Z.networkInterfaceDefault, s.networkGatewayDefault = Z.networkGatewayDefault, s.networkInterfaces = Z.networkInterfaces, s.networkStats = Z.networkStats, s.networkConnections = Z.networkConnections, s.wifiNetworks = $.wifiNetworks, s.wifiInterfaces = $.wifiInterfaces, s.wifiConnections = $.wifiConnections, s.services = sA.services, s.processes = sA.processes, s.processLoad = sA.processLoad, s.users = X.users, s.inetChecksite = S.inetChecksite, s.inetLatency = S.inetLatency, s.dockerInfo = J.dockerInfo, s.dockerImages = J.dockerImages, s.dockerContainers = J.dockerContainers, s.dockerContainerStats = J.dockerContainerStats, s.dockerContainerProcesses = J.dockerContainerProcesses, s.dockerVolumes = J.dockerVolumes, s.dockerAll = J.dockerAll, s.vboxInfo = eA.vboxInfo, s.printer = b.printer, s.usb = N.usb, s.audio = p.audio, s.bluetoothDevices = h.bluetoothDevices, s.getStaticData = L, s.getDynamicData = G, s.getAllData = K, s.get = gA, s.observe = H, s.powerShellStart = A.powerShellStart, s.powerShellRelease = A.powerShellRelease;
  })(lib)), lib;
}
var libExports = requireLib();
const UPDATE_INTERVAL_MS = 1e3;
class Battery {
  updateTimeout;
  onChangeACEmitter = new EventEmitter();
  onChangeLevelEmitter = new EventEmitter();
  acConnected = !0;
  level = 100;
  batteryStatsPromise = libExports.battery();
  constructor() {
    this.updateTimeout = setInterval(() => {
      this.update();
    }, UPDATE_INTERVAL_MS);
  }
  /**
   * Clean up battery monitoring resources
   */
  dispose() {
    this.updateTimeout && clearInterval(this.updateTimeout);
  }
  async update() {
    const e = await this.batteryStatsPromise, A = e.hasBattery ? e.percent : 100, g = !e.hasBattery || e.acConnected || A === 100;
    g !== this.acConnected && (this.acConnected = g, this.onChangeACEmitter.fire(g)), A !== this.level && (this.level = A, this.onChangeLevelEmitter.fire(A));
  }
  /**
   * Get the current battery level percentage
   */
  getLevel() {
    return this.level;
  }
  /**
   * Check if AC power is connected
   */
  isACConnected() {
    return this.acConnected;
  }
  onChangeLevel = this.onChangeLevelEmitter.event;
  onChangeAC = this.onChangeACEmitter.event;
}
function registerAutocomplete(s) {
  const e = new Battery();
  s.subscriptions.push(e), s.subscriptions.push(
    initStatusBar(isAutoCompleteEnabled() ? StatusBarStatus.Enabled : StatusBarStatus.Disabled)
  ), s.subscriptions.push(
    vscode.languages.registerInlineCompletionItemProvider(
      [{ pattern: "**" }],
      new ContinueCompletionProvider(new RuntimeServiceClient())
    )
  ), registerAutocompleteCommands(s, e);
}
export {
  registerAutocomplete
};
//# sourceMappingURL=index.js.map
