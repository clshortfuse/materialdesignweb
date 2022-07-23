import MDWOverlay from '../overlay/MDWOverlay.js';

export default class MDWRipple extends MDWOverlay {
  constructor() {
    super();
    this.stylesElement.append(MDWRipple.getStylesFragment().cloneNode(true));
    this.shadowRoot.prepend(MDWRipple.getContentFragment().cloneNode(true));
    /** @type {HTMLElement} */
    this.containerElement = this.shadowRoot.querySelector('.mdw-ripple__container');
    /** @type {HTMLElement} */
    this.innerElement = this.shadowRoot.querySelector('.mdw-ripple__inner');
  }

  /**
   * @param {Element} element
   * @return {boolean}
   */
  static isActive(element) {
    return element.matches(':active');
  }

  /**
   * @param {number} [x]
   * @param {number} [y]
   * @return {void}
   */
  updateRipplePosition(x, y) {
    let width;
    let height;
    let xPos = x;
    let yPos = y;
    const {
      clientWidth: parentWidth,
      clientHeight: parentHeight,
    } = (this.containerElement);

    if (x == null) {
      xPos = parentWidth / 2;
      width = xPos;
    } else if (x >= parentWidth / 2) {
      width = x;
    // furthest horizontal side is left
    } else {
      width = parentWidth - x;
    // furthest horizontal side is right
    }
    if (y == null) {
      yPos = parentHeight / 2;
      height = yPos;
    } else if (y >= parentHeight / 2) {
      height = y;
    // furthest vertical side is bottom
    } else {
      height = parentHeight - y;
    // furthest vertical side is top
    }
    const hypotenuse = Math.sqrt((width * width) + (height * height));
    this.innerElement.style.setProperty('height', `${hypotenuse}px`);
    this.innerElement.style.setProperty('width', `${hypotenuse}px`);
    this.innerElement.style.setProperty('left', `${xPos - (hypotenuse / 2)}px`);
    this.innerElement.style.setProperty('top', `${yPos - (hypotenuse / 2)}px`);
  }

  /**
   * @param {string} initiator
   * @return {void}
   */
  drawRipple(initiator) {
    const currentInitiator = this.innerElement.getAttribute('mdw-fade-in');
    if (currentInitiator && currentInitiator !== initiator) {
    // Only allow repeat interactions from same initiator
      return;
    }
    this.innerElement.setAttribute('mdw-fade-in', initiator);
    if (currentInitiator === initiator) {
    // Repeat the animation
      if (this.innerElement.hasAttribute('mdw-fade-in-repeat')) {
        this.innerElement.removeAttribute('mdw-fade-in-repeat');
      } else {
        this.innerElement.setAttribute('mdw-fade-in-repeat', '');
      }
    }
  }

  /**
   * @param {AnimationEvent} event
   * @return {void}
   */
  static onAnimationEnd(event) {
    const rippleInner = /** @type {HTMLElement} */ (event.currentTarget);
    if (event.animationName === 'ripple-fade-in' || event.animationName === 'ripple-fade-in-repeat') {
      rippleInner.setAttribute('mdw-fade-in-complete', '');
      return;
    }
    if (event.animationName === 'ripple-fade-out') {
      rippleInner.removeAttribute('mdw-fade-in');
      rippleInner.removeAttribute('mdw-fade-in-repeat');
      rippleInner.removeAttribute('mdw-fade-in-complete');
      rippleInner.removeAttribute('mdw-fade-out');
    }
  }

  /** @return {void} */
  clearRipple() {
    if (!this.innerElement.hasAttribute('mdw-fade-in')) {
      return;
    }
    if (this.innerElement.hasAttribute('mdw-keydown') && !this.innerElement.hasAttribute('mdw-keyup')) {
      return;
    }
    if (!this.innerElement.hasAttribute('mdw-fade-in-complete')) {
      return;
    }
    this.innerElement.removeAttribute('mdw-fade-in');
    this.innerElement.removeAttribute('mdw-fade-in-repeat');
    this.innerElement.removeAttribute('mdw-fade-in-complete');
    this.innerElement.setAttribute('mdw-fade-out', '');
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWRipple.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWRipple.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link').href = new URL('MDWRipple.css', import.meta.url).toString();
      MDWRipple.#styles = template;
    }
    return MDWRipple.#styles.content;
  }

  /** @type {HTMLTemplateElement} */
  static #content = null;

  /** @return {DocumentFragment} */
  static getContentFragment() {
    if (!MDWRipple.#content) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <div class="mdw-ripple__container" part="rippleContainer" aria-hidden="true">
            <div class="mdw-ripple__inner" part="rippleInner"></div>
          </div>
        `,
      );
      template.content.appendChild(fragment);
      MDWRipple.#content = template;
    }
    return MDWRipple.#content.content;
  }


  static register(tagname = 'mdw-ripple') {
    customElements.define(tagname, MDWRipple);
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @return {void}
   */
  static onMouseDown(event) {
    const element = /** @type {MDWRipple} */ (event.currentTarget);
    // @ts-ignore: Optimization
    if (!event.pointerType && !event.detail) {
      return;
    }
    const rect = element.containerElement.getBoundingClientRect();
    const x = event.pageX - rect.left - window.pageXOffset;
    const y = event.pageY - rect.top - window.pageYOffset;
    element.updateRipplePosition(x, y);
    element.drawRipple('mouse');
  }

  /**
   * @param {TouchEvent} event
   * @return {void}
   */
  static onTouchStart(event) {
    const element = /** @type {MDWRipple} */ (event.currentTarget);
    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }
    const rect = element.containerElement.getBoundingClientRect();
    const x = touch.pageX - rect.left - window.pageXOffset;
    const y = touch.pageY - rect.top - window.pageYOffset;
    element.updateRipplePosition(x, y);
    element.drawRipple('touch');
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @return {void}
   */
  static onClick(event) {
    const element = /** @type {MDWRipple} */ (event.currentTarget);
    // @ts-ignore: Optimization
    if (event.pointerType || event.detail) {
      return;
    }
    if (element.innerElement.getAttribute('mdw-fade-in') === 'key') {
    // Already handled by keydown
      return;
    }
    element.updateRipplePosition();
    element.drawRipple('key');
    requestAnimationFrame(() => {
      element.clearRipple();
    });
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  static onKeyDown(event) {
    const element = /** @type {MDWRipple} */ (event.currentTarget);

    requestAnimationFrame(() => {
      if (!element.matches(':active')) return;

      if (element.innerElement.getAttribute('mdw-fade-in') === 'key') {
        return;
      }
      element.updateRipplePosition();
      element.drawRipple('key');
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.innerElement.removeAttribute('mdw-fade-in');
    this.innerElement.removeAttribute('mdw-fade-in-repeat');
    this.innerElement.removeAttribute('mdw-fade-in-complete');
    this.innerElement.removeAttribute('mdw-fade-out');
    this.addEventListener('click', MDWRipple.onClick, { passive: true });
    this.addEventListener('mousedown', MDWRipple.onMouseDown, { passive: true });
    this.addEventListener('touchstart', MDWRipple.onTouchStart, { passive: true });
    this.addEventListener('keydown', MDWRipple.onKeyDown, { passive: true });
    this.innerElement.addEventListener('animationend', MDWRipple.onAnimationEnd, { passive: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', MDWRipple.onClick);
    this.removeEventListener('mousedown', MDWRipple.onMouseDown);
    this.removeEventListener('touchstart', MDWRipple.onTouchStart);
    this.removeEventListener('keydown', MDWRipple.onKeyDown);
  }
}
