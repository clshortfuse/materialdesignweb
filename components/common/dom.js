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
 * @param {boolean=} [includeSelf=true]
 * @return {Element}
 */
export function findElementParentByClassName(element, className, includeSelf) {
  /** @type {Element} */
  let el;
  if (includeSelf === false) {
    el = element.parentElement;
  } else {
    el = element;
  }
  while (el != null && !el.classList.contains(className)) {
    el = el.parentElement;
  }
  return el;
}

/** @return {boolean} */
export function isRtl() {
  return document.documentElement.hasAttribute('dir')
    && document.documentElement.getAttribute('dir').toLowerCase() === 'rtl';
}

/**
 * @param {Element} element
 * @param {string} type
 * @return {boolean}
 */
export function dispatchDomEvent(element, type) {
  const event = document.createEvent('Event');
  event.initEvent(type, true, true);
  return element.dispatchEvent(event);
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
 * @param {boolean=} create
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
 * @return {void}
 */
export function scrollToElement(element, smooth) {
  if (!element) {
    return;
  }
  const parent = element.parentElement;
  if (!parent) {
    return;
  }
  if (parent.scrollLeft === element.offsetLeft) {
    return;
  }
  if (smooth && parent.scrollTo) {
    parent.scrollTo({
      top: 0,
      left: element.offsetLeft,
      behavior: 'smooth',
    });
    return;
  }
  parent.style.setProperty('scroll-behavior', 'auto');
  parent.scrollLeft = element.offsetLeft;
  nextTick(() => {
    parent.style.removeProperty('scroll-behavior');
  });
}
