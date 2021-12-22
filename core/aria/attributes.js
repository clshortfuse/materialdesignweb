import { dispatchDomEvent } from '../dom.js';

/**
 * @param {string} name Attribute Name
 * @param {Element} element Element
 * @param {string|boolean} value Boolean Attribute Value
 * @param {string} [dispatchEventName] OnChangeEvent
 * @param {boolean} [explicit=true]
 * @param {string} [emptyValue=false] Default empty value
 * @return {boolean} successful
 */
function setAttribute(name, element, value, dispatchEventName, explicit = true, emptyValue = 'false') {
  const attr = element.getAttribute(name);
  let stringValue;
  if (typeof value === 'string') {
    stringValue = value;
  } else {
    stringValue = (value ? 'true' : 'false');
  }
  if (attr === stringValue) {
    // Nothing to change
    return true;
  }
  if (stringValue === emptyValue) {
    // Set default empty value
    if (attr == null) {
      // No attribute set
      if (explicit) {
        // Explicitly set attribute
        element.setAttribute(name, stringValue);
      }
      return true;
    }
    if (!explicit) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, stringValue);
    }
  } else {
    // Non default value;
    element.setAttribute(name, stringValue);
  }
  if (!dispatchEventName) {
    return true;
  }
  // Alert change
  if (!dispatchDomEvent(element, dispatchEventName, { value: stringValue })) {
    // Revert
    if (attr == null) {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, attr);
    }
    return false;
  }
  return true;
}

/**
 * @param {Element} element
 * @param {string|boolean} value
 * @param {string} [dispatchEventName]
 * @return {boolean} successful
 */
export function setCurrent(element, value, dispatchEventName) {
  // Some browsers incorrectly style [aria-current="false"]
  // Attribute will be removed when false|"false"
  return setAttribute('aria-current', element, value, dispatchEventName, false);
}

/**
 * @param {Element} element
 * @param {string|boolean} value
 * @param {string} [dispatchEventName]
 * @return {boolean} successful
 */
export function setSelected(element, value, dispatchEventName) {
  return setAttribute('aria-selected', element, value, dispatchEventName);
}

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isChecked(element) {
  return element.getAttribute('aria-checked') === 'true';
}

/**
 * @param {Element} element
 * @param {string|boolean} value
 * @param {string} [dispatchEventName]
 * @return {boolean} successful
 */
export function setChecked(element, value, dispatchEventName) {
  return setAttribute('aria-checked', element, value, dispatchEventName);
}

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isDisabled(element) {
  return element.getAttribute('aria-disabled') === 'true';
}

/**
 * @param {Element} element
 * @param {string|boolean} value
 * @param {string} [dispatchEventName]
 * @return {boolean} successful
 */
export function setDisabled(element, value, dispatchEventName) {
  return setAttribute('aria-disabled', element, value, dispatchEventName);
}

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isExpanded(element) {
  return element.getAttribute('aria-expanded') === 'true';
}

/**
 * @param {Element} element
 * @param {string|boolean} value
 * @param {string} [dispatchEventName]
 * @return {boolean} successful
 */
export function setExpanded(element, value, dispatchEventName) {
  return setAttribute('aria-expanded', element, value, dispatchEventName);
}

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isReadonly(element) {
  return element.getAttribute('aria-readonly') === 'true';
}
