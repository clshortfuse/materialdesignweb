import Ripple from '../components/Ripple.js';

/** @typedef {import('../components/Ripple.js').default} Ripple */

/**
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function RippleMixin(Base) {
  return Base
    .set({
      /** @type {WeakRef<InstanceType<Ripple>>} */
      _lastRippleWeakRef: null,
      /** Flag set if ripple was added this event loop. */
      _rippleAdded: false,
    })
    .define({
      _lastRipple: {
        get() {
          const element = this._lastRippleWeakRef?.deref();
          if (element?.isConnected) return element;
          return null;
        },
        set(ripple) {
          this._lastRippleWeakRef = ripple ? new WeakRef(ripple) : null;
        },
      },
    })
    .methods({
      /**
       * @param {number} [x]
       * @param {number} [y]
       * @param {boolean} [hold]
       * @return {InstanceType<Ripple>}
       */
      addRipple(x, y, hold) {
        const { rippleContainer } = this.refs;
        if (!rippleContainer.isConnected) return null; // Detached?
        const ripple = new Ripple();
        this._rippleAdded = true;
        queueMicrotask(() => {
          // Reset before next event loop;
          this._rippleAdded = false;
        });
        rippleContainer.append(ripple);
        if (hold) {
          ripple.holdRipple = true;
        }
        ripple.updatePosition(x, y);
        this._lastRipple = ripple;
        return ripple;
      },
    })
    .html`
      <div id=ripple-container mdw-if={!disabledState} aria-hidden=true></div>
    `
    .events({
      '~pointerdown'(event) {
        if (event.button) return;
        if (this.disabledState) return;

        const { rippleContainer } = this.refs;
        if (!rippleContainer.isConnected) return; // Detached?
        const rect = rippleContainer.getBoundingClientRect();
        const x = event.pageX - rect.left - window.pageXOffset;
        const y = event.pageY - rect.top - window.pageYOffset;
        const lastRipple = this._lastRipple;
        if (lastRipple) {
          lastRipple.holdRipple = false;
        }
        console.debug('ripple from pointerdown');
        this.addRipple(x, y);
      },
      '~click'(e) {
        if (this._rippleAdded) {
          // Avoid double event
          return;
        }
        if (e.pointerType || e.detail) return;
        if (this.disabledState) return;
        if (this._pressed) return;
        const lastRipple = this._lastRipple;
        if (lastRipple) {
          lastRipple.holdRipple = false;
        }
        console.debug('ripple from programmatic click');
        this.addRipple();
      },
    })
    .on({
      _pressedChanged(oldValue, pressed) {
        const ripple = this._lastRipple;
        if (!pressed) {
          if (ripple) {
            ripple.holdRipple = false;
          }
          return;
        }
        if (!ripple || ripple.hadRippleReleased) {
          if (this._lastInteraction !== 'key') {
            // Sometimes pointer events may be out of order
            return;
          }
          console.debug('ripple from press state');
          this.addRipple(null, null, true);
          return;
        }
        if (ripple.hadRippleHeld) return;
        ripple.holdRipple = true;
      },
    })
    .css`
      :host {
        --mdw-state__pressed-opacity: 0;
      }
      
      #ripple-container {
        position: absolute;
        inset: 0;
      
        overflow: hidden;
      
        pointer-events: none;
      }
    `;
}
