const radius = 8.75;
const circumference = 2 * Math.PI * radius;

// TODO: Upgrade IE/Edge browsers to animate with rAF

/**
 * @param {Element} progressCircleElement
 * @return {void}
 */
export function attach(progressCircleElement) {
  /** @type {Element} */
  let svg = (progressCircleElement.getElementsByTagName('svg')[0]);
  if (!svg) {
    svg = (document.createElement('svg'));
    svg.setAttribute('viewbox', '0 0 24 24');
    progressCircleElement.appendChild(svg);
  }
  const paths = svg.getElementsByTagName('path');
  if (paths.length !== 2) {
    svg.innerHTML = `
      <path d="M12 3.25A8.75 8.75 0 1 1 3.25 12"/>
      <path d="M12 3.25A8.75 8.75 0 1 1 3.25 12 A 8.75 8.75 0 0 1 12 3.25"/>
    `;
  }
}

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
