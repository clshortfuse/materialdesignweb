import './SwitchIcon.js';
import CustomElement from '../core/CustomElement.js';
import InputMixin from '../mixins/InputMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';
import TouchTargetMixin from '../mixins/TouchTargetMixin.js';

import styles from './Switch.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(InputMixin) // Label as root
  .mixin(StateMixin)
  .mixin(TouchTargetMixin)
  // Switches have their own pressed animation (No ripple)
  .extend()
  .set({
    type: 'checkbox',
    stateLayer: true,
  })
  .observe({
    icon: 'string',
    selectedIcon: 'string',
    unselectedIcon: 'string',
    src: 'string',
    selectedSrc: 'string',
    unselectedSrc: 'string',
  })
  .css(styles)

  .on({
    composed({ html }) {
      const { state, label, control, touchTarget } = this.refs;
      label.append(html`
        ${touchTarget}
        <mdw-switch-icon id=switch
          color={color} ink={ink} selected={checked} hovered={hoveredState} focused={focusedState} pressed={pressedState} disabled={disabledState}
          icon={icon}
          selected-icon={selectedIcon}
          unselected-icon={unselectedIcon}
          src={src}
          selected-src={selectedSrc}
          unselected-src={unselectedSrc}
          >
          ${state}
          ${control}
        </mdw-switch-icon>
        <slot id=slot></slot>
      `);
      control.setAttribute('type', 'checkbox');
      control.setAttribute('role', 'switch');
    },
  })
  .methods({
    /**
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

      let currentValue = this.refs.switch.dragValue;
      if (currentValue == null) {
        currentValue = this.checked ? 1 : 0;
      }
      const pixels = offsetX - (clientWidth / 2);
      const currentPixels = this.refs.switch.clientWidth - (this.refs.switch.clientHeight);
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
  .autoRegister('mdw-switch');
