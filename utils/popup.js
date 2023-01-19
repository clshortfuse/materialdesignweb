/**
 * @typedef {Object} CanAnchorPopUpOptions
 * @prop {Element|DOMRect} [anchor]
 * @prop {number|'left'|'center'|'right'} [clientX]
 * @prop {number|'top'|'center'|'bottom'} [clientY]
 * @prop {number} [pageX]
 * @prop {number} [pageY]
 * @prop {Element|DOMRect} [popup]
 * @prop {number} [width]
 * @prop {number} [height]
 * @prop {number} [offsetX] Offset from anchor
 * @prop {number} [offsetY] Offset from anchor
 * @prop {number} [margin] Margin from page
 * @prop {'left'|'center'|'right'} [directionX='right']
 * @prop {'up'|'center'|'down'} [directionY='down']
 * @prop {boolean} [force=false]
 */

/** @param {CanAnchorPopUpOptions} options */
export function canAnchorPopup(options) {
  let { pageX, pageY, directionX, directionY } = options;
  if (pageX == null || pageY == null) {
    const { clientX, clientY, anchor } = options;
    const rect = anchor instanceof Element ? anchor.getBoundingClientRect() : anchor;
    if (pageX == null) {
      switch (clientX) {
        case 'left':
        case null:
        case undefined:
          pageX = rect.left;
          directionX ??= 'right';
          break;
        case 'center':
          pageX = rect.left + rect.width / 2;
          directionX ??= 'center';
          break;
        case 'right':
          pageX = rect.right;
          directionX ??= 'left';
          break;
        default:
          pageX = rect.left + clientX;
      }
    }
    if (pageY == null) {
      switch (clientY) {
        case 'top':
          pageY = rect.top;
          directionY ??= 'up';
          break;
        case 'center':
          pageY = rect.top + rect.height / 2;
          directionY ??= 'center';
          break;
        case 'bottom':
        case null:
        case undefined:
          pageY = rect.bottom;
          directionY ??= 'down';
          break;
        default:
          pageY = rect.top + clientY;
      }
    }
  }
  let { width, height } = options;
  if (width == null || height == null) {
    const { popup } = options;
    if (popup instanceof Element) {
      width = popup.clientWidth;
      height = popup.clientHeight;
    } else {
      width = popup.width;
      height = popup.width;
    }
  }

  // eslint-disable-next-line default-case
  switch (directionX) {
    case 'left':
      pageX -= width;
      break;
    case 'center':
      pageX -= width / 2;
  }

  // eslint-disable-next-line default-case
  switch (directionY) {
    case 'up':
      pageY -= height;
      break;
    case 'center':
      pageY -= height / 2;
  }

  const offsetX = options.offsetX ?? 0;
  const offsetY = options.offsetY ?? 0;
  pageX += offsetX;
  pageY += offsetY;
  const margin = options.margin ?? 0;
  if (!options.force) {
    if (pageX - margin < 0) return null;
    if (pageY - margin < 0) return null;
    if (pageX + width > (document.documentElement.clientWidth - margin)) return null;
    if (pageY + height > (document.documentElement.clientHeight - margin)) return null;
  }

  return {
    ...options,
    offsetX,
    offsetY,
    pageX,
    pageY,
    transformOriginX: directionX === 'center' ? 'center' : (directionX === 'left' ? 'right' : 'left'),
    transformOriginY: directionY === 'center' ? 'center' : (directionY === 'up' ? 'bottom' : 'top'),
  };
}
