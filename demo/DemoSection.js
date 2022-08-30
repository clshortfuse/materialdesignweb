import MDWComponent from '../core/component/MDWComponent.js';

export default class DemoSection extends MDWComponent {
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
