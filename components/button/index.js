/**
 * @param {HTMLElement} element
 * @param {MouseEvent} event
 * @return {void} Single row height
 */
function updateRipplePosition(element, event) {
  const x = event.detail ? event.offsetX - (element.clientWidth / 2.0) : 0;
  const y = event.detail ? event.offsetY - (element.clientHeight / 2.0) : 0;
  element.style.setProperty('left', `${x}px`);
  element.style.setProperty('top', `${y}px`);
}

export default class Button {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    this.ripple = element.querySelector('.mdw-ripple');
    if (!this.ripple) {
      const ripple = document.createElement('div');
      ripple.classList.add('mdw-ripple');
      this.element.appendChild(ripple);
      this.ripple = ripple;
    }
    this.element.setAttribute('mdw-js-ripple', '');
    this.element.addEventListener('click', (event) => {
      updateRipplePosition(this.ripple, event);
    });
  }
}
