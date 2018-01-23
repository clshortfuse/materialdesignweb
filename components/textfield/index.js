/**
 * @param {Element} element
 * @param {number=} heightHint precalculated single row height
 * @return {void}
 */
function updateTextAreaSize(element, heightHint) {
  let heightPx = heightHint;
  if (!heightPx) {
    element.setAttribute('rows', '1');
    const { height } = window.getComputedStyle(element);
    heightPx = parseInt(height.replace('px', ''), 10);
  }
  element.setAttribute('rows', Math.floor(element.scrollHeight / heightPx).toString());
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
  }
}
