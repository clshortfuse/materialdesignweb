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

class TabItem {
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

class Tab {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    const indicatorElements = element.getElementsByClassName('mdw-tab__indicator');
    this.indicator = indicatorElements && indicatorElements[0];
    if (!this.indicator) {
      const indicator = document.createElement('div');
      indicator.classList.add('mdw-tab__indicator');
      this.element.appendChild(indicator);
      this.indicator = indicator;
    }
    const inputElements = element.getElementsByTagName('input');
    for (let i = 0; i < inputElements.length; i += 1) {
      const inputElement = inputElements[i];
      if (inputElement.checked) {
        this.onTabInputChanged(inputElement);
      }
      inputElements[i].addEventListener('change', (event) => {
        this.onTabInputChanged(event.target);
      });
    }

    // this.indicator.setAttribute('mdw-js-indicator', '');
  }

  /**
   * @param {HTMLInputElement} inputElement
   * @return {void}
   */
  onTabInputChanged(inputElement) {
    if (!this.element.clientWidth) {
      this.indicator.removeAttribute('mdw-js-indicator');
      return;
    }
    this.indicator.setAttribute('mdw-js-indicator', '');
    if (this.selectedInput === inputElement) {
      return;
    }
    const currentlySelectedInput = this.selectedInput;
    this.selectedInput = inputElement;
    const inputElements = this.element.getElementsByTagName('input');
    let left = 0;
    let attributeSet = false;
    for (let i = 0; i < inputElements.length; i += 1) {
      const candidate = inputElements[i];
      if (candidate === currentlySelectedInput) {
        this.indicator.setAttribute('mdw-direction', 'forwards');
        attributeSet = true;
      }
      if (candidate === inputElement) {
        if (!attributeSet) {
          this.indicator.setAttribute('mdw-direction', 'reverse');
        }
        break;
      }
      let labelElement = inputElement.nextElementSibling;
      if (labelElement.tagName.toLowerCase() !== 'label') {
        labelElement = inputElement.parentElement;
      }
      left += labelElement.clientWidth;
    }
    let labelElement = inputElement.nextElementSibling;
    if (labelElement.tagName.toLowerCase() !== 'label') {
      labelElement = inputElement.parentElement;
    }
    const right = this.element.clientWidth - left - labelElement.clientWidth;
    this.indicator.style.setProperty('left', `${left}px`);
    this.indicator.style.setProperty('right', `${right}px`);
  }
}

export {
  Tab,
  TabItem,
};
