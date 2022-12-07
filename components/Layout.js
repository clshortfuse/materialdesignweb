import Container from './Container.js';
import styles from './Layout.css' assert { type: 'css' };

export default class Layout extends Container {
  static { this.autoRegister('mdw-layout'); }

  compose() {
    return super.compose().append(
      styles,
      this.updateGap,
    );
  }

  /**
   * @param {Partial<this>} data
   */
  updateGap({ gap }) {
    // TODO: Style slot instead of host
    if (gap) {
      this.style.setProperty('--mdw-layout__gap', gap);
    } else {
      this.style.removeProperty('--mdw-layout__gap');
    }
  }
}

Layout.prototype.x = Layout.idl('x');
Layout.prototype.y = Layout.idl('y');
Layout.prototype.column = Layout.idl('column', 'boolean');
/** @type {null|'wrap'|'reverse'} */
Layout.prototype.wrap = Layout.idl('wrap');
Layout.prototype.gap = Layout.idl('gap');
