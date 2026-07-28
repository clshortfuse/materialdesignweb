import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('mdw-for reconciliation regressions', () => {
  /** @type {any} */
  let element;

  afterEach(() => {
    element?.remove();
  });

  it('tracks duplicate resource occurrences without orphaning DOM', () => {
    const DuplicateRows = CustomElement
      .extend()
      .observe({ items: { type: 'array', value: [] } })
      .html`
        <div>
          <span mdw-for="{item of items}" class="row">{item}</span>
        </div>
      `
      .register('mdw-for-duplicate-regression-test');

    element = new DuplicateRows();
    document.body.append(element);
    element.items = ['A', 'A', 'C'];

    const duplicateRows = [...element.shadowRoot.querySelectorAll('.row')];
    element.items = ['X', 'Y', 'A', 'A', 'C'];

    const insertedRows = [...element.shadowRoot.querySelectorAll('.row')];
    assert.deepEqual(insertedRows.map((row) => row.textContent), ['X', 'Y', 'A', 'A', 'C']);
    assert.equal(insertedRows[2], duplicateRows[0]);
    assert.equal(insertedRows[3], duplicateRows[1]);

    element.items = [];

    assert.lengthOf(element.shadowRoot.querySelectorAll('.row'), 0);
  });

  it('registers an iterable action once per host dependency', () => {
    let expressionCalls = 0;
    const IterableDependency = CustomElement
      .extend()
      .observe({ items: { type: 'array', value: [] } })
      .expressions({
        label({ items }, { item, index }) {
          expressionCalls += 1;
          return `${index + 1}/${items.length}:${item}`;
        },
      })
      .html`
        <div>
          <span mdw-for="{item of items}" class="row">{label}</span>
        </div>
      `
      .register('mdw-for-dependency-regression-test');

    element = new IterableDependency();
    document.body.append(element);
    expressionCalls = 0;

    element.items = ['A', 'B', 'C'];

    assert.equal(expressionCalls, 3, 'each row expression runs once');
  });

  it('uses the browser key index during a reverse', () => {
    const ReverseRows = CustomElement
      .extend()
      .observe({ items: { type: 'array', value: [] } })
      .html`
        <div>
          <span mdw-for="{item of items}" class="row">{item.label}</span>
        </div>
      `
      .register('mdw-for-reverse-regression-test');

    element = new ReverseRows();
    document.body.append(element);
    const items = Array.from({ length: 1000 }, (_, index) => ({ label: `${index}` }));
    element.items = items;

    const [adapter] = element.render.state.adapters;
    let includesCalls = 0;
    let indexOfCalls = 0;
    /** @param {...any} args */
    adapter.keys.includes = function countIncludes(...args) {
      includesCalls += 1;
      return Array.prototype.includes.apply(this, args);
    };
    /** @param {...any} args */
    adapter.keys.indexOf = function countIndexOf(...args) {
      indexOfCalls += 1;
      return Array.prototype.indexOf.apply(this, args);
    };

    element.items = [...items].reverse();

    assert.isAtMost(includesCalls, 1, 'preserves at most one browser index warm-up');
    assert.isAbove(indexOfCalls, 0, 'reconciliation uses native indexOf');
    assert.isAtMost(indexOfCalls, items.length, 'performs at most one lookup per row');
    assert.equal(element.shadowRoot.querySelector('.row').textContent, '999');
  });
});
