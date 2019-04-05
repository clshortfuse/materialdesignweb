import { findElementParentByClassName, iterateArrayLike } from '../../core/dom';

import * as Overlay from '../../core/overlay/index';
import * as Ripple from '../../core/ripple/index';

/**
 * @param {Element} listExpanderElement
 * @return {void}
 */
export function attach(listExpanderElement) {
  listExpanderElement.setAttribute('role', 'treeitem');

  const listExpanderContent = listExpanderElement.getElementsByClassName('mdw-list__expander-content')[0];
  if (listExpanderContent) {
    listExpanderContent.setAttribute('role', 'none');

    if (!listExpanderContent.hasAttribute('mdw-no-overlay')) {
      listExpanderContent.classList.add('mdw-overlay');
      Overlay.attach(listExpanderContent);
    }

    if (!listExpanderContent.hasAttribute('mdw-no-ripple')) {
      listExpanderContent.classList.add('mdw-ripple');
      Ripple.attach(listExpanderContent);
    }
    iterateArrayLike(listExpanderContent.getElementsByClassName('mdw-list__secondary'), (el) => {
      el.setAttribute('aria-hidden', 'true');
    });
    iterateArrayLike(listExpanderContent.getElementsByClassName('mdw-list__icon'), (el) => {
      el.setAttribute('aria-hidden', 'true');
    });
    iterateArrayLike(listExpanderContent.getElementsByClassName('mdw-list__avatar'), (el) => {
      el.setAttribute('aria-hidden', 'true');
    });
    listExpanderContent.addEventListener('click', onItemClicked);
  }
  console.log('init expanded');
  setExpanded(listExpanderElement, isExpanded(listExpanderElement));
  listExpanderElement.addEventListener('blur', onBlur);
  listExpanderElement.addEventListener('keydown', onKeyDown);
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
function onKeyDown(event) {
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
    return;
  }
  if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
    return;
  }
  if (document.activeElement !== event.currentTarget) {
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  /** @type {HTMLElement} */
  const listExpanderElement = (event.currentTarget);
  const listExpanderContent = listExpanderElement.getElementsByClassName('mdw-list__expander-content')[0];
  if (listExpanderContent) {
    const newEvent = document.createEvent('Event');
    newEvent.initEvent('click', true, true);
    listExpanderContent.dispatchEvent(newEvent);
  } else {
    setExpanded(listExpanderElement, !isExpanded(listExpanderElement));
  }
}

/**
 * @param {FocusEvent} event
 * @return {void}
 */
function onBlur(event) {
  /** @type {HTMLElement} */
  const listExpanderElement = (event.currentTarget);
  const listExpanderContent = listExpanderElement.getElementsByClassName('mdw-list__expander-content')[0];
  if (listExpanderContent) {
    listExpanderContent.removeAttribute('mdw-overlay-touch');
  }
}

/**
 * @param {Element} listExpanderElement
 * @return {void}
 */
export function detach(listExpanderElement) {
  listExpanderElement.removeEventListener('keydown', onKeyDown);
  listExpanderElement.removeEventListener('blur', onBlur);
  const listExpanderContent = listExpanderElement.getElementsByClassName('mdw-list__expander-content')[0];
  if (listExpanderContent) {
    listExpanderContent.removeEventListener('click', onItemClicked);
  }
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
  iterateArrayLike(listExpanderElement.querySelectorAll('[role="treeitem"]'), (treeitem) => {
    treeitem.setAttribute('mdw-skip-tab', value ? 'false' : 'true');
  });
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
