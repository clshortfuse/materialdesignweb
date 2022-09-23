import styles from './Container.css' assert { type: 'css' };
import Text from './Text.js';

/** @typedef {'align'} DeprecatedHTMLDivElementProperties */
/** @implements {Omit<HTMLDivElement,DeprecatedHTMLDivElementProperties>} */
export default class Container extends Text {
  constructor() {
    super();
    this.elevationElement = this.shadowRoot.getElementById('elevation');
  }

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

  static elementName = 'mdw-container';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <div id=elevation aria-hidden=true></div>
    `,
  ];
}

Container.prototype.disabled = Container.idlBoolean('disabled');
Container.prototype.shapeTop = Container.idlBoolean('shape-top');
Container.prototype.shapeBottom = Container.idlBoolean('shape-bottom');
Container.prototype.shapeStart = Container.idlBoolean('shape-start');
Container.prototype.shapeEnd = Container.idlBoolean('shape-end');
Container.prototype.elevation = Container.idlInteger('elevation');
Container.prototype.color = Container.idlString('color');
Container.prototype.bg = Container.idlString('bg');
Container.prototype.shapeStyle = Container.idlString('shape-style');
