import ExpandableMixin from '../mixins/ExpandableMixin.js';

import NavItem from './NavItem.js';

/**
 * @param {HTMLElement} element
 * @return {boolean}
 */
function hasActiveExpansion(element) {
  for (const child of element.children) {
    if (!(child instanceof HTMLElement)) continue;
    if (child.slot !== 'expansion') continue;
    if (child.matches('mdw-nav-drawer-item[active]')) return true;
    if (child.querySelector('mdw-nav-drawer-item[active]')) return true;
  }
  return false;
}

/**
 * A navigation drawer item represents a destination inside a navigation drawer,
 * showing an icon, label, and optional badge to help users navigate app sections.
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export default NavItem
  .extend()
  .mixin(ExpandableMixin)
  .overrides({
    getExpandableAriaElement() {
      if (this.href != null) return null;
      return this.refs.anchor;
    },

    canCollapseExpansion() {
      return !hasActiveExpansion(this);
    },

    shouldAutoExpandExpansion() {
      return hasActiveExpansion(this);
    },
  })
  .expressions({
    _anchorHref({ _expandable, href }) {
      if (_expandable && href == null) return null;
      return href ?? '#';
    },
    _anchorRole({ _expandable, href }) {
      return _expandable && href == null ? 'button' : null;
    },
    _anchorTabIndex({ _expandable, href }) {
      return _expandable && href == null ? '0' : null;
    },
    _anchorAriaControls({ _expandable, href }) {
      return _expandable && href == null ? 'expansion' : null;
    },
  })
  .css`
    /* https://m3.material.io/components/navigation-bar/specs */
    /* https://m3.material.io/components/navigation-drawer/specs */
    /* https://m3.material.io/components/navigation-rail/specs */

    :host {
      align-self: stretch;

      display: block;

      min-block-size: 56px;
    }

    #row {
      position: relative;

      display: grid;
      align-items: center;
      gap: 12px;
      grid-template:
        "icon label badge" minmax(56px, min-content)
        / 24px 1fr minmax(0, min-content);
      justify-items: flex-start;

      min-block-size: 56px;
      inline-size: 100%;

      box-sizing: border-box;
      padding-inline: 16px 24px;
    }

    :host([expandable]) #row {
      grid-template:
        "icon label badge expand" minmax(56px, min-content)
        / 24px 1fr minmax(0, min-content) 24px;
    }

    #icon {
      grid-area: icon;
    }

    #slot {
      display: block;

      grid-area: label;

      overflow: hidden;
      text-align: start;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([active]) {
      color: rgb(var(--mdw-ink));
    }

    #shape {
      max-inline-size: none;
      grid-column: auto;
      grid-row: 1 / 2;
    }

    #badge-text {
      grid-area: badge;

      z-index: 3;
    }

    #expand-icon {
      grid-area: expand;

      color: rgb(var(--mdw-color__on-surface-variant));

      font-size: 24px;

      transform: rotate(0deg);
      z-index: 3;

      transition: transform 200ms;
    }

    :host([expanded]) #expand-icon {
      transform: rotate(180deg);
    }

    @media (prefers-reduced-motion: reduce) {
      #expand-icon {
        transition-duration: 0ms;
      }
    }
  `
  .recompose(({
    html,
    refs: {
      anchor,
      badge,
      icon,
      shape,
      slot,
    },
  }) => {
    anchor.setAttribute('aria-describedby', 'badge-text');
    anchor.setAttribute('aria-controls', '{_anchorAriaControls}');
    anchor.setAttribute('role', '{_anchorRole}');
    anchor.setAttribute('tabindex', '{_anchorTabIndex}');
    badge.before(html`
      <div id=row>
        ${shape}
        ${anchor}
        ${icon}
        ${slot}
        <span id=badge-text>{badge}</span>
        <mdw-icon id=expand-icon mdw-if={_expandable} aria-hidden=true icon=expand_more></mdw-icon>
      </div>
      <div id=expansion>
        <slot id=expansion-slot name=expansion></slot>
      </div>
    `);
    badge.remove();
  })
  .childEvents({
    anchor: {
      click(event) {
        if (!this._expandable) return;
        if (this.href != null) return;
        this.toggleExpanded();
        event.stopPropagation();
        event.preventDefault();
      },
      keydown(event) {
        if (!this._expandable) return;
        if (this.href != null) return;
        if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
        if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') return;
        this.toggleExpanded();
        event.stopPropagation();
        event.preventDefault();
      },
    },
  })
  .events({
    'mdw-nav-drawer-item:activechange'(event) {
      if (event.target === this) return;
      if (!this._expandable) return;
      this._refreshExpandableState();
    },
  })
  .on({
    activeChanged() {
      this.dispatchEvent(new Event(
        'mdw-nav-drawer-item:activechange',
        { bubbles: true, composed: true },
      ));
    },
  })
  .autoRegister('mdw-nav-drawer-item');
