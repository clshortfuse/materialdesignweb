import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';
import FormAssociatedMixin from '../../mixins/FormAssociatedMixin.js';
import StateMixin from '../../mixins/StateMixin.js';
import { html } from '../utils.js';

const FormAssociatedTestElement = CustomElement
  .extend()
  .mixin(StateMixin)
  .mixin(FormAssociatedMixin)
  .autoRegister('mdw-form-associated-test');

beforeEach(() => document.body.replaceChildren());

describe('FormAssociatedMixin', () => {
  it('sets, replaces, and clears default custom validity state', () => {
    /** @type {HTMLFormElement} */
    const form = html`<form></form>`;
    const control = new FormAssociatedTestElement();
    form.append(control);

    control.setCustomValidity('first');
    control.addEventListener('invalid', (event) => event.preventDefault());

    assert.isTrue(control.validity.customError);
    assert.equal(control.validationMessage, 'first');
    assert.equal(control._validationMessage, 'first');
    assert.isTrue(control._invalid);
    assert.isFalse(control.checkValidity());
    assert.isFalse(control.reportValidity());

    control.setCustomValidity('second');

    assert.equal(control.validationMessage, 'second');
    assert.equal(control._validationMessage, 'second');

    form.reset();
    assert.equal(control.validationMessage, 'second');

    control.remove();
    form.append(control);
    assert.equal(control.validationMessage, 'second');

    control.setCustomValidity('');

    assert.isFalse(control.validity.customError);
    assert.equal(control.validationMessage, '');
    assert.equal(control._validationMessage, '');
    assert.isFalse(control._invalid);
    assert.isTrue(control.checkValidity());
    assert.isTrue(control.reportValidity());
  });

  it('releases and restores radio association listeners symmetrically', () => {
    /** @type {HTMLFormElement} */
    const form = html`<form></form>`;
    const control = new FormAssociatedTestElement();
    control.type = 'radio';
    form.append(control);

    assert.strictEqual(control._ipcTarget, form);

    control.type = 'text';
    assert.isNull(control._ipcTarget);

    control.type = 'radio';
    assert.strictEqual(control._ipcTarget, form);

    control.remove();
    assert.isNull(control._ipcTarget);

    form.append(control);
    assert.strictEqual(control._ipcTarget, form);
  });

  it('groups same-valued and default-valued radios by source identity', () => {
    /** @type {HTMLFormElement} */
    const form = html`<form></form>`;
    const first = new FormAssociatedTestElement();
    const second = new FormAssociatedTestElement();
    for (const control of [first, second]) {
      control.type = 'radio';
      control.name = 'choice';
      control.checked = true;
    }

    form.append(first, second);

    assert.equal(first.value, 'on');
    assert.equal(second.value, 'on');
    assert.isFalse(first.checked);
    assert.isTrue(second.checked);

    first.value = 'same';
    second.value = 'same';
    first.checked = true;

    assert.isTrue(first.checked);
    assert.isFalse(second.checked);

    second.type = 'text';
    second.checked = true;
    second.type = 'radio';

    assert.isFalse(first.checked);
    assert.isTrue(second.checked);

    second.remove();
    first.checked = true;
    form.append(second);

    assert.isFalse(first.checked);
    assert.isTrue(second.checked);
  });
});
