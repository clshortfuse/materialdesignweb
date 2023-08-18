/**
 * @license ISC License
 * Copyright (c) 2019, Mapbox
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 */

/** @enum {Object} */
const DEFAULT_OPTIONS = {
  /* matching threshold (0 to 1); smaller is more sensitive */
  threshold: 0.1,
  /* whether to skip anti-aliasing detection */
  includeAA: false,
  /** opacity of original image in diff output */
  alpha: 0.1,
  /* color of anti-aliased pixels in diff output */
  aaColor: [255, 255, 0],
  diffColor: [255, 0, 0], // color of different pixels in diff output
  /**
   * whether to detect dark on light differences between img1 and img2 and set
   * an alternative color to differentiate between the two
   * @type {Array<number>}
   */
  diffColorAlt: null,
  /** draw the diff over a transparent background (a mask) */
  diffMask: false,
};

/**
 * @param {ArrayBufferView} arr
 */
function isPixelData(arr) {
  // work around instanceof Uint8Array not working properly in some Jest environments
  return ArrayBuffer.isView(arr) && arr.constructor.BYTES_PER_ELEMENT === 1;
}

/**
 * Check if a pixel has 3+ adjacent pixels of the same color.
 * @param {Array<number>} img
 * @param {number} x1
 * @param {number} y1
 * @param {number} width
 * @param {number} height
 */
function hasManySiblings(img, x1, y1, width, height) {
  const x0 = Math.max(x1 - 1, 0);
  const y0 = Math.max(y1 - 1, 0);
  const x2 = Math.min(x1 + 1, width - 1);
  const y2 = Math.min(y1 + 1, height - 1);
  const pos = (y1 * width + x1) * 4;
  let zeroes = x1 === x0 || x1 === x2 || y1 === y0 || y1 === y2 ? 1 : 0;

  // go through 8 adjacent pixels
  for (let x = x0; x <= x2; x++) {
    for (let y = y0; y <= y2; y++) {
      if (x === x1 && y === y1) continue;

      const pos2 = 4 * (y * width + x);
      if (img[pos] === img[pos2]
                && img[pos + 1] === img[pos2 + 1]
                && img[pos + 2] === img[pos2 + 2]
                && img[pos + 3] === img[pos2 + 3]) zeroes++;

      if (zeroes > 2) return true;
    }
  }

  return false;
}

/**
 * blend semi-transparent color with white
 * @param {number} color
 * @param {number} alpha
 */
function blend(color, alpha) {
  return 255 + (color - 255) * alpha;
}

/**
 * Returns Y from RGB=>YIQ
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 */
function yFromRGBToYIQ(red, green, blue) {
  return (0.298_895_31 * red) + (0.586_622_47 * green) + (0.114_482_23 * blue);
}

/**
 * Returns I from RGB=>YIQ
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 */
function iFromRGBToYIQ(red, green, blue) {
  return (0.595_977_99 * red) + (-0.274_176_1 * green) + (-0.321_801_89 * blue);
}

/**
 * Returns Q from RGB=>YIQ
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @return {number}
 */
function qFromRGBToYIQ(red, green, blue) {
  return (0.211_470_17 * red) + (-0.522_617_11 * green) + (0.311_146_94 * blue);
}

/**
 * Returns YIQ from RGB
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @return {{y:number, i:number, q:number}}
 */
function yiqFromRGB(red, green, blue) {
  return {
    y: yFromRGBToYIQ(red, green, blue),
    i: iFromRGBToYIQ(red, green, blue),
    q: qFromRGBToYIQ(red, green, blue),
  };
}

/**
 * calculate color difference according to the paper "Measuring perceived color
 * difference using YIQ NTSC transmission color space in mobile applications"
 * by Y. Kotsarenko and F. Ramos
 * @param {Array<number>} img1
 * @param {Array<number>} img2
 * @param {number} k
 * @param {number} m
 * @param {boolean} [yOnly]
 * @return {number}
 */
function colorDelta(img1, img2, k, m, yOnly) {
  let r1 = img1[k + 0];
  let g1 = img1[k + 1];
  let b1 = img1[k + 2];
  let a1 = img1[k + 3];

  let r2 = img2[m + 0];
  let g2 = img2[m + 1];
  let b2 = img2[m + 2];
  let a2 = img2[m + 3];

  if (a1 === a2 && r1 === r2 && g1 === g2 && b1 === b2) return 0;

  if (a1 < 255) {
    a1 /= 255;
    r1 = blend(r1, a1);
    g1 = blend(g1, a1);
    b1 = blend(b1, a1);
  }

  if (a2 < 255) {
    a2 /= 255;
    r2 = blend(r2, a2);
    g2 = blend(g2, a2);
    b2 = blend(b2, a2);
  }

  if (yOnly) {
    return yFromRGBToYIQ(r1, g1, b1) - yFromRGBToYIQ(r2, g2, b2);
  }

  const { y: y1, i: i1, q: q1 } = yiqFromRGB(r1, g1, b1);
  const { y: y2, i: i2, q: q2 } = yiqFromRGB(r2, g2, b2);

  const y = y1 - y2;
  const i = i1 - i2;
  const q = q1 - q2;

  const delta = (0.5053 * y * y) + (0.299 * i * i) + (0.1957 * q * q);

  // encode whether the pixel lightens or darkens in the sign
  return y1 > y2 ? -delta : delta;
}

/**
 * @param {Uint8Array|Uint8ClampedArray} destination
 * @param {number} index
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @return {void}
 */
function drawPixel(destination, index, red, green, blue) {
  destination[index + 0] = red;
  destination[index + 1] = green;
  destination[index + 2] = blue;
  destination[index + 3] = 255;
}

/**
 * @param {Uint8Array|Uint8ClampedArray} source
 * @param {number} index
 * @param {number} alpha
 * @param {Uint8Array|Uint8ClampedArray} destination
 */
function drawGrayPixel(source, index, alpha, destination) {
  const red = source[index + 0];
  const green = source[index + 1];
  const blue = source[index + 2];
  const val = blend(yFromRGBToYIQ(red, green, blue), (alpha * source[index + 3]) / 255);
  drawPixel(destination, index, val, val, val);
}

/**
 * Check if a pixel is likely a part of anti-aliasing;
 *
 * Based on "Anti-aliased Pixel and Intensity Slope Detector" paper by V.
 * Vysniauskas, 2009
 * @param {Array<number>} img
 * @param {number} x1
 * @param {number} y1
 * @param {number} width
 * @param {number} height
 * @param {Array<number>} img2
 */
function antialiased(img, x1, y1, width, height, img2) {
  const x0 = Math.max(x1 - 1, 0);
  const y0 = Math.max(y1 - 1, 0);
  const x2 = Math.min(x1 + 1, width - 1);
  const y2 = Math.min(y1 + 1, height - 1);
  const pos = (y1 * width + x1) * 4;
  let zeroes = x1 === x0 || x1 === x2 || y1 === y0 || y1 === y2 ? 1 : 0;
  let min = 0;
  let max = 0;
  let minX; let minY; let maxX; let
    maxY;

  // go through 8 adjacent pixels
  for (let x = x0; x <= x2; x++) {
    for (let y = y0; y <= y2; y++) {
      if (x === x1 && y === y1) continue;

      // brightness delta between the center pixel and adjacent one
      const delta = colorDelta(img, img, pos, (y * width + x) * 4, true);

      // count the number of equal, darker and brighter adjacent pixels
      if (delta === 0) {
        zeroes++;
        // if found more than 2 equal siblings, it's definitely not anti-aliasing
        if (zeroes > 2) return false;

        // remember the darkest pixel
      } else if (delta < min) {
        min = delta;
        minX = x;
        minY = y;

        // remember the brightest pixel
      } else if (delta > max) {
        max = delta;
        maxX = x;
        maxY = y;
      }
    }
  }

  // if there are no both darker and brighter pixels among siblings, it's not anti-aliasing
  if (min === 0 || max === 0) return false;

  // if either the darkest or the brightest pixel has 3+ equal siblings in both images
  // (definitely not anti-aliased), this pixel is anti-aliased
  return (hasManySiblings(img, minX, minY, width, height)
            && hasManySiblings(img2, minX, minY, width, height))
      || (hasManySiblings(img, maxX, maxY, width, height)
        && hasManySiblings(img2, maxX, maxY, width, height));
}

/**
 * @param {Uint8Array|Uint8ClampedArray} img1
 * @param {Uint8Array|Uint8ClampedArray} img2
 * @param {Uint8Array|Uint8ClampedArray} output
 * @param {number} width
 * @param {number} height
 * @param {typeof DEFAULT_OPTIONS} [options]
 * @return {number}
 */
export function pixelmatch(img1, img2, output, width, height, options) {
  if (!isPixelData(img1) || !isPixelData(img2) || (output && !isPixelData(output))) {
    throw new Error('Image data: Uint8Array, Uint8ClampedArray or Buffer expected.');
  }

  if (img1.length !== img2.length || (output && output.length !== img1.length)) {
    // throw new Error('Image sizes do not match.');
    return Number.POSITIVE_INFINITY;
  }

  if (img1.length !== width * height * 4) {
    // throw new Error('Image data size does not match width/height.');
    return Number.POSITIVE_INFINITY;
  }
  options = { ...DEFAULT_OPTIONS, ...options };

  // check if images are identical
  const len = width * height;
  const a32 = new Uint32Array(img1.buffer, img1.byteOffset, len);
  const b32 = new Uint32Array(img2.buffer, img2.byteOffset, len);
  let identical = true;

  for (let i = 0; i < len; i++) {
    if (a32[i] !== b32[i]) { identical = false; break; }
  }
  if (identical) { // fast path if identical
    if (output && !options.diffMask) {
      for (let i = 0; i < len; i++) drawGrayPixel(img1, 4 * i, options.alpha, output);
    }
    return 0;
  }

  // maximum acceptable square distance between two colors;
  // 35215 is the maximum possible value for the YIQ difference metric
  const maxDelta = 35_215 * options.threshold * options.threshold;
  let diff = 0;

  // compare each pixel of one image against the other one
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = (y * width + x) * 4;

      // squared YUV distance between colors at this pixel position, negative if the img2 pixel is darker
      const delta = colorDelta(img1, img2, pos, pos);

      // the color difference is above the threshold
      if (Math.abs(delta) > maxDelta) {
        // check it's a real rendering difference or just anti-aliasing
        if (!options.includeAA && (antialiased(img1, x, y, width, height, img2)
                                           || antialiased(img2, x, y, width, height, img1))) {
          // one of the pixels is anti-aliasing; draw as yellow and do not count as difference
          // note that we do not include such pixels in a mask
          if (output && !options.diffMask) drawPixel(output, pos, ...options.aaColor);
        } else {
          // found substantial difference not caused by anti-aliasing; draw it as such
          if (output) {
            drawPixel(output, pos, ...(delta < 0 && options.diffColorAlt || options.diffColor));
          }
          diff++;
        }
      } else if (output // pixels are similar; draw background as grayscale image blended with white
                && !options.diffMask) drawGrayPixel(img1, pos, options.alpha, output);
    }
  }

  // return the number of different pixels
  return diff;
}
