import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';

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
    .observe({
      _styler: {
        ...ELEMENT_STYLER_TYPE,
        get({ gap, padding }) {
          if (!gap && !padding) return null;
          return {
            styles: {
              ...(gap ? { gap: `${gap}px` } : null),
              ...(padding ? { padding: `${padding}px` } : null),
            },
          };
        },
      },
    })
    .css(styles);
}
