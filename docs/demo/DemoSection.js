import CustomElement from '../../core/CustomElement.js';

export default CustomElement
  .extend()
  .html`
    <section aria-labelledby=slot>
      <slot id=slot name=heading role=none></slot>
      <slot></slot>
    </section>
  `
  .css`:host{ display: block }`
  .autoRegister('demo-section');
