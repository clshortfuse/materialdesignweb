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
    /** @type {HTMLInputElement} */
    this.input = element.querySelector('input.mdw-textfield__input');
    if (this.input) {
      if (this.input.tagName.toLowerCase() === 'textarea' && this.input.hasAttribute('mdw-multiline')) {
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
    this.select = element.querySelector('select.mdw-textfield__input');
  }
}

export {
  TextField,
};
