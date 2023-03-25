import Nav from './Nav.js';

export default Nav
  .extend()
  .observe({
    align: { value: /** @type {'start'|'center'|'end'} */ (null) },
  })
  .on({
    composed({ html }) {
      const { slot } = this.refs;
      slot.before(html`<slot id=start name=start></slot>`);
      slot.setAttribute('align', '{align}');
    },
  })
  .css`
    /* https://m3.material.io/components/navigation-rail/specs */

    :host{
      display: grid;
      align-content: flex-start;
      flex-direction: column;
      grid-template-rows: auto minmax(0,1fr);
      grid-template-columns: 80px;
      justify-items: stretch;

      text-align: center;
    }

    #start {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 12px;

      padding-block-start: 12px;

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

      inline-size: 100%;

      padding-block: 12px;
    }

    #slot[align="start"] {
      align-self: flex-start;
    }

    #slot[align="end"] {
      align-self: flex-end;
    }

  `
  .autoRegister('mdw-nav-rail');
