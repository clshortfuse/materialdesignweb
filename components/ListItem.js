// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import './CheckboxIcon.js';
import './RadioIcon.js';
import './Divider.js';
import './Icon.js';

import CustomElement from '../core/CustomElement.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './ListItem.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(AriaReflectorMixin)
  .extend()
  .set({
    _ariaRole: 'listitem',
    delegatesFocus: false,
    stateLayer: true,
  })
  .observe({
    leading: 'string',
    avatar: 'string',
    avatarColor: { value: 'primary-container' },
    avatarSrc: 'string',
    src: 'string',
    alt: 'string',
    icon: 'string',
    href: 'string',
    iconInk: 'string',
    iconSrc: 'string',
    checkbox: 'string',
    radio: 'string',
    selectionColor: { value: 'primary' },
    selected: 'boolean',
    supporting: 'string',
    trailing: 'string',
    trailingIcon: 'string',
    trailingIconInk: 'string',
    trailingIconSrc: 'string',
    divider: 'boolean',
    video: 'boolean',
    lines: 'integer',
    _supportingSlotted: 'boolean',
  })
  .observe({
    // Alias since not form-associated
    disabledState({ disabled }) {
      return disabled;
    },

  })
  .expressions({
    isInteractive({ href }) {
      return href != null;
    },
    hasSupporting() {
      return this.supporting || this._supportingSlotted;
    },
    checkboxClass() {
      return this.checkbox || 'leading';
    },
    radioClass() {
      return this.radio || 'leading';
    },
  })
  .css(styles)
  .html/* html */`
    <a id=anchor _if={href} href={href} disabled={disabledState} aria-labelledby=content></a>
    <mdw-checkbox-icon id=checkbox _if={checkbox} aria-hidden=true class={checkboxClass} color={selectionColor} disabled={disabledState} icon=check selected={selected}></mdw-checkbox-icon>
    <mdw-radio-icon id=radio _if={radio} aria-hidden=true class={radioClass} disabled={disabledState} ink={selectionColor} selected={selected}></mdw-radio-icon>
    <mdw-box _if={avatar} id=avatar color={avatarColor} type-style=title-medium src={AvatarSrc}
      aria-hidden=true>{avatar}</mdw-box>
    <mdw-icon _if={icon} id=icon ink={iconInk} src={iconSrc} aria-hidden=true>{icon}</mdw-icon>
    <img id=img _if={src} src={src} alt={alt} video={video} />
    <slot name=leading>{leading}</slot>
    <div id=content has-supporting={hasSupporting} lines={lines}>
      <slot id=slot></slot>
      <slot id=supporting name=supporting class=text lines={lines}>{supporting}</slot>
    </div>
    <mdw-icon _if={trailingIcon} id=trailing-icon ink={trailingIconInk} src={trailingIconSrc} aria-hidden=true>{trailingIcon}</mdw-icon>
    <slot id=trailing name=trailing role=note>{trailing}</slot>
    <mdw-divider _if={divider} id=divider divder={divider}></mdw-divider>
  `
  .on({
    composed() {
      const { state, rippleContainer, anchor } = this.refs;
      anchor.append(
        state,
        rippleContainer,
      );
      state.setAttribute('state-disabled', 'focus hover');
    },
    disabledStateChanged(oldValue, newValue) {
      this.updateAriaProperty('ariaDisabled', newValue ? 'true' : 'false');
    },
  })
  .childEvents({
    supporting: {
      /** @param {Event & {currentTarget: HTMLSlotElement}} event */
      slotchange({ currentTarget }) {
        this._supportingSlotted = currentTarget.assignedNodes().length !== 0;
      },
    },
  })
  .autoRegister('mdw-list-item');
