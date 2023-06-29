import { assert } from '@esm-bundle/chai';

import Button from '../../components/Button.js';
import '../../theming/loader.js';
import { axTree, html, iterateMeaningfulAXNodes, makeFromConstructor, makeFromString, makeFromTagName, sendKeydown, sendKeypress, sendKeyup } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('mdw-button', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-button');
    assert.equal(element.tagName.toLowerCase(), 'mdw-button');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(Button);
    assert.equal(element.tagName.toLowerCase(), 'mdw-button');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-button>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-button');
  });

  describe('layout', () => {
    it('should have inline-* display', () => {
      const element = html`<mdw-button></mdw-button>`;
      assert.isTrue(window.getComputedStyle(element).display.startsWith('inline'));
    });
  });

  describe('[value]', () => {
    it('should have blank defaultValue', () => {
      /** @type {InstanceType<Button>} */
      const element = html`<mdw-button></mdw-button>`;
      assert.isFalse(element.hasAttribute('value'));
      assert.equal(element.defaultValue, '');
    });

    it('should be configurable on creation', () => {
      /** @type {InstanceType<Button>} */
      const element = html`<mdw-button value=80></mdw-button>`;
      assert.equal(element.getAttribute('value'), '80');
      assert.equal(element.defaultValue, '80');
      assert.equal(element.value, '80');
    });

    it('should be configurable over property', () => {
      /** @type {InstanceType<Button>} */
      const element = html`<mdw-button></mdw-button>`;
      element.defaultValue = '80';
      assert.equal(element.defaultValue, '80');
      assert.equal(element.value, '80');
    });

    it('should be configurable over attribute', () => {
      /** @type {InstanceType<Button>} */
      const element = html`<mdw-button></mdw-button>`;
      element.setAttribute('value', '80');
      assert.equal(element.defaultValue, '80');
      assert.equal(element.value, '80');
    });
  });

  describe('aria', () => {
    it('returns button role', async () => {
      const element = html`<mdw-button></mdw-button>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'button');
    });

    it('supports aria-label', async () => {
      const element = html`<mdw-button aria-label=foo></mdw-button>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });

    it('labels based on slot', async () => {
      const element = html`<mdw-button>foo</mdw-button>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });

    it('returns link role with [href]', async () => {
      const element = html`<mdw-button href=#></mdw-button>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'link');
    });
  });

  /* eslint-disable camelcase */
  /** @see https://wpt.live/html/semantics/forms/the-button-element/ */
  describe('wpt - <button>', () => {
    /** @see https://wpt.live/html/semantics/forms/the-button-element/active-onblur.html */
    describe('active-onblur', () => {
      it('Buttons should clear :active when the user tabs away from them while holding spacebar.', async () => {
        /** @type {InstanceType<Button>} */
        const b1 = html`<mdw-button>button one</button>`;
        /** @type {InstanceType<Button>} */
        const b2 = html`<mdw-button>button two</button>`;

        b1.focus();

        // Hold spacebar down
        await sendKeydown(' ');

        assert.equal(b1.pressedState, true, 'Buttons should be :active while the spacebar is pressed down.');

        // Press tab
        await sendKeypress('Tab');
        assert.equal(b1.pressedState, false, 'Buttons should not be :active after tab is used to change focus.');
        assert.equal(b2.focusedState, true);

        // Release spacebar
        await sendKeyup(' ');
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-checkvalidity.html */
    it('checkvalidity', () => {
      const form = html`
        <form method="post"
            enctype="application/x-www-form-urlencoded"
            action="">
          <p><mdw-button>button</button></p>
        </form>
      `;
      const p = (form.firstElementChild);
      const button = /** @type {InstanceType<Button>} */ (p.firstElementChild);
      try {
        assert.equal(button.checkValidity(), true, 'calling of checkValidity method is failed.');
      } catch {
        assert.fail('autofocus attribute is not exist.'); // [sic]
      }
    });
  });
  /** @see https://wpt.live/html/semantics/forms/the-input-element/button.html */
  describe('wpt - button', () => {
    it('clicking on button should not submit a form', (done) => {
      const f1 = html`<form><mdw-button name=b1></mdw-button></form>`;
      const b1 = /** @type {InstanceType<Button>} */ (f1.firstElementChild);
      f1.addEventListener('submit', (e) => {
        e.preventDefault();
        assert.fail('form has been submitted');
      });
      b1.click();
      done();
    });

    it('the element is barred from constraint validation', () => {
      const form = html`<form><mdw-button name=b1></mdw-button></form>`;
      const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);
      assert.isFalse(button.willValidate);
    });

    it('clicking on button should not reset other form fields', () => {
      /** @type {{children: [HTMLInputElement, InstanceType<Button>]}} */
      // @ts-ignore skip cast
      const { children: [radio, button] } = html`
        <form>
          <input type=radio checked name=b3>
          <mdw-button name=b3></mdw-button>
        </form>
      `;
      radio.value = 'bar';
      button.click();
      assert.equal(radio.value, 'bar');
    });

    it('clicking on button should not unchecked radio buttons', () => {
      /** @type {{children: [HTMLInputElement, InstanceType<Button>]}} */
      // @ts-ignore skip cast
      const { children: [radio, button] } = html`
        <form>
          <input type=radio checked name=b3>
          <mdw-button name=b3></mdw-button>
        </form>
      `;
      assert.isTrue(radio.checked);
      button.click();
      assert.isTrue(radio.checked);
    });

    it('clicking on button should not change its indeterminate IDL attribute', () => {
      /** @type {{children: [HTMLInputElement, InstanceType<Button>]}} */
      // @ts-ignore skip cast
      const { children: [checkbox, button] } = html`
        <form>
          <input type=checkbox>
          <input type=button name=b4>
        </form>
      `;
      assert.isFalse(checkbox.indeterminate);
      button.click();
      assert.isFalse(checkbox.indeterminate);
    });
  });

  /** @see https://wpt.live/html/semantics/forms/the-input-element/input-type-button.html */
  describe('wpt - input-type-button', () => {
    it('default behavior', () => {
      /** @type {InstanceType<Button>} */
      const button = html`<mdw-button></mdw-button>`;
      assert.isUndefined(button.click(), 'The input element represents a button with no default behavior');
    });

    it('empty value attribute', () => {
      /** @type {InstanceType<Button>} */
      const button = html`<mdw-button></mdw-button>`;
      assert.equal(button.value, '', 'It must be the empty string');
    });

    it('label value', () => {
      /** @type {{children: InstanceType<Button>[]}} */
      // @ts-ignore skip cast
      const { children: [button1, button2] } = html`
        <div>
            <mdw-button></mdw-button>
            <mdw-button value="BUTTON"></mdw-button>
        </div>
      `;
      assert.notEqual(button1.offsetWidth, button2.offsetWidth, "If the element has a value attribute, the button's label must be the value of that attribute");
    });

    it("mutable element's activation behavior is to do nothing.", () => {
      const form = html`
        <form action="/" method="get">
          <mdw-button value="mutable"></mdw-button>
        </form>
      `;
      const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);
      let isSubmitted = false;
      form.addEventListener('submit', () => {
        isSubmitted = true;
        return false;
      });
      button.click();
      assert.equal(isSubmitted, false, "If the element is mutable, the element's activation behavior is to do nothing.");
    });

    it('immutable element has no activation behavior.', () => {
      const form = html`
        <form action="/" method="get">
          <mdw-button value="mutable"></mdw-button>
        </form>
      `;
      const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);
      let isSubmitted = false;
      form.addEventListener('submit', () => {
        isSubmitted = true;
        return false;
      });
      button.click();
      assert.equal(isSubmitted, false, 'If the element is immutable, the element has no activation behavior.');
    });
  });
  /* eslint-enable camelcase */
});
