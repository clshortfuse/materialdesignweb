import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Progress.css' assert { type: 'css' };
import circleStyles from './ProgressCircle.css' assert { type: 'css' };
import lineStyles from './ProgressLine.css' assert { type: 'css' };

// https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element

export default CustomElement
  .mixin(ThemableMixin)
  .extend()
  .observe({
    circle: 'boolean',
    value: 'float',
    max: 'float',
    autoHide: 'boolean',
    _determinateStyle: 'string',
  })
  .observe({
    valueAsFraction: {
      type: 'float',
      get({ value, max }) {
        return (value / (max || 100));
      },
      changedCallback(oldValue, newValue) {
        this._determinateStyle = `
        --previous:${oldValue ?? newValue ?? 0};
        --value:${newValue ?? 0};
      `;
      },
    },
  })
  .define({
    position() {
      return /** @type {HTMLProgressElement} */ (this.refs.progress).position;
    },
    labels() {
      return /** @type {HTMLProgressElement} */ (this.refs.progress).labels;
    },
  })
  .css(
    styles,
    lineStyles,
    circleStyles,
  )
  .html/* html */`
    <div id=determinate style={_determinateStyle}>
      <progress id=progress value={value} max={max} circle={circle}></progress>
      <div _if={circle} id=circle>
        <div id=semi1 class=semi></div>
        <div id=semi2 class=semi></div>
      </div>
    </div>
    <div _if={!value} id=indeterminate>
      <div _if={!circle} id=indeterminate-line>
        <div id=line1 class=line value={value}></div>
        <div id=line2 class=line value={value}></div>
      </div>
      <div _if={circle} id=indeterminate-circle>
        <div id=arc2 class=arc></div>
        <div id=arc3 class=arc></div>
        <div id=arc4 class=arc></div>
      </div>
    </div>
  `
  .autoRegister('mdw-progress');
