// https://w3c.github.io/aria/#status

import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DensityMixin from '../mixins/DensityMixin.js';
import ElevationMixin from '../mixins/ElevationMixin.js';

import './Button.js';
import './IconButton.js';

import Surface from './Surface.js';

export default Surface
  .extend()
  .mixin(DensityMixin)
  .mixin(AriaReflectorMixin)
  .mixin(ElevationMixin)
  .set({
    _ariaRole: 'status',
    elevated: true,
  })
  .observe({
    open: 'boolean',
    persistent: 'boolean',
    action: 'string',
    actionInk: { empty: 'inverse-primary' },
    actionTypeStyle: { empty: 'label-large' },
    closeButton: 'boolean',
    closeIcon: { empty: 'close' },
    closeInk: { empty: 'inherit' },
    elevation: { empty: 3 },
    onaction: EVENT_HANDLER_TYPE,
  })
  .methods({
    async close() {
      if (!this.dispatchEvent(new Event('close', { cancelable: true }))) return;
      if (!this.open) return;
      this.open = false;
      if (window.getComputedStyle(this).transitionDuration === '0s') return;
      await new Promise((resolve) => {
        this.addEventListener('transitionend', resolve, { once: true });
      });
    },
    show() {
      this.open = true;
    },
    /** @param {string} text */
    update(text) {
      this.textContent = text;
    },
  })
  .html`
    <div id=content></div>
    <mdw-button mdw-if={action} id=action class=button ink={actionInk} type-style={actionTypeStyle}>{action}</mdw-button>
    <mdw-icon-button mdw-if={closeButton} id=close class=button icon={closeIcon} ink={closeInk}>Close</mdw-button>
  `
  .recompose(({ refs: { content, slot } }) => {
    content.append(slot);
  })
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
  .css`
    /* https://m3.material.io/components/snackbar/specs */

    :host {
      --mdw-shape__size: var(--mdw-shape__small);
      --mdw-bg: var(--mdw-color__inverse-surface);
      --mdw-ink: var(--mdw-color__inverse-on-surface);

      --mdw-type__line-height: var(--mdw-typescale__body-medium__line-height);
      display: flex;
      align-items: center;

      padding-inline: 16px;

      opacity: 0;
      transform: translateY(25%) scaleY(0.25);
      transform-origin: bottom center;
      visibility: hidden; /* Remove from tab order */
      z-index: 22;

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
      visibility: visible;
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
