// https://w3c.github.io/aria/#tab

import RippleMixin from '../mixins/RippleMixin.js';
import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';

import Container from './Container.js';
import styles from './Tab.css' assert { type: 'css' };

export default Container
  .mixin(RippleMixin)
  .mixin(ScrollListenerMixin)
  .extend()
  .define({
    rippleActiveTarget() { return this.refs.anchor; },
    /**
     * Used to compute primary indicator size.
     * Default to 24.
     */
    labelMetrics() {
      const slot = this.refs.slot;
      let target = this.refs.slot;
      if (!slot.clientWidth) target = this.refs.icon;
      return {
        width: target.clientWidth,
        left: target.offsetLeft,
      };
    },
  })
  .set({
    delegatesFocus: true,
  })
  .observe({
    active: 'boolean',
    icon: 'string',
    src: 'string',
    href: 'string',
    ariaLabel: 'string',
  })
  .methods({
    /** @type {HTMLElement['focus']} */
    focus(options) {
      this.refs.anchor.focus(options);
    },
  })
  .css(styles)
  .on({
    composed({ composition, $, html }) {
      composition.append(
        html`
          <a id=anchor role="tab"
            aria-label={ariaLabel}
            aria-controls=${({ href }) => (href?.startsWith('#') ? href.slice(1) : null)}
            aria-selected=${({ active }) => (active ? 'true' : 'false')}
            href=${({ href }) => href ?? '#'}>
            <mdw-icon _if=${(data) => data.icon || data.src} id=icon aria-hidden=true src={src}>{icon}</mdw-icon>
            ${$('#slot')}
          </a>
        `,
      );
    },
  })
  .events({
    keydown(event) {
      if (event.key === ' ') {
        event.preventDefault(); // Avoid vertical scroll
        this.refs.anchor.click();
      }
    },
  })
  .events('#anchor', {
    click(event) {
      const { href } = this;
      if (!href) {
        event.preventDefault();
        return;
      }
      if (href.startsWith('#')) {
        /** @type {HTMLElement} */
        const el = document.querySelector(href);
        if (!el) { console.warn('Unknown element', href); }
        event.preventDefault();
        el.scrollIntoView({ block: 'nearest', inline: 'start' });
      }
    },
  })
  .autoRegister('mdw-tab');
