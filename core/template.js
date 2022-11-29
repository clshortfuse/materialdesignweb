import { generateUID } from './identify.js';

/**
 * @template T1
 * @template [T2=T1]
 * @callback HTMLTemplater
 * @param {TemplateStringsArray} strings
 * @param  {...(string|Element|((this:T1, data:T2) => any))} substitutions
 * @return {DocumentFragment}
 */

/**
 * Property are bound to an ID+Node
 * Values are either getter or via an function
 * @template {any} T
 * @typedef {Object} InlineFunctionEntry
 * @prop {(data:T) => any} fn
 * @prop {Set<keyof T & string>} [props]
 * @prop {T} [defaultValue]
 */

/** @type {Document} */
let _inactiveDocument;

/**
 * @param {string} [fromString]
 * @return {DocumentFragment}
 */
export function generateFragment(fromString) {
  _inactiveDocument ??= document.implementation.createHTMLDocument();
  if (fromString == null) {
    return _inactiveDocument.createDocumentFragment();
  }
  return _inactiveDocument.createRange().createContextualFragment(fromString);
}

/** @type {Map<string, InlineFunctionEntry<?>>} */
export const inlineFunctions = new Map();

/**
 * @template T
 * @typedef {Object} RenderOptions
 * @prop {Object} context
 * @prop {ParentNode} root
 * @prop {Object<string, HTMLElement>} refs
 */

/**
 * @param {(data: Partial<any>) => any} fn
 * @return {string}
 */
export function addInlineFunction(fn) {
  const internalName = `#${generateUID()}`;
  inlineFunctions.set(internalName, { fn });
  return `{${internalName}}`;
}

/**
 * @param {TemplateStringsArray} strings
 * @param  {...(string)} substitutions
 * @return {HTMLStyleElement}
 */
export function css(strings, ...substitutions) {
  const el = document.createElement('style');
  el.textContent = String.raw({ raw: strings }, ...substitutions);
  return el;
}

/**
 * @template T1
 * @template T2
 * @param {TemplateStringsArray} strings
 * @param  {...(string|Element|((this:T1, data:T2) => any))} substitutions
 * @return {DocumentFragment}
 */
export function html(strings, ...substitutions) {
  /** @type {Map<string, Element>} */
  const tempSlots = new Map();
  const replacements = substitutions.map((sub) => {
    switch (typeof sub) {
      case 'string': return sub;
      case 'function': return addInlineFunction(sub);
      case 'object': {
        // Assume Element
        const tempId = generateUID();
        tempSlots.set(tempId, sub);
        return `<div id="${tempId}"></div>`;
      }
      default:
        throw new Error(`Unexpected substitution: ${String(sub)}`);
    }
  });
  const compiledString = String.raw({ raw: strings }, ...replacements);
  const fragment = generateFragment(compiledString);
  for (const [id, element] of tempSlots) {
    const slot = fragment.getElementById(id);
    slot.after(element);
    slot.remove();
  }

  return fragment;
}
