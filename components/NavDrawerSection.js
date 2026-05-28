import CustomElement from '../core/CustomElement.js';
import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';

import './Divider.js';

/**
 * A navigation drawer section groups related drawer destinations and can render
 * the recommended divider before the group.
 * @see https://m3.material.io/components/navigation-drawer/guidelines#b09316a0-28a7-4e85-9f39-205edbf2771a
 */
export default CustomElement
  .extend()
  .mixin(AriaReflectorMixin)
  .set({
    /** ARIA role applied to the host element (default: 'group'). */
    _ariaRole: 'group',
  })
  .observe({
    /** When true, render a divider before the section contents. */
    divider: 'boolean',
    /** Section label text shorthand. */
    label: 'string',
    /** Internal flag set when label content is provided via slot. */
    _labelSlotted: 'boolean',
  })
  .expressions({
    hasLabel() {
      return Boolean(this.label || this._labelSlotted);
    },
  })
  .methods({
    /** @param {Event & {currentTarget: HTMLSlotElement}} event */
    onLabelSlotChange({ currentTarget }) {
      this._labelSlotted = currentTarget.assignedNodes().some((node) => (
        node.nodeType === node.ELEMENT_NODE
        || (node.nodeType === node.TEXT_NODE && node.nodeValue.trim().length)
      ));
    },
  })
  .html`
    <mdw-divider id=divider aria-hidden=true></mdw-divider>
    <slot id=label name=label hidden={!hasLabel} on-slotchange={onLabelSlotChange}>{label}</slot>
    <slot id=slot></slot>
  `
  .css`
    :host {
      display: block;

      box-sizing: border-box;
      inline-size: 100%;
    }

    #divider {
      display: none;

      padding-inline: 16px;
    }

    :host([divider]) #divider {
      display: block;
    }

    #label {
      --mdw-ink: var(--mdw-color__on-surface-variant);

      display: flex;
      align-items: center;

      box-sizing: border-box;
      min-block-size: 56px;
      inline-size: 100%;

      padding-inline: 16px;

      overflow: hidden;

      color: rgb(var(--mdw-ink));

      font: var(--mdw-typescale__title-small__font);
      letter-spacing: var(--mdw-typescale__title-small__letter-spacing);

      text-align: start;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    #label[hidden] {
      display: none;
    }

    #label::slotted(*) {
      overflow: hidden;

      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `
  .autoRegister('mdw-nav-drawer-section');
