/**
 * @param {HTMLElement} element
 * @param {MouseEvent|PointerEvent} event
 * @return {void}
 */
function updateRipplePosition(element, event) {
  if (!event.pointerType && !event.detail) {
    // Ripple from center
    element.style.setProperty('left', '0');
    element.style.setProperty('top', '0');
    return;
  }
  const x = event.offsetX - (element.clientWidth / 2.0);
  const y = event.offsetY - (element.clientHeight / 2.0);
  element.style.setProperty('left', `${x}px`);
  element.style.setProperty('top', `${y}px`);
}

class Button {
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
      console.log(event);
      updateRipplePosition(this.ripple, event);
    });
  }
}

export {
  Button,
};
