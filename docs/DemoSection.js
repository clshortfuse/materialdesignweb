import CustomElement from '../components/CustomElement.js';

export default class DemoSection extends CustomElement {
  static { this.autoRegister(); }

  static elementName = 'demo-section';

  static fragments = [
    ...super.fragments,
    /* html */ `
      <section aria-labelledby=slot>
        <slot id=slot name=heading role="none"></slot>
        <slot></slot>
      </section>
    `,
  ];
}
