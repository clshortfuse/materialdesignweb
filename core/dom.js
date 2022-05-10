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
 * @return {?Text}
 */
export function getTextNode(node, create) {
  for (const childNode of node.childNodes) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      return /** @type {Text} */ (childNode);
    }
  }
  if (!create) return null;
  return node.appendChild(document.createTextNode(''));
}

/**
 * @param {Node} node
 * @param {string} value
 * @return {?Text}
 */
export function setTextNode(node, value) {
  for (const childNode of node.childNodes) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      if (value) {
        childNode.nodeValue = value;
      } else {
        node.removeChild(childNode);
      }
      return /** @type {Text} */ (childNode);
    }
  }
  if (!value) return null;
  return node.appendChild(document.createTextNode(value));
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
  requestAnimationFrame(() => {
    parent.style.removeProperty('scroll-behavior');
  });
}
