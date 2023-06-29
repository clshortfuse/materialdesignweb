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
        console.warn('Skipping test due to Webkit Bug 254761');
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

  /* eslint-disable camelcase */
  /** @see http://wpt.live/html/semantics/forms/the-input-element/range.html */
  describe('wpt - range.html', () => {
    it('range type support on input element', () => {
      /** @type {InstanceType<Slider>} */
      const range_basic = html`<mdw-slider min=0 max=5></mdw-slider>`;
      assert.equal(range_basic.type, 'range');
    });

    it('min attribute support on input element', () => {
      /** @type {InstanceType<Slider>} */
      const range_basic = html`<mdw-slider min=0 max=5></mdw-slider>`;
      assert.equal(range_basic.min, '0');
    });

    it('max attribute support on input element', () => {
      /** @type {InstanceType<Slider>} */
      const range_basic = html`<mdw-slider min=0 max=5></mdw-slider>`;
      assert.equal(range_basic.max, '5');
    });

    it('Illegal value of min attribute', () => {
      /** @type {InstanceType<Slider>} */
      const illegal_min_and_max = html`<mdw-slider min="ab" max="f"></mdw-slider>`;
      assert.equal(illegal_min_and_max.min, 'ab');
    });

    it('Illegal value of max attribute', () => {
      /** @type {InstanceType<Slider>} */
      const illegal_min_and_max = html`<mdw-slider min="ab" max="f"></mdw-slider>`;
      assert.equal(illegal_min_and_max.max, 'f');
    });

    it('Converting an illegal string to the default value', () => {
      /** @type {InstanceType<Slider>} */
      const illegal_value_and_step = html`<mdw-slider min=0 max=5 value="ppp" step="xyz"></mdw-slider>`;
      assert.equal(illegal_value_and_step.value, '3');
    });

    it('Illegal value of step attribute', () => {
      /** @type {InstanceType<Slider>} */
      const illegal_value_and_step = html`<mdw-slider min=0 max=5 value="ppp" step="xyz"></mdw-slider>`;
      assert.equal(illegal_value_and_step.step, 'xyz');
    });

    it('the value is set to min when a smaller value than min attribute is given', () => {
      /** @type {InstanceType<Slider>} */
      const value_smaller_than_min = html`<mdw-slider min=0 max=5 value=-10></mdw-slider>`;
      assert.equal(value_smaller_than_min.value, '0');
    });

    it('the value is set to max when a larger value than max attribute is given', () => {
      /** @type {InstanceType<Slider>} */
      const value_larger_than_max = html`<mdw-slider min=0 max=5 value=7></mdw-slider>`;
      assert.equal(value_larger_than_max.value, '5');
    });

    it('default value of min attribute in input type=range', () => {
      /** @type {InstanceType<Slider>} */
      const empty_attributes = html`<mdw-slider></mdw-slider>`;
      assert.equal(empty_attributes.min, '');
    });

    it('default value of max attribute in input type=range', () => {
      /** @type {InstanceType<Slider>} */
      const empty_attributes = html`<mdw-slider></mdw-slider>`;
      assert.equal(empty_attributes.max, '');
    });

    it('default value when min and max attributes are given (= min plus half the difference between min and max)', () => {
      /** @type {InstanceType<Slider>} */
      const value_not_specified = html`<mdw-slider min=2 max=6></mdw-slider>`;
      assert.equal(value_not_specified.value, '4');
    });

    it('default value with step control when both min and max attributes are given', () => {
      /** @type {InstanceType<Slider>} */
      const control_step_mismatch = html`<mdw-slider min=0 max=7 step=2></mdw-slider>`;
      assert.equal(control_step_mismatch.value, '4');
    });

    // Chrome would result in different value out of the range between min and max. Why?
    it('default value when both min and max attributes are given, while min > max', () => {
      /** @type {InstanceType<Slider>} */
      const max_smaller_than_min = html`<mdw-slider min=2 max=-3></mdw-slider>`;
      assert.equal(max_smaller_than_min.value, '2');
    });

    it('The default step scale factor is 1, unless min attribute has non-integer value', () => {
      /** @type {InstanceType<Slider>} */
      const default_step_scale_factor_1 = html`<mdw-slider min=5 max=12.6 value=6.7></mdw-slider>`;
      assert.equal(default_step_scale_factor_1.value, '7');
    });

    it('Step scale factor behavior when min attribute has integer value but max attribute is non-integer ', () => {
      /** @type {InstanceType<Slider>} */
      const default_step_scale_factor_2 = html`<mdw-slider min=5.3 max=12 value=6.7></mdw-slider>`;
      assert.equal(default_step_scale_factor_2.value, '6.3');
    });

    it('Solving the step mismatch', () => {
      /** @type {InstanceType<Slider>} */
      const float_step_scale_factor = html`<mdw-slider min=5.3 max=12 step=0.5 value=6.7></mdw-slider>`;
      assert.equal(float_step_scale_factor.value, '6.8');
    });

    // Firefox Nightly (24.0a1) would result in the possible maximum value in this range... (i.e. 12)
    it('Performing stepUp()', () => {
      /** @type {InstanceType<Slider>} */
      const e = html`<mdw-slider min=3 max=14 value=6 step=3></mdw-slider>`;
      e.stepUp();
      assert.equal(e.value, '9');
    });

    // Firefox Nightly (24.0a1) would result in the possible minimum value in this range... (i.e. 3)
    it('Performing stepDown()', () => {
      /** @type {InstanceType<Slider>} */
      const e = html`<mdw-slider min=3 max=11 value=9 step=3></mdw-slider>`;
      e.stepDown();
      assert.equal(e.value, '6');
    });

    // Chrome and Opera would throw DOM Exception 11 (InvalidStateError)
    // Firefox Nightly gives the correct result
    it('Performing stepUp() beyond the value of the max attribute', () => {
      /** @type {InstanceType<Slider>} */
      const e = html`<mdw-slider min=3 max=14 value=9 step=3></mdw-slider>`;
      e.stepUp(2);
      assert.equal(e.value, '12');
    });

    // Chrome and Opera would throw DOM Exception 11 (InvalidStateError)
    // Firefox Nightly gives the correct result
    it('Performing stepDown() beyond the value of the min attribute', () => {
      /** @type {InstanceType<Slider>} */
      const e = html`<mdw-slider min=3 max=11 value=6 step=3></mdw-slider>`;
      e.stepDown(2);
      assert.equal(e.value, '3');
    });

    it('Input should be reset to the default value when value attribute has whitespace', () => {
      /** @type {InstanceType<Slider>} */
      const e = html`<mdw-slider value=" 123"></mdw-slider>`;
      assert.equal(e.value, '50');
    });

    it('Multiply value by ten raised to the exponentth power with `e`', () => {
      /** @type {InstanceType<Slider>} */
      const e = html`<mdw-slider value=""></mdw-slider>`;
      // @ts-expect-error intentionally wrong type
      e.value = 1e2;
      assert.equal(e.value, '100');
    });

    it('Multiply value by ten raised to the exponentth power with `E`', () => {
      /** @type {InstanceType<Slider>} */
      const e = html`<mdw-slider value=""></mdw-slider>`;
      // @ts-expect-error intentionally wrong type
      // eslint-disable-next-line unicorn/number-literal-case
      e.value = 1E2;
      assert.equal(e.value, '100');
    });
  });
  /* eslint-enable camelcase */
});
