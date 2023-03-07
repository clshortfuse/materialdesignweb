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
    _previousValueAsFraction: 'float',
    valueAsFraction: 'float',
    circle: 'boolean',
    value: 'float',
    max: 'float',
    autoHide: 'boolean',
  })
  .define({
    position() {
      return /** @type {HTMLProgressElement} */ (this.refs.progress).position;
    },
    labels() {
      return /** @type {HTMLProgressElement} */ (this.refs.progress).labels;
    },
  })
  .expressions({
    computeDeterminateStyle({ _previousValueAsFraction, valueAsFraction }) {
      return `
        --previous:${_previousValueAsFraction ?? valueAsFraction ?? 0};
        --value:${valueAsFraction ?? 0};
      `;
    },
  })
  .css(
    styles,
    lineStyles,
    circleStyles,
  )
  .html/* html */`
    <div id=determinate style={computeDeterminateStyle}>
      <progress id=progress value={value} max={max}></progress>
      <div _if={circle} id=circle>
        <div id=semi1 class=semi></div>
        <div id=semi2 class=semi></div>
      </div>
    </div>
    <div _if={!value} id=indeterminate>
      <div _if={!circle} id=indeterminate-line>
        <div id=line1 class=line></div>
        <div id=line2 class=line></div>
      </div>
      <div _if={circle} id=indeterminate-circle>
        <div id=arc2 class=arc></div>
        <div id=arc3 class=arc></div>
        <div id=arc4 class=arc></div>
      </div>
    </div>
  `
  .onPropChanged({
    value(oldValue, newValue, element) {
      element.valueAsFraction = (element.value / (element.max || 100));
    },
    max(oldValue, newValue, element) {
      element.valueAsFraction = (element.value / (element.max || 100));
    },
    valueAsFraction(oldValue, newValue, element) {
      element._previousValueAsFraction = oldValue;
    },
  })
  .autoRegister('mdw-progress');
