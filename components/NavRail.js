import SideSheet from './SideSheet.js';

/**
 * Navigation rails provide access to app destinations and destinations-level
 * navigation in a vertical rail, suited for larger screens and desktop layouts.
 * @see https://m3.material.io/components/navigation-rail/specs
 */
export default SideSheet
  .extend()
  .observe({
    /** Horizontal alignment for rail content: 'start', 'center', or 'end'. */
    align: { value: /** @type {'start'|'center'|'end'} */ (null) },
    /** Viewport width (pixels) threshold at or above which the rail will auto-open. */
    autoOpen: {
      type: 'float',
      empty: 728,
    },
    /** Viewport width (pixels) threshold at or below which the rail will auto-close. */
    autoClose: {
      type: 'float',
      empty: 1248,
    },
    /** Viewport width (pixels) at which the rail becomes fixed (non-collapsible). */
    fixedBreakpoint: {
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
