import CustomElement from '../../core/CustomElement.js';

export default class DemoSection extends CustomElement {
  static { this.autoRegister(); }

  static elementName = 'demo-section';

  compose() {
    return super.compose().append(/* html */`
      <section aria-labelledby=slot>
        <slot id=slot name=heading role="none"></slot>
        <slot></slot>
      </section>
    `);
  }
}
