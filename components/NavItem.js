import './Icon.js';
import './Ripple.js';
import './Badge.js';

import CustomElement from '../core/CustomElement.js';
import RippleMixin from '../mixins/RippleMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './NavItem.css' assert { type: 'css' };

/** @typedef {'charset'|'coords'|'name'|'shape'} DeprecatedHTMLAnchorElementProperties */

export default class NavItem extends CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(ShapeMixin)
  .extend()
  .set({
    delegatesFocus: true,
    stateLayer: true,
  })
  .observe({
    showLabel: 'string',
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
  .css(styles)
  .html/* html */`
    <mdw-icon id=icon aria-hidden=true src={src} active={active}>{icon}</mdw-icon>
    <a id=anchor
      aria-current=${({ active }) => (active ? 'page' : null)}
      aria-describedby=badge
      aria-label={ariaLabel}
      aria-labelledby=${({ ariaLabel }) => (ariaLabel ? null : 'slot')}
      href=${({ href }) => href ?? '#'}>
    </a>
    <slot id=slot active={active} show-label={showLabel} aria-hidden=true></slot>
    <mdw-badge part=badge id=badge badge={badge} show-label={showLabel} aria-hidden=true>{badge}</mdw-badge>
  `
  .on({
    composed({ html }) {
      const { shape, state, rippleContainer } = this.refs;
      shape.append(html`
        <mdw-ripple id=ripple ripple-origin=center keep-alive hold-ripple ripple-state=${({ active }) => ((active) ? null : 'complete')}></mdw-ripple>
        ${state}
        ${rippleContainer}
      `);
      shape.setAttribute('active', '{active}');
      shape.removeAttribute('color');
    },
  })
  .childEvents({
    anchor: {
      click() {
        /* Prevent Default (false) if no href */
        return this.href != null;
      },
      keydown({ key, repeat }) {
        if (key !== ' ') return true;
        if (!repeat) this.click();
        return false;
      },
    },
  })
  .autoRegister('mdw-nav-item')
  .tsClassFix() {
  addRipple(...args) {
    if (!this.active) return null;
    return super.addRipple(...args);
  }
}
