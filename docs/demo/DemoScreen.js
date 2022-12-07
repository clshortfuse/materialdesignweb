import Container from '../../components/Container.js';
import { css } from '../../core/template.js';

export default class DemoScreen extends Container {
  static { this.autoRegister('demo-screen'); }

  compose() {
    return super.compose().append(
      css`
        :host {
          position: relative;
          max-height: 400px;
          overflow-y: auto;
          min-width: 360px;
          width: 90vw;
          display: flex;
          flex-direction: column;
          --mdw-bg: var(--mdw-color__background);
          --mdw-color: var(--mdw-color__on-background);
        }
      `,
    );
  }
}
