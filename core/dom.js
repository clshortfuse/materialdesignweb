/* eslint-disable no-bitwise */

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
  if (element?.getRootNode() === document) return false; // isInLightDOM
  // console.debug('checking shadowdom', element, element.matches(':focus'));
  return element.matches(':focus');
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
