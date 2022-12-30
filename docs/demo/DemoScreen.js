import Container from '../../components/Container.js';

export default Container
  .extend()
  .css/* css */`
    :host {
      position: relative;
      max-height: 400px;
      overflow-y: auto;
      min-width: 360px;
      width: 90vw;
      display: flex;
      flex-direction: column;
      --mdw-bg: var(--mdw-color__background);
      --mdw-color: var(--mdw-color__on-background);
    }
  `
  .autoRegister('demo-screen');
