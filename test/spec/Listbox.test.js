import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import ListOption from '../../components/ListOption.js';
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

  it('normalizes Option constructor text and DOMString setters', () => {
    const option = new ListOption('  Alpha\n Beta  ', undefined, true);

    assert.equal(option.text, 'Alpha Beta');
    assert.equal(option.value, 'Alpha Beta');
    assert.isTrue(option.defaultSelected);
    assert.isFalse(option.selected);

    option.innerHTML = ' Gamma <span> Delta </span><script>ignored</script>';

    assert.equal(option.text, 'Gamma Delta');
    assert.equal(option.value, 'Gamma Delta');

    option.value = undefined;
    option.text = null;

    assert.equal(option.value, 'undefined');
    assert.equal(option.text, 'null');
    assert.equal(option.textContent, 'null');
  });

  it('uses explicit text for value fallback and direct Listbox form ownership', () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox>
          <mdw-list-option text="Explicit text">Light text</mdw-list-option>
        </mdw-listbox>
        <div id=unrelated></div>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const [option] = listbox.options;
    const unrelated = form.querySelector('#unrelated');

    assert.equal(option.text, 'Explicit text');
    assert.equal(option.value, 'Explicit text');
    assert.strictEqual(option.form, form);
    assert.deepEqual([...form.elements], [listbox]);

    unrelated.append(option);

    assert.isNull(option.form);
    assert.equal(option.index, -1);
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

  it('emits one input then one change only for successful user selection', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option value=alpha>Alpha</mdw-list-option>
        <mdw-list-option value=beta>Beta</mdw-list-option>
        <mdw-list-option value=disabled disabled>Disabled</mdw-list-option>
      </mdw-listbox>
    `;
    const [, second, disabled] = listbox.options;
    const events = [];
    listbox.addEventListener('input', (event) => {
      events.push([event.type, event.bubbles, event.composed]);
    });
    listbox.addEventListener('change', (event) => {
      events.push([event.type, event.bubbles, event.composed]);
    });

    await leftClickElement(second);

    assert.deepEqual(events, [
      ['input', true, true],
      ['change', true, false],
    ]);

    events.length = 0;
    await leftClickElement(disabled);
    listbox.value = 'alpha';
    listbox.selectedIndex = 1;
    listbox.options.selectedIndex = 0;

    assert.deepEqual(events, []);
  });

  it('allows optional single selection to be cleared by click and Space', async () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=choice>
          <mdw-list-option value=alpha checkbox selected>Alpha</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const [option] = listbox.options;
    const events = [];
    listbox.addEventListener('input', () => events.push('input'));
    listbox.addEventListener('change', () => events.push('change'));

    await leftClickElement(option);

    assert.isFalse(option.selected);
    assert.equal(listbox.selectedIndex, -1);
    assert.isFalse(new FormData(form).has('choice'));
    assert.deepEqual(events, ['input', 'change']);

    await leftClickElement(option);
    option.focus();
    await sendKeypress('Space');

    assert.isFalse(option.selected);
    assert.deepEqual(events, ['input', 'change', 'input', 'change', 'input', 'change']);
  });

  it('does not emit updates for unchanged required activation or reset', async () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=choice required>
          <mdw-list-option value=alpha selected>Alpha</mdw-list-option>
          <mdw-list-option value=beta>Beta</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const [first, second] = listbox.options;
    const events = [];
    listbox.addEventListener('input', (event) => events.push(event.type));
    listbox.addEventListener('change', (event) => events.push(event.type));

    await leftClickElement(first);
    first.focus();
    await sendKeypress('Space');
    second.selected = true;
    form.reset();

    assert.deepEqual(events, []);
    assert.isTrue(first.selected);
    assert.isFalse(second.selected);
    assert.equal(new FormData(form).get('choice'), 'alpha');
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

  it('keeps selected disabled values while excluding them from submission', () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=choice required multiple>
          <mdw-list-option value=alpha selected>Alpha</mdw-list-option>
          <mdw-list-option value=beta selected>Beta</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const [first, second] = listbox.options;

    first.disabled = true;

    assert.isTrue(first.selected);
    assert.isTrue(listbox.validity.valid);
    assert.deepEqual(new FormData(form).getAll('choice'), ['beta']);

    second.disabled = true;

    assert.isTrue(listbox.validity.valid);
    assert.deepEqual(new FormData(form).getAll('choice'), []);
    assert.equal(listbox.value, 'alpha');

    first.disabled = false;
    assert.deepEqual(new FormData(form).getAll('choice'), ['alpha']);
  });

  it('maintains required placeholder and replaceable custom validity', () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=choice required>
          <mdw-list-option value="" selected>Choose</mdw-list-option>
          <mdw-list-option value=alpha>Alpha</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');

    assert.isTrue(listbox.validity.valueMissing);
    assert.isFalse(form.checkValidity());

    listbox.selectedIndex = 1;
    assert.isTrue(listbox.validity.valid);

    listbox.setCustomValidity('first');
    assert.isTrue(listbox.validity.customError);
    assert.equal(listbox.validationMessage, 'first');

    listbox.setCustomValidity('second');
    assert.equal(listbox.validationMessage, 'second');

    listbox.setCustomValidity('');
    assert.isTrue(listbox.validity.valid);

    listbox.selectedIndex = 0;
    listbox.size = 2;
    assert.isTrue(listbox.validity.valid);
  });

  it('resynchronizes submission after name, value, and mode changes', () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=old multiple>
          <mdw-list-option value=alpha selected>Alpha</mdw-list-option>
          <mdw-list-option value=beta selected>Beta</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const [first, second] = listbox.options;

    listbox.name = 'new';
    assert.isFalse(new FormData(form).has('old'));
    assert.deepEqual(new FormData(form).getAll('new'), ['alpha', 'beta']);

    first.value = 'updated';
    assert.deepEqual(new FormData(form).getAll('new'), ['updated', 'beta']);

    listbox.multiple = false;
    assert.equal(listbox.type, 'select-one');
    assert.isTrue(first.selected);
    assert.isFalse(second.selected);
    assert.deepEqual(new FormData(form).getAll('new'), ['updated']);
  });

  it('reads fallback text on demand', () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=choice required>
          <mdw-list-option selected><span>Alpha</span></mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const [option] = listbox.options;
    const span = option.querySelector('span');

    assert.equal(new FormData(form).get('choice'), 'Alpha');

    span.textContent = 'Beta';
    assert.equal(option.text, 'Beta');
    assert.equal(option.value, 'Beta');
    assert.equal(listbox.value, 'Beta');

    span.textContent = '';
    assert.equal(option.text, '');
    assert.equal(option.value, '');
    assert.equal(listbox.value, '');
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
    assert.isFalse(new FormData(form).has('choice'));
  });

  it('keeps stable live collections and indices scoped to direct options', async () => {
    /** @type {InstanceType<Listbox>} */
    const outer = html`
      <mdw-listbox>
        <mdw-list-option id=outer-alpha value=alpha>Alpha</mdw-list-option>
        <mdw-listbox id=inner>
          <mdw-list-option id=inner-alpha value=inner>Inner</mdw-list-option>
        </mdw-listbox>
        <div><mdw-list-option id=wrapped value=wrapped>Wrapped</mdw-list-option></div>
        <mdw-list-option id=outer-beta value=beta>Beta</mdw-list-option>
      </mdw-listbox>
    `;
    /** @type {InstanceType<Listbox>} */
    const inner = outer.querySelector('#inner');
    /** @type {InstanceType<ListOption>} */
    const outerAlpha = outer.querySelector('#outer-alpha');
    /** @type {InstanceType<ListOption>} */
    const outerBeta = outer.querySelector('#outer-beta');
    /** @type {InstanceType<ListOption>} */
    const innerAlpha = outer.querySelector('#inner-alpha');
    const options = outer.options;
    const selectedOptions = outer.selectedOptions;

    assert.strictEqual(outer.options, options);
    assert.strictEqual(outer.selectedOptions, selectedOptions);
    assert.deepEqual([...options], [outerAlpha, outerBeta]);
    assert.deepEqual([...inner.options], [innerAlpha]);
    assert.equal(outerAlpha.index, 0);
    assert.equal(outerBeta.index, 1);
    assert.equal(innerAlpha.index, 0);

    outerBeta.selected = true;
    innerAlpha.selected = true;

    assert.deepEqual([...selectedOptions], [outerBeta]);
    assert.equal(outer.value, 'beta');
    assert.equal(inner.value, 'inner');

    const gamma = new ListOption('Gamma', 'gamma', false, true);
    outer.append(gamma);

    assert.equal(gamma.index, 2);
    assert.equal(outer.value, 'gamma');

    gamma.remove();

    assert.equal(gamma.index, -1);
    assert.equal(outer.value, 'alpha');
    await nextTask();
    assert.deepEqual([...options], [outerAlpha, outerBeta]);
  });

  it('reuses the synchronized option order for collection reads', () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option value=alpha>Alpha</mdw-list-option>
        <hr>
        <mdw-list-option value=beta>Beta</mdw-list-option>
      </mdw-listbox>
    `;
    const options = listbox.options;
    const [alpha, beta] = options;
    const indexedOptions = listbox._indexedOptionsArray;

    assert.equal(options.length, 2);
    assert.strictEqual(options[0], alpha);
    assert.strictEqual(options.item(1), beta);
    assert.strictEqual(listbox._indexedOptionsArray, indexedOptions);

    const gamma = new ListOption('Gamma', 'gamma');
    listbox.append(gamma);

    assert.notStrictEqual(listbox._indexedOptionsArray, indexedOptions);
    assert.equal(options.length, 3);
    assert.strictEqual(options[2], gamma);
    assert.equal(gamma.index, 2);
  });

  it('reconciles both owners synchronously when moving an option', () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=source>
          <mdw-list-option value=alpha selected>Alpha</mdw-list-option>
          <mdw-list-option value=beta>Beta</mdw-list-option>
        </mdw-listbox>
        <mdw-listbox name=destination>
          <mdw-list-option value=gamma selected>Gamma</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    const [source, destination] = form.querySelectorAll('mdw-listbox');
    const [alpha] = source.options;

    destination.append(alpha);

    assert.deepEqual([...source.options].map((option) => option.value), ['beta']);
    assert.equal(source.value, 'beta');
    assert.equal(new FormData(form).get('source'), 'beta');
    assert.deepEqual(
      [...destination.options].map((option) => option.value),
      ['gamma', 'alpha'],
    );
    assert.equal(destination.value, 'alpha');
    assert.equal(new FormData(form).get('destination'), 'alpha');
    assert.equal(alpha.index, 1);
  });

  it('reconciles a same-owner reorder synchronously', () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option value=alpha>Alpha</mdw-list-option>
        <hr>
        <mdw-list-option value=beta>Beta</mdw-list-option>
        <mdw-list-option value=gamma>Gamma</mdw-list-option>
      </mdw-listbox>
    `;
    const options = listbox.options;
    const [alpha, beta, gamma] = options;

    alpha.before(gamma);

    assert.deepEqual([...options], [gamma, alpha, beta]);
    assert.strictEqual(options[0], gamma);
    assert.equal(gamma.index, 0);
    assert.equal(alpha.index, 1);
    assert.equal(beta.index, 2);
  });

  it('mutates options synchronously while preserving unrelated direct children', () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox name=choice>
          <mdw-list-option value=alpha selected>Alpha</mdw-list-option>
          <hr>
          <mdw-list-option value=beta>Beta</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const separator = listbox.querySelector('hr');
    const [alpha, beta] = listbox.options;
    const gamma = new ListOption('Gamma', 'gamma', false, true);

    listbox.options.add(gamma, 0);

    assert.deepEqual([...listbox.options], [gamma, alpha, beta]);
    assert.strictEqual(listbox.children[2], separator);
    assert.equal(new FormData(form).get('choice'), 'gamma');

    const replacement = new ListOption('Replacement', 'replacement', false, true);
    listbox.options[1] = replacement;

    assert.deepEqual([...listbox.options], [gamma, replacement, beta]);
    assert.strictEqual(listbox.children[2], separator);
    assert.isFalse(alpha.isConnected);

    listbox.options.remove(0);

    assert.equal(gamma.index, -1);
    assert.equal(replacement.index, 0);
    assert.equal(new FormData(form).get('choice'), 'replacement');
  });

  it('supports sparse indexed assignment, nullish removal, and writable length', () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option value=alpha>Alpha</mdw-list-option>
      </mdw-listbox>
    `;
    const options = listbox.options;
    const sparse = new ListOption('Sparse', 'sparse');

    options[3] = sparse;

    assert.equal(options.length, 4);
    assert.instanceOf(options[1], ListOption);
    assert.instanceOf(options[2], ListOption);
    assert.strictEqual(options[3], sparse);

    options[1] = undefined;
    assert.equal(options.length, 3);
    assert.strictEqual(options[2], sparse);

    listbox.length = 1;
    assert.equal(options.length, 1);
    assert.isFalse(sparse.isConnected);

    options.length = 3;
    assert.equal(listbox.length, 3);
    assert.instanceOf(options[1], ListOption);
    assert.instanceOf(options[2], ListOption);

    const huge = new ListOption('Huge', 'huge');
    options[100_000] = huge;
    options.length = 100_001;

    assert.equal(options.length, 3);
    assert.isFalse(huge.isConnected);
  });

  it('applies Web IDL conversions and rejects invalid mutations before changing DOM', () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option id=null value=alpha>Alpha</mdw-list-option>
        <mdw-list-option value=beta>Beta</mdw-list-option>
      </mdw-listbox>
    `;
    const options = listbox.options;
    const [alpha, beta] = options;

    // @ts-expect-error Web IDL accepts convertible values.
    assert.strictEqual(options.item('1'), beta);
    assert.strictEqual(options.namedItem(null), alpha);

    const inserted = new ListOption('Inserted', 'inserted');
    // @ts-expect-error Web IDL accepts convertible values.
    options.add(inserted, '0');
    assert.strictEqual(options[0], inserted);
    // @ts-expect-error Web IDL accepts convertible values.
    options.remove('0');
    assert.strictEqual(options[0], alpha);

    listbox.selectedIndex = 1.9;
    assert.equal(listbox.selectedIndex, 1);
    listbox.selectedIndex = Number.NaN;
    assert.equal(listbox.selectedIndex, 0);

    const originalChildren = [...listbox.children];
    assert.throws(() => {
      // @ts-expect-error Collections accept only ListOption values.
      options[0] = document.createElement('div');
    }, TypeError);
    assert.throws(() => {
      // @ts-expect-error Collections accept only ListOption values.
      options.add(document.createElement('div'));
    }, TypeError);
    assert.deepEqual([...listbox.children], originalChildren);

    assert.throws(() => {
      // @ts-expect-error BigInt is rejected by Web IDL conversion.
      options.length = 1n;
    }, TypeError);
  });

  it('reflects collection keys, collisions, and descriptors coherently', () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option id=2 value=alpha>Alpha</mdw-list-option>
        <mdw-list-option id=item name=add value=beta>Beta</mdw-list-option>
        <mdw-list-option id=alpha name=selectedIndex value=gamma>Gamma</mdw-list-option>
        <mdw-list-option id=length name=remove value=delta>Delta</mdw-list-option>
      </mdw-listbox>
    `;
    const options = listbox.options;
    const [first, second, third, fourth] = options;
    // @ts-expect-error Expando properties are valid on platform collections.
    options.metadata = 'owned';

    const keys = Reflect.ownKeys(options);
    assert.equal(new Set(keys).size, keys.length);
    assert.isTrue(options instanceof HTMLCollection);
    assert.isTrue(options instanceof HTMLOptionsCollection);
    assert.equal(Object.prototype.toString.call(options), '[object HTMLOptionsCollection]');
    assert.strictEqual(options[2], third);
    assert.strictEqual(options.namedItem('2'), first);
    assert.strictEqual(options.namedItem('item'), second);
    assert.strictEqual(options.namedItem('add'), second);
    assert.strictEqual(options.namedItem('selectedIndex'), third);
    assert.strictEqual(options.namedItem('length'), fourth);
    assert.strictEqual(options.namedItem('remove'), fourth);
    assert.equal(typeof options.item, 'function');
    assert.equal(typeof options.add, 'function');
    assert.equal(typeof options.remove, 'function');
    assert.equal(options.length, 4);
    assert.isNumber(options.selectedIndex);
    assert.deepInclude(Object.getOwnPropertyDescriptor(options, '0'), {
      value: first,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    assert.deepInclude(Object.getOwnPropertyDescriptor(options, 'alpha'), {
      value: third,
      writable: false,
      enumerable: true,
      configurable: true,
    });
  });

  it('preserves Proxy invariants for expandos and integrity operations', () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox><mdw-list-option>Alpha</mdw-list-option></mdw-listbox>
    `;
    const options = listbox.options;
    Object.defineProperty(options, 'metadata', {
      value: 'owned',
      writable: false,
      enumerable: true,
      configurable: false,
    });

    assert.equal(options.metadata, 'owned');
    assert.deepInclude(Object.getOwnPropertyDescriptor(options, 'metadata'), {
      value: 'owned',
      writable: false,
      enumerable: true,
      configurable: false,
    });
    assert.include(Reflect.ownKeys(options), 'metadata');
    assert.throws(() => Object.preventExtensions(options), TypeError);
    assert.throws(() => Object.seal(options), TypeError);
    assert.throws(() => Object.freeze(options), TypeError);
    assert.isTrue(Object.isExtensible(options));
  });

  it('synchronizes once per effective collection transaction', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option value=alpha selected>Alpha</mdw-list-option>
        <mdw-list-option value=beta>Beta</mdw-list-option>
      </mdw-listbox>
    `;
    const updateFormAssociatedValue = listbox._updateFormAssociatedValue;
    let synchronizations = 0;
    listbox._updateFormAssociatedValue = function updateFormAssociatedValueCounter(...args) {
      if (args.length) {
        synchronizations += 1;
      }
      return updateFormAssociatedValue.call(this, ...args);
    };

    const gamma = new ListOption('Gamma', 'gamma', false, true);
    listbox.options.add(gamma);
    assert.equal(synchronizations, 1);
    await nextTask();
    assert.equal(synchronizations, 1);

    listbox.options[0] = new ListOption('Replacement', 'replacement', false, true);
    assert.equal(synchronizations, 2);
    await nextTask();
    assert.equal(synchronizations, 2);

    listbox.options.remove(1);
    assert.equal(synchronizations, 3);
    await nextTask();
    assert.equal(synchronizations, 3);

    listbox.options.length = 1;
    assert.equal(synchronizations, 4);
    await nextTask();
    assert.equal(synchronizations, 4);

    listbox.options.remove(20);
    listbox.options[20] = null;
    listbox.options.length = 1;
    assert.equal(synchronizations, 4);
  });

  it('keeps select-level programmatic selectedness dirty until reset', () => {
    /** @type {HTMLFormElement} */
    const form = html`
      <form>
        <mdw-listbox>
          <mdw-list-option selected>Alpha</mdw-list-option>
          <mdw-list-option>Beta</mdw-list-option>
        </mdw-listbox>
      </form>
    `;
    /** @type {InstanceType<Listbox>} */
    const listbox = form.querySelector('mdw-listbox');
    const [first, second] = listbox.options;

    listbox.selectedIndex = 1;
    first.defaultSelected = false;
    first.defaultSelected = true;

    assert.isFalse(first.selected);
    assert.isTrue(second.selected);

    form.reset();

    assert.isTrue(first.selected);
    assert.isFalse(second.selected);
    assert.isFalse(first._selectedDirty);
    assert.isFalse(second._selectedDirty);
  });

  it('rebuilds direct state after disconnect without retaining removed options', () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option value=alpha selected>Alpha</mdw-list-option>
        <mdw-list-option value=beta>Beta</mdw-list-option>
      </mdw-listbox>
    `;
    const [first, second] = listbox.options;

    listbox.remove();
    assert.isNull(listbox._indexedOptions);

    first.remove();
    assert.equal(first.index, -1);
    assert.equal(second.index, 0);

    document.body.append(listbox);

    assert.equal(listbox.options.length, 1);
    assert.equal(listbox.value, 'beta');
    assert.equal(listbox._indexedOptions.size, 1);
    assert.isFalse(listbox._indexedOptions.has(first));
  });

  it('isolates nested and wrapped selection and activation', async () => {
    /** @type {InstanceType<Listbox>} */
    const outer = html`
      <mdw-listbox>
        <mdw-list-option id=outer-alpha value=alpha selected>Alpha</mdw-list-option>
        <mdw-listbox id=inner>
          <mdw-list-option value=inner-alpha>Inner alpha</mdw-list-option>
          <mdw-list-option id=inner-beta value=inner-beta>Inner beta</mdw-list-option>
        </mdw-listbox>
        <div><mdw-list-option id=wrapped value=wrapped>Wrapped</mdw-list-option></div>
      </mdw-listbox>
    `;
    /** @type {InstanceType<Listbox>} */
    const inner = outer.querySelector('#inner');
    /** @type {InstanceType<ListOption>} */
    const innerBeta = outer.querySelector('#inner-beta');
    /** @type {InstanceType<ListOption>} */
    const wrapped = outer.querySelector('#wrapped');

    await leftClickElement(innerBeta);
    await leftClickElement(wrapped);

    assert.equal(inner.value, 'inner-beta');
    assert.equal(outer.value, 'alpha');
    assert.isFalse(wrapped.selected);
    assert.deepEqual([...outer.options].map((option) => option.value), ['alpha']);
  });

  it('moves focus with Arrow/Home/End without changing selection or supporting typeahead', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option value=alpha>Alpha</mdw-list-option>
        <mdw-list-option value=beta>Beta</mdw-list-option>
        <mdw-list-option value=gamma>Gamma</mdw-list-option>
      </mdw-listbox>
    `;
    const [first, second, third] = listbox.options;

    first.focus();
    await sendKeypress('ArrowDown');
    assert.equal(document.activeElement, second);
    assert.equal(listbox.selectedIndex, 0);

    await sendKeypress('End');
    assert.equal(document.activeElement, third);
    assert.equal(listbox.selectedIndex, 0);

    await sendKeypress('Home');
    assert.equal(document.activeElement, first);

    const typeahead = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      key: 'g',
    });
    first.dispatchEvent(typeahead);

    assert.isFalse(typeahead.defaultPrevented);
    assert.equal(document.activeElement, first);
    assert.equal(listbox.selectedIndex, 0);
  });

  it('focuses disabled options without selecting them', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox size=3>
        <mdw-list-option value=alpha>Alpha</mdw-list-option>
        <mdw-list-option value=beta disabled>Beta</mdw-list-option>
        <mdw-list-option value=gamma>Gamma</mdw-list-option>
      </mdw-listbox>
    `;
    const [first, disabled, third] = listbox.options;

    first.focus();
    await sendKeypress('ArrowDown');
    assert.equal(document.activeElement, disabled);

    await sendKeypress('Space');
    assert.isFalse(disabled.selected);
    assert.equal(listbox.selectedIndex, -1);

    await sendKeypress('ArrowDown');
    assert.equal(document.activeElement, third);
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

  it('reconciles changed option topology on keyboard navigation', async () => {
    /** @type {InstanceType<Listbox>} */
    const listbox = html`
      <mdw-listbox>
        <mdw-list-option value=alpha>Alpha</mdw-list-option>
        <mdw-list-option value=beta>Beta</mdw-list-option>
      </mdw-listbox>
    `;
    const [first, second] = listbox.options;

    first.focus();
    second.before(new ListOption('Inserted', 'inserted'));
    const [, inserted] = listbox.options;

    assert.equal(inserted.tabIndex, 0);
    await sendKeypress('ArrowDown');

    assert.equal(document.activeElement, inserted);
    assert.equal(first.tabIndex, -1);
    assert.equal(inserted.tabIndex, 0);
    assert.equal(second.tabIndex, -1);
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
