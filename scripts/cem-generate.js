/* eslint-disable no-console */
// eslint-disable-next-line max-classes-per-file
import * as fsSync from 'node:fs';
import { promises as fs } from 'node:fs';
import { readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';
import ts from 'typescript';

/** @typedef {import('../core/observe.js').ObserverConfiguration<any, any, any, any>} ObserverConfiguration */

/**
 * Custom Elements Manifest types from `custom-elements-manifest/schema.d.ts`.
 * @typedef {import('custom-elements-manifest').Package} CEMPackage
 * @typedef {import('custom-elements-manifest').JavaScriptModule} CEMModule
 * @typedef {import('custom-elements-manifest').CustomElementDeclaration} CEMElement
 * @typedef {import('custom-elements-manifest').CustomElementMixinDeclaration} CEMElementMixin
 * @typedef {import('custom-elements-manifest').ClassMember} CEMMember
 * @typedef {import('custom-elements-manifest').ClassField} CEMField
 * @typedef {import('custom-elements-manifest').ClassMethod} CEMMethod
 * @typedef {import('custom-elements-manifest').Attribute} CEMAttribute
 * @typedef {import('custom-elements-manifest').Reference} CEMReference
 */

/**
 * Runtime capture result returned from `captureCustomElementMetadata`.
 * We don't attempt to strictly type the runtime collection entries here;
 * those values come from the component at runtime and are treated as
 * dynamic. Consumers should treat the Map entries as `any` and rely on
 * TypeScript/JSDoc only for higher-level shapes.
 * @typedef {Object} RuntimeCaptureResult
 * @prop {Map<string, ObserverConfiguration>} attrList - attribute config keyed by attr name
 * @prop {Map<string, ObserverConfiguration>} propList - runtime propList (preserved as Map when available)
 * @prop {Map<string, 'field'|'getter'|'setter'|'method'|'constructor'>} prototypeMembers
 * @prop {Map<string, 'field'|'getter'|'setter'|'method'>} staticMembers
 * @prop {Set<string>} enumerableProps
 * @prop {Map<string,import('custom-elements-manifest').Slot>} slots
 * @prop {Map<string, import('custom-elements-manifest').CssPart>} cssParts
 * @prop {string} tag
 * @prop {string} [__meta_error]  Optional error from runtime capture
 * @prop {string} [__mixin_error] Optional error from mixin capture
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Toggle verbose logging via CLI `-v` or `--verbose` (set in `main`).
let VERBOSE = false;

/** @type {import('playwright-core').BrowserContext | null} */
let sharedContext = null;

/** @param {string} s */
function camel(s) {
  return s.replaceAll(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/** @param {string} s */
function kebab(s) {
  return s.replaceAll(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Capture mixin factory metadata by importing the module and invoking
 * the default exported mixin with a dummy base class to observe the
 * returned class' prototype and static enumerable members. Returns
 * a minimal runtime descriptor matching `{ prototypeMembers, staticMembers }`.
 * @param {string} src
 * @return {Promise<RuntimeCaptureResult|null>}
 */
async function captureMixinMetadata(src) {
  const importSpec = path.join('/', path.relative(process.cwd(), src).split(path.sep).join('/'));
  const baseSpec = path.join('/', path.relative(process.cwd(), path.resolve(process.cwd(), 'core/CustomElement.js')).split(path.sep).join('/'));
  if (VERBOSE) {
    console.log(`[manifest] captureMixinMetadata: importing ${importSpec} base=${baseSpec}`);
  }

  const page = await sharedContext.newPage();
  try {
    await page.goto('http://127.0.0.1/');
    const serialized = await page.evaluate(async ({ spec, base }) => {
      try {
        const mod = await import(spec);
        const mixin = mod.default || Object.values(mod)[0];
        if (typeof mixin !== 'function') return null;
        // Per TypeScript mixin convention: mixins accept a constructor and
        // return a subclass. Prefer using the project's `CustomElement` base
        // when available to ensure mixins that rely on its static helpers
        // (eg. `mixin`) behave correctly. Fall back to a minimal DummyBase
        // only if loading the project's base fails.
        let Base = null;
        // Avoid using try/catch as a control-flow fallback. First check
        // whether the base module is reachable via a HEAD request. Only
        // attempt `import()` if the resource appears available; if the
        // fetch fails or returns non-OK, treat the base as unavailable.
        let baseAvailable = false;
        try {
          const headResp = await fetch(base, { method: 'HEAD' });
          baseAvailable = !!(headResp && headResp.ok);
        } catch {
          baseAvailable = false;
        }

        if (baseAvailable) {
          try {
            const baseMod = await import(base);
            Base = baseMod.default || Object.values(baseMod)[0] || null;
          } catch {
            // Import failed despite HEAD succeeding; fall back to null.
            Base = null;
          }
        }
        if (!Base) {
          Base = class DummyBase extends HTMLElement {};
        }
        // Ensure the static `mixin` helper exists (some projects use
        // `CustomElement.mixin` conventionally).
        if (!Object.prototype.hasOwnProperty.call(Base, 'mixin')) {
          Object.defineProperty(Base, 'mixin', {
            /** @param {(...args:any[])=>any} fn */
            value(fn) {
              return fn(this);
            },
            writable: true,
            configurable: true,
          });
        }
        // Provide common static collections expected by some mixins.
        if (!Base.attrList) {
          Base.attrList = new Map();
        }
        if (!Base.propList) {
          Base.propList = new Map();
        }

        let Mixed;
        try {
          Mixed = mixin(Base);
        } catch (e) {
          return { __mixin_error: String(e?.message) };
        }

        const protoMap = new Map();
        const enumerableProps = new Set();
        for (const n of Object.getOwnPropertyNames(Mixed.prototype || {})) {
          const desc = Object.getOwnPropertyDescriptor(Mixed.prototype, n);
          if (!desc) continue;
          const isEnumerable = !!desc.enumerable;
          if (!isEnumerable) continue;
          enumerableProps.add(n);

          if (n === 'constructor') {
            protoMap.set(n, 'constructor');
            continue;
          }
          switch ('function') {
            case typeof desc.value:
              protoMap.set(n, 'method');
              break;
            case typeof desc.get:
              protoMap.set(n, 'getter');
              break;
            case typeof desc.set:
              protoMap.set(n, 'setter');
              break;
            default:
              protoMap.set(n, 'field');
          }
        }
        const staticNames = Object.getOwnPropertyNames(Mixed).filter((x) => !['length', 'name', 'prototype'].includes(x));
        const staticMap = new Map();
        for (const n of staticNames) {
          const desc = Object.getOwnPropertyDescriptor(Mixed, n);
          if (!desc || !desc.enumerable) {
            continue;
          }
          switch ('function') {
            case typeof desc.value:
              staticMap.set(n, 'method');
              break;
            case typeof desc.get:
              staticMap.set(n, 'getter');
              break;
            case typeof desc.set:
              staticMap.set(n, 'setter');
              break;
            default:
              staticMap.set(n, 'field');
          }
        }
        // Also capture any attribute/prop lists attached to the base class
        const attrs = Array.from((Base && Base.attrList) ? Base.attrList.entries() : []);
        const props = Array.from((Base && Base.propList) ? Base.propList.entries() : []);
        return {
          prototypeMembers: Array.from(protoMap.entries()),
          staticMembers: Array.from(staticMap.entries()),
          enumerableProps: Array.from(enumerableProps.values()),
          attrs,
          props,
        };
      } catch (e) {
        return { __mixin_error: String(e?.message) };
      }
    }, { spec: importSpec, base: baseSpec });

    if (!serialized || serialized.__mixin_error) {
      return null;
    }
    return {
      prototypeMembers: new Map(serialized.prototypeMembers),
      staticMembers: new Map(serialized.staticMembers),
      attrList: new Map(serialized.attrs || []),
      propList: new Map(serialized.props || []),
      // mixin captures don't normally expose slots/parts/tag, provide empty defaults
      enumerableProps: new Set(serialized.enumerableProps || []),
      slots: new Map(),
      cssParts: new Map(),
      tag: undefined,
    };
  } finally {
    try {
      await page.close();
    } catch (e) {
      if (VERBOSE) {
        console.error('[manifest] error closing page:', e);
      }
    }
  }
}

/** @param {string} prop @return {string} */
function listenerPropToEventName(prop) {
  if (!prop || !prop.startsWith('on')) {
    return '';
  }
  const rest = prop.slice(2);
  if (!rest) {
    return '';
  }
  const withDashes = rest.replaceAll(/([\da-z])([A-Z])/g, '$1-$2');
  return withDashes.replaceAll(/[\s_]+/g, '-').toLowerCase();
}

/**
 * @param {string} p
 * @return {Promise<boolean>}
 */
async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {any} t
 * @return {import('custom-elements-manifest').Type}
 */
function normalizeType(t) {
  if (!t && t !== 0) return undefined;
  if (typeof t === 'object') return t;
  return { text: `${t}` };
}

/**
 * Normalize an export name (convert __ prefixed names to 'default').
 * @param {string|undefined} name
 * @return {string}
 */
function normalizeExportName(name) {
  return (name && !name.startsWith('__')) ? name : 'default';
}

/**
 * Extract source location information from a TypeScript declaration.
 * @param {ts.Node|null} declaration
 * @return {import('custom-elements-manifest').SourceReference|null}
 */
/**
 * Get the source location of a TypeScript declaration.
 * @param {ts.Declaration} declaration
 * @return {{path: string, line: number}|null}
 */
function getSourceLocation(declaration) {
  if (!declaration) return null;
  const sourceFile = declaration.getSourceFile();
  if (!sourceFile) return null;
  const position = declaration.getStart();
  const relativePath = path.relative(process.cwd(), sourceFile.fileName).split(path.sep).join('/');
  const line = sourceFile.getLineAndCharacterOfPosition(position).line + 1;
  return {
    path: relativePath,
    line,
  };
}

/**
 * Convert an internal source location (with path) to a CEM SourceReference (with href).
 * @param {{path?: string, line?: number}} sourceLocation
 * @return {import('custom-elements-manifest').SourceReference|null}
 */
function sourceLocationToReference(sourceLocation) {
  if (!sourceLocation || !sourceLocation.path) return null;
  return {
    href: `https://github.com/clshortfuse/materialdesignweb/blob/main/${sourceLocation.path}${sourceLocation.line ? `#L${sourceLocation.line}` : ''}`,
  };
}

/** @type {Map<string, Promise<CEMModule>>} */
const moduleByFile = new Map();

/**
 * @typedef {Object} TSExport
 * @prop {string} [type]
 * @prop {string} [docs]
 * @prop {{path?: string, line?: number}} [source]
 */

/**
 * Collect TypeScript-exported property metadata from a source file.
 * Scans the default export expression for object literal properties.
 * @param {ts.SourceFile} sf
  @return {Map<string, TSExport>} */
function collectTsExports(sf) {
  /** @type {Map<string, TSExport>} */
  const tsExports = new Map();

  /** @param {ts.Node} node */
  const collect = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      for (const prop of node.properties) {
        if (ts.isPropertyAssignment(prop) || ts.isShorthandPropertyAssignment(prop)) {
          const nameNode = prop.name;
          let propName = null;
          if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) {
            propName = nameNode.text;
          } else if (ts.isComputedPropertyName(nameNode)) {
            propName = nameNode.expression.getText(sf);
          }
          if (!propName) {
            throw new Error(`[manifest] collect: unable to determine property name for node: ${prop.getText(sf)}`);
          }
          let inferredType = null;
          if (ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.initializer)) {
            inferredType = prop.initializer.text;
          }
          const doc = ts.getJSDocCommentsAndTags(prop).map((d) => d.comment || '').join('\n');

          tsExports.set(propName, {
            type: inferredType || undefined,
            docs: doc || undefined,
            source: getSourceLocation(prop),
          });
        }
      }
    }
    ts.forEachChild(node, collect);
  };
  collect(sf);
  return tsExports;
}

/**
 * Find the default export identifier/node for a source file.
 * @param {ts.SourceFile} sf
 * @return {{exportName:string|null, exportExpr:any|null, idNode:any|null}}
 */
function findExportInfo(sf) {
  /** @type {string|null} */
  let exportName = null;
  let exportExpr = null;
  for (const stmt of sf.statements) {
    if (ts.isExportAssignment(stmt)) {
      const expr = stmt.expression;
      if (ts.isIdentifier(expr)) {
        exportName = expr.getText(sf);
      }
      exportExpr = expr;
      continue;
    }
    if ((ts.isClassDeclaration(stmt) || ts.isFunctionDeclaration(stmt)) && stmt.modifiers) {
      const hasExport = stmt.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      const hasDefault = stmt.modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
      if (hasExport && hasDefault) {
        if (stmt.name && ts.isIdentifier(stmt.name)) {
          exportName = stmt.name.getText(sf);
          exportExpr = stmt.name;
        } else {
          exportExpr = stmt;
        }
      }
    }
  }

  let idNode = null;
  /** @param {ts.Node} node */
  const findId = (node) => {
    if (ts.isIdentifier(node) && node.getText(sf) === exportName) {
      idNode = node;
      return;
    }
    ts.forEachChild(node, findId);
  };

  if (exportName) {
    findId(sf);
  } else if (exportExpr) {
    idNode = exportExpr;
  }

  return { exportName, exportExpr, idNode };
}

/** @type {ts.Program} */
let typescriptProgram = null;

/** @return {ts.Program} */
function getTypescriptProgram() {
  if (!typescriptProgram) {
    const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
    const conf = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(conf.config, ts.sys, path.dirname(tsconfigPath));
    const rootFiles = parsed.fileNames;
    const options = parsed.options;
    typescriptProgram = ts.createProgram(rootFiles, options);
  }
  return typescriptProgram;
}

/** @type {ts.TypeChecker} */
let typescriptChecker = null;
/** @return {ts.TypeChecker} */
function getTypeChecker() {
  if (!typescriptChecker) {
    const program = getTypescriptProgram();
    typescriptChecker = program.getTypeChecker();
  }
  return typescriptChecker;
}

/**
 * Resolve a symbol from a potentially-chained export expression (eg `Box.extend().mixin(...)`).
 * Walks call/property access chains to find the left-most identifier and returns
 * the resolved (aliased) symbol when possible.
 * @param {ts.Expression|null} expr
 * @return {ts.Symbol|null}
 */
function resolveSymbolFromExpression(expr) {
  if (!expr) return null;
  const checker = getTypeChecker();
  /** @param {ts.Node} node */
  const walk = (node) => {
    if (!node) return null;
    if (ts.isParenthesizedExpression(node)) return walk(node.expression);
    if (ts.isCallExpression(node)) return walk(node.expression);
    if (ts.isPropertyAccessExpression(node)) return walk(node.expression);
    if (ts.isIdentifier(node)) {
      let s = checker.getSymbolAtLocation(node);
      if (!s) return null;
      // eslint-disable-next-line no-bitwise
      if (s.flags & ts.SymbolFlags.Alias) {
        s = checker.getAliasedSymbol(s);
      }
      return s;
    }
    return null;
  };
  return walk(expr);
}

/**
 * Find the left-most identifier under a node (reused by several heuristics).
 * @param {ts.Node|null} node
 * @return {ts.Identifier|null}
 */
function resolveLeftMostIdentifier(node) {
  if (!node) return null;
  if (ts.isParenthesizedExpression(node)) return resolveLeftMostIdentifier(node.expression);
  if (ts.isCallExpression(node)) return resolveLeftMostIdentifier(node.expression);
  if (ts.isPropertyAccessExpression(node)) return resolveLeftMostIdentifier(node.expression);
  if (ts.isIdentifier(node)) return node;
  /** @type {ts.Identifier|null} */
  let found = null;
  ts.forEachChild(node, (n) => {
    found ||= resolveLeftMostIdentifier(n);
  });
  return found;
}

/**
 * Determine whether `ancestor` contains `target` anywhere in its subtree.
 * @param {ts.Node} ancestor
 * @param {ts.Node} target
 * @return {boolean}
 */
function containsNode(ancestor, target) {
  let found = false;
  /** @param {ts.Node} n */
  const walk = (n) => {
    if (found) return;
    if (n === target) {
      found = true;
      return;
    }
    ts.forEachChild(n, walk);
  };
  walk(ancestor);
  return found;
}

/**
 * Trace the origin of a parameter-like identifier used in nested fluent factories.
 * If the identifier is declared as a function parameter (eg `Base` in `(Base) => class extends Base {}`),
 * attempt to locate the CallExpression that supplies that parameter and resolve the callee's symbol.
 * This loops a few times to unwind simple nested wrappers (A => B => C patterns).
 * @param {ts.Identifier} idNode
 * @return {ts.Symbol|null}
 */
function traceParameterOrigin(idNode) {
  if (!idNode) return null;
  let curId = idNode;
  const maxDepth = 6;
  for (let depth = 0; depth < maxDepth; depth++) {
    // Is this identifier the name of a parameter?
    const curIdSnapshot = curId;
    // find parameter ancestor matching this identifier name without creating
    // a predicate closure (avoids function-in-loop lint errors)
    /** @type {any|null} */
    let param = null;
    /** @type {ts.Node|null} */
    let cur = curId;
    while (cur) {
      if (ts.isParameter(cur)
          && cur.name && cur.name === curIdSnapshot
          && ts.isIdentifier(cur.name)) {
        param = cur;
        break;
      }
      cur = cur.parent;
    }
    if (!param) break;
    /** @type {ts.FunctionExpression | ts.ArrowFunction | ts.FunctionDeclaration | null} */
    const func = param.parent; // FunctionExpression | ArrowFunction | FunctionDeclaration
    if (!func) break;

    // Find a CallExpression ancestor that passes this function as an argument
    /** @type {ts.CallExpression|null} */
    let call = null;
    /** @type {ts.Node|null} */
    let cur2 = func;
    while (cur2) {
      if (ts.isCallExpression(cur2)
        && Array.from(cur2.arguments || []).some((a) => a === func || containsNode(a, func))) {
        call = cur2;
        break;
      }
      cur2 = cur2.parent;
    }
    if (!call) break;

    const callee = call.expression;
    // Try to resolve callee's symbol first via typechecker
    const sym = resolveSymbolFromExpression(callee);
    if (sym) return sym;

    // If typechecker didn't help, try to get the left-most identifier under the callee
    const left = resolveLeftMostIdentifier(callee);
    if (!left || left === curId) break;
    // If left-most identifier points to another parameter, continue loop to trace further
    curId = left;
  }
  return null;
}

/**
 * Search for any ClassExpression/ClassDeclaration nodes under a node
 * and return the first `extends` expression found (or null).
 * @param {ts.Node|null} node
 * @return {ts.Expression|null}
 */
function findClassExtends(node) {
  if (!node) return null;
  /** @type {ts.Expression|null} */
  let found = null;
  /** @param {ts.Node} n */
  const walk = (n) => {
    if (!n || found) return;
    if (ts.isClassExpression(n) || ts.isClassDeclaration(n)) {
      for (const h of (n.heritageClauses || [])) {
        if (h.token === ts.SyntaxKind.ExtendsKeyword) {
          for (const t of h.types) {
            found = t.expression || null;
            if (found) return;
          }
        }
      }
    }
    ts.forEachChild(n, walk);
  };
  walk(node);
  return found;
}

/**
 * @param {ts.Symbol} symbol
 * @return {string}
 */
function docToString(symbol) {
  return ts.displayPartsToString(symbol.getDocumentationComment(getTypeChecker()));
}

/**
 * Normalize a runtime/member-kind string into the CEM member kind union.
 * Accept any incoming string from runtime captures (loose) and coerce
 * it into the narrower union required by the manifest.
 * @param {string} kind
 * @return {'field'|'method'}
 */
function normalizeMemberKind(kind) {
  switch (kind) {
    case 'getter':
    case 'setter':
      return 'field';
    case 'constructor':
      return 'method';
    case 'method':
    case 'field':
      return kind;
    default:
      throw new Error(`unknown member kind: ${kind}`);
  }
}

/**
 * Run an array of async task factories with a concurrency limit.
 * @template T
 * @param {Array<() => Promise<T>>} tasks
 * @param {number} concurrency
 */
async function runWithConcurrency(tasks, concurrency) {
  /**
   * @type {T[]}
   */
  const results = [];
  let nextIndex = 0;
  /** @return {Promise<void>} */
  const worker = async () => {
    while (nextIndex < tasks.length) {
      const idx = nextIndex++;
      // eslint-disable-next-line no-await-in-loop
      results[idx] = await tasks[idx]();
    }
  };
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * Helper to determine whether a given type (instance or constructor return)
 * extends or is assignable to `HTMLElement` or our `CustomElement` base.
 * This is deliberately conservative: if we cannot determine it, assume
 * it's not a custom element and skip runtime capture.
 * @param {ts.Type | null} t
 * @return {boolean}
 */
function typeLooksLikeCustomElement(t) {
  if (!t) return false;
  const seen = new Set();
  /** @param {ts.Type} cur */
  const walk = (cur) => {
    if (!cur || seen.has(cur)) return false;
    seen.add(cur);
    // Try to inspect symbol name first
    const n = cur.getSymbol?.()?.getName();

    if (n === 'HTMLElement' || n === 'CustomElement') {
      if (VERBOSE) {
        console.log(`[manifest] typeLooksLikeCustomElement: found matching base type ${n}`);
      }
      return true;
    }
    // Some constructor/`typeof` shapes may expose the instance type via
    // call/construct signatures. Check base types as well.

    const bases = cur.getBaseTypes?.() || [];
    for (const b of bases) {
      if (walk(b)) return true;
    }

    // If this is a union/intersection, check constituent types
    if (cur.isUnionOrIntersection()) {
      for (const p of cur.types || []) {
        if (walk(p)) return true;
      }
    }
    return false;
  };
  return walk(t);
}

/**
 * Build a CEM Reference from a TypeScript symbol if it originates
 * from a project module or from lib.dom (HTMLElement).
 * @param {ts.Symbol|null|undefined} sym
 * @return {CEMElement['superclass']|null}
 */
function referenceFromSymbol(sym) {
  if (!sym) return null;
  // unwrap aliases
  // eslint-disable-next-line no-bitwise
  if (sym.flags & ts.SymbolFlags.Alias) {
    // eslint-disable-next-line no-param-reassign
    sym = getTypeChecker().getAliasedSymbol(sym);
  }

  const decls = sym.getDeclarations?.() || [];
  const [decl] = decls;
  if (!decl) return null;
  const sf = decl.getSourceFile?.();
  if (!sf || !sf.fileName) return null;
  const fn = sf.fileName;
  if (VERBOSE) {
    console.log(`[manifest] referenceFromSymbol: symbol=${sym.getName()} file=${fn}`);
  }
  // prefer declared/real class name when available
  let displayName = sym.getName();
  for (const d of decls) {
    if (ts.isClassDeclaration(d) && d.name) {
      displayName = d.name.getText();
      break;
    }
    if (ts.isFunctionDeclaration(d) && d.name) {
      displayName = d.name.getText();
      break;
    }
    if (ts.isVariableDeclaration(d) && d.name && ts.isIdentifier(d.name)) {
      displayName = d.name.getText();
      break;
    }
  }
  if (fn.includes('lib.dom')) {
    return { module: 'global:', name: displayName };
  }
  const rel = path.relative(process.cwd(), fn).split(path.sep).join('/');
  return { module: rel, name: displayName };
}

/**
 * Attempt to find a class/constructor symbol from a potentially
 * `typeof`/constructor/intersection/union type shape. Returns the
 * underlying constructor/class symbol when possible.
 * @param {ts.Type|null} t
 * @return {ts.Symbol|null}
 */
function resolveCtorSymbolFromType(t) {
  if (!t) return null;
  const seen = new Set();
  /**
   * @param {ts.Type} cur
   * @return {ts.Symbol|null}
   */
  const walk = (cur) => {
    if (!cur || seen.has(cur)) return null;
    seen.add(cur);

    // If this type has construct signatures, use the return type's symbol

    const sigs = cur.getConstructSignatures();
    if (sigs.length) {
      const ret = sigs[0].getReturnType();
      const s = ret.getSymbol?.();
      if (s) {
        if (VERBOSE) {
          console.log(`[manifest] resolveCtorSymbolFromType: found return symbol ${s.getName()}`);
        }
        return s;
      }
    }

    // If the type itself has a symbol pointing to a class/variable, prefer it

    const sym = cur.getSymbol?.();
    if (sym) {
      const decls = sym.getDeclarations?.() || [];
      for (const d of decls) {
        if (ts.isClassDeclaration(d)
          || ts.isClassExpression(d)
          || ts.isVariableDeclaration(d)
          || ts.isFunctionDeclaration(d)) {
          if (VERBOSE) {
            console.log(`[manifest] resolveCtorSymbolFromType: candidate symbol ${sym.getName()} from declaration ${d.getSourceFile().fileName}`);
          }
          return sym;
        }
      }
    }

    // For unions/intersections, inspect constituents
    if (cur.isUnionOrIntersection()) {
      for (const p of (cur.types || [])) {
        const r = walk(p);
        if (r) return r;
      }
    }

    // Try prototype property -> its type's symbol
    const protoProp = cur.getProperty?.('prototype');
    if (protoProp) {
      const protoType = getTypeChecker().getTypeOfSymbolAtLocation(protoProp, protoProp.valueDeclaration);
      const s2 = protoType.getSymbol?.();
      if (s2) return s2;
    }

    // Walk base types if available
    const bases = cur.getBaseTypes?.() || [];
    for (const b of bases) {
      const r = walk(b);
      if (r) return r;
    }
    return null;
  };
  return walk(t);
}

/**
 * Resolve an export's instance type and constructor-derived instance type.
 * @param {ts.Symbol|null} sym
 * @param {ts.Type|null} type
 * @param {ts.Node|null} idNode
 * @return {{instanceType:ts.Type|null, ctorInstanceType:ts.Type|null}}
 */
function resolveInstanceAndCtor(sym, type, idNode) {
  const ctorInstanceType = type?.getConstructSignatures()?.[0]?.getReturnType();
  let instanceType = ctorInstanceType;
  if (!instanceType && sym) {
    const protoSym = sym.members?.get(/** @type {any} */ ('prototype'));
    if (protoSym) {
      instanceType = getTypeChecker().getTypeOfSymbolAtLocation(protoSym, protoSym.valueDeclaration || idNode);
    }
  }
  return { instanceType, ctorInstanceType };
}

/**
 * Compute the CEM superclass reference for an export using TypeScript
 * analysis. Prefer instance base types, then constructor/`typeof` shapes,
 * and finally fall back to the constructor symbol itself when available.
 * Returns a CEM `superclass` reference or `null` when not determinable.
 * @param {string} name
 * @param {ts.Type|null} instanceType
 * @param {ts.Type|null} type
 * @param {ts.Node|null} idNode
 * @param {ts.Node|null} exportExpr
 * @param {ts.SourceFile|null} sf
 * @param {string|null} src
 * @return {CEMElement['superclass']|null}
 */
function computeSuperclassRef(name, instanceType, type, idNode, exportExpr, sf, src) {
  let superclassRef = null;
  const checker = getTypeChecker();

  // Early heuristic (probe-style): attempt to resolve the left-most
  // identifier from the export expression and unwrap aliases via the
  // TypeScript checker. If this yields an externally-declared symbol
  // (not the project's generic CustomElement and not a self-reference),
  // prefer it immediately — this mirrors `probe-extends.js` behavior and
  // avoids later AST fallbacks clobbering a correct import binding.

  if (exportExpr && sf) {
    const leftId = resolveLeftMostIdentifier(exportExpr);
    if (leftId) {
      const sym = checker.getSymbolAtLocation(leftId);
      if (sym) {
        // eslint-disable-next-line no-bitwise
        const actual = (sym.flags & ts.SymbolFlags.Alias)
          ? checker.getAliasedSymbol(sym)
          : sym;
        const ref = referenceFromSymbol(actual);
        if (ref?.module) {
          // eslint-disable-next-line no-use-before-define
          const customBasePath = getCustomElementRelativePath();
          const currentRel = src ? path.relative(process.cwd(), src).split(path.sep).join('/') : null;
          if (ref.module !== customBasePath && ref.module !== currentRel) {
            superclassRef = ref;
            if (VERBOSE) {
              console.log('[manifest]', name, 'early left-most-id resolved superclass to', ref);
            }
            return superclassRef;
          }
        }
      }
    }
    // If the left-most identifier did not yield an external resolved symbol,
    // try tracing parameter origins for fluent factory patterns like
    // `(Base) => class extends Base {}` where `Base` is a parameter handed
    // to a call expression. This will unwind simple nested wrappers.
    if (leftId) {
      const tracedSym = traceParameterOrigin(leftId);
      if (tracedSym) {
        // eslint-disable-next-line no-bitwise
        const actual2 = (tracedSym.flags & ts.SymbolFlags.Alias)
          ? checker.getAliasedSymbol(tracedSym)
          : tracedSym;
        const ref2 = referenceFromSymbol(actual2);
        if (ref2?.module) {
          // eslint-disable-next-line no-use-before-define
          const customBasePath2 = getCustomElementRelativePath();
          const currentRel2 = src ? path.relative(process.cwd(), src).split(path.sep).join('/') : null;
          if (ref2.module !== customBasePath2 && ref2.module !== currentRel2) {
            superclassRef = ref2;
            if (VERBOSE) {
              console.log('[manifest]', name, 'traced parameter-origin superclass to', ref2);
            }
            return superclassRef;
          }
        }
      }
    }
  }

  // 1) If we have an instance type, prefer its base types
  if (instanceType) {
    const bases = instanceType.getBaseTypes?.() || [];
    if (VERBOSE) {
      console.log(`[manifest] ${name}: instanceType has ${bases.length} base(s)`);
    }
    for (const b of bases) {
      const symb = b.getSymbol?.();
      if (VERBOSE) {
        console.log(`[manifest] ${name}: instance base symbol=${symb?.getName()}`);
      }
      const ref = referenceFromSymbol(symb);
      if (ref) {
        superclassRef = ref;
        break;
      }
    }
  }

  // 2) If not found, try to resolve a constructor/class symbol from
  // the exported `type` (covers `typeof T & ...` shapes)
  if (!superclassRef) {
    const ctorSym = resolveCtorSymbolFromType(type);
    if (VERBOSE && ctorSym) {
      const decls = ctorSym.getDeclarations?.() || [];
      console.log(`[manifest] ${name}: ctorSym=${ctorSym.getName()} decls=${decls.map((d) => d.getSourceFile().fileName).join(',')}`);
    }
    if (ctorSym) {
      const ctorType = getTypeChecker().getTypeOfSymbolAtLocation(ctorSym, ctorSym.valueDeclaration || idNode);
      const bases = ctorType.getBaseTypes?.() || [];
      for (const b of bases) {
        const symb = b.getSymbol?.();
        const ref = referenceFromSymbol(symb);
        if (ref) {
          superclassRef = ref;
          break;
        }
      }

      // If still not found, use the constructor symbol itself as the
      // declared superclass (this covers `export default CustomElement`)
      if (!superclassRef) {
        const ref = referenceFromSymbol(ctorSym);
        if (ref) {
          superclassRef = ref;
        }
      }
    }
  }

  return superclassRef;
}

/**
 * Resolve a module path to a concrete file in the project (tries variants).
 * @param {string} mod
 * @return {string|null}
 */
function resolveModulePath(mod) {
  if (!mod) return null;
  const candidate = path.resolve(process.cwd(), mod);
  const tryPaths = [candidate, `${candidate}.js`, `${candidate.replace(/\.js$/, '')}.js`];
  for (const p of tryPaths) {
    if (ts.sys.fileExists(p)) return p;
  }
  return null;
}

/**
 * Convert a module path to a relative path from the project root.
 * @param {string} modulePath
 * @return {string}
 */
function getRelativeModulePath(modulePath) {
  const resolved = resolveModulePath(modulePath || '');
  return resolved
    ? path.relative(process.cwd(), resolved).split(path.sep).join('/')
    : (modulePath || '');
}

/** @type {string|null|false} */
let cachedCustomElementPath = null;

/**
 * Get the relative path to the project's CustomElement base class.
 * Cached for performance.
 * @return {string|null}
 */
function getCustomElementRelativePath() {
  if (cachedCustomElementPath === null) {
    const resolved = resolveModulePath('core/CustomElement.js');
    cachedCustomElementPath = resolved
      ? path.relative(process.cwd(), resolved).split(path.sep).join('/')
      : false; // use false to distinguish from null (not cached yet)
  }
  return cachedCustomElementPath || null;
}

/**
 * Check if a mixin reference should be skipped (HTMLElement, CustomElement, or self-reference).
 * @param {{module?:string, name?:string}} ref
 * @param {string} relativeModule
 * @param {string} name
 * @param {string} currentModule
 * @param {string} currentName
 * @return {boolean}
 */
function shouldSkipMixinReference(ref, relativeModule, name, currentModule, currentName) {
  // Skip global HTMLElement
  if (ref.module === 'global:' && ref.name === 'HTMLElement') return true;

  // Skip CustomElement base
  const customElementPath = getCustomElementRelativePath();
  if (customElementPath && relativeModule === customElementPath) return true;

  // Skip self-references
  if (relativeModule === currentModule && name === currentName) return true;

  return false;
}

/**
 * Get the ts.SourceFile for a CEM-style reference returned by `referenceFromSymbol`.
 * @param {{module?:string,package?:string,name?:string}} ref
 * @return {ts.SourceFile|null}
 */
function getSourceFileForRef(ref) {
  if (!ref || ref.package) return null;
  const file = resolveModulePath(ref.module);
  if (!file) return null;
  const program = getTypescriptProgram();
  return program.getSourceFile(file) || program.getSourceFile(path.resolve(file));
}

/**
 * @param {ts.Type} t
 * @param { Map<string, CEMReference> } discovered
 */
function walkTypeForSymbols(t, discovered = new Map()) {
  if (!t) return discovered;
  // If this type has construct signatures, inspect its bases/return
  const ctorSym = resolveCtorSymbolFromType(t);
  if (ctorSym) {
    const ref = referenceFromSymbol(ctorSym);
    if (ref?.module) {
      discovered.set(`${ref.module}::${ref.name}`, ref);
    }
  }
  const sym = t.getSymbol?.();
  if (sym) {
    const ref2 = referenceFromSymbol(sym);
    if (ref2?.module) {
      discovered.set(`${ref2.module}::${ref2.name}`, ref2);
    }
  }
  if (t.isUnionOrIntersection()) {
    for (const st of t.types || []) {
      walkTypeForSymbols(st, discovered);
    }
  }
  for (const b of t.getBaseTypes?.() || []) {
    walkTypeForSymbols(b, discovered);
  }
  return discovered;
}

/**
 * Collect `.mixin(...)`-style arguments from a chained export expression.
 * Uses the TypeScript checker to detect mixin-like call arguments (functions
 * whose return type looks like a constructor/class).
 * @param {ts.Node} expr
 * @return {CEMReference[]}
 */
function collectMixins(expr) {
  /** @type {CEMReference[]} */
  const out = [];
  if (!expr) return out;
  // If the export is a function that returns a chained expression
  // (eg `export default function(Base) { return Base.mixin(...).observe(...) }`)
  // prefer the returned expression for mixin collection.
  if (ts.isFunctionDeclaration(expr) || ts.isFunctionExpression(expr) || ts.isArrowFunction(expr)) {
    const body = expr.body;
    if (body && ts.isBlock(body)) {
      for (const stmt of body.statements) {
        if (ts.isReturnStatement(stmt) && stmt.expression) {
          expr = stmt.expression;
          break;
        }
      }
    } else if (body) {
      // arrow function with expression body
      expr = body;
    }
  }
  const checker = getTypeChecker();
  let cur = expr;
  while (cur && (
    ts.isCallExpression(cur)
    || ts.isPropertyAccessExpression(cur)
    || ts.isParenthesizedExpression(cur)
    || ts.isTaggedTemplateExpression(cur)
  )) {
    if (ts.isParenthesizedExpression(cur)) {
      cur = cur.expression;
      continue;
    }
    if (ts.isTaggedTemplateExpression(cur)) {
      cur = cur.tag;
      continue;
    }
    if (ts.isCallExpression(cur)) {
      for (const a of cur.arguments) {
        let isMixin = false;

        const atype = checker.getTypeAtLocation(a);
        const callSigs = atype.getCallSignatures?.() || [];
        if (callSigs.length) {
          const ret = callSigs[0].getReturnType();
          if (resolveCtorSymbolFromType(ret) || (ret.getConstructSignatures && ret.getConstructSignatures().length)) {
            isMixin = true;
          }
        }

        if (isMixin) {
          const symRef = resolveSymbolFromExpression(a);
          const ref = referenceFromSymbol(symRef);
          if (ref) {
            out.push(ref);
          } else {
            console.warn(`[manifest] collectMixins: unable to build reference from mixin argument: ${a.getText()}`);
          }
        }
      }
      cur = cur.expression;
      continue;
    }
    if (ts.isPropertyAccessExpression(cur)) {
      cur = cur.expression;
      continue;
    }
    break;
  }
  return out;
}

/**
 * Synthesize a minimal mixin declaration from a CEM-style ref using the TS checker.
 * The result is conservative: `parameters`, `return.type`, `members` and
 * nested `mixins` will be included only when statically discoverable.
 * @param {{module?:string,package?:string,name?:string}} ref
 * @param {Set<string>} [seen]
 * @return {Promise<CEMElementMixin|null>}
 */
async function buildMixinDeclarationFromRef(ref, seen = new Set()) {
  if (!ref) return null;
  const key = `${ref.module}::${ref.name}`;
  if (seen.has(key)) return { kind: 'mixin', name: ref.name || '<unknown>', customElement: true };
  seen.add(key);

  /** @type {CEMElementMixin} */
  const decl = {
    kind: 'mixin',
    customElement: true,
    name: ref.name || 'default',
    parameters: [],
    return: { type: { text: '' } },
    members: [],
    mixins: [],
    // CEM SourceReference uses absolute GitHub URLs
    source: { href: ref.module ? `https://github.com/clshortfuse/materialdesignweb/blob/main/${ref.module}` : '' },
  };

  if (ref.package === 'global:') {
    decl.return.type.text = String(ref.name || '');
    return decl;
  }

  // If we can resolve a concrete module file for this ref, ensure
  // the module is generated/loaded into `moduleByFile` so it will be
  // included in the final schema output.
  if (ref && ref.module) {
    const mixinPath = resolveModulePath(ref.module);
    if (mixinPath) {
      // ensure the mixin's module is generated/registered
      // eslint-disable-next-line no-await-in-loop, no-use-before-define
      await getModuleForFile(mixinPath);
    }
  }

  const srcSf = getSourceFileForRef(ref);
  if (!srcSf) return decl;

  const exportInfo = findExportInfo(srcSf);
  const exportExprLocal = exportInfo.exportExpr;
  const exportIdNode = exportInfo.idNode;
  const exportName = exportInfo.exportName;

  // Try to extract the actual function name from the export expression or export name
  if (exportName && exportName !== 'default') {
    decl.name = exportName;
  } else if (exportExprLocal && ts.isFunctionDeclaration(exportExprLocal) && exportExprLocal.name) {
    decl.name = exportExprLocal.name.getText(srcSf);
  }

  // Prefer resolving the identifier node (if present), fallback to the export expression
  const exportSym = (exportIdNode && resolveSymbolFromExpression(exportIdNode))
    || (exportExprLocal && resolveSymbolFromExpression(exportExprLocal)) || null;
  if (exportSym) {
    const mixinDoc = docToString(exportSym);
    if (mixinDoc) {
      decl.description = mixinDoc;
    }
  }

  const checker = getTypeChecker();
  const mixType = exportExprLocal ? checker.getTypeAtLocation(exportExprLocal) : null;
  let _retTypeForDetection = null;
  if (mixType) {
    const callSigs = mixType.getCallSignatures?.() || [];
    if (callSigs.length) {
      const [sig] = callSigs;
      for (const p of sig.parameters) {
        const pname = p.getName();
        let ptype = '';
        const pdecl = p.valueDeclaration;
        const t = pdecl ? checker.getTypeOfSymbolAtLocation(p, pdecl) : null;
        ptype = t ? checker.typeToString(t) : '';

        decl.parameters.push({ name: pname, type: { text: ptype } });
      }
      decl.return.type.text = checker.typeToString(callSigs[0].getReturnType());
      _retTypeForDetection = callSigs[0].getReturnType();
    }
  }

  // collect nested mixins
  // Prepare a merged members map so nested mixin members can seed
  // the parent mixin's members (deduplicated by name+static flag).
  const mergedMembers = new Map();
  // collect nested mixins (hoisted so capture logic can reference it)
  const nested = collectMixins(exportExprLocal);
  if (nested.length) {
    for (const n of nested) {
      // eslint-disable-next-line no-await-in-loop
      const child = await buildMixinDeclarationFromRef(n, seen);
      if (child // Do NOT add nested mixins to `decl.mixins` here. The parent mixin
          // should not "report" its children as separate mixin references
          // (we still include their members below by seeding `mergedMembers`).
          && child.members) {
        for (const cm of child.members) {
          const memberKey = `${cm.name}::${cm.static ? 's' : 'i'}`;
          if (!mergedMembers.has(memberKey)) {
            mergedMembers.set(memberKey, cm);
          }
        }
      }
    }
  }

  // If no nested mixins were discoverable via the export expression, attempt
  // to detect applied mixins from the mixin's return type using TypeScript
  // symbols. This is TS-symbol-driven (no import-text scanning) and helps
  // catch cases where the mixin application is expressed via type-level
  // intersections/`Class<>` shapes.
  if (!decl.mixins?.length && _retTypeForDetection) {
    const discovered = walkTypeForSymbols(_retTypeForDetection);
    const currentRelForSelfCheck = getRelativeModulePath(ref.module);
    for (const childRef of discovered.values()) {
      // Normalize to project-relative path
      const rf = { module: childRef.module, name: childRef.name };
      const nm = normalizeExportName(rf.name);
      const relChild = getRelativeModulePath(rf.module);
      // Skip HTMLElement, CustomElement base, and self-references
      if (shouldSkipMixinReference(rf, relChild, nm, currentRelForSelfCheck, decl.name)) continue;
      // Avoid adding duplicates
      if (!decl.mixins.some((m) => m.module === relChild && m.name === nm)) {
        decl.mixins.push({ module: relChild, name: nm });
      }
    }
  }
  // Include nested mixin references in the parent's `mixins` list so the
  // synthesized mixin declaration records its applied mixins.
  if (nested.length) {
    const currentRelForSelfCheck = getRelativeModulePath(ref.module);
    for (const n of nested) {
      const nm = normalizeExportName(n.name);
      const relChild = getRelativeModulePath(n.module);
      // Skip HTMLElement, CustomElement base, and self-references
      if (shouldSkipMixinReference(n, relChild, nm, currentRelForSelfCheck, decl.name)) continue;
      // Normalize module path to project-relative form (matches module `path` entries)
      decl.mixins.push({ module: relChild, name: nm });
    }
  }

  // Attempt to capture prototype/static members for the mixin by
  // executing the mixin factory in a safe Playwright page with a
  // minimal dummy base class. This avoids instantiating elements and
  // lets us observe what the mixin adds to the returned class' prototype
  // and static properties. Be conservative: if capture fails, continue.
  const mixinPath = resolveModulePath(ref.module || '');
  if (mixinPath && sharedContext) {
    // eslint-disable-next-line no-await-in-loop
    const mixRuntime = await captureMixinMetadata(mixinPath);
    if (mixRuntime) {
      const tsExports = collectTsExports(srcSf);

      // Allowed declaration files: start with the mixin module itself
      // and include any nested mixin module files. Members whose TS
      // declarations do not originate from these files (or lib.dom)
      // are considered inherited/superclass items and will be filtered
      // out.
      const allowedDeclFiles = new Set();
      if (mixinPath) {
        allowedDeclFiles.add(path.resolve(mixinPath));
      }

      for (const n of nested) {
        if (n.module) {
          const nf = resolveModulePath(n.module);
          if (nf) {
            allowedDeclFiles.add(path.resolve(nf));
          }
        }
      }

      // Best-effort: attempt to derive types for prototype and static
      // members using the TypeScript checker and the mixin's return type.
      /** @type {Record<string,string>} */
      const derivedTypes = Object.create(null);
      /** @type {Record<string,{path:string,line:number}|null>} */
      const derivedSources = Object.create(null);
      const skippedPrototype = new Set();
      const skippedStatic = new Set();
      // Pre-create CustomElement property name sets so they are available
      // to the runtime-merge loops even if TS inspection fails.
      const ceInstanceProps = new Set();
      const ceStaticProps = new Set();
      const cePath = resolveModulePath('core/CustomElement.js');
      if (cePath) {
        const ceSf = getTypescriptProgram().getSourceFile(cePath)
              || getTypescriptProgram().getSourceFile(path.resolve(cePath));
        if (ceSf) {
          const ceInfo = findExportInfo(ceSf);
          if (ceInfo.exportExpr) {
            const ceType = checker.getTypeAtLocation(ceInfo.exportExpr);
            const ceResolved = resolveInstanceAndCtor(
              resolveSymbolFromExpression(ceInfo.exportExpr),
              ceType,
              ceInfo.idNode,
            );
            if (ceResolved.instanceType) {
              for (const p of ceResolved.instanceType.getProperties()) {
                ceInstanceProps.add(p.getName());
              }
            }
            if (ceResolved.ctorInstanceType) {
              for (const p of ceResolved.ctorInstanceType.getProperties()) {
                ceStaticProps.add(p.getName());
              }
            }
          }
        }
      }
      const mixinReturnType = exportExprLocal ? checker.getTypeAtLocation(exportExprLocal) : null;
      if (mixinReturnType) {
        const callSigs = mixinReturnType.getCallSignatures?.() || [];
        if (callSigs && callSigs.length) {
          const retType = callSigs[0].getReturnType();

          // Instance type: prefer constructed instance type if return is a constructor,
          // otherwise try to read the `.prototype` property's type.
          let instanceType = null;
          const constructSigs = retType.getConstructSignatures?.() || [];
          if (constructSigs && constructSigs.length) {
            instanceType = constructSigs[0].getReturnType();
          } else {
            const protoSym = retType.getProperty ? retType.getProperty('prototype') : null;
            if (protoSym) {
              const [protoDecl = null] = protoSym.getDeclarations?.() || [];
              instanceType = protoDecl ? checker.getTypeOfSymbolAtLocation(protoSym, protoDecl) : null;
            }
          }

          // Path to the project's CustomElement for exclusion checks (used by both loops below)
          const mixinCEPath = resolveModulePath('core/CustomElement.js');

          // For prototype members, inspect the instance type
          if (instanceType) {
            for (const [mname] of mixRuntime.prototypeMembers.entries()) {
              const propSym = checker.getPropertyOfType(instanceType, mname) || instanceType.getProperty?.(mname);
              if (!propSym) {
                skippedPrototype.add(mname);
                continue;
              }
              const decls = propSym.getDeclarations?.() || [];
              const [memberDecl] = decls;
              const declFile = memberDecl?.getSourceFile?.()?.fileName;
              if (!declFile) {
                skippedPrototype.add(mname);
                continue;
              }
              const resolved = path.resolve(declFile);
              if (declFile.includes('lib.dom')) {
                skippedPrototype.add(mname);
                continue;
              }
              if (mixinCEPath
                      && !allowedDeclFiles.has(resolved)
                      && path.resolve(declFile) === path.resolve(mixinCEPath)) {
                skippedPrototype.add(mname);
                continue;
              }
              if (!allowedDeclFiles.has(resolved)) {
                skippedPrototype.add(mname);
                continue;
              }
              const pType = checker.getTypeOfSymbolAtLocation(propSym, memberDecl || srcSf);
              derivedTypes[mname] = pType ? checker.typeToString(pType) : '';
              derivedSources[mname] = getSourceLocation(memberDecl);
            }
          }

          // For static members, inspect the constructor/returned type itself
          for (const [mname] of mixRuntime.staticMembers.entries()) {
            const staticSym = checker.getPropertyOfType(retType, mname) || retType.getProperty?.(mname);
            if (!staticSym) {
              skippedStatic.add(mname);
              continue;
            }
            const decls = staticSym.getDeclarations?.() || [];
            const [sdecl] = decls;
            const sdeclFile = sdecl?.getSourceFile?.()?.fileName;
            if (!sdeclFile) {
              skippedStatic.add(mname);
              continue;
            }
            const resolved = path.resolve(sdeclFile);
            if (sdeclFile.includes('lib.dom')) {
              skippedStatic.add(mname);
              continue;
            }
            if (mixinCEPath
                  && !allowedDeclFiles.has(resolved)
                  && path.resolve(sdeclFile) === path.resolve(mixinCEPath)) {
              skippedStatic.add(mname);
              continue;
            }
            if (!allowedDeclFiles.has(resolved)) {
              skippedStatic.add(mname);
              continue;
            }
            const sType = checker.getTypeOfSymbolAtLocation(staticSym, sdecl || srcSf);
            derivedTypes[mname] = sType ? checker.typeToString(sType) : '';
            derivedSources[mname] = getSourceLocation(sdecl);
          }
        }
      }

      for (const [mname, kind] of mixRuntime.prototypeMembers.entries()) {
        // Exclude any names that are known to be declared on the project's
        // `CustomElement` base (these are superclass items, not mixin-contributed).
        if (ceInstanceProps?.has?.(mname)) continue;
        if (skippedPrototype.has(mname)) continue;
        // Exclude form-associated lifecycle callbacks (implementation details)
        if (mname === 'formAssociatedCallback'
            || mname === 'formDisabledCallback'
            || mname === 'formResetCallback'
            || mname === 'formStateRestoreCallback') {
          continue;
        }
        const mdoc = tsExports.get(mname);
        // Include when TS export provides a source or when we derived a TS type above
        const hasDerived = Object.prototype.hasOwnProperty.call(derivedTypes, mname)
            && derivedTypes[mname] !== undefined;
        if (!mdoc && !hasDerived) continue;
        const derived = derivedTypes[mname];
        const memberKey = `${mname}::i`;
        if (!mergedMembers.has(memberKey)) {
          const memberKind = normalizeMemberKind(kind);
          const source = sourceLocationToReference(mdoc?.source)
            || sourceLocationToReference(derivedSources[mname]) || undefined;
          const base = {
            name: mname,
            kind: memberKind,
            description: mdoc?.docs || undefined,
            source,
          };
          if (memberKind === 'method') {
            // Represent methods using `return` per CEM schema
            mergedMembers.set(memberKey, { ...base, return: { type: normalizeType(mdoc?.type || derived || 'any') } });
          } else {
            mergedMembers.set(memberKey, { ...base, type: normalizeType(mdoc?.type || derived || 'any') });
          }
        }
      }
      for (const [mname, kind] of mixRuntime.staticMembers.entries()) {
        // Exclude static names copied from CustomElement
        if (ceStaticProps?.has?.(mname)) continue;
        if (skippedStatic.has(mname)) continue;
        // Exclude formAssociated static field (implementation detail)
        if (mname === 'formAssociated') {
          continue;
        }
        const mdoc = tsExports.get(mname);
        const hasDerived = Object.prototype.hasOwnProperty.call(derivedTypes, mname)
            && derivedTypes[mname] !== undefined;
        if (!mdoc && !hasDerived) continue;
        const derived = derivedTypes[mname];
        const memberKey = `${mname}::s`;
        if (!mergedMembers.has(memberKey)) {
          const memberKind = normalizeMemberKind(kind);
          const source = sourceLocationToReference(mdoc?.source)
            || sourceLocationToReference(derivedSources[mname]) || undefined;
          const base = {
            name: mname,
            kind: memberKind,
            static: true,
            description: mdoc?.docs || undefined,
            source,
          };
          if (memberKind === 'method') {
            mergedMembers.set(memberKey, { ...base, return: { type: normalizeType(mdoc?.type || derived || 'any') } });
          } else {
            mergedMembers.set(memberKey, { ...base, type: normalizeType(mdoc?.type || derived || 'any') });
          }
        }
      }
      // Build attribute list for the mixin from runtime attrList
      /** @type {Array<import('custom-elements-manifest').Attribute>} */
      const mixinAttrs = [];

      for (const [a, cfg] of (mixRuntime.attrList || new Map()).entries()) {
        const fieldKey = cfg?.key || camel(a);
        const typeStr = cfg?.type || 'string';
        const docs = tsExports.get(fieldKey)?.docs || null;
        /** @type {import('custom-elements-manifest').Attribute} */
        const attrObj = { name: a, type: normalizeType(typeStr) };
        attrObj.description = docs || undefined;
        attrObj.fieldName = cfg?.key || undefined;
        mixinAttrs.push(attrObj);
      }

      // Ensure the mixin declaration is included in the mixin's module
      // so it appears in the final manifest as a module-level declaration.
      /** @type {CEMModule|null} */
      // eslint-disable-next-line no-use-before-define
      const moduleForMixin = await getModuleForFile(mixinPath);
      if (moduleForMixin?.declarations) {
        // ensure declarations is an array so we can mutate it predictably
        moduleForMixin.declarations = moduleForMixin.declarations ?? [];
        // finalize decl.members from mergedMembers (preserve child-seeded members + mixRuntime additions)
        // Filter out members that were not observed as enumerable at mixin-runtime
        // capture. `mixRuntime.prototypeMembers` / `mixRuntime.staticMembers` are
        // populated from runtime capture and thus indicate enumerability; when
        // `mixRuntime.enumerableProps` exists prefer it. This avoids reporting
        // inherited or non-enumerable properties as mixin-contributed.
        const finalMembers = [];
        for (const m of Array.from(mergedMembers.values())) {
          if (!m || !m.name) continue;
          const mname = String(m.name);
          const seenEnum = (mixRuntime?.enumerableProps?.size > 0)
            ? mixRuntime.enumerableProps.has(mname)
            : (mixRuntime?.prototypeMembers?.has(mname) || mixRuntime?.staticMembers?.has(mname));
          if (!seenEnum) {
            if (VERBOSE) {
              console.log(`[manifest] skipping non-enumerable mixin member ${mname} for mixin ${decl.name}`);
            }
            continue;
          }

          finalMembers.push(m);
        }
        decl.members = finalMembers;
        if (mixinAttrs.length) {
          decl.attributes = mixinAttrs;
        }

        const existing = /** @type {CEMElementMixin|null} */ (moduleForMixin.declarations.find((d) => d.kind === 'mixin' && d.name === decl.name));
        if (existing) {
          existing.parameters ??= decl.parameters;
          existing.return ??= decl.return;
          existing.description ??= decl.description;
          existing.attributes ??= decl.attributes;
          // merge members preferring existing members first, then add any new ones
          /** @type {CEMMember[]} */
          const existingMembers = (existing.members ?? []);
          const existingKeys = new Set(existingMembers.map((m) => `${m.name}::${m.static ? 's' : 'i'}`));
          const merged = existingMembers.slice();
          for (const m of Array.from(mergedMembers.values())) {
            const memberKey = `${m.name}::${m.static ? 's' : 'i'}`;
            if (!existingKeys.has(memberKey)) {
              merged.push(m);
            }
          }
          existing.members = merged;
          // ensure nested mixin refs are present
          existing.mixins = existing.mixins?.length ? existing.mixins : (decl.mixins ?? []);
        } else {
          moduleForMixin.declarations.push(decl);
        }

        // Ensure the mixin module has a default export
        moduleForMixin.exports = moduleForMixin.exports ?? [];
        if (!moduleForMixin.exports.some((e) => e.kind === 'js' && e.name === 'default')) {
          moduleForMixin.exports.push({
            kind: 'js',
            name: 'default',
            declaration: {
              name: decl.name,
              module: moduleForMixin.path,
            },
          });
        }
      }
    }
  }

  // Normalize mixin reference ordering to be innermost-first per CEM spec.
  if (decl.mixins && decl.mixins.length > 1) {
    decl.mixins = decl.mixins.slice().reverse();
  }

  return decl;
}

/**
 * Given a component export expression, synthesize mixin declarations applied to it.
 * @param {ts.Node|null} exportExprLocal
 * @param {ts.SourceFile} sfLocal
 * @return {Promise<Array<CEMElementMixin>>}
 */
/**
 * Given a component export expression, return an array of CEM References
 * pointing to mixin modules applied to the export. The referenced mixin
 * modules will also be synthesized (their module `declarations` updated)
 * via `buildMixinDeclarationFromRef` so consumers can find mixin
 * declarations at module-level.
 * @param {ts.Node|null} exportExprLocal
 * @return {Promise<Array<CEMReference>>}
 */
async function collectMixinDeclarationsFromExport(exportExprLocal) {
  if (!exportExprLocal) return [];
  const found = collectMixins(exportExprLocal);
  /** @type {Array<CEMReference>} */
  const out = [];
  for (const m of found) {
    if (m) {
      // eslint-disable-next-line no-await-in-loop
      const decl = await buildMixinDeclarationFromRef(m, new Set());
      if (decl) {
        if (m.package) {
          out.push({ package: m.package, name: decl.name });
        } else {
          out.push({ module: m.module, name: decl.name });
        }
      }
    }
  }
  // CEM expects mixins listed innermost-first (first `.mixin()` call first).
  // `collectMixins` may return them in the opposite (outermost->innermost)
  // order depending on AST traversal, so normalize here.
  return out.reverse();
}

/**
 * Merge properties discovered from a TypeScript `type` into the
 * `instanceMembersMap` when the export is not a constructor shape.
 * This encapsulates the logic previously in `generateForFile` so the
 * sequencer can call it as a single step.
 * @param {ts.Type} type
 * @param {Map<string, CEMField>} instanceFieldMap
 * @param {Map<string, CEMMethod>} instanceMethodMap
 * @param {RuntimeCaptureResult} runtime
 * @param {Map<string, TSExport>} tsExports
 * @param {ts.Node|null} idNode
 * @param {string} name
 */
function mergePropertiesFromType(type, instanceFieldMap, instanceMethodMap, runtime, tsExports, idNode, name) {
  if (typeof type?.getProperties !== 'function') return;
  for (const p of type.getProperties()) {
    const pname = p.getName();
    if (instanceFieldMap.has(pname) || instanceMethodMap.has(pname)) {
      // Assert match, throw if not
      const existing = instanceFieldMap.get(pname) || instanceMethodMap.get(pname);
      if (existing) {
        const existingKind = existing.kind || 'field';
        const runtimeKind = normalizeMemberKind(runtime.prototypeMembers.get(pname) || 'field');
        if (existingKind !== runtimeKind) {
          throw new Error(`[manifest] member kind mismatch for ${name}.${pname}: manifest=${existingKind} vs runtime=${runtimeKind}`);
        }
      }
      continue;
    }

    if (VERBOSE) {
      console.log(`[manifest] inspecting TS property ${name}.${pname}`);
    }

    const checker = getTypeChecker();
    const pType = checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration || idNode);
    const typeStr = checker.typeToString(pType);
    const decls = (p.getDeclarations() || []);
    const declarations = decls.map((d) => ({ file: d.getSourceFile().fileName, text: d.getText() }));
    // Skip declarations that come from lib.dom (HTMLElement)
    if (declarations.some((d) => d.file?.includes('lib.dom'))) continue;
    // Skip declarations that originate in mixin modules only when the
    // TS-declared member is a method — we want to avoid copying mixin
    // methods onto the component, but keep non-method members (fields,
    // getters/setters) so provenance is discoverable on the component.
    if (declarations.some((d) => d.file?.includes(`${path.sep}mixins${path.sep}`))) {
      const kind = normalizeMemberKind(runtime.prototypeMembers.get(pname) || 'field');
      if (kind === 'method') {
        if (VERBOSE) {
          console.log(`[manifest] skipping TS property ${name}.${pname} declared in mixin file (method)`);
        }
        continue;
      }
    }
    // Do NOT consult runtime.propList here; prefer TypeScript-declared
    // types and exports. runtime.propList was disabled due to instability.
    const docs = docToString(p) || tsExports.get(pname)?.docs || undefined;
    const source = sourceLocationToReference(tsExports.get(pname)?.source) || undefined;
    const chosenType = typeStr || tsExports.get(pname)?.type;
    if (!chosenType) {
      throw new Error(`[manifest] missing type for property ${name}.${pname}; falling back to 'any'`);
    }

    {
      const memberKind = normalizeMemberKind(runtime.prototypeMembers.get(pname) || 'field');

      if (memberKind === 'method') {
        instanceMethodMap.set(pname, {
          name: pname,
          kind: memberKind,
          description: docs || undefined,
          source,
          return: { type: normalizeType(chosenType) },
        });
      } else {
        instanceFieldMap.set(pname, {
          name: pname,
          kind: memberKind,
          description: docs || undefined,
          source,
          type: normalizeType(chosenType),
        });
      }
    }
  }
}

/**
 * Merge properties from an instance type (class/constructor return) into
 * dedicated `instanceFieldMap` and `instanceMethodMap`. This function may
 * perform async lookups of other modules (via `getModuleForFile`) so it is
 * `async` and must be awaited.
 * @param {ts.Type} instanceType
 * @param {Map<string, CEMField>} instanceFieldMap
 * @param {Map<string, CEMMethod>} instanceMethodMap
 * @param {RuntimeCaptureResult} runtime
 * @param {Map<string, TSExport>} tsExports
 * @param {ts.Node|null} idNode
 * @param {string} name
 * @param {string} src
 * @param {CEMElement['superclass']|null} superclassRef
 */
async function mergeInstanceTypeProperties(
  instanceType,
  instanceFieldMap,
  instanceMethodMap,
  runtime,
  tsExports,
  idNode,
  name,
  src,
  superclassRef,
) {
  if (!instanceType) return;
  for (const p of instanceType.getProperties()) {
    const pname = p.getName();
    if (instanceFieldMap.has(pname) || instanceMethodMap.has(pname)) continue;
    const checker = getTypeChecker();
    const pType = checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration || p?.declarations?.[0] || idNode);
    const typeStr = checker.typeToString(pType);
    if (typeStr === 'any') {
      console.warn(`[manifest] property ${name}.${pname} has type 'any'`);
    }
    const docs = docToString(p) || tsExports.get(pname)?.docs || '';
    const decls = (p.getDeclarations() || []);
    const declarations = decls.map((d) => ({ decl: d, file: d.getSourceFile().fileName, text: d.getText() }));
    // Skip instance props that are declared on lib.dom (HTMLElement)
    if (declarations.some((d) => d.file?.includes('lib.dom'))) continue;
    // Skip properties that originate only from the project's CustomElement base
    const customBasePath = getCustomElementRelativePath();
    if (customBasePath && declarations.length) {
      const rels = declarations.map((d) => path.relative(process.cwd(), d.file).split(path.sep).join('/'));
      if (rels.length && rels.every((r) => r === customBasePath)) continue;
    }
    // Skip instance props that are declared in mixin modules only when
    // they are methods. We keep non-method instance members so they can
    // be visible on the component with proper provenance.
    if (declarations.some((d) => d.file?.includes(`${path.sep}mixins${path.sep}`))) {
      const kind = normalizeMemberKind(runtime.prototypeMembers.get(pname) || 'field');
      if (kind === 'method') {
        if (VERBOSE) {
          console.log(`[manifest] skipping TS instance property ${name}.${pname} declared in mixin file (method)`);
        }
        continue;
      }
    }

    if (VERBOSE) {
      console.log(`[manifest] inspecting TS instance property ${name}.${pname}`);
    }
    const lastDeclaration = declarations.at(-1);
    if (declarations.length > 1 && VERBOSE) {
      for (const decl of declarations) {
        console.log(`[manifest] declaration found for ${name}.${pname} in ${decl.file}: ${decl.text.slice(0, 100).replaceAll(/\s+/g, ' ')}...`);
      }
    }

    // Determine source of declaration
    if (path.resolve(lastDeclaration?.file || '') === path.resolve(src)) {
      if (VERBOSE) {
        console.log(`[manifest] declaration for ${name}.${pname} comes from source file`);
      }
    } else {
      // eslint-disable-next-line no-await-in-loop, no-use-before-define
      const sourceCEM = await getModuleForFile(lastDeclaration.file);
      if (sourceCEM.path === superclassRef?.module) {
        if (VERBOSE) {
          console.log(`[manifest] property ${name}.${pname} comes from superclass ${superclassRef.name}`);
        }
        continue;
      }

      if (VERBOSE) {
        console.log(`[manifest] using declaration for ${name}.${pname} (${typeStr}) from ${lastDeclaration.file}`);
        console.log(sourceCEM);
      }
      // Note: mixin handling may be implemented later; for now we record the
      // property using the declaration source when applicable.
    }

    // Do NOT consult runtime.propList here; prefer TypeScript-declared
    // types and exports. runtime.propList was disabled due to instability.
    const chosenType = typeStr || tsExports.get(pname)?.type;
    if (!chosenType) {
      throw new Error(`[manifest] missing type for property ${name}.${pname}; falling back to 'any'`);
    }
    // Prefer explicit TS export source from the component's `tsExports` map.
    // If not present, synthesize a source href referencing the declaration
    // in its originating file (useful when the declaration lives in a mixin).
    let memberSource = sourceLocationToReference(tsExports.get(pname)?.source) || undefined;

    if (!memberSource && lastDeclaration?.decl) {
      memberSource = sourceLocationToReference(getSourceLocation(lastDeclaration.decl));
    }

    {
      const memberKind = normalizeMemberKind(runtime.prototypeMembers.get(pname) || 'field');

      if (memberKind === 'method') {
        instanceMethodMap.set(pname, {
          name: pname,
          kind: memberKind,
          description: docs || undefined,
          source: memberSource || undefined,
          return: { type: normalizeType(chosenType) },
        });
      } else {
        instanceFieldMap.set(pname, {
          name: pname,
          kind: memberKind,
          description: docs || undefined,
          source: memberSource || undefined,
          type: normalizeType(chosenType),
        });
      }
    }
  }
}

/**
 * Merge constructor/typeof-declared properties into a static members map.
 * Mirrors the instance-side merging performed by
 * `mergeInstanceTypeProperties` but marks members as `static: true`.
 * This function may perform async lookups of other modules (via
 * `getModuleForFile`) so it is `async` and must be awaited.
 * @param {ts.Type} ctorType
 * @param {Map<string, CEMMember>} staticMembersMap
 * @param {RuntimeCaptureResult} runtime
 * @param {Map<string, TSExport>} tsExports
 * @param {ts.Node|null} idNode
 * @param {string} name
 * @param {string} src
 * @param {CEMElement['superclass']|null} superclassRef
 */
async function mergeConstructorTypeProperties(
  ctorType,
  staticMembersMap,
  runtime,
  tsExports,
  idNode,
  name,
  src,
  superclassRef,
) {
  if (!ctorType) return;
  for (const p of ctorType.getProperties()) {
    const pname = p.getName();
    if (staticMembersMap.has(pname)) continue;
    const checker = getTypeChecker();
    const pType = checker.getTypeOfSymbolAtLocation(
      p,
      p.valueDeclaration || p?.declarations?.[0] || idNode,
    );
    const typeStr = checker.typeToString(pType);
    const docs = docToString(p) || tsExports.get(pname)?.docs || '';
    const decls = (p.getDeclarations() || []);
    const declarations = decls.map((d) => ({ decl: d, file: d.getSourceFile().fileName, text: d.getText() }));
    // Skip static props declared on lib.dom (HTMLElement constructor)
    if (declarations.some((d) => d.file?.includes('lib.dom'))) continue;
    // Skip static properties that originate only from the project's CustomElement base
    const customBasePath = getCustomElementRelativePath();
    if (customBasePath && declarations.length) {
      const rels = declarations.map((d) => path.relative(process.cwd(), d.file).split(path.sep).join('/'));
      if (rels.length && rels.every((r) => r === customBasePath)) continue;
    }

    if (VERBOSE) {
      console.log(`[manifest] inspecting TS constructor property ${name}.${pname}`);
    }
    const lastDeclaration = declarations.length ? declarations.at(-1) : null;
    if (declarations.length > 1) {
      console.warn(`[manifest] multiple declarations found for ${name}.${pname} (${typeStr}); using last one from ${lastDeclaration?.file}`);
    }

    if (lastDeclaration) {
      // Determine source of declaration
      if (path.resolve(lastDeclaration.file || '') === path.resolve(src)) {
        if (VERBOSE) {
          console.log(`[manifest] declaration for static ${name}.${pname} comes from source file`);
        }
      } else {
        // eslint-disable-next-line no-await-in-loop, no-use-before-define
        const sourceCEM = await getModuleForFile(lastDeclaration.file);
        if (sourceCEM.path === superclassRef?.module) {
          if (VERBOSE) {
            console.log(`[manifest] static property ${name}.${pname} comes from superclass ${superclassRef.name}`);
          }
          continue;
        }
        if (VERBOSE) {
          console.log(`[manifest] using declaration for static ${name}.${pname} (${typeStr}) from ${lastDeclaration.file}`);
        }
      }
    }

    const chosenType = typeStr || tsExports.get(pname)?.type || 'any';
    {
      const memberKind = normalizeMemberKind(runtime.staticMembers.get(pname) || 'field');
      const base = {
        name: pname,
        kind: memberKind,
        static: true,
        description: docs || undefined,
        source: sourceLocationToReference(tsExports.get(pname)?.source) || undefined,
      };
      if (memberKind === 'method') {
        staticMembersMap.set(pname, { ...base, return: { type: normalizeType(chosenType) } });
      } else {
        staticMembersMap.set(pname, { ...base, type: normalizeType(chosenType) });
      }
    }
  }
}

/**
 * Build/merge attributes discovered at runtime into `attributeMap`.
 * Extracted from `generateForFile` so the sequencer can call it.
 * @param {RuntimeCaptureResult} runtime
 * @param {Map<string, TSExport>} tsExports
 * @param {Map<string, CEMAttribute>} attributeMap
 * @param {string} name
 */
function buildAttributeMapFromRuntime(runtime, tsExports, attributeMap, name) {
  for (const [a, cfg] of runtime.attrList.entries()) {
    const key = cfg?.key || camel(a);
    const tsType = tsExports.get(key)?.type;
    const typeStr = tsType || cfg?.type;
    const docs = tsExports.get(key)?.docs || null;

    let fieldName = cfg?.key || cfg?.attr;

    // runtime.propList is disabled; do not attempt to infer a mapping
    // from prop -> attribute at runtime. Leave `fieldName` undefined
    // so attribute-to-field mapping will rely on TypeScript data.
    const usePropList = false;
    if (usePropList) {
      for (const [pname, pcfg] of runtime.propList.entries()) {
        const candidateAttr = (pcfg?.attr || pcfg?.key) || kebab(pname);
        if (candidateAttr === a) {
          fieldName = pname;
          break;
        }
      }
    }

    if (!typeStr) {
      throw new Error(`[manifest] missing type for attribute ${name}.${a}; falling back to 'string'`);
    }

    attributeMap.set(a, {
      name: a,
      description: docs || undefined,
      fieldName: (fieldName !== undefined && fieldName !== null) ? fieldName : undefined,
      type: normalizeType(typeStr),
    });
  }
}

/**
 * Enrich attributes and instance members using runtime data and TS exports.
 * Extracted from `generateForFile` so the sequencer can call it.
 * @param {Map<string, CEMAttribute>} attributeMap
 * @param {Map<string, CEMField>} instanceFieldMap
 * @param {Map<string, CEMMethod>} instanceMethodMap
 * @param {RuntimeCaptureResult} runtime
 * @param {Map<string, TSExport>} tsExports
 * @param {Map<string, CEMMember>} staticMembersMap
 */
function enrichAttributesAndMembers(
  attributeMap,
  instanceFieldMap,
  instanceMethodMap,
  runtime,
  tsExports,
  staticMembersMap,
) {
  for (const [a, cfg] of runtime.attrList.entries()) {
    if (!a) continue;
    if (attributeMap.has(a)) {
      const ex = attributeMap.get(a);
      if (!ex.fieldName && (cfg?.key || cfg?.attr)) {
        ex.fieldName = cfg?.key || cfg?.attr;
      }
      // prefer not to overwrite existing description here
      ex.description ||= undefined;
    } else {
      attributeMap.set(a, {
        name: a,
        type: normalizeType(cfg?.type),
        fieldName: cfg?.key || undefined,
        description: undefined,
      });
    }
  }

  // If we can map an attribute back to an instance field, prefer the
  // TypeScript-derived field type over runtime observer subtypes.
  for (const [, aval] of attributeMap.entries()) {
    if (!aval) continue;
    const fieldName = aval.fieldName;
    if (!fieldName) continue;
    if (!instanceFieldMap.has(fieldName)) continue;
    const field = instanceFieldMap.get(fieldName);
    if (!field?.type) continue;
    const currentText = aval.type?.text || aval.type?.text?.toLowerCase?.();
    const isRuntimeNumericSubtype = currentText === 'integer' || currentText === 'float';
    if (!aval.type || isRuntimeNumericSubtype) {
      aval.type = field.type;
    }
  }

  // Enrich instance field members: always attempt to populate missing types
  // from TypeScript exports when available, but avoid overwriting docs.
  for (const [mname, mval] of instanceFieldMap.entries()) {
    if (!tsExports.has(mname)) continue;
    const foundValue = tsExports.get(mname);
    if (mval.kind === 'field' && (!mval.type || mval.type.text === 'any')) {
      mval.type = normalizeType(foundValue.type || 'any');
    }
    mval.description ||= foundValue.docs || undefined;
    mval.source ||= sourceLocationToReference(foundValue.source) || undefined;
  }

  // Enrich instance method members: ensure a `return` object exists and
  // populate its `type` when missing or `any`.
  for (const [mname, mval] of instanceMethodMap.entries()) {
    if (!tsExports.has(mname)) continue;
    const foundValue = tsExports.get(mname);
    mval.return = mval.return || {};
    if (!mval.return.type || mval.return.type.text === 'any') {
      mval.return.type = normalizeType(foundValue.type || 'any');
    }
    mval.description ||= foundValue.docs || undefined;
    mval.source ||= sourceLocationToReference(foundValue.source) || undefined;
  }

  for (const [, aval] of attributeMap.entries()) {
    if (!aval.description) {
      const field = aval.fieldName;
      if (field) {
        if (tsExports.has(field) === false) continue;
        const foundValue = tsExports.get(field);
        aval.description = foundValue.docs || undefined;
        continue;
      }
    }
  }

  // If a static members map was provided, apply similar enrichment rules
  // (prefer TS docs/types from `tsExports`). Always populate missing
  // `return.type` for static methods and `type` for static fields.
  if (staticMembersMap) {
    for (const [mname, mval] of staticMembersMap.entries()) {
      if (!tsExports.has(mname)) continue;
      const foundValue = tsExports.get(mname);
      if (mval.kind === 'field' && (!mval.type || mval.type.text === 'any')) {
        mval.type = normalizeType(foundValue.type || 'any');
      }
      if (mval.kind === 'method') {
        mval.return = mval.return || {};
        if (!mval.return.type || mval.return.type.text === 'any') {
          mval.return.type = normalizeType(foundValue.type || 'any');
        }
      }
      mval.description ||= foundValue.docs || undefined;
      mval.source ||= sourceLocationToReference(foundValue.source) || undefined;
    }
  }
}

/**
 * Find demo HTML files for a component name and return CEM demos array.
 * @param {string} name
 * @return {Promise<CEMElement['demos']>}
 */
async function findDemos(name) {
  /** @type {CEMElement['demos']} */
  const demos = [];
  const root = process.cwd();
  const candidates = [
    path.join(root, 'demo', 'components', `${name.toLowerCase()}.html`),
    path.join(root, 'demo', 'components', `${name.toLowerCase()}s.html`),
    path.join(root, 'demo', 'components', `${kebab(name)}.html`),
    path.join(root, 'demo', 'components', `${kebab(name)}s.html`),
  ];
  let foundDemo = null;

  for (const c of candidates) {
    // eslint-disable-next-line no-await-in-loop
    if (await fileExists(c)) {
      foundDemo = c;
      break;
    }
  }
  if (foundDemo) {
    const rel = path.relative(root, foundDemo).replaceAll('\\', '/');
    demos.push({ url: rel });
  }
  return demos;
}

/* findExportInfo is hoisted to top-of-file to avoid use-before-define */

/**
 * Capture runtime artifacts by importing the module inside JSDOM.
 * @param {string} src
 * @return {Promise<RuntimeCaptureResult>}
 */
async function captureCustomElementMetadata(src) {
  const importSpec = path.join('/', path.relative(process.cwd(), src).split(path.sep).join('/'));
  if (VERBOSE) {
    console.log(`[manifest] captureCustomElementMetadata: launching playwright for ${importSpec}`);
  }

  const context = sharedContext;
  const page = await context.newPage();

  const wrapperUrl = 'http://127.0.0.1/';
  try {
    await page.goto(wrapperUrl);
    await page.waitForLoadState('domcontentloaded');
    const serialized = await page.evaluate(async ({ spec }) => {
      /** @type {typeof import('../core/CustomElement.js')} */
      const module = await import(spec);
      const CustomElementConstructor = module.default;
      // create Instance to force composition
      if (!CustomElementConstructor) {
        const exportKeys = Object.keys(module || {});
        throw new Error(JSON.stringify({ __meta_error: 'constructor-not-found', exports: exportKeys }));
      }
      /** @type {import('../core/CustomElement.js').default|null} */
      let element;
      try {
        element = new CustomElementConstructor();
      } catch {
        // Not constructible (propably base class or mixin); continue capture
      }
      /** @type {RuntimeCaptureResult} */
      const result = {
        attrList: CustomElementConstructor.attrList,
        propList: CustomElementConstructor.propList,
        prototypeMembers: new Map(),
        staticMembers: new Map(),
        enumerableProps: new Set(),
        slots: new Map(),
        cssParts: new Map(),
        tag: element?.tagName?.toLowerCase(),
      };

      const proto = CustomElementConstructor.prototype || {};
      for (const n of Object.getOwnPropertyNames(proto || {})) {
        const desc = Object.getOwnPropertyDescriptor(proto, n);
        if (!desc) continue;
        const isEnumerable = !!desc.enumerable;
        if (!isEnumerable) continue;
        result.enumerableProps.add(n);
        if (n === 'constructor') {
          result.prototypeMembers.set(n, 'constructor');
          continue;
        }
        if (typeof desc.value === 'function') {
          result.prototypeMembers.set(n, 'method');
        }
        if (typeof desc.get === 'function') {
          result.prototypeMembers.set(n, 'getter');
        }
        if (typeof desc.set === 'function') {
          result.prototypeMembers.set(n, 'setter');
        }
        if (!desc.get && !desc.set && typeof desc.value !== 'function') {
          result.prototypeMembers.set(n, 'field');
        }
      }
      const staticNames = Object.getOwnPropertyNames(CustomElementConstructor).filter((x) => !['length', 'name', 'prototype'].includes(x));
      for (const n of staticNames) {
        const desc = Object.getOwnPropertyDescriptor(CustomElementConstructor, n);
        if (!desc) continue;
        if (!desc.enumerable) continue;
        if (typeof desc.value === 'function') {
          result.staticMembers.set(n, 'method');
        }
        if (typeof desc.get === 'function') {
          result.staticMembers.set(n, 'getter');
        }
        if (typeof desc.set === 'function') {
          result.staticMembers.set(n, 'setter');
        }
        if (!desc.get && !desc.set && typeof desc.value !== 'function') {
          result.staticMembers.set(n, 'field');
        }
      }

      if (element?.composition) {
        for (const slotElement of element.composition.template.querySelectorAll('slot')) {
          result.slots.set(slotElement.name, {
            name: slotElement.name,
            description: slotElement.outerHTML,
          });
        }
        for (const partElement of element.composition.template.querySelectorAll('[part]')) {
          const partNames = (partElement.getAttribute('part') || '').split(/\s+/).filter(Boolean);
          for (const partName of partNames) {
            if (!result.cssParts.has(partName)) {
              result.cssParts.set(partName, { name: partName });
            }
          }
        }
      }
      return {
        attrs: Array.from(CustomElementConstructor.attrList.entries()),
        props: Array.from(CustomElementConstructor.propList.entries()),
        prototypeMembers: Array.from(result.prototypeMembers.entries()),
        staticMembers: Array.from(result.staticMembers.entries()),
        enumerableProps: Array.from(result.enumerableProps.values()),
        slots: Array.from(result.slots.entries()),
        cssParts: Array.from(result.cssParts.entries()),
        tag: result.tag,
        __meta_error: /** @type {string} */ (null),
      };
    }, { spec: importSpec });

    if (serialized.__meta_error) {
      // Non-instantiable or missing constructor in module; indicate
      // to caller that runtime capture couldn't proceed.
      return null;
    }

    if (VERBOSE) {
      console.log(`[manifest] captured runtime metadata for ${importSpec}`, serialized);
    }
    return {
      attrList: new Map(serialized.attrs),
      propList: new Map(serialized.props),
      prototypeMembers: new Map(serialized.prototypeMembers),
      staticMembers: new Map(serialized.staticMembers),
      enumerableProps: new Set(serialized.enumerableProps),
      slots: new Map(serialized.slots),
      cssParts: new Map(serialized.cssParts),
      tag: serialized.tag,
    };
  } finally {
    // ensure the page's route handlers are torn down with the page close
    try {
      await page.close();
    } catch (e) {
      if (VERBOSE) {
        console.error('[manifest] error closing page:', e);
      }
    }
  }
}

// TODO: split metadata capture into two responsibilities:
//  - `captureCustomElementMetadata(src)` - instantiates the element and
//    captures composition/runtime-derived metadata (slots, parts, runtime
//    properties).
//  - `captureMixinMetadata(src)` - inspects mixin functions/objects and
//    synthesizes their contributed properties/members so we can merge
//    them into component declarations without needing to instantiate a
//    composed element. This will be necessary for analyzing mixins that
//    aren't applied at runtime or that are applied via helper utilities.

/**
 * Generate AI manifest for a single component file.
 * @param {string} file
 * @return {Promise<CEMModule>}
 */
async function generateForFile(file) {
  const name = path.basename(file, '.js');
  const src = file;

  const program = getTypescriptProgram();
  const checker = getTypeChecker();
  const sf = program.getSourceFile(src);
  if (!sf) {
    throw new Error(`could not parse ${src}`);
  }

  const { exportExpr, idNode } = findExportInfo(sf);
  if (!idNode) {
    console.warn('No export default for', name);
  }

  const sym = idNode ? checker.getSymbolAtLocation(idNode) : null;
  const type = sym
    ? checker.getTypeOfSymbolAtLocation(sym, sym.valueDeclaration || idNode)
    : (idNode ? checker.getTypeAtLocation(idNode) : null);

  const { instanceType, ctorInstanceType } = resolveInstanceAndCtor(sym, type, idNode);

  const isCustomElementExport = typeLooksLikeCustomElement(instanceType) || typeLooksLikeCustomElement(type);

  if (!isCustomElementExport) {
    if (VERBOSE) {
      console.log(`[manifest] ${name}: export does not appear to be a Custom Element, skipping runtime capture`);
    }
    // For non-custom-module exports we currently skip runtime probing and
    // return an empty module (no custom element declarations). Mixins and
    // other export shapes will be supported later.
    /** @type {CEMModule} */
    const mod = {
      kind: 'javascript-module',
      path: path.relative(process.cwd(), src),
      declarations: [],
      exports: [],
    };
    return mod;
  }

  /** @type {CEMElement['superclass']|null} */
  let superclassRef = computeSuperclassRef(name, instanceType, type, idNode, exportExpr, sf, src);

  // If the TS-derived superclass resolves to the current module (self-reference)
  // prefer the chain-root symbol from the export expression when available.
  // This handles cases where fluent/chained factories produce a local alias
  // binding that leads TypeScript to attribute the symbol to the same file.
  if (superclassRef && exportExpr) {
    const currentRel = path.relative(process.cwd(), src).split(path.sep).join('/');
    if (superclassRef.module === currentRel) {
      let chainRootSym = resolveSymbolFromExpression(exportExpr);
      // If the checker-based walk failed to find a left-most identifier
      // (some chained expressions include formatting/newlines that hinder
      // a straight walk), attempt a conservative textual fallback: find
      // the first identifier-like token in the export expression text
      // and locate its Identifier node inside the exportExpr subtree.
      if (!chainRootSym) {
        const txt = exportExpr.getText(sf) || '';
        const m = txt.match(/([$A-Z_a-z][\w$]*)/);
        if (m && m[1]) {
          const [, nameToFind] = m;
          // Search subtree for an Identifier with this name
          /** @type {ts.Identifier|null} */
          let foundId = null;
          /**
           * @param {ts.Node} node
           */
          const findIdByName = (node) => {
            if (!node || foundId) return;
            if (ts.isIdentifier(node) && node.getText(sf) === nameToFind) {
              foundId = /** @type {ts.Identifier} */ (node);
              return;
            }
            ts.forEachChild(node, findIdByName);
          };
          findIdByName(exportExpr);
          if (foundId) {
            const s = checker.getSymbolAtLocation(foundId);
            if (s) {
              // eslint-disable-next-line no-bitwise
              chainRootSym = (s.flags & ts.SymbolFlags.Alias) ? checker.getAliasedSymbol(s) : s;
            }
          }
        }
      }
      // Additional fallback: scan all Identifiers under the export expression
      // and prefer one that resolves to an imported/externally-declared symbol
      // (helps when textual or checker walks pick up local parameters like
      // `BaseClass` before the real imported chain-root such as `ListItem`).
      if (!chainRootSym) {
        /** @type {ts.Symbol|null} */
        let importedSym = null;
        /**
         * @param {ts.Node} node
         */
        const scanForImported = (node) => {
          if (!node || importedSym) return;
          if (ts.isIdentifier(node)) {
            const s = checker.getSymbolAtLocation(node);
            if (s) {
              // eslint-disable-next-line no-bitwise
              const actual = (s.flags & ts.SymbolFlags.Alias) ? checker.getAliasedSymbol(s) : s;
              const ref = referenceFromSymbol(actual);
              if (ref && ref.module) {
                // prefer symbols declared in other modules
                const rel = path.relative(process.cwd(), src).split(path.sep).join('/');
                if (ref.module !== rel) {
                  importedSym = actual;
                  return;
                }
              }
            }
          }
          ts.forEachChild(node, scanForImported);
        };
        scanForImported(exportExpr);
        if (importedSym) {
          chainRootSym = importedSym;
        }
      }
      const chainRootRef = chainRootSym ? referenceFromSymbol(chainRootSym) : null;
      if (chainRootRef && chainRootRef.module !== superclassRef.module) {
        superclassRef = chainRootRef;
        if (VERBOSE) {
          console.log('[manifest]', name, 'replaced self-referenced superclass with chain-root', chainRootRef);
        }
      }
      // If the left-most identifier we found is a parameter/local (eg. `BaseClass`
      // from `.extend((BaseClass) => class extends BaseClass { ... })`), attempt
      // to trace the parameter's origin: find the function node that declares
      // the parameter, then locate the CallExpression where that function is
      // passed as an argument. Resolve the callee of that CallExpression to
      // discover the real chain-root (often an imported symbol like `ListItem`).
      if ((!chainRootRef || chainRootRef.module === superclassRef.module) && exportExpr) {
        // find class `extends` identifier first
        const extendsExpr = findClassExtends(exportExpr);
        if (extendsExpr && ts.isIdentifier(extendsExpr)) {
          const extSym = checker.getSymbolAtLocation(extendsExpr);
          if (extSym) {
            // if the symbol is a parameter, find its parent function
            const decl = extSym.valueDeclaration || (extSym.declarations && extSym.declarations[0]);
            if (decl && (ts.isParameter(decl) || ts.isIdentifier(decl))) {
              // find enclosing function node that contains this parameter
              let funcNode = decl.parent;
              // Walk up until we find a function expression/declaration or arrow
              while (
                funcNode
                && !ts.isFunctionExpression(funcNode)
                && !ts.isArrowFunction(funcNode)
                && !ts.isFunctionDeclaration(funcNode)
              ) {
                funcNode = funcNode.parent;
              }
              if (funcNode) {
                // find the CallExpression in exportExpr subtree where a function
                // argument declares a parameter matching the extends identifier
                // (looser match than node identity to handle parenthesized/rewritten ASTs)
                /** @type {ts.CallExpression|null} */
                let foundCall = null;
                const targetParamName = extendsExpr.getText(sf);
                /**
                 * @param {ts.Node} n
                 */
                const findCall = (n) => {
                  if (!n || foundCall) return;
                  if (ts.isCallExpression(n)) {
                    for (const a of n.arguments) {
                      // If the argument is an inline function, inspect its params
                      if (ts.isFunctionExpression(a) || ts.isArrowFunction(a)) {
                        for (const p of a.parameters) {
                          if (p.name && ts.isIdentifier(p.name) && p.name.getText(sf) === targetParamName) {
                            foundCall = /** @type {ts.CallExpression} */ (n);
                            return;
                          }
                        }
                      }
                      // Also tolerate the case where the argument is an identifier
                      // referencing a previously-declared function that contains
                      // a parameter with the target name. Compare textual forms
                      // as a fallback.
                      if (ts.isIdentifier(a) && a.getText(sf) === funcNode.getText(sf)) {
                        foundCall = /** @type {ts.CallExpression} */ (n);
                        return;
                      }
                    }
                  }
                  ts.forEachChild(n, findCall);
                };
                findCall(exportExpr);
                if (foundCall) {
                  const callee = foundCall.expression;
                  const calleeRootSym = resolveSymbolFromExpression(callee);
                  if (calleeRootSym) {
                    const calleeRef = referenceFromSymbol(calleeRootSym);
                    if (calleeRef && calleeRef.module && calleeRef.module !== superclassRef.module) {
                      superclassRef = calleeRef;
                      if (VERBOSE) {
                        console.log('[manifest]', name, 'traced parameter-origin superclass to', calleeRef);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Additional heuristic: if still self-referenced, inspect import
    // declarations in this source file for a binding that matches the
    // apparent chain-root identifier (left-most identifier of the
    // export expression). Some fluent factories start from an imported
    // symbol (eg. `ListItem.extend()...`) which may have been lost by
    // earlier AST-based tracing; prefer the imported symbol's module
    // when available.
    if (superclassRef && exportExpr && superclassRef.module === path.relative(process.cwd(), src).split(path.sep).join('/')) {
      // find a left-most identifier text from the export expression
      const txt = exportExpr.getText(sf) || '';
      const m = txt.match(/([$A-Z_a-z][\w$]*)/);
      if (m && m[1]) {
        const [, leftName] = m;
        // scan import declarations in this source file for a binding
        for (const stmt of sf.statements) {
          if (!ts.isImportDeclaration(stmt)) continue;
          const clause = stmt.importClause;
          if (!clause) continue;
          // default import: `import X from '...';`
          if (clause.name && clause.name.getText(sf) === leftName) {
            const importId = clause.name;
            const importSym = checker.getSymbolAtLocation(importId);
            if (importSym) {
              // eslint-disable-next-line no-bitwise
              const actual = (importSym.flags & ts.SymbolFlags.Alias)
                ? checker.getAliasedSymbol(importSym)
                : importSym;
              const ref = referenceFromSymbol(actual);
              if (ref && ref.module && ref.module !== superclassRef.module) {
                superclassRef = ref;
                if (VERBOSE) {
                  console.log('[manifest]', name, 'import-binding fallback resolved superclass to', ref);
                }
                break;
              }
            }
          }
          // named imports: `import {A as B} from '...';`
          if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
            for (const el of clause.namedBindings.elements) {
              const local = (el.name && el.name.getText(sf)) || null;
              if (local !== leftName) continue;
              const importId = el.name;
              const importSym = checker.getSymbolAtLocation(importId);
              if (importSym) {
                // eslint-disable-next-line no-bitwise
                // eslint-disable-next-line no-bitwise
                const actual = (importSym.flags & ts.SymbolFlags.Alias)
                  ? checker.getAliasedSymbol(importSym)
                  : importSym;
                const ref = referenceFromSymbol(actual);
                if (ref && ref.module && ref.module !== superclassRef.module) {
                  superclassRef = ref;
                  if (VERBOSE) {
                    console.log('[manifest]', name, 'import-binding fallback resolved superclass to', ref);
                  }
                  break;
                }
              }
            }
            if (superclassRef && superclassRef.module !== path.relative(process.cwd(), src).split(path.sep).join('/')) break;
          }
          // namespace import: `import * as NS from '...';` and usage `NS.X`
          if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
            const ns = clause.namedBindings.name.getText(sf);
            // prefer patterns like `NS` followed by dot and identifier
            if (txt.startsWith(`${ns}.`)) {
              // try to resolve the namespace import symbol
              const importId = clause.namedBindings.name;
              const importSym = checker.getSymbolAtLocation(importId);
              if (importSym) {
                // eslint-disable-next-line no-bitwise
                const actual = (importSym.flags & ts.SymbolFlags.Alias)
                  ? checker.getAliasedSymbol(importSym)
                  : importSym;
                const ref = referenceFromSymbol(actual);
                if (ref && ref.module && ref.module !== superclassRef.module) {
                  superclassRef = ref;
                  if (VERBOSE) {
                    console.log('[manifest]', name, 'namespace import fallback resolved superclass to', ref);
                  }
                  break;
                }
              }
            }
          }
        }
      }
    }
  }

  // Fallback 1: if we couldn't compute a superclass via type analysis, try
  // to resolve the chain-root identifier from the export expression
  // (covers fluent/chained APIs like `Box.extend().mixin(...)`). This is
  // conservative and only used when TS type-based resolution failed.
  if (!superclassRef && exportExpr) {
    const rootSym = resolveSymbolFromExpression(exportExpr);
    if (rootSym) {
      const ref = referenceFromSymbol(rootSym);
      if (ref) {
        superclassRef = ref;
        if (VERBOSE) {
          console.log('[manifest]', name, 'fallback chain-root superclassRef=', ref);
        }
      }
    }
  }

  // Extra diagnostics for tricky chain-root cases (helpful during debugging)
  if (VERBOSE && name === 'ListOption') {
    console.log('[manifest-debug] ListOption: initial superclassRef=', superclassRef);
    console.log('[manifest-debug] ListOption: exportExpr text=', exportExpr ? exportExpr.getText(sf).slice(0, 400) : '<none>');
    const cr = resolveSymbolFromExpression(exportExpr);
    console.log('[manifest-debug] ListOption: resolveSymbolFromExpression(exportExpr)=', cr ? cr.getName() : null);
    const astExt = findClassExtends(exportExpr);
    console.log('[manifest-debug] ListOption: findClassExtends=', astExt ? astExt.getText(sf) : null);
  }

  // Fallback 2: prefer an explicit `extends` target inside any class
  // expression that may appear under the export expression. This relies
  // on AST-level class heritage rather than heuristics over chained
  // fluent calls (eg. `.extend()`), which can confuse the TS resolver.
  // Also run this fallback when the TS-derived superclass is the project's
  // generic `core/CustomElement.js` so concrete class targets win.
  if (exportExpr) {
    const customBasePath = getCustomElementRelativePath();
    const shouldTryAst = !superclassRef || (customBasePath && superclassRef && superclassRef.module === customBasePath);
    if (shouldTryAst) {
      // Precompute the chain-root symbol for chained/fluent exports so we
      // can prefer it when the `extends` expression binds to a local
      // parameter (eg. `extend((Base) => class extends Base {...})`).
      const chainRootSym = resolveSymbolFromExpression(exportExpr);
      const chainRootRef = chainRootSym ? referenceFromSymbol(chainRootSym) : null;

      const extendsExpr = findClassExtends(exportExpr);
      if (extendsExpr) {
        let exSym = checker.getSymbolAtLocation(extendsExpr);
        if (exSym) {
          // Unwrap alias if necessary
          // eslint-disable-next-line no-bitwise
          if (exSym.flags & ts.SymbolFlags.Alias) {
            const ali = checker.getAliasedSymbol(exSym);
            if (ali) {
              exSym = ali;
            }
          }

          // Prefer a direct reference from the extends symbol when it
          // resolves to an imported/declared class. But if the extends
          // identifier is a local parameter/variable (common in
          // `.extend((Base) => class extends Base {})` patterns) then
          // prefer the earlier-resolved chain-root (eg. `ListItem`).
          const ref = referenceFromSymbol(exSym);
          const isLocalParam = exSym.valueDeclaration && ts.isParameter(exSym.valueDeclaration);
          const refersToCurrentFile = ref && ref.module === path.relative(process.cwd(), src);
          // Prefer a chain-root reference when the `extends` identifier
          // resolves to a local parameter (eg. `.extend((Base) => class extends Base {})`).
          // If the extends identifier is local but we already resolved a
          // non-self `superclassRef` earlier (for example via the
          // import-binding fallback), do not overwrite it when chain-root
          // tracing failed — prefer the earlier, more concrete resolution.
          if ((!ref || isLocalParam || refersToCurrentFile) && chainRootRef) {
            superclassRef = chainRootRef;
            if (VERBOSE) {
              console.log('[manifest]', name, 'class-extends bound to local param or local symbol; using chain-root superclassRef=', chainRootRef);
            }
          } else if (ref && !isLocalParam && !refersToCurrentFile) {
            // Only adopt a direct `extends` reference when it is not a
            // local parameter/alias and does not refer back to the
            // current module. This prevents clobbering a previously
            // discovered imported superclass when the `extends` target
            // is a local binding.
            superclassRef = ref;
            if (VERBOSE) {
              console.log('[manifest]', name, 'class-extends AST fallback superclassRef=', ref);
            }
          }
        }
      }
    }
  }

  // If we determined this is a custom element export, proceed with
  // runtime capture to gather composition/runtime metadata.
  const runtime = await captureCustomElementMetadata(src);
  if (!runtime) {
    if (VERBOSE) {
      console.log(`[manifest] ${name}: runtime capture skipped (non-instantiable or missing constructor)`);
    }
    /** @type {CEMModule} */
    const mod = {
      kind: 'javascript-module',
      path: path.relative(process.cwd(), src),
      declarations: [],
      exports: [],
    };
    return mod;
  }

  if (VERBOSE) {
    console.log(`[manifest] ${name}: runtime captured, enumerableProps=${runtime?.enumerableProps?.size ?? 0}`);
  }

  if (VERBOSE) {
    console.log(`[manifest] ${name}: runtime captured, enumerableProps=${runtime?.enumerableProps?.size ?? 0}`);
  }

  const tsExports = collectTsExports(sf);

  /** @type {Map<string, CEMField>} */
  const instanceFieldMap = new Map();
  /** @type {Map<string, CEMMethod>} */
  const instanceMethodMap = new Map();

  /** @type {Map<string, CEMAttribute>} */
  const attributeMap = new Map();

  const typeLooksLikeConstructor = (typeof type?.getConstructSignatures === 'function')
    && (type.getConstructSignatures?.() || []).length > 0;
  if (typeof type?.getProperties === 'function' && !typeLooksLikeConstructor) {
    mergePropertiesFromType(type, instanceFieldMap, instanceMethodMap, runtime, tsExports, idNode, name);
  }

  if (instanceType) {
    // eslint-disable-next-line no-await-in-loop
    await mergeInstanceTypeProperties(
      instanceType,
      instanceFieldMap,
      instanceMethodMap,
      runtime,
      tsExports,
      idNode,
      name,
      src,
      superclassRef,
    );
  }

  // Collect mixin declarations first so they can be used for inheritedFrom tracking
  const mixins = await collectMixinDeclarationsFromExport(exportExpr);
  buildAttributeMapFromRuntime(runtime, tsExports, attributeMap, name);

  // Build a dedicated static members map from runtime and enrich it
  // with TypeScript-declared constructor/typeof properties. We avoid
  // merging runtime static members into the instance map so that
  // `static: true` members are kept distinct.
  const staticMembersMap = new Map(); // buildMembersFromRuntime(runtime, tsExports, name, true);

  // mergePrototypeMembers(runtime, instanceMembersMap);

  // Attempt to resolve a constructor/class symbol from the exported
  // `type` and merge its declared properties into the static map.

  const ctorSym = resolveCtorSymbolFromType(type);
  if (ctorSym) {
    const ctorType = checker.getTypeOfSymbolAtLocation(
      ctorSym,
      ctorSym.valueDeclaration || idNode,
    );
      // eslint-disable-next-line no-await-in-loop
    await mergeConstructorTypeProperties(
      ctorType,
      staticMembersMap,
      runtime,
      tsExports,
      idNode,
      name,
      src,
      superclassRef,
    );
  } else if (ctorInstanceType) {
    // Fallback: sometimes constructor-like shapes are available on `type`
    // or via `ctorInstanceType`; attempt to merge from the exported `type`.
    // eslint-disable-next-line no-await-in-loop
    await mergeConstructorTypeProperties(
      type,
      staticMembersMap,
      runtime,
      tsExports,
      idNode,
      name,
      src,
      superclassRef,
    );
  }

  enrichAttributesAndMembers(
    attributeMap,
    instanceFieldMap,
    instanceMethodMap,
    runtime,
    tsExports,
    staticMembersMap,
  );

  // eslint-disable-next-line no-await-in-loop
  const demos = await findDemos(name);

  /** @type {CEMElement} */
  // Filter out mixin-sourced `field` members from component declarations.
  // Mixin provenance is still captured on mixin module declarations;
  // here we avoid copying mixin-owned fields onto the composed component
  // so verifier expectations can be component-local only.
  /** @type {CEMMember[]} */
  const allMemberCandidates = [
    ...Array.from(instanceFieldMap.values()),
    ...Array.from(instanceMethodMap.values()),
    ...(staticMembersMap ? Array.from(staticMembersMap.values()) : []),
  ];

  const filteredMembers = allMemberCandidates.filter((m) => {
    if (!m) {
      return false;
    }

    // If runtime enumeration data is available, prefer it to filter out
    // non-enumerable members (e.g. inherited or symbol-backed properties).
    // Note: this relies on runtime capture (Playwright/JSDOM) and cannot be
    // validated purely from the static manifest output; when `enumerableProps`
    // is empty or missing we fall back to previous heuristics.

    if (runtime?.enumerableProps?.size > 0) {
      const mname = (typeof m.name === 'string') ? m.name : null;
      if (mname && !runtime.enumerableProps.has(mname)) {
        if (VERBOSE) {
          console.log(`[manifest] skipping non-enumerable member ${mname} for ${name}`);
        }
        return false;
      }
    }

    // Hide underscored internals (unless runtime explicitly observed them).
    // This prevents leaking implementation details like `_supportingSlotted`
    // into the manifest when runtime enumeration data is missing.
    const maybeName = (typeof m.name === 'string') ? m.name : null;
    if (maybeName && maybeName.startsWith('_')) {
      const seen = runtime?.enumerableProps?.size > 0 ? runtime.enumerableProps.has(maybeName) : false;
      if (!seen) {
        if (VERBOSE) {
          console.log(`[manifest] hiding underscored internal ${maybeName} for ${name}`);
        }
        return false;
      }
    }

    return true;
  });
  // Synthesize events inferred from `on*` listener-style members.
  const events = [];
  const seenEvents = new Set();
  for (const m of filteredMembers) {
    if (!m || !m.name || typeof m.name !== 'string') {
      continue;
    }
    const lname = m.name.toLowerCase();
    if (!lname.startsWith('on')) {
      continue;
    }
    const eventName = listenerPropToEventName(m.name);
    if (!eventName || seenEvents.has(eventName)) {
      continue;
    }
    seenEvents.add(eventName);
    // Per CEM schema, `Event` requires a `name` and `type`. Avoid
    // emitting arbitrary `source` properties here (the schema does not
    // include `source` for events). Use a conservative `Event` type.
    events.push({ name: eventName, type: { text: 'Event' } });
  }

  /** @type {import('custom-elements-manifest').CustomElementDeclaration} */
  const cemDecl = {
    kind: 'class',
    name: name[0].toUpperCase() + name.slice(1),
    tagName: runtime.tag,
    customElement: true,
    attributes: [...attributeMap.values()],
    members: filteredMembers,
    slots: [...runtime.slots.values()],
    cssParts: [...runtime.cssParts.values()],
    events,
    demos,
    superclass: superclassRef || undefined,
    mixins,
  };

  let classDesc = null;
  // Prefer TypeScript symbol docs when available
  if (sym) {
    const docs = docToString(sym);
    if (docs && docs.trim()) {
      classDesc = docs.trim();
    }
  }

  if (!classDesc) {
    const srcText = sf.getFullText();
    if (exportExpr) {
      const start = exportExpr.getFullStart();
      const prefix = srcText.slice(0, start);
      const m = /\/\*{2}([\S\s]*?)\*\/\s*$/m.exec(prefix);
      if (m && m[1]) {
        // strip leading * prefixes
        const cleaned = m[1].split(/\r?\n/).map((ln) => ln.replace(/^\s*\*\s?/, '')).join('\n').trim();
        if (cleaned) {
          classDesc = cleaned;
        }
      }
    }
  }

  if (classDesc) {
    cemDecl.description = classDesc;
  }

  const modulePath = path.relative(process.cwd(), src).split(path.sep).join('/');
  /** @type {CEMModule} */
  const mod = {
    kind: 'javascript-module',
    path: modulePath,
    declarations: [cemDecl],
    exports: [
      {
        kind: 'js',
        name: 'default',
        declaration: {
          name: cemDecl.name,
          module: modulePath,
        },
      },
    ],
  };

  // Add custom-element-definition export if the element has a tagName
  if (runtime.tag) {
    mod.exports.push({
      kind: 'custom-element-definition',
      name: runtime.tag,
      declaration: {
        name: cemDecl.name,
        module: modulePath,
      },
    });
  }

  return mod;
}

/**
 * @param {string} file
 * @return {Promise<CEMModule>}
 */
async function getModuleForFile(file) {
  const abs = path.resolve(file);
  if (moduleByFile.has(abs)) {
    return await moduleByFile.get(abs);
  }
  /* eslint-disable-next-line no-use-before-define */
  const p = generateForFile(abs);
  /* eslint-enable no-use-before-define */
  moduleByFile.set(abs, p);
  return await p;
}

/**
 *
 */
async function main() {
  const args = process.argv.slice(2);
  // Enable verbose logging if requested on CLI
  VERBOSE = args.includes('-v') || args.includes('--verbose');
  if (VERBOSE) {
    console.log('[manifest] verbose enabled');
  }
  if (args.includes('-h') || args.includes('--help')) {
    console.log('Usage: node scripts/generate-manifests.js [ComponentName ...]');
    console.log('Builds `docs/custom-elements.json` from components (no per-component AI manifests).');
    console.log('Use -v or --verbose for extra runtime logging');
    return;
  }
  const root = path.resolve(__dirname, '..');
  const componentsDir = path.join(root, 'components');
  const positionalArgs = args.filter((a) => !a.startsWith('-'));
  const filterNames = positionalArgs.length ? new Set(positionalArgs.map((a) => path.basename(a, '.js'))) : null;

  const entries = await fs.readdir(componentsDir);

  const jsFiles = entries.filter((e) => e.endsWith('.js')
    && (!filterNames || filterNames.has(path.basename(e, '.js'))));
  if (filterNames && jsFiles.length === 0) {
    console.warn('No matching component files found for', [...filterNames].join(', '));
  }

  const browser = await chromium.launch({ headless: true });
  sharedContext = await browser.newContext();

  await sharedContext.route('**/*', async (route, request) => {
    try {
      const reqUrl = new URL(request.url());

      const relPath = decodeURIComponent(reqUrl.pathname.replace(/^\//, ''));
      if (!relPath || relPath === '/') {
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'text/html; charset=utf-8' },
          body: '<!doctype html><html><head></head><body></body></html>',
        });
        return;
      }

      const fsPath = path.join(process.cwd(), relPath);
      if (!fsPath.startsWith(process.cwd()) || !fsSync.existsSync(fsPath)) {
        await route.fulfill({ status: 404, body: 'not found' });
        return;
      }
      const data = await readFile(fsPath, 'utf8');
      const ext = path.extname(fsPath).toLowerCase();
      const ct = ext === '.js' ? 'application/javascript' : (ext === '.html' ? 'text/html' : 'text/plain');
      await route.fulfill({
        status: 200,
        headers: { 'content-type': `${ct}; charset=utf-8` },
        body: data,
      });
    } catch (e) {
      await route.fulfill({ status: 500, body: String(e) });
    }
  });

  // Limit concurrent page creation to avoid spawning too many Chromium renderer
  // processes/sockets. Use CPU count as a sensible default and cap it.
  const cpuCount = Math.max(1, os.cpus()?.length || 4);
  const CONCURRENCY = Math.min(cpuCount, 8);

  /**
   * Run an array of async task factories with a concurrency limit.
   * @param {Array<() => Promise<any>>} tasks
   */
  // removed old runWithConcurrency definition from main

  const taskFactories = jsFiles.map((f) => async () => {
    if (VERBOSE) {
      console.log(`[manifest] generating for ${f}...`);
    }
    return await getModuleForFile(path.join(componentsDir, f));
  });

  await runWithConcurrency(taskFactories, CONCURRENCY);

  // Ensure mixin modules have synthesized declarations registered.
  // Some mixin files are not CustomElement exports and thus won't be
  // fully generated during the component pass; synthesize them now so
  // their mixin declarations appear in the final manifest.
  for (const fileKey of Array.from(moduleByFile.keys())) {
    if (fileKey.includes(`${path.sep}mixins${path.sep}`)) {
      const rel = path.relative(process.cwd(), fileKey).split(path.sep).join('/');
      // eslint-disable-next-line no-await-in-loop
      await buildMixinDeclarationFromRef({ module: rel }, new Set());
    }
  }

  const allModules = await Promise.all(moduleByFile.values());

  const modules = allModules.filter(Boolean).sort((a, b) => {
    if (a.path < b.path) return -1;
    if (a.path > b.path) return 1;
    return 0;
  });

  // Post-pass: ensure synthesized mixin declarations include nested `mixins` refs.
  // Some mixin module declarations may have been created earlier without nested
  // mixin refs; reconstruct and merge their `mixins` arrays when available.
  for (const mod of modules) {
    if (!mod || mod.kind !== 'javascript-module' || !mod.path) continue;
    for (let i = 0; i < (mod.declarations || []).length; i++) {
      const d = mod.declarations[i];
      if (!d || d.kind !== 'mixin') continue;
      // eslint-disable-next-line no-await-in-loop
      const synth = await buildMixinDeclarationFromRef({ module: mod.path, name: d.name }, new Set());
      if (synth?.mixins?.length && !d.mixins?.length) {
        d.mixins = synth.mixins;
      }
    }
  }

  // Post-pass: merge mixin attributes and members into components with inheritedFrom.

  /** @type {Map<string, {attributes?: any[], members?: any[]}>} */
  const mixinDataByModuleName = new Map();
  /** @type {Map<string, {attributes?: any[], members?: any[]}>} */
  const classDataByModuleName = new Map();
  /** @type {Map<string, string>} */
  const exportToDeclarationName = new Map();

  for (const mod of modules) {
    if (!mod || mod.kind !== 'javascript-module' || !mod.path) continue;

    // Build export-to-declaration mapping for resolving references
    for (const exp of (mod.exports || [])) {
      if (!exp || !exp.declaration) continue;
      const declName = exp.declaration.name;
      if (declName) {
        const exportName = exp.name || 'default';
        const key = `${mod.path}::${exportName}`;
        exportToDeclarationName.set(key, declName);
      }
    }

    for (const d of (mod.declarations || [])) {
      if (!d || d.kind !== 'mixin') continue;
      if ('customElement' in d === false) continue;
      // Store mixin data using both declaration name and export names
      const mixinData = {
        attributes: d.attributes || [],
        members: d.members || [],
      };
      const declKey = `${mod.path}::${d.name}`;
      mixinDataByModuleName.set(declKey, mixinData);

      // Also store by export names so references can find it
      for (const exp of (mod.exports || [])) {
        if (!exp || !exp.declaration || exp.declaration.name !== d.name) continue;
        const exportKey = `${mod.path}::${exp.name || 'default'}`;
        if (exportKey !== declKey) {
          mixinDataByModuleName.set(exportKey, mixinData);
        }
      }
    }

    // Store class/component data indexed by ALL possible names (declaration + exports)
    // This allows lookup by either export name or declaration name
    for (const d of (mod.declarations || [])) {
      if (!d || (d.kind !== 'class' && d.kind !== 'mixin')) continue;
      if ('customElement' in d === false) continue;
      const classData = {
        attributes: d.attributes || [],
        members: d.members || [],
      };

      // Store by declaration name
      const declKey = `${mod.path}::${d.name}`;
      classDataByModuleName.set(declKey, classData);

      // Also store by export names so references can find it
      for (const exp of (mod.exports || [])) {
        if (!exp || !exp.declaration || exp.declaration.name !== d.name) continue;
        const exportKey = `${mod.path}::${exp.name || 'default'}`;
        if (exportKey !== declKey) {
          classDataByModuleName.set(exportKey, classData);
        }
      }
    }
  }

  if (mixinDataByModuleName.size) {
    // Build a map to find mixins by both declaration name and export name
    /** @type {Map<string, string>} */
    const mixinDeclarationToExportName = new Map();
    for (const mod of modules) {
      if (!mod || mod.kind !== 'javascript-module' || !mod.path) continue;
      for (const exp of (mod.exports || [])) {
        if (!exp || !exp.declaration) continue;
        const declName = exp.declaration.name;
        if (declName && exp.declaration.module === mod.path // Map declaration name to its primary export name
          && !mixinDeclarationToExportName.has(`${mod.path}::${declName}`)) {
          const exportName = exp.name || 'default';
          mixinDeclarationToExportName.set(`${mod.path}::${declName}`, exportName);
        }
      }
    }

    for (const mod of modules) {
      if (!mod || mod.kind !== 'javascript-module' || !mod.path) continue;
      for (const d of (mod.declarations || [])) {
        if (!d || d.kind !== 'class' || !d.mixins || !('customElement' in d)) continue;

        // Build sets of existing component-defined names
        const existingAttrNames = new Set((d.attributes || []).map((a) => a.name));
        const existingMemberNames = new Set((d.members || []).map((m) => m.name));

        // For each applied mixin, merge its attributes and members with inheritedFrom
        for (const mref of d.mixins) {
          const mixModule = mref.module;
          let mixName = mref.name;
          if (!mixModule || !mixName) continue;

          // Try to look up by the mixin reference name first (might be declaration name or export name)
          let key = `${mixModule}::${mixName}`;
          let mixinData = mixinDataByModuleName.get(key);

          // If not found, try looking it up as a declaration name and resolve to export name
          if (!mixinData) {
            const exportName = mixinDeclarationToExportName.get(key);
            if (exportName) {
              key = `${mixModule}::${exportName}`;
              mixinData = mixinDataByModuleName.get(key);
              if (mixinData) {
                mixName = exportName;
              }
            }
          }

          // If found, ensure we're using the export name for inheritedFrom reference
          if (mixinData) {
            for (const exp of (modules.flatMap((m) => m.exports || []))) {
              if (exp && exp.declaration && exp.declaration.module === mixModule
                  && exp.declaration.name === mref.name) {
                mixName = exp.name || 'default';
                break;
              }
            }
          } else {
            continue;
          }

          // Ensure mixName is the export name (not declaration name)
          const exportNameForMixin = mixinDeclarationToExportName.get(`${mixModule}::${mref.name}`);
          if (exportNameForMixin) {
            mixName = exportNameForMixin;
          }
          // Mark attributes that come from mixin with inheritedFrom
          if (mixinData.attributes) {
            for (const attr of mixinData.attributes) {
              // If already present on the class, just tag inheritedFrom
              const existing = (d.attributes || []).find((a) => a.name === attr.name);
              if (existing) {
                if (!existing.inheritedFrom) {
                  existing.inheritedFrom = { name: mixName, module: mixModule };
                }
                continue;
              }
              // Otherwise add it
              d.attributes = d.attributes || [];
              d.attributes.push({
                ...attr,
                inheritedFrom: {
                  name: mixName,
                  module: mixModule,
                },
              });
              existingAttrNames.add(attr.name);
            }
          }

          // Mark members that come from mixin with inheritedFrom
          if (mixinData.members) {
            for (const member of mixinData.members) {
              if (!member.name) continue;
              const existing = (d.members || []).find((m) => m.name === member.name);
              if (existing) {
                if (!existing.inheritedFrom) {
                  existing.inheritedFrom = { name: mixName, module: mixModule };
                }
                continue;
              }
              d.members = d.members || [];
              d.members.push({
                ...member,
                inheritedFrom: {
                  name: mixName,
                  module: mixModule,
                },
              });
              existingMemberNames.add(member.name);
            }
          }
        }
      }
    }
  }

  // Post-pass: merge superclass attributes and members into subclasses with inheritedFrom.
  if (classDataByModuleName.size) {
    for (const mod of modules) {
      if (!mod || mod.kind !== 'javascript-module' || !mod.path) continue;
      for (const d of (mod.declarations || [])) {
        if (!d || d.kind !== 'class' || !d.superclass || !('customElement' in d)) continue;

        const superModule = d.superclass.module;
        const superName = d.superclass.name;
        if (!superModule || !superName) continue;

        // Look up by export name (as used in the reference)
        const key = `${superModule}::${superName}`;
        const superData = classDataByModuleName.get(key);
        if (!superData) {
          console.log(`[superclass] unable to resolve ${d.name} superclass reference ${superModule}::${superName}`);
          continue;
        }

        // Build map of superclass attributes and members by name
        const superAttrByName = new Map(
          (superData.attributes || []).map((a) => [a.name, a]),
        );
        const superMemberByName = new Map(
          (superData.members || []).map((m) => [m.name, m]),
        );

        // Mark attributes that come from superclass with inheritedFrom
        for (const attr of (d.attributes || [])) {
          if (superAttrByName.has(attr.name) && !attr.inheritedFrom) {
            attr.inheritedFrom = {
              name: superName,
              module: superModule,
            };
          }
        }

        // Mark members that come from superclass with inheritedFrom
        for (const member of (d.members || [])) {
          if (superMemberByName.has(member.name) && !member.inheritedFrom) {
            member.inheritedFrom = {
              name: superName,
              module: superModule,
            };
          }
        }

        // Add any superclass attributes/members not already on the subclass
        const existingAttrNames = new Set((d.attributes || []).map((a) => a.name));
        const existingMemberNames = new Set((d.members || []).map((m) => m.name));

        for (const attr of superData.attributes) {
          if (!existingAttrNames.has(attr.name)) {
            d.attributes = d.attributes || [];
            d.attributes.push({
              ...attr,
              inheritedFrom: {
                name: superName,
                module: superModule,
              },
            });
          }
        }

        for (const member of superData.members) {
          if (member.name && !existingMemberNames.has(member.name)) {
            d.members = d.members || [];
            d.members.push({
              ...member,
              inheritedFrom: {
                name: superName,
                module: superModule,
              },
            });
          }
        }
      }
    }
  }

  /** @type {CEMPackage} */
  const output = {
    $schema: 'https://cdn.jsdelivr.net/npm/custom-elements-manifest@2.1.0/schema.json',
    schemaVersion: '2.1.0',
    modules,
  };
  const outPath = path.join(root, 'docs', 'custom-elements.json');
  await fs.writeFile(outPath, JSON.stringify(output, null, 2), 'utf8');
  console.log('Wrote', outPath);

  // await buildCEMFromModules(modules, root);

  await sharedContext.close();
  await browser.close();
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (invokedDirectly) {
  await main();
}
