import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import Button from '../../components/Button.js';
import { axTree, iterateMeaningfulAXNodes } from '../plugins/axTree.js';
import { html, makeFromConstructor, makeFromString, makeFromTagName, sendKeydown, sendKeypress, sendKeyup } from '../utils.js';

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
    const element = makeFromString('<mdw-button></mdw-button>');
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

    it('supports aria-label with [href]', async () => {
      const element = html`<mdw-button href=# aria-label=foo></mdw-button>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role, name }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'link');
      assert.equal(name, 'foo');
    });

    it('labels based on slot with [href]', async () => {
      const element = html`<mdw-button href=#>foo</mdw-button>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role, name }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'link');
      assert.equal(name, 'foo');
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

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-events.html */
    describe('button-events', () => {
      /** @type {HTMLFormElement} */
      let fm1;
      /** @type {InstanceType<Button>} */
      let btn;
      /** @type {InstanceType<Button>} */
      let menu_btn;
      beforeEach(() => {
        fm1 = html`
          <form name="fm1" style="display:none">
            <mdw-button type=submit>BUTTON</mdw-button>
            <mdw-button type="menu" menu="menu">MENU BUTTON</mdw-button>
          </form>
        `;
        [btn, menu_btn] = /** @type {HTMLCollectionOf<InstanceType<Button>>} */ (fm1.children);
      });
      it('The submit event must be fired when click a button in submit status', (done) => {
        fm1.addEventListener('submit', (evt) => {
          evt.preventDefault();
          assert.isTrue(evt.isTrusted, 'The isTrusted attribute of the submit event should be true.');
          assert.isTrue(evt.bubbles, 'The bubbles attribute of the submit event should be true.');
          assert.isTrue(evt.cancelable, 'The cancelable attribute of the submit event should be true.');
          assert.isTrue(evt instanceof Event, 'The submit event is an instance of Event interface.');
          done();
        });

        btn.type = 'submit';
        assert.equal(btn.type, 'submit', "The button type should be 'submit'.");
        btn.click();
      });

      it('The reset event must be fired when click a button in reset status', (done) => {
        fm1.addEventListener('reset', (evt) => {
          assert.isTrue(evt.isTrusted, 'The isTrusted attribute of the reset event should be true.');
          assert.isTrue(evt.bubbles, 'The bubbles attribute of the reset event should be true.');
          assert.isTrue(evt.cancelable, 'The cancelable attribute of the reset event should be true.');
          assert.isTrue(evt instanceof Event, 'The reset event is an instance of Event interface.');
          done();
        });

        btn.type = 'reset';
        assert.equal(btn.type, 'reset', "The button type should be 'reset'.");
        btn.click();
      });

      it("type=button shouldn't trigger submit or reset events", (done) => {
        btn.type = 'button';
        assert.equal(btn.type, 'button', "The button type should be 'button'.");
        fm1.addEventListener('submit', () => {
          assert.fail("type=button shouldn't trigger submission.");
        });
        fm1.addEventListener('reset', () => {
          assert.fail("type=button shouldn't reset the form.");
        });
        btn.click();
        done();
      });

      it('Switching from type=button to type=submit should submit the form', (done) => {
        btn.type = 'button';
        btn.addEventListener('click', () => { btn.type = 'submit'; });
        fm1.addEventListener('submit', (evt) => {
          evt.preventDefault();
          assert.equal(btn.type, 'submit', "The button type should be 'submit'.");
          done();
        });
        btn.click();
      });

      it('Switching from type=button to type=reset should reset the form', (done) => {
        btn.type = 'button';
        btn.addEventListener('click', () => { btn.type = 'reset'; });
        fm1.addEventListener('reset', (evt) => {
          evt.preventDefault();
          assert.equal(btn.type, 'reset', "The button type should be 'reset'.");
          done();
        });
        btn.click();
      });

      it('Innermost button should submit its form', (done) => {
        btn.type = 'submit';
        btn.innerHTML = '';
        const fm2 = document.createElement('form');
        const btn2 = /** @type {InstanceType<Button>} */ (document.createElement('mdw-button'));
        btn2.type = 'submit';
        fm2.appendChild(btn2);
        btn.appendChild(fm2);
        assert.isTrue(fm1.contains(fm2), 'Should have nested forms');
        /** @param {Event} evt */
        function submitListener(evt) {
          evt.preventDefault();
          assert.equal(evt.target, fm2, 'Innermost form should have got the submit event');
        }
        window.addEventListener('submit', submitListener, true);
        btn2.click();
        window.removeEventListener('submit', submitListener, true);
        done();
      });

      it('Innermost button should reset its form', (done) => {
        btn.type = 'reset';
        btn.innerHTML = '';
        const fm2 = document.createElement('form');
        const btn2 = document.createElement('button');
        btn2.type = 'reset';
        fm2.appendChild(btn2);
        btn.appendChild(fm2);
        assert.isTrue(fm1.contains(fm2), 'Should have nested forms');

        /** @param {Event} evt */
        function resetListener(evt) {
          evt.currentTarget.removeEventListener(evt.type, resetListener, true);
          evt.preventDefault();
          assert.equal(evt.target, fm2, 'Innermost form should have got the reset event');
          done();
        }
        window.addEventListener('reset', resetListener, true);
        btn2.click();
      });

      it('Anchor inside a button should be prevent button activation', (done) => {
        btn.type = 'submit';
        btn.innerHTML = '';
        const a = document.createElement('a');
        a.href = '#';
        btn.appendChild(a);
        fm1.addEventListener('submit', () => {
          assert.fail("type=button shouldn't trigger submission.");
        });

        a.click();
        done();
      });

      it('input type=submit inside a button should be prevent button activation', (done) => {
        btn.type = 'submit';
        btn.innerHTML = '';
        const fm2 = document.createElement('form');
        const btn2 = document.createElement('input');
        btn2.type = 'submit';
        fm2.appendChild(btn2);
        btn.appendChild(fm2);
        assert.isTrue(fm1.contains(fm2), 'Should have nested forms');

        /** @param {Event} evt */
        function submitListener(evt) {
          evt.preventDefault();
          assert.equal(evt.target, fm2, 'Innermost form should have got the submit event');
        }

        window.addEventListener('submit', submitListener, true);
        btn2.click();
        window.removeEventListener('submit', submitListener, true);
        done();
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-labels.html */
    it('button-labels', () => {
      const form = html`
        <form method="post"
            enctype="application/x-www-form-urlencoded"
            action=""
            id="input_form">
          <p><label>Full name:<label>(name)<mdw-button id='button_id1'>button1</mdw-button><small>Format: First Last</small></label></label></p>
          <p><label>Age: <mdw-button id='button_id2'>button2</mdw-button></label></p>
        </form>
      `;
      /** @type {NodeListOf<InstanceType<Button>>} */
      const [button1, button2] = form.querySelectorAll('mdw-button');

      assert.isTrue(button1.labels instanceof NodeList, 'button1.labels is NodeList');
      assert.equal(button1.labels.length, 2, 'button1.labels.length');

      assert.isTrue(button2.labels instanceof NodeList, 'button2.labels is NodeList');
      assert.equal(button2.labels.length, 1, 'button2.labels.length');
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-menu-historical.html */
    describe('button-menu-historical', () => {
      it('button.menu, the potentially-reflecting IDL attribute, does not exist', () => {
        /** @type {InstanceType<Button>} */
        const button = html`
          <mdw-button id="b" type="menu" menu="m">button</mdw-button>
          <menu id="m"></menu>
        `;
        assert.isFalse('menu' in button, 'The menu property must not exist on the button');
        // @ts-ignore intentional
        assert.equal(button.menu, undefined, 'The value of the menu property on the button must be undefined');
      });

      it('button.type reflects properly', () => {
        /** @type {InstanceType<Button>} */
        const button = html`
          <mdw-button id="b" type="menu" menu="m">button</mdw-button>
          <menu id="m"></menu>
        `;
        // <mdw-button> defaults to 'button', not 'submit'
        assert.equal(button.type, 'button', 'The type property must reflect as its invalid value default of submit');
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-setcustomvalidity.html */
    describe('button-setcustomvalidity', () => {
      it('button setCustomValidity is correct', () => {
        /** @type {InstanceType<Button>} */
        const elem = html`<mdw-button></mdw-button>`;
        assert.isFalse(elem.validity.customError);
        elem.setCustomValidity('custom error');
        assert.isTrue(elem.validity.customError);
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-submit-children.html */
    describe('button-submit-children', () => {
      it('This test will pass if a form navigation successfully occurs when'
        + ' clicking a child element of a <button type=submit> element with a'
        + ' onclick event handler which prevents the default form submission'
        + ' and manually calls form.submit() instead.', (done) => {
        const frame1 = html`
          <iframe name=frame1 id=frame1></iframe>
          <form id=form1 target=frame1 action="about:blank">
            <mdw-button id=submitbutton type=submit>
              <div id=buttonchilddiv>
                button child div text
              </div>
            </mdw-button>
          </form>
        `;

        frame1.addEventListener('load', () => done());

        const submitButton = document.getElementById('submitbutton');
        submitButton.addEventListener('click', (event) => {
          event.preventDefault();
          const form = /** @type {HTMLFormElement} */ (document.getElementById('form1'));
          form.submit();
        });

        const buttonChildDiv = document.getElementById('buttonchilddiv');
        buttonChildDiv.click();
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-submit-remove-children-jssubmit.html */
    describe('button-submit-remove-children-jssubmit', () => {
      it('This test will pass if a form navigation successfully occurs when'
        + ' clicking a child element of a <button type=submit> element with a'
        + " onclick event handler which removes the button's child and then"
        + 'calls form.submit().', (done) => {
        const frame1 = html`
          <iframe name=frame1 id=frame1></iframe>
          <form id=form1 target=frame1 action="about:blank">
            <mdw-button id=submitbutton type=submit>
              <span id=outerchild>
                <span id=innerchild>submit</span>
              </span>
            </mdw-button>
          </form>
        `;

        frame1.addEventListener('load', () => done());

        const submitButton = document.getElementById('submitbutton');
        submitButton.addEventListener('click', (event) => {
          document.getElementById('outerchild').remove();
          // @ts-ignore skip cast
          document.getElementById('form1').submit();
        });

        document.getElementById('innerchild').click();
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-submit-remove-children.html */
    describe('button-submit-remove-children', () => {
      it('This test will pass if a form navigation successfully occurs when'
        + ' clicking a child element of a <button type=submit> element with a'
        + ' onclick event handler which removes the button\'s child.', (done) => {
        const frame1 = html`
          <iframe name=frame1 id=frame1></iframe>
          <form id=form1 target=frame1 action="about:blank">
            <mdw-button id=submitbutton type=submit>
              <span id=outerchild>
                <span id=innerchild>submit</span>
              </span>
            </mdw-button>
          </form>
        `;

        frame1.addEventListener('load', () => done());

        const submitButton = document.getElementById('submitbutton');
        submitButton.addEventListener('click', (event) => {
          document.getElementById('outerchild').remove();
        });

        document.getElementById('innerchild').click();
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-submit-remove-jssubmit.html */
    describe('button-submit-remove-jssubmit', () => {
      it('This test will pass if a form navigation successfully occurs when'
        + ' clicking a <button type=submit> element with a onclick event'
        + ' handler which removes the button and then calls form.submit().', function (done) {
        /** @type {HTMLIFrameElement} */
        const frame = html`
          <iframe name="frame" id="frame"></iframe>
          <form id="form" target="frame" action="does_not_exist.html">
            <input id="input" name="name" value="foo">
            <mdw-button id="submitbutton" type="submit">Submit</mdw-button>
          </form>
        `;

        frame.addEventListener('load', (() => {
          const expected = (new URL('does_not_exist.html?name=bar', window.location.href)).href;
          if (frame.contentWindow.location.href !== expected && navigator.userAgent.includes('Firefox')) {
            console.log('Skipping test due to Firefox bug.');
            // Firefox bug?
            this.skip();
          } else {
            assert.equal(frame.contentWindow.location.href, expected);
          }
          done();
        }));

        const form = /** @type {HTMLFormElement} */ (document.getElementById('form'));
        const input = /** @type {HTMLInputElement} */ (document.getElementById('input'));
        const submitButton = document.getElementById('submitbutton');
        submitButton.addEventListener('click', (event) => {
          submitButton.remove();
          form.submit();
          input.value = 'bar';
          form.submit();
          input.value = 'baz';
        });

        submitButton.click();
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-type-enumerated-ascii-case-insensitive.html */
    describe('button-type-enumerated-ascii-case-insensitive', () => {
      // mdw-button's default is "button" not "submit"

      it('keyword reset', () => {
        assert.equal(html`<mdw-button type="reset">`.type, 'reset', 'lowercase valid');
        assert.equal(html`<mdw-button type="ReSeT">`.type, 'reset', 'mixed case valid');
        assert.equal(html`<mdw-button type="reſet">`.type, 'button', 'non-ASCII invalid');
      });

      it('keyword button', () => {
        assert.equal(html`<mdw-button type="button">`.type, 'button', 'lowercase valid');

        // vacuous: the invalid value default is currently submit, so even if the UA
        // treats this as invalid, the observable behaviour would still be correct
        assert.equal(html`<mdw-button type="BuTtoN">`.type, 'button', 'mixed case valid');

        // vacuous: the invalid value default is currently submit, so even if the UA
        // treats this as valid, the observable behaviour would still be correct
        assert.equal(html`<mdw-button type="ßutton">`.type, 'button', 'non-ASCII invalid');
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-type.html */
    describe('button-type', () => {
      // mdw-button's default is "button" not "submit"

      it("a button's type should be submit by default", () => {
        const button =/** @type {InstanceType<Button>} */ (document.createElement('mdw-button'));
        assert.equal(button.type, 'button');
      });

      it("a button's type should stay within the range of valid values", () => {
        const button =/** @type {InstanceType<Button>} */ (document.createElement('mdw-button'));

        for (const type of ['reset', 'button', 'submit']) {
          button.type = type;
          assert.equal(button.type, type);

          button.type = type.toUpperCase();
          assert.equal(button.type, type);
        }

        button.type = 'reset';
        button.type = 'asdfgdsafd';
        assert.equal(button.type, 'button');

        button.type = 'reset';
        button.type = '';
        assert.equal(button.type, 'button');
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-untrusted-key-event.html */
    describe('button-untrusted-key-event.html', () => {
      beforeEach(() => {
        // eslint-disable-next-line no-unused-expressions
        html`
          <form id="input_form">
            <mdw-button name="submitButton" type="submit">Submit</mdw-button>
            <mdw-button name="resetButton" type="reset">Reset</mdw-button>
            <mdw-button name="buttonButton" type="button">Button</mdw-button>
          </form>
        `;
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          assert.fail('form should not be submitted');
        });

        for (const button of document.querySelectorAll('mdw-button')) {
          button.addEventListener('click', (e) => {
            assert.fail(`${button.type} button should not be clicked`);
          });
        }
      });

      // Create and append button elements
      for (const button of document.querySelectorAll('button')) {
        it(`Dispatching untrusted keypress events to ${button.type} button should not cause click event`, () => {
          // keyCode: Enter
          button.dispatchEvent(
            new KeyboardEvent('keypress', {
              keyCode: 13,
            }),
          );

          // key: Enter
          button.dispatchEvent(
            new KeyboardEvent('keypress', {
              key: 'Enter',
            }),
          );

          // keyCode: Space
          button.dispatchEvent(
            new KeyboardEvent('keypress', {
              keyCode: 32,
            }),
          );

          // key: Space
          button.dispatchEvent(
            new KeyboardEvent('keypress', {
              key: ' ',
            }),
          );
        });

        it(`Dispatching untrusted keyup/keydown events to ${button.type} button should not cause click event`, () => {
          // keyCode: Enter
          button.dispatchEvent(
            new KeyboardEvent('keydown', {
              keyCode: 13,
            }),
          );
          button.dispatchEvent(
            new KeyboardEvent('keyup', {
              keyCode: 13,
            }),
          );

          // key: Enter
          button.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'Enter',
            }),
          );
          button.dispatchEvent(
            new KeyboardEvent('keyup', {
              key: 'Enter',
            }),
          );

          // keyCode: Space
          button.dispatchEvent(
            new KeyboardEvent('keydown', {
              keyCode: 32,
            }),
          );
          button.dispatchEvent(
            new KeyboardEvent('keyup', {
              keyCode: 32,
            }),
          );

          // key: Space
          button.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: ' ',
            }),
          );
          button.dispatchEvent(
            new KeyboardEvent('keyup', {
              key: ' ',
            }),
          );
        });
      }
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-validation.html */
    describe('button-validation', () => {
      // mdw-button's default type is "button" not "submit"
      // mdw-button's default willValidate is false (button)

      /**
       * @param {InstanceType<Button>} element
       * @param {string} expectedType
       * @param {boolean} willValidate
       * @param {string} desc
       */
      // eslint-disable-next-line unicorn/consistent-function-scoping
      function willValid(element, expectedType, willValidate, desc) {
        it(desc, () => {
          assert.equal(element.type, expectedType);
          assert.equal(element.willValidate, willValidate);
        });
      }

      willValid(html`<mdw-button id=btn1>button</mdw-button>`, 'button', false, 'missing type attribute');
      willValid(html`<mdw-button id=btn2 type=submit>button</mdw-button>`, 'submit', true, 'submit type attribute');
      willValid(html`<mdw-button id=btn3 type=reset>button</mdw-button>`, 'reset', false, 'reset type attribute');
      willValid(html`<mdw-button id=btn4 type=button>button</mdw-button>`, 'button', false, 'button type attribute');
      willValid(html`<mdw-button id=btn5 type=menu>button</mdw-button>`, 'button', false, 'historical menu type attribute');
      willValid(html`<mdw-button id=btn6 type=foobar>button</mdw-button>`, 'button', false, 'invalid type attribute');
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-validationmessage.html */
    it('button-validationmessage', () => {
      const form = html`
        <form method="post"
            enctype="application/x-www-form-urlencoded"
            action=""
            id="input_form">
          <p><mdw-button id='button_id' type=submit>button</mdw-button></p>
        </form>
      `;

      /** @type {InstanceType<Button>} */
      const button = form.querySelector('mdw-button');

      if (typeof (button.validationMessage) === 'string') {
        assert.equal(button.validationMessage, '', 'validationMessage attribute is not correct.');
      } else {
        assert.fail('validationMessage attribute is not exist.');
      }
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-validity.html */
    it('button-validity', () => {
      const form = html`
        <form method="post"
            enctype="application/x-www-form-urlencoded"
            action=""
            id="input_form">
          <p><mdw-button id='button_id' type=submit>button</mdw-button></p>
        </form>
      `;

      /** @type {InstanceType<Button>} */
      const button = form.querySelector('mdw-button');

      if (typeof (button.validity) === 'object') {
        assert.equal(button.validity.valueMissing, false, 'validity attribute is not correct.');
      } else {
        assert.fail('validity attribute is not exist.');
      }
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-willvalidate-readonly-attribute.html */
    it('button-willvalidate-readonly-attribute', () => {
      // mdw-button's default type is "button" not "submit"
      // mdw-button's default willValidate is false (button)

      /** @type {InstanceType<Button>} */
      const implicitSubmitButton = html`<mdw-button id="implicitSubmitButton" readonly>1</mdw-button>`;
      /** @type {InstanceType<Button>} */
      const explicitSubmitButton = html`<mdw-button id="explicitSubmitButton" readonly type="submit">2</mdw-button>`;

      // assert.isTrue(implicitSubmitButton.willValidate);
      assert.isTrue(explicitSubmitButton.willValidate);
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-willvalidate.html */
    it('button-willvalidate', () => {
      const form = html`
        <form method="post"
            enctype="application/x-www-form-urlencoded"
            action=""
            id="input_form">
          <p><mdw-button id='button_id' type=submit>button</mdw-button></p>
        </form>
      `;
      /** @type {InstanceType<Button>} */
      const button = form.querySelector('mdw-button');

      if (typeof (button.willValidate) === 'boolean') {
        assert.equal(button.willValidate, true, 'willValidate attribute is not correct.');
      } else {
        assert.fail('willValidate attribute is not exist.');
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
  /** @see https://wpt.live/html/semantics/links/links-created-by-a-and-area-elements */
  describe('wpt - <a>', () => {
    /** @see http://wpt.live/html/semantics/links/links-created-by-a-and-area-elements/htmlanchorelement_attribute-getter-setter.html */
    describe('htmlanchorelement_attribute-getter-setter', () => {
      // Elements for each test: [property, oldresult, newvalue, newresult, oldurl, newurl]
      //                         [0]       [1]        [2]       [3]        [4]     [5]
      for (const [index, [property, oldresult, newval, newresult, oldurl, newurl]] of [
        ['hash', '#somehash', 'someother', '#someother',
          'http://google.com/index.html#somehash',
          'http://google.com/index.html#someother'],
        ['hash', '#somehash', '#someother', '#someother',
          'http://google.com/index.html#somehash',
          'http://google.com/index.html#someother'],
        ['host', 'google.com:1234', 'github.com:4444', 'github.com:4444',
          'http://google.com:1234/somedir',
          'http://github.com:4444/somedir'],
        ['hostname', 'google.com', 'github.com', 'github.com',
          'http://google.com:1234/somedir',
          'http://github.com:1234/somedir'],
        ['href', 'http://google.com:1234/somedir', 'http://goo-gle.com:1234/other/x.html', 'http://goo-gle.com:1234/other/x.html',
          'http://google.com:1234/somedir',
          'http://goo-gle.com:1234/other/x.html'],
        ['password', 'flabada', 'blubb', 'blubb',
          'https://anonymous:flabada@developer.mozilla.org/en-US/docs/',
          'https://anonymous:blubb@developer.mozilla.org/en-US/docs/'],
        ['pathname', '/somedir/someotherdir/index.html', '/newpath/x.txt', '/newpath/x.txt',
          'http://google.com:1234/somedir/someotherdir/index.html',
          'http://google.com:1234/newpath/x.txt'],
        ['port', '1234', '4444', '4444', 'http://google.com:1234/somedir', 'http://google.com:4444/somedir'],
        ['protocol', 'http:', 'ftp:', 'ftp:', 'http://google.com/somedir', 'ftp://google.com/somedir'],
        ['protocol', 'http:', 'ftp', 'ftp:', 'http://google.com/somedir', 'ftp://google.com/somedir'],
        ['search', '?ho', '?hi', '?hi', 'http://google.com/q.php?ho', 'http://google.com/q.php?hi'],
        ['search', '?ho', 'hi', '?hi', 'http://google.com/q.php?ho', 'http://google.com/q.php?hi'],
        ['search', '?ho', '?hi', '?hi', 'http://google.com/?ho', 'http://google.com/?hi'],
        ['search', '?ho', 'hi', '?hi', 'http://google.com/?ho', 'http://google.com/?hi'],
        ['username', 'anonymous', 'wellknown', 'wellknown',
          'https://anonymous:pwd@developer.mozilla.org:1234/en-US/',
          'https://wellknown:pwd@developer.mozilla.org:1234/en-US/'],
      ].entries()) {
        it(`Getter and setter for attribute of anchor element(${index}):${property}`, () => {
          /** @type {InstanceType<Button>} */
          const a = html`<mdw-button>anchor</mdw-button>`;
          a.href = oldurl;
          const r1 = a[property];
          assert.equal(r1, oldresult);
          a[property] = newval;
          const r2 = a[property];
          assert.equal(r2, newresult);
          const r3 = a.href;
          assert.equal(r3, newurl);
        });
      }
    });
    /** @see http://wpt.live/html/semantics/links/links-created-by-a-and-area-elements/htmlanchorelement_getter.html */
    describe('htmlanchorelement_getter', () => {
      const hrefs = [
        'http://google.com?hi',
        'http://google.com#somehash',
        'http://google.com:1234/somedir',
        'http://google.com:1234/somedir',
        'http://google.com:1234/somedir',
        'https://anonymous:flabada@developer.mozilla.org/en-US/docs/',
        'http://google.com:1234/somedir/someotherdir/index.html',
        'http://google.com:1234/somedir',
        'http://google.com/somedir',
        'https://anonymous:pwd@developer.mozilla.org:1234/en-US/',
      ];

      // Elements for each test: [property, result, id]
      //                         [0]       [1]     [2]
      for (const [index, [property, result, id]] of [
        ['search', '?hi', 'a1'],
        ['hash', '#somehash', 'a2'],
        ['host', 'google.com:1234', 'a3'],
        ['hostname', 'google.com', 'a4'],
        ['href', 'http://google.com:1234/somedir', 'a5'],
        ['password', 'flabada', 'a6'],
        ['pathname', '/somedir/someotherdir/index.html', 'a7'],
        ['port', '1234', 'a8'],
        ['protocol', 'http:', 'a9'],
        ['username', 'anonymous', 'a10'],
      ].entries()) {
        it(`Getter for attribute of anchor element(${index}):${property}`, () => {
          const a = html`<mdw-button href="${hrefs[index]}"></mdw-button>`;
          assert.equal(a[property], result);
        });
      }
    });
  });
  /* eslint-enable camelcase */
});
