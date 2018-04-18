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

    const [tabItemsElement] = element.getElementsByClassName('mdw-tab__items');
    this.tabItemsElement = tabItemsElement;
    const [indicatorElement] = element.getElementsByClassName('mdw-tab__indicator');
    this.indicator = indicatorElement;

    const [tabContentElement] = element.getElementsByClassName('mdw-tab__content')
    this.tabContent = tabContentElement;
    if (!this.indicator) {
      const indicator = document.createElement('div');
      indicator.classList.add('mdw-tab__indicator');
      tabItemsElement.appendChild(indicator);
      this.indicator = indicator;
    }

    const inputs = element.getElementsByClassName('mdw-tab__input');
    const items = element.getElementsByClassName('mdw-tab__item');

    for (let i = 0; i < inputs.length; i += 1) {
      const inputElement = inputs[i];
      if (inputElement.checked) {
        this.onInputChanged(inputElement);
      }
      inputElement.addEventListener('change', () => {
        this.onInputChanged(inputElement);
      });
    }

    for (let i = 0; i < items.length; i += 1) {
      const itemElement = items[i];
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
    if (inputElement.id) {
      itemElement = document.querySelector(`label.mdw-tab__item[for="${inputElement.id}"]`);
    }
    return itemElement;
  }

  static isRtl() {
    return document.documentElement.hasAttribute('dir')
      && document.documentElement.getAttribute('dir').toLowerCase() === 'rtl';
  }

  useCSSAnimation() {
    this.indicator.style.removeProperty('left');
    this.indicator.style.removeProperty('right');
    this.indicator.style.removeProperty('width');
    this.indicator.style.removeProperty('transform');
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
    const tabItems = this.tabItemsElement.getElementsByClassName('mdw-tab__item');
    let contentItems = null;
    if (this.tabContent) {
      contentItems = this.tabContent.getElementsByClassName('mdw-tab__content-item');
    }
    const isRtl = Tab.isRtl();
    for (let i = 0; i < tabItems.length; i += 1) {
      const index = isRtl ? tabItems.length - 1 - i : i;
      const tabItem = tabItems.item(index);
      const contentItem = contentItems && contentItems.item(index);
      if (tabItem === itemElement) {
        foundTarget = true;
        itemElement.setAttribute('mdw-selected', '');
        if (this.tabContent) {
          this.tabContent.setAttribute('mdw-selected-index', index.toString());
        }
        if (contentItem) {
          contentItem.setAttribute('mdw-selected', '');
        }
      } else {
        if (tabItem.hasAttribute('mdw-selected')) {
          foundPreviousSelection = true;
          tabItem.removeAttribute('mdw-selected');
        }
        if (contentItem && contentItem.hasAttribute('mdw-selected')) {
          contentItem.removeAttribute('mdw-selected');
        }
      }

      if (!foundTarget) {
        left += tabItem.clientWidth;
      }
      if (foundTarget && foundPreviousSelection) {
        break;
      }
    }

    itemElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    // Animate selection
    // Only use explicity positioning on scrollable tabs
    if (!this.tabItemsElement.hasAttribute('mdw-scrollable') || !this.tabItemsElement.clientWidth) {
      // use CSS styling fallback
      this.useCSSAnimation();
      this.onItemSelected(itemElement);
      return;
    }
    const width = itemElement.clientWidth;
    const right = this.tabItemsElement.scrollWidth - left - itemElement.clientWidth;
    if (!this.indicator.hasAttribute('mdw-js-indicator')) {
      this.indicator.setAttribute('mdw-js-indicator', '');
    }

    this.indicator.style.setProperty('left', `${left}px`);
    this.indicator.style.setProperty('right', `${right}px`);
    this.indicator.style.setProperty('width', `${width}px`);
    this.indicator.style.setProperty('transform', 'none');
    this.onItemSelected(itemElement);
  }

  /**
   * @param {HTMLInputElement} itemElement
   * @return {void}
   */
  onItemSelected(itemElement) {
    // Override
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
