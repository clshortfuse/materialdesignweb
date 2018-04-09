class TextField {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element;
    /** @type {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} */
    this.input = element.querySelector('.mdw-textfield__input');
    if (this.input) {
      if (this.input instanceof HTMLTextAreaElement && this.element.hasAttribute('mdw-multiline')) {
        this.input.addEventListener('input', () => {
          this.updateTextAreaSize();
        });
        this.updateTextAreaSize();
      }
      this.input.addEventListener('input', () => {
        this.updateInputEmptyState();
      });
      this.updateInputEmptyState();
    }
    this.border = element.querySelector('.mdw-textfield__border-line');
    if (!this.border) {
      const border = document.createElement('div');
      border.classList.add('mdw-textfield__border-line');
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

  /** @return {void} */
  updateInputEmptyState() {
    const attributeName = 'mdw-value-empty';
    if (this.input.value) {
      if (this.element.hasAttribute(attributeName)) {
        this.element.removeAttribute(attributeName);
      }
    } else if (!this.element.hasAttribute(attributeName)) {
      this.element.setAttribute('mdw-value-empty', '');
    }
  }

  /** @return {number} Single row height */
  updateTextAreaSize() {
    const previousRowsValue = this.input.getAttribute('rows');
    this.input.setAttribute('rows', '1');
    const { height, paddingTop } = window.getComputedStyle(this.input);
    if (height === 'auto') {
      this.input.setAttribute('rows', previousRowsValue);
      return -1;
    }
    const heightPx = parseInt(height.replace('px', ''), 10);
    const paddingTopPx = parseInt(paddingTop.replace('px', ''), 10);
    this.input.setAttribute('rows', Math.floor((this.input.scrollHeight - paddingTopPx) / heightPx).toString());
    return heightPx;
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

  /**
   * @return {string|Date|number}
   */
  get value() {
    if ((this.input instanceof HTMLTextAreaElement) || (this.input instanceof HTMLSelectElement)) {
      return this.value;
    }
    const type = this.input.hasAttribute('type') && this.input.getAttribute('type').toLowerCase();
    switch (type) {
      case 'number':
      case 'range':
        return this.input.valueAsNumber;
      case 'date':
      case 'datetime-local':
      case 'time':
        if (this.input.value == null) {
          return null;
        }
        return new Date((this.input.valueAsDate.getTimezoneOffset() * 60 * 1000)
          + this.input.valueAsNumber);
      default:
        return this.input.value;
    }
  }

  /** @param {(string|Date|number)=} value */
  set value(value) {
    if (value == null) {
      this.input.value = null;
    } else if (this.input instanceof HTMLTextAreaElement
            || this.input instanceof HTMLSelectElement) {
      if (value instanceof Date) {
        this.input.value = value.toString();
      } else if (typeof value === 'string') {
        this.input.value = value;
      } else {
        this.input.value = value.toString(10);
      }
    } else if (value instanceof Date) {
      const type = this.input.hasAttribute('type') && this.input.getAttribute('type').toLowerCase();
      if (type === 'time') {
        const hoursStr = `${value.getHours() < 10 ? '0' : ''}${value.getHours()}`;
        const minutesStr = `${value.getMinutes() < 10 ? '0' : ''}${value.getMinutes()}`;
        const secondsStr = `${value.getSeconds() < 10 ? '0' : ''}${value.getSeconds()}`;
        this.input.value = `${hoursStr}:${minutesStr}:${secondsStr}.${value.getMilliseconds()}`;
      } else {
        switch (type) {
          case 'date':
          case 'datetime-local':
            this.input.valueAsDate = value;
            break;
          case 'number':
          case 'range':
            this.input.valueAsNumber = value.getTime();
            break;
          default:
            this.input.value = value.toString();
        }
      }
    } else if (typeof value === 'string') {
      this.input.value = value;
    } else {
      const type = this.input.hasAttribute('type') && this.input.getAttribute('type').toLowerCase();
      switch (type) {
        case 'date':
        case 'time':
        case 'datetime-local':
        case 'number':
        case 'range':
          this.input.valueAsNumber = value;
          break;
        default:
          this.input.value = value.toString();
      }
    }
    this.updateInputEmptyState();
    this.updateTextAreaSize();
  }
}

export {
  TextField,
};
