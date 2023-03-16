import './Icon.js';
import './Shape.js';
import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './SwitchIcon.css' assert {type: 'css'};
import animations from './SwitchIconAnimations.css' assert {type:'css'};

export default CustomElement
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
      if (!selected) return 'surface-variant';
      if (disabled) return 'on-surface';
      return `on-${color}-container`;
    },
  })
  .expressions({
    hasIcon({ icon, src, unselectedIcon, unselectedSrc }) {
      return Boolean(icon || src || unselectedIcon || unselectedSrc);
    },
  })
  .css(styles, animations)
  .html/* html */`
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
      outline.removeAttribute('_if');
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
  .extend()
  .autoRegister('mdw-switch-icon');
