/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function TouchTargetMixin(Base) {
  return Base
    .extend()
    .html`<div id=touch-target class=touch-target></div>`
    .css`
        /* stylelint-disable liberty/use-logical-spec */
      .touch-target {
        position: absolute;
        top: 50%;
        left: 50%;
        /* --mdw-device-pixel-ratio: 1; */
      
        block-size: 100%;
        min-block-size: 48px;
        /* min-block-size: 10mm; */
        /* min-block-size: calc(0.393701in / var(--mdw-device-pixel-ratio, 1)); */
        inline-size:100%;
        min-inline-size: 48px;
        /* min-inline-size: 10mm; */
        /* min-inline-size: calc(0.393701in / var(--mdw-device-pixel-ratio, 1)); */
      
        cursor: inherit;
      
        /* box-sizing: border-box; */
        /* border: solid 1px magenta; */
        pointer-events: auto;
      
        transform: translateX(-50%) translateY(-50%);
        visibility: visible;
        z-index: 1;
      
        border-radius: inherit;
      }
    `;
}
