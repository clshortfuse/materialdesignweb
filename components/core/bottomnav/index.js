/**
 * @param {HTMLElement} element
 * @param {MouseEvent} event
 * @return {void} Single row height
 */
function updateRipplePosition(element, event) {
  if (!event.detail) {
    // Ripple only on mouse or touch events
    return;
  }
  const x = event.offsetX - (element.clientWidth / 2.0);
  const y = event.offsetY - (element.clientHeight / 2.0);
  element.style.setProperty('left', `${x}px`);
  element.style.setProperty('top', `${y}px`);
}

class BottomnavAction {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    const rippleElements = element.getElementsByClassName('.mdw-ripple');
    this.ripple = rippleElements && rippleElements[0];
    if (!this.ripple) {
      const ripple = document.createElement('div');
      ripple.classList.add('mdw-ripple');
      this.element.insertBefore(ripple, this.element.firstChild);
      this.ripple = ripple;
    }
    this.element.setAttribute('mdw-js-ripple', '');
    this.element.addEventListener('click', (event) => {
      updateRipplePosition(this.ripple, event);
    });
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
