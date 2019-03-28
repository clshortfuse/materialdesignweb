import { getPassiveEventListenerOption, iterateArrayLike } from '../dom';

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
export function attach(element) {
  element.setAttribute('mdw-overlay-js', '');
  element.addEventListener('mousedown', onMouseDown, getPassiveEventListenerOption());
  element.addEventListener('touchstart', onTouchStart, getPassiveEventListenerOption());
  element.addEventListener('keydown', onKeyDown, getPassiveEventListenerOption());
  element.addEventListener('blur', onBlur, getPassiveEventListenerOption());
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
 * @param {TouchEvent} event
 * @return {void}
 */
export function onBlur(event) {
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  element.removeAttribute('mdw-overlay-touch');
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
