// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1' assert { type: 'css'};

import Container from './Container.js';
import styles from './Progress.css' assert { type: 'css' };
import circleStyles from './ProgressCircle.css' assert { type: 'css' };
import lineStyles from './ProgressLine.css' assert { type: 'css' };

/** @implements {HTMLProgressElement} */
export default class Progress extends Container {
  static elementName = 'mdw-progress';

  static styles = [...super.styles, styles, lineStyles, circleStyles];

  compose() {
    const fragment = super.compose();
    // eslint-disable-next-line prefer-destructuring
    const html = this.html;
    fragment.getElementById('slot').remove();
    fragment.append(html`
      <div id=determinate style=${this.updateDeterminateStyle}>
        <progress id=progress value={value} max={max}></progress>
        <div id=circle>
          <div id=semi1 class=semi></div>
          <div id=semi2 class=semi></div>
        </div>
      </div>
      <div id=indeterminate>
        <div id=indeterminate-line>
          <div id=line1 class=line></div>
          <div id=line2 class=line></div>
        </div>
        <div id=indeterminate-circle>
          <div id=arc2 class=arc></div>
          <div id=arc3 class=arc></div>
          <div id=arc4 class=arc></div>
        </div>
      </div>
    `);
    return fragment;
  }

  updateDeterminateStyle() {
    return `
      --previous:${this._previousValueAsFraction ?? this.valueAsFraction ?? 0};
      --value:${this.valueAsFraction ?? 0};
    `;
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   * @return {void}
   */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    switch (name) {
      case 'value':
      case 'max':
        this.valueAsFraction = (this.value / (this.max || 100));
        break;
      case 'valueAsFraction':
        this._previousValueAsFraction = oldValue;
        break;
      default:
    }
  }

  get position() { return this.refs.progress.position; }

  get labels() { return this.refs.progress.labels; }
}

// https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element

Progress.prototype._previousValueAsFraction = Progress.idlFloat('_previousValueAsFraction');
Progress.prototype.valueAsFraction = Progress.idlFloat('valueAsFraction');
Progress.prototype.value = Progress.idlFloat('value');
Progress.prototype.max = Progress.idlFloat('max');
Progress.prototype.autoHide = Progress.idlBoolean('autoHide');

Progress.prototype.refs = {
  ...Container.prototype.refs,
  ...Progress.addRefs({
    progress: 'progress',
    circle: 'div',
  }),
};
