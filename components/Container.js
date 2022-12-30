import styles from './Container.css' assert { type: 'css' };
import colorStyles from './ContainerColors.css' assert { type: 'css' };
import Text from './Text.js';

export default Text
  .extend()
  .observe({
    disabled: 'boolean',
    shapeTop: 'boolean',
    shapeBottom: 'boolean',
    shapeStart: 'boolean',
    shapeEnd: 'boolean',
    elevation: 'integer',
    color: 'string',
    shapeStyle: 'string',
  })
  .css(styles)
  .html/* html */`<div _if={!disabled} id=elevation aria-hidden=true></div>`
  .on('composed', ({ composition }) => composition.styles.unshift(colorStyles)) // Ink > Color rules
  .onAttributeChanged({
    disabled(oldValue, newValue) {
      this.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
    },
  })
  .autoRegister('mdw-container');
