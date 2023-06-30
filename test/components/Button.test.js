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
        const b1 = html`<mdw-button>button one</mdw-button>`;
        /** @type {InstanceType<Button>} */
        const b2 = html`<mdw-button>button two</mdw-button>`;

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

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-activate.html */
    describe('button-activate', () => {
      it('button activation behaviour submits form', (done) => {
        const form = html`
          <form>
            <mdw-button type=submit>Submit</mdw-button>
          </form>
        `;
        const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          done();
        });
        button.click();
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-click-submits.html */
    describe('button-click-submits', () => {
      it('clicking a button with .click() should trigger a submit (form connected)', (done) => {
        const form = html`<form><mdw-button type=submit>Submit</mdw-button></form>`;
        const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);

        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.equal(ev.target, form);
          done();
        });

        button.click();
      });

      it('clicking a button with .click() should not trigger a submit (form disconnected)', (done) => {
        const form = makeFromString('<form><mdw-button type=submit>Submit</mdw-button></form>', false);
        const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);
        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.fail('Form should not be submitted');
        });

        button.click();
        setTimeout(done, 500);
      });

      it('clicking a button by dispatching an event should trigger a submit (form connected)', (done) => {
        const form = html`<form><mdw-button type=submit>Submit</mdw-button></form>`;
        const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);

        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.equal(ev.target, form);
          done();
        });

        const e = new MouseEvent('click');
        button.dispatchEvent(e);
      });

      it('clicking a button by dispatching an event should not trigger a submit (form disconnected)', (done) => {
        const form = makeFromString('<form><mdw-button type=submit>Submit</mdw-button></form>', false);
        const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);

        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.fail('Form should not be submitted');
        });

        const e = new MouseEvent('click');
        button.dispatchEvent(e);
        setTimeout(done, 500);
      });

      it('clicking a button that cancels the event should not trigger a submit', (done) => {
        const form = makeFromString('<form><mdw-button type=submit>Submit</mdw-button></form>', false);
        const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);
        // [sic] seems like a bad test because not part of DOM anyway

        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.fail('Form should not be submitted');
        });

        button.addEventListener('click', ((ev) => {
          ev.preventDefault();
          setTimeout(done, 500);
        }));
        button.click();
      });

      // Custom test
      it('clicking a button that cancels the event should not trigger a submit (connected)', (done) => {
        const form = html`<form><mdw-button type=submit>Submit</mdw-button></form>`;
        const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);

        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.fail('Form should not be submitted');
        });

        button.addEventListener('click', ((ev) => {
          ev.preventDefault();
          setTimeout(done, 500);
        }));
        button.click();
      });

      it('clicking a disabled button (via disabled attribute) should not trigger submit', (done) => {
        const form = html`<form><mdw-button type=submit disabled>Submit</mdw-button></form>`;
        const button = /** @type {InstanceType<Button>} */ (form.firstElementChild);

        form.addEventListener('submit', ((ev) => {
          ev.preventDefault();
          assert.fail('Form should not be submitted');
        }));

        button.click();
        setTimeout(done, 500);
      });

      it('clicking a disabled button (via ancestor fieldset) should not trigger submit', (done) => {
        const form = html`<form><fieldset disabled><mdw-button type=submit>hello</mdw-button></fieldset></form>`;
        const fieldset = (form.firstElementChild);
        const button = /** @type {InstanceType<Button>} */ (fieldset.firstElementChild);

        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.fail('Form should not be submitted');
        });

        button.click();
        setTimeout(done, 500);
      });

      it("clicking a button inside a disabled fieldset's legend *should* trigger submit", (done) => {
        const form = html`
          <form>
            <fieldset disabled>
              <legend>
                <mdw-button type=submit>hello</mdw-button>
              </legend>
            </fieldset>
          </form>
        `;
        /** @type {InstanceType<Button>} */
        const button = form.querySelector('mdw-button');
        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.equal(ev.target, form);
          done();
        });

        button.click();
      });

      it('clicking the child of a button with .click() should trigger a submit', (done) => {
        const form = html`<form><mdw-button type=submit><span></span></mdw-button></form>`;
        const span = form.querySelector('span');
        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.equal(ev.target, form);
          done();
        });

        span.click();
      });

      it('clicking the child of a button by dispatching a non-bubbling event should not trigger submit', (done) => {
        const form = document.createElement('form');
        const button = document.createElement('mdw-button');
        const span = document.createElement('span');
        button.appendChild(span);
        form.appendChild(button);
        document.body.appendChild(form);

        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.fail('Form should not be submitted');
        });

        span.addEventListener('click', (ev) => {
          ev.preventDefault();
          setTimeout(done, 500);
        });

        const e = new MouseEvent('click', { bubbles: false });
        span.dispatchEvent(e);
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-activate-keyup-prevented.html */
    describe('button-activate-keyup-prevented', () => {
      it('Button activation submits on keyup, but not if keydown is defaultPrevented', async () => {
        /** @type {InstanceType<Button>} */
        const button = html`<mdw-button type=submit>The button</mdw-button>`;
        button.focus();
        assert.equal(document.activeElement, button, 'Button should be focused');
        // assert.isTrue(button.focusedState, 'Button show focus state');

        const clickPromise = new Promise((resolve) => {
          button.addEventListener('click', resolve, { once: true });
        });

        await sendKeypress(' ');
        await clickPromise;

        assert.isTrue(true, 'Button should have activated');

        document.addEventListener('keydown', (e) => {
          e.preventDefault();
        });

        button.addEventListener('click', () => assert.fail('button got incorrectly activated'));

        await sendKeypress(' ');

        await new Promise((resolve) => setTimeout(resolve, 0));
        assert.isTrue(true, 'Button should not have activated');
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-checkvalidity.html */
    it('checkvalidity', () => {
      const form = html`
        <form method="post"
            enctype="application/x-www-form-urlencoded"
            action="">
          <p><mdw-button type=submit>button</mdw-button></p>
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

  describe('wpt - <input type=button>', () => {
    /** @see https://wpt.live/html/semantics/forms/the-input-element/button.html */
    describe('button', () => {
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
  });
  /* eslint-enable camelcase */
});
