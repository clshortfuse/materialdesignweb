const radius = 8.75;
const circumference = 2 * Math.PI * radius;

// TODO: Upgrade IE/Edge browsers to animate with rAF

/**
 * @param {Element} progressCircleElement
 * @param {number} value Percentage value (0-100);
 * @return {void}
 */
export function setValue(progressCircleElement, value) {
  const dashOffset = circumference * (3 - (value / 100));
  const pathElements = progressCircleElement.getElementsByTagName('path');
  pathElements[pathElements.length - 1].style.setProperty('stroke-dashoffset', dashOffset.toString());
}
