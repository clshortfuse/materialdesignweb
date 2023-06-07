import './Icon.js';
import './Shape.js';
import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .observe({
    selected: 'boolean',
    icon: 'string',
    errored: 'boolean',
    disabled: 'boolean',
    selectedIcon: 'string',
    unselectedIcon: 'string',
    src: 'string',
    selectedSrc: 'string',
    unselectedSrc: 'string',
    hovered: 'boolean',
    pressed: 'boolean',
    focused: 'boolean',
    dragValue: 'float',
    color: { empty: 'primary' },
  })
  .observe({
    /** Alias for Selected (QoL) */
    checked: {
      type: 'boolean',
      get({ selected }) { return selected; },
      /** @param {boolean} value */
      set(value) { this.selected = value; },
    },
    _active({ disabled, pressed, focused, hovered }) {
      return !disabled && (pressed || focused || hovered);
    },
  })
  .observe({
    _thumbColor({ color, _active }) {
      return _active ? `${color}-container` : '';
    },
    _iconInk({ disabled, selected, color }) {
      if (!selected) return 'surface-container-highest';
      if (disabled) return 'on-surface';
      return `on-${color}-container`;
    },
  })
  .expressions({
    hasIcon({ icon, src, unselectedIcon, unselectedSrc }) {
      return Boolean(icon || src || unselectedIcon || unselectedSrc);
    },
  })
  .html`
    <div id=thumb selected={checked} pressed={pressed} disabled={disabled}>
      <mdw-shape id=thumb-shape shape-style=full selected={checked} pressed={pressed} hovered={hovered} focused={focused} icon={hasIcon}
       color={_thumbColor} active={_active} ink={_thumbInk} disabled={disabled}></mdw-shape>
      <mdw-icon ink={_iconInk} class=icon id=icon src={src} selected={checked}>{icon}</mdw-icon>
      <mdw-icon ink={_iconInk} class=icon id=selected-icon src={selectedIconSrc} selected={checked}>{selectedIcon}</mdw-icon>
      <mdw-icon ink={_iconInk} class=icon id=unselected-icon src={unselectedIconSrc} selected={checked}>{unselectedIcon}</mdw-icon>
      <slot id=slot selected={checked}></slot>
    </div>
  `
  .on({
    composed() {
      const { outline, shape: track } = this.refs;
      track.id = 'track';
      track.setAttribute('selected', '{checked}');
      track.setAttribute('disabled', '{disabled}');
      outline.removeAttribute('mdw-if');
      outline.setAttribute('selected', '{checked}');
      outline.setAttribute('errored', '{errored}');
      outline.setAttribute('disabled', '{disabled}');
    },
    dragValueChanged(oldValue, newValue) {
      if (newValue == null) {
        this.refs.thumb.style.removeProperty('--mdw-switch__value');
        this.refs.thumb.style.removeProperty('transition-duration');
      } else {
        this.refs.thumb.style.setProperty('--mdw-switch__value', `${newValue}`);
        this.refs.thumb.style.setProperty('transition-duration', '0s');
      }
    },
  })
  .css`
    /* https://m3.material.io/components/switch/specs */

    :host {
      --mdw-ink: var(--mdw-color__on-primary);
      --mdw-bg: var(--mdw-color__primary);
      --mdw-shape__size: var(--mdw-shape__full);
      --mdw-switch__value: 0;

      position: relative;

      display: inline-block;
      vertical-align: middle;

      box-sizing: border-box;
      block-size: 32px;
      inline-size: 52px;
      container-type: inline-size;
      container-name: switch-icon;
    }

    :host([selected]) {
      --mdw-switch__value: 1;
    }

    :host([disabled]) {
      opacity: 0.38;
    }

    #track{
      position: absolute;
      inset: 0;

      background-color: rgb(var(--mdw-color__surface-container-highest));
    }

    #track[selected] {
      background-color: rgb(var(--mdw-bg));
    }

    #track[disabled] {
      opacity: calc(0.12/0.38);
    }

    #track[disabled][selected] {
      background-color: rgb(var(--mdw-color__on-surface));
    }

    #outline {
      filter:
        drop-shadow(1px 0px 0px currentColor)
        drop-shadow(0px 1px 0px currentColor)
        drop-shadow(-1px 0px 0px currentColor)
        drop-shadow(0px -1px 0px currentColor);

      color: rgb(var(--mdw-color__outline));
    }

    #outline:is([pressed],[focused]) {
      color: rgb(var(--mdw-color__outline));
    }

    #outline[disabled] {
      color: rgb(var(--mdw-color__on-surface));
    }

    #outline[selected] {
      color: transparent;
    }

    /** Thumb (state) **/

    #thumb {
      --thumb-color: var(--mdw-ink);
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      transform: translateX(calc(var(--mdw-dir, 1) * var(--mdw-switch__value) * (52px - 100%)));

      aspect-ratio: 1/1;
    }

    :dir(rtl) #thumb {
      --mdw-dir: -1;
    }

    @supports(width: 1cqw) {
      #thumb {
        transform: translateX(calc(var(--mdw-dir, 1) * var(--mdw-switch__value) * (100cqw - 100%)));
      }
    }

    #slot {
      color: rgb(var(--mdw-color__on-surface));
    }

    #slot[selected] {
      color: rgb(var(--mdw-bg));
    }

    /** Thumb Shape **/

    #thumb-shape {
      --mdw-shape__size: inherit;

      position: absolute;

      inset: 2px;

      transform: scale(calc(16/28));
      z-index: 0;
    }

    #thumb-shape[icon] {
      transform: scale(calc(24/28));
    }

    #thumb-shape:not([selected]) {
      --mdw-bg: var(--mdw-color__outline);
      --mdw-ink: var(--mdw-color__surface-container-highest);
    }

    #thumb-shape[selected] {
      transform: scale(calc(24/28));
    }

    #thumb-shape[selected]:not([active]) {
      --mdw-bg: var(--thumb-color);
    }

    #thumb-shape[pressed]:not([disabled]) {
      transform: scale(1);
    }

    /** Thumb Icons **/

    .icon {
      position: absolute;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      top: 50%;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      left: 50%;

      opacity: 0;
      transform: translateX(-50%) translateY(-50%);

      font-size: 16px;

      /* border-radius: 50%; */
    }

    .icon:not([src]):empty {
      display: none;
    }

    #icon, #unselected-icon {
      opacity: 1;

      font-variation-settings: 'FILL' 0;
    }

    #unselected-icon[selected] {
      opacity: 0;
    }

    #selected-icon[selected] {
      opacity: 1;
    }

    #icon[selected] {
      font-variation-settings: 'FILL' 1;
    }

    #thumb[disabled] {
      color: rgb(var(--mdw-color__on-surface));
    }
  `
  .css`
    /* https://m3.material.io/components/switch/specs */

    :host {
      /*FastOutLinearInInterpolator*/
      --mdw-switch__transition-timing__collapse: cubic-bezier(0.4, 0.0, 1, 1);
      --mdw-switch__transition-duration__collapse: 375ms;
      /*LinearOutSlowInInterpolator*/
      --mdw-switch__transition-timing__expand: cubic-bezier(0.0, 0.0, 0.2, 1);
      --mdw-switch__transition-duration__expand: 500ms;
      --scale-delay: var(--mdw-switch__transition-duration);

      --mdw-switch__transition-duration: var(--mdw-switch__transition-duration__collapse);
      --mdw-switch__transition-timing: var(--mdw-switch__transition-timing__collapse);
      --mdw-switch__transition-delay__color: calc(var(--mdw-switch__transition-duration) / 2);
      --mdw-switch__transition-delay__translate: calc(var(--mdw-switch__transition-duration) / 2);
      --mdw-switch__transition-delay__scale: calc(var(--mdw-switch__transition-duration) / 2);

      transition-delay: var(--mdw-switch__transition-delay__color);
      transition-duration: calc(var(--mdw-switch__transition-duration) / 2);
      /* 2 legged animation */
      transition-timing-function: var(--mdw-switch__transition-timing);
    }

    #track {
      transition-delay: var(--mdw-switch__transition-delay__color);
      transition-duration: inherit;
      transition-property: background-color;
      transition-timing-function: inherit;
    }

    #outline {
      transition-delay: var(--mdw-switch__transition-delay__color);
      transition-duration: inherit;
      transition-property: background-color, color;
      transition-timing-function: inherit;
    }

    #thumb {
      transition-delay: var(--mdw-switch__transition-delay__translate);
      transition-duration: inherit;
      transition-property: transform;
      transition-timing-function: inherit;
    }

    #thumb-shape, .icon {
      /* (selected => unselected): stall color+scale */
      transition-delay: var(--mdw-switch__transition-delay__scale), var(--mdw-switch__transition-delay__color), var(--mdw-switch__transition-delay__color);
      transition-duration: inherit;
      transition-property: transform, background-color, color;
      transition-timing-function: inherit;
    }

    :host([icon]) {
      --mdw-switch__transition-delay__translate: 0s;
    }

    .icon {
      transition-property: transform, opacity, color;
    }

    /* unselected => selected  */
    :host([selected]) {
      --mdw-switch__transition-delay__color: 0s;
      --mdw-switch__transition-delay__scale: 0s;
      /* --mdw-switch__transition-delay__translate: 0s; */
      --mdw-switch__transition-duration: var(--mdw-switch__transition-duration__expand);
      --mdw-switch__transition-timing: var(--mdw-switch__transition-timing__expand);
    }

    /* active => selected */
    :host([selected][pressed]) {
      /* --mdw-switch__transition-delay__color: 0s; */
      /* --mdw-switch__transition-delay__scale: 0s; */
      --mdw-switch__transition-delay__translate: 0s;
    }

    /* selected => unselected */
    :host(:not([selected])) {
      /* --mdw-switch__transition-delay__color: 0s; */
      /* --mdw-switch__transition-delay__scale: 0s; */
      --mdw-switch__transition-delay__translate: 0s;
    }

    /* unselected => active */
    :host([pressed]:not([selected])) {
      /* --mdw-switch__transition-delay__color: 0s; */
      --mdw-switch__transition-delay__scale: 0s;
      /* --mdw-switch__transition-delay__translate: 0s; */
    }
  `
  .autoRegister('mdw-switch-icon');
