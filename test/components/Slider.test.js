import { assert } from '@esm-bundle/chai';

import Slider from '../../components/Slider.js';
import '../../theming/loader.js';
import { axTree, html, iterateMeaningfulAXNodes, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('mdw-slider', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-slider');
    assert.equal(element.tagName.toLowerCase(), 'mdw-slider');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(Slider);
    assert.equal(element.tagName.toLowerCase(), 'mdw-slider');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-slider>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-slider');
  });

  describe('layout', () => {
    it('should have block display', () => {
      const element = html`<mdw-slider></mdw-slider>`;
      assert.equal(window.getComputedStyle(element).display, 'block');
    });
  });

  describe('[value]', () => {
    it('should have blank defaultValue', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      assert.isFalse(element.hasAttribute('value'));
      assert.equal(element.defaultValue, '');
    });

    it('should be configurable on creation', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider value=80></mdw-slider>`;
      assert.equal(element.getAttribute('value'), '80');
      assert.equal(element.defaultValue, '80');
      assert.equal(element.value, '80');
    });

    it('should be configurable over property', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      element.defaultValue = '80';
      assert.equal(element.defaultValue, '80');
      assert.equal(element.value, '80');
    });

    it('should be configurable over attribute', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      element.setAttribute('value', '80');
      assert.equal(element.defaultValue, '80');
      assert.equal(element.value, '80');
    });
  });

  describe('[min]', () => {
    it('should have unspecified default min', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      assert.isFalse(element.hasAttribute('min'));
      assert.equal(element.min, '');
    });
    it('should be configurable on creation', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider min=30></mdw-slider>`;
      assert.equal(element.getAttribute('min'), '30');
      assert.equal(element.min, '30');
      assert.equal(element.value, '65');
    });

    it('should be configurable over property', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      assert.equal(element.min, '');
      assert.equal(element.value, '50');

      element.min = '30';
      assert.equal(element.min, '30');
      assert.equal(element.getAttribute('min'), '30');
      assert.equal(element.value, '65');
    });

    it('should be configurable over attribute', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      assert.equal(element.min, '');
      assert.equal(element.value, '50');

      element.setAttribute('min', '30');
      assert.equal(element.min, '30');
      assert.equal(element.getAttribute('min'), '30');
      assert.equal(element.value, '65');
    });

    it('should override [value] on creation', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider min=50 value=30></mdw-slider>`;
      assert.equal(element.min, '50');
      assert.equal(element.defaultValue, '30');
      assert.equal(element.value, '50');
    });

    it('should change computed value', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider value=30></mdw-slider>`;
      assert.equal(element.min, '');
      assert.equal(element.defaultValue, '30');
      assert.equal(element.value, '30');
      element.min = '50';
      assert.equal(element.min, '50');
      assert.equal(element.defaultValue, '30');
      assert.equal(element.value, '50');
    });
  });

  describe('[max]', () => {
    it('should have unspecified default max', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      assert.isFalse(element.hasAttribute('max'));
      assert.equal(element.max, '');
    });
    it('should be configurable on creation', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider max=30></mdw-slider>`;
      assert.equal(element.getAttribute('max'), '30');
      assert.equal(element.max, '30');
      assert.equal(element.value, '15');
    });

    it('should be configurable over property', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      assert.equal(element.max, '');
      assert.equal(element.value, '50');

      element.max = '30';
      assert.equal(element.max, '30');
      assert.equal(element.getAttribute('max'), '30');
      assert.equal(element.value, '15');
    });

    it('should be configurable over attribute', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      assert.equal(element.max, '');
      assert.equal(element.value, '50');

      element.setAttribute('max', '30');
      assert.equal(element.max, '30');
      assert.equal(element.getAttribute('max'), '30');
      assert.equal(element.value, '15');
    });

    it('should override [value] on creation', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider max=30 value=50></mdw-slider>`;
      assert.equal(element.max, '30');
      assert.equal(element.defaultValue, '50');
      assert.equal(element.value, '30');
    });

    it('should change computed value', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider value=50></mdw-slider>`;
      assert.equal(element.max, '');
      assert.equal(element.defaultValue, '50');
      assert.equal(element.value, '50');
      element.max = '30';
      assert.equal(element.max, '30');
      assert.equal(element.defaultValue, '50');
      assert.equal(element.value, '30');
    });
  });

  describe('[step]', () => {
    it('should have unspecified default step', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      assert.isFalse(element.hasAttribute('step'));
      assert.equal(element.step, '');
    });
    it('should be configurable on creation', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider step=10></mdw-slider>`;
      assert.equal(element.getAttribute('step'), '10');
      assert.equal(element.step, '10');
      assert.equal(element.value, '50');
    });

    it('should be configurable over property', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      assert.equal(element.step, '');
      assert.equal(element.value, '50');

      element.step = '10';
      assert.equal(element.step, '10');
      assert.equal(element.getAttribute('step'), '10');
      assert.equal(element.value, '50');
    });

    it('should be configurable over attribute', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      assert.equal(element.step, '');
      assert.equal(element.value, '50');

      element.setAttribute('step', '10');
      assert.equal(element.step, '10');
      assert.equal(element.getAttribute('step'), '10');
      assert.equal(element.value, '50');
    });

    it('should not override [value] on creation', function () {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider step=10 value=1></mdw-slider>`;
      assert.equal(element.step, '10');
      assert.equal(element.defaultValue, '1');
      if (element.value !== '1' && navigator.userAgent.includes('Safari')) {
      // https://bugs.webkit.org/show_bug.cgi?id=254761
        this.skip();
      } else {
        assert.equal(element.value, '1');
      }
    });

    it('should not change computed value', function () {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider value=1></mdw-slider>`;
      assert.equal(element.step, '');
      assert.equal(element.defaultValue, '1');
      assert.equal(element.value, '1');
      element.step = '10';
      assert.equal(element.step, '10');
      assert.equal(element.defaultValue, '1');
      if (element.value !== '1' && navigator.userAgent.includes('Safari')) {
        console.warn('Skipping test due to Wekbit Bug 254761');
        // https://bugs.webkit.org/show_bug.cgi?id=254761
        this.skip();
      } else {
        assert.equal(element.value, '1');
      }
    });

    it('should override [value] with [min] on creation', function () {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider step=10 min=0 value=1></mdw-slider>`;
      assert.equal(element.step, '10');
      assert.equal(element.defaultValue, '1');
      if (element.value !== '0' && navigator.userAgent.includes('Safari')) {
        // https://bugs.webkit.org/show_bug.cgi?id=254761
        console.warn('Skipping test due to Wekbit Bug 254761');
        this.skip();
      } else {
        assert.equal(element.value, '0');
      }
    });

    it('should change computed value with [min]', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider min=0 value=1></mdw-slider>`;
      assert.equal(element.step, '');
      assert.equal(element.defaultValue, '1');
      assert.equal(element.value, '1');
      element.step = '10';
      assert.equal(element.step, '10');
      assert.equal(element.defaultValue, '1');
      assert.equal(element.value, '0');
    });
  });

  describe('aria', () => {
    it('returns slider role', async () => {
      const element = html`<mdw-slider></mdw-slider>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'slider');
    });

    it('supports aria-label', async () => {
      const element = html`<mdw-slider aria-label=foo></mdw-slider>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });
  });

  describe('theming', () => {
    it('should have default bg of primary', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      const styles = window.getComputedStyle(element);
      assert(styles.getPropertyValue('--mdw-bg'), 'var(--mdw-color__primary)');
    });
    it('should have default ink of on-primary', () => {
      /** @type {InstanceType<Slider>} */
      const element = html`<mdw-slider></mdw-slider>`;
      const styles = window.getComputedStyle(element);
      assert(styles.getPropertyValue('--mdw-ink'), 'var(--mdw-color__on-primary)');
    });
  });
});
