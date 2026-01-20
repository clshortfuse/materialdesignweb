import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('proxy observable properties', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('re-renders when a deep property changes', async () => {
    const ProxyProfile = CustomElement
      .extend()
      .observe({
        state: { type: 'proxy', value: { user: { name: 'Ada' }, count: 0 } },
      })
      .html`
        <div>
          <span class="name">{state.user.name}</span>
          <span class="count">{state.count}</span>
        </div>
      `
      .register('proxy-profile-test');

    container.innerHTML = '<proxy-profile-test></proxy-profile-test>';
    await customElements.whenDefined('proxy-profile-test');

    /** @type {InstanceType<ProxyProfile>} */
    const el = container.querySelector('proxy-profile-test');

    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Ada');
    assert.equal(el.shadowRoot.querySelector('.count').textContent, '0');

    el.state.user.name = 'Bea';
    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Bea');
  });

  it('updates mdw-for when proxy array is mutated', async () => {
    const ProxyList = CustomElement
      .extend()
      .observe({
        state: { type: 'proxy', value: { items: [] } },
      })
      .html`
        <div>
          <span mdw-for="{item of state.items}" class="item">{item.label}</span>
        </div>
      `
      .register('proxy-list-test');

    container.innerHTML = '<proxy-list-test></proxy-list-test>';
    await customElements.whenDefined('proxy-list-test');

    /** @type {InstanceType<ProxyList>} */
    const el = container.querySelector('proxy-list-test');

    el.state.items.push({ label: 'A' });
    let items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items.length, 1);
    assert.equal(items[0].textContent, 'A');

    el.state.items.push({ label: 'B' });
    items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items.length, 2);
    assert.equal(items[1].textContent, 'B');

    el.state.items[0].label = 'A2';
    items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items[0].textContent, 'A2');
  });

  it('reflects deleteProperty changes in template output', async () => {
    const ProxyDelete = CustomElement
      .extend()
      .observe({
        state: { type: 'proxy', value: { user: { name: 'Ada', title: 'Dev' } } },
      })
      .html`
        <div>
          <span class="name">{state.user.name}</span>
          <span class="title">{state.user.title}</span>
        </div>
      `
      .register('proxy-delete-test');

    container.innerHTML = '<proxy-delete-test></proxy-delete-test>';
    await customElements.whenDefined('proxy-delete-test');

    /** @type {InstanceType<ProxyDelete>} */
    const el = container.querySelector('proxy-delete-test');

    assert.equal(el.shadowRoot.querySelector('.title').textContent, 'Dev');

    // Delete should emit a patch with null and clear the binding
    delete el.state.user.title;
    assert.equal(el.shadowRoot.querySelector('.title').textContent, '');
  });

  it('updates when proxy arrays are spliced', async () => {
    const ProxySplice = CustomElement
      .extend()
      .observe({
        state: { type: 'proxy', value: { items: [] } },
      })
      .html`
        <div>
          <span mdw-for="{item of state.items}" class="item">{item.label}</span>
        </div>
      `
      .register('proxy-splice-test');

    container.innerHTML = '<proxy-splice-test></proxy-splice-test>';
    await customElements.whenDefined('proxy-splice-test');

    /** @type {InstanceType<ProxySplice>} */
    const el = container.querySelector('proxy-splice-test');

    el.state.items.push({ label: 'A' }, { label: 'B' }, { label: 'C' });
    let items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items.length, 3);
    assert.equal(items[1].textContent, 'B');

    el.state.items.splice(1, 1);
    items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items.length, 2);
    assert.equal(items[0].textContent, 'A');
    assert.equal(items[1].textContent, 'C');
  });

  it('filters proxy rows by child option and toggles mdw-if', async () => {
    const ProxyFilter = CustomElement
      .extend()
      .observe({
        rows: {
          type: 'proxy',
          value: [],
        },
        showBeta: 'boolean',
      })
      .expressions({
        rowMatches({ showBeta }, { row }) {
          if (!row?.child) return false;
          return showBeta ? row.child.option === 'beta' : row.child.option === 'alpha';
        },
      })
      .html`
        <div>
          <div mdw-for="{row of rows}" class="row">
            <span class="label" mdw-if={rowMatches}>{row.label}</span>
            <span class="flag" mdw-if={row.show}>flag</span>
          </div>
        </div>
      `
      .register('proxy-filter-test');

    container.innerHTML = '<proxy-filter-test></proxy-filter-test>';
    await customElements.whenDefined('proxy-filter-test');

    /** @type {InstanceType<ProxyFilter>} */
    const el = container.querySelector('proxy-filter-test');

    el.rows.push(
      { label: 'One', show: true, child: { option: 'alpha' } },
      { label: 'Two', show: false, child: { option: 'beta' } },
      { label: 'Three', show: true, child: { option: 'alpha' } },
    );

    await new Promise((resolve) => { setTimeout(resolve, 50); });

    let labels = el.shadowRoot.querySelectorAll('.label');
    assert.equal(labels.length, 2);
    assert.equal(labels[0].textContent, 'One');
    assert.equal(labels[1].textContent, 'Three');

    let flags = el.shadowRoot.querySelectorAll('.flag');
    assert.equal(flags.length, 2);

    el.rows[0].show = false;
    await new Promise((resolve) => { setTimeout(resolve, 50); });

    flags = el.shadowRoot.querySelectorAll('.flag');
    assert.equal(flags.length, 1);

    el.showBeta = true;
    el.rows[1].child.option = 'beta';
    await new Promise((resolve) => { setTimeout(resolve, 50); });

    labels = el.shadowRoot.querySelectorAll('.label');
    assert.equal(labels.length, 1);
    assert.equal(labels[0].textContent, 'Two');

    el.showBeta = false;
    el.rows[1].child.option = 'alpha';
    await new Promise((resolve) => { setTimeout(resolve, 50); });

    labels = el.shadowRoot.querySelectorAll('.label');
    assert.equal(labels.length, 3);
    assert.equal(labels[0].textContent, 'One');
    assert.equal(labels[1].textContent, 'Two');
    assert.equal(labels[2].textContent, 'Three');
  });

  it('filters nested rows with proxy flags only', async () => {
    const ProxyNestedFilter = CustomElement
      .extend()
      .observe({
        rows: {
          type: 'proxy',
          value: [],
        },
        showBeta: 'boolean',
      })
      .html`
        <div>
          <div mdw-for="{row of rows}" class="row">
            <span class="label">{row.label}</span>
            <div mdw-for="{child of row.children}" class="child">
              {child.label}
            </div>
          </div>
        </div>
      `
      .register('proxy-nested-filter-test');

    container.innerHTML = '<proxy-nested-filter-test></proxy-nested-filter-test>';
    await customElements.whenDefined('proxy-nested-filter-test');

    /** @type {InstanceType<ProxyNestedFilter>} */
    const el = container.querySelector('proxy-nested-filter-test');

    const rowAChildren = [
      { label: 'A1', option: 'alpha' },
      { label: 'A2', option: 'beta' },
    ];
    const rowBChildren = [
      { label: 'B1', option: 'beta' },
      { label: 'B2', option: 'alpha' },
    ];

    const rowA = {
      label: 'Row A',
      child: { option: 'alpha' },
      children: [...rowAChildren],
    };
    const rowB = {
      label: 'Row B',
      child: { option: 'beta' },
      children: [...rowBChildren],
    };

    el.rows.push(rowA, rowB);

    const applyFilter = (showBeta) => {
      el.showBeta = showBeta;
      const target = showBeta ? rowB : rowA;
      const sourceChildren = showBeta ? rowBChildren : rowAChildren;
      const option = showBeta ? 'beta' : 'alpha';
      const filteredChildren = sourceChildren.filter((child) => child.option === option);
      target.children = filteredChildren;
      el.rows.splice(0, el.rows.length, target);
    };

    applyFilter(false);

    await new Promise((resolve) => { setTimeout(resolve, 50); });

    let labels = el.shadowRoot.querySelectorAll('.label');
    let children = el.shadowRoot.querySelectorAll('.child');
    assert.equal(labels.length, 1);
    assert.equal(children.length, 1);
    assert.equal(labels[0].textContent, 'Row A');
    assert.equal(children[0].textContent.trim(), 'A1');

    applyFilter(true);

    await new Promise((resolve) => { setTimeout(resolve, 50); });

    labels = el.shadowRoot.querySelectorAll('.label');
    children = el.shadowRoot.querySelectorAll('.child');
    assert.equal(labels.length, 1);
    assert.equal(children.length, 1);
    assert.equal(labels[0].textContent, 'Row B');
    assert.equal(children[0].textContent.trim(), 'B1');

    applyFilter(false);

    await new Promise((resolve) => { setTimeout(resolve, 50); });

    labels = el.shadowRoot.querySelectorAll('.label');
    children = el.shadowRoot.querySelectorAll('.child');
    assert.equal(labels.length, 1);
    assert.equal(children.length, 1);
    assert.equal(labels[0].textContent, 'Row A');
    assert.equal(children[0].textContent.trim(), 'A1');
  });

  it('re-renders nested mdw-if when only host prop changes', async () => {
    const ProxyNestedPropFilter = CustomElement
      .extend()
      .observe({
        rows: {
          type: 'proxy',
          value: [],
        },
        showBeta: 'boolean',
      })
      .html`
        <div>
          <div mdw-for="{row of rows}" class="row">
            <span class="beta-attr" data-beta={showBeta}>{showBeta}</span>
            <div mdw-for="{child of row.children}" class="child" mdw-if={showBeta}>
              {child.label}
            </div>
          </div>
        </div>
      `
      .register('proxy-nested-prop-filter-test');

    container.innerHTML = '<proxy-nested-prop-filter-test></proxy-nested-prop-filter-test>';
    await customElements.whenDefined('proxy-nested-prop-filter-test');

    /** @type {InstanceType<ProxyNestedPropFilter>} */
    const el = container.querySelector('proxy-nested-prop-filter-test');
    assert.include(el.composition.props, 'showBeta');

    el.showBeta = true;
    el.rows.push({
      label: 'Row A',
      children: [
        { label: 'A1' },
        { label: 'A2' },
      ],
    });

    await new Promise((resolve) => { setTimeout(resolve, 50); });

    let children = el.shadowRoot.querySelectorAll('.child');
    let betaAttrs = el.shadowRoot.querySelectorAll('.beta-attr');
    assert.equal(children.length, 2);
    assert.equal(children[0].textContent.trim(), 'A1');
    assert.equal(children[1].textContent.trim(), 'A2');
    assert.equal(betaAttrs.length, 1);
    assert.equal(betaAttrs[0].getAttribute('data-beta'), '');
    assert.equal(betaAttrs[0].textContent.trim(), 'true');

    const adapter = el.render.state.adapters[0];
    assert.include(adapter.composition.props, 'showBeta');

    el.showBeta = false;
    await new Promise((resolve) => { setTimeout(resolve, 50); });

    children = el.shadowRoot.querySelectorAll('.child');
    betaAttrs = el.shadowRoot.querySelectorAll('.beta-attr');
    assert.equal(children.length, 0);
    assert.equal(betaAttrs.length, 1);
    assert.equal(betaAttrs[0].getAttribute('data-beta'), null);
    assert.equal(betaAttrs[0].textContent.trim(), '');
  });

});
