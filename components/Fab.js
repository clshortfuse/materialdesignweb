import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import ExtendedFab from './ExtendedFab.js';
import styles from './Fab.css' assert { type: 'css' };

export default class Fab extends TooltipTriggerMixin(ExtendedFab) {
  static { this.autoRegister('mdw-fab'); }

  compose() {
    const composition = super.compose().append(styles);

    const { template } = composition;
    template.getElementById('slot').remove();
    template.getElementById('tooltip-slot').removeAttribute('name');
    const control = template.getElementById('control');
    control.setAttribute('aria-labelledby', 'tooltip');

    return composition;
  }
}

/** @type {'small'|'large'} */
Fab.prototype.fabSize = Fab.idl('fabSize');
