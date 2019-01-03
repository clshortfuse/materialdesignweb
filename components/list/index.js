import { Ripple } from '../ripple/index';
import {
  dispatchDomEvent,
  findElementParentByClassName,
  iterateArrayLike,
} from '../common/dom';

class ListItem {
  /**
   * @param {Element} listItemElement
   * @return {void}
   */
  static attach(listItemElement) {
    Ripple.attach(listItemElement);
    listItemElement.addEventListener('click', ListItem.onClick);
  }

  /**
   * @param {Element} listItemElement
   * @return {void}
   */
  static detach(listItemElement) {
    listItemElement.removeEventListener('click', ListItem.onClick);
    Ripple.detach(listItemElement);
  }

  /**
   * @param {MouseEvent|KeyboardEvent|PointerEvent} event
   * @return {void}
   */
  static onClick(event) {
    const el = event.currentTarget;
    dispatchDomEvent(el, 'mdw:itemactivated');
  }
}

class ListExpander {
  /**
   * @param {Element} listExpanderElement
   * @return {void}
   */
  static attach(listExpanderElement) {
    if (!listExpanderElement.firstElementChild) {
      return;
    }
    listExpanderElement.firstElementChild.addEventListener('click', ListExpander.onItemClicked);
  }

  static detach(listExpanderElement) {
    if (!listExpanderElement.firstElementChild) {
      return;
    }
    listExpanderElement.firstElementChild.removeEventListener('click', ListExpander.onItemClicked);
  }

  /**
   * @param {Event} event
   * @return {void}
   */
  static onItemClicked(event) {
    const listExpanderElement = findElementParentByClassName(event.target, 'mdw-list__expander');
    if (!listExpanderElement) {
      return;
    }
    if (listExpanderElement.hasAttribute('mdw-expanded')) {
      listExpanderElement.removeAttribute('mdw-expanded');
    } else {
      listExpanderElement.setAttribute('mdw-expanded', '');
    }
  }
}

class List {
  /**
   * @param {Element} listElement
   * @return {void}
   */
  static attach(listElement) {
    iterateArrayLike(listElement.getElementsByClassName('mdw-list__item'), ListItem.attach);
    iterateArrayLike(listElement.getElementsByClassName('mdw-list__expander'), ListExpander.attach);
  }

  static detach(listElement) {
    iterateArrayLike(listElement.getElementsByClassName('mdw-list__item'), ListItem.detach);
    iterateArrayLike(listElement.getElementsByClassName('mdw-list__expander'), ListExpander.detach);
  }
}

export {
  List,
  ListItem,
  ListExpander,
};
