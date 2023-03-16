import outlineStyles from '../components/Outline.css' assert { type: 'css' };

import styles from './ShapeMixin.css' assert { type: 'css' };

/**
 * @param {ReturnType<import('./StateMixin.js').default> & ReturnType<import('./ThemableMixin.js').default>} Base
 */
export default function ShapeMixin(Base) {
  return Base
    .extend()
    .observe({
      shapeTop: 'boolean',
      shapeBottom: 'boolean',
      shapeStart: 'boolean',
      shapeEnd: 'boolean',
      shapeStyle: 'string',
      outlined: 'boolean',
    })
    .css(
      outlineStyles,
      styles,
    )
    .html/* html */`
      <div id=shape part=shape class=shape elevated={elevated} shape-top={shapeTop} shape-bottom={shapeBottom} shape-start={shapeStart} shape-end={shapeEnd} shape-style={shapeStyle} color={color} outlined={outlined} disabled={disabledState}>
        <div id=outline _if={outlined} class=outline disabled={disabledState} focused={focusedState} pressed={pressedState} hovered={hoveredState}>
          <div id=outline-left class="outline-section outline-left"></div>
          <div id=outline-right class="outline-section outline-right"></div>
        </div>
      </div>
    `;
}
