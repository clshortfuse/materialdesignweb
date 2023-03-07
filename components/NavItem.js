import './Icon.js';
import './Ripple.js';
import './Badge.js';

import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import styles from './NavItem.css' assert { type: 'css' };
import Shape from './Shape.js';

/** @typedef {'charset'|'coords'|'name'|'shape'} DeprecatedHTMLAnchorElementProperties */

export default Shape
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .extend()
  .set({
    delegatesFocus: true,
    stateLayer: true,
  })
  .observe({
    active: 'boolean',
    icon: 'string',
    src: 'string',
    href: 'string',
    badge: 'string',
    ariaLabel: 'string', // watch attribute and emit callback
  })
  .methods({
    focus(options) {
      this.refs.anchor.focus(options);
    },
  })
  .overrides({
    addRipple(...args) {
      if (!this.active) return null;
      return this.super.addRipple(...args);
    },
  })
  .css(styles)
  .on({
    composed({ template, html }) {
      const { shape, slot } = this.refs;
      shape.append(html`
        <mdw-ripple id=ripple ripple-origin=center keep-alive hold-ripple ripple-state=${({ active }) => ((active) ? null : 'complete')}></mdw-ripple>
      `);
      slot.removeAttribute('color');
      slot.removeAttribute('ink');
      template.append(html`
        <mdw-icon id=icon aria-hidden=true src={src}>{icon}</mdw-icon>
        <a id=anchor
          aria-current=${({ active }) => (active ? 'page' : null)}
          aria-describedby=badge
          aria-label={ariaLabel}
          href=${({ href }) => href ?? '#'}>
          ${slot}
        </a>
        <mdw-badge _if={badge} id=badge aria-hidden=true>{badge}</mdw-badge>
      `);
    },
  })
  .childEvents({
    anchor: {
      click() {
        /* Prevent Default if no href */
        return this.href != null;
      },
    },
  })
  .autoRegister('mdw-nav-item');
