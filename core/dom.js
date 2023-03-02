/* eslint-disable no-bitwise */

/**
 * @param {Element|DocumentFragment} root
 * @param {string} id
 * @return {Element}
 */
export const findElement = (root, id) => {
  if (root instanceof DocumentFragment) {
    return root.getElementById(id);
  }
  return root.querySelector(`#${id}`);
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
      return `${value}`;
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
 * @param {Element} element
 * @return {boolean}
 */
export function isInLightDOM(element) {
  return element?.getRootNode() === document;
}

const IS_FIREFOX = globalThis?.navigator?.userAgent.includes('Firefox');

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isFocused(element) {
  if (!element) return false;
  if (IS_FIREFOX && element.constructor.formAssociated && element.hasAttribute('disabled')) {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1818287
    console.warn('Firefox bug 1818287: Disabled form associated custom element cannot receive focus.');
    return false;
  }
  if (document.activeElement === element) return true;
  if (!element.isConnected) return false;
  if (isInLightDOM(element)) return false;
  // console.debug('checking shadowdom', element, element.matches(':focus'));
  return element.matches(':focus');
}

/**
 * @param {Element} scope
 * @return {Element|null}
 */
export function getActiveElement(scope) {
  if (!scope) return document.activeElement;
  const root = scope.getRootNode();
  if (root instanceof ShadowRoot) {
    return root.activeElement;
  }
  return null;
}

/**
 * @param {HTMLElement|Element} element
 * @param {Parameters<HTMLElement['focus']>} [options]
 * @return {boolean} Focus was successful
 */
export function attemptFocus(element, ...options) {
  if (!element) return false;
  try {
    // @ts-expect-error Use catch if not HTMLElement
    element.focus(...options);
  } catch (e) {
    console.error(e);
    return false;
    // Ignore error.
  }
  return isFocused(element);
}

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isRtl(element) {
  return getComputedStyle(element).direction === 'rtl';
}
