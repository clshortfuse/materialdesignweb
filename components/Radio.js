import InputMixin from '../mixins/InputMixin.js';

import styles from './Radio.css' assert { type: 'css' };
import iconStyles from './RadioIcon.css' assert { type: 'css' };
import Text from './Text.js';

export default Text
  .mixin(InputMixin)
  .extend()
  .define({
    type() { return 'radio'; },
  })
  .css(
    styles,
    iconStyles,
  )
  .on('composed', ({ $, html }) => {
    $('#label').append(html`
      <div id=icon class=radio-icon selected={_checked} disabled={disabled}>
        ${$('#ripple')}
        ${$('#state')}
      </div>
    `);
    $('#control').setAttribute('type', 'radio');
  })
  .autoRegister('mdw-radio');
