import Box from '../../components/Box.js';

export default Box
  .extend()
  .css`
    :host {
      --mdw-bg: var(--mdw-color__background);
      --mdw-color: var(--mdw-color__on-background);
      position: relative;

      display: flex;
      align-items: normal;
      flex-direction: column;
      justify-content: normal;
      overflow-y: auto;

      max-block-size: 400px;
    }
  `
  .autoRegister('demo-screen');
