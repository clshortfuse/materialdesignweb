import styles from './Ripple.css' assert { type: 'css' };
import State from './State.js';

export default class Ripple extends State {
  static { this.autoRegister(); }

  static elementName = 'mdw-ripple';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <div id=ripple aria-hidden=true>
        <div id=ripple-inner></div>
      </div>
    `,
  ];

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

  /**
   * @param {MouseEvent} event
   * @this {Ripple}
   * @return {void}
   */
  static onRippleMouseDown(event) {
    if (event.button) return;

    const { ripple } = this.refs;
    if (!ripple) return;
    const rect = ripple.getBoundingClientRect();
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

    const ripple = this.#ripple;
    if (!ripple) return;
    const rect = ripple.getBoundingClientRect();
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

  get #ripple() { return this.refs.ripple; }

  get #rippleInner() { return this.refs['ripple-inner']; }

  /**
   * @param {number} [x]
   * @param {number} [y]
   * @return {void}
   */
  updateRipplePosition(x, y) {
    let width;
    let height;
    const ripple = this.#ripple;
    const rippleInner = this.#rippleInner;
    if (!rippleInner || !rippleInner.isConnected) return;
    const { clientWidth, clientHeight } = ripple;

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

    rippleInner.style.setProperty('height', `${hypotenuse}px`);
    rippleInner.style.setProperty('width', `${hypotenuse}px`);
    rippleInner.style.setProperty('left', `${x - (hypotenuse / 2)}px`);
    rippleInner.style.setProperty('top', `${y - (hypotenuse / 2)}px`);
  }

  /**
   * @param {'key'|'mouse'|'touch'|'click'} [initiator]
   * @param {number} [x]
   * @param {number} [y]
   * @return {void}
   */
  drawRipple(initiator, x, y) {
    const rippleInner = this.#rippleInner;
    if (!rippleInner || !rippleInner.isConnected) return;
    const currentInitiator = rippleInner.getAttribute('mdw-fade-in');

    // Abort ripple if different initiator
    if (currentInitiator && currentInitiator !== initiator) return;

    this.updateRipplePosition(x, y);
    rippleInner.setAttribute('mdw-fade-in', initiator);

    // Repeat the animation
    if (currentInitiator === initiator) {
      // Remove complete state of fade-in
      rippleInner.removeAttribute('mdw-fade-in-complete');
      // Alternate between normal fade-in to repeat fade-in
      if (rippleInner.hasAttribute('mdw-fade-in-repeat')) {
        rippleInner.removeAttribute('mdw-fade-in-repeat');
      } else {
        rippleInner.setAttribute('mdw-fade-in-repeat', '');
      }
    }
  }

  /** @return {void} */
  clearRipple() {
    const rippleInner = this.#rippleInner;
    if (!rippleInner || !rippleInner.isConnected) return;
    if (!rippleInner.hasAttribute('mdw-fade-in')) return;
    if (!rippleInner.hasAttribute('mdw-fade-in-complete')) return;
    rippleInner.removeAttribute('mdw-fade-in');
    rippleInner.removeAttribute('mdw-fade-in-repeat');
    rippleInner.removeAttribute('mdw-fade-in-complete');
    rippleInner.setAttribute('mdw-fade-out', '');
  }

  connectedCallback() {
    super.connectedCallback();
    const rippleInner = this.#rippleInner;
    if (rippleInner) {
      rippleInner.removeAttribute('mdw-fade-in');
      rippleInner.removeAttribute('mdw-fade-in-repeat');
      rippleInner.removeAttribute('mdw-fade-in-complete');
      rippleInner.removeAttribute('mdw-fade-out');
      rippleInner.addEventListener('animationend', Ripple.onRippleAnimationEnd, { passive: true });
    }
    this.addEventListener('click', Ripple.onRippleClick, { passive: true });
    this.addEventListener('mousedown', Ripple.onRippleMouseDown, { passive: true });
    this.addEventListener('touchstart', Ripple.onRippleTouchStart, { passive: true });
    this.addEventListener('keydown', Ripple.onRippleKeyDown, { passive: true });
  }

  disconnectedCallback() {
    this.clearRipple();
    super.disconnectedCallback();
  }
}
