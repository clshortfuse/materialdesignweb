import { assert } from '@esm-bundle/chai';
import { resetMouse, sendMouse } from '@web/test-runner-commands';

import '../../loaders/theme.js';
import List from '../../components/List.js';
import ListItem from '../../components/ListItem.js';
import '../../components/ListTree.js';
import { html, leftClickElement, makeFromConstructor, makeFromString, makeFromTagName } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('mdw-list', () => {
  it('can be created through each supported construction path', () => {
    assert.equal(makeFromTagName('mdw-list').localName, 'mdw-list');
    assert.equal(makeFromConstructor(List).localName, 'mdw-list');
    assert.equal(makeFromString('<mdw-list></mdw-list>').localName, 'mdw-list');
  });

  it('keeps direct rows linear and exposes no grid mode', async () => {
    /** @type {InstanceType<List>} */
    const list = html`
      <mdw-list multi-action role=tree>
        <mdw-list-item role=option>Alpha</mdw-list-item>
      </mdw-list>
    `;
    await nextTask();
    const item = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);

    assert.equal(list._listRole, 'list');
    assert.equal(list._ariaRole, 'list');
    assert.equal(list.readAriaProperty('role'), 'list');
    assert.equal(list.getAttribute('role'), 'list');
    assert.equal(item._ariaRole, 'listitem');
    assert.equal(item.readAriaProperty('role'), 'listitem');
    assert.equal(item.getAttribute('role'), 'listitem');
    assert.notProperty(item, '_treeItem');
    assert.notProperty(list, 'multiAction');
    assert.notProperty(list, '_syncListItemRoles');
    assert.notProperty(list, '_gridRows');
    assert.notProperty(item, '_isGridRow');
    assert.isFalse(item.refs.primaryCell.hasAttribute('role'));
    assert.isFalse(item.refs.actionsCell.hasAttribute('role'));
    assert.isFalse(item.refs.expansionCell.hasAttribute('role'));

    list.setAttribute('role', 'grid');

    assert.equal(list.readAriaProperty('role'), 'list');
    assert.equal(list.getAttribute('role'), 'list');
  });

  it('does not infer tree ownership from nested expansion content', async () => {
    /** @type {InstanceType<List>} */
    const list = html`
      <mdw-list>
        <mdw-list-item>
          Parent
          <mdw-list-tree slot=expansion>
            <mdw-list-tree-item>Child</mdw-list-tree-item>
          </mdw-list-tree>
        </mdw-list-item>
      </mdw-list>
    `;
    await nextTask();
    const parent = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const tree = /** @type {InstanceType<ListTree>} */ (parent.querySelector('mdw-list-tree'));

    assert.equal(parent._ariaRole, 'listitem');
    assert.equal(tree._listRole, 'tree');
  });
});

describe('mdw-list-item', () => {
  it('can be created through each supported construction path', () => {
    assert.equal(makeFromTagName('mdw-list-item').localName, 'mdw-list-item');
    assert.equal(makeFromConstructor(ListItem).localName, 'mdw-list-item');
    assert.equal(makeFromString('<mdw-list-item></mdw-list-item>').localName, 'mdw-list-item');
  });

  it('dispatches one action for its actionable primary command', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`<mdw-list-item actionable>Run task</mdw-list-item>`;
    await nextTask();
    let activations = 0;
    item.addEventListener('action', () => { activations += 1; });

    item.refs.primaryAction.click();

    assert.equal(activations, 1);
  });

  it('suppresses actionable activation while disabled', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`<mdw-list-item actionable disabled>Run task</mdw-list-item>`;
    await nextTask();
    let activations = 0;
    item.addEventListener('action', () => { activations += 1; });

    item.refs.primaryAction.click();

    assert.equal(activations, 0);
  });

  it('keeps primary, trailing, and disclosure actions independent', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`
      <mdw-list-item actionable>
        Parent
        <button slot=trailing-action>More</button>
        <div slot=expansion>Details</div>
      </mdw-list-item>
    `;
    await nextTask();
    const trailing = /** @type {HTMLButtonElement} */ (item.querySelector('button'));
    let activations = 0;
    let disclosureClicks = 0;
    let trailingClicks = 0;
    item.addEventListener('action', () => { activations += 1; });
    item.addEventListener('click', (event) => {
      if (event.composedPath()[0] === trailing) {
        trailingClicks += 1;
      }
      if (event.composedPath().includes(item.refs.expansionAction)) {
        disclosureClicks += 1;
      }
    });

    await leftClickElement(trailing);
    assert.equal(trailingClicks, 1);
    assert.isNull(item._lastRipple);
    assert.isFalse(item.pressedState);
    await leftClickElement(item.refs.expansionAction);
    assert.equal(disclosureClicks, 1);
    assert.isNull(item._lastRipple);
    assert.isFalse(item.pressedState);
    await leftClickElement(item.refs.primaryAction);

    assert.equal(activations, 1);
    assert.isNotNull(item._lastRipple);
    assert.isTrue(item.expanded);
  });

  it('keeps sub-action pointer feedback out of the primary state layer', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`
      <mdw-list-item actionable>
        Parent
        <button slot=trailing-action>More</button>
        <div slot=expansion>Details</div>
      </mdw-list-item>
    `;
    await nextTask();
    const trailing = /** @type {HTMLButtonElement} */ (item.querySelector('button'));

    /** @param {HTMLElement} action */
    const assertSubActionFeedback = async (action) => {
      const rect = action.getBoundingClientRect();
      await sendMouse({
        type: 'move',
        position: [
          Math.floor(rect.left + (rect.width / 2)),
          Math.floor(rect.top + (rect.height / 2)),
        ],
      });

      assert.isFalse(item.hoveredState);
      assert.isFalse(item.refs.state.hasAttribute('hovered'));

      await sendMouse({ type: 'down', button: 'left' });

      assert.isFalse(item.pressedState);
      assert.isFalse(item.refs.state.hasAttribute('pressed'));
      assert.isNull(item._lastRipple);

      await sendMouse({ type: 'up', button: 'left' });

      assert.isFalse(item._focused);
      assert.isFalse(item.refs.state.hasAttribute('focused'));
    };

    try {
      await assertSubActionFeedback(trailing);
      await assertSubActionFeedback(item.refs.expansionAction);
    } finally {
      await sendMouse({ type: 'up', button: 'left' });
      await resetMouse();
    }
  });

  it('isolates a disclosure primary cell from its trailing action feedback', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`
      <mdw-list-item>
        Parent
        <span slot=trailing-action>More</span>
        <div slot=expansion>Details</div>
      </mdw-list-item>
    `;
    await nextTask();
    const trailing = /** @type {HTMLElement} */ (item.querySelector('[slot="trailing-action"]'));

    await leftClickElement(trailing);

    assert.isNull(item._lastRipple);
    assert.isFalse(item.pressedState);
    assert.isFalse(item.expanded);

    await leftClickElement(item.refs.primaryInteraction);

    assert.isNotNull(item._lastRipple);
    assert.isTrue(item.expanded);
  });

  it('treats default-slot presentation as primary-cell content', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`
      <mdw-list-item>
        <span id=label>Parent</span>
        <div slot=expansion>Details</div>
      </mdw-list-item>
    `;
    await nextTask();
    const label = /** @type {HTMLElement} */ (item.querySelector('#label'));
    await leftClickElement(label);

    assert.isTrue(item.expanded);
  });

  it('reactively binds ordinary disclosure primary-cell semantics', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`
      <mdw-list-item>
        Parent
        <div slot=expansion>Details</div>
      </mdw-list-item>
    `;
    await nextTask();
    const primaryCell = item.refs.primaryCell;

    assert.equal(primaryCell.getAttribute('role'), 'button');
    assert.equal(primaryCell.getAttribute('tabindex'), '0');
    assert.equal(primaryCell.getAttribute('aria-controls'), 'expansion');
    assert.isFalse(primaryCell.hasAttribute('aria-disabled'));

    let keydowns = 0;
    item.addEventListener('keydown', () => { keydowns += 1; });
    const keydown = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      key: 'Enter',
    });
    primaryCell.dispatchEvent(keydown);

    assert.isTrue(keydown.defaultPrevented);
    assert.equal(keydowns, 1);
    assert.isTrue(item.expanded);

    item.disabled = true;

    assert.isFalse(primaryCell.hasAttribute('tabindex'));
    assert.equal(primaryCell.getAttribute('aria-disabled'), 'true');

    item.disabled = false;
    item.actionable = true;

    assert.isFalse(primaryCell.hasAttribute('role'));
    assert.isFalse(primaryCell.hasAttribute('tabindex'));
    assert.isFalse(primaryCell.hasAttribute('aria-controls'));
    assert.isFalse(primaryCell.hasAttribute('aria-disabled'));

    item.actionable = false;

    assert.equal(primaryCell.getAttribute('role'), 'button');
    assert.equal(primaryCell.getAttribute('tabindex'), '0');
    assert.equal(primaryCell.getAttribute('aria-controls'), 'expansion');
  });

  it('routes disclosure primary-cell focus and blur through primary feedback', async () => {
    /** @type {InstanceType<ListItem>} */
    const item = html`
      <mdw-list-item>
        Parent
        <div slot=expansion>Details</div>
      </mdw-list-item>
    `;
    const after = document.createElement('button');
    document.body.append(after);
    await nextTask();

    item.refs.primaryCell.focus();

    assert.isTrue(item._focused);
    assert.isTrue(item.refs.state.hasAttribute('focused'));

    item._keyPressed = true;
    after.focus();

    assert.isFalse(item._focused);
    assert.isFalse(item._keyPressed);
    assert.isFalse(item.refs.state.hasAttribute('focused'));
    assert.isFalse(item.refs.state.hasAttribute('pressed'));
  });

  it('keeps a linked item anchor as its primary action', async () => {
    /** @type {InstanceType<List>} */
    const list = html`<mdw-list><mdw-list-item href=/details>Details</mdw-list-item></mdw-list>`;
    await nextTask();
    const item = /** @type {InstanceType<ListItem>} */ (list.firstElementChild);
    const after = document.createElement('button');
    document.body.append(after);

    assert.equal(item.stateTargetElement, item.refs.anchor);
    assert.equal(item.refs.anchor.getAttribute('href'), '/details');

    item.focus();

    assert.isTrue(document.activeElement === item);
    assert.isTrue(item._focused);
    assert.isTrue(item.refs.state.hasAttribute('focused'));

    after.focus();

    assert.isFalse(item._focused);
    assert.isFalse(item.refs.state.hasAttribute('focused'));
  });
});
