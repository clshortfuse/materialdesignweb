import { getPassiveEventListenerOption } from '../../core/dom';

/**
 * @param {Element} textfieldElement
 * @return {void}
 */
export function attach(textfieldElement) {
  /** @type {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} */
  const input = (textfieldElement.getElementsByClassName('mdw-textfield__input')[0]);
  if (input) {
    input.addEventListener('input', onInput, getPassiveEventListenerOption());
    onInput({ currentTarget: input });
  }
}

/**
 * @param {Element} textfieldElement
 * @return {void}
 */
export function detach(textfieldElement) {
  textfieldElement.removeAttribute('mdw-value-empty');
  const input = (textfieldElement.getElementsByClassName('mdw-textfield__input')[0]);
  if (input) {
    input.removeEventListener('input', onInput);
  }
}

/**
 * @param {Event|{currentTarget:HTMLElement}} event
 * @return {void}
 */
export function onInput(event) {
  /** @type {HTMLInputElement|HTMLTextAreaElement} */
  const inputElement = (event.currentTarget);
  if (inputElement.parentElement.hasAttribute('mdw-autosize')) {
    updateTextAreaSize(/** @type {HTMLTextAreaElement} */ (inputElement));
  }
  updateInputEmptyState(inputElement);
}

/**
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} inputElement
 * @return {void} */
export function updateInputEmptyState(inputElement) {
  const attrName = 'mdw-value-empty';
  const textfieldElement = inputElement.parentElement;
  if (inputElement.value) {
    if (textfieldElement.hasAttribute(attrName)) {
      textfieldElement.removeAttribute(attrName);
    }
  } else if (!textfieldElement.hasAttribute(attrName)) {
    textfieldElement.setAttribute(attrName, '');
  }
}

/**
 * @param {HTMLTextAreaElement} inputElement
 * @return {number} Single row height */
export function updateTextAreaSize(inputElement) {
  const previousRowsAttrValue = inputElement.getAttribute('rows');
  // eslint-disable-next-line no-param-reassign
  inputElement.rows = 1;
  const { height, paddingTop } = window.getComputedStyle(inputElement);
  if (!height || height === 'auto') {
    if (previousRowsAttrValue == null) {
      inputElement.removeAttribute('rows');
    } else {
      inputElement.setAttribute('rows', previousRowsAttrValue);
    }
    return -1;
  }
  const heightPx = parseInt(height.replace('px', ''), 10);
  const paddingTopPx = parseInt(paddingTop.replace('px', ''), 10);
  // eslint-disable-next-line no-param-reassign
  inputElement.rows = Math.floor((inputElement.scrollHeight - paddingTopPx) / heightPx);
  return heightPx;
}

/**
 * @param {Element} textfieldElement
 * @return {string|Date|number}
 */
export function getValue(textfieldElement) {
  /** @type {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} */
  const input = (textfieldElement.getElementsByClassName('mdw-textfield__input')[0]);
  if ((input instanceof HTMLTextAreaElement) || (input instanceof HTMLSelectElement)) {
    return input.value;
  }
  switch (input.type) {
    case 'number':
    case 'range':
      return Number.isNaN(input.valueAsNumber) ? null : input.valueAsNumber;
    case 'date':
    case 'datetime-local':
    case 'time':
      if (input.value == null) {
        return null;
      }
      return new Date(
        (new Date(input.valueAsNumber).getTimezoneOffset() * 60 * 1000) + input.valueAsNumber
      );
    default:
      return input.value;
  }
}

/**
 * @param {Element} textfieldElement
 * @param {string|Date|number} [value]
 * @return {void}
 */
export function setValue(textfieldElement, value) {
  /** @type {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} */
  const input = (textfieldElement.getElementsByClassName('mdw-textfield__input')[0]);
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
    if (input.type === 'time') {
      const hoursStr = `${value.getHours() < 10 ? '0' : ''}${value.getHours()}`;
      const minutesStr = `${value.getMinutes() < 10 ? '0' : ''}${value.getMinutes()}`;
      const secondsStr = `${value.getSeconds() < 10 ? '0' : ''}${value.getSeconds()}`;
      input.value = `${hoursStr}:${minutesStr}:${secondsStr}.${value.getMilliseconds()}`;
    } else {
      switch (input.type) {
        case 'date':
          input.valueAsDate = value;
          break;
        case 'datetime-local':
          input.valueAsNumber = value.getTime() - (value.getTimezoneOffset() * 60 * 1000);
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
    switch (input.type) {
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
  updateInputEmptyState(input);
  if (input instanceof HTMLTextAreaElement && textfieldElement.hasAttribute('mdw-autosize')) {
    updateTextAreaSize(input);
  }
}
