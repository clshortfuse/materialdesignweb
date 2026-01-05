/* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLE_TYPE } from '../core/customTypes.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';

/**
 * Page is a top-level layout container that manages single or multi-pane
 * application layouts, adapting to viewport size to show one or two panes.
 * @see https://m3.material.io/foundations/layout/applying-layout/window-size-classes
 */
export default CustomElement
  .extend()
  .mixin(DelegatesFocusMixin)
  .mixin(ResizeObserverMixin)
  .observe({
    /** Layout behavior for the first pane: 'fixed' keeps a fixed width, 'flexible' grows. */
    paneOne: {
      value: /** @type {'fixed'|'flexible'} */ ('flexible'),
    },
    /** Layout behavior for the second pane; null disables the second pane. */
    paneTwo: {
      value: /** @type {'fixed'|'flexible'|null} */ (null),
    },
    /** Whether the second pane is currently active/visible. */
    paneTwoActive: 'boolean',
    /** Inline-size breakpoint (px) at which the second pane becomes visible. */
    paneTwoBreakpoint: {
      type: 'float',
      empty: 720,
    },
    /** Internally tracked last measured inline size (pixels) used for layout decisions. */
    _lastComputedInlineSize: {
      type: 'float',
      nullable: false,
    },
  })
  .observe({
    /** Computed: true when two-pane layout should be active based on measured size. */
    _isMultipane({ _lastComputedInlineSize, paneTwo, paneTwoBreakpoint }) {
      return Boolean(paneTwo && _lastComputedInlineSize >= paneTwoBreakpoint);
    },
  })
  .observe({
    /** Computed inline CSS string that adjusts grid columns for single/multi-pane layouts. */
    _styles: {
      ...ELEMENT_STYLE_TYPE,
      get({ _isMultipane, paneOne, paneTwoActive }) {
        if (_isMultipane) {
          return `:host{grid-template-columns:${paneOne === 'fixed' ? '360px' : '1fr'} ${this.paneTwo === 'fixed' ? '360px' : '1fr'}}`;
        }
        if (paneTwoActive) {
          return ':host{grid-template-columns:1fr 0}#slot{display:none}';
        }
        return ':host{grid-template-columns:1fr 0}#two{display:none}';
      },
    },
  })
  .html`
    <slot id=slot mutli-pane={_isMultipane}></slot>
    <slot id=two name=two mutli-pane={_isMultipane}></slot>
  `
  .css`
    :host {
      --mdw-pane__max-width: 1040px;
      --mdw-pane__margin-inline: 16px;
      --mdw-pane__padding-inline: max(var(--mdw-pane__margin-inline), calc((100% - var(--mdw-pane__max-width)) / 2));
      --mdw-pane__padding-block: 16px;
      --mdw-pane__padding: var(--mdw-pane__padding-block) var(--mdw-pane__padding-inline);
      --mdw-pane__shape__size: 0;
      display: grid;
      column-gap: var(--mdw-page__margin);
      grid-auto-columns: 1fr;
      grid-auto-flow: column;

      block-size: 100%;

      padding: 0;

      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }

    @media (min-width: 648px) {
      :host {
        --mdw-pane__margin-inline: 24px;
        --mdw-pane__padding-block: 24px;
      }
    }

    @media (min-width: 728px) {
      :host {
        --mdw-pane__shape__size: var(--mdw-shape__large);
      }
    }

    #slot[multi-pane] {
      --mdw-pane__padding-inline: 24px;
    }

    #two[mutli-pane] {
      --mdw-pane__padding-inline: 0 24px;
      position: sticky;
      inset-block:0;

      display: flex;
      flex-direction: column;

      overflow-y:auto;

      block-size: 100vh;
      block-size: 100dvh;
    }
  `
  .overrides({
    /** Handle resize observer entries; update measured inline size for layout logic. */
    onResizeObserved(entry) {
      this._lastComputedInlineSize = entry.borderBoxSize[0]?.inlineSize;
    },
  })
  .autoRegister('mdw-page');
