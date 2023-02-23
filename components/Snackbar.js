// https://w3c.github.io/aria/#status

import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';

import './Button.js';
import './IconButton.js';

import styles from './Snackbar.css' assert { type: 'css' };
import Surface from './Surface.js';

export default Surface
  .extend()
  .set({
    ariaRole: 'status',
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
  .html/* html */`
    <mdw-button _if={action} id=action ink={actionInk} type-style={actionTypeStyle}>{action}</mdw-button>
    <mdw-icon-button _if={closeButton} id=close shape-style=none icon={closeIcon} ink={closeInk}>Close</mdw-button>
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
  .css(styles)
  .autoRegister('mdw-snackbar');
