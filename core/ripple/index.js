import { getChildElementByClass } from '../dom.js';

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isActive(element) {
  if (element.matches) {
    return element.matches(':active');
  }
  if ('msMatchesSelector' in element) {
    // @ts-ignore: Compatibility
    element.msMatchesSelector(':active');
  }
  return false;
}

/**
 * @param {HTMLElement} rippleInner
 * @param {number} [x]
 * @param {number} [y]
 * @return {void}
 */
export function updateRipplePosition(rippleInner, x, y) {
  let width;
  let height;
  let xPos = x;
  let yPos = y;
  const {
    clientWidth: parentWidth,
    clientHeight: parentHeight,
  } = /** @type {HTMLElement} */ (rippleInner.parentElement);

  if (x == null) {
    xPos = parentWidth / 2;
    width = xPos;
  } else if (x >= parentWidth / 2) {
    width = x;
    // furthest horizontal side is left
  } else {
    width = parentWidth - x;
    // furthest horizontal side is right
  }
  if (y == null) {
    yPos = parentHeight / 2;
    height = yPos;
  } else if (y >= parentHeight / 2) {
    height = y;
    // furthest vertical side is bottom
  } else {
    height = parentHeight - y;
    // furthest vertical side is top
  }
  const hypotenuse = Math.sqrt((width * width) + (height * height));
  rippleInner.style.setProperty('height', `${hypotenuse}px`);
  rippleInner.style.setProperty('width', `${hypotenuse}px`);
  rippleInner.style.setProperty('left', `${xPos - (hypotenuse / 2)}px`);
  rippleInner.style.setProperty('top', `${yPos - (hypotenuse / 2)}px`);
}

/**
 * @param {Element} rippleInner
 * @param {string} initiator
 * @return {void}
 */
export function drawRipple(rippleInner, initiator) {
  const currentInitiator = rippleInner.getAttribute('mdw-fade-in');
  if (currentInitiator && currentInitiator !== initiator) {
    // Only allow repeat interactions from same initiator
    return;
  }
  rippleInner.setAttribute('mdw-fade-in', initiator);
  if (currentInitiator === initiator) {
    // Repeat the animation
    if (rippleInner.hasAttribute('mdw-fade-in-repeat')) {
      rippleInner.removeAttribute('mdw-fade-in-repeat');
    } else {
      rippleInner.setAttribute('mdw-fade-in-repeat', '');
    }
  }
}

/**
 * @param {AnimationEvent} event
 * @return {void}
 */
export function onAnimationEnd(event) {
  const rippleInner = /** @type {HTMLElement} */ (event.currentTarget);
  if (event.animationName === 'ripple-fade-in' || event.animationName === 'ripple-fade-in-repeat') {
    rippleInner.setAttribute('mdw-fade-in-complete', '');
    return;
  }
  if (event.animationName === 'ripple-fade-out') {
    rippleInner.removeAttribute('mdw-fade-in');
    rippleInner.removeAttribute('mdw-fade-in-repeat');
    rippleInner.removeAttribute('mdw-fade-in-complete');
    rippleInner.removeAttribute('mdw-fade-out');
  }
}

/**
 * @param {Element} rippleInner
 * @return {void}
 */
export function clearRipple(rippleInner) {
  if (!rippleInner.hasAttribute('mdw-fade-in')) {
    return;
  }
  if (rippleInner.hasAttribute('mdw-keydown') && !rippleInner.hasAttribute('mdw-keyup')) {
    return;
  }
  if (!rippleInner.hasAttribute('mdw-fade-in-complete')) {
    return;
  }
  rippleInner.removeAttribute('mdw-fade-in');
  rippleInner.removeAttribute('mdw-fade-in-repeat');
  rippleInner.removeAttribute('mdw-fade-in-complete');
  rippleInner.setAttribute('mdw-fade-out', '');
}

/**
 * @param {PointerEvent|MouseEvent} event
 * @return {void}
 */
export function onMouseDown(event) {
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  const rippleContainer = /** @type {HTMLElement} */ (getChildElementByClass(element, 'mdw-ripple__container'));
  if (!rippleContainer) {
    return;
  }
  const rippleInner = /** @type {HTMLElement} */ (getChildElementByClass(rippleContainer, 'mdw-ripple__inner'));
  if (!rippleInner) {
    return;
  }
  // @ts-ignore: Optimization
  if (!event.pointerType && !event.detail) {
    return;
  }
  const rect = rippleContainer.getBoundingClientRect();
  const x = event.pageX - rect.left - window.pageXOffset;
  const y = event.pageY - rect.top - window.pageYOffset;
  updateRipplePosition(rippleInner, x, y);
  drawRipple(rippleInner, 'mouse');
}

/**
 * @param {TouchEvent} event
 * @return {void}
 */
export function onTouchStart(event) {
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  const rippleContainer = /** @type {HTMLElement} */ (getChildElementByClass(element, 'mdw-ripple__container'));
  if (!rippleContainer) {
    return;
  }
  const rippleInner = /** @type {HTMLElement} */ (getChildElementByClass(rippleContainer, 'mdw-ripple__inner'));
  if (!rippleInner) {
    return;
  }
  const touch = event.changedTouches[0];
  if (!touch) {
    return;
  }
  const rect = rippleContainer.getBoundingClientRect();
  const x = touch.pageX - rect.left - window.pageXOffset;
  const y = touch.pageY - rect.top - window.pageYOffset;
  updateRipplePosition(rippleInner, x, y);
  drawRipple(rippleInner, 'touch');
}

/**
 * @param {PointerEvent|MouseEvent} event
 * @return {void}
 */
export function onClick(event) {
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  const rippleContainer = /** @type {HTMLElement} */ (getChildElementByClass(element, 'mdw-ripple__container'));
  if (!rippleContainer) {
    return;
  }
  const rippleInner = /** @type {HTMLElement} */ (getChildElementByClass(rippleContainer, 'mdw-ripple__inner'));
  if (!rippleInner) {
    return;
  }
  // @ts-ignore: Optimization
  if (event.pointerType || event.detail) {
    return;
  }
  if (rippleInner.getAttribute('mdw-fade-in') === 'key') {
    // Already handled by keydown
    return;
  }
  updateRipplePosition(rippleInner);
  drawRipple(rippleInner, 'key');
  requestAnimationFrame(() => {
    clearRipple(rippleInner);
  });
}

/**
 * @param {TouchEvent} event
 * @return {void}
 */
export function onKeyDown(event) {
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  const rippleContainer = /** @type {HTMLElement} */ (getChildElementByClass(element, 'mdw-ripple__container'));
  if (!rippleContainer) {
    return;
  }
  const rippleInner = /** @type {HTMLElement} */ (getChildElementByClass(rippleContainer, 'mdw-ripple__inner'));
  if (!rippleInner) {
    return;
  }

  requestAnimationFrame(() => {
    if (isActive(rippleContainer.parentElement)) {
      if (rippleInner.getAttribute('mdw-fade-in') === 'key') {
        return;
      }
      updateRipplePosition(rippleInner);
      drawRipple(rippleInner, 'key');
    }
  });
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  let rippleContainer = getChildElementByClass(element, 'mdw-ripple__container');
  if (!rippleContainer) {
    rippleContainer = document.createElement('div');
    rippleContainer.classList.add('mdw-ripple__container');
    rippleContainer.setAttribute('role', 'presentation');
    if (element.firstChild) {
      element.prepend(rippleContainer);
    } else {
      element.appendChild(rippleContainer);
    }
  }

  let rippleInner = getChildElementByClass(rippleContainer, 'mdw-ripple__inner');
  if (!rippleInner) {
    rippleInner = document.createElement('div');
    rippleInner.classList.add('mdw-ripple__inner');
    rippleInner.setAttribute('role', 'presentation');
    rippleContainer.appendChild(rippleInner);
  }
  rippleInner.removeAttribute('mdw-fade-in');
  rippleInner.removeAttribute('mdw-fade-in-repeat');
  rippleInner.removeAttribute('mdw-fade-in-complete');
  rippleInner.removeAttribute('mdw-fade-out');
  element.setAttribute('mdw-ripple-js', '');
  element.addEventListener('click', onClick, { passive: true });
  element.addEventListener('mousedown', onMouseDown, { passive: true });
  element.addEventListener('touchstart', onTouchStart, { passive: true });
  element.addEventListener('keydown', onKeyDown, { passive: true });
  rippleInner.addEventListener('animationend', onAnimationEnd, { passive: true });
}

/**
 * @param {Element|Document} [root=document]
 * @return {void}
 */
export function attachAll(root = document) {
  for (const el of root.getElementsByClassName('mdw-ripple')) {
    attach(el);
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  const rippleContainer = getChildElementByClass(element, 'mdw-ripple__container');
  if (rippleContainer) {
    element.removeChild(rippleContainer);
  }
  element.removeAttribute('mdw-ripple-js');
  element.removeEventListener('click', onClick);
  element.removeEventListener('mousedown', onMouseDown);
  element.removeEventListener('touchstart', onTouchStart);
  element.removeEventListener('keydown', onKeyDown);
}
