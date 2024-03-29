import { generateUID } from './uid.js';

/**
 * Property are bound to an ID+Node
 * Values are either getter or via an function
 * @template {any} T
 * @typedef {Object} InlineFunctionEntry
 * @prop {(data:T) => any} fn
 * @prop {string[]} [props]
 * @prop {string[][]} [deepProps]
 * @prop {string[]} [injectionProps]
 * @prop {string[][]} [injectionDeepProps]
 * @prop {T} [defaultValue]
 */

/** @type {Document} */
let _inactiveDocument;

/** @type {DocumentFragment} */
let _blankFragment;

/** @type {Range} */
let _fragmentRange;

/**
 * @param {string} [fromString]
 * @return {DocumentFragment}
 */
export function generateFragment(fromString) {
  _inactiveDocument ??= document.implementation.createHTMLDocument();
  if (!fromString) {
    _blankFragment ??= _inactiveDocument.createDocumentFragment();
    return /** @type {DocumentFragment} */ (_blankFragment.cloneNode());
  }
  _fragmentRange ??= _inactiveDocument.createRange();
  return _fragmentRange.createContextualFragment(fromString);
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

/** @type {Map<string, DocumentFragment>} */
const fragmentCache = new Map();
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

  if (tempSlots) {
    const fragment = generateFragment(compiledString);
    for (const [id, element] of tempSlots) {
      const slot = fragment.getElementById(id);
      slot.replaceWith(element);
    }
    return fragment;
  }

  let fragment;
  if (fragmentCache.has(compiledString)) {
    fragment = fragmentCache.get(compiledString);
  } else {
    fragment = generateFragment(compiledString);
    fragmentCache.set(compiledString, fragment);
  }

  return /** @type {DocumentFragment} */ (fragment.cloneNode(true));
}
