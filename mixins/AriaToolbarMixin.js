import KbdNavWidgetMixin from './KeyboardNavMixin.js';

/**
 * @template {typeof import('../core/CustomElement.js').default} T
 * @param {T} Base
 */
export default function AriaToolbarMixin(Base) {
  class AriaToolbar extends KbdNavWidgetMixin(Base) {
    /** @return {'horizontal'|'vertical'} */
    get ariaOrientationDefault() { return 'horizontal'; }
  }
  return AriaToolbar;
}
