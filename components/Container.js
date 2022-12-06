import styles from './Container.css' assert { type: 'css' };
import colorStyles from './ContainerColors.css' assert { type: 'css' };
import Text from './Text.js';

/** @typedef {'align'} DeprecatedHTMLDivElementProperties */

/** @implements {Omit<HTMLDivElement,DeprecatedHTMLDivElementProperties>} */
export default class Container extends Text {
  static { this.autoRegister('mdw-container'); }

  compose() {
    const composition = super.compose().append(
      styles,
      '<div _if={!disabled} id=elevation aria-hidden=true></div>',
    );
    composition.styles.unshift(colorStyles); // Ink > Color rules
    return composition;
  }

  /** @type {Text['attributeChangedCallback']} */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
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
