// https://material.io/design/navigation/navigation-transitions.html

const EXPAND_DURATION_MS = 300;
const COLLAPSE_DURATION_MS = 250;

/**
 * @typedef {Object} ShapeTranformDetails
 * @prop {number} originWidth
 * @prop {number} originHeight
 * @prop {number} translateX
 * @prop {number} translateY
 * @prop {number} scaleX
 * @prop {number} scaleY
 * @prop {function():string} toString
 */

/**
 * @param {string} px
 * @return {number}
 */
function pxToInteger(px) {
  if (!px) {
    return 0;
  }
  return Number.parseInt(px, 10);
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
    for (const value of shadow.trim().split(' ')) {
      if (value.toLowerCase() === 'inset') {
        inset = value;
        continue;
      }
      if (value.includes('(') || !value.match(/\d/).length) {
        color = value;
        continue;
      }
      const numberValue = pxToInteger(value);
      if (!offsetX) {
        offsetX = `${numberValue / scaleX}${value.replace(/[\d.\\]/g, '')}`;
      } else if (!offsetY) {
        offsetY = `${numberValue / scaleY}${value.replace(/[\d.\\]/g, '')}`;
      } else if (!blurRadius) {
        blurRadius = `${numberValue / (scaleX * scaleY)}${value.replace(/[\d.\\-]/g, '')}`;
      } else {
        spreadRadius = `${numberValue / (scaleX * scaleY)}${value.replace(/[\d.\\-]/g, '')}`;
      }
    }
    return [
      inset,
      offsetX,
      offsetY,
      blurRadius,
      spreadRadius,
      color,
    ].filter(Boolean).join(' ');
  }

  if (!stringValue) {
    return '';
  }
  return stringValue
    // Strip spaces from anything parenthesized
    .replace(/\([^)]+\)/g, (substring) => substring.replace(/ /g, ''))
    // Split shadows by commas no inside parentheses
    .match(/[^(,]+\([^)]+\)?[^,]*(|$)/g)
    // Convert values
    .map((shadow) => convertShadow(shadow))
    // Rejoin shadows
    .join(', ');
}

/**
 * @param {string} value
 * @param {number} length
 * @return {number}
 */
function parsePercentage(value, length) {
  const numValue = pxToInteger(value);
  if (!value.includes('%')) {
    return numValue;
  }
  return ((numValue * length) / 100);
}

/**
 * @param {string} stringValue
 * @param {number} width
 * @param {number} height
 * @return {{horizontal:number, vertical:number}}
 */
function convertBorderRadius(stringValue, width, height) {
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
 * @return {ShapeTranformDetails}
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
 * @return {Function} removeListener
 */
function buildTransitionEndListener(element, property, callback, expectedDuration) {
  let hasEnded = false;
  const onTransitionEnd = (/** @type {TransitionEvent} */ event) => {
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
 * @typedef {Object} TransitionElementOptions
 * @prop {HTMLElement} fromShapeElement
 * @prop {HTMLElement} toShapeElement
 * @prop {HTMLElement} fromContentElement
 * @prop {HTMLElement} toContentElement
 * @prop {number} [duration=250|300] (250ms collapse or 300ms expand)
 * @prop {boolean} [revertFrom=false] Revert from elements on completion
 * @prop {function(TransitionElementOptions):any} [onTransitionEnd]
 * @prop {function(TransitionElementOptions):any} [onComplete]
 */

/**
 * @param {TransitionElementOptions} options
 * @return {function():void} revertAllElements()
 */
export function transitionElement(options) {
  const toStyleSyle = window.getComputedStyle(options.toShapeElement);

  const shapeTransform = getShapeTransform(options.fromShapeElement, options.toShapeElement, toStyleSyle);
  const contentTransform = getShapeTransform(options.toContentElement, options.fromContentElement);

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

  /** @type {Record<string,string>} */
  const oldFromShapeProperties = {};
  /** @type {Record<string,string>} */
  const oldToShapeProperties = {};
  /** @type {Record<string,string>} */
  const oldFromContentProperties = {};
  /** @type {Record<string,string>} */
  const oldToContentProperties = {};
  /** @type {Record<string,string>} */
  const newFromShapeProperties = {};
  for (const prop of transitionProperties) {
    oldFromShapeProperties[prop] = options.fromShapeElement.style.getPropertyValue(prop);
    oldToShapeProperties[prop] = options.toShapeElement.style.getPropertyValue(prop);
    oldFromContentProperties[prop] = options.fromContentElement.style.getPropertyValue(prop);
    oldToContentProperties[prop] = options.toContentElement.style.getPropertyValue(prop);
    if (prop === 'box-shadow') {
      newFromShapeProperties[prop] = convertBoxShadow(
        toStyleSyle.getPropertyValue(prop),
        shapeTransform.scaleX,
        shapeTransform.scaleY,
      );
    } else if (prop === 'border-radius') {
      const topLeft = convertBorderRadius(
        toStyleSyle.getPropertyValue('border-top-left-radius'),
        shapeTransform.originWidth,
        shapeTransform.originHeight,
      );
      const topRight = convertBorderRadius(
        toStyleSyle.getPropertyValue('border-top-right-radius'),
        shapeTransform.originWidth,
        shapeTransform.originHeight,
      );
      const bottomLeft = convertBorderRadius(
        toStyleSyle.getPropertyValue('border-bottom-left-radius'),
        shapeTransform.originWidth,
        shapeTransform.originHeight,
      );
      const bottomRight = convertBorderRadius(
        toStyleSyle.getPropertyValue('border-bottom-right-radius'),
        shapeTransform.originWidth,
        shapeTransform.originHeight,
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
  }

  options.fromShapeElement.setAttribute('mdw-transition-busy', '');
  options.toShapeElement.setAttribute('mdw-transition-busy', '');
  options.toContentElement.setAttribute('mdw-transition-busy', '');
  options.fromContentElement.setAttribute('mdw-transition-busy', '');

  // Hide toContentElement and overlay over fromContentElement immediately
  options.toContentElement.style.setProperty('opacity', '0');
  options.toContentElement.style.setProperty('transition', 'none');
  options.toContentElement.style.setProperty('transform-origin', '0 0 0');
  options.toContentElement.style.setProperty('transform', contentTransform.toString());
  options.toContentElement.style.setProperty('z-index', '9');
  options.toContentElement.style.setProperty('visibility', 'visible');

  options.fromContentElement.style.setProperty('opacity', '1');

  options.fromShapeElement.style.setProperty('transition', 'none');
  options.fromShapeElement.style.setProperty('transform-origin', '0 0 0');
  options.fromShapeElement.style.setProperty('transform', 'none');
  options.fromShapeElement.style.setProperty('z-index', '8');

  options.toShapeElement.style.setProperty('background-color', 'transparent');
  options.toShapeElement.style.setProperty('filter', 'none');
  options.toShapeElement.style.setProperty('box-shadow', 'none');
  options.toShapeElement.style.setProperty('visibility', 'visible');

  const revertFunction = () => {
    for (const prop of transitionProperties) {
      if (oldFromShapeProperties[prop] == null) {
        options.fromShapeElement.style.removeProperty(prop);
      } else {
        options.fromShapeElement.style.setProperty(prop, oldFromShapeProperties[prop]);
      }
      if (oldToShapeProperties[prop] == null) {
        options.toShapeElement.style.removeProperty(prop);
      } else {
        options.toShapeElement.style.setProperty(prop, oldToShapeProperties[prop]);
      }
      if (oldFromContentProperties[prop] == null) {
        options.fromContentElement.style.removeProperty(prop);
      } else {
        options.fromContentElement.style.setProperty(prop, oldFromContentProperties[prop]);
      }
      if (oldToContentProperties[prop] == null) {
        options.toContentElement.style.removeProperty(prop);
      } else {
        options.toContentElement.style.setProperty(prop, oldToContentProperties[prop]);
      }
    }
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const calculatedDuration = options.duration
        ?? ((shapeTransform.scaleX * shapeTransform.scaleY >= 1) ? EXPAND_DURATION_MS : COLLAPSE_DURATION_MS);
      const totalDuration = calculatedDuration.toString(10);
      const fadeInTime = (calculatedDuration * 0.7).toString(10);
      const fadeOutTime = (calculatedDuration * 0.3).toString(10);
      const transformTransition = transitionProperties
        .filter((prop) => prop !== 'transform-origin' && prop !== 'opacity' && prop !== 'transition')
        .map((prop) => `${prop} ${totalDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1) 0s`)
        .join(', ');
      const fadeInTransition = `opacity ${fadeInTime}ms cubic-bezier(0.0, 0.0, 0.2, 1) ${fadeOutTime}ms`;
      const fadeOutTransition = [
        `opacity ${fadeOutTime}ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms`,
        `visibility ${fadeOutTime}ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms`,
      ].join(', ');

      options.fromShapeElement.style.setProperty('transition', transformTransition);
      for (const prop of transitionProperties) {
        switch (prop) {
          case 'transform': {
            options.fromShapeElement.style.setProperty('transform', shapeTransform.toString());
            continue;
          }
          case 'transition': continue;
          case 'transform-origin':
            options.fromShapeElement.style.setProperty('transform-origin', '0 0 0');
            continue;
          case 'z-index':
            options.fromShapeElement.style.setProperty('z-index', '8');
            continue;
          case 'visibility':
            options.fromShapeElement.style.setProperty('visibility', 'hidden');
            continue;
          default:
            if (newFromShapeProperties[prop] == null) {
              options.fromShapeElement.style.removeProperty(prop);
            } else {
              options.fromShapeElement.style.setProperty(prop, newFromShapeProperties[prop]);
            }
        }
      }

      requestAnimationFrame(() => {
        buildTransitionEndListener(options.fromShapeElement, 'transform', () => {
          for (const prop of transitionProperties) {
            if (prop === 'transition') {
              options.toShapeElement.style.setProperty('transition', 'none');
              options.toContentElement.style.setProperty('transition', 'none');
            } else {
              if (oldToShapeProperties[prop] == null) {
                options.toShapeElement.style.removeProperty(prop);
              } else {
                options.toShapeElement.style.setProperty(prop, oldToShapeProperties[prop]);
              }
              if (oldToContentProperties[prop] == null) {
                options.toContentElement.style.removeProperty(prop);
              } else {
                options.toContentElement.style.setProperty(prop, oldToContentProperties[prop]);
              }
            }

            if (prop === 'visibility' && !options.revertFrom) continue;

            if (oldFromContentProperties[prop] == null) {
              options.fromContentElement.style.removeProperty(prop);
            } else {
              options.fromContentElement.style.setProperty(prop, oldFromContentProperties[prop]);
            }
            if (oldFromShapeProperties[prop] == null) {
              options.fromShapeElement.style.removeProperty(prop);
            } else {
              options.fromShapeElement.style.setProperty(prop, oldFromShapeProperties[prop]);
            }
          }
          if (options.onTransitionEnd) {
            options.onTransitionEnd(options);
          }
          requestAnimationFrame(() => {
            if (oldToShapeProperties.transition == null) {
              options.toShapeElement.style.removeProperty('transition');
            } else {
              options.toShapeElement.style.setProperty('transition', oldToShapeProperties.transition);
            }
            if (oldToContentProperties.transition == null) {
              options.toContentElement.style.removeProperty('transition');
            } else {
              options.toContentElement.style.setProperty('transition', oldToContentProperties.transition);
            }
            options.fromShapeElement.removeAttribute('mdw-transition-busy');
            options.toShapeElement.removeAttribute('mdw-transition-busy');
            options.toContentElement.removeAttribute('mdw-transition-busy');
            options.fromContentElement.removeAttribute('mdw-transition-busy');
            if (options.onComplete) {
              options.onComplete(options);
            }
          });
        }, calculatedDuration);
      });

      // Fade out fromContent while shaping into new content
      options.fromContentElement.style.setProperty('transition', fadeOutTransition);
      options.fromContentElement.style.setProperty('opacity', '0');
      options.fromContentElement.style.setProperty('visibility', 'hidden');

      options.toContentElement.style.setProperty('transition', [
        transformTransition,
        fadeInTransition,
      ].join(', '));
      options.toContentElement.style.setProperty('opacity', '1');
      options.toContentElement.style.setProperty('transform', 'none');
    });
  });

  return revertFunction;
}
