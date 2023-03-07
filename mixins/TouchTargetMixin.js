import styles from './TouchTargetMixin.css' assert { type: 'css' };

/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function TouchTargetMixin(Base) {
  return Base
    .extend()
    .css(styles)
    .html/* html */`<div id=touch-target class=touch-target></div>`;
}
