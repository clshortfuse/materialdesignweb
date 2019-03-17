import { findElementParentByClassName, iterateArrayLike, iterateSomeOfArrayLike } from '../common/dom';

import * as BottomNavItem from './item';

/**
 * @param {Element} bottomnavElement
 * @return {void}
 */
export function attach(bottomnavElement) {
  iterateArrayLike(bottomnavElement.getElementsByClassName('mdw-bottomnav__item'), (item) => {
    BottomNavItem.attach(item);
    item.addEventListener('click', onItemClicked);
  });

  iterateArrayLike(bottomnavElement.getElementsByClassName('mdw-bottomnav__input'), (input) => {
    input.addEventListener('change', onInputChanged);
  });
}

/**
 * @param {Element} bottomnavElement
 * @return {void}
 */
export function detach(bottomnavElement) {
  iterateArrayLike(bottomnavElement.getElementsByClassName('mdw-bottomnav__item'), (item) => {
    BottomNavItem.attach(item);
    item.removeEventListener('click', onItemClicked);
  });
  iterateArrayLike(bottomnavElement.getElementsByClassName('mdw-bottomnav__input'), (input) => {
    input.removeEventListener('change', onInputChanged);
  });
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onInputChanged(event) {
  /** @type {HTMLInputElement} */
  const inputElement = (event.target);
  let itemElement;
  if (inputElement.parentElement.classList.contains('mdw-bottomnav__item')) {
    itemElement = inputElement.parentElement;
  }
  if (inputElement.id) {
    itemElement = document.querySelector(`label.mdw-bottomnav__item[for="${inputElement.id}"]`);
  }
  if (itemElement.hasAttribute('mdw-selected') && inputElement.checked) {
    return;
  }
  if (!itemElement.hasAttribute('mdw-selected') && !inputElement.checked) {
    return;
  }
  const bottomnavElement = findElementParentByClassName(inputElement, 'mdw-bottomnav');
  if (bottomnavElement) {
    removeSelection(bottomnavElement);
  }
  itemElement.setAttribute('mdw-selected', '');
}

/**
 * @param {Element} bottomnavElement
 * @return {boolean} changed
 */
export function removeSelection(bottomnavElement) {
  return iterateSomeOfArrayLike(bottomnavElement.getElementsByClassName('mdw-bottomnav__item'),
    (item) => {
      if (item.hasAttribute('mdw-selected')) {
        item.removeAttribute('mdw-selected');
        return true;
      }
      return false;
    });
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onItemClicked(event) {
  /** @type {HTMLElement} */
  const itemElement = (event.currentTarget);
  if (itemElement.hasAttribute('mdw-selected')) {
    return;
  }
  if (itemElement.hasAttribute('disabled')) {
    return;
  }
  const bottomnavElement = findElementParentByClassName(itemElement, 'mdw-bottomnav');
  if (bottomnavElement) {
    removeSelection(bottomnavElement);
  }
  itemElement.setAttribute('mdw-selected', '');
  let inputElement;
  if (itemElement instanceof HTMLLabelElement && itemElement.hasAttribute('for')) {
    const id = itemElement.getAttribute('for');
    if (id) {
      inputElement = document.getElementById(id);
    }
  } else {
    inputElement = itemElement.getElementsByClassName('mdw-bottomnav__input')[0];
  }
  if (inputElement instanceof HTMLInputElement) {
    inputElement.checked = true;
  } else if (inputElement) {
    throw new Error('Unexpected inputElement type');
  }
}
