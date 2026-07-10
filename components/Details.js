import './Icon.js';

import CustomElement from '../core/CustomElement.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import ExpandableMixin from '../mixins/ExpandableMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * Details provides a native-like disclosure primitive for custom expandable
 * content. The summary slot is the disclosure control; default children are the
 * expansion content.
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(DelegatesFocusMixin)
  .mixin(ExpandableMixin)
  .set({
    /** Whether `open` is waiting for expansion content to exist. */
    _detailsOpenPendingExpansion: false,
  })
  .observe({
    /** Native-like alias for `expanded`. */
    open: 'boolean',

    /** Name of a mutually-exclusive details group. */
    name: 'string',

    /** Fallback summary text shown when the `summary` slot is empty. */
    summary: { type: 'string', empty: 'Details' },

    /** Marker icon shown when collapsed. */
    icon: { empty: 'expand_more' },

    /** Marker icon shown when expanded. */
    iconExpanded: { empty: 'expand_more' },
  })
  .overrides({
    getExpandableAriaElement() {
      return this.refs.summary;
    },
  })
  .expressions({
    _markerIcon({ expanded, icon, iconExpanded }) {
      return expanded ? iconExpanded : icon;
    },
    _markerRotating({ icon, iconExpanded }) {
      return icon === 'expand_more' && iconExpanded === 'expand_more';
    },
  })
  .methods({
    /** @type {HTMLElement['focus']} */
    focus(...args) {
      this.refs.summary.focus(...args);
    },
    _closeOtherNamedDetails() {
      const { name } = this;
      if (!this.open || !name) return;
      const root = /** @type {Document|DocumentFragment} */ (this.getRootNode());
      for (const details of root.querySelectorAll(`mdw-details[name=${CSS.escape(name)}]`)) {
        const detailsElement = /** @type {HTMLElement & { open: boolean }} */ (details);
        if (detailsElement === this) continue;
        if (!detailsElement.open) continue;
        detailsElement.open = false;
      }
    },
  })
  .html`
    <div id=summary role=button tabindex=0 aria-controls=expansion>
      <slot id=summary-slot name=summary>{summary}</slot>
      <mdw-icon id=marker aria-hidden=true icon={_markerIcon} rotating={_markerRotating} expanded={expanded}></mdw-icon>
    </div>
    <div id=expansion>
      <slot id=expansion-slot></slot>
    </div>
  `
  .css`
    :host {
      display: block;

      color: inherit;
      font: inherit;
      letter-spacing: inherit;
    }

    #summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;

      box-sizing: border-box;
      inline-size: 100%;
      min-inline-size: 0;
      padding: 16px;

      color: inherit;
      cursor: pointer;
      font: inherit;
      letter-spacing: inherit;
      text-align: start;
    }

    :host(:where([color])) #summary {
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    }

    :host(:where([ink])) #summary {
      color: rgb(var(--mdw-ink));
    }

    :host(:where([type-style])) #summary {
      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);
    }

    #summary-slot {
      flex: 1;
      min-inline-size: 0;
    }

    #summary-slot::slotted(*) {
      inline-size: 100%;
      min-inline-size: 0;
    }

    #marker {
      flex: none;

      font-size: 24px;
    }

    #marker[rotating] {
      transform: rotate(0deg);

      transition-duration: var(--mdw-expand__duration, 200ms);
      transition-property: transform;
      transition-timing-function: var(--mdw-expand__easing, ease);
      will-change: transform;
    }

    #marker[rotating][expanded] {
      transform: rotate(180deg);
    }

    @media (prefers-reduced-motion: reduce) {
      #marker[rotating] {
        transition-duration: 0ms;
      }
    }
  `
  .childEvents({
    summary: {
      click() {
        this.toggleExpanded();
      },
      keydown(event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        this.toggleExpanded();
      },
    },
  })
  .on({
    connected() {
      if (this.open === this.expanded) return;
      if (this.open) {
        this.expanded = true;
      } else {
        this.open = this.expanded;
      }
    },
    openChanged() {
      if (this.open) {
        this._closeOtherNamedDetails();
      } else {
        this._detailsOpenPendingExpansion = false;
      }
      if (this.expanded === this.open) return;
      this.expanded = this.open;
    },
    nameChanged() {
      this._closeOtherNamedDetails();
    },
    expandedChanged() {
      if (this.open && !this.expanded && !this._expandable) {
        this._detailsOpenPendingExpansion = true;
        return;
      }
      this._detailsOpenPendingExpansion = false;
      if (this.open === this.expanded) return;
      this.open = this.expanded;
    },
    _expandableChanged() {
      if (!this._expandable) return;
      if (!this.open) return;
      if (!this._detailsOpenPendingExpansion) return;
      this._detailsOpenPendingExpansion = false;
      if (this.expanded) return;
      this.expanded = true;
    },
  })
  .autoRegister('mdw-details');
