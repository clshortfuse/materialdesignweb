/* eslint-disable no-bitwise */
/** @typedef {import('./identify.js').ElementIdentifier} ElementIdentifier */
/** @typedef {import('./identify.js').ElementIdentifierKey} ElementIdentifierKey */

import { identifierFromKey } from './identify.js';

/**
 * @param {Element|DocumentFragment} root
 * @param {ElementIdentifier|ElementIdentifierKey} identifierOrKey
 * @return {Element}
 */
export const findElement = (root, identifierOrKey) => {
  const identifier = typeof identifierOrKey === 'string'
    ? identifierFromKey(identifierOrKey)
    : identifierOrKey;

  if (identifier.id) {
    if (root instanceof DocumentFragment) {
      return root.getElementById(identifier.id);
    }
    return root.querySelector(`#${identifier.id}`);
  }
  if (identifier.class) {
    if (root instanceof DocumentFragment) {
      return root.querySelector(`.${identifier.class}`);
    }
    return root.getElementsByClassName(identifier.class)[0];
  }
  return root.querySelector(identifier.query);
};

/**
 * @template {Node} R
 * @template {boolean} [E=null]
 * @template {boolean} [A=null]
 * @template {boolean} [T=null]
 * @template {boolean} [C=null]
 * @template {boolean} [S=null]
 * @param {R} root Root node to walk
 * @param {Object} filter Tree walking options
 * @param {E} [filter.element] Yield elements
 * @param {A} [filter.attribute] Yield attributes
 * @param {T} [filter.text] Yield Text node
 * @param {C} [filter.comment] Yield Comment nodes
 * @param {S} [filter.self] Yield Comment nodes
 * @yields {
 *  (E extends null ? null : Element) |
 *  (A extends null ? null : Attr) |
 *  (T extends null ? null : Text) |
 *  (C extends null ? null : Comment) |
 *  (S extends null ? null : R)
 * }
 * @return {Generator<
 *  (E extends null ? null : Element) |
 *  (A extends null ? null : Attr) |
 *  (T extends null ? null : Text) |
 *  (C extends null ? null : Comment) |
 *  (S extends null ? null : R)
 * >} Iterable
 */
export function* iterateNodes(root, filter = {}) {
  let whatToShow = 0;
  if (filter.element || filter.attribute) whatToShow |= NodeFilter.SHOW_ELEMENT;
  if (filter.text) whatToShow |= NodeFilter.SHOW_TEXT;
  if (filter.comment) whatToShow |= NodeFilter.SHOW_COMMENT;
  // @ts-ignore Not castable
  if (filter.self) yield root;
  const iterator = document.createTreeWalker(root, whatToShow);
  let node;
  while ((node = iterator.nextNode())) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (filter.element) {
          // @ts-ignore Not castable
          yield node;
        }
        if (filter.attribute) {
          // Spread used to avoid mutation
          // eslint-disable-next-line unicorn/no-useless-spread
          for (const attr of [...(/** @type {Element} */ (node)).attributes]) {
            // @ts-ignore Not castable
            yield attr;
          }
        }
        break;
      case Node.COMMENT_NODE:
        // @ts-ignore Not castable
        yield node;
        break;
      case Node.TEXT_NODE:
        // @ts-ignore Not castable
        yield node;
        break;
      default:
    }
  }
}

/**
 * @param {any} value
 * @return {?string}
 */
export function attrValueFromDataValue(value) {
  switch (value) {
    case undefined:
    case null:
    case false:
      return null;
    case true:
      return '';
    default:
      return String(value);
  }
}

/**
 * Converts property name to attribute name
 * (Similar to DOMStringMap)
 * @param {string} name
 * @return {string}
 */
export function attrNameFromPropName(name) {
  const attrNameWords = name.split(/([A-Z])/);
  if (attrNameWords.length === 1) return name;
  return attrNameWords.reduce((prev, curr) => {
    if (prev == null) return curr;
    if (curr.length === 1 && curr.toUpperCase() === curr) {
      return `${prev}-${curr.toLowerCase()}`;
    }
    return prev + curr;
  });
}

/**
 * @param {HTMLElement} element
 * @param {Parameters<HTMLElement['focus']>} [options]
 * @return {boolean} Focus was successful
 */
export function attemptFocus(element, ...options) {
  if (!element) return false;
  try {
    element.focus(...options);
  } catch (e) {
    console.error(e);
    // Ignore error.
  }
  const focused = document.activeElement === element;
  if (!focused) {
    console.warn('Element was not focused', element);
    return false;
  }
  return true;
}

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isRtl(element) {
  return getComputedStyle(element).direction === 'rtl';
}
