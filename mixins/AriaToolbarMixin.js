import AriaReflectorMixin from './AriaReflectorMixin.js';
import KeyboardNavMixin from './KeyboardNavMixin.js';

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function AriaToolbarMixin(Base) {
  return Base
    .mixin(AriaReflectorMixin)
    .mixin(KeyboardNavMixin)
    .set({
      ariaOrientationDefault: 'horizontal',
      _ariaRole: 'toolbar',
    });
}
