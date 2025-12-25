// https://w3c.github.io/aria/#status

import CustomElement from '../core/CustomElement.js';
import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DensityMixin from '../mixins/DensityMixin.js';
import ElevationMixin from '../mixins/ElevationMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import './Button.js';
import './IconButton.js';

/**
 * Snackbars provide brief messages about app processes and optional actions.
 * @see https://m3.material.io/components/snackbar/specs
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .mixin(DensityMixin)
  .mixin(AriaReflectorMixin)
  .mixin(ElevationMixin)
  .set({
    _ariaRole: 'status',
    elevated: true,
  })
  .observe({
    /** Whether the snackbar is visible. */
    open: 'boolean',
    /** When true the snackbar does not auto-dismiss. */
    persistent: 'boolean',
    /** Optional action label to display as a button. */
    action: 'string',
    /** Ink token used for the action button (defaults to inverse-primary). */
    actionInk: { empty: 'inverse-primary' },
    /** Typographic style used for the action (e.g. 'label-large'). */
    actionTypeStyle: { empty: 'label-large' },
    /** Render a close icon button when true. */
    closeButton: 'boolean',
    /** Icon name used for the close button. */
    closeIcon: { empty: 'close' },
    /** Ink token used for the close icon. */
    closeInk: { empty: 'inherit' },
    /** Event handler invoked when the action is triggered. */
    onaction: EVENT_HANDLER_TYPE,
    /** Event handler invoked when the snackbar toggles open/closed. */
    ontoggle: EVENT_HANDLER_TYPE,
  })
  .methods({
    /**
     * Close the snackbar. Dispatches a cancelable `close` event; if not
     * prevented the snackbar will hide and await the closing transition.
     */
    async close() {
      if (!this.dispatchEvent(new Event('close', { cancelable: true }))) return;
      if (!this.open) return;
      this.open = false;
      if (window.getComputedStyle(this).transitionDuration === '0s') return;
      await new Promise((resolve) => {
        this.addEventListener('transitionend', resolve, { once: true });
      });
    },
    /** Show the snackbar (set `open` true). */
    show() {
      this.open = true;
    },
    /**
     * Update the snackbar text content.
     * @param {string} text
     */
    update(text) {
      this.textContent = text;
    },
  })
  .html`
    <div id=content><slot id=slot></div>
    <mdw-button mdw-if={action} id=action class=button ink={actionInk} type-style={actionTypeStyle}>{action}</mdw-button>
    <mdw-icon-button mdw-if={closeButton} id=close class=button icon={closeIcon} ink={closeInk}>Close</mdw-icon-button>
  `
  .childEvents({
    action: {
      '~click'() {
        if (!this.dispatchEvent(new Event('action', { cancelable: true }))) return;
        this.close();
      },
    },
    close: {
      '~click'() {
        this.close();
      },
    },
  })
  .on({
    openChanged() {
      this.dispatchEvent(new Event('toggle'));
    },
  })
  .css`
    :host {
      --mdw-shape__size: var(--mdw-shape__small);
      --mdw-bg: var(--mdw-color__inverse-surface);
      --mdw-ink: var(--mdw-color__inverse-on-surface);
      --mdw-type__line-height: var(--mdw-typescale__body-medium__line-height);

      display: flex;
      align-items: center;

      grid-area: snackbar;

      padding-inline: 16px; 

      pointer-events: auto;

      filter: var(--mdw-elevation__drop-shadow__3);
      opacity: 0;
      transform: translateY(25%) scaleY(0.25);
      transform-origin: bottom center;
      visibility: hidden; /* Remove from tab order */
      z-index: 22;

      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));

      font: var(--mdw-typescale__body-medium__font);
      letter-spacing: var(--mdw-typescale__body-medium__letter-spacing);

      transition: transform 200ms, opacity 200ms, visibility 200ms;
    }

    :host([action]) {
      gap: 8px;

      padding-inline-end: 8px;
    }

    :host([close-button]) {
      gap: 4px;

      padding-inline-end: 4px;
    }

    :host([open]) {
      opacity: 1;
      transform: scale(1);
      visibility: inherit;
    }

    #content {
      display: flex;
      align-items: center;

      flex: 1;
      padding-block: max(2px, calc(14px + (var(--mdw-density) * 2px)));
    }

    #slot {
      display: block;
      overflow-x: hidden;
      overflow-y: hidden;

      max-block-size: calc(var(--mdw-type__line-height) * 2);

      text-align: start;
      text-overflow: ellipsis;
      text-transform: none;
      white-space: normal;
      word-break: break-word;
    }

    @supports(width: 1lh) {
      #slot {
        max-block-size: 2lh;
      }
    }

    @supports(-webkit-line-clamp:1) {
      #slot {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  `
  .autoRegister('mdw-snackbar');
