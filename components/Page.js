/* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

import CustomElement from '../core/CustomElement.js';
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
    expanded: {
      type: 'boolean',
      reflect: 'write',
      get({ paneTwo, paneTwoActive, _lastComputedInlineSize, paneTwoBreakpoint }) {
        return paneTwo && (paneTwoActive || _lastComputedInlineSize >= paneTwoBreakpoint);
      },
    },
  })
  .html`
    <slot id=slot></slot>
    <slot id=two name=two hidden={!expanded} ></slot>
  `
  .css`
    :host {
      --mdw-pane__max-width: 1040px;
      --mdw-pane__margin-inline: 16px;
      --mdw-pane__padding-inline: max(var(--mdw-pane__margin-inline), calc((100% - var(--mdw-pane__max-width)) / 2));
      --mdw-pane__border-radius: variable-exists;
      --mdw-pane__shape__size: 0;
      display: grid;
      column-gap: var(--mdw-page__margin);
      grid-auto-columns: 1fr;
      grid-auto-flow: column;
      grid-template-columns: 1fr;

      padding: 0;

      

      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }

    :host([expanded]) {
      display: grid;
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

    :host([pane-two="fixed"]) {
      grid-auto-columns: 360px;
    }

    :host([expanded][pane-one="fixed"]) {
      grid-template-columns: 360px;
    }

    #two[hidden] {
      display: none;
    }
  `
  .overrides({
    onResizeObserved(entry) {
      this._lastComputedInlineSize = entry.borderBoxSize[0]?.inlineSize;
    },
  })
  .autoRegister('mdw-page');
