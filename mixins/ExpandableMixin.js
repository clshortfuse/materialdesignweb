/**
 * @param {HTMLElement & {refs: Record<string, Element>}} element
 * @return {HTMLSlotElement|null}
 */
function getExpansionSlotElement(element) {
  const slot = element.refs.expansionSlot;
  if (!(slot instanceof HTMLSlotElement)) return null;
  return slot;
}

/**
 * @param {HTMLElement & {refs: Record<string, Element>}} element
 * @return {HTMLElement[]}
 */
function getExpansionElements(element) {
  const slot = getExpansionSlotElement(element);
  if (!slot) return [];
  /** @type {HTMLElement[]} */
  const elements = [];
  for (const child of slot.assignedElements({ flatten: true })) {
    if (child instanceof HTMLElement) {
      elements.push(child);
    }
  }
  return elements;
}

/**
 * Text nodes cannot be made inert directly, but default-slot text still counts
 * as expansion content for native-like details behavior.
 * @param {Node} node
 * @return {boolean}
 */
function isExpansionTextNode(node) {
  return node.nodeType === Node.TEXT_NODE && /\S/.test(node.textContent ?? '');
}

/**
 * @param {HTMLElement & {refs: Record<string, Element>}} element
 * @return {boolean}
 */
function hasExpansionContent(element) {
  const slot = getExpansionSlotElement(element);
  if (!slot) return false;
  for (const node of slot.assignedNodes({ flatten: true })) {
    if (node instanceof HTMLElement) return true;
    if (isExpansionTextNode(node)) return true;
  }
  return false;
}

/**
 * Adds shared expansion slot behavior.
 *
 * Components using this mixin should provide a wrapper with `id="expansion"`
 * containing a slot with `id="expansion-slot"`. Consumers may use either a
 * named or default slot. The expansion wrapper must stay rendered so
 * `slotchange` can detect expansion content changes.
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ExpandableMixin(Base) {
  return Base
    .set({
      /** @type {Map<HTMLElement, { inert: boolean, ariaHidden: string|null }>|null} */
      _collapsedExpansionStates: null,

      /** @type {Element|null} */
      _lastExpandableAriaElement: null,

      /** @type {ReturnType<typeof setTimeout>|null} */
      _expandableConnectTimeout: null,
    })
    .observe({
      /** Whether expansion content is visible. */
      expanded: 'boolean',

      /** Internal flag set when this element has expansion slot content. */
      _expandable: { type: 'boolean', attr: 'expandable' },
    })
    .methods({
      /** @return {Element|null} */
      getExpandableAriaElement() { return this; },

      /** @return {boolean} */
      canCollapseExpansion() { return true; },

      /** @return {boolean} */
      shouldAutoExpandExpansion() { return false; },

      /** @return {void} */
      _updateExpandableAria() {
        const collapsed = this._expandable && !this.expanded;
        const expansion = this.refs.expansion;
        if (expansion instanceof HTMLElement) {
          expansion.inert = collapsed;
          if (collapsed) {
            expansion.setAttribute('aria-hidden', 'true');
          } else {
            expansion.removeAttribute('aria-hidden');
          }
        }
        const elements = getExpansionElements(this);
        const elementSet = new Set(elements);
        for (const [element, state] of this._collapsedExpansionStates ?? []) {
          if (collapsed && elementSet.has(element)) continue;
          element.inert = state.inert;
          if (state.ariaHidden == null) {
            element.removeAttribute('aria-hidden');
          } else {
            element.setAttribute('aria-hidden', state.ariaHidden);
          }
          this._collapsedExpansionStates.delete(element);
        }

        if (collapsed) {
          this._collapsedExpansionStates ??= new Map();
          for (const element of elements) {
            if (!this._collapsedExpansionStates.has(element)) {
              this._collapsedExpansionStates.set(element, {
                inert: element.inert,
                ariaHidden: element.getAttribute('aria-hidden'),
              });
            }
            element.inert = true;
            element.setAttribute('aria-hidden', 'true');
          }
        }

        const target = this.getExpandableAriaElement();
        if (this._lastExpandableAriaElement && this._lastExpandableAriaElement !== target) {
          this._lastExpandableAriaElement.removeAttribute('aria-expanded');
        }
        this._lastExpandableAriaElement = target;
        if (!target) return;
        if (this._expandable) {
          target.setAttribute('aria-expanded', this.expanded ? 'true' : 'false');
        } else {
          target.removeAttribute('aria-expanded');
        }
      },

      /** Restore assigned elements changed while the expansion was collapsed. */
      _restoreCollapsedExpansionStates() {
        if (!this._collapsedExpansionStates) return;
        for (const [element, state] of this._collapsedExpansionStates) {
          element.inert = state.inert;
          if (state.ariaHidden == null) {
            element.removeAttribute('aria-hidden');
          } else {
            element.setAttribute('aria-hidden', state.ariaHidden);
          }
        }
        this._collapsedExpansionStates = null;
      },

      /**
       * Re-evaluate expansion slot children.
       * @return {void}
       */
      _refreshExpandableState() {
        this._expandable = hasExpansionContent(this);
        if (!this._expandable) {
          this.expanded = false;
        }
        if (this._expandable && this.shouldAutoExpandExpansion()) {
          this.expanded = true;
        }
        this._updateExpandableAria();
      },

      /**
       * @param {boolean} [force]
       * @return {void}
       */
      toggleExpanded(force = undefined) {
        if (!this._expandable) return;
        const expanded = force ?? !this.expanded;
        if (!expanded && !this.canCollapseExpansion()) return;
        this.expanded = expanded;
      },
    })
    .css`
      #expansion {
        display: grid;

        grid-template-rows: 0fr;
        overflow: clip;

        inline-size: 100%;

        opacity: 0;
        text-align: start;

        transition-duration: var(--mdw-expand__duration, 200ms);
        transition-property: grid-template-rows, opacity;
        transition-timing-function: var(--mdw-expand__easing, ease);
        will-change: grid-template-rows, opacity;
      }

      :host([expanded]) #expansion {
        grid-template-rows: 1fr;

        opacity: 1;
      }

      #expansion-slot {
        display: block;

        min-block-size: 0;
        overflow: clip;

        transform: translateY(var(--mdw-expand__translate-y, 0));

        transition-duration: var(--mdw-expand__duration, 200ms);
        transition-property: transform;
        transition-timing-function: var(--mdw-expand__easing, ease);
        will-change: transform;
      }

      :host([expanded]) #expansion-slot {
        transform: translateY(0);
      }

      #expansion-slot::slotted(*) {
        display: block;
      }

      @media (prefers-reduced-motion: reduce) {
        #expansion,
        #expansion-slot {
          transition-duration: 0ms;
        }
      }
    `
    .childEvents({
      expansionSlot: {
        slotchange() {
          this._refreshExpandableState();
        },
      },
    })
    .on({
      connected() {
        // Parser-created custom elements connect before their light-DOM
        // children are appended, and parsing may perform microtask checkpoints
        // between those tokens. Resolve in the next task so an authored
        // `expanded` value is not cleared early.
        clearTimeout(this._expandableConnectTimeout);
        this._expandableConnectTimeout = setTimeout(() => {
          this._expandableConnectTimeout = null;
          if (this.isConnected) {
            this._refreshExpandableState();
          }
        }, 0);
      },
      disconnected() {
        clearTimeout(this._expandableConnectTimeout);
        this._expandableConnectTimeout = null;
        this._restoreCollapsedExpansionStates();
      },
      expandedChanged() {
        this._updateExpandableAria();
        this.dispatchEvent(new Event(
          `${this.localName}:expandedchange`,
          { bubbles: true, composed: true },
        ));
      },
      _expandableChanged() {
        this._updateExpandableAria();
        this.dispatchEvent(new Event(
          `${this.localName}:expandablechange`,
          { bubbles: true, composed: true },
        ));
      },
    });
}
