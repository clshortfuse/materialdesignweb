import CustomElement from '../core/CustomElement.js';

/**
 * A scrim can bring focus to specific elements by increasing the visual contrast of a large layered surface.
 * Use the scrim beneath elements like modals and expanded navigation menus.
 * @see https://m3.material.io/styles/elevation/applying-elevation
 */
export default CustomElement
  .extend()
  .observe({
    /** When true the scrim is hidden and will be removed after its fade-out animation. */
    hidden: 'boolean',
  })
  .html`<div id=scroll-blocker></div>`
  .css`
    :host {
      position: fixed;
      inset: 0;

      display: block;
      overflow: overlay;

      overscroll-behavior: none;
      overscroll-behavior: contain;
      scrollbar-color: transparent transparent;
      scrollbar-width: none;

      cursor: pointer;

      outline: none; /* Older Chromium Builds */
      
      -webkit-tap-highlight-color: transparent;

      opacity: 0;

      z-index: 23;

      background-color: rgb(var(--mdw-color__scrim));
      
      animation: fade-in 200ms forwards ease-out;
      will-change: opacity;
    }

    :host::-webkit-scrollbar {
      display: none;
    }

    :host([hidden]) {
      animation-name: fade-out;
      animation-timing-function: ease-in;
    }

    :host([invisible]) {
      background: transparent;
    }

    #scroll-blocker {
      position: absolute;
      inset-block-start: 0;
      inset-inline-start: 0;

      display: block;

      block-size: 200%;
      inline-size: 200%;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }

      to {
        opacity: 0.38;
      }
    }

    @keyframes fade-out {
      from {
        opacity: 0.38;
      }

      to {
        opacity: 0;
      }
    }
  `
  .events({
    animationend() {
      if (this.hidden) {
        this.remove();
      }
    },
  })
  .autoRegister('mdw-scrim');
