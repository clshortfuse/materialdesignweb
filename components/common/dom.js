/**
 * @param {Element} element
 * @param {string} className
 * @return {Element}
 */
function getChildElementByClass(element, className) {
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
function findElementParentByClassName(element, className, includeSelf) {
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
function isRtl() {
  return document.documentElement.hasAttribute('dir')
    && document.documentElement.getAttribute('dir').toLowerCase() === 'rtl';
}

export {
  getChildElementByClass,
  findElementParentByClassName,
  isRtl,
};
