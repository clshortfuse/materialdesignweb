/**
 * @typedef {Object} DOMRectLike
 * @prop {number} left
 * @prop {number} right
 * @prop {number} top
 * @prop {number} bottom
 * @prop {number} width
 * @prop {number} height
 */

/**
 * @typedef {Object} CanAnchorPopUpOptions
 * @prop {Element|DOMRectLike} [anchor]
 * @prop {number|'left'|'center'|'right'} [clientX]
 * @prop {number|'top'|'center'|'bottom'} [clientY]
 * @prop {number} [pageX]
 * @prop {number} [pageY]
 * @prop {Element|{width:number, height:number}} [popup]
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
  const pageWidth = document.documentElement.clientWidth;
  const pageHeight = document.documentElement.clientHeight;
  if (pageX == null || pageY == null) {
    const { clientX, clientY, anchor } = options;
    let rect;
    if (anchor) {
      rect = anchor instanceof Element ? anchor.getBoundingClientRect() : anchor;
    } else {
      rect = {
        left: 0,
        width: pageWidth,
        right: pageWidth,
        top: 0,
        bottom: pageHeight,
        height: pageHeight,
      };
    }

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
      height = popup.height;
    }
  }

  let top;
  let right;
  let bottom;
  let left;
  const margin = options.margin ?? 0;

  let pageTop = margin;
  let pageBottom = -margin;
  let pageLeft = margin;
  let pageRight = -margin;

  if (window.visualViewport) {
    pageTop += window.visualViewport.offsetTop;
    pageBottom += window.visualViewport.offsetTop + window.visualViewport.height;
    pageLeft += window.visualViewport.offsetLeft;
    pageRight += window.visualViewport.offsetLeft + window.visualViewport.width;
  } else {
    pageBottom += pageHeight;
    pageRight += pageWidth;
  }

  const offsetX = options.offsetX ?? 0;
  const offsetY = options.offsetY ?? 0;
  pageX += offsetX;
  pageY += offsetY;

  let cssTop = 'auto';
  let cssRight = 'auto';
  let cssBottom = 'auto';
  let cssLeft = 'auto';
  let maxHeight = null;
  let maxWidth = null;

  switch (directionY) {
    case 'up':
      bottom = Math.min(pageY, pageBottom);
      top = Math.max(bottom - height, pageTop);
      cssBottom = `${pageHeight - bottom}px`;
      if (top === pageTop) {
        maxHeight = `${bottom - pageTop}px`;
      }
      break;
    case 'center':
      top = Math.max(pageY - height / 2, pageTop);
      bottom = Math.min(pageY + height / 2, pageBottom);
      cssTop = `${top}px`;
      if (bottom === pageBottom) {
        maxHeight = `${pageBottom - pageTop}px`;
      }
      break;
    default:
      top = Math.max(pageY, pageTop);
      bottom = Math.min(top + height, pageBottom);
      cssTop = `${top}px`;
      if (bottom === pageBottom) {
        maxHeight = `${pageBottom - top}px`;
      }
  }

  switch (directionX) {
    case 'left':
      right = Math.min(pageX, pageRight);
      left = Math.max(right - width, pageLeft);
      cssRight = `${pageWidth - right}px`;
      if (left === pageLeft) {
        maxWidth = `${right - pageLeft}px`;
      }
      break;
    case 'center':
      left = Math.max(pageX - width / 2, pageLeft);
      right = Math.min(pageX + width / 2, pageRight);
      cssLeft = `${left}px`;
      if (right === pageRight) {
        maxWidth = `${pageRight - pageLeft}px`;
      }
      break;
    default:
      left = Math.max(pageX, pageLeft);
      right = Math.min(left + width, pageRight);
      cssLeft = `${left}px`;
      if (right === pageRight) {
        maxWidth = `${pageRight - left}px`;
      }
  }

  // compute area
  const fullSize = width * height;
  const realSize = (bottom - top) * (right - left);

  const visibility = realSize / fullSize;

  const transformOriginX = directionX === 'center' ? 'center' : (directionX === 'left' ? 'right' : 'left');
  const transformOriginY = directionY === 'center' ? 'center' : (directionY === 'up' ? 'bottom' : 'top');
  return {
    ...options,
    top,
    right,
    bottom,
    left,
    visibility,
    styles: {
      top: cssTop,
      bottom: cssBottom,
      left: cssLeft,
      right: cssRight,
      maxWidth,
      maxHeight,
      transformOrigin: `${transformOriginY} ${transformOriginX}`,
    },
  };
}
