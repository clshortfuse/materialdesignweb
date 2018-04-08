/**
 * @param {HTMLElement} element
 * @param {MouseEvent|PointerEvent} event
 * @return {void}
 */
function updateRipplePosition(element, event) {
  if (!event.pointerType && !event.detail) {
    // Ripple from center
    element.style.setProperty('left', '0');
    element.style.setProperty('top', '0');
    return;
  }
  const x = event.offsetX - (element.clientWidth / 2.0);
  const y = event.offsetY - (element.clientHeight / 2.0);
  element.style.setProperty('left', `${x}px`);
  element.style.setProperty('top', `${y}px`);
}

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
    this.element.setAttribute('mdw-js-ripple', '');
    this.element.addEventListener('click', (event) => {
      updateRipplePosition(this.ripple, event);
    });
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

    const indicatorElements = element.getElementsByClassName('mdw-tab__indicator');
    this.indicator = indicatorElements && indicatorElements[0];
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

  /**
   * @param {HTMLElement} itemElement
   * @return {boolean} changed
   */
  selectItem(itemElement) {
    let foundPreviousSelection = false;
    let foundTarget = false;
    let indicatorUpdated = false;
    let left = 0;
    const isRtl = Tab.isRtl();
    for (let i = 0; i < this.items.length; i += 1) {
      const index = isRtl ? this.items.length - 1 -i : i;
      const item = this.items.item(index);
      if (item.hasAttribute('mdw-selected')) {
        foundPreviousSelection = true;
        item.removeAttribute('mdw-selected');
        if (!indicatorUpdated) {
          this.indicator.setAttribute('mdw-direction', 'forwards');
          indicatorUpdated = true;
        }
      }
      if (item === itemElement) {
        foundTarget = true;
        itemElement.setAttribute('mdw-selected', '');
        if (!indicatorUpdated) {
          this.indicator.setAttribute('mdw-direction', 'backwards');
          indicatorUpdated = true;
        }
      }
      if (!foundTarget) {
        left += item.clientWidth;
      }
      if (foundTarget && foundPreviousSelection) {
        break;
      }
    }

    if (!this.element.clientWidth) {
      this.indicator.style.setProperty('left', '');
      this.indicator.style.setProperty('right', '');
      this.indicator.removeAttribute('mdw-js-indicator');
      // use CSS styling fallback
      return false;
    }
    const right = this.element.clientWidth - left - itemElement.clientWidth;
    if (!this.indicator.hasAttribute('mdw-js-indicator')) {
      this.indicator.setAttribute('mdw-js-indicator', '');
    }

    this.indicator.style.setProperty('left', `${left}px`);
    this.indicator.style.setProperty('right', `${right}px`);
    return false;
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
