const radius = 8.75;
const circumference = 2 * Math.PI * radius;

class ProgressCircle {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    this.pathElements = this.element.getElementsByTagName('path');
    // this.pathElement = pathElements[pathElements.length - 1];

    // TODO: Upgrade IE/Edge browsers to animate with rAF
  }

  detach() {
    this.element = null;
  }

  /**
   * Clear and detach all children
   * @param {number} value Percentage value (0-100);
   * @return {void}
   */
  setValue(value) {
    const dashOffset = circumference * (3 - (value / 100));
    this.pathElements[this.pathElements.length - 1].style.setProperty('stroke-dashoffset', dashOffset.toString());
  }
}

export {
  ProgressCircle,
};
