/* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

import CustomElement from '../core/CustomElement.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';

export default CustomElement
  .extend()
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
    twoPane: {
      type: 'boolean',
      reflect: 'write',
      get({ paneTwo, paneTwoActive, _lastComputedInlineSize, paneTwoBreakpoint }) {
        console.log('refreshing', { paneTwo, paneTwoActive, _lastComputedInlineSize, paneTwoBreakpoint }, paneTwo && (paneTwoActive || _lastComputedInlineSize >= paneTwoBreakpoint));
        return paneTwo && (paneTwoActive || _lastComputedInlineSize >= paneTwoBreakpoint);
      },
    },
  })
  .html`
    <slot id=slot></slot>
    <slot id=two name=two hidden={!twoPane} ></slot>
  `
  .css`
    :host {
      --mdw-page__max-width: 1040px;
      --mdw-page__margin: 16px;
      --mdw-page__padding-inline: max(var(--mdw-page__margin), calc((100% - var(--mdw-page__max-width)) / 2));
      display: contents;
      column-gap: var(--mdw-page__margin);
      grid-auto-columns: 1fr;
      grid-auto-flow: column;
      grid-template-columns: 1fr;

      padding-inline: var(--mdw-page__margin);

      

      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }

    :host([pane-two]) {
      display: grid;
    }
    

    @media (min-width: 648px) {
      :host {
        --mdw-page__margin: 24px;
      }
    }

    :host([pane-two="fixed"]) {
      grid-auto-columns: 360px;
    }

    :host([two-pane][pane-one="fixed"]) {
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
