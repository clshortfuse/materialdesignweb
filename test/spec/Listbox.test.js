import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import Listbox from '../../components/Listbox.js';
import { html, leftClickElement, makeFromConstructor, makeFromString, makeFromTagName, sendKeypress } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('mdw-listbox', () => {
  it('can be created with document.createElement', () => {
    const element = makeFromTagName('mdw-listbox');
    assert.equal(element.tagName.toLowerCase(), 'mdw-listbox');
  });

  it('can be created with new ()', () => {
    const element = makeFromConstructor(Listbox);
    assert.equal(element.tagName.toLowerCase(), 'mdw-listbox');
  });

  it('can be created with fragment', () => {
    const element = makeFromString('<mdw-listbox></mdw-listbox>');
    assert.equal(element.tagName.toLowerCase(), 'mdw-listbox');
  });

  it('is the form/select list primitive', async () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=choice>
          <mdw-list-option value=alpha label=Alpha>Alpha</mdw-list-option>
          <mdw-list-option value=beta label=Beta>Beta</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const [, second] = listbox.options;

    assert.equal(listbox.form, form);
    assert.equal(listbox.type, 'select-one');

    await leftClickElement(second);

    assert.equal(listbox.value, 'beta');
    assert.equal(listbox.selectedOptions[0], second);
    assert.equal(listbox.selectedOptions[0].label, 'Beta');
    assert.equal(new FormData(form).get('choice'), 'beta');
  });

  it('submits multiple selected values when multiple', async () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=choice multiple>
          <mdw-list-option value=alpha>Alpha</mdw-list-option>
          <mdw-list-option value=beta>Beta</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const [first, second] = listbox.options;

    assert.equal(listbox.type, 'select-multiple');

    await leftClickElement(first);
    await leftClickElement(second);

    assert.sameMembers(new FormData(form).getAll('choice'), ['alpha', 'beta']);
  });

  it('updates selection from selectedIndex and value setters', () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=choice>
          <mdw-list-option value=alpha>Alpha</mdw-list-option>
          <mdw-list-option value=beta>Beta</mdw-list-option>
          <mdw-list-option value=gamma>Gamma</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const [first, second, third] = listbox.options;

    listbox.selectedIndex = 1;

    assert.isFalse(first.selected);
    assert.isTrue(second.selected);
    assert.isFalse(third.selected);
    assert.equal(listbox.selectedIndex, 1);
    assert.equal(listbox.value, 'beta');
    assert.equal(new FormData(form).get('choice'), 'beta');

    listbox.value = 'gamma';

    assert.isFalse(first.selected);
    assert.isFalse(second.selected);
    assert.isTrue(third.selected);
    assert.equal(listbox.selectedIndex, 2);
    assert.equal(listbox.value, 'gamma');
    assert.equal(new FormData(form).get('choice'), 'gamma');

    listbox.value = 'missing';

    assert.equal(listbox.selectedIndex, -1);
    assert.equal(listbox.value, '');
    assert.equal(new FormData(form).get('choice'), '');
  });

  it('keeps inherited keyboard navigation enabled', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option value=alpha>Alpha</mdw-list-option>
        <mdw-list-option value=beta>Beta</mdw-list-option>
      </mdw-listbox>
    `;
    const [first, second] = listbox.options;

    assert.equal(listbox._listRole, 'listbox');
    assert.isTrue(first.refs.state.isConnected);
    assert.isTrue(first.refs.rippleContainer.isConnected);
    assert.equal(first.tabIndex, 0);
    assert.equal(second.tabIndex, -1);

    first.focus();
    await sendKeypress('ArrowDown');

    assert.equal(document.activeElement, second);
    assert.equal(first.tabIndex, -1);
    assert.equal(second.tabIndex, 0);
  });

  it('does not inherit ListItem expansion behavior on options', async () => {
    /** @type {InstanceType<typeof import('../../components/ListOption.js').default>} */
    const option = html`
      <mdw-list-option>
        Alpha
        <span slot=expansion>Details</span>
      </mdw-list-option>
    `;
    await nextTask();

    assert.notOk(option.refs.expansion);
    assert.isFalse('expanded' in option);
    assert.isFalse('_expandable' in option);
    assert.isFalse('toggleExpanded' in option);
    assert.isFalse(option.hasAttribute('aria-expanded'));
  });
});
