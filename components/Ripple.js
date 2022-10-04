import Overlay from './Overlay.js';
import styles from './Ripple.css' assert { type: 'css' };

export default class Ripple extends Overlay {
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
    const { clientWidth, clientHeight } = this.rippleElement;

    if (x == null || y == null) {
      // eslint-disable-next-line no-param-reassign, no-multi-assign
      x = width = clientWidth / 2;
      // eslint-disable-next-line no-param-reassign, no-multi-assign
      y = height = clientHeight / 2;
    } else {
      // Distance from furthest side
      width = (x >= clientWidth / 2) ? x : (clientWidth - x);
      height = (y >= clientHeight / 2) ? y : (clientHeight - y);
    }

    const hypotenuse = Math.sqrt((width * width) + (height * height));
    this.innerElement.style.setProperty('height', `${hypotenuse}px`);
    this.innerElement.style.setProperty('width', `${hypotenuse}px`);
    this.innerElement.style.setProperty('left', `${x - (hypotenuse / 2)}px`);
    this.innerElement.style.setProperty('top', `${y - (hypotenuse / 2)}px`);
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
  static onRippleAnimationEnd({ animationName }) {
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
   * @this {Ripple}
   * @return {void}
   */
  static onRippleMouseDown(event) {
    if (event.button) return;

    const rect = this.rippleElement.getBoundingClientRect();
    const x = event.pageX - rect.left - window.pageXOffset;
    const y = event.pageY - rect.top - window.pageYOffset;
    this.drawRipple('mouse', x, y);
  }

  /**
   * @param {TouchEvent} event
   * @this {Ripple}
   * @return {void}
   */
  static onRippleTouchStart(event) {
    const [touch] = event.changedTouches;
    if (!touch) return;

    const rect = this.rippleElement.getBoundingClientRect();
    const x = touch.pageX - rect.left - window.pageXOffset;
    const y = touch.pageY - rect.top - window.pageYOffset;
    this.drawRipple('touch', x, y);
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @this {Ripple}
   * @return {void}
   */
  static onRippleClick(event) {
    this.drawRipple('click');
    // requestAnimationFrame(() => this.clearRipple());
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLElement}
   * @return {void}
   */
  static onRippleKeyDown(event) {
    if (event.repeat) return;

    requestAnimationFrame(() => {
      if (!this.matches(':active')) return;

      /** @type {{host:Ripple}} */ // @ts-ignore Coerce
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
    this.addEventListener('click', Ripple.onRippleClick, { passive: true });
    this.addEventListener('mousedown', Ripple.onRippleMouseDown, { passive: true });
    this.addEventListener('touchstart', Ripple.onRippleTouchStart, { passive: true });
    this.addEventListener('keydown', Ripple.onRippleKeyDown, { passive: true });
    this.innerElement.addEventListener('animationend', Ripple.onRippleAnimationEnd, { passive: true });
  }

  disconnectedCallback() {
    this.clearRipple();
    super.disconnectedCallback();
  }
}
