import { CHROME_VERSION, isFocused } from '../core/dom.js';

/**
 * Enables focus delegation to an internal focus target and manages tabindex behavior.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
/**
 * Adds delegated focus behavior to the element's internals for keyboard navigation.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function DelegatesFocusMixin(Base) {
  return Base
    .set({
      /** When true, the element delegates focus to an internal focus target. */
      delegatesFocus: true,
    })
    .extend(CHROME_VERSION >= 111
      ? (BaseClass) => BaseClass
      : (BaseClass) => class extends BaseClass {
        get tabIndex() {
          return super.tabIndex;
        }

        set tabIndex(value) {
          if (value === super.tabIndex && value !== -1) {
            // Non -1 value already set
            return;
          }

          if (this.delegatesFocus && isFocused(this)) {
            if (this.getAttribute('tabindex') === value.toString()) {
              // Skip if possible
              return;
            }

            // Chrome blurs on tabindex changes with delegatesFocus
            // https://bugs.chromium.org/p/chromium/issues/detail?id=1346606
            /** @type {EventListener} */
            const listener = (e) => {
              e.stopImmediatePropagation();
              e.stopPropagation();
              if (e.type === 'blur') {
                console.warn('Chromium bug 1346606: Tabindex change caused blur. Giving focusing back.', this);
                this.focus();
              } else {
                console.warn(`Chromium bug 1346606: Blocking ${e.type} event.`, this);
              }
            };
            for (const type of ['blur', 'focus', 'focusout', 'focusin']) {
              this.addEventListener(type, listener, { capture: true, once: true });
            }
            super.tabIndex = value;
            for (const type of ['blur', 'focus', 'focusout', 'focusin']) {
              this.removeEventListener(type, listener, { capture: true });
            }
            return;
          }

          super.tabIndex = value;
        }
      });
}
