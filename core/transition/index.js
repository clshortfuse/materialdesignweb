import { nextTick } from '../dom';

// https://material.io/design/navigation/navigation-transitions.html

/**
 * @param {string} px
 * @return {number}
 */
function pxToInteger(px) {
  if (!px) {
    return 0;
  }
  return parseInt(px, 10);
}

/**
 * @param {HTMLElement} targetElement
 * @param {HTMLElement} originElement
 * @param {CSSStyleDeclaration} [originStyle]
 * @return {string}
 */
export function getShapeTransform(targetElement, originElement, originStyle) {
  const originRect = originElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  const originCSSStyle = originStyle || window.getComputedStyle(originElement);

  let originX = originRect.left;
  let originWidth = originRect.width;
  let originY = originRect.top;
  let originHeight = originRect.height;
  if (originCSSStyle.boxSizing === 'border-box') {
    const paddingTop = pxToInteger(originCSSStyle.paddingTop);
    const paddingRight = pxToInteger(originCSSStyle.paddingRight);
    const paddingBottom = pxToInteger(originCSSStyle.paddingBottom);
    const paddingLeft = pxToInteger(originCSSStyle.paddingLeft);
    originX += paddingLeft;
    originWidth -= (paddingLeft + paddingRight);
    originY += paddingTop;
    originHeight -= (paddingTop + paddingBottom);
  }

  return [
    `translateX(${originX - targetRect.left}px)`,
    `translateY(${originY - targetRect.top}px)`,
    `scaleX(${originWidth / targetRect.width})`,
    `scaleY(${originHeight / targetRect.height})`,
  ].join(' ');
}

/**
 * @param {HTMLElement} element
 * @param {function(TransitionEvent):void} callback
 * @param {number} [expectedDuration]
 * @return {function} removeListener
 */
function buildTransitionEndListener(element, callback, expectedDuration) {
  let hasEnded = false;
  const onTransitionEnd = (event) => {
    hasEnded = true;
    element.removeEventListener('transitionend', onTransitionEnd);
    callback(event);
  };
  element.addEventListener('transitionend', onTransitionEnd);
  if (expectedDuration) {
    setTimeout(() => {
      element.removeEventListener('transitionend', onTransitionEnd);
      if (!hasEnded) {
        callback(null);
      }
    }, expectedDuration);
  }
  return () => {
    element.removeEventListener('transitionend', onTransitionEnd);
  };
}

/**
 * @param {HTMLElement} fromShapeElement
 * @param {HTMLElement} toShapeElement
 * @param {HTMLElement} fromContentElement
 * @param {HTMLElement} toContentElement
 * @return {function():void} revertFromShape()
 */
export function transitionElement(
  fromShapeElement, toShapeElement,
  fromContentElement, toContentElement
) {
  const toStyleSyle = window.getComputedStyle(toShapeElement);

  const shapeTransform = getShapeTransform(fromShapeElement, toShapeElement, toStyleSyle);
  const contentTransform = getShapeTransform(toContentElement, fromContentElement);

  const transitionProperties = [
    'transform-origin',
    'transform',
    'border-radius',
    'box-shadow',
    'filter',
  ];

  // Hide toContentElement and overlay over fromContentElement immediately
  toContentElement.style.setProperty('opacity', '0');
  toContentElement.style.setProperty('transition', 'none');
  toContentElement.style.setProperty('transform-origin', '0 0 0');
  toContentElement.style.setProperty('transform', contentTransform);

  const originalProperties = {};
  transitionProperties.forEach((prop) => {
    originalProperties[prop] = fromShapeElement.style.getPropertyValue(prop);
  });

  fromContentElement.style.setProperty('opacity', '1');

  fromShapeElement.style.setProperty('transition', 'none');
  fromShapeElement.style.setProperty('transform-origin', '0 0 0');
  fromShapeElement.style.setProperty('transform', 'none');

  const revertFunction = () => {
    Object.keys(originalProperties).forEach((prop) => {
      fromShapeElement.style.setProperty(prop, originalProperties[prop]);
    });
    fromShapeElement.style.removeProperty('visibility');
    fromContentElement.style.removeProperty('transition');
    fromContentElement.style.removeProperty('opacity');
  };

  nextTick(() => {
    const transformTransition = transitionProperties
      .filter(prop => prop !== 'transform-origin')
      .map(prop => `${prop} 300ms cubic-bezier(0.4, 0.0, 0.2, 1) 0s`)
      .join(', ');
    const fadeInTransition = 'opacity 210ms cubic-bezier(0.0, 0.0, 0.2, 1) 90ms';
    const fadeOutTransition = 'opacity 90ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms';

    fromShapeElement.style.setProperty('transition', transformTransition);
    transitionProperties.forEach((prop) => {
      if (prop === 'transform') {
        fromShapeElement.style.setProperty('transform', shapeTransform);
      } else if (prop === 'transform-origin') {
        fromShapeElement.style.setProperty('transform-origin', '0 0 0');
      } else {
        fromShapeElement.style.setProperty(prop, toStyleSyle.getPropertyValue(prop));
      }
    });

    nextTick(() => {
      buildTransitionEndListener(fromShapeElement, () => {
        fromShapeElement.style.setProperty('visibility', 'hidden');
      });
    });


    // Fade out fromContent while shaping into new content
    fromContentElement.style.setProperty('transition', fadeOutTransition);
    fromContentElement.style.setProperty('opacity', '0');

    toContentElement.style.setProperty('transition', [
      transformTransition,
      fadeInTransition,
    ].join(', '));
    toContentElement.style.setProperty('opacity', '1');
    toContentElement.style.setProperty('transform', 'none');
  });

  return revertFunction;
}
