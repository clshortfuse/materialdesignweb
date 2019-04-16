import * as ListContent from './content';
import { iterateArrayLike, getChildElementByClass } from '../../core/dom';

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function attach(listItemElement) {
  attachCore(listItemElement);
  iterateArrayLike(listItemElement.getElementsByClassName('mdw-list__content'), ListContent.attach);
  if (listItemElement.hasAttribute('aria-expanded')) {
    if (!listItemElement.hasAttribute('mdw-expander-js')) {
      listItemElement.setAttribute('mdw-pre-expander-js', '');
      setTimeout(() => {
        if (listItemElement.hasAttribute('mdw-pre-expander-js')) {
          listItemElement.removeAttribute('mdw-pre-expander-js');
          listItemElement.setAttribute('mdw-expander-js', '');
        }
      }, 500);
    }
    setExpanded(listItemElement, isExpanded(listItemElement));
  }
  listItemElement.addEventListener(ListContent.ACTIVATE_EVENT, onChildContentActivate);
  listItemElement.addEventListener('keydown', onKeyDown);
}

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function attachCore(listItemElement) {
  setupAria(listItemElement);
}

/**
 * @param {Element} listItemElement
 * @return {boolean}
 */
export function isExpanded(listItemElement) {
  return (listItemElement.getAttribute('aria-expanded') === 'true');
}

/**
 * @param {Element} listItemElement
 * @param {boolean} value
 * @return {void}
 */
export function setExpanded(listItemElement, value) {
  listItemElement.setAttribute('aria-expanded', value ? 'true' : 'false');
  iterateArrayLike(listItemElement.querySelectorAll('[role="treeitem"]'), (treeitem) => {
    treeitem.setAttribute('mdw-skip-tab', value ? 'false' : 'true');
  });
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onChildContentActivate(event) {
  /** @type {HTMLElement} */
  const activatedElement = (event.target);
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  if (!activatedElement || activatedElement.parentElement !== element) {
    return;
  }
  if (element.hasAttribute('aria-expanded')) {
    event.stopPropagation();
    setExpanded(element, !isExpanded(element));
  }
}

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function setupAria(listItemElement) {
  let isTreeItem = null;
  if (!listItemElement.hasAttribute('role')) {
    if (listItemElement.hasAttribute('aria-expanded')) {
      listItemElement.setAttribute('role', 'treeitem');
      isTreeItem = true;
    } else {
      listItemElement.setAttribute('role', 'none');
      isTreeItem = false;
    }
  }
  if (isTreeItem !== false || listItemElement.getAttribute('role') === 'treeitem') {
    const activatorContent = getChildElementByClass(listItemElement, 'mdw-list__content');
    if (activatorContent && !activatorContent.hasAttribute('role')) {
      activatorContent.setAttribute('role', 'none');
    }
  }
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
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  if (!element) {
    return;
  }
  if (!element.hasAttribute('aria-expanded')) {
    return;
  }
  const activatorContent = getChildElementByClass(element, 'mdw-list__content');
  if (!activatorContent) {
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  const newEvent = document.createEvent('Event');
  newEvent.initEvent('click', true, true);
  activatorContent.dispatchEvent(newEvent);
}

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function detachCore(listItemElement) {
}


/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function detach(listItemElement) {
  detachCore(listItemElement);
  iterateArrayLike(listItemElement.getElementsByClassName('mdw-list__content'), ListContent.detach);
}
