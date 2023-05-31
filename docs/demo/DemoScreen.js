import Box from '../../components/Box.js';

export default Box
  .extend()
  .css`
    :host {
      position: relative;
      max-height: 400px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      --mdw-bg: var(--mdw-color__background);
      --mdw-color: var(--mdw-color__on-background);
    }
  `
  .autoRegister('demo-screen');
