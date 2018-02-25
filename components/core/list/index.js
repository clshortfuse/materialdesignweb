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

class List {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
  }

  detach() {
    this.element = null;
  }

  /**
   * Clear and detach all children
   * @param {WeakMap} elementMap
   * @return {void}
   */
  clear(elementMap) {
    const el = this.element;
    if (!el) {
      return;
    }
    while (el.firstChild) {
      if (elementMap.has(el.firstChild)) {
        elementMap.get(el.firstChild).detach();
        elementMap.delete(el.firstChild);
      }
      el.removeChild(el.firstChild);
    }
  }
}

class ListRow {
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

  /**
   * Destroys all HTML Element references for garbage collection
   * @return {void}
   */
  detach() {
    this.ripple = null;
    this.element = null;
  }
}

export {
  List,
  ListRow,
};
