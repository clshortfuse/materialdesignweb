/**
 * @param {Element} element
 * @param {string} palette
 * @param {''|'light'|'contrast'|'A100'|'A200'|'A400'|'A700'} [tone='']
 * @param {''|'solid'|'high'|'medium'|'inactive'|'divider'} [opacity='']
 * @return {void}
 */
export function setInk(element, palette, tone, opacity) {
  if (tone) {
    if (opacity) {
      element.setAttribute('mdw-ink', `${palette} ${tone} ${opacity}`);
    } else {
      element.setAttribute('mdw-ink', `${palette} ${tone}`);
    }
  } else if (opacity) {
    element.setAttribute('mdw-ink', `${palette} ${opacity}`);
  } else {
    element.setAttribute('mdw-ink', palette);
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function removeInk(element) {
  element.removeAttribute('mdw-ink');
}

/**
 * @param {Element} element
 * @param {string} palette
 * @param {''|'alt'|'50'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'} [tone='']
 * @return {void}
 */
export function setSurface(element, palette, tone) {
  if (tone) {
    element.setAttribute('mdw-surface', `${palette} ${tone}`);
  } else {
    element.setAttribute('mdw-surface', palette);
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function removeSurface(element) {
  element.removeAttribute('mdw-surface');
}
