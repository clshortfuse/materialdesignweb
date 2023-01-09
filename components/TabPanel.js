import Layout from './Layout.js';

export default Layout
  .extend()
  .set({
    ariaRole: 'tabpanel',
  })
  .observe({
    active: {
      type: 'boolean',
      changedCallback(oldValue, newValue) {
        this.setAttribute('aria-expanded', newValue ? 'true' : 'false');
      },
    },
    peeking: 'boolean',
  })
  .css/* css */`
    :host {
      scroll-snap-align: center;
      min-inline-size: 100%;
      max-inline-size: 100%;
      min-block-size: 100%;
      max-block-size: 100%;
      overflow-y: auto;
      will-change: visibility;

      visibility: hidden;
    }
    :host(:is([active],[peeking])) {
      visibility: visible
    }
  `
  .html/* html */`<slot />`
  .autoRegister('mdw-tab-panel');
