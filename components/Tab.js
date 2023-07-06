// https://w3c.github.io/aria/#tab

import './Icon.js';

import CustomElement from '../core/CustomElement.js';
import { CHROME_VERSION, isRtl } from '../core/dom.js';
import RippleMixin from '../mixins/RippleMixin.js';
import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';

export default CustomElement
  .extend()
  .mixin(ShapeMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(ScrollListenerMixin)
  .define({
    stateTargetElement() { return this.refs.anchor; },
    /**
     * Used to compute primary indicator size.
     * Default to 24.
     */
    labelMetrics() {
      const { slot, icon } = this.refs;
      const target = slot.clientWidth ? slot : icon;
      return {
        width: target.clientWidth,
        left: target.offsetLeft,
      };
    },
  })
  .set({
    delegatesFocus: true,
    stateLayer: true,
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
  .html`
    <a id=anchor role=tab
      aria-label={ariaLabel}
      aria-controls=${({ href }) => (href?.startsWith('#') ? href.slice(1) : null)}
      aria-selected=${({ active }) => (active ? 'true' : 'false')}
      aria-disabled=${({ disabledState }) => `${disabledState}`}
      disabled={disabledState}
      href=${({ href }) => href ?? '#'}>
      <mdw-icon mdw-if=${(data) => data.icon || data.src} id=icon aria-hidden=true src={src} active={active} icon={icon}></mdw-icon>
      <slot id=slot></slot>
    </a>
  `
  .recompose(({ refs: { shape, rippleContainer, state } }) => {
    shape.append(state, rippleContainer);
    state.setAttribute('state-disabled', 'focus');
  })
  .events({
    keydown(event) {
      if (event.key === ' ') {
        event.preventDefault(); // Avoid vertical scroll
        this.refs.anchor.click();
      }
    },
  })
  .childEvents({
    anchor: {
      click(event) {
        if (this.disabledState) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        const { href } = this;
        if (!href) {
          event.preventDefault();
          return;
        }
        if (href.startsWith('#')) {
          const root = /** @type {HTMLElement} */ (this.getRootNode());
          /** @type {HTMLElement} */
          const el = root.querySelector(href);
          if (!el) {
            console.warn('Unknown element', href);
            return;
          }
          event.preventDefault();
          // Chrome does not support scrolling two elements at the same time
          // https://bugs.chromium.org/p/chromium/issues/detail?id=1430426
          const behavior = CHROME_VERSION ? 'instant' : 'smooth';

          el.scrollTo({ top: 0, behavior });
          el.offsetParent.scrollTo({
            // Scroll-snap will adjust with subpixel precision
            left: el.offsetLeft,
            behavior: 'smooth',
          });
        }
      },
    },
  })
  .css`
    /* https://m3.material.io/components/tabs/specs */

    :host {
      display: inline-flex;

      min-inline-size: 64px;

      cursor: pointer;
    }

    #anchor {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      box-sizing: border-box;
      block-size: 100%;
      inline-size: 100%;
      flex: 1;

      padding-block: 6px;
      padding-inline: 12px;

      cursor: pointer;
      outline: none;

      color: inherit;

      text-decoration: inherit;
    }

    #icon {
      padding-block: 4px;

      font-size: 24px;
      font-variation-settings: 'FILL' 0;

    }

    #shape[disabled],
    #anchor[disabled] {
      cursor: not-allowed;

      background-color: rgba(var(--mdw-color__on-surface), 0.12);
      color: rgba(var(--mdw-color__on-surface), 0.38);
    }

    :host([active]) {
      color: rgb(var(--mdw-ink));
    }

    #icon[active] {
      font-variation-settings: 'FILL' 1;
    }

    #slot {
      display: block;
      overflow-x: hidden;
      overflow-y: hidden;

      max-block-size: var(--mdw-typescale__title-small__line-height);

      max-inline-size: 100%;

      cursor: inherit;
      outline: none;

      opacity: var(--mdw-nav-item__anchor__opacity, 1);
      transform: translateY(var(--mdw-nav-item__offset-y, 0));

      color: inherit;

      font: var(--mdw-typescale__title-small__font);
      letter-spacing: var(--mdw-typescale__title-small__letter-spacing);
      text-align: center;
      text-decoration: inherit;
      text-overflow: ellipsis;
      text-transform: none;
      white-space: nowrap;
      word-break: break-word;

      transition: opacity, color, transform 200ms;
      will-change: opacity, transform;
    }
  `
  .autoRegister('mdw-tab');
