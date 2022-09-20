import CustomElement from '../components/CustomElement.js';

export default class DemoSection extends CustomElement {
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
