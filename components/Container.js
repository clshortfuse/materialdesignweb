import styles from './Container.css' assert { type: 'css' };
import Text from './Text.js';

/** @typedef {'align'} DeprecatedHTMLDivElementProperties */
/** @implements {Omit<HTMLDivElement,DeprecatedHTMLDivElementProperties>} */
export default class Container extends Text {
  static elementName = 'mdw-container';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <div id=elevation aria-hidden=true></div>
    `,
  ];

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'disabled':
        if (newValue == null) {
          this.setAttribute('aria-disabled', 'false');
        } else {
          this.setAttribute('aria-disabled', 'true');
        }
        break;
      default:
    }
  }
}

Container.prototype.disabled = Container.idlBoolean('disabled');
Container.prototype.shapeTop = Container.idlBoolean('shapeTop');
Container.prototype.shapeBottom = Container.idlBoolean('shapeBottom');
Container.prototype.shapeStart = Container.idlBoolean('shapeStart');
Container.prototype.shapeEnd = Container.idlBoolean('shapeEnd');
Container.prototype.elevation = Container.idlInteger('elevation');
Container.prototype.color = Container.idl('color');
Container.prototype.bg = Container.idl('bg');
Container.prototype.shapeStyle = Container.idl('shapeStyle');

Container.prototype.refs = {
  ...Text.prototype.refs,
  ...Container.addRefNames('elevation'),
};
