// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import './Divider.js';
import './Icon.js';
import Inline from '../layout/Inline.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import styles from './ListItem.css' assert { type: 'css' };

export default Inline
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .set({
    ariaRole: 'none',
    delegatesFocus: true,
  })
  .observe({
    leading: 'string',
    avatar: 'string',
    avatarColor: { value: 'primary-container' },
    avatarSrc: 'string',
    src: 'string',
    alt: 'string',
    text: { nullParser: String },
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
  })
  .css(styles)
  .on('composed', ({ template, $, html }) => {
    const state = $('#state');
    const rippleContainer = $('#ripple-container');

    state.setAttribute('state-disabled', 'focus hover');
    state.setAttribute('_if', '{isInteractive}');
    rippleContainer.setAttribute('_if', '{isInteractive}');

    template.append(html`
      <a id=anchor href={href} disabled={disabledState} role=listitem aria-selected={computeAriaSelected}>
        <mdw-checkbox-icon id=checkbox _if={checkbox} aria-hidden="true" class="leading" color={selectionColor} disabled={disabledState} icon=check selected={selected}></mdw-checkbox-icon>
        <mdw-radio-icon id=radio _if={radio}  aria-hidden="true" class="leading" disabled={disabledState} ink={selectionColor} selected={selected}></mdw-radio-icon>
        <mdw-container _if={avatar} class=leading id=avatar color={avatarColor} type-style=title-medium src={AvatarSrc}
          aria-hidden="true">{avatar}</mdw-container>
        <mdw-icon _if={icon} class="leading" id=icon ink={iconInk} src={iconSrc} aria-hidden=true>{icon}</mdw-icon>
        <img id=img _if={src} class=leading src={src} alt={alt} />
        <slot id=leading-slot name=leading><span _if={leading} id=leading-text class=leading>{leading}</span></slot>
        <div id=content>
          <mdw-block id=headline type-style=body-large ink=on-surface>
            <slot id=headline-slot name=headline><span id=headline-text class=text>{text}${$('#slot')}</span></slot>
          </mdw-block>
          <mdw-block id=supporting type-style=body-medium ink=on-surface-variant>
            <slot id=supporting-slot name=supporting><span _if={supporting} id=supporting-text class=text>{supporting}</span>
            </slot>
          </mdw-block>
        </div>
        <mdw-icon _if={trailingIcon} class="trailing" id=trailing-icon ink={trailingIconInk} src={trailingIconSrc}
          aria-hidden=true>{trailingIcon}</mdw-icon>
        <mdw-block id=trailing type-style=label-small ink=on-surface-variant role=note>
          <slot id=trailing-slot name=trailing><span _if={trailing} id=trailing-text class="trailing text">{trailing}</span>
          </slot>
        </mdw-block>
      </a>
      <mdw-divider _if={divider} id=divider></mdw-divider>
    `);
  })
  .autoRegister('mdw-list-item');
