import { getChildElementByClass } from '../common/dom';
import { Ripple } from '../ripple/index';

class TextField {
  /**
   * @param {Element} textfieldElement
   * @return {void}
   */
  static attach(textfieldElement) {
    /** @type {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} */
    const input = getChildElementByClass(textfieldElement, 'mdw-textfield__input');
    if (input) {
      input.addEventListener('input', TextField.onInput);
      TextField.onInput({ target: input });
    }
    let border = getChildElementByClass(textfieldElement, 'mdw-textfield__border-line');
    if (!border) {
      border = document.createElement('div');
      border.classList.add('mdw-textfield__border-line');
      textfieldElement.appendChild(border);
    }
    Ripple.attach(border);
  }

  /**
   * @param {Element} textfieldElement
   * @return {void}
   */
  static detach(textfieldElement) {
    textfieldElement.removeAttribute('mdw-value-empty');
    const input = getChildElementByClass(textfieldElement, 'mdw-textfield__input');
    if (input) {
      input.removeEventListener('input', TextField.onInput);
    }
    const border = getChildElementByClass(textfieldElement, 'mdw-textfield__border-line');
    if (border) {
      Ripple.detach(border);
    }
  }

  /**
   * @param {Event} event
   * @return {void}
   */
  static onInput(event) {
    const inputElement = event.target;
    if (inputElement.parentElement.hasAttribute('mdw-multiline')) {
      TextField.updateTextAreaSize(inputElement);
    }
    TextField.updateInputEmptyState(inputElement);
  }

  /**
   * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} inputElement
   * @return {void} */
  static updateInputEmptyState(inputElement) {
    const attributeName = 'mdw-value-empty';
    const textfieldElement = inputElement.parentElement;
    if (inputElement.value) {
      if (textfieldElement.hasAttribute(attributeName)) {
        textfieldElement.removeAttribute(attributeName);
      }
    } else if (!textfieldElement.hasAttribute(attributeName)) {
      textfieldElement.setAttribute('mdw-value-empty', '');
    }
  }

  /**
   * @param {HTMLInputElement} inputElement
   * @return {number} Single row height */
  static updateTextAreaSize(inputElement) {
    const previousRowsValue = inputElement.getAttribute('rows');
    inputElement.setAttribute('rows', '1');
    const { height, paddingTop } = window.getComputedStyle(inputElement);
    if (height === 'auto') {
      inputElement.setAttribute('rows', previousRowsValue);
      return -1;
    }
    const heightPx = parseInt(height.replace('px', ''), 10);
    const paddingTopPx = parseInt(paddingTop.replace('px', ''), 10);
    inputElement.setAttribute('rows', Math.floor((inputElement.scrollHeight - paddingTopPx) / heightPx).toString());
    return heightPx;
  }

  /**
   * @param {Element} textfieldElement
   * @return {string|Date|number}
   */
  static getValue(textfieldElement) {
    /** @type {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} */
    const input = getChildElementByClass(textfieldElement, 'mdw-textfield__input');
    if ((input instanceof HTMLTextAreaElement) || (input instanceof HTMLSelectElement)) {
      return input.value;
    }
    const type = input.hasAttribute('type') && input.getAttribute('type').toLowerCase();
    switch (type) {
      case 'number':
      case 'range':
        return input.valueAsNumber;
      case 'date':
      case 'datetime-local':
      case 'time':
        if (input.value == null) {
          return null;
        }
        return new Date((input.valueAsDate.getTimezoneOffset() * 60 * 1000) + input.valueAsNumber);
      default:
        return input.value;
    }
  }

  /**
   * @param {Element} textfieldElement
   * @param {(string|Date|number)=} value
   * @return {void}
   */
  static setValue(textfieldElement, value) {
    /** @type {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} */
    const input = getChildElementByClass(textfieldElement, 'mdw-textfield__input');
    if (value == null) {
      input.value = null;
    } else if (input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
      if (value instanceof Date) {
        input.value = value.toString();
      } else if (typeof value === 'string') {
        input.value = value;
      } else {
        input.value = value.toString(10);
      }
    } else if (value instanceof Date) {
      const type = input.hasAttribute('type') && input.getAttribute('type').toLowerCase();
      if (type === 'time') {
        const hoursStr = `${value.getHours() < 10 ? '0' : ''}${value.getHours()}`;
        const minutesStr = `${value.getMinutes() < 10 ? '0' : ''}${value.getMinutes()}`;
        const secondsStr = `${value.getSeconds() < 10 ? '0' : ''}${value.getSeconds()}`;
        input.value = `${hoursStr}:${minutesStr}:${secondsStr}.${value.getMilliseconds()}`;
      } else {
        switch (type) {
          case 'date':
          case 'datetime-local':
            input.valueAsDate = value;
            break;
          case 'number':
          case 'range':
            input.valueAsNumber = value.getTime();
            break;
          default:
            input.value = value.toString();
        }
      }
    } else if (typeof value === 'string') {
      input.value = value;
    } else {
      const type = input.hasAttribute('type') && input.getAttribute('type').toLowerCase();
      switch (type) {
        case 'date':
        case 'time':
        case 'datetime-local':
        case 'number':
        case 'range':
          input.valueAsNumber = value;
          break;
        default:
          input.value = value.toString();
      }
    }
    TextField.updateInputEmptyState(input);
    if (textfieldElement.hasAttribute('mdw-multiline')) {
      TextField.updateTextAreaSize(input);
    }
  }
}

export {
  TextField,
};
