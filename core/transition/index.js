// https://material.io/design/navigation/navigation-transitions.html

import { nextTick } from '../dom';

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
 * @param {string} stringValue
 * @param {number} scaleX
 * @param {number} scaleY
 * @return {string}
 */
function convertBoxShadow(stringValue, scaleX, scaleY) {
  /**
   * @param {string} shadow
   * @return {string}
   */
  function convertShadow(shadow) {
    let inset = '';
    let offsetX = '';
    let offsetY = '';
    let blurRadius = '';
    let spreadRadius = '';
    let color = '';
    shadow.split(' ').forEach((value) => {
      if (value.toLowerCase() === 'inset') {
        inset = value;
        return;
      }
      if (value.indexOf('(') !== -1 || !value.match(/\d/).length) {
        color = value;
        return;
      }
      const numberValue = pxToInteger(value);
      if (!offsetX) {
        offsetX = `${numberValue / scaleX}${value.replace(/[0-9\\-\\.]/g, '')}`;
      } else if (!offsetY) {
        offsetY = `${numberValue / scaleY}${value.replace(/[0-9\\-\\.]/g, '')}`;
      } else if (!blurRadius) {
        blurRadius = `${numberValue / (scaleX * scaleY)}${value.replace(/[0-9\-\\.]/g, '')}`;
      } else {
        spreadRadius = `${numberValue / (scaleX * scaleY)}${value.replace(/[0-9\-\\.]/g, '')}`;
      }
    });
    return [
      inset,
      offsetX,
      offsetY,
      blurRadius,
      spreadRadius,
      color,
    ].filter(v => v).join(' ');
  }

  if (!stringValue) {
    return '';
  }
  return stringValue
    // Strip spaces from anything parenthesized
    .replace(/\([^)]+\)/g, substring => substring.replace(/ /g, ''))
    // Split shadows by commas no inside parentheses
    .match(/[^,(]+\([^)]+\)?[^,]*(|$)/g)
    // Trim empty spaces
    .map(shadow => shadow.trim())
    // Convert values
    .map(convertShadow)
    // Rejoin shadows
    .join(', ');
}

/**
 * @param {string} stringValue
 * @param {number} width
 * @param {number} height
 * @return {{horizontal:number, vertical:number}}
 */
function convertBorderRadius(stringValue, width, height) {
  /**
   * @param {string} value
   * @param {number} length
   * @return {number}
   */
  function parsePercentage(value, length) {
    const numValue = pxToInteger(value);
    if (value.indexOf('%') === -1) {
      return numValue;
    }
    return (numValue * length / 100.0);
  }

  if (!stringValue) {
    return {
      horizontal: 0,
      vertical: 0,
    };
  }

  const split = stringValue.split(' ');
  if (split.length === 1) {
    return {
      horizontal: parsePercentage(stringValue, width),
      vertical: parsePercentage(stringValue, height),
    };
  }
  return {
    horizontal: parsePercentage(split[0], width),
    vertical: parsePercentage(split[1], height),
  };
}

/**
 * @param {HTMLElement} targetElement
 * @param {HTMLElement} originElement
 * @param {CSSStyleDeclaration} [originStyle]
 * @return {Object}
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

  return {
    originWidth,
    originHeight,
    translateX: originX - targetRect.left,
    translateY: originY - targetRect.top,
    scaleX: originWidth / targetRect.width,
    scaleY: originHeight / targetRect.height,
    toString() {
      return [
        `translateX(${this.translateX}px)`,
        `translateY(${this.translateY}px)`,
        `scaleX(${this.scaleX})`,
        `scaleY(${this.scaleY})`,
      ].join(' ');
    },
  };
}

/**
 * @param {HTMLElement} element
 * @param {string} property
 * @param {function(TransitionEvent):void} callback
 * @param {number} [expectedDuration]
 * @return {function} removeListener
 */
function buildTransitionEndListener(element, property, callback, expectedDuration) {
  let hasEnded = false;
  const onTransitionEnd = (event) => {
    if (event.propertyName !== property) {
      return;
    }
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
    }, expectedDuration + 500);
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
 * @param {number} [duration=250|300] (250ms collapse or 300ms expand)
 * @param {boolean} [revertFrom=false] Revert from elements on completion
 * @return {function():void} revertAllElements()
 */
export function transitionElement(
  fromShapeElement, toShapeElement,
  fromContentElement, toContentElement,
  duration,
  revertFrom = false
) {
  const toStyleSyle = window.getComputedStyle(toShapeElement);

  const shapeTransform = getShapeTransform(fromShapeElement, toShapeElement, toStyleSyle);
  const contentTransform = getShapeTransform(toContentElement, fromContentElement);

  const transitionProperties = [
    'transition',
    'transform-origin',
    'transform',
    'background-color',
    'border-radius',
    'box-shadow',
    'z-index',
    'filter',
    'opacity',
    'visibility',
  ];

  const oldFromShapeProperties = {};
  const oldToShapeProperties = {};
  const oldFromContentProperties = {};
  const oldToContentProperties = {};
  const newFromShapeProperties = {};
  transitionProperties.forEach((prop) => {
    oldFromShapeProperties[prop] = fromShapeElement.style.getPropertyValue(prop);
    oldToShapeProperties[prop] = toShapeElement.style.getPropertyValue(prop);
    oldFromContentProperties[prop] = fromContentElement.style.getPropertyValue(prop);
    oldToContentProperties[prop] = toContentElement.style.getPropertyValue(prop);
    if (prop === 'box-shadow') {
      newFromShapeProperties[prop] = convertBoxShadow(
        toStyleSyle.getPropertyValue(prop),
        shapeTransform.scaleX,
        shapeTransform.scaleY
      );
    } else if (prop === 'border-radius') {
      const topLeft = convertBorderRadius(
        toStyleSyle.getPropertyValue('border-top-left-radius'),
        shapeTransform.originWidth,
        shapeTransform.originHeight
      );
      const topRight = convertBorderRadius(
        toStyleSyle.getPropertyValue('border-top-right-radius'),
        shapeTransform.originWidth,
        shapeTransform.originHeight
      );
      const bottomLeft = convertBorderRadius(
        toStyleSyle.getPropertyValue('border-bottom-left-radius'),
        shapeTransform.originWidth,
        shapeTransform.originHeight
      );
      const bottomRight = convertBorderRadius(
        toStyleSyle.getPropertyValue('border-bottom-right-radius'),
        shapeTransform.originWidth,
        shapeTransform.originHeight
      );
      const horizontalRadii = [
        `${topLeft.horizontal / shapeTransform.scaleX}px`,
        `${topRight.horizontal / shapeTransform.scaleX}px`,
        `${bottomLeft.horizontal / shapeTransform.scaleX}px`,
        `${bottomRight.horizontal / shapeTransform.scaleX}px`,
      ].join(' ');
      const verticalRadii = [
        `${topLeft.vertical / shapeTransform.scaleY}px`,
        `${topRight.vertical / shapeTransform.scaleY}px`,
        `${bottomLeft.vertical / shapeTransform.scaleY}px`,
        `${bottomRight.vertical / shapeTransform.scaleY}px`,
      ].join(' ');
      newFromShapeProperties[prop] = `${horizontalRadii} / ${verticalRadii}`;
    } else {
      newFromShapeProperties[prop] = toStyleSyle.getPropertyValue(prop);
    }
  });

  fromShapeElement.setAttribute('mdw-transition-busy', '');
  toShapeElement.setAttribute('mdw-transition-busy', '');
  toContentElement.setAttribute('mdw-transition-busy', '');
  fromContentElement.setAttribute('mdw-transition-busy', '');

  // Hide toContentElement and overlay over fromContentElement immediately
  toContentElement.style.setProperty('opacity', '0');
  toContentElement.style.setProperty('transition', 'none');
  toContentElement.style.setProperty('transform-origin', '0 0 0');
  toContentElement.style.setProperty('transform', contentTransform);
  toContentElement.style.setProperty('z-index', '9');

  fromContentElement.style.setProperty('opacity', '1');

  fromShapeElement.style.setProperty('transition', 'none');
  fromShapeElement.style.setProperty('transform-origin', '0 0 0');
  fromShapeElement.style.setProperty('transform', 'none');
  fromShapeElement.style.setProperty('z-index', '8');

  toShapeElement.style.setProperty('background-color', 'transparent');
  toShapeElement.style.setProperty('filter', 'none');
  toShapeElement.style.setProperty('box-shadow', 'none');

  const revertFunction = () => {
    transitionProperties.forEach((prop) => {
      if (oldFromShapeProperties[prop] == null) {
        fromShapeElement.style.removeProperty(prop);
      } else {
        fromShapeElement.style.setProperty(prop, oldFromShapeProperties[prop]);
      }
      if (oldToShapeProperties[prop] == null) {
        toShapeElement.style.removeProperty(prop);
      } else {
        toShapeElement.style.setProperty(prop, oldToShapeProperties[prop]);
      }
      if (oldFromContentProperties[prop] == null) {
        fromContentElement.style.removeProperty(prop);
      } else {
        fromContentElement.style.setProperty(prop, oldFromContentProperties[prop]);
      }
      if (oldToContentProperties[prop] == null) {
        toContentElement.style.removeProperty(prop);
      } else {
        toContentElement.style.setProperty(prop, oldToContentProperties[prop]);
      }
    });
  };

  nextTick(() => {
    nextTick(() => {
      let calculatedDuration = duration;
      if (calculatedDuration == null) {
        if (shapeTransform.scaleX * shapeTransform.scaleY >= 1) {
          calculatedDuration = 300; // expand
        } else {
          calculatedDuration = 250; // collapse
        }
      }
      const totalDuration = calculatedDuration.toString(10);
      const fadeInTime = (calculatedDuration * 0.70).toString(10);
      const fadeOutTime = (calculatedDuration * 0.30).toString(10);
      const transformTransition = transitionProperties
        .filter(prop => prop !== 'transform-origin' && prop !== 'opacity' && prop !== 'transition')
        .map(prop => `${prop} ${totalDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1) 0s`)
        .join(', ');
      const fadeInTransition = `opacity ${fadeInTime}ms cubic-bezier(0.0, 0.0, 0.2, 1) ${fadeOutTime}ms`;
      const fadeOutTransition = [
        `opacity ${fadeOutTime}ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms`,
        `visibility ${fadeOutTime}ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms`,
      ].join(', ');

      fromShapeElement.style.setProperty('transition', transformTransition);
      transitionProperties.forEach((prop) => {
        if (prop === 'transform') {
          fromShapeElement.style.setProperty('transform', shapeTransform);
        } else if (prop === 'transition') {
          // noop;
        } else if (prop === 'transform-origin') {
          fromShapeElement.style.setProperty('transform-origin', '0 0 0');
        } else if (prop === 'z-index') {
          fromShapeElement.style.setProperty('z-index', '8');
        } else if (prop === 'visibility') {
          fromShapeElement.style.setProperty('visibility', 'hidden');
        } else if (newFromShapeProperties[prop] == null) {
          fromShapeElement.style.removeProperty(prop);
        } else {
          fromShapeElement.style.setProperty(prop, newFromShapeProperties[prop]);
        }
      });

      nextTick(() => {
        buildTransitionEndListener(fromShapeElement, 'transform', () => {
          transitionProperties.forEach((prop) => {
            if (prop === 'transition') {
              toShapeElement.style.setProperty('transition', 'none');
              toContentElement.style.setProperty('transition', 'none');
            } else {
              if (oldToShapeProperties[prop] == null) {
                toShapeElement.style.removeProperty(prop);
              } else {
                toShapeElement.style.setProperty(prop, oldToShapeProperties[prop]);
              }
              if (oldToContentProperties[prop] == null) {
                toContentElement.style.removeProperty(prop);
              } else {
                toContentElement.style.setProperty(prop, oldToContentProperties[prop]);
              }
            }

            if (prop === 'visibility' && !revertFrom) {
              return;
            }
            if (oldFromContentProperties[prop] == null) {
              fromContentElement.style.removeProperty(prop);
            } else {
              fromContentElement.style.setProperty(prop, oldFromContentProperties[prop]);
            }
            if (oldFromShapeProperties[prop] == null) {
              fromShapeElement.style.removeProperty(prop);
            } else {
              fromShapeElement.style.setProperty(prop, oldFromShapeProperties[prop]);
            }
          });

          nextTick(() => {
            if (oldToShapeProperties.transition == null) {
              toShapeElement.style.removeProperty('transition');
            } else {
              toShapeElement.style.setProperty('transition', oldToShapeProperties.transition);
            }
            if (oldToContentProperties.transition == null) {
              toContentElement.style.removeProperty('transition');
            } else {
              toContentElement.style.setProperty('transition', oldToContentProperties.transition);
            }
            fromShapeElement.removeAttribute('mdw-transition-busy');
            toShapeElement.removeAttribute('mdw-transition-busy');
            toContentElement.removeAttribute('mdw-transition-busy');
            fromContentElement.removeAttribute('mdw-transition-busy');
          });
        }, calculatedDuration);
      });

      // Fade out fromContent while shaping into new content
      fromContentElement.style.setProperty('transition', fadeOutTransition);
      fromContentElement.style.setProperty('opacity', '0');
      fromContentElement.style.setProperty('visibility', 'hidden');

      toContentElement.style.setProperty('transition', [
        transformTransition,
        fadeInTransition,
      ].join(', '));
      toContentElement.style.setProperty('opacity', '1');
      toContentElement.style.setProperty('transform', 'none');
    });
  });

  return revertFunction;
}
