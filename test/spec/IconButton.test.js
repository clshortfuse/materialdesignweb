import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import IconButton from '../../components/IconButton.js';
import { FIREFOX_VERSION } from '../../core/dom.js';
import { axTree, iterateMeaningfulAXNodes } from '../plugins/axTree.js';
import { html, leftClickElement, makeFromConstructor, makeFromString, makeFromTagName, sendKeydown, sendKeypress, sendKeyup } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

describe('mdw-icon-button', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-icon-button');
    assert.equal(element.tagName.toLowerCase(), 'mdw-icon-button');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(IconButton);
    assert.equal(element.tagName.toLowerCase(), 'mdw-icon-button');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-icon-button></mdw-icon-button>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-icon-button');
  });

  describe('layout', () => {
    it('should have inline-* display', () => {
      const element = html`<mdw-icon-button></mdw-icon-button>`;
      assert.isTrue(window.getComputedStyle(element).display.startsWith('inline'));
    });
  });

  describe('[value]', () => {
    it('should have blank defaultValue', () => {
      /** @type {InstanceType<IconButton>} */
      const element = html`<mdw-icon-button></mdw-icon-button>`;
      assert.isFalse(element.hasAttribute('value'));
      assert.equal(element.defaultValue, '');
    });

    it('should be configurable on creation', () => {
      /** @type {InstanceType<IconButton>} */
      const element = html`<mdw-icon-button value=80></mdw-icon-button>`;
      assert.equal(element.getAttribute('value'), '80');
      assert.equal(element.defaultValue, '80');
      assert.equal(element.value, '80');
    });

    it('should be configurable over property', () => {
      /** @type {InstanceType<IconButton>} */
      const element = html`<mdw-icon-button></mdw-icon-button>`;
      element.defaultValue = '80';
      assert.equal(element.defaultValue, '80');
      assert.equal(element.value, '80');
    });

    it('should be configurable over attribute', () => {
      /** @type {InstanceType<IconButton>} */
      const element = html`<mdw-icon-button></mdw-icon-button>`;
      element.setAttribute('value', '80');
      assert.equal(element.defaultValue, '80');
      assert.equal(element.value, '80');
    });
  });

  describe('aria', () => {
    it('returns button role', async () => {
      const element = html`<mdw-icon-button></mdw-icon-button>`;
      const results = await axTree({ selector: element.tagName });
      const [{ role }] = iterateMeaningfulAXNodes(results);
      assert.equal(role, 'button');
    });

    it('supports aria-label', async () => {
      const element = html`<mdw-icon-button aria-label=foo></mdw-icon-button>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });

    it('labels based on slot', async () => {
      const element = html`<mdw-icon-button>foo</mdw-icon-button>`;
      const results = await axTree({ selector: element.tagName });
      const [{ name }] = iterateMeaningfulAXNodes(results);
      assert.equal(name, 'foo');
    });

    it('returns link role with [href]', async () => {
      const element = html`<mdw-icon-button href=#></mdw-icon-button>`;
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
        /** @type {InstanceType<IconButton>} */
        const b1 = html`<mdw-icon-button>button one</mdw-icon-button>`;
        /** @type {InstanceType<IconButton>} */
        const b2 = html`<mdw-icon-button>button two</mdw-icon-button>`;

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
        /** @type {InstanceType<IconButton>} */
        const button = html`<mdw-icon-button type=submit>The button</mdw-icon-button>`;
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
            <mdw-icon-button type=submit>Submit</mdw-icon-button>
          </form>
        `;
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);
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
          <p><mdw-icon-button type=submit>button</mdw-icon-button></p>
        </form>
      `;
      const p = (form.firstElementChild);
      const button = /** @type {InstanceType<IconButton>} */ (p.firstElementChild);
      try {
        assert.equal(button.checkValidity(), true, 'calling of checkValidity method is failed.');
      } catch {
        assert.fail('autofocus attribute is not exist.'); // [sic]
      }
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-click-submits.html */
    describe('button-click-submits', () => {
      it('clicking a button with .click() should trigger a submit (form connected)', (done) => {
        const form = html`<form><mdw-icon-button type=submit>Submit</mdw-icon-button></form>`;
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);

        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.equal(ev.target, form);
          done();
        });

        button.click();
      });

      it('clicking a button with .click() should not trigger a submit (form disconnected)', (done) => {
        const form = makeFromString('<form><mdw-icon-button type=submit>Submit</mdw-icon-button></form>', false);
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);
        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.fail('Form should not be submitted');
        });

        button.click();
        setTimeout(done, 500);
      });

      it('clicking a button by dispatching an event should trigger a submit (form connected)', (done) => {
        const form = html`<form><mdw-icon-button type=submit>Submit</mdw-icon-button></form>`;
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);

        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.equal(ev.target, form);
          done();
        });

        const e = new MouseEvent('click');
        button.dispatchEvent(e);
      });

      it('clicking a button by dispatching an event should not trigger a submit (form disconnected)', (done) => {
        const form = makeFromString('<form><mdw-icon-button type=submit>Submit</mdw-icon-button></form>', false);
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);

        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.fail('Form should not be submitted');
        });

        const e = new MouseEvent('click');
        button.dispatchEvent(e);
        setTimeout(done, 500);
      });

      it('clicking a button that cancels the event should not trigger a submit', (done) => {
        const form = makeFromString('<form><mdw-icon-button type=submit>Submit</mdw-icon-button></form>', false);
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);
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
        const form = html`<form><mdw-icon-button type=submit>Submit</mdw-icon-button></form>`;
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);

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
        const form = html`<form><mdw-icon-button type=submit disabled>Submit</mdw-icon-button></form>`;
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);

        form.addEventListener('submit', ((ev) => {
          ev.preventDefault();
          assert.fail('Form should not be submitted');
        }));

        button.click();
        setTimeout(done, 500);
      });

      it('clicking a disabled button (via ancestor fieldset) should not trigger submit', (done) => {
        const form = html`<form><fieldset disabled><mdw-icon-button type=submit>hello</mdw-icon-button></fieldset></form>`;
        const fieldset = (form.firstElementChild);
        const button = /** @type {InstanceType<IconButton>} */ (fieldset.firstElementChild);

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
                <mdw-icon-button type=submit>hello</mdw-icon-button>
              </legend>
            </fieldset>
          </form>
        `;
        /** @type {InstanceType<IconButton>} */
        const button = form.querySelector('mdw-icon-button');
        form.addEventListener('submit', (ev) => {
          ev.preventDefault();
          assert.equal(ev.target, form);
          done();
        });

        button.click();
      });

      it('clicking the child of a button with .click() should trigger a submit', (done) => {
        const form = html`<form><mdw-icon-button type=submit><span></span></mdw-icon-button></form>`;
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
        const button = document.createElement('mdw-icon-button');
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
      /** @type {InstanceType<IconButton>} */
      let btn;
      /** @type {InstanceType<IconButton>} */
      let menu_btn;
      beforeEach(() => {
        fm1 = html`
          <form name="fm1" style="display:none">
            <mdw-icon-button type=submit>BUTTON</mdw-icon-button>
            <mdw-icon-button type="menu" menu="menu">MENU BUTTON</mdw-icon-button>
          </form>
        `;
        [btn, menu_btn] = /** @type {HTMLCollectionOf<InstanceType<IconButton>>} */ (fm1.children);
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
        const btn2 = /** @type {InstanceType<IconButton>} */ (document.createElement('mdw-icon-button'));
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
          <p><label>Full name:<label>(name)<mdw-icon-button id='button_id1'>button1</mdw-icon-button><small>Format: First Last</small></label></label></p>
          <p><label>Age: <mdw-icon-button id='button_id2'>button2</mdw-icon-button></label></p>
        </form>
      `;
      /** @type {NodeListOf<InstanceType<IconButton>>} */
      const [button1, button2] = form.querySelectorAll('mdw-icon-button');

      assert.isTrue(button1.labels instanceof NodeList, 'button1.labels is NodeList');
      assert.equal(button1.labels.length, 2, 'button1.labels.length');

      assert.isTrue(button2.labels instanceof NodeList, 'button2.labels is NodeList');
      assert.equal(button2.labels.length, 1, 'button2.labels.length');
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-menu-historical.html */
    describe('button-menu-historical', () => {
      it('button.menu, the potentially-reflecting IDL attribute, does not exist', () => {
        /** @type {InstanceType<IconButton>} */
        const button = html`
          <mdw-icon-button id="b" type="menu" menu="m">button</mdw-icon-button>
          <menu id="m"></menu>
        `;
        assert.isFalse('menu' in button, 'The menu property must not exist on the button');
        // @ts-ignore intentional
        assert.equal(button.menu, undefined, 'The value of the menu property on the button must be undefined');
      });

      it('button.type reflects properly', () => {
        /** @type {InstanceType<IconButton>} */
        const button = html`
          <mdw-icon-button id="b" type="menu" menu="m">button</mdw-icon-button>
          <menu id="m"></menu>
        `;
        // <mdw-icon-button> defaults to 'button', not 'submit'
        assert.equal(button.type, 'button', 'The type property must reflect as its invalid value default of submit');
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-setcustomvalidity.html */
    describe('button-setcustomvalidity', () => {
      it('button setCustomValidity is correct', () => {
        /** @type {InstanceType<IconButton>} */
        const elem = html`<mdw-icon-button></mdw-icon-button>`;
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
            <mdw-icon-button id=submitbutton type=submit>
              <div id=buttonchilddiv>
                button child div text
              </div>
            </mdw-icon-button>
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
            <mdw-icon-button id=submitbutton type=submit>
              <span id=outerchild>
                <span id=innerchild>submit</span>
              </span>
            </mdw-icon-button>
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
            <mdw-icon-button id=submitbutton type=submit>
              <span id=outerchild>
                <span id=innerchild>submit</span>
              </span>
            </mdw-icon-button>
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
            <mdw-icon-button id="submitbutton" type="submit">Submit</mdw-icon-button>
          </form>
        `;

        frame.addEventListener('load', (() => {
          const expected = (new URL('does_not_exist.html?name=bar', window.location.href)).href;
          if (frame.contentWindow.location.href !== expected && FIREFOX_VERSION) {
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
      // mdw-icon-button's default is "button" not "submit"

      it('keyword reset', () => {
        assert.equal(html`<mdw-icon-button type="reset">`.type, 'reset', 'lowercase valid');
        assert.equal(html`<mdw-icon-button type="ReSeT">`.type, 'reset', 'mixed case valid');
        assert.equal(html`<mdw-icon-button type="reſet">`.type, 'button', 'non-ASCII invalid');
      });

      it('keyword button', () => {
        assert.equal(html`<mdw-icon-button type="button">`.type, 'button', 'lowercase valid');

        // vacuous: the invalid value default is currently submit, so even if the UA
        // treats this as invalid, the observable behaviour would still be correct
        assert.equal(html`<mdw-icon-button type="BuTtoN">`.type, 'button', 'mixed case valid');

        // vacuous: the invalid value default is currently submit, so even if the UA
        // treats this as valid, the observable behaviour would still be correct
        assert.equal(html`<mdw-icon-button type="ßutton">`.type, 'button', 'non-ASCII invalid');
      });
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-type.html */
    describe('button-type', () => {
      // mdw-icon-button's default is "button" not "submit"

      it("a button's type should be submit by default", () => {
        const button =/** @type {InstanceType<IconButton>} */ (document.createElement('mdw-icon-button'));
        assert.equal(button.type, 'button');
      });

      it("a button's type should stay within the range of valid values", () => {
        const button =/** @type {InstanceType<IconButton>} */ (document.createElement('mdw-icon-button'));

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
            <mdw-icon-button name="submitButton" type="submit">Submit</mdw-icon-button>
            <mdw-icon-button name="resetButton" type="reset">Reset</mdw-icon-button>
            <mdw-icon-button name="buttonButton" type="button">Button</mdw-icon-button>
          </form>
        `;
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          assert.fail('form should not be submitted');
        });

        for (const button of document.querySelectorAll('mdw-icon-button')) {
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
      // mdw-icon-button's default type is "button" not "submit"
      // mdw-icon-button's default willValidate is false (button)

      /**
       * @param {InstanceType<IconButton>} element
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

      willValid(html`<mdw-icon-button id=btn1>button</mdw-icon-button>`, 'button', false, 'missing type attribute');
      willValid(html`<mdw-icon-button id=btn2 type=submit>button</mdw-icon-button>`, 'submit', true, 'submit type attribute');
      willValid(html`<mdw-icon-button id=btn3 type=reset>button</mdw-icon-button>`, 'reset', false, 'reset type attribute');
      willValid(html`<mdw-icon-button id=btn4 type=button>button</mdw-icon-button>`, 'button', false, 'button type attribute');
      willValid(html`<mdw-icon-button id=btn5 type=menu>button</mdw-icon-button>`, 'button', false, 'historical menu type attribute');
      willValid(html`<mdw-icon-button id=btn6 type=foobar>button</mdw-icon-button>`, 'button', false, 'invalid type attribute');
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-validationmessage.html */
    it('button-validationmessage', () => {
      const form = html`
        <form method="post"
            enctype="application/x-www-form-urlencoded"
            action=""
            id="input_form">
          <p><mdw-icon-button id='button_id' type=submit>button</mdw-icon-button></p>
        </form>
      `;

      /** @type {InstanceType<IconButton>} */
      const button = form.querySelector('mdw-icon-button');

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
          <p><mdw-icon-button id='button_id' type=submit>button</mdw-icon-button></p>
        </form>
      `;

      /** @type {InstanceType<IconButton>} */
      const button = form.querySelector('mdw-icon-button');

      if (typeof (button.validity) === 'object') {
        assert.equal(button.validity.valueMissing, false, 'validity attribute is not correct.');
      } else {
        assert.fail('validity attribute is not exist.');
      }
    });

    /** @see https://wpt.live/html/semantics/forms/the-button-element/button-willvalidate-readonly-attribute.html */
    it('button-willvalidate-readonly-attribute', () => {
      // mdw-icon-button's default type is "button" not "submit"
      // mdw-icon-button's default willValidate is false (button)

      /** @type {InstanceType<IconButton>} */
      const implicitSubmitButton = html`<mdw-icon-button id="implicitSubmitButton" readonly>1</mdw-icon-button>`;
      /** @type {InstanceType<IconButton>} */
      const explicitSubmitButton = html`<mdw-icon-button id="explicitSubmitButton" readonly type="submit">2</mdw-icon-button>`;

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
          <p><mdw-icon-button id='button_id' type=submit>button</mdw-icon-button></p>
        </form>
      `;
      /** @type {InstanceType<IconButton>} */
      const button = form.querySelector('mdw-icon-button');

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
        const f1 = html`<form><mdw-icon-button name=b1></mdw-icon-button></form>`;
        const b1 = /** @type {InstanceType<IconButton>} */ (f1.firstElementChild);
        f1.addEventListener('submit', (e) => {
          e.preventDefault();
          assert.fail('form has been submitted');
        });
        b1.click();
        done();
      });

      it('the element is barred from constraint validation', () => {
        const form = html`<form><mdw-icon-button name=b1></mdw-icon-button></form>`;
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);
        assert.isFalse(button.willValidate);
      });

      it('clicking on button should not reset other form fields', () => {
      /** @type {{children: [HTMLInputElement, InstanceType<IconButton>]}} */
      // @ts-ignore skip cast
        const { children: [radio, button] } = html`
          <form>
            <input type=radio checked name=b3>
            <mdw-icon-button name=b3></mdw-icon-button>
          </form>
        `;
        radio.value = 'bar';
        button.click();
        assert.equal(radio.value, 'bar');
      });

      it('clicking on button should not unchecked radio buttons', () => {
      /** @type {{children: [HTMLInputElement, InstanceType<IconButton>]}} */
      // @ts-ignore skip cast
        const { children: [radio, button] } = html`
          <form>
            <input type=radio checked name=b3>
            <mdw-icon-button name=b3></mdw-icon-button>
          </form>
        `;
        assert.isTrue(radio.checked);
        button.click();
        assert.isTrue(radio.checked);
      });

      it('clicking on button should not change its indeterminate IDL attribute', () => {
      /** @type {{children: [HTMLInputElement, InstanceType<IconButton>]}} */
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
      /** @type {InstanceType<IconButton>} */
        const button = html`<mdw-icon-button></mdw-icon-button>`;
        assert.isUndefined(button.click(), 'The input element represents a button with no default behavior');
      });

      it('empty value attribute', () => {
      /** @type {InstanceType<IconButton>} */
        const button = html`<mdw-icon-button></mdw-icon-button>`;
        assert.equal(button.value, '', 'It must be the empty string');
      });

      it('label value', () => {
        /** @type {{children: InstanceType<IconButton>[]}} */
        const { children: [button1, button2] } = html`
          <div>
              <mdw-icon-button></mdw-icon-button>
              <mdw-icon-button value="BUTTON"></mdw-icon-button>
          </div>
        `;
        // assert.notEqual(button1.offsetWidth, button2.offsetWidth, "If the element has a value attribute, the button's label must be the value of that attribute");
        // Icons don't change size based on label
      });

      it("mutable element's activation behavior is to do nothing.", () => {
        const form = html`
          <form action="/" method="get">
            <mdw-icon-button value="mutable"></mdw-icon-button>
          </form>
        `;
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);
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
            <mdw-icon-button value="mutable"></mdw-icon-button>
          </form>
        `;
        const button = /** @type {InstanceType<IconButton>} */ (form.firstElementChild);
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

  describe('mdw-icon-button type=checkbox', () => {
    it('does fire click on enter', async () => {
      /** @type {InstanceType<IconButton>} */
      const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
      let fired = false;
      element.addEventListener('click', () => {
        fired = true;
      });

      element.focus();
      await sendKeypress('Enter');
      assert.isTrue(fired);
    });
    describe('[checked]/.defaultChecked', () => {
      it('can be set via property', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        assert.isFalse(element.defaultChecked);
        assert.isNull(element.getAttribute('checked'));

        element.defaultChecked = true;

        assert.isTrue(element.defaultChecked);
        assert.equal(element.getAttribute('checked'), '');
      });

      it('can be set via attribute', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        assert.isFalse(element.defaultChecked);
        assert.isNull(element.getAttribute('checked'));

        element.setAttribute('checked', '');

        assert.isTrue(element.defaultChecked);
        assert.equal(element.getAttribute('checked'), '');
      });

      it('can be unset via property', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox checked>foo</mdw-icon-button>`;
        assert.isTrue(element.defaultChecked);
        assert.equal(element.getAttribute('checked'), '');

        element.defaultChecked = false;

        assert.isFalse(element.defaultChecked);
        assert.isNull(element.getAttribute('checked'));
      });

      it('can be unset via attribute', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox checked>foo</mdw-icon-button>`;
        assert.isTrue(element.defaultChecked);
        assert.equal(element.getAttribute('checked'), '');

        element.removeAttribute('checked');

        assert.isFalse(element.defaultChecked);
        assert.isNull(element.getAttribute('checked'));
      });
    });

    describe('.checked', () => {
      it('initially false if not [checked]', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        assert.isFalse(element.checked);
      });

      it('initially true if [checked]', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox checked>foo</mdw-icon-button>`;
        assert.isTrue(element.checked);
      });

      it('modified by [checked] if not dirty', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        assert.isFalse(element.checked);

        element.defaultChecked = true;

        assert.isTrue(element.checked);
      });

      it('not modified by [checked] if dirty', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        assert.isFalse(element.checked);
        element.checked = true;
        assert.isTrue(element.checked);
        element.checked = false;
        assert.isFalse(element.checked);
        element.defaultChecked = true;
        assert.isFalse(element.checked);
      });

      it('does not fire events on programmatic check', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        let fired = false;
        element.addEventListener('change', () => { fired = true; });
        element.addEventListener('input', () => { fired = true; });

        element.checked = true;
        assert.isFalse(fired);
      });

      it('does check on click', async () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        await leftClickElement(element);
        assert.isTrue(element.checked);
      });

      it('does fire events on click', async () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
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
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        let fired = false;
        element.addEventListener('click', () => {
          fired = true;
        });

        element.focus();
        await sendKeypress(' ');
        assert.isTrue(fired);
      });

      // it('does not fire click on enter', async () => {
      // /** @type {InstanceType<IconButton>} */
      //   const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
      //   let fired = false;
      //   element.addEventListener('click', () => {
      //     fired = true;
      //   });

      //   element.focus();
      //   await sendKeypress('Enter');
      //   assert.isFalse(fired);
      // });

      it('does fire click on .click', (done) => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        element.addEventListener('click', () => {
          done();
        });

        element.click();
      });

      it('does not fire events when disabled', async () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox disabled>foo</mdw-icon-button>`;
        let fired = false;
        element.addEventListener('change', () => { fired = true; });
        element.addEventListener('input', () => { fired = true; });

        await leftClickElement(element);

        assert.isFalse(fired);
      });

      it('unsets checked with preventDefault on click', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
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
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
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
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        assert.isFalse(element.checked);
        assert.isFalse(element.indeterminate);
      });

      it('can be set via property', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        element.indeterminate = true;
        assert.isTrue(element.indeterminate);
      });

      it('set false on .checked change', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        element.indeterminate = true;
        element.checked = true;
        assert.isFalse(element.indeterminate);
      });

      it('not changed by .defaultChecked', () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        element.indeterminate = true;
        element.defaultChecked = true;
        assert.isTrue(element.indeterminate);
      });
    });

    describe('aria', () => {
      it('returns button role', async () => {
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        const results = await axTree({ selector: element.tagName });
        const [{ role }] = iterateMeaningfulAXNodes(results);
        assert.equal(role, 'button');
      });

      it('supports aria-label', async () => {
        const element = html`<mdw-icon-button type=checkbox aria-label=foo></mdw-icon-button>`;
        const results = await axTree({ selector: element.tagName });
        const [{ name }] = iterateMeaningfulAXNodes(results);
        assert.equal(name, 'foo');
      });

      it('labels based on slot', async () => {
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        const results = await axTree({ selector: element.tagName });
        const [{ name }] = iterateMeaningfulAXNodes(results);
        assert.equal(name, 'foo');
      });

      it('reports aria-pressed with false', async () => {
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        const results = await axTree({ selector: element.tagName });
        const [{ pressed }] = iterateMeaningfulAXNodes(results);
        if (pressed === false) {
          assert.isFalse(pressed);
        } else {
          assert.equal(element.shadowRoot.querySelector('input').getAttribute('aria-pressed'), 'false');
          console.log('Playwright pressed state bug');
        }
      });

      it('reports aria-pressed with true', async () => {
        const element = html`<mdw-icon-button type=checkbox checked>foo</mdw-icon-button>`;
        const results = await axTree({ selector: element.tagName });
        const [node] = iterateMeaningfulAXNodes(results);
        const { pressed } = node;
        if (pressed === true) {
          assert.isTrue(pressed);
        } else {
          assert.equal(element.shadowRoot.querySelector('input').getAttribute('aria-pressed'), 'true');
          console.log('Playwright pressed state bug');
        }
      });

      it('reports aria-pressed=false on uncheck', async () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox checked>foo</mdw-icon-button>`;
        element.checked = false;
        const results = await axTree({ selector: element.tagName });
        const [{ pressed }] = iterateMeaningfulAXNodes(results);
        if (pressed === false) {
          assert.isFalse(pressed);
        } else {
          assert.equal(element.shadowRoot.querySelector('input').getAttribute('aria-pressed'), 'false');
          console.log('Playwright pressed state bug');
        }
      });

      it('reports aria-pressed=false on cleared indeterminate', async () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox checked>foo</mdw-icon-button>`;
        element.indeterminate = true;
        element.checked = false;
        const results = await axTree({ selector: element.tagName });
        const [{ pressed }] = iterateMeaningfulAXNodes(results);
        if (pressed === false) {
          assert.isFalse(pressed);
        } else {
          assert.equal(element.shadowRoot.querySelector('input').getAttribute('aria-pressed'), 'false');
          console.log('Playwright pressed state bug');
        }
      });

      it('reports aria-pressed=true on cleared indeterminate', async () => {
      /** @type {InstanceType<IconButton>} */
        const element = html`<mdw-icon-button type=checkbox>foo</mdw-icon-button>`;
        element.indeterminate = true;
        element.checked = true;
        const results = await axTree({ selector: element.tagName });
        const [{ pressed }] = iterateMeaningfulAXNodes(results);
        if (pressed === true) {
          assert.isTrue(pressed);
        } else {
          assert.equal(element.shadowRoot.querySelector('input').getAttribute('aria-pressed'), 'true');
          console.log('Playwright pressed state bug');
        }
      });
    });

    /* eslint-disable camelcase */
    /** @see http://wpt.live/html/semantics/forms/the-input-element/checkbox.html */
    describe('wpt - checkbox', () => {
      it('click on mutable checkbox fires a click event, then an input event, then a change event', () => {
      /** @type {InstanceType<IconButton>} */
        const checkbox1 = html`<mdw-icon-button type=checkbox></mdw-icon-button>`;
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
      /** @type {InstanceType<IconButton>} */
        const checkbox2 = html`<mdw-icon-button type=checkbox disabled></mdw-icon-button>`;
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
      /** @type {InstanceType<IconButton>} */
        const checkbox3 = html`<mdw-icon-button type=checkbox></mdw-icon-button>`;
        checkbox3.indeterminate = true;
        checkbox3.click();
        assert.isTrue(checkbox3.checked);
        assert.isFalse(checkbox3.indeterminate);
      });

      it('pre-activation steps on checked checkbox', () => {
      /** @type {InstanceType<IconButton>} */
        const checkbox4 = html`<mdw-icon-button type=checkbox checked></mdw-icon-button>`;
        checkbox4.indeterminate = true;
        checkbox4.click();
        assert.isFalse(checkbox4.checked);
        assert.isFalse(checkbox4.indeterminate);
      });

      it('canceled activation steps on unchecked checkbox', (done) => {
      /** @type {InstanceType<IconButton>} */
        const checkbox5 = html`<mdw-icon-button type=checkbox></mdw-icon-button>`;
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
      /** @type {InstanceType<IconButton>} */
        const checkbox6 = html`<mdw-icon-button type=checkbox></mdw-icon-button>`;
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
      /** @type {InstanceType<IconButton>} */
        const checkbox_default = html`<mdw-icon-button type=checkbox width=20></mdw-icon-button>`;
        assert.isFalse(checkbox_default.checked);
      });

      it('checkbox with initial state set to checked has checkedness state', () => {
      /** @type {InstanceType<IconButton>} */
        const checkbox_checked = html`<mdw-icon-button type=checkbox checked></mdw-icon-button>`;
        assert.isTrue(checkbox_checked.checked);
      });

      it('changing the checked attribute to a string sets the checkedness state', () => {
      /** @type {InstanceType<IconButton>} */
        const checkbox_default = html`<mdw-icon-button type=checkbox width=20></mdw-icon-button>`;
        // @ts-expect-error intentionally wrong type
        checkbox_default.checked = 'chicken';
        assert.isTrue(checkbox_default.checked);
      });

      it('a checkbox has an indeterminate state set to false onload', () => {
      /** @type {InstanceType<IconButton>} */
        const checkbox_indeterminate = html`<mdw-icon-button type=checkbox></mdw-icon-button>`;
        assert.isFalse(checkbox_indeterminate.indeterminate);
      });

      it("on setting, a checkbox's indeterminate state must be set to the new value and returns the last value it was set to", () => {
      /** @type {InstanceType<IconButton>} */
        const checkbox_indeterminate = html`<mdw-icon-button type=checkbox></mdw-icon-button>`;
        checkbox_indeterminate.indeterminate = true;
        assert.isTrue(checkbox_indeterminate.indeterminate);
      });

      it("default/on: on getting, if the element has a value attribute, it must return that attribute's value; otherwise, it must return the string 'on'", () => {
      /** @type {InstanceType<IconButton>} */
        const checkbox_default_value = html`<mdw-icon-button type=checkbox></mdw-icon-button>`;
        assert.equal(checkbox_default_value.value, 'on');
      });

      it("on getting, if the element has a value attribute, it must return that attribute's value", () => {
      /** @type {InstanceType<IconButton>} */
        const checkbox_default_value = html`<mdw-icon-button type=checkbox></mdw-icon-button>`;
        checkbox_default_value.value = 'chicken';
        assert.equal(checkbox_default_value.value, 'chicken');
      });
    });

    /** @see http://wpt.live/html/semantics/forms/the-input-element/checkbox-click-events.html */
    describe('wpt - checkbox-click-events', () => {
      it('clicking and preventDefaulting a checkbox causes the checkbox to be checked during the click handler but reverted', () => {
        const input = /** @type {InstanceType<IconButton>} */ (document.createElement('mdw-icon-button'));
        input.type = 'checkbox';

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
        const input = /** @type {InstanceType<IconButton>} */ (document.createElement('mdw-icon-button'));
        input.type = 'checkbox';
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
        const input = /** @type {InstanceType<IconButton>} */ (document.createElement('mdw-icon-button'));
        input.type = 'checkbox';
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
        const input = /** @type {InstanceType<IconButton>} */ (document.createElement('mdw-icon-button'));
        input.type = 'checkbox';
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
});
