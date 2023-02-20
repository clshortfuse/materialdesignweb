import styles from './ThemableMixin.css' assert { type: 'css' };

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ThemableMixin(Base) {
  return Base
    .extend()
    .observe({
      color: 'string',
      ink: 'string',
      block: 'boolean',
      typeStyle: 'string',
    })
    .css(styles);
}
