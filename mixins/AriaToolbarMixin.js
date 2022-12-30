import KbdNavWidgetMixin from './KeyboardNavMixin.js';

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function AriaToolbarMixin(Base) {
  return Base
    .mixin(KbdNavWidgetMixin)
    .extend()
    .define({
      ariaOrientationDefault() {
        return /** @type {'horizontal'|'vertical'} */ ('horizontal');
      },
    });
}
