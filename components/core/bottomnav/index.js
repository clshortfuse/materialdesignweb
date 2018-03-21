class BottomnavAction {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    const rippleElements = element.getElementsByClassName('mdw-ripple');
    this.ripple = rippleElements && rippleElements[0];
    if (!this.ripple) {
      const ripple = document.createElement('div');
      ripple.classList.add('mdw-ripple');
      this.element.insertBefore(ripple, this.element.firstChild);
      this.ripple = ripple;
    }
    const innerRippleElements = this.ripple.getElementsByClassName('mdw-ripple__inner');
    this.rippleInner = innerRippleElements && innerRippleElements[0];
    if (!this.rippleInner) {
      const rippleInner = document.createElement('div');
      rippleInner.classList.add('mdw-ripple__inner');
      this.ripple.appendChild(rippleInner);
      this.rippleInner = rippleInner;
    }
    this.element.setAttribute('mdw-ripple', '');
    this.element.addEventListener('click', (event) => {
      this.updateRipplePosition(event);
    });
  }

  /**
   * @param {MouseEvent|PointerEvent} event
   * @return {void}
   */
  updateRipplePosition(event) {
    if (event.target !== this.element && event.target !== this.ripple) {
      return;
    }
    if (!event.pointerType && !event.detail) {
      // Ripple from center
      this.rippleInner.style.removeProperty('left');
      this.rippleInner.style.removeProperty('top');
      return;
    }
    const x = event.offsetX;
    const y = event.offsetY;
    this.rippleInner.style.setProperty('left', `${x}px`);
    this.rippleInner.style.setProperty('top', `${y}px`);
  }
}

class Bottomnav {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    this.actions = this.element.getElementsByClassName('mdw-bottomnav__action');
    this.inputs = this.element.getElementsByTagName('input');

    for (let i = 0; i < this.actions.length; i += 1) {
      const action = this.actions.item(i);
      action.addEventListener('click', () => {
        this.onActionClicked(action);
      });
    }
    for (let i = 0; i < this.inputs.length; i += 1) {
      const input = this.inputs.item(i);
      input.addEventListener('change', () => {
        this.onInputChanged(input);
      });
    }
  }

  /**
   * @param {HTMLInputElement} inputElement
   * @return {void}
   */
  onInputChanged(inputElement) {
    let actionElement;
    if (inputElement.parentElement.classList.contains('mdw-bottomnav__action')) {
      actionElement = inputElement.parentElement;
    }
    if (inputElement.id) {
      actionElement = document.querySelector(`label.mdw-bottomnav__action[for="${inputElement.id}"]`);
    }
    if (actionElement.hasAttribute('selected') && inputElement.checked) {
      return;
    }
    if (!actionElement.hasAttribute('selected') && !inputElement.checked) {
      return;
    }
    this.removeSelection();
    actionElement.setAttribute('selected', '');
  }

  /** @return {boolean} change */
  removeSelection() {
    for (let i = 0; i < this.actions.length; i += 1) {
      const action = this.actions.item(i);
      if (action.hasAttribute('selected')) {
        action.removeAttribute('selected');
        return true;
      }
    }
    return false;
  }

  /**
   * @param {Element} actionElement
   * @return {void}
   */
  onActionClicked(actionElement) {
    if (actionElement.hasAttribute('selected')) {
      return;
    }
    if (actionElement.hasAttribute('disabled')) {
      return;
    }
    this.removeSelection();
    actionElement.setAttribute('selected', '');
    let inputElement;
    if (actionElement.tagName.toLowerCase() === 'label' && actionElement.hasAttribute('for')) {
      const id = actionElement.getAttribute('for');
      if (id) {
        inputElement = document.getElementById(id);
      }
    } else {
      [inputElement] = actionElement.getElementsByTagName('input');
    }
    if (inputElement) {
      inputElement.checked = true;
    }
  }
}

export {
  Bottomnav,
  BottomnavAction,
};
