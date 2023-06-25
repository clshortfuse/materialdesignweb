import TopAppBar from './TopAppBar.js';

/* @implements {HTMLSelectElement} */
export default TopAppBar
  .extend()
  .undefine('headline')
  // .undefine('_headlineOpacity')
  .undefine('size')
  .undefine('_headlineStyle')
  .observe({
    placeholder: { type: 'string', empty: 'Search' },
    color: { empty: 'surface-container-high' },
    shapeStyle: { empty: 'full' },
    kbdNav: { empty: 'false' },
  })
  .define({
    /** @return {HTMLInputElement} */
    input() { return this.refs.input; },
    value: {
      get() { return this.refs.input.value; },
      set(value) {
        this.refs.input.value = value;
      },
    },
  })
  .html`
    <mdw-input id=input placeholder={placeholder} aria-label={placeholder}></mdw-input>
  `
  .css`
    :host {
      --mdw-bg: var(--mdw-color__surface-container-high);
      padding-block: 16px;
    }

    #surface {
      background-color: transparent;
    }

    #leading:not([slotted]),
    #trailing:not([slotted]) {
      display: none;
    }

    #shape {
      display: flex;
      align-items: center;
      gap: 16px;

      padding-inline: 16px;

      background-color: rgb(var(--mdw-bg));
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
  .recompose(({ refs: { companion, headline, input, surface } }) => {
    companion.remove();
    headline.replaceWith(input);
    surface.removeAttribute('aria-labelledby');
  })
  .autoRegister('mdw-search');
