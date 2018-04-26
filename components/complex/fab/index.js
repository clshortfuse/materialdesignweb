import { findElementParentByClassName } from '../../common/dom';

class Fab {
  /**
   * @param {Element} fabElement
   * @return {void}
   */
  static attach(fabElement) {
    let [closer] = fabElement.getElementsByClassName('mdw-fab__close');
    if (!closer) {
      closer = document.createElement('div');
      closer.classList.add('mdw-fab__close');
      fabElement.appendChild(closer);
    }
    closer.addEventListener('click', Fab.onCloserClicked);
    const [fabButton] = fabElement.getElementsByClassName('mdw-fab__button');
    fabButton.addEventListener('click', Fab.onFabButtonClicked);
  }

  static detach(fabElement) {
    const [fabButton] = fabElement.getElementsByClassName('mdw-fab__button');
    fabButton.removeEventListener('click', Fab.onFabButtonClicked);
    const [closer] = fabElement.getElementsByClassName('mdw-fab__close');
    if (closer) {
      closer.removeEventListener('click', Fab.onCloserClicked);
    }
  }

  static onCloserClicked(event) {
    const fabElement = findElementParentByClassName(event.target, 'mdw-fab');
    if (!fabElement) {
      return;
    }
    Fab.hide(fabElement);
  }

  static onFabButtonClicked(event) {
    const fabElement = findElementParentByClassName(event.target, 'mdw-fab');
    if (!fabElement) {
      return;
    }
    Fab.toggle(fabElement);
  }

  /**
   * @param {Element} fabElement
   * @return {boolean} handled
   */
  static show(fabElement) {
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
  static hide(fabElement) {
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
  static toggle(fabElement) {
    if (Fab.hide(fabElement)) {
      return;
    }
    Fab.show(fabElement);
  }
}

export {
  Fab,
};
