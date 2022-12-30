import Container from './Container.js';

export default Container
  .extend()
  .css/* css */`
    :host {
      position: relative;
      pointer-events: var(--mdw-card-action-area__pointer-events, auto);
      z-index: 2;
    }
  `
  .autoRegister('mdw-card-action-area');
