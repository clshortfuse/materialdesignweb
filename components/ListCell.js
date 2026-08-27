import CustomElement from '../core/CustomElement.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';

/** One statically identified cell within an `mdw-list-row`. */
export default CustomElement
  .extend()
  .mixin(AriaReflectorMixin)
  .set({
    _ariaRole: 'gridcell',
  })
  .html`<slot id=slot></slot>`
  .css`
    :host {
      display: flex;
      align-items: stretch;
      flex: none;
      min-block-size: 48px;
      min-inline-size: 48px;
    }

    :host([hidden]) {
      display: none;
    }

    #slot {
      display: flex;
      align-items: stretch;
      flex: 1;
    }
  `
  .on({
    _ariaRoleAttributeChanged() {
      if (this._updatingAriaRole || this.getAttribute('role') === 'gridcell') return;
      this._updatingAriaRole = true;
      try {
        this._authoredAriaRole = 'gridcell';
        this.setAttribute('role', 'gridcell');
      } finally {
        this._updatingAriaRole = false;
      }
    },
    connected() {
      if (this.getAttribute('role') !== 'gridcell') {
        this._updatingAriaRole = true;
        try {
          this._authoredAriaRole = 'gridcell';
          this.setAttribute('role', 'gridcell');
        } finally {
          this._updatingAriaRole = false;
        }
      }
    },
  })
  .autoRegister('mdw-list-cell');
