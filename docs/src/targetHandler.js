const crosshairs = {
};
let vOffset = 0;
let hOffset = 0;

Object.defineProperty(crosshairs, 'vOffset', {
  enumerable: true,
  configurable: false,
  get() {
    return vOffset;
  },
  set(val) {
    vOffset = val;
    document.getElementById('verticalLineLeft').style.left = `${val}px`;
    document.getElementById('verticalLineRight').style.left = `${val}px`;
  },
});


Object.defineProperty(crosshairs, 'hOffset', {
  enumerable: true,
  configurable: false,
  get() {
    return hOffset;
  },
  set(val) {
    hOffset = val;
    document.getElementById('horizontalLine').style.top = `${val}px`;
  },
});

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onTemplateImageClick(event) {
  document.getElementById('horizontalLine').style.top = `${event.clientY}px`;
  document.getElementById('verticalLineLeft').style.left = `${event.layerX}px`;
  document.getElementById('verticalLineRight').style.left = `${event.clientX}px`;
}

/** @return {void} */
function setupImageTargets() {
  const targets = document.getElementsByClassName('target');
  for (let i = 0; i < targets.length; i += 1) {
    targets[i].addEventListener('click', onTemplateImageClick);
  }
}

export default setupImageTargets;
