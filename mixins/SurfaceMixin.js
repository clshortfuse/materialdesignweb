/**
 * @param {ReturnType<import('./StateMixin.js').default> & ReturnType<import('./ThemableMixin.js').default>} Base
 */
export default function SurfaceMixin(Base) {
  return Base
    .extend()
    .observe({
      elevated: 'boolean',
      elevation: 'integer',
      _raised: {
        type: 'boolean',
        get({ hoveredState, pressedState }) {
          return hoveredState && !pressedState;
        },
      },
    })
    .expressions({
      showSurfaceTint({ elevated, elevation, disabledState, color }) {
        return (elevated || elevation !== null)
          && !disabledState
          && (!color || color.includes('surface'));
      },
    })
    .html/* html */`
      <div id=surface class=surface raised={_raised} disabled={disabledState} color={color}>
        <div _if={showSurfaceTint} id=surface-tint class=surface-tint raised={_raised} color={color} aria-hidden=true></div>
      </div>
    `
    .css`
      :host {

        /** Filter blur is 1/2 CSS blur */
      
        /** Reference Properties */
        /*
        --mdw-surface__box-shadow__1__umbra: 0px 1px 2px 0px rgba(var(--mdw-color__shadow), 0.30);
        --mdw-surface__box-shadow__2__umbra: 0px 1px 2px 0px rgba(var(--mdw-color__shadow), 0.30);
        --mdw-surface__box-shadow__3__umbra: 0px 1px 3px 0px rgba(var(--mdw-color__shadow), 0.30);
        --mdw-surface__box-shadow__4__umbra: 0px 2px 3px 0px rgba(var(--mdw-color__shadow), 0.30);
        --mdw-surface__box-shadow__5__umbra: 0px 4px 4px 0px rgba(var(--mdw-color__shadow), 0.30);
      
        --mdw-surface__filter__0__umbra: drop-shadow(0px 1px 1px rgba(var(--mdw-color__shadow), 0));
        --mdw-surface__filter__1__umbra: drop-shadow(0px 1px 1px rgba(var(--mdw-color__shadow), 0.30));
        --mdw-surface__filter__2__umbra: drop-shadow(0px 1px 1px rgba(var(--mdw-color__shadow), 0.30));
        --mdw-surface__filter__3__umbra: drop-shadow(0px 1px 1.5px rgba(var(--mdw-color__shadow), 0.30));
        --mdw-surface__filter__4__umbra: drop-shadow(0px 2px 1.5px rgba(var(--mdw-color__shadow), 0.30));
        --mdw-surface__filter__5__umbra: drop-shadow(0px 4px 2px rgba(var(--mdw-color__shadow), 0.30));
      
        --mdw-surface__box-shadow__1__penumbra: 0px 1px 3px 1px  rgba(var(--mdw-color__shadow), 0.15);
        --mdw-surface__box-shadow__2__penumbra: 0px 2px 6px 2px  rgba(var(--mdw-color__shadow), 0.15);
        --mdw-surface__box-shadow__3__penumbra: 0px 4px 8px 3px  rgba(var(--mdw-color__shadow), 0.15);
        --mdw-surface__box-shadow__4__penumbra: 0px 6px 10px 4px rgba(var(--mdw-color__shadow), 0.15);
        --mdw-surface__box-shadow__5__penumbra: 0px 8px 12px 6px rgba(var(--mdw-color__shadow), 0.15);
      
        --mdw-surface__filter__0__penumbra: drop-shadow(0px 1px 2.5px rgba(var(--mdw-color__shadow), 0));
        --mdw-surface__filter__1__penumbra: drop-shadow(0px 1px 2.5px rgba(var(--mdw-color__shadow), 0.25));
        --mdw-surface__filter__2__penumbra: drop-shadow(0px 2px 5px rgba(var(--mdw-color__shadow), 0.25));
        --mdw-surface__filter__3__penumbra: drop-shadow(0px 4px 7px rgba(var(--mdw-color__shadow), 0.263));
        --mdw-surface__filter__4__penumbra: drop-shadow(0px 6px 9px rgba(var(--mdw-color__shadow), 0.27));
        --mdw-surface__filter__5__penumbra: drop-shadow(0px 8px 12px rgba(var(--mdw-color__shadow), 0.30));
      
        --mdw-surface__filter__0: var(--mdw-surface__shadow__0__umbra) var(--mdw-surface__shadow__0__penumbra);
        --mdw-surface__filter__1: var(--mdw-surface__shadow__1__umbra) var(--mdw-surface__shadow__1__penumbra);
        --mdw-surface__filter__2: var(--mdw-surface__shadow__2__umbra) var(--mdw-surface__shadow__2__penumbra);
        --mdw-surface__filter__3: var(--mdw-surface__shadow__3__umbra) var(--mdw-surface__shadow__3__penumbra);
        --mdw-surface__filter__4: var(--mdw-surface__shadow__4__umbra) var(--mdw-surface__shadow__4__penumbra);
        --mdw-surface__filter__5: var(--mdw-surface__shadow__5__umbra) var(--mdw-surface__shadow__5__penumbra);
        */
      
        /** Flatten for performance */
        --mdw-surface__shadow__0: drop-shadow(0px 1px 001px rgba(0,0,0,000)) drop-shadow(0px 1px 2.5px rgba(0,0,0,00000));
        --mdw-surface__shadow__1: drop-shadow(0px 1px 001px rgba(0,0,0,0.3)) drop-shadow(0px 1px 2.5px rgba(0,0,0,0.250));
        --mdw-surface__shadow__2: drop-shadow(0px 1px 001px rgba(0,0,0,0.3)) drop-shadow(0px 2px 005px rgba(0,0,0,0.250));
        --mdw-surface__shadow__3: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.3)) drop-shadow(0px 4px 007px rgba(0,0,0,0.263));
        --mdw-surface__shadow__4: drop-shadow(0px 2px 1.5px rgba(0,0,0,0.3)) drop-shadow(0px 6px 009px rgba(0,0,0,0.270));
        --mdw-surface__shadow__5: drop-shadow(0px 4px 2.0px rgba(0,0,0,0.3)) drop-shadow(0px 8px 012px rgba(0,0,0,0.300));
      
        --mdw-surface__tint__1: 0.05;
        --mdw-surface__tint__2: 0.08;
        --mdw-surface__tint__3: 0.11;
        --mdw-surface__tint__4: 0.12;
        --mdw-surface__tint__5: 0.14;
      
        /** Configurables */
      
        --mdw-surface__shadow__resting: none;
        --mdw-surface__shadow: var(--mdw-surface__shadow__resting);
        --mdw-surface__tint: 0;
        --mdw-surface__tint__raised: 0;
        z-index: 0;
      }
      
      :host([elevation="0"]) {
        --mdw-surface__tint: 0;
        --mdw-surface__shadow__resting: none;
      }
      
      :host([elevation="1"]) {
        --mdw-surface__tint: var(--mdw-surface__tint__1);
        --mdw-surface__shadow__resting: var(--mdw-surface__shadow__1);
      }
      
      :host([elevation="2"]) {
        --mdw-surface__tint: var(--mdw-surface__tint__2);
        --mdw-surface__shadow__resting: var(--mdw-surface__shadow__2);
      }
      
      :host([elevation="3"]) {
        --mdw-surface__tint: var(--mdw-surface__tint__3);
        --mdw-surface__shadow__resting: var(--mdw-surface__shadow__3);
      }
      
      :host([elevation="4"]) {
        --mdw-surface__tint: var(--mdw-surface__tint__4);
        --mdw-surface__shadow__resting: var(--mdw-surface__shadow__4);
      }
      
      :host([elevation="5"]) {
        --mdw-surface__tint: var(--mdw-surface__tint__5);
        --mdw-surface__shadow__resting: var(--mdw-surface__shadow__5);
      }
      
      :host([elevation]) {
        --mdw-surface__tint__raised: var(--mdw-surface__tint);
        --mdw-surface__shadow__raised: var(--mdw-surface__shadow__resting);
      }
      
      .surface {
        position: absolute;
        inset: 0;
      
        pointer-events: none;
      
        filter: var(--mdw-surface__shadow);
        z-index: -1;
      
        transition-delay: 1ms;
        transition-duration: 200ms;
        transition-property: filter;
        transition-timing-function: linear;
        will-change: filter;
      }
      
      .surface[raised] {
        filter: var(--mdw-surface__shadow__raised, var(--mdw-surface__shadow__resting));
      }
      
      .surface[disabled] {
        filter:none;
      }
      
      .surface-tint {
        position: absolute;
        inset: 0;
      
        pointer-events: none;
      
        opacity: var(--mdw-surface__tint, 0);
      
        background-color: rgb(var(--mdw-color__primary));
        border-radius: inherit;
      
        transition-delay: 1ms;
        transition-duration: 200ms;
        transition-property: opacity;
        will-change: opacity;
      }
      
      .surface-tint[raised] {
        opacity: var(--mdw-surface__tint__raised, 0);
      }
      
      .surface-tint[pressed] {
        opacity: var(--mdw-surface__tint, 0);
      }
      
      .surface-tint[color]:not([color|="surface"]) {
        display: none;
      }    
    `;
}
