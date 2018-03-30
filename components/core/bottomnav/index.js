class BottomnavItem {
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
    this.items = this.element.getElementsByClassName('mdw-bottomnav__item');
    this.inputs = this.element.getElementsByTagName('input');

    for (let i = 0; i < this.items.length; i += 1) {
      const item = this.items.item(i);
      item.addEventListener('click', () => {
        this.onItemClicked(item);
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
    let itemElement;
    if (inputElement.parentElement.classList.contains('mdw-bottomnav__item')) {
      itemElement = inputElement.parentElement;
    }
    if (inputElement.id) {
      itemElement = document.querySelector(`label.mdw-bottomnav__item[for="${inputElement.id}"]`);
    }
    if (itemElement.hasAttribute('selected') && inputElement.checked) {
      return;
    }
    if (!itemElement.hasAttribute('selected') && !inputElement.checked) {
      return;
    }
    this.removeSelection();
    itemElement.setAttribute('selected', '');
  }

  /** @return {boolean} change */
  removeSelection() {
    for (let i = 0; i < this.items.length; i += 1) {
      const item = this.items.item(i);
      if (item.hasAttribute('selected')) {
        item.removeAttribute('selected');
        return true;
      }
    }
    return false;
  }

  /**
   * @param {Element} itemElement
   * @return {void}
   */
  onItemClicked(itemElement) {
    if (itemElement.hasAttribute('selected')) {
      return;
    }
    if (itemElement.hasAttribute('disabled')) {
      return;
    }
    this.removeSelection();
    itemElement.setAttribute('selected', '');
    let inputElement;
    if (itemElement instanceof HTMLLabelElement && itemElement.hasAttribute('for')) {
      const id = itemElement.getAttribute('for');
      if (id) {
        inputElement = document.getElementById(id);
      }
    } else {
      [inputElement] = itemElement.getElementsByTagName('input');
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
