/**
 * @param {Element} element
 * @param {number=} heightHint Precalculated single row height
 * @return {number} Single row height
 */
function updateTextAreaSize(element, heightHint) {
  let heightPx = heightHint;
  if (!heightPx) {
    element.setAttribute('rows', '1');
    const { height } = window.getComputedStyle(element);
    heightPx = parseInt(height.replace('px', ''), 10);
  }
  element.setAttribute('rows', Math.floor(element.scrollHeight / heightPx).toString());
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

export default class TextField {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    this.input = element.querySelector('.mdw-text-field__input');
    if (this.input.tagName === 'TEXTAREA' && this.input.hasAttribute('mdw-multiline')) {
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
}
