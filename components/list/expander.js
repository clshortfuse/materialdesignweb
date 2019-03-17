import { findElementParentByClassName } from '../common/dom';

/**
 * @param {Element} listExpanderElement
 * @return {void}
 */
export function attach(listExpanderElement) {
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
  if (listExpanderElement.hasAttribute('mdw-expanded')) {
    listExpanderElement.removeAttribute('mdw-expanded');
  } else {
    listExpanderElement.setAttribute('mdw-expanded', '');
  }
}
