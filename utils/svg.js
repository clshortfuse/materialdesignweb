/**
 * @param {string} path
 * @param {Object} [options]
 * @param {number} [options.size=24]
 * @param {boolean} [options.outline] Outline path
 * @return {string}
 */
export function pathToSVG(path, options = {}) {
  const svgSize = 24;
  const outline = options.outline;
  /* eslint-disable indent */
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" preserveAspectRatio="none">`,
      outline
       ? `
        <mask id="m">
          <rect width="24" height="24" fill="white"/>
          <path fill="black" d="${path}"/>
        </mask>
        <rect width="24" height="24" fill="black" mask="url(#m)"/>
      `
      : `<path fill="black" d="${path}"/>`,
    '</svg>',
  ].join('');
  /* eslint-enable indent */
}

/**
 * @param {string} path
 * @param {Object} [options]
 * @param {number} [options.size=24]
 * @param {boolean} [options.outline] Outline path
 * @return {string}
 */
export function maskedPathToSVG(path, options = {}) {
  const svgSize = 24;
  const outline = options.outline;
  /* eslint-disable indent */
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" preserveAspectRatio="none">`,
      outline
       ? `
       <defs>
          <path id="p" d="${path}"/>
        </defs>
        <mask id="m">
          <use href="#p" fill="white"/>
          <use href="#p" fill="black" transform="scale(0.9166666666666667) translate(1 1)"/>
        </mask>
        <use href="#p" fill="black" mask="url(#m)"/>
      `
      : `<path fill="black" d="${path}"/>`,
    '</svg>',
  ].join('');
  /* eslint-enable indent */
}

/**
 * @param {string} path
 * @param {Object} [options]
 * @param {number} [options.size=24]
 * @param {string} [options.outline] Outline path
 * @return {string}
 */
export function auto9SliceSVG(path, options = {}) {
  const pathSize = options.size ?? 24;
  const svgSize = 24;
  const outline = options.outline;
  /* eslint-disable indent */
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}">`,
      '<defs>',
        `<path id="p" d="${path}"/>`,
        '<g id="g">',
          '<use href="#p" transform="translate(0 0)"/>',
          `<use href="#p" transform="translate(${svgSize - pathSize} 0)"/>`,
          `<use href="#p" transform="translate(${svgSize - pathSize} ${svgSize - pathSize})"/>`,
          `<use href="#p" transform="translate(0 ${svgSize - pathSize})"/>`,
          '<path d="',
            `M${pathSize / 2} 0`,
            `H${svgSize - (pathSize / 2)}`,
            `V${pathSize / 2}`,
            `H${svgSize}`,
            `V${svgSize - (pathSize / 2)}`,
            `H${svgSize - (pathSize / 2)}`,
            `V${svgSize}`,
            `H${pathSize / 2}`,
            `V${svgSize - (pathSize / 2)}`,
            'H0',
            `V${pathSize / 2}`,
            `H${pathSize / 2}`,
            'Z',
          '"/>',
        '</g>',
      '</defs>',
      outline
      ? [
        '<mask id="m">',
          '<use href="#g" fill="white"/>',
          `<use href="#g" fill="black" transform="scale(0.5) translate(${pathSize / 2} ${pathSize / 2})" />`,
          `<use href="#g" fill="black" transform="scale(0.5) translate(${svgSize - (pathSize / 2)} ${pathSize / 2})" />`,
          `<use href="#g" fill="black" transform="scale(0.5) translate(${svgSize - (pathSize / 2)} ${svgSize - (pathSize / 2)})" />`,
          `<use href="#g" fill="black" transform="scale(0.5) translate(${pathSize / 2} ${svgSize - (pathSize / 2)})" />`,
        '</mask>',
        '<path d="',
          'M0 0',
          `H${svgSize}`,
          `V${svgSize}`,
          'H0',
          'Z',
        '" fill="black" mask="url(#m)"/>',
      ].join('') : '<use href="#g" fill="black"/>',
    '</svg>',
  ].join('');
  /* eslint-enable indent */
}

/**
 * Uses UTF-8 charset instead of base64 for better compression
 * @param {string} svg
 * @return {string}
 */
export function svgToCSSURL(svg) {
  return `url('data:image/svg+xml;charset=UTF-8,${svg
    .replaceAll('\n', ' ')
    .replaceAll('#', '%23')
    .replaceAll('(', '%28')
    .replaceAll(')', '%29')}')`;
}
