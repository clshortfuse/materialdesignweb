import styles from './RippleMixin.css' assert { type: 'css' };
import StateMixin from './StateMixin.js';

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function RippleMixin(Base) {
  return Base
    .mixin(StateMixin)
    .extend()
    .define({
      _ripple() { return this.refs.ripple; },
      _rippleInner() { return this.refs['ripple-inner']; },
      rippleActiveTarget() { return this; },
      /* Where ripple should originate from */
      rippleOrigin() { return /** @type {'center'|'pointer'} */ 'pointer'; },
    })
    .methods({
      /**
       * @param {number} [x]
       * @param {number} [y]
       * @return {void}
       */
      updateRipplePosition(x, y) {
        let width;
        let height;
        const ripple = this._ripple;
        const rippleInner = this._rippleInner;
        if (!rippleInner || !rippleInner.isConnected) return;
        const { clientWidth, clientHeight } = ripple;

        if (this.rippleOrigin === 'center' || x == null || y == null) {
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

        const expandDuration = Math.min(
          500, // Never longer than long-press duration
          (1000 * Math.sqrt(hypotenuse / 2 / 1024) + 0.5), // From Android
        );
        rippleInner.style.setProperty('--size', `${hypotenuse}px`);
        rippleInner.style.setProperty('--mdw-ripple-expand-duration', `${expandDuration.toFixed(0)}ms`);

        rippleInner.style.setProperty('left', `${x - (hypotenuse / 2)}px`);
        rippleInner.style.setProperty('top', `${y - (hypotenuse / 2)}px`);
      },
      /**
       * @param {'key'|'mouse'|'touch'|'click'} [initiator]
       * @param {number} [x]
       * @param {number} [y]
       * @return {void}
       */
      drawRipple(initiator, x, y) {
        const rippleInner = this._rippleInner;
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
      },

      /** @return {void} */
      clearRipple() {
        const rippleInner = this._rippleInner;
        if (!rippleInner || !rippleInner.isConnected) return;
        if (!rippleInner.hasAttribute('mdw-fade-in')) return;
        if (!rippleInner.hasAttribute('mdw-fade-in-complete')) return;
        rippleInner.removeAttribute('mdw-fade-in');
        rippleInner.removeAttribute('mdw-fade-in-repeat');
        rippleInner.removeAttribute('mdw-fade-in-complete');
        rippleInner.setAttribute('mdw-fade-out', '');
      },
    })
    .css(styles)
    .html/* html */`
      <div id=ripple aria-hidden=true><div id=ripple-inner></div></div>
    `
    .events('#ripple-inner', {
      animationend({ animationName, currentTarget }) {
        switch (animationName) {
          case 'ripple-fade-in':
          case 'ripple-fade-in-repeat':
            currentTarget.setAttribute('mdw-fade-in-complete', '');
            break;
          case 'ripple-fade-out':
            currentTarget.removeAttribute('mdw-fade-in');
            currentTarget.removeAttribute('mdw-fade-in-repeat');
            currentTarget.removeAttribute('mdw-fade-in-complete');
            currentTarget.removeAttribute('mdw-fade-out');
            break;
          default:
        }
      },
    })
    .events({
      '~mousedown'(event) {
        if (event.button) return;

        const { ripple } = this.refs;
        if (!ripple) return;
        const rect = ripple.getBoundingClientRect();
        const x = event.pageX - rect.left - window.pageXOffset;
        const y = event.pageY - rect.top - window.pageYOffset;
        this.drawRipple('mouse', x, y);
      },
      '~touchstart'(event) {
        const [touch] = event.changedTouches;
        if (!touch) return;

        const { ripple } = this.refs;
        if (!ripple) return;
        const rect = ripple.getBoundingClientRect();
        const x = touch.pageX - rect.left - window.pageXOffset;
        const y = touch.pageY - rect.top - window.pageYOffset;
        this.drawRipple('touch', x, y);
      },
      '~click'() {
        this.drawRipple('click');
        // requestAnimationFrame(() => this.clearRipple());
      },
      '~keydown'(event) {
        if (event.repeat) return;

        requestAnimationFrame(() => {
          if (!this.rippleActiveTarget.matches(':active')) return;
          this.drawRipple('key');
        });
      },
    })
    .on({
      connected() {
        const rippleInner = this._rippleInner;
        if (!rippleInner) return;
        rippleInner.removeAttribute('mdw-fade-in');
        rippleInner.removeAttribute('mdw-fade-in-repeat');
        rippleInner.removeAttribute('mdw-fade-in-complete');
        rippleInner.removeAttribute('mdw-fade-out');
      },
      disconnected() {
        this.clearRipple();
      },
    });
}
