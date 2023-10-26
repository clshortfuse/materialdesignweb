/* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLE_TYPE } from '../core/customTypes.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';

export default CustomElement
  .extend()
  .mixin(DelegatesFocusMixin)
  .mixin(ResizeObserverMixin)
  .observe({
    paneOne: {
      value: /** @type {'fixed'|'flexible'} */ ('flexible'),
    },
    paneTwo: {
      value: /** @type {'fixed'|'flexible'|null} */ (null),
    },
    paneTwoActive: 'boolean',
    paneTwoBreakpoint: {
      type: 'float',
      empty: 720,
    },
    _lastComputedInlineSize: {
      type: 'float',
      nullable: false,
    },
  })
  .observe({
    _isMultipane({ _lastComputedInlineSize, paneTwo, paneTwoBreakpoint }) {
      return Boolean(paneTwo && _lastComputedInlineSize >= paneTwoBreakpoint);
    },
  })
  .observe({
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

      display: block;

      overflow-y:auto;

      block-size: 100vh;
      block-size: 100dvh;
    }
  `
  .overrides({
    onResizeObserved(entry) {
      this._lastComputedInlineSize = entry.borderBoxSize[0]?.inlineSize;
    },
  })
  .autoRegister('mdw-page');
