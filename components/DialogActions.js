import CustomElement from '../core/CustomElement.js';
import { css } from '../core/template.js';

export default class DialogActions extends CustomElement {
  static { this.autoRegister('mdw-dialog-actions'); }

  compose() {
    return super.compose().append(
      css`
        :host {
          align-self: flex-end;
          padding-inline: 24px;
          margin-block: 24px;
        }
      `,
      '<slot/>',
    );
  }
}
