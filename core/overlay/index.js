import { getPassiveEventListenerOption, iterateArrayLike } from '../dom.js';

let lastInteractionWasTouch = false;

if (window && window.matchMedia) {
  lastInteractionWasTouch = window.matchMedia('(any-pointer: coarse)').matches;
}

/**
 * @param {PointerEvent|MouseEvent} event
 * @return {void}
 */
export function onMouseDown(event) {
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  if (element.hasAttribute('mdw-overlay-touch')) {
    return;
  }
  element.setAttribute('mdw-overlay-touch', 'false');
}

/**
 * @param {TouchEvent} event
 * @return {void}
 */
export function onTouchStart(event) {
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  element.setAttribute('mdw-overlay-touch', 'true');
}

/**
 * @param {TouchEvent} event
 * @return {void}
 */
export function onKeyDown(event) {
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  element.setAttribute('mdw-overlay-touch', 'false');
}

/**
 * @param {FocusEvent} event
 * @return {void}
 */
export function onBlur(event) {
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  const value = element.getAttribute('mdw-overlay-touch');
  if (value == null) {
    return;
  }
  if (value === 'true') {
    lastInteractionWasTouch = true;
  } else {
    lastInteractionWasTouch = false;
  }
  element.removeAttribute('mdw-overlay-touch');
}

/**
 * @param {FocusEvent} event
 * @return {void}
 */
export function onFocus(event) {
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  if (!element.hasAttribute('mdw-overlay-touch')) {
    // Element was focused without a mouse or touch event (keyboard or programmatic)
    if (lastInteractionWasTouch) {
      element.setAttribute('mdw-overlay-touch', 'true');
    }
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.setAttribute('mdw-overlay-js', '');
  element.addEventListener('mousedown', onMouseDown, getPassiveEventListenerOption());
  element.addEventListener('touchstart', onTouchStart, getPassiveEventListenerOption());
  element.addEventListener('keydown', onKeyDown, getPassiveEventListenerOption());
  element.addEventListener('blur', onBlur, getPassiveEventListenerOption());
  element.addEventListener('focus', onFocus, getPassiveEventListenerOption());
}

/**
 * @param {Element|Document} [root=document]
 * @return {void}
 */
export function attachAll(root = document) {
  iterateArrayLike(root.getElementsByClassName('mdw-overlay'), attach);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  element.removeAttribute('mdw-overlay-js');
  element.removeAttribute('mdw-overlay-touch');
  element.removeEventListener('mousedown', onMouseDown, getPassiveEventListenerOption());
  element.removeEventListener('touchstart', onTouchStart, getPassiveEventListenerOption());
  element.removeEventListener('keydown', onKeyDown, getPassiveEventListenerOption());
  element.removeEventListener('blur', onBlur, getPassiveEventListenerOption());
}
