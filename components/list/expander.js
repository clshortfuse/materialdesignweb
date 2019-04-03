import { findElementParentByClassName } from '../../core/dom';

/**
 * @param {Element} listExpanderElement
 * @return {void}
 */
export function attach(listExpanderElement) {
  listExpanderElement.setAttribute('role', 'treeitem');
  if (!listExpanderElement.firstElementChild) {
    return;
  }
  listExpanderElement.firstElementChild.addEventListener('click', onItemClicked);
}

/**
 * @param {Element} listExpanderElement
 * @return {void}
 */
export function detach(listExpanderElement) {
  if (!listExpanderElement.firstElementChild) {
    return;
  }
  listExpanderElement.firstElementChild.removeEventListener('click', onItemClicked);
}

/**
 * @param {Element} listExpanderElement
 * @return {boolean}
 */
export function isExpanded(listExpanderElement) {
  return (listExpanderElement.getAttribute('aria-expanded') === 'true');
}

/**
 * @param {Element} listExpanderElement
 * @param {boolean} value
 * @return {void}
 */
export function setExpanded(listExpanderElement, value) {
  listExpanderElement.setAttribute('aria-expanded', value ? 'true' : 'false');
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onItemClicked(event) {
  /** @type {HTMLElement} */
  const firstChild = (event.currentTarget);
  const listExpanderElement = findElementParentByClassName(firstChild, 'mdw-list__expander');
  if (!listExpanderElement) {
    return;
  }
  setExpanded(listExpanderElement, !isExpanded(listExpanderElement));
}
