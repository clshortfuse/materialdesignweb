import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import ExtendedFab from './ExtendedFab.js';
import styles from './Fab.css' assert { type: 'css' };

export default class Fab extends TooltipTriggerMixin(ExtendedFab) {
  static { this.autoRegister(); }

  static elementName = 'mdw-fab';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    template.getElementById('slot').remove();
    template.getElementById('tooltip-slot').removeAttribute('name');
    const control = template.getElementById('control');
    control.setAttribute('aria-labelledby', 'tooltip');
    return template;
  }
}

/** @type {'small'|'large'} */
Fab.prototype.fabSize = Fab.idl('fabSize');
