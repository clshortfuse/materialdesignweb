import Nav from './Nav.js';

export default Nav
  .extend()
  .observe({
    align: { value: /** @type {'start'|'center'|'end'} */ (null) },
  })
  .recompose(({ html, refs: { slot } }) => {
    slot.before(html`<slot id=start name=start></slot>`);
    slot.setAttribute('align', '{align}');
  })
  .css`
    /* https://m3.material.io/components/navigation-rail/specs */

    :host{
      position: relative;
      
      inset-block-start: 0;
      inset-inline-start: 0;
      align-self: flex-start;

      display: grid;
      align-content: flex-start;
      flex-direction: column;
      gap:0;
      grid-template-rows: auto minmax(0,1fr);
      grid-template-columns: 100%;
      justify-items: stretch;

      min-block-size: 100vh;
      max-block-size: 100vh;
      min-inline-size: 80px;
      max-inline-size: 80px;

      text-align: center;
    }

    #start {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 12px;
    }

    #slot {
      align-self: center;

      display: flex;
      align-items: stretch;
      flex-direction: column;
      gap: 12px;
      overflow-x: clip;
      overflow-y: auto;

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
