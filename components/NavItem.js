import './Icon.js';

import RippleMixin from '../mixins/RippleMixin.js';

import Container from './Container.js';
import styles from './NavItem.css' assert { type: 'css' };

/** @typedef {'charset'|'coords'|'name'|'shape'} DeprecatedHTMLAnchorElementProperties */

export default Container
  .mixin(RippleMixin)
  .extend()
  .set({
    delegatesFocus: true,
  })
  .define({
    rippleOrigin() { return 'center'; },
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
  .css(styles)
  .on({
    composed({ composition, $, html }) {
      composition.append(
        html`
          <div id=indicator aria-hidden=true>
            ${$('#state')}
            ${$('#ripple')}
          </div>
          <mdw-icon id=icon aria-hidden=true src={src}>{icon}</mdw-icon>
          <a id=anchor
            aria-current=${({ active }) => (active ? 'page' : null)}
            aria-describedby=badge
            aria-label={ariaLabel}
            href=${({ href }) => href ?? '#'}>
            ${$('#slot')}
          </a>
          <mdw-badge id=badge aria-hidden=true>{badge}</mdw-badge>
        `,
      );
    },
  })
  .autoRegister('mdw-nav-item');
