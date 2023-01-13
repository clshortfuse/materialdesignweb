// https://w3c.github.io/aria/#status

import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';

import Container from './Container.js';
import styles from './Snackbar.css' assert { type: 'css' };

export default Container
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
  .on('composed', ({ composition, html }) => {
    composition.append(html`
      <mdw-button _if={action} id=action ink={actionInk} type-style={actionTypeStyle}>{action}</mdw-button>
      <mdw-icon-button _if={closeButton} id=close icon={closeIcon} ink={closeInk}>Close</mdw-button>
    `);
  })
  .events('#action', {
    '~click'() {
      if (!this.dispatchEvent(new Event('action', { cancelable: true }))) return;
      this.close();
    },
  })
  .events('#close', {
    '~click'() {
      this.close();
    },
  })
  .css(styles)
  .autoRegister('mdw-snackbar');
