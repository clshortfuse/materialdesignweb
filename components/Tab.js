// https://w3c.github.io/aria/#tab

import './Icon.js';

import CustomElement from '../core/CustomElement.js';
import { CHROME_VERSION } from '../core/dom.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import HyperlinkMixin from '../mixins/HyperlinkMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';

/**
 * Tabs organize content into separate views where only one view is visible
 * at a time; tabs provide navigation between those views.
 * @see https://m3.material.io/components/tabs/specs
 */
export default CustomElement
  .extend()
  .mixin(ShapeMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(ScrollListenerMixin)
  .mixin(HyperlinkMixin)
  .mixin(DelegatesFocusMixin)
  .define({
    stateTargetElement() { return this.refs.anchor; },
  })
  .set({
    /** Enable state-layer visual treatment for pressed/hover states. */
    stateLayer: true,
  })
  .observe({
    /** Whether this tab is currently active/selected. */
    active: 'boolean',
    /** Named icon to display above the label. */
    icon: 'string',
    /** Image `src` for the icon when used instead of a named icon. */
    src: 'string',
    /** Optional aria-label for the tab's anchor element. */
    ariaLabel: 'string',
  })
  .methods({
    /** Move focus to the tab's anchor. */
    /** @type {HTMLElement['focus']} */
    focus(options) {
      this.refs.anchor.focus(options);
    },
    /**
     * Compute the label metrics used for indicator alignment.
     * Returns an object with `width` and `left` in pixels.
     */
    computeLabelMetrics() {
      const { slot, icon } = this.refs;
      const target = slot.clientWidth ? slot : icon;
      return {
        width: target.clientWidth,
        left: target.offsetLeft,
      };
    },
  })
  .expressions({
    /** Derive the `aria-controls` value from `href` if it references an id. */
    anchorAriaControls({ href }) {
      return href?.startsWith('#') ? href.slice(1) : null;
    },
    /** Stringified `aria-selected` for the anchor. */
    anchorAriaSelected({ active }) {
      return `${active}`;
    },
    /** Stringified `aria-disabled` for the anchor. */
    anchorAriaDisabled({ disabledState }) {
      return `${disabledState}`;
    },
    /** Ensure anchor `href` defaults to `#` when unset. */
    anchorHref({ href }) {
      return href ?? '#';
    },
    /** True when an icon or src is provided and should render. */
    iconIf({ icon, src }) {
      return icon || src;
    },
    /** Icon variation to use when active. */
    iconVariation({ active }) {
      return active ? 'filled' : null;
    },
  })
  .html`
    <mdw-icon mdw-if={iconIf} id=icon aria-hidden=true src={src} active={active} icon={icon} variation={iconVariation}></mdw-icon>
    <slot id=slot></slot>
  `
  .recompose(({ refs: { anchor, icon, slot, state } }) => {
    anchor.setAttribute('role', 'tab');
    anchor.setAttribute('aria-label', '{ariaLabel}');
    anchor.setAttribute('aria-controls', '{anchorAriaControls}');
    anchor.setAttribute('aria-selected', '{anchorAriaSelected}');
    anchor.setAttribute('aria-disabled', '{anchorAriaDisabled}');
    anchor.setAttribute('disabled', '{disabledState}');
    anchor.append(icon, slot);
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
      flex: none;

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
