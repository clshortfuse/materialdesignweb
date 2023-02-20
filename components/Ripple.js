import CustomElement from '../core/CustomElement.js';

import styles from './Ripple.css' assert { type: 'css' };

export default CustomElement
  .extend()
  .css(styles)
  .set({
    hadRippleHeld: false,
    hadRippleReleased: false,
    rippleStarted: false,
  })
  .observe({
    rippleState: 'string',
    keepAlive: 'boolean',
    holdRipple: {
      type: 'boolean',
      changedCallback(oldValue, newValue) {
        if (newValue) {
          this.hadRippleHeld = true;
        } else {
          this.hadRippleReleased = true;
        }
      },
    },
  })
  .methods({
    /**
     * @param {number} [x] offsetX
     * @param {number} [y] offsetY
     * @param {number} [size]
     * @return {void}
     */
    updatePosition(x, y, size) {
      // Element is already centered.
      // Use offset to calculate parent size;

      let hypotenuse = size;
      const { clientWidth: parentWidth, clientHeight: parentHeight } = this.offsetParent;

      x ??= parentWidth / 2;
      y ??= parentHeight / 2;
      if (!hypotenuse) {
        const width = (x >= parentWidth / 2) ? x : (parentWidth - x);
        const height = (y >= parentHeight / 2) ? y : (parentHeight - y);
        hypotenuse = 2 * Math.sqrt((width * width) + (height * height));
      }

      // const expandDuration = Math.min(
      //   500, // Never longer than long-press duration
      //   (1000 * Math.sqrt(size / 2 / 1024) + 0.5), // From Android
      // );

      // this.style.minBlockSize = `${hypotenuse}px`;
      // this.style.minInlineSize = `${hypotenuse}px`;
      // this.style.boxShadow = `0 0 calc(0.10 * ${0}px) calc(0.10 * ${0}px) currentColor`;
      // this.style.marginLeft = `${x - (parentWidth / 2)}px`;
      // this.style.marginTop = `${y - (parentHeight / 2)}px`;

      this.animate({
        minBlockSize: `${hypotenuse}px`,
        minInlineSize: `${hypotenuse}px`,
        boxShadow: `0 0 calc(0.10 * ${hypotenuse}px) calc(0.10 * ${hypotenuse}px) currentColor`,
        marginLeft: `${x - (parentWidth / 2)}px`,
        marginTop: `${y - (parentHeight / 2)}px`,
      }, {
        duration: 0,
        fill: 'forwards',
      });
    },
    handleRippleComplete() {
      if (this.keepAlive) {
        this.setAttribute('ripple-state', 'complete');
      } else {
        this.remove();
      }
    },
  })
  .events({
    animationstart({ animationName }) {
      if (animationName !== 'ripple-fade-in') return;
      if (this.rippleStarted) {
        // Animation restarted. Likely from visibility change
        this.handleRippleComplete();
        return;
      }
      this.rippleStarted = true;
    },
    animationend({ animationName }) {
      switch (animationName) {
        case 'ripple-fade-in':
          this.setAttribute('ripple-state', 'filled');
          break;
        case 'ripple-fade-out':
          this.handleRippleComplete();
          break;
        default:
      }
    },
  })
  .autoRegister('mdw-ripple');
