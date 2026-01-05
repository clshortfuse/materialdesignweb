import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv from 'ajv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @param {string} msg */
function fail(msg) {
  console.error(msg);
  process.exitCode = 2;
}

/**
 * JSON value types used in the parsed manifest.
 * @typedef {string|number|boolean|null|JSONObject|JSONArray} JSONValue
 * @typedef {{[k: string]: JSONValue}} JSONObject
 * @typedef {JSONValue[]} JSONArray
 * @typedef {Record<string, any>} SchemaNode
 */
/** @typedef {import('custom-elements-manifest').CEMSchema} CEMSchema */

/**
 * @param {boolean}[strict]
 */
async function runValidation(strict = false) {
  const ajv = new Ajv({
    allErrors: true, strict: !!strict, verbose: !!strict, allowUnionTypes: true,
  });

  // Default target is the generated api/custom-elements.json
  const targetPath = path.resolve(__dirname, '..', 'api', 'custom-elements.json');
  if (!fs.existsSync(targetPath)) {
    fail(`Target CEM not found: ${targetPath}`);
    return;
  }

  const rawContent = fs.readFileSync(targetPath, 'utf8');
  const content = JSON.parse(rawContent);
  const looksLikeCem = (typeof content === 'object')
    && content !== null
    && 'schemaVersion' in content && Array.isArray(content.modules);
  if (!looksLikeCem) {
    fail(`Target file does not look like a custom-elements.json: ${targetPath}`);
    return;
  }

  const schema = await import('custom-elements-manifest/schema.json', { with: { type: 'json' } });
  if (!schema) {
    fail('Unable to load custom-elements-manifest schema via ESM. Install `custom-elements-manifest` or pass `--schema <path>`.');
    return;
  }

  if ((schema.$schema || '').includes('json-schema.org')) {
    delete schema.$schema;
  }

  // Enforce that schema object definitions do not allow additional
  // properties so the validator will report extraneous fields. This
  // walks the schema and sets `additionalProperties: false` on
  // object-shaped schemas that don't already declare it.
  /**
   * Walk the schema and set `additionalProperties: false` on object-shaped
   * schema nodes that don't already declare it.
   * @param {CEMSchema} root
   */
  function enforceNoAdditionalProperties(root) {
    const seen = new Set();
    /**
     * Recurse into schema nodes.
     * @param {Object} node
     */
    function walk(node) {
      if (!node || typeof node !== 'object') return;
      if (seen.has(node)) return;
      seen.add(node);

      // If this node is an object schema (has properties/patternProperties or type 'object')
      if ((node.type === 'object' || node.properties || node.patternProperties) && node.additionalProperties === undefined) {
        node.additionalProperties = false;
      }

      // Recurse into known schema keywords
      const keys = Object.keys(node);
      for (const k of keys) {
        const v = node[k];
        if (!v) continue;
        if (Array.isArray(v)) {
          for (const it of v) {
            walk(it);
          }
        } else if (typeof v === 'object') {
          walk(v);
        }
      }
    }
    walk(root);
  }

  // Apply the enforcement to the loaded schema so extra fields are treated as errors.
  try {
    enforceNoAdditionalProperties(schema);
  } catch (e) {
    console.warn('Could not enforce additionalProperties on schema:', e && e.message);
  }

  let validate;
  try {
    validate = ajv.compile(schema);
  } catch (err) {
    console.error('Schema compile error:', err && err.message ? err.message : String(err));
    if (err && err.errors) {
      console.error('Errors:', err.errors);
    }
    process.exitCode = 2;
    return;
  }

  /**
   * Resolve a JSON Pointer-style instancePath into the parsed `content` object.
   * @param {JSONObject|JSONArray} obj
   * @param {string} pointer
   * @return {JSONValue|undefined}
   */
  function getAtPointer(obj, pointer) {
    if (!pointer || pointer === '') return obj;
    const parts = pointer.split('/').slice(1).map((p) => decodeURIComponent(p.replaceAll('~1', '/').replaceAll('~0', '~')));
    let cur = obj;
    for (const part of parts) {
      if (cur === undefined || cur === null) return undefined;
      cur = Array.isArray(cur) && /^\d+$/.test(part) ? cur[Number(part)] : cur[part];
    }
    return cur;
  }

  /**
   * Resolve a schema path like "#/definitions/..." into the schema node.
   * @param {CEMSchema} schemaRoot
   * @param {string} schemaPath
   * @return {SchemaNode|null}
   */
  function getSchemaNode(schemaRoot, schemaPath) {
    if (!schemaPath) return null;
    const p = schemaPath.replace(/^#\/?/, '').split('/').filter(Boolean);
    let cur = schemaRoot;
    for (const part of p) {
      if (!cur) return null;
      if (part in cur) {
        cur = cur[part];
      } else if (/^\d+$/.test(part) && Array.isArray(cur)) {
        cur = cur[Number(part)];
      } else {
        return null;
      }
    }
    return cur;
  }

  const ok = validate(content);
  const rel = path.relative(process.cwd(), targetPath) || targetPath;
  if (ok) {
    process.stdout.write(`${strict ? 'OK (strict):' : 'OK:'} ${rel}\n`);
    process.exitCode = 0;
  } else {
    console.error(`${strict ? 'INVALID (strict):' : 'INVALID:'} ${rel}`);

    // use the top-level getAtPointer helper defined above

    for (const err of validate.errors || []) {
      const instPath = err.instancePath || '/';
      console.error('  -', instPath, err.message);
      // Provide richer error metadata to help map validator failures back
      // to generator output and source files.
      console.error('    keyword:', err.keyword || '<unknown>', 'schemaPath:', err.schemaPath || '<unknown>');
      if (err.params) {
        console.error('    params:', JSON.stringify(err.params));
      }
      // Try to show the offending parsed JSON value (pretty-printed) and
      // a raw substring of the original file near the failure so users can
      // quickly locate the offending text.
      try {
        const val = getAtPointer(content, instPath);
        if (val === undefined) {
          console.error('    offending value: <not found in parsed JSON at this path>');
        } else {
          const pretty = JSON.stringify(val, null, 2);
          const maxLen = 1200;
          if (pretty.length > maxLen) {
            console.error('    offending value (truncated):');
            console.error(`${pretty.slice(0, maxLen)}\n    ...(truncated)`);
          } else {
            console.error('    offending value:');
            console.error(pretty);
          }

          // Attempt to include the raw JSON substring from the original file
          // to make it easier to locate the exact text that failed validation.
          try {
            const moduleMatch = instPath.match(/^\/modules\/(\d+)(?:\/declarations\/(\d+))?/);
            if (moduleMatch) {
              const modIdx = Number(moduleMatch[1]);
              const mod = content.modules && content.modules[modIdx];
              if (mod) {
                const modPath = mod.path || mod.id || mod.name;
                if (modPath) {
                  const needle = `"${String(modPath).replaceAll('"', '\\"')}"`;
                  const idx = rawContent.indexOf(needle);
                  if (idx !== -1) {
                    const start = Math.max(0, idx - 160);
                    const end = Math.min(rawContent.length, idx + needle.length + 160);
                    const snippet = rawContent.slice(start, end);
                    console.error('    raw JSON context (near module.path):');
                    console.error(snippet);
                  }
                }
              }
            }

            // If the module-path approach didn't yield a snippet, try to locate
            // a compact JSON representation of the offending value within the raw
            // content and show surrounding context.
            const compact = JSON.stringify(val);
            const found = rawContent.indexOf(compact);
            if (found !== -1) {
              const start = Math.max(0, found - 120);
              const end = Math.min(rawContent.length, found + compact.length + 120);
              console.error('    raw JSON context (value match):');
              console.error(rawContent.slice(start, end));
            }
          } catch (e) {
            // Non-fatal: diagnostics helper must not throw.
            void e;
          }

          // Helpful context hint: if the path references a module/declaration/member,
          // try to print the module path and declaration name to aid navigation.
          try {
            const moduleMatch = instPath.match(/^\/modules\/(\d+)(?:\/declarations\/(\d+))?/);
            if (moduleMatch) {
              const modIdx = Number(moduleMatch[1]);
              const declIdx = moduleMatch[2] ? Number(moduleMatch[2]) : undefined;
              const mod = content.modules && content.modules[modIdx];
              if (mod) {
                const modPath = mod.path || mod.id || mod.name || '<module:no-path>';
                let hint = `    location hint: module[${modIdx}] = ${modPath}`;
                if (typeof declIdx === 'number' && Array.isArray(mod.declarations) && mod.declarations[declIdx]) {
                  const decl = mod.declarations[declIdx];
                  hint += `, declaration[${declIdx}] name=${decl.name || '<unnamed>'} kind=${decl.kind || '<unknown>'}`;
                }
                console.error(hint);
              }
            }
          } catch {
            // ignore
          }

          // Extra-help for common AJV failure kinds.
          try {
            // additionalProperties -> caller added an extra property not allowed by schema
            if (err.keyword === 'additionalProperties' && err.params && err.params.additionalProperty) {
              const extra = String(err.params.additionalProperty);
              const keys = Array.isArray(val) ? `<array length ${val.length}>` : Object.keys(val).join(', ');
              console.error(`    extra property: ${extra}`);
              console.error(`    object keys: ${keys}`);
            }

            // enum / allowed values
            if ((err.keyword === 'enum' || (err.keyword === 'type' && err.params && err.params.allowedValues)) && err.params && err.params.allowedValues) {
              console.error('    allowedValues:', JSON.stringify(err.params.allowedValues));
            }

            // anyOf failures: attempt to validate against each subschema and show sub-errors
            if (err.keyword === 'anyOf') {
              // try to resolve schema node from err.schemaPath
              const node = getSchemaNode(schema, err.schemaPath || '');
              const candidates = Array.isArray(node) ? node : ((node && node.anyOf) ? node.anyOf : null);
              if (candidates && Array.isArray(candidates) && candidates.length > 0) {
                console.error(`    anyOf: ${candidates.length} subschemas — testing each briefly:`);
                for (let i = 0; i < candidates.length; i++) {
                  const sub = candidates[i];
                  try {
                    const okSub = ajv.validate(sub, val);
                    if (okSub) {
                      console.error(`      subschema[${i}]: matches`);
                    } else {
                      const subErrs = ajv.errors || [];
                      console.error(`      subschema[${i}]: ${subErrs.length} error(s) — ${subErrs.slice(0, 3).map((e) => `${e.instancePath || '/'} ${e.message}`).join(' ; ')}`);
                    }
                  } catch (e) {
                    console.error(`      subschema[${i}]: validation threw: ${e && e.message ? e.message : String(e)}`);
                  }
                }
              }
            }
          } catch (e) {
            // Don't let diagnostics throw.
            console.error('    diagnostics helper failure:', e && e.message ? e.message : String(e));
          }
        }
      } catch (e) {
        console.error('    could not stringify offending value:', e && e.message ? e.message : String(e));
      }
    }

    process.exitCode = 1;
  }

  // --- Emit warnings for schema properties that never appear in the generated manifest
  try {
    const schemaProps = new Set();
    const schemaPropScopes = new Map();
    const seen = new Set();
    /**
     * Collect property names from the schema and record simple pointer-like
     * scopes for each property.
     * @param {SchemaNode|CEMSchema} node
     * @param {string} curPath
     * @return {void}
     */
    const collectSchemaProps = (node, curPath = '#') => {
      if (!node || typeof node !== 'object') return;
      if (seen.has(node)) {
        return;
      }
      seen.add(node);
      if (node.properties && typeof node.properties === 'object') {
        for (const k of Object.keys(node.properties)) {
          schemaProps.add(k);
          if (!schemaPropScopes.has(k)) {
            schemaPropScopes.set(k, new Set());
          }
          // record the full schema property path (e.g. #/definitions/Parameter/optional)
          schemaPropScopes.get(k).add(`${curPath}/${k}`);
        }
      }
      // Recurse into likely schema containers, tracking a simple schema path
      const keys2 = Object.keys(node);
      for (const k of keys2) {
        const child = node[k];
        if (!child) {
          continue;
        }
        if (Array.isArray(child)) {
          for (let i = 0; i < child.length; i++) {
            collectSchemaProps(child[i], `${curPath}/${k}[${i}]`);
          }
        } else if (typeof child === 'object') {
          collectSchemaProps(child, `${curPath}/${k}`);
        }
      }
    };
    collectSchemaProps(schema);

    const contentKeys = new Set();
    /**
     * Recursively collect all object keys present in the generated manifest
     * so we can detect schema properties that are never used.
     * @param {JSONObject|JSONArray} obj
     * @return {void}
     */
    const collectContentKeys = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        for (const it of obj) {
          collectContentKeys(it);
        }
        return;
      }
      for (const k of Object.keys(obj)) {
        contentKeys.add(k);
        collectContentKeys(obj[k]);
      }
    };
    collectContentKeys(content);

    // Compute schema properties never observed in the manifest
    const neverUsed = [...schemaProps].filter((p) => !contentKeys.has(p));
    if (neverUsed.length) {
      const limit = 200;
      console.warn(`\n[warn] ${neverUsed.length} schema property name(s) were not observed in ${rel}.`);
      console.warn('  These schema property names were not present in any object within the manifest (showing up to', limit, 'items):');
      const sample = neverUsed.slice(0, limit);
      // Collect all full schema paths for unused properties, then print
      // them ordered by parent tree (root '#' first) and alphabetically
      // by property name within each tree.
      const groups = new Map();
      for (const p of sample) {
        const scopes = schemaPropScopes.get(p) ? Array.from(schemaPropScopes.get(p)) : [];
        for (const fullPath of scopes) {
          const parent = fullPath.replace(/\/[^/]+$/, '') || '#';
          if (!groups.has(parent)) {
            groups.set(parent, new Set());
          }
          groups.get(parent).add(fullPath);
        }
      }
      const parents = Array.from(groups.keys()).sort((a, b) => {
        if (a === '#') return -1;
        if (b === '#') return 1;
        return a.localeCompare(b);
      });
      for (const parent of parents) {
        const childPaths = Array.from(groups.get(parent));
        childPaths.sort((x, y) => {
          const xn = x.replace(/^.*\//, '');
          const yn = y.replace(/^.*\//, '');
          if (xn === yn) return x.localeCompare(y);
          return xn.localeCompare(yn);
        });
        for (const pth of childPaths) {
          console.warn('   -', pth);
        }
      }
      if (neverUsed.length > limit) {
        console.warn(`   ...and ${neverUsed.length - limit} more`);
      }
      console.warn('  Note: some schema property names are structural/schema-only keys and may be expected to be absent.');
    }
  } catch (e) {
    // Non-fatal diagnostics helper
    console.error('Could not compute unused schema properties:', e && e.message ? e.message : String(e));
  }
}

if (import.meta.url === `file://${process.argv[1]}` || path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const args = new Set(process.argv.slice(2));
  const strict = args.has('--strict') || args.has('-s');

  let overallError = false;
  try {
    process.exitCode = 0;
    await runValidation(strict);
    if (process.exitCode && process.exitCode !== 0) {
      overallError = true;
    }
  } catch (err) {
    console.error('Validator error:', err && err.message ? err.message : String(err));
    overallError = true;
  }

  process.exitCode = overallError ? 1 : 0;
}
