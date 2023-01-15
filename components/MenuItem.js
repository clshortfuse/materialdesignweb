// https://www.w3.org/TR/wai-aria-practices/#menu

import './Icon.js';
import InputMixin from '../mixins/InputMixin.js';

import Container from './Container.js';
import styles from './MenuItem.css' assert { type: 'css' };

export default Container
  .mixin(InputMixin)
  .extend()
  .observe({
    type: { empty: 'button' },
    icon: 'string',
    src: 'string',
    trailing: 'string',
    trailingIcon: 'string',
    trailingSrc: 'string',
    submenuId: 'string',
  })
  .css(styles)
  .events({
    '~mousemove'() {
      if (!this) return;
      const previousFocus = document.activeElement;
      // Already focused
      if (previousFocus === this) return;

      if (this.getAttribute('aria-disabled') === 'true') return;
      this.focus();
      if (document.activeElement !== this
        && document.activeElement !== previousFocus
        && previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    },
    focus(event) {
      if (!this.submenuId) return;
      const submenuElement = document.getElementById(this.submenuId);
      submenuElement.cascade(this);
    },
    blur(event) {
      if (!this.submenuId) return;
      if (!event.relatedTarget) return;
      const submenuElement = document.getElementById(this.submenuId);
      if (submenuElement.contains(event.relatedTarget)) return;
      submenuElement.close(false);
    },
  })
  .on({
    composed({ $, html, inline }) {
      $('#label').append(html`
        <mdw-icon _if={icon} id=icon aria-hidden="true" src={src}>{icon}</mdw-icon>
        <span id=trailing>
          <slot id=trailing-slot name=trailing role=note>{trailing}</slot>
          <mdw-icon _if=${({ trailingIcon, trailingSrc }) => trailingIcon || trailingSrc}
          id=trailing-icon aria-hidden="true" src={trailingSrc}>{trailingIcon}</mdw-icon>
        </span>
      `);

      const control = $('#control');
      control.setAttribute('type', 'button');
      control.setAttribute('role', inline(({ type }) => {
        switch (type) {
          case 'checkbox':
            return 'menuitemcheckbox';
          case 'radio':
            return 'menuitemradio';
          default:
          case 'button':
            return 'menuitem';
        }
      }));
    },
    attrs: {
      disabled(oldValue, newValue) {
        this.refs.control.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
      },
    },
  })
  .autoRegister('mdw-menu-item');
