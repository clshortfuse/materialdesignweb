import { Blob } from 'node:buffer';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join as joinPath, resolve } from 'node:path';

const MIME_TYPE = 'image/png';

/**
 * @typedef {Object} ScreenshotComparePayload {
 * @prop {string} tag snapshot tag
 * @prop {string} [selector]
 */

/**
 * @param {Buffer} buffer
 * @return {string}
 */
function urlObjectFromBuffer(buffer) {
  return `data:${MIME_TYPE};base64,${buffer.toString('base64')}`;
}

/**
 * @param {string} tag
 * @param {import('@web/test-runner-core').BasicTestSession} session
 * @return {string}
 */
function DEFAULT_GET_REFERENCE_LOCATION(tag, session) {
  return joinPath(
    'screenshots',
    'reference',
    session.browser.name.toLowerCase(),
    resolve('/', `${tag}.png`), // Resolve against '/' to not allow leak
  );
}

/**
 * @param {string} tag
 * @param {import('@web/test-runner-core').BasicTestSession} session
 * @return {string}
 */
function DEFAULT_GET_DIFFERENCE_LOCATION(tag, session) {
  return joinPath(
    'screenshots',
    'difference',
    session.browser.name.toLowerCase(),
    resolve('/', `${tag}.png`), // Resolve against '/' to not allow leak
  );
}

/**
 * @param {string} location
 * @return {Promise<string|null>} returns null is not found
 */
async function DEFAULT_GET_ASSET(location) {
  let url;
  let path;
  try {
    url = new URL(location);
  } catch {
    path = resolve(location);
  }

  /** @type {Buffer} */
  let buffer;
  if (url) {
    const response = await fetch(url);
    if (response.status === 404) return null;
    buffer = Buffer.from(await response.arrayBuffer());
  } else if (path) {
    try {
      buffer = await readFile(path);
    } catch (e) {
      if (e?.code === 'ENOENT') return null;
      throw e;
    }
  } else {
    throw new Error(`Invalid location: ${location}`);
  }
  return urlObjectFromBuffer(buffer);
}

/**
 * @param {string|Buffer|Blob} data
 * @return {Promise<Blob>}
 */
async function encodeDataToBlob(data) {
  if (data instanceof Blob) {
    return data;
  }
  if (Buffer.isBuffer(data)) {
    return new Blob([data]);
  }
  return await fetch(data).then((response) => response.blob());
}

/**
 * @param {string|Buffer|Blob} data
 * @return {Promise<Buffer>}
 */
async function encodeDataToBuffer(data) {
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Blob) {
    return Buffer.from(await data.arrayBuffer());
  }

  return await fetch(data)
    .then((response) => response.arrayBuffer())
    .then((buffer) => Buffer.from(buffer));
}

/**
 * @param {string} location
 * @param {Blob|Buffer|string} [data] null for delete
 * @return {Promise<any>}
 */
async function DEFAULT_WRITE_ASSET(location, data) {
  let url;
  let path;
  try {
    url = new URL(location);
  } catch {
    path = resolve(location);
  }

  if (url) {
    if (data) {
      await fetch(url, { method: 'DELETE' });
    } else {
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/png' },
        body: await encodeDataToBlob(data),
      });
    }
  } else if (path) {
    if (data) {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, await encodeDataToBuffer(data));
    } else {
      try {
        await rm(path);
      } catch (e) {
        if (e?.code !== 'ENOENT') throw e;
      }
    }
  } else {
    throw new Error(`Invalid location: ${location}`);
  }
}

/**
 * @typedef {Object} ScreenshotCompareConfiguration
 * @prop {boolean|'auto'} [create]
 * @prop {typeof DEFAULT_GET_REFERENCE_LOCATION} [getReferenceLocation]
 * @prop {typeof DEFAULT_GET_DIFFERENCE_LOCATION} [getDifferenceLocation]
 * @prop {typeof DEFAULT_GET_ASSET} [getAsset]
 * @prop {typeof DEFAULT_WRITE_ASSET} [writeAsset]
 */

/**
 * @param {ScreenshotCompareConfiguration} [options]
 * @return {import('@web/test-runner-core').TestRunnerPlugin<ScreenshotComparePayload>}
 */
export function screenshotComparePlugin(options = {}) {
  return {
    name: 'screenshot-compare-plugin',
    async executeCommand({ command, session, payload }) {
      if (command !== 'screenshot-compare-command') return undefined;

      const {
        create,
        getAsset,
        writeAsset,
        getReferenceLocation,
        getDifferenceLocation,
      } = {
        create: 'auto',
        getAsset: DEFAULT_GET_ASSET,
        writeAsset: DEFAULT_WRITE_ASSET,
        getReferenceLocation: DEFAULT_GET_REFERENCE_LOCATION,
        getDifferenceLocation: DEFAULT_GET_DIFFERENCE_LOCATION,
        ...options,
      };

      const tag = payload.tag;
      if (!tag) throw new Error('Tag cannot be empty.');

      const referenceLocation = getReferenceLocation(tag, session);

      const selector = payload.selector || 'body';

      // TODO: Fetch reference and snapshot at same time

      let expected;
      let shouldWrite = false;

      if (create === true) {
        shouldWrite = true;
      } else {
        const reference = await getAsset(referenceLocation);
        if (create) { // truthy defaults 'auto'
          if (reference) {
            expected = reference;
          } else {
            shouldWrite = true;
          }
        } else if (!reference) {
          console.error('will throw, not found');
          throw new Error(`No reference found for ${tag}`);
        }
      }

      /** @type {Buffer} */
      let screenshot;

      switch (session.browser.type) {
        case 'puppeteer': {
        /** @type {import('@web/test-runner-chrome').ChromeLauncher}  */
          const browser = session.browser;
          const page = browser.getPage(session.id);

          const element = await page.$(selector);

          screenshot = /** @type {Buffer} */ (await element.screenshot({ encoding: 'binary' }));
          break;
        }
        case 'playwright': {
          /** @type {import('@web/test-runner-playwright').PlaywrightLauncher} */
          const browser = session.browser;
          const page = browser.getPage(session.id);

          const element = page.locator(selector);

          screenshot = await element.screenshot();
          break;
        }
        case 'webdriver': {
        /** @type {import('@web/test-runner-webdriver').WebdriverLauncher} */
          const browser = session.browser;

          screenshot = await browser.takeScreenshot(session.id, selector);
          break;
        }
        default:
          throw new Error(`Unsupported browser type: ${session.browser.type}`);
      }

      const actual = urlObjectFromBuffer(screenshot);

      if (shouldWrite) {
        writeAsset(referenceLocation, screenshot);
        expected = actual;
      }

      const differenceLocation = getDifferenceLocation(tag, session);
      writeAsset(differenceLocation, actual === expected ? null : screenshot);

      return { actual, expected, referenceLocation, differenceLocation };
    },
  };
}
