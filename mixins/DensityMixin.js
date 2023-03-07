import styles from './DensityMixin.css' assert {type: 'css'};

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function DensityMixin(Base) {
  return Base
    .extend()
    .observe({
      density: 'integer',
    })
    .css(styles);
}
