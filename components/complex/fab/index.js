class Fab {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    let [closer] = this.element.getElementsByClassName('mdw-fab__close');
    if (!closer) {
      closer = document.createElement('div');
      closer.classList.add('mdw-fab__close');
      this.element.appendChild(closer);
    }
    this.menuCloser = closer;
    this.menuCloser.addEventListener('click', () => {
      this.hide();
    });
    const [fabButton] = this.element.getElementsByClassName('mdw-fab__button');
    this.fabButton = fabButton;
    this.fabButton.addEventListener('click', () => {
      this.toggle();
    });
  }

  detach() {
    this.element = null;
  }

  /** @return {boolean} handled */
  show() {
    let changed = false;
    if (this.element.hasAttribute('mdw-hide')) {
      this.element.removeAttribute('mdw-hide');
      changed = true;
    }
    if (!this.element.hasAttribute('mdw-show')) {
      this.element.setAttribute('mdw-show', '');
      changed = true;
    }
    return changed;
  }

  /** @return {boolean} handled */
  hide() {
    if (!this.element.hasAttribute('mdw-hide')) {
      this.element.setAttribute('mdw-hide', '');
    } else {
      return false;
    }
    if (this.element.hasAttribute('mdw-show')) {
      this.element.removeAttribute('mdw-show');
      return true;
    }
    return false;
  }

  toggle() {
    if (this.hide()) {
      return;
    }
    this.show();
  }

  /**
   * Clear and detach all children
   * @param {WeakMap=} elementMap
   * @return {void}
   */
  clear(elementMap) {
    const el = this.element;
    if (!el) {
      return;
    }
    while (el.firstChild) {
      if (elementMap && elementMap.has(el.firstChild)) {
        elementMap.get(el.firstChild).detach();
        elementMap.delete(el.firstChild);
      }
      el.removeChild(el.firstChild);
    }
  }
}

export {
  Fab,
};
