import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import Checkbox from '../../components/Checkbox.js';
import { addSVGAlias } from '../../services/svgAlias.js';
import { axTree, iterateMeaningfulAXNodes } from '../plugins/axTree.js';
import { html, leftClickElement, makeFromConstructor, makeFromString, makeFromTagName, sendKeypress } from '../utils.js';

addSVGAlias('check', 'M382 816 154 588l57-57 171 171 367-367 57 57-424 424Z', '0 96 960 960');
addSVGAlias('check_indeterminate_small', 'M280 616v-80h400v80H280Z', '0 96 960 960');

beforeEach(() => document.body.replaceChildren());

describe('mdw-checkbox', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-checkbox');
    assert.equal(element.tagName.toLowerCase(), 'mdw-checkbox');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(Checkbox);
    assert.equal(element.tagName.toLowerCase(), 'mdw-checkbox');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-checkbox></mdw-checkbox>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-checkbox');
  });

  describe('[checked]/.defaultChecked', () => {
    it('can be set via property', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.defaultChecked);
      assert.isNull(element.getAttribute('checked'));

      element.defaultChecked = true;

      assert.isTrue(element.defaultChecked);
      assert.equal(element.getAttribute('checked'), '');
    });

    it('can be set via attribute', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.defaultChecked);
      assert.isNull(element.getAttribute('checked'));

      element.setAttribute('checked', '');

      assert.isTrue(element.defaultChecked);
      assert.equal(element.getAttribute('checked'), '');
    });

    it('can be unset via property', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      assert.isTrue(element.defaultChecked);
      assert.equal(element.getAttribute('checked'), '');

      element.defaultChecked = false;

      assert.isFalse(element.defaultChecked);
      assert.isNull(element.getAttribute('checked'));
    });

    it('can be unset via attribute', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      assert.isTrue(element.defaultChecked);
      assert.equal(element.getAttribute('checked'), '');

      element.removeAttribute('checked');

      assert.isFalse(element.defaultChecked);
      assert.isNull(element.getAttribute('checked'));
    });
  });

  describe('.checked', () => {
    it('initially false if not [checked]', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.checked);
    });

    it('initially true if [checked]', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      assert.isTrue(element.checked);
    });

    it('modified by [checked] if not dirty', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.checked);

      element.defaultChecked = true;

      assert.isTrue(element.checked);
    });

    it('not modified by [checked] if dirty', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.checked);
      element.checked = true;
      assert.isTrue(element.checked);
      element.checked = false;
      assert.isFalse(element.checked);
      element.defaultChecked = true;
      assert.isFalse(element.checked);
    });

    it('does not fire events on programmatic check', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      let fired = false;
      element.addEventListener('change', () => { fired = true; });
      element.addEventListener('input', () => { fired = true; });

      element.checked = true;
      assert.isFalse(fired);
    });

    it('does check on click', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      await leftClickElement(element);
      assert.isTrue(element.checked);
    });

    it('does fire events on click', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      let firedInput = false;
      let firedChange = false;
      element.addEventListener('input', (e) => {
        firedInput = true;
        assert.isTrue(element.checked);
        assert.isFalse(firedChange);
        assert.isTrue(e.bubbles);
        assert.isTrue(e.composed);
      });
      element.addEventListener('change', (e) => {
        firedChange = true;
        assert.isTrue(firedInput);
        assert.isTrue(element.checked);
        assert.isTrue(e.bubbles);
        assert.isFalse(e.composed);
      });

      await leftClickElement(element);

      assert.isTrue(firedChange);
      assert.isTrue(firedInput);
    });

    it('does fire click on spacebar', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      let fired = false;
      element.addEventListener('click', () => {
        fired = true;
      });

      element.focus();
      await sendKeypress(' ');
      assert.isTrue(fired);
    });

    it('does not fire click on enter', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      let fired = false;
      element.addEventListener('click', () => {
        fired = true;
      });

      element.focus();
      await sendKeypress('Enter');
      assert.isFalse(fired);
    });

    it('does fire click on .click', (done) => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      element.addEventListener('click', () => {
        done();
      });

      element.click();
    });

    it('does not fire events when disabled', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox disabled>foo</mdw-checkbox>`;
      let fired = false;
      element.addEventListener('change', () => { fired = true; });
      element.addEventListener('input', () => { fired = true; });

      await leftClickElement(element);

      assert.isFalse(fired);
    });

    it('unsets checked with preventDefault on click', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      let firedClick = false;
      let firedInput = false;
      let firedChange = false;
      element.addEventListener('click', (e) => {
        firedClick = true;
        e.preventDefault();
      });

      element.addEventListener('input', () => {
        firedInput = true;
      });
      element.addEventListener('change', () => {
        firedChange = true;
      });

      assert.isFalse(element.checked);
      element.click();

      assert.isTrue(firedClick);
      assert.isFalse(firedChange);
      assert.isFalse(firedInput);
      assert.isFalse(element.checked);
    });

    it('preventDefault does nothing on input or change', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      let firedInput = false;
      let firedChange = false;

      element.addEventListener('input', (e) => {
        firedInput = true;
        assert.isTrue(element.checked);
        e.preventDefault();
      });
      element.addEventListener('change', (e) => {
        firedChange = true;
        assert.isTrue(element.checked);
        e.preventDefault();
      });

      assert.isFalse(element.checked);
      element.click();

      assert.isTrue(firedInput);
      assert.isTrue(firedChange);
      assert.isTrue(element.checked);
    });
  });

  describe('.indeterminate', () => {
    it('initially false', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      assert.isFalse(element.checked);
      assert.isFalse(element.indeterminate);
    });

    it('can be set via property', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      element.indeterminate = true;
      assert.isTrue(element.indeterminate);
    });

    it('set false on .checked change', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      element.indeterminate = true;
      element.checked = true;
      assert.isFalse(element.indeterminate);
    });

    it('not changed by .defaultChecked', () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      element.indeterminate = true;
      element.defaultChecked = true;
      assert.isTrue(element.indeterminate);
    });
  });

  describe('aria', () => {
    it('returns checkbox role', async () => {
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'checkbox');
    });

    it('supports aria-label', async () => {
      const element = html`<mdw-checkbox aria-label=foo></mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });

    it('labels based on slot', async () => {
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });

    it('reports aria-checked with false', async () => {
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isNotOk(checked);
    });

    it('reports aria-checked with true', async () => {
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isOk(checked);
    });

    it('reports aria-checked with mixed', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      element.indeterminate = true;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.equal(checked, 'mixed');
    });

    it('reports aria-checked=false on uncheck', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      element.checked = false;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isNotOk(checked);
    });

    it('reports aria-checked=false on cleared indeterminate', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox checked>foo</mdw-checkbox>`;
      element.indeterminate = true;
      element.checked = false;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isNotOk(checked);
    });

    it('reports aria-checked=true on cleared indeterminate', async () => {
      /** @type {InstanceType<Checkbox>} */
      const element = html`<mdw-checkbox>foo</mdw-checkbox>`;
      element.indeterminate = true;
      element.checked = true;
      const results = await axTree({ selector: element.tagName });
      const [{ checked }] = iterateMeaningfulAXNodes(results);
      assert.isOk(checked);
    });
  });

  /* eslint-disable camelcase */
  /** @see http://wpt.live/html/semantics/forms/the-input-element/checkbox.html */
  describe('wpt - checkbox', () => {
    it('click on mutable checkbox fires a click event, then an input event, then a change event', () => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox1 = html`<mdw-checkbox></mdw-checkbox>`;
      let c1_click_fired = false;
      let c1_input_fired = false;
      let c1_change_fired = false;
      checkbox1.addEventListener('click', (e) => {
        c1_click_fired = true;
        assert.isFalse(c1_input_fired, 'click event should fire before input event');
        assert.isFalse(c1_change_fired, 'click event should fire before change event');
        assert.isFalse(e.isTrusted, 'click()-initiated click event should not be trusted');
      });

      checkbox1.addEventListener('input', (e) => {
        c1_input_fired = true;
        assert.isTrue(c1_click_fired, 'input event should fire after click event');
        assert.isFalse(c1_change_fired, 'input event should fire before change event');
        assert.isTrue(e.bubbles, 'event should bubble');
        assert.isTrue(e.isTrusted, 'click()-initiated event should be trusted');
        assert.isFalse(e.cancelable, 'event should not be cancelable');
        assert.isTrue(checkbox1.checked, 'checkbox is checked');
        assert.isFalse(checkbox1.indeterminate, 'checkbox is not indeterminate');
      });
      checkbox1.addEventListener('change', (e) => {
        c1_change_fired = true;
        assert.isTrue(c1_click_fired, 'change event should fire after click event');
        assert.isTrue(c1_input_fired, 'change event should fire after input event');
        assert.isTrue(e.bubbles, 'event should bubble');
        // Web Components limitation, change events must be rethrown and will lose isTrusted
        // assert.isTrue(e.isTrusted, 'click()-initiated event should be trusted');
        assert.isFalse(e.cancelable, 'event should not be cancelable');
        assert.isTrue(checkbox1.checked, 'checkbox is checked');
        assert.isFalse(checkbox1.indeterminate, 'checkbox is not indeterminate');
      });

      checkbox1.refs.control.click();
      assert.isTrue(c1_input_fired);
      assert.isTrue(c1_change_fired);
    });

    it("click on non-mutable checkbox doesn't fire the input or change event", (done) => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox2 = html`<mdw-checkbox disabled></mdw-checkbox>`;
      checkbox2.addEventListener('input', () => {
        assert.fail('event input fired');
      });

      checkbox2.addEventListener('change', () => {
        assert.fail('event change fired');
      });

      checkbox2.click();
      done();
    });

    it('pre-activation steps on unchecked checkbox', () => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox3 = html`<mdw-checkbox></mdw-checkbox>`;
      checkbox3.indeterminate = true;
      checkbox3.click();
      assert.isTrue(checkbox3.checked);
      assert.isFalse(checkbox3.indeterminate);
    });

    it('pre-activation steps on checked checkbox', () => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox4 = html`<mdw-checkbox checked></mdw-checkbox>`;
      checkbox4.indeterminate = true;
      checkbox4.click();
      assert.isFalse(checkbox4.checked);
      assert.isFalse(checkbox4.indeterminate);
    });

    it('canceled activation steps on unchecked checkbox', (done) => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox5 = html`<mdw-checkbox></mdw-checkbox>`;
      checkbox5.addEventListener('click', (e) => {
        e.preventDefault();
        /*
        The prevention of the click doesn't have an effect until after all the
        click event handlers have been run.
        */
        assert.isTrue(checkbox5.checked);
        assert.isFalse(checkbox5.indeterminate);

        setTimeout(() => {
          /*
          The click event has finished being dispatched, so the checkedness and
          determinateness have been toggled back by now because the event
          was preventDefault-ed.
          */
          assert.isFalse(checkbox5.checked);
          assert.isFalse(checkbox5.indeterminate);
          done();
        }, 0);
      });
      assert.isFalse(checkbox5.checked);
      assert.isFalse(checkbox5.indeterminate);
      checkbox5.click();
    });

    it('canceled activation steps on unchecked checkbox', (done) => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox6 = html`<mdw-checkbox></mdw-checkbox>`;
      checkbox6.addEventListener('click', (e) => {
        checkbox6.indeterminate = true;
        e.preventDefault();
        /*
        The prevention of the click doesn't have an effect until after all the
        click event handlers have been run.
        */
        assert.isTrue(checkbox6.checked);
        assert.isTrue(checkbox6.indeterminate);
        setTimeout(() => {
          /*
          The click event has finished being dispatched, so the checkedness and
          determinateness have been toggled back by now because the event
          was preventDefault-ed.
          */
          assert.isFalse(checkbox6.checked);
          assert.isFalse(checkbox6.indeterminate);
          done();
        }, 0);
      });
      assert.isFalse(checkbox6.checked);
      assert.isFalse(checkbox6.indeterminate);
      checkbox6.click();
    });
  });

  /** @see http://wpt.live/html/semantics/forms/the-input-element/input-type-checkbox.html */
  describe('wpt - input-type-checkbox', () => {
    it('default checkbox has no checkedness state', () => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox_default = html`<mdw-checkbox width=20></mdw-checkbox>`;
      assert.isFalse(checkbox_default.checked);
    });

    it('checkbox with initial state set to checked has checkedness state', () => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox_checked = html`<mdw-checkbox checked></mdw-checkbox>`;
      assert.isTrue(checkbox_checked.checked);
    });

    it('changing the checked attribute to a string sets the checkedness state', () => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox_default = html`<mdw-checkbox width=20></mdw-checkbox>`;
      // @ts-expect-error intentionally wrong type
      checkbox_default.checked = 'chicken';
      assert.isTrue(checkbox_default.checked);
    });

    it('a checkbox has an indeterminate state set to false onload', () => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox_indeterminate = html`<mdw-checkbox></mdw-checkbox>`;
      assert.isFalse(checkbox_indeterminate.indeterminate);
    });

    it("on setting, a checkbox's indeterminate state must be set to the new value and returns the last value it was set to", () => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox_indeterminate = html`<mdw-checkbox></mdw-checkbox>`;
      checkbox_indeterminate.indeterminate = true;
      assert.isTrue(checkbox_indeterminate.indeterminate);
    });

    it("default/on: on getting, if the element has a value attribute, it must return that attribute's value; otherwise, it must return the string 'on'", () => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox_default_value = html`<mdw-checkbox></mdw-checkbox>`;
      assert.equal(checkbox_default_value.value, 'on');
    });

    it("on getting, if the element has a value attribute, it must return that attribute's value", () => {
      /** @type {InstanceType<Checkbox>} */
      const checkbox_default_value = html`<mdw-checkbox></mdw-checkbox>`;
      checkbox_default_value.value = 'chicken';
      assert.equal(checkbox_default_value.value, 'chicken');
    });
  });

  /** @see http://wpt.live/html/semantics/forms/the-input-element/checkbox-click-events.html */
  describe('wpt - checkbox-click-events', () => {
    it('clicking and preventDefaulting a checkbox causes the checkbox to be checked during the click handler but reverted', () => {
      const input = /** @type {InstanceType<Checkbox>} */ (document.createElement('mdw-checkbox'));
      // input.type = 'checkbox';

      const values = [];

      input.addEventListener('click', (e) => {
        values.push(input.checked);
        e.preventDefault();
        values.push(input.checked);
      });

      input.click();

      values.push(input.checked);
      assert.deepEqual(values, [true, true, false]);
    });

    it('a checkbox input emits click, input, change events in order after synthetic click', () => {
      const input = /** @type {InstanceType<Checkbox>} */ (document.createElement('mdw-checkbox'));
      // input.type = 'checkbox';
      document.body.appendChild(input);
      /** @type {string[]} */
      const events = [];

      input.addEventListener('change', () => {
        events.push('change');
      });
      input.addEventListener('click', () => {
        events.push('click');
      });
      input.addEventListener('input', () => {
        events.push('input');
      });

      assert.isFalse(input.checked);

      input.click();

      assert.isTrue(input.checked);
      assert.deepEqual(events, ['click', 'input', 'change']);
    });

    it('a checkbox input emits click, input, change events in order after dispatching click event', () => {
      const input = /** @type {InstanceType<Checkbox>} */ (document.createElement('mdw-checkbox'));
      // input.type = 'checkbox';
      document.body.appendChild(input);
      /** @type {string[]} */
      const events = [];

      input.addEventListener('change', () => {
        events.push('change');
      });
      input.addEventListener('click', () => {
        events.push('click');
      });
      input.addEventListener('input', () => {
        events.push('input');
      });

      assert.isFalse(input.checked);

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      input.dispatchEvent(event);

      assert.isTrue(input.checked);
      assert.deepEqual(events, ['click', 'input', 'change']);
    });

    it('checkbox input respects cancel behavior on synthetic clicks', () => {
      const input = /** @type {InstanceType<Checkbox>} */ (document.createElement('mdw-checkbox'));
      // input.type = 'checkbox';
      document.body.appendChild(input);
      /** @type {string[]} */
      const events = [];

      input.addEventListener('change', () => {
        events.push('change');
      });
      input.addEventListener('click', (e) => {
        e.preventDefault();
        events.push('click');
      });
      input.addEventListener('input', () => {
        events.push('input');
      });

      assert.isFalse(input.checked);

      input.click();

      assert.isFalse(input.checked);
      assert.deepEqual(events, ['click']);
    });
  });
  /* eslint-enable camelcase */
});
