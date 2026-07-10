import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';
import ExpandableMixin from '../../mixins/ExpandableMixin.js';

const ExpandableTestElement = CustomElement
  .extend()
  .mixin(ExpandableMixin)
  .html`
    <slot id=slot></slot>
    <div id=expansion>
      <slot id=expansion-slot name=expansion></slot>
    </div>
  `
  .autoRegister('mdw-expandable-test');

const GuardedExpandableTestElement = CustomElement
  .extend()
  .mixin(ExpandableMixin)
  .overrides({
    canCollapseExpansion() { return false; },
    shouldAutoExpandExpansion() { return this.hasAttribute('auto-expand'); },
  })
  .html`
    <slot id=slot></slot>
    <div id=expansion>
      <slot id=expansion-slot name=expansion></slot>
    </div>
  `
  .autoRegister('mdw-guarded-expandable-test');

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * @param {string} content
 * @return {InstanceType<ExpandableTestElement>}
 */
function createExpandableTestElement(content) {
  const element = new ExpandableTestElement();
  element.innerHTML = content;
  document.body.append(element);
  return element;
}

describe('ExpandableMixin', () => {
  it('preserves expanded when content is appended after connection in the same turn', async () => {
    /** @type {InstanceType<ExpandableTestElement>} */
    const element = new ExpandableTestElement();
    element.expanded = true;
    document.body.append(element);

    const details = document.createElement('button');
    details.slot = 'expansion';
    details.textContent = 'Details';
    element.append(details);
    await nextTask();

    assert.isTrue(element._expandable);
    assert.isTrue(element.expanded);
    assert.equal(element.getAttribute('aria-expanded'), 'true');
    assert.isFalse(details.inert);
  });

  it('marks expansion content inert and hidden while collapsed', async () => {
    /** @type {InstanceType<ExpandableTestElement>} */
    const element = createExpandableTestElement(`
      <span>Main</span>
      <button slot=expansion id=details>Details</button>
    `);
    await nextTask();
    const details = /** @type {HTMLButtonElement} */ (element.querySelector('#details'));

    assert.isTrue(element._expandable);
    assert.isFalse(element.expanded);
    assert.equal(element.getAttribute('aria-expanded'), 'false');
    assert.isTrue(element.refs.expansion.inert);
    assert.equal(element.refs.expansion.getAttribute('aria-hidden'), 'true');
    assert.isTrue(details.inert);
    assert.equal(details.getAttribute('aria-hidden'), 'true');
  });

  it('toggles expanded state, aria-expanded, inert, and events', async () => {
    /** @type {InstanceType<ExpandableTestElement>} */
    const element = createExpandableTestElement(`
      <span>Main</span>
      <button slot=expansion id=details>Details</button>
    `);
    await nextTask();
    const details = /** @type {HTMLButtonElement} */ (element.querySelector('#details'));
    let expandedEvents = 0;

    element.addEventListener('mdw-expandable-test:expandedchange', () => { expandedEvents += 1; });

    element.toggleExpanded();

    assert.isTrue(element.expanded);
    assert.equal(element.getAttribute('aria-expanded'), 'true');
    assert.isFalse(element.refs.expansion.inert);
    assert.isFalse(element.refs.expansion.hasAttribute('aria-hidden'));
    assert.isFalse(details.inert);
    assert.isFalse(details.hasAttribute('aria-hidden'));
    assert.equal(expandedEvents, 1);

    element.toggleExpanded(false);

    assert.isFalse(element.expanded);
    assert.equal(element.getAttribute('aria-expanded'), 'false');
    assert.isTrue(element.refs.expansion.inert);
    assert.equal(element.refs.expansion.getAttribute('aria-hidden'), 'true');
    assert.isTrue(details.inert);
    assert.equal(details.getAttribute('aria-hidden'), 'true');
    assert.equal(expandedEvents, 2);
  });

  it('restores author-provided expansion visibility state', async () => {
    /** @type {InstanceType<ExpandableTestElement>} */
    const element = createExpandableTestElement(`
      <button slot=expansion id=details inert aria-hidden=false>Details</button>
    `);
    await nextTask();
    const details = /** @type {HTMLButtonElement} */ (element.querySelector('#details'));

    assert.isTrue(details.inert);
    assert.equal(details.getAttribute('aria-hidden'), 'true');

    element.toggleExpanded(true);

    assert.isTrue(details.inert);
    assert.equal(details.getAttribute('aria-hidden'), 'false');
  });

  it('restores managed expansion content when disconnected', async () => {
    /** @type {InstanceType<ExpandableTestElement>} */
    const element = createExpandableTestElement(`
      <button slot=expansion id=details>Details</button>
    `);
    await nextTask();
    const details = /** @type {HTMLButtonElement} */ (element.querySelector('#details'));

    assert.isTrue(details.inert);
    assert.equal(details.getAttribute('aria-hidden'), 'true');

    element.remove();

    assert.isFalse(details.inert);
    assert.isFalse(details.hasAttribute('aria-hidden'));
  });

  it('refreshes expandable state when expansion children are added and removed', async () => {
    /** @type {InstanceType<ExpandableTestElement>} */
    const element = createExpandableTestElement('<span>Main</span>');
    await nextTask();

    assert.isFalse(element._expandable);
    assert.isFalse(element.hasAttribute('aria-expanded'));

    const details = document.createElement('button');
    details.id = 'details';
    details.slot = 'expansion';
    details.textContent = 'Details';
    element.append(details);
    await nextTask();

    assert.isTrue(element._expandable);
    assert.equal(element.getAttribute('aria-expanded'), 'false');
    assert.isTrue(details.inert);
    assert.equal(details.getAttribute('aria-hidden'), 'true');

    element.expanded = true;
    element.removeChild(details);
    await nextTask();

    assert.isFalse(element._expandable);
    assert.isFalse(element.expanded);
    assert.isFalse(element.hasAttribute('aria-expanded'));
    assert.isFalse(details.inert);
    assert.isFalse(details.hasAttribute('aria-hidden'));
  });

  it('refreshes expandable state when child slot attributes change', async () => {
    /** @type {InstanceType<ExpandableTestElement>} */
    const element = createExpandableTestElement('<button id=details>Details</button>');
    await nextTask();
    const details = /** @type {HTMLButtonElement} */ (element.querySelector('#details'));

    assert.isFalse(element._expandable);

    details.slot = 'expansion';
    await nextTask();

    assert.isTrue(element._expandable);
    assert.equal(element.getAttribute('aria-expanded'), 'false');
    assert.isTrue(details.inert);
    assert.equal(details.getAttribute('aria-hidden'), 'true');

    element.expanded = true;
    details.removeAttribute('slot');
    await nextTask();

    assert.isFalse(element._expandable);
    assert.isFalse(element.expanded);
    assert.isFalse(element.hasAttribute('aria-expanded'));
    assert.isFalse(details.inert);
    assert.isFalse(details.hasAttribute('aria-hidden'));
  });

  it('honors auto-expand and collapse guards from overrides', async () => {
    /** @type {InstanceType<GuardedExpandableTestElement>} */
    const element = new GuardedExpandableTestElement();
    element.setAttribute('auto-expand', '');
    element.innerHTML = '<button slot=expansion id=details>Details</button>';
    document.body.append(element);
    await nextTask();

    assert.isTrue(element._expandable);
    assert.isTrue(element.expanded);
    assert.equal(element.getAttribute('aria-expanded'), 'true');

    element.toggleExpanded(false);

    assert.isTrue(element.expanded);
    assert.equal(element.getAttribute('aria-expanded'), 'true');
  });
});
