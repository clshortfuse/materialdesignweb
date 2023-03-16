import styles from './SurfaceMixin.css' assert { type: 'css' };

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
    .css(styles)
    .html/* html */`
      <div id=surface class=surface raised={_raised} disabled={disabledState} color={color}>
        <div _if={showSurfaceTint} id=surface-tint class=surface-tint raised={_raised} color={color} aria-hidden=true></div>
      </div>
    `;
}
