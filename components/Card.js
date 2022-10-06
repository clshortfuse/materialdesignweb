import styles from './Card.css' assert { type: 'css' };
import Container from './Container.js';

export default class Card extends Container {
  static elementName = 'mdw-card';

  static ariaRole = 'figure';

  static fragments = [
    ...super.fragments,
    /* html */`
      <slot id=primary-action name=primary-action></slot>
      <div id=outline></div>
    `,
  ];

  static styles = [...super.styles, styles];
}
