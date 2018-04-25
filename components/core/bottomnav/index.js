import { Ripple } from '../ripple/index';
import { findElementParentByClassName } from '../../common/dom';

class BottomnavItem {
  /**
   * @param {Element} bottomnavItemElement
   * @return {void}
   */
  static attach(bottomnavItemElement) {
    Ripple.attach(bottomnavItemElement);
  }

  /**
   * @param {Element} bottomnavItemElement
   * @return {void}
   */
  static detach(bottomnavItemElement) {
    Ripple.detach(bottomnavItemElement);
  }
}

class Bottomnav {
  /**
   * @param {Element} bottomnavElement
   * @return {void}
   */
  static attach(bottomnavElement) {
    const items = bottomnavElement.getElementsByClassName('mdw-bottomnav__item');
    const inputs = bottomnavElement.getElementsByClassName('mdw-bottomnav__input');

    for (let i = 0; i < items.length; i += 1) {
      const item = items.item(i);
      BottomnavItem.attach(item);
      item.addEventListener('click', Bottomnav.onItemClicked);
    }
    for (let i = 0; i < inputs.length; i += 1) {
      const input = inputs.item(i);
      input.addEventListener('change', Bottomnav.onInputChanged);
    }
  }

  static detach(bottomnavElement) {
    const items = bottomnavElement.getElementsByClassName('mdw-bottomnav__item');
    const inputs = bottomnavElement.getElementsByClassName('mdw-bottomnav__input');
    for (let i = 0; i < items.length; i += 1) {
      const item = items.item(i);
      BottomnavItem.detach(item);
      item.removeEventListener('click', Bottomnav.onItemClicked);
    }
    for (let i = 0; i < inputs.length; i += 1) {
      const input = inputs.item(i);
      input.removeEventListener('change', Bottomnav.onInputChanged);
    }
  }

  /**
   * @param {Event} event
   * @return {void}
   */
  static onInputChanged(event) {
    /** @type {HTMLInputElement} */
    const inputElement = event.target;
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
      Bottomnav.removeSelection(bottomnavElement);
    }
    itemElement.setAttribute('mdw-selected', '');
  }

  /**
   * @param {Element} bottomnavElement
   * @return {boolean} changed
   */
  static removeSelection(bottomnavElement) {
    const items = bottomnavElement.getElementsByClassName('mdw-bottomnav__item');
    for (let i = 0; i < items.length; i += 1) {
      const item = items.item(i);
      if (item.hasAttribute('mdw-selected')) {
        item.removeAttribute('mdw-selected');
        return true;
      }
    }
    return false;
  }

  /**
   * @param {Event} event
   * @return {void}
   */
  static onItemClicked(event) {
    /** @type {Element} */
    const itemElement = findElementParentByClassName(event.target, 'mdw-bottomnav__item');
    if (itemElement.hasAttribute('mdw-selected')) {
      return;
    }
    if (itemElement.hasAttribute('disabled')) {
      return;
    }
    const bottomnavElement = findElementParentByClassName(itemElement, 'mdw-bottomnav');
    if (bottomnavElement) {
      Bottomnav.removeSelection(bottomnavElement);
    }
    itemElement.setAttribute('mdw-selected', '');
    let inputElement;
    if (itemElement instanceof HTMLLabelElement && itemElement.hasAttribute('for')) {
      const id = itemElement.getAttribute('for');
      if (id) {
        inputElement = document.getElementById(id);
      }
    } else {
      [inputElement] = itemElement.getElementsByClassName('mdw-bottomnav__input');
    }
    if (inputElement instanceof HTMLInputElement) {
      inputElement.checked = true;
    } else if (inputElement) {
      throw new Error('Unexpected inputElement type');
    }
  }
}

export {
  Bottomnav,
  BottomnavItem,
};
