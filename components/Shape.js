import Box from './Box.js';
import outlineStyles from './Outline.css' assert { type: 'css' };
import styles from './Shape.css' assert { type: 'css' };

export default Box
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
    <div id=outline _if={outlined} class=outline disabled={disabledState} focused={focusedState} pressed={pressedState} hovered={hoveredState}>
      <div id=outline-left class="outline-section outline-left"></div>
      <div id=outline-right class="outline-section outline-right"></div>
    </div>
  `
  .autoRegister('mdw-shape');
