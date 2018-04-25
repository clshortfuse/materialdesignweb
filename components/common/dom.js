/**
 * @param {Element} element
 * @param {string} className
 * @return {Element}
 */
function getChildElementByClass(element, className) {
  let el = element.firstElementChild;
  while (el != null) {
    if (el.classList.contains(className)) {
      return el;
    }
    el = el.nextElementSibling;
  }
  return null;
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

export {
  getChildElementByClass,
  findElementParentByClassName,
};
