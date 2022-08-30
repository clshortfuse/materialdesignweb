import MDWComponent from '../core/component/MDWComponent.js';

export default class DemoSection extends MDWComponent {
  static delegatesFocus = true;

  static elementName = 'demo-button';

  static fragments = [
    ...super.fragments,
    /* html */ `
      <label id=label>
        <input id=input type=button role=button>
        <slot id=slot></slot>
      </label>
    `,
  ];

  /** @type {HTMLElement['focus']} */
  focus(options) {
    super.focus(options);
    this.shadowRoot.getElementById('input').focus(options);
  }
}
