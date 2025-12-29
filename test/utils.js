import { assert } from '@esm-bundle/chai';
import { resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';

import { css } from '../core/css.js';

import { screenshotCompare } from './plugins/screenshotCompare.js';

/**
 * @param {HTMLElement} element
 * @return {{width:number, height:number}}
 */
export function getElementSize(element) {
  const {
    marginTop, marginBottom, marginLeft, marginRight,
  } = window.getComputedStyle(element);
  return {
    height: element.offsetHeight + Number.parseFloat(marginTop) + Number.parseFloat(marginBottom),
    width: element.offsetWidth + Number.parseFloat(marginLeft) + Number.parseFloat(marginRight),
  };
}

/**
 * @template {HTMLElement} T1
 * @template {new (...args:any[]) => T1} T2
 * @param {T2} Constructor
 * @param {boolean} appendToDOM
 * @return {T1}
 */
export function makeFromConstructor(Constructor, appendToDOM = true) {
  const element = new Constructor();
  if (appendToDOM) {
    document.body.append(element);
  }
  // @ts-ignore Skip cast
  return element;
}

/**
 * @param {string} tagName
 * @param {boolean} appendToDOM
 * @return {HTMLElement}
 */
export function makeFromTagName(tagName, appendToDOM = true) {
  const element = document.createElement(tagName);
  if (appendToDOM) {
    document.body.append(element);
  }
  // @ts-ignore Skip cast
  return element;
}

/**
 * @param {string} fromString
 * @param {boolean} appendToDOM
 * @return {HTMLElement}
 */
export function makeFromString(fromString, appendToDOM = true) {
  const fragment = document.createRange().createContextualFragment(fromString);
  const { firstElementChild } = fragment;
  if (appendToDOM) {
    document.body.append(fragment);
  }
  // @ts-ignore Skip cast
  return firstElementChild;
}

/**
 * @template {HTMLElement} T
 * @param {TemplateStringsArray|string} strings
 * @param  {...(string|number|boolean)} substitutions
 * @return {T}
 */
export function html(strings, ...substitutions) {
  const content = typeof strings === 'string' ? strings : String.raw({ raw: strings }, ...substitutions);
  return /** @type {T} */ (makeFromString(content));
}

/**
 * @param {HTMLElement} element
 */
function getMiddleOfElement(element) {
  const { x, y, width, height } = element.getBoundingClientRect();

  return {
    x: Math.floor(x + window.pageXOffset + width / 2),
    y: Math.floor(y + window.pageYOffset + height / 2),
  };
}

/**
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
export async function leftClickElement(element) {
  const { x, y } = getMiddleOfElement(element);

  await sendMouse({ type: 'click', position: [x, y], button: 'left' });
  await resetMouse();
}

/**
 * @param {string} press
 * @return {Promise<void>}
 */
export async function sendKeypress(press) {
  await sendKeys({ press });
}

/**
 * @param {string} down
 * @return {Promise<void>}
 */
export async function sendKeydown(down) {
  await sendKeys({ down });
}

/**
 * @param {string} up
 * @return {Promise<void>}
 */
export async function sendKeyup(up) {
  await sendKeys({ up });
}

/**
 * @param {string} type
 * @return {Promise<void>}
 */
export async function typeKeys(type) {
  await sendKeys({ type });
}

/**
 * @param {Array<typeof import('../core/CustomElement.js').default>} customElements
 * @return {void}
 */
export function disableAnimations(...customElements) {
  for (const ElementClass of customElements) {
    if ('__ANIMATIONS_DISABLED' in ElementClass) continue;
    ElementClass.recompose(({ composition }) => {
      composition.append(css(`
        :host,::before,::after,*,*::before,*::after {
          transition-duration: 0s !important;
          animation-duration: 0s !important;
        }
      `));
    });
    const animateFn = ElementClass.prototype.animate;
    ElementClass.prototype.animate = function disabledAnimate(keyframes, options) {
      return animateFn.call(this, keyframes, {
        ...options,
        duration: 0,
      });
    };
    ElementClass.__ANIMATIONS_DISABLED = true;
  }
}

/** @return {void} */
export async function addRobotoFont() {
  return await new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css?family=Roboto&display=block';
    link.addEventListener('load', async () => {
      await document.fonts.load('16px "Roboto"');
      requestAnimationFrame(resolve);
    });
    link.addEventListener('error', reject);
    document.head.append(link);
  });
}

/**
 * @template T
 * @param {Array<Record<string, T>>} array
 * @param {number} [index=0]
 * @return {[string, T][]}
 */
export function buildObjectMatrix(array, index = 0) {
  const current = array[index];
  const entries = Object.entries(current);
  const next = array[index + 1];
  if (next) {
    const nextEntries = buildObjectMatrix(array, index + 1);
    const newEntries = [];
    for (const [key, value] of entries) {
      if (nextEntries.length === 1) {
        newEntries.push([key, Object.fromEntries([
          ...Object.entries(value),
          ...Object.entries(entries[1]),
        ])]);
      } else {
        for (const [nextKey, nextValue] of nextEntries) {
          newEntries.push([[key, nextKey].join('__'), Object.fromEntries([
            ...Object.entries(value),
            ...Object.entries(nextValue),
          ])]);
        }
      }
    }
    return newEntries;
  }
  return entries;
}

/**
 * @typedef {Object} SceenshotTestGeneratorOptions
 * @prop {string} template
 * @prop {Record<string, any>} [before]
 * @prop {Array<Record<string, any>>} [matrix]
 * @prop {Record<string, any>} [after]
 * @prop {number} [padding=16]
 * @param {SceenshotTestGeneratorOptions} options
 */
export function generateScreenshotTests({ template, before, matrix, after, padding = 16 }) {
  for (const [tag, attributes] of buildObjectMatrix(matrix)) {
    const tags = tag.split('__');
    const listOfStates = tags.slice(0, -1).join(', ');
    const stateDescription = listOfStates ? `${listOfStates}, and ${tags.at(-1)}` : tag;
    // eslint-disable-next-line no-loop-func
    it(`matches screenshot when ${stateDescription}`, async function () {
      makeFromString(`
        <div id=box style="position:fixed;inset:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column">
          <div id=bounds style="position:relative;display:inline-flex;align-items:center;justify-content:center;padding:${padding}px"></div>
        </div>
      `);
      const element = makeFromString(template.trim(), false);
      const bounds = document.getElementById('bounds');
      bounds.append(element);
      let movedMouse = false;
      let movedFocus = true;
      const startTime = performance.now();
      let animationWait = 0;
      /* eslint-disable no-await-in-loop */
      for (const [key, value] of [
        ...Object.entries(before ?? {}),
        ...Object.entries(attributes),
        ...Object.entries(after ?? {}),
      ]) {
        switch (key) {
          case ':focus':
            element.focus();
            movedFocus = true;
            break;
          case ':hover':
          case ':active':
          case ':click': {
            const { x, y } = getMiddleOfElement(element);
            await sendMouse({ type: 'move', position: [x, y] });
            // Firefox is buggy and can sometimes not move the mouse???
            movedMouse = true;
            if (key === ':active' || key === ':click') {
              // eslint-disable-next-line no-await-in-loop
              await sendMouse({ type: 'down', button: 'left' });
            }
            if (key === ':click') {
              await sendMouse({ type: 'up', button: 'left' });
            }
            break;
          }
          case '$wait':
            animationWait = value;
            break;
          default:
            if (key.endsWith('()')) {
              element[key.slice(0, -2)](...value);
            } else {
              element[key] = value;
            }
        }
      }
      /* eslint-enable no-await-in-loop */

      // Webkit times out sooner than 2000ms at times
      this.timeout((Math.max(animationWait * 2), 5000));

      const timeToWait = (startTime + animationWait) - performance.now();
      if (timeToWait > 0) {
        await new Promise((resolve) => setTimeout(resolve, timeToWait));
      }

      const elementTagName = element.tagName.toLowerCase();
      const { percentage, referenceLocation, differenceLocation } = await screenshotCompare(
        `${elementTagName}__${tag}`,
        '#bounds',
      );
      if (movedMouse) {
        await sendMouse({ type: 'move', position: [0, 0] });
        await sendMouse({ type: 'up', button: 'left' });
      }
      if (movedFocus) {
        element.blur();
      }
      assert.isAbove(percentage, 0.99, `Screenshot too different. Compare ${referenceLocation} with ${differenceLocation}`);
    });
  }
}
