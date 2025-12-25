import TopAppBar from './TopAppBar.js';

/**
 * Search provides an app bar integrated search field for querying content.
 * implements {HTMLSelectElement}
 * @see https://m3.material.io/components/search/overview
 */
export default TopAppBar
  .extend()
  .undefine('headline')
  // .undefine('_headlineOpacity')
  .undefine('size')
  .undefine('_headlineStyle')
  .observe({
    /** Placeholder text shown in the search input. */
    placeholder: { type: 'string', empty: 'Search' },
    /** Visual color token to apply to the search surface. */
    color: { empty: 'surface-container-high' },
    /** Shape style token to apply (e.g. 'full', 'none'). */
    shapeStyle: { empty: 'full' },
    /** Enable keyboard navigation mode for search results when true. */
    kbdNav: { empty: 'false' },
  })
  .define({
    /** Returns the current text value of the internal input. */
    input() {
      return /** @type {HTMLInputElement} */ (this.refs.input).value;
    },
    /** The `value` accessor proxies the internal input's value. */
    value: {
      get() {
        return /** @type {HTMLInputElement} */ (this.refs.input).value;
      },
      set(value) {
        /** @type {HTMLInputElement} */ (this.refs.input).value = value;
      },
    },
  })
  .html`
    <mdw-input id=input placeholder={placeholder} aria-label={placeholder}></mdw-input>
  `
  .css`
    :host {
      --mdw-bg: var(--mdw-color__surface-container-high);
      --mdw-shape__size: var(--mdw-shape__full);
      inset-block-start: 8px;

      display: flex;
      align-items: center;
      gap: 16px;

      margin-block: 16px;

      padding-inline: 16px;

      background-color: rgb(var(--mdw-bg));
    }

    #leading:not([slotted]),
    #trailing:not([slotted]) {
      display: none;
    }

    #input {
      --mdw-state__hovered-opacity: 0;
      flex: 1;
    }
  `
  .methods({
    /** @param {{currentTarget:HTMLSlotElement}} event */
    onSlotChange({ currentTarget }) {
      currentTarget.toggleAttribute('slotted', currentTarget.assignedNodes().length >= 0);
    },
  })
  .childEvents({
    leading: { slotchange: 'onSlotChange' },
    trailing: { slotchange: 'onSlotChange' },
    input: {
      change(event) {
        // Change events are not composed. Rethrow.
        event.stopPropagation();
        this.dispatchEvent(new Event('change', { bubbles: true }));
      },
    },
  })
  .recompose(({ refs: { companion, headline, input } }) => {
    companion.remove();
    headline.replaceWith(input);
  })
  .autoRegister('mdw-search');
