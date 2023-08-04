import SideSheet from './SideSheet.js';

export default SideSheet
  .extend()
  .observe({
    align: { value: /** @type {'start'|'center'|'end'} */ (null) },
    autoOpen: {
      type: 'float',
      empty: 728,
    },
    autoClose: {
      type: 'float',
      empty: 1248,
    },
    modalBreakpoint: {
      type: 'float',
      empty: 728,
    },
  })
  .recompose(({ html, refs: { slot } }) => {
    slot.before(html`<slot id=start name=start></slot>`);
    slot.setAttribute('align', '{align}');
  })
  .css`
    /* https://m3.material.io/components/navigation-rail/specs */

    :host{
      align-self: flex-start;

      display: inline-grid;
      align-content: flex-start;
      flex-direction: column;
      gap:0;
      grid-template-rows: auto minmax(auto,1fr);
      grid-template-columns: 100%;
      justify-items: stretch;
      overscroll-behavior: none;
      overscroll-behavior: contain;

      min-block-size: 0;

      text-align: center;
    }

    #start {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 12px;
      justify-content: center;
    }

    #slot {
      align-self: center;

      display: flex;
      align-items: stretch;
      flex-direction: column;
      gap: 12px;

      box-sizing: border-box;
      max-block-size: 100%;
      inline-size: min-content;

    }

    #slot[align="start"] {
      align-self: flex-start;
    }

    #slot[align="end"] {
      align-self: flex-end;
    }
  `
  .autoRegister('mdw-nav-rail');
