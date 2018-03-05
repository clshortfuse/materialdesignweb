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
    const actions = this.element.querySelectorAll('.mdw-bottomnav__action');
    for (let i = 0; i < actions.length; i += 1) {
      const action = actions[i];
      action.addEventListener('click', () => {
        this.onActionClicked(action);
      });
    }
    const inputs = this.element.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i += 1) {
      const input = inputs[i];
      input.addEventListener('change', () => {
        this.onInputChanged(input);
      });
    }
  }

  /**
   * @param {HTMLInputElement} element
   * @return {void}
   */
  onInputChanged(element) {
    let actionElement;
    if (element.parentElement.classList.contains('.mdw-bottomnav__action')) {
      actionElement = element.parentElement;
    }
    if (element.id) {
      actionElement = document.querySelector(`label.mdw-bottomnav__action[for="${element.id}"]`);
    }
    if (actionElement.hasAttribute('selected') && element.checked) {
      return;
    }
    if (!actionElement.hasAttribute('selected') && !element.checked) {
      return;
    }
    const selectedItem = this.element.querySelector('.mdw-bottomnav__action[selected]');
    if (selectedItem) {
      selectedItem.removeAttribute('selected');
    }
    actionElement.setAttribute('selected');
  }

  /**
   * @param {HTMLElement} element
   * @return {void}
   */
  onActionClicked(element) {
    if (element.hasAttribute('selected')) {
      return;
    }
    if (element.hasAttribute('disabled')) {
      return;
    }
    const selectedItem = this.element.querySelector('.mdw-bottomnav__action[selected]');
    if (selectedItem) {
      selectedItem.removeAttribute('selected');
    }
    element.setAttribute('selected', '');
    let inputElement = element.querySelector('input');
    if (!inputElement && element.tagName.toLowerCase() === 'label') {
      const id = element.getAttribute('for');
      if (id) {
        inputElement = document.getElementById('id');
      }
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
