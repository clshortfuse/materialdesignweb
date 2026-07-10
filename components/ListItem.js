import './Icon.js';

import ExpandableMixin from '../mixins/ExpandableMixin.js';

import ListItemBase from './ListItemBase.js';

/**
 * @param {HTMLElement} element
 * @param {Event} event
 * @return {boolean}
 */
function eventTargetsExpansion(element, event) {
  const path = event.composedPath();
  for (const child of element.children) {
    if (!(child instanceof HTMLElement)) continue;
    if (child.slot !== 'expansion') continue;
    for (const target of path) {
      if (!(target instanceof HTMLElement)) continue;
      if (child === target || child.contains(target)) return true;
    }
  }
  return false;
}

/**
 * List item representing a single row in a list; supports leading/trailing
 * content, selection, accessibility features, and optional expansion content.
 * @see https://m3.material.io/components/lists/specs
 */
export default ListItemBase
  .extend()
  .mixin(ExpandableMixin)
  .overrides({
    getExpandableAriaElement() {
      if (this._ariaRole === 'treeitem') return this;
      if (this.href != null) return null;
      return this.refs.row;
    },
  })
  .expressions({
    isInteractive({ _expandable, href }) {
      return _expandable || href != null;
    },
    _showStateLayer({ _expandable, href, stateLayer }) {
      return stateLayer && (_expandable || href != null);
    },
    _showRippleContainer({ _expandable, disabledState, href }) {
      return !disabledState && (_expandable || href != null);
    },
    showExpandableIcon({ _expandable, trailingIcon, trailing }) {
      return _expandable && !trailingIcon && !trailing;
    },
  })
  .methods({
    /** @return {void} */
    _updateRowDisclosureState() {
      const row = this.refs.row;
      if (!row) return;
      const isDisclosure = this._expandable
        && this.href == null
        && this._ariaRole !== 'treeitem';
      if (!isDisclosure) {
        row.removeAttribute('role');
        row.removeAttribute('tabindex');
        row.removeAttribute('aria-controls');
        row.removeAttribute('aria-disabled');
        return;
      }
      row.setAttribute('role', 'button');
      row.setAttribute('aria-controls', 'expansion');
      if (this.disabledState) {
        row.removeAttribute('tabindex');
        row.setAttribute('aria-disabled', 'true');
      } else {
        row.setAttribute('tabindex', '0');
        row.removeAttribute('aria-disabled');
      }
    },

    /**
     * Sets the item role that corresponds to the parent list role.
     * @param {string} listRole
     * @return {void}
     */
    _setListRole(listRole) {
      const explicitRole = this.getAttribute('role');
      this._ariaRole = explicitRole
        || ((listRole === 'tree' || listRole === 'group') ? 'treeitem' : 'listitem');
      if (!explicitRole) {
        this.updateAriaProperty('role', this._ariaRole);
      }
      this._updateRowDisclosureState();
      this._updateExpandableAria();
    },
  })
  .recompose(({
    html,
    refs: {
      divider,
      trailing,
    },
  }) => {
    trailing.before(html`<mdw-icon mdw-if={showExpandableIcon} id=expand-icon aria-hidden=true icon=expand_more></mdw-icon>`);
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

    :host([expandable]) #row {
      cursor: pointer;
    }

    :host([expanded]) {
      background-color: rgb(var(--mdw-color__surface-container-highest));
    }

    #expand-icon {
      color: var(--mdw-color__on-surface-variant);

      font-size: 24px;

      transition: transform 200ms;
    }

    :host([expanded]) #expand-icon {
      transform: rotate(180deg);
    }

    #expansion {
      grid-area: 2 / 1;
    }

    #expansion-slot::slotted(mdw-list) {
      padding-block-start: 0;
      padding-inline-start: 40px;
    }

    @media (prefers-reduced-motion: reduce) {
      #expand-icon {
        transition-duration: 0ms;
      }
    }
  `
  .events({
    click(event) {
      const targetsExpansion = eventTargetsExpansion(this, event);
      if (this._ariaRole === 'treeitem'
        && this.href == null
        && !this.disabledState
        && !targetsExpansion) {
        this.focus();
      }
      if (!this._expandable) return;
      if (this.href != null) return;
      if (this.disabledState) return;
      if (targetsExpansion) return;
      this.toggleExpanded();
      event.stopPropagation();
      event.preventDefault();
    },
    keydown(event) {
      if (!this._expandable) return;
      if (this.href != null) return;
      if (this.disabledState) return;
      if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
      if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') return;
      if (eventTargetsExpansion(this, event)) return;
      this.toggleExpanded();
      event.stopPropagation();
      event.preventDefault();
    },
  })
  .on({
    hrefChanged() {
      this._updateRowDisclosureState();
    },
    _expandableChanged() {
      this._updateRowDisclosureState();
    },
    disabledStateChanged() {
      this._updateRowDisclosureState();
    },
  })
  .autoRegister('mdw-list-item');
