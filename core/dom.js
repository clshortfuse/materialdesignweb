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

/** @type {Map<string, string>} */
let attrNameFromPropNameCache;

/**
 * Converts property name to attribute name
 * (Similar to DOMStringMap)
 * @param {string} name
 * @return {string}
 */
export function attrNameFromPropName(name) {
  attrNameFromPropNameCache ??= new Map();
  if (attrNameFromPropNameCache.has(name)) {
    return attrNameFromPropNameCache.get(name);
  }
  // eslint-disable-next-line unicorn/prefer-string-replace-all
  const value = name.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
  attrNameFromPropNameCache.set(name, value);
  return value;
}

export const CHROME_VERSION = Number.parseFloat(navigator.userAgent.match(/Chrome\/([\d.]+)/)?.[1]);
export const FIREFOX_VERSION = Number.parseFloat(navigator.userAgent.match(/Firefox\/([\d.]+)/)?.[1]);
export const SAFARI_VERSION = CHROME_VERSION || !navigator.userAgent.includes('AppleWebKit')
  ? Number.NaN
  : Number.parseFloat(navigator.userAgent.match(/Version\/([\d.]+)/)?.[1]);

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isFocused(element) {
  if (!element) return false;
  if (FIREFOX_VERSION < 113 && element.constructor.formAssociated && element.hasAttribute('disabled')) {
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
