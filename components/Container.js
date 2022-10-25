import styles from './Container.css' assert { type: 'css' };
import colorStyles from './ContainerColors.css' assert { type: 'css' };
import Text from './Text.js';

/** @typedef {'align'} DeprecatedHTMLDivElementProperties */

/** @implements {Omit<HTMLDivElement,DeprecatedHTMLDivElementProperties>} */
export default class Container extends Text {
  static elementName = 'mdw-container';

  // Allow inks to override color styles
  static styles = [colorStyles, ...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */ `
      <div _if={!disabled} id=elevation aria-hidden=true></div>
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

Container.prototype.disabled = Container.idl('disabled', 'boolean');
Container.prototype.shapeTop = Container.idl('shapeTop', 'boolean');
Container.prototype.shapeBottom = Container.idl('shapeBottom', 'boolean');
Container.prototype.shapeStart = Container.idl('shapeStart', 'boolean');
Container.prototype.shapeEnd = Container.idl('shapeEnd', 'boolean');
Container.prototype.elevation = Container.idl('elevation', 'integer');
Container.prototype.color = Container.idl('color');
Container.prototype.shapeStyle = Container.idl('shapeStyle');
