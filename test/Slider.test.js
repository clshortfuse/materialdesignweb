import { assert } from '@esm-bundle/chai';

import Slider from '../components/Slider.js';
import '../theming/loader.js';

/** @return {InstanceType<Slider>} */
function makeComponent() {
  const element = new Slider();
  document.body.append(element);
  // @ts-ignore
  return element;
}

/**
 * @param {string} fromString
 * @return {InstanceType<Slider>}
 */
function makeFromString(fromString) {
  const { firstElementChild } = document.createRange().createContextualFragment(fromString);
  document.body.append(firstElementChild);
  // @ts-ignore
  return firstElementChild;
}

beforeEach(() => {
  document.body.replaceChildren();
});

describe('mdw-slider', () => {
  it('can be created with document.createElement', () => {
    const slider = document.createElement('mdw-slider');
    assert.equal(slider.constructor.elementName, 'mdw-slider');
  });

  it('can be created with new ()', () => {
    const slider = new Slider();
    assert.equal(slider.constructor.elementName, 'mdw-slider');
  });

  describe('layout', () => {
    it('should have block display', () => {
      const slider = makeComponent();
      assert.equal(window.getComputedStyle(slider).display, 'block');
    });
  });

  describe('[value]', () => {
    it('should have blank defaultValue', () => {
      const slider = makeComponent();
      assert.isFalse(slider.hasAttribute('value'));
      assert.equal(slider.defaultValue, '');
    });

    it('should be configurable on creation', () => {
      const slider = makeFromString('<mdw-slider value=80></mdw-slider>');
      assert.equal(slider.getAttribute('value'), '80');
      assert.equal(slider.defaultValue, '80');
      assert.equal(slider.value, '80');
    });

    it('should be configurable over property', () => {
      const slider = makeFromString('<mdw-slider></mdw-slider>');
      slider.defaultValue = '80';
      assert.equal(slider.defaultValue, '80');
      assert.equal(slider.value, '80');
    });

    it('should be configurable over attribute', () => {
      const slider = makeFromString('<mdw-slider></mdw-slider>');
      slider.setAttribute('value', '80');
      assert.equal(slider.defaultValue, '80');
      assert.equal(slider.value, '80');
    });
  });

  describe('[min]', () => {
    it('should have unspecified default min', () => {
      const slider = makeComponent();
      assert.isFalse(slider.hasAttribute('min'));
      assert.equal(slider.min, '');
    });
    it('should be configurable on creation', () => {
      const slider = makeFromString('<mdw-slider min=30></mdw-slider>');
      assert.equal(slider.getAttribute('min'), '30');
      assert.equal(slider.min, '30');
      assert.equal(slider.value, '65');
    });

    it('should be configurable over property', () => {
      const slider = makeFromString('<mdw-slider></mdw-slider>');
      assert.equal(slider.min, '');
      assert.equal(slider.value, '50');

      slider.min = '30';
      assert.equal(slider.min, '30');
      assert.equal(slider.getAttribute('min'), '30');
      assert.equal(slider.value, '65');
    });

    it('should be configurable over attribute', () => {
      const slider = makeFromString('<mdw-slider></mdw-slider>');
      assert.equal(slider.min, '');
      assert.equal(slider.value, '50');

      slider.setAttribute('min', '30');
      assert.equal(slider.min, '30');
      assert.equal(slider.getAttribute('min'), '30');
      assert.equal(slider.value, '65');
    });

    it('should override [value] on creation', () => {
      const slider = makeFromString('<mdw-slider min=50 value=30></mdw-slider>');
      assert.equal(slider.min, '50');
      assert.equal(slider.defaultValue, '30');
      assert.equal(slider.value, '50');
    });

    it('should change computed value', () => {
      const slider = makeFromString('<mdw-slider value=30></mdw-slider>');
      assert.equal(slider.min, '');
      assert.equal(slider.defaultValue, '30');
      assert.equal(slider.value, '30');
      slider.min = '50';
      assert.equal(slider.min, '50');
      assert.equal(slider.defaultValue, '30');
      assert.equal(slider.value, '50');
    });
  });

  describe('[max]', () => {
    it('should have unspecified default max', () => {
      const slider = makeComponent();
      assert.isFalse(slider.hasAttribute('max'));
      assert.equal(slider.max, '');
    });
    it('should be configurable on creation', () => {
      const slider = makeFromString('<mdw-slider max=30></mdw-slider>');
      assert.equal(slider.getAttribute('max'), '30');
      assert.equal(slider.max, '30');
      assert.equal(slider.value, '15');
    });

    it('should be configurable over property', () => {
      const slider = makeFromString('<mdw-slider></mdw-slider>');
      assert.equal(slider.max, '');
      assert.equal(slider.value, '50');

      slider.max = '30';
      assert.equal(slider.max, '30');
      assert.equal(slider.getAttribute('max'), '30');
      assert.equal(slider.value, '15');
    });

    it('should be configurable over attribute', () => {
      const slider = makeFromString('<mdw-slider></mdw-slider>');
      assert.equal(slider.max, '');
      assert.equal(slider.value, '50');

      slider.setAttribute('max', '30');
      assert.equal(slider.max, '30');
      assert.equal(slider.getAttribute('max'), '30');
      assert.equal(slider.value, '15');
    });

    it('should override [value] on creation', () => {
      const slider = makeFromString('<mdw-slider max=30 value=50></mdw-slider>');
      assert.equal(slider.max, '30');
      assert.equal(slider.defaultValue, '50');
      assert.equal(slider.value, '30');
    });

    it('should change computed value', () => {
      const slider = makeFromString('<mdw-slider value=50></mdw-slider>');
      assert.equal(slider.max, '');
      assert.equal(slider.defaultValue, '50');
      assert.equal(slider.value, '50');
      slider.max = '30';
      assert.equal(slider.max, '30');
      assert.equal(slider.defaultValue, '50');
      assert.equal(slider.value, '30');
    });
  });

  describe('[step]', () => {
    it('should have unspecified default step', () => {
      const slider = makeComponent();
      assert.isFalse(slider.hasAttribute('step'));
      assert.equal(slider.step, '');
    });
    it('should be configurable on creation', () => {
      const slider = makeFromString('<mdw-slider step=10></mdw-slider>');
      assert.equal(slider.getAttribute('step'), '10');
      assert.equal(slider.step, '10');
      assert.equal(slider.value, '50');
    });

    it('should be configurable over property', () => {
      const slider = makeFromString('<mdw-slider></mdw-slider>');
      assert.equal(slider.step, '');
      assert.equal(slider.value, '50');

      slider.step = '10';
      assert.equal(slider.step, '10');
      assert.equal(slider.getAttribute('step'), '10');
      assert.equal(slider.value, '50');
    });

    it('should be configurable over attribute', () => {
      const slider = makeFromString('<mdw-slider></mdw-slider>');
      assert.equal(slider.step, '');
      assert.equal(slider.value, '50');

      slider.setAttribute('step', '10');
      assert.equal(slider.step, '10');
      assert.equal(slider.getAttribute('step'), '10');
      assert.equal(slider.value, '50');
    });

    it('should not override [value] on creation', function () {
      const slider = makeFromString('<mdw-slider step=10 value=1></mdw-slider>');
      assert.equal(slider.step, '10');
      assert.equal(slider.defaultValue, '1');
      if (slider.value !== '1' && navigator.userAgent.includes('Safari')) {
      // https://bugs.webkit.org/show_bug.cgi?id=254761
        this.skip();
      } else {
        assert.equal(slider.value, '1');
      }
    });

    it('should not change computed value', function () {
      const slider = makeFromString('<mdw-slider value=1></mdw-slider>');
      assert.equal(slider.step, '');
      assert.equal(slider.defaultValue, '1');
      assert.equal(slider.value, '1');
      slider.step = '10';
      assert.equal(slider.step, '10');
      assert.equal(slider.defaultValue, '1');
      if (slider.value !== '1' && navigator.userAgent.includes('Safari')) {
        console.warn('Skipping test due to Wekbit Bug 254761');
        // https://bugs.webkit.org/show_bug.cgi?id=254761
        this.skip();
      } else {
        assert.equal(slider.value, '1');
      }
    });

    it('should override [value] with [min] on creation', function () {
      const slider = makeFromString('<mdw-slider step=10 min=0 value=1></mdw-slider>');
      assert.equal(slider.step, '10');
      assert.equal(slider.defaultValue, '1');
      if (slider.value !== '0' && navigator.userAgent.includes('Safari')) {
        // https://bugs.webkit.org/show_bug.cgi?id=254761
        console.warn('Skipping test due to Wekbit Bug 254761');
        this.skip();
      } else {
        assert.equal(slider.value, '0');
      }
    });

    it('should change computed value with [min]', () => {
      const slider = makeFromString('<mdw-slider min=0 value=1></mdw-slider>');
      assert.equal(slider.step, '');
      assert.equal(slider.defaultValue, '1');
      assert.equal(slider.value, '1');
      slider.step = '10';
      assert.equal(slider.step, '10');
      assert.equal(slider.defaultValue, '1');
      assert.equal(slider.value, '0');
    });
  });

  describe('theming', () => {
    it('should have default bg of primary', () => {
      const slider = makeComponent();
      const styles = window.getComputedStyle(slider);
      assert(styles.getPropertyValue('--mdw-bg'), 'var(--mdw-color__primary)');
    });
    it('should have default ink of on-primary', () => {
      const slider = makeComponent();
      const styles = window.getComputedStyle(slider);
      assert(styles.getPropertyValue('--mdw-ink'), 'var(--mdw-color__on-primary)');
    });
  });
});
