import { generateUID } from './identify.js';

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

/** @type {boolean} */
let _cssStyleSheetConstructable;

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
 * @param {TemplateStringsArray} array
 * @param  {...(string)} substitutions
 * @return {HTMLStyleElement|CSSStyleSheet}
 */
export function css(array, ...substitutions) {
  const content = String.raw({ raw: array }, ...substitutions);
  if (_cssStyleSheetConstructable == null) {
    try {
      const sheet = new CSSStyleSheet();
      _cssStyleSheetConstructable = true;
      sheet.replaceSync(content);
      return sheet;
    } catch {
      _cssStyleSheetConstructable = false;
    }
  }
  if (_cssStyleSheetConstructable) {
    const sheet = new CSSStyleSheet();
    _cssStyleSheetConstructable = true;
    sheet.replaceSync(content);
    return sheet;
  }

  _inactiveDocument ??= document.implementation.createHTMLDocument();
  const style = _inactiveDocument.createElement('style');
  style.textContent = content;
  return style;
}

/**
 * @template T1
 * @template T2
 * @param {TemplateStringsArray} strings
 * @param  {...(string|DocumentFragment|Element|((this:T1, data:T2) => any))} substitutions
 * @return {DocumentFragment}
 */
export function html(strings, ...substitutions) {
  /** @type {Map<string, DocumentFragment|Element>} */
  let tempSlots;
  const replacements = substitutions.map((sub) => {
    switch (typeof sub) {
      case 'string': return sub;
      case 'function': return addInlineFunction(sub);
      case 'object': {
        if (sub == null) {
          console.warn(sub, 'is null', strings);
          return '';
        }
        // Assume Element
        const tempId = generateUID();
        tempSlots ??= new Map();
        tempSlots.set(tempId, sub);
        return `<div id="${tempId}"></div>`;
      }
      default:
        throw new Error(`Unexpected substitution: ${sub}`);
    }
  });
  const compiledString = String.raw({ raw: strings }, ...replacements);
  const fragment = generateFragment(compiledString);
  if (tempSlots) {
    for (const [id, element] of tempSlots) {
      const slot = fragment.getElementById(id);
      slot.after(element);
      slot.remove();
    }
  }

  return fragment;
}
