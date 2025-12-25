import './SwitchIcon.js';
import CustomElement from '../core/CustomElement.js';
import InputMixin from '../mixins/InputMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';
import TouchTargetMixin from '../mixins/TouchTargetMixin.js';

/**
 * Switch is a binary control that toggles between on and off states.
 * @see https://m3.material.io/components/switch/specs
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(InputMixin) // Label as root
  .mixin(StateMixin)
  .mixin(TouchTargetMixin)
  // Switches have their own pressed animation (No ripple)
  .set({
    /** The control `type` used for the underlying input element (always 'checkbox'). */
    type: 'checkbox',
    /** Enables the state-layer visual treatment for pressed/hover states. */
    stateLayer: true,
  })
  .observe({
    /** The icon name to show inside the thumb when provided. */
    icon: 'string',
    /** The icon name to show when the switch is selected/on. */
    selectedIcon: 'string',
    /** The icon name to show when the switch is unselected/off. */
    unselectedIcon: 'string',
    /** The image `src` to show inside the thumb when provided. */
    src: 'string',
    /** The image `src` to show when the switch is selected/on. */
    selectedSrc: 'string',
    /** The image `src` to show when the switch is unselected/off. */
    unselectedSrc: 'string',
  })
  .html`
    <mdw-switch-icon id=switch
      color={color} ink={ink} selected={checked} hovered={hoveredState}
      focused={focusedState} pressed={pressedState} disabled={disabledState}
      icon={icon}
      selected-icon={selectedIcon}
      unselected-icon={unselectedIcon}
      src={src}
      selected-src={selectedSrc}
      unselected-src={unselectedSrc}
      >
    </mdw-switch-icon>
    <slot id=slot></slot>
  `
  .recompose(({ refs: { switch: switchEl, state, control } }) => {
    switchEl.append(state, control);
    control.setAttribute('role', 'switch');
  })
  .methods({
    /**
     * Handle pointer/touch input on the native control to compute dragging
     * position and update the thumb drag state.
     * @param {(MouseEvent|TouchEvent) & {currentTarget:HTMLInputElement}} event
     * @return {void}
     */
    onControlMouseOrTouch(event) {
      const input = event.currentTarget;
      if (input.disabled) return;

      if (this.disabledState) return;

      if (event.type === 'touchend') {
        // this._isHoveringThumb = false;
        return;
      }

      let offsetX;
      let clientX;
      let pageX;
      let isActive;

      const isTouch = 'touches' in event;
      if (isTouch) {
        if (event.touches.length) {
          const [touch] = event.touches;
          isActive = true;
          // @ts-ignore Might exist
          ({ offsetX, clientX, pageX } = touch);
        }
      } else {
        // Ignore mouse drag-over
        // Firefox doesn't report `:active`
        // eslint-disable-next-line no-bitwise
        isActive = (event.buttons & 1) === 1
       && (event.type === 'mousedown' || input.matches(':active'));
        ({ offsetX, clientX, pageX } = event);
      }

      if (!isActive) return;

      if (offsetX == null) {
        clientX ??= pageX - window.scrollX; // Safari
        offsetX = clientX - input.getBoundingClientRect().left;
      }

      const { clientWidth } = input;
      let position = (offsetX / clientWidth);
      if (position > 1) {
        position = 1;
      } else if (position < 0) {
        position = 0;
      }

      // this._isHoveringThumb = true;

      const switchIcon = /** @type {InstanceType<import('./SwitchIcon.js').default>} */ (this.refs.switch);

      let currentValue = switchIcon.dragValue;
      if (currentValue == null) {
        currentValue = this.checked ? 1 : 0;
      }
      const pixels = offsetX - (clientWidth / 2);
      const currentPixels = switchIcon.clientWidth - (switchIcon.clientHeight);
      // console.log(pixels, currentPixels, currentPixels * currentValue, pixels / currentPixels);
      const newRatio = pixels / currentPixels;
      const newValue = Math.max(Math.min(currentValue + newRatio, 1), 0);
      // this.refs.switch.dragValue = newValue;
      // event.preventDefault();
    },
  })
  .childEvents({
    control: {
      '~pointermove': 'onControlMouseOrTouch',
    },
  })
  .css`
    /* https://m3.material.io/components/switch/specs */

    :host {
      --mdw-ink: var(--mdw-color__on-primary);
      --mdw-bg: var(--mdw-color__primary);
      position: relative;

      display: inline-flex;
      align-items: center;

      gap: 12px;
      vertical-align: middle;

      cursor: pointer;
    }

    #control {
      cursor: inherit;
    }

    #touch-target {
      z-index: 0;
    }

    #label {
      display: contents;

      cursor: pointer;

      /* border-radius: 50%; */
    }

    /** Switch **/

    #switch {
      --mdw-bg: inherit;
      --mdw-ink: inherit;
      flex:1;

      pointer-events: none;
    }

    /** State **/

    #state {
      position: absolute;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      top: 50%;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      left: 50%;

      block-size: 100%;
      min-block-size: 40px;
      inline-size: 100%;
      min-inline-size: 40px;

      pointer-events: none;

      transform: translateX(-50%) translateY(-50%);

      border-radius: 50%;
    }

    #state[touched] {
      /* Pressed state already has an animation */
      /* stylelint-disable-next-line rule-selector-property-disallowed-list */
      --mdw-state__pressed-opacity: 0;
    }

    /** Disabled **/

    :host(:disabled) {
      --mdw-ink: var(--mdw-color__on-surface); /* selected icon */
      --mdw-bg: var(--mdw-color__surface);
      cursor: not-allowed;

      opacity: 0.38;
    }

    :host([internals-disabled]) {
      --mdw-ink: var(--mdw-color__on-surface); /* selected icon */
      --mdw-bg: var(--mdw-color__surface);
      cursor: not-allowed;

      opacity: 0.38;
    }

    #switch[disabled] {
      opacity: 1;
    }
  `
  .autoRegister('mdw-switch');
