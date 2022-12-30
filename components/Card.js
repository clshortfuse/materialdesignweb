import './CardActionArea.js';
import styles from './Card.css' assert { type: 'css' };
import Container from './Container.js';

export default Container
  .extend()
  .set({
    ariaRole: 'figure',
  })
  .css(styles)
  .html/* html */`
    <slot id=primary-action name=primary-action></slot>
    <div id=outline></div>
  `
  .autoRegister('mdw-card');
