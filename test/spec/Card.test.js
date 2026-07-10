import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import '../../components/Card.js';
import { html, leftClickElement } from '../utils.js';

beforeEach(() => document.body.replaceChildren());

/** @return {Promise<void>} */
function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('mdw-card expansion', () => {
  it('hides collapsed expansion content without making the action a disclosure', async () => {
    /** @type {InstanceType<import('../../components/Card.js').default>} */
    const card = html`
      <mdw-card actionable action-label="Open details">
        <span>Summary</span>
        <button slot=expansion id=details>Details</button>
      </mdw-card>
    `;
    await nextTask();
    const details = /** @type {HTMLButtonElement} */ (card.querySelector('#details'));
    const action = /** @type {HTMLElement} */ (card.refs.action);

    assert.isTrue(card._expandable);
    assert.isNull(card.getExpandableAriaElement());
    assert.isFalse(card.hasAttribute('aria-expanded'));
    assert.isFalse(action.hasAttribute('aria-expanded'));
    assert.isTrue(details.inert);
    assert.equal(details.getAttribute('aria-hidden'), 'true');

    card.toggleExpanded(true);

    assert.isFalse(action.hasAttribute('aria-expanded'));
    assert.isFalse(details.inert);
    assert.isFalse(details.hasAttribute('aria-hidden'));
  });

  it('uses the action control for linked card focus and state targeting', () => {
    /** @type {InstanceType<import('../../components/Card.js').default>} */
    const card = html`
      <mdw-card href="/target">
        <span>Linked card</span>
      </mdw-card>
    `;
    const action = /** @type {HTMLElement} */ (card.refs.action);

    assert.equal(card.stateTargetElement, action);

    card.focus();

    assert.equal(document.activeElement, card);
    assert.equal(card.shadowRoot.activeElement, action);
  });

  it('does not expose aria-expanded when there is no actionable target', async () => {
    /** @type {InstanceType<import('../../components/Card.js').default>} */
    const card = html`
      <mdw-card>
        <span>Summary</span>
        <button slot=expansion id=details>Details</button>
      </mdw-card>
    `;
    await nextTask();

    assert.isTrue(card._expandable);
    assert.isNull(card.getExpandableAriaElement());
    assert.isFalse(card.hasAttribute('aria-expanded'));
  });

  it('does not make the card action toggle expansion by default', async () => {
    /** @type {InstanceType<import('../../components/Card.js').default>} */
    const card = html`
      <mdw-card actionable action-label="Open details">
        <span id=summary>Summary</span>
        <button slot=expansion id=details>Details</button>
      </mdw-card>
    `;
    await nextTask();
    const action = /** @type {HTMLElement} */ (card.refs.action);
    const details = /** @type {HTMLButtonElement} */ (card.querySelector('#details'));
    let actionEvents = 0;

    card.addEventListener('action', () => { actionEvents += 1; });

    action.click();

    assert.equal(actionEvents, 1);
    assert.isFalse(card.expanded);
    assert.isTrue(details.inert);
  });

  it('keeps expanded card content interactive', async () => {
    /** @type {InstanceType<import('../../components/Card.js').default>} */
    const card = html`
      <mdw-card expanded>
        <span>Summary</span>
        <button slot=expansion id=details>Details</button>
      </mdw-card>
    `;
    await nextTask();
    const details = /** @type {HTMLButtonElement} */ (card.querySelector('#details'));
    let detailClicks = 0;

    details.addEventListener('click', () => { detailClicks += 1; });

    await leftClickElement(details);

    assert.equal(detailClicks, 1);
  });

  it('keeps expanded content interactive when the card is actionable', async () => {
    /** @type {InstanceType<import('../../components/Card.js').default>} */
    const card = html`
      <mdw-card actionable expanded action-label="Open details">
        <span>Summary</span>
        <button slot=expansion id=details>Details</button>
      </mdw-card>
    `;
    await nextTask();
    const details = /** @type {HTMLButtonElement} */ (card.querySelector('#details'));
    let actionEvents = 0;
    let detailClicks = 0;

    card.addEventListener('action', () => { actionEvents += 1; });
    details.addEventListener('click', () => { detailClicks += 1; });

    await leftClickElement(details);

    assert.equal(detailClicks, 1);
    assert.equal(actionEvents, 0);
  });

  it('sequences expansion after the default slot without forcing a flex wrapper', async () => {
    /** @type {InstanceType<import('../../components/Card.js').default>} */
    const card = html`
      <mdw-card expanded style="display: grid; grid-template-columns: auto auto;">
        <span>Summary</span>
        <span>Metadata</span>
        <button slot=expansion id=details>Details</button>
      </mdw-card>
    `;
    await nextTask();
    const slot = /** @type {HTMLSlotElement} */ (card.refs.slot);
    const expansion = /** @type {HTMLElement} */ (card.refs.expansion);

    assert.equal(getComputedStyle(card).display, 'grid');
    assert.equal(slot.nextElementSibling, expansion);
    assert.equal(getComputedStyle(expansion).display, 'grid');
    assert.equal(getComputedStyle(expansion).gridColumnStart, '1');
    assert.equal(getComputedStyle(expansion).gridColumnEnd, '-1');
  });
});
