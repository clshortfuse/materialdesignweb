let lastInteractionWasTouch = false;

if (window && window.matchMedia) {
  lastInteractionWasTouch = window.matchMedia('(any-pointer: coarse)').matches;
}

/**
 * @param {PointerEvent|MouseEvent} event
 * @return {void}
 */
export function onMouseDown(event) {
  const element = /** @type {HTMLElement} */ (event.currentTarget);
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
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  element.setAttribute('mdw-overlay-touch', 'true');
}

/**
 * @param {TouchEvent} event
 * @return {void}
 */
export function onKeyDown(event) {
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  element.setAttribute('mdw-overlay-touch', 'false');
}

/**
 * @param {FocusEvent} event
 * @return {void}
 */
export function onBlur(event) {
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  const value = element.getAttribute('mdw-overlay-touch');
  if (value == null) {
    return;
  }
  lastInteractionWasTouch = value === 'true';
  element.removeAttribute('mdw-overlay-touch');
}

/**
 * @param {FocusEvent} event
 * @return {void}
 */
export function onFocus(event) {
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  // Element was focused without a mouse or touch event (keyboard or programmatic)
  if (!element.hasAttribute('mdw-overlay-touch') && lastInteractionWasTouch) {
    element.setAttribute('mdw-overlay-touch', 'true');
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.setAttribute('mdw-overlay-js', '');
  element.addEventListener('mousedown', onMouseDown, { passive: true });
  element.addEventListener('touchstart', onTouchStart, { passive: true });
  element.addEventListener('keydown', onKeyDown, { passive: true });
  element.addEventListener('blur', onBlur, { passive: true });
  element.addEventListener('focus', onFocus, { passive: true });
}

/**
 * @param {Element|Document} [root=document]
 * @return {void}
 */
export function attachAll(root = document) {
  for (const el of root.getElementsByClassName('mdw-overlay')) attach(el);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  element.removeAttribute('mdw-overlay-js');
  element.removeAttribute('mdw-overlay-touch');
  element.removeEventListener('mousedown', onMouseDown);
  element.removeEventListener('touchstart', onTouchStart);
  element.removeEventListener('keydown', onKeyDown);
  element.removeEventListener('blur', onBlur);
}
