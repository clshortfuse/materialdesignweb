import CustomElement from '../core/CustomElement.js';
import { ELEMENT_ANIMATION_TYPE } from '../core/customTypes.js';

export default CustomElement
  .extend()
  .set({
    hadRippleHeld: false,
    hadRippleReleased: false,
    rippleStarted: false,
  })
  .observe({
    rippleState: 'string',
    keepAlive: 'boolean',
    _positionX: 'float',
    _positionY: 'float',
    _radius: 'float',
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
  .observe({
    _positionStyle: {
      ...ELEMENT_ANIMATION_TYPE,
      get({ _positionX, _positionY, _radius }) {
        // Skip if not measured
        if (_radius == null) return null;
        return {
          styles: {
            minHeight: `${_radius}px`,
            minWidth: `${_radius}px`,
            boxShadow: `0 0 calc(0.10 * ${_radius}px) calc(0.10 * ${_radius}px) currentColor`,
            top: `calc(50% + ${_positionY}px)`,
            left: `calc(50% + ${_positionX}px)`,
          },
        };
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
      const { offsetParent } = this;
      if (!offsetParent) return;
      const { clientWidth: parentWidth, clientHeight: parentHeight } = offsetParent;

      x ??= parentWidth / 2;
      y ??= parentHeight / 2;
      if (!hypotenuse) {
        const width = (x >= parentWidth / 2) ? x : (parentWidth - x);
        const height = (y >= parentHeight / 2) ? y : (parentHeight - y);
        hypotenuse = 2 * Math.hypot(width, height);
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

      this._positionX = x - (parentWidth / 2);
      this._positionY = y - (parentHeight / 2);
      this._radius = hypotenuse;
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
      if (this.rippleStarted && !this.keepAlive) {
        // Animation restarted. Likely from visibility change
        this.remove();
        return;
      }
      this.rippleStarted = true;
    },
    animationend({ animationName }) {
      switch (animationName) {
        case 'ripple-fade-in':
          this.rippleState = 'filled';
          break;
        case 'ripple-fade-out':
          this.handleRippleComplete();
          break;
        default:
      }
    },
  })
  .css`
    /* stylelint-disable liberty/use-logical-spec */
    :host {
      --enter-delay: 80ms;
      --touch-down-acceleration: 1024;
      --touch-up-acceleration: 3400;
      --mdw-ripple-expand-duration: 300ms;
      --mdw-ripple-simple-duration: 200ms;
      --mdw-ripple-fade-out-duration: 333ms;
      --mdw-ripple-standard-easing: var(--mdw-motion-standard-easing, cubic-bezier(0.4, 0.0, 0.2, 1));
      --mdw-ripple-deceleration-easing: var(--mdw-motion-deceleration-easing, cubic-bezier(0.0, 0.0, 0.2, 1));
    
      --size: 0;
      position: absolute;
      top: 50%;
      left: 50%;
    
      display: block;
    
      min-block-size: 141.42%; /* √2 * 100% */
      min-inline-size: 141.42%;
    
      pointer-events: none;
    
      -webkit-tap-highlight-color: transparent;
    
      opacity: 0.12;
      transform: translateX(-50%) translateY(-50%) scale(1);
    
      background-color: currentColor;
      border-radius: 50%;
    
      /* Adds feathered appearance to ripple */
      box-shadow: 0 0 calc(0.10 * var(--size)) calc(0.10 * var(--size)) currentColor;
    
      transition-delay: 0s;
      transition-duration: var(--mdw-ripple-simple-duration);
      transition-property: background-color, color;
      transition-timing-function: var(--mdw-ripple-standard-easing);
    
      animation-name: ripple-fade-in, none;
      animation-duration: var(--mdw-ripple-expand-duration), var(--mdw-ripple-fade-out-duration);
      animation-timing-function: linear, var(--mdw-ripple-deceleration-easing);
      animation-direction: normal;
      animation-fill-mode: forwards;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      will-change: transform, opacity, top, left, box-shadow;
    
      aspect-ratio: 1/1;
    }
    
    :host([ripple-state="filled"]) {
      animation-name: none, ripple-fade-out;
    }
    
    :host([ripple-state="filled"][hold-ripple]) {
      animation-name: ripple-fade-in, none;
    }
    
    :host([ripple-state="complete"]) {
      animation-name: none, ripple-fade-out;
      animation-duration: 0s;
    }
    
    @keyframes ripple-fade-in {
      from {
        transform: translateX(-50%) translateY(-50%) scale(0);
      }
    }
    
    @keyframes ripple-fade-out {
    
      to { opacity: 0; }
    }
  `
  .autoRegister('mdw-ripple');
