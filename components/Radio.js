import InputMixin from '../mixins/InputMixin.js';

import styles from './Radio.css' assert { type: 'css' };
import iconStyles from './RadioIcon.css' assert { type: 'css' };
import Text from './Text.js';

export default class Radio extends InputMixin(Text) {
  static { this.autoRegister(); }

  static elementName = 'mdw-radio';

  static styles = [...super.styles, styles, iconStyles];

  static get template() {
    const template = super.template;
    const html = this.html;
    template.getElementById('label').append(html`
      <div id=icon class=radio-icon selected={_checked} disabled={disabled}>
        ${template.getElementById('ripple')}
        ${template.getElementById('state')}
      </div>
    `);
    template.getElementById('control').setAttribute('type', 'radio');
    return template;
  }

  // @ts-ignore @override
  // eslint-disable-next-line class-methods-use-this
  get type() { return 'radio'; }
}
