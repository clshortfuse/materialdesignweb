import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';
import CompositionAdapter from '../../core/CompositionAdapter.js';

describe('mdw-for adapter mutation tracking', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('avoids text rewrites on sparse swap updates', async () => {
    const SwapSparse = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <span class="cell">{row.label}</span>
          </div>
        </div>
      `
      .register('adapter-mutation-swap-test');

    container.innerHTML = '<adapter-mutation-swap-test></adapter-mutation-swap-test>';
    await customElements.whenDefined('adapter-mutation-swap-test');

    /** @type {InstanceType<SwapSparse>} */
    const el = container.querySelector('adapter-mutation-swap-test');
    el.data = Array.from({ length: 50 }, (_, index) => ({
      id: `row-${index}`,
      label: `row-${index}`,
    }));
    await new Promise((r) => setTimeout(r, 50));

    const mutationCounts = {
      added: 0,
      removed: 0,
      attributes: 0,
      characterData: 0,
    };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        mutationCounts.added += record.addedNodes.length;
        mutationCounts.removed += record.removedNodes.length;
        if (record.type === 'attributes') mutationCounts.attributes += 1;
        if (record.type === 'characterData') mutationCounts.characterData += 1;
      }
    });
    observer.observe(el.shadowRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    const tmp = el.data[10];
    el.data[10] = el.data[40];
    el.data[40] = tmp;
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    assert.equal(mutationCounts.attributes, 0, 'swap should not rewrite attributes');
    assert.equal(mutationCounts.characterData, 0, 'swap should not rewrite text nodes');
  });

  it('produces characterData mutations when text content changes', async () => {
    const TextUpdate = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">
            <span class="cell">{row.label}</span>
          </div>
        </div>
      `
      .register('adapter-mutation-text-update-test');

    container.innerHTML = '<adapter-mutation-text-update-test></adapter-mutation-text-update-test>';
    await customElements.whenDefined('adapter-mutation-text-update-test');

    /** @type {InstanceType<TextUpdate>} */
    const el = container.querySelector('adapter-mutation-text-update-test');
    el.data = [
      { id: 'row-0', label: 'row-0' },
      { id: 'row-1', label: 'row-1' },
    ];
    await new Promise((r) => setTimeout(r, 50));

    const mutationCounts = {
      added: 0,
      removed: 0,
      attributes: 0,
      characterData: 0,
    };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        mutationCounts.added += record.addedNodes.length;
        mutationCounts.removed += record.removedNodes.length;
        if (record.type === 'attributes') mutationCounts.attributes += 1;
        if (record.type === 'characterData') mutationCounts.characterData += 1;
      }
    });
    observer.observe(el.shadowRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    el.data[1].label = 'row-1-updated';
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    assert.isAbove(mutationCounts.characterData, 0, 'text update should trigger characterData mutations');
  });

  it('minimizes DOM writes on head insert with full reassignment', async () => {
    const originalRemove = Node.prototype.remove;
    const originalRemoveChild = Node.prototype.removeChild;
    const originalReplaceChild = Node.prototype.replaceChild;
    const originalReplaceWith = Element.prototype.replaceWith;
    /** @type {Array<string>} */
    const removeStacks = [];
    // eslint-disable-next-line no-extend-native
    Node.prototype.remove = function patchedRemove() {
      const nodeText = this.nodeType === Node.ELEMENT_NODE ? this.textContent : this.nodeValue;
      if (nodeText === 'row-0') {
        const stack = new Error('row-0 remove').stack || '';
        removeStacks.push(stack);
        // eslint-disable-next-line no-console
        console.log('[mdw-for] row-0 remove stack', stack);
      }
      return originalRemove.apply(this, arguments);
    };
    // eslint-disable-next-line no-extend-native
    Node.prototype.removeChild = function patchedRemoveChild(child) {
      const nodeText = child?.nodeType === Node.ELEMENT_NODE ? child.textContent : child?.nodeValue;
      if (nodeText === 'row-0') {
        const stack = new Error('row-0 removeChild').stack || '';
        removeStacks.push(stack);
        // eslint-disable-next-line no-console
        console.log('[mdw-for] row-0 removeChild stack', stack);
      }
      return originalRemoveChild.apply(this, arguments);
    };
    // eslint-disable-next-line no-extend-native
    Node.prototype.replaceChild = function patchedReplaceChild(newChild, oldChild) {
      const nodeText = oldChild?.nodeType === Node.ELEMENT_NODE ? oldChild.textContent : oldChild?.nodeValue;
      if (nodeText === 'row-0') {
        const stack = new Error('row-0 replaceChild').stack || '';
        removeStacks.push(stack);
        // eslint-disable-next-line no-console
        console.log('[mdw-for] row-0 replaceChild stack', stack);
      }
      return originalReplaceChild.apply(this, arguments);
    };
    // eslint-disable-next-line no-extend-native
    Element.prototype.replaceWith = function patchedReplaceWith() {
      const nodeText = this.nodeType === Node.ELEMENT_NODE ? this.textContent : this.nodeValue;
      if (nodeText === 'row-0') {
        const stack = new Error('row-0 replaceWith').stack || '';
        removeStacks.push(stack);
        // eslint-disable-next-line no-console
        console.log('[mdw-for] row-0 replaceWith stack', stack);
      }
      return originalReplaceWith.apply(this, arguments);
    };
    const HeadInsert = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('dom-mutation-head-insert-test');

    container.innerHTML = '<dom-mutation-head-insert-test></dom-mutation-head-insert-test>';
    await customElements.whenDefined('dom-mutation-head-insert-test');

    /** @type {InstanceType<HeadInsert>} */
    const el = container.querySelector('dom-mutation-head-insert-test');

    el.data = Array.from({ length: 200 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const beforeNodes = [...el.shadowRoot.querySelectorAll('.row')];
    const mutationCounts = { added: 0, removed: 0 };
    const mutationNodes = { added: [], removed: [] };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        mutationCounts.added += record.addedNodes.length;
        mutationCounts.removed += record.removedNodes.length;
        for (const node of record.addedNodes) {
          mutationNodes.added.push(node.nodeType === Node.ELEMENT_NODE ? node.textContent : node.nodeValue);
        }
        for (const node of record.removedNodes) {
          mutationNodes.removed.push(node.nodeType === Node.ELEMENT_NODE ? node.textContent : node.nodeValue);
        }
      }
    });
    observer.observe(el.shadowRoot, { childList: true, subtree: true });

    const head = { id: 'row-head' };
    el.data.unshift(head);
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();
    // eslint-disable-next-line no-extend-native
    Node.prototype.remove = originalRemove;
    Node.prototype.removeChild = originalRemoveChild;
    Node.prototype.replaceChild = originalReplaceChild;
    Element.prototype.replaceWith = originalReplaceWith;

    const afterNodes = [...el.shadowRoot.querySelectorAll('.row')];
    assert.equal(afterNodes.length, beforeNodes.length + 1);
    for (let i = 0; i < beforeNodes.length; i += 1) {
      assert.equal(afterNodes[i + 1], beforeNodes[i], 'existing rows should be preserved');
    }
    assert.isAtMost(mutationCounts.removed, 1, 'head insert should minimize removals');
    assert.isAtMost(mutationCounts.added, 2, 'head insert should add minimal nodes');
  });

  it('preserves row nodes and unchanged content on sparse swap patch', async () => {
    const SwapRows = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('dom-mutation-swap-test');

    container.innerHTML = '<dom-mutation-swap-test></dom-mutation-swap-test>';
    await customElements.whenDefined('dom-mutation-swap-test');

    /** @type {InstanceType<SwapRows>} */
    const el = container.querySelector('dom-mutation-swap-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
      { id: 'row-3' },
    ];
    await new Promise((r) => setTimeout(r, 50));

    const beforeNodes = [...el.shadowRoot.querySelectorAll('.row')];
    const beforeText = beforeNodes.map((node) => node.textContent);
    const mutationCounts = {
      added: 0,
      removed: 0,
      attributes: 0,
      characterData: 0,
    };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        mutationCounts.added += record.addedNodes.length;
        mutationCounts.removed += record.removedNodes.length;
        if (record.type === 'attributes') mutationCounts.attributes += 1;
        if (record.type === 'characterData') mutationCounts.characterData += 1;
      }
    });
    observer.observe(el.shadowRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    const tmp = el.data[1];
    el.data[1] = el.data[3];
    el.data[3] = tmp;
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    const afterNodes = [...el.shadowRoot.querySelectorAll('.row')];
    const afterText = afterNodes.map((node) => node.textContent);

    // Same nodes should be reused (just reordered).
    assert.equal(afterNodes.length, beforeNodes.length);
    for (const node of beforeNodes) {
      assert.equal(afterNodes.includes(node), true, 'row node should be preserved');
    }

    // Unchanged rows should keep their content.
    assert.equal(beforeNodes[0], afterNodes[0]);
    assert.equal(beforeText[0], afterText[0]);
    assert.equal(beforeNodes[2], afterNodes[2]);
    assert.equal(beforeText[2], afterText[2]);

    // Ensure no content rewrites occurred; only moves are allowed.
    assert.equal(mutationCounts.attributes, 0, 'swap should not rewrite attributes');
    assert.equal(mutationCounts.characterData, 0, 'swap should not rewrite text nodes');
  });

  it('preserves focus when inserting at head', async () => {
    const HeadInsertFocus = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <button mdw-for="{row of data}" type="button" class="row-btn">{row.id}</button>
        </div>
      `
      .register('head-insert-focus-test');

    container.innerHTML = '<head-insert-focus-test></head-insert-focus-test>';
    await customElements.whenDefined('head-insert-focus-test');

    /** @type {InstanceType<HeadInsertFocus>} */
    const el = container.querySelector('head-insert-focus-test');

    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
    ];
    await new Promise((r) => setTimeout(r, 50));

    const beforeButtons = [...el.shadowRoot.querySelectorAll('.row-btn')];
    beforeButtons[1].focus();
    assert.equal(beforeButtons[1].matches(':focus'), true);

    el.data.unshift({ id: 'row-head' });
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));

    assert.equal(beforeButtons[1].matches(':focus'), true);
  });

  it('adjacent swap uses move-to-end removal path', async () => {
    const originalMoveToEnd = CompositionAdapter.prototype.moveToEndByIndex;
    /** @type {Array<number>} */
    const moveCalls = [];
    CompositionAdapter.prototype.moveToEndByIndex = function patchedMoveToEnd(index) {
      moveCalls.push(index);
      return originalMoveToEnd.call(this, index);
    };

    const AdjacentSwap = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('adjacent-swap-move-test');

    container.innerHTML = '<adjacent-swap-move-test></adjacent-swap-move-test>';
    await customElements.whenDefined('adjacent-swap-move-test');

    /** @type {InstanceType<AdjacentSwap>} */
    const el = container.querySelector('adjacent-swap-move-test');
    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
      { id: 'row-3' },
    ];
    await new Promise((r) => setTimeout(r, 50));

    const tmp = el.data[2];
    el.data[2] = el.data[3];
    el.data[3] = tmp;
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));

    CompositionAdapter.prototype.moveToEndByIndex = originalMoveToEnd;
    assert.equal(moveCalls.length > 0, true, 'moveToEndByIndex should be used');
  });

  it('adjacent swap mutation budget stays small', async () => {
    const AdjacentSwapMutations = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('adjacent-swap-mutations-test');

    container.innerHTML = '<adjacent-swap-mutations-test></adjacent-swap-mutations-test>';
    await customElements.whenDefined('adjacent-swap-mutations-test');

    /** @type {InstanceType<AdjacentSwapMutations>} */
    const el = container.querySelector('adjacent-swap-mutations-test');
    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
      { id: 'row-3' },
    ];
    await new Promise((r) => setTimeout(r, 50));

    const mutationCounts = { added: 0, removed: 0 };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        mutationCounts.added += record.addedNodes.length;
        mutationCounts.removed += record.removedNodes.length;
      }
    });
    observer.observe(el.shadowRoot, { childList: true, subtree: true });

    const tmp = el.data[2];
    el.data[2] = el.data[3];
    el.data[3] = tmp;
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    assert.isAtMost(mutationCounts.added, 4, 'adjacent swap should add minimal nodes');
    assert.isAtMost(mutationCounts.removed, 4, 'adjacent swap should remove minimal nodes');
  });

  it('head insert avoids characterData rewrites for existing rows', async () => {
    const HeadInsertNoRewrite = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('head-insert-no-rewrite-test');

    container.innerHTML = '<head-insert-no-rewrite-test></head-insert-no-rewrite-test>';
    await customElements.whenDefined('head-insert-no-rewrite-test');

    /** @type {InstanceType<HeadInsertNoRewrite>} */
    const el = container.querySelector('head-insert-no-rewrite-test');
    el.data = Array.from({ length: 20 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const mutationCounts = { characterData: 0 };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'characterData') mutationCounts.characterData += 1;
      }
    });
    observer.observe(el.shadowRoot, { characterData: true, subtree: true });

    el.data.unshift({ id: 'row-head' });
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    assert.equal(mutationCounts.characterData, 0, 'head insert should not rewrite text nodes');
  });

  it('adjacent swap avoids characterData rewrites', async () => {
    const AdjacentSwapNoRewrite = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('adjacent-swap-no-rewrite-test');

    container.innerHTML = '<adjacent-swap-no-rewrite-test></adjacent-swap-no-rewrite-test>';
    await customElements.whenDefined('adjacent-swap-no-rewrite-test');

    /** @type {InstanceType<AdjacentSwapNoRewrite>} */
    const el = container.querySelector('adjacent-swap-no-rewrite-test');
    el.data = [
      { id: 'row-0' },
      { id: 'row-1' },
      { id: 'row-2' },
      { id: 'row-3' },
    ];
    await new Promise((r) => setTimeout(r, 50));

    const mutationCounts = { characterData: 0 };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'characterData') mutationCounts.characterData += 1;
      }
    });
    observer.observe(el.shadowRoot, { characterData: true, subtree: true });

    const tmp = el.data[2];
    el.data[2] = el.data[3];
    el.data[3] = tmp;
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    assert.equal(mutationCounts.characterData, 0, 'adjacent swap should not rewrite text nodes');
  });

  it('preserves nodes on middle insert with full reassignment', async () => {
    const MiddleInsert = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('middle-insert-test');

    container.innerHTML = '<middle-insert-test></middle-insert-test>';
    await customElements.whenDefined('middle-insert-test');

    /** @type {InstanceType<MiddleInsert>} */
    const el = container.querySelector('middle-insert-test');
    el.data = Array.from({ length: 10 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const beforeNodes = [...el.shadowRoot.querySelectorAll('.row')];
    const mutationCounts = { added: 0, removed: 0 };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        mutationCounts.added += record.addedNodes.length;
        mutationCounts.removed += record.removedNodes.length;
      }
    });
    observer.observe(el.shadowRoot, { childList: true, subtree: true });

    el.data.splice(4, 0, { id: 'row-mid' });
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    const afterNodes = [...el.shadowRoot.querySelectorAll('.row')];
    assert.equal(afterNodes.length, beforeNodes.length + 1);
    for (let i = 0; i < beforeNodes.length; i += 1) {
      const expectedIndex = i >= 4 ? i + 1 : i;
      assert.equal(afterNodes[expectedIndex], beforeNodes[i]);
    }
    assert.isAtMost(mutationCounts.removed, 1);
  });

  it('preserves nodes on middle remove with full reassignment', async () => {
    const MiddleRemove = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('middle-remove-test');

    container.innerHTML = '<middle-remove-test></middle-remove-test>';
    await customElements.whenDefined('middle-remove-test');

    /** @type {InstanceType<MiddleRemove>} */
    const el = container.querySelector('middle-remove-test');
    el.data = Array.from({ length: 10 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const beforeNodes = [...el.shadowRoot.querySelectorAll('.row')];
    const mutationCounts = { removed: 0, characterData: 0 };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        mutationCounts.removed += record.removedNodes.length;
        if (record.type === 'characterData') mutationCounts.characterData += 1;
      }
    });
    observer.observe(el.shadowRoot, { childList: true, subtree: true, characterData: true });

    el.data.splice(4, 1);
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    const afterNodes = [...el.shadowRoot.querySelectorAll('.row')];
    assert.equal(afterNodes.length, beforeNodes.length - 1);
    for (let i = 0; i < afterNodes.length; i += 1) {
      const expectedIndex = i >= 4 ? i + 1 : i;
      assert.equal(afterNodes[i], beforeNodes[expectedIndex]);
    }
    assert.isAtMost(mutationCounts.characterData, 0);
    assert.isAtMost(mutationCounts.removed, 2);
  });

  it('minimizes mutations on tail insert', async () => {
    const TailInsert = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('tail-insert-test');

    container.innerHTML = '<tail-insert-test></tail-insert-test>';
    await customElements.whenDefined('tail-insert-test');

    /** @type {InstanceType<TailInsert>} */
    const el = container.querySelector('tail-insert-test');
    el.data = Array.from({ length: 5 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const beforeNodes = [...el.shadowRoot.querySelectorAll('.row')];
    const mutationCounts = { added: 0, removed: 0, characterData: 0 };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        mutationCounts.added += record.addedNodes.length;
        mutationCounts.removed += record.removedNodes.length;
        if (record.type === 'characterData') mutationCounts.characterData += 1;
      }
    });
    observer.observe(el.shadowRoot, { childList: true, subtree: true, characterData: true });

    el.data.push({ id: 'row-tail' });
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    const afterNodes = [...el.shadowRoot.querySelectorAll('.row')];
    assert.equal(afterNodes.length, beforeNodes.length + 1);
    for (let i = 0; i < beforeNodes.length; i += 1) {
      assert.equal(afterNodes[i], beforeNodes[i]);
    }
    assert.isAtMost(mutationCounts.added, 2);
    assert.isAtMost(mutationCounts.removed, 1);
    assert.equal(mutationCounts.characterData, 0);
  });

  it('preserves nodes on non-adjacent swap', async () => {
    const NonAdjacentSwap = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('non-adjacent-swap-test');

    container.innerHTML = '<non-adjacent-swap-test></non-adjacent-swap-test>';
    await customElements.whenDefined('non-adjacent-swap-test');

    /** @type {InstanceType<NonAdjacentSwap>} */
    const el = container.querySelector('non-adjacent-swap-test');
    el.data = Array.from({ length: 8 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const beforeNodes = [...el.shadowRoot.querySelectorAll('.row')];
    const mutationCounts = { characterData: 0 };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'characterData') mutationCounts.characterData += 1;
      }
    });
    observer.observe(el.shadowRoot, { characterData: true, subtree: true });

    const tmp = el.data[1];
    el.data[1] = el.data[6];
    el.data[6] = tmp;
    el.data = el.data;
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    const afterNodes = [...el.shadowRoot.querySelectorAll('.row')];
    assert.equal(afterNodes.length, beforeNodes.length);
    for (const node of beforeNodes) {
      assert.equal(afterNodes.includes(node), true);
    }
    assert.equal(mutationCounts.characterData, 0);
  });

  it('keeps nested mdw-for stable under filter toggles with varying child lengths', async () => {
    const FilterNested = CustomElement
      .extend()
      .observe({
        items: { type: 'array', value: [] },
        showEven: { type: 'boolean', value: true },
      })
      .expressions({
        filtered({ items, showEven }) {
          return items.filter((item, index) => (showEven ? index % 2 === 0 : index % 2 === 1));
        },
      })
      .html`
        <div>
          <div mdw-for="{item of filtered}" class="Outer">
            <div mdw-for="{child of item.children}" class="Inner">{child}</div>
          </div>
        </div>
      `
      .register('nested-filter-toggle-test');

    container.innerHTML = '<nested-filter-toggle-test></nested-filter-toggle-test>';
    await customElements.whenDefined('nested-filter-toggle-test');

    /** @type {InstanceType<FilterNested>} */
    const el = container.querySelector('nested-filter-toggle-test');
    el.items = [
      { id: 'i0', children: ['a', 'b'] },
      { id: 'i1', children: ['c'] },
      { id: 'i2', children: ['d', 'e', 'f'] },
      { id: 'i3', children: [] },
    ];
    await new Promise((r) => setTimeout(r, 50));

    const initialNodes = [...el.shadowRoot.querySelectorAll('.Inner')];
    el.showEven = false;
    await new Promise((r) => setTimeout(r, 50));
    el.showEven = true;
    await new Promise((r) => setTimeout(r, 50));

    const afterNodes = [...el.shadowRoot.querySelectorAll('.Inner')];
    assert.equal(afterNodes.length, initialNodes.length);
  });

  it('updates text when data object changes with same id', async () => {
    const SameKeyUpdate = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.label}</div>
        </div>
      `
      .register('same-key-update-test');

    container.innerHTML = '<same-key-update-test></same-key-update-test>';
    await customElements.whenDefined('same-key-update-test');

    /** @type {InstanceType<SameKeyUpdate>} */
    const el = container.querySelector('same-key-update-test');
    el.data = [
      { id: 'row-0', label: 'A' },
      { id: 'row-1', label: 'B' },
    ];
    await new Promise((r) => setTimeout(r, 50));

    const observerCounts = { characterData: 0, added: 0, removed: 0 };
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        observerCounts.added += record.addedNodes.length;
        observerCounts.removed += record.removedNodes.length;
        if (record.type === 'characterData') observerCounts.characterData += 1;
      }
    });
    observer.observe(el.shadowRoot, { childList: true, characterData: true, subtree: true });

    el.data = [
      { id: 'row-0', label: 'A+' },
      { id: 'row-1', label: 'B+' },
    ];
    await new Promise((r) => setTimeout(r, 50));
    observer.disconnect();

    const cells = [...el.shadowRoot.querySelectorAll('.row')].map((node) => node.textContent.trim());
    assert.includeMembers(cells, ['A+', 'B+']);
    assert.isAbove(
      observerCounts.characterData + observerCounts.added + observerCounts.removed,
      0,
      'text update should cause either characterData or node replacement mutations',
    );
  });

  it('clears and restores rows without leaking nodes', async () => {
    const ClearRefill = CustomElement
      .extend()
      .observe({
        data: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{row of data}" class="row">{row.id}</div>
        </div>
      `
      .register('clear-refill-test');

    container.innerHTML = '<clear-refill-test></clear-refill-test>';
    await customElements.whenDefined('clear-refill-test');

    /** @type {InstanceType<ClearRefill>} */
    const el = container.querySelector('clear-refill-test');
    el.data = Array.from({ length: 5 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const beforeNodes = [...el.shadowRoot.querySelectorAll('.row')];
    el.data = [];
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(el.shadowRoot.querySelectorAll('.row').length, 0);

    el.data = Array.from({ length: 5 }, (_, index) => ({ id: `row-${index}` }));
    await new Promise((r) => setTimeout(r, 50));

    const afterNodes = [...el.shadowRoot.querySelectorAll('.row')];
    assert.equal(afterNodes.length, 5);
    assert.equal(afterNodes.some((node) => beforeNodes.includes(node)), false);
  });
});
