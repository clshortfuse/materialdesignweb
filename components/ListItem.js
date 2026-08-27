import './Icon.js';

import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
import ExpandableMixin from '../mixins/ExpandableMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';

import ListItemBase from './ListItemBase.js';

/**
 * List item representing a single row in a list; supports leading/trailing
 * content, selection, accessibility features, and optional expansion content.
 * Default-slot content is primary presentation; independent controls belong in
 * the `trailing-action` slot.
 * @see https://m3.material.io/components/lists/specs
 */
export default ListItemBase
  .extend()
  .mixin(ShapeMixin)
  .mixin(ExpandableMixin)
  .set({
    /** Whether the primary cell may own ordinary disclosure semantics. */
    _primaryCellDisclosure: true,

    /** Tabindex applied to internal action elements by specialized items. */
    _actionTabIndex: null,
  })
  .observe({
    /** Give the row a button-like primary action. */
    actionable: 'boolean',
    /** Event handler called when the primary JavaScript action is triggered. */
    onaction: EVENT_HANDLER_TYPE,
    /** Role of the primary cell when it is the item's disclosure control. */
    _primaryCellRole({ _expandable, _primaryCellDisclosure, actionable, href }) {
      return _expandable
        && _primaryCellDisclosure
        && !actionable
        && href == null
        ? 'button'
        : null;
    },
  })
  .define({
    stateTargetElement() {
      if (this.href != null && this.refs.anchor?.isConnected) return this.refs.anchor;
      if (this.actionable && this.refs.primaryAction?.isConnected) return this.refs.primaryAction;
      if (this.refs.primaryInteraction?.isConnected) return this.refs.primaryInteraction;
      return this.refs.rippleContainer;
    },
  })
  .overrides({
    /** @param {Event} event @return {boolean} */
    _isStateTargetEvent(event) {
      const stateTarget = this.stateTargetElement;
      const [origin] = event.composedPath();
      if (event instanceof FocusEvent) {
        return origin === this
          || (origin === this.refs.primaryCell
            && stateTarget === this.refs.primaryInteraction);
      }
      if (event instanceof KeyboardEvent && origin === this.refs.primaryCell) {
        return stateTarget === this.refs.primaryInteraction;
      }
      return origin === stateTarget;
    },

    getExpandableAriaElement() {
      if (this.href != null) return null;
      if (this.refs.expansionAction?.isConnected) return this.refs.expansionAction;
      return this.refs.primaryCell;
    },
  })
  .expressions({
    _primaryCellTabIndex({ _primaryCellRole, disabledState }) {
      return _primaryCellRole && !disabledState ? '0' : null;
    },
    _primaryCellAriaControls({ _primaryCellRole }) {
      return _primaryCellRole ? 'expansion' : null;
    },
    _primaryCellAriaDisabled({ _primaryCellRole, disabledState }) {
      return _primaryCellRole && disabledState ? 'true' : null;
    },
    _showPrimaryAction({ actionable, href }) {
      return actionable && href == null;
    },
    _showPrimaryInteraction({ _expandable, _primaryCellDisclosure, actionable, href }) {
      return href == null
        && !actionable
        && _primaryCellDisclosure
        && _expandable;
    },
    _showExpansionAction({ _expandable, actionable, href }) {
      return _expandable
        && href == null
        && actionable;
    },
    isInteractive({ _expandable, actionable, href }) {
      return _expandable || actionable || href != null;
    },
    _showStateLayer({ _expandable, actionable, href, stateLayer }) {
      return stateLayer && (_expandable || actionable || href != null);
    },
    _showRippleContainer({ _expandable, actionable, disabledState, href }) {
      return !disabledState && (_expandable || actionable || href != null);
    },
    _showExpandableIcon({ _expandable, actionable, href, trailingIcon, trailing }) {
      return _expandable
        && href == null
        && !actionable
        && !trailingIcon
        && !trailing;
    },
  })
  .recompose(({
    html,
    refs: {
      anchor,
      divider,
      row,
      trailing,
    },
  }) => {
    const primaryCellFragment = html`<div id=primary-cell></div>`;
    const primaryCell = primaryCellFragment.firstElementChild;
    primaryCell.setAttribute('role', '{_primaryCellRole}');
    primaryCell.setAttribute('tabindex', '{_primaryCellTabIndex}');
    primaryCell.setAttribute('aria-controls', '{_primaryCellAriaControls}');
    primaryCell.setAttribute('aria-disabled', '{_primaryCellAriaDisabled}');
    primaryCell.setAttribute('interactive', '{isInteractive}');
    anchor.setAttribute('tabindex', '{_actionTabIndex}');
    primaryCell.append(
      anchor,
      html`<button mdw-if={_showPrimaryAction} id=primary-action type=button aria-labelledby=content disabled={disabledState} tabindex={_actionTabIndex}></button>`,
      html`<span mdw-if={_showPrimaryInteraction} id=primary-interaction aria-hidden=true></span>`,
      ...row.childNodes,
    );
    row.append(primaryCell);
    row.append(html`
      <div id=action-container has-expansion-action={_showExpansionAction}>
        <span id=actions-cell>
          <slot id=actions name=trailing-action></slot>
        </span>
        <span mdw-if={_showExpansionAction} id=expansion-cell>
          <button id=expansion-action type=button aria-controls=expansion
            aria-labelledby=content disabled={disabledState} tabindex={_actionTabIndex}>
            <mdw-icon id=expansion-action-icon aria-hidden=true icon=expand_more></mdw-icon>
          </button>
        </span>
      </div>
    `);
    trailing.before(html`<mdw-icon mdw-if={_showExpandableIcon} id=expand-icon aria-hidden=true icon=expand_more></mdw-icon>`);
    divider.before(html`
      <div id=expansion>
        <slot id=expansion-slot name=expansion></slot>
      </div>
    `);
  })
  .css`
    :host {
      grid-template-rows: minmax(0, min-content) minmax(0, min-content);
    }

    #primary-cell[interactive] {
      cursor: pointer;
    }

    #primary-cell {
      position: relative;

      display: flex;
      align-self: stretch;
      align-items: center;
      gap: 16px;
      flex: 1;

      min-inline-size: 0;
    }

    :host([lines="3"]) #primary-cell {
      align-items: flex-start;
    }

    #anchor,
    #primary-action,
    #primary-interaction {
      position: absolute;
      inset: 0;

      z-index: 1;

      padding: 0;

      border: 0;

      cursor: pointer;
      outline: none;

      background: transparent;
    }

    #anchor,
    #primary-action,
    #primary-interaction,
    #state,
    #ripple-container {
      inset-block: -8px;
      inset-inline: -16px;
    }

    :host([video]) :is(#anchor, #primary-action, #primary-interaction, #state, #ripple-container) {
      inset-inline-start: 0;
    }

    :host([lines="3"]) :is(#anchor, #primary-action, #primary-interaction, #state, #ripple-container) {
      inset-block: calc(-12px - (var(--mdw-density, 0) * 2px));
    }

    #slot::slotted(mdw-list-tree:not([slot])) {
      position: relative;
      z-index: 2;
    }

    #action-container {
      position: relative;

      z-index: 2;

      display: flex;
      align-self: stretch;
      align-items: stretch;
      flex: none;

      margin-block: -8px;
    }

    #action-container:not([has-actions]):not([has-expansion-action]) {
      display: none;
    }

    #actions-cell,
    #expansion-cell {
      display: flex;
      align-items: stretch;
      flex: none;
    }

    #expansion-action {
      display: inline-grid;
      place-items: center;

      min-block-size: 48px;
      min-inline-size: 48px;

      padding: 0;

      border: 0;

      cursor: pointer;

      background: transparent;
      color: inherit;
    }

    #actions::slotted(*) {
      box-sizing: border-box;
      align-self: stretch;
      flex: none;
      min-block-size: 48px;
      min-inline-size: 48px;
    }

    :host([lines="3"]) #action-container {
      margin-block: calc(-12px - (var(--mdw-density, 0) * 2px));
    }

    :host([expanded]) {
      background-color: rgb(var(--mdw-color__surface-container-highest));
    }

    #expand-icon,
    #expansion-action-icon {
      color: rgb(var(--mdw-color__on-surface-variant));

      font-size: 24px;

      transition: transform 200ms;
    }

    :host([expanded]) #expand-icon,
    :host([expanded]) #expansion-action-icon {
      transform: rotate(180deg);
    }

    #expansion {
      grid-area: 2 / 1;
    }

    #expansion-slot::slotted(mdw-list),
    #expansion-slot::slotted(mdw-list-tree) {
      padding-block-start: 0;
      padding-inline-start: 40px;
    }

    @media (prefers-reduced-motion: reduce) {
      #expand-icon,
      #expansion-action-icon {
        transition-duration: 0ms;
      }
    }
  `
  .childEvents({
    primaryCell: {
      keydown(event) {
        if (!this._primaryCellDisclosure
          || !this._expandable
          || this.href != null
          || this.disabledState
          || event.target !== this.refs.primaryCell
          || event.ctrlKey
          || event.altKey
          || event.shiftKey
          || event.metaKey
          || (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ')
          || this.refs.expansionAction?.isConnected) return;
        this.toggleExpanded();
        event.preventDefault();
      },
    },
    actions: {
      slotchange() {
        this.refs.actionContainer.toggleAttribute(
          'has-actions',
          (/** @type {HTMLSlotElement} */ (this.refs.actions)).assignedElements().length !== 0,
        );
      },
    },
    primaryAction: {
      click() {
        if (!this.actionable || this.disabledState) return;
        this.dispatchEvent(new Event('action'));
      },
    },
    primaryInteraction: {
      click(event) {
        if (this.disabledState
          || !this._primaryCellDisclosure
          || !this._expandable) return;
        this.toggleExpanded();
        event.preventDefault();
      },
    },
    expansionAction: {
      focus() {
        this._focused = false;
        this._focusedSynthetic = false;
      },
      click() {
        if (!this._expandable
          || this.disabledState
          || !this.getExpandableAriaElement()) return;
        this.toggleExpanded();
      },
    },
  })
  .on({
    _ariaRoleAttributeChanged() {
      const role = this._ariaRole;
      if (this._updatingAriaRole || this.getAttribute('role') === role) return;
      this._updatingAriaRole = true;
      try {
        this._authoredAriaRole = role;
        this.setAttribute('role', role);
      } finally {
        this._updatingAriaRole = false;
      }
    },
    hrefChanged() {
      this._updateExpandableAria();
    },
    actionableChanged() {
      this._updateExpandableAria();
    },
    connected() {
      const role = this._ariaRole;
      if (this.getAttribute('role') !== role) {
        this._updatingAriaRole = true;
        try {
          this._authoredAriaRole = role;
          this.setAttribute('role', role);
        } finally {
          this._updatingAriaRole = false;
        }
      }
      this.refs.actionContainer.toggleAttribute(
        'has-actions',
        (/** @type {HTMLSlotElement} */ (this.refs.actions)).assignedElements().length !== 0,
      );
      this._updateExpandableAria();
    },
  })
  .autoRegister('mdw-list-item');
