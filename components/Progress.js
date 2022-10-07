// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1' assert { type: 'css'};

import Container from './Container.js';
import styles from './Progress.css' assert { type: 'css' };
import circleStyles from './ProgressCircle.css' assert { type: 'css' };
import lineStyles from './ProgressLine.css' assert { type: 'css' };

/** @implements {HTMLProgressElement} */
export default class Progress extends Container {
  static elementName = 'mdw-progress';

  static styles = [...super.styles, styles, lineStyles, circleStyles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <progress id=progress></progress>
      <div id=indeterminate-line>
        <div id=line1 class=line></div>
        <div id=line2 class=line></div>
      </div>
      <div id=indeterminate-circle>
        <div id=arc2 class=arc></div>
        <div id=arc3 class=arc></div>
        <div id=arc4 class=arc></div>
      </div>
      <div id=circle>
        <div id=semi1 class=semi></div>
        <div id=semi2 class=semi></div>
      </div>
    `,
  ];

  static compose() {
    const fragment = super.compose();
    fragment.getElementById('slot').remove();
    return fragment;
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    const { circle, progress } = this.refs;

    switch (name) {
      default:
        return;
      case 'value':
      case 'max':
        if (newValue == null) {
          circle.removeAttribute(name);
          progress.removeAttribute(name);
          return;
        }
    }

    circle.setAttribute(name, newValue);
    progress.setAttribute(name, newValue);

    const value = (this.value / (this.max || 100)).toPrecision(12);
    const previous = circle.style.getPropertyValue('--value') || value;

    circle.style.setProperty('--previous', previous);
    circle.style.setProperty('--value', value);
    progress.style.setProperty('--value', value);
  }

  get position() { return this.refs.progress.position; }

  get labels() { return this.refs.progress.labels; }
}

// https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element

Progress.prototype.value = Progress.idlFloat('value');
Progress.prototype.max = Progress.idlFloat('max');
Progress.prototype.autoHide = Progress.idlBoolean('auto-hide');

Progress.prototype.refs = {
  ...Container.prototype.refs,
  ...Progress.addRefs({
    progress: 'progress',
    circle: 'div',
    slot: undefined,
  }),
};
