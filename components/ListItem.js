// https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

import './Divider.js';
import './Icon.js';
import './Span.js';
import RippleMixin from '../mixins/RippleMixin.js';

import checkboxIconStyles from './CheckboxIcon.css' assert { type: 'css'};
import Container from './Container.js';
import styles from './ListItem.css' assert { type: 'css' };
import radioIconStyles from './RadioIcon.css' assert { type: 'css'};

export default Container
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
  .expressions({
    isInteractive({ href }) {
      return href != null;
    },
    computeAriaSelected({ checkbox, radio, selected }) {
      if (!checkbox && !radio) {
        return null;
      }
      return selected ? 'true' : 'false';
    },
  })
  .css(
    checkboxIconStyles,
    radioIconStyles,
    styles,
  )
  .on('composed', ({ template, $, html }) => {
    const state = $('#state');
    const ripple = $('#ripple');

    state.setAttribute('state-disabled', 'focus hover');
    state.setAttribute('_if', '{isInteractive}');
    ripple.setAttribute('_if', '{isInteractive}');

    template.append(html`
      <a id=anchor href={href} role=listitem aria-selected={computeAriaSelected}>
        <mdw-container _if={checkbox} class="leading checkbox-box" id=checkbox color={selectionColor} aria-hidden="true">
          <mdw-icon id=checkbox-icon class="checkbox-icon" selected={selected} disabled={disabled}>check</mdw-icon>
        </mdw-container>
        <mdw-span _if={radio} id=radio class=radio-icon selected={selected} disabled={disabled} ink={selectionColor}
          aria-hidden="true"></mdw-span>
        <mdw-container _if={avatar} class=leading id=avatar color={avatarColor} type-style=title-medium src={AvatarSrc}
          aria-hidden="true">{avatar}</mdw-container>
        <mdw-icon _if={icon} class="leading" id=icon ink={iconInk} src={iconSrc} aria-hidden=true>{icon}</mdw-icon>
        <img id=img _if={src} class=leading src={src} alt={alt} />
        <slot id=leading-slot name=leading><span _if={leading} id=leading-text class=leading>{leading}</span></slot>
        <div id=content>
          <mdw-span block id=headline type-style=body-large ink=on-surface>
            <slot id=headline-slot name=headline><span id=headline-text class=text>{text}${$('#slot')}</span></slot>
          </mdw-span>
          <mdw-span block id=supporting type-style=body-medium ink=on-surface-variant>
            <slot id=supporting-slot name=supporting><span _if={supporting} id=supporting-text class=text>{supporting}</span>
            </slot>
          </mdw-span>
        </div>
        <mdw-icon _if={trailingIcon} class="trailing" id=trailing-icon ink={trailingIconInk} src={trailingIconSrc}
          aria-hidden=true>{trailingIcon}</mdw-icon>
        <mdw-span block id=trailing type-style=label-small ink=on-surface-variant role=note>
          <slot id=trailing-slot name=trailing><span _if={trailing} id=trailing-text class="trailing text">{trailing}</span>
          </slot>
        </mdw-span>
      </a>
      <mdw-divider _if={divider} id=divider></mdw-divider>
    `);
  })
  .autoRegister('mdw-list-item');
