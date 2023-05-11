import KeyboardNavMixin from './KeyboardNavMixin.js';

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function AriaToolbarMixin(Base) {
  return Base
    .mixin(KeyboardNavMixin)
    .extend()
    .set({
      ariaOrientationDefault: 'horizontal',
    });
}
