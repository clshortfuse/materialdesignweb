/**
 * Adds CSS properties for elevation via shadows or underlighting.
 * @param {ReturnType<import('./StateMixin.js').default> & ReturnType<import('./ThemableMixin.js').default>} Base
 */
export default function ElevationMixin(Base) {
  return Base
    .css`:host {

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
      
        --mdw-elevation__filter__0__penumbra: drop-shadow(0px 1px 2.5px rgba(var(--mdw-color__shadow), 0));
        --mdw-elevation__filter__1__penumbra: drop-shadow(0px 1px 2.5px rgba(var(--mdw-color__shadow), 0.25));
        --mdw-elevation__filter__2__penumbra: drop-shadow(0px 2px 5px rgba(var(--mdw-color__shadow), 0.25));
        --mdw-elevation__filter__3__penumbra: drop-shadow(0px 4px 7px rgba(var(--mdw-color__shadow), 0.263));
        --mdw-elevation__filter__4__penumbra: drop-shadow(0px 6px 9px rgba(var(--mdw-color__shadow), 0.27));
        --mdw-elevation__filter__5__penumbra: drop-shadow(0px 8px 12px rgba(var(--mdw-color__shadow), 0.30));
      
        --mdw-elevation__filter__0: var(--mdw-surface__shadow__0__umbra) var(--mdw-surface__shadow__0__penumbra);
        --mdw-elevation__filter__1: var(--mdw-surface__shadow__1__umbra) var(--mdw-surface__shadow__1__penumbra);
        --mdw-elevation__filter__2: var(--mdw-surface__shadow__2__umbra) var(--mdw-surface__shadow__2__penumbra);
        --mdw-elevation__filter__3: var(--mdw-surface__shadow__3__umbra) var(--mdw-surface__shadow__3__penumbra);
        --mdw-elevation__filter__4: var(--mdw-surface__shadow__4__umbra) var(--mdw-surface__shadow__4__penumbra);
        --mdw-elevation__filter__5: var(--mdw-surface__shadow__5__umbra) var(--mdw-surface__shadow__5__penumbra);
        */

      --mdw-elevation__rgb: var(--mdw-color__shadow);

      --mdw-elevation__box-shadow__0: 0px 1px 1px 0px rgba(var(--mdw-elevation__rgb), 0.00), 0px 0px 1px 1px  rgba(var(--mdw-elevation__rgb), 0.00);
      --mdw-elevation__box-shadow__1: 0px 1px 2px 0px rgba(var(--mdw-elevation__rgb), 0.30), 0px 1px 3px 1px  rgba(var(--mdw-elevation__rgb), 0.15);
      --mdw-elevation__box-shadow__2: 0px 1px 2px 0px rgba(var(--mdw-elevation__rgb), 0.30), 0px 2px 6px 2px  rgba(var(--mdw-elevation__rgb), 0.15);
      --mdw-elevation__box-shadow__3: 0px 1px 3px 0px rgba(var(--mdw-elevation__rgb), 0.30), 0px 4px 8px 3px  rgba(var(--mdw-elevation__rgb), 0.15);
      --mdw-elevation__box-shadow__4: 0px 2px 3px 0px rgba(var(--mdw-elevation__rgb), 0.30), 0px 6px 10px 4px rgba(var(--mdw-elevation__rgb), 0.15);
      --mdw-elevation__box-shadow__5: 0px 4px 4px 0px rgba(var(--mdw-elevation__rgb), 0.30), 0px 8px 12px 6px rgba(var(--mdw-elevation__rgb), 0.15);

      --mdw-elevation__drop-shadow__0: drop-shadow(0px 1px 001px rgba(var(--mdw-elevation__rgb),000)) drop-shadow(0px 1px 2.5px rgba(var(--mdw-elevation__rgb),00000));
      --mdw-elevation__drop-shadow__1: drop-shadow(0px 1px 001px rgba(var(--mdw-elevation__rgb),0.3)) drop-shadow(0px 1px 2.5px rgba(var(--mdw-elevation__rgb),0.250));
      --mdw-elevation__drop-shadow__2: drop-shadow(0px 1px 001px rgba(var(--mdw-elevation__rgb),0.3)) drop-shadow(0px 2px 005px rgba(var(--mdw-elevation__rgb),0.250));
      --mdw-elevation__drop-shadow__3: drop-shadow(0px 1px 1.5px rgba(var(--mdw-elevation__rgb),0.3)) drop-shadow(0px 4px 007px rgba(var(--mdw-elevation__rgb),0.263));
      --mdw-elevation__drop-shadow__4: drop-shadow(0px 2px 1.5px rgba(var(--mdw-elevation__rgb),0.3)) drop-shadow(0px 6px 009px rgba(var(--mdw-elevation__rgb),0.270));
      --mdw-elevation__drop-shadow__5: drop-shadow(0px 4px 2.0px rgba(var(--mdw-elevation__rgb),0.3)) drop-shadow(0px 8px 012px rgba(var(--mdw-elevation__rgb),0.300));
    }`;
}
