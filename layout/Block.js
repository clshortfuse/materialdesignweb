import Inline from './Inline.js';

export default Inline
  .extend()
  .css/* css */`
    :host { display: block; }
  `
  .autoRegister('mdw-block');
