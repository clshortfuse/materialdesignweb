import Container from './Container.js';
import styles from './Progress.css' assert { type: 'css' };
import circleStyles from './ProgressCircle.css' assert { type: 'css' };
import lineStyles from './ProgressLine.css' assert { type: 'css' };

/** @implements {HTMLProgressElement} */
export default class Progress extends Container {
  static { this.autoRegister(); }

  static elementName = 'mdw-progress';

  compose() {
    const composition = super.compose();
    const { template } = composition;
    template.getElementById('slot').remove();
    return composition.append(
      styles,
      lineStyles,
      circleStyles,
      /* html */ `
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
      `,
    );
  }

  #progress = /** @type {HTMLProgressElement} */ (this.refs.progress);

  /** @type {Container['idlChangedCallback']} */
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

  computeDeterminateStyle() {
    return `
      --previous:${this._previousValueAsFraction ?? this.valueAsFraction ?? 0};
      --value:${this.valueAsFraction ?? 0};
    `;
  }

  get position() { return this.#progress.position; }

  get labels() { return this.#progress.labels; }
}

// https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element

Progress.prototype._previousValueAsFraction = Progress.idl('_previousValueAsFraction', 'float');
Progress.prototype.valueAsFraction = Progress.idl('valueAsFraction', 'float');
Progress.prototype.circle = Progress.idl('circle', { type: 'boolean' });
Progress.prototype.value = Progress.idl('value', 'float');
Progress.prototype.max = Progress.idl('max', 'float');
Progress.prototype.autoHide = Progress.idl('autoHide', 'boolean');
