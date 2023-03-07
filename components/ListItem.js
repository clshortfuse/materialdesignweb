// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import './CheckboxIcon.js';
import './RadioIcon.js';
import './Container.js';
import './Divider.js';
import './Icon.js';

import '../layout/Block.js';

import CustomElement from '../core/CustomElement.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './ListItem.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .set({
    ariaRole: 'none',
    delegatesFocus: false,
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
    computeAriaSelected({ checkbox, radio, selected }) {
      if (checkbox == null && radio == null) {
        return null;
      }
      return selected ? 'true' : 'false';
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
    <a id=anchor href={href} disabled={disabledState} role=listitem selected={selected} aria-selected={computeAriaSelected} video={video} lines={lines}>
      <mdw-checkbox-icon id=checkbox _if={checkbox} aria-hidden="true" class={checkboxClass} color={selectionColor} disabled={disabledState} icon=check selected={selected}></mdw-checkbox-icon>
      <mdw-radio-icon id=radio _if={radio} aria-hidden=true class={radioClass} disabled={disabledState} ink={selectionColor} selected={selected}></mdw-radio-icon>
      <mdw-container _if={avatar} id=avatar color={avatarColor} type-style=title-medium src={AvatarSrc}
        aria-hidden="true">{avatar}</mdw-container>
      <mdw-icon _if={icon} id=icon ink={iconInk} src={iconSrc} aria-hidden=true>{icon}</mdw-icon>
      <img id=img _if={src} src={src} alt={alt} video={video} />
      <slot name=leading>{leading}</slot>
      <div id=content has-supporting={hasSupporting} lines={lines}>
        <slot id=slot></slot>
        <slot id=supporting name=supporting class=text lines={lines}>{supporting}</slot>
      </div>
      <mdw-icon _if={trailingIcon} id=trailing-icon ink={trailingIconInk} src={trailingIconSrc} aria-hidden=true>{trailingIcon}</mdw-icon>
      <slot id=trailing name=trailing role=note>{trailing}</slot>
    </a>
    <mdw-divider _if={divider} id=divider divder={divider}></mdw-divider>
  `
  .on({
    composed() {
      const { state, rippleContainer } = this.refs;
      state.setAttribute('state-disabled', 'focus hover');
      state.setAttribute('_if', '{isInteractive}');
      rippleContainer.setAttribute('_if', '{isInteractive}');
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
