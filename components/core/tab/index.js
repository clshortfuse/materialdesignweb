class TabItem {
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
    if (this.element.hasAttribute('mdw-icon') || (!event.pointerType && !event.detail)) {
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

class Tab {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    this.inputs = element.getElementsByTagName('input');
    this.items = element.getElementsByClassName('mdw-tab__item');

    const [indicatorElement] = element.getElementsByClassName('mdw-tab__indicator');
    this.indicator = indicatorElement;
    if (!this.indicator) {
      const indicator = document.createElement('div');
      indicator.classList.add('mdw-tab__indicator');
      this.element.appendChild(indicator);
      this.indicator = indicator;
    }

    for (let i = 0; i < this.inputs.length; i += 1) {
      const inputElement = this.inputs[i];
      if (inputElement.checked) {
        this.onInputChanged(inputElement);
      }
      inputElement.addEventListener('change', () => {
        this.onInputChanged(inputElement);
      });
    }

    for (let i = 0; i < this.items.length; i += 1) {
      const itemElement = this.items[i];
      if (itemElement.hasAttribute('mdw-selected')) {
        this.selectItem(itemElement);
      }
      itemElement.addEventListener('click', () => {
        this.selectItem(itemElement);
      });
    }
  }

  /**
   * @param {HTMLInputElement} inputElement
   * @return {HTMLElement}
   */
  static getItemForInput(inputElement) {
    let itemElement;
    if (inputElement.parentElement.classList.contains('mdw-tab__item')) {
      itemElement = inputElement.parentElement;
    }
    if (inputElement.id) {
      itemElement = document.querySelector(`label.mdw-tab__item[for="${inputElement.id}"]`);
    }
    return itemElement;
  }

  static isRtl() {
    const htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement.hasAttribute('dir') && htmlElement.getAttribute('dir').toLowerCase() === 'rtl') {
      return true;
    }
    if (!document.body.hasAttribute('dir')) {
      return false;
    }
    return document.body.getAttribute('dir').toLowerCase() === 'rtl';
  }

  useCSSAnimation() {
    this.indicator.style.removeProperty('left');
    this.indicator.style.removeProperty('right');
    this.indicator.style.removeProperty('width');
    this.indicator.removeAttribute('mdw-js-indicator');
  }

  /**
   * @param {HTMLElement} itemElement
   * @return {void}
   */
  selectItem(itemElement) {
    let foundPreviousSelection = false;
    let foundTarget = false;
    let left = 0;
    const isRtl = Tab.isRtl();
    for (let i = 0; i < this.items.length; i += 1) {
      const index = isRtl ? this.items.length - 1 - i : i;
      const item = this.items.item(index);
      if (item.hasAttribute('mdw-selected')) {
        foundPreviousSelection = true;
        item.removeAttribute('mdw-selected');
      }
      if (item === itemElement) {
        foundTarget = true;
        itemElement.setAttribute('mdw-selected', '');
      }
      if (!foundTarget) {
        left += item.clientWidth;
      }
      if (foundTarget && foundPreviousSelection) {
        break;
      }
    }

    // Animation selection

    // Only use explicity positioning on scrollable tabs
    if (!this.element.hasAttribute('mdw-scrollable') || !this.element.clientWidth) {
      // use CSS styling fallback
      this.useCSSAnimation();
      return;
    }
    const width = itemElement.clientWidth;
    const right = this.element.clientWidth - left - itemElement.clientWidth;
    if (!this.indicator.hasAttribute('mdw-js-indicator')) {
      this.indicator.setAttribute('mdw-js-indicator', '');
    }

    this.indicator.style.setProperty('left', `${left}px`);
    this.indicator.style.setProperty('right', `${right}px`);
    this.indicator.style.setProperty('width', `${width}px`);
  }

  /**
   * @param {HTMLInputElement} inputElement
   * @return {void}
   */
  onInputChanged(inputElement) {
    const itemElement = Tab.getItemForInput(inputElement);
    if (itemElement) {
      this.selectItem(itemElement);
    }
  }
}

export {
  Tab,
  TabItem,
};
