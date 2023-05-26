import CustomElement from '../../core/CustomElement.js';

export default CustomElement
  .extend()
  .html/* html */`
    <section aria-labelledby=slot>
      <slot id=slot name=heading role=none></slot>
      <slot></slot>
    </section>
  `
  .css/* css */`:host{ display: block }`
  .autoRegister('demo-section');
