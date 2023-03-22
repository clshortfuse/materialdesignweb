import styles from './FlexableMixin.css' assert {type: 'css'};

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function FlexableMixin(Base) {
  return Base
    .extend()
    .observe({
      flex: {
        type: 'string',
        empty: 'row',
        /** @type {'row'|'column'} */
        value: 'row',
      },
      x: {
        type: 'string',
        empty: 'start',
        /** @type {'start'|'center'|'end'|'between'|'around'|'stretch'} */
        value: 'start',
      },
      y: {
        type: 'string',
        empty: 'start',
        /** @type {'start'|'center'|'end'|'between'|'around'|'stretch'} */
        value: 'start',
      },
      gap: 'float',
      padding: 'float',
    })
    .css(styles);
}
