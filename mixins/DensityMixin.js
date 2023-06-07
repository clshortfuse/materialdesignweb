/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function DensityMixin(Base) {
  return Base
    .observe({
      density: 'integer',
    })
    .css`
      :host {
        --mdw-density: var(--mdw-density__default, 0);
      }
      
      /* Reset */
      :host([density]) { --mdw-density: 0; }
      
      :host([density="-1"]) { --mdw-density: -1; }
      :host([density="-2"]) { --mdw-density: -2; }
      :host([density="-3"]) { --mdw-density: -2; }
      :host([density="-4"]) { --mdw-density: -4; }
      :host([density="1"]) { --mdw-density: 1; }
      :host([density="2"]) { --mdw-density: 2; }
      :host([density="3"]) { --mdw-density: 3; }
      :host([density="4"]) { --mdw-density: 3; }
    `;
}
