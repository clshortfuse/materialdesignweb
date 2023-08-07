import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';

/**
 * Displays elevation via shadows or underlighting.
 * Uses `filter:drop-shadow` to display elevation.
 * @param {ReturnType<import('./StateMixin.js').default> & ReturnType<import('./ThemableMixin.js').default>} Base
 */
export default function ElevationMixin(Base) {
  return Base
    .observe({
      elevation: 'integer',
      elevationRaised: 'integer',
      _secondaryFilter: 'string',
      _raised: {
        type: 'boolean',
        get({ hoveredState, pressedState, disabledState }) {
          return !disabledState && hoveredState && !pressedState;
        },
      },
    })
    .observe({
      _elevation: ({ elevation }) => elevation,
      _elevationRaised: ({ elevationRaised }) => elevationRaised,
    })
    .observe({
      _computedElevation({ _elevation, _elevationRaised, hoveredState, pressedState, disabledState }) {
        if (disabledState) return null;
        if (hoveredState && !pressedState) return _elevationRaised ?? _elevation;
        return _elevation;
      },
    })
    .observe({
      _shadowFilter({ _computedElevation }) {
        switch (_computedElevation) {
          case 0: return 'drop-shadow(0px 1px 001px rgba(var(--mdw-elevation__rgb),000)) drop-shadow(0px 1px 2.5px rgba(var(--mdw-elevation__rgb),00000))';
          case 1: return 'drop-shadow(0px 1px 001px rgba(var(--mdw-elevation__rgb),0.3)) drop-shadow(0px 1px 2.5px rgba(var(--mdw-elevation__rgb),0.250))';
          case 2: return 'drop-shadow(0px 1px 001px rgba(var(--mdw-elevation__rgb),0.3)) drop-shadow(0px 2px 005px rgba(var(--mdw-elevation__rgb),0.250))';
          case 3: return 'drop-shadow(0px 1px 1.5px rgba(var(--mdw-elevation__rgb),0.3)) drop-shadow(0px 4px 007px rgba(var(--mdw-elevation__rgb),0.263))';
          case 4: return 'drop-shadow(0px 2px 1.5px rgba(var(--mdw-elevation__rgb),0.3)) drop-shadow(0px 6px 009px rgba(var(--mdw-elevation__rgb),0.270))';
          case 5: return 'drop-shadow(0px 4px 2.0px rgba(var(--mdw-elevation__rgb),0.3)) drop-shadow(0px 8px 012px rgba(var(--mdw-elevation__rgb),0.300))';
          default:
            return '';
        }
      },
    })
    .observe({
      _elevatedStyle: {
        ...ELEMENT_STYLER_TYPE,
        get({ _shadowFilter, _secondaryFilter }) {
          // Don't animate if no filter
          if (!_shadowFilter && !_secondaryFilter) return null;
          return {
            styles: {
              filter: [_shadowFilter, _secondaryFilter].filter(Boolean).join(' '),
            },
            timing: {
              duration: 200,
            },
          };
        },
      },
    })
    .css`:host { --mdw-elevation__rgb: var(--mdw-color__shadow); }`;
}
