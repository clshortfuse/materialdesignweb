import CustomElement from '../../core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    label: 'string',
    x: {
      type: 'string',
      empty: 'center',
    },
    y: {
      type: 'string',
      empty: 'center',
    },
  })
  .html`
    <mdw-card id=card role=region outlined x=stretch aria-labelledby=label>
      <mdw-title id=label text-padding=0 padding=16 aria-hidden=true>{label}</mdw-title>
      <mdw-divider></mdw-divider>
      <demo-preview id=preview gap=8 wrap x={x} y={y} padding=16 flex-1>
        <slot id=slot></slot>
      </demo-preview>
    </mdw-card>
  `
  .css`
    :host {
      display: flex;
      align-items: stretch; 
      flex-direction: column;
    }

    #card {
      flex: 1;
    }
  `
  .autoRegister('demo-preview-card');
