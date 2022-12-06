import InputMixin from '../mixins/InputMixin.js';

import styles from './Radio.css' assert { type: 'css' };
import iconStyles from './RadioIcon.css' assert { type: 'css' };
import Text from './Text.js';

export default class Radio extends InputMixin(Text) {
  static { this.autoRegister('mdw-radio'); }

  compose() {
    const composition = super.compose().append(
      styles,
      iconStyles,
    );

    const { html } = this;
    const { template } = composition;
    template.getElementById('label').append(html`
      <div id=icon class=radio-icon selected={_checked} disabled={disabled}>
        ${template.getElementById('ripple')}
        ${template.getElementById('state')}
      </div>
    `);
    template.getElementById('control').setAttribute('type', 'radio');

    return composition;
  }

  // @ts-ignore @override
  get type() { return 'radio'; }
}
