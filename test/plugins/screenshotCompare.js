import { executeServerCommand } from '@web/test-runner-commands';

import { pixelmatch } from '../../utils/pixelmatch.js';

/**
 *
 * @param {number} width
 * @param {number} height
 * @param {(canvas: HTMLCanvasElement) => Promise<any>|any} callback
 */
export async function useCanvas(width, height, callback) {
  // Offscreen canvas not supported
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  document.body.append(canvas);
  await callback(canvas);
  canvas.remove();
}

/**
 * @param {string} url
 */
export async function urlToImageData(url) {
  const image = new Image();
  image.src = url;
  await new Promise((resolve, reject) => {
    image.addEventListener('load', resolve);
    image.addEventListener('error', reject);
  });
  const { width, height } = image;

  /** @type {ImageData} */
  let imageData;
  await useCanvas(width, height, (canvas) => {
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);
    imageData = context.getImageData(0, 0, width, height);
  });
  return imageData;
}

/**
 * @param {string} tag snapshot tag
 * @param {string} [selector]
 * @return {Promise<{percentage:number, referenceLocation: string, differenceLocation: string}>}
 */
export async function screenshotCompare(tag, selector = 'body') {
  const { actual, expected, referenceLocation, differenceLocation } = await executeServerCommand('screenshot-compare-command', { tag, selector });

  let percentage = 1;
  if (actual !== expected) {
    // Perform retry (flaky?)
    // ({ actual, expected } = await executeServerCommand('screenshot-compare-command', { tag, selector }));
    // if (actual === expected) return 1;

    const [actualImage, expectedImage] = await Promise.all([
      urlToImageData(actual),
      urlToImageData(expected),
    ]);
    // Actually perform comparison
    const { width, height, data } = actualImage;
    const changedPixels = pixelmatch(data, expectedImage.data, null, width, height);
    percentage = (1 - (changedPixels / (width * height)));
  }
  return {
    percentage,
    referenceLocation,
    differenceLocation,
  };
}
