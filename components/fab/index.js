import { findElementParentByClassName } from '../../core/dom';

/**
 * @param {Element} fabElement
 * @return {void}
 */
export function attach(fabElement) {
  let closer = fabElement.getElementsByClassName('mdw-fab__close')[0];
  if (!closer) {
    closer = document.createElement('div');
    closer.classList.add('mdw-fab__close');
    fabElement.appendChild(closer);
  }
  closer.addEventListener('click', onCloserClicked);
  const fabButton = fabElement.getElementsByClassName('mdw-fab__button')[0];
  fabButton.addEventListener('click', onFabButtonClicked);
}

/**
 * @param {Element} fabElement
 * @return {void}
 */
export function detach(fabElement) {
  const fabButton = fabElement.getElementsByClassName('mdw-fab__button')[0];
  fabButton.removeEventListener('click', onFabButtonClicked);
  const closer = fabElement.getElementsByClassName('mdw-fab__close')[0];
  if (closer) {
    closer.removeEventListener('click', onCloserClicked);
  }
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
export function onCloserClicked(event) {
  /** @type {HTMLElement} */
  const closer = (event.currentTarget);
  const fabElement = findElementParentByClassName(closer, 'mdw-fab');
  if (!fabElement) {
    return;
  }
  hide(fabElement);
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
export function onFabButtonClicked(event) {
  /** @type {HTMLElement} */
  const button = (event.currentTarget);
  const fabElement = findElementParentByClassName(button, 'mdw-fab');
  if (!fabElement) {
    return;
  }
  toggle(fabElement);
}

/**
 * @param {Element} fabElement
 * @return {boolean} handled
 */
export function show(fabElement) {
  let changed = false;
  if (fabElement.hasAttribute('mdw-hide')) {
    fabElement.removeAttribute('mdw-hide');
    changed = true;
  }
  if (!fabElement.hasAttribute('mdw-show')) {
    fabElement.setAttribute('mdw-show', '');
    changed = true;
  }
  return changed;
}

/**
 * @param {Element} fabElement
 * @return {boolean} handled
 */
export function hide(fabElement) {
  if (!fabElement.hasAttribute('mdw-hide')) {
    fabElement.setAttribute('mdw-hide', '');
  } else {
    return false;
  }
  if (fabElement.hasAttribute('mdw-show')) {
    fabElement.removeAttribute('mdw-show');
    return true;
  }
  return false;
}

/**
 * @param {Element} fabElement
 * @return {void}
 */
export function toggle(fabElement) {
  if (hide(fabElement)) {
    return;
  }
  show(fabElement);
}
