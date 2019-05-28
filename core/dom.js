/** @type {?boolean} */
let passiveEventListenerSupported = null;

/** @return {void} */
function testPassiveEventListenerOptionSupport() {
  try {
    passiveEventListenerSupported = false;
    const options = {
      get passive() {
        passiveEventListenerSupported = true;
        return true;
      },
    };
    // @ts-ignore
    window.addEventListener('test', options, options);
    // @ts-ignore
    window.removeEventListener('test', options, options);
  } catch (err) {
    passiveEventListenerSupported = false;
  }
}

/** @return {Object|boolean} */
export function getPassiveEventListenerOption() {
  if (passiveEventListenerSupported == null) {
    testPassiveEventListenerOptionSupport();
  }
  if (passiveEventListenerSupported) {
    return { passive: true };
  }
  return false;
}

export const nextTick = window.requestAnimationFrame || (cb => window.setTimeout(cb, 17));

export const cancelTick = window.cancelAnimationFrame || window.clearTimeout;

/**
 * @param {Element} element
 * @param {string} className
 * @return {Element}
 */
export function getChildElementByClass(element, className) {
  const child = element.getElementsByClassName(className)[0];
  if (child && child.parentElement !== element) {
    return null;
  }
  return child;
}

/**
 * @param {Element} element
 * @param {string} className
 * @param {boolean} [includeSelf=true]
 * @return {HTMLElement}
 */
export function findElementParentByClassName(element, className, includeSelf) {
  let el;
  if (includeSelf === false) {
    el = element.parentElement;
  } else {
    /** @type {HTMLElement} */
    el = (element);
  }
  while (el != null && !el.classList.contains(className)) {
    el = el.parentElement;
  }
  return el;
}

/** @return {boolean} */
export function isRtl() {
  return document.documentElement.dir === 'rtl';
}

/**
 * @param {EventTarget} eventTarget
 * @param {string} type
 * @param {Object} [detail]
 * @return {boolean}
 */
export function dispatchDomEvent(eventTarget, type, detail) {
  let event;
  if (typeof CustomEvent === 'function') {
    event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail,
    });
  } else if (detail == null) {
    if (typeof Event === 'function') {
      event = new Event(type, {
        bubbles: true,
        cancelable: true,
      });
    } else {
      event = document.createEvent('Event');
      event.initEvent(type, true, true);
    }
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, true, true, detail);
  }
  return eventTarget.dispatchEvent(event);
}

/**
 * @param {ArrayLike<T>} arrayLike
 * @param {function(T, number, ArrayLike<T>):any} fn
 * @return {void}
 * @template {any} T
 */
export function iterateArrayLike(arrayLike, fn) {
  Array.prototype.forEach.call(arrayLike, fn);
}

/**
 * @param {ArrayLike<T>} arrayLike
 * @param {function(T, number, ArrayLike<T>):boolean|void} fn
 * @return {boolean}
 * @template {any} T
 */
export function iterateSomeOfArrayLike(arrayLike, fn) {
  return Array.prototype.some.call(arrayLike, fn);
}

/**
 * @param {Element} element
 * @param {function(Element, number):boolean|void} fn
 * @return {boolean}
 */
export function iterateElementSiblings(element, fn) {
  let distance = -1;
  let sibling = element.previousElementSibling;
  while (sibling) {
    fn(sibling, distance);
    sibling = sibling.previousElementSibling;
    distance -= 1;
  }
  sibling = element.nextElementSibling;
  distance = 1;
  while (sibling) {
    fn(sibling, distance);
    sibling = sibling.nextElementSibling;
    distance += 1;
  }
  return false;
}

/**
 * @param {Element} element
 * @param {function(Element, number):boolean|void} fn
 * @return {boolean}
 */
export function iterateSomeOfElementSiblings(element, fn) {
  let distance = -1;
  let sibling = element.previousElementSibling;
  while (sibling) {
    if (fn(sibling, distance)) {
      return true;
    }
    sibling = sibling.previousElementSibling;
    distance -= 1;
  }
  sibling = element.nextElementSibling;
  distance = 1;
  while (sibling) {
    if (fn(sibling, distance)) {
      return true;
    }
    sibling = sibling.previousElementSibling;
    distance += 1;
  }
  return false;
}

/**
 * @param {Node} node
 * @param {boolean} [create]
 * @return {Node}
 */
export function getTextNode(node, create) {
  let textNode;
  iterateSomeOfArrayLike(node.childNodes, (childNode) => {
    if (childNode.nodeType !== Node.TEXT_NODE) {
      return false;
    }
    textNode = childNode;
    return true;
  });
  if (create && !textNode) {
    textNode = document.createTextNode('');
    node.appendChild(textNode);
  }
  return textNode;
}

/**
 * @param {Node} node
 * @param {string} value
 * @return {Node}
 */
export function setTextNode(node, value) {
  /** @type {ChildNode} */
  let textNode;
  iterateSomeOfArrayLike(node.childNodes, (childNode) => {
    if (childNode.nodeType !== Node.TEXT_NODE) {
      return false;
    }
    textNode = childNode;
    return true;
  });
  if (value) {
    if (!textNode) {
      textNode = document.createTextNode(value);
      node.appendChild(textNode);
    } else {
      textNode.nodeValue = value;
    }
  } else if (textNode) {
    node.removeChild(textNode);
  }
  return textNode;
}

/**
 * @param {HTMLElement} element
 * @param {boolean} [smooth=false]
 * @param {boolean} [rtl=false]
 * @return {void}
 */
export function scrollToElement(element, smooth, rtl) {
  if (!element) {
    return;
  }
  const parent = element.parentElement;
  if (!parent) {
    return;
  }

  let targetScrollLeft = rtl
    ? parent.scrollWidth + element.offsetLeft - element.offsetWidth
    : element.offsetLeft;

  const elementRect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  let subPixelScrollPosition = elementRect.left - parentRect.left;
  if (subPixelScrollPosition < 0) {
    subPixelScrollPosition = 0;
  }
  if (Math.abs(subPixelScrollPosition - targetScrollLeft) < 2) {
    targetScrollLeft = subPixelScrollPosition;
  }
  if (parent.scrollLeft === targetScrollLeft) {
    return;
  }

  if (parent.scrollTo) {
    parent.scrollTo({
      top: 0,
      left: targetScrollLeft,
      behavior: smooth ? 'smooth' : 'auto',
    });
    return;
  }
  parent.style.setProperty('scroll-behavior', 'auto');
  parent.scrollLeft = targetScrollLeft;
  nextTick(() => {
    parent.style.removeProperty('scroll-behavior');
  });
}
