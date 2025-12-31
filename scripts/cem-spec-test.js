#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Run the generator synchronously and stream output to the parent process.
 */
// Parse CLI args once so verifier and generator stay in sync.
const RAW_ARGS = process.argv.slice(2);
const REQUESTED_MODULES = [];
let REQUESTED_VERBOSE = false;
for (const a of RAW_ARGS) {
  if (a === '-v' || a === '--verbose') {
    REQUESTED_VERBOSE = true; continue;
  }
  if (a.startsWith('-')) continue;
  REQUESTED_MODULES.push(a);
}
// Effective modules: when none explicitly requested, treat as no filter => generate ALL modules.
// We represent that by leaving EFFECTIVE_MODULES empty when the user provided no module names.
const EFFECTIVE_MODULES = REQUESTED_MODULES;

/**
 *
 */
function runGenerator() {
  try {
    let cmd;
    if (!EFFECTIVE_MODULES || EFFECTIVE_MODULES.length === 0) {
      // No filter specified -> generate all modules
      cmd = `node scripts/cem-generate.js${REQUESTED_VERBOSE ? ' -v' : ''}`;
    } else {
      const target = EFFECTIVE_MODULES.join(' ');
      cmd = `node scripts/cem-generate.js ${target}${REQUESTED_VERBOSE ? ' -v' : ''}`;
    }
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.error('[verify] generator failed:', e && e.message);
    return false;
  }
}

/**
 *
 */
function loadManifest() {
  const manifestPath = path.resolve('docs/custom-elements.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest not found: ${manifestPath}`);
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

/**
 *
 * @param p
 */
function normalize(p) {
  return String(p || '').split(path.sep).join('/');
}

/**
 * @param {{href?: string, file?: string}|null|undefined} source
 */
function hasHrefOrFile(source) {
  return Boolean(source && (source.href || source.file));
}

/**
 *
 * @param manifest
 */
function verify(manifest) {
  const errors = [];
  const modules = manifest.modules || [];

  // Specific expectations used by tests below. Keep these small and focused —
  // they assert a handful of important attributes/properties and mixin members
  // to guard against regressions in provenance and member synthesis.
  // Only expect members actually declared on Button itself (not mixin-origin members).
  const EXPECTED_BUTTON_MEMBERS = [
    { name: 'elevated', source: 'components/Button.js' },
    { name: 'hasIcon', source: 'components/Button.js' },
    { name: 'iconVariation', source: 'components/Button.js' },
  ];

  const EXPECTED_MIXIN_MEMBERS = {
    'mixins/ControlMixin.js': { fields: ['focusableOnDisabled', 'controlVoidElement', 'controlTagName'], methods: [] },
    'mixins/FormAssociatedMixin.js': { fields: ['value', 'defaultValue', 'checked'], methods: ['checkValidity', 'reportValidity', 'setCustomValidity'] },
    'mixins/HyperlinkMixin.js': { fields: ['href', 'target'], methods: [] },
    'mixins/InputMixin.js': { fields: ['files'], methods: ['setRangeText', 'setSelectionRange'] },
    // Expect attributes/members that are declared by DensityMixin to be present
    'mixins/DensityMixin.js': { fields: ['density'], methods: [], attrs: ['density'] },
  };

  // 1) Mixin modules should have declarations
  const mixinModules = modules.filter((m) => normalize(m.path).startsWith('mixins/'));
  for (const mod of mixinModules) {
    if (!Array.isArray(mod.declarations) || mod.declarations.length === 0) {
      errors.push(`mixin module ${mod.path} has empty declarations`);
      continue;
    }
    for (const decl of mod.declarations) {
      if (decl && decl.kind === 'mixin') {
        const declName = decl.name || 'default';
        // check nested mixins (if any)
        if (Array.isArray(decl.mixins)) {
          for (const m of decl.mixins) {
            if (!m) continue;
            if (m.package === 'global:' && (m.name || '') === 'HTMLElement') {
              errors.push(`${mod.path}::${declName} includes global:HTMLElement as a nested mixin`);
            }
            if (m.module) {
              const relChild = normalize(m.module);
              const modPath = normalize(mod.path);
              const childName = m.name || 'default';
              if (relChild === modPath && childName === declName) {
                errors.push(`${mod.path}::${declName} includes itself as a nested mixin`);
              }
            }
          }
        }

        // Ensure the synthesized mixin declares a source (file or href)
        if (!hasHrefOrFile(decl.source)) {
          errors.push(`${mod.path}::${declName} missing declaration source`);
        }

        // Ensure members have required fields and provenance — almost every member
        // should report a source (href or file) so we enforce it here.
        if (Array.isArray(decl.members)) {
          for (const m of decl.members) {
            if (!m || !m.name) {
              errors.push(`${mod.path}::${declName} has member with missing name`);
              continue;
            }
            if (!m.kind) {
              errors.push(`${mod.path}::${declName}.${m.name} missing kind`);
            }
            // Require member to report a source (href or file)
            if (!hasHrefOrFile(m.source)) {
              errors.push(`${mod.path}::${declName}.${m.name} missing member source (href/file)`);
            }
            // static flag should be boolean when present
            if (Object.prototype.hasOwnProperty.call(m, 'static') && typeof m.static !== 'boolean') {
              errors.push(`${mod.path}::${declName}.${m.name} static flag not boolean`);
            }
          }
        }
      }
    }
  }

  // 2) Validate the Button declaration and ensure it does not include mixin-sourced members
  // Only run Button-specific checks when Button was requested, or when no filter
  // was provided (REQUESTED_MODULES empty) which means "all".
  const shouldCheckButton = REQUESTED_MODULES.length === 0 || EFFECTIVE_MODULES.includes('Button') || EFFECTIVE_MODULES.includes('components/Button.js') || EFFECTIVE_MODULES.includes('all');
  if (shouldCheckButton) {
    const btnMod = modules.find((m) => normalize(m.path) === 'components/Button.js');
    if (btnMod) {
      const btnDecl = (btnMod.declarations || []).find((d) => d.kind === 'class' && d.name === 'Button');
      if (btnDecl) {
      // Ensure Button declaration looks like a custom element and has a superclass
        if (btnDecl.customElement !== true) errors.push('Button declaration not marked as customElement');
        if (!btnDecl.superclass) errors.push('Button declaration missing superclass');
        // Validate Button members have names/kinds and sources when present
        for (const mm of (btnDecl.members || [])) {
          if (!mm || !mm.name) {
            errors.push('Button has member with missing name'); continue;
          }
          if (!mm.kind) errors.push(`Button.${mm.name} missing kind`);
          if (mm.source && !hasHrefOrFile(mm.source)) errors.push(`Button.${mm.name} has source but missing href/file`);
          // Methods that originate in mixins should not be listed on the component
          if (mm.kind === 'method' && mm.source) {
            const href = (mm.source && (mm.source.href || mm.source.file || mm.source)) || '';
            if (String(href).includes('mixins/')) {

              errors.push(`Button.${mm.name} is sourced from mixins (${href}); mixin-sourced methods should not appear on Button`);
            }
          }
        }
        // --- Specific expectations for Button members (provenance + presence)
        for (const exp of EXPECTED_BUTTON_MEMBERS) {
          const m = (btnDecl.members || []).find((mm) => mm && mm.name === exp.name);
          if (!m) {
            errors.push(`Button missing member ${exp.name}`);
          } else if (exp.source) {
            const href = (m.source && (m.source.href || m.source.file || m.source)) || '';
            if (!String(href).includes(exp.source)) {
              errors.push(`Button.${exp.name} provenance does not reference ${exp.source}: ${href}`);
            }
          }
        }

        // --- Ensure certain runtime attributes are present on Button
        const EXPECTED_BUTTON_ATTRS = ['icon-ink', 'svg'];
        const btnAttrNames = new Set((btnDecl.attributes || []).map((a) => a && a.name).filter(Boolean));
        for (const a of EXPECTED_BUTTON_ATTRS) {
          if (!btnAttrNames.has(a)) {
            errors.push(`Button missing runtime attribute '${a}'`);
          }
        }

        // --- Ensure mixin ordering matches source `.mixin(...)` call order
        // The manifest should list mixins from innermost -> outermost (first `.mixin()` call first).
        const EXPECTED_BUTTON_MIXINS_ORDER = [
          'mixins/ThemableMixin.js',
          'mixins/DensityMixin.js',
          'mixins/StateMixin.js',
          'mixins/ElevationMixin.js',
          'mixins/ShapeMixin.js',
          'mixins/RippleMixin.js',
          'mixins/InputMixin.js',
          'mixins/HyperlinkMixin.js',
        ];
        const actualMixins = (btnDecl.mixins || []).map((m) => normalize(m && (m.module || m)));
        if (actualMixins.length === EXPECTED_BUTTON_MIXINS_ORDER.length) {
          for (let i = 0; i < EXPECTED_BUTTON_MIXINS_ORDER.length; i++) {
            if (actualMixins[i] !== EXPECTED_BUTTON_MIXINS_ORDER[i]) {
              errors.push(`Button mixins order mismatch at index ${i}: expected ${EXPECTED_BUTTON_MIXINS_ORDER[i]} but found ${actualMixins[i]}`);
            }
          }
        } else {
          errors.push(`Button mixins length ${actualMixins.length} !== expected ${EXPECTED_BUTTON_MIXINS_ORDER.length}`);
        }

        // --- Ensure Button does NOT declare certain mixin-sourced members
        const FORBIDDEN_BUTTON_MEMBERS = ['delegatesFocus', 'href'];
        for (const forbidden of FORBIDDEN_BUTTON_MEMBERS) {
          const found = (btnDecl.members || []).find((mm) => mm && mm.name === forbidden);
          if (found) {
            const src = (found.source && (found.source.href || found.source.file || found.source)) || 'unknown';
            errors.push(`Button must not declare '${forbidden}' (it's mixin-sourced). Found source: ${src}`);
          }
        }

        // Precompute Button attributes once for mixin attribute checks
        const btnAttrs = new Set(((btnDecl.attributes || []).map((at) => at && at.name).filter(Boolean)));

        // --- Validate selected mixin modules declare expected members (fields & methods)
        for (const [mPath, info] of Object.entries(EXPECTED_MIXIN_MEMBERS)) {
          const mixMod = modules.find((mod) => normalize(mod.path) === mPath);
          if (!mixMod) {
            errors.push(`expected mixin module ${mPath} missing`); continue;
          }
          const mixDecl = (mixMod.declarations || []).find((d) => d && d.kind === 'mixin');
          if (!mixDecl) {
            errors.push(`${mPath} has no mixin declaration`); continue;
          }
          const memberNames = new Set((mixDecl.members || []).map((mm) => mm && mm.name).filter(Boolean));
          for (const f of (info.fields || [])) {
            if (!memberNames.has(f)) errors.push(`${mPath} mixin missing field ${f}`);
          }
          for (const meth of (info.methods || [])) {
            const mem = (mixDecl.members || []).find((mm) => mm && mm.name === meth);
            if (!mem) {
              errors.push(`${mPath} mixin missing method ${meth}`); continue;
            }
            if (mem.kind !== 'method') errors.push(`${mPath}.${meth} expected kind 'method' but is ${mem.kind}`);
            // Ensure Button does not list this method as its own method with mixin provenance
            const btnMeth = (btnDecl.members || []).find((mm) => mm && mm.name === meth);
            if (btnMeth && btnMeth.kind === 'method' && btnMeth.source && String((btnMeth.source.href || btnMeth.source.file || btnMeth.source)).includes('mixins/')) {
              errors.push(`Button.${meth} should not appear as a method with mixin provenance`);
            }
          }
          // Validate expected attributes declared by mixins.
          // Attributes are runtime/DOM concepts. The mixin itself should
          // declare the attribute (in its `declaration.attributes` array)
          // and the component should NOT incorrectly claim ownership of a
          // mixin-owned attribute.
          const mixAttrs = new Set(((mixDecl.attributes || []).map((at) => at && at.name).filter(Boolean)));
          for (const a of (info.attrs || [])) {
            if (!mixAttrs.has(a)) {
              errors.push(`${mPath} mixin missing runtime attribute '${a}'`);
            }
            if (btnAttrs.has(a)) {
              errors.push(`Button should NOT expose mixin attribute '${a}'`);
            }
          }
        }
      } else {
        errors.push('Button declaration missing');
      }
    } else {
      errors.push('components/Button.js module missing');
    }
  } else {
    console.log('[verify] skipping Button-specific checks (not requested)');
  }

  // --- Ensure `ListOption` does not expose internal non-enumerable members
  const shouldCheckListOption = REQUESTED_MODULES.length === 0 || EFFECTIVE_MODULES.includes('ListOption') || EFFECTIVE_MODULES.includes('components/ListOption.js') || EFFECTIVE_MODULES.includes('all');
  if (shouldCheckListOption) {
    const listMod = modules.find((m) => normalize(m.path) === 'components/ListOption.js');
    if (listMod) {
      const listDecl = (listMod.declarations || []).find((d) => d && d.kind === 'class' && d.name === 'ListOption');
      if (listDecl) {
        const internal = (listDecl.members || []).find((mm) => mm && mm.name === '_supportingSlotted');
        if (internal) {
          errors.push('ListOption must not declare \'_supportingSlotted\' (internal/non-enumerable)');
        }
        // Ensure ListOption reports the correct superclass (should be ListItem)
        const superRef = listDecl.superclass;
        if (superRef) {
          const superMod = normalize(superRef.module || superRef.package || '');
          if (superMod !== 'components/ListItem.js') {
            errors.push(`ListOption superclass expected components/ListItem.js but found ${superMod || JSON.stringify(superRef)}`);
          }
        } else {
          errors.push('ListOption declaration missing superclass');
        }
      } else {
        errors.push('components/ListOption.js declaration missing');
      }
    } else {
      errors.push('components/ListOption.js module missing');
    }
  }

  // --- Verify `onX` listener properties imply events when TypeScript types indicate
  // they are event-listener signatures. Specifically check `components/Card.js`
  // which defines `onaction` in source and should fire an `action` event.
  const cardMod = modules.find((m) => normalize(m.path) === 'components/Card.js');
  if (cardMod) {
    const cardDecl = (cardMod.declarations || []).find((d) => d && (d.kind === 'class' || d.kind === 'mixin'));
    if (cardDecl) {
      const onProp = (cardDecl.members || []).find((mm) => mm && typeof mm.name === 'string' && mm.name.toLowerCase().startsWith('on'));
      if (onProp) {
        const eventName = listenerPropToEventName(onProp.name);
        if (eventName) {
          // Validate that the listener member is a `field` and is typed as
          // `EventListener` before asserting the corresponding `events` entry.
          if (onProp.kind !== 'field') {
            errors.push(`Card listener property '${onProp.name}' must be declared as a field to imply an event (found kind: ${onProp.kind || '(missing)'})`);
          }
          if (!typeLooksLikeEventListener(onProp.type)) {
            const typeName = (onProp.type && (onProp.type.name || onProp.type.text)) || '(no type)';
            errors.push(`Card listener property '${onProp.name}' must be typed 'EventListener' to imply an event (found: ${typeName})`);
          }
          const ev = (cardDecl.events || []).find((e) => e && e.name === eventName);
          if (!ev) {
            const typeName = (onProp.type && (onProp.type.name || onProp.type.text)) || '(no type)';
            errors.push(`Card missing event '${eventName}' inferred from listener property '${onProp.name}' (member type: ${typeName})`);
          }
        }
      }
    }
  }

  return errors;
}

/**
 * Convert an `onX` listener property name to an event name.
 * Examples: `onAction` or `onaction` -> `action`, `onValueChanged` -> `value-changed`.
 * @param prop
 */
function listenerPropToEventName(prop) {
  if (!prop || !prop.startsWith('on')) return '';
  const rest = prop.slice(2);
  if (!rest) return '';
  // Insert dash between lower->upper transitions and lowercase everything
  // Also handle already-lowercase `onaction` -> `action`
  const withDashes = rest.replaceAll(/([\da-z])([A-Z])/g, '$1-$2');
  return withDashes.replaceAll(/[\s_]+/g, '-').toLowerCase();
}

/**
 * Heuristic: does a manifest `Type` look like an event-listener / function?
 * We keep this conservative: accept types that mention `Event`, `EventListener`,
 * or `Function` in the type `name` when present. If no `type` is available
 * we return false (we require TS-derived type info to be present).
 * @param t
 */
function typeLooksLikeEventListener(t) {
  if (!t) return false;
  // Accept either a `name` property or a textual `text` representation.
  const name = String(t.name || '');
  const text = String((t && (t.text || t.type || '')) || '');
  if (!name && !text) return false;
  // Conservative match: prefer exact `EventListener` but also accept
  // textual forms that contain `EventListener`.
  if (name === 'EventListener') return true;
  if (text.includes('EventListener')) return true;
  return false;
}

/**
 *
 */
async function main() {
  console.log('[verify] running generator...');
  const genOk = runGenerator();
  if (!genOk) process.exit(2);

  try {
    const manifest = loadManifest();
    const errors = verify(manifest);
    if (errors.length) {
      console.error('[verify] FAILED — problems found:');
      for (const e of errors) console.error('  -', e);
      process.exit(1);
    }
    console.log('[verify] OK — basic manifest checks passed');
    process.exit(0);
  } catch (e) {
    console.error('[verify] error:', e && e.message);
    process.exit(2);
  }
}

main();
