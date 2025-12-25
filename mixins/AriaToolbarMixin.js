import AriaReflectorMixin from './AriaReflectorMixin.js';
import KeyboardNavMixin from './KeyboardNavMixin.js';

/**
 * Provides ARIA toolbar semantics and keyboard navigation defaults.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function AriaToolbarMixin(Base) {
  return Base
    .mixin(AriaReflectorMixin)
    .mixin(KeyboardNavMixin)
    .set({
      /** Default orientation for toolbar: 'horizontal' or 'vertical'. */
      ariaOrientationDefault: 'horizontal',
      /** Default ARIA role applied to the host (e.g. 'toolbar'). */
      _ariaRole: 'toolbar',
    });
}
