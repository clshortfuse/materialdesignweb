import { getChildElementByClass, nextTick, getPassiveEventListenerOption } from '../common/dom';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  let ripple = getChildElementByClass(element, 'mdw-ripple');
  if (!ripple) {
    ripple = document.createElement('div');
    ripple.classList.add('mdw-ripple');
    if (element.firstChild) {
      element.insertBefore(ripple, element.firstChild);
    } else {
      element.appendChild(ripple);
    }
  }

  let rippleInner = getChildElementByClass(ripple, 'mdw-ripple__inner');
  if (!rippleInner) {
    rippleInner = document.createElement('div');
    rippleInner.classList.add('mdw-ripple__inner');
    ripple.appendChild(rippleInner);
  }
  element.setAttribute('mdw-ripple', '');
  let targetElement = ripple;
  if (element instanceof HTMLButtonElement) {
    // Firefox doesn't support listening on HTMLButtonElement children
    targetElement = element;
  }

  targetElement.addEventListener('click', onClick, getPassiveEventListenerOption());
  targetElement.addEventListener('mousedown', onMouseEvent, getPassiveEventListenerOption());
  targetElement.addEventListener('mouseup', onMouseEvent, getPassiveEventListenerOption());
  targetElement.addEventListener('mouseout', onMouseEvent, getPassiveEventListenerOption());
  targetElement.addEventListener('touchstart', onTouchEvent, getPassiveEventListenerOption());
  targetElement.addEventListener('touchend', onTouchEvent, getPassiveEventListenerOption());
  targetElement.addEventListener('touchcancel', onTouchEvent, getPassiveEventListenerOption());
  element.addEventListener('keydown', onKeyEvent, getPassiveEventListenerOption());
  element.addEventListener('keyup', onKeyEvent, getPassiveEventListenerOption());
  rippleInner.addEventListener('animationend', onAnimationEnd, getPassiveEventListenerOption());
}

/**
 * @param {PointerEvent|MouseEvent} event
 * @return {void}
 */
export function onMouseEvent(event) {
  /** @type {HTMLElement} */
  let ripple = (event.currentTarget);
  if (!ripple.classList.contains('mdw-ripple')) {
    /** @type {HTMLElement} */
    ripple = (getChildElementByClass(ripple, 'mdw-ripple'));
  }
  if (!ripple) {
    return;
  }
  /** @type {HTMLElement} */
  const rippleInner = (getChildElementByClass(ripple, 'mdw-ripple__inner'));
  if (!rippleInner) {
    return;
  }
  if (event.type === 'mousedown') {
    if (!('pointerType' in event) && !event.detail) {
      return;
    }
    if (rippleInner.hasAttribute('mdw-touchstart')) {
      return;
    }
    rippleInner.setAttribute('mdw-mousedown', '');
    rippleInner.removeAttribute('mdw-mouseout');
    const rect = ripple.getBoundingClientRect();
    const x = event.pageX - rect.left - window.pageXOffset;
    const y = event.pageY - rect.top - window.pageYOffset;
    updateRipplePosition(rippleInner, x, y);
    drawRipple(rippleInner);
  } else if (event.type === 'mouseup') {
    if (rippleInner.hasAttribute('mdw-mousedown')) {
      rippleInner.setAttribute('mdw-mouseup', '');
      clearRipple(rippleInner);
      rippleInner.removeAttribute('mdw-mousedown');
      rippleInner.removeAttribute('mdw-mouseup');
    }
  } else if (event.type === 'mouseout') {
    if (rippleInner.hasAttribute('mdw-mousedown')) {
      rippleInner.removeAttribute('mdw-mousedown');
      rippleInner.setAttribute('mdw-mouseout', '');
    }
  }
}

/**
 * @param {TouchEvent} event
 * @return {void}
 */
export function onTouchEvent(event) {
  /** @type {HTMLElement} */
  let ripple = (event.currentTarget);
  if (!ripple.classList.contains('mdw-ripple')) {
    /** @type {HTMLElement} */
    ripple = (getChildElementByClass(ripple, 'mdw-ripple'));
  }
  if (!ripple) {
    return;
  }
  /** @type {HTMLElement} */
  const rippleInner = (getChildElementByClass(ripple, 'mdw-ripple__inner'));
  if (!rippleInner) {
    return;
  }
  const touch = event.changedTouches[0];
  if (!touch) {
    return;
  }
  if (event.type === 'touchstart') {
    rippleInner.setAttribute('mdw-touchstart', '');
    rippleInner.removeAttribute('mdw-touchcancel');
    rippleInner.removeAttribute('mdw-mouseout');
    const rect = ripple.getBoundingClientRect();
    const x = touch.pageX - rect.left - window.pageXOffset;
    const y = touch.pageY - rect.top - window.pageYOffset;
    updateRipplePosition(rippleInner, x, y);
    drawRipple(rippleInner);
  } else if (event.type === 'touchend') {
    rippleInner.setAttribute('mdw-touchend', '');
    clearRipple(rippleInner);
    rippleInner.removeAttribute('mdw-touchend');
    nextTick(() => {
      rippleInner.removeAttribute('mdw-touchstart');
    });
  } else if (event.type === 'touchcancel') {
    rippleInner.setAttribute('mdw-touchcancel', '');
    nextTick(() => {
      rippleInner.removeAttribute('mdw-touchstart');
    });
  }
}

/**
 * @param {TouchEvent} event
 * @return {void}
 */
export function onKeyEvent(event) {
  /** @type {HTMLElement} */
  let ripple = (event.currentTarget);
  if (!ripple.classList.contains('mdw-ripple')) {
    /** @type {HTMLElement} */
    ripple = (getChildElementByClass(ripple, 'mdw-ripple'));
  }
  if (!ripple) {
    return;
  }
  /** @type {HTMLElement} */
  const rippleInner = (getChildElementByClass(ripple, 'mdw-ripple__inner'));
  if (!rippleInner) {
    return;
  }

  nextTick(() => {
    if (isActive(ripple.parentElement)) {
      if (rippleInner.hasAttribute('mdw-keydown')) {
        return;
      }
      rippleInner.setAttribute('mdw-keydown', '');
      rippleInner.removeAttribute('mdw-mouseout');
      updateRipplePosition(rippleInner);
      drawRipple(rippleInner);
    } else if (rippleInner.hasAttribute('mdw-keydown')) {
      rippleInner.setAttribute('mdw-keyup', '');
      clearRipple(rippleInner);
      rippleInner.removeAttribute('mdw-keydown');
      rippleInner.removeAttribute('mdw-keyup');
    }
  });
}

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isActive(element) {
  if (element.matches) {
    return element.matches(':active');
  }
  if (element.msMatchesSelector) {
    element.msMatchesSelector(':active');
  }
  return false;
}

/**
 * @param {HTMLElement} rippleInner
 * @param {number=} x
 * @param {number=} y
 * @return {void}
 */
export function updateRipplePosition(rippleInner, x, y) {
  let width;
  let height;
  let xPos = x;
  let yPos = y;
  if (x == null) {
    xPos = rippleInner.parentElement.clientWidth / 2;
    width = xPos;
  } else if (x >= rippleInner.parentElement.clientWidth / 2) {
    width = x;
    // furthest horizontal side is left
  } else {
    width = rippleInner.parentElement.clientWidth - x;
    // furthest horizontal side is right
  }
  if (y == null) {
    yPos = rippleInner.parentElement.clientHeight / 2;
    height = yPos;
  } else if (y >= rippleInner.parentElement.clientHeight / 2) {
    height = y;
    // furthest vertical side is bottom
  } else {
    height = rippleInner.parentElement.clientHeight - y;
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
 * @return {void}
 */
export function drawRipple(rippleInner) {
  rippleInner.setAttribute('mdw-fade-in', '');
  rippleInner.removeAttribute('mdw-fade-in-complete');
  rippleInner.removeAttribute('mdw-fade-out');
  rippleInner.removeAttribute('mdw-fade-out-ready');
  rippleInner.removeAttribute('mdw-fade-in-out');
}

/**
 * @param {AnimationEvent} event
 * @return {void}
 */
export function onAnimationEnd(event) {
  /** @type {HTMLElement} */
  const rippleInner = (event.currentTarget);
  if (rippleInner.hasAttribute('mdw-fade-in')) {
    rippleInner.setAttribute('mdw-fade-in-complete', '');
  }
  if (rippleInner.hasAttribute('mdw-fade-out-ready')) {
    clearRipple(rippleInner);
    return;
  }
  if (rippleInner.hasAttribute('mdw-fade-out')) {
    rippleInner.removeAttribute('mdw-fade-out');
  }
}

/**
 * @param {Element} rippleInner
 * @return {void}
 */
export function clearRipple(rippleInner) {
  const hasFadeOutReady = rippleInner.hasAttribute('mdw-fade-out-ready');
  if (!hasFadeOutReady) {
    if (!rippleInner.hasAttribute('mdw-fade-in')) {
      return;
    }
    if (rippleInner.hasAttribute('mdw-keydown') && !rippleInner.hasAttribute('mdw-keyup')) {
      return;
    }
    if (rippleInner.hasAttribute('mdw-mousedown') && !rippleInner.hasAttribute('mdw-mouseup')) {
      return;
    }
    if (rippleInner.hasAttribute('mdw-touchstart') && !rippleInner.hasAttribute('mdw-touchend')) {
      return;
    }
    if (!rippleInner.hasAttribute('mdw-fade-in-complete')) {
      rippleInner.setAttribute('mdw-fade-out-ready', '');
      return;
    }
  }
  rippleInner.removeAttribute('mdw-fade-in');
  rippleInner.removeAttribute('mdw-fade-in-complete');
  rippleInner.removeAttribute('mdw-fade-out-ready');
  rippleInner.setAttribute('mdw-fade-out', '');
}

/**
 * @param {PointerEvent|MouseEvent} event
 * @return {void}
 */
export function onClick(event) {
  /** @type {HTMLElement} */
  let ripple = (event.currentTarget);
  if (!ripple.classList.contains('mdw-ripple')) {
    /** @type {HTMLElement} */
    ripple = (getChildElementByClass(ripple, 'mdw-ripple'));
  }
  if (!ripple) {
    return;
  }
  /** @type {HTMLElement} */
  const rippleInner = (getChildElementByClass(ripple, 'mdw-ripple__inner'));
  if (!rippleInner) {
    return;
  }
  if ('pointerType' in event || event.detail) {
    return;
  }
  if (rippleInner.hasAttribute('mdw-keydown')) {
    // Already handled by keydown
    return;
  }
  updateRipplePosition(rippleInner);
  drawRipple(rippleInner);
  nextTick(() => {
    clearRipple(rippleInner);
  });
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  const ripple = getChildElementByClass(element, 'mdw-ripple');
  if (ripple) {
    element.removeChild(ripple);
  }
  element.removeAttribute('mdw-ripple');
  element.removeEventListener('click', onClick);
  element.removeEventListener('mousedown', onMouseEvent);
  element.removeEventListener('mouseup', onMouseEvent);
  element.removeEventListener('mouseout', onMouseEvent);
  element.removeEventListener('touchstart', onTouchEvent);
  element.removeEventListener('touchend', onTouchEvent);
  element.removeEventListener('touchcancel', onTouchEvent);
  element.removeEventListener('keydown', onKeyEvent);
  element.removeEventListener('keyup', onKeyEvent);
}
