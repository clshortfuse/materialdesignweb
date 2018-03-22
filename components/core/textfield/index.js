/**
 * @param {Element} element
 * @return {number} Single row height
 */
function updateTextAreaSize(element) {
  const previousRowsValue = element.getAttribute('rows');
  element.setAttribute('rows', '1');
  const { height, paddingTop } = window.getComputedStyle(element);
  if (height === 'auto') {
    element.setAttribute('rows', previousRowsValue);
    return -1;
  }
  const heightPx = parseInt(height.replace('px', ''), 10);
  const paddingTopPx = parseInt(paddingTop.replace('px', ''), 10);
  element.setAttribute('rows', Math.floor((element.scrollHeight - paddingTopPx) / heightPx).toString());
  return heightPx;
}

/**
 * @param {HTMLInputElement|HTMLTextAreaElement} element
 * @return {void}
 */
function updateInputEmptyState(element) {
  const attributeName = 'mdw-value-empty';
  if (element.value) {
    if (element.hasAttribute(attributeName)) {
      element.removeAttribute(attributeName);
    }
  } else if (!element.hasAttribute(attributeName)) {
    element.setAttribute('mdw-value-empty', '');
  }
}

class TextField {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element;
    /** @type {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} */
    this.input = element.querySelector('.mdw-textfield__input');
    if (this.input) {
      if (this.input.tagName.toLowerCase() === 'textarea' && this.element.hasAttribute('mdw-multiline')) {
        this.input.addEventListener('input', () => {
          updateTextAreaSize(this.input);
        });
        updateTextAreaSize(this.input);
      }
      this.input.addEventListener('input', () => {
        updateInputEmptyState(this.input);
      });
      updateInputEmptyState(this.input);
    }
    this.border = element.querySelector('.mdw-textfield__border-line');
    if (!this.border) {
      const border = document.createElement('div');
      border.classList.add('.mdw-textfield__border-line');
      element.appendChild(border);
      this.border = border;
    }
    const rippleElements = this.border.getElementsByClassName('mdw-ripple');
    this.ripple = rippleElements && rippleElements[0];
    if (!this.ripple) {
      const ripple = document.createElement('div');
      ripple.classList.add('mdw-ripple');
      this.border.appendChild(ripple);
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
    this.border.addEventListener('click', (event) => {
      this.updateRipplePosition(event);
    });
  }

  /**
   * @param {MouseEvent|PointerEvent} event
   * @return {void}
   */
  updateRipplePosition(event) {
    if (event.target !== this.border && event.target !== this.ripple) {
      return;
    }
    if ((!event.pointerType && !event.detail)) {
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

export {
  TextField,
};
