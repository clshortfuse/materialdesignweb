import CustomElement from '../../core/CustomElement.js';

export default class DemoSection extends CustomElement {
  static { this.autoRegister(); }

  static elementName = 'demo-button';

  static delegatesFocus = true;

  compose() {
    return super.compose().append(/* html */`
      <label id=label>
        <input id=input type=button role=button>
        <slot id=slot></slot>
      </label>
    `);
  }

  /** @type {HTMLElement['focus']} */
  focus(options = undefined) {
    super.focus(options);
    this.shadowRoot.getElementById('input').focus(options);
  }
}
