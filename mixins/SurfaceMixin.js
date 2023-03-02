import elevationStyles from '../components/Elevation.css' assert { type: 'css' };
import outlineStyles from '../components/Outline.css' assert { type: 'css' };
import shapeStyles from '../components/Shape.css' assert { type: 'css' };

import styles from './SurfaceMixin.css' assert { type: 'css' };

/**
 * @param {ReturnType<import('./StateMixin.js').default> & ReturnType<import('./ThemableMixin.js').default>} Base
 */
export default function SurfaceMixin(Base) {
  return Base
    .extend()
    .observe({
      shapeTop: 'boolean',
      shapeBottom: 'boolean',
      shapeStart: 'boolean',
      shapeEnd: 'boolean',
      shapeStyle: 'string',
      outlined: 'boolean',
      elevated: 'boolean',
      elevation: 'integer',
    })
    .expressions({
      showElevation({ elevated, elevation, disabledState, color }) {
        return (elevated || elevation !== null)
          && !disabledState
          && (!color || color.includes('surface'));
      },
    })
    .css(
      shapeStyles,
      outlineStyles,
      elevationStyles,
      styles,
    )
    .on({
      composed({ template, html, composition }) {
        /** @type {HTMLElement} */
        let shape = composition.fragmentRoot;
        if (shape === template) {
          // No fragmentRoot. Create new element and wrap template
          shape = document.createElement('div');
          shape.id = 'shape';
          shape.append(...template.childNodes);
          template.append(shape);
          composition.fragmentRoot = shape;
        }

        shape.classList.add('shape');
        shape.part.add('shape');
        shape.setAttribute('elevated', '{elevated}');
        shape.setAttribute('shape-top', '{shapeTop}');
        shape.setAttribute('shape-bottom', '{shapeBottom}');
        shape.setAttribute('shape-start', '{shapeStart}');
        shape.setAttribute('shape-end', '{shapeEnd}');
        shape.setAttribute('shape-style', '{shapeStyle}');
        shape.append(html`
          <div id=outline _if={outlined} class="outline" disabled={disabledState} focused={focusedState} pressed={pressedState} hovered={hoveredState}>
            <div id="outline-left" class="outline-section outline-left"></div>
            <div id="outline-right" class="outline-section outline-right"></div>
          </div>
          <div id=elevation _if={showElevation} hovered={hoveredState} pressed={pressedState} class=elevation color={color} aria-hidden=true></div>
        `);
      },
    })
    .html/* html */`
      
    `;
}
