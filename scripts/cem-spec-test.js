#!/usr/bin/env node
/* eslint-disable no-console */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Run the generator synchronously and stream output to the parent process.
 */
// Parse CLI args once so verifier and generator stay in sync.
const RAW_ARGS = process.argv.slice(2);
let REQUESTED_VERBOSE = false;
let REQUESTED_SKIP_GENERATE = false;
for (const a of RAW_ARGS) {
  if (a === '-v' || a === '--verbose') {
    REQUESTED_VERBOSE = true; continue;
  }
  if (a === '--skip-generate') {
    REQUESTED_SKIP_GENERATE = true; continue;
  }
  if (!a.startsWith('-')) {
    throw new Error('Focused verification is not supported; the canonical manifest must remain complete');
  }
}

/**
 *
 */
function runGenerator() {
  try {
    const cmd = `node scripts/cem-generate.js${REQUESTED_VERBOSE ? ' -v' : ''}`;
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
  const manifestPath = path.resolve('api/custom-elements.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest not found: ${manifestPath}`);
  }
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

/**
 *
 * @param {unknown} p
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
 * @param {{href?: string, file?: string}|null|undefined} source
 * @return {string}
 */
function sourceModule(source) {
  const value = String(source?.href || source?.file || '');
  return normalize(/\/blob\/main\/([^#?]+\.js)(?:[#?]|$)/.exec(value)?.[1] || '');
}

/** @param {string} value @return {string} */
function attributeToFieldName(value) {
  return value.replaceAll(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
}

/**
 * Convert an `onX` listener property name to an event name.
 * Examples: `onAction` or `onaction` -> `action`, `onValueChanged` -> `value-changed`.
 * @param {string} prop
 * @return {string}
 */
function listenerPropToEventName(prop) {
  if (!prop || !prop.startsWith('on')) return '';
  const rest = prop.slice(2);
  if (!rest) return '';
  const withDashes = rest.replaceAll(/([\da-z])([A-Z])/g, '$1-$2');
  return withDashes.replaceAll(/[\s_]+/g, '-').toLowerCase();
}

/**
 * @param {{name?: string, text?: string}|null|undefined} type
 * @return {boolean}
 */
function typeLooksLikeEventListener(type) {
  if (!type) return false;
  const name = String(type.name || '');
  const text = String(type.text || '');
  return name === 'EventListener' || text.includes('EventListener');
}

/**
 * @param {any} manifest
 * @return {string[]}
 */
function verify(manifest) {
  const errors = [];
  const modules = /** @type {Array<any>} */ (manifest.modules || []);
  const componentFiles = /** @type {string[]} */ (fs.readdirSync(path.resolve('components')))
    .filter((file) => file.endsWith('.js'));
  for (const componentFile of componentFiles) {
    const expectedModule = `components/${componentFile}`;
    const componentModule = modules.find((module) => normalize(module.path) === expectedModule);
    if (!componentModule) {
      errors.push(`manifest missing canonical component module ${expectedModule}`);
      continue;
    }
    const declaration = (componentModule.declarations || [])
      .find((item) => item?.kind === 'class');
    if (!declaration || declaration.customElement !== true) {
      errors.push(`${expectedModule} missing custom-element class declaration`);
    }
    const defaultExport = (componentModule.exports || [])
      .some((item) => item?.kind === 'js' && item.name === 'default');
    if (!defaultExport) {
      errors.push(`${expectedModule} missing default JavaScript export`);
    }
    if (declaration?.tagName && !(componentModule.exports || []).some((item) => (
      item?.kind === 'custom-element-definition' && item.name === declaration.tagName
    ))) {
      errors.push(`${expectedModule} missing definition export for ${declaration.tagName}`);
    }
  }
  const IMPLEMENTATION_MEMBERS = new Set([
    'attributeCache',
    'attributeChangedCallback',
    'callbackArguments',
    'compose',
    'composition',
    'connectedCallback',
    'disconnectedCallback',
    'elementInternals',
    'formAssociatedCallback',
    'formDisabledCallback',
    'formResetCallback',
    'formStateRestoreCallback',
    'formIPCEvent',
    'patch',
    'performImplicitSubmission',
    'propChangedCallback',
    'refreshFormAssociation',
    'refs',
    'render',
    'static',
  ]);

  // CEM describes the element API consumed by authors, not the fluent class
  // builder, lifecycle implementation, or private runtime state.
  for (const mod of modules) {
    for (const decl of (mod.declarations || [])) {
      for (const member of (decl.members || [])) {
        const qualifiedName = `${mod.path}::${decl.name}.${member?.name || '(unnamed)'}`;
        if (member?.static === true) {
          errors.push(`${qualifiedName} exposes static implementation API`);
        }
        if (member?.name?.startsWith('#') || member?.name?.startsWith('_')) {
          errors.push(`${qualifiedName} exposes a private/internal member`);
        }
        if (/^on[A-Z]/.test(member?.name || '')) {
          errors.push(`${qualifiedName} exposes an implementation callback`);
        }
        if (IMPLEMENTATION_MEMBERS.has(member?.name)) {
          errors.push(`${qualifiedName} exposes lifecycle/runtime implementation API`);
        }
        if (member?.inheritedFrom && sourceModule(member.source) === normalize(mod.path)) {
          errors.push(`${qualifiedName} is locally declared but marked inherited`);
        }
        const providerModule = sourceModule(member?.source);
        if (decl.kind === 'class' && providerModule.startsWith('mixins/')
            && normalize(member?.inheritedFrom?.module) !== providerModule) {
          errors.push(`${qualifiedName} expected ultimate provider ${providerModule}`);
        }
      }
      if (decl.kind === 'class') {
        for (const attribute of (decl.attributes || [])) {
          const fieldName = attribute.fieldName || attributeToFieldName(attribute.name);
          const field = (decl.members || []).find((member) => member.name === fieldName);
          if (!field) continue;
          const qualifiedName = `${mod.path}::${decl.name} attribute ${attribute.name}`;
          if (sourceModule(field.source) === normalize(mod.path) && attribute.inheritedFrom) {
            errors.push(`${qualifiedName} is locally declared but marked inherited`);
          } else if (field.inheritedFrom
              && normalize(attribute.inheritedFrom?.module)
                !== normalize(field.inheritedFrom.module)) {
            errors.push(`${qualifiedName} does not match member provider ${field.inheritedFrom.module}`);
          }
        }
      }
    }
  }

  const serializedManifest = JSON.stringify(manifest);
  const workspacePath = normalize(process.cwd());
  if (serializedManifest.includes(workspacePath)
      || /\bimport\\?\(["'](?:file:\/\/|\/|[A-Za-z]:[/\\])/.test(serializedManifest)) {
    errors.push('manifest contains a machine-local absolute path');
  }

  // Specific expectations used by tests below. Keep these small and focused —
  // they assert a handful of important attributes/properties and mixin members
  // to guard against regressions in provenance and member synthesis.
  // Only expect members actually declared on Button itself (not mixin-origin members).
  const EXPECTED_BUTTON_MEMBERS = [
    { name: 'elevated', source: 'components/Button.js' },
  ];

  /** @type {Record<string, {fields: string[], methods: string[], attrs?: string[], returns?: Record<string, string>}>} */
  const EXPECTED_MIXIN_MEMBERS = {
    'mixins/ControlMixin.js': {
      fields: ['focusableOnDisabled', 'controlVoidElement', 'controlTagName'],
      methods: ['click'],
      returns: { click: 'void' },
    },
    'mixins/DelegatesFocusMixin.js': { fields: ['delegatesFocus'], methods: [] },
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

  // 2) Validate Button's own and inherited effective public API.
  // Validate representative Button contracts on the complete manifest.
  {
    const btnMod = modules.find((m) => normalize(m.path) === 'components/Button.js');
    if (btnMod) {
      const btnDecl = (btnMod.declarations || []).find((d) => d.kind === 'class' && d.name === 'Button');
      if (btnDecl) {
      // Ensure Button declaration looks like a custom element and has a superclass
        if (btnDecl.customElement !== true) {
          errors.push('Button declaration not marked as customElement');
        }
        if (!btnDecl.superclass) {
          errors.push('Button declaration missing superclass');
        }
        // Validate Button members have names/kinds and sources when present
        for (const mm of (btnDecl.members || [])) {
          if (!mm || !mm.name) {
            errors.push('Button has member with missing name'); continue;
          }
          if (!mm.kind) {
            errors.push(`Button.${mm.name} missing kind`);
          }
          if (mm.source && !hasHrefOrFile(mm.source)) {
            errors.push(`Button.${mm.name} has source but missing href/file`);
          }
          // Effective inherited API must retain machine-readable provenance.
          if (mm.kind === 'method' && mm.source) {
            const href = (mm.source && (mm.source.href || mm.source.file || mm.source)) || '';
            if (String(href).includes('mixins/') && !mm.inheritedFrom) {
              errors.push(`Button.${mm.name} is sourced from a mixin but is missing inheritedFrom provenance`);
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

        // --- Ensure representative inherited author APIs are present and attributed.
        const EXPECTED_BUTTON_INHERITED_MEMBERS = ['delegatesFocus', 'href'];
        for (const inheritedName of EXPECTED_BUTTON_INHERITED_MEMBERS) {
          const found = (btnDecl.members || []).find((mm) => mm && mm.name === inheritedName);
          if (!found) {
            errors.push(`Button missing effective inherited member '${inheritedName}'`);
          } else if (!found.inheritedFrom) {
            errors.push(`Button.${inheritedName} missing inheritedFrom provenance`);
          }
        }
        const delegatesFocus = (btnDecl.members || []).find((mm) => mm?.name === 'delegatesFocus');
        if (normalize(delegatesFocus?.inheritedFrom?.module) !== 'mixins/DelegatesFocusMixin.js') {
          errors.push(`Button.delegatesFocus expected ultimate provider mixins/DelegatesFocusMixin.js but found ${normalize(delegatesFocus?.inheritedFrom?.module) || '(missing)'}`);
        }

        // Precompute Button attributes once for mixin attribute checks
        const btnAttrs = new Set(((btnDecl.attributes || []).map((at) => at && at.name).filter(Boolean)));

        // --- Validate selected mixin modules declare expected members (fields & methods)
        for (const [mPath, info] of Object.entries(EXPECTED_MIXIN_MEMBERS)) {
          const mixMod = modules.find((mod) => normalize(mod.path) === mPath);
          if (!mixMod) {
            errors.push(`expected mixin module ${mPath} missing`);
            continue;
          }
          const mixDecl = (mixMod.declarations || []).find((d) => d && d.kind === 'mixin');
          if (!mixDecl) {
            errors.push(`${mPath} has no mixin declaration`);
            continue;
          }
          const memberNames = new Set((mixDecl.members || []).map((mm) => mm && mm.name).filter(Boolean));
          for (const f of (info.fields || [])) {
            if (!memberNames.has(f)) {
              errors.push(`${mPath} mixin missing field ${f}`);
            }
          }
          for (const meth of (info.methods || [])) {
            const mem = (mixDecl.members || []).find((mm) => mm && mm.name === meth);
            if (!mem) {
              errors.push(`${mPath} mixin missing method ${meth}`);
              continue;
            }
            if (mem.kind !== 'method') {
              errors.push(`${mPath}.${meth} expected kind 'method' but is ${mem.kind}`);
            }
            const expectedReturn = info.returns?.[meth];
            if (expectedReturn && mem.return?.type?.text !== expectedReturn) {
              errors.push(`${mPath}.${meth} expected return type ${expectedReturn} but found ${mem.return?.type?.text || '(missing)'}`);
            }
            // Ensure Button exposes the effective inherited method with provenance.
            const btnMeth = (btnDecl.members || []).find((mm) => mm && mm.name === meth);
            if (!btnMeth && actualMixins.includes(mPath)) {
              errors.push(`Button missing effective inherited method ${meth}`);
            } else if (btnMeth && btnMeth.kind !== 'method') {
              errors.push(`Button.${meth} expected inherited kind 'method' but is ${btnMeth.kind}`);
            } else if (btnMeth && !btnMeth.inheritedFrom) {
              errors.push(`Button.${meth} missing inheritedFrom provenance`);
            }
          }
          // Validate expected attributes declared by mixins.
          // Attributes are runtime/DOM concepts. The mixin itself should
          // declare the attribute, and the component's effective API should
          // expose it with inheritedFrom provenance.
          const mixAttrs = new Set(((mixDecl.attributes || []).map((at) => at && at.name).filter(Boolean)));
          for (const a of (info.attrs || [])) {
            if (!mixAttrs.has(a)) {
              errors.push(`${mPath} mixin missing runtime attribute '${a}'`);
            }
            if (btnAttrs.has(a)) {
              const btnAttr = (btnDecl.attributes || []).find((at) => at && at.name === a);
              if (normalize(btnAttr?.inheritedFrom?.module) !== mPath) {
                errors.push(`Button attribute '${a}' missing inheritedFrom ${mPath}`);
              }
            } else {
              errors.push(`Button missing effective inherited attribute '${a}'`);
            }
          }
        }
      } else {
        errors.push('Button declaration missing');
      }
    } else {
      errors.push('components/Button.js module missing');
    }
  }

  // --- Ensure `ListOption` does not expose internal non-enumerable members
  {
    const listMod = modules.find((m) => normalize(m.path) === 'components/ListOption.js');
    if (listMod) {
      const listDecl = (listMod.declarations || []).find((d) => d && d.kind === 'class' && d.name === 'ListOption');
      if (listDecl) {
        const internal = (listDecl.members || []).find((mm) => mm && mm.name === '_supportingSlotted');
        if (internal) {
          errors.push('ListOption must not declare \'_supportingSlotted\' (internal/non-enumerable)');
        }
        // Ensure ListOption reports its current shared implementation base.
        const superRef = listDecl.superclass;
        if (superRef) {
          const superMod = normalize(superRef.module || superRef.package || '');
          if (superMod !== 'components/ListItemBase.js') {
            errors.push(`ListOption superclass expected components/ListItemBase.js but found ${superMod || JSON.stringify(superRef)}`);
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

  // --- Guard focused List/Menu public contracts added by the interaction work.
  const COMPONENT_CONTRACTS = [
    {
      module: 'components/List.js',
      name: 'List',
      members: { multiAction: 'boolean' },
      attributes: { 'multi-action': 'boolean' },
    },
    {
      module: 'components/ListItem.js',
      name: 'ListItem',
      members: { actionable: 'boolean', onaction: 'EventListener' },
      attributes: { actionable: 'boolean' },
      events: ['action'],
    },
    {
      module: 'components/MenuItem.js',
      name: 'MenuItem',
      members: { onaction: 'EventListener' },
      events: ['action'],
    },
    {
      module: 'components/Listbox.js',
      name: 'Listbox',
      members: {
        options: 'HTMLCollectionOf<InstanceType<typeof ListOption>> & HTMLOptionsCollection',
        selectedOptions: 'HTMLCollectionOf<InstanceType<typeof ListOption>>',
        selectedIndex: 'number',
      },
      events: ['input', 'change'],
    },
  ];
  for (const contract of COMPONENT_CONTRACTS) {
    const componentModule = modules.find((m) => normalize(m.path) === contract.module);
    const declaration = (componentModule?.declarations || [])
      .find((d) => d?.kind === 'class' && d.name === contract.name);
    if (!declaration) {
      errors.push(`${contract.module} declaration ${contract.name} missing`);
      continue;
    }
    for (const [memberName, expectedType] of Object.entries(contract.members || {})) {
      const member = (declaration.members || []).find((m) => m?.name === memberName);
      if (!member) {
        errors.push(`${contract.name} missing member ${memberName}`);
      } else if (expectedType && member.type?.text !== expectedType) {
        errors.push(`${contract.name}.${memberName} expected type ${expectedType} but found ${member.type?.text || '(missing)'}`);
      }
    }
    for (const [attributeName, expectedType] of Object.entries(contract.attributes || {})) {
      const attribute = (declaration.attributes || []).find((a) => a?.name === attributeName);
      if (!attribute) {
        errors.push(`${contract.name} missing attribute ${attributeName}`);
      } else if (attribute.type?.text !== expectedType) {
        errors.push(`${contract.name} attribute ${attributeName} expected type ${expectedType} but found ${attribute.type?.text || '(missing)'}`);
      }
    }
    for (const eventName of contract.events || []) {
      if (!(declaration.events || []).some((event) => event?.name === eventName)) {
        errors.push(`${contract.name} missing event ${eventName}`);
      }
    }
  }

  /** @param {string} modulePath @param {string} [name] */
  const declarationFor = (modulePath, name) => modules
    .find((module) => normalize(module.path) === modulePath)?.declarations
    ?.find((declaration) => (name ? declaration.name === name : declaration.kind === 'mixin'));

  const listDeclaration = declarationFor('components/List.js', 'List');
  const listboxDeclaration = declarationFor('components/Listbox.js', 'Listbox');
  if (!(listDeclaration?.members || []).some((member) => member.name === 'multiAction')
      || !(listDeclaration?.attributes || []).some((attribute) => attribute.name === 'multi-action')) {
    errors.push('List must expose its multiAction property and multi-action attribute');
  }
  if ((listboxDeclaration?.members || []).some((member) => member.name === 'multiAction')
      || (listboxDeclaration?.attributes || []).some((attribute) => attribute.name === 'multi-action')) {
    errors.push('Listbox must honor .undefine(\'multiAction\') in its effective API');
  }

  const listItemDeclaration = declarationFor('components/ListItem.js', 'ListItem');
  for (const internalName of [
    'anchorHref',
    'showPrimaryAction',
    'showExpansionAction',
    'showExpandableIcon',
  ]) {
    if ((listItemDeclaration?.members || []).some((member) => member.name === internalName)) {
      errors.push(`ListItem exposes internal template expression '${internalName}'`);
    }
  }

  /** @type {Array<[string, string, boolean]>} */
  const shapeOwners = [
    ['components/ListItem.js', 'ListItem', true],
    ['components/ListOption.js', 'ListOption', false],
    ['components/MenuItem.js', 'MenuItem', false],
  ];
  for (const [modulePath, declarationName, expected] of shapeOwners) {
    const declaration = declarationFor(modulePath, declarationName);
    const hasMember = (declaration?.members || []).some((member) => member.name === 'shapeStyle');
    const hasAttribute = (declaration?.attributes || [])
      .some((attribute) => attribute.name === 'shape-style');
    if (hasMember !== expected || hasAttribute !== expected) {
      errors.push(`${declarationName} Shape API ownership does not match its concrete mixin contract`);
    }
  }

  const formAssociated = declarationFor('mixins/FormAssociatedMixin.js');
  for (const methodName of ['checkValidity', 'reportValidity']) {
    const method = (formAssociated?.members || []).find((member) => member.name === methodName);
    if (method?.return?.type?.text !== 'boolean') {
      errors.push(`FormAssociatedMixin.${methodName} expected boolean return`);
    }
  }
  const setCustomValidity = (formAssociated?.members || [])
    .find((member) => member.name === 'setCustomValidity');
  if (setCustomValidity?.parameters?.[0]?.name !== 'error'
      || setCustomValidity?.parameters?.[0]?.type?.text !== 'string') {
    errors.push('FormAssociatedMixin.setCustomValidity expected error: string parameter');
  }

  const inputMixin = declarationFor('mixins/InputMixin.js');
  const setRangeText = (inputMixin?.members || []).find((member) => member.name === 'setRangeText');
  const rangeParameters = setRangeText?.parameters || [];
  if (rangeParameters[0]?.name !== 'replacement' || rangeParameters[0]?.type?.text !== 'string'
      || rangeParameters[1]?.name !== 'start' || rangeParameters[1]?.optional !== true
      || rangeParameters[2]?.name !== 'end' || rangeParameters[2]?.optional !== true
      || rangeParameters[3]?.optional !== true) {
    errors.push('InputMixin.setRangeText overloads were not merged into optional range parameters');
  }

  const popupMixin = declarationFor('mixins/PopupMixin.js');
  const showPopup = (popupMixin?.members || []).find((member) => member.name === 'showPopup');
  const closePopup = (popupMixin?.members || []).find((member) => member.name === 'close');
  if (showPopup?.parameters?.[1]?.optional !== true || showPopup?.parameters?.[2]?.optional !== true) {
    errors.push('PopupMixin.showPopup defaulted parameters must be optional');
  }
  if (showPopup?.parameters?.[1]?.default !== 'true'
      || showPopup?.parameters?.[2]?.default !== 'null') {
    errors.push('PopupMixin.showPopup parameter defaults were not preserved');
  }
  if (closePopup?.parameters?.some((parameter) => parameter.optional !== true)) {
    errors.push('PopupMixin.close defaulted parameters must be optional');
  }
  if (closePopup?.parameters?.[0]?.default !== 'undefined'
      || closePopup?.parameters?.[1]?.default !== 'true') {
    errors.push('PopupMixin.close parameter defaults were not preserved');
  }

  const EXPECTED_EFFECTIVE_EVENTS = {
    'components/Input.js': { name: 'Input', events: ['input', 'change'] },
    'components/Dialog.js': { name: 'Dialog', events: ['cancel', 'close'] },
    'components/Popup.js': { name: 'Popup', events: ['cancel', 'close'] },
    'components/Card.js': {
      name: 'Card',
      events: ['mdw-card:expandedchange', 'mdw-card:expandablechange'],
    },
  };
  for (const [modulePath, contract] of Object.entries(EXPECTED_EFFECTIVE_EVENTS)) {
    const declaration = declarationFor(modulePath, contract.name);
    for (const eventName of contract.events) {
      if (!(declaration?.events || []).some((event) => event.name === eventName)) {
        errors.push(`${modulePath} missing effective event '${eventName}'`);
      }
    }
  }

  const cardStateTarget = (declarationFor('components/Card.js', 'Card')?.members || [])
    .find((member) => member.name === 'stateTargetElement');
  if (cardStateTarget?.inheritedFrom) {
    errors.push('Card.stateTargetElement is locally overridden and must not be marked inherited');
  }
  const badgeMembers = declarationFor('components/Badge.js', 'Badge')?.members || [];
  for (const forbidden of ['disabledState', 'focusedState', 'stateTargetElement']) {
    if (badgeMembers.some((member) => member.name === forbidden)) {
      errors.push(`Badge exposes constraint-only StateMixin member '${forbidden}'`);
    }
  }
  const bottomAppBarMembers = declarationFor('components/BottomAppBar.js', 'BottomAppBar')?.members || [];
  if (bottomAppBarMembers.filter((member) => member.name === 'ariaLabel').length > 1) {
    errors.push('BottomAppBar duplicates AriaReflectorMixin members through a diamond dependency');
  }
  const bottomAppBarColor = (declarationFor('components/BottomAppBar.js', 'BottomAppBar')?.attributes || [])
    .find((attribute) => attribute.name === 'color');
  if (bottomAppBarColor?.inheritedFrom) {
    errors.push('BottomAppBar color is locally overridden and must not be marked inherited');
  }
  const bottomAppBarKbdNav = bottomAppBarMembers.find((member) => member.name === 'kbdNav');
  if (normalize(bottomAppBarKbdNav?.inheritedFrom?.module) !== 'mixins/KeyboardNavMixin.js') {
    errors.push('BottomAppBar.kbdNav expected ultimate provider mixins/KeyboardNavMixin.js');
  }
  const bottomAppBarKbdNavAttribute = (declarationFor('components/BottomAppBar.js', 'BottomAppBar')?.attributes || [])
    .find((attribute) => attribute.name === 'kbd-nav');
  if (normalize(bottomAppBarKbdNavAttribute?.inheritedFrom?.module)
      !== 'mixins/KeyboardNavMixin.js') {
    errors.push('BottomAppBar kbd-nav expected ultimate provider mixins/KeyboardNavMixin.js');
  }

  // Internal callbacks named `on*` are not event-handler properties.
  const FORBIDDEN_INFERRED_EVENTS = [
    ['components/BottomSheet.js', 'drag-handle-active'],
    ['components/Input.js', 'listbox-click'],
    ['components/Listbox.js', 'listbox-click'],
  ];
  for (const [modulePath, eventName] of FORBIDDEN_INFERRED_EVENTS) {
    const componentModule = modules.find((m) => normalize(m.path) === modulePath);
    const declaration = (componentModule?.declarations || []).find((d) => d?.customElement);
    if ((declaration?.events || []).some((event) => event?.name === eventName)) {
      errors.push(`${modulePath} exposes false inferred event '${eventName}'`);
    }
  }

  // --- Verify an observable event-handler property implies an event.
  // Specifically check `components/Card.js`, which defines `onaction` in
  // source and should fire an `action` event.
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
 * Verify either the current artifact or a freshly generated one.
 */
function main() {
  if (REQUESTED_SKIP_GENERATE) {
    console.log('[verify] using previously generated manifest...');
  } else {
    console.log('[verify] running generator...');
    const genOk = runGenerator();
    if (!genOk) {
      process.exit(2);
    }
  }

  try {
    const manifest = loadManifest();
    const errors = verify(manifest);
    if (errors.length) {
      console.error('[verify] FAILED — problems found:');
      for (const e of errors) {
        console.error('  -', e);
      }
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
