import MDWOverlay from '../overlay/MDWOverlay.js';

import styles from './MDWRipple.css' assert { type: 'css' };

export default class MDWRipple extends MDWOverlay {
  constructor() {
    super();
    /** @type {HTMLElement} */
    this.rippleElement = this.shadowRoot.getElementById('ripple');
    /** @type {HTMLElement} */
    this.innerElement = this.shadowRoot.getElementById('ripple-inner');
  }

  static elementName = 'mdw-ripple';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <div id="ripple" aria-hidden="true">
        <div id="ripple-inner"></div>
      </div>
    `,
  ];

  /**
   * @param {number} [x]
   * @param {number} [y]
   * @return {void}
   */
  updateRipplePosition(x, y) {
    let width;
    let height;
    let xPos;
    let yPos;
    const { clientWidth, clientHeight } = this.rippleElement;

    if (x == null || y == null) {
      width = clientWidth / 2;
      height = clientHeight / 2;
      xPos = `${width}px`;
      yPos = `${height}px`;
    } else {
      // Distance from furthest side
      width = (x >= clientWidth / 2) ? x : clientWidth - x;
      height = (y >= clientHeight / 2) ? y : clientHeight - y;
      xPos = `${x}px`;
      yPos = `${y}px`;
    }

    const hypotenuse = Math.sqrt((width * width) + (height * height));
    this.innerElement.style.setProperty('--mdw-ripple-radius', `${hypotenuse}`);
    this.innerElement.style.setProperty('--mdw-ripple-x', xPos);
    this.innerElement.style.setProperty('--mdw-ripple-y', yPos);
  }

  /**
   * @param {'key'|'mouse'|'touch'|'click'} [initiator]
   * @param {number} [x]
   * @param {number} [y]
   * @return {void}
   */
  drawRipple(initiator, x, y) {
    const currentInitiator = this.innerElement.getAttribute('mdw-fade-in');

    // Abort ripple if different initiator
    if (currentInitiator && currentInitiator !== initiator) return;

    this.updateRipplePosition(x, y);
    this.innerElement.setAttribute('mdw-fade-in', initiator);

    // Repeat the animation
    if (currentInitiator === initiator) {
      // Remove complete state of fade-in
      this.innerElement.removeAttribute('mdw-fade-in-complete');
      // Alternate between normal fade-in to repeat fade-in
      if (this.innerElement.hasAttribute('mdw-fade-in-repeat')) {
        this.innerElement.removeAttribute('mdw-fade-in-repeat');
      } else {
        this.innerElement.setAttribute('mdw-fade-in-repeat', '');
      }
    }
  }

  /**
   * @param {AnimationEvent} event
   * @this {HTMLElement}
   * @return {void}
   */
  static onAnimationEnd({ animationName }) {
    switch (animationName) {
      case 'ripple-fade-in':
      case 'ripple-fade-in-repeat':
        this.setAttribute('mdw-fade-in-complete', '');
        break;
      case 'ripple-fade-out':
        this.removeAttribute('mdw-fade-in');
        this.removeAttribute('mdw-fade-in-repeat');
        this.removeAttribute('mdw-fade-in-complete');
        this.removeAttribute('mdw-fade-out');
        break;
      default:
    }
  }

  /** @return {void} */
  clearRipple() {
    if (!this.innerElement.hasAttribute('mdw-fade-in')) return;
    if (!this.innerElement.hasAttribute('mdw-fade-in-complete')) return;
    this.innerElement.removeAttribute('mdw-fade-in');
    this.innerElement.removeAttribute('mdw-fade-in-repeat');
    this.innerElement.removeAttribute('mdw-fade-in-complete');
    this.innerElement.setAttribute('mdw-fade-out', '');
  }

  /**
   * @param {MouseEvent} event
   * @this {MDWRipple}
   * @return {void}
   */
  static onMouseDown(event) {
    if (event.button) return;

    const rect = this.rippleElement.getBoundingClientRect();
    const x = event.pageX - rect.left - window.pageXOffset;
    const y = event.pageY - rect.top - window.pageYOffset;
    this.drawRipple('mouse', x, y);
  }

  /**
   * @param {TouchEvent} event
   * @this {MDWRipple}
   * @return {void}
   */
  static onTouchStart(event) {
    const [touch] = event.changedTouches;
    if (!touch) return;

    const rect = this.rippleElement.getBoundingClientRect();
    const x = touch.pageX - rect.left - window.pageXOffset;
    const y = touch.pageY - rect.top - window.pageYOffset;
    this.drawRipple('touch', x, y);
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @this {MDWRipple}
   * @return {void}
   */
  static onClick(event) {
    this.drawRipple('click');
    // requestAnimationFrame(() => this.clearRipple());
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLElement}
   * @return {void}
   */
  static onKeyDown(event) {
    if (event.repeat) return;

    requestAnimationFrame(() => {
      if (!this.matches(':active')) return;

      /** @type {{host:MDWRipple}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      host.drawRipple('key');
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
