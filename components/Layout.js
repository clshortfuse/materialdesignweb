import Container from './Container.js';
import styles from './Layout.css' assert { type: 'css' };

export default Container
  .extend()
  .observe({
    x: 'string',
    y: 'string',
    column: 'boolean',
    wrap: {
      /** @type {null|'wrap'|'reverse'} */
      value: null,
    },
    gap: {
      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      changedCallback(oldValue, newValue) {
        if (newValue) {
          this.style.setProperty('--mdw-layout__gap', newValue);
        } else {
          this.style.removeProperty('--mdw-layout__gap');
        }
      },
    },
  })
  .css(styles)
  .autoRegister('mdw-layout');
