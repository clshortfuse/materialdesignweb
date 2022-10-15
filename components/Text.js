import CustomElement from './CustomElement.js';
import styles from './Text.css' assert { type: 'css' };
import inkStyles from './TextInks.css' assert { type: 'css' };

/** @implements {HTMLSpanElement} */
export default class Text extends CustomElement {
  static elementName = 'mdw-text';

  static styles = [...super.styles, styles, inkStyles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <slot id=slot></slot>
    `,
  ];
}

Text.prototype.block = Text.idlBoolean('block');
Text.prototype.ink = Text.idl('ink');
Text.prototype.typeStyle = Text.idl('typeStyle');
