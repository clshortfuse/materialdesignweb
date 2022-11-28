import { isRtl } from '../core/dom.js';

import RovingTabIndexedMixin from './RovingTaxIndexedMixin.js';

/**
 * @template {typeof import('../core/CustomElement.js').default} T
 * @param {T} Base
 */
export default function AriaToolbarMixin(Base) {
  class AriaToolbar extends RovingTabIndexedMixin(Base) {
    get #ariaToolbarVertical() {
      return (this.ariaOrientation ?? this.getAttribute('aria-orientation') === 'vertical');
    }

    /**
     * @param {KeyboardEvent} event
     * @return {void}
     */
    onAriaToolbarKeyDown(event) {
      if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
      if (this.rovingTabIndex !== 'true') return;

      switch (event.key) {
        case 'ArrowUp':
        case 'Up':
          if (this.#ariaToolbarVertical) {
            this.rtiFocusPrevious();
          }
          break;
        case 'ArrowDown':
        case 'Down':
          if (this.#ariaToolbarVertical) {
            this.rtiFocusNext();
          }
          break;
        case 'ArrowLeft':
        case 'Left':
          if (this.#ariaToolbarVertical) return;
          if (isRtl(this)) {
            this.rtiFocusNext();
          } else {
            this.rtiFocusPrevious();
          }
          break;
        case 'ArrowRight':
        case 'Right':
          if (this.#ariaToolbarVertical) return;
          if (isRtl(this)) {
            this.rtiFocusPrevious();
          } else {
            this.rtiFocusNext();
          }
          break;
        default:
      }
    }

    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('keydown', this.onAriaToolbarKeyDown);
    }
  }
  return AriaToolbar;
}
